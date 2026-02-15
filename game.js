const c = document.getElementById("game");
const ctx = c.getContext("2d");

const FIELD = { w: c.width, h: c.height };
const GOAL = { left: 6, right: FIELD.w-6 };

let time = 120, pScore=0, eScore=0;
setInterval(()=> time>0 && time--, 1000);

const key = {};
document.addEventListener("keydown",e=>key[e.key]=true);
document.addEventListener("keyup",e=>key[e.key]=false);

function makeTeam(xStart, color){
  let arr=[];
  for(let i=0;i<10;i++){
    arr.push({x:xStart,y:60+i*45,w:14,h:14,color,st:100});
  }
  return arr;
}

let playerTeam = makeTeam(180,"#3b82f6");
let enemyTeam  = makeTeam(780,"#ef4444");
let keeperP = {x:40,y:FIELD.h/2,w:16,h:50};
let keeperE = {x:FIELD.w-56,y:FIELD.h/2,w:16,h:50};

let ball = {x:FIELD.w/2,y:FIELD.h/2,r:7,dx:0,dy:0};

// kontrol pemain utama (index 5)
function control(){
  let p = playerTeam[5];
  let spd = key["Shift"] && p.st>0 ? 4.5 : 3;
  if(key["w"]) p.y-=spd;
  if(key["s"]) p.y+=spd;
  if(key["a"]) p.x-=spd;
  if(key["d"]) p.x+=spd;
  if(key["Shift"] && (key["w"]||key["a"]||key["s"]||key["d"])) p.st-=0.3;
  if(key[" "]) shoot(p,0.6);
  if(key["e"]) skill(p);
  p.st=Math.max(0,Math.min(100,p.st));
  document.getElementById("stam").innerText=p.st.toFixed(0);
}

function skill(p){
  if(Math.hypot(ball.x-(p.x+7), ball.y-(p.y+7))<18){
    ball.dx*=1.2; ball.dy*=1.2;
  }
}

function shoot(p,power){
  let dx=ball.x-(p.x+7), dy=ball.y-(p.y+7);
  if(Math.abs(dx)<18 && Math.abs(dy)<18){
    ball.dx=dx*power; ball.dy=dy*power;
  }
}

function aiTeam(team){
  team.forEach(p=>{
    p.x += (ball.x-p.x)*0.01;
    p.y += (ball.y-p.y)*0.02;
    shoot(p,0.45);
  });
}

function keeperAI(k){
  k.y += (ball.y-k.y)*0.15;
}

function updateBall(){
  ball.x+=ball.dx; ball.y+=ball.dy;
  ball.dx*=0.98; ball.dy*=0.98;

  if(ball.y<5||ball.y>FIELD.h-5) ball.dy*=-1;

  if(ball.x<GOAL.left){ eScore++; reset(); }
  if(ball.x>GOAL.right){ pScore++; reset(); }
}

function reset(){
  ball.x=FIELD.w/2; ball.y=FIELD.h/2;
  ball.dx=ball.dy=0;
}

function rain(){
  for(let i=0;i<60;i++){
    ctx.strokeStyle="rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(Math.random()*FIELD.w,Math.random()*FIELD.h);
    ctx.lineTo(Math.random()*FIELD.w,Math.random()*FIELD.h+10);
    ctx.stroke();
  }
}

function draw(){
  ctx.clearRect(0,0,FIELD.w,FIELD.h);

  // garis tengah
  ctx.strokeStyle="#fff";
  ctx.beginPath();
  ctx.moveTo(FIELD.w/2,0);
  ctx.lineTo(FIELD.w/2,FIELD.h);
  ctx.stroke();

  // pemain
  playerTeam.forEach(p=>{
    ctx.fillStyle=p.color;
    ctx.fillRect(p.x,p.y,p.w,p.h);
  });
  enemyTeam.forEach(p=>{
    ctx.fillStyle=p.color;
    ctx.fillRect(p.x,p.y,p.w,p.h);
  });

  // kiper
  ctx.fillStyle="#22c55e";
  ctx.fillRect(keeperP.x,keeperP.y,keeperP.w,keeperP.h);
  ctx.fillRect(keeperE.x,keeperE.y,keeperE.w,keeperE.h);

  // bola
  ctx.fillStyle="#fff";
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
  ctx.fill();

  rain();

  document.getElementById("time").innerText=time;
  document.getElementById("pScore").innerText=pScore;
  document.getElementById("eScore").innerText=eScore;
}

function loop(){
  if(time<=0) return;
  control();
  aiTeam(enemyTeam);
  keeperAI(keeperP);
  keeperAI(keeperE);
  updateBall();
  draw();
  requestAnimationFrame(loop);
}
loop();
