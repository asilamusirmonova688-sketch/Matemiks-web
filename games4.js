/* =========================================================
   ABAKUS (soroban) va FLASH-ANZAN — mental arifmetika
   ========================================================= */
(function(){
BADGES.push({id:"abacus",e:"🧮",ok:function(p){return (p.cnt.abFlash||0)>=1}});
var MODES=["show","read","flash"],ROUNDS=5,AB=null;
function cfg(){var d=AB.diff;return {dig:[1,2,3][d],cnt:[3,4,6][d],fdig:[1,1,2][d],ms:[1500,1100,850][d]}}
function rodsHTML(vals,interactive){
  var h="<div class='abacus"+(interactive?" live":"")+"'>";
  vals.forEach(function(v,r){
    h+="<div class='rod'><div class='heaven'><button class='bead h"+(v>=5?" on":"")+"' data-r='"+r+"' data-k='h' aria-label='5'></button></div><div class='beam'></div><div class='earth'>";
    for(var k=0;k<4;k++)h+="<button class='bead e"+((v%5)>k?" on":"")+(k===v%5?" gap":"")+"' data-r='"+r+"' data-k='"+k+"' aria-label='1'></button>";
    h+="</div><i class='rodv'>"+(interactive?v:"")+"</i></div>";
  });
  return h+"</div>";
}
function valOf(vals){return vals.reduce(function(a,v){return a*10+v},0)}
function digitsOf(n,len){var s=String(n);while(s.length<len)s="0"+s;return s.split("").map(Number)}
function open(mode,diff){
  if(mode==null)mode=(S.abCfg&&S.abCfg.m)||"show";
  if(diff==null)diff=(S.abCfg&&S.abCfg.d!=null)?S.abCfg.d:(S.level<=2?0:S.level<=4?1:2);
  S.abCfg={m:mode,d:diff};save();
  AB={mode:mode,diff:diff,i:0,ok:0,lock:false,t0:Date.now()};
  var h="";MODES.forEach(function(m){h+="<button class='chip"+(m===mode?" sel":"")+"' data-m='"+m+"'>"+t("ab_m_"+m)+"</button>"});
  $("ab-modes").innerHTML=h;
  h="";["sd_easy","sd_med","sd_hard"].forEach(function(k,j){h+="<button class='chip"+(j===diff?" sel":"")+"' data-d='"+j+"'>"+t(k)+"</button>"});
  $("ab-diff").innerHTML=h;
  document.querySelectorAll("#ab-modes .chip").forEach(function(b){b.onclick=function(){open(b.dataset.m,AB.diff)}});
  document.querySelectorAll("#ab-diff .chip").forEach(function(b){b.onclick=function(){open(AB.mode,+b.dataset.d)}});
  $("ab-info").innerHTML=t("ab_i_"+mode);
  round();updStars();show("s-abacus");
}
function pill(){$("ab-round").textContent=t("ab_round",{i:Math.min(AB.i+1,ROUNDS),n:ROUNDS})}
function round(){
  pill();$("ab-fb").textContent="";AB.lock=false;var c=cfg();
  if(AB.mode==="show"){
    var len=Math.max(2,c.dig),tg=rnd(c.dig===1?1:Math.pow(10,c.dig-1),Math.pow(10,c.dig)-1);
    AB.target=tg;AB.vals=digitsOf(0,len);
    $("ab-task").innerHTML="<span class='abtg'>"+tg+"</span>";
    drawLive();
    $("ab-act").innerHTML="<button class='btn' id='ab-check'>"+t("lg_check")+"</button>";
    $("ab-check").onclick=checkShow;
  }else if(AB.mode==="read"){
    var len2=Math.max(2,c.dig),n=rnd(c.dig===1?1:Math.pow(10,c.dig-1),Math.pow(10,c.dig)-1);
    AB.target=n;$("ab-task").innerHTML="";
    $("ab-main").innerHTML=rodsHTML(digitsOf(n,len2),false);
    var o=options(n).map(Number);
    if(c.dig>1){var sw=digitsOf(n,len2).reverse().join("").replace(/^0+/,"");if(+sw&&+sw!==n&&o.indexOf(+sw)<0){for(var q2=0;q2<o.length;q2++)if(o[q2]!==n){o[q2]=+sw;break}}}
    $("ab-act").innerHTML="<div class='answers'>"+shuffle(o).map(function(v){return "<button class='ans' data-v='"+v+"'>"+v+"</button>"}).join("")+"</div>";
    document.querySelectorAll("#ab-act .ans").forEach(function(b){b.onclick=function(){answer(+b.dataset.v===n,b,n)}});
  }else{
    AB.seq=[];for(var i=0;i<c.cnt;i++)AB.seq.push(rnd(c.fdig===1?1:10,c.fdig===1?9:99));
    AB.target=AB.seq.reduce(function(a,b){return a+b},0);
    $("ab-task").innerHTML="";$("ab-main").innerHTML="<div class='flash' id='ab-flash'>🧮</div>";
    $("ab-act").innerHTML="<button class='btn' id='ab-go' style='background:var(--orange)'>"+t("ab_start")+"</button>";
    $("ab-go").onclick=flash;
  }
}
function drawLive(){
  $("ab-main").innerHTML=rodsHTML(AB.vals,true);
  document.querySelectorAll("#ab-main .bead").forEach(function(b){b.onclick=function(){
    if(AB.lock)return;var r=+b.dataset.r,k=b.dataset.k,v=AB.vals[r],up=v>=5?5:0,low=v%5;
    if(k==="h")up=up?0:5;else{k=+k;low=low>k?k:k+1}
    AB.vals[r]=up+low;beep(true);drawLive()}});
}
function checkShow(){
  if(AB.lock)return;var v=valOf(AB.vals),ok=v===AB.target;
  if(!ok){$("ab-fb").style.color="#791F1F";$("ab-fb").textContent=t("ab_now",{v:v});beep(false)}
  answer(ok,$("ab-check"),AB.target);
}
function flash(){
  AB.lock=true;$("ab-act").innerHTML="";var c=cfg(),el=$("ab-flash"),i=0;
  el.textContent=t("ab_ready");
  setTimeout(function step(){
    if(!$("s-abacus").classList.contains("on"))return;
    if(i>=AB.seq.length){el.textContent="?";askSum();return}
    el.textContent="";setTimeout(function(){el.textContent=(i>0?"+":"")+AB.seq[i];el.classList.remove("pop");void el.offsetWidth;el.classList.add("pop");i++;setTimeout(step,c.ms)},140);
  },900);
}
function askSum(){
  AB.lock=false;AB.input="";
  var pad="";["1","2","3","4","5","6","7","8","9","x","0","ok"].forEach(function(k){pad+="<button data-k='"+k+"'"+(k==="ok"?" class='okk'":"")+">"+(k==="x"?"⌫":k==="ok"?"✓":k)+"</button>"});
  $("ab-act").innerHTML="<p class='abq'>"+t("ab_sum")+"</p><div class='abin' id='ab-in'>&nbsp;</div><div class='abpad'>"+pad+"</div>";
  document.querySelectorAll(".abpad button").forEach(function(b){b.onclick=function(){
    if(AB.lock)return;var k=b.dataset.k;
    if(k==="x")AB.input=AB.input.slice(0,-1);else if(k==="ok"){if(AB.input)answer(+AB.input===AB.target,b,AB.target);return}else if(AB.input.length<4)AB.input+=k;
    $("ab-in").innerHTML=AB.input||"&nbsp;"}});
}
function answer(ok,btn,correct){
  if(AB.lock&&AB.mode!=="flash")return;AB.lock=true;
  if(btn)btn.classList.add(ok?"ok":"bad");beep(ok);
  if(ok){AB.ok++;addStar(btn||$("ab-round"));$("ab-fb").style.color="#27500A";$("ab-fb").textContent=praise()}
  else{$("ab-fb").style.color="#791F1F";$("ab-fb").textContent=(AB.mode==="flash"?AB.seq.join(" + ")+" = ":t("ab_right")+" ")+correct;
    if(AB.mode==="show"){AB.vals=digitsOf(AB.target,AB.vals.length);var keep=AB.lock;drawLive();AB.lock=keep}
    if(AB.mode==="read")document.querySelectorAll("#ab-act .ans").forEach(function(b){if(+b.dataset.v===correct)b.classList.add("ok")})}
  setTimeout(function(){AB.i++;if(AB.i>=ROUNDS)end();else round()},ok?900:2200);
}
function end(){
  if(!$("s-abacus").classList.contains("on"))return;
  var key="AB_"+AB.mode+AB.diff,prev=S.best[key]||0;if(AB.ok>prev)S.best[key]=AB.ok;
  S.cnt.abacus=(S.cnt.abacus||0)+1;if(AB.mode==="flash"&&AB.ok===ROUNDS&&AB.diff>=1)S.cnt.abFlash=(S.cnt.abFlash||0)+1;
  var st=AB.ok===5?5:AB.ok===4?4:AB.ok>=2?3:2;touchDay();checkBadges();save();
  var m=AB.mode,d=AB.diff;
  showResult({title:t("ab_done"),stars:st,score:t("g24_score",{n:ROUNDS,c:AB.ok}),cmp:compare("ab_"+m+d,AB.ok,false),
    best:t("g24_rec",{b:S.best[key]+"/"+ROUNDS}),again:function(){open(m,AB.ok===5&&d<2?d+1:d)}});
}
$("go-abacus").onclick=function(){open()};
window.abacusOpen=open;
})();
