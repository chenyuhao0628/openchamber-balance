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
`;function At(e){let t=e.documentElement;if(t.hasAttribute("data-oc-scrollbar-activity"))return;t.setAttribute("data-oc-scrollbar-activity","");let r=new WeakMap;e.addEventListener("scroll",s=>{let a=s.target===e?t:s.target;if(!(a instanceof Element))return;a.hasAttribute("data-oc-scrolling")||a.setAttribute("data-oc-scrolling","");let u=r.get(a);u!==void 0&&clearTimeout(u),r.set(a,setTimeout(()=>{r.delete(a),a.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var Kr=`(${At.toString()})(document);`;var Do=/^[a-z][a-z0-9-]{0,39}$/;var No=e=>Object(e)===e&&!Array.isArray(e),kt=(e,t)=>Object.keys(e).every(r=>t.includes(r)),Go=e=>String(e)===e&&e.length>=1&&e.length<=60,Po=e=>String(e)===e&&e.length>=1&&e.length<=80,Ho=e=>{if(!Array.isArray(e)||e.length>4)return!1;let t=new Set;for(let r of e){if(!No(r)||!Do.test(r.id)||!Go(r.label)||r.disabled!==void 0&&r.disabled!==!0&&r.disabled!==!1||t.has(r.id))return!1;if(t.add(r.id),r.kind==="button"){if(!kt(r,["kind","id","label","disabled"]))return!1;continue}if(r.kind!=="select"||!kt(r,["kind","id","label","value","options","disabled"])||!Po(r.value)||!Array.isArray(r.options)||r.options.length<1||r.options.length>16)return!1;let s=new Set;for(let a of r.options){if(!No(a)||!kt(a,["value","label"])||!Po(a.value)||!Go(a.label)||s.has(a.value))return!1;s.add(a.value)}if(!s.has(r.value))return!1}return!0};var vt=e=>"bytes"in e?e.bytes.byteLength:e.content.length,$o=(e,t)=>{if(e.path!==t.path||e.readOnly!==t.readOnly)return!1;if(e.encoding==="text"||t.encoding==="text")return e.encoding==="text"&&t.encoding==="text"&&e.content===t.content;if(e.bytes.byteLength!==t.bytes.byteLength)return!1;for(let r=0;r<e.bytes.byteLength;r+=1)if(e.bytes[r]!==t.bytes[r])return!1;return!0};var Fo=/^[A-Za-z0-9_-]{1,80}$/;var Xo=["left","right","top","bottom"];var Bo=(e,t=0,r={remaining:16e3})=>{if(--r.remaining<0||t>=32)return!1;if(e===null)return!0;let s=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let a of s)if(!Bo(a,t+1,r))return!1;return!0},wt=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(t=>/^(0|[1-9]\d*)$/.test(t)&&Number(t)<e.length)&&e.every(wt);if(Object(e)===e){let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype)&&Object.values(e).every(wt)}return String(e)===e||Number.isFinite(e)},Ot=e=>{try{return String(e.id)!==e.id||!Fo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!Xo.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!Bo(e.data)||!wt(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var Vo=["file","directory","other","missing"],Ct=e=>!!(e&&"sessionId"in e),It=e=>!!(e&&"sent"in e&&!("sessionId"in e));var jo=/^[0-9a-f]{7,64}$/i,Ut=e=>jo.test(e),Ke=500,We=32e3,Ko=16e3,Wo=128,Jo=200,Yo=2e3,qo=16e3,Qo=80,Zo=200,er=16e3;var tr=2e3;var Mt=2e4,Je=1024,Ye=2e6;var qe=64e3,Qe=8e3,Lt=4e3;var Nt=96e4,Wr=60*6e4;var or=999,rr=1e4,ve=500,nr=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],sr=["stopped","starting","ready","failed"],Jr=new Set(nr),ar=e=>Jr.has(e),ir=e=>e&&ar(e)?e:"HOST_REJECTED",ce=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(ce):Object(e)===e?Object.values(e).every(ce):!1,cr=e=>ce(e)&&JSON.stringify(e).length<=er,zo=e=>e?.trim().slice(0,Zo)??"",le=e=>{let t=e.id.trim().slice(0,Wo),r=e.title.trim().slice(0,Jo),s=e.url.trim().slice(0,Yo),a=e.text?.trim().slice(0,qo),u=e.author?.trim().slice(0,Qo),x=e.kind==="pull"?"pull":"issue",y={providerId:e.providerId.trim(),id:t,title:r||t,url:s,kind:x};if(a&&(y.text=a),u&&(y.author=u),x==="pull"){let I=zo(e.branches?.head),U=zo(e.branches?.base);I&&U&&(y.branches={head:I,base:U})}return cr(e.data)&&(y.data=e.data),y},Gt=e=>{let t=le(e);return e.projectId&&(t.projectId=e.projectId),e.navigation&&(t.navigation=e.navigation),e.worktree&&(t.worktree=e.worktree),t},Pt=e=>{let t={text:e.text.trim().slice(0,Ko)};return e.send&&(t.send=!0),t},Dt=e=>e===null||!Number.isFinite(e)?null:Math.min(or,Math.max(0,Math.round(e))),Ht=e=>Number.isFinite(e)?Math.min(rr,Math.max(0,Math.ceil(e))):0;var de=e=>e.length>0&&e.length<=Je&&!e.includes("\0")&&!e.includes("\\");var Ze=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>tr?!1:!e.split("/").some(r=>r==="."||r===".."),Yr=new Set(sr),$t=e=>!!(e&&"status"in e&&Yr.has(String(e.status))&&!("body"in e)),et=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),Ft=e=>!!(e&&"content"in e&&String(e.content)===e.content),Xt=e=>!!(e&&"written"in e&&e.written===!0),Bt=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),qr=new Set(Vo),zt=e=>!!(e&&"kind"in e&&"size"in e&&qr.has(String(e.kind))&&Number.isFinite(e.size)),Vt=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),Qr=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),Zr=e=>Object(e)===e?e:null,Rt=e=>String(e)===e&&e.length>0,en=e=>{if(!Rt(e.id))return null;if(e.ok===!0){let t={channel:E,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(t.payload=e.payload),t}return e.ok===!1&&Rt(e.error)?{channel:E,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:ir(Rt(e.code)?e.code:void 0)}:null},jt=e=>{let t=Zr(e);return!t||t.channel!==E||t.v!==1?null:t.type==="result"?en(t):!Qr.has(String(t.type))||Object(t.payload)!==t.payload?null:t};var lr=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,tn=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",l=class extends Error{code;constructor(t,r){super(r),this.name="HostRequestError",this.code=t}},dr=()=>Promise.reject(new l("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),tt=()=>Promise.reject(new l("BAD_PATH",`File path must be 1 to ${Je} characters without NUL or backslash.`)),ot=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new l("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},m=e=>(e.value+=1,`oc-${e.value}`),qt=(e={})=>{let t=e.target??("window"in globalThis?window:null);if(!t)throw new l("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let r=e.acceptSource??(o=>o===t.parent),s=e.requestTimeoutMs??Mt,a=new Set,u=new Set,x=new Set,y=new Set,I=new Set,U=new Set,Y=new Set,He=new Set,$e=new Set,ne=new Set,ht=[],Se=null,ge=null,Fe=new Set,Xe=new Set,Te=null,ye=null,_t=!1,se=new Map,ae=new Map,ie=new Map,X=!1,f={value:0},d=null,B=null,Ae=!1,ke=!1,yo=null,Ao=o=>o?{sessionId:o.id,phase:o.busy?"started":"completed"}:null,P=o=>{t.parent.postMessage(o,"*")},ko=()=>{X||t.parent===t||ne.size===0||d?.features?.lateGenerateResults!==!0||P({channel:E,v:1,type:"generate-late-listen"})},A=(o,n)=>{for(let i of o)try{i(n)}catch(c){console.error(c)}},vo=o=>{if(!(o instanceof MessageEvent)||!r(o.source))return;let n=jt(o.data);if(!n)return;if(n.type==="workspace"){let c=ae.get(n.payload.subscriptionId);c&&A([c],n.payload.snapshot);return}if(n.type==="shells"){let c=ie.get(n.payload.subscriptionId);c&&A([c],n.payload.snapshot);return}if(n.type==="ready"){d=n.payload,B=Ao(n.payload.session),A(a,n.payload),A(u,n.payload.directory),A(x,n.payload.session),B&&A(y,B),A(I,n.payload.connection),A(U,n.payload.settings),A(Y,n.payload.item),ko();return}if(n.type==="generate-late"){ne.size===0?ht.push(n.payload):A(ne,n.payload);return}if(n.type==="directory"){d&&(d={...d,directory:n.payload.directory}),A(u,n.payload.directory);return}if(n.type==="session"){d&&(d={...d,session:n.payload.session}),n.payload.session?B?.sessionId!==n.payload.session.id&&(B=Ao(n.payload.session)):B=null,A(x,n.payload.session);return}if(n.type==="session-lifecycle"){B=n.payload,A(y,n.payload);return}if(n.type==="connection"){d&&(d={...d,connection:n.payload.connection}),A(I,n.payload.connection);return}if(n.type==="settings"){d&&(d={...d,settings:n.payload.settings}),A(U,n.payload.settings);return}if(n.type==="item"){d&&(d={...d,item:n.payload.item}),A(Y,n.payload.item);return}if(n.type==="status-control-event"){A(He,n.payload);return}if(n.type==="popover-closed"){A($e,n.payload);return}if(n.type==="action"){let c=h=>{X||P({channel:E,v:1,type:"action-result",id:n.id,payload:h})},_=ge;if(!_){c({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>_(n.payload)).then(()=>c({ok:!0}),h=>{let O=(h instanceof Error?h.message:String(h)).trim();c({ok:!1,error:(O||"Action failed.").slice(0,ve)})});return}if(n.type==="file-open"){let c=n.payload;if(ye&&$o(ye,c))return;ye=c,A(Fe,n.payload);return}if(n.type==="file-saved"){A(Xe,n.payload.version);return}if(n.type==="file-snapshot"){let c=O=>{X||P({channel:E,v:1,type:"file-snapshot-result",id:n.id,payload:O})},_=O=>c({error:(O.trim()||"Could not read the edited file.").slice(0,ve)}),h=Te;if(!h){_("This extension does not edit files.");return}Promise.resolve().then(()=>h(n.payload.purpose)).then(O=>{if(vt(O)>2e7){_(`The file is over ${2e7} ${"bytes"in O?"bytes":"characters"}.`);return}if(O.version.length>256){_(`The snapshot version is over ${256} characters.`);return}c({snapshot:"bytes"in O?{bytes:O.bytes,version:O.version}:{content:O.content,version:O.version}})},O=>_(O instanceof Error?O.message:String(O)));return}if(n.type==="resolve"){let c=h=>{P({channel:E,v:1,type:"resolve-result",id:n.id,payload:h})},_=Se;if(!_){c({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>_(n.payload)).then(h=>c({item:h?le(h):null}),h=>{let O=(h instanceof Error?h.message:String(h)).trim();c({error:(O||"Command failed.").slice(0,ve)})});return}let i=se.get(n.id);if(i){if(clearTimeout(i.timer),se.delete(n.id),n.ok){i.resolve(n.payload);return}i.reject(new l(n.code,n.error))}};t.addEventListener("message",vo),P({channel:E,v:1,type:"hello"});let M=(o,n=s)=>X||t.parent===t?Promise.reject(new l("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((i,c)=>{let _=setTimeout(()=>{se.delete(o.id),c(new l("HOST_TIMEOUT","Host did not answer in time."))},n);se.set(o.id,{resolve:i,reject:c,timer:_}),P(o)}),v=o=>M(o).then(()=>{}),w={channel:E,v:1},St=o=>{!X&&t.parent!==t&&P(o)},wo=()=>St({...w,type:"file-save"}),Oo=o=>{!lr(o)||!tn(o)||(o.preventDefault(),wo())},Ro=o=>{!lr(o)||o.key!=="Escape"||d?.surface!=="popover"||!d.popover||(o.preventDefault(),Mo(d.popover.id,"escape").catch(()=>{}))},Be=()=>{let o=d?.surface==="popover"?d.popover:void 0;if(!o)return;let n=Ae||ke;yo!==n&&(yo=n,Lo(o.id,n).catch(()=>{}))},ze=()=>{d?.surface!=="popover"||Ae||(Ae=!0,Be())},Co=o=>{d?.surface!=="popover"||o.relatedTarget!==null||!Ae||(Ae=!1,Be())},Io=()=>{d?.surface!=="popover"||ke||(ke=!0,Be())},Uo=()=>{d?.surface!=="popover"||!ke||(ke=!1,Be())},F=(o,n=1024)=>{if(!o.trim()||o.length>n)throw new l("HOST_REJECTED",`Identity must contain 1 to ${n} characters.`)},gt=async o=>{o.kind!=="projects"&&F(o.projectId);let n=await M({...w,type:"workspace-read",id:m(f),payload:o});if(!n||!("kind"in n)||!("state"in n)||n.kind!==o.kind)throw new l("HOST_REJECTED","Host did not return workspace data.");return n},Tt=async(o,n)=>{o.kind!=="projects"&&F(o.projectId);let i=m(f);ae.set(i,n);try{await v({...w,type:"workspace-subscribe",id:m(f),payload:{subscriptionId:i,query:o}})}catch(c){throw ae.delete(i),X||P({...w,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:i}}),c}return()=>{!ae.delete(i)||X||P({...w,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:i}})}},jr=async(o,n)=>{o.kind==="session"&&F(o.sessionId),o.kind==="project"&&F(o.projectId);let i=m(f);ie.set(i,n);try{await v({...w,type:"shells-subscribe",id:m(f),payload:{subscriptionId:i,scope:o}})}catch(c){throw ie.delete(i),X||P({...w,type:"shells-unsubscribe",id:m(f),payload:{subscriptionId:i}}),c}return()=>{!ie.delete(i)||X||P({...w,type:"shells-unsubscribe",id:m(f),payload:{subscriptionId:i}})}},Ve=async o=>{if("key"in o&&(o.key.length===0||o.key.length>128))throw new l("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(o.op==="set"&&!ce(o.value))throw new l("HOST_REJECTED","Storage values must be JSON.");if(o.op==="set"&&new TextEncoder().encode(JSON.stringify(o.value)).length>65536)throw new l("HOST_REJECTED","Storage value exceeds 64 KiB.");if(o.scope==="device"&&d?.features?.deviceStorage!==!0)throw new l("UNSUPPORTED","This host does not support device storage.");let n=await M({...w,type:"storage",id:m(f),payload:o});if(!n||!("storage"in n)||n.op!==o.op)throw new l("HOST_REJECTED","Host did not return storage data.");return n},Mo=(o,n)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===o)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):v({...w,type:"popover-close",id:m(f),payload:n?{id:o,reason:n}:{id:o}}),Lo=(o,n)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===o)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):v({...w,type:"popover-anchor",id:m(f),payload:{id:o,active:n}});return t.addEventListener("keydown",Ro,!0),t.addEventListener("pointerover",ze),t.addEventListener("pointermove",ze),t.addEventListener("pointerout",Co),t.addEventListener("focus",Io),t.addEventListener("blur",Uo),{onAction:o=>(ge=o,()=>{ge===o&&(ge=null)}),listProjects:async()=>{let o=await gt({kind:"projects"});if(o.kind!=="projects")throw new l("HOST_REJECTED","Expected projects.");return o},listWorktrees:async o=>{let n=await gt({kind:"worktrees",projectId:o});if(n.kind!=="worktrees")throw new l("HOST_REJECTED","Expected worktrees.");return n},listSessions:async o=>{let n=await gt({kind:"sessions",projectId:o});if(n.kind!=="sessions")throw new l("HOST_REJECTED","Expected sessions.");return n},onProjects:o=>Tt({kind:"projects"},n=>{n.kind==="projects"&&o(n)}),onWorktrees:(o,n)=>Tt({kind:"worktrees",projectId:o},i=>{i.kind==="worktrees"&&n(i)}),onSessions:(o,n)=>Tt({kind:"sessions",projectId:o},i=>{i.kind==="sessions"&&n(i)}),onRunningShells:(o,n)=>jr(o,n),readShellOutput:async(o,n)=>{F(o,128);let i=n?.cursor;if(i!==void 0&&(!Number.isInteger(i)||i<0))throw new l("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let c=n?.tailBytes;if(c!==void 0&&(!Number.isInteger(c)||c<1||c>65536))throw new l("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let h=await M({...w,type:"shell-output",id:m(f),payload:{shellId:o,cursor:i,tailBytes:c}});if(!h||typeof h.output!="string"||!Number.isFinite(h.cursor))throw new l("HOST_REJECTED","Host did not return shell output.");return h},stopShell:async o=>{if(F(o,128),(await M({...w,type:"shell-stop",id:m(f),payload:{shellId:o}}))?.stopped!==!0)throw new l("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async o=>{F(o),await v({...w,type:"open-session",id:m(f),payload:{sessionId:o}})},storage:{get:async(o,n)=>{let i=ot(n),c={op:"get",key:o};i&&(c.scope=i);let _=await Ve(c);return _.op==="get"&&_.found?_.value:void 0},set:async(o,n,i)=>{let c=ot(i),_={op:"set",key:o,value:n};c&&(_.scope=c),await Ve(_)},delete:async(o,n)=>{let i=ot(n),c={op:"delete",key:o};i&&(c.scope=i),await Ve(c)},keys:async o=>{let n=ot(o),i={op:"keys"};n&&(i.scope=n);let c=await Ve(i);if(c.op!=="keys")throw new l("HOST_REJECTED","Expected storage keys.");return c.keys}},onReady:o=>(a.add(o),d&&o(d),()=>{a.delete(o)}),onDirectory:o=>(u.add(o),d&&o(d.directory),()=>{u.delete(o)}),onSession:o=>(x.add(o),d&&o(d.session),()=>{x.delete(o)}),onSessionLifecycle:o=>(y.add(o),B&&o(B),()=>{y.delete(o)}),onConnection:o=>(I.add(o),d&&o(d.connection),()=>{I.delete(o)}),onSettings:o=>(U.add(o),d&&o(d.settings),()=>{U.delete(o)}),onItem:o=>(Y.add(o),d&&o(d.item),()=>{Y.delete(o)}),onStatusControl:o=>(He.add(o),()=>{He.delete(o)}),onPopoverClosed:o=>($e.add(o),()=>{$e.delete(o)}),setStatusControls:o=>d?.features?.statusControls!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support status controls.")):Ho(o)?v({...w,type:"status-controls",id:m(f),payload:{controls:o}}):Promise.reject(new l("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:o=>d?.features?.popovers!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):Ot(o)?v({...w,type:"popover-open",id:m(f),payload:o}):Promise.reject(new l("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:Mo,setPopoverAnchorActive:Lo,onResolve:o=>(Se=o,()=>{Se===o&&(Se=null)}),toast:o=>{let n=o.message.trim();return!n||n.length>Ke?Promise.reject(new l("HOST_REJECTED",`Toast message must contain 1 to ${Ke} characters.`)):o.copy&&o.copy!==!0&&(!o.copy.text.length||o.copy.text.length>We)?Promise.reject(new l("HOST_REJECTED",`Toast copy text must contain 1 to ${We} characters.`)):v({channel:E,v:1,type:"toast",id:m(f),payload:{...o,message:n}})},openUrl:o=>v({channel:E,v:1,type:"open-url",id:m(f),payload:{url:o}}),openCommit:o=>Ut(o)?v({channel:E,v:1,type:"open-commit",id:m(f),payload:{sha:o}}):Promise.reject(new l("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:o=>v({channel:E,v:1,type:"open-surface",id:m(f),payload:{surfaceId:o}}),writeClipboard:o=>v({channel:E,v:1,type:"clipboard-write",id:m(f),payload:{text:o}}),compose:o=>v({channel:E,v:1,type:"compose",id:m(f),payload:o}),attach:o=>v({channel:E,v:1,type:"attach",id:m(f),payload:le(o)}),startSession:async o=>{o.projectId!==void 0&&F(o.projectId);let n=o.worktree;n&&n!==!0&&(n.kind==="existing"?F(n.directory):(n.name!==void 0&&F(n.name,200),n.baseBranch!==void 0&&F(n.baseBranch,200)));let i=await M({channel:E,v:1,type:"start-session",id:m(f),payload:Gt(o)},e.requestTimeoutMs??18e4);if(!Ct(i))throw new l("HOST_REJECTED","Host did not return a session.");return i},prompt:o=>M({channel:E,v:1,type:"prompt",id:m(f),payload:Pt(o)}).then(n=>{if(!It(n))throw new l("HOST_REJECTED","Host did not return a prompt result.");return n}),sessionLink:o=>v({channel:E,v:1,type:"session-link",id:m(f),payload:le(o)}),close:()=>v({channel:E,v:1,type:"close",id:m(f)}),oauthStart:()=>v({channel:E,v:1,type:"oauth-start",id:m(f)}),oauthDisconnect:()=>v({channel:E,v:1,type:"oauth-disconnect",id:m(f)}),request:o=>(Ze(o.path)?M({channel:E,v:1,type:"request",id:m(f),payload:o}):dr()).then(n=>{if(!et(n))throw new l("HOST_REJECTED","Host request result was empty.");return n}),serviceRequest:o=>(Ze(o.path)?M({channel:E,v:1,type:"service-request",id:m(f),payload:o}):dr()).then(n=>{if(!et(n))throw new l("HOST_REJECTED","Host service request result was empty.");return n}),serviceStatus:()=>M({channel:E,v:1,type:"service-status",id:m(f)}).then(o=>{if(!$t(o))throw new l("HOST_REJECTED","Host did not return service status.");return o}),readFile:o=>(de(o)?M({channel:E,v:1,type:"file-read",id:m(f),payload:{path:o}}):tt()).then(n=>{if(!Ft(n))throw new l("HOST_REJECTED","Host did not return file content.");return n}),writeFile:(o,n)=>de(o)?n.length>Ye?Promise.reject(new l("FILE_TOO_LARGE",`Content is over ${Ye} characters.`)):M({channel:E,v:1,type:"file-write",id:m(f),payload:{path:o,content:n}}).then(i=>{if(!Xt(i))throw new l("HOST_REJECTED","Host did not confirm the write.");return i}):tt(),listDir:o=>(de(o)?M({channel:E,v:1,type:"file-list",id:m(f),payload:{path:o}}):tt()).then(n=>{if(!Bt(n))throw new l("HOST_REJECTED","Host did not return directory entries.");return n}),stat:o=>(de(o)?M({channel:E,v:1,type:"file-stat",id:m(f),payload:{path:o}}):tt()).then(n=>{if(!zt(n))throw new l("HOST_REJECTED","Host did not return file status.");return n}),generate:o=>{let n=o.prompt.trim(),i=o.system?.trim();if(n.length===0||n.length>qe)return Promise.reject(new l("HOST_REJECTED",`Prompt must be 1 to ${qe} characters.`));if(i!==void 0&&(i.length===0||i.length>Qe))return Promise.reject(new l("HOST_REJECTED",`System prompt must be 1 to ${Qe} characters.`));let c=o.maxOutputTokens===void 0?void 0:Math.min(Lt,Math.max(1,Math.floor(o.maxOutputTokens)));if(c!==void 0&&!Number.isFinite(c))return Promise.reject(new l("HOST_REJECTED","maxOutputTokens must be a number."));let _={prompt:n};return i!==void 0&&(_.system=i),c!==void 0&&(_.maxOutputTokens=c),M({channel:E,v:1,type:"generate",id:m(f),payload:_},e.requestTimeoutMs??Nt).then(h=>{if(!Vt(h))throw new l("HOST_REJECTED","Host did not return generated text.");return h})},onLateGenerateResult:o=>{ne.add(o);for(let n of ht.splice(0))A([o],n);return ko(),()=>{ne.delete(o)}},setBadge:o=>v({channel:E,v:1,type:"badge",id:m(f),payload:{count:Dt(o)}}),setHeight:o=>v({channel:E,v:1,type:"resize",id:m(f),payload:{height:Ht(o)}}),onFileOpen:o=>(Fe.add(o),_t||(_t=!0,t.addEventListener("keydown",Oo,!0)),ye&&o(ye),()=>{Fe.delete(o)}),onFileSnapshot:o=>(Te=o,()=>{Te===o&&(Te=null)}),onFileSaved:o=>(Xe.add(o),()=>{Xe.delete(o)}),reportFileChange:o=>St({...w,type:"file-change",payload:{dirty:o.dirty,edited:o.edited}}),requestFileSave:wo,reportFileUnsupported:()=>St({...w,type:"file-unsupported"}),dispose:()=>{for(let o of ae.keys())P({...w,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:o}});ae.clear();for(let o of ie.keys())P({...w,type:"shells-unsubscribe",id:m(f),payload:{subscriptionId:o}});ie.clear(),X=!0,Se=null,ge=null,Te=null,Fe.clear(),Xe.clear(),_t&&t.removeEventListener("keydown",Oo,!0),t.removeEventListener("message",vo),t.removeEventListener("keydown",Ro,!0),t.removeEventListener("pointerover",ze),t.removeEventListener("pointermove",ze),t.removeEventListener("pointerout",Co),t.removeEventListener("focus",Io),t.removeEventListener("blur",Uo);for(let o of se.values())clearTimeout(o.timer),o.reject(new l("HOST_UNAVAILABLE","Host client was disposed."));se.clear(),a.clear(),u.clear(),x.clear(),y.clear(),I.clear(),U.clear(),Y.clear(),He.clear(),$e.clear(),ne.clear(),ht.length=0}}};var fr=["browser.open","browser.snapshot","browser.click","browser.type","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var ss=new Set(fr);var mr=["none","agent","user"];var is=new Set(mr);var on=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],rn=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Er=(e,t)=>{t.style.colorScheme=e.mode;for(let[r,s]of on)t.style.setProperty(r,e.tokens[s]);for(let[r,s,a]of rn){let u=e.tokens[a]??"";t.style.setProperty(r,u),t.style.setProperty(s,u)}t.style.setProperty("font-family",e.tokens.font),t.style.setProperty("font-size","0.875rem"),t.style.setProperty("line-height","1.45"),t.style.setProperty("color",e.tokens.foreground)},Qt=(e,t)=>{Er(e.theme,t),t.dataset&&(t.dataset.ocSurface=e.surface,t.dataset.ocTheme=e.theme.mode)};var nn={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},T=(e,t)=>`var(--${e}, var(--oc-${nn[e]}, ${t}))`,V=T("surface-background","transparent"),nt=T("surface-elevated","transparent"),pe=T("surface-elevated-foreground","inherit"),$=T("surface-foreground","inherit"),g=T("surface-muted-foreground","gray"),sn=T("surface-muted","transparent"),q=T("interactive-border","currentColor"),L=T("interactive-hover","transparent"),ee=T("interactive-active","transparent"),Zt=T("interactive-selection","transparent"),eo=T("interactive-selection-foreground","inherit"),z=T("primary","currentColor"),to=T("primary-text","inherit"),oo=T("error-text","inherit"),an=T("font-sans","inherit"),ro=T("font-mono","monospace"),Sr=T("radius","9px"),no=`calc(${Sr} - 2px)`,br=`calc(${Sr} - 4px)`,k=(e,t,r="transparent")=>`color-mix(in srgb, ${e} ${t}%, ${r})`,xr=`background-image: linear-gradient(${L}, ${L});`,so=e=>`box-shadow: inset 0 0 0 1px ${e}, var(--oc-sdk-field-lift);`,ao="box-shadow: inset 0 0 0 1px var(--oc-sdk-edge), var(--oc-sdk-raised-lift);",hr="box-shadow: var(--oc-sdk-lit);",_r=`inset 0 1px 0 0 ${k($,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2)`,cn=`
:root {
  --oc-sdk-edge: ${k($,10)};
  --oc-sdk-field-bg: ${nt};
  --oc-sdk-raised-bg: ${V};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 2px 0 rgb(0 0 0 / 0.06);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.45), 0 1px 2px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.8), inset 0 0 0 1px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.1), 0 1px 2px -0.5px rgb(0 0 0 / 0.08), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.08);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${k($,6)};
  --oc-sdk-field-bg: ${k(V,50,nt)};
  --oc-sdk-raised-bg: ${nt};
  --oc-sdk-field-lift: ${_r};
  --oc-sdk-raised-lift: ${_r};
  --oc-sdk-lit: inset 0 1px 0 0 ${k($,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.06), inset 0 0 0 1px rgb(255 255 255 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.36), 0 1px 1px -0.5px rgb(0 0 0 / 0.22), 0 3px 3px -1.5px rgb(0 0 0 / 0.2), 0 6px 6px -3px rgb(0 0 0 / 0.16);
}`,rt=e=>{let t=T(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${t}; --oc-sdk-tone-text: ${T(`${e}-text`,"inherit")}; }`},ln=`
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
`,gr=`${cn}
.oc-sdk { color: ${$}; font-family: ${an}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${xr} }
.oc-sdk-mono { font-family: ${ro}; }
.oc-sdk-muted { color: ${g}; }
${rt("success")}${rt("warning")}${rt("error")}${rt("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${z}; --oc-sdk-tone-text: ${to}; }

.oc-sdk-btn { border-radius: ${no}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${br}; }
.oc-sdk-btn[data-variant="default"] { color: ${to}; background: ${k(z,10,V)}; border-color: ${k(z,12)}; ${hr} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${k(z,16,V)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${k(z,22,V)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${sn}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${ee}, ${ee}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${pe}; border-color: transparent; ${ao} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${ee}, ${ee}); box-shadow: inset 0 0 0 1px var(--oc-sdk-edge); }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${L}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${ee}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${T("status-error","red")}; color: ${oo}; background: ${k("var(--oc-sdk-tone)",7,V)}; border-color: ${k("var(--oc-sdk-tone)",12)}; ${hr} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${k("var(--oc-sdk-tone)",9,V)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${k("var(--oc-sdk-tone)",11,V)}; box-shadow: none; }

.oc-sdk-field-note { color: ${g}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${oo}; }
.oc-sdk-input { border-radius: ${no}; background: var(--oc-sdk-field-bg); color: ${pe}; ${so("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${g}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${so(k($,26))} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${so(T("status-error","red"))} }
.oc-sdk-input[data-mono="true"] { font-family: ${ro}; }

.oc-sdk-search-icon { color: ${g}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${z}; }
.oc-sdk-search-clear { border-radius: ${br}; color: ${g}; }
.oc-sdk-search-clear:hover { background: ${L}; color: ${$}; }

.oc-sdk-trigger { border-color: transparent; border-radius: ${no}; background: var(--oc-sdk-raised-bg); color: ${pe}; ${ao} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${L}, ${L}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${ee}, ${ee}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${g}; }
.oc-sdk-trigger-chevron { color: ${g}; }
/* The app's dropdown light: lit top, hairline rings and a layered shadow, no border. */
.oc-sdk-popup { --surface-foreground: ${pe}; border-color: transparent; border-radius: 12px; background: ${nt}; color: ${pe}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${L}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${Zt}; color: ${eo}; }
.oc-sdk-option-check { color: ${$}; }
.oc-sdk-option[data-destructive="true"] { color: ${oo}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${k(T("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${g}; }
.oc-sdk-popup-empty { color: ${g}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${q}; border-radius: 4px; color: ${$}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${k($,60,q)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${q}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${V}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${z}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${xr} }
.oc-sdk-check-desc { color: ${g}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${k($,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${g}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${$}; }
.oc-sdk-tab[aria-selected="true"] { color: ${eo}; background: ${Zt}; border-color: ${q}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${pe}; background: var(--oc-sdk-raised-bg); border-color: transparent; ${ao} }
.oc-sdk-tab-count { color: ${g}; }

.oc-sdk-badge { border-radius: 9999px; background: ${L}; color: ${g}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${k("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${L}; }
.oc-sdk-row[aria-selected="true"] { background: ${Zt}; color: ${eo}; }
.oc-sdk-row-lead { font-family: ${ro}; color: ${g}; }
.oc-sdk-row-sub { color: ${g}; }
.oc-sdk-row-meta { color: ${g}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${g}; }

.oc-sdk-empty-body { color: ${g}; }

.oc-sdk-spinner { color: ${g}; }
.oc-sdk-spinner-ring { border-color: ${q}; border-top-color: ${z}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${k("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${g}; }

.oc-sdk-separator { color: ${g}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${k(q,40)}; }

.oc-sdk-progress-label { color: ${g}; }
.oc-sdk-progress-track { border-radius: 9999px; background: ${q}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${z}); }

.oc-sdk-text a { color: ${to}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${k(q,60)}; }
`,R=`
${yt}
${ln}
${gr}`;var Tr="oc-sdk-ui-style";var C=e=>{let t=document.getElementById(Tr);if(t instanceof HTMLStyleElement){t.textContent!==e&&(t.textContent=e);return}At(document);let r=document.createElement("style");r.id=Tr,r.textContent=e,document.head.appendChild(r)},S=(e,t)=>{let r=document.createElement(e);return t&&(r.className=t),r},Q=e=>{let t=S("button",e);return t.type="button",t},N=(e,t)=>{let r=t??"";e.textContent!==r&&(e.textContent=r)},ue=(e,t,r)=>{r==null||r===""?e.removeAttribute(t):e.getAttribute(t)!==r&&e.setAttribute(t,r)};var dn=()=>{let e=document.createElement("span");return e.className="oc-sdk-spinner-ring",e.setAttribute("aria-hidden","true"),e},D=(e,t)=>{C(R);let r=t,s=Q("oc-sdk oc-sdk-btn"),a=dn(),u=document.createElement("span");s.append(u),e.append(s);let x=()=>{s.dataset.variant=r.variant??"default",s.dataset.size=r.size??"default",s.disabled=!!r.disabled||!!r.loading,s.dataset.loading=r.loading?"true":"false",s.setAttribute("aria-busy",r.loading?"true":"false"),r.loading&&a.parentNode!==s?s.prepend(a):!r.loading&&a.parentNode===s&&a.remove(),N(u,r.label)},y=()=>{r.disabled||r.loading||r.onClick()};return s.addEventListener("click",y),x(),{update:I=>{r={...r,...I},x()},dispose:()=>{s.removeEventListener("click",y),s.remove()}}};var we=(e,t)=>{C(R);let r=t,s=S("label","oc-sdk oc-sdk-field"),a=S("span","oc-sdk-field-label"),u=r.multiline?S("textarea","oc-sdk-input"):S("input","oc-sdk-input"),x=S("span","oc-sdk-field-note");s.append(a,u,x),e.append(s);let y=()=>{N(a,r.label),a.hidden=!r.label,u instanceof HTMLInputElement?u.type=r.password?"password":"text":u.rows=r.rows??3,u.value!==r.value&&(u.value=r.value),u.disabled=!!r.disabled,ue(u,"placeholder",r.placeholder),u.dataset.mono=r.mono?"true":"false";let U=!!r.error;s.dataset.invalid=U?"true":"false",u.setAttribute("aria-invalid",U?"true":"false");let Y=r.error??r.helper??"";N(x,Y),x.hidden=Y===""},I=()=>{r.onChange(u.value)};return u.addEventListener("input",I),y(),{update:U=>{r={...r,...U},y()},dispose:()=>{u.removeEventListener("input",I),s.remove()}}};var co=(e,t={})=>{C(R);let r=t,s=S("span","oc-sdk oc-sdk-spinner");s.setAttribute("role","status");let a=S("span","oc-sdk-spinner-ring");a.setAttribute("aria-hidden","true");let u=S("span");s.append(a,u),e.append(s);let x=()=>{s.dataset.size=r.size??"default",N(u,r.label),u.hidden=!r.label,s.setAttribute("aria-label",r.label??"Loading")};return x(),{update:y=>{r={...r,...y},x()},dispose:()=>{s.remove()}}};var ct=e=>{let t=e.trim();if(!t)throw new Error("\u8BF7\u586B\u5199\u670D\u52A1\u5730\u5740");let r;try{r=new URL(t.includes("://")?t:`https://${t}`)}catch{throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u670D\u52A1\u5730\u5740\uFF0C\u4F8B\u5982 https://relay.example.com")}if(!["https:","http:"].includes(r.protocol)||!r.hostname)throw new Error("\u670D\u52A1\u5730\u5740\u4EC5\u652F\u6301 HTTP \u6216 HTTPS");if(r.username||r.password||r.search||r.hash)throw new Error("\u670D\u52A1\u5730\u5740\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u5BC6\u94A5\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u951A\u70B9");let s=r.pathname.replace(/\/+$/,"").replace(/\/v1$/i,"");return`${r.origin}${s}`},yr=(e,t)=>new URL(ct(e)).origin!==new URL(ct(t)).origin;var j=e=>typeof e=="number"&&Number.isFinite(e)?e:null,En=e=>{if(!e||typeof e!="object")return null;let t=e,r=j(t.usedPercent);return typeof t.key!="string"||typeof t.label!="string"||r===null?null:{key:t.key,label:t.label,usedPercent:r,remainingPercent:j(t.remainingPercent)??Math.max(0,100-r),resetAt:j(t.resetAt),resetAtText:typeof t.resetAtText=="string"?t.resetAtText:null,detail:typeof t.detail=="string"?t.detail:null}},Ar=e=>{if(!e||typeof e!="object")return null;let t=e;if(typeof t.id!="string"||typeof t.name!="string")return null;let r=t.balance&&typeof t.balance=="object"?t.balance:null;return{id:t.id,name:t.name,ok:t.ok!==!1,plan:typeof t.plan=="string"?t.plan:null,balance:r&&typeof r.label=="string"?{value:j(r.value),label:r.label,unit:typeof r.unit=="string"?r.unit:""}:null,detail:typeof t.detail=="string"?t.detail:null,windows:Array.isArray(t.windows)?t.windows.map(En).filter(s=>s!==null):[],updatedAt:j(t.updatedAt),stale:t.stale===!0,error:typeof t.error=="string"?t.error:void 0}},kr=e=>{if(!e||typeof e!="object")return null;let t=e;return typeof t.id!="string"||typeof t.name!="string"||typeof t.baseUrl!="string"?null:{id:t.id,name:t.name,baseUrl:t.baseUrl,hasKey:t.hasKey===!0}};var lt=(e,t="zh-CN",r=!1)=>new Intl.DateTimeFormat(t,{...r?{month:"numeric",day:"numeric"}:{},hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e),vr=(e,t="zh-CN",r=Date.now())=>{if(!e||!Number.isFinite(e))return null;if(e<=r)return"\u91CD\u7F6E\u65F6\u95F4\u5DF2\u5230\uFF0C\u8BF7\u5237\u65B0";let s=new Date(e),a=new Date(r),u=new Date(r);u.setDate(u.getDate()+1);let x=s.toDateString()===a.toDateString()?"\u4ECA\u5929 ":s.toDateString()===u.toDateString()?"\u660E\u5929 ":"";return`${x}${lt(e,t,!x)} \u91CD\u7F6E`},lo=(e,t,r="zh-CN")=>{if(e===null||!Number.isFinite(e))return"\u2014";let s=t==="USD"||t==="$"?"USD":t==="CNY"||t==="\xA5"?"CNY":null,a=new Intl.NumberFormat(r,{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:1}).format(e);return`${s==="USD"?"$":s==="CNY"?"\xA5":""}${a}${s?"":` ${t}`}`};var wr=`:root {
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
html[data-oc-surface="status"] .bx-status-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 28px; padding: 0 4px; border-radius: 4px; font-size: 13px; line-height: 1.4; }
html[data-oc-surface="status"] .bx-status-provider-head { color: var(--oc-fg); font-weight: 600; }
html[data-oc-surface="status"] .bx-status-name-wrap { display: flex; min-width: 0; align-items: center; gap: 8px; }
html[data-oc-surface="status"] .bx-status-provider-icon { width: 14px; height: 14px; flex: none; color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-status-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-plan { color: var(--oc-muted); font-size: 11px; font-weight: 400; white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-label-wrap { display: flex; min-width: 0; align-items: baseline; gap: 6px; overflow: hidden; }
html[data-oc-surface="status"] .bx-status-label { color: var(--oc-muted); white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-reset { color: var(--oc-muted); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-oc-surface="status"] .bx-status-value { flex: none; color: var(--oc-fg); font-size: 13px; font-variant-numeric: tabular-nums; white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-value[data-tone="warning"] { color: var(--oc-warning-text); }
html[data-oc-surface="status"] .bx-status-value[data-tone="error"] { color: var(--oc-error-text); }
html[data-oc-surface="status"] .bx-status-value[data-muted="true"] { color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-status-error { color: var(--oc-error-text); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-oc-surface="status"] .bx-status-muted { color: var(--oc-muted); font-size: 12px; }
html[data-oc-surface="status"] .bx-notice { margin: 2px 0 4px; padding: 0 4px; background: transparent; color: var(--oc-muted); font-size: 12px; }
html[data-oc-surface="status"] .bx-notice[data-tone="error"] { background: transparent; color: var(--oc-error-text); }
html[data-oc-surface="status"] .bx-notice[data-tone="success"] { background: transparent; color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-loading { padding: 8px 4px; font-size: 12px; }
html[data-oc-surface="status"] .bx-empty { padding: 8px 4px; }
html[data-oc-surface="status"] .bx-empty h2 { margin-bottom: 3px; font-size: 13px; }
html[data-oc-surface="status"] .bx-empty p { margin-bottom: 0; font-size: 12px; }
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
`;var Or=`/* Shared foundation for OpenChamber extensions. Colors and fonts belong to the host. */
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
`;async function Rr(e,t){try{await e.openSurface(`plugin:${t.id}`)}catch{throw new Error(`\u672A\u80FD\u6253\u5F00\u300C${t.name}\u300D\u3002\u8BF7\u91CD\u65B0\u52A0\u8F7D\u754C\u9762\u540E\u91CD\u8BD5\u3002`)}}var _e=qt({requestTimeoutMs:3e4}),Ir=document.querySelector("#root");if(!Ir)throw new Error("Missing #root");var Ur=document.createElement("style");Ur.textContent=Or+wr;document.head.append(Ur);var p=(e,t="",r)=>{let s=document.createElement(e);return s.className=t,r!==void 0&&(s.textContent=r),s},fe=[],hn=[],me=null,W="zh-CN",te=!1,K=!1,Mr=!1,be=null,Lr=null,dt=0,_n=0,Nr="overview";var G=null,Sn=null,H=null,Ue="",pt="",he="",Oe=!1,Ce=null,uo=null,ut=!1,po="",Gr=()=>{Ce=null,To(!0)},Pr=()=>{Rr(_e,{id:"balance",name:"\u4F59\u989D"}).catch(e=>{uo=e.message,J()})};_e.onStatusControl(e=>{e.id==="refresh"?Gr():e.id==="manage"&&Pr()});var mt=e=>e instanceof l?e.code==="NO_SERVICE"?"\u8BF7\u5728\u8BBE\u7F6E \u2192 \u6269\u5C55\u4E2D\u5141\u8BB8\u201C\u4F59\u989D\u201D\u8FD0\u884C\u672C\u5730\u670D\u52A1\u3002":e.code==="SERVICE_FAILED"?"\u672C\u5730\u670D\u52A1\u5C1A\u672A\u5C31\u7EEA\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u6269\u5C55\u540E\u91CD\u8BD5\u3002":e.code==="HOST_TIMEOUT"?"\u67E5\u8BE2\u8017\u65F6\u8F83\u957F\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e.code==="DISABLED"?"\u4F59\u989D\u6269\u5C55\u5DF2\u505C\u7528\uFF0C\u8BF7\u5728\u6269\u5C55\u8BBE\u7F6E\u4E2D\u542F\u7528\u3002":"\u6682\u65F6\u65E0\u6CD5\u8FDE\u63A5\u672C\u5730\u670D\u52A1\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e instanceof Error?e.message:"\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",mo=async(e,t,r={})=>{let s=await _e.serviceRequest({method:e,path:t,...r.query?{query:r.query}:{},...r.body===void 0?{}:{body:JSON.stringify(r.body)}}),a;try{a=JSON.parse(s.body)}catch{throw new Error("\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u6570\u636E\uFF0C\u8BF7\u91CD\u8BD5\u3002")}if(!a||typeof a!="object"||Array.isArray(a))throw new Error("\u670D\u52A1\u8FD4\u56DE\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E\u3002");if(s.status>=400)throw new Error(typeof a.error=="string"?a.error:`\u8BF7\u6C42\u5931\u8D25\uFF08${s.status}\uFF09`);return a},xe=(e,t="warning")=>{let r=p("div","bx-notice",e);return r.dataset.tone=t,r.setAttribute("role",t==="error"?"alert":"status"),r},oe=p("main","ext bx");oe.setAttribute("aria-label","\u4F59\u989D\u4E0E\u989D\u5EA6");var Me=p("header","bx-top"),ud=p("div","bx-tabs"),Dr=p("div","bx-toolbar"),Hr=p("div","bx-meta"),$r=p("span","bx-count"),ft=p("span","bx-time");ft.setAttribute("role","status");Hr.append($r,ft);var Eo=p("div","bx-actions"),gn=D(Eo,{label:"\u5237\u65B0",variant:"ghost",size:"sm",onClick:Gr});D(Eo,{label:"\u7BA1\u7406",variant:"ghost",size:"sm",onClick:Pr});Dr.append(Hr,Eo);Me.append(Dr);var Pe=p("section","bx-view");Pe.id="balance-overview";Pe.setAttribute("aria-label","\u4F59\u989D\u603B\u89C8");var Re=p("div"),Ee=p("div"),Fr=p("p","bx-footer","\u4F59\u989D\u6309\u670D\u52A1\u5206\u522B\u663E\u793A\u3002\u70B9\u51FB\u5237\u65B0\uFF0C\u83B7\u53D6\u6700\u65B0\u6570\u636E\u3002");Pe.append(Re,Ee,Fr);var De=p("section","bx-view");De.id="balance-relays";De.setAttribute("aria-label","\u4E2D\u8F6C\u7AD9\u7BA1\u7406");var Xr=p("div"),Et=p("div","bx-management-head");Et.append(p("p","","\u7BA1\u7406\u7528\u4E8E\u67E5\u8BE2\u4F59\u989D\u7684\u8FDE\u63A5"));var Tn=D(Et,{label:"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9",size:"sm",onClick:()=>Rn("new")}),yn=p("div");Xr.append(Et,yn);var Br=p("div","bx-editor"),bo=p("div","bx-editor-head"),An=p("h2","bx-editor-title"),kn=D(bo,{label:"\u53D6\u6D88",variant:"ghost",size:"sm",onClick:()=>Cn()});bo.prepend(An);var vn=p("p","bx-editor-intro","\u586B\u5199\u8FDE\u63A5\u4FE1\u606F\uFF0C\u53EF\u5148\u6D4B\u8BD5\u518D\u4FDD\u5B58\u3002"),bt=p("form","bx-form");bt.noValidate=!0;bt.addEventListener("submit",e=>{e.preventDefault(),Un()});var xo=p("div","bx-field"),ho=p("div","bx-field"),xt=p("div","bx-field"),Le=we(xo,{label:"\u540D\u79F0",placeholder:"\u4F8B\u5982\uFF1A\u65E5\u5E38\u4F7F\u7528",value:"",onChange:e=>{Ue=e,Le.update({value:e,error:void 0}),re()}}),Ne=we(ho,{label:"\u670D\u52A1\u5730\u5740",placeholder:"https://relay.example.com",value:"",helper:"\u53EF\u7C98\u8D34\u7F51\u7AD9\u5730\u5740\u6216\u4EE5 /v1 \u7ED3\u5C3E\u7684 API \u5730\u5740\u3002",onChange:e=>{pt=e,Ne.update({value:e,error:void 0}),re()}}),Z=we(xt,{label:"API Key",placeholder:"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key",password:!0,mono:!0,value:"",onChange:e=>{he=e,Z.update({value:e,error:void 0}),re()}}),zr=p("div","bx-key-actions"),_o=D(zr,{label:"\u663E\u793A\u5BC6\u94A5",variant:"ghost",size:"xs",onClick:()=>{Oe=!Oe,Z.update({password:!Oe}),_o.update({label:Oe?"\u9690\u85CF\u5BC6\u94A5":"\u663E\u793A\u5BC6\u94A5"})}});xt.append(zr);var Ge=p("div"),So=p("div","bx-form-actions"),wn=D(So,{label:"\u6D4B\u8BD5\u8FDE\u63A5",variant:"outline",size:"sm",onClick:()=>{In()}}),go=p("span"),On=D(go,{label:"\u4FDD\u5B58",size:"sm",onClick:()=>{}});go.querySelector("button").type="submit";So.append(go);bt.append(xo,ho,xt,Ge,So);Br.append(bo,vn,bt);De.append(Xr,Br);oe.append(Pe);Ir.append(oe);var Ie=[xo,ho,xt].map((e,t)=>{let r=e.querySelector("input"),s=e.querySelector(".oc-sdk-field-note");return r.id=["relay-name","relay-url","relay-key"][t],r.name=r.id,r.setAttribute("aria-label",["\u540D\u79F0","\u670D\u52A1\u5730\u5740","API Key"][t]),r.autocomplete=t===2?"new-password":"off",r.spellcheck=!1,r.maxLength=[60,2048,4096][t],s.id=`${r.id}-hint`,r.setAttribute("aria-describedby",s.id),r});Ie[1].inputMode="url";var re=()=>{Ge.replaceChildren()},fo=()=>{let e=H!==null;Le.update({disabled:e}),Ne.update({disabled:e}),Z.update({disabled:e}),kn.update({disabled:e}),_o.update({disabled:e}),Tn.update({disabled:e||!!Lr||Mr}),wn.update({disabled:e,loading:H==="test",label:H==="test"?"\u6D4B\u8BD5\u4E2D\u2026":"\u6D4B\u8BD5\u8FDE\u63A5"}),On.update({disabled:e,loading:H==="save",label:H==="save"?"\u4FDD\u5B58\u4E2D\u2026":G==="new"?"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9":"\u4FDD\u5B58\u66F4\u6539"})};function Rn(e){H||(G=e,Sn=null,Ue=e==="new"?"":e.name,pt=e==="new"?"":e.baseUrl,he="",Oe=!1,Le.update({value:Ue,error:void 0}),Ne.update({value:pt,error:void 0}),Z.update({value:"",error:void 0,password:!0,placeholder:e==="new"?"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5",helper:e==="new"?"\u4FDD\u5B58\u540E\u4E0D\u4F1A\u663E\u793A\u5B8C\u6574\u5BC6\u94A5\u3002":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5\uFF1B\u66F4\u6362\u7AD9\u70B9\u65F6\u9700\u91CD\u65B0\u586B\u5199\u3002"}),_o.update({label:"\u663E\u793A\u5BC6\u94A5"}),re(),Nr="relays",J(),De.scrollTop=0,Ie[0].focus())}function Cn(){H||(G=null,he="",Z.update({value:"",password:!0}),re(),J(),Et.querySelector("button")?.focus())}var Vr=e=>{Le.update({error:void 0}),Ne.update({error:void 0}),Z.update({error:void 0});let t=null;e&&!Ue.trim()&&(Le.update({error:"\u4E3A\u8FD9\u4E2A\u8FDE\u63A5\u53D6\u4E00\u4E2A\u4FBF\u4E8E\u8BC6\u522B\u7684\u540D\u79F0\u3002"}),t=Ie[0]);let r="";try{r=ct(pt)}catch(a){Ne.update({error:mt(a)}),t??=Ie[1]}let s=G==="new";return r&&G&&G!=="new"&&(s=yr(G.baseUrl,r)),s&&!he.trim()&&(Z.update({error:G==="new"?"\u8BF7\u586B\u5199 API Key\u3002":"\u66F4\u6362\u7AD9\u70B9\u65F6\uFF0C\u8BF7\u586B\u5199\u65B0\u7AD9\u70B9\u7684 API Key\u3002"}),t??=Ie[2]),t?(t.focus(),null):{name:Ue.trim(),baseUrl:r,apiKey:he.trim(),...G&&G!=="new"?{id:G.id}:{}}};async function In(){if(H||!G)return;let e=Vr(!1);if(e){H="test",re(),fo();try{let t=await mo("POST","/relays/test",{body:e});if(t.ok!==!0)throw new Error(typeof t.error=="string"?t.error:"\u8FDE\u63A5\u672A\u6210\u529F\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u548C\u5BC6\u94A5\u3002");let r=t.balance,s=r&&j(r.value)!==null?` \xB7 \u53EF\u7528 ${lo(j(r.value),typeof r.unit=="string"?r.unit:"USD",W)}`:"";Ge.replaceChildren(xe(`\u8FDE\u63A5\u6210\u529F${s}\u3002\u5C1A\u672A\u4FDD\u5B58\u3002`,"success"))}catch(t){Ge.replaceChildren(xe(mt(t),"error"))}finally{H=null,fo()}}}async function Un(){if(H||!G)return;let e=Vr(!0);if(e){H="save",re(),fo();try{let t=await mo("POST","/relays",{body:e});_n+=1,Mr=!1,Mn(t),G=null,he="",Z.update({value:"",password:!0}),Nr="overview",Ce={text:`\u5DF2\u4FDD\u5B58\u201C${e.name}\u201D\u3002`,tone:"success"},J(),await To(!0)}catch(t){Ge.replaceChildren(xe(mt(t),"error"))}finally{H=null,J()}}}var Mn=e=>{if(!Array.isArray(e.relays))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u4E2D\u8F6C\u7AD9\u5217\u8868\uFF0C\u8BF7\u91CD\u8BD5\u3002");hn=e.relays.map(kr).filter(t=>t!==null),Lr=null};var Ln=()=>{let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("aria-hidden","true"),e.setAttribute("fill","currentColor"),e.setAttribute("class","bx-status-provider-icon");let t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("d","M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM12 15H18V17H12V15ZM8.66685 12L5.83842 9.17157L7.25264 7.75736L11.4953 12L7.25264 16.2426L5.83842 14.8284L8.66685 12Z"),e.append(t),e},Nn=e=>!e||!Number.isFinite(e)||e<=Date.now()?null:new Intl.DateTimeFormat(W,{month:"long",day:"numeric",weekday:"short",hour:"numeric",minute:"2-digit",hourCycle:"h23"}).format(e),Cr=(e,t,r={})=>{let s=p("div","bx-status-row");r.title&&(s.title=r.title);let a=p("span","bx-status-label-wrap");a.append(p("span","bx-status-label",e)),r.reset&&a.append(p("span","bx-status-reset",r.reset));let u=p("span","bx-status-value",t);return r.tone&&(u.dataset.tone=r.tone),r.muted&&(u.dataset.muted="true"),s.append(a,u),s},Gn=e=>{let t=p("article","bx-status-provider");t.setAttribute("aria-label",e.name);let r=p("div","bx-status-row bx-status-provider-head"),s=p("span","bx-status-name-wrap");e.id==="command-code"&&s.append(Ln()),s.append(p("span","bx-status-name",e.name)),e.plan&&s.append(p("span","bx-status-plan",e.plan)),r.append(s),t.append(r);for(let x of e.windows){let y=vr(x.resetAt,W),I=Nn(x.resetAt),U=x.usedPercent>=80?"error":x.usedPercent>=50?"warning":void 0;t.append(Cr(x.label,`${Math.round(x.usedPercent)}%`,{reset:I??void 0,tone:U,title:[x.detail,y].filter(Boolean).join(" \xB7 ")||void 0}))}let a=e.balance;if(!!(a&&a.value!==null&&!(e.id==="command-code"&&e.windows.length>0))&&a&&t.append(Cr("\u989D\u5EA6\u4F59\u989D",lo(a.value,a.unit,W),{title:e.stale?"\u4E0A\u6B21\u6210\u529F\u67E5\u8BE2\u7684\u4F59\u989D":void 0})),e.ok)!e.balance&&!e.windows.length&&t.append(p("div","bx-status-row bx-status-muted","\u5DF2\u8FDE\u63A5\uFF0C\u4F46\u63A5\u53E3\u6682\u672A\u63D0\u4F9B\u4F59\u989D\u6216\u989D\u5EA6\u3002"));else{let x=p("div","bx-status-row bx-status-error",e.error??"\u67E5\u8BE2\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u3002");x.setAttribute("role","alert"),e.stale&&e.updatedAt&&(x.title=`\u4EE5\u4E0A\u4E3A ${lt(e.updatedAt,W,!0)} \u7684\u6210\u529F\u7ED3\u679C\u3002`),t.append(x)}return t};var Pn=(e,t,r,s="\u6DFB\u52A0\u4E2D\u8F6C\u7AD9")=>{let a=p("div","bx-empty");return a.append(p("h2","",e),p("p","",t)),r&&D(a,{label:s,size:"sm",onClick:r}),a};var Dn=()=>{if(!ut)return;let e=[{kind:"button",id:"refresh",label:"\u5237\u65B0",disabled:K||!te},{kind:"button",id:"manage",label:"\u7BA1\u7406",disabled:!te}],t=JSON.stringify(e);t!==po&&(po=t,_e.setStatusControls(e).catch(()=>{ut=!1,po="",Me.isConnected||oe.prepend(Me)}))};function J(){let e=fe.filter(t=>!t.ok).length;if($r.textContent="",ft.textContent=K?"\u6B63\u5728\u66F4\u65B0\u2026":me?`\u66F4\u65B0\u4E8E ${lt(me,W,new Date(me).toDateString()!==new Date().toDateString())}`:"",ft.title=me?new Date(me).toLocaleString(W):"",gn.update({loading:K,disabled:!te,label:K?"\u5237\u65B0\u4E2D":"\u5237\u65B0"}),Pe.hidden=!1,De.hidden=!0,Fr.hidden=!0,Ee.setAttribute("aria-busy",String(K)),Re.replaceChildren(),uo&&Re.append(xe(uo)),Ce&&Re.append(xe(Ce.text,Ce.tone)),be&&Re.append(xe(`${be}${fe.length?" \u5DF2\u4FDD\u7559\u4E0A\u6B21\u663E\u793A\u7684\u6570\u636E\u3002":""}`,"error")),Ee.replaceChildren(),!te||K&&!fe.length){let t=p("div","bx-loading");co(t,{label:te?"\u6B63\u5728\u67E5\u8BE2\u4F59\u989D\u2026":"\u6B63\u5728\u8FDE\u63A5 OpenChamber\u2026"}),Ee.append(t)}else fe.length?Ee.append(...fe.map(Gn)):Ee.append(Pn(be?"\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u4F59\u989D":"\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u4F59\u989D",be?"\u70B9\u51FB\u5237\u65B0\u91CD\u8BD5\uFF0C\u6216\u68C0\u67E5\u6269\u5C55\u7684\u672C\u5730\u670D\u52A1\u6743\u9650\u3002":"\u5728 OpenCode \u914D\u7F6E Command Code\u3001StepFun\uFF0C\u6216\u6DFB\u52A0\u4E2D\u8F6C\u7AD9\u3002",void 0));Dn()}async function To(e=!1){if(K&&!e)return;let t=++dt;K=!0,be=null,J();try{let r=await mo("GET","/balances",e?{query:{refresh:"1"}}:{});if(t!==dt)return;if(!Array.isArray(r.providers))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u6709\u6548\u7684\u4F59\u989D\u5217\u8868\u3002");fe=r.providers.map(Ar).filter(s=>s!==null),me=j(r.fetchedAt)}catch(r){t===dt&&(be=mt(r))}finally{t===dt&&(K=!1,J())}}_e.onReady(e=>{if(Qt(e,document.documentElement),W=e.locale.startsWith("zh")?e.locale:"zh-CN",document.documentElement.lang=W,ut=e.features?.statusControls===!0,!ut&&!Me.isConnected&&oe.prepend(Me),te){J();return}te=!0,To()});{let e=-1;new ResizeObserver(()=>{let t=Math.ceil(oe.getBoundingClientRect().height);t>0&&t!==e&&(e=t,_e.setHeight(t).catch(()=>{}))}).observe(oe)}J();})();
