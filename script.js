
// ── LOADER ───────────────────────────────────────────
(function(){
  const loader=document.getElementById('loader');
  const bar=document.getElementById('lbar');
  const pct=document.getElementById('lpct');
  let p=0;
  const iv=setInterval(()=>{
    p+=Math.random()*15;
    if(p>=100){p=100;clearInterval(iv);setTimeout(()=>loader.classList.add('done'),400)}
    bar.style.width=p+'%';
    pct.textContent=Math.floor(p)+'%';
  },80);
})();

// ── CURSOR ────────────────────────────────────────────
(function(){
  const cur=document.getElementById('cur');
  const ring=document.getElementById('cur-ring');
  const ct=document.getElementById('cur-text');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
  (function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';ct.style.left=mx+'px';ct.style.top=my+'px';requestAnimationFrame(loop)})();
  document.querySelectorAll('a,.stab,.hc-tag').forEach(el=>{
    const label=el.dataset.label||null;
    el.addEventListener('mouseenter',()=>{
      cur.style.width='16px';cur.style.height='16px';
      ring.style.width='56px';ring.style.height='56px';
      if(label){ct.textContent=label;ct.style.opacity='1';ct.style.transform='translate(-50%,-50%) translateY(-36px)'}
    });
    el.addEventListener('mouseleave',()=>{
      cur.style.width='8px';cur.style.height='8px';
      ring.style.width='36px';ring.style.height='36px';
      ct.style.opacity='0';ct.style.transform='translate(-50%,-50%) translateY(-30px)';
    });
  });
})();

// ── THREE.JS ─────────────────────────────────────────
(function(){
  const canvas=document.getElementById('c3d');
  const R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  R.setPixelRatio(Math.min(window.devicePixelRatio,2));
  R.setSize(window.innerWidth,window.innerHeight);
  const S=new THREE.Scene();
  const C=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
  C.position.z=6;

  // Particles
  const N=300,pos=new Float32Array(N*3),col=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    pos[i*3]=(Math.random()-.5)*40;pos[i*3+1]=(Math.random()-.5)*40;pos[i*3+2]=(Math.random()-.5)*25;
    const r=Math.random();
    if(r<.5){col[i*3]=0;col[i*3+1]=.9;col[i*3+2]=1}
    else if(r<.8){col[i*3]=.55;col[i*3+1]=.36;col[i*3+2]=.96}
    else{col[i*3]=.96;col[i*3+1]=.25;col[i*3+2]=.37}
  }
  const pg=new THREE.BufferGeometry();
  pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  pg.setAttribute('color',new THREE.BufferAttribute(col,3));
  S.add(new THREE.Points(pg,new THREE.PointsMaterial({size:.035,vertexColors:true,transparent:true,opacity:.6})));

// Cube
const cube=new THREE.Mesh(
  new THREE.BoxGeometry(3.5, 3.5, 3.5),
  new THREE.MeshBasicMaterial({color:0x00e5ff,wireframe:true,transparent:true,opacity:0.1})
);
cube.position.set(5,-1,-4);S.add(cube);

  // Icosahedron
  const ic=new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2,1),
    new THREE.MeshBasicMaterial({color:0x8b5cf6,wireframe:true,transparent:true,opacity:0.3})
  );
  ic.position.set(-6,2,-5);S.add(ic);

  // Dodecahedron
  const dc=new THREE.Mesh(
    new THREE.DodecahedronGeometry(1,0),
    new THREE.MeshBasicMaterial({color:0xf43f5e,wireframe:true,transparent:true,opacity:0.3})
  );
  dc.position.set(7,4,-6);S.add(dc);

  // Octahedron
  const oc=new THREE.Mesh(
    new THREE.OctahedronGeometry(0.7,0),
    new THREE.MeshBasicMaterial({color:0xf59e0b,wireframe:true,transparent:true,opacity:0.3})
  );
  oc.position.set(-4,-3,-3);S.add(oc);

  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{mx=(e.clientX/window.innerWidth-.5)*2;my=(e.clientY/window.innerHeight-.5)*2});
  window.addEventListener('resize',()=>{R.setSize(window.innerWidth,window.innerHeight);C.aspect=window.innerWidth/window.innerHeight;C.updateProjectionMatrix()});

  let t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=.004;
    pg.attributes.position.array.forEach((_,i)=>{if(i%3===1)pg.attributes.position.array[i]+=Math.sin(t+i)*.001});
    pg.attributes.position.needsUpdate=true;
    cube.rotation.x+=.002;
    cube.rotation.y+=.004;
    ic.rotation.x+=.003;ic.rotation.z+=.002;
    dc.rotation.y+=.005;dc.rotation.x+=.002;
    oc.rotation.y+=.007;oc.rotation.z+=.004;
    C.position.x+=(mx*.4-C.position.x)*.04;
    C.position.y+=(-my*.3-C.position.y)*.04;
    R.render(S,C);
  })();
})();

// ── SCROLL REVEAL ────────────────────────────────────
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('vis'),i*60)});
},{threshold:0.08});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

// ── METRIC BARS ──────────────────────────────────────
const mobs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.style.width=e.target.dataset.w});
},{threshold:0.3});
document.querySelectorAll('.metric-bar').forEach(el=>mobs.observe(el));

// ── SKILL TABS ───────────────────────────────────────
document.querySelectorAll('.stab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.stab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.skills-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    const panel=document.getElementById('panel-'+tab.dataset.tab);
    if(panel){
      panel.classList.add('active');
      // animate bars
      panel.querySelectorAll('.sk-fill').forEach(b=>{const w=b.dataset.w;b.style.width='0';setTimeout(()=>b.style.width=w,50)});
    }
  });
});
// Init first tab bars
document.querySelectorAll('#panel-frontend .sk-fill').forEach(b=>{
  const sobsF=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.style.width=e.target.dataset.w});},{threshold:0.3});
  sobsF.observe(b);
});

// ── NAV ACTIVE / SCROLL ──────────────────────────────
const nav=document.getElementById('nav');
const navLinks=document.querySelectorAll('.nav-link');
const sections=document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>80);
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-200)cur=s.id});
  navLinks.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+cur)});
});

