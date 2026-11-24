/* =========================================================
   SHAXMAT: darslar, 1 yurishda mat, kompyuterga qarshi o'yin
   ========================================================= */
(function(){
var GLYPH={K:"♚",Q:"♛",R:"♜",B:"♝",N:"♞",P:"♟"};
var LESSONS=[
  {p:"R",fen:"8/8/8/8/8/8/8/R7 w - - 0 1",stars:["a5","e5","e8"]},
  {p:"B",fen:"8/8/8/8/8/8/8/2B5 w - - 0 1",stars:["e3","b6","d8"]},
  {p:"Q",fen:"8/8/8/8/8/8/8/3Q4 w - - 0 1",stars:["d6","a3","h3"]},
  {p:"K",fen:"8/8/8/8/8/8/8/4K3 w - - 0 1",stars:["e2","f3","g3"]},
  {p:"N",fen:"8/8/8/8/8/8/8/1N6 w - - 0 1",stars:["c3","e4","f6"]},
  {p:"P",fen:"8/8/5n2/8/8/8/4P3/8 w - - 0 1",stars:["e4","e5"]}
];
var PUZZLES=[
  "k7/8/1K6/8/8/8/8/7R w - - 0 1",
  "6k1/5ppp/8/8/8/8/8/4Q1K1 w - - 0 1",
  "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
  "7k/R7/8/8/8/8/8/1R4K1 w - - 0 1",
  "k7/8/1K6/8/8/8/8/7Q w - - 0 1",
  "7k/5Q2/6K1/8/8/8/8/8 w - - 0 1",
  "4k3/R7/4K3/8/8/8/8/8 w - - 0 1",
  "7k/7p/5N2/8/8/8/8/6RK w - - 0 1",
  "6k1/5p1p/6pB/8/8/8/5PPP/3Q2K1 w - - 0 1",
  "rnbqkbnr/ppppp2p/5p2/6p1/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
  "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
  "6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1"
];
var REWARD={1:5,2:10,3:20};
var G={};          /* joriy holat */

function chessData(){if(!S.chess)S.chess={les:{},puz:{},wins:{1:0,2:0,3:0},games:0};return S.chess}
BADGES.push({id:"chess",e:"♟️",ok:function(p){return p.chess&&(p.chess.wins[1]+p.chess.wins[2]+p.chess.wins[3])>=1}});
BADGES.push({id:"chesspz",e:"🧩",ok:function(p){return p.chess&&Object.keys(p.chess.puz).length>=PUZZLES.length}});

/* ---------- taxtani chizish ---------- */
function render(){
  var box=$("cb-board");box.innerHTML="";
  var s=G.s,sel=G.sel,targets={},last=G.last||{},chk=-1;
  if(sel!=null)G.moves.forEach(function(m){targets[m.to]=m});
  if(G.mode!=="lesson"&&CE.inCheck(s,s.turn))chk=CE.kingSq(s,s.turn);
  for(var i=0;i<64;i++)(function(i){
    var r=i>>3,f=i&7,c=document.createElement("button"),p=s.b[i];
    c.className="cq "+((r+f)%2?"dk":"lt");
    if(i===last.from||i===last.to)c.classList.add("lm");
    if(i===sel)c.classList.add("sl");
    if(i===chk)c.classList.add("ck");
    if(G.hint===i)c.classList.add("hn");
    if(p){var sp=document.createElement("span");sp.className="pc "+(CE.col(p)==="w"?"w":"b");sp.textContent=GLYPH[p.toUpperCase()]+"︎";c.appendChild(sp)}
    else if(G.stars&&G.stars.indexOf(i)>=0){var st=document.createElement("span");st.className="star";st.textContent="⭐";c.appendChild(st)}
    if(targets[i]!==undefined){var d=document.createElement("i");d.className=p?"cap":"dot";c.appendChild(d)}
    if(f===0){var rl=document.createElement("small");rl.className="rl";rl.textContent=8-r;c.appendChild(rl)}
    if(r===7){var fl=document.createElement("small");fl.className="fl";fl.textContent="abcdefgh"[f];c.appendChild(fl)}
    c.onclick=function(){tap(i)};
    box.appendChild(c);
  })(i);
}
function tap(i){
  if(G.lock)return;
  var s=G.s,p=s.b[i];
  if(G.sel!=null){
    var m=G.moves.filter(function(x){return x.to===i})[0];
    if(m){
      if(m.promo){var q=G.moves.filter(function(x){return x.to===i&&x.promo&&x.promo.toUpperCase()==="Q"})[0];if(q)m=q}
      doMove(m);return;
    }
  }
  if(p&&CE.col(p)===s.turn&&(G.mode!=="play"||s.turn==="w")){
    G.sel=i;G.moves=CE.legal(s,i);G.hint=null;
    if(!G.moves.length)G.sel=null;
  }else{G.sel=null;G.moves=[]}
  render();
}
function doMove(m){
  G.hist.push({s:G.s,last:G.last,stars:G.stars?G.stars.slice():null});
  G.s=CE.make(G.s,m);G.last={from:m.from,to:m.to};G.sel=null;G.moves=[];
  if(m.promo)toast(t("ch_promo"));
  beep(true);
  if(G.mode==="lesson")afterLesson(m);
  else if(G.mode==="puzzle")afterPuzzle(m);
  else afterPlay();
}

/* ---------- ekranni ochish ---------- */
function board(title,info){
  $("cb-title").textContent=title;
  $("cb-info").innerHTML=info||"";$("cb-info").style.display=info?"block":"none";
  $("cb-status").textContent="";$("cb-actions").innerHTML="";
  show("s-chessboard");
}
function btn(label,cls,fn){var b=document.createElement("button");b.className="btn "+(cls||"");b.textContent=label;b.onclick=fn;$("cb-actions").appendChild(b);return b}
function status(txt,color){var el=$("cb-status");el.textContent=txt;el.style.color=color||""}

/* ---------- shaxmat menyusi ---------- */
function openChess(){
  stopTimers();chessAbort();
  var cd=chessData(),box=$("ch-list");box.innerHTML="";
  var ld=Object.keys(cd.les).length,pd=Object.keys(cd.puz).length;
  [["📖","ch_lessons",t("ch_lessons_sub",{d:ld,n:LESSONS.length}),function(){openLesson(Math.min(ld,LESSONS.length-1))}],
   ["🧩","ch_puzzles",t("ch_puzzles_sub",{d:pd,n:PUZZLES.length}),function(){openPuzzle(firstUnsolved())}],
   ["🤖","ch_play",t("ch_play_sub"),null]].forEach(function(x){
    var b=document.createElement("button");b.className="tcard";
    b.innerHTML="<span class='te'>"+x[0]+"</span><span class='tt'><b>"+t(x[1])+"</b><small>"+x[2]+"</small></span><span style='font-size:22px'>▶</span>";
    if(x[3])b.onclick=x[3];else{b.onclick=function(){$("ch-levels").style.display="block";b.scrollIntoView({behavior:"smooth"})}}
    box.appendChild(b);
  });
  var lv=$("ch-levels");lv.style.display="none";lv.innerHTML="<h3>"+t("ch_choose")+"</h3>";
  [1,2,3].forEach(function(l){
    var b=document.createElement("button");b.className="tcard";
    b.innerHTML="<span class='te'>"+["","🟢","🟡","🔴"][l]+"</span><span class='tt'><b>"+t("ch_lv"+l)+"</b><small>"+t("ch_wins",{n:cd.wins[l]||0})+" · "+t("ch_reward",{n:REWARD[l]})+"</small></span><span style='font-size:22px'>▶</span>";
    b.onclick=function(){startPlay(l)};lv.appendChild(b);
  });
  updStars();show("s-chess");
}
function chessAbort(){if(G&&G.aiT){clearTimeout(G.aiT);G.aiT=null}}

/* ---------- darslar ---------- */
function openLesson(i){
  var L=LESSONS[i];
  G={mode:"lesson",i:i,s:CE.fromFEN(L.fen),stars:L.stars.map(CE.parseSq),hist:[],sel:null,moves:[],moveN:0};
  var pc=t("pc_"+L.p);
  board("📖 "+(i+1)+"/"+LESSONS.length+" · "+GLYPH[L.p]+"︎ "+pc,"<b>"+pc+":</b> "+t("ls_"+L.p)+"<br>🎯 "+t(L.p==="P"?"ls_goal_cap":"ls_goal"));
  status(t("ls_moves",{n:0}));
  btn(t("ch_restart"),"sec small",function(){openLesson(i)});
  render();
}
function afterLesson(m){
  G.s.turn="w";G.s.ep=-1;G.moveN++;
  var k=G.stars.indexOf(m.to);if(k>=0){G.stars.splice(k,1);flyStarAt(m.to)}
  var blacks=G.s.b.some(function(p){return p&&CE.col(p)==="b"});
  render();status(t("ls_moves",{n:G.moveN}));
  if(!G.stars.length&&!blacks){
    var cd=chessData(),first=!cd.les[G.i];cd.les[G.i]=1;if(first){S.stars+=2;touchDay()}checkBadges();save();updStars();
    beep(true);status(t("ls_done"),"#27500A");
    $("cb-actions").innerHTML="";
    if(G.i<LESSONS.length-1)btn(t("ls_next"),"",function(){openLesson(G.i+1)});
    else{status(t("ls_all"),"#27500A");btn(t("ch_to_puzzles"),"",function(){openPuzzle(firstUnsolved())})}
    btn(t("ch_menu"),"sec small",openChess);
  }
}
function flyStarAt(i){var el=$("cb-board").children[i];if(el)flyStar(el)}

/* ---------- 1 yurishda mat ---------- */
function firstUnsolved(){var cd=chessData();for(var i=0;i<PUZZLES.length;i++)if(!cd.puz[i])return i;return 0}
function openPuzzle(i){
  G={mode:"puzzle",i:i,s:CE.fromFEN(PUZZLES[i]),hist:[],sel:null,moves:[],tries:0};
  board("🧩 "+t("ch_pz_n",{i:i+1,n:PUZZLES.length}),t("ch_pz_intro"));
  status(t("ch_tap"));
  btn(t("ch_hint_btn"),"sec small",function(){var ms=CE.mates(G.s);if(ms.length){G.hint=ms[0].from;render();status(t("ch_hint"))}});
  render();
}
function afterPuzzle(m){
  render();
  if(CE.status(G.s)==="mate"){
    var cd=chessData(),first=!cd.puz[G.i];cd.puz[G.i]=1;
    if(first){S.stars+=G.tries===0?3:1;touchDay()}
    record(G.tries===0,"puz");checkBadges();save();updStars();
    status(t("ch_pz_ok"),"#27500A");beep(true);
    $("cb-actions").innerHTML="";
    var all=Object.keys(cd.puz).length>=PUZZLES.length;
    if(G.i<PUZZLES.length-1)btn(t("ch_pz_next"),"",function(){openPuzzle(G.i+1)});
    else if(all)status(t("ch_pz_all"),"#27500A");
    btn(t("ch_menu"),"sec small",openChess);
    G.lock=true;
  }else{
    G.tries++;beep(false);status(t("ch_pz_wrong"),"#A32D2D");G.lock=true;
    setTimeout(function(){var h=G.hist.pop();G.s=h.s;G.last=h.last;G.lock=false;render()},900);
  }
}

/* ---------- kompyuterga qarshi ---------- */
function startPlay(l){
  chessAbort();
  G={mode:"play",lv:l,s:CE.fromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"),hist:[],sel:null,moves:[],over:false};
  board("🤖 "+t("ch_lv"+l),"");
  btn(t("ch_undo"),"sec small",undo);
  btn(t("ch_new"),"sec small",function(){startPlay(l)});
  status(t("ch_your"));render();
}
function undo(){
  if(G.lock||G.over||G.hist.length<2)return;
  G.hist.pop();var h=G.hist.pop();G.s=h.s;G.last=h.last;G.sel=null;G.moves=[];render();status(t("ch_your"));
}
function afterPlay(){
  render();
  if(end())return;
  G.lock=true;status(t("ch_think"));
  G.aiT=setTimeout(function(){
    G.aiT=null;
    var m=CE.bestMove(G.s,G.lv);
    if(m){G.hist.push({s:G.s,last:G.last});G.s=CE.make(G.s,m);G.last={from:m.from,to:m.to}}
    G.lock=false;render();
    if(!end())status(CE.inCheck(G.s,"w")?t("ch_check"):t("ch_your"),CE.inCheck(G.s,"w")?"#A32D2D":"");
  },450);
}
function end(){
  var st=CE.status(G.s);
  if(st==="play"||st==="check")return false;
  G.over=true;G.lock=true;
  var cd=chessData();cd.games++;touchDay();
  if(st==="mate"&&G.s.turn==="b"){
    cd.wins[G.lv]=(cd.wins[G.lv]||0)+1;S.stars+=REWARD[G.lv];checkBadges();save();updStars();
    status(t("ch_win")+" "+t("ch_reward",{n:REWARD[G.lv]}),"#27500A");beep(true);
    if(G.lv<3)btn(t("ch_try_lv",{l:t("ch_lv"+(G.lv+1))}),"",function(){startPlay(G.lv+1)});
  }else if(st==="mate"){status(t("ch_lose"),"#A32D2D");save()}
  else{status(st==="stalemate"?t("ch_stalemate"):t("ch_draw"),"#633806");save()}
  btn(t("ch_menu"),"sec small",openChess);
  return true;
}

/* ---------- ulash ---------- */
$("go-chess").onclick=openChess;
$("cb-back").onclick=function(){chessAbort();openChess()};
$("ch-back").onclick=openMenu;
var _stop=stopTimers;stopTimers=function(){_stop();chessAbort()};
})();
