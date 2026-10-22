"use strict";(()=>{var b="openchamber.sdk";var nt="data-oc-scrolling",Ut=`
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
:hover, [${nt}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${nt}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${nt}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${nt}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function Mt(e){let t=e.documentElement;if(t.hasAttribute("data-oc-scrollbar-activity"))return;t.setAttribute("data-oc-scrollbar-activity","");let r=new WeakMap;e.addEventListener("scroll",s=>{let a=s.target===e?t:s.target;if(!(a instanceof Element))return;a.hasAttribute("data-oc-scrolling")||a.setAttribute("data-oc-scrolling","");let c=r.get(a);c!==void 0&&clearTimeout(c),r.set(a,setTimeout(()=>{r.delete(a),a.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var on=`(${Mt.toString()})(document);`;var Yo=/^[a-z][a-z0-9-]{0,39}$/;var Ko=e=>Object(e)===e&&!Array.isArray(e),Lt=(e,t)=>Object.keys(e).every(r=>t.includes(r)),Wo=e=>String(e)===e&&e.length>=1&&e.length<=60,Jo=e=>String(e)===e&&e.length>=1&&e.length<=80,qo=e=>{if(!Array.isArray(e)||e.length>4)return!1;let t=new Set;for(let r of e){if(!Ko(r)||!Yo.test(r.id)||!Wo(r.label)||r.disabled!==void 0&&r.disabled!==!0&&r.disabled!==!1||t.has(r.id))return!1;if(t.add(r.id),r.kind==="button"){if(!Lt(r,["kind","id","label","disabled"]))return!1;continue}if(r.kind!=="select"||!Lt(r,["kind","id","label","value","options","disabled"])||!Jo(r.value)||!Array.isArray(r.options)||r.options.length<1||r.options.length>16)return!1;let s=new Set;for(let a of r.options){if(!Ko(a)||!Lt(a,["value","label"])||!Jo(a.value)||!Wo(a.label)||s.has(a.value))return!1;s.add(a.value)}if(!s.has(r.value))return!1}return!0};var Nt=e=>"bytes"in e?e.bytes.byteLength:e.content.length,Qo=(e,t)=>{if(e.path!==t.path||e.readOnly!==t.readOnly)return!1;if(e.encoding==="text"||t.encoding==="text")return e.encoding==="text"&&t.encoding==="text"&&e.content===t.content;if(e.bytes.byteLength!==t.bytes.byteLength)return!1;for(let r=0;r<e.bytes.byteLength;r+=1)if(e.bytes[r]!==t.bytes[r])return!1;return!0};var Zo=/^[A-Za-z0-9_-]{1,80}$/;var er=["left","right","top","bottom"];var tr=(e,t=0,r={remaining:16e3})=>{if(--r.remaining<0||t>=32)return!1;if(e===null)return!0;let s=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let a of s)if(!tr(a,t+1,r))return!1;return!0},Gt=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(t=>/^(0|[1-9]\d*)$/.test(t)&&Number(t)<e.length)&&e.every(Gt);if(Object(e)===e){let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype)&&Object.values(e).every(Gt)}return String(e)===e||Number.isFinite(e)},Pt=e=>{try{return String(e.id)!==e.id||!Zo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!er.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!tr(e.data)||!Gt(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var rr=["file","directory","other","missing"],Ht=e=>!!(e&&"sessionId"in e),$t=e=>!!(e&&"sent"in e&&!("sessionId"in e));var nr=/^[0-9a-f]{7,64}$/i,Ft=e=>nr.test(e),st=500,at=32e3,sr=16e3,ar=128,ir=200,cr=2e3,lr=16e3,dr=80,pr=200,ur=16e3;var fr=2e3;var Xt=2e4,it=1024,ct=2e6;var lt=64e3,dt=8e3,Bt=4e3;var zt=96e4,rn=60*6e4;var mr=999,Er=1e4,Pe=500,xr=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],br=["stopped","starting","ready","failed"],nn=new Set(xr),hr=e=>nn.has(e),_r=e=>e&&hr(e)?e:"HOST_REJECTED",me=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(me):Object(e)===e?Object.values(e).every(me):!1,Sr=e=>me(e)&&JSON.stringify(e).length<=ur,or=e=>e?.trim().slice(0,pr)??"",Ee=e=>{let t=e.id.trim().slice(0,ar),r=e.title.trim().slice(0,ir),s=e.url.trim().slice(0,cr),a=e.text?.trim().slice(0,lr),c=e.author?.trim().slice(0,dr),u=e.kind==="pull"?"pull":"issue",x={providerId:e.providerId.trim(),id:t,title:r||t,url:s,kind:u};if(a&&(x.text=a),c&&(x.author=c),u==="pull"){let _=or(e.branches?.head),I=or(e.branches?.base);_&&I&&(x.branches={head:_,base:I})}return Sr(e.data)&&(x.data=e.data),x},Vt=e=>{let t=Ee(e);return e.projectId&&(t.projectId=e.projectId),e.navigation&&(t.navigation=e.navigation),e.worktree&&(t.worktree=e.worktree),t},jt=e=>{let t={text:e.text.trim().slice(0,sr)};return e.send&&(t.send=!0),t},Kt=e=>e===null||!Number.isFinite(e)?null:Math.min(mr,Math.max(0,Math.round(e))),Wt=e=>Number.isFinite(e)?Math.min(Er,Math.max(0,Math.ceil(e))):0;var xe=e=>e.length>0&&e.length<=it&&!e.includes("\0")&&!e.includes("\\");var pt=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>fr?!1:!e.split("/").some(r=>r==="."||r===".."),sn=new Set(br),Jt=e=>!!(e&&"status"in e&&sn.has(String(e.status))&&!("body"in e)),ut=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),Yt=e=>!!(e&&"content"in e&&String(e.content)===e.content),qt=e=>!!(e&&"written"in e&&e.written===!0),Qt=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),an=new Set(rr),Zt=e=>!!(e&&"kind"in e&&"size"in e&&an.has(String(e.kind))&&Number.isFinite(e.size)),eo=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),cn=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),ln=e=>Object(e)===e?e:null,Dt=e=>String(e)===e&&e.length>0,dn=e=>{if(!Dt(e.id))return null;if(e.ok===!0){let t={channel:b,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(t.payload=e.payload),t}return e.ok===!1&&Dt(e.error)?{channel:b,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:_r(Dt(e.code)?e.code:void 0)}:null},to=e=>{let t=ln(e);return!t||t.channel!==b||t.v!==1?null:t.type==="result"?dn(t):!cn.has(String(t.type))||Object(t.payload)!==t.payload?null:t};var gr=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,pn=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",p=class extends Error{code;constructor(t,r){super(r),this.name="HostRequestError",this.code=t}},Tr=()=>Promise.reject(new p("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ft=()=>Promise.reject(new p("BAD_PATH",`File path must be 1 to ${it} characters without NUL or backslash.`)),mt=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new p("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},E=e=>(e.value+=1,`oc-${e.value}`),ao=(e={})=>{let t=e.target??("window"in globalThis?window:null);if(!t)throw new p("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let r=e.acceptSource??(o=>o===t.parent),s=e.requestTimeoutMs??Xt,a=new Set,c=new Set,u=new Set,x=new Set,_=new Set,I=new Set,X=new Set,qe=new Set,Qe=new Set,de=new Set,wt=[],Ie=null,Ue=null,Ze=new Set,et=new Set,Me=null,Le=null,Ot=!1,pe=new Map,ue=new Map,fe=new Map,z=!1,m={value:0},f=null,j=null,Ne=!1,Ge=!1,No=null,Go=o=>o?{sessionId:o.id,phase:o.busy?"started":"completed"}:null,H=o=>{t.parent.postMessage(o,"*")},Po=()=>{z||t.parent===t||de.size===0||f?.features?.lateGenerateResults!==!0||H({channel:b,v:1,type:"generate-late-listen"})},k=(o,n)=>{for(let l of o)try{l(n)}catch(d){console.error(d)}},Do=o=>{if(!(o instanceof MessageEvent)||!r(o.source))return;let n=to(o.data);if(!n)return;if(n.type==="workspace"){let d=ue.get(n.payload.subscriptionId);d&&k([d],n.payload.snapshot);return}if(n.type==="shells"){let d=fe.get(n.payload.subscriptionId);d&&k([d],n.payload.snapshot);return}if(n.type==="ready"){f=n.payload,j=Go(n.payload.session),k(a,n.payload),k(c,n.payload.directory),k(u,n.payload.session),j&&k(x,j),k(_,n.payload.connection),k(I,n.payload.settings),k(X,n.payload.item),Po();return}if(n.type==="generate-late"){de.size===0?wt.push(n.payload):k(de,n.payload);return}if(n.type==="directory"){f&&(f={...f,directory:n.payload.directory}),k(c,n.payload.directory);return}if(n.type==="session"){f&&(f={...f,session:n.payload.session}),n.payload.session?j?.sessionId!==n.payload.session.id&&(j=Go(n.payload.session)):j=null,k(u,n.payload.session);return}if(n.type==="session-lifecycle"){j=n.payload,k(x,n.payload);return}if(n.type==="connection"){f&&(f={...f,connection:n.payload.connection}),k(_,n.payload.connection);return}if(n.type==="settings"){f&&(f={...f,settings:n.payload.settings}),k(I,n.payload.settings);return}if(n.type==="item"){f&&(f={...f,item:n.payload.item}),k(X,n.payload.item);return}if(n.type==="status-control-event"){k(qe,n.payload);return}if(n.type==="popover-closed"){k(Qe,n.payload);return}if(n.type==="action"){let d=g=>{z||H({channel:b,v:1,type:"action-result",id:n.id,payload:g})},T=Ue;if(!T){d({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>T(n.payload)).then(()=>d({ok:!0}),g=>{let R=(g instanceof Error?g.message:String(g)).trim();d({ok:!1,error:(R||"Action failed.").slice(0,Pe)})});return}if(n.type==="file-open"){let d=n.payload;if(Le&&Qo(Le,d))return;Le=d,k(Ze,n.payload);return}if(n.type==="file-saved"){k(et,n.payload.version);return}if(n.type==="file-snapshot"){let d=R=>{z||H({channel:b,v:1,type:"file-snapshot-result",id:n.id,payload:R})},T=R=>d({error:(R.trim()||"Could not read the edited file.").slice(0,Pe)}),g=Me;if(!g){T("This extension does not edit files.");return}Promise.resolve().then(()=>g(n.payload.purpose)).then(R=>{if(Nt(R)>2e7){T(`The file is over ${2e7} ${"bytes"in R?"bytes":"characters"}.`);return}if(R.version.length>256){T(`The snapshot version is over ${256} characters.`);return}d({snapshot:"bytes"in R?{bytes:R.bytes,version:R.version}:{content:R.content,version:R.version}})},R=>T(R instanceof Error?R.message:String(R)));return}if(n.type==="resolve"){let d=g=>{H({channel:b,v:1,type:"resolve-result",id:n.id,payload:g})},T=Ie;if(!T){d({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>T(n.payload)).then(g=>d({item:g?Ee(g):null}),g=>{let R=(g instanceof Error?g.message:String(g)).trim();d({error:(R||"Command failed.").slice(0,Pe)})});return}let l=pe.get(n.id);if(l){if(clearTimeout(l.timer),pe.delete(n.id),n.ok){l.resolve(n.payload);return}l.reject(new p(n.code,n.error))}};t.addEventListener("message",Do),H({channel:b,v:1,type:"hello"});let G=(o,n=s)=>z||t.parent===t?Promise.reject(new p("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((l,d)=>{let T=setTimeout(()=>{pe.delete(o.id),d(new p("HOST_TIMEOUT","Host did not answer in time."))},n);pe.set(o.id,{resolve:l,reject:d,timer:T}),H(o)}),w=o=>G(o).then(()=>{}),O={channel:b,v:1},Rt=o=>{!z&&t.parent!==t&&H(o)},Ho=()=>Rt({...O,type:"file-save"}),$o=o=>{!gr(o)||!pn(o)||(o.preventDefault(),Ho())},Fo=o=>{!gr(o)||o.key!=="Escape"||f?.surface!=="popover"||!f.popover||(o.preventDefault(),Vo(f.popover.id,"escape").catch(()=>{}))},tt=()=>{let o=f?.surface==="popover"?f.popover:void 0;if(!o)return;let n=Ne||Ge;No!==n&&(No=n,jo(o.id,n).catch(()=>{}))},ot=()=>{f?.surface!=="popover"||Ne||(Ne=!0,tt())},Xo=o=>{f?.surface!=="popover"||o.relatedTarget!==null||!Ne||(Ne=!1,tt())},Bo=()=>{f?.surface!=="popover"||Ge||(Ge=!0,tt())},zo=()=>{f?.surface!=="popover"||!Ge||(Ge=!1,tt())},B=(o,n=1024)=>{if(!o.trim()||o.length>n)throw new p("HOST_REJECTED",`Identity must contain 1 to ${n} characters.`)},Ct=async o=>{o.kind!=="projects"&&B(o.projectId);let n=await G({...O,type:"workspace-read",id:E(m),payload:o});if(!n||!("kind"in n)||!("state"in n)||n.kind!==o.kind)throw new p("HOST_REJECTED","Host did not return workspace data.");return n},It=async(o,n)=>{o.kind!=="projects"&&B(o.projectId);let l=E(m);ue.set(l,n);try{await w({...O,type:"workspace-subscribe",id:E(m),payload:{subscriptionId:l,query:o}})}catch(d){throw ue.delete(l),z||H({...O,type:"workspace-unsubscribe",id:E(m),payload:{subscriptionId:l}}),d}return()=>{!ue.delete(l)||z||H({...O,type:"workspace-unsubscribe",id:E(m),payload:{subscriptionId:l}})}},tn=async(o,n)=>{o.kind==="session"&&B(o.sessionId),o.kind==="project"&&B(o.projectId);let l=E(m);fe.set(l,n);try{await w({...O,type:"shells-subscribe",id:E(m),payload:{subscriptionId:l,scope:o}})}catch(d){throw fe.delete(l),z||H({...O,type:"shells-unsubscribe",id:E(m),payload:{subscriptionId:l}}),d}return()=>{!fe.delete(l)||z||H({...O,type:"shells-unsubscribe",id:E(m),payload:{subscriptionId:l}})}},rt=async o=>{if("key"in o&&(o.key.length===0||o.key.length>128))throw new p("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(o.op==="set"&&!me(o.value))throw new p("HOST_REJECTED","Storage values must be JSON.");if(o.op==="set"&&new TextEncoder().encode(JSON.stringify(o.value)).length>65536)throw new p("HOST_REJECTED","Storage value exceeds 64 KiB.");if(o.scope==="device"&&f?.features?.deviceStorage!==!0)throw new p("UNSUPPORTED","This host does not support device storage.");let n=await G({...O,type:"storage",id:E(m),payload:o});if(!n||!("storage"in n)||n.op!==o.op)throw new p("HOST_REJECTED","Host did not return storage data.");return n},Vo=(o,n)=>f?.features?.popovers!==!0&&!(f?.surface==="popover"&&f.popover?.id===o)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):w({...O,type:"popover-close",id:E(m),payload:n?{id:o,reason:n}:{id:o}}),jo=(o,n)=>f?.features?.popovers!==!0&&!(f?.surface==="popover"&&f.popover?.id===o)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):w({...O,type:"popover-anchor",id:E(m),payload:{id:o,active:n}});return t.addEventListener("keydown",Fo,!0),t.addEventListener("pointerover",ot),t.addEventListener("pointermove",ot),t.addEventListener("pointerout",Xo),t.addEventListener("focus",Bo),t.addEventListener("blur",zo),{onAction:o=>(Ue=o,()=>{Ue===o&&(Ue=null)}),listProjects:async()=>{let o=await Ct({kind:"projects"});if(o.kind!=="projects")throw new p("HOST_REJECTED","Expected projects.");return o},listWorktrees:async o=>{let n=await Ct({kind:"worktrees",projectId:o});if(n.kind!=="worktrees")throw new p("HOST_REJECTED","Expected worktrees.");return n},listSessions:async o=>{let n=await Ct({kind:"sessions",projectId:o});if(n.kind!=="sessions")throw new p("HOST_REJECTED","Expected sessions.");return n},onProjects:o=>It({kind:"projects"},n=>{n.kind==="projects"&&o(n)}),onWorktrees:(o,n)=>It({kind:"worktrees",projectId:o},l=>{l.kind==="worktrees"&&n(l)}),onSessions:(o,n)=>It({kind:"sessions",projectId:o},l=>{l.kind==="sessions"&&n(l)}),onRunningShells:(o,n)=>tn(o,n),readShellOutput:async(o,n)=>{B(o,128);let l=n?.cursor;if(l!==void 0&&(!Number.isInteger(l)||l<0))throw new p("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let d=n?.tailBytes;if(d!==void 0&&(!Number.isInteger(d)||d<1||d>65536))throw new p("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let g=await G({...O,type:"shell-output",id:E(m),payload:{shellId:o,cursor:l,tailBytes:d}});if(!g||typeof g.output!="string"||!Number.isFinite(g.cursor))throw new p("HOST_REJECTED","Host did not return shell output.");return g},stopShell:async o=>{if(B(o,128),(await G({...O,type:"shell-stop",id:E(m),payload:{shellId:o}}))?.stopped!==!0)throw new p("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async o=>{B(o),await w({...O,type:"open-session",id:E(m),payload:{sessionId:o}})},storage:{get:async(o,n)=>{let l=mt(n),d={op:"get",key:o};l&&(d.scope=l);let T=await rt(d);return T.op==="get"&&T.found?T.value:void 0},set:async(o,n,l)=>{let d=mt(l),T={op:"set",key:o,value:n};d&&(T.scope=d),await rt(T)},delete:async(o,n)=>{let l=mt(n),d={op:"delete",key:o};l&&(d.scope=l),await rt(d)},keys:async o=>{let n=mt(o),l={op:"keys"};n&&(l.scope=n);let d=await rt(l);if(d.op!=="keys")throw new p("HOST_REJECTED","Expected storage keys.");return d.keys}},onReady:o=>(a.add(o),f&&o(f),()=>{a.delete(o)}),onDirectory:o=>(c.add(o),f&&o(f.directory),()=>{c.delete(o)}),onSession:o=>(u.add(o),f&&o(f.session),()=>{u.delete(o)}),onSessionLifecycle:o=>(x.add(o),j&&o(j),()=>{x.delete(o)}),onConnection:o=>(_.add(o),f&&o(f.connection),()=>{_.delete(o)}),onSettings:o=>(I.add(o),f&&o(f.settings),()=>{I.delete(o)}),onItem:o=>(X.add(o),f&&o(f.item),()=>{X.delete(o)}),onStatusControl:o=>(qe.add(o),()=>{qe.delete(o)}),onPopoverClosed:o=>(Qe.add(o),()=>{Qe.delete(o)}),setStatusControls:o=>f?.features?.statusControls!==!0?Promise.reject(new p("UNSUPPORTED","This host does not support status controls.")):qo(o)?w({...O,type:"status-controls",id:E(m),payload:{controls:o}}):Promise.reject(new p("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:o=>f?.features?.popovers!==!0?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):Pt(o)?w({...O,type:"popover-open",id:E(m),payload:o}):Promise.reject(new p("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:Vo,setPopoverAnchorActive:jo,onResolve:o=>(Ie=o,()=>{Ie===o&&(Ie=null)}),toast:o=>{let n=o.message.trim();return!n||n.length>st?Promise.reject(new p("HOST_REJECTED",`Toast message must contain 1 to ${st} characters.`)):o.copy&&o.copy!==!0&&(!o.copy.text.length||o.copy.text.length>at)?Promise.reject(new p("HOST_REJECTED",`Toast copy text must contain 1 to ${at} characters.`)):w({channel:b,v:1,type:"toast",id:E(m),payload:{...o,message:n}})},openUrl:o=>w({channel:b,v:1,type:"open-url",id:E(m),payload:{url:o}}),openCommit:o=>Ft(o)?w({channel:b,v:1,type:"open-commit",id:E(m),payload:{sha:o}}):Promise.reject(new p("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:o=>w({channel:b,v:1,type:"open-surface",id:E(m),payload:{surfaceId:o}}),writeClipboard:o=>w({channel:b,v:1,type:"clipboard-write",id:E(m),payload:{text:o}}),compose:o=>w({channel:b,v:1,type:"compose",id:E(m),payload:o}),attach:o=>w({channel:b,v:1,type:"attach",id:E(m),payload:Ee(o)}),startSession:async o=>{o.projectId!==void 0&&B(o.projectId);let n=o.worktree;n&&n!==!0&&(n.kind==="existing"?B(n.directory):(n.name!==void 0&&B(n.name,200),n.baseBranch!==void 0&&B(n.baseBranch,200)));let l=await G({channel:b,v:1,type:"start-session",id:E(m),payload:Vt(o)},e.requestTimeoutMs??18e4);if(!Ht(l))throw new p("HOST_REJECTED","Host did not return a session.");return l},prompt:o=>G({channel:b,v:1,type:"prompt",id:E(m),payload:jt(o)}).then(n=>{if(!$t(n))throw new p("HOST_REJECTED","Host did not return a prompt result.");return n}),sessionLink:o=>w({channel:b,v:1,type:"session-link",id:E(m),payload:Ee(o)}),close:()=>w({channel:b,v:1,type:"close",id:E(m)}),oauthStart:()=>w({channel:b,v:1,type:"oauth-start",id:E(m)}),oauthDisconnect:()=>w({channel:b,v:1,type:"oauth-disconnect",id:E(m)}),request:o=>(pt(o.path)?G({channel:b,v:1,type:"request",id:E(m),payload:o}):Tr()).then(n=>{if(!ut(n))throw new p("HOST_REJECTED","Host request result was empty.");return n}),serviceRequest:o=>(pt(o.path)?G({channel:b,v:1,type:"service-request",id:E(m),payload:o}):Tr()).then(n=>{if(!ut(n))throw new p("HOST_REJECTED","Host service request result was empty.");return n}),serviceStatus:()=>G({channel:b,v:1,type:"service-status",id:E(m)}).then(o=>{if(!Jt(o))throw new p("HOST_REJECTED","Host did not return service status.");return o}),readFile:o=>(xe(o)?G({channel:b,v:1,type:"file-read",id:E(m),payload:{path:o}}):ft()).then(n=>{if(!Yt(n))throw new p("HOST_REJECTED","Host did not return file content.");return n}),writeFile:(o,n)=>xe(o)?n.length>ct?Promise.reject(new p("FILE_TOO_LARGE",`Content is over ${ct} characters.`)):G({channel:b,v:1,type:"file-write",id:E(m),payload:{path:o,content:n}}).then(l=>{if(!qt(l))throw new p("HOST_REJECTED","Host did not confirm the write.");return l}):ft(),listDir:o=>(xe(o)?G({channel:b,v:1,type:"file-list",id:E(m),payload:{path:o}}):ft()).then(n=>{if(!Qt(n))throw new p("HOST_REJECTED","Host did not return directory entries.");return n}),stat:o=>(xe(o)?G({channel:b,v:1,type:"file-stat",id:E(m),payload:{path:o}}):ft()).then(n=>{if(!Zt(n))throw new p("HOST_REJECTED","Host did not return file status.");return n}),generate:o=>{let n=o.prompt.trim(),l=o.system?.trim();if(n.length===0||n.length>lt)return Promise.reject(new p("HOST_REJECTED",`Prompt must be 1 to ${lt} characters.`));if(l!==void 0&&(l.length===0||l.length>dt))return Promise.reject(new p("HOST_REJECTED",`System prompt must be 1 to ${dt} characters.`));let d=o.maxOutputTokens===void 0?void 0:Math.min(Bt,Math.max(1,Math.floor(o.maxOutputTokens)));if(d!==void 0&&!Number.isFinite(d))return Promise.reject(new p("HOST_REJECTED","maxOutputTokens must be a number."));let T={prompt:n};return l!==void 0&&(T.system=l),d!==void 0&&(T.maxOutputTokens=d),G({channel:b,v:1,type:"generate",id:E(m),payload:T},e.requestTimeoutMs??zt).then(g=>{if(!eo(g))throw new p("HOST_REJECTED","Host did not return generated text.");return g})},onLateGenerateResult:o=>{de.add(o);for(let n of wt.splice(0))k([o],n);return Po(),()=>{de.delete(o)}},setBadge:o=>w({channel:b,v:1,type:"badge",id:E(m),payload:{count:Kt(o)}}),setHeight:o=>w({channel:b,v:1,type:"resize",id:E(m),payload:{height:Wt(o)}}),onFileOpen:o=>(Ze.add(o),Ot||(Ot=!0,t.addEventListener("keydown",$o,!0)),Le&&o(Le),()=>{Ze.delete(o)}),onFileSnapshot:o=>(Me=o,()=>{Me===o&&(Me=null)}),onFileSaved:o=>(et.add(o),()=>{et.delete(o)}),reportFileChange:o=>Rt({...O,type:"file-change",payload:{dirty:o.dirty,edited:o.edited}}),requestFileSave:Ho,reportFileUnsupported:()=>Rt({...O,type:"file-unsupported"}),dispose:()=>{for(let o of ue.keys())H({...O,type:"workspace-unsubscribe",id:E(m),payload:{subscriptionId:o}});ue.clear();for(let o of fe.keys())H({...O,type:"shells-unsubscribe",id:E(m),payload:{subscriptionId:o}});fe.clear(),z=!0,Ie=null,Ue=null,Me=null,Ze.clear(),et.clear(),Ot&&t.removeEventListener("keydown",$o,!0),t.removeEventListener("message",Do),t.removeEventListener("keydown",Fo,!0),t.removeEventListener("pointerover",ot),t.removeEventListener("pointermove",ot),t.removeEventListener("pointerout",Xo),t.removeEventListener("focus",Bo),t.removeEventListener("blur",zo);for(let o of pe.values())clearTimeout(o.timer),o.reject(new p("HOST_UNAVAILABLE","Host client was disposed."));pe.clear(),a.clear(),c.clear(),u.clear(),x.clear(),_.clear(),I.clear(),X.clear(),qe.clear(),Qe.clear(),de.clear(),wt.length=0}}};var kr=["browser.open","browser.snapshot","browser.click","browser.type","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var cs=new Set(kr);var vr=["none","agent","user"];var ds=new Set(vr);var un=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],fn=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],wr=(e,t)=>{t.style.colorScheme=e.mode;for(let[r,s]of un)t.style.setProperty(r,e.tokens[s]);for(let[r,s,a]of fn){let c=e.tokens[a]??"";t.style.setProperty(r,c),t.style.setProperty(s,c)}t.style.setProperty("font-family",e.tokens.font),t.style.setProperty("font-size","0.875rem"),t.style.setProperty("line-height","1.45"),t.style.setProperty("color",e.tokens.foreground)},io=(e,t)=>{wr(e.theme,t),t.dataset&&(t.dataset.ocSurface=e.surface,t.dataset.ocTheme=e.theme.mode)};var mn={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},A=(e,t)=>`var(--${e}, var(--oc-${mn[e]}, ${t}))`,W=A("surface-background","transparent"),xt=A("surface-elevated","transparent"),be=A("surface-elevated-foreground","inherit"),F=A("surface-foreground","inherit"),y=A("surface-muted-foreground","gray"),En=A("surface-muted","transparent"),te=A("interactive-border","currentColor"),P=A("interactive-hover","transparent"),se=A("interactive-active","transparent"),co=A("interactive-selection","transparent"),lo=A("interactive-selection-foreground","inherit"),K=A("primary","currentColor"),po=A("primary-text","inherit"),uo=A("error-text","inherit"),xn=A("font-sans","inherit"),fo=A("font-mono","monospace"),Ur=A("radius","9px"),mo=`calc(${Ur} - 2px)`,Or=`calc(${Ur} - 4px)`,v=(e,t,r="transparent")=>`color-mix(in srgb, ${e} ${t}%, ${r})`,Rr=`background-image: linear-gradient(${P}, ${P});`,Eo=e=>`box-shadow: inset 0 0 0 1px ${e}, var(--oc-sdk-field-lift);`,xo="box-shadow: inset 0 0 0 1px var(--oc-sdk-edge), var(--oc-sdk-raised-lift);",Cr="box-shadow: var(--oc-sdk-lit);",Ir=`inset 0 1px 0 0 ${v(F,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2)`,bn=`
:root {
  --oc-sdk-edge: ${v(F,10)};
  --oc-sdk-field-bg: ${xt};
  --oc-sdk-raised-bg: ${W};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 2px 0 rgb(0 0 0 / 0.06);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.45), 0 1px 2px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.8), inset 0 0 0 1px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.1), 0 1px 2px -0.5px rgb(0 0 0 / 0.08), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.08);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${v(F,6)};
  --oc-sdk-field-bg: ${v(W,50,xt)};
  --oc-sdk-raised-bg: ${xt};
  --oc-sdk-field-lift: ${Ir};
  --oc-sdk-raised-lift: ${Ir};
  --oc-sdk-lit: inset 0 1px 0 0 ${v(F,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.06), inset 0 0 0 1px rgb(255 255 255 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.36), 0 1px 1px -0.5px rgb(0 0 0 / 0.22), 0 3px 3px -1.5px rgb(0 0 0 / 0.2), 0 6px 6px -3px rgb(0 0 0 / 0.16);
}`,Et=e=>{let t=A(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${t}; --oc-sdk-tone-text: ${A(`${e}-text`,"inherit")}; }`},hn=`
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
`,Mr=`${bn}
.oc-sdk { color: ${F}; font-family: ${xn}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Rr} }
.oc-sdk-mono { font-family: ${fo}; }
.oc-sdk-muted { color: ${y}; }
${Et("success")}${Et("warning")}${Et("error")}${Et("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${K}; --oc-sdk-tone-text: ${po}; }

.oc-sdk-btn { border-radius: ${mo}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Or}; }
.oc-sdk-btn[data-variant="default"] { color: ${po}; background: ${v(K,10,W)}; border-color: ${v(K,12)}; ${Cr} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${v(K,16,W)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${v(K,22,W)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${En}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${se}, ${se}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${be}; border-color: transparent; ${xo} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${se}, ${se}); box-shadow: inset 0 0 0 1px var(--oc-sdk-edge); }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${P}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${se}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${A("status-error","red")}; color: ${uo}; background: ${v("var(--oc-sdk-tone)",7,W)}; border-color: ${v("var(--oc-sdk-tone)",12)}; ${Cr} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${v("var(--oc-sdk-tone)",9,W)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${v("var(--oc-sdk-tone)",11,W)}; box-shadow: none; }

.oc-sdk-field-note { color: ${y}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${uo}; }
.oc-sdk-input { border-radius: ${mo}; background: var(--oc-sdk-field-bg); color: ${be}; ${Eo("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${y}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Eo(v(F,26))} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Eo(A("status-error","red"))} }
.oc-sdk-input[data-mono="true"] { font-family: ${fo}; }

.oc-sdk-search-icon { color: ${y}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${K}; }
.oc-sdk-search-clear { border-radius: ${Or}; color: ${y}; }
.oc-sdk-search-clear:hover { background: ${P}; color: ${F}; }

.oc-sdk-trigger { border-color: transparent; border-radius: ${mo}; background: var(--oc-sdk-raised-bg); color: ${be}; ${xo} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${P}, ${P}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${se}, ${se}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${y}; }
.oc-sdk-trigger-chevron { color: ${y}; }
/* The app's dropdown light: lit top, hairline rings and a layered shadow, no border. */
.oc-sdk-popup { --surface-foreground: ${be}; border-color: transparent; border-radius: 12px; background: ${xt}; color: ${be}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${P}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${co}; color: ${lo}; }
.oc-sdk-option-check { color: ${F}; }
.oc-sdk-option[data-destructive="true"] { color: ${uo}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${v(A("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${y}; }
.oc-sdk-popup-empty { color: ${y}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${te}; border-radius: 4px; color: ${F}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${v(F,60,te)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${te}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${W}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${K}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Rr} }
.oc-sdk-check-desc { color: ${y}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${v(F,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${y}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${F}; }
.oc-sdk-tab[aria-selected="true"] { color: ${lo}; background: ${co}; border-color: ${te}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${be}; background: var(--oc-sdk-raised-bg); border-color: transparent; ${xo} }
.oc-sdk-tab-count { color: ${y}; }

.oc-sdk-badge { border-radius: 9999px; background: ${P}; color: ${y}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${v("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${P}; }
.oc-sdk-row[aria-selected="true"] { background: ${co}; color: ${lo}; }
.oc-sdk-row-lead { font-family: ${fo}; color: ${y}; }
.oc-sdk-row-sub { color: ${y}; }
.oc-sdk-row-meta { color: ${y}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${y}; }

.oc-sdk-empty-body { color: ${y}; }

.oc-sdk-spinner { color: ${y}; }
.oc-sdk-spinner-ring { border-color: ${te}; border-top-color: ${K}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${v("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${y}; }

.oc-sdk-separator { color: ${y}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${v(te,40)}; }

.oc-sdk-progress-label { color: ${y}; }
.oc-sdk-progress-track { border-radius: 9999px; background: ${te}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${K}); }

.oc-sdk-text a { color: ${po}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${v(te,60)}; }
`,U=`
${Ut}
${hn}
${Mr}`;var Lr="oc-sdk-ui-style",he=e=>{for(;e.firstChild;)e.removeChild(e.firstChild)},M=e=>{let t=document.getElementById(Lr);if(t instanceof HTMLStyleElement){t.textContent!==e&&(t.textContent=e);return}Mt(document);let r=document.createElement("style");r.id=Lr,r.textContent=e,document.head.appendChild(r)},S=(e,t)=>{let r=document.createElement(e);return t&&(r.className=t),r},J=e=>{let t=S("button",e);return t.type="button",t},D=(e,t)=>{let r=t??"";e.textContent!==r&&(e.textContent=r)},_e=(e,t,r)=>{r==null||r===""?e.removeAttribute(t):e.getAttribute(t)!==r&&e.setAttribute(t,r)};var _n=()=>{let e=document.createElement("span");return e.className="oc-sdk-spinner-ring",e.setAttribute("aria-hidden","true"),e},N=(e,t)=>{M(U);let r=t,s=J("oc-sdk oc-sdk-btn"),a=_n(),c=document.createElement("span");s.append(c),e.append(s);let u=()=>{s.dataset.variant=r.variant??"default",s.dataset.size=r.size??"default",s.disabled=!!r.disabled||!!r.loading,s.dataset.loading=r.loading?"true":"false",s.setAttribute("aria-busy",r.loading?"true":"false"),r.loading&&a.parentNode!==s?s.prepend(a):!r.loading&&a.parentNode===s&&a.remove(),D(c,r.label)},x=()=>{r.disabled||r.loading||r.onClick()};return s.addEventListener("click",x),u(),{update:_=>{r={...r,..._},u()},dispose:()=>{s.removeEventListener("click",x),s.remove()}}};var De=(e,t)=>{M(U);let r=t,s=S("label","oc-sdk oc-sdk-field"),a=S("span","oc-sdk-field-label"),c=r.multiline?S("textarea","oc-sdk-input"):S("input","oc-sdk-input"),u=S("span","oc-sdk-field-note");s.append(a,c,u),e.append(s);let x=()=>{D(a,r.label),a.hidden=!r.label,c instanceof HTMLInputElement?c.type=r.password?"password":"text":c.rows=r.rows??3,c.value!==r.value&&(c.value=r.value),c.disabled=!!r.disabled,_e(c,"placeholder",r.placeholder),c.dataset.mono=r.mono?"true":"false";let I=!!r.error;s.dataset.invalid=I?"true":"false",c.setAttribute("aria-invalid",I?"true":"false");let X=r.error??r.helper??"";D(u,X),u.hidden=X===""},_=()=>{r.onChange(c.value)};return c.addEventListener("input",_),x(),{update:I=>{r={...r,...I},x()},dispose:()=>{c.removeEventListener("input",_),s.remove()}}};var Se=(e,t="vertical")=>{let[r,s]=t==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];return e.key===r||e.ctrlKey&&e.key.toLowerCase()==="n"?"next":e.key===s||e.ctrlKey&&e.key.toLowerCase()==="p"?"previous":e.key==="Home"?"first":e.key==="End"?"last":null},ge=(e,t,r)=>{let s=e.filter(_=>!_.disabled);if(s.length===0)return null;let a=s[0],c=s[s.length-1];if(r==="first"||!a||!c)return a?.id??null;if(r==="last")return c.id;let u=s.findIndex(_=>_.id===t);return u===-1?r==="next"?a.id:c.id:s[Math.min(s.length-1,Math.max(0,u+(r==="next"?1:-1)))]?.id??null};var ho=(e,t)=>{M(U);let r=t,s=S("div","oc-sdk oc-sdk-tabs");s.setAttribute("role","tablist"),e.append(s);let a=()=>{he(s),s.dataset.track=r.trackBackground?"true":"false";for(let u of r.items){let x=J("oc-sdk-tab");x.setAttribute("role","tab");let _=u.id===r.activeId;x.setAttribute("aria-selected",_?"true":"false"),x.tabIndex=_?0:-1,x.dataset.id=u.id;let I=S("span");if(I.textContent=u.label,x.append(I),u.count!==void 0){let X=S("span","oc-sdk-tab-count");X.textContent=String(u.count),x.append(X)}x.addEventListener("click",()=>{u.id!==r.activeId&&r.onChange(u.id)}),s.append(x)}},c=u=>{let x=Se(u,"horizontal");if(!x)return;let _=ge(r.items,r.activeId,x);if(_&&_!==r.activeId){u.preventDefault(),r.onChange(_);let I=s.querySelector(`[data-id="${CSS.escape(_)}"]`);I instanceof HTMLElement&&I.focus()}};return s.addEventListener("keydown",c),a(),{update:u=>{r={...r,...u},a()},dispose:()=>{s.removeEventListener("keydown",c),s.remove()}}};var _o=(e,t={})=>{M(U);let r=t,s=S("span","oc-sdk oc-sdk-spinner");s.setAttribute("role","status");let a=S("span","oc-sdk-spinner-ring");a.setAttribute("aria-hidden","true");let c=S("span");s.append(a,c),e.append(s);let u=()=>{s.dataset.size=r.size??"default",D(c,r.label),c.hidden=!r.label,s.setAttribute("aria-label",r.label??"Loading")};return u(),{update:x=>{r={...r,...x},u()},dispose:()=>{s.remove()}}};var bt=e=>{let t=e.trim();if(!t)throw new Error("\u8BF7\u586B\u5199\u670D\u52A1\u5730\u5740");let r;try{r=new URL(t.includes("://")?t:`https://${t}`)}catch{throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u670D\u52A1\u5730\u5740\uFF0C\u4F8B\u5982 https://relay.example.com")}if(!["https:","http:"].includes(r.protocol)||!r.hostname)throw new Error("\u670D\u52A1\u5730\u5740\u4EC5\u652F\u6301 HTTP \u6216 HTTPS");if(r.username||r.password||r.search||r.hash)throw new Error("\u670D\u52A1\u5730\u5740\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u5BC6\u94A5\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u951A\u70B9");let s=r.pathname.replace(/\/+$/,"").replace(/\/v1$/i,"");return`${r.origin}${s}`},Nr=(e,t)=>new URL(bt(e)).origin!==new URL(bt(t)).origin;var Y=e=>typeof e=="number"&&Number.isFinite(e)?e:null,An=e=>{if(!e||typeof e!="object")return null;let t=e,r=Y(t.usedPercent);return typeof t.key!="string"||typeof t.label!="string"||r===null?null:{key:t.key,label:t.label,usedPercent:r,remainingPercent:Y(t.remainingPercent)??Math.max(0,100-r),resetAt:Y(t.resetAt),resetAtText:typeof t.resetAtText=="string"?t.resetAtText:null,detail:typeof t.detail=="string"?t.detail:null}},Gr=e=>{if(!e||typeof e!="object")return null;let t=e;if(typeof t.id!="string"||typeof t.name!="string")return null;let r=t.balance&&typeof t.balance=="object"?t.balance:null;return{id:t.id,name:t.name,ok:t.ok!==!1,plan:typeof t.plan=="string"?t.plan:null,balance:r&&typeof r.label=="string"?{value:Y(r.value),label:r.label,unit:typeof r.unit=="string"?r.unit:""}:null,detail:typeof t.detail=="string"?t.detail:null,windows:Array.isArray(t.windows)?t.windows.map(An).filter(s=>s!==null):[],updatedAt:Y(t.updatedAt),stale:t.stale===!0,error:typeof t.error=="string"?t.error:void 0}},Pr=e=>{if(!e||typeof e!="object")return null;let t=e;return typeof t.id!="string"||typeof t.name!="string"||typeof t.baseUrl!="string"?null:{id:t.id,name:t.name,baseUrl:t.baseUrl,hasKey:t.hasKey===!0}};var ht=(e,t="zh-CN",r=!1)=>new Intl.DateTimeFormat(t,{...r?{month:"numeric",day:"numeric"}:{},hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e),Dr=(e,t="zh-CN",r=Date.now())=>{if(!e||!Number.isFinite(e))return null;if(e<=r)return"\u91CD\u7F6E\u65F6\u95F4\u5DF2\u5230\uFF0C\u8BF7\u5237\u65B0";let s=new Date(e),a=new Date(r),c=new Date(r);c.setDate(c.getDate()+1);let u=s.toDateString()===a.toDateString()?"\u4ECA\u5929 ":s.toDateString()===c.toDateString()?"\u660E\u5929 ":"";return`${u}${ht(e,t,!u)} \u91CD\u7F6E`},So=(e,t,r="zh-CN")=>{if(e===null||!Number.isFinite(e))return"\u2014";let s=t==="USD"||t==="$"?"USD":t==="CNY"||t==="\xA5"?"CNY":null,a=new Intl.NumberFormat(r,{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:1}).format(e);return`${s==="USD"?"$":s==="CNY"?"\xA5":""}${a}${s?"":` ${t}`}`};var Hr=`:root {
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
`;var $r=`/* Shared foundation for OpenChamber extensions. Colors and fonts belong to the host. */
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
`;var yo=ao({requestTimeoutMs:3e4}),Br=document.querySelector("#root");if(!Br)throw new Error("Missing #root");var zr=document.createElement("style");zr.textContent=$r+Hr;document.head.append(zr);var i=(e,t="",r)=>{let s=document.createElement(e);return s.className=t,r!==void 0&&(s.textContent=r),s},V=[],we=[],Te=null,ee="zh-CN",ae=!1,q=!1,ie=!1,ke=null,oe=null,_t=0,ve=0,Q="overview",Fr="",L=null,Fe=null,C=null,Ve="",St="",Oe="",He=!1,Xe=null,Xr=null,Vr=!1,go="",wn=()=>{Xe=null,vt(!0)};var Re=e=>e instanceof p?e.code==="NO_SERVICE"?"\u8BF7\u5728\u8BBE\u7F6E \u2192 \u6269\u5C55\u4E2D\u5141\u8BB8\u201C\u4F59\u989D\u201D\u8FD0\u884C\u672C\u5730\u670D\u52A1\u3002":e.code==="SERVICE_FAILED"?"\u672C\u5730\u670D\u52A1\u5C1A\u672A\u5C31\u7EEA\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u6269\u5C55\u540E\u91CD\u8BD5\u3002":e.code==="HOST_TIMEOUT"?"\u67E5\u8BE2\u8017\u65F6\u8F83\u957F\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e.code==="DISABLED"?"\u4F59\u989D\u6269\u5C55\u5DF2\u505C\u7528\uFF0C\u8BF7\u5728\u6269\u5C55\u8BBE\u7F6E\u4E2D\u542F\u7528\u3002":"\u6682\u65F6\u65E0\u6CD5\u8FDE\u63A5\u672C\u5730\u670D\u52A1\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e instanceof Error?e.message:"\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",Ye=async(e,t,r={})=>{let s=await yo.serviceRequest({method:e,path:t,...r.query?{query:r.query}:{},...r.body===void 0?{}:{body:JSON.stringify(r.body)}}),a;try{a=JSON.parse(s.body)}catch{throw new Error("\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u6570\u636E\uFF0C\u8BF7\u91CD\u8BD5\u3002")}if(!a||typeof a!="object"||Array.isArray(a))throw new Error("\u670D\u52A1\u8FD4\u56DE\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E\u3002");if(s.status>=400)throw new Error(typeof a.error=="string"?a.error:`\u8BF7\u6C42\u5931\u8D25\uFF08${s.status}\uFF09`);return a},Z=(e,t="warning")=>{let r=i("div","bx-notice",e);return r.dataset.tone=t,r.setAttribute("role",t==="error"?"alert":"status"),r},Ce=i("main","ext bx");Ce.setAttribute("aria-label","\u4F59\u989D\u4E0E\u989D\u5EA6");var je=i("header","bx-top"),Be=i("div","bx-tabs"),jr=i("div","bx-toolbar"),Kr=i("div","bx-meta"),Wr=i("span","bx-count"),gt=i("span","bx-time");gt.setAttribute("role","status");Kr.append(Wr,gt);var Jr=i("div","bx-actions"),On=N(Jr,{label:"\u5237\u65B0",variant:"ghost",size:"sm",onClick:wn});jr.append(Kr,Jr);je.append(jr);var ce=i("section","bx-view");ce.id="balance-overview";ce.setAttribute("aria-label","\u4F59\u989D\u603B\u89C8");var $e=i("div"),ye=i("div"),Yr=i("p","bx-footer","\u4F59\u989D\u6309\u670D\u52A1\u5206\u522B\u663E\u793A\u3002\u70B9\u51FB\u5237\u65B0\uFF0C\u83B7\u53D6\u6700\u65B0\u6570\u636E\u3002");ce.append($e,ye,Yr);var re=i("section","bx-view");re.id="balance-relays";re.setAttribute("aria-label","\u4E2D\u8F6C\u7AD9\u7BA1\u7406");var Ao=i("div"),yt=i("div","bx-management-head");yt.append(i("p","","\u7BA1\u7406\u7528\u4E8E\u67E5\u8BE2\u4F59\u989D\u7684\u8FDE\u63A5"));var Rn=N(yt,{label:"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9",size:"sm",onClick:()=>Uo("new")}),Ae=i("div");Ao.append(yt,Ae);var ko=i("div","bx-editor"),vo=i("div","bx-editor-head"),qr=i("h2","bx-editor-title"),Cn=N(vo,{label:"\u53D6\u6D88",variant:"ghost",size:"sm",onClick:()=>Nn()});vo.prepend(qr);var In=i("p","bx-editor-intro","\u586B\u5199\u8FDE\u63A5\u4FE1\u606F\uFF0C\u53EF\u5148\u6D4B\u8BD5\u518D\u4FDD\u5B58\u3002"),At=i("form","bx-form");At.noValidate=!0;At.addEventListener("submit",e=>{e.preventDefault(),Pn()});var wo=i("div","bx-field"),Oo=i("div","bx-field"),kt=i("div","bx-field"),Ke=De(wo,{label:"\u540D\u79F0",placeholder:"\u4F8B\u5982\uFF1A\u65E5\u5E38\u4F7F\u7528",value:"",onChange:e=>{Ve=e,Ke.update({value:e,error:void 0}),le()}}),We=De(Oo,{label:"\u670D\u52A1\u5730\u5740",placeholder:"https://relay.example.com",value:"",helper:"\u53EF\u7C98\u8D34\u7F51\u7AD9\u5730\u5740\u6216\u4EE5 /v1 \u7ED3\u5C3E\u7684 API \u5730\u5740\u3002",onChange:e=>{St=e,We.update({value:e,error:void 0}),le()}}),ne=De(kt,{label:"API Key",placeholder:"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key",password:!0,mono:!0,value:"",onChange:e=>{Oe=e,ne.update({value:e,error:void 0}),le()}}),Qr=i("div","bx-key-actions"),Ro=N(Qr,{label:"\u663E\u793A\u5BC6\u94A5",variant:"ghost",size:"xs",onClick:()=>{He=!He,ne.update({password:!He}),Ro.update({label:He?"\u9690\u85CF\u5BC6\u94A5":"\u663E\u793A\u5BC6\u94A5"})}});kt.append(Qr);var Je=i("div"),Co=i("div","bx-form-actions"),Un=N(Co,{label:"\u6D4B\u8BD5\u8FDE\u63A5",variant:"outline",size:"sm",onClick:()=>{Gn()}}),Io=i("span"),Mn=N(Io,{label:"\u4FDD\u5B58",size:"sm",onClick:()=>{}});Io.querySelector("button").type="submit";Co.append(Io);At.append(wo,Oo,kt,Je,Co);ko.append(vo,In,At);re.append(Ao,ko);var Ln=ho(Be,{items:[{id:"overview",label:"\u603B\u89C8"},{id:"relays",label:"\u4E2D\u8F6C\u7AD9"}],activeId:"overview",onChange:e=>{Q=e==="relays"?"relays":"overview",$(),Q==="relays"&&Lo()}});je.prepend(Be);Ce.append(je);Ce.append(ce);Ce.append(re);Br.append(Ce);var ze=[wo,Oo,kt].map((e,t)=>{let r=e.querySelector("input"),s=e.querySelector(".oc-sdk-field-note");return r.id=["relay-name","relay-url","relay-key"][t],r.name=r.id,r.setAttribute("aria-label",["\u540D\u79F0","\u670D\u52A1\u5730\u5740","API Key"][t]),r.autocomplete=t===2?"new-password":"off",r.spellcheck=!1,r.maxLength=[60,2048,4096][t],s.id=`${r.id}-hint`,r.setAttribute("aria-describedby",s.id),r});ze[1].inputMode="url";var le=()=>{Je.replaceChildren()},Tt=()=>{let e=C!==null;Ke.update({disabled:e}),We.update({disabled:e}),ne.update({disabled:e}),Cn.update({disabled:e}),Ro.update({disabled:e}),Rn.update({disabled:e||!!oe||ie}),Un.update({disabled:e,loading:C==="test",label:C==="test"?"\u6D4B\u8BD5\u4E2D\u2026":"\u6D4B\u8BD5\u8FDE\u63A5"}),Mn.update({disabled:e,loading:C==="save",label:C==="save"?"\u4FDD\u5B58\u4E2D\u2026":L==="new"?"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9":"\u4FDD\u5B58\u66F4\u6539"})};function Uo(e){C||(L=e,Fe=null,Ve=e==="new"?"":e.name,St=e==="new"?"":e.baseUrl,Oe="",He=!1,Ke.update({value:Ve,error:void 0}),We.update({value:St,error:void 0}),ne.update({value:"",error:void 0,password:!0,placeholder:e==="new"?"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5",helper:e==="new"?"\u4FDD\u5B58\u540E\u4E0D\u4F1A\u663E\u793A\u5B8C\u6574\u5BC6\u94A5\u3002":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5\uFF1B\u66F4\u6362\u7AD9\u70B9\u65F6\u9700\u91CD\u65B0\u586B\u5199\u3002"}),Ro.update({label:"\u663E\u793A\u5BC6\u94A5"}),le(),Q="relays",$(),re.scrollTop=0,ze[0].focus())}function Nn(){C||(L=null,Oe="",ne.update({value:"",password:!0}),le(),$(),yt.querySelector("button")?.focus())}var Zr=e=>{Ke.update({error:void 0}),We.update({error:void 0}),ne.update({error:void 0});let t=null;e&&!Ve.trim()&&(Ke.update({error:"\u4E3A\u8FD9\u4E2A\u8FDE\u63A5\u53D6\u4E00\u4E2A\u4FBF\u4E8E\u8BC6\u522B\u7684\u540D\u79F0\u3002"}),t=ze[0]);let r="";try{r=bt(St)}catch(a){We.update({error:Re(a)}),t??=ze[1]}let s=L==="new";return r&&L&&L!=="new"&&(s=Nr(L.baseUrl,r)),s&&!Oe.trim()&&(ne.update({error:L==="new"?"\u8BF7\u586B\u5199 API Key\u3002":"\u66F4\u6362\u7AD9\u70B9\u65F6\uFF0C\u8BF7\u586B\u5199\u65B0\u7AD9\u70B9\u7684 API Key\u3002"}),t??=ze[2]),t?(t.focus(),null):{name:Ve.trim(),baseUrl:r,apiKey:Oe.trim(),...L&&L!=="new"?{id:L.id}:{}}};async function Gn(){if(C||!L)return;let e=Zr(!1);if(e){C="test",le(),Tt();try{let t=await Ye("POST","/relays/test",{body:e});if(t.ok!==!0)throw new Error(typeof t.error=="string"?t.error:"\u8FDE\u63A5\u672A\u6210\u529F\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u548C\u5BC6\u94A5\u3002");let r=t.balance,s=r&&Y(r.value)!==null?` \xB7 \u53EF\u7528 ${So(Y(r.value),typeof r.unit=="string"?r.unit:"USD",ee)}`:"";Je.replaceChildren(Z(`\u8FDE\u63A5\u6210\u529F${s}\u3002\u5C1A\u672A\u4FDD\u5B58\u3002`,"success"))}catch(t){Je.replaceChildren(Z(Re(t),"error"))}finally{C=null,Tt()}}}async function Pn(){if(C||!L)return;let e=Zr(!0);if(e){C="save",le(),Tt();try{let t=await Ye("POST","/relays",{body:e});ve+=1,ie=!1,Mo(t),L=null,Oe="",ne.update({value:"",password:!0}),Q="overview",Xe={text:`\u5DF2\u4FDD\u5B58\u201C${e.name}\u201D\u3002`,tone:"success"},$(),await vt(!0)}catch(t){Je.replaceChildren(Z(Re(t),"error"))}finally{C=null,$()}}}async function Dn(e){if(!C){C="delete",$();try{let t=await Ye("DELETE","/relays",{query:{id:e.id}});ve+=1,ie=!1,Mo(t),V=V.filter(r=>r.id!==`relay:${e.id}`),Fe=null,await vt(!0)}catch(t){oe=Re(t)}finally{C=null,$()}}}var Mo=e=>{if(!Array.isArray(e.relays))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u4E2D\u8F6C\u7AD9\u5217\u8868\uFF0C\u8BF7\u91CD\u8BD5\u3002");we=e.relays.map(Pr).filter(t=>t!==null),oe=null},Hn=e=>{let t=i("div","bx-window");t.dataset.tone=e.usedPercent>=90?"error":e.usedPercent>=70?"warning":"normal";let r=i("div","bx-window-head");r.append(i("span","bx-window-label",e.label),i("span","bx-percent",`\u5DF2\u7528 ${Math.round(e.usedPercent)}%`));let s=i("div","bx-track");s.setAttribute("role","progressbar"),s.setAttribute("aria-label",`${e.label}\u5DF2\u7528\u989D\u5EA6`),s.setAttribute("aria-valuemin","0"),s.setAttribute("aria-valuemax","100"),s.setAttribute("aria-valuenow",String(Math.round(e.usedPercent)));let a=i("div","bx-fill");a.style.width=`${Math.max(0,Math.min(100,e.usedPercent))}%`,s.append(a);let c=i("div","bx-window-foot");e.detail&&c.append(i("span","",e.detail));let u=Dr(e.resetAt,ee);if(u){let x=i("span","bx-reset",u);x.title=new Date(e.resetAt).toLocaleString(ee),c.append(x)}return t.append(r,s),c.childNodes.length&&t.append(c),t};var $n=e=>{let t=i("article","bx-provider");t.setAttribute("aria-label",e.name);let r=i("div","bx-provider-head"),s=i("div"),a=i("h2","bx-name",e.name);a.title=e.name,s.append(a),e.plan&&s.append(i("div","bx-plan",e.plan));let c=i("div","bx-balance"),u=e.balance?.value??null,x=e.balance?.unit??"";if(c.append(i("strong","bx-amount",So(u,x,ee)),i("span","bx-amount-label",u!==null?e.stale?"\u4E0A\u6B21\u4F59\u989D":x==="\u79EF\u5206"?"\u5269\u4F59\u79EF\u5206":"\u53EF\u7528\u4F59\u989D":"\u4F59\u989D\u672A\u63D0\u4F9B")),r.append(s,c),t.append(r),e.detail&&t.append(i("p","bx-detail",e.detail)),e.windows.length){let _=i("div","bx-windows");_.append(...e.windows.map(Hn)),t.append(_)}if(e.ok)!e.balance&&!e.windows.length&&!e.detail&&t.append(i("p","bx-detail","\u5DF2\u8FDE\u63A5\uFF0C\u4F46\u63A5\u53E3\u6682\u672A\u63D0\u4F9B\u4F59\u989D\u6216\u989D\u5EA6\u3002"));else{let _=Z(e.error??"\u67E5\u8BE2\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u3002",e.stale?"warning":"error");e.stale&&e.updatedAt&&_.append(i("p","",`\u4EE5\u4E0A\u4E3A ${ht(e.updatedAt,ee,!0)} \u7684\u6210\u529F\u7ED3\u679C\u3002`)),t.append(_)}return t},en=(e,t,r,s="\u6DFB\u52A0\u4E2D\u8F6C\u7AD9")=>{let a=i("div","bx-empty");return a.append(i("h2","",e),i("p","",t)),r&&N(a,{label:s,size:"sm",onClick:r}),a};function To(){if(Ae.replaceChildren(),oe){let e=Z(oe,"error");N(e,{label:"\u91CD\u8BD5",size:"sm",variant:"ghost",onClick:()=>{Lo()}}),Ae.append(e)}if(ie&&!we.length){Ae.append(i("p","bx-detail","\u6B63\u5728\u8BFB\u53D6\u4E2D\u8F6C\u7AD9\u2026"));return}!we.length&&!oe&&Ae.append(en("\u8FD8\u6CA1\u6709\u4E2D\u8F6C\u7AD9","\u6DFB\u52A0\u4E00\u4E2A\u8FDE\u63A5\u540E\uFF0C\u5C31\u80FD\u5728\u603B\u89C8\u91CC\u67E5\u770B\u5B83\u7684\u4F59\u989D\u4E0E\u989D\u5EA6\u3002"));for(let e of we){let t=i("div","bx-relay"),r=i("div","bx-relay-line"),s=i("div","bx-relay-info");s.append(i("h3","bx-relay-name",e.name),i("p","bx-relay-url",e.baseUrl));let a=i("div","bx-relay-actions");if(N(a,{label:"\u7F16\u8F91",size:"sm",variant:"ghost",disabled:C!==null,onClick:()=>Uo(e)}),N(a,{label:"\u79FB\u9664",size:"sm",variant:"ghost",disabled:C!==null,onClick:()=>{Fe=e.id,To()}}),r.append(s,a),t.append(r),Fe===e.id){let c=Z(`\u79FB\u9664\u201C${e.name}\u201D\u7684\u8FDE\u63A5\uFF1F\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5\u4F1A\u4ECE\u672C\u5730\u914D\u7F6E\u4E2D\u5220\u9664\u3002`),u=i("div","bx-actions");N(u,{label:"\u53D6\u6D88",size:"sm",variant:"ghost",disabled:C!==null,onClick:()=>{Fe=null,To()}}),N(u,{label:"\u786E\u8BA4\u79FB\u9664",size:"sm",variant:"destructive",loading:C==="delete",onClick:()=>{Dn(e)}}),c.append(u),t.append(c)}Ae.append(t)}}var Fn=()=>{};function $(){let e=V.filter(t=>!t.ok).length;if(Wr.textContent=`${V.length} \u4E2A\u670D\u52A1${e?` \xB7 ${e} \u9879\u5F85\u91CD\u8BD5`:""}`,gt.textContent=q?"\u6B63\u5728\u66F4\u65B0\u2026":Te?`\u66F4\u65B0\u4E8E ${ht(Te,ee,new Date(Te).toDateString()!==new Date().toDateString())}`:"",gt.title=Te?new Date(Te).toLocaleString(ee):"",On.update({loading:q,disabled:!ae,label:q?"\u5237\u65B0\u4E2D":"\u5237\u65B0"}),ce.hidden=Q!=="overview",re.hidden=Q!=="relays",Yr.hidden=V.length===0,ye.setAttribute("aria-busy",String(q)),$e.replaceChildren(),Xr&&$e.append(Z(Xr)),Xe&&$e.append(Z(Xe.text,Xe.tone)),ke&&$e.append(Z(`${ke}${V.length?" \u5DF2\u4FDD\u7559\u4E0A\u6B21\u663E\u793A\u7684\u6570\u636E\u3002":""}`,"error")),ye.replaceChildren(),!ae||q&&!V.length){let t=i("div","bx-loading");_o(t,{label:ae?"\u6B63\u5728\u67E5\u8BE2\u4F59\u989D\u2026":"\u6B63\u5728\u8FDE\u63A5 OpenChamber\u2026"}),ye.append(t)}else V.length?ye.append(...V.map($n)):ye.append(en(ke?"\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u4F59\u989D":"\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u4F59\u989D",ke?"\u70B9\u51FB\u5237\u65B0\u91CD\u8BD5\uFF0C\u6216\u68C0\u67E5\u6269\u5C55\u7684\u672C\u5730\u670D\u52A1\u6743\u9650\u3002":"\u5728 OpenCode \u914D\u7F6E Command Code\u3001StepFun\uFF0C\u6216\u6DFB\u52A0\u4E2D\u8F6C\u7AD9\u3002",()=>Uo("new")));Fn();{let t=`${Q}:${we.length}`;if(t!==Fr){let r=Be.contains(document.activeElement);Ln?.update({activeId:Q,items:[{id:"overview",label:"\u603B\u89C8"},{id:"relays",label:"\u4E2D\u8F6C\u7AD9",count:we.length||void 0}]}),Fr=t,Be.querySelector('[role="tablist"]')?.setAttribute("aria-label","\u4F59\u989D\u89C6\u56FE");for(let s of Be.querySelectorAll('[role="tab"]'))s.id=`balance-tab-${s.dataset.id}`,s.setAttribute("aria-controls",`balance-${s.dataset.id}`),r&&s.dataset.id===Q&&s.focus();ce.setAttribute("role","tabpanel"),ce.setAttribute("aria-labelledby","balance-tab-overview"),re.setAttribute("role","tabpanel"),re.setAttribute("aria-labelledby","balance-tab-relays")}Ao.hidden=L!==null,ko.hidden=L===null,qr.textContent=L==="new"?"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9":"\u7F16\u8F91\u4E2D\u8F6C\u7AD9",L||To(),Tt()}}async function vt(e=!1){if(q&&!e)return;let t=++_t;q=!0,ke=null,$();try{let r=await Ye("GET","/balances",e?{query:{refresh:"1"}}:{});if(t!==_t)return;if(!Array.isArray(r.providers))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u6709\u6548\u7684\u4F59\u989D\u5217\u8868\u3002");V=r.providers.map(Gr).filter(s=>s!==null),Te=Y(r.fetchedAt)}catch(r){t===_t&&(ke=Re(r))}finally{t===_t&&(q=!1,$())}}async function Lo(){if(ie)return;let e=++ve;ie=!0,oe=null,$();try{let t=await Ye("GET","/relays");e===ve&&Mo(t)}catch(t){e===ve&&(oe=Re(t))}finally{e===ve&&(ie=!1,$())}}yo.onReady(e=>{if(io(e,document.documentElement),ee=e.locale.startsWith("zh")?e.locale:"zh-CN",document.documentElement.lang=ee,Vr=!1,ae){$();return}ae=!0,vt(),Lo()});$();})();
