/* =========================================================
   SUDOKU: 4×4, 6×6, 9×9 — 3 xil qiyinlik, qoralama, yordam
   ========================================================= */
(function(){
BADGES.push({id:"sud9",e:"🧩",ok:function(p){return (p.cnt.sud9||0)>=1}});
var BOX={4:[2,2],6:[2,3],9:[3,3]};
var HOLES={4:[6,8,10],6:[14,18,22],9:[36,44,50]};
var STARS={4:3,6:5,9:8};
var Z=null;

function makeFull(n){
  var br=BOX[n][0],bc=BOX[n][1],g=[],r,c;
  for(r=0;r<n;r++){g.push([]);for(c=0;c<n;c++)g[r].push((bc*(r%br)+Math.floor(r/br)+c)%n+1)}
  // qatorlar: bandlar ichida va bandlar
  var bands=n/br,rows=[];shuffle(range(bands)).forEach(function(b){shuffle(range(br)).forEach(function(i){rows.push(b*br+i)})});
  var stacks=n/bc,cols=[];shuffle(range(stacks)).forEach(function(s){shuffle(range(bc)).forEach(function(i){cols.push(s*bc+i)})});
  var perm=shuffle(range(n)).map(function(x){return x+1});
  return rows.map(function(rr){return cols.map(function(cc){return perm[g[rr][cc]-1]})});
}
function range(k){var a=[];for(var i=0;i<k;i++)a.push(i);return a}
function peers(n,i){var br=BOX[n][0],bc=BOX[n][1],r=Math.floor(i/n),c=i%n,o={};
  for(var k=0;k<n;k++){o[r*n+k]=1;o[k*n+c]=1}
  var r0=r-r%br,c0=c-c%bc;for(var a=0;a<br;a++)for(var b=0;b<bc;b++)o[(r0+a)*n+c0+b]=1;
  delete o[i];return Object.keys(o).map(Number)}
function countSol(cells,n,limit,P){ // cells: tekis massiv, 0 = bo'sh
  var best=-1,bm=0,bc=99;
  for(var i=0;i<cells.length;i++)if(!cells[i]){
    var used=0;P[i].forEach(function(p){if(cells[p])used|=1<<cells[p]});
    var cnt=0;for(var v=1;v<=n;v++)if(!(used&1<<v))cnt++;
    if(cnt<bc){bc=cnt;best=i;bm=used;if(cnt<=1)break}
  }
  if(best<0)return 1;
  var tot=0;
  for(v=1;v<=n;v++)if(!(bm&1<<v)){cells[best]=v;tot+=countSol(cells,n,limit-tot,P);cells[best]=0;if(tot>=limit)break}
  return tot;
}
function makePuzzle(n,d){
  var P=[];for(var q=0;q<n*n;q++)P.push(peers(n,q));
  var full=makeFull(n),sol=[].concat.apply([],full),cells=sol.slice(),target=HOLES[n][d],holes=0;
  shuffle(range(n*n)).forEach(function(i){
    if(holes>=target)return;var v=cells[i];cells[i]=0;
    if(countSol(cells.slice(),n,2,P)===1)holes++;else cells[i]=v;
  });
  return {sol:sol,cells:cells};
}
function open(n,d){
  var cfg=S.sudCfg||{n:S.level<=2?4:S.level<=4?6:9,d:0};
  if(n==null)n=cfg.n;if(d==null)d=cfg.d;S.sudCfg={n:n,d:d};save();
  Z={n:n,d:d,P:[]};for(var i=0;i<n*n;i++)Z.P.push(peers(n,i));
  var pz=makePuzzle(n,d);
  Z.sol=pz.sol;Z.cells=pz.cells;Z.given=pz.cells.map(function(v){return v>0});
  Z.notes=pz.cells.map(function(){return {}});Z.sel=-1;Z.note=false;Z.mist=0;Z.hints=0;Z.t0=Date.now();Z.done=false;
  var h="";[4,6,9].forEach(function(k){h+="<button class='chip"+(k===n?" sel":"")+"' data-n='"+k+"'>"+k+"×"+k+"</button>"});
  $("sd-size").innerHTML=h;
  h="";["sd_easy","sd_med","sd_hard"].forEach(function(k,j){h+="<button class='chip"+(j===d?" sel":"")+"' data-d='"+j+"'>"+t(k)+"</button>"});
  $("sd-diff").innerHTML=h;
  document.querySelectorAll("#sd-size .chip").forEach(function(b){b.onclick=function(){open(+b.dataset.n,Z.d)}});
  document.querySelectorAll("#sd-diff .chip").forEach(function(b){b.onclick=function(){open(Z.n,+b.dataset.d)}});
  $("sd-info").textContent=t("sd_info",{n:n});
  var pad="";for(var v=1;v<=n;v++)pad+="<button data-n='"+v+"'>"+v+"</button>";pad+="<button data-n='0' aria-label='Erase'>⌫</button>";
  $("sd-pad").innerHTML=pad;$("sd-pad").style.gridTemplateColumns="repeat("+(n===9?5:n+1)+",1fr)";
  document.querySelectorAll("#sd-pad button").forEach(function(b){b.onclick=function(){put(+b.dataset.n)}});
  $("sd-fb").textContent="";
  draw();updStars();show("s-sud2");
}
function conflicts(){var bad={};
  Z.cells.forEach(function(v,i){if(!v)return;Z.P[i].forEach(function(p){if(Z.cells[p]===v){bad[i]=1;bad[p]=1}})});return bad}
function draw(){
  var n=Z.n,br=BOX[n][0],bc=BOX[n][1],bad=conflicts(),sv=Z.sel>=0?Z.cells[Z.sel]:0,h="";
  var g=$("sd-grid");g.className="sud sz"+n;g.style.gridTemplateColumns="repeat("+n+",1fr)";
  for(var i=0;i<n*n;i++){
    var r=Math.floor(i/n),c=i%n,v=Z.cells[i],cl=[];
    if(Z.given[i])cl.push("given");
    if(i===Z.sel)cl.push("sel");else if(Z.sel>=0&&Z.P[Z.sel].indexOf(i)>=0)cl.push("rel");
    if(v&&sv&&v===sv&&i!==Z.sel)cl.push("same");
    if(bad[i]&&!Z.given[i])cl.push("wrong");
    if(c%bc===bc-1&&c<n-1)cl.push("br");if(r%br===br-1&&r<n-1)cl.push("bb");
    var inner=v?String(v):"";
    if(!v){var ks=Object.keys(Z.notes[i]);if(ks.length){var cols=n===4?2:3;inner="<span class='nts' style='grid-template-columns:repeat("+cols+",1fr)'>";for(var k=1;k<=n;k++)inner+="<i>"+(Z.notes[i][k]?k:"")+"</i>";inner+="</span>"}}
    h+="<button class='"+cl.join(" ")+"' data-i='"+i+"'>"+inner+"</button>";
  }
  g.innerHTML=h;
  document.querySelectorAll("#sd-grid button").forEach(function(b){b.onclick=function(){var i=+b.dataset.i;Z.sel=i;draw()}});
  $("sd-mist").textContent=t("sd_mist",{n:Z.mist});
  $("sd-note").classList.toggle("on",Z.note);
}
function put(v){
  if(Z.done)return;
  if(Z.sel<0||Z.given[Z.sel]){$("sd-fb").style.color="#791F1F";$("sd-fb").textContent=t("sud_pick");return}
  var i=Z.sel;$("sd-fb").textContent="";
  if(Z.note&&v){if(Z.cells[i])return;if(Z.notes[i][v])delete Z.notes[i][v];else Z.notes[i][v]=1;draw();return}
  Z.cells[i]=v;
  if(v){
    Z.notes[i]={};Z.P[i].forEach(function(p){delete Z.notes[p][v]});
    var clash=Z.P[i].some(function(p){return Z.cells[p]===v});
    if(clash){Z.mist++;beep(false);$("sd-fb").style.color="#791F1F";$("sd-fb").textContent=t("sd_conf")}
  }
  draw();
  if(Z.cells.every(function(x){return x>0})&&!Object.keys(conflicts()).length)win();
}
function hint(){
  if(Z.done)return;
  var i=Z.sel;
  if(i<0||Z.given[i]||Z.cells[i]===Z.sol[i]){var e=[];Z.cells.forEach(function(v,k){if(v!==Z.sol[k])e.push(k)});if(!e.length)return;i=e[rnd(0,e.length-1)]}
  Z.hints++;Z.sel=i;Z.cells[i]=Z.sol[i];Z.given[i]=true;Z.notes[i]={};
  Z.P[i].forEach(function(p){delete Z.notes[p][Z.sol[i]]});
  draw();toast("💡 "+t("sd_hinted",{v:Z.sol[i]}));
  if(Z.cells.every(function(x){return x>0})&&!Object.keys(conflicts()).length)win();
}
function fmtT(s){var m=Math.floor(s/60),x=s%60;return m+":"+(x<10?"0":"")+x}
function win(){
  Z.done=true;
  var sec=Math.round((Date.now()-Z.t0)/1000),n=Z.n,d=Z.d,key="SD"+n+"_"+d,prev=S.best[key];
  if(!prev||sec<prev)S.best[key]=sec;
  var st=5-Math.min(2,Math.ceil(Z.mist/2))-Math.min(2,Z.hints);if(st<2)st=2;
  var k=STARS[n]+d;S.stars+=k;S.cnt.sud=(S.cnt.sud||0)+1;if(n===9&&Z.hints<=3)S.cnt.sud9=(S.cnt.sud9||0)+1;
  beep(true);touchDay();checkBadges();save();
  setTimeout(function(){
    showResult({title:t("sud_done"),stars:st,score:t("sd_score",{t:fmtT(sec),k:k}),cmp:compare("sd"+n+"_"+d,sec,true,"u_sec"),
      best:t("sd_rec",{t:fmtT(S.best[key])}),again:function(){open(n,d)}});
  },500);
}
$("pz-sud").onclick=function(){open()};
$("sd-note").onclick=function(){Z.note=!Z.note;draw()};
$("sd-hint").onclick=hint;
$("sd-new").onclick=function(){open(Z.n,Z.d)};
window.sud2Open=open;window._sudCount=function(n,d){var p=makePuzzle(n,d);return p.cells.filter(function(v){return !v}).length};
})();
