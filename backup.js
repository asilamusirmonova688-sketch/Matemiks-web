/* =========================================================
   ZAXIRA VA KO'CHIRISH: natijalarni boshqa qurilmaga o'tkazish
   (kod yoki fayl orqali; Ota-onalar → Sozlama)
   ========================================================= */
(function(){
function b64(bytes){var s="";for(var i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));return btoa(s)}
function unb64(str){var s=atob(str),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a}
function pipe(bytes,stream){return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then(function(b){return new Uint8Array(b)})}
function encode(obj){
  var raw=new TextEncoder().encode(JSON.stringify(obj));
  if(window.CompressionStream){try{return pipe(raw,new CompressionStream("deflate-raw")).then(function(c){return "MTX1."+b64(c)})}catch(e){}}
  return Promise.resolve("MTX0."+b64(raw));
}
function decode(text){
  var m=String(text||"").replace(/\s+/g,"").match(/MTX([01])\.([A-Za-z0-9+/=]+)/);
  if(!m)return Promise.reject("bad");
  var bytes;try{bytes=unb64(m[2])}catch(e){return Promise.reject("bad")}
  var p=m[1]==="1"?(window.DecompressionStream?pipe(bytes,new DecompressionStream("deflate-raw")):Promise.reject("nodecomp")):Promise.resolve(bytes);
  return p.then(function(b){var o=JSON.parse(new TextDecoder().decode(b));if(!o||o.app!=="matemiks"||!o.list)throw "bad";return o});
}
function payload(){return {app:"matemiks",v:1,date:today(),cur:DB.cur,list:DB.list}}
var CODE="",IMP=null;
function score(p){return (p.stars||0)+(p.spent||0)+(p.total||0)}

window.backupCard=function(){
  return "<div class='card'><h3>💾 "+t("bk_title")+"</h3><p class='small-note' style='margin-top:0'>"+t("bk_text")+"</p>"+
    "<div class='row2'><button class='btn small' id='bk-make'>"+t("bk_make")+"</button><button class='btn sec small' id='bk-rest'>"+t("bk_restore")+"</button></div>"+
    "<div id='bk-area'></div></div>";
};
window.bindBackup=function(){
  var mk=$("bk-make");if(!mk)return;
  mk.onclick=function(){
    encode(payload()).then(function(code){
      CODE=code;
      $("bk-area").innerHTML="<textarea class='bkcode' readonly id='bk-code'></textarea>"+
        "<div class='row2'><button class='btn sec small' id='bk-copy'>"+t("bk_copy")+"</button><button class='btn sec small' id='bk-share'>"+t("bk_share")+"</button></div>"+
        "<p class='small-note'>"+t("bk_how")+"</p>";
      $("bk-code").value=code;
      $("bk-copy").onclick=copyCode;$("bk-share").onclick=shareCode;
    });
  };
  $("bk-rest").onclick=function(){
    $("bk-area").innerHTML="<textarea class='bkcode' id='bk-in' placeholder='"+esc(t("bk_paste_ph"))+"'></textarea>"+
      "<div class='row2'><label class='btn sec small bkfile'>"+t("bk_file")+"<input type='file' id='bk-file' accept='.txt,.matemiks,text/plain'></label><button class='btn small' id='bk-check'>"+t("bk_check")+"</button></div><div id='bk-prev'></div>";
    $("bk-file").onchange=function(){var f=this.files&&this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){$("bk-in").value=r.result;check()};r.readAsText(f)};
    $("bk-check").onclick=check;
  };
};
function copyCode(){
  var ok=function(){toast("📋 "+t("bk_copied"))};
  try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(CODE).then(ok,fallback);return}}catch(e){}
  fallback();
  function fallback(){var ta=$("bk-code");ta.removeAttribute("readonly");ta.select();ta.setSelectionRange(0,CODE.length);try{document.execCommand("copy");ok()}catch(e){}ta.setAttribute("readonly","")}
}
function shareCode(){
  var name="matemiks-"+today()+".txt";
  try{if(window.AndroidApp&&AndroidApp.shareFile){AndroidApp.shareFile(name,CODE,"Matemiks");return}}catch(e){}
  try{var f=new File([CODE],name,{type:"text/plain"});
    if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"Matemiks"}).catch(function(){});return}}catch(e){}
  var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([CODE],{type:"text/plain"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500);
}
function check(){
  decode($("bk-in").value).then(function(o){
    IMP=o;var ps=Object.keys(o.list).map(function(k){return o.list[k]});
    var h="<p><b>"+t("bk_found",{n:ps.length,d:o.date||""})+"</b></p>"+ps.map(function(p){return "<div class='prog'><span>"+buddy(p).e+" "+esc(p.name)+"</span><span>⭐ "+(p.stars||0)+" · ✏️ "+(p.total||0)+"</span></div>"}).join("");
    h+="<div class='row2' style='margin-top:10px'><button class='btn small' id='bk-merge'>"+t("bk_merge")+"</button><button class='btn sec small' id='bk-repl'>"+t("bk_replace")+"</button></div><p class='small-note'>"+t("bk_modes")+"</p>";
    $("bk-prev").innerHTML=h;
    $("bk-merge").onclick=function(){apply(false)};
    $("bk-repl").onclick=function(){if(confirmTwice(this))apply(true)};
  }).catch(function(){$("bk-prev").innerHTML="<p class='fb' style='color:#791F1F'>"+t("bk_bad")+"</p>"});
}
function confirmTwice(btn){if(btn.dataset.sure){return true}btn.dataset.sure="1";btn.textContent=t("bk_sure");btn.style.background="#A32D2D";btn.style.color="#fff";return false}
function apply(replace){
  if(!IMP)return;
  if(replace){DB.list=IMP.list;DB.cur=IMP.cur&&IMP.list[IMP.cur]?IMP.cur:Object.keys(IMP.list)[0]||null}
  else{for(var id in IMP.list){var p=IMP.list[id],q=DB.list[id];if(!q||score(p)>score(q))DB.list[id]=p}}
  DB.intro=true;save();toast("✅ "+t("bk_done"));
  setTimeout(function(){location.reload()},900);
}
})();
