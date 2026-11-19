'use strict';
const FEATHERS = {accuracy:.70, tightDegrees:6, wideMin:8, wideMax:18,
  preparation:.28, stagger:.085, acceleration:.20, speed:275, sway:3, count:5};
const featherLaunches = new Map(), droneEmissions = new Map(), droneSoundsPlayed = new Set();
let attacksLastTime = -1, droneVoice = 0;
const droneVoices = Array.from({length:6},()=>new Audio('audio/sfx/enemies/crescent/crescent-shot.mp3'));
function resetSerafimAttacks(){featherLaunches.clear();droneEmissions.clear();droneSoundsPlayed.clear();attacksLastTime=-1;droneVoices.forEach(v=>v.pause());}
function wingPoint(time,index){const p=serafimPosition(time),points=[[75,170],[350,175],[118,268],[323,272],[230,90]],q=points[index%points.length];return{x:p.x+q[0]*p.scale,y:p.y+q[1]*p.scale};}
function featherPath(record,time){
 const age=Math.max(0,time-record.launch),a=FEATHERS.acceleration;
 const distance=FEATHERS.speed*(age<a?age*age/(2*a):age-a/2);
 const bend=12*(1-Math.exp(-age*9));
 const lateral=bend*record.side+FEATHERS.sway*Math.sin(age*7+record.phase)*(1-Math.exp(-age*8));
 return{x:record.origin.x+Math.cos(record.angle)*distance-Math.sin(record.angle)*lateral,
 y:record.origin.y+Math.sin(record.angle)*distance+Math.cos(record.angle)*lateral};
}
function directionalFeathers(state,time,beatIndex){
 for(let beat=beatIndex-16;beat<=beatIndex+1;beat++){
  const start=SERAFIM.beatOrigin+beat*SERAFIM.beatPeriod;
  if(![3,4,6].includes(beat%8)||start<(time >= SERAFIM.transformEnd ? SERAFIM.transformEnd : SERAFIM.combatStart)||time<start-FEATHERS.preparation||time-start>5)continue;
  let volley=featherLaunches.get(beat);
  if(!volley){if(time>start+.15)continue;volley={target:{x:ship.x,y:ship.y},pens:[]};
   for(let i=0;i<FEATHERS.count;i++){
    const side=i%2?-1:1,spread=Math.random()<FEATHERS.accuracy?(Math.random()*2-1)*FEATHERS.tightDegrees:side*(FEATHERS.wideMin+Math.random()*(FEATHERS.wideMax-FEATHERS.wideMin));
    volley.pens.push({launch:start+i*FEATHERS.stagger,index:(i+beat)%5,spread:spread*Math.PI/180,side,phase:Math.random()*Math.PI*2});
   }featherLaunches.set(beat,volley);
  }
  for(const pen of volley.pens){
   if(time<pen.launch){if(time>=pen.launch-FEATHERS.preparation)state.featherCharges.push(wingPoint(time,pen.index));continue;}
   if(!pen.origin){pen.origin=wingPoint(pen.launch,pen.index);pen.angle=Math.atan2(volley.target.y-pen.origin.y,volley.target.x-pen.origin.x)+pen.spread;}
   const pos=featherPath(pen,time),next=featherPath(pen,time+.005),prev=pen.previous||pen.origin;
   state.waves.push({...pos,prevX:prev.x,prevY:prev.y,angle:Math.atan2(next.y-pos.y,next.x-pos.x),radius:4});pen.previous=pos;
  }
 }
 for(const key of featherLaunches.keys())if(key<beatIndex-20)featherLaunches.delete(key);
}
function featherTouchesShip(wave){
 const px=wave.prevX??wave.x,py=wave.prevY??wave.y;
 const dx=wave.x-px,dy=wave.y-py,steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/3));
 for(let i=0;i<=steps;i++)if(shipTouches(px+dx*i/steps,py+dy*i/steps,wave.radius))return true;
 return false;
}
function playDroneShot(){if(!playing||death||audio.paused||audio.muted||!audio.volume)return;
 const voice=droneVoices[droneVoice++%droneVoices.length];voice.volume=audio.volume*.14;voice.muted=audio.muted;voice.currentTime=0;voice.play().catch(()=>{});
}
function drawDirectionalFeather(wave){g.save();g.translate(wave.x,wave.y);g.rotate(wave.angle+Math.PI);g.imageSmoothingEnabled=false;
 if(loadedArt(serafimFeatherArt))g.drawImage(serafimFeatherArt,-12,-6,24,12);g.restore();}
