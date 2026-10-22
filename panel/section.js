"use strict";(()=>{var E="openchamber.sdk";var je="data-oc-scrolling",yt=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${je}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${je}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${je}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${je}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function At(e){let t=e.documentElement;if(t.hasAttribute("data-oc-scrollbar-activity"))return;t.setAttribute("data-oc-scrollbar-activity","");let r=new WeakMap;e.addEventListener("scroll",s=>{let i=s.target===e?t:s.target;if(!(i instanceof Element))return;i.hasAttribute("data-oc-scrolling")||i.setAttribute("data-oc-scrolling","");let d=r.get(i);d!==void 0&&clearTimeout(d),r.set(i,setTimeout(()=>{r.delete(i),i.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var Jr=`(${At.toString()})(document);`;var Ho=/^[a-z][a-z0-9-]{0,39}$/;var No=e=>Object(e)===e&&!Array.isArray(e),kt=(e,t)=>Object.keys(e).every(r=>t.includes(r)),Go=e=>String(e)===e&&e.length>=1&&e.length<=60,Po=e=>String(e)===e&&e.length>=1&&e.length<=80,Do=e=>{if(!Array.isArray(e)||e.length>4)return!1;let t=new Set;for(let r of e){if(!No(r)||!Ho.test(r.id)||!Go(r.label)||r.disabled!==void 0&&r.disabled!==!0&&r.disabled!==!1||t.has(r.id))return!1;if(t.add(r.id),r.kind==="button"){if(!kt(r,["kind","id","label","disabled"]))return!1;continue}if(r.kind!=="select"||!kt(r,["kind","id","label","value","options","disabled"])||!Po(r.value)||!Array.isArray(r.options)||r.options.length<1||r.options.length>16)return!1;let s=new Set;for(let i of r.options){if(!No(i)||!kt(i,["value","label"])||!Po(i.value)||!Go(i.label)||s.has(i.value))return!1;s.add(i.value)}if(!s.has(r.value))return!1}return!0};var vt=e=>"bytes"in e?e.bytes.byteLength:e.content.length,$o=(e,t)=>{if(e.path!==t.path||e.readOnly!==t.readOnly)return!1;if(e.encoding==="text"||t.encoding==="text")return e.encoding==="text"&&t.encoding==="text"&&e.content===t.content;if(e.bytes.byteLength!==t.bytes.byteLength)return!1;for(let r=0;r<e.bytes.byteLength;r+=1)if(e.bytes[r]!==t.bytes[r])return!1;return!0};var Fo=/^[A-Za-z0-9_-]{1,80}$/;var Xo=["left","right","top","bottom"];var Bo=(e,t=0,r={remaining:16e3})=>{if(--r.remaining<0||t>=32)return!1;if(e===null)return!0;let s=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let i of s)if(!Bo(i,t+1,r))return!1;return!0},wt=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(t=>/^(0|[1-9]\d*)$/.test(t)&&Number(t)<e.length)&&e.every(wt);if(Object(e)===e){let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype)&&Object.values(e).every(wt)}return String(e)===e||Number.isFinite(e)},Ot=e=>{try{return String(e.id)!==e.id||!Fo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!Xo.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!Bo(e.data)||!wt(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var Vo=["file","directory","other","missing"],Ct=e=>!!(e&&"sessionId"in e),It=e=>!!(e&&"sent"in e&&!("sessionId"in e));var jo=/^[0-9a-f]{7,64}$/i,Ut=e=>jo.test(e),Ke=500,We=32e3,Ko=16e3,Wo=128,Jo=200,Yo=2e3,qo=16e3,Zo=80,Qo=200,er=16e3;var tr=2e3;var Mt=2e4,Je=1024,Ye=2e6;var qe=64e3,Ze=8e3,Lt=4e3;var Nt=96e4,Yr=60*6e4;var or=999,rr=1e4,ve=500,nr=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],sr=["stopped","starting","ready","failed"],qr=new Set(nr),ir=e=>qr.has(e),ar=e=>e&&ir(e)?e:"HOST_REJECTED",ce=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(ce):Object(e)===e?Object.values(e).every(ce):!1,cr=e=>ce(e)&&JSON.stringify(e).length<=er,zo=e=>e?.trim().slice(0,Qo)??"",le=e=>{let t=e.id.trim().slice(0,Wo),r=e.title.trim().slice(0,Jo),s=e.url.trim().slice(0,Yo),i=e.text?.trim().slice(0,qo),d=e.author?.trim().slice(0,Zo),g=e.kind==="pull"?"pull":"issue",x={providerId:e.providerId.trim(),id:t,title:r||t,url:s,kind:g};if(i&&(x.text=i),d&&(x.author=d),g==="pull"){let I=zo(e.branches?.head),U=zo(e.branches?.base);I&&U&&(x.branches={head:I,base:U})}return cr(e.data)&&(x.data=e.data),x},Gt=e=>{let t=le(e);return e.projectId&&(t.projectId=e.projectId),e.navigation&&(t.navigation=e.navigation),e.worktree&&(t.worktree=e.worktree),t},Pt=e=>{let t={text:e.text.trim().slice(0,Ko)};return e.send&&(t.send=!0),t},Ht=e=>e===null||!Number.isFinite(e)?null:Math.min(or,Math.max(0,Math.round(e))),Dt=e=>Number.isFinite(e)?Math.min(rr,Math.max(0,Math.ceil(e))):0;var de=e=>e.length>0&&e.length<=Je&&!e.includes("\0")&&!e.includes("\\");var Qe=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>tr?!1:!e.split("/").some(r=>r==="."||r===".."),Zr=new Set(sr),$t=e=>!!(e&&"status"in e&&Zr.has(String(e.status))&&!("body"in e)),et=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),Ft=e=>!!(e&&"content"in e&&String(e.content)===e.content),Xt=e=>!!(e&&"written"in e&&e.written===!0),Bt=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),Qr=new Set(Vo),zt=e=>!!(e&&"kind"in e&&"size"in e&&Qr.has(String(e.kind))&&Number.isFinite(e.size)),Vt=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),en=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),tn=e=>Object(e)===e?e:null,Rt=e=>String(e)===e&&e.length>0,on=e=>{if(!Rt(e.id))return null;if(e.ok===!0){let t={channel:E,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(t.payload=e.payload),t}return e.ok===!1&&Rt(e.error)?{channel:E,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:ar(Rt(e.code)?e.code:void 0)}:null},jt=e=>{let t=tn(e);return!t||t.channel!==E||t.v!==1?null:t.type==="result"?on(t):!en.has(String(t.type))||Object(t.payload)!==t.payload?null:t};var lr=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,rn=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",l=class extends Error{code;constructor(t,r){super(r),this.name="HostRequestError",this.code=t}},dr=()=>Promise.reject(new l("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),tt=()=>Promise.reject(new l("BAD_PATH",`File path must be 1 to ${Je} characters without NUL or backslash.`)),ot=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new l("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},m=e=>(e.value+=1,`oc-${e.value}`),qt=(e={})=>{let t=e.target??("window"in globalThis?window:null);if(!t)throw new l("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let r=e.acceptSource??(o=>o===t.parent),s=e.requestTimeoutMs??Mt,i=new Set,d=new Set,g=new Set,x=new Set,I=new Set,U=new Set,X=new Set,De=new Set,$e=new Set,ne=new Set,ht=[],Se=null,ge=null,Fe=new Set,Xe=new Set,Te=null,ye=null,_t=!1,se=new Map,ie=new Map,ae=new Map,B=!1,f={value:0},p=null,z=null,Ae=!1,ke=!1,yo=null,Ao=o=>o?{sessionId:o.id,phase:o.busy?"started":"completed"}:null,P=o=>{t.parent.postMessage(o,"*")},ko=()=>{B||t.parent===t||ne.size===0||p?.features?.lateGenerateResults!==!0||P({channel:E,v:1,type:"generate-late-listen"})},A=(o,n)=>{for(let a of o)try{a(n)}catch(c){console.error(c)}},vo=o=>{if(!(o instanceof MessageEvent)||!r(o.source))return;let n=jt(o.data);if(!n)return;if(n.type==="workspace"){let c=ie.get(n.payload.subscriptionId);c&&A([c],n.payload.snapshot);return}if(n.type==="shells"){let c=ae.get(n.payload.subscriptionId);c&&A([c],n.payload.snapshot);return}if(n.type==="ready"){p=n.payload,z=Ao(n.payload.session),A(i,n.payload),A(d,n.payload.directory),A(g,n.payload.session),z&&A(x,z),A(I,n.payload.connection),A(U,n.payload.settings),A(X,n.payload.item),ko();return}if(n.type==="generate-late"){ne.size===0?ht.push(n.payload):A(ne,n.payload);return}if(n.type==="directory"){p&&(p={...p,directory:n.payload.directory}),A(d,n.payload.directory);return}if(n.type==="session"){p&&(p={...p,session:n.payload.session}),n.payload.session?z?.sessionId!==n.payload.session.id&&(z=Ao(n.payload.session)):z=null,A(g,n.payload.session);return}if(n.type==="session-lifecycle"){z=n.payload,A(x,n.payload);return}if(n.type==="connection"){p&&(p={...p,connection:n.payload.connection}),A(I,n.payload.connection);return}if(n.type==="settings"){p&&(p={...p,settings:n.payload.settings}),A(U,n.payload.settings);return}if(n.type==="item"){p&&(p={...p,item:n.payload.item}),A(X,n.payload.item);return}if(n.type==="status-control-event"){A(De,n.payload);return}if(n.type==="popover-closed"){A($e,n.payload);return}if(n.type==="action"){let c=h=>{B||P({channel:E,v:1,type:"action-result",id:n.id,payload:h})},_=ge;if(!_){c({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>_(n.payload)).then(()=>c({ok:!0}),h=>{let O=(h instanceof Error?h.message:String(h)).trim();c({ok:!1,error:(O||"Action failed.").slice(0,ve)})});return}if(n.type==="file-open"){let c=n.payload;if(ye&&$o(ye,c))return;ye=c,A(Fe,n.payload);return}if(n.type==="file-saved"){A(Xe,n.payload.version);return}if(n.type==="file-snapshot"){let c=O=>{B||P({channel:E,v:1,type:"file-snapshot-result",id:n.id,payload:O})},_=O=>c({error:(O.trim()||"Could not read the edited file.").slice(0,ve)}),h=Te;if(!h){_("This extension does not edit files.");return}Promise.resolve().then(()=>h(n.payload.purpose)).then(O=>{if(vt(O)>2e7){_(`The file is over ${2e7} ${"bytes"in O?"bytes":"characters"}.`);return}if(O.version.length>256){_(`The snapshot version is over ${256} characters.`);return}c({snapshot:"bytes"in O?{bytes:O.bytes,version:O.version}:{content:O.content,version:O.version}})},O=>_(O instanceof Error?O.message:String(O)));return}if(n.type==="resolve"){let c=h=>{P({channel:E,v:1,type:"resolve-result",id:n.id,payload:h})},_=Se;if(!_){c({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>_(n.payload)).then(h=>c({item:h?le(h):null}),h=>{let O=(h instanceof Error?h.message:String(h)).trim();c({error:(O||"Command failed.").slice(0,ve)})});return}let a=se.get(n.id);if(a){if(clearTimeout(a.timer),se.delete(n.id),n.ok){a.resolve(n.payload);return}a.reject(new l(n.code,n.error))}};t.addEventListener("message",vo),P({channel:E,v:1,type:"hello"});let M=(o,n=s)=>B||t.parent===t?Promise.reject(new l("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((a,c)=>{let _=setTimeout(()=>{se.delete(o.id),c(new l("HOST_TIMEOUT","Host did not answer in time."))},n);se.set(o.id,{resolve:a,reject:c,timer:_}),P(o)}),v=o=>M(o).then(()=>{}),w={channel:E,v:1},St=o=>{!B&&t.parent!==t&&P(o)},wo=()=>St({...w,type:"file-save"}),Oo=o=>{!lr(o)||!rn(o)||(o.preventDefault(),wo())},Ro=o=>{!lr(o)||o.key!=="Escape"||p?.surface!=="popover"||!p.popover||(o.preventDefault(),Mo(p.popover.id,"escape").catch(()=>{}))},Be=()=>{let o=p?.surface==="popover"?p.popover:void 0;if(!o)return;let n=Ae||ke;yo!==n&&(yo=n,Lo(o.id,n).catch(()=>{}))},ze=()=>{p?.surface!=="popover"||Ae||(Ae=!0,Be())},Co=o=>{p?.surface!=="popover"||o.relatedTarget!==null||!Ae||(Ae=!1,Be())},Io=()=>{p?.surface!=="popover"||ke||(ke=!0,Be())},Uo=()=>{p?.surface!=="popover"||!ke||(ke=!1,Be())},F=(o,n=1024)=>{if(!o.trim()||o.length>n)throw new l("HOST_REJECTED",`Identity must contain 1 to ${n} characters.`)},gt=async o=>{o.kind!=="projects"&&F(o.projectId);let n=await M({...w,type:"workspace-read",id:m(f),payload:o});if(!n||!("kind"in n)||!("state"in n)||n.kind!==o.kind)throw new l("HOST_REJECTED","Host did not return workspace data.");return n},Tt=async(o,n)=>{o.kind!=="projects"&&F(o.projectId);let a=m(f);ie.set(a,n);try{await v({...w,type:"workspace-subscribe",id:m(f),payload:{subscriptionId:a,query:o}})}catch(c){throw ie.delete(a),B||P({...w,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:a}}),c}return()=>{!ie.delete(a)||B||P({...w,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:a}})}},Wr=async(o,n)=>{o.kind==="session"&&F(o.sessionId),o.kind==="project"&&F(o.projectId);let a=m(f);ae.set(a,n);try{await v({...w,type:"shells-subscribe",id:m(f),payload:{subscriptionId:a,scope:o}})}catch(c){throw ae.delete(a),B||P({...w,type:"shells-unsubscribe",id:m(f),payload:{subscriptionId:a}}),c}return()=>{!ae.delete(a)||B||P({...w,type:"shells-unsubscribe",id:m(f),payload:{subscriptionId:a}})}},Ve=async o=>{if("key"in o&&(o.key.length===0||o.key.length>128))throw new l("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(o.op==="set"&&!ce(o.value))throw new l("HOST_REJECTED","Storage values must be JSON.");if(o.op==="set"&&new TextEncoder().encode(JSON.stringify(o.value)).length>65536)throw new l("HOST_REJECTED","Storage value exceeds 64 KiB.");if(o.scope==="device"&&p?.features?.deviceStorage!==!0)throw new l("UNSUPPORTED","This host does not support device storage.");let n=await M({...w,type:"storage",id:m(f),payload:o});if(!n||!("storage"in n)||n.op!==o.op)throw new l("HOST_REJECTED","Host did not return storage data.");return n},Mo=(o,n)=>p?.features?.popovers!==!0&&!(p?.surface==="popover"&&p.popover?.id===o)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):v({...w,type:"popover-close",id:m(f),payload:n?{id:o,reason:n}:{id:o}}),Lo=(o,n)=>p?.features?.popovers!==!0&&!(p?.surface==="popover"&&p.popover?.id===o)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):v({...w,type:"popover-anchor",id:m(f),payload:{id:o,active:n}});return t.addEventListener("keydown",Ro,!0),t.addEventListener("pointerover",ze),t.addEventListener("pointermove",ze),t.addEventListener("pointerout",Co),t.addEventListener("focus",Io),t.addEventListener("blur",Uo),{onAction:o=>(ge=o,()=>{ge===o&&(ge=null)}),listProjects:async()=>{let o=await gt({kind:"projects"});if(o.kind!=="projects")throw new l("HOST_REJECTED","Expected projects.");return o},listWorktrees:async o=>{let n=await gt({kind:"worktrees",projectId:o});if(n.kind!=="worktrees")throw new l("HOST_REJECTED","Expected worktrees.");return n},listSessions:async o=>{let n=await gt({kind:"sessions",projectId:o});if(n.kind!=="sessions")throw new l("HOST_REJECTED","Expected sessions.");return n},onProjects:o=>Tt({kind:"projects"},n=>{n.kind==="projects"&&o(n)}),onWorktrees:(o,n)=>Tt({kind:"worktrees",projectId:o},a=>{a.kind==="worktrees"&&n(a)}),onSessions:(o,n)=>Tt({kind:"sessions",projectId:o},a=>{a.kind==="sessions"&&n(a)}),onRunningShells:(o,n)=>Wr(o,n),readShellOutput:async(o,n)=>{F(o,128);let a=n?.cursor;if(a!==void 0&&(!Number.isInteger(a)||a<0))throw new l("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let c=n?.tailBytes;if(c!==void 0&&(!Number.isInteger(c)||c<1||c>65536))throw new l("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let h=await M({...w,type:"shell-output",id:m(f),payload:{shellId:o,cursor:a,tailBytes:c}});if(!h||typeof h.output!="string"||!Number.isFinite(h.cursor))throw new l("HOST_REJECTED","Host did not return shell output.");return h},stopShell:async o=>{if(F(o,128),(await M({...w,type:"shell-stop",id:m(f),payload:{shellId:o}}))?.stopped!==!0)throw new l("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async o=>{F(o),await v({...w,type:"open-session",id:m(f),payload:{sessionId:o}})},storage:{get:async(o,n)=>{let a=ot(n),c={op:"get",key:o};a&&(c.scope=a);let _=await Ve(c);return _.op==="get"&&_.found?_.value:void 0},set:async(o,n,a)=>{let c=ot(a),_={op:"set",key:o,value:n};c&&(_.scope=c),await Ve(_)},delete:async(o,n)=>{let a=ot(n),c={op:"delete",key:o};a&&(c.scope=a),await Ve(c)},keys:async o=>{let n=ot(o),a={op:"keys"};n&&(a.scope=n);let c=await Ve(a);if(c.op!=="keys")throw new l("HOST_REJECTED","Expected storage keys.");return c.keys}},onReady:o=>(i.add(o),p&&o(p),()=>{i.delete(o)}),onDirectory:o=>(d.add(o),p&&o(p.directory),()=>{d.delete(o)}),onSession:o=>(g.add(o),p&&o(p.session),()=>{g.delete(o)}),onSessionLifecycle:o=>(x.add(o),z&&o(z),()=>{x.delete(o)}),onConnection:o=>(I.add(o),p&&o(p.connection),()=>{I.delete(o)}),onSettings:o=>(U.add(o),p&&o(p.settings),()=>{U.delete(o)}),onItem:o=>(X.add(o),p&&o(p.item),()=>{X.delete(o)}),onStatusControl:o=>(De.add(o),()=>{De.delete(o)}),onPopoverClosed:o=>($e.add(o),()=>{$e.delete(o)}),setStatusControls:o=>p?.features?.statusControls!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support status controls.")):Do(o)?v({...w,type:"status-controls",id:m(f),payload:{controls:o}}):Promise.reject(new l("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:o=>p?.features?.popovers!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):Ot(o)?v({...w,type:"popover-open",id:m(f),payload:o}):Promise.reject(new l("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:Mo,setPopoverAnchorActive:Lo,onResolve:o=>(Se=o,()=>{Se===o&&(Se=null)}),toast:o=>{let n=o.message.trim();return!n||n.length>Ke?Promise.reject(new l("HOST_REJECTED",`Toast message must contain 1 to ${Ke} characters.`)):o.copy&&o.copy!==!0&&(!o.copy.text.length||o.copy.text.length>We)?Promise.reject(new l("HOST_REJECTED",`Toast copy text must contain 1 to ${We} characters.`)):v({channel:E,v:1,type:"toast",id:m(f),payload:{...o,message:n}})},openUrl:o=>v({channel:E,v:1,type:"open-url",id:m(f),payload:{url:o}}),openCommit:o=>Ut(o)?v({channel:E,v:1,type:"open-commit",id:m(f),payload:{sha:o}}):Promise.reject(new l("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:o=>v({channel:E,v:1,type:"open-surface",id:m(f),payload:{surfaceId:o}}),writeClipboard:o=>v({channel:E,v:1,type:"clipboard-write",id:m(f),payload:{text:o}}),compose:o=>v({channel:E,v:1,type:"compose",id:m(f),payload:o}),attach:o=>v({channel:E,v:1,type:"attach",id:m(f),payload:le(o)}),startSession:async o=>{o.projectId!==void 0&&F(o.projectId);let n=o.worktree;n&&n!==!0&&(n.kind==="existing"?F(n.directory):(n.name!==void 0&&F(n.name,200),n.baseBranch!==void 0&&F(n.baseBranch,200)));let a=await M({channel:E,v:1,type:"start-session",id:m(f),payload:Gt(o)},e.requestTimeoutMs??18e4);if(!Ct(a))throw new l("HOST_REJECTED","Host did not return a session.");return a},prompt:o=>M({channel:E,v:1,type:"prompt",id:m(f),payload:Pt(o)}).then(n=>{if(!It(n))throw new l("HOST_REJECTED","Host did not return a prompt result.");return n}),sessionLink:o=>v({channel:E,v:1,type:"session-link",id:m(f),payload:le(o)}),close:()=>v({channel:E,v:1,type:"close",id:m(f)}),oauthStart:()=>v({channel:E,v:1,type:"oauth-start",id:m(f)}),oauthDisconnect:()=>v({channel:E,v:1,type:"oauth-disconnect",id:m(f)}),request:o=>(Qe(o.path)?M({channel:E,v:1,type:"request",id:m(f),payload:o}):dr()).then(n=>{if(!et(n))throw new l("HOST_REJECTED","Host request result was empty.");return n}),serviceRequest:o=>(Qe(o.path)?M({channel:E,v:1,type:"service-request",id:m(f),payload:o}):dr()).then(n=>{if(!et(n))throw new l("HOST_REJECTED","Host service request result was empty.");return n}),serviceStatus:()=>M({channel:E,v:1,type:"service-status",id:m(f)}).then(o=>{if(!$t(o))throw new l("HOST_REJECTED","Host did not return service status.");return o}),readFile:o=>(de(o)?M({channel:E,v:1,type:"file-read",id:m(f),payload:{path:o}}):tt()).then(n=>{if(!Ft(n))throw new l("HOST_REJECTED","Host did not return file content.");return n}),writeFile:(o,n)=>de(o)?n.length>Ye?Promise.reject(new l("FILE_TOO_LARGE",`Content is over ${Ye} characters.`)):M({channel:E,v:1,type:"file-write",id:m(f),payload:{path:o,content:n}}).then(a=>{if(!Xt(a))throw new l("HOST_REJECTED","Host did not confirm the write.");return a}):tt(),listDir:o=>(de(o)?M({channel:E,v:1,type:"file-list",id:m(f),payload:{path:o}}):tt()).then(n=>{if(!Bt(n))throw new l("HOST_REJECTED","Host did not return directory entries.");return n}),stat:o=>(de(o)?M({channel:E,v:1,type:"file-stat",id:m(f),payload:{path:o}}):tt()).then(n=>{if(!zt(n))throw new l("HOST_REJECTED","Host did not return file status.");return n}),generate:o=>{let n=o.prompt.trim(),a=o.system?.trim();if(n.length===0||n.length>qe)return Promise.reject(new l("HOST_REJECTED",`Prompt must be 1 to ${qe} characters.`));if(a!==void 0&&(a.length===0||a.length>Ze))return Promise.reject(new l("HOST_REJECTED",`System prompt must be 1 to ${Ze} characters.`));let c=o.maxOutputTokens===void 0?void 0:Math.min(Lt,Math.max(1,Math.floor(o.maxOutputTokens)));if(c!==void 0&&!Number.isFinite(c))return Promise.reject(new l("HOST_REJECTED","maxOutputTokens must be a number."));let _={prompt:n};return a!==void 0&&(_.system=a),c!==void 0&&(_.maxOutputTokens=c),M({channel:E,v:1,type:"generate",id:m(f),payload:_},e.requestTimeoutMs??Nt).then(h=>{if(!Vt(h))throw new l("HOST_REJECTED","Host did not return generated text.");return h})},onLateGenerateResult:o=>{ne.add(o);for(let n of ht.splice(0))A([o],n);return ko(),()=>{ne.delete(o)}},setBadge:o=>v({channel:E,v:1,type:"badge",id:m(f),payload:{count:Ht(o)}}),setHeight:o=>v({channel:E,v:1,type:"resize",id:m(f),payload:{height:Dt(o)}}),onFileOpen:o=>(Fe.add(o),_t||(_t=!0,t.addEventListener("keydown",Oo,!0)),ye&&o(ye),()=>{Fe.delete(o)}),onFileSnapshot:o=>(Te=o,()=>{Te===o&&(Te=null)}),onFileSaved:o=>(Xe.add(o),()=>{Xe.delete(o)}),reportFileChange:o=>St({...w,type:"file-change",payload:{dirty:o.dirty,edited:o.edited}}),requestFileSave:wo,reportFileUnsupported:()=>St({...w,type:"file-unsupported"}),dispose:()=>{for(let o of ie.keys())P({...w,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:o}});ie.clear();for(let o of ae.keys())P({...w,type:"shells-unsubscribe",id:m(f),payload:{subscriptionId:o}});ae.clear(),B=!0,Se=null,ge=null,Te=null,Fe.clear(),Xe.clear(),_t&&t.removeEventListener("keydown",Oo,!0),t.removeEventListener("message",vo),t.removeEventListener("keydown",Ro,!0),t.removeEventListener("pointerover",ze),t.removeEventListener("pointermove",ze),t.removeEventListener("pointerout",Co),t.removeEventListener("focus",Io),t.removeEventListener("blur",Uo);for(let o of se.values())clearTimeout(o.timer),o.reject(new l("HOST_UNAVAILABLE","Host client was disposed."));se.clear(),i.clear(),d.clear(),g.clear(),x.clear(),I.clear(),U.clear(),X.clear(),De.clear(),$e.clear(),ne.clear(),ht.length=0}}};var fr=["browser.open","browser.snapshot","browser.click","browser.type","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var as=new Set(fr);var mr=["none","agent","user"];var ls=new Set(mr);var nn=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],sn=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Er=(e,t)=>{t.style.colorScheme=e.mode;for(let[r,s]of nn)t.style.setProperty(r,e.tokens[s]);for(let[r,s,i]of sn){let d=e.tokens[i]??"";t.style.setProperty(r,d),t.style.setProperty(s,d)}t.style.setProperty("font-family",e.tokens.font),t.style.setProperty("font-size","0.875rem"),t.style.setProperty("line-height","1.45"),t.style.setProperty("color",e.tokens.foreground)},Zt=(e,t)=>{Er(e.theme,t),t.dataset&&(t.dataset.ocSurface=e.surface,t.dataset.ocTheme=e.theme.mode)};var an={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},y=(e,t)=>`var(--${e}, var(--oc-${an[e]}, ${t}))`,j=y("surface-background","transparent"),nt=y("surface-elevated","transparent"),pe=y("surface-elevated-foreground","inherit"),$=y("surface-foreground","inherit"),T=y("surface-muted-foreground","gray"),cn=y("surface-muted","transparent"),q=y("interactive-border","currentColor"),L=y("interactive-hover","transparent"),ee=y("interactive-active","transparent"),Qt=y("interactive-selection","transparent"),eo=y("interactive-selection-foreground","inherit"),V=y("primary","currentColor"),to=y("primary-text","inherit"),oo=y("error-text","inherit"),ln=y("font-sans","inherit"),ro=y("font-mono","monospace"),Sr=y("radius","9px"),no=`calc(${Sr} - 2px)`,br=`calc(${Sr} - 4px)`,k=(e,t,r="transparent")=>`color-mix(in srgb, ${e} ${t}%, ${r})`,xr=`background-image: linear-gradient(${L}, ${L});`,so=e=>`box-shadow: inset 0 0 0 1px ${e}, var(--oc-sdk-field-lift);`,io="box-shadow: inset 0 0 0 1px var(--oc-sdk-edge), var(--oc-sdk-raised-lift);",hr="box-shadow: var(--oc-sdk-lit);",_r=`inset 0 1px 0 0 ${k($,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2)`,dn=`
:root {
  --oc-sdk-edge: ${k($,10)};
  --oc-sdk-field-bg: ${nt};
  --oc-sdk-raised-bg: ${j};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 2px 0 rgb(0 0 0 / 0.06);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.45), 0 1px 2px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.8), inset 0 0 0 1px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.1), 0 1px 2px -0.5px rgb(0 0 0 / 0.08), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.08);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${k($,6)};
  --oc-sdk-field-bg: ${k(j,50,nt)};
  --oc-sdk-raised-bg: ${nt};
  --oc-sdk-field-lift: ${_r};
  --oc-sdk-raised-lift: ${_r};
  --oc-sdk-lit: inset 0 1px 0 0 ${k($,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.06), inset 0 0 0 1px rgb(255 255 255 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.36), 0 1px 1px -0.5px rgb(0 0 0 / 0.22), 0 3px 3px -1.5px rgb(0 0 0 / 0.2), 0 6px 6px -3px rgb(0 0 0 / 0.16);
}`,rt=e=>{let t=y(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${t}; --oc-sdk-tone-text: ${y(`${e}-text`,"inherit")}; }`},pn=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 32px; padding: 0 12px; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: 6px; height: 28px; padding: 0 10px; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: 4px; height: 24px; padding: 0 8px; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: 14px; height: 14px; }

.oc-sdk-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: 32px; padding: 0 10px; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: 8px 10px; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: 34px; padding-right: 34px; }
.oc-sdk-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: 24px; height: 24px; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: 2px; min-width: 160px; max-width: calc(100vw - 16px); max-height: min(320px, calc(100vh - 16px)); overflow: auto; padding: 4px; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: 2px 2px 4px; }
.oc-sdk-popup-search .oc-sdk-input { height: 28px; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: 14px; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: 8px; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-top: 3px; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: 36px; height: 20px; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: 2px; padding: 2px; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: 1px 6px; font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: 16px 8px; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 40px 16px; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: 12px; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: 16px; height: 16px; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: 12px; height: 12px; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: 8px; width: 100%; margin: 8px 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: 4px 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: 6px; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: 8px 0; }
`,gr=`${dn}
.oc-sdk { color: ${$}; font-family: ${ln}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${xr} }
.oc-sdk-mono { font-family: ${ro}; }
.oc-sdk-muted { color: ${T}; }
${rt("success")}${rt("warning")}${rt("error")}${rt("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${V}; --oc-sdk-tone-text: ${to}; }

.oc-sdk-btn { border-radius: ${no}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${br}; }
.oc-sdk-btn[data-variant="default"] { color: ${to}; background: ${k(V,10,j)}; border-color: ${k(V,12)}; ${hr} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${k(V,16,j)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${k(V,22,j)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${cn}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${ee}, ${ee}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${pe}; border-color: transparent; ${io} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${ee}, ${ee}); box-shadow: inset 0 0 0 1px var(--oc-sdk-edge); }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${L}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${ee}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${y("status-error","red")}; color: ${oo}; background: ${k("var(--oc-sdk-tone)",7,j)}; border-color: ${k("var(--oc-sdk-tone)",12)}; ${hr} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${k("var(--oc-sdk-tone)",9,j)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${k("var(--oc-sdk-tone)",11,j)}; box-shadow: none; }

.oc-sdk-field-note { color: ${T}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${oo}; }
.oc-sdk-input { border-radius: ${no}; background: var(--oc-sdk-field-bg); color: ${pe}; ${so("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${T}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${so(k($,26))} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${so(y("status-error","red"))} }
.oc-sdk-input[data-mono="true"] { font-family: ${ro}; }

.oc-sdk-search-icon { color: ${T}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${V}; }
.oc-sdk-search-clear { border-radius: ${br}; color: ${T}; }
.oc-sdk-search-clear:hover { background: ${L}; color: ${$}; }

.oc-sdk-trigger { border-color: transparent; border-radius: ${no}; background: var(--oc-sdk-raised-bg); color: ${pe}; ${io} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${ee}, ${ee}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${T}; }
.oc-sdk-trigger-chevron { color: ${T}; }
/* The app's dropdown light: lit top, hairline rings and a layered shadow, no border. */
.oc-sdk-popup { --surface-foreground: ${pe}; border-color: transparent; border-radius: 12px; background: ${nt}; color: ${pe}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${L}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${Qt}; color: ${eo}; }
.oc-sdk-option-check { color: ${$}; }
.oc-sdk-option[data-destructive="true"] { color: ${oo}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${k(y("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${T}; }
.oc-sdk-popup-empty { color: ${T}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${q}; border-radius: 4px; color: ${$}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${k($,60,q)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${q}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${j}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${V}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${xr} }
.oc-sdk-check-desc { color: ${T}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${k($,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${T}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${$}; }
.oc-sdk-tab[aria-selected="true"] { color: ${eo}; background: ${Qt}; border-color: ${q}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${pe}; background: var(--oc-sdk-raised-bg); border-color: transparent; ${io} }
.oc-sdk-tab-count { color: ${T}; }

.oc-sdk-badge { border-radius: 9999px; background: ${L}; color: ${T}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${k("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${L}; }
.oc-sdk-row[aria-selected="true"] { background: ${Qt}; color: ${eo}; }
.oc-sdk-row-lead { font-family: ${ro}; color: ${T}; }
.oc-sdk-row-sub { color: ${T}; }
.oc-sdk-row-meta { color: ${T}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${T}; }

.oc-sdk-empty-body { color: ${T}; }

.oc-sdk-spinner { color: ${T}; }
.oc-sdk-spinner-ring { border-color: ${q}; border-top-color: ${V}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${k("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${T}; }

.oc-sdk-separator { color: ${T}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${k(q,40)}; }

.oc-sdk-progress-label { color: ${T}; }
.oc-sdk-progress-track { border-radius: 9999px; background: ${q}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${V}); }

.oc-sdk-text a { color: ${to}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${k(q,60)}; }
`,R=`
${yt}
${pn}
${gr}`;var Tr="oc-sdk-ui-style";var C=e=>{let t=document.getElementById(Tr);if(t instanceof HTMLStyleElement){t.textContent!==e&&(t.textContent=e);return}At(document);let r=document.createElement("style");r.id=Tr,r.textContent=e,document.head.appendChild(r)},S=(e,t)=>{let r=document.createElement(e);return t&&(r.className=t),r},Z=e=>{let t=S("button",e);return t.type="button",t},N=(e,t)=>{let r=t??"";e.textContent!==r&&(e.textContent=r)},ue=(e,t,r)=>{r==null||r===""?e.removeAttribute(t):e.getAttribute(t)!==r&&e.setAttribute(t,r)};var un=()=>{let e=document.createElement("span");return e.className="oc-sdk-spinner-ring",e.setAttribute("aria-hidden","true"),e},H=(e,t)=>{C(R);let r=t,s=Z("oc-sdk oc-sdk-btn"),i=un(),d=document.createElement("span");s.append(d),e.append(s);let g=()=>{s.dataset.variant=r.variant??"default",s.dataset.size=r.size??"default",s.disabled=!!r.disabled||!!r.loading,s.dataset.loading=r.loading?"true":"false",s.setAttribute("aria-busy",r.loading?"true":"false"),r.loading&&i.parentNode!==s?s.prepend(i):!r.loading&&i.parentNode===s&&i.remove(),N(d,r.label)},x=()=>{r.disabled||r.loading||r.onClick()};return s.addEventListener("click",x),g(),{update:I=>{r={...r,...I},g()},dispose:()=>{s.removeEventListener("click",x),s.remove()}}};var we=(e,t)=>{C(R);let r=t,s=S("label","oc-sdk oc-sdk-field"),i=S("span","oc-sdk-field-label"),d=r.multiline?S("textarea","oc-sdk-input"):S("input","oc-sdk-input"),g=S("span","oc-sdk-field-note");s.append(i,d,g),e.append(s);let x=()=>{N(i,r.label),i.hidden=!r.label,d instanceof HTMLInputElement?d.type=r.password?"password":"text":d.rows=r.rows??3,d.value!==r.value&&(d.value=r.value),d.disabled=!!r.disabled,ue(d,"placeholder",r.placeholder),d.dataset.mono=r.mono?"true":"false";let U=!!r.error;s.dataset.invalid=U?"true":"false",d.setAttribute("aria-invalid",U?"true":"false");let X=r.error??r.helper??"";N(g,X),g.hidden=X===""},I=()=>{r.onChange(d.value)};return d.addEventListener("input",I),x(),{update:U=>{r={...r,...U},x()},dispose:()=>{d.removeEventListener("input",I),s.remove()}}};var co=(e,t={})=>{C(R);let r=t,s=S("span","oc-sdk oc-sdk-spinner");s.setAttribute("role","status");let i=S("span","oc-sdk-spinner-ring");i.setAttribute("aria-hidden","true");let d=S("span");s.append(i,d),e.append(s);let g=()=>{s.dataset.size=r.size??"default",N(d,r.label),d.hidden=!r.label,s.setAttribute("aria-label",r.label??"Loading")};return g(),{update:x=>{r={...r,...x},g()},dispose:()=>{s.remove()}}};var ct=e=>{let t=e.trim();if(!t)throw new Error("\u8BF7\u586B\u5199\u670D\u52A1\u5730\u5740");let r;try{r=new URL(t.includes("://")?t:`https://${t}`)}catch{throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u670D\u52A1\u5730\u5740\uFF0C\u4F8B\u5982 https://relay.example.com")}if(!["https:","http:"].includes(r.protocol)||!r.hostname)throw new Error("\u670D\u52A1\u5730\u5740\u4EC5\u652F\u6301 HTTP \u6216 HTTPS");if(r.username||r.password||r.search||r.hash)throw new Error("\u670D\u52A1\u5730\u5740\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u5BC6\u94A5\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u951A\u70B9");let s=r.pathname.replace(/\/+$/,"").replace(/\/v1$/i,"");return`${r.origin}${s}`},yr=(e,t)=>new URL(ct(e)).origin!==new URL(ct(t)).origin;var K=e=>typeof e=="number"&&Number.isFinite(e)?e:null,xn=e=>{if(!e||typeof e!="object")return null;let t=e,r=K(t.usedPercent);return typeof t.key!="string"||typeof t.label!="string"||r===null?null:{key:t.key,label:t.label,usedPercent:r,remainingPercent:K(t.remainingPercent)??Math.max(0,100-r),resetAt:K(t.resetAt),resetAtText:typeof t.resetAtText=="string"?t.resetAtText:null,detail:typeof t.detail=="string"?t.detail:null}},Ar=e=>{if(!e||typeof e!="object")return null;let t=e;if(typeof t.id!="string"||typeof t.name!="string")return null;let r=t.balance&&typeof t.balance=="object"?t.balance:null;return{id:t.id,name:t.name,ok:t.ok!==!1,plan:typeof t.plan=="string"?t.plan:null,balance:r&&typeof r.label=="string"?{value:K(r.value),label:r.label,unit:typeof r.unit=="string"?r.unit:""}:null,detail:typeof t.detail=="string"?t.detail:null,windows:Array.isArray(t.windows)?t.windows.map(xn).filter(s=>s!==null):[],updatedAt:K(t.updatedAt),stale:t.stale===!0,error:typeof t.error=="string"?t.error:void 0}},kr=e=>{if(!e||typeof e!="object")return null;let t=e;return typeof t.id!="string"||typeof t.name!="string"||typeof t.baseUrl!="string"?null:{id:t.id,name:t.name,baseUrl:t.baseUrl,hasKey:t.hasKey===!0}};var lt=(e,t="zh-CN",r=!1)=>new Intl.DateTimeFormat(t,{...r?{month:"numeric",day:"numeric"}:{},hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e),vr=(e,t="zh-CN",r=Date.now())=>{if(!e||!Number.isFinite(e))return null;if(e<=r)return"\u91CD\u7F6E\u65F6\u95F4\u5DF2\u5230\uFF0C\u8BF7\u5237\u65B0";let s=new Date(e),i=new Date(r),d=new Date(r);d.setDate(d.getDate()+1);let g=s.toDateString()===i.toDateString()?"\u4ECA\u5929 ":s.toDateString()===d.toDateString()?"\u660E\u5929 ":"";return`${g}${lt(e,t,!g)} \u91CD\u7F6E`},lo=(e,t,r="zh-CN")=>{if(e===null||!Number.isFinite(e))return"\u2014";let s=t==="USD"||t==="$"?"USD":t==="CNY"||t==="\xA5"?"CNY":null,i=new Intl.NumberFormat(r,{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:1}).format(e);return`${s==="USD"?"$":s==="CNY"?"\xA5":""}${i}${s?"":` ${t}`}`};var wr=`:root {
  --bx-bg: var(--surface-background, var(--oc-bg, transparent));
  --bx-border: var(--oc-border);
  --ext-bg: var(--bx-bg);
}
.bx { height: 100%; display: flex; flex-direction: column; color: var(--oc-fg); font-size: 13px; line-height: 1.5; }
.bx-top { flex: none; padding: 12px 16px 8px; border-bottom: 1px solid var(--bx-border); }
.bx-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 36px; }
.bx-meta { min-width: 0; display: flex; flex-wrap: wrap; column-gap: 8px; align-items: baseline; }
.bx-count { font-weight: 500; white-space: nowrap; }
.bx-time { color: var(--oc-muted); font-size: 11px; }
.bx-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.bx-tabs { margin-bottom: 4px; }
.bx-tabs .oc-sdk-tabs { width: 100%; }
.bx-view { min-height: 0; flex: 1; overflow: auto; padding: 0 16px 20px; scrollbar-gutter: stable; }
.bx-provider { padding: 18px 0; }
.bx-provider + .bx-provider { border-top: 1px solid var(--bx-border); }
.bx-provider-head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, auto); align-items: start; gap: 16px; }
.bx-name { margin: 0; font-size: 14px; font-weight: 600; overflow-wrap: anywhere; line-height: 1.5; }
.bx-plan { margin-top: 2px; color: var(--oc-muted); font-size: 11px; overflow-wrap: anywhere; }
.bx-balance { text-align: right; min-width: 0; }
.bx-amount { display: block; font-size: 18px; font-weight: 600; line-height: 1.25; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.bx-amount-label { display: block; margin-top: 3px; color: var(--oc-muted); font-size: 11px; }
.bx-detail { margin: 8px 0 0; color: var(--oc-muted); font-size: 12px; overflow-wrap: anywhere; }
.bx-windows { margin-top: 14px; display: grid; gap: 12px; }
.bx-window-head { display: flex; gap: 8px; align-items: baseline; justify-content: space-between; }
.bx-window-label { font-size: 12px; }
.bx-percent { flex: none; font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.bx-track { height: 4px; margin-top: 6px; border-radius: 3px; overflow: hidden; background: color-mix(in srgb, var(--oc-fg) 9%, var(--bx-bg)); }
.bx-fill { height: 100%; border-radius: inherit; background: var(--oc-primary); }
.bx-window[data-tone="warning"] .bx-fill { background: var(--oc-warning); }
.bx-window[data-tone="error"] .bx-fill { background: var(--oc-error); }
.bx-window[data-tone="warning"] .bx-percent { color: var(--oc-warning-text); }
.bx-window[data-tone="error"] .bx-percent { color: var(--oc-error-text); }
.bx-window-foot { display: flex; justify-content: space-between; flex-wrap: wrap; column-gap: 12px; margin-top: 4px; color: var(--oc-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.bx-reset { margin-left: auto; }
.bx-notice { margin-top: 12px; padding: 9px 10px; border-radius: var(--oc-radius, 6px); background: color-mix(in srgb, var(--oc-warning) 8%, var(--bx-bg)); color: var(--oc-warning-text); font-size: 12px; overflow-wrap: anywhere; }
.bx-notice[data-tone="error"] { background: color-mix(in srgb, var(--oc-error) 7%, var(--bx-bg)); color: var(--oc-error-text); }
.bx-notice[data-tone="success"] { background: color-mix(in srgb, var(--oc-success) 7%, var(--bx-bg)); color: var(--oc-success-text); }
.bx-notice p { margin: 2px 0 0; }
.bx-notice .bx-actions { margin-top: 8px; }
.bx-empty { padding: 32px 4px; text-align: left; }
.bx-empty h2 { font-size: 14px; margin: 0 0 6px; font-weight: 600; }
.bx-empty p { color: var(--oc-muted); margin: 0 0 16px; max-width: 36em; font-size: 12px; }
.bx-loading { padding: 24px 0; display: flex; align-items: center; gap: 8px; color: var(--oc-muted); }
.bx-footer { margin: 2px 0 8px; color: var(--oc-muted); font-size: 11px; line-height: 1.6; }
.bx-management-head { padding: 16px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.bx-management-head p { margin: 0; color: var(--oc-muted); font-size: 12px; }
.bx-relay { padding: 14px 0; border-bottom: 1px solid var(--bx-border); }
.bx-relay-line { display: flex; align-items: center; gap: 12px; }
.bx-relay-info { min-width: 0; flex: 1; }
.bx-relay-name { margin: 0; font-size: 13px; font-weight: 500; overflow-wrap: anywhere; }
.bx-relay-url { margin: 3px 0 0; font-size: 11px; color: var(--oc-muted); overflow-wrap: anywhere; }
.bx-relay-actions { flex: none; display: flex; gap: 2px; }
.bx-editor { padding-top: 16px; max-width: 560px; }
.bx-editor-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.bx-editor-title { font-size: 14px; font-weight: 600; margin: 0; }
.bx-editor-intro { color: var(--oc-muted); font-size: 12px; margin: 0 0 22px; }
.bx-form { display: grid; gap: 18px; }
.bx-field .oc-sdk-field-label { font-size: 12px; margin-bottom: 3px; }
.bx-field .oc-sdk-input { min-height: 38px; font-size: 13px; }
.bx-field .oc-sdk-field-note { font-size: 11px; margin-top: 3px; overflow-wrap: anywhere; }
.bx-key-actions { display: flex; justify-content: flex-end; margin-top: 2px; }
.bx-form-actions { display: flex; justify-content: flex-end; align-items: center; flex-wrap: wrap; gap: 8px; padding-top: 4px; }
.bx-form-actions .oc-sdk-btn { min-width: 84px; }
.bx-sr { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
html[data-oc-surface="status"] { --bx-bg: color-mix(in srgb, var(--surface-muted, transparent) 40%, var(--surface-background, transparent)); height: auto; }
html[data-oc-surface="status"] body { overflow: auto; height: auto; }
html[data-oc-surface="status"] #root, html[data-oc-surface="status"] .bx { height: auto; }
html[data-oc-surface="status"] .bx-top { padding: 0 2px 2px; border: 0; }
html[data-oc-surface="status"] .bx-view { padding: 0; overflow: visible; flex: none; }
html[data-oc-surface="status"] .bx-status-provider { padding: 0; }
html[data-oc-surface="status"] .bx-status-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 28px; padding: 0 4px; border-radius: 6px; font-size: 13px; line-height: 1.45; }
html[data-oc-surface="status"] .bx-status-provider-head { color: var(--oc-fg); font-weight: 600; }
html[data-oc-surface="status"] .bx-status-name-wrap { display: flex; min-width: 0; align-items: center; gap: 8px; }
html[data-oc-surface="status"] .bx-status-provider-icon { width: 14px; height: 14px; flex: none; color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-status-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-label-wrap { display: flex; min-width: 0; align-items: baseline; gap: 6px; overflow: hidden; }
html[data-oc-surface="status"] .bx-status-label { color: var(--oc-muted); white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-reset { color: var(--oc-muted); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-oc-surface="status"] .bx-status-value { flex: none; color: var(--oc-muted); font-size: 13px; font-variant-numeric: tabular-nums; white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-value[data-tone="warning"] { color: var(--oc-warning); }
html[data-oc-surface="status"] .bx-status-value[data-tone="error"] { color: var(--oc-error); }
html[data-oc-surface="status"] .bx-status-value[data-muted="true"] { color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-status-error { color: var(--oc-muted); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-oc-surface="status"] .bx-status-muted { color: var(--oc-muted); font-size: 13px; }
html[data-oc-surface="status"] .bx-notice { margin: 2px 0 4px; padding: 0 4px; background: transparent; color: var(--oc-muted); font-size: 13px; }
html[data-oc-surface="status"] .bx-notice[data-tone="error"] { background: transparent; color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-notice[data-tone="success"] { background: transparent; color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-loading { padding: 8px 4px; font-size: 13px; }
html[data-oc-surface="status"] .bx-empty { padding: 8px 4px; }
html[data-oc-surface="status"] .bx-empty h2 { margin-bottom: 3px; font-size: 13px; font-weight: 600; }
html[data-oc-surface="status"] .bx-empty p { margin-bottom: 0; font-size: 13px; }
@media (max-width: 320px) {
  .bx-top { padding-left: 12px; padding-right: 12px; }
  .bx-view { padding-left: 12px; padding-right: 12px; }
  .bx-provider-head { gap: 10px; }
  .bx-amount { font-size: 16px; }
  .bx-relay-line { flex-wrap: wrap; }
  .bx-relay-actions { margin-left: auto; }
}
@media (forced-colors: active) {
  .bx-track { border: 1px solid CanvasText; }
  .bx-fill { background: Highlight; }
}
`;var Or='<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Command Code</title><path d="M8 2.4C5.7 2.45 4.35 2.75 3.45 3.7C2.55 4.65 2.3 6.1 2.25 8.35C2.2 10.15 2.2 13.85 2.25 15.65C2.3 17.9 2.55 19.35 3.45 20.3C4.35 21.25 5.7 21.55 8 21.6C9.9 21.65 14.1 21.65 16 21.6C18.3 21.55 19.65 21.25 20.55 20.3C21.45 19.35 21.7 17.9 21.75 15.65C21.8 13.85 21.8 10.15 21.75 8.35C21.7 6.1 21.45 4.65 20.55 3.7C19.65 2.75 18.3 2.45 16 2.4C14.1 2.35 9.9 2.35 8 2.4Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 8H14V6.5C14 4.567 15.567 3 17.5 3C19.433 3 21 4.567 21 6.5C21 8.433 19.433 10 17.5 10H16V14H17.5C19.433 14 21 15.567 21 17.5C21 19.433 19.433 21 17.5 21C15.567 21 14 19.433 14 17.5V16H10V17.5C10 19.433 8.433 21 6.5 21C4.567 21 3 19.433 3 17.5C3 15.567 4.567 14 6.5 14H8V10H6.5C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5V8ZM8 8V6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8H8ZM8 16H6.5C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19C7.32843 19 8 18.3284 8 17.5V16ZM16 8H17.5C18.3284 8 19 7.32843 19 6.5C19 5.67157 18.3284 5 17.5 5C16.6716 5 16 5.67157 16 6.5V8ZM16 16V17.5C16 18.3284 16.6716 19 17.5 19C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16H16ZM10 10V14H14V10H10Z" fill="currentColor" transform="translate(4.56 4.56) scale(.62)"/></svg>',Rr='<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.272 0 0 6.272 0 14C0 21.728 6.272 28 14 28C21.728 28 28 21.728 28 14C28 6.272 21.728 0 14 0ZM10.22 22.876H5.11V17.766H10.22V22.876ZM16.548 22.876H11.438V17.766H16.548V22.876ZM16.548 16.562H11.438V11.438H16.548V16.562ZM16.548 10.234H11.438V5.124H16.548V10.234ZM22.876 10.234H17.766V5.11H22.876V10.234Z" fill="currentColor"/></svg>';var Cr=`/* Shared foundation for OpenChamber extensions. Colors and fonts belong to the host. */
:root {
  --ext-bg: var(--surface-background, var(--oc-bg, transparent));
  --ext-space-1: 4px;
  --ext-space-2: 8px;
  --ext-space-3: 12px;
  --ext-space-4: 16px;
  --ext-space-6: 24px;
  --ext-text-small: 11px;
  --ext-text-body: 13px;
  --ext-text-title: 14px;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; background: var(--ext-bg); }
body { overflow: hidden; }
#root { height: 100%; }
[hidden] { display: none !important; }
button, input, textarea, select { font: inherit; }
.ext { color: var(--oc-fg); font-family: var(--oc-font); font-size: var(--ext-text-body); line-height: 1.5; }
.ext button:focus-visible, .ext [tabindex]:focus-visible { outline: 2px solid var(--oc-focus); outline-offset: 2px; }
.ext-actions { display: flex; align-items: center; flex-wrap: wrap; gap: var(--ext-space-2); }
.ext-muted { color: var(--oc-muted); font-size: var(--ext-text-small); }
.ext-notice { margin: 0; padding: 10px 12px; border-radius: var(--oc-radius, 6px); font-size: 12px; overflow-wrap: anywhere; background: color-mix(in srgb, var(--oc-info) 7%, var(--ext-bg)); color: var(--oc-info-text); }
.ext-notice[data-tone="success"] { background: color-mix(in srgb, var(--oc-success) 7%, var(--ext-bg)); color: var(--oc-success-text); }
.ext-notice[data-tone="warning"] { background: color-mix(in srgb, var(--oc-warning) 8%, var(--ext-bg)); color: var(--oc-warning-text); }
.ext-notice[data-tone="error"] { background: color-mix(in srgb, var(--oc-error) 7%, var(--ext-bg)); color: var(--oc-error-text); }
.ext .oc-sdk-btn[data-size="sm"], .ext .oc-sdk-tab { font-size: 12px; }
.ext .oc-sdk-field-note { font-size: var(--ext-text-small); }
@media (prefers-reduced-motion: reduce) {
  .ext *, .ext *::before, .ext *::after { animation: none !important; transition: none !important; }
}
`;async function Ir(e,t){try{await e.openSurface(`plugin:${t.id}`)}catch{throw new Error(`\u672A\u80FD\u6253\u5F00\u300C${t.name}\u300D\u3002\u8BF7\u91CD\u65B0\u52A0\u8F7D\u754C\u9762\u540E\u91CD\u8BD5\u3002`)}}var _e=qt({requestTimeoutMs:3e4}),Mr=document.querySelector("#root");if(!Mr)throw new Error("Missing #root");var Lr=document.createElement("style");Lr.textContent=Cr+wr;document.head.append(Lr);var u=(e,t="",r)=>{let s=document.createElement(e);return s.className=t,r!==void 0&&(s.textContent=r),s},fe=[],Sn=[],me=null,J="zh-CN",te=!1,W=!1,Nr=!1,be=null,Gr=null,dt=0,gn=0,Pr="overview";var G=null,Tn=null,D=null,Ue="",pt="",he="",Oe=!1,Ce=null,uo=null,ut=!1,po="",Hr=()=>{Ce=null,To(!0)},Dr=()=>{Ir(_e,{id:"balance",name:"\u4F59\u989D"}).catch(e=>{uo=e.message,Y()})};_e.onStatusControl(e=>{e.id==="refresh"?Hr():e.id==="manage"&&Dr()});var mt=e=>e instanceof l?e.code==="NO_SERVICE"?"\u8BF7\u5728\u8BBE\u7F6E \u2192 \u6269\u5C55\u4E2D\u5141\u8BB8\u201C\u4F59\u989D\u201D\u8FD0\u884C\u672C\u5730\u670D\u52A1\u3002":e.code==="SERVICE_FAILED"?"\u672C\u5730\u670D\u52A1\u5C1A\u672A\u5C31\u7EEA\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u6269\u5C55\u540E\u91CD\u8BD5\u3002":e.code==="HOST_TIMEOUT"?"\u67E5\u8BE2\u8017\u65F6\u8F83\u957F\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e.code==="DISABLED"?"\u4F59\u989D\u6269\u5C55\u5DF2\u505C\u7528\uFF0C\u8BF7\u5728\u6269\u5C55\u8BBE\u7F6E\u4E2D\u542F\u7528\u3002":"\u6682\u65F6\u65E0\u6CD5\u8FDE\u63A5\u672C\u5730\u670D\u52A1\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e instanceof Error?e.message:"\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",mo=async(e,t,r={})=>{let s=await _e.serviceRequest({method:e,path:t,...r.query?{query:r.query}:{},...r.body===void 0?{}:{body:JSON.stringify(r.body)}}),i;try{i=JSON.parse(s.body)}catch{throw new Error("\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u6570\u636E\uFF0C\u8BF7\u91CD\u8BD5\u3002")}if(!i||typeof i!="object"||Array.isArray(i))throw new Error("\u670D\u52A1\u8FD4\u56DE\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E\u3002");if(s.status>=400)throw new Error(typeof i.error=="string"?i.error:`\u8BF7\u6C42\u5931\u8D25\uFF08${s.status}\uFF09`);return i},xe=(e,t="warning")=>{let r=u("div","bx-notice",e);return r.dataset.tone=t,r.setAttribute("role",t==="error"?"alert":"status"),r},oe=u("main","ext bx");oe.setAttribute("aria-label","\u4F59\u989D\u4E0E\u989D\u5EA6");var Me=u("header","bx-top"),bd=u("div","bx-tabs"),$r=u("div","bx-toolbar"),Fr=u("div","bx-meta"),Xr=u("span","bx-count"),ft=u("span","bx-time");ft.setAttribute("role","status");Fr.append(Xr,ft);var Eo=u("div","bx-actions"),yn=H(Eo,{label:"\u5237\u65B0",variant:"ghost",size:"sm",onClick:Hr});H(Eo,{label:"\u7BA1\u7406",variant:"ghost",size:"sm",onClick:Dr});$r.append(Fr,Eo);Me.append($r);var Pe=u("section","bx-view");Pe.id="balance-overview";Pe.setAttribute("aria-label","\u4F59\u989D\u603B\u89C8");var Re=u("div"),Ee=u("div"),Br=u("p","bx-footer","\u4F59\u989D\u6309\u670D\u52A1\u5206\u522B\u663E\u793A\u3002\u70B9\u51FB\u5237\u65B0\uFF0C\u83B7\u53D6\u6700\u65B0\u6570\u636E\u3002");Pe.append(Re,Ee,Br);var He=u("section","bx-view");He.id="balance-relays";He.setAttribute("aria-label","\u4E2D\u8F6C\u7AD9\u7BA1\u7406");var zr=u("div"),Et=u("div","bx-management-head");Et.append(u("p","","\u7BA1\u7406\u7528\u4E8E\u67E5\u8BE2\u4F59\u989D\u7684\u8FDE\u63A5"));var An=H(Et,{label:"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9",size:"sm",onClick:()=>In("new")}),kn=u("div");zr.append(Et,kn);var Vr=u("div","bx-editor"),bo=u("div","bx-editor-head"),vn=u("h2","bx-editor-title"),wn=H(bo,{label:"\u53D6\u6D88",variant:"ghost",size:"sm",onClick:()=>Un()});bo.prepend(vn);var On=u("p","bx-editor-intro","\u586B\u5199\u8FDE\u63A5\u4FE1\u606F\uFF0C\u53EF\u5148\u6D4B\u8BD5\u518D\u4FDD\u5B58\u3002"),bt=u("form","bx-form");bt.noValidate=!0;bt.addEventListener("submit",e=>{e.preventDefault(),Ln()});var xo=u("div","bx-field"),ho=u("div","bx-field"),xt=u("div","bx-field"),Le=we(xo,{label:"\u540D\u79F0",placeholder:"\u4F8B\u5982\uFF1A\u65E5\u5E38\u4F7F\u7528",value:"",onChange:e=>{Ue=e,Le.update({value:e,error:void 0}),re()}}),Ne=we(ho,{label:"\u670D\u52A1\u5730\u5740",placeholder:"https://relay.example.com",value:"",helper:"\u53EF\u7C98\u8D34\u7F51\u7AD9\u5730\u5740\u6216\u4EE5 /v1 \u7ED3\u5C3E\u7684 API \u5730\u5740\u3002",onChange:e=>{pt=e,Ne.update({value:e,error:void 0}),re()}}),Q=we(xt,{label:"API Key",placeholder:"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key",password:!0,mono:!0,value:"",onChange:e=>{he=e,Q.update({value:e,error:void 0}),re()}}),jr=u("div","bx-key-actions"),_o=H(jr,{label:"\u663E\u793A\u5BC6\u94A5",variant:"ghost",size:"xs",onClick:()=>{Oe=!Oe,Q.update({password:!Oe}),_o.update({label:Oe?"\u9690\u85CF\u5BC6\u94A5":"\u663E\u793A\u5BC6\u94A5"})}});xt.append(jr);var Ge=u("div"),So=u("div","bx-form-actions"),Rn=H(So,{label:"\u6D4B\u8BD5\u8FDE\u63A5",variant:"outline",size:"sm",onClick:()=>{Mn()}}),go=u("span"),Cn=H(go,{label:"\u4FDD\u5B58",size:"sm",onClick:()=>{}});go.querySelector("button").type="submit";So.append(go);bt.append(xo,ho,xt,Ge,So);Vr.append(bo,On,bt);He.append(zr,Vr);oe.append(Pe);Mr.append(oe);var Ie=[xo,ho,xt].map((e,t)=>{let r=e.querySelector("input"),s=e.querySelector(".oc-sdk-field-note");return r.id=["relay-name","relay-url","relay-key"][t],r.name=r.id,r.setAttribute("aria-label",["\u540D\u79F0","\u670D\u52A1\u5730\u5740","API Key"][t]),r.autocomplete=t===2?"new-password":"off",r.spellcheck=!1,r.maxLength=[60,2048,4096][t],s.id=`${r.id}-hint`,r.setAttribute("aria-describedby",s.id),r});Ie[1].inputMode="url";var re=()=>{Ge.replaceChildren()},fo=()=>{let e=D!==null;Le.update({disabled:e}),Ne.update({disabled:e}),Q.update({disabled:e}),wn.update({disabled:e}),_o.update({disabled:e}),An.update({disabled:e||!!Gr||Nr}),Rn.update({disabled:e,loading:D==="test",label:D==="test"?"\u6D4B\u8BD5\u4E2D\u2026":"\u6D4B\u8BD5\u8FDE\u63A5"}),Cn.update({disabled:e,loading:D==="save",label:D==="save"?"\u4FDD\u5B58\u4E2D\u2026":G==="new"?"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9":"\u4FDD\u5B58\u66F4\u6539"})};function In(e){D||(G=e,Tn=null,Ue=e==="new"?"":e.name,pt=e==="new"?"":e.baseUrl,he="",Oe=!1,Le.update({value:Ue,error:void 0}),Ne.update({value:pt,error:void 0}),Q.update({value:"",error:void 0,password:!0,placeholder:e==="new"?"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5",helper:e==="new"?"\u4FDD\u5B58\u540E\u4E0D\u4F1A\u663E\u793A\u5B8C\u6574\u5BC6\u94A5\u3002":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5\uFF1B\u66F4\u6362\u7AD9\u70B9\u65F6\u9700\u91CD\u65B0\u586B\u5199\u3002"}),_o.update({label:"\u663E\u793A\u5BC6\u94A5"}),re(),Pr="relays",Y(),He.scrollTop=0,Ie[0].focus())}function Un(){D||(G=null,he="",Q.update({value:"",password:!0}),re(),Y(),Et.querySelector("button")?.focus())}var Kr=e=>{Le.update({error:void 0}),Ne.update({error:void 0}),Q.update({error:void 0});let t=null;e&&!Ue.trim()&&(Le.update({error:"\u4E3A\u8FD9\u4E2A\u8FDE\u63A5\u53D6\u4E00\u4E2A\u4FBF\u4E8E\u8BC6\u522B\u7684\u540D\u79F0\u3002"}),t=Ie[0]);let r="";try{r=ct(pt)}catch(i){Ne.update({error:mt(i)}),t??=Ie[1]}let s=G==="new";return r&&G&&G!=="new"&&(s=yr(G.baseUrl,r)),s&&!he.trim()&&(Q.update({error:G==="new"?"\u8BF7\u586B\u5199 API Key\u3002":"\u66F4\u6362\u7AD9\u70B9\u65F6\uFF0C\u8BF7\u586B\u5199\u65B0\u7AD9\u70B9\u7684 API Key\u3002"}),t??=Ie[2]),t?(t.focus(),null):{name:Ue.trim(),baseUrl:r,apiKey:he.trim(),...G&&G!=="new"?{id:G.id}:{}}};async function Mn(){if(D||!G)return;let e=Kr(!1);if(e){D="test",re(),fo();try{let t=await mo("POST","/relays/test",{body:e});if(t.ok!==!0)throw new Error(typeof t.error=="string"?t.error:"\u8FDE\u63A5\u672A\u6210\u529F\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u548C\u5BC6\u94A5\u3002");let r=t.balance,s=r&&K(r.value)!==null?` \xB7 \u53EF\u7528 ${lo(K(r.value),typeof r.unit=="string"?r.unit:"USD",J)}`:"";Ge.replaceChildren(xe(`\u8FDE\u63A5\u6210\u529F${s}\u3002\u5C1A\u672A\u4FDD\u5B58\u3002`,"success"))}catch(t){Ge.replaceChildren(xe(mt(t),"error"))}finally{D=null,fo()}}}async function Ln(){if(D||!G)return;let e=Kr(!0);if(e){D="save",re(),fo();try{let t=await mo("POST","/relays",{body:e});gn+=1,Nr=!1,Nn(t),G=null,he="",Q.update({value:"",password:!0}),Pr="overview",Ce={text:`\u5DF2\u4FDD\u5B58\u201C${e.name}\u201D\u3002`,tone:"success"},Y(),await To(!0)}catch(t){Ge.replaceChildren(xe(mt(t),"error"))}finally{D=null,Y()}}}var Nn=e=>{if(!Array.isArray(e.relays))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u4E2D\u8F6C\u7AD9\u5217\u8868\uFF0C\u8BF7\u91CD\u8BD5\u3002");Sn=e.relays.map(kr).filter(t=>t!==null),Gr=null};var Gn=e=>{let t=e==="command-code"?Or:e.startsWith("stepfun")?Rr:null;if(!t)return null;let r=document.createElement("template");r.innerHTML=t;let s=r.content.firstElementChild;return s instanceof SVGSVGElement?(s.setAttribute("class","bx-status-provider-icon"),s.setAttribute("aria-hidden","true"),s.setAttribute("focusable","false"),s):null},Pn=e=>!e||!Number.isFinite(e)||e<=Date.now()?null:new Intl.DateTimeFormat(J,{month:"long",day:"numeric",weekday:"short",hour:"numeric",minute:"2-digit",hourCycle:"h23"}).format(e),Ur=(e,t,r={})=>{let s=u("div","bx-status-row");r.title&&(s.title=r.title);let i=u("span","bx-status-label-wrap");i.append(u("span","bx-status-label",e)),r.reset&&i.append(u("span","bx-status-reset",r.reset));let d=u("span","bx-status-value",t);return r.tone&&(d.dataset.tone=r.tone),r.muted&&(d.dataset.muted="true"),s.append(i,d),s},Hn=e=>{let t=u("article","bx-status-provider");t.setAttribute("aria-label",e.name);let r=u("div","bx-status-row bx-status-provider-head"),s=u("span","bx-status-name-wrap"),i=Gn(e.id);i&&s.append(i),s.append(u("span","bx-status-name",e.name)),e.plan&&(r.title=`${e.name} \xB7 ${e.plan}`),r.append(s),t.append(r);for(let x of e.windows){let I=vr(x.resetAt,J),U=Pn(x.resetAt),X=x.usedPercent>=80?"error":x.usedPercent>=50?"warning":void 0;t.append(Ur(x.label,`${Math.round(x.usedPercent)}%`,{reset:U??void 0,tone:X,title:[x.detail,I].filter(Boolean).join(" \xB7 ")||void 0}))}let d=e.balance;if(!!(d&&d.value!==null&&!(e.id==="command-code"&&e.windows.length>0))&&d&&t.append(Ur("\u989D\u5EA6\u4F59\u989D",lo(d.value,d.unit,J),{title:e.stale?"\u4E0A\u6B21\u6210\u529F\u67E5\u8BE2\u7684\u4F59\u989D":void 0})),e.ok)!e.balance&&!e.windows.length&&t.append(u("div","bx-status-row bx-status-muted","\u5DF2\u8FDE\u63A5\uFF0C\u4F46\u63A5\u53E3\u6682\u672A\u63D0\u4F9B\u4F59\u989D\u6216\u989D\u5EA6\u3002"));else{let x=u("div","bx-status-row bx-status-error",e.error??"\u67E5\u8BE2\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u3002");x.setAttribute("role","alert"),e.stale&&e.updatedAt&&(x.title=`\u4EE5\u4E0A\u4E3A ${lt(e.updatedAt,J,!0)} \u7684\u6210\u529F\u7ED3\u679C\u3002`),t.append(x)}return t};var Dn=(e,t,r,s="\u6DFB\u52A0\u4E2D\u8F6C\u7AD9")=>{let i=u("div","bx-empty");return i.append(u("h2","",e),u("p","",t)),r&&H(i,{label:s,size:"sm",onClick:r}),i};var $n=()=>{if(!ut)return;let e=[{kind:"button",id:"refresh",label:"\u5237\u65B0",disabled:W||!te},{kind:"button",id:"manage",label:"\u7BA1\u7406",disabled:!te}],t=JSON.stringify(e);t!==po&&(po=t,_e.setStatusControls(e).catch(()=>{ut=!1,po="",Me.isConnected||oe.prepend(Me)}))};function Y(){let e=fe.filter(t=>!t.ok).length;if(Xr.textContent="",ft.textContent=W?"\u6B63\u5728\u66F4\u65B0\u2026":me?`\u66F4\u65B0\u4E8E ${lt(me,J,new Date(me).toDateString()!==new Date().toDateString())}`:"",ft.title=me?new Date(me).toLocaleString(J):"",yn.update({loading:W,disabled:!te,label:W?"\u5237\u65B0\u4E2D":"\u5237\u65B0"}),Pe.hidden=!1,He.hidden=!0,Br.hidden=!0,Ee.setAttribute("aria-busy",String(W)),Re.replaceChildren(),uo&&Re.append(xe(uo)),Ce&&Re.append(xe(Ce.text,Ce.tone)),be&&Re.append(xe(`${be}${fe.length?" \u5DF2\u4FDD\u7559\u4E0A\u6B21\u663E\u793A\u7684\u6570\u636E\u3002":""}`,"error")),Ee.replaceChildren(),!te||W&&!fe.length){let t=u("div","bx-loading");co(t,{label:te?"\u6B63\u5728\u67E5\u8BE2\u4F59\u989D\u2026":"\u6B63\u5728\u8FDE\u63A5 OpenChamber\u2026"}),Ee.append(t)}else fe.length?Ee.append(...fe.map(Hn)):Ee.append(Dn(be?"\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u4F59\u989D":"\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u4F59\u989D",be?"\u70B9\u51FB\u5237\u65B0\u91CD\u8BD5\uFF0C\u6216\u68C0\u67E5\u6269\u5C55\u7684\u672C\u5730\u670D\u52A1\u6743\u9650\u3002":"\u5728 OpenCode \u914D\u7F6E Command Code\u3001StepFun\uFF0C\u6216\u6DFB\u52A0\u4E2D\u8F6C\u7AD9\u3002",void 0));$n()}async function To(e=!1){if(W&&!e)return;let t=++dt;W=!0,be=null,Y();try{let r=await mo("GET","/balances",e?{query:{refresh:"1"}}:{});if(t!==dt)return;if(!Array.isArray(r.providers))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u6709\u6548\u7684\u4F59\u989D\u5217\u8868\u3002");fe=r.providers.map(Ar).filter(s=>s!==null),me=K(r.fetchedAt)}catch(r){t===dt&&(be=mt(r))}finally{t===dt&&(W=!1,Y())}}_e.onReady(e=>{if(Zt(e,document.documentElement),J=e.locale.startsWith("zh")?e.locale:"zh-CN",document.documentElement.lang=J,ut=e.features?.statusControls===!0,!ut&&!Me.isConnected&&oe.prepend(Me),te){Y();return}te=!0,To()});{let e=-1;new ResizeObserver(()=>{let t=Math.ceil(oe.getBoundingClientRect().height);t>0&&t!==e&&(e=t,_e.setHeight(t).catch(()=>{}))}).observe(oe)}Y();})();
