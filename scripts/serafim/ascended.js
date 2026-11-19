'use strict';
// All attack events derive from music time, never wall-clock timers.
const ASCENDED = {origin:240.39, slot:12.8, names:['COROA DE PENAS','JULGAMENTO DUPLO','RELICÁRIOS EM ÓRBITA','PULSO DA ASCENSÃO']};
const ascendedLocks = new Map(), ascendedDeaths = new Map();
const ascendedArt = {};
function resetAscendedAttacks(){ascendedLocks.clear();ascendedDeaths.clear();}
function ascendedPoint(time,u,v){const p=serafimPosition(time),size=p.scale*444;return {x:p.x+u*size,y:p.y+v*size};}
function ascendedSlot(time){const index=Math.max(0,Math.floor((time-ASCENDED.origin+1e-7)/ASCENDED.slot));return {index,type:index%4,start:ASCENDED.origin+index*ASCENDED.slot,age:time-(ASCENDED.origin+index*ASCENDED.slot)};}
function ascendedDrone(time,id,index){const c=ascendedPoint(time,.5,.5),a=(time-ASCENDED.origin)*.65+index*Math.PI/2;return {id,x:c.x+Math.cos(a)*120,y:c.y+Math.sin(a)*106,radius:12};}
function ascendedFrame(age,launch=1.6){if(age<0)return 0;if(age<launch)return Math.min(3,Math.floor(age/launch*4));return Math.min(7,4+Math.floor((age-launch)/.25));}
function ascendedState(time){
 const state={pose:serafimPosition(time),beam:null,attackFrame:null,waves:[],featherCharges:[],drones:[],shots:[],pulse:null,droneDebris:[]};
 if(time<240||time>=304)return state;
 const slot=ascendedSlot(time);state.ascended=slot;state.spriteFrame=0;
 if(slot.age<0)return state;
 const {age,start,index,type}=slot;
 if(type===0){
  state.sprite='coroa';
  state.spriteFrame=ascendedFrame(age%3.2);
  if(age>=6.4)state.sprite=null;
  for(let volley=0;volley<2;volley++){
   const launch=start+1.6+volley*3.2,flight=time-launch;
   if(flight<0){if(flight>=-1.2)for(const uv of [[.08,.35],[.13,.65],[.9,.35],[.85,.65]])state.featherCharges.push(ascendedPoint(time,...uv));continue;}
   if(flight>5.6)continue;
   // Leave a broad, explicit horizontal corridor. Angles never home after launch.
   for(let i=0;i<10;i++){
    const offset=-.81+i*.18;if(Math.abs(offset)<.24)continue;
    const angle=Math.PI+offset,uv=i%2?[.10,.37]:[.14,.66],origin=ascendedPoint(launch,...uv);
    const speed=180,prev=Math.max(0,flight-1/30);
    state.waves.push({x:origin.x+Math.cos(angle)*speed*flight,y:origin.y+Math.sin(angle)*speed*flight,
     prevX:origin.x+Math.cos(angle)*speed*prev,prevY:origin.y+Math.sin(angle)*speed*prev,angle,radius:5,ascended:true});
   }
  }
 }else if(type===1){
  state.sprite='julgamento';
  const shot=Math.floor((age-.4)/2.4),local=age-.4-shot*2.4;
  if(shot>=0&&shot<2){
   state.spriteFrame=local<.4?Math.min(2,Math.floor(local/.4*3)):local<1.2?3:local<1.6?4:Math.min(7,5+Math.floor((local-1.6)/.26));
   if(local<1.6){
    const origin=ascendedPoint(time,...(state.spriteFrame<2?[.23,.69]:[.14,.52]));
    const key=index+':beam:'+shot;
    let record=ascendedLocks.get(key);
    if(local<.4||!record){record={angle:Math.atan2(ship.y-origin.y,ship.x-origin.x)};ascendedLocks.set(key,record);}
    const angle=record.angle;
    state.beam={...origin,dx:Math.cos(angle),dy:Math.sin(angle),live:local>=1.2,halfWidth:9,tracking:local<.4};
   }
  }else state.sprite=null;
 }else if(type===2){
  for(let i=0;i<4;i++){
   const id=10000+index*4+i,drone=ascendedDrone(time,id,i),dead=ascendedDeaths.get(id);
   let spriteFrame=Math.floor(time*5)%2;
   for(let round=0;round<2;round++){
    const launch=start+1.6+i*.4+round*2.4,flight=time-launch,key=id+':'+round;
    if(flight>=-.8&&flight<0)spriteFrame=flight<-.4?2:3;
    if(flight>=0&&flight<.3)spriteFrame=4+Math.floor(flight/.15);
    if(flight<0||flight>5.8||(dead&&launch>=dead.time))continue;
    let record=ascendedLocks.get(key);
    if(!record){const origin=ascendedDrone(launch,id,i);origin.x-=13;record={origin,angle:Math.atan2(ship.y-origin.y,ship.x-origin.x)};ascendedLocks.set(key,record);}
    if(!droneSoundsPlayed.has(key)){droneSoundsPlayed.add(key);if(flight<.1)playDroneShot();}
    const {origin,angle}=record,prev=Math.max(0,flight-1/30),speed=195;
    state.shots.push({x:origin.x+Math.cos(angle)*speed*flight,y:origin.y+Math.sin(angle)*speed*flight,
     prevX:origin.x+Math.cos(angle)*speed*prev,prevY:origin.y+Math.sin(angle)*speed*prev,angle,age:flight,origin,radius:5,ascended:true});
   }
   if(dead){const a=time-dead.time;if(a>=0&&a<.6)state.droneDebris.push({...dead,frame:a<.3?6:7});}
   else if(age<7.2&&(droneDamage.get(id)||0)<3)state.drones.push({...drone,spriteFrame});
  }
 }else{
  state.sprite='pulso';state.spriteFrame=ascendedFrame(age,2.4);if(age>=4)state.sprite=null;
  if(age>=2.4&&age<8.8){const origin=ascendedPoint(start+2.4,.51,.46);state.pulse={...origin,radius:(age-2.4)*170,width:10,gap:Math.PI,gapHalf:.48};}
  if(age<2.4)state.coreCharge=age/2.4;
 }
 return state;
}
function ascendedPulseTouches(pulse,x,y,margin=0){if(!pulse)return false;const dx=x-pulse.x,dy=y-pulse.y,dist=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),delta=Math.abs(Math.atan2(Math.sin(angle-pulse.gap),Math.cos(angle-pulse.gap)));
 return Math.abs(dist-pulse.radius)<=pulse.width/2+margin&&delta>=pulse.gapHalf;
}
function ascendedPulseHitsShip(pulse){
 if(!pulse)return false;
 // Match the same three hull rectangles used by beam and projectile collisions.
 for(const [l,t,r,b] of [[-25,-7,20,7],[-19,-13,-7,13],[20,-3,34,3]])
  for(let x=l;x<=r;x+=3)for(let y=t;y<=b;y+=3)
   if(ascendedPulseTouches(pulse,ship.x+x,ship.y+y,2))return true;
 return false;
}
function ascendedSprite(ctx,art,frame,x,y,size){if(!loadedArt(art))return;const cw=art.naturalWidth/4,ch=art.naturalHeight/2;ctx.drawImage(art,(frame%4)*cw,Math.floor(frame/4)*ch,cw,ch,x,y,size,size);}
function initAscendedArt(){for(const name of ['coroa','julgamento','pulso','relicarios'])ascendedArt[name]=loadArt('art/serafim/ascended/'+name+'.png');}
function drawAscendedCombat(time,state){
 const ctx=serafimLayer,p=state.pose,size=p.scale*444,slot=state.ascended;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(state.sprite&&loadedArt(ascendedArt[state.sprite]))ascendedSprite(ctx,ascendedArt[state.sprite],state.spriteFrame,p.x,p.y,size);
 else drawAscendedSerafim(time,state);
 if(state.coreCharge!==undefined){const c=ascendedPoint(time,.51,.46);ctx.globalAlpha=.3+.5*state.coreCharge;ctx.fillStyle='#edd6ff';ctx.beginPath();ctx.arc(c.x,c.y,3+state.coreCharge*9,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
 for(const c of state.featherCharges){ctx.fillStyle='#f0caff';ctx.fillRect(c.x-3,c.y-3,6,6);}
 for(const w of state.waves){ctx.save();ctx.translate(w.x,w.y);ctx.rotate(w.angle);ctx.fillStyle='#492657';ctx.fillRect(-22,-5,34,10);ctx.fillStyle='#eed4a8';ctx.fillRect(-17,-3,27,6);ctx.fillStyle='#fff4ff';ctx.fillRect(4,-2,9,4);if(loadedArt(serafimFeatherArt)){ctx.rotate(Math.PI);ctx.drawImage(serafimFeatherArt,-12,-5,26,10);}ctx.restore();}
 if(state.beam){const b=state.beam;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.dy,b.dx));
  if(b.live){ctx.fillStyle='#27112f';ctx.fillRect(0,-9,beamLength,18);ctx.fillStyle='#aa52d7';ctx.fillRect(0,-6,beamLength,12);ctx.fillStyle='#fff3ff';ctx.fillRect(0,-2,beamLength,4);}
  else{ctx.globalAlpha=b.tracking?.35:.8;ctx.strokeStyle='#e9c4ff';ctx.lineWidth=2;ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(beamLength,0);ctx.stroke();ctx.setLineDash([]);}
  ctx.globalAlpha=1;ctx.fillStyle='#fff2ff';ctx.fillRect(-3,-3,6,6);ctx.restore();}
 if(state.pulse){const ring=state.pulse;ctx.save();ctx.lineCap='butt';for(const [width,color] of [[14,'#281334'],[10,'#a956d4'],[3,'#fff2ff']]){ctx.lineWidth=width;ctx.strokeStyle=color;ctx.beginPath();ctx.arc(ring.x,ring.y,ring.radius,ring.gap+ring.gapHalf,ring.gap+Math.PI*2-ring.gapHalf);ctx.stroke();}ctx.restore();}
 ctx.restore();
 // Overlay keeps orbiting drones visible in front of wings. Invert once here; this canvas has no CSS inversion.
 ctx.save();ctx.filter='invert(1)';
 for(const d of state.drones)ascendedSprite(ctx,ascendedArt.relicarios,d.spriteFrame,d.x-20,d.y-20,40);
 for(const d of state.droneDebris)ascendedSprite(ctx,ascendedArt.relicarios,d.frame,d.x-24,d.y-24,48);
 for(const shot of state.shots){ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(shot.angle);ctx.globalAlpha=.5;ctx.fillStyle='#70d42a';ctx.fillRect(-32,-3,24,6);ctx.globalAlpha=1;ctx.fillStyle='#f6f0e8';ctx.fillRect(-13,-6,26,12);ctx.fillStyle='#7dce20';ctx.fillRect(-11,-4,22,8);ctx.fillStyle='#080812';ctx.fillRect(-8,-2,16,4);ctx.restore();}
 ctx.restore();
 ctx.save();ctx.fillStyle='#1c1129';ctx.fillRect(318,48,324,27);ctx.fillStyle='#f5e4c5';ctx.textAlign='center';ctx.font='bold 13px serif';ctx.fillText(slot&&slot.age>=0?ASCENDED.names[slot.type]:'SERAFIM ASCENDIDO',480,66);ctx.restore();
}
