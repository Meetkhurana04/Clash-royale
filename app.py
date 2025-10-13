# app.py
"""
Flask + Flask-SocketIO backend for a simple real-time 1v1 game room system.
Features:
 - create/join/leave rooms
 - broadcast spawn events (server validates and applies coordinate transform so frontends can mirror)
 - per-room state (players list, game settings, last_spawns)
 - simple anti-spam spawn rate limiting per player
 - cleaning empty rooms
 - works with eventlet or gevent (recommended)

Install:
 pip install flask flask-socketio eventlet

Run (dev):
 python app.py

Notes:
 - This file assumes a canonical canvas size (CANVAS_WIDTH, CANVAS_HEIGHT).
 - Frontends should use the same canonical sizes or request them from server.
 - Event names and payload shapes are documented inline.
"""

import time
import threading
import uuid
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms as socket_rooms

# --- Configuration ---
CANVAS_WIDTH = 480    # canonical width used to mirror coordinates
CANVAS_HEIGHT = 720   # canonical height used to mirror coordinates
PLAYERSIZE = 120      # canonical playersize for flip calculations (must match client)
SPAWN_COOLDOWN_SEC = 0.5  # per-player spawn cooldown (to avoid spam)

# socketio init
app = Flask(__name__)
app.config['SECRET_KEY'] = 'replace-with-secure-secret-in-prod'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False, engineio_logger=False)

# --- Room & player models ---
@dataclass
class PlayerMeta:
    sid: str                   # socket session id
    name: str                  # display name
    joined_at: float = field(default_factory=time.time)
    last_spawn_ts: float = 0.0 # rate-limit timestamp

@dataclass
class RoomState:
    id: str
    host_sid: Optional[str] = None
    created_at: float = field(default_factory=time.time)
    players: Dict[str, PlayerMeta] = field(default_factory=dict)  # sid -> meta
    game_started: bool = False
    ai_mode: bool = False    # default false; server enforces ai off for multiplayer
    last_spawns: List[dict] = field(default_factory=list)   # recent spawn events
    lock: threading.Lock = field(default_factory=threading.Lock)

# in-memory store (for simple deployments). Swap to redis for multi-process/multi-server.
rooms: Dict[str, RoomState] = {}

# --- Utilities ---
def make_room_id() -> str:
    return uuid.uuid4().hex[:8]

def create_room(host_sid: str, host_name: str) -> RoomState:
    rid = make_room_id()
    room = RoomState(id=rid, host_sid=host_sid)
    room.players[host_sid] = PlayerMeta(sid=host_sid, name=host_name)
    rooms[rid] = room
    app.logger.info(f"[rooms] created {rid} by {host_name} ({host_sid})")
    return room

def get_room(rid: str) -> Optional[RoomState]:
    return rooms.get(rid)

def cleanup_room_if_empty(rid: str):
    room = get_room(rid)
    if not room:
        return
    if len(room.players) == 0:
        app.logger.info(f"[rooms] cleaning empty room {rid}")
        try:
            del rooms[rid]
        except KeyError:
            pass

def canonical_mirror_coords(x: float, y: float) -> (float, float):
    """
    Mirror coordinates vertically so that if player A spawns at (x,y),
    opponent receives a mirrored spawn that appears relative to their bottom-half.
    Formula: newY = CANVAS_HEIGHT - y - PLAYERSIZE
    Note: Frontend MUST use same CANVAS_WIDTH/CANVAS_HEIGHT/PLAYERSIZE or request these.
    """
    new_x = x  # horizontally same (you can add lane mapping if needed)
    new_y = CANVAS_HEIGHT - y - PLAYERSIZE
    # clamp for safety
    new_x = max(0, min(new_x, CANVAS_WIDTH - PLAYERSIZE))
    new_y = max(0, min(new_y, CANVAS_HEIGHT - PLAYERSIZE))
    return new_x, new_y

# --- REST endpoints (lightweight) ---
@app.route("/api/rooms", methods=["GET"])
def list_rooms():
    # returns list of room metadata (non-sensitive)
    out = []
    for r in rooms.values():
        out.append({
            "id": r.id,
            "players": len(r.players),
            "created_at": r.created_at,
            "game_started": r.game_started
        })
    return jsonify(out)

@app.route("/api/room/<rid>", methods=["GET"])
def room_info(rid):
    r = get_room(rid)
    if not r:
        return jsonify({"error": "room not found"}), 404
    return jsonify({
        "id": r.id,
        "players": [{ "sid": p.sid, "name": p.name } for p in r.players.values()],
        "game_started": r.game_started,
        "ai_mode": r.ai_mode
    })

# --- SocketIO events ---
@socketio.on("connect")
def on_connect():
    sid = request.sid
    app.logger.info(f"[socket] connect {sid}")
    emit("connected", {"sid": sid})

@socketio.on("disconnect")
def on_disconnect():
    sid = request.sid
    app.logger.info(f"[socket] disconnect {sid}")
    # remove player from any rooms they were in
    # copy list for safe iteration
    for rid in list(rooms.keys()):
        room = rooms.get(rid)
        if not room:
            continue
        with room.lock:
            if sid in room.players:
                pname = room.players[sid].name
                del room.players[sid]
                leave_room(rid, sid=sid)
                app.logger.info(f"[rooms] {pname} left {rid} (disconnect)")
                # notify remaining members
                socketio.emit("player_left", {"sid": sid, "name": pname}, room=rid)
        cleanup_room_if_empty(rid)

@socketio.on("create_room")
def on_create_room(data):
    """
    Client emits:
     { name: "playerName" }
    Server responds with:
     { ok: True, room_id: "abc123", players: [...], settings: {...} }
    """
    sid = request.sid
    name = (data or {}).get("name", "Player")
    room = create_room(sid, name)
    join_room(room.id)
    emit("room_created", {
        "room_id": room.id,
        "players": [{ "sid": p.sid, "name": p.name } for p in room.players.values()],
        "settings": {
            "canvas_width": CANVAS_WIDTH,
            "canvas_height": CANVAS_HEIGHT,
            "playersize": PLAYERSIZE
        }
    })

@socketio.on("join_room")
def on_join_room(data):
    """
    Client emits:
     { room_id: "abc123", name: "playerName" }
    Server emits to room:
     "player_joined": { sid, name } and replies to caller with full room state.
    """
    sid = request.sid
    rid = (data or {}).get("room_id")
    name = (data or {}).get("name", "Player")
    if not rid:
        emit("join_failed", {"reason": "missing room_id"})
        return
    room = get_room(rid)
    if not room:
        emit("join_failed", {"reason": "room not found"})
        return
    with room.lock:
        if sid in room.players:
            # reconnection flow: update name and rejoin
            room.players[sid].name = name
        else:
            room.players[sid] = PlayerMeta(sid=sid, name=name)
        join_room(rid)
    # notify others
    socketio.emit("player_joined", {"sid": sid, "name": name}, room=rid)
    # send full room state back to new player
    emit("joined_room", {
        "room_id": rid,
        "players": [{ "sid": p.sid, "name": p.name } for p in room.players.values()],
        "settings": {
            "canvas_width": CANVAS_WIDTH,
            "canvas_height": CANVAS_HEIGHT,
            "playersize": PLAYERSIZE
        }
    })

@socketio.on("leave_room")
def on_leave_room(data):
    sid = request.sid
    rid = (data or {}).get("room_id")
    if not rid:
        return
    room = get_room(rid)
    if not room:
        return
    with room.lock:
        if sid in room.players:
            pname = room.players[sid].name
            del room.players[sid]
            leave_room(rid)
            socketio.emit("player_left", {"sid": sid, "name": pname}, room=rid)
    cleanup_room_if_empty(rid)

@socketio.on("start_game")
def on_start_game(data):
    """
    start_game: only host should call this. Example payload:
      { room_id: "abc123", ai_mode: false }
    """
    sid = request.sid
    rid = (data or {}).get("room_id")
    ai_mode = bool((data or {}).get("ai_mode", False))
    room = get_room(rid)
    if not room:
        emit("error", {"reason": "room not found"})
        return
    if room.host_sid != sid:
        emit("error", {"reason": "only host can start game"})
        return
    with room.lock:
        room.game_started = True
        # In multiplayer, enforce ai_mode False
        room.ai_mode = False
    socketio.emit("game_started", {"room_id": rid, "ai_mode": room.ai_mode}, room=rid)

# --- SPAWN synchronization ---
@socketio.on("spawn")
def on_spawn(data):
    """
    Client emits when they spawn a local card:
    {
      room_id: "abc123",
      char: "pekka",         # string id consistent with client
      x: 120, y: 480,        # spawn coords in client's local coordinate system
      playersize: 120,       # optional (server uses canonical but accepts)
      meta: { ... }          # optional metadata (card id, local_ts)
    }

    Server does:
     - validate
     - rate-limit (per-player)
     - store recent spawn in room.last_spawns
     - broadcast 'spawn' event to all other clients in room with mirrored coordinates for them

    Broadcasted payload:
    {
      from_sid: "abc",
      char: "pekka",
      x: <x_for_receiver>,
      y: <y_for_receiver>,
      meta: {...}
    }
    """
    sid = request.sid
    rid = (data or {}).get("room_id")
    char = (data or {}).get("char")
    x = (data or {}).get("x")
    y = (data or {}).get("y")
    meta = (data or {}).get("meta", {})

    if not rid or char is None or x is None or y is None:
        emit("spawn_failed", {"reason": "invalid payload"})
        return

    room = get_room(rid)
    if not room:
        emit("spawn_failed", {"reason": "room not found"})
        return

    # check player membership
    with room.lock:
        if sid not in room.players:
            emit("spawn_failed", {"reason": "not in room"})
            return

        # rate-limit (prevent clients spamming spawn event)
        now = time.time()
        last_ts = room.players[sid].last_spawn_ts
        if now - last_ts < SPAWN_COOLDOWN_SEC:
            # silently drop or send a warning
            emit("spawn_rejected", {"reason": "spawn cooldown"})
            return
        room.players[sid].last_spawn_ts = now

        # optionally sanitize/limit values
        try:
            fx = float(x)
            fy = float(y)
        except Exception:
            emit("spawn_failed", {"reason": "invalid coords"})
            return

        # Save spawn to history
        spawn_entry = {
            "from": sid,
            "char": char,
            "x": fx,
            "y": fy,
            "meta": meta,
            "ts": now
        }
        room.last_spawns.append(spawn_entry)
        # keep bounded history length
        if len(room.last_spawns) > 200:
            room.last_spawns.pop(0)

    # Broadcast mirroring behavior: each receiving client will get coords
    # that are transformed so they can directly pass to makeActive(..., 'our') on their side.
    # We'll send original for the originator (if needed) and mirrored coords for others.
    # Build two messages:
    origin_payload = {
        "from_sid": sid,
        "char": char,
        "x": fx,
        "y": fy,
        "meta": meta,
        "mirror": False
    }
    # For recipients: flip Y vertically against the canonical canvas so it appears mirrored
    mod_x, mod_y = canonical_mirror_coords(fx, fy)
    recipient_payload = {
        "from_sid": sid,
        "char": char,
        "x": mod_x,
        "y": mod_y,
        "meta": meta,
        "mirror": True
    }

    # emit to _other_ clients in the room
    # note: to avoid echoing to origin, use broadcast with include_self=False
    socketio.emit("spawn_broadcast", recipient_payload, room=rid, include_self=False)
    # Optionally inform originator that server accepted spawn
    emit("spawn_ack", origin_payload)

# --- Utility: request room state (for reconnection) ---
@socketio.on("get_room_state")
def on_get_room_state(data):
    rid = (data or {}).get("room_id")
    room = get_room(rid)
    if not room:
        emit("room_state", {"error": "room not found"})
        return
    with room.lock:
        emit("room_state", {
            "id": room.id,
            "players": [{ "sid": p.sid, "name": p.name } for p in room.players.values()],
            "game_started": room.game_started,
            "ai_mode": room.ai_mode,
            "last_spawns": room.last_spawns[-30:]  # send recent history
        })

# simple health endpoint
@app.route("/health")
def health():
    return jsonify({"ok": True, "rooms": len(rooms)})

# Run server
if __name__ == "__main__":
    # Use eventlet for production-like local debugging
    import eventlet
    eventlet.monkey_patch()
    print("Starting server on 0.0.0.0:5000 (eventlet)")
    socketio.run(app, host="0.0.0.0", port=5000)
