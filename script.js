
/* ── STARS ── */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
 
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildStars();
}
 
function buildStars(){
  stars = [];
  for(let i=0;i<160;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.8+0.3,
      o: Math.random(),
      s: (Math.random()-0.5)*0.008,
      twinkleSpeed: 0.005+Math.random()*0.015
    });
  }
}
 
function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(s=>{
    s.o += s.twinkleSpeed;
    const op = (Math.sin(s.o)+1)/2;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(168,200,240,${op*0.75})`;
    ctx.fill();
    if(s.r>1.2){
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r+2,0,Math.PI*2);
      ctx.fillStyle=`rgba(74,144,217,${op*0.1})`;
      ctx.fill();
    }
  });
  requestAnimationFrame(drawStars);
}
 
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();
 
/* ── PARALLAX BG ── */
document.addEventListener('mousemove', e=>{
  const mx = (e.clientX/window.innerWidth*100).toFixed(1)+'%';
  const my = (e.clientY/window.innerHeight*100).toFixed(1)+'%';
  document.getElementById('bg').style.setProperty('--mx',mx);
  document.getElementById('bg').style.setProperty('--my',my);
});
 
/* ── LANTERNS ── */
function lanternSVG(c1,c2){
  return `<svg width="28" height="52" viewBox="0 0 28 52" xmlns="http://www.w3.org/2000/svg">
    <line x1="14" y1="0" x2="14" y2="7" stroke="${c1}" stroke-width="1.2"/>
    <ellipse cx="14" cy="9" rx="6" ry="2.5" fill="${c1}" opacity="0.6"/>
    <path d="M8,12 Q5,26 8,40 Q14,46 20,40 Q23,26 20,12 Z" fill="${c2}" opacity="0.8"/>
    <line x1="8" y1="12" x2="20" y2="12" stroke="${c1}" stroke-width="0.8"/>
    <line x1="8" y1="40" x2="20" y2="40" stroke="${c1}" stroke-width="0.8"/>
    <line x1="14" y1="12" x2="14" y2="40" stroke="${c1}" stroke-width="0.6" opacity="0.4"/>
    <ellipse cx="14" cy="40" rx="6" ry="2.5" fill="${c1}" opacity="0.6"/>
    <ellipse cx="14" cy="26" rx="2.5" ry="3.5" fill="rgba(100,180,255,0.6)"/>
    <line x1="14" y1="42" x2="14" y2="50" stroke="${c1}" stroke-width="1.2"/>
    <line x1="9" y1="50" x2="19" y2="50" stroke="${c1}" stroke-width="1.2"/>
  </svg>`;
}
 
const cols=[
  ['#4a90d9','rgba(30,79,216,0.55)'],
  ['#a8c8f0','rgba(74,144,217,0.45)'],
  ['#1e4fd8','rgba(10,30,90,0.6)'],
  ['#ddeeff','rgba(168,200,240,0.38)'],
];
const lWrap=document.getElementById('lanterns');
for(let i=0;i<12;i++){
  const div=document.createElement('div');
  div.className='lan';
  const [c1,c2]=cols[i%cols.length];
  div.innerHTML=lanternSVG(c1,c2);
  const dur=11+Math.random()*10;
  div.style.cssText=`
    left:${5+Math.random()*88}%;
    top:${Math.random()*85}%;
    --ld:${dur}s;
    --ldelay:-${Math.random()*dur}s;
    transform:scale(${0.55+Math.random()*0.85});
    opacity:${0.4+Math.random()*0.45};
  `;
  lWrap.appendChild(div);
}
 
/* ── MODAL ── */
function openCard(){
  const ov=document.getElementById('overlay');
  ov.classList.add('open');
  const c=document.getElementById('card');
  c.style.animation='none';
  void c.offsetWidth;
  c.style.animation='';
}
function closeCard(){
  document.getElementById('overlay').classList.remove('open');
}
function handleOverlay(e){
  if(e.target===document.getElementById('overlay')) closeCard();
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeCard(); });
 
/* ── MUSIC ── */
let ac=null, playing=false;
const mb=document.getElementById('musicBtn');
mb.addEventListener('click',()=>{
  if(!playing){
    if(!ac) ac=new(window.AudioContext||window.webkitAudioContext)();
    if(ac.state==='suspended') ac.resume();
    [[110,.05],[165,.03],[220,.025],[330,.02],[440,.015]].forEach(([f,g])=>{
      const o=ac.createOscillator(),gn=ac.createGain();
      o.type='sine'; o.frequency.value=f;
      gn.gain.value=g;
      o.connect(gn); gn.connect(ac.destination);
      o.start();
    });
    playing=true; mb.textContent='🔕'; mb.classList.add('on');
  } else {
    ac.suspend(); playing=false; mb.textContent='🎵'; mb.classList.remove('on');
  }
});
 
/* ── ENTRANCE CLEANUP ── */
setTimeout(()=>{
  const e=document.getElementById('entrance');
  if(e){ e.style.display='none'; }
},4000);
