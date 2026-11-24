/* =========================================================
   BILIMLAR DUNYOSI: kartochkalar va mini-test (umumiy modul)
   ========================================================= */
(function(){
var CAT_E={space:"🪐",animals:"🐾",scholars:"🧑‍🔬",nature:"🌦️",body:"🫀",math:"🔢",home_uz:"🏠 🇺🇿",home_ru:"🏠 🇷🇺",home_tj:"🏠 🇹🇯",home_tr:"🏠 🇹🇷",home_kz:"🏠 🇰🇿",home_kg:"🏠 🇰🇬",home_tm:"🏠 🇹🇲"};
var HOME_BY_LANG={uz:"uz",ru:"ru",tg:"tj",tr:"tr",kk:"kz",ky:"kg",tk:"tm"},HOMES=[["uz","🇺🇿"],["ru","🇷🇺"],["tj","🇹🇯"],["tr","🇹🇷"],["kz","🇰🇿"],["kg","🇰🇬"],["tm","🇹🇲"]];
function realCat(cat){if(cat!=="home")return cat;var c=(S.homeC||HOME_BY_LANG[L]||"uz");if(!KNOW_SETS["home_"+c])c="uz";return "home_"+c}
function catTitle(cat){if(cat.indexOf("home_")!==0)return t("k_"+cat);var c=cat.slice(5);return HOME_BY_LANG[L]===c?t("k_home")+": "+t("hc_"+c):t("hc_"+c)}
var QN=8;
function kd(cat){if(!S.know)S.know={};if(!S.know[cat])S.know[cat]={read:{},best:0};return S.know[cat]}
function card(cat,id){return (KNOW[L]||KNOW.en)[id].map(function(x){return conv(x)})}
BADGES.push({id:"astro",e:"🔭",ok:function(p){return p.know&&p.know.space&&p.know.space.best>=6}});
BADGES.push({id:"olim",e:"🎓",ok:function(p){return p.know&&p.know.scholars&&p.know.scholars.best>=6}});
BADGES.push({id:"natur",e:"🌿",ok:function(p){return p.know&&p.know.nature&&p.know.nature.best>=6}});
BADGES.push({id:"doctor",e:"🩺",ok:function(p){return p.know&&p.know.body&&p.know.body.best>=6}});
BADGES.push({id:"mathfan",e:"🧮",ok:function(p){return p.know&&p.know.math&&p.know.math.best>=6}});
BADGES.push({id:"vatan",e:"🏠",ok:function(p){if(!p.know)return false;for(var k in p.know)if(k.indexOf("home_")===0&&p.know[k].best>=6)return true;return false}});
BADGES.push({id:"zoo",e:"🦁",ok:function(p){return p.know&&p.know.animals&&p.know.animals.best>=6}});

function openKnowCat(cat){
  stopTimers();cat=realCat(cat);
  var d=kd(cat),set=KNOW_SETS[cat],nRead=Object.keys(d.read).length;
  $("kc-title").textContent=CAT_E[cat]+" "+catTitle(cat);
  var h="";
  if(cat.indexOf("home_")===0){h+="<div class='chips' id='kc-homes' style='margin-bottom:12px'>"+HOMES.map(function(x){return "<button class='chip"+("home_"+x[0]===cat?" sel":"")+"' data-hc='"+x[0]+"'>"+x[1]+" "+esc(t("hc_"+x[0]))+"</button>"}).join("")+"</div>"}
  h+="<button class='tcard' id='kc-quiz'><span class='te'>🎯</span><span class='tt'><b>"+t("kn_quiz")+"</b><small>"+t("kn_quiz_sub",{n:QN,b:d.best})+"</small></span><span style='font-size:22px'>▶</span></button>";
  h+="<p class='small-note' id='kc-note' style='margin:4px 0 10px;font-size:15px'>"+t("kn_read",{r:nRead,n:set.length})+" · "+t("kn_tap")+"</p>";
  h+=set.map(function(x){
    var c=card(cat,x[0]),rd=d.read[x[0]];
    return "<button class='ccard"+(rd?" rd":"")+"' data-id='"+x[0]+"'><span class='ce'>"+x[1]+"</span><span><b>"+esc(c[0])+(rd?" ✓":"")+"</b><br>"+esc(c[1])+"</span></button>";
  }).join("");
  $("kc-body").innerHTML=h;
  $("kc-quiz").onclick=function(){startKnowQuiz(cat)};
  document.querySelectorAll("#kc-homes [data-hc]").forEach(function(b){b.onclick=function(){S.homeC=b.dataset.hc;save();openKnowCat("home")}});
  document.querySelectorAll("#kc-body .ccard").forEach(function(b){
    b.onclick=function(){
      var id=b.dataset.id,c=card(cat,id);speak(c[0]+". "+c[1]);
      if(!d.read[id]){d.read[id]=1;S.stars+=1;touchDay();save();updStars();b.classList.add("rd");b.querySelector("b").textContent=c[0]+" ✓";flyStar(b);$("kc-note").textContent=t("kn_read",{r:Object.keys(d.read).length,n:set.length})+" · "+t("kn_tap")}
    };
  });
  updStars();show("s-kcat");
}
function startKnowQuiz(cat){
  var order=shuffle(KNOW_SETS[cat].map(function(x){return x[0]})),i=0;
  var gen=function(){
    var id=order[i%order.length];i++;
    var c=card(cat,id),opts=c[3].split("|"),e=KNOW_SETS[cat].filter(function(x){return x[0]===id})[0][1];
    return {text:c[2],ans:opts[0],opts:opts,topic:"know",hint:c[1],pics:"<span style='font-size:64px'>"+e+"</span>",cls:"plain"};
  };
  mcqStart("🎯 "+catTitle(cat),gen,QN,t("kn_info"),"know_"+cat,null,function(){openKnowCat(cat)},function(ok){
    var d=kd(cat);if(ok>d.best){d.best=ok;checkBadges();save()}
  });
}
window.openKnowCat=openKnowCat;
$("kc-back").onclick=function(){window.openKnow()};
})();
