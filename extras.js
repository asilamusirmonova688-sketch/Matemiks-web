/* =========================================================
   O'SUVCHI DO'ST, YULDUZLAR DO'KONI, STIKERLAR ALBOMI, FASL BEZAKLARI
   ========================================================= */
(function(){
/* ---------------- o'suvchi do'st ---------------- */
var STG=[0,30,100,250,500];
function life(p){p=p||S;return p.stars+(p.spent||0)}
function stage(p){var l=life(p),s=0;STG.forEach(function(v,i){if(l>=v)s=i});return s}
var HATS=[["hat1","🧢",20],["hat2","🎀",20],["hat3","🎩",30],["hat4","👒",30],["hat5","🎓",40]];
var ACCS=[["acc1","🎈",15],["acc2","⚽",15],["acc3","👓",25],["acc4","🪁",25],["acc5","🕶️",30]];
var BGS=[["bg1","sky",50],["bg2","spring",50],["bg3","candy",50],["bg4","sunny",50],["bg5","night",60]];
var PACK=25;
function sh(){if(!S.shop)S.shop={own:{},hat:null,acc:null,bg:null};return S.shop}
function itemE(id){var all=HATS.concat(ACCS);for(var i=0;i<all.length;i++)if(all[i][0]===id)return all[i][1];return ""}
function budHTML(p){
  p=p||S;var st=stage(p),s=p.shop||{},e=buddy(p).e,hat=s.hat?itemE(s.hat):(st>=4?"👑":""),acc=s.acc?itemE(s.acc):"";
  if(st===0)return "<span class='bud st0'><span class='bm'>🥚</span><span class='bpeek'>"+e+"</span></span>";
  return "<span class='bud st"+st+"'>"+(hat?"<span class='bh'>"+hat+"</span>":"")+"<span class='bm'>"+e+"</span>"+(acc?"<span class='ba'>"+acc+"</span>":"")+(st>=3?"<span class='bsp'>✨</span>":"")+"</span>";
}
function applyBg(){var b=S&&S.shop&&S.shop.bg;document.documentElement.className=document.documentElement.className.replace(/\bbgx-\w+/g,"").trim();
  if(b){var x=BGS.filter(function(q){return q[0]===b})[0];if(x)document.documentElement.classList.add("bgx-"+x[1])}}
function menuBuddy(){
  var st=stage(),nx=STG[st+1];
  $("m-buddy").innerHTML=budHTML();
  $("m-stage").innerHTML="<b>"+t("stage_"+st)+"</b>"+(nx!=null?" · "+t("m_stage",{n:nx-life()}):" · "+t("m_stage_max"))+
    "<span class='sbar'><i style='width:"+(nx!=null?Math.round((life()-STG[st])/(nx-STG[st])*100):100)+"%'></i></span>";
  if(S.budSt==null)S.budSt=st;
  if(st>S.budSt){S.budSt=st;save();setTimeout(function(){toast(t("grow_toast",{b:buddy().e,s:t("stage_"+st)}));confetti()},400)}
  applyBg();
}
function confetti(){var box=document.createElement("div");box.className="cfx";
  for(var i=0;i<24;i++){var s=document.createElement("i");s.textContent=pick(["🎉","⭐","✨","🎊"]);s.style.left=rnd(2,96)+"%";s.style.animationDelay=(R()*0.6)+"s";box.appendChild(s)}
  document.body.appendChild(box);setTimeout(function(){box.remove()},2600)}

/* ---------------- do'kon ---------------- */
function openShop(){
  var s=sh(),h="<div class='shopv'>"+budHTML()+"<div><b>"+t("stage_"+stage())+"</b><small>⭐ "+S.stars+"</small></div></div>";
  function row(title,list,slot){
    var r="<h3>"+title+"</h3><div class='shopg'>";
    list.forEach(function(it){var own=s.own[it[0]],on=s[slot]===it[0];
      var lbl=slot==="bg"?"<span class='bgsw bgx-"+it[1]+"'></span>"+t("bg_"+it[1]):"<span class='sie'>"+it[1]+"</span>";
      r+="<button class='sitem"+(on?" on":"")+(own?" own":"")+"' data-id='"+it[0]+"' data-slot='"+slot+"' data-p='"+it[2]+"'>"+lbl+"<small>"+(on?"✅ "+t("shop_worn"):own?t("shop_wear"):"⭐ "+it[2])+"</small></button>"});
    return r+"</div>";
  }
  h+=row("🎩 "+t("shop_hats"),HATS,"hat")+row("🎈 "+t("shop_acc"),ACCS,"acc")+row("🖼️ "+t("shop_bg"),BGS,"bg");
  h+="<h3>📒 "+t("shop_pack")+"</h3><button class='sitem wide' id='shop-pack'><span class='sie'>🎁</span><span>"+t("shop_pack_d")+"</span><small>⭐ "+PACK+"</small></button>";
  $("shop-body").innerHTML=h;
  document.querySelectorAll("#shop-body .sitem[data-id]").forEach(function(b){b.onclick=function(){
    var id=b.dataset.id,slot=b.dataset.slot,p=+b.dataset.p;
    if(!s.own[id]){if(S.stars<p){toast(t("shop_need",{n:p-S.stars}));beep(false);return}
      S.stars-=p;S.spent=(S.spent||0)+p;s.own[id]=1;s[slot]=id;beep(true);toast(t("shop_bought"))}
    else s[slot]=s[slot]===id?null:id;
    save();applyBg();openShop()}});
  $("shop-pack").onclick=function(){
    if(S.stars<PACK){toast(t("shop_need",{n:PACK-S.stars}));beep(false);return}
    if(!giveSticker(true)){toast(t("album_full"));return}
    S.stars-=PACK;S.spent=(S.spent||0)+PACK;save();openShop()};
  updStars();show("s-shop");
}

/* ---------------- stikerlar ---------------- */
var SETS=[["🐶","🐱","🦁","🐼","🐨","🦊"],["🚀","🪐","🌙","☄️","👽","🛸"],["🐬","🐳","🐠","🦀","🐙","🐚"],["🍦","🍩","🍭","🧁","🍫","🍪"],["⚽","🏀","🎾","🏓","🥋","🚴"]];
BADGES.push({id:"stk",e:"📒",ok:function(p){return (p.stkSets||0)>=1}});
function stk(){if(!S.stk)S.stk={};return S.stk}
function giveSticker(silent){
  var own=stk(),free=[];SETS.forEach(function(set,i){set.forEach(function(e,j){if(!own[i+"_"+j])free.push([i,j])})});
  if(!free.length)return false;
  var x=pick(free),k=x[0]+"_"+x[1];own[k]=1;toast(t("stk_new",{s:SETS[x[0]][x[1]]}));
  if(SETS[x[0]].every(function(_,j){return own[x[0]+"_"+j]})){S.stars+=20;S.stkSets=(S.stkSets||0)+1;setTimeout(function(){toast(t("set_done",{s:t("set_"+x[0])}));confetti()},2800)}
  save();return true;
}
function openAlbum(){
  var own=stk(),n=Object.keys(own).length,h="<p class='small-note'>"+t("album_note",{n:n,m:30})+"</p>";
  SETS.forEach(function(set,i){var c=set.filter(function(_,j){return own[i+"_"+j]}).length;
    h+="<div class='card'><h3>"+t("set_"+i)+" <small>"+c+"/6"+(c===6?" ✅":"")+"</small></h3><div class='stkg'>"+set.map(function(e,j){return "<span class='stk"+(own[i+"_"+j]?" on":"")+"'>"+(own[i+"_"+j]?e:"❔")+"</span>"}).join("")+"</div></div>"});
  $("alb-body").innerHTML=h;updStars();show("s-album");
}
// har bir yangi nishon uchun stiker
var _cb=checkBadges;window.checkBadges=checkBadges=function(){var b=S?Object.keys(S.badges).length:0;_cb();if(S){var d=Object.keys(S.badges).length-b;for(var i=0;i<d;i++)giveSticker()}};

/* ---------------- ulash ---------------- */
var _om=openMenu;window.openMenu=openMenu=function(){_om();menuBuddy()};
$("go-shop").onclick=openShop;$("go-album").onclick=openAlbum;
window.giveSticker=giveSticker;window.budHTML=budHTML;window.applyBg=applyBg;
})();
