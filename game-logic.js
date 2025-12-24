// background image
const bgimage = document.getElementById('bg-img');
let gametime = 20;
const ai_mode = true;
//towers

const ourarcher1 = document.getElementById('our-archer1');
const ourarcher0 = document.getElementById('our-archer0');
const opparcher0 = document.getElementById('opp-archer0');
const opparcher1 = document.getElementById('opp-archer1')
const ourking = document.getElementById('our-king');
const oppking = document.getElementById('opp-king');

const crownblue = document.getElementById('crownblue');
const crownred = document.getElementById('crownred');

const cushionblue = document.getElementById('cushionblue');
const cushionred = document.getElementById('cushionred');



// ourdeck
// const ourvalk = document.getElementById('our-valk');
// const ourwiz = document.getElementById('our-wiz');
// const ourpekka = document.getElementById('our-pekka');
// const ourroyal_giant = document.getElementById('our-royal_giant');

//oppdeck
// const oppvalk = document.getElementById('opp-valk');
// const oppwiz = document.getElementById('opp-wiz');
// const opppekka = document.getElementById('opp-pekka');
// const opproyal_giant = document.getElementById('opp-royal_giant');

//ourbar
// const ourbar = document.getElementById('our-bar');
//oppbar
// const oppbar = document.getElementById('opp-bar');



let game_type = "multi" ;

let players = ["chr_pekka_out","chr_knight_out","chr_valkyrie_out","chr_royal_giant_out"]
// Node structure
let sprite = ['chr_pekka_sprite_','chr_knight_sprite_','chr_valkyrie_sprite_','chr_royal_giant_sprite_']
class Node {
    //sprite = players + spritee
  constructor(num,baseURL,sprite) {
    this.num = pad(num);
    this.img = new Image();
    // this.img.src = `${baseURL}chr_pekka_sprite_${num}.png`;
    this.img.src = `${baseURL}${sprite}${this.num}.png`
    this.next = null;
  }
}
let royals = { 
    chr_pekka_out: {},
    chr_knight_out: {},
    chr_valkyrie_out: {},
    chr_royal_giant_out: {}

}
function pad(num, size = 3) {
  return num.toString().padStart(size, "0");
}


//spritesheet.chr_pekka_out
// direct key ka naam
// if varaible ka derhe hote h oth [] 
// yhi se hum niche ke loop me spritesheet ke coordinates uthayenge 
const spritesheet ={
    chr_pekka_out : {
        walk:[125,112],//
        walkopp:[150, 140],//
        attack:[320,310],//
        attackopp:[350,340],//
    },
    chr_knight_out : {
        walk:[107,97],//
        walkopp:[11,1 ], //
        attack:[484,460], //
        // attack:[371,360], //

        attackopp:[371,360] //
    },
     chr_valkyrie_out: {
        walk:[71,64], // 
        walkopp:[88,81],//
        attack:[378,358], //
        attackopp:[174,164]//
    },
      chr_royal_giant_out: {
        walk:[143,128],//
        walkopp:[15,1],//
        attack:[251,243],
        attackopp:[174,166]
    }
}

const cardIdopp = [
  "opp-knight", "opp-valk", "opp-pekka", "opp-royal_giant"
];

// hog rider 1 se 7 h oppwalk
const moves = ['walk','walkopp','attack','attackopp'];
function move(startsprite, endsprite){
for ( let i = 0 ; i < players.length ; i++ ){
    // selecting player
    // har player ke liye link list bn rhi h
const baseURL = `https://raw.githubusercontent.com/smlbiobot/cr-assets-png/master/assets/sc/${players[i]}/`;
for(let k = 0;k<moves.length;k++) {
    // selcting hum kiske liye h like walk , attack 
let head = null, prev = null;
  // har link list me particular spritesheet map kar rhe h 
  // mapping sprtieseet with that action 
  for (let j = spritesheet[players[i]][moves[k]][0]; j >= spritesheet[players[i]][moves[k]][1]; j--) {
    const node = new Node(j,baseURL,sprite[i]);
    if (!head) head = node;
    if (prev) prev.next = node;
    prev = node;

  }
  prev.next = head; // make it circular
  royals[players[i]][moves[k]]=head;
  
}
}
// sbke sprite sheet load krke ek royals naam ke objetct me derha h jisme ki saare action define h 
// royals.chr_pekka_out.walk aise krke hum sprite sheet ko access kar rhe hogne

}
move();



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const oppspawn = {
  rX:75+20,
  rY:60+100,
  lX:330+20,
  lY:60+100
}

const ourspawn = {
  rX:60+30,
  rY:330+70,
  lX:330+20,
  lY:330+70
}

const playersize = 120 ;

// hum animate me ek chr value derhe honge 
// chr me kya define hoga chr me hum name derhonge vlakyrie royal_giant jiska naam denge uske do amne samne 
// ke aajaayegen ladneee 

// humne class bnali h sbki pekka wgehra ki ab hum chahte h ki hum peeka. krke hi access krwarhe hogne woh
// woh bhi object bnake 

// function animate(chr) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

  
//   if (royals[`chr_${chr}_out`].walk.img.complete) {
//     ctx.drawImage(royals[`chr_${chr}_out`].walk.img, ourspawn.rX, ourspawn.rY, 128, 128);
//     ctx.drawImage(royals[`chr_${chr}_out`].walkopp.img, oppspawn.rX, oppspawn.rY, 128, 128);
   


//     // ourspawn.rX-=pekka.dx;
    
//   }
//   if(ourspawn.rY<oppspawn.rY+55){
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     attack(chr)
//   }
//   else{
//     ourspawn.rY-=p1.dy;
//     oppspawn.rY+=p1.dy;
//     // oppspawn.ry+=valkyrie.dy;
//   }
  
//   royals[`chr_${chr}_out`].walk = royals[`chr_${chr}_out`].walk.next;
//   royals[`chr_${chr}_out`].walkopp = royals[`chr_${chr}_out`].walkopp.next; // move to next frame

//   setTimeout(() => requestAnimationFrame(() => animate(chr)), 100);
// }
// console.log(pekka_move.our_pekka_walk.img);
// pekka_move.our_pekka_walk.img.onload = () => animate();
// animate('pekka');
// animate('valkyrie');
// animate(`valkyrie`);

// setTimeout(() => animate('valkyrie'),3000);

// let our_pekk = move(pekka.attack[0],pekka.attack[1]);
// let opp_pekka = move(pekka.attackopp[0],pekka.attackopp[1]);
// function attack(chr){
  

//   ctx.drawImage(royals[`chr_${chr}_out`].attack.img, ourspawn.rX, ourspawn.rY, 128, 128);
//   ctx.drawImage(royals[`chr_${chr}_out`].attackopp.img, oppspawn.rX, oppspawn.rY, 128, 128);

//   royals[`chr_${chr}_out`].attack= royals[`chr_${chr}_out`].attack.next;
//   royals[`chr_${chr}_out`].attackopp = royals[`chr_${chr}_out`].attackopp.next; 

//   // requestAnimationFrame(attack)
// }
let activeplayers = []

function makeActive(type,x,y,opp_or_not){
  const chrKey = `chr_${type.toLowerCase()}_out`;
  const stats = attackpower[type.toLowerCase()]; // e.g. attackpower["pekka"]
  if (!stats) {
    console.error(`Invalid type: ${type}`);
    return; // Skip invalid player
  } // e.g. attackpower["pekka"]
    let elixir_req = stats.elixir_needed;
  if(opp_or_not === 'opp' ){
    current_elixiropp-=elixir_req;
  }
   if(opp_or_not === 'our'){
    current_elixirour-=elixir_req;
  }
// yeh toh minus krne ka likh liya h ab hume likhan hki draggable rhe iske liye gameloop m ehi fucniton call likhna pdega jo 
// jo persecond undraggable krta rhe 
  activeplayers.push({
    id: `${type}_${Date.now()}`,  // unique
    type: type.toLowerCase(),     // to lookup royals[] animations
    chrKey : chrKey,
    opp : opp_or_not,
    x: x,
    y: y,
    dx: stats.speed,
    dy: stats.speed,
    power: stats.power,
    health: 100,
    maxhealth : 100,
    state: "walk",
    currentFrame: royals[chrKey].walk
    //  currentFrame: royals["chr_pekka_out"].walk  
  });

konseactivehongeplayer(current_elixiropp, current_elixirour);
// spawn hone ke baad bhi toh update krna chaiye kyuki us tiem km hua h 
}

//   const cardIds = [
//     "our-knight", "our-valk", "our-pekka", "our-royal_giant",
//     "opp-knight", "opp-valk", "opp-pekka", "opp-royal_giant"
//   ];

//   cardIds.forEach(id => {
//     const card = document.getElementById(id);
//     if (!card) return;

//     // draggable set karo
//     card.draggable = enabled;

//     // agar disabled hai to grey filter lagao, warna normal
//     if (!enabled) {
//       card.style.filter = "grayscale(100%) brightness(60%)";
//       card.style.cursor = "not-allowed";
//     } else {
//       card.style.filter = "none";
//       card.style.cursor = "grab";
//     }
//   });
// }

let max_elixir = 10;
let current_elixiropp = 10;
let current_elixirour = 10;


function drawElixirBar(ctx, x, y, width, height, fillPercent) {
  // fillPercent: 0 to 1 (how full the bar is)
  const fillWidth = width * fillPercent;
  

  // Create linear gradient (left → right)
  const gradient = ctx.createLinearGradient(x, y, x + fillWidth, y);

  // Colors inspired by Clash Royale elixir bar
  gradient.addColorStop(0, "#d86eff");  // light pinkish purple
  gradient.addColorStop(0.5, "#b200ff"); // rich purple mid
  gradient.addColorStop(1, "#6e00b3");   // dark violet edge

  // Draw background bar (grayish)
  ctx.fillStyle = "#222"; 
  ctx.fillRect(x, y, width, height);

  // Draw glowing elixir fill
  ctx.fillStyle = gradient;
  ctx.shadowColor = "#b200ff";
  ctx.shadowBlur = 15; // glow
  ctx.fillRect(x, y, fillWidth, height);

  // Reset shadow
  ctx.shadowBlur = 0;

  // Optional border
  // ctx.strokeStyle = "#000";
  // ctx.lineWidth = 2;
  // ctx.strokeRect(x, y, width, height);

  const elixirText = `${Math.round(fillPercent * 100) / 10} / 10`; 
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#b200ff";
  ctx.shadowBlur = 10;
  ctx.fillText(elixirText, x + width / 2, (y + height / 2) + 2);

  // Reset shadow
  ctx.shadowBlur = 0;

}

// let leftCounter = 0;  // minutes
// let rightCounter = 0; // seconds
// let absolutecounter = 0;

let absolutecounter = gametime;


// math,floor always round down math.round nearest integer pe krta h ,, math.trunc just decimal values ko htata h decide nhi krta h 


function timer(min, sec) {
  // yeh saara visullay bdiya kr rha h game ko 
  ctx.clearRect(30, 16, 100, 50);

  // Background box (your coordinates)
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.roundRect(30, 16, 100, 50, 10);
  ctx.fill();
  ctx.stroke();

  // "Time left:
  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#ffea77";
  ctx.textAlign = "center";
  ctx.fillText("Time left :", 80, 30);

  // Timer text (dynamic)
  const timeText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  ctx.font = "bold 22px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.strokeText(timeText, 80, 50);
  ctx.fillText(timeText, 80, 50);
}
let flag = true;


// // Define your river boundaries and bridges (already given by you)
// const RIVER_BOUNDARIES = {
//   opp: 280,   // Opponent side edge of river
//   our: 395    // Our side edge of river
// };

// const left_bridge = { x: 55,  topy: 290, bottomy: 290 };
// const right_bridge = { x: 315, topy: 290, bottomy: 395 };



function konseactivehongeplayer(current_elixiropp,current_elixirour){
const cardIdour = [
    "our-knight", "our-valk", "our-pekka", "our-royal_giant", ];
const cardIdopp = [
    "opp-knight", "opp-valk", "opp-pekka", "opp-royal_giant" ];
const cardNameMap = {
  "our-knight": "knight",
  "our-valk": "valkyrie",
  "our-pekka": "pekka",
  "our-royal_giant": "royal_giant",
  "opp-knight": "knight",
  "opp-valk": "valkyrie",
  "opp-pekka": "pekka",
  "opp-royal_giant": "royal_giant"
};

  function updateCard(id, current_elixir) {
    const card = document.getElementById(id);
    if (!card) return;

    const needed = attackpower[cardNameMap[id]].elixir_needed;
    const hasEnough = current_elixir >= needed; // true false derha hoga

    card.draggable = hasEnough;  // Prevent drag if not enough , if false toh undraggable hoga 
    if (!hasEnough) {
      card.style.filter = "grayscale(100%) brightness(60%)";
      card.style.cursor = "not-allowed";
    } else {
      card.style.filter = "none";
      card.style.cursor = "grab";
    }
  }

  // Update our cards
  cardIdour.forEach(id => updateCard(id, current_elixirour));
  // Update opp cards
  cardIdopp.forEach(id => updateCard(id, current_elixiropp));


}


const cardidoppnew = [
  "opp-knight", "opp-valk", "opp-pekka", "opp-royal_giant"
];
function gameloop() {

let leftCounter = Math.floor(absolutecounter / 60);  // minutes
let rightCounter = Math.floor(absolutecounter % 60);; // seconds
 

ctx.drawImage(bgimage,0, 0, canvas.width, canvas.height);
drawtowers(activeplayers);
// ctx.fillRect(x, y, w, h) 200 -15 200 630 60




drawElixirBar(ctx, 230, 5, 230, 28, (current_elixiropp/max_elixir));
drawElixirBar(ctx, 230, 690, 230, 28, (current_elixirour/max_elixir));
absolutecounter = Math.max(0, absolutecounter - 0.1);
// rightCounter++; if (rightCounter >= 60) { rightCounter = 0; leftCounter++; } 
const LOOP_MS = 100; // har 0.1 second me loop call hoga
const DELTA = LOOP_MS / 1000; // 0.1 seconds

if (leftCounter > 0 || rightCounter > 0) {
  // Decrement seconds
  rightCounter = rightCounter - DELTA;

  // Agar 0 se neeche chala gaya
  if (rightCounter <= 0) {
    if (leftCounter > 0) {
      leftCounter--;
      rightCounter = 60 + rightCounter; // e.g. -0.1 => 59.9 se resume
    } else {
      rightCounter = 0; // final clamp
    }
  }

  // Round display ke liye (avoid float mess)
  rightCounter = Math.round(rightCounter * 10) / 10;
}
// Show on screen
timer(leftCounter, Math.floor(rightCounter))

// ctx.fillStyle = 'red';        // sets the fill color to red
// ctx.fillRect(500, 300, 200, 200); // draws a solid rectangle

if (max_elixir > current_elixiropp) {
    current_elixiropp = Math.min(max_elixir, current_elixiropp + 0.05);
  }
  if (max_elixir > current_elixirour) {
    current_elixirour = Math.min(max_elixir, current_elixirour + 0.05);
  }

  // Update card visuals after regen
  konseactivehongeplayer(current_elixiropp, current_elixirour);

// drawtimer(x , y);

//  ourdeck();
//  oppdeck();
//  drawoppbar();)
//  drawourbar();
opp = {}
our = {} 
// isko har second hi fresh bnana hoga isse kya hoga koi player
// mar jaayega toh uski id toh rhegi or baar baar pop bhi krna overhead h 
// isme kya hoga jo jo chijo acitve players me hogi woh woh chije hi filll horhi hogi 

 for (let player of activeplayers){
  // ek side kar rhe h opp ke players
 if(player.opp === 'opp'){
    opp[player.id] = [player.x,player.y];
   // ek side karr rhe h our ke players 
  }
  else{
    our[player.id]= [player.x,player.y];
 }
}

// if (Object.keys(opp).length === 0) { // Changed from opp.length
    
//     setInterval(() => {
//       alert("you win");
//     }, 3000);
//     return;
//   }

let deadIds = [];
//   if(player.state ==='walkopp'){
//     player.y += player.dy; 
//   }

//     if(player.state === 'walk' ){
//      player.y -= player.dy; 
//     }

// Solution: Split into 2 passes
// Pass 1: opp aur our dict build karo. (sirf info collect karna)
// Pass 2: Har player ke liye uska nearest enemy nikaalo + move karao + draw karao

for (let player of activeplayers){ // responsible for drawing one image of every active players
  if (player.opp === 'opp' && player.state === 'walk') {
  player.state = 'walkopp';
  player.currentFrame = royals[player.chrKey].walkopp;
}
// default toh walk arha hoga
  // yeh har ek activeplayer ki trh chlega toh hume jo nearest find kran hoga 
  // nearest find jo krna hoga woh isplayer vs enemy group krna hoga
  // woh thoda beneficial rhega 
let target = []; // har baar target reset isse kya hoga ki naya target and dynamicness rahe 
//get nearest enemy ab bn gya h crazy fucnitno yeh agar me our ke liye call krugna toh opp dega
// opp ke liye call kru toh our dega
// NEW: Smart targeting (bridge-aware)
if (player.opp === 'opp') 
{ 
  target = getNearestEnemy(player, our); 
} 
else
{ 
  target = getNearestEnemy(player, opp);
} 
if (!target) 
 return null;

  
if(target.dist>target.kitnapass){
   if(player.opp === 'our' && player.state === 'attack'){
  player.state = 'walk';
  player.currentFrame = royals[player.chrKey].walk;

  }
  else if(player.opp === 'opp' && player.state === 'attackopp'){
  player.state = 'walkopp';
  player.currentFrame = royals[player.chrKey].walkopp;
  }
        // X ko adjust karo
      if (player.x < target.x) {

        player.x += player.dx;

      } else if (player.x > target.x) {
        player.x -= player.dx;
      }

      if (player.y < target.y) {
        player.y += player.dy;
      } else if (player.y > target.y) {
        player.y -= player.dy;
      }
}
else{
  // ab x y nhi bdhega ab sirf attack hoga if me wrap krdena
  if (player.opp === 'our' && player.state === 'walk'){
  player.state = 'attack';
  player.currentFrame = royals[player.chrKey].attack;

  }
  else if(player.opp === 'opp' && player.state === 'walkopp'){
  player.state = 'attackopp';
  player.currentFrame = royals[player.chrKey].attackopp;
  }
  let samnewala = activeplayers.find(p => p.id === target.id)
  if (!samnewala) continue; // NEW: Skip if target already gone
  // isme yeh issue h ki multiple players ke liye for loop chl rha h and maanlo 4 player h toh 4 player h inmese kisi ek nhi bhi kill krdiya 
  // toh dikkt hojayegi
  // yeh samenwala kese kaam kr rha ki active player me us target id wala dhund tah but socho player 1 ko yeh find krke milgya h 
  // and usne attackfucntion me bhejidya ab attack fucntion me jaane ke baad woh mar ke ajayega or active player se ht jayega 
  // but abhi bhi woh chij our or opp me h aap soch skte ho apne toh bhot dimag lgake function likha tha nearest ko call krne ka but 
  // but wo nearest me opp or our jarhe h and jo delete horah h voh activeplayers me horha h ; and oppp or our toh upar bhar chuka h 
  // toh yeh chij toh dikkt hogyi na 
  // pura uska object derha h 
  let deadId = attackfunction(player, samnewala);
  if (deadId) {
        deadIds.push(deadId); // NEW: Collect ID instead of filtering
      }
// if (deadId) {
//   activeplayers = activeplayers.filter(p => p.id !== deadId);
// }
  // ya toh ek try lgade ki oppp me h toh our me bhi remove krdo 
  // ya fir opp or our ko htake hum ek arrow function lgade jo opp or our ka kaam khtm krde or direct hi filter krke dede overhead less hojaye
  // 3rd option hoga ek deadid bnai jaaye bahr store ki jaaye and usko filter ki jaaye most optimal but opp or our ka overheas rhte 
  // jo yeh humen teen solution cover kiye woh dekht eh 

  // phle toh yeh ki try lgake remove krdenge woh bhi sahi h but woh chij activeplayerse remove nhi hogi toh active player bhi 
  // gameloop me rhega iska mtlb deadplayer abhi bhi screen pe rhenge toh hum active player ko remove krdenge iske sath but isme kya hoga 
  // ki huamra jo h voh for loop me chl rha h active palyer ko chedenge toh uska count decrease hoagg or for loop jo n number ke liye chlega woh ab n-1 ke liye chlne lgega
  // 1st nhi krenge 

  // arrow fucniton wala sbse optimal rhega but isme kaafi changes h plua neares fucniton ka jo simple code h voh mushkil hojayega kyuki usme hum oppp or our derhe the 

  // 3rd option deadid wala dekht eh 

  // Option 3 (mera pehla solution) sabse kam changes mangta hai aur efficient hai, lekin opp/our maintain karna extra overhead hai agar unka koi special use nahi (jaise tumhare game mein abhi nahi dikhta). Option 2 simpler aur cleaner hai long-term ke liye


} 

  if (player.currentFrame && player.currentFrame.img) {
    ctx.drawImage(player.currentFrame.img, player.x, player.y, playersize, playersize);
    player.currentFrame = player.currentFrame.next;
  } 
  // If it’s a tower (just an Image element)
  else if (player.currentFrame instanceof HTMLImageElement) {
    ctx.drawImage(player.currentFrame, player.x, player.y, player.w, player.h);
  }
  drawHealthBar(ctx, player);

 }// sbke liye image bandega jitne bhi aactive state h 
 // and then baadme hum requestanimateframe krenge ki recursion hojaaye 
// mtlb chije dubara se bne 
   
if (deadIds.length > 0) {
    activeplayers = activeplayers.filter(p => !deadIds.includes(p.id));
  // So !deadIds.includes(p.id) means:
// “Keep this player if their id is NOT in deadIds.”
// Ab player marne ke baad ek frame late gayab hota hai —
// but ye intentional aur safe delay hai,
// game ke logic me koi problem nahi hoti.
  }
const ourkingalive = activeplayers.some(p => p.id.includes("ourking"));
const oppkingalive = activeplayers.some(p => p.id.includes("oppking"));

 
if (absolutecounter > 0 && ourkingalive && oppkingalive) {
    setTimeout(() => requestAnimationFrame(gameloop), 100);
  } 
  else {
    if (flag) {
      flag = false;  // mark final frame is being drawn
      console.log("Running one final cleanup frame...");
      
      // force one last frame to clean up visuals
      setTimeout(() => {
        requestAnimationFrame(() => {
          gameloop(); // one last frame only
        });
      }, 100);

      return; 
    }

    // Now safe to stop after final frame
    stopgame();
  }


}


function stopgame() {
  // Draw static "VS" and cushions
  ctx.font = "bold 45px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VS", 250, 360);

  ctx.drawImage(cushionblue, 40, 400, 420, 220);
  ctx.drawImage(cushionred, 40, 120, 420, 220);
// Ye check karta hai:
// “Kya activeplayers array me koi aisa player hai jiska id me "opparcher0" likha hua hai?”
// Agar mil gaya → true
// Agar nahi mila → false
  // ✅ Determine tower survival states
  const ourTowersAlive = {
    left: activeplayers.some(p => p.id.includes("ourarcher0")),
    right: activeplayers.some(p => p.id.includes("ourarcher1")),
    king: activeplayers.some(p => p.id.includes("ourking")),
  };
  const oppTowersAlive = {
    left: activeplayers.some(p => p.id.includes("opparcher0")),
    right: activeplayers.some(p => p.id.includes("opparcher1")),
    king: activeplayers.some(p => p.id.includes("oppking")),
  };
  

  // iske baad hum code likh re honge usme kya hoga 
  //  ki if me king maardeta hu unka toh m jeet gya jiska mtlb h ki ttwwno corwns dikhenge meri side pe
if (!ourTowersAlive.king && oppTowersAlive.king) {
   // humara milna check krna jruri h 

    // our king dead, opp king alive → opp wins
   ctx.drawImage(crownred, 172, 120, 150, 120);
   ctx.drawImage(crownred, 272, 130, 150, 120);
   ctx.drawImage(crownred, 75, 130, 150, 120);

    ctx.fillText("WINNER", 250, 120);
    return;
  } else if (ourTowersAlive.king && !oppTowersAlive.king) {
    // opp king dead, our king alive → we win
     ctx.drawImage(crownblue, 172, 362, 150, 190);
     ctx.drawImage(crownblue, 280, 382, 137, 175);
     ctx.drawImage(crownblue, 80, 382, 137, 175);
    ctx.fillText("WINNER", 250, 600);
    return;
  }

 // Crown for opponent when our tower dies
if (!ourTowersAlive.king) ctx.drawImage(crownred, 172, 120, 150, 120); 
if (!ourTowersAlive.right) ctx.drawImage(crownred, 272, 130, 150, 120);
if (!ourTowersAlive.left) ctx.drawImage(crownred, 75, 130, 150, 120);

// Crown for us when opponent's towers die
if (!oppTowersAlive.king) ctx.drawImage(crownblue, 172, 362, 150, 190);
if (!oppTowersAlive.right) ctx.drawImage(crownblue, 280, 382, 137, 175);
if (!oppTowersAlive.left) ctx.drawImage(crownblue, 80, 382, 137, 175);

  //  Decide the winner
  ctx.font = "bold 55px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
 // humare yjada tute h toh woh jitega 
 // uske jyada tute h toh hum jeetenge 
 // our dest me hum check kret h ki kya humara left wala tuta  hn toh 0 na toh 1 
 // ourtowersalive.left agar true toh 0 nhi toh 1 
 // agar humare dono mr gye toh ourdest hojayefa 2 
 // agar unke dono mar gye toh oppdest hojayega 2
 // agar humare dono mar gye toh hum haar rhe h or woh jeet rha h 
 // oth jiska score km hoga woh jeet rha hoga 
 // agar humar score km h hum jeet gye 
 
 
 // King-based decisive logic
  
  // If both kings alive or both dead, compare remaining towers
  const ourdest =
    (ourTowersAlive.left ? 0 : 1) + 
    (ourTowersAlive.right ? 0 : 1);
  const oppdest =
    (oppTowersAlive.left ? 0 : 1) +
    (oppTowersAlive.right ? 0 : 1);

  if (ourdest < oppdest) {
    // agar humara score km h toh hum jeet gye h 
    ctx.fillText("WINNER", 250, 600); // blue (bottom)
  } else if (oppdest < ourdest) {
    // agar humara score jyada h toh hum haar gye h
    ctx.fillText("WINNER", 250, 120); // red (top)
  } else {
    absolutecounter += 60;
    gameloop();
  }
}

function attackfunction(player, samnewala) {
  if(samnewala.health){
  samnewala.health -= player.power;
  }

  if (samnewala.health <= 0) {
    return samnewala.id;   // id return karo
  } 
  if (player.health <= 0) {
    return player.id;      // agar future me tu dono taraf ka damage kare
  }
  return null; // koi dead nahi
}
const OPP_MAX_Y = 400;   // top half
const OUR_MIN_Y = 300;   // bottom half


canvas.addEventListener("dragover", (event) => {
  event.preventDefault(); // default rokna zaroori hai
});

// Handle drop
// make sure playersize is defined (you already have playersize = 140)
function onDragStart(event, type, opp_or_not) {
  event.dataTransfer.setData("characterType", type);
  event.dataTransfer.setData("opp_or_not", opp_or_not);

  // Force the browser drag-ghost to be centered under the cursor
  // so the pointer correlates with the center of the card/sprite.
  // Use the dragged element itself as drag image and center hotspot.
  const img = event.target;
  const rect = img.getBoundingClientRect();
  // center hotspot horizontally & vertically
  const hotX = Math.round(rect.width / 2);
  const hotY = Math.round(rect.height / 2);
  try {
    event.dataTransfer.setDragImage(img, hotX, hotY);
  } catch (e) {
    // some browsers may not allow custom drag image for security reasons;
    // the try/catch prevents crashes.
  }
}

canvas.addEventListener("drop", (event) => {
  event.preventDefault();

  const type = event.dataTransfer.getData("characterType");
  const opp_or_not = event.dataTransfer.getData("opp_or_not");

  const needed = attackpower[type.toLowerCase()].elixir_needed;
  const current = (opp_or_not === 'our') ? current_elixirour : current_elixiropp;

  // Check if enough elixir
  if (current < needed) {
    
    return;  // Don't spawn
  }


  const rect = canvas.getBoundingClientRect();

  // scale from CSS pixels to canvas pixels (robust)
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const xCss = event.clientX - rect.left;
  const yCss = event.clientY - rect.top;

  // mapped to canvas coordinate system
  let x = xCss * scaleX;
  let y = yCss * scaleY;

  // --- IMPORTANT: center the sprite on the pointer (so it doesn't appear right/bottom) ---
  x = Math.round(x - playersize / 2);
  y = Math.round(y - playersize / 2);

  // clamp inside canvas edges (optional but useful)
  x = Math.max(0, Math.min(canvas.width - playersize, x));
  y = Math.max(0, Math.min(canvas.height - playersize, y));


  if (opp_or_not === "our") {
    // hum sirf bottom area me spawn kar sakte hain
    if (y < OUR_MIN_Y) {
      
      return;
    }
  } else if (opp_or_not === "opp") {
    // opponent sirf top area me spawn kar sakta hai
    if (y + playersize > OPP_MAX_Y) {
     
      return;
    }
  }


  makeActive(type, x, y, opp_or_not);
});

//oppp //our
// our me kya h saare humare playera dn uske x y ki information
// hume ek aisa dynamic array bnana chaiye jo opp or our ki info  
// ek  ko pka ek character ko ab voh pure array ko traverse krega and find krega 
// ki kiski value km aayi h uske hi piche chla jaayega value absoulute hi hogi 

// our me dher saari ID h 
// ek ek id pkd rha h 
// ux ko set kar rha h us id and 0 pe  
// our = {
//   "OUR1": [100, 300],
//   "OUR2": [200, 400]
// }
function getNearestEnemy(player, enemyGroup) {
  let mindist = Infinity;
  let nearest = null;
  // let kitnapass ;
// nearest ka code jo player ko uhtayega and opp ke saare player me se ek near dega
// and yeh har frame ke liye chal rha hoga toh at that second woh turn bhi leskta h 
  // if (player.opp === 'our'){
  //    kitnapass = 40
  // }
  // if(player.opp ==="opp"){
  //   kitnapass = 65;
  // }

  const baseRange = 60;

  //  Adjusted range based on player’s Y position
  const perspectiveScale = getPerspectiveScale(player.y);
  let  kitnapass = baseRange * perspectiveScale;
  kitnapass = 52;

  for (let eid in enemyGroup) {
    let ex = enemyGroup[eid][0];
    let ey = enemyGroup[eid][1];

    let dx = ex - player.x;
    let dy = ey - player.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mindist) {// euclidiean formulaar 
      mindist = dist;
      nearest = { id: eid, x: ex, y: ey, dist: dist , kitnapass };
    }
  }

  return nearest;
}
const attackpower = {
  pekka : {
   power: 3,
   speed: 2.3,
   elixir_needed : 5
  },
  valkyrie : {
   power: 1.3,
   speed: 5,
   elixir_needed : 3
  },
  knight : {
   power: 1,
   speed: 3,
   elixir_needed : 3
  },
  royal_giant : {
   power: 3,
   speed: 1.5,
   elixir_needed : 5

  }
}

function spawnTower(type, x, y, w, h, opp_or_not) {
  let imageRef;

  if (type === "opparcher0") imageRef = opparcher0;
  else if (type === "opparcher1") imageRef = opparcher1;
  else if (type === "ourarcher0") imageRef = ourarcher0;
  else if (type === "ourarcher1") imageRef = ourarcher1;
  else if (type === "oppking") imageRef = oppking;
  else if (type === "ourking") imageRef = ourking;

  activeplayers.push({
    id: `${type}_${Date.now()}`,
    type: 'towers',
    opp: opp_or_not,
    w: w,
    h: h,
    x: x,
    y: y,
    dx: 0,
    dy: 0,
    power:3,
    health: 200,
    maxhealth : 200,
    state: "idle",
    currentFrame: imageRef // yaha ab actual image object gaya
  });
}


function drawtowers(activeplayer){
for (let active of activeplayer){
  if(active.state === 'idle'){
  if(active.type === 'towers'){
    ctx.drawImage(active.currentFrame,active.x,active.y,active.w,active.h);
  }
}
}
}
// function ourdeck(){
//    ctx.drawImage(ourwiz, 340, 630, 60, 60);
//     ctx.drawImage(ourvalk, 220, 630, 60, 60);
//     ctx.drawImage(ourpekka, 400, 630, 60, 60);
//     ctx.drawImage(ourroyal_giant, 280, 630, 60, 60);
    
// }
// function drawourbar(){
//     ctx.drawImage(ourbar,200, 670, 290, 60);
// }

// function oppdeck(){
//   ctx.drawImage(oppwiz, 340, 30, 60, 60);
//     ctx.drawImage(oppvalk, 220, 30, 60, 60);
//     ctx.drawImage(opppekka, 400, 30, 60, 60);
//     ctx.drawImage(opproyal_giant, 280, 30, 60, 60);
// }
// function drawoppbar(){
//    ctx.drawImage(oppbar,200, -15, 290, 60);

// }


window.onload = () => {
  placeDeckAndBars();
  
  // Our towers
  spawnTower("opparcher0", 75, 100, 80 , 100 ,"opp");
  spawnTower("opparcher1", 330, 100,80,100 ,"opp");
  spawnTower("oppking", 190, 80, 100,120 , "opp");
  

  // Opp towers
  spawnTower("ourarcher0", 50, 480,120,140 ,"our");
  spawnTower("ourarcher1", 310, 480,120,140, "our");
  spawnTower("ourking", 150,490, 180,180, "our");
if(ai_mode){
  // yeh global hoga jo onload chlna chaiye
  MakeOppDeckUnavailable();
  scheduleAiSpawn();
  
}
  gameloop();


};

function setPos(id, x, y, w, h) {
  const el = document.getElementById(id);
  if (!el) return;

  const px = (x / 480) * 100;   
  const py = (y / 720) * 100;  
  const pw = (w / 480) * 100;
  const ph = (h / 720) * 100;

  el.style.left = px + "%";
  el.style.top = py + "%";
  el.style.width = pw + "%";
  el.style.height = ph + "%";
}

// ctx.fillRect(x, y, w, h)



function placeDeckAndBars() {
  // our deck
  setPos("our-knight",   335, 590, 72, 60);
  setPos("our-valk",  220, 590, 60, 60);
  setPos("our-pekka", 400, 590, 60, 60);
  setPos("our-royal_giant", 280, 590, 60, 60);
  setPos("our-bar",   200, 630, 290, 60);

  // opp deck
  setPos("opp-knight",   335, 30, 72, 60);
  setPos("opp-valk",  220, 30, 60, 60);
  setPos("opp-pekka", 400, 30, 60, 60);
  setPos("opp-royal_giant", 280, 30, 60, 60);
  setPos("opp-bar",   200, -15, 290, 60);
}



function drawHealthBar(ctx, player) {
  const barWidth = 50; // Compact size, like Clash Royale
  const barHeight = 8; // Slim for cute look
  const offsetY = 0; // Position above sprite
  const radius = barHeight / 2; // Fully rounded capsule ends

  if (typeof player.health !== "number" || player.health <= 0) return;

  // Smooth health animation
  player.displayHealth = player.displayHealth ?? player.health;
  player.displayHealth += (player.health - player.displayHealth) * 0.1; // Smooth transition

  const hpPercent = Math.max(0, Math.min(1, player.displayHealth / (player.maxhealth || 100)));
  const x = player.x + playersize / 2 - barWidth / 2;
  const y = player.y - offsetY;

  // Subtle pulse for glow (less intense for lightweight feel)
  const pulse = (Math.sin(Date.now() / 400) + 1) / 2; // Gentle pulse
  const glow = 4 + pulse * 2; // Soft glow effect

  // Gradient colors based on HP
  let colorStart, colorEnd, glowColor;
  if (hpPercent <= 0.2) {
    colorStart = "#FF4D4D"; // Bright red for low HP
    colorEnd = "#B30000";
    glowColor = "rgba(255, 77, 77, 0.6)";
  } else if (hpPercent < 0.6) {
    colorStart = "#FFD700"; // Golden yellow for mid HP
    colorEnd = "#FFA500";
    glowColor = "rgba(255, 215, 0, 0.6)";
  } else {
    colorStart = "#00FF80"; // Vibrant green for high HP
    colorEnd = "#00B359";
    glowColor = "rgba(0, 255, 128, 0.6)";
  }

  // Background capsule (slightly translucent dark)
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // Soft shadow-like background
  ctx.roundRect(x - 1, y - 1, barWidth + 2, barHeight + 2, radius + 1);
  ctx.fill();

  // Health fill gradient
  const grad = ctx.createLinearGradient(x, y, x + barWidth, y);
  grad.addColorStop(0, colorStart);
  grad.addColorStop(1, colorEnd);

  // Draw health bar with glow
  ctx.beginPath();
  ctx.fillStyle = grad;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = glow;
  ctx.roundRect(x, y, barWidth * hpPercent, barHeight, radius);
  ctx.fill();

  // Reset shadow to avoid affecting other drawings
  ctx.shadowBlur = 0;

  // Inner shine for 3D effect (Clash Royale style)
  const shineGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
  shineGrad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
  shineGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
  shineGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = shineGrad;
  ctx.beginPath();
  ctx.roundRect(x, y, barWidth * hpPercent, barHeight / 2, radius);
  ctx.fill();

  // // Thin white outline for crispness
  // ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  // ctx.lineWidth = 0.8;
  // ctx.beginPath();
  // ctx.roundRect(x, y, barWidth, barHeight, radius);
  // ctx.stroke();
}

function getPerspectiveScale(y) {
  // y = 0 (top of canvas) → scale = 1.5 (zoomed out)
  // y = canvas.height (bottom) → scale = 1.0 (zoomed in)
  const minScale = 1.0;
  const maxScale = 1.25;
  return maxScale - ((y / canvas.height) * (maxScale - minScale));
}


//deck ke character ka array bnana h 
function MakeOppDeckUnavailable() {
  // disable all opponent cards so player can't drag/spawn them in AI mode
  cardidoppnew.forEach(id => {
    const card = document.getElementById(id);
    if (!card) return;
    card.draggable = false;
    // ensure any dragstart is prevented (extra safety)
    card.ondragstart = (e) => { e.preventDefault(); return false; };
    // visual feedback
    // card.style.filter = "grayscale(100%) brightness(60%)";
    card.style.cursor = "not-allowed";
    card.setAttribute("aria-disabled", "true");
    card.style.pointerEvents = "auto";
  });
}

// function elexir_check(){
//   const ourList = activeplayers
//     .filter(p => p.opp === 'our')
//     .map(p => ({ id: p.id, x: p.x, y: p.y }));

// // ek new array bnadega jisme kya hoga ki ourlsit me sirf our ke id x and y horhe honge

//   const spawnCount = getRandomInt(1, 3);
// // spawncount kitne spawn krne h ek baari me  1 se leke 3 hoskte h 
// // toh yeh jitne bche huye elexir honge usse baatega 

//   const affordableChars = Object.keys(attackpower).filter(
//     k => attackpower[k].elixir_needed <= current_elixiropp
//   );
//   //  yeh jo attackpower tha uski keys ko string me bdal dega
//   // Object.keys(attackpower) gives ['pekka', 'valkyrie', 'knight', 'royal_giant']
//   // The .filter() function will now iterate over these keys:
// // For 'pekka', the elixir_needed is 5. Since 5 > 4, it will not be included in the affordableChars array.
// //  So, after filtering, affordableChars will look like this: [valk , knight]
// // iska mtlb h ki aap whi hi spawn krskte ho   
//   if (affordableChars.length === 0) {
//     // can't buy anything right now
//     // khali h toh bhar aajao 
//     return;
//   }
// // ✅ You’re right — strictly speaking,
// // that first affordableChars outside the loop isn’t needed
// // since the loop re-checks affordableNow anyway.

// // It’s mostly there for:

// // Early exit — to avoid running the whole spawn loop if no cards are affordable at all right now.

// // Readability — it’s a clear "pre-check" before the main loop starts
  
//   for (let i = 0; i < spawnCount; i++) {
//     // yeh jitnei baar spawn krna hoga utni baar ke liye chlega
//     // ab kitne spawn krne h uske hisab se spawn krenge 
//     // Recalc affordable each loop in case elixir changes during spawns
//     const affordableNow = Object.keys(attackpower).filter(
//       k => attackpower[k].elixir_needed <= current_elixiropp
//     );
//     if (affordableNow.length === 0) break;

//     // pick a random char AI can afford
//     const char = affordableNow[getRandomInt(0, affordableNow.length - 1)]; // e.g. "pekka"

//     // pick a focus point: random our unit OR null if none
//     // ,tlb oponent ke konse position ke pass spawn kru 
//     const focus = ourList.length ? ourList[getRandomInt(0, ourList.length - 1)] : null;

//     spawnWithAi(char, focus);

//     // small micro-delay between spawns (optional) to avoid all-in-one-frame
//     // (not blocking; just a tiny pause before next iteration)
//   }
// // GOTCHA / SUGGESTION

// // Right now you re-evaluate affordability each loop — good. But you do not reserve any elixir for defense (so AI may spend everything). Consider attackpower[k].elixir_needed <= current_elixiropp - reserve to keep a buffer.
  
// //   for(let player of activeplayers){
// //   if(player.opp === 'our'){
// //     ournew[player.id] = [player.x,player.y];
// //   // ournew ka bhar liya h humne
// //   }
// // }
// // // const stats = attackpower[type.toLowerCase()];
// // // const needed = attackpower[cardNameMap[id]].elixir_needed;
// //   for( let i of ournew ){
     
// //       const stats = cardNameMap[i].toLowerCase();
// //       // stats toh naam dedega 
// //       const nameOfChar = attackpower[stats];
// //       if(nameOfChar.elixir_needed< current_elixirour){
// //         spawnWithAi(stats);
// //       }

// //   }

// }
// // function spawnWithAi(char){
// //   x=ournew[0].x;
// //   y=ournew[0].y;

// //   if(y>350){
// //     //other side h toh hum x mathc krenge y nhi 
// //     y=y-200;
// //     makeActive(char,x,y,'our')
// //   }
// //   else{
// //     x=x-50;
// //     y=y-50;
// //     makeActive(char,x , y ,'our');
// //   }

// // }

// function spawnWithAi(char, focus) {
//   // char is like "pekka", "valkyrie", etc. makeActive expects type string.
//   let x, y;

//   if (focus) {
//     // Spawn roughly above/between the focus unit so AI pushes toward it.
//     // Give some horizontal jitter so AI doesn't stack perfectly.
//     x = focus.x + getRandomInt(-60, 60);
//     // uske upar ya niche khi pe bhi spawn hojaaye 

//     // Ensure opponent spawns on the top half (opponent area).
//     // We'll pick a y in opponent spawn range (100..300) or above the focus.
//     y = getRandomInt(100, 300);
//     // spawn 100 se 300 ke bich hi spawn ho 

//     // If focus is very close to top, nudge spawn a bit away
//     if (focus.y < 250) {
//       y = clamp(focus.y + getRandomInt(30, 80), 100, 300);
//       //iska mtlb  h y ai ke area me h toh ab hume itna random nhi krna h 
//       // mtllb woh value aisi aaye ki voh kese bhi krke 100 se 300 ke bich hi rahe 

//     }
//   } else {
//     // No friendly units on field — pick a random top-half spawn location
//     x = getRandomInt(60, canvas.width - playersize - 60);
//     // x khi bhi hoskta h us widht me agar huamra palyer abhi humari side hi h 
//     // 60 se lkeke canvaswidth 400 -playersize(60) - 60 tk khi pe bhi
//     y = getRandomInt(100, 300);
//     // and y 100 se 300 tk
//   }
//   // clam ka kaam hota h bich me fix krna 
//   // Clamp inside canvas & opponent allowed area
//   x = clamp(x, 0, canvas.width - playersize);
//   // Keep inside opponent area (top half). OPP_MAX_Y is defined earlier as 400
//   y = clamp(y, 0, Math.min(OPP_MAX_Y - playersize, canvas.height - playersize));
//   // yeh wala bhi y ko fix krdega 0 se leke kisis trh se toh krdega
//   // Make sure we only spawn if AI still has elixir; makeActive will subtract
//   const needed = attackpower[char].elixir_needed;
//   if (current_elixiropp >= needed) {
//     makeActive(char, x, y, 'opp'); // spawn as opponent
//   }
// }

// let aiSpawnTimerId = null;

// function scheduleAiSpawn() {
//   if (!ai_mode) return;
//   // pick random ms between 3000 and 5000
//   const delay = getRandomInt(3000, 5000);
//   aiSpawnTimerId = setTimeout(() => {
//     elexir_check();
//     // schedule next
//     scheduleAiSpawn();
//   }, delay);
// }

// function stopAiSpawn() {
//   if (aiSpawnTimerId) {
//     clearTimeout(aiSpawnTimerId);
//     aiSpawnTimerId = null;
//   }
// }

// function getRandomInt(min, max) {
//   // inclusive min, inclusive max
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function clamp(v, a, b) {
//   return Math.max(a, Math.min(b, v));
// }

// ========================
// 🔹 AI Difficulty Settings
// ========================
let aiDifficulty = "medium"; 
// possible: "easy", "medium", "hard", "extreme"

// helper to easily toggle difficulty
function setAiDifficulty(level) {
  const allowed = ["easy", "medium", "hard", "extreme"];
  if (allowed.includes(level)) aiDifficulty = level;
  console.log("AI difficulty set to:", aiDifficulty);
}

// ====================================
// 🔹 Core AI Logic (Elixir Check + Spawn)
// ====================================
function elexir_check() {
  const ourList = activeplayers
    .filter(p => p.opp === 'our')
    .map(p => ({ id: p.id, x: p.x, y: p.y }));

  // ---------- Difficulty affects spawn count ----------
  let spawnRange;
  switch (aiDifficulty) {
    case "easy": spawnRange = [1, 1]; break;
    case "medium": spawnRange = [1, 2]; break;
    case "hard": spawnRange = [2, 3]; break;
    case "extreme": spawnRange = [2, 4]; break;
  }
  const spawnCount = getRandomInt(spawnRange[0], spawnRange[1]);

  // ---------- Difficulty affects elixir usage ----------
  let elixirReserve;
  switch (aiDifficulty) {
    case "easy": elixirReserve = 2; break;     // saves elixir, slower
    case "medium": elixirReserve = 1; break;
    case "hard": elixirReserve = 0; break;
    case "extreme": elixirReserve = -1; break; // can overspend a bit
  }

  const affordableChars = Object.keys(attackpower).filter(
    k => attackpower[k].elixir_needed <= (current_elixiropp - elixirReserve)
  );
  if (affordableChars.length === 0) return;

  // ---------- Difficulty affects spawn targeting behavior ----------
  let focusBias; // % chance AI tries to target near your troops
  switch (aiDifficulty) {
    case "easy": focusBias = 0.3; break;     // 30% times near player
    case "medium": focusBias = 0.6; break;
    case "hard": focusBias = 0.8; break;
    case "extreme": focusBias = 1.0; break;  // always near player
  }

  for (let i = 0; i < spawnCount; i++) {
    const affordableNow = Object.keys(attackpower).filter(
      k => attackpower[k].elixir_needed <= (current_elixiropp - elixirReserve)
    );
    if (affordableNow.length === 0) break;

    // choose random card to spawn
    const char = affordableNow[getRandomInt(0, affordableNow.length - 1)];

    // choose focus based on bias
    let focus = null;
    if (ourList.length && Math.random() < focusBias) {
      focus = ourList[getRandomInt(0, ourList.length - 1)];
    }

    spawnWithAi(char, focus);
  }
}

// ====================================
// 🔹 AI Spawn Placement Logic
// ====================================
function spawnWithAi(char, focus) {
  let x, y;

  if (focus) {
    // try to spawn near target
    x = focus.x + getRandomInt(-60, 60);
    y = focus.y - getRandomInt(50, 100); // spawn slightly above target
  } else {
    // no focus — random in opponent area
    x = getRandomInt(60, canvas.width - playersize - 60);
    y = getRandomInt(100, 300);
  }

  // tighter spacing for higher difficulties
  const clampMargin = (aiDifficulty === "extreme") ? 20 : 0;

  x = clamp(x, 0 + clampMargin, canvas.width - playersize - clampMargin);
  y = clamp(y, 0 + clampMargin, Math.min(OPP_MAX_Y - playersize, canvas.height - playersize - clampMargin));

  const needed = attackpower[char].elixir_needed;
  if (current_elixiropp >= needed) {
    makeActive(char, x, y, 'opp');
  }
}

// ====================================
// 🔹 AI Spawn Scheduler (auto-runner)
// ====================================
let aiSpawnTimerId = null;

function scheduleAiSpawn() {
  if (!ai_mode) return;

  // difficulty affects reaction delay
  let delayRange;
  switch (aiDifficulty) {
    case "easy": delayRange = [5000, 7000]; break;
    case "medium": delayRange = [3000, 5000]; break;
    case "hard": delayRange = [2000, 3500]; break;
    case "extreme": delayRange = [1000, 2500]; break;
  }

  const delay = getRandomInt(delayRange[0], delayRange[1]);
  aiSpawnTimerId = setTimeout(() => {
    elexir_check();
    scheduleAiSpawn();
  }, delay);
}

function stopAiSpawn() {
  if (aiSpawnTimerId) {
    clearTimeout(aiSpawnTimerId);
    aiSpawnTimerId = null;
  }
}

// ====================================
// 🔹 Utility Functions
// ====================================
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

