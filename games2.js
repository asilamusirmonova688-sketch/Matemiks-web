/* =========================================================
   O'YINLAR: Xanoy minorasi va «24»
   ========================================================= */
(function(){
BADGES.push({id:"hanoi",e:"🗼",ok:function(p){return (p.cnt.hanoi5||0)>=1}});
BADGES.push({id:"k24",e:"🎯",ok:function(p){return (p.cnt.g24||0)>=20}});
var DCOL=["#E24B4A","#EF9F27","#F2C94C","#1D9E75","#378ADD","#7F77DD"];

/* ---------------- XANOY ---------------- */
var H=null;
function hanoiOpen(n){
  if(!n)n=(S.hanoiN)||(S.level<=3?3:4);
  S.hanoiN=n;save();
  H={n:n,pegs:[[],[],[]],sel:-1,moves:0,hints:0,min:Math.pow(2,n)-1,done:false};
  for(var d=n;d>=1;d--)H.pegs[0].push(d);
  var ch="";[3,4,5].forEach(function(k){ch+="<button class='chip"+(k===n?" sel":"")+"' data-n='"+k+"'>"+t("hn_disks",{n:k})+"</button>"});
  $("hn-chips").innerHTML=ch;
  document.querySelectorAll("#hn-chips .chip").forEach(function(b){b.onclick=function(){hanoiOpen(+b.dataset.n)}});
  $("hn-info").textContent=t("hn_info");
  hanoiDraw();updStars();show("s-hanoi");
}
function hanoiDraw(){
  var h="";
  for(var p=0;p<3;p++){
    h+="<button class='hpeg"+(H.sel===p?" sel":"")+(p===2?" goal":"")+"' data-p='"+p+"'><span class='hrod'></span>";
    H.pegs[p].forEach(function(d,i){
      var w=30+d*(64/H.n);
      h+="<span class='hdisk' style='width:"+w+"%;bottom:"+(8+i*26)+"px;background:"+DCOL[d-1]+(H.sel===p&&i===H.pegs[p].length-1?";transform:translateY(-18px)":"")+"'></span>";
    });
    h+=(p===2?"<span class='hflag'>🏁</span>":"")+"</button>";
  }
  $("hn-board").innerHTML=h;
  $("hn-moves").textContent=t("hn_moves",{n:H.moves,m:H.min});
  document.querySelectorAll("#hn-board .hpeg").forEach(function(b){b.onclick=function(){hanoiTap(+b.dataset.p)}});
}
function hanoiTap(p){
  if(H.done)return;
  if(H.sel<0){if(H.pegs[p].length){H.sel=p;hanoiDraw()}return}
  if(H.sel===p){H.sel=-1;hanoiDraw();return}
  var from=H.pegs[H.sel],to=H.pegs[p],d=from[from.length-1];
  if(to.length&&to[to.length-1]<d){toast("🙅 "+t("hn_bad"));beep(false);H.sel=-1;hanoiDraw();return}
  to.push(from.pop());H.sel=-1;H.moves++;hanoiDraw();
  if(H.pegs[2].length===H.n){H.done=true;setTimeout(hanoiEnd,500)}
}
// joriy holatdan keyingi eng yaxshi yurish
function hanoiNext(){
  var pos={};H.pegs.forEach(function(pg,i){pg.forEach(function(d){pos[d]=i})});
  function mv(k,tg){if(k===0)return null;var p=pos[k];if(p===tg)return mv(k-1,tg);var o=3-p-tg,m=mv(k-1,o);return m||[p,tg]}
  return mv(H.n,2);
}
function hanoiHint(){
  if(H.done)return;var m=hanoiNext();if(!m)return;H.hints++;H.sel=m[0];hanoiDraw();
  var el=document.querySelectorAll("#hn-board .hpeg")[m[1]];el.classList.add("hint");setTimeout(function(){el.classList.remove("hint")},1200);
}
function hanoiEnd(){
  if(!$("s-hanoi").classList.contains("on"))return;
  var m=H.moves,k=H.min,key="H"+H.n,prev=S.best[key],rec=!prev||m<prev;
  if(rec)S.best[key]=m;
  var st=m===k?5:m<=k*1.5?4:m<=k*2?3:2;if(H.hints)st=Math.max(2,st-1);
  S.cnt.hanoi=(S.cnt.hanoi||0)+1;if(H.n>=5&&!H.hints)S.cnt.hanoi5=(S.cnt.hanoi5||0)+1;
  S.stars+=st;touchDay();checkBadges();save();
  var n=H.n;
  showResult({title:t("hn_done"),stars:st,score:t("hn_score",{m:t("u_moves",{v:m}),k:k}),
    cmp:compare("hanoi"+n,m,true,"u_moves"),best:t("hn_rec",{b:t("u_moves",{v:S.best[key]})}),
    again:function(){hanoiOpen(n<5&&st===5?n+1:n)}});
}

/* ---------------- «24» ---------------- */
var G=null,ROUNDS=5;
function cfg24(){return S.level<=3?{tg:10,max:6,ops:"+-×"}:{tg:24,max:9,ops:"+-×÷"}}
function ap(a,b,o){ // bolalar qoidasi: manfiy va kasr yo'q
  if(o==="+")return a+b;if(o==="×")return a*b;
  if(o==="-")return a>=b?a-b:null;
  if(o==="÷")return b!==0&&a%b===0?a/b:null;return null;
}
function solve(items,tg,ops){ // items: [{v,s}] -> {s,steps}
  if(items.length===1)return items[0].v===tg?{s:items[0].s,steps:[]}:null;
  for(var i=0;i<items.length;i++)for(var j=0;j<items.length;j++){if(i===j)continue;
    for(var k=0;k<ops.length;k++){var o=ops[k];
      if((o==="+"||o==="×")&&j<i)continue;
      var v=ap(items[i].v,items[j].v,o);if(v===null)continue;
      var rest=items.filter(function(_,x){return x!==i&&x!==j});
      var ex=items[i].s+" "+o+" "+items[j].s;
      rest.push({v:v,s:rest.length?"("+ex+")":ex});
      var r=solve(rest,tg,ops);
      if(r)return {s:r.s,steps:[items[i].v+" "+(o==="-"?"−":o)+" "+items[j].v+" = "+v].concat(r.steps)};
    }}
  return null;
}
function sol(nums,c){var r=solve(nums.map(function(v){return {v:v,s:String(v)}}),c.tg,c.ops);if(r){r.first=r.steps[0];r.s=r.s.replace(/-/g,"−")}return r}
function newPuzzle(){
  var c=cfg24(),g=0,nums,r;
  do{nums=[rnd(1,c.max),rnd(1,c.max),rnd(1,c.max),rnd(1,c.max)];r=sol(nums,c)}while((!r||nums.every(function(x){return x===nums[0]}))&&g++<500);
  G.c=c;G.start=nums.slice();G.sol=r;G.tiles=nums.map(function(v,i){return {v:v,id:i}});G.hist=[];G.a=-1;G.op=null;G.hinted=false;
  $("g24-info").textContent=t("g24_info",{t:c.tg});
  $("g24-round").textContent=t("g24_round",{i:G.i+1,n:ROUNDS});
  $("g24-target").textContent=c.tg;
  g24Draw();
}
function g24Open(){G={i:0,ok:0,t0:Date.now()};newPuzzle();updStars();show("s-g24")}
function g24Draw(){
  $("g24-tiles").innerHTML=G.tiles.map(function(x,i){return "<button class='g24n"+(G.a===i?" sel":"")+"' data-i='"+i+"'>"+x.v+"</button>"}).join("");
  $("g24-ops").innerHTML=G.c.ops.split("").map(function(o){return "<button class='gop"+(G.op===o?" sel":"")+"' data-o='"+o+"'>"+(o==="-"?"−":o)+"</button>"}).join("");
  document.querySelectorAll("#g24-tiles .g24n").forEach(function(b){b.onclick=function(){g24Tile(+b.dataset.i)}});
  document.querySelectorAll("#g24-ops .gop").forEach(function(b){b.onclick=function(){if(G.a<0){toast(t("g24_pick"));return}G.op=b.dataset.o;g24Draw()}});
}
function g24Tile(i){
  if(G.a<0||G.op===null||G.a===i){G.a=(G.a===i?-1:i);G.op=null;g24Draw();return}
  var a=G.tiles[G.a].v,b=G.tiles[i].v,o=G.op;
  if(o==="-"&&a<b){var x=a;a=b;b=x}
  var v=ap(a,b,o);
  if(v===null){toast("🤔 "+t("g24_div"));G.op=null;g24Draw();return}
  G.hist.push(G.tiles.map(function(x){return {v:x.v,id:x.id}}));
  var nt=G.tiles.filter(function(_,k){return k!==G.a&&k!==i});nt.push({v:v,id:"r"+G.hist.length});
  G.tiles=nt;G.a=-1;G.op=null;beep(true);
  if(nt.length===1){G.a=-1;g24Draw();
    if(v===G.c.tg){G.ok++;S.cnt.g24=(S.cnt.g24||0)+1;addStar($("g24-target"));toast(praise());setTimeout(g24Next,900)}
    else{toast(t("g24_wrong",{v:v,t:G.c.tg}));beep(false)}
    return}
  g24Draw();
}
function g24Next(){G.i++;if(G.i>=ROUNDS)g24End();else newPuzzle()}
function g24End(){
  if(!$("s-g24").classList.contains("on"))return;
  var key="G24_"+G.c.tg,prev=S.best[key]||0;if(G.ok>prev)S.best[key]=G.ok;
  var st=G.ok===5?5:G.ok===4?4:G.ok>=2?3:2;
  touchDay();checkBadges();save();
  showResult({title:t("g24_done"),stars:st,score:t("g24_score",{n:ROUNDS,c:G.ok}),cmp:compare("g24_"+G.c.tg,G.ok,false),
    best:t("g24_rec",{b:S.best[key]+"/"+ROUNDS}),again:g24Open});
}

/* ---------------- ulash ---------------- */
function wire(){
  var tiles=document.querySelectorAll("#s-games [data-soon2]");
  tiles.forEach(function(b){
    var em=b.querySelector(".em").textContent;
    if(em==="🗼"){b.removeAttribute("data-soon2");b.classList.remove("dim");b.querySelector(".soon").remove();b.id="go-hanoi";b.onclick=function(){hanoiOpen()}}
    if(em==="🎯"){b.removeAttribute("data-soon2");b.classList.remove("dim");b.querySelector(".soon").remove();b.id="go-24";b.onclick=g24Open}
  });
}
wire();
$("hn-hint").onclick=hanoiHint;
$("hn-reset").onclick=function(){hanoiOpen(H.n)};
$("g24-undo").onclick=function(){if(!G.hist.length)return;G.tiles=G.hist.pop();G.a=-1;G.op=null;g24Draw()};
$("g24-reset").onclick=function(){G.tiles=G.start.map(function(v,i){return {v:v,id:i}});G.hist=[];G.a=-1;G.op=null;g24Draw()};
$("g24-hint").onclick=function(){G.hinted=true;toast("💡 "+t("g24_hint_t",{s:G.sol.first}))};
$("g24-skip").onclick=function(){toast(t("g24_sol",{s:G.sol.s+" = "+G.c.tg}));setTimeout(g24Next,1800)};
window.hanoiOpen=hanoiOpen;window.g24Open=g24Open;window._g24solve=sol;
})();
