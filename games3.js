/* =========================================================
   O'YINLAR: Labirint va Mantiqiy jadval
   ========================================================= */
(function(){
BADGES.push({id:"maze",e:"🌀",ok:function(p){return (p.cnt.maze15||0)>=1}});
BADGES.push({id:"logic",e:"🕵️",ok:function(p){return (p.cnt.logic||0)>=10}});
function range(k){var a=[];for(var i=0;i<k;i++)a.push(i);return a}
function fmtT(s){var m=Math.floor(s/60),x=s%60;return m+":"+(x<10?"0":"")+x}

/* ---------------- LABIRINT ---------------- */
var M=null,DIRS={u:[-1,0,1,4],r:[0,1,2,8],d:[1,0,4,1],l:[0,-1,8,2]}; // dr,dc,bit,oppositeBit
var SIZES=[6,9,12,15];
function mazeGen(n){
  var w=[],seen=[],r,c;for(r=0;r<n;r++){w.push([]);seen.push([]);for(c=0;c<n;c++){w[r].push(0);seen[r].push(false)}}
  var st=[[0,0]];seen[0][0]=true;
  while(st.length){
    var cur=st[st.length-1],opts=[];
    Object.keys(DIRS).forEach(function(k){var d=DIRS[k],nr=cur[0]+d[0],nc=cur[1]+d[1];if(nr>=0&&nc>=0&&nr<n&&nc<n&&!seen[nr][nc])opts.push(k)});
    if(!opts.length){st.pop();continue}
    var k=opts[rnd(0,opts.length-1)],d=DIRS[k],nr=cur[0]+d[0],nc=cur[1]+d[1];
    w[cur[0]][cur[1]]|=d[2];w[nr][nc]|=d[3];seen[nr][nc]=true;st.push([nr,nc]);
  }
  return w; // bitlar: 1=yuqori ochiq,2=o'ng,4=past,8=chap
}
function mazeOpen(n){
  if(!n)n=S.mazeN||SIZES[Math.min(3,Math.floor((S.level-1)/1.5))];
  S.mazeN=n;save();
  M={n:n,w:mazeGen(n),r:0,c:0,moves:0,t0:Date.now(),stars:{},got:0,done:false};
  var ns=n<=6?2:n<=9?3:n<=12?4:5,g=0;
  while(Object.keys(M.stars).length<ns&&g++<500){var rr=rnd(0,n-1),cc=rnd(0,n-1);if((rr+cc)>2&&!(rr===n-1&&cc===n-1))M.stars[rr*n+cc]=1}
  M.total=Object.keys(M.stars).length;
  var h="";SIZES.forEach(function(k){h+="<button class='chip"+(k===n?" sel":"")+"' data-n='"+k+"'>"+k+"×"+k+"</button>"});
  $("mz-size").innerHTML=h;
  document.querySelectorAll("#mz-size .chip").forEach(function(b){b.onclick=function(){mazeOpen(+b.dataset.n)}});
  $("mz-info").textContent=t("mz_info",{h:buddy().e,f:food().e});
  mazeDraw(true);updStars();show("s-maze");
}
function mazeDraw(full){
  var n=M.n,box=$("mz-board");
  if(full){
    box.style.gridTemplateColumns="repeat("+n+",1fr)";var h="";
    for(var r=0;r<n;r++)for(var c=0;c<n;c++){
      var v=M.w[r][c],s=[];
      if(!(v&1))s.push("border-top:3px solid #26215C");if(!(v&2))s.push("border-right:3px solid #26215C");
      if(!(v&4))s.push("border-bottom:3px solid #26215C");if(!(v&8))s.push("border-left:3px solid #26215C");
      h+="<div class='mzc' id='mz"+(r*n+c)+"' style='"+s.join(";")+"'></div>";
    }
    box.innerHTML=h;box.style.fontSize=Math.max(11,Math.floor(300/n))+"px";
  }
  for(var i=0;i<n*n;i++){var el=$("mz"+i),txt="";
    if(i===n*n-1)txt=food().e;if(M.stars[i])txt="⭐";if(i===M.r*n+M.c)txt=buddy().e;
    el.textContent=txt;el.classList.toggle("vis",!!M.vis&&!!M.vis[i]);}
  $("mz-moves").textContent=t("mz_moves",{n:M.moves,s:M.got,t:M.total});
}
function open3(r,c){var v=M.w[r][c],k=0;[1,2,4,8].forEach(function(b){if(v&b)k++});return k}
function mazeMove(k){
  if(!M||M.done)return;var d=DIRS[k],n=M.n,moved=false;M.vis=M.vis||{};
  while(M.w[M.r][M.c]&d[2]){
    M.vis[M.r*n+M.c]=1;M.r+=d[0];M.c+=d[1];moved=true;
    var i=M.r*n+M.c;
    if(M.stars[i]){delete M.stars[i];M.got++;beep(true)}
    if(i===n*n-1)break;
    // burilish yoki ayrilishda to'xtaymiz
    var v=M.w[M.r][M.c];if(open3(M.r,M.c)!==2||!(v&d[2]))break;
  }
  if(!moved){beep(false);return}
  M.moves++;mazeDraw(false);
  if(M.r===n-1&&M.c===n-1){M.done=true;setTimeout(mazeEnd,450)}
}
function mazeEnd(){
  if(!$("s-maze").classList.contains("on"))return;
  var sec=Math.round((Date.now()-M.t0)/1000),n=M.n,key="MZ"+n,prev=S.best[key];
  if(!prev||sec<prev)S.best[key]=sec;
  var k=M.got+Math.ceil(n/5);S.stars+=k;S.cnt.maze=(S.cnt.maze||0)+1;if(n>=15)S.cnt.maze15=(S.cnt.maze15||0)+1;
  var st=M.got===M.total?5:M.got>=M.total-1?4:3;
  touchDay();checkBadges();save();
  showResult({title:t("mz_done"),stars:st,score:t("mz_score",{m:M.moves,t:fmtT(sec),s:M.got,k:M.total})+" (+"+k+" ⭐)",
    cmp:compare("maze"+n,sec,true,"u_sec"),best:t("mz_rec",{t:fmtT(S.best[key])}),
    again:function(){var i=SIZES.indexOf(n);mazeOpen(st===5&&i<SIZES.length-1?SIZES[i+1]:n)}});
}
// boshqaruv: tugmalar, klaviatura, surish
document.querySelectorAll("#mz-pad [data-d]").forEach(function(b){b.onclick=function(){mazeMove(b.dataset.d)}});
document.addEventListener("keydown",function(e){if(!$("s-maze").classList.contains("on"))return;
  var m={ArrowUp:"u",ArrowDown:"d",ArrowLeft:"l",ArrowRight:"r"}[e.key];if(m){e.preventDefault();mazeMove(m)}});
var tx=null,ty=null,bd=$("mz-board");
bd.addEventListener("touchstart",function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
bd.addEventListener("touchmove",function(e){e.preventDefault()},{passive:false});
bd.addEventListener("touchend",function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=null;
  if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;mazeMove(Math.abs(dx)>Math.abs(dy)?(dx>0?"r":"l"):(dy>0?"d":"u"))});
$("mz-new").onclick=function(){mazeOpen(M.n)};

/* ---------------- MANTIQIY JADVAL ---------------- */
var LG=null,CATS=[["fruit","🍎🍌🍇🍐"],["pet","🐱🐶🐰🐟"],["col","🔴🔵🟢🟡"]];
function perms(a){if(a.length<=1)return [a];var o=[];a.forEach(function(x,i){perms(a.slice(0,i).concat(a.slice(i+1))).forEach(function(p){o.push([x].concat(p))})});return o}
function fits(p,cl){return cl.every(function(c){return c.pos?p[c.who]===c.it:p[c.who]!==c.it})}
function lgMake(n){
  var sol=shuffle(range(n)),all=[],i,j,P=perms(range(n));
  for(i=0;i<n;i++)for(j=0;j<n;j++)all.push({who:i,it:j,pos:sol[i]===j});
  var neg=shuffle(all.filter(function(c){return !c.pos})),pos=shuffle(all.filter(function(c){return c.pos}));
  var pool=neg.concat(pos.slice(0,1)).concat(pos.slice(1)),cl=[];
  for(i=0;i<pool.length;i++){cl.push(pool[i]);if(P.filter(function(p){return fits(p,cl)}).length===1)break}
  // ortiqchalarini olib tashlaymiz
  for(i=cl.length-1;i>=0;i--){var tr=cl.slice(0,i).concat(cl.slice(i+1));if(P.filter(function(p){return fits(p,tr)}).length===1)cl=tr}
  return {sol:sol,clues:shuffle(cl)};
}
function lgOpen(){
  var n=S.level<=3?3:4,cat=CATS[rnd(0,2)],pz=lgMake(n);
  var names=shuffle(tA("lg_names").slice());if(S.name&&names.indexOf(S.name)<0)names[0]=S.name;names=names.slice(0,n);
  var items=tA("lg_"+cat[0]).slice(0,n),em=Array.from(cat[1]).slice(0,n);
  LG={n:n,cat:cat[0],names:names,items:items,em:em,sol:pz.sol,clues:pz.clues,cells:[],mist:0,t0:Date.now(),done:false};
  for(var i=0;i<n*n;i++)LG.cells.push(0);
  $("lg-info").textContent=t("lg_info");
  $("lg-clues").innerHTML=LG.clues.map(function(c,k){
    var txt=t("lg_"+LG.cat+(c.pos?"_pos":"_neg"),{x:LG.items[c.it]});
    return "<button class='lgc' data-k='"+k+"'><b>"+esc(LG.names[c.who])+":</b> «"+esc(txt)+"» "+LG.em[c.it]+"</button>";
  }).join("");
  document.querySelectorAll("#lg-clues .lgc").forEach(function(b){b.onclick=function(){b.classList.toggle("used");var c=LG.clues[+b.dataset.k];speak(LG.names[c.who]+": "+t("lg_"+LG.cat+(c.pos?"_pos":"_neg"),{x:LG.items[c.it]}))}});
  $("lg-fb").textContent="";
  lgDraw();updStars();show("s-logic");
}
function lgDraw(){
  var n=LG.n,h="<table class='lgt'><tr><th></th>";
  for(var j=0;j<n;j++)h+="<th><span class='lge'>"+LG.em[j]+"</span><small>"+esc(LG.items[j])+"</small></th>";
  h+="</tr>";
  for(var i=0;i<n;i++){h+="<tr><th class='lgn'>"+esc(LG.names[i])+"</th>";
    for(j=0;j<n;j++){var v=LG.cells[i*n+j];h+="<td><button class='lgx s"+v+"' data-i='"+(i*n+j)+"'>"+(v===1?"✗":v===2?"✓":"")+"</button></td>"}
    h+="</tr>"}
  $("lg-grid").innerHTML=h+"</table>";
  document.querySelectorAll("#lg-grid .lgx").forEach(function(b){b.onclick=function(){if(LG.done)return;var i=+b.dataset.i;LG.cells[i]=(LG.cells[i]+1)%3;lgDraw();lgAuto()}});
}
function lgRows(){var n=LG.n,a=[];for(var i=0;i<n;i++){var y=[];for(var j=0;j<n;j++)if(LG.cells[i*n+j]===2)y.push(j);a.push(y)}return a}
function lgAuto(){var a=lgRows();if(a.every(function(y){return y.length===1}))lgCheck(true)}
function lgCheck(auto){
  if(LG.done)return;var a=lgRows();
  if(!a.every(function(y){return y.length===1})){if(!auto){$("lg-fb").style.color="#791F1F";$("lg-fb").textContent=t("lg_need")}return}
  var ok=a.every(function(y,i){return y[0]===LG.sol[i]});
  if(!ok){if(!auto)LG.mist++;beep(false);$("lg-fb").style.color="#791F1F";$("lg-fb").textContent=t("lg_wrong");return}
  LG.done=true;beep(true);
  var sec=Math.round((Date.now()-LG.t0)/1000),st=LG.mist===0?5:LG.mist===1?4:3,k=LG.n===3?3:5;
  S.stars+=k;S.cnt.logic=(S.cnt.logic||0)+1;touchDay();checkBadges();save();
  setTimeout(function(){showResult({title:t("lg_done"),stars:st,score:t("lg_score",{m:LG.mist,t:fmtT(sec)})+" (+"+k+" ⭐)",
    cmp:compare("logic"+LG.n,sec,true,"u_sec"),again:lgOpen})},500);
}
$("lg-check").onclick=function(){lgCheck(false)};
$("lg-new").onclick=lgOpen;
$("lg-clear").onclick=function(){LG.cells=LG.cells.map(function(){return 0});$("lg-fb").textContent="";lgDraw()};

/* ---------------- ulash ---------------- */
document.querySelectorAll("#s-games [data-soon2]").forEach(function(b){
  if(b.querySelector(".em").textContent==="🌀"){b.removeAttribute("data-soon2");b.classList.remove("dim");var s=b.querySelector(".soon");if(s)s.remove();b.id="go-maze";b.onclick=function(){mazeOpen()}}
});
$("go-logic").onclick=lgOpen;
window.mazeOpen=mazeOpen;window.lgOpen=lgOpen;window._lgMake=lgMake;
})();
