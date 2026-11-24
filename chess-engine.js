/* =========================================================
   SHAXMAT DVIGATELI
   Taxta: 64 katakli massiv, 0 = a8, 63 = h1.
   Oq donalar katta harf (PNBRQK), qora donalar kichik harf.
   ========================================================= */
var CE=(function(){
  var N_OFF=[-17,-15,-10,-6,6,10,15,17],K_OFF=[-9,-8,-7,-1,1,7,8,9];
  var ROOK_D=[[-1,0],[1,0],[0,-1],[0,1]],BISH_D=[[-1,-1],[-1,1],[1,-1],[1,1]];
  function isW(p){return p&&p===p.toUpperCase()}
  function col(p){return p?(isW(p)?"w":"b"):null}
  function rf(s){return [s>>3,s&7]}
  function sq(r,f){return r*8+f}
  function ok(r,f){return r>=0&&r<8&&f>=0&&f<8}
  function name(s){return "abcdefgh"[s&7]+(8-(s>>3))}
  function parseSq(n){return (8-(+n[1]))*8+"abcdefgh".indexOf(n[0])}

  function fromFEN(fen){
    var parts=fen.trim().split(/\s+/),b=[],rows=parts[0].split("/");
    rows.forEach(function(row){for(var i=0;i<row.length;i++){var c=row[i];if(/\d/.test(c))for(var k=0;k<+c;k++)b.push(null);else b.push(c)}});
    var cs=parts[2]||"-";
    return {b:b,turn:parts[1]||"w",castle:{K:cs.indexOf("K")>=0,Q:cs.indexOf("Q")>=0,k:cs.indexOf("k")>=0,q:cs.indexOf("q")>=0},
      ep:parts[3]&&parts[3]!=="-"?parseSq(parts[3]):-1,half:+(parts[4]||0),full:+(parts[5]||1)};
  }
  function clone(s){return {b:s.b.slice(),turn:s.turn,castle:{K:s.castle.K,Q:s.castle.Q,k:s.castle.k,q:s.castle.q},ep:s.ep,half:s.half,full:s.full}}

  /* kvadrat "by" rangidagi donalar tomonidan hujum ostidami? */
  function attacked(s,t,by){
    var b=s.b,r=t>>3,f=t&7,i,d,rr,ff,p;
    var pr=by==="w"?r+1:r-1;
    for(d=-1;d<=1;d+=2){ff=f+d;if(ok(pr,ff)){p=b[sq(pr,ff)];if(p&&p===(by==="w"?"P":"p"))return true}}
    for(i=0;i<8;i++){var o=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]][i];rr=r+o[0];ff=f+o[1];if(ok(rr,ff)){p=b[sq(rr,ff)];if(p&&p===(by==="w"?"N":"n"))return true}}
    for(rr=r-1;rr<=r+1;rr++)for(ff=f-1;ff<=f+1;ff++){if((rr!==r||ff!==f)&&ok(rr,ff)){p=b[sq(rr,ff)];if(p&&p===(by==="w"?"K":"k"))return true}}
    var lines=[[ROOK_D,"RQ"],[BISH_D,"BQ"]];
    for(var li=0;li<2;li++){
      var dirs=lines[li][0],kinds=lines[li][1];
      for(i=0;i<4;i++){
        rr=r+dirs[i][0];ff=f+dirs[i][1];
        while(ok(rr,ff)){p=b[sq(rr,ff)];if(p){if(col(p)===by&&kinds.indexOf(p.toUpperCase())>=0)return true;break}rr+=dirs[i][0];ff+=dirs[i][1]}
      }
    }
    return false;
  }
  function kingSq(s,c){var k=c==="w"?"K":"k";return s.b.indexOf(k)}
  function inCheck(s,c){var k=kingSq(s,c);return k>=0&&attacked(s,k,c==="w"?"b":"w")}

  function pseudo(s,onlyFrom){
    var b=s.b,me=s.turn,them=me==="w"?"b":"w",mv=[],from,p,r,f,i,rr,ff,t;
    function add(fr,to,extra){var m={from:fr,to:to,piece:b[fr],cap:b[to]};if(extra)for(var k in extra)m[k]=extra[k];mv.push(m)}
    for(from=0;from<64;from++){
      if(onlyFrom!=null&&from!==onlyFrom)continue;
      p=b[from];if(!p||col(p)!==me)continue;
      r=from>>3;f=from&7;var u=p.toUpperCase();
      if(u==="P"){
        var dir=me==="w"?-1:1,start=me==="w"?6:1,last=me==="w"?0:7;
        rr=r+dir;
        if(ok(rr,f)&&!b[sq(rr,f)]){
          if(rr===last)["Q","R","B","N"].forEach(function(x){add(from,sq(rr,f),{promo:me==="w"?x:x.toLowerCase()})});
          else add(from,sq(rr,f));
          if(r===start&&!b[sq(r+2*dir,f)])add(from,sq(r+2*dir,f),{dbl:true});
        }
        for(var d=-1;d<=1;d+=2){
          ff=f+d;if(!ok(rr,ff))continue;t=sq(rr,ff);
          if(b[t]&&col(b[t])===them){
            if(rr===last)["Q","R","B","N"].forEach(function(x){add(from,t,{promo:me==="w"?x:x.toLowerCase()})});
            else add(from,t);
          }else if(t===s.ep)add(from,t,{epCap:true,cap:me==="w"?"p":"P"});
        }
      }else if(u==="N"){
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function(o){rr=r+o[0];ff=f+o[1];if(ok(rr,ff)){t=sq(rr,ff);if(!b[t]||col(b[t])===them)add(from,t)}});
      }else if(u==="K"){
        for(rr=r-1;rr<=r+1;rr++)for(ff=f-1;ff<=f+1;ff++){if((rr!==r||ff!==f)&&ok(rr,ff)){t=sq(rr,ff);if(!b[t]||col(b[t])===them)add(from,t)}}
        var home=me==="w"?60:4;
        if(from===home&&!inCheck(s,me)){
          var cK=me==="w"?s.castle.K:s.castle.k,cQ=me==="w"?s.castle.Q:s.castle.q,R=me==="w"?"R":"r";
          if(cK&&b[home+3]===R&&!b[home+1]&&!b[home+2]&&!attacked(s,home+1,them)&&!attacked(s,home+2,them))add(from,home+2,{castle:"K"});
          if(cQ&&b[home-4]===R&&!b[home-1]&&!b[home-2]&&!b[home-3]&&!attacked(s,home-1,them)&&!attacked(s,home-2,them))add(from,home-2,{castle:"Q"});
        }
      }else{
        var dirs=u==="R"?ROOK_D:u==="B"?BISH_D:ROOK_D.concat(BISH_D);
        for(i=0;i<dirs.length;i++){
          rr=r+dirs[i][0];ff=f+dirs[i][1];
          while(ok(rr,ff)){t=sq(rr,ff);if(b[t]){if(col(b[t])===them)add(from,t);break}add(from,t);rr+=dirs[i][0];ff+=dirs[i][1]}
        }
      }
    }
    return mv;
  }
  function make(s,m){
    var n=clone(s),b=n.b,me=s.turn;
    b[m.to]=m.promo||b[m.from];b[m.from]=null;
    if(m.epCap)b[m.to+(me==="w"?8:-8)]=null;
    if(m.castle==="K"){b[m.to-1]=b[m.to+1];b[m.to+1]=null}
    if(m.castle==="Q"){b[m.to+1]=b[m.to-2];b[m.to-2]=null}
    n.ep=m.dbl?(m.from+m.to)/2:-1;
    var u=m.piece.toUpperCase();
    if(u==="K"){if(me==="w"){n.castle.K=n.castle.Q=false}else{n.castle.k=n.castle.q=false}}
    [[63,"K"],[56,"Q"],[7,"k"],[0,"q"]].forEach(function(x){if(m.from===x[0]||m.to===x[0])n.castle[x[1]]=false});
    n.half=(u==="P"||m.cap)?0:s.half+1;
    if(me==="b")n.full++;
    n.turn=me==="w"?"b":"w";
    return n;
  }
  function legal(s,onlyFrom){var me=s.turn;return pseudo(s,onlyFrom).filter(function(m){return !inCheck(make(s,m),me)})}
  function status(s){
    var lm=legal(s);
    if(!lm.length)return inCheck(s,s.turn)?"mate":"stalemate";
    var pcs=s.b.filter(function(p){return p&&p.toUpperCase()!=="K"});
    if(!pcs.length||(pcs.length===1&&"NBnb".indexOf(pcs[0])>=0))return "insufficient";
    if(s.half>=100)return "fifty";
    return inCheck(s,s.turn)?"check":"play";
  }
  function perft(s,d){if(!d)return 1;var n=0;legal(s).forEach(function(m){n+=perft(make(s,m),d-1)});return n}

  /* ---------- baholash va kompyuter ---------- */
  var VAL={P:100,N:320,B:330,R:500,Q:900,K:0};
  var PST={
    P:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
    N:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
    B:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
    R:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
    Q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
    K:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]
  };
  function evalW(s){
    var sc=0;
    for(var i=0;i<64;i++){var p=s.b[i];if(!p)continue;var u=p.toUpperCase();
      if(isW(p))sc+=VAL[u]+PST[u][i];else sc-=VAL[u]+PST[u][(7-(i>>3))*8+(i&7)]}
    return sc;
  }
  function order(ms){return ms.sort(function(a,b){return (b.cap?VAL[b.cap.toUpperCase()]*10-VAL[b.piece.toUpperCase()]:0)+(b.promo?800:0)-((a.cap?VAL[a.cap.toUpperCase()]*10-VAL[a.piece.toUpperCase()]:0)+(a.promo?800:0))})}
  function search(s,depth,alpha,beta,ply){
    var ms=legal(s);
    if(!ms.length)return inCheck(s,s.turn)?-100000+ply:0;
    if(depth<=0){var e=evalW(s);return s.turn==="w"?e:-e}
    order(ms);
    for(var i=0;i<ms.length;i++){
      var v=-search(make(s,ms[i]),depth-1,-beta,-alpha,ply+1);
      if(v>=beta)return beta;if(v>alpha)alpha=v;
    }
    return alpha;
  }
  /* daraja: 1 oson, 2 o'rta, 3 qiyin */
  function bestMove(s,level){
    var ms=legal(s);if(!ms.length)return null;
    var depth=level===1?1:level===2?2:3;
    order(ms);
    var scored=ms.map(function(m){return {m:m,v:-search(make(s,m),depth-1,-1e9,1e9,1)}});
    scored.sort(function(a,b){return b.v-a.v});
    if(level===1){
      /* oson: ko'pincha tasodifiy, ba'zan eng yaxshisi; matni o'tkazib yubormaydi */
      if(scored[0].v>50000)return scored[0].m;
      if(Math.random()<.45)return ms[Math.floor(Math.random()*ms.length)];
      var top=scored.slice(0,Math.min(4,scored.length));return top[Math.floor(Math.random()*top.length)].m;
    }
    var best=scored.filter(function(x){return x.v>=scored[0].v-(level===2?15:0)});
    return best[Math.floor(Math.random()*best.length)].m;
  }
  function mates(s){return legal(s).filter(function(m){return status(make(s,m))==="mate"})}
  return {fromFEN:fromFEN,legal:legal,make:make,status:status,inCheck:inCheck,kingSq:kingSq,bestMove:bestMove,mates:mates,perft:perft,name:name,parseSq:parseSq,col:col};
})();
