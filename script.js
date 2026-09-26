const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ===== CONFIG ===== */
const SITE_CONFIG = window.SHEJAL_CONFIG || {replyEndpoint:""};

/* ===== BASIC SCROLL ACTIONS ===== */
$$('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

/* ===== QUIZ ===== */
const questions=[
 {q:"Be honest… who is the bigger headache in this friendship? 😂",a:["Obviously Mohit","Obviously Shejal","Both are equally problematic","This question is unfair 😭"],correct:3,ok:"Correct. The question WAS unfair. 😌"},
 {q:"How many times have you promised me “I'll send you the pictures later”? 😂",a:["2–3 times","10+ times","I don't remember 😌","Nice try. I'm not exposing myself."],correct:1,ok:"The evidence says 10+. The defence rests. 💀"},
 {q:"If I ask you AGAIN to meet, what are you most likely to say? 😂",a:["Yes, finally!","I'll see…","I'm busy.","Ask my parents first. 💀"],correct:1,ok:"Exactly. “I'll see…” — the national anthem of this friendship. 😂"},
 {q:"Who usually starts the conversation? 👀",a:["Shejal","Mohit","Whoever remembers the other person exists 😂","Nobody. We communicate telepathically."],correct:1,ok:"Correct. I have accepted my destiny. 😭"},
 {q:"What was Mohit thinking after the legendary “Namaste Didi” incident? 😂",a:["Harami, bas bezzati karati haii 😭","Mere yaha aane se pehle bhi bata sakti thi ye 😭","Why are they laughing at me?","All of the above"],correct:1,ok:"YES. THAT EXACT THOUGHT. 😂"}
];
let qi=0;
let quizScore=0;
const quizAnswers=[];

function syncQuizMeta(){
  const scoreInput=$('#quizScoreHidden');
  const answersInput=$('#quizAnswersHidden');
  if(scoreInput) scoreInput.value=`${quizScore}/${questions.length}`;
  if(answersInput) answersInput.value=quizAnswers.map((a,i)=>`Q${i+1}:${a}`).join(' | ');
}

function renderQ(){
 const q=questions[qi],box=$('#questionBox');
 if(!q || !box) return;
 $('#progressBar').style.width=((qi)/questions.length*100)+'%';
 box.innerHTML=`<div class="q-count">Question ${qi+1} / ${questions.length}</div><div class="question">${q.q}</div><div class="answers">${q.a.map((x,i)=>`<button class="answer" type="button" data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('')}</div>`;
 $('#quizResult').textContent=`Score: ${quizScore} / ${questions.length}`;
 $$('.answer').forEach(btn=>btn.addEventListener('click',()=>answer(+btn.dataset.i),{once:true}));
}

function answer(i){
 const q=questions[qi],buttons=$$('.answer');
 if(!q || !buttons.length) return;
 buttons.forEach(b=>b.disabled=true);
 buttons[q.correct]?.classList.add('correct');
 if(i!==q.correct) buttons[i]?.classList.add('wrong');
 if(i===q.correct) quizScore++;
 quizAnswers.push(i===q.correct ? `Correct (${String.fromCharCode(65+i)})` : `Wrong (${String.fromCharCode(65+i)}; correct ${String.fromCharCode(65+q.correct)})`);
 syncQuizMeta();
 $('#quizResult').textContent=`${i===q.correct?q.ok:'Wrong. But honestly, I\'ll allow it. 😂'}  ·  Score: ${quizScore}/${questions.length}`;
 window.setTimeout(()=>{
   qi++;
   if(qi<questions.length){
     renderQ();
   }else{
     $('#progressBar').style.width='100%';
     $('#questionBox').innerHTML=`<div class="q-count">TEST COMPLETE</div><div class="quiz-final-score"><span>Your friendship-audit score</span><strong>${quizScore} / ${questions.length}</strong><small>${quizScore===questions.length?'Perfect score. Suspiciously impressive. 😌':quizScore>=3?'Not bad. The friendship survives another audit. 😂':'Okay… we clearly need another 15 years of friendship training. 😭'}</small></div><button class="primary-btn" type="button" data-scroll="#secret">There is still something →</button>`;
     $('#quizResult').textContent=`Final result: ${quizScore}/${questions.length}. Your answers will also be included with your reply.`;
     $('#questionBox .primary-btn')?.addEventListener('click',()=>$('#secret')?.scrollIntoView({behavior:'smooth'}),{once:true});
     syncQuizMeta();
   }
 },700);
}
renderQ();

/* ===== SECRET ===== */
$('#secretBtn')?.addEventListener('click',()=>{
 $('#secretMessage')?.classList.add('show');
 const btn=$('#secretBtn'); if(btn) btn.style.display='none';
});

/* ===== SOFT LAUNCH MODAL ===== */
(()=>{
 const modal=$('#softLaunchModal');
 const openBtn=$('#openSoftLaunch');
 const closeBtn=$('#softLaunchClose');
 const yes=$('#softReplyYes');
 const later=$('#softReplyLater');
 const reply=$('#reply');
 let returnFocus=null;
 const open=()=>{
   if(!modal) return;
   returnFocus=document.activeElement;
   modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
   document.body.style.overflow='hidden';
   window.setTimeout(()=>closeBtn?.focus(),50);
 };
 const close=()=>{
   modal?.classList.remove('open'); modal?.setAttribute('aria-hidden','true'); document.body.style.overflow='';
   returnFocus?.focus?.();
 };
 openBtn?.addEventListener('click',open);
 closeBtn?.addEventListener('click',close);
 modal?.addEventListener('click',e=>{if(e.target.dataset.softClose!==undefined) close();});
 yes?.addEventListener('click',()=>{close(); reply?.scrollIntoView({behavior:'smooth'}); window.setTimeout(()=>$('#softAnswer')?.focus(),500);});
 later?.addEventListener('click',()=>{close(); reply?.scrollIntoView({behavior:'smooth'}); window.setTimeout(()=>{const sel=$('#softAnswer'); if(sel){sel.focus();sel.value='Maybe… let me think. 😭';}},500);});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open')) close();});
 // Open once when the dedicated section becomes relevant.
 const section=$('#soft-launch');
 if(section && 'IntersectionObserver' in window){
   const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){io.disconnect();window.setTimeout(open,650);}}, {threshold:.45});
   io.observe(section);
 }
})();

/* ===== HONEST FINAL QUESTION ===== */
const noBtn=$('#noBtn'),noText=$('#noText'),choiceArea=document.querySelector('.choice-area');
let noClicks=0;
let lastDodge=0;

function dodgeNoButton(pointerX=null,pointerY=null){
  if(!noBtn || !choiceArea) return;
  const now=performance.now();
  if(now-lastDodge<220) return;
  lastDodge=now;
  noClicks++;

  const messages=[
    'Are you sure? 👀',
    'Think again. 😭',
    'That button is suspiciously fast. 😂',
    'NO is trying to escape the conversation. 💀',
    'Nice try. 😌'
  ];
  if(noText) noText.textContent=messages[Math.min(noClicks-1,messages.length-1)];

  const areaRect=choiceArea.getBoundingClientRect();
  const btnRect=noBtn.getBoundingClientRect();
  const pad=8;
  const maxX=Math.max(0,(areaRect.width-btnRect.width)/2-pad);
  const maxY=Math.max(0,(areaRect.height-btnRect.height)/2-pad);

  // Keep the button inside the choice area and, when possible, away from the pointer.
  let x=0,y=0;
  for(let n=0;n<18;n++){
    x=(Math.random()*2-1)*maxX;
    y=(Math.random()*2-1)*maxY;
    if(pointerX==null || pointerY==null) break;
    const targetX=areaRect.left+areaRect.width/2+x;
    const targetY=areaRect.top+areaRect.height/2+y;
    if(Math.hypot(targetX-pointerX,targetY-pointerY)>110) break;
  }
  noBtn.style.position='absolute';
  noBtn.style.left='50%';
  noBtn.style.top='50%';
  noBtn.style.transform=`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

noBtn?.addEventListener('pointerenter',e=>dodgeNoButton(e.clientX,e.clientY));
choiceArea?.addEventListener('pointermove',e=>{
  if(!noBtn || e.pointerType==='touch') return;
  const r=noBtn.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  if(Math.hypot(e.clientX-cx,e.clientY-cy)<115) dodgeNoButton(e.clientX,e.clientY);
},{passive:true});
noBtn?.addEventListener('touchstart',e=>{e.preventDefault();dodgeNoButton(e.touches[0]?.clientX,e.touches[0]?.clientY);},{passive:false});
noBtn?.addEventListener('click',e=>{e.preventDefault();dodgeNoButton(e.clientX,e.clientY);});

$('#yesBtn')?.addEventListener('click',()=>{
 $('#finale').style.display='none';
 const c=$('#celebration'); c.classList.add('active'); c.scrollIntoView({behavior:'smooth'}); launchConfetti();
});

function launchConfetti(){
 const canvas=$('#confetti'),ctx=canvas.getContext('2d');
 let W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
 const resize=()=>{W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);};
 resize();
 const pieces=Array.from({length:120},()=>({x:Math.random()*W,y:-20-Math.random()*H*.4,r:3+Math.random()*4,v:2+Math.random()*4,a:Math.random()*Math.PI*2,s:(Math.random()-.5)*.08}));
 let start=performance.now();
 function frame(t){
   ctx.clearRect(0,0,W,H);
   pieces.forEach(p=>{p.y+=p.v;p.x+=Math.sin(t/500+p.x)*.6;p.a+=p.s;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=['#f2a9ca','#c9a6ee','#f4d6a0','#b4e0d0','#ffffff'][Math.floor(Math.random()*5)];ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2);ctx.restore();if(p.y>H+20)p.y=-20;});
   if(t-start<7000) requestAnimationFrame(frame); else ctx.clearRect(0,0,W,H);
 }
 addEventListener('resize',resize,{passive:true}); requestAnimationFrame(frame);
}

/* ===== ADVANCED PAGE UI ===== */
(()=>{
 const loader=$('#pageLoader'),progress=$('#readingProgress'),backTop=$('#backTop'),toast=$('#toast');
 const lightbox=$('#lightbox'),lightboxImage=$('#lightboxImage'),lightboxTitle=$('#lightboxTitle'),lightboxText=$('#lightboxText'),lightboxIndex=$('#lightboxIndex');
 const close=$('#lightboxClose'),prev=$('#lightboxPrev'),next=$('#lightboxNext');
 let gallery=[],current=0,toastTimer;
 addEventListener('load',()=>window.setTimeout(()=>loader?.classList.add('hidden'),180),{once:true});
 let scrollTick=false;
 const updateScrollUI=()=>{
   const max=document.documentElement.scrollHeight-innerHeight,pct=max>0?(scrollY/max)*100:0;
   if(progress) progress.style.width=pct+'%';
   backTop?.classList.toggle('show',scrollY>innerHeight*.65);
   scrollTick=false;
 };
 addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(updateScrollUI);scrollTick=true;}},{passive:true});
 updateScrollUI(); backTop?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
 const revealItems=document.querySelectorAll('[data-reveal]');
 if('IntersectionObserver' in window){
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
   revealItems.forEach(el=>io.observe(el));
 }else revealItems.forEach(el=>el.classList.add('revealed'));
 const images=[...document.querySelectorAll('.photo-card img,.place-card img,.final-photo')];
 gallery=images.map((img,i)=>{
   const card=img.closest('figure,.place-card,.celebration-content');
   const title=card?.querySelector('figcaption b')?.textContent?.trim()||(img.closest('.place-card')?'Favourite place':'Shejal');
   const fallback=card?.querySelector('figcaption span')?.textContent?.trim()||img.dataset.caption||img.alt;
   img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Open photo: '+(img.alt||'Shejal'));
   return {img,src:img.currentSrc||img.src,alt:img.alt,title,text:fallback};
 });
 function show(index){if(!gallery.length)return;current=(index+gallery.length)%gallery.length;const item=gallery[current];lightboxImage.src=item.src;lightboxImage.alt=item.alt;lightboxTitle.textContent=item.title;lightboxText.textContent=item.text;lightboxIndex.textContent=`Photo ${current+1} of ${gallery.length}`;prev.disabled=gallery.length<2;next.disabled=gallery.length<2;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
 function hide(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';window.setTimeout(()=>{if(!lightbox.classList.contains('open'))lightboxImage.src='';},300);}
 images.forEach((img,i)=>{img.addEventListener('click',()=>show(i));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i);}});});
 close?.addEventListener('click',hide);prev?.addEventListener('click',e=>{e.stopPropagation();show(current-1)});next?.addEventListener('click',e=>{e.stopPropagation();show(current+1)});lightbox?.addEventListener('click',e=>{if(e.target===lightbox)hide();});
 addEventListener('keydown',e=>{if(!lightbox?.classList.contains('open'))return;if(e.key==='Escape')hide();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);});
 let touchX=0;lightbox?.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});lightbox?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)show(current+(dx<0?1:-1));},{passive:true});
 const gallerySection=$('#photos');
 if(gallerySection&&'IntersectionObserver'in window){const hint=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){toast.textContent='Tap a photo to open it ✨';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);hint.disconnect();}},{threshold:.3});hint.observe(gallerySection);}
})();

/* ===== LAZY VIDEO LOADING ===== */
(()=>{
 const videos=[...document.querySelectorAll('video[data-src]')];
 const loadVideo=(video)=>{
   if(video.dataset.loaded==='true')return;
   const source=video.querySelector('source[data-src]');
   if(source){source.src=source.dataset.src;source.removeAttribute('data-src');}
   video.load();video.dataset.loaded='true';
 };
 if('IntersectionObserver'in window){
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){loadVideo(e.target);io.unobserve(e.target);}}),{rootMargin:'450px 0px'});
   videos.forEach(v=>io.observe(v));
 }else videos.forEach(loadVideo);
 const birthday=$('#birthdayVideo'),play=$('#birthdayPlay'),frame=document.querySelector('.birthday-video-frame');
 if(birthday&&play&&frame){
   const sync=()=>{const playing=!birthday.paused&&!birthday.ended;frame.classList.toggle('playing',playing);play.setAttribute('aria-label',playing?'Pause birthday video':'Play birthday video');play.querySelector('span').textContent=playing?'Ⅱ':'▶';};
   const toggle=e=>{e?.preventDefault();if(birthday.dataset.loaded!=='true')loadVideo(birthday);if(birthday.paused||birthday.ended)birthday.play().catch(()=>{});else birthday.pause();};
   play.addEventListener('click',toggle);birthday.addEventListener('click',toggle);birthday.addEventListener('play',sync);birthday.addEventListener('pause',sync);birthday.addEventListener('ended',sync);sync();
 }
})();

/* ===== REPLY FORM ===== */
(()=>{
 const form=$('#replyForm'),status=$('#replyStatus'),submit=$('#replySubmit'),count=$('#charCount'),extra=$('#extraMessage');
 if(!form)return;
 form.action=SITE_CONFIG.replyEndpoint||'';
 const updateCount=()=>{if(count&&extra)count.textContent=extra.value.length;};
 extra?.addEventListener('input',updateCount);updateCount();
 syncQuizMeta();
 form.addEventListener('submit',e=>{
   if(!SITE_CONFIG.replyEndpoint){e.preventDefault();status.textContent='Reply service is not configured yet. Replace the endpoint in config.js with your FormSubmit URL.';status.className='reply-status error';return;}
   const required=[...form.querySelectorAll('[required]')];
   const missing=required.find(el=>!el.value);
   if(missing){e.preventDefault();missing.focus();status.textContent='Please answer both questions before sending. ❤️';status.className='reply-status error';return;}
   if(form.querySelector('input[name="_honey"]')?.value){e.preventDefault();return;}
   syncQuizMeta();
   submit.disabled=true;submit.textContent='Sending…';status.textContent='Sending your reply…';status.className='reply-status';
   // FormSubmit posts into a hidden iframe, so keep the page in place.
   window.setTimeout(()=>{
     status.textContent='Your reply was sent. Thank you for being honest. ❤️';
     status.className='reply-status success';
     submit.disabled=false;
     submit.textContent='Send my reply 💌';
     form.reset();
     updateCount();
     syncQuizMeta();
   },1600);
 });
})();
