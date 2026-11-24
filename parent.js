/* =========================================================
   OTA-ONALAR BO'LIMI: PIN, vaqt chegarasi, ko'z dam olishi, uyqu vaqti,
   haftalik hisobot, oilaviy duel, hayotiy topshiriqlar
   ========================================================= */
(function(){
function P(){if(!DB.parent)DB.parent={pin:null,limit:30,eye:true,bed:{on:false,from:"21:00",to:"07:00"},custom:{}};
  var p=DB.parent;if(p.custom==null)p.custom={};if(!p.bed)p.bed={on:false,from:"21:00",to:"07:00"};return p}
function rt(p){p=p||S;if(!p.rt)p.rt={act:{},pend:{},done:0};return p.rt}
function useMin(p,d){p=p||S;return Math.floor(((p.use||{})[d||today()]||0)/60)}
function limitFor(p){var l=P().limit;if(!l)return 0;return l+(((p||S).extra||{})[today()]||0)}
BADGES.push({id:"helper",e:"🏡",ok:function(p){return p.rt&&p.rt.done>=5}});
BADGES.push({id:"duel",e:"⚔️",ok:function(p){return (p.cnt.duelWin||0)>=1}});
var PRESETS=20;
function taskText(id){return id[0]==="p"?tA("rt_list")[+id.slice(1)]:conv(P().custom[id]||"")}

/* ---------------- PIN oynasi ---------------- */
var PIN={mode:null,buf:"",first:null,cb:null};
function pinAsk(cb){PIN.cb=cb;PIN.buf="";PIN.first=null;PIN.mode=P().pin?"check":"new";pinShow()}
function pinShow(){
  $("pin-title").textContent=t(PIN.mode==="check"?"pin_enter":PIN.mode==="new"?"pin_new":PIN.mode==="again"?"pin_again":"pin_reset_q");
  $("pin-dots").innerHTML=[0,1,2,3].map(function(i){return "<i class='"+(i<PIN.buf.length?"on":"")+"'></i>"}).join("");
  $("pin-forgot").style.display=PIN.mode==="check"?"block":"none";
  $("pin-modal").classList.add("on");
}
function pinKey(k){
  if(k==="x"){PIN.buf=PIN.buf.slice(0,-1);pinShow();return}
  if(PIN.mode==="reset"){PIN.buf+=k;$("pin-dots").textContent=PIN.buf;if(PIN.buf.length>=String(PIN.ans).length){
      if(+PIN.buf===PIN.ans){P().pin=null;save();PIN.mode="new";PIN.buf="";pinShow()}else{PIN.buf="";beep(false);$("pin-dots").textContent=""}}return}
  if(PIN.buf.length>=4)return;PIN.buf+=k;pinShow();
  if(PIN.buf.length<4)return;
  setTimeout(function(){
    if(PIN.mode==="check"){if(PIN.buf===P().pin){pinClose();PIN.cb&&PIN.cb()}else{beep(false);PIN.buf="";pinShow();toast(t("pin_wrong"))}}
    else if(PIN.mode==="new"){PIN.first=PIN.buf;PIN.buf="";PIN.mode="again";pinShow()}
    else if(PIN.mode==="again"){if(PIN.buf===PIN.first){P().pin=PIN.buf;save();toast(t("pin_saved"));pinClose();PIN.cb&&PIN.cb()}else{beep(false);toast(t("pin_mismatch"));PIN.mode="new";PIN.buf="";pinShow()}}
  },150);
}
function pinClose(){$("pin-modal").classList.remove("on")}
(function(){var h="";["1","2","3","4","5","6","7","8","9","","0","x"].forEach(function(k){h+=k?"<button data-k='"+k+"'>"+(k==="x"?"⌫":k)+"</button>":"<span></span>"});$("pin-pad").innerHTML=h})();
document.querySelectorAll("#pin-pad button").forEach(function(b){b.onclick=function(){pinKey(b.dataset.k)}});
$("pin-cancel").onclick=pinClose;
$("pin-forgot").onclick=function(){var a=rnd(23,89),b=rnd(13,47);PIN.ans=a*b;PIN.mode="reset";PIN.buf="";pinShow();$("pin-title").textContent=t("pin_reset_q",{a:a,b:b});$("pin-dots").textContent=""};

/* ---------------- vaqtni hisoblash, bloklar ---------------- */
var FREE={"s-lang":1,"s-intro":1,"s-pick":1,"s-start":1,"s-parent":1,"s-duel":1};
var EYE=0,BLOCK=null,EYE_T=null;
function curScreen(){var s=document.querySelector(".screen.on");return s?s.id:""}
function inBed(){var b=P().bed;if(!b.on)return false;if(P().bedOK===today())return false;
  var d=new Date(),m=d.getHours()*60+d.getMinutes(),f=hm(b.from),to=hm(b.to);
  return f<to?(m>=f&&m<to):(m>=f||m<to)}
function hm(s){var a=String(s||"0:0").split(":");return (+a[0])*60+(+a[1]||0)}
function block(kind){
  if(BLOCK===kind)return;BLOCK=kind;stopTimers();
  var e=buddy().e,box=$("pl-block");
  if(kind==="eye"){
    var left=20;
    box.innerHTML="<div class='plb'><div class='ple'>👀</div><h2>"+t("eye_title")+"</h2><p>"+t("eye_text",{b:e})+"</p><p class='plt' id='eye-left'>20</p></div>";
    EYE_T=setInterval(function(){left--;var el=$("eye-left");if(el)el.textContent=left;if(left<=0){clearInterval(EYE_T);EYE=0;unblock()}},1000);
  }else if(kind==="limit"){
    box.innerHTML="<div class='plb'><div class='ple'>"+e+"👋</div><h2>"+t("lim_title",{n:S.name})+"</h2><p>"+t("lim_text",{b:e,m:useMin()})+"</p>"+
      "<button class='btn' id='pl-switch'>"+t("m_switch")+"</button><button class='btn sec small' id='pl-more'>"+t("lim_more")+"</button></div>";
  }else{
    box.innerHTML="<div class='plb night'><div class='ple'>🌙"+e+"💤</div><h2>"+t("bed_title")+"</h2><p>"+t("bed_text",{b:e,t:P().bed.to})+"</p>"+
      "<button class='btn sec small' id='pl-more'>"+t("bed_open")+"</button></div>";
  }
  box.classList.add("on");
  var sw=$("pl-switch");if(sw)sw.onclick=function(){unblock();$("go-switch").click()};
  var mo=$("pl-more");if(mo)mo.onclick=function(){pinAsk(function(){
    if(kind==="limit"){S.extra=S.extra||{};var d=today();for(var k in S.extra)if(k!==d)delete S.extra[k];S.extra[d]=(S.extra[d]||0)+15;save();toast(t("lim_added"))}
    else{P().bedOK=today();save()}
    unblock()})};
}
function unblock(){BLOCK=null;$("pl-block").classList.remove("on");$("pl-block").innerHTML=""}
function tick(){
  if(!S||document.hidden)return;
  var sc=curScreen();
  if(FREE[sc]){if(BLOCK&&BLOCK!=="eye")unblock();return}
  if(inBed()){block("bed");return}
  var lim=limitFor(S);
  if(lim&&useMin()>=lim){block("limit");return}
  if(BLOCK==="limit"||BLOCK==="bed")unblock();
  if(BLOCK)return;
  S.use=S.use||{};var d=today();S.use[d]=(S.use[d]||0)+5;
  var ks=Object.keys(S.use);if(ks.length>40){ks.sort();ks.slice(0,ks.length-40).forEach(function(k){delete S.use[k]})}
  if(lim&&lim-useMin()===5&&S.warn5!==d){S.warn5=d;toast(t("lim_warn",{b:buddy().e}))}
  if(P().eye){EYE+=5;if(EYE>=1200)block("eye")}
  if(S.use[d]%30===0)save();
}
setInterval(tick,5000);

/* ---------------- OTA-ONALAR EKRANI ---------------- */
var TAB="set",KID=null;
function openParent(){pinAsk(function(){KID=S?S.id:(profiles()[0]||{}).id;TAB="set";drawParent();show("s-parent")})}
function kidChips(){var h="<div class='chips' style='margin-bottom:12px'>";profiles().forEach(function(p){h+="<button class='chip"+(p.id===KID?" sel":"")+"' data-kid='"+p.id+"'>"+buddy(p).e+" "+esc(p.name)+"</button>"});return h+"</div>"}
function drawParent(){
  document.querySelectorAll("#pa-tabs button").forEach(function(b){b.classList.toggle("sel",b.dataset.tab===TAB)});
  var p=P(),k=DB.list[KID],h="";
  if(TAB==="set"){
    h+="<div class='card'><h3>⏱️ "+t("pa_limit")+"</h3><div class='chips'>";
    [15,30,45,60,90,0].forEach(function(m){h+="<button class='chip"+(p.limit===m?" sel":"")+"' data-lim='"+m+"'>"+(m?t("pa_min",{m:m}):"∞")+"</button>"});
    h+="</div><p class='small-note'>"+t("pa_limit_note")+"</p></div>";
    h+="<div class='card'><label class='tgl'><input type='checkbox' id='pa-eye'"+(p.eye?" checked":"")+"> 👀 "+t("pa_eye")+"</label><p class='small-note'>"+t("pa_eye_note")+"</p></div>";
    h+="<div class='card'><label class='tgl'><input type='checkbox' id='pa-bed'"+(p.bed.on?" checked":"")+"> 🌙 "+t("pa_bed")+"</label>"+
       "<div class='tms'><span>"+t("pa_from")+"</span><input type='time' id='pa-from' value='"+p.bed.from+"'><span>"+t("pa_to")+"</span><input type='time' id='pa-to' value='"+p.bed.to+"'></div></div>";
    h+="<div class='card'><h3>📅 "+t("pa_today")+"</h3>"+profiles().map(function(q){var l=limitFor(q);return "<div class='prog'><span style='min-width:40%'>"+buddy(q).e+" "+esc(q.name)+"</span><span>"+t("pa_min",{m:useMin(q)})+(l?" / "+l:"")+"</span></div>"}).join("")+"</div>";
    h+="<button class='btn sec small' id='pa-pin'>🔒 "+t("pa_chpin")+"</button>";
  }else if(TAB==="rep"){h+=kidChips()+(k?report(k):"")}
  else if(TAB==="duel"){
    h+=kidChips()+"<div class='card' style='text-align:center'><p class='big'>⚔️</p><h2>"+t("du_title")+"</h2><p>"+t("du_text")+"</p><button class='btn' id='pa-duel' style='background:var(--pink)'>"+t("go")+"</button></div>";
  }else{
    h+=kidChips();
    if(k){var r=rt(k),pend=Object.keys(r.pend);
      if(pend.length){h+="<div class='card'><h3>⏳ "+t("rt_pending")+"</h3>"+pend.map(function(id){return "<div class='rtp'><span>"+esc(taskText(id))+"</span><span><button class='chip' data-ok='"+id+"'>✅ +5⭐</button> <button class='chip' data-no='"+id+"'>↩</button></span></div>"}).join("")+"</div>"}
      h+="<div class='card'><h3>🏡 "+t("rt_choose",{n:esc(k.name)})+"</h3><p class='small-note'>"+t("rt_note")+"</p>";
      var ids=[];for(var i=0;i<PRESETS;i++)ids.push("p"+i);ids=ids.concat(Object.keys(p.custom));
      h+=ids.map(function(id){return "<label class='rtl'><input type='checkbox' data-act='"+id+"'"+(r.act[id]?" checked":"")+"> <span>"+esc(taskText(id))+"</span>"+(id[0]==="c"?" <button class='rtdel' data-del='"+id+"'>🗑</button>":"")+"</label>"}).join("");
      h+="<div class='rtadd'><input type='text' id='rt-new' maxlength='120' placeholder='"+esc(t("rt_ph"))+"'><button class='chip' id='rt-add'>＋</button></div></div>";
      h+="<p class='small-note'>"+t("rt_done_n",{n:r.done})+"</p>";
    }
  }
  $("pa-body").innerHTML=h;
  // ulash
  document.querySelectorAll("#pa-body [data-kid]").forEach(function(b){b.onclick=function(){KID=b.dataset.kid;drawParent()}});
  document.querySelectorAll("#pa-body [data-lim]").forEach(function(b){b.onclick=function(){p.limit=+b.dataset.lim;save();drawParent()}});
  var e;if(e=$("pa-eye"))e.onchange=function(){p.eye=this.checked;save()};
  if(e=$("pa-bed"))e.onchange=function(){p.bed.on=this.checked;save()};
  if(e=$("pa-from"))e.onchange=function(){p.bed.from=this.value||"21:00";save()};
  if(e=$("pa-to"))e.onchange=function(){p.bed.to=this.value||"07:00";save()};
  if(e=$("pa-pin"))e.onclick=function(){PIN.cb=function(){};PIN.buf="";PIN.mode="new";pinShow()};
  if(e=$("pa-duel"))e.onclick=function(){duelOpen(KID)};
  document.querySelectorAll("#pa-body [data-act]").forEach(function(c){c.onchange=function(){var r=rt(k);if(this.checked)r.act[c.dataset.act]=1;else delete r.act[c.dataset.act];save()}});
  document.querySelectorAll("#pa-body [data-del]").forEach(function(b){b.onclick=function(ev){ev.preventDefault();var id=b.dataset.del;delete p.custom[id];profiles().forEach(function(q){var r=rt(q);delete r.act[id];delete r.pend[id]});save();drawParent()}});
  document.querySelectorAll("#pa-body [data-ok]").forEach(function(b){b.onclick=function(){var r=rt(k);delete r.pend[b.dataset.ok];r.done++;k.stars+=5;var keep=S;S=k;checkBadges();S=keep;save();toast("⭐ +5 → "+k.name);drawParent()}});
  document.querySelectorAll("#pa-body [data-no]").forEach(function(b){b.onclick=function(){delete rt(k).pend[b.dataset.no];save();drawParent()}});
  if(e=$("rt-add"))e.onclick=function(){var v=$("rt-new").value.trim();if(!v)return;var id="c"+Date.now().toString(36);p.custom[id]=v;rt(k).act[id]=1;save();drawParent()};
}
document.querySelectorAll("#pa-tabs button").forEach(function(b){b.onclick=function(){TAB=b.dataset.tab;drawParent()}});
$("pa-back").onclick=function(){if(S)openMenu();else show("s-pick")};

/* ---------------- HAFTALIK HISOBOT ---------------- */
function report(k){
  var wd=tA("wd"),rows="",tm=0,tn=0,tc=0,pm=0;
  for(var i=6;i>=0;i--){var d=daysAgo(i),h=k.hist[d]||{n:0,c:0},m=useMin(k,d);tm+=m;tn+=h.n;tc+=h.c;
    rows+="<tr><td>"+(i===0?t("today_lbl"):wd[new Date(d+"T12:00:00").getDay()])+"</td><td>"+m+"</td><td>"+h.n+"</td><td>"+(h.n?Math.round(h.c/h.n*100)+"%":"—")+"</td></tr>"}
  for(i=13;i>=7;i--)pm+=useMin(k,daysAgo(i));
  var h="<div class='card'><h3>📊 "+t("rp_week",{n:esc(k.name)})+"</h3><table class='rpt'><tr><th></th><th>⏱️ "+t("rp_min")+"</th><th>✏️ "+t("rp_solved")+"</th><th>🎯 "+t("rp_acc")+"</th></tr>"+rows+"</table>";
  h+="<p class='small-note'>"+t("rp_sum",{m:tm,n:tn,p:tn?Math.round(tc/tn*100):0})+(pm?" · "+t(tm>=pm?"rp_more":"rp_less",{d:Math.abs(tm-pm)}):"")+"</p></div>";
  var strong=Object.keys(k.mast).filter(function(x){return k.mast[x]>=70}).sort(function(a,b){return k.mast[b]-k.mast[a]}).slice(0,3);
  var mc={};(k.mist||[]).forEach(function(m){if(m.topic&&TOPICS[m.topic])mc[m.topic]=(mc[m.topic]||0)+1});
  Object.keys(k.mast).forEach(function(x){if(k.mast[x]>0&&k.mast[x]<40&&!mc[x])mc[x]=0.5});
  var weak=Object.keys(mc).filter(function(x){return strong.indexOf(x)<0}).sort(function(a,b){return mc[b]-mc[a]}).slice(0,3);
  function tl(a){return a.length?a.map(function(x){return "<span class='tg'>"+TOPICS[x].e+" "+t("t_"+x)+"</span>"}).join(""):"<span class='small-note'>—</span>"}
  h+="<div class='card'><h3>💪 "+t("rp_strong")+"</h3>"+tl(strong)+"<h3 style='margin-top:12px'>🤝 "+t("rp_weak")+"</h3>"+tl(weak)+"<p class='small-note'>"+t("rp_weak_note")+"</p></div>";
  var nb=Object.keys(k.badges).filter(function(b){return k.badges[b]>=daysAgo(6)});
  var bm={};BADGES.forEach(function(b){bm[b.id]=b.e});
  h+="<div class='card'><h3>🏅 "+t("rp_badges")+"</h3>"+(nb.length?nb.map(function(b){return "<span class='tg'>"+(bm[b]||"🏅")+" "+t("b_"+b)+"</span>"}).join(""):"<span class='small-note'>—</span>")+"</div>";
  var c=k.cnt,g=[["🧩",t("sec_puzzle"),c.puz],["♟️",t("sec_chess"),k.chess?(Object.keys(k.chess.puz||{}).length+(k.chess.games||0)):0],["🔲","Sudoku",c.sud],["🗼",t("gm_hanoi"),c.hanoi||0],["🎯",t("gm_24"),c.g24||0],["🌀",t("gm_maze"),c.maze||0],["🕵️",t("gm_logic"),c.logic||0],["🏡",t("rt_short"),rt(k).done]];
  h+="<div class='card'><h3>🎮 "+t("rp_games")+"</h3><div class='rpg'>"+g.map(function(x){return "<span>"+x[0]+" "+x[1]+": <b>"+x[2]+"</b></span>"}).join("")+"</div></div>";
  return h;
}

/* ---------------- OILAVIY DUEL ---------------- */
var DU=null;
function duelOpen(kid){
  var k=DB.list[kid];if(!k)return;
  DU={k:k,turn:0,n:10,sc:[0,0],tm:[0,0],t0:0,lock:false};
  $("du-intro").style.display="block";$("du-game").style.display="none";
  $("du-vs").innerHTML="<span>"+buddy(k).e+"<b>"+esc(k.name)+"</b></span><span class='vs'>VS</span><span>🧑<b>"+t("du_parent")+"</b></span>";
  $("du-score").textContent="0 : 0";show("s-duel");
}
function duelTurn(){
  var who=DU.turn%2;DU.lock=false;
  $("du-who").textContent=who?"🧑 "+t("du_parent"):buddy(DU.k).e+" "+DU.k.name;
  $("du-who").className="duw w"+who;
  $("du-round").textContent=t("du_round",{i:Math.floor(DU.turn/2)+1,n:DU.n/2});
  var keep=S;S=DU.k;var lv=who?Math.min(6,DU.k.level+2):DU.k.level;DU.Q=gen(lv,who?3:2);
  renderQ("du",DU.Q,duelAns);S=keep;DU.t0=Date.now();
}
function duelAns(v,btn){
  if(DU.lock)return;DU.lock=true;var who=DU.turn%2,ok=String(v)===String(DU.Q.ans);
  DU.tm[who]+=(Date.now()-DU.t0)/1000;if(ok)DU.sc[who]++;
  btn.classList.add(ok?"ok":"bad");beep(ok);
  if(!ok)$("du-ans").querySelectorAll(".ans").forEach(function(b){if(b.dataset.v===String(DU.Q.ans))b.classList.add("ok")});
  $("du-score").textContent=DU.sc[0]+" : "+DU.sc[1];
  DU.turn++;setTimeout(function(){if(DU.turn>=DU.n)duelEnd();else duelTurn()},ok?600:1100);
}
function duelEnd(){
  var k=DU.k,a=DU.sc[0],b=DU.sc[1],win=a>b||(a===b&&DU.tm[0]<DU.tm[1]);
  var keep=S;S=k;k.stars+=a+(win?3:1);if(win)k.cnt.duelWin=(k.cnt.duelWin||0)+1;checkBadges();save();
  showResult({title:win?t("du_win",{n:k.name}):t("du_lose"),stars:win?5:Math.max(3,a),
    score:k.name+": "+a+" ✅ ("+Math.round(DU.tm[0])+" s) · "+t("du_parent")+": "+b+" ✅ ("+Math.round(DU.tm[1])+" s)",best:"+"+(a+(win?3:1))+" ⭐ → "+k.name,
    again:function(){duelOpen(k.id)}});
  S=keep;
}
$("du-go").onclick=function(){$("du-intro").style.display="none";$("du-game").style.display="block";duelTurn()};
$("du-back").onclick=function(){show("s-parent");drawParent()};

/* ---------------- BOLA TOMONI: topshiriqlar ---------------- */
function openTasks(){
  var r=rt(),ids=Object.keys(r.act),h="";
  if(!ids.length)h="<div class='card' style='text-align:center'><p class='big'>🏡</p><p>"+t("rt_none")+"</p></div>";
  else h=ids.map(function(id){var p=r.pend[id];
    return "<div class='card rtc'><p>"+esc(taskText(id))+"</p>"+(p?"<span class='pill'>⏳ "+t("rt_wait")+"</span>":"<button class='btn small' data-did='"+id+"'>✅ "+t("rt_did")+"</button>")+"</div>"}).join("");
  $("rtk-body").innerHTML=h+"<p class='small-note'>"+t("rt_kid_note")+"</p>";
  document.querySelectorAll("#rtk-body [data-did]").forEach(function(b){b.onclick=function(){rt().pend[b.dataset.did]=today();save();toast(buddy().e+" "+t("rt_sent"));openTasks()}});
  updStars();show("s-rtasks");
}
function menuExtras(){
  var r=rt(),n=Object.keys(r.act).filter(function(id){return !r.pend[id]}).length;
  $("go-rtasks").textContent="🏡 "+t("rt_short")+(n?" ("+n+")":"");
}
var _om=openMenu;window.openMenu=openMenu=function(){_om();menuExtras();tick()};
$("go-rtasks").onclick=openTasks;
$("go-parent").onclick=openParent;
window.openParent=openParent;window._duel=duelOpen;
})();
