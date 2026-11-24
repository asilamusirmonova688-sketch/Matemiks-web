/* =========================================================
   DIPLOMLAR: daraja diplomi (barcha mavzular 100%) va sarguzasht diplomi
   ========================================================= */
(function(){
BADGES.push({id:"dipl",e:"🎓",ok:function(p){return p.dipl&&Object.keys(p.dipl).length>=1}});
function lvTopics(n){return Object.keys(TOPICS).filter(function(k){return TOPICS[k].lv===n})}
function lvDone(p,n){return lvTopics(n).every(function(k){return (p.mast[k]||0)>=100})}
function checkDipl(){
  if(!S)return null;S.dipl=S.dipl||{};var nw=null;
  for(var n=1;n<=6;n++)if(!S.dipl["lv"+n]&&lvDone(S,n)){S.dipl["lv"+n]=today();nw="lv"+n}
  if(!S.dipl.adv&&S.adv&&S.adv.isl>=6){S.dipl.adv=today();nw="adv"}
  if(nw){S.stars+=20;checkBadges();save()}
  return nw;
}
function fmtDate(d){var a=d.split("-");return a[2]+"."+a[1]+"."+a[0]}
function wrap(ctx,txt,x,y,maxW,lh){
  var words=txt.split(" "),line="",lines=[];
  words.forEach(function(w){var tl=line?line+" "+w:w;if(ctx.measureText(tl).width>maxW&&line){lines.push(line);line=w}else line=tl});
  if(line)lines.push(line);
  lines.forEach(function(l,i){ctx.fillText(l,x,y+i*lh)});return lines.length;
}
function draw(key){
  var W=1400,H=990,c=document.createElement("canvas");c.width=W;c.height=H;var x=c.getContext("2d");
  var F=getComputedStyle(document.body).fontFamily,EF="'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji',sans-serif";
  var th=(THEMES[S.fav&&S.fav.color]||{}),main=th.main||"#1D9E75";
  // fon
  var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#FFFBF0");g.addColorStop(1,"#FFF1D6");x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle="#C9962E";x.lineWidth=14;x.strokeRect(30,30,W-60,H-60);
  x.strokeStyle=main;x.lineWidth=4;x.strokeRect(58,58,W-116,H-116);
  x.textAlign="center";x.textBaseline="middle";
  x.font="64px "+EF;["⭐","⭐","⭐","⭐"].forEach(function(e,i){x.fillText(e,i%2?W-110:110,i<2?110:H-110)});
  // sarlavha
  x.font="110px "+EF;x.fillText(key==="adv"?"👑":"🎓",W/2,165);
  x.fillStyle="#26215C";x.font="900 92px "+F;x.fillText(t("dp_title").toUpperCase(),W/2,290);
  x.fillStyle="#8A6A3A";x.font="700 34px "+F;x.fillText(t("dp_given"),W/2,365);
  // ism
  x.fillStyle=main;x.font="900 84px "+F;x.fillText(S.name,W/2,450);
  x.strokeStyle="#C9962E";x.lineWidth=3;x.beginPath();x.moveTo(W/2-330,505);x.lineTo(W/2+330,505);x.stroke();
  // matn
  x.fillStyle="#3A2A10";x.font="700 38px "+F;
  var txt=key==="adv"?t("dp_adv"):t("dp_lv",{l:key.slice(2)+" — "+t("lv"+key.slice(2)+"_t")});
  var n=wrap(x,txt,W/2,565,W-300,50);
  // statistika
  var y=565+n*50+55,st=[["✏️",S.total,t("dp_solved")],["🎯",(S.total?Math.round(S.totalC/S.total*100):0)+"%",t("dp_acc")],["⭐",S.stars,t("dp_stars")],["🏅",Object.keys(S.badges).length,t("dp_badges")]];
  st.forEach(function(s,i){var cx=W/2+(i-1.5)*270;
    x.fillStyle="#fff";x.strokeStyle="#EAD3A6";x.lineWidth=3;rr(x,cx-115,y-62,230,150,24);x.fill();x.stroke();
    x.font="44px "+EF;x.fillStyle="#000";x.fillText(s[0],cx,y-20);
    x.fillStyle="#26215C";x.font="900 44px "+F;x.fillText(String(s[1]),cx,y+30);
    x.fillStyle="#8A6A3A";x.font="700 22px "+F;x.fillText(s[2],cx,y+66)});
  // pastki qator
  var fy=H-112;x.font="700 28px "+F;x.fillStyle="#8A6A3A";
  x.textAlign="left";x.fillText(t("dp_date")+": "+fmtDate(S.dipl[key]),180,fy);
  x.textAlign="right";x.fillText("🏅 "+t("dp_app"),W-180,fy);
  x.textAlign="center";x.font="68px "+EF;x.fillText(buddy().e,W/2,fy+2);
  return c;
}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
var CUR=null;
function openDipl(key,fresh){
  CUR=key;var c=draw(key),url=c.toDataURL("image/png");
  $("dp-img").src=url;
  $("dp-head").textContent=fresh?t("dp_new",{n:S.name}):"";
  $("dp-head").style.display=fresh?"block":"none";
  $("dp-print").style.display=window.AndroidApp?"none":"";
  $("dp-save").onclick=function(){
    if(window.AndroidApp){try{AndroidApp.shareImage(url,(S.name||"diplom")+"_diplom.png",t("dp_title"));return}catch(e){}}
    var name=(S.name||"diplom").replace(/[^\wА-Яа-яЁёҚқҒғҲҳҶҷӮӯӢӣӘәІіҢңҮүҰұӨөҺһÇçĞğİıÖöŞşÜüÄäŇňÝýŽž]+/g,"_")+"_diplom.png";
    try{c.toBlob(function(b){
      if(navigator.canShare&&navigator.share){var f=new File([b],name,{type:"image/png"});if(navigator.canShare({files:[f]})){navigator.share({files:[f],title:t("dp_title")}).catch(function(){});return}}
      var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500)})}catch(e){toast(t("dp_saveerr"))}
  };
  $("dp-print").onclick=function(){document.body.classList.add("printdipl");setTimeout(function(){window.print();setTimeout(function(){document.body.classList.remove("printdipl")},500)},100)};
  if(fresh){setTimeout(function(){var b=document.createElement("div");b.className="cfx";for(var i=0;i<24;i++){var s=document.createElement("i");s.textContent=pick(["🎉","⭐","🎓","✨"]);s.style.left=rnd(2,96)+"%";s.style.animationDelay=(R()*0.6)+"s";b.appendChild(s)}document.body.appendChild(b);setTimeout(function(){b.remove()},2600)},300)}
  show("s-dipl");
}
function growthCard(){
  var d=S.dipl||{},keys=Object.keys(d).sort(),h="";
  if(keys.length)h+="<div class='dpl'>"+keys.map(function(k){return "<button class='dpi' data-k='"+k+"'><span>"+(k==="adv"?"👑":"🎓")+"</span><b>"+(k==="adv"?t("adv_title"):k.slice(2)+" — "+t("lv"+k.slice(2)+"_t"))+"</b><small>"+fmtDate(d[k])+"</small></button>"}).join("")+"</div>";
  else h+="<p class='small-note'>"+t("dp_none")+"</p>";
  // joriy daraja bo'yicha yo'l
  var n=S.level,tp=lvTopics(n),done=tp.filter(function(k){return (S.mast[k]||0)>=100}).length;
  if(!d["lv"+n])h+="<div class='prog'><span style='min-width:46%'>🎓 "+t("dp_need",{l:n+" — "+t("lv"+n+"_t")})+"</span><div class='bar'><div style='width:"+Math.round(done/tp.length*100)+"%'></div></div><span>"+done+"/"+tp.length+"</span></div>";
  $("g-dipl").innerHTML=h;
  document.querySelectorAll("#g-dipl .dpi").forEach(function(b){b.onclick=function(){openDipl(b.dataset.k,false)}});
}
var _og=openGrowth;window.openGrowth=openGrowth=function(){_og();growthCard()};
var _om=openMenu;window.openMenu=openMenu=function(){_om();var nw=checkDipl();if(nw)setTimeout(function(){openDipl(nw,true)},600)};
$("dp-back").onclick=function(){openMenu()};
$("go-growth").onclick=function(){openGrowth()};
window.openDipl=openDipl;window._checkDipl=checkDipl;
})();
