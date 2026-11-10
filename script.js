/* =====================================================
   SCRIPT.JS - how to edit
   1. TOOLS: add or rename tools (icon + sticker color).
   2. SERVICE CARDS: the "S" list.
   3. TYPED WORDS: the "roles" list in the hero.
   4. EMAIL: FORM_URL (section 7) and the address in index.html.
   ===================================================== */
(function(){
  var $=function(i){return document.getElementById(i)};
  var D="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";

  /* 1. TOOLS: name -> [icon, sticker color]
     The icon can be a Devicon file path, a full https:// link, a local
     path like ./assets/icons/x.svg, or an embedded data: URI. */
  var T={
    Python:["python/python-original.svg","#ffe873"],
    Docker:["docker/docker-original.svg","#9fd4ff"],
    Kubernetes:["kubernetes/kubernetes-plain.svg","#b8c4ff"],
    Terraform:["terraform/terraform-original.svg","#d3b8ff"],
    AWS:["./assets/aws-logo.png","#ffc58a"],
    Jenkins:["jenkins/jenkins-original.svg","#ffb3b3"],
    Git:["git/git-original.svg","#ffcfa8"],
    Linux:["linux/linux-original.svg","#fff0a0"]
  };

  /* 2. SERVICE CARDS: ["Title", "Description", ["Tool", "Tool"]] */
  var S=[
    ["Python automation","Scripts and backend code that remove manual work and move data reliably.",["Python","Git"]],
    ["CI/CD pipelines","Automated build, test and release flows so changes ship safely.",["Jenkins","Git"]],
    ["Infrastructure as code","Repeatable cloud environments defined in code and kept in version control.",["Terraform","AWS"]],
    ["Containers & orchestration","Packaged apps running on Kubernetes, on Linux hosts.",["Docker","Kubernetes","Linux"]]
  ];
  $("svc").innerHTML=S.map(function(s){
    return '<article class="card"><h3>'+s[0]+'</h3><p>'+s[1]+'</p><div class="chips">'+
      s[2].map(function(t){return '<span>'+t+'</span>'}).join("")+'</div></article>';
  }).join("");

  /* 3. TYPED WORDS in the hero */
  var roles=["Python automation","CI/CD pipelines","cloud infrastructure","data pipelines"],el=$("typed"),ri=0,ci=0,del=false;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=roles[0]}else{
    (function tick(){
      var w=roles[ri],s=del?35:75;ci+=del?-1:1;el.textContent=w.slice(0,ci);
      if(!del&&ci===w.length){del=true;s=1400}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;s=350}
      setTimeout(tick,s);
    })();
  }

  /* 4. PLAYGROUND: draggable stickers */
  var pg=$("pg"),stk=[],Z=10;
  Object.keys(T).forEach(function(n){
    var e=document.createElement("div");e.className="stk";e.style.background=T[n][1];
    e.innerHTML='<img src="'+(/^(data:|https?:|\.)/.test(T[n][0])?T[n][0]:D+T[n][0])+'" alt=""><span>'+n+'</span>';
    pg.appendChild(e);stk.push(e);makeDraggable(e);
  });
  function rot(){return "rotate("+(Math.random()*14-7)+"deg)"}
  /* neat grid with a little wobble (runs on load and on resize) */
  function layout(){
    var W=pg.clientWidth,w=118,h=112,cols=Math.max(2,Math.floor(W/(w+16))),gap=(W-cols*w)/(cols+1),rows=Math.ceil(stk.length/cols);
    pg.style.height=(rows*(h+18)+34)+"px";
    stk.forEach(function(e,i){
      e.style.left=(gap+(i%cols)*(w+gap)+Math.random()*12-6)+"px";
      e.style.top=(18+Math.floor(i/cols)*(h+18)+Math.random()*8-4)+"px";
      e.style.transform=rot();
    });
  }
  /* shuffle button throws them anywhere inside the box */
  $("shuffle").onclick=function(){
    stk.forEach(function(e){
      e.style.left=Math.random()*(pg.clientWidth-e.offsetWidth)+"px";
      e.style.top=Math.random()*(pg.clientHeight-e.offsetHeight)+"px";
      e.style.transform=rot();
    });
  };
  function makeDraggable(e){
    var sx,sy,ox,oy;
    e.addEventListener("pointerdown",function(ev){
      e.setPointerCapture(ev.pointerId);sx=ev.clientX;sy=ev.clientY;ox=e.offsetLeft;oy=e.offsetTop;
      e.classList.add("grab");e.style.zIndex=++Z;
    });
    e.addEventListener("pointermove",function(ev){
      if(!e.hasPointerCapture(ev.pointerId))return;
      e.style.left=Math.max(0,Math.min(pg.clientWidth-e.offsetWidth,ox+ev.clientX-sx))+"px";
      e.style.top=Math.max(0,Math.min(pg.clientHeight-e.offsetHeight,oy+ev.clientY-sy))+"px";
    });
    e.addEventListener("pointerup",function(){e.classList.remove("grab")});
  }
  layout();
  var lw=pg.clientWidth;
  addEventListener("resize",function(){if(pg.clientWidth!==lw){lw=pg.clientWidth;layout()}});

  /* 5. TOAST + COPY EMAIL */
  var toast=$("toast"),tt;
  function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove("show")},2400)}
  $("copy").onclick=function(){
    (navigator.clipboard?navigator.clipboard.writeText($("mail").textContent):Promise.reject()).then(function(){say("Email copied")},function(){say("Copy failed. Select the address manually.")});
  };

  /* 6. MESSAGE POPUP: any element with data-open opens it */
  var dlg=$("dlg");
  [].forEach.call(document.querySelectorAll("[data-open]"),function(a){a.onclick=function(e){e.preventDefault();dlg.showModal()}});
  $("close").onclick=function(){dlg.close()};
  dlg.onclick=function(e){if(e.target===dlg)dlg.close()};

  /* 7. CONTACT FORM
     Emails each message to you through FormSubmit (free, no backend).
     To change where mail goes, edit FORM_URL. FIRST TIME ONLY: FormSubmit
     emails you an "Activate form" link after the first test message. */
  var FORM_URL="https://formsubmit.co/ajax/mihir.srivastava001@gmail.com";
  $("form").onsubmit=function(e){
    e.preventDefault();
    var f=e.target,b=f.querySelector("button[type=submit]"),old=b.textContent;
    b.disabled=true;b.textContent="Sending...";
    fetch(FORM_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({
        name:f.name.value,email:f.email.value,subject:f.subject.value,message:f.msg.value,
        _subject:"Portfolio message: "+(f.subject.value||f.name.value),
        _replyto:f.email.value,_template:"table",_captcha:"false",_honey:f._honey.value
      })
    }).then(function(r){return r.json().then(function(d){if(!r.ok||d.success==="false")throw 0})})
    .then(function(){f.reset();dlg.close();say("Message sent. Thank you!")})
    .catch(function(){
      say("Could not send. Opening your email app instead");
      location.href="mailto:mihir.srivastava001@gmail.com?subject="+encodeURIComponent(f.subject.value||"Portfolio message")+"&body="+encodeURIComponent(f.msg.value+"\n\nFrom: "+f.name.value+" <"+f.email.value+">");
    })
    .then(function(){b.disabled=false;b.textContent=old});
  };

  $("year").textContent=new Date().getFullYear();
})();