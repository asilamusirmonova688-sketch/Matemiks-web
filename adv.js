/* =========================================================
   SARGUZASHT XARITASI va BOSS JANGI
   ========================================================= */
(function(){
var ISL=[{e:"🏝️",b:"👾",c:"#1D9E75"},{e:"🌳",b:"🐙",c:"#3B8F3A"},{e:"🏔️",b:"🦖",c:"#378ADD"},{e:"🏜️",b:"🤖",c:"#BA7517"},{e:"🌋",b:"🐉",c:"#D85A30"},{e:"🏰",b:"🧙",c:"#7F77DD"}];
var TYPES=["math","puz","know","trick","world"],TE={math:"✏️",puz:"🧩",know:"📚",trick:"⚡",world:"🌍"},QN=5;
BADGES.push({id:"boss1",e:"⚔️",ok:function(p){return p.adv&&p.adv.isl>=1}});
BADGES.push({id:"bossall",e:"👑",ok:function(p){return p.adv&&p.adv.isl>=ISL.length}});
function A(){if(!S.adv)S.adv={isl:0,st:0,sc:{}};return S.adv}
function stType(i,j){return TYPES[(j+i)%TYPES.length]}
function knowGen(){
  var cats=Object.keys(KNOW_SETS).filter(function(k){return k.indexOf("home_")!==0}),c=pick(cats),it=pick(KNOW_SETS[c]),d=(KNOW[L]||KNOW.en)[it[0]].map(conv),o=d[3].split("|");
  return {text:d[2],ans:o[0],opts:o,topic:"know",hint:d[1],pics:"<span style='font-size:56px'>"+it[1]+"</span>",cls:"plain"};
}
function genFor(type){
  if(type==="math")return function(lv){return gen(lv)};
  if(type==="puz")return function(lv){return pick([genSeq,genOdd,genPattern,genLogic])(lv)};
  if(type==="know")return knowGen;
  if(type==="world")return function(){return window.genWorld()};
  return function(lv){var ts=TRICKS.filter(function(x){return x.lv<=Math.max(2,lv)});return pick(ts).g()};
}

/* ---------------- XARITA ---------------- */
function openMap(){
  stopTimers();var a=A(),h="";
  h+="<div class='advhd'><b>"+t("adv_prog",{i:Math.min(a.isl+1,ISL.length),n:ISL.length})+"</b><div class='bar'><div style='width:"+Math.round((a.isl*6+(a.isl<ISL.length?a.st:0))/(ISL.length*6)*100)+"%'></div></div></div>";
  ISL.forEach(function(is,i){
    var st=i<a.isl?"done":i===a.isl?"cur":"lock";
    h+="<div class='isl "+st+"' style='--ic:"+is.c+"'><div class='islh'><span class='ie'>"+(st==="lock"?"🔒":is.e)+"</span><span><b>"+t("isl_"+i)+"</b><small>"+(st==="done"?"✅ "+t("adv_done"):st==="lock"?t("adv_lock"):t("adv_cur",{n:a.st,m:5}))+"</small></span></div>";
    if(st==="cur"){
      h+="<div class='path'>";
      for(var j=0;j<5;j++){var ty=stType(i,j),s2=j<a.st?"ok":j===a.st?"now":"wait",sc=a.sc[i+"-"+j]||0;
        h+="<button class='node "+s2+" z"+(j%2)+"' data-j='"+j+"'"+(j>a.st?" disabled":"")+"><span class='ne'>"+(j===a.st?buddy().e:TE[ty])+"</span><small>"+t("st_"+ty)+"</small>"+(sc?"<i>"+"⭐".repeat(sc)+"</i>":"")+"</button>";}
      h+="<button class='node boss"+(a.st>=5?" now":"")+"' data-boss='1'"+(a.st<5?" disabled":"")+"><span class='ne'>"+is.b+"</span><small>"+t("adv_boss")+"</small></button></div>";
    }
    h+="</div>";
  });
  if(a.isl>=ISL.length)h+="<div class='card' style='text-align:center'><p class='big'>👑</p><h2>"+t("adv_all")+"</h2><button class='btn' id='adv-reset'>"+t("adv_again")+"</button></div>";
  $("adv-body").innerHTML=h;
  document.querySelectorAll("#adv-body .node[data-j]").forEach(function(b){b.onclick=function(){startStation(+b.dataset.j)}});
  var bb=document.querySelector("#adv-body [data-boss]");if(bb)bb.onclick=bossOpen;
  var rs=$("adv-reset");if(rs)rs.onclick=function(){S.adv={isl:0,st:0,sc:{},round:(a.round||0)+1};save();openMap()};
  updStars();show("s-adv");
  var cur=document.querySelector("#adv-body .isl.cur");if(cur)setTimeout(function(){cur.scrollIntoView({block:"center",behavior:"smooth"})},80);
}
var PEND=false;
function startStation(j){
  var a=A(),i=a.isl,ty=stType(i,j);
  mcqStart(TE[ty]+" "+t("isl_"+i)+" · "+(j+1)+"/5",genFor(ty),QN,t("adv_st_info"),null,null,openMap,function(ok){
    var sc=ok>=5?3:ok>=4?2:ok>=3?1:0,key=i+"-"+j;
    if(sc>(a.sc[key]||0))a.sc[key]=sc;
    if(sc&&j===a.st){a.st++;S.stars+=2;toast(t("adv_next"))}
    else if(!sc)toast(buddy().e+" "+t("adv_retry"));
    PEND=true;save();
  });
}
var _sr=showResult;window.showResult=showResult=function(o){_sr(o);$("r-map").style.display=PEND?"block":"none";PEND=false};
$("r-map").onclick=openMap;

/* ---------------- BOSS JANGI ---------------- */
var B=null;
function bossOpen(){
  var a=A(),i=a.isl;
  B={i:i,hp:8+i*2,max:8+i*2,hearts:3,lock:false};
  $("bs-boss").textContent=ISL[i].b;$("bs-name").textContent=t("boss_"+i);
  $("bs-intro").style.display="block";$("bs-game").style.display="none";
  $("bs-say").textContent=t("boss_hi",{n:S.name});
  bossBars();show("s-boss");
}
function bossBars(){
  $("bs-hp").style.width=(B.hp/B.max*100)+"%";$("bs-hpn").textContent=B.hp+" / "+B.max;
  $("bs-hearts").textContent="❤️".repeat(B.hearts)+"🤍".repeat(3-B.hearts);
}
function bossQ(){B.lock=false;B.Q=gen(S.level,3);renderQ("bs",B.Q,bossAns)}
function bossAns(v,btn){
  if(B.lock)return;B.lock=true;var ok=String(v)===String(B.Q.ans);record(ok,"math");
  btn.classList.add(ok?"ok":"bad");beep(ok);
  var el=$("bs-boss");
  if(ok){B.hp--;el.classList.remove("hit");void el.offsetWidth;el.classList.add("hit");$("bs-fx").textContent="💥"}
  else{B.hearts--;document.body.classList.remove("shake");void document.body.offsetWidth;document.body.classList.add("shake");$("bs-fx").textContent=ISL[B.i].b+"💨";
    $("bs-ans").querySelectorAll(".ans").forEach(function(b){if(b.dataset.v===String(B.Q.ans))b.classList.add("ok")})}
  bossBars();
  setTimeout(function(){$("bs-fx").textContent="";
    if(B.hp<=0)bossEnd(true);else if(B.hearts<=0)bossEnd(false);else bossQ()},ok?650:1300);
}
function bossEnd(win){
  var a=A();
  if(win){a.isl++;a.st=0;S.stars+=10;S.cnt.boss=(S.cnt.boss||0)+1;if(window.giveSticker)window.giveSticker();}
  touchDay();checkBadges();save();
  showResult({title:win?t("boss_win",{b:t("boss_"+B.i)}):t("boss_lose"),stars:win?5:3,
    score:win?t("boss_win_t",{n:a.isl<ISL.length?t("isl_"+a.isl):"👑"}):t("boss_lose_t",{b:ISL[B.i].b}),
    again:win?openMap:bossOpen});
  $("r-map").style.display="block";
}
$("bs-go").onclick=function(){$("bs-intro").style.display="none";$("bs-game").style.display="block";bossQ()};
$("bs-back").onclick=openMap;
$("adv-back").onclick=function(){openMenu()};
$("go-adv").onclick=openMap;
window.openMap=openMap;
})();
