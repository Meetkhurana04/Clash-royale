let players = ["chr_pekka_out","chr_wizard_out","chr_valkyrie_out","chr_giant_out"]
// Node structure
let sprite = ['chr_pekka_sprite_','chr_wizard_sprite_','chr_valkyrie_sprite_','chr_giant_sprite_']
class Node {
    //sprite = players + spritee
  constructor(num,baseURL,sprite) {
    this.num = num;
    this.img = new Image();
    // this.img.src = `${baseURL}chr_pekka_sprite_${num}.png`;
    this.img.src = `${baseURL}${sprite}${num}.png`
    this.next = null;
  }
}
let royals = { 
    chr_pekka_out: {},
    chr_wizard_out: {},
    chr_valkyrie_out: {},
    chr_giant_out: {}

}

//spritesheet.chr_pekka_out
// direct key ka naam
// if varaible ka derhe hote h oth [] 
const spritesheet ={
    chr_pekka_out : {
        walk:[125,112],
        walkopp:[150, 140],
        attack:[320,310],
        attackopp:[350,340],
    },
    chr_wizard_out : {
        walk:[125,112],
        walkopp:[150, 140],
        attack:[320,310],
        attackopp:[350,340]
    },
     chr_valkyrie_out: {
        walk:[152,145], //
        walkopp:[152, 145],
        attack:[152,145],
        attackopp:[174,164]//
    },
      chr_giant_out: {
        walk:[125,112],
        walkopp:[150, 140],
        attack:[320,310],
        attackopp:[350,340]
    }
}
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

const playersize = 200  ;

// hum animate me ek chr value derhe honge 
// chr me kya define hoga chr me hum name derhonge vlakyrie giant jiska naam denge uske do amne samne 
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
  activeplayers.push({
    id: `${type}_${Date.now()}`,  // unique
    type: type.toLowerCase(),     // to lookup royals[] animations
    chrKey : chrKey,
    opp : opp_or_not,
    x: x,
    y: y,
    dx: 2,
    dy: 2,
    health: 100,
    state: "walk",
    currentFrame: royals[chrKey].walk
    //  currentFrame: royals["chr_pekka_out"].walk  
  });
  
  

}



function gameloop() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
opp = {}
our = {}
// isko har second hi fresh bnana hoga isse kya hoga koi player
// mar jaayega toh uski id toh rhegi or baar baar pop bhi krna overhead h 
// isme kya hoga jo jo chijo acitve players me hogi woh woh chije hi filll horhi hogi 


 
 for (let player of activeplayers){
  
 if(player.opp === 'opp'){
    opp[player.id] = [player.x,player.y];
   
  }
  else{
    our[player.id]= [player.x,player.y];
 }
}

// if (player.opp === 'opp' && player.state === 'walk') {
//   player.state = 'walkopp';
//   player.currentFrame = royals[player.chrKey].walkopp;
// }
//   if(player.state ==='walkopp'){
//     player.y += player.dy; 
//   }

//     if(player.state === 'walk' ){
//      player.y -= player.dy; 
//     }

// Solution: Split into 2 passes
// Pass 1: opp aur our dict build karo. (sirf info collect karna)
// Pass 2: Har player ke liye uska nearest enemy nikaalo + move karao + draw karao
for (let player of activeplayers){
  // yeh har ek activeplayer ki trh chlega toh hume jo nearest find kran hoga 
  // nearest find jo krna hoga woh isplayer vs enemy group krna hoga
  // woh thoda beneficial rhega 
let target = []; // har baar target reset isse kya hoga ki naya target and dynamicness rahe 
//get nearest enemy ab bn gya h crazy fucnitno yeh agar me our ke liye call krugna toh opp dega
// opp ke liye call kru toh our dega
if(player.opp === 'opp'){
  target =  getNearestEnemy(player,our);
  // target.push({ id: 'ourking', x: 200, y: 200, dist:0 });
  // target.push({ id: 'ourking', x: 200, y: 200, dist:0 });
}
else{
  target = getNearestEnemy(player,opp);
  // yhi pe hum spritesheet ka difference dene ka try kar rhe honge 

// abhi maano woh kisi particualr player pe hi hoga jo opp ya our hoskta h 
}

if(target){
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
  
    
   ctx.drawImage(player.currentFrame.img, player.x, player.y, playersize, playersize);
   player.currentFrame = player.currentFrame.next;

 }// sbke loye image bandega jitne bhi aactive state h 
 // and then baadme hum requestanimateframe krenge ki recursion hojaaye 
// mtlb chije dubara se bne 
   setTimeout(() => requestAnimationFrame(gameloop), 100);

}
gameloop();

canvas.addEventListener("dragover", (event) => {
  event.preventDefault(); // default rokna zaroori hai
});

// Handle drop
canvas.addEventListener("drop", (event) => {
  event.preventDefault();

  const type = event.dataTransfer.getData("characterType");
  const opp_or_not = event.dataTransfer.getData("opp_or_not");
  // Canvas coordinates find karo
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  makeActive(type, x, y,opp_or_not); // spawn wahi hoga
});

function onDragStart(event, type , opp_or_not) {
  event.dataTransfer.setData("characterType", type );
  event.dataTransfer.setData("opp_or_not", opp_or_not );


}

//oppp //our
//our me kya h saare humare playera dn uske x y ki information
// hume ek aisa dynamic array bnanachaiye jo opp or our ki info  
//ek i ko pka ek character ko ab voh pure array ko traverse krega and find krega 
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
// nearest ka code jo player ko uhtayega and opp ke saare player me se ek near dega
// and yeh har frame ke liye chal rha hoga toh at that second woh turn bhi leskta h 

  for (let eid in enemyGroup) {
    let ex = enemyGroup[eid][0];
    let ey = enemyGroup[eid][1];

    let dx = ex - player.x;
    let dy = ey - player.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mindist) {
      mindist = dist;
      nearest = { id: eid, x: ex, y: ey, dist: dist };
    }
  }

  return nearest;
}

function spawnTower(type, x, y, opp_or_not) {
  const chrKey = `chr_${type.toLowerCase()}_out`;

  activeplayers.push({
    id: `${type}_${Date.now()}`,  // unique ID
    type: "tower",                // mark as tower
    chrKey: chrKey,
    opp: opp_or_not,
    x: x,
    y: y,
    dx: 0,                        // tower move nahi karega
    dy: 0,
    health: 2000,                 // zyada health
    state: "idle",
    currentFrame: { img: towerImage, next: null } // ek hi static frame
  });
}

window.onload = () => {
  // Our towers
  spawnTower("tower", 100, 350, "our");
  spawnTower("tower", 300, 350, "our");

  // Opp towers
  spawnTower("tower", 100, 50, "opp");
  spawnTower("tower", 300, 50, "opp");

};




















// function moveToTarget(x, y, oppx, oppy) {
//     while (!(Math.abs(x - oppx) <= 10 && Math.abs(y - oppy) <= 10)) {

//         // Agar x approx match ho jaye (10 pixels ke andar)
//         if (Math.abs(x - oppx) <= 10) {
//             // Y axis ke hisaab se move karo
//             if (y - oppy < 0) {
//                 console.log("Move Backward"); // target upar hai
//                 y += 1;
//             } else {
//                 console.log("Move Forward"); // target neeche hai
//                 y -= 1;
//             }
//         }

//         // Agar x abhi door hai
//         else {
//             if (x - oppx < 0) {
//                 console.log("Move Right"); // target right me hai
//                 x += 1;
//             } else {
//                 console.log("Move Left");  // target left me hai
//                 x -= 1;
//             }
//         }
//     }

//     console.log(`Reached near target: (${x}, ${y})`);
// }

// // Example
// moveToTarget(50, 50, 50, 250);






















// class Pekka {
//   constructor(x, y, w, h) {
//     this.ourspawn = {
//       rX:60+30,
//       rY:330+70,
//       lX:330+20,
//       lY:330+70
//      }
//      this.oppspawn = {
//      rX:75+20,
//      rY:60+100,
//      lX:330+20,
//      lY:60+100
//     }
//     this.x = x;
//     this.y = y;
//     this.dx = 20;
//     this.dy = 1.5;
//     this.health = 100;
//     this.attack = 50;
//     this.w = w;
//     this.h = h;
//   }
// }


// class valkyrie {
//   constructor(x, y, w, h) {
//     this.ourspawn = {
//       rX:60+30,
//       rY:330+70,
//       lX:330+20,
//       lY:330+70
//      }
//      this.oppspawn = {
//      rX:75+20,
//      rY:60+100,
//      lX:330+20,
//      lY:60+100
//     }
//     this.x = x;
//     this.y = y;
//     this.dx = 20;
//     this.dy = 1.5;
//     this.health = 100;
//     this.attack = 50;
//     this.w = w;
//     this.h = h;
//   }
// }

// class wizard {
//   constructor(x, y, w, h) {
//     this.ourspawn = {
//       rX:60+30,
//       rY:330+70,
//       lX:330+20,
//       lY:330+70
//      }
//      this.oppspawn = {
//      rX:75+20,
//      rY:60+100,
//      lX:330+20,
//      lY:60+100
//     }
//     this.x = x;
//     this.y = y;
//     this.dx = 20;
//     this.dy = 1.5;
//     this.health = 100;
//     this.attack = 50;
//     this.w = w;
//     this.h = h;
//   }
// }

// class giant {
//   constructor(x, y, w, h) {
//     this.ourspawn = {
//       rX:60+30,
//       rY:330+70,
//       lX:330+20,
//       lY:330+70
//      }
//      this.oppspawn = {
//      rX:75+20,
//      rY:60+100,
//      lX:330+20,
//      lY:60+100
//     }
//     this.x = x;
//     this.y = y;
//     this.dx = 20;
//     this.dy = 1.5;
//     this.health = 100;
//     this.attack = 50;
//     this.w = w;
//     this.h = h;
//   }
// }