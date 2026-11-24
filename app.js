/* =========================================================
   TILLAR
   ========================================================= */
var LANGS=[
  {c:"uz",f:"🇺🇿",n:"Özbekça",hi:"Salom!"},{c:"ru",f:"🇷🇺",n:"Русский",hi:"Привет!"},
  {c:"en",f:"🇬🇧",n:"English",hi:"Hello!"},{c:"tg",f:"🇹🇯",n:"Тоҷикӣ",hi:"Салом!"},
  {c:"tr",f:"🇹🇷",n:"Türkçe",hi:"Merhaba!"},{c:"kk",f:"🇰🇿",n:"Қазақша",hi:"Сәлем!"},
  {c:"ky",f:"🇰🇬",n:"Кыргызча",hi:"Салам!"},{c:"tk",f:"🇹🇲",n:"Türkmençe",hi:"Salam!"}
];
var L="uz";
/* Yangi o'zbek lotin alifbosi: O' → Ö, G' → Ğ, Sh → Ş, Ch → Ç */
function newLatin(s){
  return s.replace(/([OoGg])['‘ʻ’]/g,function(m,c){return {O:"Ö",o:"ö",G:"Ğ",g:"ğ"}[c]})
    .replace(/SH/g,"Ş").replace(/Sh/g,"Ş").replace(/sh/g,"ş")
    .replace(/CH/g,"Ç").replace(/Ch/g,"Ç").replace(/ch/g,"ç");
}
function conv(s){return L==="uz"&&typeof s==="string"?newLatin(s):s}
function raw(k){var d=I18N[L]||{},v=d[k];if(v===undefined)v=(I18N.en||{})[k];return v===undefined?k:v}
function pIdx(n,len){
  if(len<=1)return 0;
  if(L==="ru"&&len===3){var a=Math.abs(n)%10,b=Math.abs(n)%100;return a===1&&b!==11?0:(a>=2&&a<=4&&(b<10||b>=20))?1:2}
  return Math.abs(n)===1?0:1;
}
function fmt(s,p){
  p=p||{};
  return s.replace(/\{(\w+)(\*)?(?::([^}]*))?\}/g,function(m,k,star,spec){
    var v=p[k];
    if(star)return String(v||"").split("|").pop();
    if(spec!==undefined){
      var forms=spec.charAt(0)==="@"?String(p[spec.slice(1)]||""):spec,arr=forms.split("|");
      return v+" "+arr[pIdx(+v,arr.length)];
    }
    if(v===undefined)return m;
    return typeof v==="string"&&v.indexOf("|")>=0?v.split("|")[0]:v;
  });
}
function t(k,p){var s=raw(k);if(Array.isArray(s))s=s[0];return fmt(conv(String(s)),p)}
function tA(k){var s=raw(k);return (Array.isArray(s)?s:[s]).map(conv)}
function applyStatic(){
  document.documentElement.lang=L;
  document.querySelectorAll("[data-t]").forEach(function(el){el.innerHTML=t(el.dataset.t)});
  document.querySelectorAll("[data-tp]").forEach(function(el){el.placeholder=t(el.dataset.tp)});
  document.title=t("app_title");
}
function setLang(c){L=c;DB.lang=c;if(S)S.lang=c;save();applyStatic()}

/* =========================================================
   MA'LUMOTLAR
   ========================================================= */
var AGES=[5,6,7,8,9,10,11,12];
function ageToLevel(a){return a<=6?1:a===7?2:a===8?3:a===9?4:a===10?5:6}
var THEMES={
  qizil:{main:"#E24B4A",dark:"#A32D2D",light:"#FCEBEB",bord:"#F09595",ink:"#791F1F",bg:"#FFF4F2"},
  pushti:{main:"#D4537E",dark:"#993556",light:"#FBEAF0",bord:"#ED93B1",ink:"#72243E",bg:"#FFF3F7"},
  apelsin:{main:"#E07A2E",dark:"#993C1D",light:"#FBE6D6",bord:"#F0A97B",ink:"#712B13",bg:"#FFF5EC"},
  sariq:{main:"#D99A0B",dark:"#854F0B",light:"#FAEEDA",bord:"#EFBF5E",ink:"#633806",bg:"#FFFAEA"},
  yashil:{main:"#3B9A3B",dark:"#27500A",light:"#E6F3DA",bord:"#97C459",ink:"#27500A",bg:"#F4FAEE"},
  feruza:{main:"#16A3A3",dark:"#085041",light:"#DDF4F2",bord:"#5DCAA5",ink:"#04342C",bg:"#F0FAF9"},
  kok:{main:"#378ADD",dark:"#0C447C",light:"#E6F1FB",bord:"#85B7EB",ink:"#0C447C",bg:"#F2F7FD"},
  binafsha:{main:"#7F77DD",dark:"#3C3489",light:"#EEEDFE",bord:"#AFA9EC",ink:"#26215C",bg:"#F6F5FF"}
};
var THEME_KEYS=Object.keys(THEMES);
var ANIMAL_E=["🐱","🐶","🐰","🐻","🦁","🐼","🦊","🐸","🐬","🐴","🦄","🐧"];
var FOOD_E=["🍎","🍌","🍇","🍓","🍉","🍒","🍑","🍊","🍦","🍪","🍬","🍰"];
var HOBBY_E=["⚽","🎨","🎵","📚","💃","🏊","🚀","🤖","🚗"];
var HOBBY_K=["futbol","rasm","musiqa","kitob","raqs","suzish","kosmos","robot","mashina"];
var GOAL=20;
var LV_TOPICS={1:["count","cmp","add10","sub10"],2:["add20","sub20","miss"],3:["add100","sub100","miss"],4:["mtab","add100","sub100"],5:["div","missmul","big"],6:["frac","order","mul2"]};
var TOPICS={count:{lv:1,e:"🔢"},cmp:{lv:1,e:"⚖️"},add10:{lv:1,e:"➕"},sub10:{lv:1,e:"➖"},add20:{lv:2,e:"➕"},sub20:{lv:2,e:"➖"},miss:{lv:2,e:"❓"},
  add100:{lv:3,e:"➕"},sub100:{lv:3,e:"➖"},mtab:{lv:4,e:"✖️"},div:{lv:5,e:"➗"},missmul:{lv:5,e:"❔"},big:{lv:5,e:"💯"},mul2:{lv:6,e:"✖️"},frac:{lv:6,e:"🍕"},order:{lv:6,e:"🧮"}};

/* =========================================================
   SAQLASH
   ========================================================= */
var DB={v:3,cur:null,list:{},lang:null,intro:false};
var S=null;
function blankProfile(){return {id:"p"+Date.now().toString(36)+Math.floor(Math.random()*1000),name:"",age:null,level:1,stars:0,best:{},sound:true,tts:false,fav:{},lang:L,
  hist:{},streak:{last:null,n:0,max:0},last:{},badges:{},cnt:{puz:0,sud:0,mem:0,test10:0,up:0,exam:0,tstar:0},total:0,totalC:0,goalDay:null,hiRun:0,created:today(),
  mast:{},mist:[],daily:null}}
function fixProfile(p){var b=blankProfile();for(var k in b)if(p[k]===undefined)p[k]=b[k];for(var c in b.cnt)if(p.cnt[c]===undefined)p.cnt[c]=0;
  if(p.fav.color!=null&&typeof p.fav.color==="string"&&!THEMES[p.fav.color])p.fav.color=null;return p}
function save(){try{localStorage.setItem("mo_db",JSON.stringify(DB))}catch(e){}}
function load(){
  try{
    var x=JSON.parse(localStorage.getItem("mo_db")||"null");
    if(x&&x.list){DB=Object.assign(DB,x);if(Object.keys(DB.list).length)DB.intro=true}
  }catch(e){}
  for(var id in DB.list)fixProfile(DB.list[id]);
  S=DB.cur&&DB.list[DB.cur]?DB.list[DB.cur]:null;
  var nav=(navigator.language||"uz").slice(0,2).toLowerCase();
  L=(S&&S.lang)||DB.lang||(LANGS.some(function(l){return l.c===nav})?nav:"uz");
}
function profiles(){return Object.keys(DB.list).map(function(k){return DB.list[k]}).sort(function(a,b){return a.created<b.created?-1:1})}

/* =========================================================
   YORDAMCHILAR
   ========================================================= */
var R=Math.random;
function $(id){return document.getElementById(id)}
var TIMERS=[];
function stopTimers(){raceStop();if(T&&T.timer){clearInterval(T.timer);T.timer=null}}
function show(id){var cs=document.querySelector(".screen.on");if(cs&&cs.id!==id&&Date.now()-SPK_T>400)stopSpeak();document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("on")});$(id).classList.add("on");window.scrollTo(0,0)}
function rnd(a,b){return Math.floor(R()*(b-a+1))+a}
function pick(arr){return arr[rnd(0,arr.length-1)]}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=rnd(0,i),x=a[i];a[i]=a[j];a[j]=x}return a}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]})}
function dstr(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function today(){return dstr(new Date())}
function daysAgo(n){var d=new Date();d.setDate(d.getDate()-n);return dstr(d)}
function updStars(){document.querySelectorAll(".star-count").forEach(function(e){e.textContent=S?S.stars:0})}
function seeded(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var x=Math.imul(seed^seed>>>15,1|seed);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296}}

/* shaxsiylashtirish */
function buddy(p){p=p||S;var i=p&&p.fav?p.fav.animal:null;return i!=null&&ANIMAL_E[i]?{e:ANIMAL_E[i],n:tA("animals")[i]}:{e:"🦉",n:t("buddy_default")}}
function food(){var i=S&&S.fav.food!=null?S.fav.food:0;return {e:FOOD_E[i],w:tA("foods")[i]}}
function hobbyKey(){return S&&S.fav.hobby!=null?HOBBY_K[S.fav.hobby]:null}
function callName(){var i=S.fav.nick;if(i!=null&&R()<.5)return tA("nicks")[i];return S.name}
function praise(){return t("praise_fmt",{b:buddy().e,w:pick(tA("praise_words")),n:callName()})}
function encourage(){return buddy().e+" "+pick(tA("encourage"))}
function applyTheme(p){
  var th=p&&p.fav&&p.fav.color&&THEMES[p.fav.color],r=document.documentElement.style;
  if(th){r.setProperty("--bg",th.bg);r.setProperty("--main",th.main);r.setProperty("--main-dark",th.dark);r.setProperty("--light",th.light);r.setProperty("--ans-border",th.bord);r.setProperty("--ans-ink",th.ink);r.setProperty("--sel",th.main)}
  else["--bg","--main","--main-dark","--light","--ans-border","--ans-ink","--sel"].forEach(function(k){r.removeProperty(k)});
}

/* =========================================================
   JONLI FON VA MAVSUM
   ========================================================= */
function season(){
  var d=new Date(),m=d.getMonth()+1,dd=d.getDate();
  if((m===12&&dd>=20)||(m===1&&dd<=10))return "ny";
  if(m===3&&dd>=10)return "navruz";
  if(m===12||m===1||m===2)return "winter";
  if(m===6||m===7||m===8)return "summer";
  if(m>=9&&m<=11)return "autumn";
  if(m>=3&&m<=5)return "spring";
  return null;
}
function buildBg(){
  var s=season(),items=["1","2","3","+","×","7","9","△","○","□","5","="];
  if(s==="winter")items=items.concat(["❄️","❄️","❄️","❄️"]);
  if(s==="ny")items=items.concat(["🎄","✨","❄️","⭐"]);
  if(s==="navruz")items=items.concat(["🌷","🌸","🌷","🌼"]);
  if(s==="summer")items=items.concat(["☀️","🌻"]);
  if(s==="autumn")items=items.concat(["🍂","🍁","🍂","🍃"]);
  if(s==="spring")items=items.concat(["🌸","🌷","🦋","🌼"]);
  var bg=$("bg");bg.innerHTML="";
  for(var i=0;i<16;i++){
    var sp=document.createElement("span");sp.textContent=pick(items);
    sp.style.left=rnd(0,95)+"%";sp.style.fontSize=rnd(22,44)+"px";
    sp.style.animationDuration=rnd(18,34)+"s";sp.style.animationDelay=(-rnd(0,34))+"s";
    if(/[^\x00-\x7F×△○□]/.test(sp.textContent))sp.style.opacity=".35";
    bg.appendChild(sp);
  }
}
function greeting(){var h=new Date().getHours();return t(h>=5&&h<12?"greet_morning":h<18&&h>=12?"greet_day":"greet_evening")}

/* =========================================================
   OVOZ
   ========================================================= */
var AC=null;
function beep(ok){
  if(!S||!S.sound)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    (ok?[523,659,784]:[300,220]).forEach(function(f,i){
      var o=AC.createOscillator(),g=AC.createGain(),t0=AC.currentTime+i*0.11;
      o.type=ok?"triangle":"sine";o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(0.25,t0+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t0+0.18);
      o.connect(g);g.connect(AC.destination);o.start(t0);o.stop(t0+0.2);
    });
  }catch(e){}
}
var TTSN=null;
function canSpeak(){try{if(window.AndroidApp)return AndroidApp.ttsAvailable()}catch(e){}return !!TTSN||("speechSynthesis" in window)}
function refreshSay(){var on=canSpeak();document.querySelectorAll(".say").forEach(function(b){b.style.display=on?"":"none"});$("tts-row").style.display=on?"":"none"}
try{if(window.claude&&window.claude.use)window.claude.use("tts").then(function(x){if(x){TTSN=x;refreshSay()}}).catch(function(){})}catch(e){}
function speechText(Q){
  if(Q.say)return Q.say;
  var s=String(Q.text);
  s=s.replace(/= \?/g," "+t("sp_eqq")+" ").replace(/\?/g," "+t("sp_what")+" ").replace(/=/g," "+t("sp_eq")+" ").replace(/◯/g," "+t("sp_cmp")+" ");
  s=s.replace(/\+/g," "+t("sp_plus")+" ").replace(/−/g," "+t("sp_minus")+" ").replace(/×/g," "+t("sp_times")+" ").replace(/ : /g," "+t("sp_div")+" ");
  return s.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
}
var VOICE_FALLBACK={uz:"tr",tg:"ru",kk:"ru",ky:"ru",tk:"tr"};
/* --- ovozni moslash: raqamlarni so'z bilan va harflarni boshqa til ovoziga moslab o'qish --- */
var NUMW={
 uz:{u:["nol","bir","ikki","uch","to'rt","besh","olti","yetti","sakkiz","to'qqiz"],t:["","o'n","yigirma","o'ttiz","qirq","ellik","oltmish","yetmish","sakson","to'qson"],h:"yuz",k:"ming",m:"million",c:"butun",p:"foiz"},
 tk:{u:["nol","bir","iki","üç","dört","bäş","alty","ýedi","sekiz","dokuz"],t:["","on","ýigrimi","otuz","kyrk","elli","altmyş","ýetmiş","segsen","togsan"],h:"ýüz",k:"müň",m:"million",c:"bitin",p:"göterim"},
 kk:{u:["нөл","бір","екі","үш","төрт","бес","алты","жеті","сегіз","тоғыз"],t:["","он","жиырма","отыз","қырық","елу","алпыс","жетпіс","сексен","тоқсан"],h:"жүз",k:"мың",m:"миллион",c:"бүтін",p:"пайыз"},
 ky:{u:["нөл","бир","эки","үч","төрт","беш","алты","жети","сегиз","тогуз"],t:["","он","жыйырма","отуз","кырк","элүү","алтымыш","жетимиш","сексен","токсон"],h:"жүз",k:"миң",m:"миллион",c:"бүтүн",p:"пайыз"}
};
function numTurkic(w,n){
  if(n<10)return w.u[n];
  var parts=[];
  if(n>=1000000){var mm=Math.floor(n/1000000);parts.push((mm>1?numTurkic(w,mm)+" ":"")+w.m);n%=1000000}
  if(n>=1000){var k=Math.floor(n/1000);parts.push((k>1?numTurkic(w,k)+" ":"")+w.k);n%=1000}
  if(n>=100){var h=Math.floor(n/100);parts.push((h>1?w.u[h]+" ":"")+w.h);n%=100}
  if(n>=10){parts.push(w.t[Math.floor(n/10)]);n%=10}
  if(n>0)parts.push(w.u[n]);
  return parts.join(" ");
}
function numTg(n){
  var U=["сифр","як","ду","се","чор","панҷ","шаш","ҳафт","ҳашт","нӯҳ"],T=["","даҳ","бист","сӣ","чил","панҷоҳ","шаст","ҳафтод","ҳаштод","навад"],
      TEEN=["даҳ","ёздаҳ","дувоздаҳ","сенздаҳ","чордаҳ","понздаҳ","шонздаҳ","ҳабдаҳ","ҳаждаҳ","нуздаҳ"],H=["","сад","дусад","сесад","чорсад","панҷсад","шашсад","ҳафтсад","ҳаштсад","нӯҳсад"];
  if(n<10)return U[n];
  var parts=[];
  if(n>=1000000){var mm=Math.floor(n/1000000);parts.push((mm>1?numTg(mm)+" ":"")+"миллион");n%=1000000}
  if(n>=1000){var k=Math.floor(n/1000);parts.push((k>1?numTg(k)+" ":"")+"ҳазор");n%=1000}
  if(n>=100){parts.push(H[Math.floor(n/100)]);n%=100}
  if(n>=20){parts.push(T[Math.floor(n/10)]);n%=10;if(n)parts.push(U[n])}
  else if(n>=10)parts.push(TEEN[n-10]);
  else if(n>0)parts.push(U[n]);
  return parts.join("у ");
}
function numWords(lang,n){if(lang==="tg")return numTg(n);var w=NUMW[lang];return w?numTurkic(w,n):String(n)}
var LETTERMAP={
 "uz>tr":[[/s[ʻ'’‘`ʼ]?h/g,"ş"],[/S[ʻ'’‘`ʼ]?[hH]/g,"Ş"],[/c[ʻ'’‘`ʼ]?h/g,"ç"],[/C[ʻ'’‘`ʼ]?[hH]/g,"Ç"],[/[oO][ʻ'’‘`ʼ]/g,function(x){return x[0]}],[/[gG][ʻ'’‘`ʼ]/g,function(x){return x[0]}],[/ö/g,"o"],[/Ö/g,"O"],[/ğ/g,"g"],[/Ğ/g,"G"],[/q/g,"k"],[/Q/g,"K"],[/x/g,"h"],[/X/g,"H"],[/j/g,"c"],[/J/g,"C"],[/[ʻ'’‘`ʼ]/g,""],[/I/g,"İ"]],
 "tk>tr":[[/ä/g,"e"],[/Ä/g,"E"],[/ň/g,"n"],[/Ň/g,"N"],[/ý/g,"y"],[/Ý/g,"Y"],[/ž/g,"j"],[/Ž/g,"J"],[/w/g,"v"],[/W/g,"V"],[/I/g,"İ"]],
 "kk>ru":[[/ә/g,"а"],[/Ә/g,"А"],[/ғ/g,"г"],[/Ғ/g,"Г"],[/қ/g,"к"],[/Қ/g,"К"],[/ң/g,"н"],[/Ң/g,"Н"],[/ө/g,"о"],[/Ө/g,"О"],[/[ұү]/g,"у"],[/[ҰҮ]/g,"У"],[/һ/g,"х"],[/Һ/g,"Х"],[/і/g,"и"],[/І/g,"И"]],
 "ky>ru":[[/ң/g,"н"],[/Ң/g,"Н"],[/ө/g,"о"],[/Ө/g,"О"],[/ү/g,"у"],[/Ү/g,"У"]],
 "tg>ru":[[/ғ/g,"г"],[/Ғ/g,"Г"],[/ӣ/g,"и"],[/Ӣ/g,"И"],[/қ/g,"к"],[/Қ/g,"К"],[/ӯ/g,"у"],[/Ӯ/g,"У"],[/ҳ/g,"х"],[/Ҳ/g,"Х"],[/ҷ/g,"дж"],[/Ҷ/g,"Дж"]]
};
function prepSpeech(text,lang,vl){
  var s=String(text).replace(/\p{Extended_Pictographic}|️|‍/gu," ");
  if(!vl||vl===lang)return s.replace(/\s+/g," ").trim();
  var w=NUMW[lang]||lang==="tg";
  if(w){
    s=s.replace(/(\d)[  ](?=\d{3}\b)/g,"$1");
    s=s.replace(/(\d+)\s*%/g,function(_,a){return numWords(lang,+a)+" "+(lang==="tg"?"фоиз":NUMW[lang].p)});
    s=s.replace(/(\d+),(\d+)/g,function(_,a,b){return numWords(lang,+a)+" "+(lang==="tg"?"бутуну":NUMW[lang].c)+" "+numWords(lang,+b)});
    s=s.replace(/(\d+):(\d\d)/g,function(_,a,b){return numWords(lang,+a)+" "+(+b?numWords(lang,+b):"")});
    s=s.replace(/\d+/g,function(x){return x.length>9?x:numWords(lang,+x)});
  }
  var mp=LETTERMAP[lang+">"+vl];
  if(mp)mp.forEach(function(r){s=s.replace(r[0],r[1])});
  return s.replace(/\s+/g," ").trim();
}
var SPK_T=0;
function stopSpeak(){
  try{if(window.AndroidApp)AndroidApp.stopSpeaking()}catch(e){}
  try{if(TTSN&&TTSN.stop)TTSN.stop()}catch(e){}
  try{if("speechSynthesis" in window)speechSynthesis.cancel()}catch(e){}
}
function webVoice(lang){
  if(!("speechSynthesis" in window))return null;
  var vs=speechSynthesis.getVoices();
  return vs.filter(function(v){return v.lang.toLowerCase().replace("_","-").indexOf(lang)===0})[0]||(VOICE_FALLBACK[lang]&&vs.filter(function(v){return v.lang.toLowerCase().indexOf(VOICE_FALLBACK[lang])===0})[0])||null;
}
function voiceLang(lang){
  try{if(window.AndroidApp)return AndroidApp.voiceLang(lang)}catch(e){}
  if(TTSN)return lang;
  var v=webVoice(lang);return v?v.lang.slice(0,2).toLowerCase():lang;
}
function speak(text){
  SPK_T=Date.now();
  try{if(window.AndroidApp){var avl=AndroidApp.voiceLang(L);AndroidApp.speak(prepSpeech(text,L,avl),L);return}}catch(e){}
  if(TTSN){TTSN.speak(prepSpeech(text,L,L),{language:L,rate:0.9}).catch(function(e){if(e&&e.code==="not_granted"){TTSN=null;refreshSay()}});return}
  if(!("speechSynthesis" in window))return;
  try{
    speechSynthesis.cancel();
    var v=webVoice(L),vl=v?v.lang.slice(0,2).toLowerCase():L;
    var u=new SpeechSynthesisUtterance(prepSpeech(text,L,vl));
    if(v){u.voice=v;u.lang=v.lang}else u.lang=L;
    u.rate=vl===L?.9:.82;speechSynthesis.speak(u);
  }catch(e){}
}
document.addEventListener("visibilitychange",function(){if(document.hidden)stopSpeak()});
window.addEventListener("pagehide",stopSpeak);
var CURQ={};
document.querySelectorAll("[data-say]").forEach(function(b){b.onclick=function(){var Q=CURQ[b.dataset.say];if(Q)speak(speechText(Q))}});

/* =========================================================
   STATISTIKA, NISHONLAR
   ========================================================= */
var TQ=[],TB=false;
function toast(msg){TQ.push(msg);if(!TB)nextToast()}
function nextToast(){var m=TQ.shift();if(!m){TB=false;return}TB=true;var el=$("toast");el.textContent=m;el.classList.add("on");setTimeout(function(){el.classList.remove("on");setTimeout(nextToast,400)},2600)}
var BADGES=[
 {id:"first",e:"👣",ok:function(p){return p.total>=1}},{id:"m100",e:"💯",ok:function(p){return p.total>=100}},
 {id:"m500",e:"🏅",ok:function(p){return p.total>=500}},{id:"s3",e:"🔥",ok:function(p){return p.streak.max>=3}},
 {id:"s7",e:"🌋",ok:function(p){return p.streak.max>=7}},{id:"goal",e:"🎯",ok:function(p){return !!p.goalDay}},
 {id:"t10",e:"🏆",ok:function(p){return p.cnt.test10>=1}},{id:"puz",e:"🧩",ok:function(p){return p.cnt.puz>=50}},
 {id:"race",e:"⚡",ok:function(p){return Object.keys(p.best).some(function(k){return k[0]==="R"&&p.best[k]>=20})}},
 {id:"sud",e:"🔲",ok:function(p){return p.cnt.sud>=5}},{id:"mem",e:"🧠",ok:function(p){return p.cnt.mem>=5}},
 {id:"lvl",e:"🚀",ok:function(p){return p.cnt.up>=1}},{id:"topic",e:"🌟",ok:function(p){return p.cnt.tstar>=1}},
 {id:"exam",e:"🎓",ok:function(p){return p.cnt.exam>=1}}
];
function checkBadges(){BADGES.forEach(function(b){if(!S.badges[b.id]&&b.ok(S)){S.badges[b.id]=today();toast(t("new_badge",{e:b.e,n:t("b_"+b.id)}))}})}
function touchDay(){
  var d=today();
  if(S.streak.last!==d){
    S.streak.n=S.streak.last===daysAgo(1)?S.streak.n+1:1;S.streak.last=d;
    if(S.streak.n>S.streak.max)S.streak.max=S.streak.n;
    if(S.streak.n>=2)toast(t("streak_toast",{n:S.streak.n}));
  }
}
function record(correct,kind){
  var d=today(),h=S.hist[d]||(S.hist[d]={n:0,c:0});
  touchDay();h.n++;S.total++;if(correct){h.c++;S.totalC++}
  if(kind==="puz"&&correct)S.cnt.puz++;
  if(h.n>=GOAL&&S.goalDay!==d){S.goalDay=d;S.stars+=5;toast(t("goal_toast"))}
  var keys=Object.keys(S.hist);if(keys.length>70){keys.sort();keys.slice(0,keys.length-70).forEach(function(k){delete S.hist[k]})}
  checkBadges();save();
}
function addStar(el){S.stars++;save();updStars();if(el)flyStar(el)}
function flyStar(el){
  var r=el.getBoundingClientRect(),s=document.createElement("div");
  s.className="fly";s.textContent="⭐";s.style.left=(r.left+r.width/2)+"px";s.style.top=(r.top+r.height/2)+"px";
  document.body.appendChild(s);setTimeout(function(){s.remove()},1000);
}
function dayN(p,d){return (p.hist[d]||{n:0}).n}
function weekSum(p,from){var s=0;for(var i=from;i<from+7;i++)s+=dayN(p,daysAgo(i));return s}
/* xatolar ustida ishlash */
function addMistake(Q){
  if(!Q||Q.html)return;
  var key=Q.text+"|"+Q.ans;
  S.mist=S.mist.filter(function(m){return m.k!==key});
  S.mist.push({k:key,text:Q.text,ans:Q.ans,hint:Q.hint,topic:Q.topic,pics:Q.pics,opts:Q.opts,cls:Q.cls,word:Q.word,say:Q.say,sol:Q.sol,step:0,due:daysAgo(-1)});
  if(S.mist.length>40)S.mist=S.mist.slice(-40);
}
function dueMistakes(){var d=today();return S.mist.filter(function(m){return m.due<=d})}

/* =========================================================
   MISOLLAR: MAVZULAR VA QIYINLIK (1-3)
   ========================================================= */
function q(text,ans,topic,hint,pics,sol){return {text:text,ans:ans,topic:topic,hint:hint,pics:pics||"",sol:sol||""}}
function rep(n,e){var s="";for(var i=0;i<n;i++)s+=e;return s}
function digitsNoCarry(a,max){var s=String(a),o="";for(var i=0;i<s.length;i++){o+=rnd(0,Math.min(9-+s[i],max))}return +o}
function genTopic(tp,d,n){
  var a,b,c,r,Q,f=food().e;
  switch(tp){
  case "count":
    a=d===1?rnd(1,5):d===2?rnd(4,8):rnd(6,10);
    Q=q(t("q_count"),a,tp,t("h_count"),rep(a,f));Q.cls="plain";return Q;
  case "cmp":
    var mx=d===1?10:d===2?20:100;a=rnd(0,mx);b=R()<.2?a:rnd(0,mx);
    r=a>b?">":a<b?"<":"=";
    Q=q(a+" ◯ "+b,r,tp,t("h_cmp",{a:a,b:b}));Q.opts=[">","<","="];return Q;
  case "add10":
    var m10=d===1?5:d===2?8:10;a=rnd(0,m10-1);b=rnd(1,m10-a);
    return q(a+" + "+b+" = ?",a+b,tp,t("h_add",{m:Math.max(a,b),k:Math.min(a,b)}),d<3?rep(a,f)+" ➕ "+rep(b,f):"");
  case "sub10":
    a=rnd(2,d===1?5:d===2?8:10);b=rnd(1,a);
    return q(a+" − "+b+" = ?",a-b,tp,t("h_sub",{a:a,b:b}),d<3?rep(a-b,f)+"<span class='gone'>"+rep(b,f)+"</span>":"");
  case "add20":
    if(d===1){a=rnd(11,17);b=rnd(1,9-a%10);return q(a+" + "+b+" = ?",a+b,tp,t("h_add",{m:a,k:b}))}
    if(d===2){a=rnd(6,9);b=rnd(11-a,9);if(R()<.5){c=a;a=b;b=c}
      var big=Math.max(a,b),sm=Math.min(a,b),x=10-big;
      return q(a+" + "+b+" = ?",a+b,tp,t("h_make10"),"",t("s_make10",{a:big,b:sm,x:x,y:sm-x,r:a+b}))}
    a=rnd(2,8);b=rnd(2,8);c=rnd(1,Math.max(1,20-a-b));
    return q(a+" + "+b+" + "+c+" = ?",a+b+c,tp,t("h_add3",{a:a,b:b,s:a+b}));
  case "sub20":
    if(d===1){a=rnd(13,19);b=rnd(1,a%10);return q(a+" − "+b+" = ?",a-b,tp,t("h_sub",{a:a,b:b}))}
    if(d===2){a=rnd(11,18);b=rnd(a%10+1,9);
      return q(a+" − "+b+" = ?",a-b,tp,t("h_back10"),"",t("s_back10",{a:a,b:b,x:a%10,y:b-a%10,r:a-b}))}
    a=20;b=rnd(3,9);c=rnd(1,8);
    return q(a+" − "+b+" − "+c+" = ?",a-b-c,tp,t("h_sub",{a:a,b:b}));
  case "miss":
    var mm=d===1?10:d===2?20:60;
    if(d<3||R()<.5){a=rnd(1,mm-1);c=rnd(a+1,mm);return q(a+" + ? = "+c,c-a,tp,t("h_miss",{a:a,c:c}),"",t("s_miss",{a:a,c:c,r:c-a}))}
    a=rnd(10,mm);b=rnd(1,a-1);return q(a+" − ? = "+(a-b),b,tp,t("h_miss2",{a:a,c:a-b}),"",t("s_miss2",{a:a,c:a-b,r:b}));
  case "add100":
    if(d===1){a=10*rnd(1,8);b=10*rnd(1,9-a/10);return q(a+" + "+b+" = ?",a+b,tp,t("h_tens",{a:a/10,b:b/10}))}
    if(d===2){a=rnd(11,78);b=digitsNoCarry(a,8);if(b<10)b+=10*rnd(1,Math.max(1,8-Math.floor(a/10)));if(a+b>99){b=rnd(1,99-a)}
      return q(a+" + "+b+" = ?",a+b,tp,t("h_tensones"),"",t("s_tensones",{a:a,b:b,t:(Math.floor(a/10)+Math.floor(b/10))*10,o:a%10+b%10,r:a+b}))}
    do{a=rnd(15,79);b=rnd(12,99-a)}while(a%10+b%10<10||a+b>99);
    return q(a+" + "+b+" = ?",a+b,tp,t("h_tensones"),"",t("s_tensones",{a:a,b:b,t:(Math.floor(a/10)+Math.floor(b/10))*10,o:a%10+b%10,r:a+b}));
  case "sub100":
    if(d===1){a=10*rnd(3,9);b=10*rnd(1,a/10-1);return q(a+" − "+b+" = ?",a-b,tp,t("h_tens2",{a:a/10,b:b/10}))}
    if(d===2){do{a=rnd(25,99);b=rnd(11,a-1)}while(b%10>a%10);
      return q(a+" − "+b+" = ?",a-b,tp,t("h_tensones2"),"",t("s_tensones2",{a:a,b:b,t:(Math.floor(a/10)-Math.floor(b/10))*10,o:a%10-b%10,r:a-b}))}
    do{a=rnd(31,99);b=rnd(12,a-5)}while(b%10<=a%10);
    var x2=a%10;return q(a+" − "+b+" = ?",a-b,tp,t("h_tensones2"),"",t("s_borrow",{a:a,b:b,x:a-x2,y:x2,r:a-b,m:a-b+x2}));
  case "mtab":
    a=n||rnd(2,9);b=d===1?rnd(1,5):rnd(1,10);
    if(d===3&&R()<.5){c=a;a=b;b=c}
    return q(a+" × "+b+" = ?",a*b,tp,t("h_mul",{a:a,b:b}),"",b<=6?Array(b).fill(a).join(" + ")+" = "+(a*b):"");
  case "div":
    b=d===1?rnd(2,5):rnd(2,9);r=d===3?rnd(2,12):rnd(2,10);a=b*r;
    return q(a+" : "+b+" = ?",r,tp,t("h_div",{a:a,b:b}),"",t("s_div",{a:a,b:b,r:r}));
  case "missmul":
    b=d===1?rnd(2,5):rnd(2,9);r=rnd(2,d===3?12:9);
    return q("? × "+b+" = "+(b*r),r,tp,t("h_missmul",{c:b*r,b:b}),"",t("s_div",{a:b*r,b:b,r:r}));
  case "big":
    var sub=R()<.4;
    if(d===1){a=100*rnd(2,8);b=100*rnd(1,sub?a/100-1:9-a/100)}
    else if(d===2){a=rnd(120,780);b=sub?rnd(100,a-100):digitsNoCarry(a,9);if(!sub&&b<100)b+=100}
    else{a=rnd(150,800);b=sub?rnd(101,a-10):rnd(101,999-a)}
    if(!sub&&a+b>999)b=999-a;
    return sub?q(a+" − "+b+" = ?",a-b,tp,t("h_big")):q(a+" + "+b+" = ?",a+b,tp,t("h_big"));
  case "mul2":
    a=d===1?rnd(11,19):d===2?rnd(21,49):rnd(21,99);b=d===1?rnd(2,4):d===2?rnd(2,5):rnd(3,9);
    var tt=Math.floor(a/10)*10,o=a%10;
    return q(a+" × "+b+" = ?",a*b,tp,t("h_mul2",{t:tt,o:o,b:b}),"",t("s_mul2",{t:tt,o:o,b:b,x:tt*b,y:o*b,r:a*b}));
  case "frac":
    var fr=pick(d===1?[[1,2],[1,4]]:d===2?[[1,3],[1,5],[2,3],[1,2]]:[[3,4],[3,5],[2,5],[5,6],[2,3]]),k=rnd(2,d===1?5:10),nn=fr[1]*k;
    return q(t("q_frac",{n:nn,a:fr[0],b:fr[1]}),fr[0]*k,tp,t("h_frac",{n:nn,d:fr[1],k:fr[0]}),"",t("s_frac",{n:nn,d:fr[1],q:k,k:fr[0],r:fr[0]*k}));
  case "order":
    if(d===1){a=rnd(1,20);b=rnd(2,5);c=rnd(2,5);return q(a+" + "+b+" × "+c+" = ?",a+b*c,tp,t("h_order",{b:b,c:c,p:b*c}),"",t("s_order",{p:b*c,a:a,r:a+b*c,op:"+"}))}
    if(d===2){b=rnd(2,9);c=rnd(2,9);var bg=b*c+rnd(1,20);return q(bg+" − "+b+" × "+c+" = ?",bg-b*c,tp,t("h_order",{b:b,c:c,p:b*c}),"",t("s_order2",{p:b*c,a:bg,r:bg-b*c}))}
    a=rnd(2,9);b=rnd(2,9);c=rnd(2,6);
    return q("("+a+" + "+b+") × "+c+" = ?",(a+b)*c,tp,t("h_paren",{a:a,b:b,s:a+b}),"",(a+b)+" × "+c+" = "+((a+b)*c));
  }
}
/* daraja bo'yicha aralash savol (test, o'yin) */
function gen(lv,d){
  var list=LV_TOPICS[lv].slice();
  if(lv>1&&R()<.25)list=LV_TOPICS[lv-1];
  var tp=pick(list);
  return genTopic(tp,d||rnd(2,3));
}
function options(ans){
  var set={},out=[ans];set[ans]=1;
  var dd=[1,-1,2,-2,10,-10,3,-3,5,-5];if(ans>30)dd=dd.concat([20,-20,11,-9]);
  shuffle(dd);
  for(var i=0;i<dd.length&&out.length<4;i++){var v=ans+dd[i];if(v>=0&&!set[v]){set[v]=1;out.push(v)}}
  while(out.length<4){var v2=rnd(0,ans+10);if(!set[v2]){set[v2]=1;out.push(v2)}}
  return shuffle(out);
}
function renderQ(prefix,Q,onAnswer){
  CURQ[prefix]=Q;
  var qe=$(prefix+"-q");
  if(Q.html)qe.innerHTML=Q.text;else qe.textContent=Q.text;
  qe.className="q "+(Q.cls||(Q.word?"word":(Q.text.length>14?"small":"")));
  $(prefix+"-pics").innerHTML=Q.pics||"";
  var box=$(prefix+"-ans");box.innerHTML="";
  var ops=Q.opts?shuffle(Q.opts.slice()):options(Q.ans);
  if(Q.topic==="cmp")ops=[">","=","<"];
  box.className="answers"+(ops.length===3?" three":"");
  ops.forEach(function(v){
    var b=document.createElement("button");b.className="ans";b.textContent=v;b.dataset.v=String(v);
    if(String(v).length>3)b.style.fontSize="20px";
    b.onclick=function(){onAnswer(v,b)};box.appendChild(b);
  });
  if(S.tts&&prefix!=="rc")speak(speechText(Q));
}

/* =========================================================
   TIL TANLASH VA TANISHUV
   ========================================================= */
var HELLO_I=0,HELLO_T=null;
function buildLangGrid(boxId,onPick){
  var box=$(boxId);box.innerHTML="";
  LANGS.forEach(function(l){
    var b=document.createElement("button");b.className="lbtn"+(l.c===L?" sel":"");
    b.innerHTML="<span class='flag'>"+l.f+"</span><span>"+l.n+"</span>";
    b.onclick=function(){onPick(l.c)};box.appendChild(b);
  });
}
function openLangFirst(){
  buildLangGrid("langs",function(c){setLang(c);clearInterval(HELLO_T);openIntro(0)});
  clearInterval(HELLO_T);
  HELLO_T=setInterval(function(){var h=$("hello");h.style.opacity=0;setTimeout(function(){HELLO_I=(HELLO_I+1)%LANGS.length;h.textContent=LANGS[HELLO_I].hi;h.style.opacity=1},400)},1600);
  show("s-lang");
}
var INTRO=[{e:"🦉",k:1},{e:"🏝️",k:2},{e:"🚀",k:3}];
function openIntro(i){
  var it=INTRO[i];
  $("in-e").textContent=it.e;$("in-t").textContent=t("intro"+it.k+"_t");$("in-b").textContent=t("intro"+it.k+"_b");
  $("in-dots").innerHTML=INTRO.map(function(_,j){return "<i class='"+(j===i?"on":"")+"'></i>"}).join("");
  $("in-next").textContent=i<INTRO.length-1?t("next"):t("start_journey");
  $("in-next").onclick=function(){if(i<INTRO.length-1)openIntro(i+1);else finishIntro()};
  show("s-intro");
}
function finishIntro(){DB.intro=true;save();openPick()}
$("in-skip").onclick=finishIntro;
function openLangModal(){
  buildLangGrid("langs-modal",function(c){
    setLang(c);$("lang-modal").classList.remove("on");
    var cur=document.querySelector(".screen.on");
    if(cur&&cur.id==="s-menu")openMenu();
    else if(cur&&cur.id==="s-pick")openPick();
    else if(cur&&cur.id==="s-start"){buildForm();refreshFormTexts()}
  });
  $("lang-modal").classList.add("on");
}
document.querySelectorAll("[data-lang]").forEach(function(b){b.onclick=openLangModal});
$("lang-close").onclick=function(){$("lang-modal").classList.remove("on")};
$("lang-modal").onclick=function(e){if(e.target===this)this.classList.remove("on")};

/* =========================================================
   PROFIL TANLASH (BOSH SAHIFA)
   ========================================================= */
var F=null,EDIT=null,DELSTEP=0;
function openPick(){
  stopTimers();applyTheme(null);applyStatic();
  var ps=profiles();
  if(!ps.length){openForm(null);return}
  $("pk-greet").textContent=greeting();
  var s=season();
  if(s){$("pk-season").style.display="block";$("pk-season").textContent=t("season_"+s)}else $("pk-season").style.display="none";
  var box=$("profiles");box.innerHTML="";
  ps.forEach(function(p){
    var b=document.createElement("button");b.className="pcard";
    var y=dayN(p,daysAgo(1)),live=p.streak.last===today()||p.streak.last===daysAgo(1);
    var meta=(live&&p.streak.n>=2?"🔥 "+p.streak.n+" · ":"")+(y?t("yesterday_n",{n:y}):t("level_n",{n:p.level}));
    b.innerHTML="<span class='av'>"+buddy(p).e+"</span><b>"+esc(p.name)+"</b><small>⭐ "+p.stars+"</small><span class='meta'>"+esc(meta)+"</span>";
    if(p.fav.color&&THEMES[p.fav.color])b.style.borderColor=THEMES[p.fav.color].main;
    b.onclick=function(){enter(p.id)};box.appendChild(b);
  });
  var add=document.createElement("button");add.className="pcard add";
  add.innerHTML="<span class='av'>➕</span><b>"+t("new_player")+"</b><small>"+t("new_player_sub")+"</small>";
  add.onclick=function(){openForm(null)};box.appendChild(add);
  show("s-pick");
}
$("pk-gift").onclick=function(){toast(t("daily_pick_first"))};
$("pk-parent").onclick=function(){toast(t("parents_soon"))};
function enter(id){DB.cur=id;S=DB.list[id];L=S.lang||L;DB.lang=L;save();applyStatic();applyTheme(S);openMenu()}

/* forma */
function openForm(id){
  EDIT=id;DELSTEP=0;
  var p=id?DB.list[id]:null;
  F={name:p?p.name:"",age:p?p.age:null,level:p?p.level:1,fav:p?JSON.parse(JSON.stringify(p.fav)):{},tts:p?p.tts:false,ttsTouched:!!p};
  $("name").value=F.name;$("start-err").textContent="";
  $("gift").open=!!p;$("f-tts").checked=!!F.tts;
  applyStatic();refreshFormTexts();buildForm();applyTheme({fav:F.fav});show("s-start");
}
function refreshFormTexts(){
  var p=EDIT;
  $("f-title").textContent=p?t("about_title"):t("app_title");
  $("f-sub").textContent=p?t("about_sub"):t("tagline");
  $("start-go").textContent=p?t("btn_save"):t("btn_start");
  $("f-back").style.display=profiles().length?"block":"none";
  $("f-del").style.display=p?"block":"none";$("f-del").textContent=t("del_profile");
}
function levelText(n){return {t:t("lv"+n+"_t"),d:t("lv"+n+"_d")}}
function levelChips(boxId,cur,onPick){
  var box=$(boxId);box.innerHTML="";
  for(var n=1;n<=6;n++)(function(n){
    var lt=levelText(n),b=document.createElement("button");b.className="chip"+(cur===n?" sel":"");
    b.innerHTML="<b>"+n+"</b>"+lt.t+"<br><span style='font-weight:400;font-size:13px'>"+lt.d+"</span>";
    b.onclick=function(){onPick(n)};box.appendChild(b);
  })(n);
}
function buildForm(){
  $("f-ico").textContent=F.fav.animal!=null?ANIMAL_E[F.fav.animal]:"🧮";
  var box=$("ages");box.innerHTML="";
  AGES.forEach(function(a){
    var b=document.createElement("button");b.className="chip"+(F.age===a?" sel":"");b.textContent=a;
    b.onclick=function(){F.age=a;F.level=ageToLevel(a);if(!F.ttsTouched){F.tts=a<=6;$("f-tts").checked=F.tts}$("start-err").textContent="";buildForm()};
    box.appendChild(b);
  });
  levelChips("levels-start",F.level,function(n){F.level=n;buildForm()});
  var cb=$("fav-color");cb.innerHTML="";
  THEME_KEYS.forEach(function(k,i){
    var b=document.createElement("button");b.className="chip color"+(F.fav.color===k?" sel":"");b.style.background=THEMES[k].main;
    b.setAttribute("aria-label",tA("colors")[i]);b.title=tA("colors")[i];
    b.onclick=function(){F.fav.color=F.fav.color===k?null:k;applyTheme({fav:F.fav});buildForm()};cb.appendChild(b);
  });
  emoChips("fav-animal",ANIMAL_E,tA("animals"),"animal");
  emoChips("fav-food",FOOD_E,tA("foods").map(function(s){return s.split("|")[0]}),"food");
  emoChips("fav-hobby",HOBBY_E,tA("hobbies"),"hobby");
  var nb=$("fav-nick");nb.innerHTML="";
  tA("nicks").forEach(function(n,i){
    var b=document.createElement("button");b.className="chip"+(F.fav.nick===i?" sel":"");b.style.fontSize="16px";b.textContent=n;
    b.onclick=function(){F.fav.nick=F.fav.nick===i?null:i;buildForm()};nb.appendChild(b);
  });
}
function emoChips(id,emo,names,key){
  var box=$(id);box.innerHTML="";
  emo.forEach(function(e,i){
    var b=document.createElement("button");b.className="chip emo"+(F.fav[key]===i?" sel":"");
    b.innerHTML=e+"<small>"+esc(names[i]||"")+"</small>";
    b.onclick=function(){F.fav[key]=F.fav[key]===i?null:i;buildForm()};box.appendChild(b);
  });
}
$("f-tts").onchange=function(){F.tts=this.checked;F.ttsTouched=true;if(F.tts)speak(t("tts_hello"))};
$("name").addEventListener("input",function(){$("start-err").textContent=""});
$("start-go").onclick=function(){
  var n=$("name").value.trim();
  if(!n){$("start-err").textContent=t("err_name");$("name").focus();return}
  if(!F.age){$("start-err").textContent=t("err_age");return}
  var p=EDIT?DB.list[EDIT]:blankProfile();
  p.name=n;p.age=F.age;p.level=F.level;p.fav=F.fav;p.tts=F.tts;p.lang=L;
  DB.list[p.id]=p;save();
  var hadFav=Object.keys(F.fav).some(function(k){return F.fav[k]!=null}),wasEdit=EDIT;
  enter(p.id);
  if(!wasEdit&&hadFav)toast(t("buddy_hello",{b:buddy().e,n:n}));
  if(wasEdit)toast(t("saved"));
};
$("f-back").onclick=function(){if(EDIT&&DB.list[EDIT]){applyTheme(DB.list[EDIT]);openMenu()}else openPick()};
$("f-del").onclick=function(){
  if(!DELSTEP){DELSTEP=1;this.textContent=t("del_confirm");return}
  delete DB.list[EDIT];DB.cur=null;S=null;save();openPick();
};

/* =========================================================
   MENYU
   ========================================================= */
function levelLabel(){return S.level+" — "+t("lv"+S.level+"_t")}
function menuBubble(){
  var b=buddy(),td=dayN(S,today()),y=dayN(S,daysAgo(1)),nm=esc(callName());
  if(S.total===0)return t("bubble_first",{n:nm,b:b.n});
  if(td>0&&y>0&&td>y)return t("bubble_more",{t:td});
  if(td===0&&S.streak.n>=2&&S.streak.last===daysAgo(1))return t("bubble_streak",{s:S.streak.n});
  if(td===0&&y>0)return t("bubble_yest",{y:y});
  if(td>=GOAL)return t("bubble_goal");
  return fmt(pick(tA("bubble_any")),{n:nm});
}
function openMenu(){
  stopTimers();applyStatic();
  $("m-name").textContent=buddy().e+" "+S.name;
  $("m-buddy").textContent=buddy().e;
  $("m-bubble").innerHTML=menuBubble();
  var live=S.streak.last===today()||S.streak.last===daysAgo(1);
  $("m-streak").textContent=live?S.streak.n:0;
  var td=dayN(S,today());$("m-goal").textContent=Math.min(td,GOAL)+" / "+GOAL+(td>=GOAL?" ✅":"");
  $("m-goalbar").style.width=Math.min(100,td/GOAL*100)+"%";
  $("m-level").textContent=levelLabel();
  $("snd").textContent=S.sound?"🔊":"🔇";
  var done=S.daily===today();
  $("m-daily").classList.toggle("done",done);$("m-daily-sub").textContent=done?t("daily_done"):t("daily_open");
  $("m-msg").textContent="";
  refreshSay();updStars();show("s-menu");
}
$("snd").onclick=function(){S.sound=!S.sound;save();$("snd").textContent=S.sound?"🔊":"🔇"};
function buildLevelModal(){levelChips("levels-modal",S.level,function(n){S.level=n;save();$("m-level").textContent=levelLabel();buildLevelModal()})}
$("m-chlevel").onclick=function(){buildLevelModal();$("lvl-modal").classList.add("on")};
$("lvl-close").onclick=function(){$("lvl-modal").classList.remove("on")};
$("lvl-modal").onclick=function(e){if(e.target===this)this.classList.remove("on")};
document.querySelectorAll("[data-soon]").forEach(function(b){b.onclick=function(){$("m-msg").textContent=t("soon_msg")}});
document.querySelectorAll("[data-home]").forEach(function(b){b.onclick=openMenu});
$("go-about").onclick=function(){openForm(S.id)};
$("go-switch").onclick=function(){DB.cur=null;save();openPick()};

/* kun jumbog'i */
var DAILY_GENS=["genSeq","genOdd","genPattern","genMagic","genLogic"];
$("m-daily").onclick=function(){
  if(S.daily===today())return;
  var dn=Math.floor(Date.now()/864e5),g=window[DAILY_GENS[dn%DAILY_GENS.length]];
  var seed=dn*7+S.level,fn=function(lv){var old=R;R=seeded(seed);try{return g(lv)}finally{R=old}};
  mcqStart(t("daily_title"),fn,1,t("daily_info"),null,function(ok){S.daily=today();if(ok){S.stars+=5;toast(t("daily_reward"))}save()});
};

/* =========================================================
   UMUMIY NATIJA
   ========================================================= */
var AGAIN=null;
function titleFor(r){return t(r>=.9?"res_a":r>=.7?"res_b":r>=.5?"res_c":"res_d")}
function compare(key,val,lowerBetter,unitKey){
  var prev=S.last[key];S.last[key]=val;save();
  var u=function(v){return t(unitKey||"u_cnt",{v:v})};
  if(prev==null)return {cls:"flat",t:t("cmp_first")};
  var better=lowerBetter?val<prev:val>prev;
  if(better)return {cls:"",t:t("cmp_up",{p:u(prev),v:u(val)})};
  if(val===prev)return {cls:"flat",t:t("cmp_same",{p:u(prev)})};
  return {cls:"flat",t:t("cmp_down",{p:u(prev)})};
}
function showResult(o){
  var st=Math.max(0,Math.min(5,o.stars));
  $("r-stars").textContent="⭐".repeat(st)+"☆".repeat(5-st);
  $("r-title").textContent=o.title;
  $("r-score").textContent=o.score;
  $("r-best").textContent=o.best||"";
  if(o.grade){$("r-grade").style.display="block";$("r-grade").textContent=o.grade}else $("r-grade").style.display="none";
  if(o.cmp){$("r-cmp").style.display="block";$("r-cmp").className="cmp "+o.cmp.cls;$("r-cmp").textContent=o.cmp.t}else $("r-cmp").style.display="none";
  $("r-buddy").textContent=st>=4?praise():buddy().e+" "+fmt(pick(tA("result_cheer")),{n:callName()});
  if(o.topics){$("r-topics-card").style.display="block";$("r-topics").innerHTML=o.topics;$("r-tbtns").innerHTML=o.tbtns||""}else $("r-topics-card").style.display="none";
  if(o.review){$("r-review-card").style.display="block";$("r-review").innerHTML=o.review}else $("r-review-card").style.display="none";
  if(o.levelUp){$("r-up").style.display="block";$("r-up").textContent=t("level_up_btn",{n:S.level+1})}else $("r-up").style.display="none";
  AGAIN=o.again;
  if(st>=4)beep(true);
  updStars();show("s-result");
  document.querySelectorAll("#r-tbtns [data-topic]").forEach(function(b){b.onclick=function(){openLearn(b.dataset.topic)}});
}
$("r-again").onclick=function(){AGAIN&&AGAIN()};
$("r-up").onclick=function(){levelUp();openMenu()};
function levelUp(){S.level=Math.min(6,S.level+1);S.hiRun=0;S.cnt.up++;checkBadges();save();toast(t("level_now",{n:S.level}))}

/* =========================================================
   MASHQ: MAVZULAR
   ========================================================= */
function topicCard(tp){
  var m=S.mast[tp]||0,b=document.createElement("button");b.className="tcard"+(TOPICS[tp].lv===S.level?" cur":"");
  b.innerHTML="<span class='te'>"+TOPICS[tp].e+"</span><span class='tt'><b>"+t("t_"+tp)+"</b><small>"+(m>=100?t("mastered"):t("mastery",{p:m}))+"</small><span class='mbar'><i style='width:"+m+"%'></i></span></span><span style='font-size:22px'>▶</span>";
  b.onclick=function(){openLearn(tp)};return b;
}
function openTopics(){
  var mist=$("tp-mist");mist.innerHTML="";
  var due=dueMistakes();
  if(due.length){
    var mb=document.createElement("button");mb.className="tcard mist";
    mb.innerHTML="<span class='te'>🔁</span><span class='tt'><b>"+t("pr_mistakes",{n:due.length})+"</b><small>"+t("pr_mist_sub")+"</small></span><span style='font-size:22px'>▶</span>";
    mb.onclick=startMistakes;mist.appendChild(mb);
  }
  var cur=$("tp-cur");cur.innerHTML="";
  LV_TOPICS[S.level].forEach(function(tp){cur.appendChild(topicCard(tp))});
  var oth=$("tp-other");oth.innerHTML="";
  Object.keys(TOPICS).forEach(function(tp){if(LV_TOPICS[S.level].indexOf(tp)<0)oth.appendChild(topicCard(tp))});
  updStars();show("s-topics");
}
$("go-practice").onclick=openTopics;
var LN={tp:null,n:0};
function openLearn(tp){
  LN={tp:tp,n:0};
  $("ln-pill").textContent=TOPICS[tp].e+" "+t("t_"+tp);
  $("ln-e").textContent=TOPICS[tp].e;$("ln-t").textContent=t("t_"+tp);
  $("ln-i").innerHTML=t("i_"+tp);
  if(tp==="mtab"){
    $("ln-mt").style.display="block";
    var box=$("ln-nums");box.innerHTML="";
    [2,3,4,5,6,7,8,9,0].forEach(function(n){
      var b=document.createElement("button");b.className="chip"+(LN.n===n?" sel":"");b.textContent=n?n:t("mt_mixed");if(!n)b.style.fontSize="15px";
      b.onclick=function(){LN.n=n;box.querySelectorAll(".chip").forEach(function(x){x.classList.remove("sel")});b.classList.add("sel")};box.appendChild(b);
    });
    box.lastChild.classList.add("sel");
  }else $("ln-mt").style.display="none";
  show("s-learn");
}
$("ln-back").onclick=openTopics;
$("ln-go").onclick=function(){startPractice(LN.tp,LN.n)};

var P={};
function startPractice(tp,n){
  P={mode:"topic",tp:tp,n:n||0,d:(S.mast[tp]||0)>=60?2:1,run:0,ok:0,bad:0,Q:null,tries:0};
  $("p-prog").style.display="flex";updP();show("s-practice");practiceNext();
}
function startMistakes(){
  var q0=dueMistakes();
  P={mode:"mist",queue:q0.slice(0,10),ok:0,bad:0,Q:null,tries:0,total:Math.min(10,q0.length)};
  $("p-prog").style.display="none";updP();show("s-practice");practiceNext();
}
function practiceNext(){
  if(P.mode==="mist"){
    var m=P.queue.shift();
    if(!m){showResult({title:titleFor(P.ok/Math.max(1,P.total)),stars:Math.round(P.ok/Math.max(1,P.total)*5),score:t("first_try",{c:P.ok,n:P.total}),again:openTopics});return}
    P.m=m;P.Q={text:m.text,ans:m.ans,hint:m.hint,topic:m.topic,pics:m.pics,opts:m.opts,cls:m.cls,word:m.word,say:m.say,sol:m.sol};
  }else P.Q=genTopic(P.tp,P.d,P.n);
  P.tries=0;
  $("p-fb").textContent="";$("p-hint").classList.remove("on");$("p-next").style.display="none";
  renderQ("p",P.Q,practiceAnswer);
}
function practiceAnswer(v,btn){
  if(btn.disabled)return;
  var all=$("p-ans").querySelectorAll(".ans"),ok=String(v)===String(P.Q.ans);
  if(P.tries===0){
    record(ok,"math");
    if(P.mode==="topic")adapt(ok);
    else{
      var mm=P.m;S.mist=S.mist.filter(function(x){return x.k!==mm.k});
      if(ok){mm.step++;if(mm.step<3){mm.due=daysAgo(-[1,3,7][mm.step]);S.mist.push(mm)}}
      else{mm.step=0;mm.due=daysAgo(-1);S.mist.push(mm)}
      save();
    }
  }
  if(ok){
    btn.classList.add("ok");all.forEach(function(b){b.disabled=true});
    if(P.tries===0){P.ok++;addStar(btn)}
    beep(true);$("p-fb").style.color="#27500A";$("p-fb").textContent=praise();
    $("p-next").style.display="block";
  }else{
    P.tries++;btn.classList.add("bad");btn.disabled=true;beep(false);
    if(P.tries===1){P.bad++;if(P.mode==="topic")addMistake(P.Q)}
    $("p-fb").style.color="#791F1F";
    if(P.tries>=2){
      all.forEach(function(b){b.disabled=true;if(b.dataset.v===String(P.Q.ans))b.classList.add("ok")});
      $("p-fb").textContent=t("correct_is",{a:P.Q.ans});$("p-next").style.display="block";
      if(P.Q.sol){$("p-hint").innerHTML=t("solution")+" "+esc(P.Q.sol);$("p-hint").classList.add("on")}
    }else{
      $("p-fb").textContent=encourage();
      if(P.Q.hint){$("p-hint").innerHTML=t("hint")+" "+esc(P.Q.hint);$("p-hint").classList.add("on")}
    }
  }
  updP();
}
function adapt(ok){
  var tp=P.tp,m=S.mast[tp]||0;
  if(ok){P.run++;m=Math.min(100,m+P.d*4);if(P.run>=3&&P.d<3){P.d++;P.run=0;toast(t("harder"))}}
  else{P.run=0;m=Math.max(0,m-5);if(P.d>1)P.d--}
  if(m>=100&&(S.mast[tp]||0)<100){S.cnt.tstar++;toast(t("topic_mastered",{t:t("t_"+tp)}));checkBadges()}
  S.mast[tp]=m;save();
}
function updP(){
  $("p-ok").textContent=P.ok;$("p-bad").textContent=P.bad;updStars();
  if(P.mode==="topic"){var m=S.mast[P.tp]||0;$("p-mast").textContent=m>=100?t("mastered"):t("mastery",{p:m});$("p-mbar").style.width=m+"%";$("p-dif").textContent="●".repeat(P.d)+"○".repeat(3-P.d)}
}
$("p-next").onclick=practiceNext;
$("p-back").onclick=openTopics;

/* =========================================================
   TEST: TEZKOR / TO'LIQ / DARAJA IMTIHONI
   ========================================================= */
var TTYPES={quick:{n:10,sec:180,e:"⚡"},full:{n:20,sec:360,e:"📋"},exam:{n:15,sec:300,e:"🎓"}};
var T={};
function openTestMenu(){
  var box=$("tm-list");box.innerHTML="";
  Object.keys(TTYPES).forEach(function(k){
    var ty=TTYPES[k],b=document.createElement("button");b.className="tcard";
    var best=S.best["T"+k+S.level];
    b.innerHTML="<span class='te'>"+ty.e+"</span><span class='tt'><b>"+t("test_"+k)+"</b><small>"+t("test_"+k+"_sub")+(best!=null?" · 🏅 "+best+"/"+ty.n:"")+"</small></span><span style='font-size:22px'>▶</span>";
    b.onclick=function(){testStart(k)};box.appendChild(b);
  });
  updStars();show("s-testmenu");
}
$("go-test").onclick=openTestMenu;
function testStart(type){
  stopTimers();
  var ty=TTYPES[type],seen={},list=[];
  while(list.length<ty.n){var x=gen(S.level,type==="quick"?rnd(1,2):rnd(2,3));if(!seen[x.text]){seen[x.text]=1;list.push(x)}}
  T={type:type,n:ty.n,i:0,list:list,ans:[],end:Date.now()+ty.sec*1000,timer:null};
  show("s-test");testShow();
  T.timer=setInterval(testTick,250);testTick();
}
function testTick(){
  var left=Math.max(0,Math.ceil((T.end-Date.now())/1000));
  $("t-timer").textContent="⏱ "+Math.floor(left/60)+":"+("0"+left%60).slice(-2);
  $("t-timer").classList.toggle("low",left<=20);
  if(left<=0){clearInterval(T.timer);T.timer=null;toast(t("time_up"));testEnd()}
}
function testShow(){
  var Q=T.list[T.i];
  $("t-count").textContent=(T.i+1)+" / "+T.n;
  $("t-bar").style.width=(T.i/T.n*100)+"%";
  renderQ("t",Q,testPick);
  var a=T.ans[T.i];
  if(a!==undefined)$("t-ans").querySelectorAll(".ans").forEach(function(b){if(b.dataset.v===String(a))b.classList.add("sel")});
  $("t-next").textContent=T.i<T.n-1?t("next_q"):t("finish");
  $("t-next").style.opacity=a===undefined?.5:1;
}
function testPick(v,btn){
  T.ans[T.i]=v;
  $("t-ans").querySelectorAll(".ans").forEach(function(b){b.classList.remove("sel")});btn.classList.add("sel");
  $("t-next").style.opacity=1;
}
$("t-next").onclick=function(){
  if(T.ans[T.i]===undefined){toast(t("pick_answer"));return}
  if(T.i<T.n-1){T.i++;testShow()}else{clearInterval(T.timer);T.timer=null;testEnd()}
};
function testEnd(){
  if(!$("s-test").classList.contains("on"))return;
  var ok=0,wrong={},rev="";
  T.list.forEach(function(Q,i){
    var a=T.ans[i],good=a!==undefined&&String(a)===String(Q.ans);
    record(good,"math");
    if(good)ok++;
    else{
      wrong[Q.topic]=(wrong[Q.topic]||0)+1;addMistake(Q);
      if(!Q.html)rev+="<div class='rev'><div class='rq'>"+esc(Q.text)+"</div><div class='ry'>"+(a===undefined?t("no_ans"):t("your_ans",{a:esc(a)}))+"</div><div class='rc'>"+t("correct_is",{a:esc(Q.ans)})+"</div></div>";
    }
  });
  var pct=ok/T.n,grade=pct>=.9?5:pct>=.75?4:pct>=.5?3:2;
  var key="T"+T.type+S.level,prev=S.best[key],rec=prev==null||ok>prev;
  if(rec)S.best[key]=ok;
  if(ok===T.n){S.stars+=5;S.cnt.test10++}
  S.hiRun=pct>=.9?S.hiRun+1:0;
  var up=false,title=titleFor(pct);
  if(T.type==="exam"){
    if(pct>=.8){S.cnt.exam++;title=t("exam_pass",{n:Math.min(6,S.level+1)});if(S.level<6)levelUp()}
    else title=t("exam_fail",{p:80});
  }else up=S.level<6&&(ok===T.n||S.hiRun>=2);
  checkBadges();save();
  var ks=Object.keys(wrong),type=T.type;
  showResult({
    title:title,grade:grade+"",stars:grade,
    score:t("score_of",{c:ok,n:T.n})+(ok===T.n?t("bonus5"):""),
    cmp:compare("test"+type+S.level,ok,false),
    best:rec&&prev!=null?t("new_rec",{p:prev}):t("best_lvl",{b:S.best[key]}),
    review:rev||null,
    topics:ks.length?ks.map(function(k){return "<li>"+t("topic_err",{t:t("t_"+k),n:wrong[k]})+"</li>"}).join(""):null,
    tbtns:ks.map(function(k){return "<button class='tbtn' data-topic='"+k+"'>"+t("practice_topic",{t:t("t_"+k)})+"</button>"}).join(""),
    levelUp:up,again:function(){testStart(type)}
  });
}

/* =========================================================
   BOSHQOTIRMA GENERATORLARI
   ========================================================= */
function genSeq(lv){
  var maxT=lv<=2?1:lv<=4?3:5,ty=rnd(0,maxT),arr=[],i,hint,a,st;
  if(ty===0){st=lv<=2?rnd(1,3):rnd(2,9);a=rnd(0,10);for(i=0;i<6;i++)arr.push(a+st*i);hint=t("h_seq_add",{s:st})}
  else if(ty===1){st=lv<=2?rnd(1,2):rnd(2,8);a=st*5+rnd(0,10);for(i=0;i<6;i++)arr.push(a-st*i);hint=t("h_seq_sub",{s:st})}
  else if(ty===2){a=rnd(1,3);for(i=0;i<6;i++)arr.push(a*Math.pow(2,i));hint=t("h_seq_dbl")}
  else if(ty===3){a=rnd(1,5);arr.push(a);for(i=1;i<6;i++)arr.push(arr[i-1]+i);hint=t("h_seq_inc")}
  else if(ty===4){a=rnd(5,15);var x=rnd(3,6),y=rnd(1,x-1);arr.push(a);for(i=1;i<6;i++)arr.push(arr[i-1]+(i%2?x:-y));hint=t("h_seq_alt",{x:x,y:y})}
  else{a=rnd(1,4);for(i=0;i<6;i++)arr.push((a+i)*(a+i));hint=t("h_seq_sq",{a:a,b:a+1,c:a+2})}
  var Q=q(arr.slice(0,5).join(", ")+", ?",arr[5],"seq",hint);Q.say=t("say_seq",{s:arr.slice(0,5).join(", ")});return Q;
}
var CATS=[["cat_fruit",["🍎","🍌","🍇","🍐","🍓","🍒","🍉"]],["cat_animal",["🐶","🐱","🐰","🐻","🦁","🐸","🐮"]],["cat_transport",["🚗","🚌","🚲","✈️","🚂","🚀","🚕"]],["cat_veg",["🥕","🥒","🍅","🌽","🥔","🧅"]]];
function genOdd(lv){
  var types=["cat","even"];if(lv>=2)types.push("sum");if(lv>=4)types.push("mult");
  var ty=pick(types),opts=[],ans,hint,set={};
  if(ty==="cat"){var c=shuffle(CATS.slice()),A=c[0],B=c[1];opts=shuffle(A[1].slice()).slice(0,3);ans=pick(B[1]);opts.push(ans);hint=t("h_odd_cat",{g:t(A[0])})}
  else if(ty==="even"){var max=lv<=2?20:100,ev=R()<.5,par=ev?0:1;while(opts.length<3){var n=rnd(1,max);if(n%2===par&&!set[n]){set[n]=1;opts.push(n)}}do{ans=rnd(1,max)}while(ans%2===par);opts.push(ans);hint=t(ev?"h_odd_even":"h_odd_oddn")}
  else if(ty==="mult"){var k=rnd(3,9);while(opts.length<3){var m=k*rnd(2,10);if(!set[m]){set[m]=1;opts.push(m)}}do{ans=rnd(k*2,k*10)}while(ans%k===0);opts.push(ans);hint=t("h_odd_mult",{k:k})}
  else{var N=rnd(6,lv<=3?18:40),e=[];while(e.length<3){var a=rnd(1,N-1),s=a+" + "+(N-a);if(!set[s]){set[s]=1;e.push(s)}}var d=pick([1,-1,2]),a2=rnd(1,N-2);ans=a2+" + "+(N-a2+d);opts=e.concat([ans]);hint=t("h_odd_sum",{n:N})}
  return {text:t("q_odd"),ans:String(ans),topic:"odd",hint:hint,opts:opts.map(String),cls:"plain"};
}
var PSETS=[["🔴","🔵","🟢","🟡","🟣"],["⭐","🌙","☀️","❤️","⚡"],["🐶","🐱","🐰","🐸","🐻"],["🔺","🟦","🟢","🔶","⬛"]];
function genPattern(lv){
  var units=lv<=2?["AB","AAB","ABB"]:lv<=4?["ABC","AABB","ABB","AAB"]:["ABCD","ABAC","AABC","ABCC","ABCB"];
  var u=pick(units),set=shuffle(pick(PSETS).slice()),map={A:set[0],B:set[1],C:set[2],D:set[3]};
  var len=u.length,total=Math.max(7,len*2+1+rnd(0,len-1)),seq=[];
  for(var i=0;i<=total;i++)seq.push(map[u[i%len]]);
  return {text:seq.slice(0,total).join(" ")+" ❓",ans:seq[total],topic:"pat",say:t("say_pat"),
    hint:t("h_pat",{u:u.split("").map(function(c){return map[c]}).join(" ")}),opts:set.slice(0,4),cls:"pat"};
}
function W(o){o.word=true;return o}
function genLogic(lv){
  var big=lv<=1?5:lv<=2?10:lv<=3?30:50,Lq=[],f=food().w,names=tA("names");
  Lq.push(function(){var n1=pick(names),n2=pick(names.filter(function(x){return x!==n1})),a=rnd(1,big),b=rnd(1,big);
    return q(t("lg_more",{n1:n1,n2:n2,a:a,b:b,f:f}),a+b,"logic",t("lg_more_h",{a:a,b:b}))});
  Lq.push(function(){var a=rnd(3,big+3),b=rnd(1,a-1);return q(t("lg_eat",{a:a,b:b,f:f,me:S.name}),a-b,"logic",t("lg_eat_h",{a:a,b:b}))});
  Lq.push(function(){var a=rnd(lv<=2?5:8,lv<=2?12:20),b=rnd(1,Math.min(5,a-1));return q(t("lg_age",{a:a,b:b}),a-b,"logic",t("lg_age_h",{a:a,b:b}))});
  var hk=hobbyKey();
  if(hk){
    var fa=function(){var a=rnd(1,big),b=rnd(1,big);return q(t("hb_"+hk+"_a",{a:a,b:b,me:S.name}),a+b,"logic",t("h_addab",{a:a,b:b}))};
    Lq.push(fa);Lq.push(fa);
    if(lv>=4)Lq.push(function(){var r=rnd(2,6),c=rnd(2,6);return q(t("hb_"+hk+"_m",{r:r,c:c,me:S.name}),r*c,"logic",t("h_mulrc",{r:r,c:c}))});
  }
  if(lv>=3){
    Lq.push(function(){var days=tA("days"),d=rnd(0,6),k=rnd(1,lv>=5?10:4),ans=days[(d+k)%7],others=shuffle(days.filter(function(x){return x!==ans})).slice(0,3);
      return {text:t("lg_day",{d:days[d],k:k}),ans:ans,topic:"logic",hint:t("lg_day_h",{list:days.join(", ")}),opts:others.concat([ans])}});
    Lq.push(function(){var ani=lv>=4&&R()<.5?["an_cat",4]:["an_hen",2],x=rnd(2,lv>=4?9:5),an=t(ani[0]);
      return q(t("lg_legs",{x:x,an:an}),x*ani[1],"logic",t("lg_legs_h",{an1:an,l:ani[1],x:x}))});
  }
  if(lv>=4){
    Lq.push(function(){var r=rnd(2,6),c=rnd(2,6);return q(t("lg_desk",{r:r,c:c}),r*c,"logic",t("h_mulrc",{r:r,c:c}))});
    Lq.push(function(){var h=rnd(8,11),d=rnd(1,3);return q(t("lg_time",{h:h,d:d}),h+d,"logic",t("lg_time_h",{h:h,d:d}))});
  }
  if(lv>=5){
    Lq.push(function(){var p=rnd(2,9),n=rnd(2,9);return q(t("lg_price",{p:p,n:n}),p*n,"logic",t("h_mulrc",{r:p,c:n}))});
    Lq.push(function(){var k=rnd(2,6),r=rnd(2,8);return q(t("lg_share",{t:k*r,k:k,f:f}),r,"logic",t("lg_share_h",{t:k*r,k:k}))});
  }
  if(lv>=6){
    Lq.push(function(){var s=rnd(3,10),m=pick([3,4,5]);return q(t("lg_father",{a:s*m,m:m}),s,"logic",t("lg_father_h",{a:s*m,m:m}))});
    Lq.push(function(){var a=rnd(3,10),b=rnd(2,6),c=rnd(1,a+b-1);return q(t("lg_chain",{a:a,b:b,c:c}),a+b-c,"logic",t("lg_chain_h",{a:a,b:b,c:c,s:a+b}))});
  }
  return W(pick(Lq)());
}
function genMagic(lv){
  var g=[[2,7,6],[9,5,1],[4,3,8]],r=rnd(0,3),i,j;
  for(i=0;i<r;i++)g=g[0].map(function(_,c){return g.map(function(row){return row[c]}).reverse()});
  if(R()<.5)g=g.map(function(row){return row.slice().reverse()});
  var k=lv<=3?0:rnd(1,lv*3);g=g.map(function(row){return row.map(function(v){return v+k})});
  var sum=15+3*k,mi=rnd(0,2),mj=rnd(0,2),ans=g[mi][mj];
  var h="<div style='font-size:18px;font-weight:700;margin-bottom:6px'>"+t("mag_q",{s:"<span style='color:var(--orange)'>"+sum+"</span>"})+"</div><table class='magic'>";
  for(i=0;i<3;i++){h+="<tr>";for(j=0;j<3;j++)h+=(i===mi&&j===mj)?"<td class='miss'>?</td>":"<td>"+g[i][j]+"</td>";h+="</tr>"}
  h+="</table>";
  var o=g[mi].filter(function(v,jj){return jj!==mj});
  return {text:h,html:true,ans:ans,topic:"magic",cls:"plain",say:t("say_mag",{s:sum}),hint:t("h_mag",{a:o[0],b:o[1],c:o[0]+o[1],s:sum})};
}

/* =========================================================
   UMUMIY SAVOL EKRANI
   ========================================================= */
var M={};
function mcqStart(title,genFn,n,info,key,onDone,back,onFinish){
  M={title:title,gen:genFn,n:n,i:0,ok:0,seen:{},key:key,onDone:onDone,onFinish:onFinish,again:onDone?null:function(){mcqStart(title,genFn,n,info,key,null,back,onFinish)}};
  $("z-title").textContent=title;
  $("z-info").innerHTML=info||"";$("z-info").style.display=info?"block":"none";
  $("z-back").onclick=back||(onDone?openMenu:openPuzzles);
  show("s-mcq");mcqShow();
}
function mcqShow(){
  var Q,k=0;do{Q=M.gen(S.level);k++}while(M.seen[Q.text+"|"+Q.ans]&&k<30);
  M.seen[Q.text+"|"+Q.ans]=1;M.Q=Q;M.tries=0;
  $("z-count").textContent=(M.i+1)+" / "+M.n;$("z-ok").textContent=M.ok;
  $("z-bar").style.width=(M.i/M.n*100)+"%";
  $("z-fb").textContent="";$("z-hint").classList.remove("on");$("z-next").style.display="none";
  renderQ("z",Q,mcqAnswer);
}
function mcqAnswer(v,btn){
  if(btn.disabled)return;
  var all=$("z-ans").querySelectorAll(".ans"),Q=M.Q,ok=String(v)===String(Q.ans);
  if(M.tries===0)record(ok,"puz");
  if(ok){
    btn.classList.add("ok");all.forEach(function(b){b.disabled=true});
    if(M.tries===0){M.ok++;addStar(btn)}
    if(Q.onOk)Q.onOk();
    beep(true);$("z-fb").style.color="#27500A";$("z-fb").textContent=praise();
    $("z-next").style.display="block";
  }else{
    M.tries++;btn.classList.add("bad");btn.disabled=true;beep(false);
    $("z-fb").style.color="#791F1F";
    if(Q.hint){$("z-hint").innerHTML=t("hint")+" "+esc(Q.hint);$("z-hint").classList.add("on")}
    if(M.tries>=2){
      all.forEach(function(b){b.disabled=true;if(b.dataset.v===String(Q.ans))b.classList.add("ok")});
      $("z-fb").textContent=t("correct_is",{a:Q.ans});$("z-next").style.display="block";
    }else $("z-fb").textContent=encourage();
  }
  $("z-ok").textContent=M.ok;
}
$("z-next").onclick=function(){
  M.i++;
  if(M.i<M.n){mcqShow();return}
  if(M.onDone){var first=M.ok>0;M.onDone(first);openMenu();return}
  if(M.onFinish)M.onFinish(M.ok);
  showResult({title:titleFor(M.ok/M.n),stars:Math.round(M.ok/M.n*5),score:t("first_try",{c:M.ok,n:M.n}),
    cmp:M.key?compare(M.key,M.ok,false):null,again:M.again});
};

/* =========================================================
   HISOB SIRLARI
   ========================================================= */
var TRICKS=[
 {lv:2,g:function(){var a=rnd(2,99);return q(a+" × 10 = ?",a*10,"trick",t("tr1_h",{a:a}))}},
 {lv:2,g:function(){var a=rnd(11,89);return q(a+" + 9 = ?",a+9,"trick",t("tr2_h",{a:a,b:a+10}))}},
 {lv:4,g:function(){var a=rnd(11,30);return q(a+" × 4 = ?",a*4,"trick",t("tr3_h",{a:a,b:a*2}))}},
 {lv:4,g:function(){var a=rnd(2,30)*2;return q(a+" × 5 = ?",a*5,"trick",t("tr4_h",{a:a,b:a*10}))}},
 {lv:4,g:function(){var a=rnd(2,10);return q("9 × "+a+" = ?",9*a,"trick",t("tr5_h",{a:a,l:a-1,r:10-a}))}},
 {lv:5,g:function(){var x=rnd(1,8),y=rnd(0,9-x),a=x*10+y;return q(a+" × 11 = ?",a*11,"trick",t("tr6_h",{x:x,y:y,r:String(x)+String(x+y)+String(y)}))}}
];
function buildTricks(){
  var box=$("tricks-list");box.innerHTML="";
  TRICKS.forEach(function(T0,i){
    var b=document.createElement("button");b.className="trick";
    b.innerHTML="⚡ "+t("tr"+(i+1)+"_t")+"<small>"+t("trick_meta",{l:T0.lv})+"</small>";
    b.onclick=function(){mcqStart(t("tr"+(i+1)+"_t"),T0.g,5,t("tr"+(i+1)+"_d"),"trick"+i)};box.appendChild(b);
  });
}

/* =========================================================
   XOTIRA
   ========================================================= */
var MEM={};
function memStart(){
  var lv=S.level,pairs=lv<=2?6:8,used={},cards=[],guard=0,fe=food().e;
  while(cards.length<pairs*2&&guard++<500){
    var a,b,ex,ans;
    if(lv===1){ans=rnd(1,6);ex=rep(ans,fe)}
    else if(lv<=3){var mx=lv===2?10:30;a=rnd(1,mx);b=rnd(1,mx);ans=a+b;ex=a+"+"+b}
    else if(lv<=5){a=rnd(2,9);b=rnd(2,9);ans=a*b;ex=a+"×"+b}
    else if(R()<.5){a=rnd(2,9);b=rnd(2,9);ans=a*b;ex=a+"×"+b}
    else{b=rnd(2,9);ans=rnd(2,9);ex=(b*ans)+":"+b}
    if(used[ans])continue;used[ans]=1;
    var id=cards.length/2;cards.push({id:id,t:ex},{id:id,t:String(ans)});
  }
  shuffle(cards);
  MEM={cards:cards,open:[],moves:0,done:0,pairs:cards.length/2,lock:false,els:[]};
  var box=$("mem-grid");box.innerHTML="";
  cards.forEach(function(c,i){var el=document.createElement("button");el.className="mcard";el.textContent="?";el.onclick=function(){memClick(i)};MEM.els.push(el);box.appendChild(el)});
  $("mem-info").textContent=t(lv===1?"mem_info1":"mem_info");
  $("mem-moves").textContent=t("moves",{n:0});updStars();show("s-memory");
}
function memFace(i,open){var c=MEM.cards[i],el=MEM.els[i];
  if(open){el.classList.add("open");el.textContent=c.t;el.style.fontSize=c.t.length>6?"15px":c.t.length>4?"18px":"24px"}
  else{el.classList.remove("open");el.textContent="?";el.style.fontSize=""}}
function memClick(i){
  var c=MEM.cards[i];
  if(MEM.lock||c.done||c.open)return;
  c.open=true;memFace(i,true);MEM.open.push(i);
  if(MEM.open.length<2)return;
  MEM.moves++;$("mem-moves").textContent=t("moves",{n:MEM.moves});
  var i1=MEM.open[0],i2=MEM.open[1],a=MEM.cards[i1],b=MEM.cards[i2];MEM.open=[];
  if(a.id===b.id){
    a.done=b.done=true;MEM.els[i1].classList.add("done");MEM.els[i2].classList.add("done");
    MEM.done++;beep(true);addStar(MEM.els[i2]);
    if(MEM.done===MEM.pairs)setTimeout(memEnd,800);
  }else{MEM.lock=true;setTimeout(function(){a.open=b.open=false;memFace(i1,false);memFace(i2,false);MEM.lock=false},950)}
}
function memEnd(){
  if(!$("s-memory").classList.contains("on"))return;
  var p=MEM.pairs,m=MEM.moves,key="M"+S.level,prev=S.best[key]||0,rec=!prev||m<prev;
  if(rec)S.best[key]=m;S.cnt.mem++;touchDay();checkBadges();save();
  showResult({title:t("mem_done"),stars:m<=p+2?5:m<=p+5?4:m<=p*2?3:2,score:t("mem_score",{m:t("u_moves",{v:m})}),
    cmp:compare("mem"+S.level,m,true,"u_moves"),best:t("mem_rec",{b:t("u_moves",{v:S.best[key]})}),again:memStart});
}

/* =========================================================
   SUDOKU 4x4
   ========================================================= */
var SU={};
function sudStart(){
  var b=[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]],p=shuffle([1,2,3,4]);
  b=b.map(function(r){return r.map(function(v){return p[v-1]})});
  function sw(g){var x;if(R()<.5){x=g[0];g[0]=g[1];g[1]=x}if(R()<.5){x=g[2];g[2]=g[3];g[3]=x}if(R()<.5)g=[g[2],g[3],g[0],g[1]];return g}
  function tr(g){return g[0].map(function(_,c){return g.map(function(r){return r[c]})})}
  b=sw(b);b=tr(sw(tr(b)));
  var holes=S.level<=2?6:S.level<=4?8:10,idx=[];for(var i=0;i<16;i++)idx.push(i);
  var cells=shuffle(idx).slice(0,holes);
  SU={grid:b.map(function(r){return r.slice()}),given:[],sel:-1,bad:null,t0:Date.now()};
  for(i=0;i<16;i++)SU.given[i]=cells.indexOf(i)<0;
  cells.forEach(function(k){SU.grid[Math.floor(k/4)][k%4]=0});
  $("sud-fb").textContent="";updStars();sudRender();show("s-sudoku");
}
function sudRender(){
  var box=$("sud-grid");box.innerHTML="";
  for(var i=0;i<16;i++)(function(i){
    var r=Math.floor(i/4),c=i%4,v=SU.grid[r][c],b=document.createElement("button");
    b.textContent=v||"";
    if(SU.given[i])b.className="given";
    else{if(SU.sel===i)b.classList.add("sel");if(SU.bad&&SU.bad[i])b.classList.add("wrong");b.onclick=function(){SU.sel=i;sudRender()}}
    if(c===1)b.classList.add("br");if(r===1)b.classList.add("bb");
    box.appendChild(b);
  })(i);
}
function sudPut(v){
  if(SU.sel<0){$("sud-fb").style.color="#791F1F";$("sud-fb").textContent=t("sud_pick");return}
  SU.grid[Math.floor(SU.sel/4)][SU.sel%4]=v;SU.bad=null;$("sud-fb").textContent="";sudRender();
  if(SU.grid.every(function(r){return r.every(function(x){return x>0})}))sudCheck();
}
function sudCheck(){
  var g=SU.grid,bad={},groups=[],r,c,full=true;
  for(r=0;r<4;r++){var row=[],col=[];for(c=0;c<4;c++){row.push([r,c]);col.push([c,r])}groups.push(row,col)}
  [[0,0],[0,2],[2,0],[2,2]].forEach(function(s){var bx=[];for(var a=0;a<2;a++)for(var d=0;d<2;d++)bx.push([s[0]+a,s[1]+d]);groups.push(bx)});
  groups.forEach(function(gr){var seen={};gr.forEach(function(p){var v=g[p[0]][p[1]],k=p[0]*4+p[1];if(!v){full=false;return}if(seen[v]!==undefined){bad[k]=1;bad[seen[v]]=1}else seen[v]=k})});
  SU.bad=bad;sudRender();
  var nb=Object.keys(bad).filter(function(k){return !SU.given[k]}).length;
  if(nb){beep(false);$("sud-fb").style.color="#791F1F";$("sud-fb").textContent=t("sud_bad")}
  else if(!full){$("sud-fb").style.color="#27500A";$("sud-fb").textContent=t("sud_ok")}
  else{
    var sec=Math.round((Date.now()-SU.t0)/1000);
    beep(true);S.stars+=3;S.cnt.sud++;touchDay();checkBadges();save();
    showResult({title:t("sud_done"),stars:5,score:t("sud_score",{s:sec}),cmp:compare("sud"+S.level,sec,true,"u_sec"),again:sudStart});
  }
}
document.querySelectorAll(".pad button").forEach(function(b){b.onclick=function(){sudPut(+b.dataset.n)}});
$("sud-check").onclick=sudCheck;
$("sud-new").onclick=sudStart;

/* =========================================================
   TEZKOR O'YIN
   ========================================================= */
var RC={};
function raceOpen(){
  raceStop();
  var rec=S.best["R"+S.level],last=S.last["race"+S.level];
  $("rc-rec").textContent=rec?(last!=null?t("race_rec",{r:rec,l:last}):t("race_rec1",{r:rec})):t("race_none");
  $("rc-intro").style.display="block";$("rc-game").style.display="none";$("rc-score").textContent=0;
  show("s-race");
}
function raceStart(){
  raceStop();
  RC={score:0,end:Date.now()+60000,timer:null,lock:false};
  $("rc-intro").style.display="none";$("rc-game").style.display="block";$("rc-score").textContent=0;
  show("s-race");raceNext();RC.timer=setInterval(raceTick,200);raceTick();
}
function raceStop(){if(RC.timer){clearInterval(RC.timer);RC.timer=null}}
function raceTick(){
  var left=Math.max(0,Math.ceil((RC.end-Date.now())/1000));
  $("rc-time").textContent=left;$("rc-bar").style.width=(left/60*100)+"%";
  if(left<=0){raceStop();raceEnd()}
}
function raceNext(){RC.Q=gen(S.level);RC.lock=false;renderQ("rc",RC.Q,raceAnswer)}
function raceAnswer(v,btn){
  if(RC.lock||!RC.timer)return;RC.lock=true;
  var ok=String(v)===String(RC.Q.ans);record(ok,"math");
  if(ok){btn.classList.add("ok");RC.score++;$("rc-score").textContent=RC.score;beep(true);setTimeout(raceNext,250)}
  else{btn.classList.add("bad");beep(false);$("rc-ans").querySelectorAll(".ans").forEach(function(b){if(b.dataset.v===String(RC.Q.ans))b.classList.add("ok")});setTimeout(raceNext,700)}
}
function raceEnd(){
  var key="R"+S.level,prev=S.best[key]||0,rec=RC.score>prev,bonus=Math.floor(RC.score/3);
  if(rec)S.best[key]=RC.score;S.stars+=bonus;checkBadges();save();
  showResult({title:rec&&prev>0?t("race_newrec"):titleFor(Math.min(1,RC.score/15)),stars:Math.min(5,Math.ceil(RC.score/3)),
    score:t("race_score",{n:RC.score})+(bonus?" (+"+bonus+" ⭐)":""),cmp:compare("race"+S.level,RC.score,false),
    best:t("best_lvl",{b:S.best[key]}),again:raceStart});
}
$("rc-go").onclick=raceStart;
$("rc-back").onclick=function(){raceStop();openMenu()};
$("go-race").onclick=raceOpen;

/* =========================================================
   BOSHQOTIRMA MENYUSI
   ========================================================= */
function openPuzzles(){stopTimers();updStars();show("s-puzzles")}
$("go-puzzles").onclick=openPuzzles;
document.querySelectorAll("[data-puz]").forEach(function(b){b.onclick=openPuzzles});
$("pz-seq").onclick=function(){mcqStart("🔢 "+t("pz_seq"),genSeq,8,t("i_seq"),"seq")};
$("pz-odd").onclick=function(){mcqStart("🔍 "+t("pz_odd"),genOdd,8,t("i_oddq"),"odd")};
$("pz-pat").onclick=function(){mcqStart("🎨 "+t("pz_pat"),genPattern,8,t("i_pat"),"pat")};
$("pz-mag").onclick=function(){mcqStart("✨ "+t("pz_mag"),genMagic,6,t("i_mag"),"mag")};
$("pz-log").onclick=function(){mcqStart("🤔 "+t("pz_log"),genLogic,6,t("i_log"),"log")};
$("pz-tri").onclick=function(){buildTricks();show("s-tricks")};
$("pz-mem").onclick=memStart;
$("pz-sud").onclick=sudStart;

/* =========================================================
   MENING O'SISHIM
   ========================================================= */
function openGrowth(){
  var td=S.hist[today()]||{n:0,c:0},y=dayN(S,daysAgo(1));
  var pct=S.total?Math.round(S.totalC/S.total*100):0;
  var live=S.streak.last===today()||S.streak.last===daysAgo(1);
  $("g-stats").innerHTML=
    "<div class='stat'><b>"+td.n+"</b><span>"+t("st_today")+"</span></div>"+
    "<div class='stat'><b>"+pct+"%</b><span>"+t("st_pct")+"</span></div>"+
    "<div class='stat'><b>🔥 "+(live?S.streak.n:0)+"</b><span>"+t("st_streak",{m:S.streak.max})+"</span></div>"+
    "<div class='stat'><b>⭐ "+S.stars+"</b><span>"+t("st_stars")+"</span></div>";
  var w1=weekSum(S,0),w2=weekSum(S,7),c="";
  if(td.n>0&&y>0)c+=td.n>y?"<div class='cmp'>"+t("g_more_today",{d:td.n-y})+"</div>":"<div class='cmp flat'>"+t("g_less_today",{y:y,t:td.n})+"</div>";
  if(w2>0)c+=w1>w2?"<div class='cmp'>"+t("g_week_up",{d:w1-w2})+"</div>":"<div class='cmp flat'>"+t("g_week_down",{w1:w1,w2:w2})+"</div>";
  else if(w1>0)c+="<div class='cmp'>"+t("g_week_first",{w:w1})+"</div>";
  $("g-cmp").innerHTML=c;
  var days=[],mx=1,i,wd=tA("wd");
  for(i=6;i>=0;i--){var d=daysAgo(i),h=S.hist[d]||{n:0,c:0};days.push({d:d,h:h,i:i});if(h.n>mx)mx=h.n}
  $("g-chart").innerHTML=days.map(function(o){
    var hh=Math.round(o.h.n/mx*120),ch=o.h.n?Math.round(o.h.c/o.h.n*100):0,w=wd[new Date(o.d+"T12:00:00").getDay()];
    return "<div class='col"+(o.i===0?" today":"")+"'><span class='v'>"+o.h.n+"</span><div class='b' style='height:"+Math.max(4,hh)+"px'><i style='height:"+ch+"%'></i></div><span class='d'>"+(o.i===0?t("today_lbl"):w)+"</span></div>";
  }).join("");
  var tps=Object.keys(S.mast).filter(function(k){return S.mast[k]>0}).sort(function(a,b){return S.mast[b]-S.mast[a]});
  $("g-topics").innerHTML=tps.length?tps.map(function(k){var m=S.mast[k];return "<div class='prog'><span style='min-width:46%'>"+TOPICS[k].e+" "+t("t_"+k)+"</span><div class='bar'><div style='width:"+m+"%'></div></div><span>"+(m>=100?"⭐":m+"%")+"</span></div>"}).join(""):"<p style='margin:0;color:var(--muted);font-size:16px'>"+t("g_topics_none")+"</p>";
  var recs=[];
  for(var n=1;n<=6;n++){
    var a=[];
    ["quick","full","exam"].forEach(function(k){if(S.best["T"+k+n]!=null)a.push(t("test_"+k).replace(/^\S+\s/,"")+": "+S.best["T"+k+n]+"/"+TTYPES[k].n)});
    if(S.best["R"+n])a.push(t("rec_race",{v:S.best["R"+n]}));
    if(S.best["M"+n])a.push(t("rec_mem",{v:t("u_moves",{v:S.best["M"+n]})}));
    if(a.length)recs.push("<li><b>"+t("level_n",{n:n})+":</b> "+a.join(" · ")+"</li>");
  }
  $("g-recs").innerHTML=recs.length?recs.join(""):"<li>"+t("rec_none")+"</li>";
  $("g-badges").innerHTML=BADGES.map(function(b){var has=!!S.badges[b.id];return "<div class='badge"+(has?"":" lock")+"'><span class='bi'>"+b.e+"</span><b>"+t("b_"+b.id)+"</b><small>"+(has?t("badge_got"):t("bd_"+b.id))+"</small></div>"}).join("");
  show("s-growth");
}
$("go-growth").onclick=openGrowth;

/* =========================================================
   OILA REYTINGI
   ========================================================= */
function openFamily(){
  var ps=profiles(),h="";
  if(ps.length<2){
    h="<div class='card' style='text-align:center'><p class='big'>👨‍👩‍👧‍👦</p><p>"+t("fam_empty")+"</p><p style='color:var(--muted);font-size:16px'>"+t("fam_how")+"</p></div>";
  }else{
    var CAT=[
      {e:"⭐",k:"fc_stars",u:"fu_stars",v:function(p){return p.stars}},
      {e:"🔥",k:"fc_streak",u:"fu_streak",v:function(p){return p.streak.max},min:2},
      {e:"📈",k:"fc_grow",u:"fu_grow",v:function(p){return weekSum(p,0)-weekSum(p,7)}},
      {e:"💯",k:"fc_week",u:"fu_week",v:function(p){return weekSum(p,0)}},
      {e:"🎖️",k:"fc_badges",u:"fu_badges",v:function(p){return Object.keys(p.badges).length}}
    ],lead={};
    h+="<h3>"+t("fam_winners")+"</h3>";
    CAT.forEach(function(c){
      var best=Math.max.apply(null,ps.map(c.v));
      if(best<=0||best<(c.min||0))return;
      var w=ps.filter(function(p){return c.v(p)===best});
      w.forEach(function(p){(lead[p.id]=lead[p.id]||[]).push(c.e+" "+t(c.k))});
      h+="<div class='win'><span class='wi'>"+c.e+"</span><div class='wt'>"+t(c.k)+"<b>"+w.map(function(p){return buddy(p).e+" "+esc(p.name)}).join(", ")+" — "+t(c.u,{v:best})+"</b></div><span class='wi'>👑</span></div>";
    });
    h+="<h3 style='margin-top:18px'>"+t("fam_each")+"</h3>";
    ps.slice().sort(function(a,b){return a.name.localeCompare(b.name)}).forEach(function(p){
      var l=lead[p.id];
      h+="<div class='fam'><span class='av'>"+buddy(p).e+"</span><div class='ft'><b>"+esc(p.name)+"</b><br>"+
        (l?t("fam_strong",{l:l.join(", ")}):t("fam_road",{w:weekSum(p,0)}))+
        "<br><span style='color:var(--muted)'>"+t("fam_meta",{s:p.stars,b:Object.keys(p.badges).length,l:p.level})+"</span></div></div>";
    });
    h+="<p class='small-note'>"+t("fam_note")+"</p>";
  }
  $("fam-body").innerHTML=h;show("s-family");
}
$("go-family").onclick=openFamily;

/* =========================================================
   BOSHLASH
   ========================================================= */
load();applyStatic();buildBg();refreshSay();
if("speechSynthesis" in window){try{speechSynthesis.getVoices()}catch(e){}}
if(S){applyTheme(S);openMenu()}
else if(!DB.intro&&!profiles().length)openLangFirst();
else openPick();
