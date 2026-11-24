/* =========================================================
   O'YINLAR, BILIMLAR DUNYOSI va DUNYO BO'YLAB
   ========================================================= */
(function(){
/* ---------- O'yinlar menyusi ---------- */
function openGames(){stopTimers();updStars();show("s-games")}
window.openGames=openGames;
$("go-games").onclick=openGames;
document.querySelectorAll("[data-games]").forEach(function(b){b.onclick=openGames});
$("rc-back").onclick=function(){raceStop();openGames()};
$("ch-back").onclick=openGames;
document.querySelectorAll("[data-soon2]").forEach(function(b){b.onclick=function(){toast(t("soon_msg"))}});

/* ---------- Bilimlar dunyosi ---------- */
var KCATS=[["world","🌍",1],["space","🪐",1],["animals","🐾",1],["scholars","🧑‍🔬",1],["nature","🌦️",1],["body","🫀",1],["math","🔢",1],["home","🏠",1]];
function openKnow(){
  stopTimers();
  var box=$("kn-list");box.innerHTML="";
  KCATS.forEach(function(k){
    var b=document.createElement("button");b.className="tcard"+(k[2]?"":" soonc");
    b.innerHTML="<span class='te'>"+k[1]+"</span><span class='tt'><b>"+t("k_"+k[0])+"</b><small>"+(k[2]?t("k_"+k[0]+"_sub"):t("soon"))+"</small></span><span style='font-size:22px'>"+(k[2]?"▶":"🔒")+"</span>";
    b.onclick=k[0]==="world"?openWorld:k[2]?function(){window.openKnowCat(k[0])}:function(){toast(t("soon_msg"))};
    box.appendChild(b);
  });
  updStars();show("s-know");
}
$("go-know").onclick=openKnow;
window.openKnow=openKnow;
$("kn-back").onclick=openMenu;

/* ---------- Dunyo bo'ylab: ma'lumotlar ---------- */
function flag(c){return String.fromCodePoint(127397+c.charCodeAt(0),127397+c.charCodeAt(1))}
var CACHE={};
function countries(){
  if(!CACHE[L]){
    var arr=(WORLD_N[L]||WORLD_N.en).split(";");
    CACHE[L]=WORLD_C.map(function(c,i){var p=conv(arr[i]).split("|");return {code:c[0],cont:c[1],tier:c[2],trans:!!c[3],name:p[0],cap:p[1],f:flag(c[0])}});
  }
  return CACHE[L];
}
function tierFor(lv){return lv<=2?1:lv<=4?2:3}
function pool(){var T=tierFor(S.level);return countries().filter(function(c){return c.tier<=T})}
function wdata(){if(!S.world)S.world={f:{}};return S.world}
function nFlags(p){return p.world?Object.keys(p.world.f).length:0}
BADGES.push({id:"world",e:"🌍",ok:function(p){return nFlags(p)>=30}});
BADGES.push({id:"worldall",e:"🗺️",ok:function(p){return nFlags(p)>=WORLD_C.length}});

function openWorld(){
  stopTimers();
  var box=$("w-list");box.innerHTML="";
  var got=nFlags(S);
  [["🗺️","w_cont",t("w_cont_sub"),openContinents],
   ["📇","w_cards",t("w_cards_sub",{n:pool().length}),openCards],
   ["🎯","w_quiz",t("w_quiz_sub"),startQuiz],
   ["📒","w_album",t("w_album_sub",{c:got,n:WORLD_C.length}),openAlbum]].forEach(function(x){
    var b=document.createElement("button");b.className="tcard";
    b.innerHTML="<span class='te'>"+x[0]+"</span><span class='tt'><b>"+t(x[1])+"</b><small>"+x[2]+"</small></span><span style='font-size:22px'>▶</span>";
    b.onclick=x[3];box.appendChild(b);
  });
  updStars();show("s-world");
}
$("w-back").onclick=openKnow;
function listScreen(title,html,note){
  $("wl-title").textContent=title;
  $("wl-note").textContent=note||"";$("wl-note").style.display=note?"block":"none";
  $("wl-body").innerHTML=html;show("s-wlist");
}
$("wl-back").onclick=openWorld;

function openContinents(){
  var h=WORLD_CONT.map(function(k){
    return "<button class='ccard' data-say-text='"+esc(t("cont_"+k)+". "+t("cf_"+k))+"'><span class='ce'>"+CONT_E[k]+"</span><span><b>"+t("cont_"+k)+"</b><br>"+t("cf_"+k)+"</span></button>";
  }).join("");
  listScreen("🗺️ "+t("w_cont"),h,t("w_tap_card"));bindSay();
}
function openCards(){
  var ps=pool(),h="";
  WORLD_CONT.forEach(function(k){
    var cs=ps.filter(function(c){return c.cont===k});if(!cs.length)return;
    h+="<h3>"+CONT_E[k]+" "+t("cont_"+k)+"</h3><div class='wgrid'>"+cs.map(function(c){
      return "<button class='wcard' data-say-text='"+esc(c.name+". "+t("w_capital",{p:c.cap}))+"'><span class='flag wf'>"+c.f+"</span><b>"+esc(c.name)+"</b><small>🏛️ "+esc(c.cap)+"</small></button>";
    }).join("")+"</div>";
  });
  listScreen("📇 "+t("w_cards"),h,t("w_tap_card"));bindSay();
}
function openAlbum(){
  var w=wdata(),all=countries(),h="<div class='bar' style='margin:0 0 14px'><div style='width:"+Math.round(nFlags(S)/all.length*100)+"%'></div></div>";
  WORLD_CONT.forEach(function(k){
    var cs=all.filter(function(c){return c.cont===k});if(!cs.length)return;
    var got=cs.filter(function(c){return w.f[c.code]}).length;
    h+="<h3>"+CONT_E[k]+" "+t("cont_"+k)+" <span style='color:var(--muted);font-size:15px'>"+got+"/"+cs.length+"</span></h3><div class='agrid'>"+cs.map(function(c){
      return w.f[c.code]?"<button class='acell got' data-say-text='"+esc(c.name+". "+t("w_capital",{p:c.cap}))+"' title='"+esc(c.name)+"'><span class='flag'>"+c.f+"</span></button>":"<span class='acell' title='"+esc(t("w_locked"))+"'>❔</span>";
    }).join("")+"</div>";
  });
  listScreen("📒 "+t("w_album")+" · "+nFlags(S)+"/"+all.length,h,t("w_album_note"));bindSay();
}
function bindSay(){document.querySelectorAll("#wl-body [data-say-text]").forEach(function(b){b.onclick=function(){speak(b.dataset.sayText);if(b.classList.contains("acell"))toast(b.dataset.sayText)}})}

/* ---------- Dunyo bo'ylab: savollar ---------- */
function opts4(ans,list,field){
  var seen={},out=[ans];seen[ans]=1;
  shuffle(list.slice()).forEach(function(c){var v=c[field];if(out.length<4&&!seen[v]){seen[v]=1;out.push(v)}});
  return out;
}
function genWorld(){
  var ps=pool(),c=pick(ps),same=ps.filter(function(x){return x.cont===c.cont&&x.code!==c.code}),others=ps.filter(function(x){return x.code!==c.code});
  var near=same.length>=3?same.concat(shuffle(others.slice()).slice(0,2)):others;
  var r=R(),type=!c.trans&&r<.15?"cont":r<.55?"flag":r<.8?"cap":"capc";
  var Q,kn=t("cont_"+c.cont);
  if(type==="flag")Q={text:t("w_q_flag"),ans:c.name,opts:opts4(c.name,near,"name"),hint:t("w_h_flag",{k:kn}),pics:"<span class='flag bigflag'>"+c.f+"</span>",say:t("w_q_flag")};
  else if(type==="cap")Q={text:t("w_q_cap",{c:c.name}),ans:c.cap,opts:opts4(c.cap,near,"cap"),hint:t("w_h_cap",{k:kn}),pics:"<span class='flag midflag'>"+c.f+"</span>"};
  else if(type==="capc")Q={text:t("w_q_capc",{p:c.cap}),ans:c.name,opts:opts4(c.name,near,"name"),hint:t("w_h_cap",{k:kn})};
  else{var cs=WORLD_CONT.filter(function(k){return k!=="an"&&k!==c.cont});Q={text:t("w_q_cont",{c:c.name}),ans:kn,opts:[kn].concat(shuffle(cs).slice(0,3).map(function(k){return t("cont_"+k)})),pics:"<span class='flag midflag'>"+c.f+"</span>"}}
  Q.topic="world";Q.cls="plain";Q.word=false;
  if(type!=="cont")Q.onOk=function(){collect(c)};
  return Q;
}
function collect(c){
  var w=wdata();if(w.f[c.code])return;
  w.f[c.code]=1;toast(t("w_new_flag",{f:c.f,c:c.name}));checkBadges();save();
}
function startQuiz(){
  mcqStart("🎯 "+t("w_quiz"),genWorld,10,t("w_quiz_info"),"world",null,openWorld);
}
window.openWorld=openWorld;window.genWorld=genWorld;
})();
