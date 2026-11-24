/* =========================================================
   HAYOTIY MATEMATIKA: soat va pul mavzulari
   ========================================================= */
(function(){
TOPICS.clock={lv:2,e:"🕐"};TOPICS.money={lv:3,e:"💵"};
LV_TOPICS[2].push("clock");LV_TOPICS[3].push("money");LV_TOPICS[4].push("clock");LV_TOPICS[4].push("money");

/* ---------- soat ---------- */
function clockSVG(h,m){
  var s="<svg class='clk' viewBox='0 0 200 200' role='img' aria-label='clock'><circle cx='100' cy='100' r='94' fill='#fff' stroke='#26215C' stroke-width='6'/>";
  for(var i=0;i<60;i++){var a=i*6*Math.PI/180,r1=i%5?84:78,x1=100+Math.sin(a)*r1,y1=100-Math.cos(a)*r1,x2=100+Math.sin(a)*88,y2=100-Math.cos(a)*88;
    s+="<line x1='"+x1.toFixed(1)+"' y1='"+y1.toFixed(1)+"' x2='"+x2.toFixed(1)+"' y2='"+y2.toFixed(1)+"' stroke='#26215C' stroke-width='"+(i%5?1.5:3.5)+"'/>"}
  for(var k=1;k<=12;k++){var b=k*30*Math.PI/180;s+="<text x='"+(100+Math.sin(b)*64).toFixed(1)+"' y='"+(100-Math.cos(b)*64+7).toFixed(1)+"' text-anchor='middle' font-size='20' font-weight='900' fill='#26215C'>"+k+"</text>"}
  var ha=((h%12)+m/60)*30,ma=m*6;
  s+="<line x1='100' y1='100' x2='"+(100+Math.sin(ha*Math.PI/180)*44).toFixed(1)+"' y2='"+(100-Math.cos(ha*Math.PI/180)*44).toFixed(1)+"' stroke='#E24B4A' stroke-width='9' stroke-linecap='round'/>";
  s+="<line x1='100' y1='100' x2='"+(100+Math.sin(ma*Math.PI/180)*72).toFixed(1)+"' y2='"+(100-Math.cos(ma*Math.PI/180)*72).toFixed(1)+"' stroke='#378ADD' stroke-width='5' stroke-linecap='round'/>";
  return s+"<circle cx='100' cy='100' r='7' fill='#26215C'/></svg>";
}
function ft(h,m){return h+":"+(m<10?"0":"")+m}
function norm(h,m){while(m>=60){m-=60;h++}while(m<0){m+=60;h--}h=((h-1)%12+12)%12+1;return [h,m]}
function timeOpts(h,m,step){
  var set={},out=[ft(h,m)];set[out[0]]=1;
  var cand=[[h+1,m],[h-1,m],[h,(m+step)%60],[h,(m+60-step)%60],[Math.round(m/5)||12,h*5%60],[h+1,(m+30)%60]];
  shuffle(cand).forEach(function(c){var n=norm(c[0],c[1]),s=ft(n[0],n[1]);if(out.length<4&&!set[s]){set[s]=1;out.push(s)}});
  while(out.length<4){var r=ft(rnd(1,12),pick([0,15,30,45]));if(!set[r]){set[r]=1;out.push(r)}}
  return out;
}
function genClock(d){
  var h=rnd(1,12),m,Q;
  if(d===1){m=pick([0,30]);Q=q(t("q_clock"),ft(h,m),"clock",t("h_clock"),clockSVG(h,m));Q.opts=timeOpts(h,m,30)}
  else if(d===2){m=pick([0,15,30,45,5,10,20,25,35,40,50,55]);Q=q(t("q_clock"),ft(h,m),"clock",t("h_clock"),clockSVG(h,m));Q.opts=timeOpts(h,m,R()<.5?5:15)}
  else{m=pick([0,15,30,45,10,20,40,50]);var k=pick([15,20,30,40,45,60,90,120]),n=norm(h,m+k);
    Q=q(t("q_clock_add",{t:ft(h,m),m:k}),ft(n[0],n[1]),"clock",t("h_clock_add",{m:k}),clockSVG(h,m));Q.opts=timeOpts(n[0],n[1],15);Q.cls="word"}
  Q.html=false;return Q;
}

/* ---------- pul ---------- */
var CUR={uz:[500,1000,2000,5000,10000,20000,50000],ru:[10,50,100,200,500,1000,2000,5000],en:[1,5,10,20,50,100],tr:[5,10,20,50,100,200],
  kk:[100,200,500,1000,2000,5000,10000],ky:[10,20,50,100,200,500,1000],tg:[1,3,5,10,20,50,100],tk:[1,5,10,20,50,100]};
var NCOL=["#E9C46A","#8AB17D","#E76F51","#6FA8DC","#B48EAD","#F4A261","#2A9D8F","#C77DFF"];
var ITEMS=["🧸","🍦","📚","⚽","🍎","🎈","🧃","✏️","🚗","🧩"];
function fmtN(n){return n>=10000?String(n).replace(/\B(?=(\d{3})+(?!\d))/g," "):String(n)}
function den(){return CUR[L]||CUR.en}
function note(v){var ds=den(),i=ds.indexOf(v);return "<span class='mnote' style='background:"+NCOL[i%NCOL.length]+"'><b>"+fmtN(v)+"</b><small>"+t("cur")+"</small></span>"}
function moneyOpts(ans,step){
  var set={},out=[fmtN(ans)];set[ans]=1;
  shuffle([step,-step,2*step,-2*step,3*step,ans>step*4?-Math.round(ans/2):step*4]).forEach(function(dv){var v=ans+dv;if(out.length<4&&v>0&&!set[v]){set[v]=1;out.push(fmtN(v))}});
  var k=5;while(out.length<4){var v=ans+step*k++;if(!set[v]){set[v]=1;out.push(fmtN(v))}}
  return out;
}
function genMoney(d){
  var ds=den(),Q,c=t("cur");
  var mode=d===1?"sum":d===2?(R()<.6?"sum":"change"):pick(["change","change","buy","sum"]);
  if(mode==="sum"){
    var pool=ds.slice(0,d===1?3:5),cnt=d===1?2:rnd(3,4),notes=[],s=0;
    for(var i=0;i<cnt;i++){var v=pick(pool);notes.push(v);s+=v}
    notes.sort(function(a,b){return b-a});
    Q=q(t("q_money_sum"),fmtN(s),"money",t("h_money_sum",{s:notes.map(fmtN).join(" + ")}),"<div class='mrow'>"+notes.map(note).join("")+"</div>");
    Q.opts=moneyOpts(s,ds[0]);Q.cls="plain";return Q;
  }
  if(mode==="change"){
    var gi=rnd(2,Math.min(ds.length-1,d===2?4:6)),g=ds[gi],unit=ds[0],p=unit*rnd(1,Math.max(1,g/unit-1));
    if(p>=g)p=g-unit;var it=pick(ITEMS);
    Q=q(t("q_money_change",{i:it,p:fmtN(p),g:fmtN(g),c:c}),fmtN(g-p),"money",t("h_money_change",{g:fmtN(g),p:fmtN(p)}),
      "<div class='mrow'><span class='mitem'>"+it+"<i>"+fmtN(p)+" "+c+"</i></span>"+note(g)+"</div>");
    Q.opts=moneyOpts(g-p,unit);Q.cls="word";return Q;
  }
  var a=ds[rnd(0,2)]*rnd(1,3),n=rnd(2,6),x=a*n+(R()<.5?0:ds[0]*rnd(0,Math.max(0,a/ds[0]-1))),it2=pick(ITEMS);
  Q=q(t("q_money_buy",{x:fmtN(x),a:fmtN(a),c:c,i:it2}),Math.floor(x/a),"money",t("h_money_buy",{x:fmtN(x),a:fmtN(a)}),
    "<div class='mrow'><span class='mitem'>"+it2+"<i>"+fmtN(a)+" "+c+"</i></span></div>");
  Q.cls="word";return Q;
}
var _gt=genTopic;
window.genTopic=genTopic=function(tp,d,n){if(tp==="clock")return genClock(d||2);if(tp==="money")return genMoney(d||2);return _gt(tp,d,n)};
window.clockSVG=clockSVG;
})();
