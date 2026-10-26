"use strict";(()=>{var S="openchamber.sdk";var nt="data-oc-scrolling",It=`
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
`;function Mt(e){let t=e.documentElement;if(t.hasAttribute("data-oc-scrollbar-activity"))return;t.setAttribute("data-oc-scrollbar-activity","");let r=new WeakMap;e.addEventListener("scroll",s=>{let a=s.target===e?t:s.target;if(!(a instanceof Element))return;a.hasAttribute("data-oc-scrolling")||a.setAttribute("data-oc-scrolling","");let c=r.get(a);c!==void 0&&clearTimeout(c),r.set(a,setTimeout(()=>{r.delete(a),a.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var on=`(${Mt.toString()})(document);`;var Yo=/^[a-z][a-z0-9-]{0,39}$/;var Ko=e=>Object(e)===e&&!Array.isArray(e),Nt=(e,t)=>Object.keys(e).every(r=>t.includes(r)),Wo=e=>String(e)===e&&e.length>=1&&e.length<=60,Jo=e=>String(e)===e&&e.length>=1&&e.length<=80,qo=e=>{if(!Array.isArray(e)||e.length>4)return!1;let t=new Set;for(let r of e){if(!Ko(r)||!Yo.test(r.id)||!Wo(r.label)||r.disabled!==void 0&&r.disabled!==!0&&r.disabled!==!1||t.has(r.id))return!1;if(t.add(r.id),r.kind==="button"){if(!Nt(r,["kind","id","label","disabled"]))return!1;continue}if(r.kind!=="select"||!Nt(r,["kind","id","label","value","options","disabled"])||!Jo(r.value)||!Array.isArray(r.options)||r.options.length<1||r.options.length>16)return!1;let s=new Set;for(let a of r.options){if(!Ko(a)||!Nt(a,["value","label"])||!Jo(a.value)||!Wo(a.label)||s.has(a.value))return!1;s.add(a.value)}if(!s.has(r.value))return!1}return!0};var Lt=e=>"bytes"in e?e.bytes.byteLength:e.content.length,Zo=(e,t)=>{if(e.path!==t.path||e.readOnly!==t.readOnly)return!1;if(e.encoding==="text"||t.encoding==="text")return e.encoding==="text"&&t.encoding==="text"&&e.content===t.content;if(e.bytes.byteLength!==t.bytes.byteLength)return!1;for(let r=0;r<e.bytes.byteLength;r+=1)if(e.bytes[r]!==t.bytes[r])return!1;return!0};var Qo=/^[A-Za-z0-9_-]{1,80}$/;var er=["left","right","top","bottom"];var tr=(e,t=0,r={remaining:16e3})=>{if(--r.remaining<0||t>=32)return!1;if(e===null)return!0;let s=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let a of s)if(!tr(a,t+1,r))return!1;return!0},Pt=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(t=>/^(0|[1-9]\d*)$/.test(t)&&Number(t)<e.length)&&e.every(Pt);if(Object(e)===e){let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype)&&Object.values(e).every(Pt)}return String(e)===e||Number.isFinite(e)},Gt=e=>{try{return String(e.id)!==e.id||!Qo.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!er.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!tr(e.data)||!Pt(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var rr=["file","directory","other","missing"],Ht=e=>!!(e&&"sessionId"in e),$t=e=>!!(e&&"sent"in e&&!("sessionId"in e));var nr=/^[0-9a-f]{7,64}$/i,Xt=e=>nr.test(e),st=500,at=32e3,sr=16e3,ar=128,ir=200,cr=2e3,lr=16e3,dr=80,pr=200,ur=16e3;var fr=2e3;var Ft=2e4,it=1024,ct=2e6;var lt=64e3,dt=8e3,Bt=4e3;var Vt=96e4,nn=60*6e4;var Er=999,_r=1e4,Ge=500,mr=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],Sr=["stopped","starting","ready","failed"],sn=new Set(mr),xr=e=>sn.has(e),br=e=>e&&xr(e)?e:"HOST_REJECTED",Ee=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(Ee):Object(e)===e?Object.values(e).every(Ee):!1,Tr=e=>Ee(e)&&JSON.stringify(e).length<=ur,or=e=>e?.trim().slice(0,pr)??"",_e=e=>{let t=e.id.trim().slice(0,ar),r=e.title.trim().slice(0,ir),s=e.url.trim().slice(0,cr),a=e.text?.trim().slice(0,lr),c=e.author?.trim().slice(0,dr),u=e.kind==="pull"?"pull":"issue",m={providerId:e.providerId.trim(),id:t,title:r||t,url:s,kind:u};if(a&&(m.text=a),c&&(m.author=c),u==="pull"){let b=or(e.branches?.head),U=or(e.branches?.base);b&&U&&(m.branches={head:b,base:U})}return Tr(e.data)&&(m.data=e.data),m},zt=e=>{let t=_e(e);return e.projectId&&(t.projectId=e.projectId),e.navigation&&(t.navigation=e.navigation),e.worktree&&(t.worktree=e.worktree),t},jt=e=>{let t={text:e.text.trim().slice(0,sr)};return e.send&&(t.send=!0),t},Kt=e=>e===null||!Number.isFinite(e)?null:Math.min(Er,Math.max(0,Math.round(e))),Wt=e=>Number.isFinite(e)?Math.min(_r,Math.max(0,Math.ceil(e))):0;var me=e=>e.length>0&&e.length<=it&&!e.includes("\0")&&!e.includes("\\");var pt=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>fr?!1:!e.split("/").some(r=>r==="."||r===".."),an=new Set(Sr),Jt=e=>!!(e&&"status"in e&&an.has(String(e.status))&&!("body"in e)),ut=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),Yt=e=>!!(e&&"content"in e&&String(e.content)===e.content),qt=e=>!!(e&&"written"in e&&e.written===!0),Zt=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),cn=new Set(rr),Qt=e=>!!(e&&"kind"in e&&"size"in e&&cn.has(String(e.kind))&&Number.isFinite(e.size)),eo=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),ln=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),dn=e=>Object(e)===e?e:null,Dt=e=>String(e)===e&&e.length>0,pn=e=>{if(!Dt(e.id))return null;if(e.ok===!0){let t={channel:S,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(t.payload=e.payload),t}return e.ok===!1&&Dt(e.error)?{channel:S,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:br(Dt(e.code)?e.code:void 0)}:null},to=e=>{let t=dn(e);return!t||t.channel!==S||t.v!==1?null:t.type==="result"?pn(t):!ln.has(String(t.type))||Object(t.payload)!==t.payload?null:t};var hr=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,un=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",p=class extends Error{code;constructor(t,r){super(r),this.name="HostRequestError",this.code=t}},gr=()=>Promise.reject(new p("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ft=()=>Promise.reject(new p("BAD_PATH",`File path must be 1 to ${it} characters without NUL or backslash.`)),Et=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new p("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},_=e=>(e.value+=1,`oc-${e.value}`),ao=(e={})=>{let t=e.target??("window"in globalThis?window:null);if(!t)throw new p("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let r=e.acceptSource??(o=>o===t.parent),s=e.requestTimeoutMs??Ft,a=new Set,c=new Set,u=new Set,m=new Set,b=new Set,U=new Set,F=new Set,qe=new Set,Ze=new Set,de=new Set,Rt=[],Ue=null,Ie=null,Qe=new Set,et=new Set,Me=null,Ne=null,vt=!1,pe=new Map,ue=new Map,fe=new Map,V=!1,E={value:0},f=null,j=null,Le=!1,Pe=!1,Lo=null,Po=o=>o?{sessionId:o.id,phase:o.busy?"started":"completed"}:null,H=o=>{t.parent.postMessage(o,"*")},Go=()=>{V||t.parent===t||de.size===0||f?.features?.lateGenerateResults!==!0||H({channel:S,v:1,type:"generate-late-listen"})},y=(o,n)=>{for(let l of o)try{l(n)}catch(d){console.error(d)}},Do=o=>{if(!(o instanceof MessageEvent)||!r(o.source))return;let n=to(o.data);if(!n)return;if(n.type==="workspace"){let d=ue.get(n.payload.subscriptionId);d&&y([d],n.payload.snapshot);return}if(n.type==="shells"){let d=fe.get(n.payload.subscriptionId);d&&y([d],n.payload.snapshot);return}if(n.type==="ready"){f=n.payload,j=Po(n.payload.session),y(a,n.payload),y(c,n.payload.directory),y(u,n.payload.session),j&&y(m,j),y(b,n.payload.connection),y(U,n.payload.settings),y(F,n.payload.item),Go();return}if(n.type==="generate-late"){de.size===0?Rt.push(n.payload):y(de,n.payload);return}if(n.type==="directory"){f&&(f={...f,directory:n.payload.directory}),y(c,n.payload.directory);return}if(n.type==="session"){f&&(f={...f,session:n.payload.session}),n.payload.session?j?.sessionId!==n.payload.session.id&&(j=Po(n.payload.session)):j=null,y(u,n.payload.session);return}if(n.type==="session-lifecycle"){j=n.payload,y(m,n.payload);return}if(n.type==="connection"){f&&(f={...f,connection:n.payload.connection}),y(b,n.payload.connection);return}if(n.type==="settings"){f&&(f={...f,settings:n.payload.settings}),y(U,n.payload.settings);return}if(n.type==="item"){f&&(f={...f,item:n.payload.item}),y(F,n.payload.item);return}if(n.type==="status-control-event"){y(qe,n.payload);return}if(n.type==="popover-closed"){y(Ze,n.payload);return}if(n.type==="action"){let d=h=>{V||H({channel:S,v:1,type:"action-result",id:n.id,payload:h})},g=Ie;if(!g){d({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>g(n.payload)).then(()=>d({ok:!0}),h=>{let w=(h instanceof Error?h.message:String(h)).trim();d({ok:!1,error:(w||"Action failed.").slice(0,Ge)})});return}if(n.type==="file-open"){let d=n.payload;if(Ne&&Zo(Ne,d))return;Ne=d,y(Qe,n.payload);return}if(n.type==="file-saved"){y(et,n.payload.version);return}if(n.type==="file-snapshot"){let d=w=>{V||H({channel:S,v:1,type:"file-snapshot-result",id:n.id,payload:w})},g=w=>d({error:(w.trim()||"Could not read the edited file.").slice(0,Ge)}),h=Me;if(!h){g("This extension does not edit files.");return}Promise.resolve().then(()=>h(n.payload.purpose)).then(w=>{if(Lt(w)>2e7){g(`The file is over ${2e7} ${"bytes"in w?"bytes":"characters"}.`);return}if(w.version.length>256){g(`The snapshot version is over ${256} characters.`);return}d({snapshot:"bytes"in w?{bytes:w.bytes,version:w.version}:{content:w.content,version:w.version}})},w=>g(w instanceof Error?w.message:String(w)));return}if(n.type==="resolve"){let d=h=>{H({channel:S,v:1,type:"resolve-result",id:n.id,payload:h})},g=Ue;if(!g){d({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>g(n.payload)).then(h=>d({item:h?_e(h):null}),h=>{let w=(h instanceof Error?h.message:String(h)).trim();d({error:(w||"Command failed.").slice(0,Ge)})});return}let l=pe.get(n.id);if(l){if(clearTimeout(l.timer),pe.delete(n.id),n.ok){l.resolve(n.payload);return}l.reject(new p(n.code,n.error))}};t.addEventListener("message",Do),H({channel:S,v:1,type:"hello"});let P=(o,n=s)=>V||t.parent===t?Promise.reject(new p("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((l,d)=>{let g=setTimeout(()=>{pe.delete(o.id),d(new p("HOST_TIMEOUT","Host did not answer in time."))},n);pe.set(o.id,{resolve:l,reject:d,timer:g}),H(o)}),R=o=>P(o).then(()=>{}),v={channel:S,v:1},wt=o=>{!V&&t.parent!==t&&H(o)},Ho=()=>wt({...v,type:"file-save"}),$o=o=>{!hr(o)||!un(o)||(o.preventDefault(),Ho())},Xo=o=>{!hr(o)||o.key!=="Escape"||f?.surface!=="popover"||!f.popover||(o.preventDefault(),zo(f.popover.id,"escape").catch(()=>{}))},tt=()=>{let o=f?.surface==="popover"?f.popover:void 0;if(!o)return;let n=Le||Pe;Lo!==n&&(Lo=n,jo(o.id,n).catch(()=>{}))},ot=()=>{f?.surface!=="popover"||Le||(Le=!0,tt())},Fo=o=>{f?.surface!=="popover"||o.relatedTarget!==null||!Le||(Le=!1,tt())},Bo=()=>{f?.surface!=="popover"||Pe||(Pe=!0,tt())},Vo=()=>{f?.surface!=="popover"||!Pe||(Pe=!1,tt())},B=(o,n=1024)=>{if(!o.trim()||o.length>n)throw new p("HOST_REJECTED",`Identity must contain 1 to ${n} characters.`)},Ct=async o=>{o.kind!=="projects"&&B(o.projectId);let n=await P({...v,type:"workspace-read",id:_(E),payload:o});if(!n||!("kind"in n)||!("state"in n)||n.kind!==o.kind)throw new p("HOST_REJECTED","Host did not return workspace data.");return n},Ut=async(o,n)=>{o.kind!=="projects"&&B(o.projectId);let l=_(E);ue.set(l,n);try{await R({...v,type:"workspace-subscribe",id:_(E),payload:{subscriptionId:l,query:o}})}catch(d){throw ue.delete(l),V||H({...v,type:"workspace-unsubscribe",id:_(E),payload:{subscriptionId:l}}),d}return()=>{!ue.delete(l)||V||H({...v,type:"workspace-unsubscribe",id:_(E),payload:{subscriptionId:l}})}},tn=async(o,n)=>{o.kind==="session"&&B(o.sessionId),o.kind==="project"&&B(o.projectId);let l=_(E);fe.set(l,n);try{await R({...v,type:"shells-subscribe",id:_(E),payload:{subscriptionId:l,scope:o}})}catch(d){throw fe.delete(l),V||H({...v,type:"shells-unsubscribe",id:_(E),payload:{subscriptionId:l}}),d}return()=>{!fe.delete(l)||V||H({...v,type:"shells-unsubscribe",id:_(E),payload:{subscriptionId:l}})}},rt=async o=>{if("key"in o&&(o.key.length===0||o.key.length>128))throw new p("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(o.op==="set"&&!Ee(o.value))throw new p("HOST_REJECTED","Storage values must be JSON.");if(o.op==="set"&&new TextEncoder().encode(JSON.stringify(o.value)).length>65536)throw new p("HOST_REJECTED","Storage value exceeds 64 KiB.");if(o.scope==="device"&&f?.features?.deviceStorage!==!0)throw new p("UNSUPPORTED","This host does not support device storage.");let n=await P({...v,type:"storage",id:_(E),payload:o});if(!n||!("storage"in n)||n.op!==o.op)throw new p("HOST_REJECTED","Host did not return storage data.");return n},zo=(o,n)=>f?.features?.popovers!==!0&&!(f?.surface==="popover"&&f.popover?.id===o)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):R({...v,type:"popover-close",id:_(E),payload:n?{id:o,reason:n}:{id:o}}),jo=(o,n)=>f?.features?.popovers!==!0&&!(f?.surface==="popover"&&f.popover?.id===o)?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):R({...v,type:"popover-anchor",id:_(E),payload:{id:o,active:n}});return t.addEventListener("keydown",Xo,!0),t.addEventListener("pointerover",ot),t.addEventListener("pointermove",ot),t.addEventListener("pointerout",Fo),t.addEventListener("focus",Bo),t.addEventListener("blur",Vo),{onAction:o=>(Ie=o,()=>{Ie===o&&(Ie=null)}),listProjects:async()=>{let o=await Ct({kind:"projects"});if(o.kind!=="projects")throw new p("HOST_REJECTED","Expected projects.");return o},listWorktrees:async o=>{let n=await Ct({kind:"worktrees",projectId:o});if(n.kind!=="worktrees")throw new p("HOST_REJECTED","Expected worktrees.");return n},listSessions:async o=>{let n=await Ct({kind:"sessions",projectId:o});if(n.kind!=="sessions")throw new p("HOST_REJECTED","Expected sessions.");return n},onProjects:o=>Ut({kind:"projects"},n=>{n.kind==="projects"&&o(n)}),onWorktrees:(o,n)=>Ut({kind:"worktrees",projectId:o},l=>{l.kind==="worktrees"&&n(l)}),onSessions:(o,n)=>Ut({kind:"sessions",projectId:o},l=>{l.kind==="sessions"&&n(l)}),onRunningShells:(o,n)=>tn(o,n),readShellOutput:async(o,n)=>{B(o,128);let l=n?.cursor;if(l!==void 0&&(!Number.isInteger(l)||l<0))throw new p("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let d=n?.tailBytes;if(d!==void 0&&(!Number.isInteger(d)||d<1||d>65536))throw new p("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let h=await P({...v,type:"shell-output",id:_(E),payload:{shellId:o,cursor:l,tailBytes:d}});if(!h||typeof h.output!="string"||!Number.isFinite(h.cursor))throw new p("HOST_REJECTED","Host did not return shell output.");return h},stopShell:async o=>{if(B(o,128),(await P({...v,type:"shell-stop",id:_(E),payload:{shellId:o}}))?.stopped!==!0)throw new p("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async o=>{B(o),await R({...v,type:"open-session",id:_(E),payload:{sessionId:o}})},storage:{get:async(o,n)=>{let l=Et(n),d={op:"get",key:o};l&&(d.scope=l);let g=await rt(d);return g.op==="get"&&g.found?g.value:void 0},set:async(o,n,l)=>{let d=Et(l),g={op:"set",key:o,value:n};d&&(g.scope=d),await rt(g)},delete:async(o,n)=>{let l=Et(n),d={op:"delete",key:o};l&&(d.scope=l),await rt(d)},keys:async o=>{let n=Et(o),l={op:"keys"};n&&(l.scope=n);let d=await rt(l);if(d.op!=="keys")throw new p("HOST_REJECTED","Expected storage keys.");return d.keys}},onReady:o=>(a.add(o),f&&o(f),()=>{a.delete(o)}),onDirectory:o=>(c.add(o),f&&o(f.directory),()=>{c.delete(o)}),onSession:o=>(u.add(o),f&&o(f.session),()=>{u.delete(o)}),onSessionLifecycle:o=>(m.add(o),j&&o(j),()=>{m.delete(o)}),onConnection:o=>(b.add(o),f&&o(f.connection),()=>{b.delete(o)}),onSettings:o=>(U.add(o),f&&o(f.settings),()=>{U.delete(o)}),onItem:o=>(F.add(o),f&&o(f.item),()=>{F.delete(o)}),onStatusControl:o=>(qe.add(o),()=>{qe.delete(o)}),onPopoverClosed:o=>(Ze.add(o),()=>{Ze.delete(o)}),setStatusControls:o=>f?.features?.statusControls!==!0?Promise.reject(new p("UNSUPPORTED","This host does not support status controls.")):qo(o)?R({...v,type:"status-controls",id:_(E),payload:{controls:o}}):Promise.reject(new p("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:o=>f?.features?.popovers!==!0?Promise.reject(new p("UNSUPPORTED","This host does not support popovers.")):Gt(o)?R({...v,type:"popover-open",id:_(E),payload:o}):Promise.reject(new p("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:zo,setPopoverAnchorActive:jo,onResolve:o=>(Ue=o,()=>{Ue===o&&(Ue=null)}),toast:o=>{let n=o.message.trim();return!n||n.length>st?Promise.reject(new p("HOST_REJECTED",`Toast message must contain 1 to ${st} characters.`)):o.copy&&o.copy!==!0&&(!o.copy.text.length||o.copy.text.length>at)?Promise.reject(new p("HOST_REJECTED",`Toast copy text must contain 1 to ${at} characters.`)):R({channel:S,v:1,type:"toast",id:_(E),payload:{...o,message:n}})},openUrl:o=>R({channel:S,v:1,type:"open-url",id:_(E),payload:{url:o}}),openCommit:o=>Xt(o)?R({channel:S,v:1,type:"open-commit",id:_(E),payload:{sha:o}}):Promise.reject(new p("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:o=>R({channel:S,v:1,type:"open-surface",id:_(E),payload:{surfaceId:o}}),writeClipboard:o=>R({channel:S,v:1,type:"clipboard-write",id:_(E),payload:{text:o}}),compose:o=>R({channel:S,v:1,type:"compose",id:_(E),payload:o}),attach:o=>R({channel:S,v:1,type:"attach",id:_(E),payload:_e(o)}),startSession:async o=>{o.projectId!==void 0&&B(o.projectId);let n=o.worktree;n&&n!==!0&&(n.kind==="existing"?B(n.directory):(n.name!==void 0&&B(n.name,200),n.baseBranch!==void 0&&B(n.baseBranch,200)));let l=await P({channel:S,v:1,type:"start-session",id:_(E),payload:zt(o)},e.requestTimeoutMs??18e4);if(!Ht(l))throw new p("HOST_REJECTED","Host did not return a session.");return l},prompt:o=>P({channel:S,v:1,type:"prompt",id:_(E),payload:jt(o)}).then(n=>{if(!$t(n))throw new p("HOST_REJECTED","Host did not return a prompt result.");return n}),sessionLink:o=>R({channel:S,v:1,type:"session-link",id:_(E),payload:_e(o)}),close:()=>R({channel:S,v:1,type:"close",id:_(E)}),oauthStart:()=>R({channel:S,v:1,type:"oauth-start",id:_(E)}),oauthDisconnect:()=>R({channel:S,v:1,type:"oauth-disconnect",id:_(E)}),request:o=>(pt(o.path)?P({channel:S,v:1,type:"request",id:_(E),payload:o}):gr()).then(n=>{if(!ut(n))throw new p("HOST_REJECTED","Host request result was empty.");return n}),serviceRequest:o=>(pt(o.path)?P({channel:S,v:1,type:"service-request",id:_(E),payload:o}):gr()).then(n=>{if(!ut(n))throw new p("HOST_REJECTED","Host service request result was empty.");return n}),serviceStatus:()=>P({channel:S,v:1,type:"service-status",id:_(E)}).then(o=>{if(!Jt(o))throw new p("HOST_REJECTED","Host did not return service status.");return o}),readFile:o=>(me(o)?P({channel:S,v:1,type:"file-read",id:_(E),payload:{path:o}}):ft()).then(n=>{if(!Yt(n))throw new p("HOST_REJECTED","Host did not return file content.");return n}),writeFile:(o,n)=>me(o)?n.length>ct?Promise.reject(new p("FILE_TOO_LARGE",`Content is over ${ct} characters.`)):P({channel:S,v:1,type:"file-write",id:_(E),payload:{path:o,content:n}}).then(l=>{if(!qt(l))throw new p("HOST_REJECTED","Host did not confirm the write.");return l}):ft(),listDir:o=>(me(o)?P({channel:S,v:1,type:"file-list",id:_(E),payload:{path:o}}):ft()).then(n=>{if(!Zt(n))throw new p("HOST_REJECTED","Host did not return directory entries.");return n}),stat:o=>(me(o)?P({channel:S,v:1,type:"file-stat",id:_(E),payload:{path:o}}):ft()).then(n=>{if(!Qt(n))throw new p("HOST_REJECTED","Host did not return file status.");return n}),generate:o=>{let n=o.prompt.trim(),l=o.system?.trim();if(n.length===0||n.length>lt)return Promise.reject(new p("HOST_REJECTED",`Prompt must be 1 to ${lt} characters.`));if(l!==void 0&&(l.length===0||l.length>dt))return Promise.reject(new p("HOST_REJECTED",`System prompt must be 1 to ${dt} characters.`));let d=o.maxOutputTokens===void 0?void 0:Math.min(Bt,Math.max(1,Math.floor(o.maxOutputTokens)));if(d!==void 0&&!Number.isFinite(d))return Promise.reject(new p("HOST_REJECTED","maxOutputTokens must be a number."));let g={prompt:n};return l!==void 0&&(g.system=l),d!==void 0&&(g.maxOutputTokens=d),P({channel:S,v:1,type:"generate",id:_(E),payload:g},e.requestTimeoutMs??Vt).then(h=>{if(!eo(h))throw new p("HOST_REJECTED","Host did not return generated text.");return h})},onLateGenerateResult:o=>{de.add(o);for(let n of Rt.splice(0))y([o],n);return Go(),()=>{de.delete(o)}},setBadge:o=>R({channel:S,v:1,type:"badge",id:_(E),payload:{count:Kt(o)}}),setHeight:o=>R({channel:S,v:1,type:"resize",id:_(E),payload:{height:Wt(o)}}),onFileOpen:o=>(Qe.add(o),vt||(vt=!0,t.addEventListener("keydown",$o,!0)),Ne&&o(Ne),()=>{Qe.delete(o)}),onFileSnapshot:o=>(Me=o,()=>{Me===o&&(Me=null)}),onFileSaved:o=>(et.add(o),()=>{et.delete(o)}),reportFileChange:o=>wt({...v,type:"file-change",payload:{dirty:o.dirty,edited:o.edited}}),requestFileSave:Ho,reportFileUnsupported:()=>wt({...v,type:"file-unsupported"}),dispose:()=>{for(let o of ue.keys())H({...v,type:"workspace-unsubscribe",id:_(E),payload:{subscriptionId:o}});ue.clear();for(let o of fe.keys())H({...v,type:"shells-unsubscribe",id:_(E),payload:{subscriptionId:o}});fe.clear(),V=!0,Ue=null,Ie=null,Me=null,Qe.clear(),et.clear(),vt&&t.removeEventListener("keydown",$o,!0),t.removeEventListener("message",Do),t.removeEventListener("keydown",Xo,!0),t.removeEventListener("pointerover",ot),t.removeEventListener("pointermove",ot),t.removeEventListener("pointerout",Fo),t.removeEventListener("focus",Bo),t.removeEventListener("blur",Vo);for(let o of pe.values())clearTimeout(o.timer),o.reject(new p("HOST_UNAVAILABLE","Host client was disposed."));pe.clear(),a.clear(),c.clear(),u.clear(),m.clear(),b.clear(),U.clear(),F.clear(),qe.clear(),Ze.clear(),de.clear(),Rt.length=0}}};var yr=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var us=new Set(yr);var fn=10*6e4;var kr=["none","agent","user"];var Es=new Set(kr);var En=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],_n=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Rr=(e,t)=>{t.style.colorScheme=e.mode;for(let[r,s]of En)t.style.setProperty(r,e.tokens[s]);for(let[r,s,a]of _n){let c=e.tokens[a]??"";t.style.setProperty(r,c),t.style.setProperty(s,c)}t.style.setProperty("font-family",e.tokens.font),t.style.setProperty("font-size","0.875rem"),t.style.setProperty("line-height","1.45"),t.style.setProperty("color",e.tokens.foreground)},io=(e,t)=>{Rr(e.theme,t),t.dataset&&(t.dataset.ocSurface=e.surface,t.dataset.ocTheme=e.theme.mode)};var mn={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},O=(e,t)=>`var(--${e}, var(--oc-${mn[e]}, ${t}))`,W=O("surface-background","transparent"),mt=O("surface-elevated","transparent"),Se=O("surface-elevated-foreground","inherit"),X=O("surface-foreground","inherit"),A=O("surface-muted-foreground","gray"),Sn=O("surface-muted","transparent"),te=O("interactive-border","currentColor"),G=O("interactive-hover","transparent"),se=O("interactive-active","transparent"),co=O("interactive-selection","transparent"),lo=O("interactive-selection-foreground","inherit"),K=O("primary","currentColor"),po=O("primary-text","inherit"),uo=O("error-text","inherit"),xn=O("font-sans","inherit"),fo=O("font-mono","monospace"),Ir=O("radius","9px"),Eo=`calc(${Ir} - 2px)`,vr=`calc(${Ir} - 4px)`,k=(e,t,r="transparent")=>`color-mix(in srgb, ${e} ${t}%, ${r})`,wr=`background-image: linear-gradient(${G}, ${G});`,_o=e=>`box-shadow: inset 0 0 0 1px ${e}, var(--oc-sdk-field-lift);`,mo="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Cr="box-shadow: var(--oc-sdk-lit);",Ur=`inset 0 1px 0 0 ${k(X,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2)`,bn=`
:root {
  --oc-sdk-edge: ${k(X,10)};
  --oc-sdk-field-bg: ${mt};
  --oc-sdk-raised-bg: ${W};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 2px 0 rgb(0 0 0 / 0.06);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.45), 0 1px 2px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.1);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.8), inset 0 0 0 1px rgb(0 0 0 / 0.04), 0 1px 2px -0.5px rgb(0 0 0 / 0.08), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.08);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${k(X,6)};
  --oc-sdk-field-bg: ${k(W,50,mt)};
  --oc-sdk-raised-bg: ${mt};
  --oc-sdk-field-lift: ${Ur};
  --oc-sdk-raised-lift: ${Ur};
  --oc-sdk-lit: inset 0 1px 0 0 ${k(X,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.36);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.06), inset 0 0 0 1px rgb(255 255 255 / 0.08), 0 1px 1px -0.5px rgb(0 0 0 / 0.22), 0 3px 3px -1.5px rgb(0 0 0 / 0.2), 0 6px 6px -3px rgb(0 0 0 / 0.16);
}`,_t=e=>{let t=O(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${t}; --oc-sdk-tone-text: ${O(`${e}-text`,"inherit")}; }`},Tn=`
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
.oc-sdk { color: ${X}; font-family: ${xn}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${wr} }
.oc-sdk-mono { font-family: ${fo}; }
.oc-sdk-muted { color: ${A}; }
${_t("success")}${_t("warning")}${_t("error")}${_t("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${K}; --oc-sdk-tone-text: ${po}; }

.oc-sdk-btn { border-radius: ${Eo}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${vr}; }
.oc-sdk-btn[data-variant="default"] { color: ${po}; background: ${k(K,10,W)}; border-color: ${k(K,12)}; ${Cr} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${k(K,16,W)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${k(K,22,W)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${Sn}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${G}, ${G}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${se}, ${se}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${Se}; ${mo} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${G}, ${G}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${se}, ${se}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${G}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${se}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${O("status-error","red")}; color: ${uo}; background: ${k("var(--oc-sdk-tone)",7,W)}; border-color: ${k("var(--oc-sdk-tone)",12)}; ${Cr} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${k("var(--oc-sdk-tone)",9,W)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${k("var(--oc-sdk-tone)",11,W)}; box-shadow: none; }

.oc-sdk-field-note { color: ${A}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${uo}; }
.oc-sdk-input { border-radius: ${Eo}; background: var(--oc-sdk-field-bg); color: ${Se}; ${_o("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${A}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${G}, ${G}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${_o(k(X,26))} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${_o(O("status-error","red"))} }
.oc-sdk-input[data-mono="true"] { font-family: ${fo}; }

.oc-sdk-search-icon { color: ${A}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${K}; }
.oc-sdk-search-clear { border-radius: ${vr}; color: ${A}; }
.oc-sdk-search-clear:hover { background: ${G}; color: ${X}; }

.oc-sdk-trigger { border-radius: ${Eo}; background: var(--oc-sdk-raised-bg); color: ${Se}; ${mo} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${G}, ${G}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${se}, ${se}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${A}; }
.oc-sdk-trigger-chevron { color: ${A}; }
/* The app's dropdown light: lit top, hairline rings and a layered shadow. Its outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${Se}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${mt}; background-clip: padding-box; color: ${Se}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${G}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${co}; color: ${lo}; }
.oc-sdk-option-check { color: ${X}; }
.oc-sdk-option[data-destructive="true"] { color: ${uo}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${k(O("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${A}; }
.oc-sdk-popup-empty { color: ${A}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${te}; border-radius: 4px; color: ${X}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${k(X,60,te)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${te}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${W}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${K}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${wr} }
.oc-sdk-check-desc { color: ${A}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${k(X,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${A}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${X}; }
.oc-sdk-tab[aria-selected="true"] { color: ${lo}; background: ${co}; border-color: ${te}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${Se}; background: var(--oc-sdk-raised-bg); ${mo} }
.oc-sdk-tab-count { color: ${A}; }

.oc-sdk-badge { border-radius: 9999px; background: ${G}; color: ${A}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${k("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${G}; }
.oc-sdk-row[aria-selected="true"] { background: ${co}; color: ${lo}; }
.oc-sdk-row-lead { font-family: ${fo}; color: ${A}; }
.oc-sdk-row-sub { color: ${A}; }
.oc-sdk-row-meta { color: ${A}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${A}; }

.oc-sdk-empty-body { color: ${A}; }

.oc-sdk-spinner { color: ${A}; }
.oc-sdk-spinner-ring { border-color: ${te}; border-top-color: ${K}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${k("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${A}; }

.oc-sdk-separator { color: ${A}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${k(te,40)}; }

.oc-sdk-progress-label { color: ${A}; }
.oc-sdk-progress-track { border-radius: 9999px; background: ${te}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${K}); }

.oc-sdk-text a { color: ${po}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${k(te,60)}; }
`,I=`
${It}
${Tn}
${Mr}`;var Nr="oc-sdk-ui-style",xe=e=>{for(;e.firstChild;)e.removeChild(e.firstChild)},M=e=>{let t=document.getElementById(Nr);if(t instanceof HTMLStyleElement){t.textContent!==e&&(t.textContent=e);return}Mt(document);let r=document.createElement("style");r.id=Nr,r.textContent=e,document.head.appendChild(r)},T=(e,t)=>{let r=document.createElement(e);return t&&(r.className=t),r},J=e=>{let t=T("button",e);return t.type="button",t},D=(e,t)=>{let r=t??"";e.textContent!==r&&(e.textContent=r)},be=(e,t,r)=>{r==null||r===""?e.removeAttribute(t):e.getAttribute(t)!==r&&e.setAttribute(t,r)};var hn=()=>{let e=document.createElement("span");return e.className="oc-sdk-spinner-ring",e.setAttribute("aria-hidden","true"),e},L=(e,t)=>{M(I);let r=t,s=J("oc-sdk oc-sdk-btn"),a=hn(),c=document.createElement("span");s.append(c),e.append(s);let u=()=>{s.dataset.variant=r.variant??"default",s.dataset.size=r.size??"default",s.disabled=!!r.disabled||!!r.loading,s.dataset.loading=r.loading?"true":"false",s.setAttribute("aria-busy",r.loading?"true":"false"),r.loading&&a.parentNode!==s?s.prepend(a):!r.loading&&a.parentNode===s&&a.remove(),D(c,r.label)},m=()=>{r.disabled||r.loading||r.onClick()};return s.addEventListener("click",m),u(),{update:b=>{r={...r,...b},u()},dispose:()=>{s.removeEventListener("click",m),s.remove()}}};var De=(e,t)=>{M(I);let r=t,s=T("label","oc-sdk oc-sdk-field"),a=T("span","oc-sdk-field-label"),c=r.multiline?T("textarea","oc-sdk-input"):T("input","oc-sdk-input"),u=T("span","oc-sdk-field-note");s.append(a,c,u),e.append(s);let m=()=>{D(a,r.label),a.hidden=!r.label,c instanceof HTMLInputElement?c.type=r.password?"password":"text":c.rows=r.rows??3,c.value!==r.value&&(c.value=r.value),c.disabled=!!r.disabled,be(c,"placeholder",r.placeholder),c.dataset.mono=r.mono?"true":"false";let U=!!r.error;s.dataset.invalid=U?"true":"false",c.setAttribute("aria-invalid",U?"true":"false");let F=r.error??r.helper??"";D(u,F),u.hidden=F===""},b=()=>{r.onChange(c.value)};return c.addEventListener("input",b),m(),{update:U=>{r={...r,...U},m()},dispose:()=>{c.removeEventListener("input",b),s.remove()}}};var Te=(e,t="vertical")=>{let[r,s]=t==="vertical"?["ArrowDown","ArrowUp"]:["ArrowRight","ArrowLeft"];return e.key===r||e.ctrlKey&&e.key.toLowerCase()==="n"?"next":e.key===s||e.ctrlKey&&e.key.toLowerCase()==="p"?"previous":e.key==="Home"?"first":e.key==="End"?"last":null},he=(e,t,r)=>{let s=e.filter(b=>!b.disabled);if(s.length===0)return null;let a=s[0],c=s[s.length-1];if(r==="first"||!a||!c)return a?.id??null;if(r==="last")return c.id;let u=s.findIndex(b=>b.id===t);return u===-1?r==="next"?a.id:c.id:s[Math.min(s.length-1,Math.max(0,u+(r==="next"?1:-1)))]?.id??null};var xo=(e,t)=>{M(I);let r=t,s=T("div","oc-sdk oc-sdk-tabs");s.setAttribute("role","tablist"),e.append(s);let a=()=>{xe(s),s.dataset.track=r.trackBackground?"true":"false";for(let u of r.items){let m=J("oc-sdk-tab");m.setAttribute("role","tab");let b=u.id===r.activeId;m.setAttribute("aria-selected",b?"true":"false"),m.tabIndex=b?0:-1,m.dataset.id=u.id;let U=T("span");if(U.textContent=u.label,m.append(U),u.count!==void 0){let F=T("span","oc-sdk-tab-count");F.textContent=String(u.count),m.append(F)}m.addEventListener("click",()=>{u.id!==r.activeId&&r.onChange(u.id)}),s.append(m)}},c=u=>{let m=Te(u,"horizontal");if(!m)return;let b=he(r.items,r.activeId,m);if(b&&b!==r.activeId){u.preventDefault(),r.onChange(b);let U=s.querySelector(`[data-id="${CSS.escape(b)}"]`);U instanceof HTMLElement&&U.focus()}};return s.addEventListener("keydown",c),a(),{update:u=>{r={...r,...u},a()},dispose:()=>{s.removeEventListener("keydown",c),s.remove()}}};var bo=(e,t={})=>{M(I);let r=t,s=T("span","oc-sdk oc-sdk-spinner");s.setAttribute("role","status");let a=T("span","oc-sdk-spinner-ring");a.setAttribute("aria-hidden","true");let c=T("span");s.append(a,c),e.append(s);let u=()=>{s.dataset.size=r.size??"default",D(c,r.label),c.hidden=!r.label,s.setAttribute("aria-label",r.label??"Loading")};return u(),{update:m=>{r={...r,...m},u()},dispose:()=>{s.remove()}}};var St=e=>{let t=e.trim();if(!t)throw new Error("\u8BF7\u586B\u5199\u670D\u52A1\u5730\u5740");let r;try{r=new URL(t.includes("://")?t:`https://${t}`)}catch{throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u670D\u52A1\u5730\u5740\uFF0C\u4F8B\u5982 https://relay.example.com")}if(!["https:","http:"].includes(r.protocol)||!r.hostname)throw new Error("\u670D\u52A1\u5730\u5740\u4EC5\u652F\u6301 HTTP \u6216 HTTPS");if(r.username||r.password||r.search||r.hash)throw new Error("\u670D\u52A1\u5730\u5740\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u5BC6\u94A5\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u951A\u70B9");let s=r.pathname.replace(/\/+$/,"").replace(/\/v1$/i,"");return`${r.origin}${s}`},Lr=(e,t)=>new URL(St(e)).origin!==new URL(St(t)).origin;var Y=e=>typeof e=="number"&&Number.isFinite(e)?e:null,kn=e=>{if(!e||typeof e!="object")return null;let t=e,r=Y(t.usedPercent);return typeof t.key!="string"||typeof t.label!="string"||r===null?null:{key:t.key,label:t.label,usedPercent:r,remainingPercent:Y(t.remainingPercent)??Math.max(0,100-r),resetAt:Y(t.resetAt),resetAtText:typeof t.resetAtText=="string"?t.resetAtText:null,detail:typeof t.detail=="string"?t.detail:null}},Pr=e=>{if(!e||typeof e!="object")return null;let t=e;if(typeof t.id!="string"||typeof t.name!="string")return null;let r=t.balance&&typeof t.balance=="object"?t.balance:null;return{id:t.id,name:t.name,ok:t.ok!==!1,plan:typeof t.plan=="string"?t.plan:null,balance:r&&typeof r.label=="string"?{value:Y(r.value),label:r.label,unit:typeof r.unit=="string"?r.unit:""}:null,detail:typeof t.detail=="string"?t.detail:null,windows:Array.isArray(t.windows)?t.windows.map(kn).filter(s=>s!==null):[],updatedAt:Y(t.updatedAt),stale:t.stale===!0,error:typeof t.error=="string"?t.error:void 0}},Gr=e=>{if(!e||typeof e!="object")return null;let t=e;return typeof t.id!="string"||typeof t.name!="string"||typeof t.baseUrl!="string"?null:{id:t.id,name:t.name,baseUrl:t.baseUrl,hasKey:t.hasKey===!0}};var xt=(e,t="zh-CN",r=!1)=>new Intl.DateTimeFormat(t,{...r?{month:"numeric",day:"numeric"}:{},hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e),Dr=(e,t="zh-CN",r=Date.now())=>{if(!e||!Number.isFinite(e))return null;if(e<=r)return"\u91CD\u7F6E\u65F6\u95F4\u5DF2\u5230\uFF0C\u8BF7\u5237\u65B0";let s=new Date(e),a=new Date(r),c=new Date(r);c.setDate(c.getDate()+1);let u=s.toDateString()===a.toDateString()?"\u4ECA\u5929 ":s.toDateString()===c.toDateString()?"\u660E\u5929 ":"";return`${u}${xt(e,t,!u)} \u91CD\u7F6E`};var To=(e,t,r="zh-CN")=>{if(e===null||!Number.isFinite(e))return"\u2014";let s=t==="USD"||t==="$"?"USD":t==="CNY"||t==="\xA5"?"CNY":null,a=new Intl.NumberFormat(r,{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:1}).format(e);return`${s==="USD"?"$":s==="CNY"?"\xA5":""}${a}${s?"":` ${t}`}`};var Hr=`:root {
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
html[data-oc-surface="status"] { --bx-bg: transparent; height: auto; background: transparent; }
html[data-oc-surface="status"] body { overflow: auto; height: auto; background: transparent; }
html[data-oc-surface="status"] #root, html[data-oc-surface="status"] .bx { height: auto; }
html[data-oc-surface="status"] .bx-top { padding: 0 2px 2px; border: 0; }
html[data-oc-surface="status"] .bx-view { padding: 0; overflow: visible; flex: none; }
html[data-oc-surface="status"] .bx-status-provider { padding: 0; }
html[data-oc-surface="status"] .bx-status-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 28px; padding: 0; border-radius: 6px; font-size: 13px; }
html[data-oc-surface="status"] .bx-status-provider-head { color: var(--oc-fg); font-weight: 600; }
html[data-oc-surface="status"] .bx-status-name-wrap { display: flex; flex: 1; min-width: 0; align-items: center; gap: 8px; }
html[data-oc-surface="status"] .bx-status-provider-icon { width: 14px; height: 14px; flex: none; color: var(--oc-fg); }
html[data-oc-surface="status"] .bx-status-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-label-wrap { display: flex; flex: 1; min-width: 0; align-items: baseline; gap: 6px; overflow: hidden; }
html[data-oc-surface="status"] .bx-status-label { min-width: 0; color: var(--oc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-oc-surface="status"] .bx-status-reset { flex: none; color: var(--oc-muted); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-oc-surface="status"] .bx-status-value { flex: none; color: var(--oc-muted); font-size: 13px; font-variant-numeric: tabular-nums; white-space: nowrap; }
html[data-oc-surface="status"] .bx-status-value[data-tone="warning"] { color: var(--oc-warning); }
html[data-oc-surface="status"] .bx-status-value[data-tone="error"] { color: var(--oc-error); }
html[data-oc-surface="status"] .bx-status-value[data-muted="true"] { color: var(--oc-muted); }
html[data-oc-surface="status"] .bx-status-status { flex: none; max-width: calc(100% - 2rem); min-width: 0; color: var(--oc-muted); font-size: 13px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-oc-surface="status"] .bx-status-error { color: var(--oc-muted); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
`;var Ao=ao({requestTimeoutMs:3e4}),Br=document.querySelector("#root");if(!Br)throw new Error("Missing #root");var Vr=document.createElement("style");Vr.textContent=$r+Hr;document.head.append(Vr);var i=(e,t="",r)=>{let s=document.createElement(e);return s.className=t,r!==void 0&&(s.textContent=r),s},z=[],Re=[],ge=null,ee="zh-CN",ae=!1,q=!1,ie=!1,ye=null,oe=null,bt=0,ke=0,Z="overview",Xr="",N=null,Xe=null,C=null,ze="",Tt="",ve="",He=!1,Fe=null,Fr=null,zr=!1,ho="",wn=()=>{Fe=null,kt(!0)};var we=e=>e instanceof p?e.code==="NO_SERVICE"?"\u8BF7\u5728\u8BBE\u7F6E \u2192 \u6269\u5C55\u4E2D\u5141\u8BB8\u201C\u4F59\u989D\u201D\u8FD0\u884C\u672C\u5730\u670D\u52A1\u3002":e.code==="SERVICE_FAILED"?"\u672C\u5730\u670D\u52A1\u5C1A\u672A\u5C31\u7EEA\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u6269\u5C55\u540E\u91CD\u8BD5\u3002":e.code==="HOST_TIMEOUT"?"\u67E5\u8BE2\u8017\u65F6\u8F83\u957F\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e.code==="DISABLED"?"\u4F59\u989D\u6269\u5C55\u5DF2\u505C\u7528\uFF0C\u8BF7\u5728\u6269\u5C55\u8BBE\u7F6E\u4E2D\u542F\u7528\u3002":"\u6682\u65F6\u65E0\u6CD5\u8FDE\u63A5\u672C\u5730\u670D\u52A1\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e instanceof Error?e.message:"\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",Ye=async(e,t,r={})=>{let s=await Ao.serviceRequest({method:e,path:t,...r.query?{query:r.query}:{},...r.body===void 0?{}:{body:JSON.stringify(r.body)}}),a;try{a=JSON.parse(s.body)}catch{throw new Error("\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u6570\u636E\uFF0C\u8BF7\u91CD\u8BD5\u3002")}if(!a||typeof a!="object"||Array.isArray(a))throw new Error("\u670D\u52A1\u8FD4\u56DE\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E\u3002");if(s.status>=400)throw new Error(typeof a.error=="string"?a.error:`\u8BF7\u6C42\u5931\u8D25\uFF08${s.status}\uFF09`);return a},Q=(e,t="warning")=>{let r=i("div","bx-notice",e);return r.dataset.tone=t,r.setAttribute("role",t==="error"?"alert":"status"),r},Ce=i("main","ext bx");Ce.setAttribute("aria-label","\u4F59\u989D\u4E0E\u989D\u5EA6");var je=i("header","bx-top"),Be=i("div","bx-tabs"),jr=i("div","bx-toolbar"),Kr=i("div","bx-meta"),Wr=i("span","bx-count"),ht=i("span","bx-time");ht.setAttribute("role","status");Kr.append(Wr,ht);var Jr=i("div","bx-actions"),Cn=L(Jr,{label:"\u5237\u65B0",variant:"ghost",size:"sm",onClick:wn});jr.append(Kr,Jr);je.append(jr);var ce=i("section","bx-view");ce.id="balance-overview";ce.setAttribute("aria-label","\u4F59\u989D\u603B\u89C8");var $e=i("div"),Ae=i("div"),Yr=i("p","bx-footer","\u4F59\u989D\u6309\u670D\u52A1\u5206\u522B\u663E\u793A\u3002\u70B9\u51FB\u5237\u65B0\uFF0C\u83B7\u53D6\u6700\u65B0\u6570\u636E\u3002");ce.append($e,Ae,Yr);var re=i("section","bx-view");re.id="balance-relays";re.setAttribute("aria-label","\u4E2D\u8F6C\u7AD9\u7BA1\u7406");var Oo=i("div"),At=i("div","bx-management-head");At.append(i("p","","\u7BA1\u7406\u7528\u4E8E\u67E5\u8BE2\u4F59\u989D\u7684\u8FDE\u63A5"));var Un=L(At,{label:"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9",size:"sm",onClick:()=>Io("new")}),Oe=i("div");Oo.append(At,Oe);var yo=i("div","bx-editor"),ko=i("div","bx-editor-head"),qr=i("h2","bx-editor-title"),In=L(ko,{label:"\u53D6\u6D88",variant:"ghost",size:"sm",onClick:()=>Gn()});ko.prepend(qr);var Mn=i("p","bx-editor-intro","\u586B\u5199\u8FDE\u63A5\u4FE1\u606F\uFF0C\u53EF\u5148\u6D4B\u8BD5\u518D\u4FDD\u5B58\u3002"),Ot=i("form","bx-form");Ot.noValidate=!0;Ot.addEventListener("submit",e=>{e.preventDefault(),Hn()});var Ro=i("div","bx-field"),vo=i("div","bx-field"),yt=i("div","bx-field"),Ke=De(Ro,{label:"\u540D\u79F0",placeholder:"\u4F8B\u5982\uFF1A\u65E5\u5E38\u4F7F\u7528",value:"",onChange:e=>{ze=e,Ke.update({value:e,error:void 0}),le()}}),We=De(vo,{label:"\u670D\u52A1\u5730\u5740",placeholder:"https://relay.example.com",value:"",helper:"\u53EF\u7C98\u8D34\u7F51\u7AD9\u5730\u5740\u6216\u4EE5 /v1 \u7ED3\u5C3E\u7684 API \u5730\u5740\u3002",onChange:e=>{Tt=e,We.update({value:e,error:void 0}),le()}}),ne=De(yt,{label:"API Key",placeholder:"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key",password:!0,mono:!0,value:"",onChange:e=>{ve=e,ne.update({value:e,error:void 0}),le()}}),Zr=i("div","bx-key-actions"),wo=L(Zr,{label:"\u663E\u793A\u5BC6\u94A5",variant:"ghost",size:"xs",onClick:()=>{He=!He,ne.update({password:!He}),wo.update({label:He?"\u9690\u85CF\u5BC6\u94A5":"\u663E\u793A\u5BC6\u94A5"})}});yt.append(Zr);var Je=i("div"),Co=i("div","bx-form-actions"),Nn=L(Co,{label:"\u6D4B\u8BD5\u8FDE\u63A5",variant:"outline",size:"sm",onClick:()=>{Dn()}}),Uo=i("span"),Ln=L(Uo,{label:"\u4FDD\u5B58",size:"sm",onClick:()=>{}});Uo.querySelector("button").type="submit";Co.append(Uo);Ot.append(Ro,vo,yt,Je,Co);yo.append(ko,Mn,Ot);re.append(Oo,yo);var Pn=xo(Be,{items:[{id:"overview",label:"\u603B\u89C8"},{id:"relays",label:"\u4E2D\u8F6C\u7AD9"}],activeId:"overview",onChange:e=>{Z=e==="relays"?"relays":"overview",$(),Z==="relays"&&No()}});je.prepend(Be);Ce.append(je);Ce.append(ce);Ce.append(re);Br.append(Ce);var Ve=[Ro,vo,yt].map((e,t)=>{let r=e.querySelector("input"),s=e.querySelector(".oc-sdk-field-note");return r.id=["relay-name","relay-url","relay-key"][t],r.name=r.id,r.setAttribute("aria-label",["\u540D\u79F0","\u670D\u52A1\u5730\u5740","API Key"][t]),r.autocomplete=t===2?"new-password":"off",r.spellcheck=!1,r.maxLength=[60,2048,4096][t],s.id=`${r.id}-hint`,r.setAttribute("aria-describedby",s.id),r});Ve[1].inputMode="url";var le=()=>{Je.replaceChildren()},gt=()=>{let e=C!==null;Ke.update({disabled:e}),We.update({disabled:e}),ne.update({disabled:e}),In.update({disabled:e}),wo.update({disabled:e}),Un.update({disabled:e||!!oe||ie}),Nn.update({disabled:e,loading:C==="test",label:C==="test"?"\u6D4B\u8BD5\u4E2D\u2026":"\u6D4B\u8BD5\u8FDE\u63A5"}),Ln.update({disabled:e,loading:C==="save",label:C==="save"?"\u4FDD\u5B58\u4E2D\u2026":N==="new"?"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9":"\u4FDD\u5B58\u66F4\u6539"})};function Io(e){C||(N=e,Xe=null,ze=e==="new"?"":e.name,Tt=e==="new"?"":e.baseUrl,ve="",He=!1,Ke.update({value:ze,error:void 0}),We.update({value:Tt,error:void 0}),ne.update({value:"",error:void 0,password:!0,placeholder:e==="new"?"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5",helper:e==="new"?"\u4FDD\u5B58\u540E\u4E0D\u4F1A\u663E\u793A\u5B8C\u6574\u5BC6\u94A5\u3002":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5\uFF1B\u66F4\u6362\u7AD9\u70B9\u65F6\u9700\u91CD\u65B0\u586B\u5199\u3002"}),wo.update({label:"\u663E\u793A\u5BC6\u94A5"}),le(),Z="relays",$(),re.scrollTop=0,Ve[0].focus())}function Gn(){C||(N=null,ve="",ne.update({value:"",password:!0}),le(),$(),At.querySelector("button")?.focus())}var Qr=e=>{Ke.update({error:void 0}),We.update({error:void 0}),ne.update({error:void 0});let t=null;e&&!ze.trim()&&(Ke.update({error:"\u4E3A\u8FD9\u4E2A\u8FDE\u63A5\u53D6\u4E00\u4E2A\u4FBF\u4E8E\u8BC6\u522B\u7684\u540D\u79F0\u3002"}),t=Ve[0]);let r="";try{r=St(Tt)}catch(a){We.update({error:we(a)}),t??=Ve[1]}let s=N==="new";return r&&N&&N!=="new"&&(s=Lr(N.baseUrl,r)),s&&!ve.trim()&&(ne.update({error:N==="new"?"\u8BF7\u586B\u5199 API Key\u3002":"\u66F4\u6362\u7AD9\u70B9\u65F6\uFF0C\u8BF7\u586B\u5199\u65B0\u7AD9\u70B9\u7684 API Key\u3002"}),t??=Ve[2]),t?(t.focus(),null):{name:ze.trim(),baseUrl:r,apiKey:ve.trim(),...N&&N!=="new"?{id:N.id}:{}}};async function Dn(){if(C||!N)return;let e=Qr(!1);if(e){C="test",le(),gt();try{let t=await Ye("POST","/relays/test",{body:e});if(t.ok!==!0)throw new Error(typeof t.error=="string"?t.error:"\u8FDE\u63A5\u672A\u6210\u529F\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u548C\u5BC6\u94A5\u3002");let r=t.balance,s=r&&Y(r.value)!==null?` \xB7 \u53EF\u7528 ${To(Y(r.value),typeof r.unit=="string"?r.unit:"USD",ee)}`:"";Je.replaceChildren(Q(`\u8FDE\u63A5\u6210\u529F${s}\u3002\u5C1A\u672A\u4FDD\u5B58\u3002`,"success"))}catch(t){Je.replaceChildren(Q(we(t),"error"))}finally{C=null,gt()}}}async function Hn(){if(C||!N)return;let e=Qr(!0);if(e){C="save",le(),gt();try{let t=await Ye("POST","/relays",{body:e});ke+=1,ie=!1,Mo(t),N=null,ve="",ne.update({value:"",password:!0}),Z="overview",Fe={text:`\u5DF2\u4FDD\u5B58\u201C${e.name}\u201D\u3002`,tone:"success"},$(),await kt(!0)}catch(t){Je.replaceChildren(Q(we(t),"error"))}finally{C=null,$()}}}async function $n(e){if(!C){C="delete",$();try{let t=await Ye("DELETE","/relays",{query:{id:e.id}});ke+=1,ie=!1,Mo(t),z=z.filter(r=>r.id!==`relay:${e.id}`),Xe=null,await kt(!0)}catch(t){oe=we(t)}finally{C=null,$()}}}var Mo=e=>{if(!Array.isArray(e.relays))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u4E2D\u8F6C\u7AD9\u5217\u8868\uFF0C\u8BF7\u91CD\u8BD5\u3002");Re=e.relays.map(Gr).filter(t=>t!==null),oe=null},Xn=e=>{let t=i("div","bx-window");t.dataset.tone=e.usedPercent>=90?"error":e.usedPercent>=70?"warning":"normal";let r=i("div","bx-window-head");r.append(i("span","bx-window-label",e.label),i("span","bx-percent",`\u5DF2\u7528 ${Math.round(e.usedPercent)}%`));let s=i("div","bx-track");s.setAttribute("role","progressbar"),s.setAttribute("aria-label",`${e.label}\u5DF2\u7528\u989D\u5EA6`),s.setAttribute("aria-valuemin","0"),s.setAttribute("aria-valuemax","100"),s.setAttribute("aria-valuenow",String(Math.round(e.usedPercent)));let a=i("div","bx-fill");a.style.width=`${Math.max(0,Math.min(100,e.usedPercent))}%`,s.append(a);let c=i("div","bx-window-foot");e.detail&&c.append(i("span","",e.detail));let u=Dr(e.resetAt,ee);if(u){let m=i("span","bx-reset",u);m.title=new Date(e.resetAt).toLocaleString(ee),c.append(m)}return t.append(r,s),c.childNodes.length&&t.append(c),t};var Fn=e=>{let t=i("article","bx-provider");t.setAttribute("aria-label",e.name);let r=i("div","bx-provider-head"),s=i("div"),a=i("h2","bx-name",e.name);a.title=e.name,s.append(a),e.plan&&s.append(i("div","bx-plan",e.plan));let c=i("div","bx-balance"),u=e.balance?.value??null,m=e.balance?.unit??"";if(c.append(i("strong","bx-amount",To(u,m,ee)),i("span","bx-amount-label",u!==null?e.stale?"\u4E0A\u6B21\u4F59\u989D":m==="\u79EF\u5206"?"\u5269\u4F59\u79EF\u5206":"\u53EF\u7528\u4F59\u989D":"\u4F59\u989D\u672A\u63D0\u4F9B")),r.append(s,c),t.append(r),e.detail&&t.append(i("p","bx-detail",e.detail)),e.windows.length){let b=i("div","bx-windows");b.append(...e.windows.map(Xn)),t.append(b)}if(e.ok)!e.balance&&!e.windows.length&&!e.detail&&t.append(i("p","bx-detail","\u5DF2\u8FDE\u63A5\uFF0C\u4F46\u63A5\u53E3\u6682\u672A\u63D0\u4F9B\u4F59\u989D\u6216\u989D\u5EA6\u3002"));else{let b=Q(e.error??"\u67E5\u8BE2\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u3002",e.stale?"warning":"error");e.stale&&e.updatedAt&&b.append(i("p","",`\u4EE5\u4E0A\u4E3A ${xt(e.updatedAt,ee,!0)} \u7684\u6210\u529F\u7ED3\u679C\u3002`)),t.append(b)}return t},en=(e,t,r,s="\u6DFB\u52A0\u4E2D\u8F6C\u7AD9")=>{let a=i("div","bx-empty");return a.append(i("h2","",e),i("p","",t)),r&&L(a,{label:s,size:"sm",onClick:r}),a};function go(){if(Oe.replaceChildren(),oe){let e=Q(oe,"error");L(e,{label:"\u91CD\u8BD5",size:"sm",variant:"ghost",onClick:()=>{No()}}),Oe.append(e)}if(ie&&!Re.length){Oe.append(i("p","bx-detail","\u6B63\u5728\u8BFB\u53D6\u4E2D\u8F6C\u7AD9\u2026"));return}!Re.length&&!oe&&Oe.append(en("\u8FD8\u6CA1\u6709\u4E2D\u8F6C\u7AD9","\u6DFB\u52A0\u4E00\u4E2A\u8FDE\u63A5\u540E\uFF0C\u5C31\u80FD\u5728\u603B\u89C8\u91CC\u67E5\u770B\u5B83\u7684\u4F59\u989D\u4E0E\u989D\u5EA6\u3002"));for(let e of Re){let t=i("div","bx-relay"),r=i("div","bx-relay-line"),s=i("div","bx-relay-info");s.append(i("h3","bx-relay-name",e.name),i("p","bx-relay-url",e.baseUrl));let a=i("div","bx-relay-actions");if(L(a,{label:"\u7F16\u8F91",size:"sm",variant:"ghost",disabled:C!==null,onClick:()=>Io(e)}),L(a,{label:"\u79FB\u9664",size:"sm",variant:"ghost",disabled:C!==null,onClick:()=>{Xe=e.id,go()}}),r.append(s,a),t.append(r),Xe===e.id){let c=Q(`\u79FB\u9664\u201C${e.name}\u201D\u7684\u8FDE\u63A5\uFF1F\u5DF2\u4FDD\u5B58\u7684\u5BC6\u94A5\u4F1A\u4ECE\u672C\u5730\u914D\u7F6E\u4E2D\u5220\u9664\u3002`),u=i("div","bx-actions");L(u,{label:"\u53D6\u6D88",size:"sm",variant:"ghost",disabled:C!==null,onClick:()=>{Xe=null,go()}}),L(u,{label:"\u786E\u8BA4\u79FB\u9664",size:"sm",variant:"destructive",loading:C==="delete",onClick:()=>{$n(e)}}),c.append(u),t.append(c)}Oe.append(t)}}var Bn=()=>{};function $(){let e=z.filter(t=>!t.ok).length;if(Wr.textContent=`${z.length} \u4E2A\u670D\u52A1${e?` \xB7 ${e} \u9879\u5F85\u91CD\u8BD5`:""}`,ht.textContent=q?"\u6B63\u5728\u66F4\u65B0\u2026":ge?`\u66F4\u65B0\u4E8E ${xt(ge,ee,new Date(ge).toDateString()!==new Date().toDateString())}`:"",ht.title=ge?new Date(ge).toLocaleString(ee):"",Cn.update({loading:q,disabled:!ae,label:q?"\u5237\u65B0\u4E2D":"\u5237\u65B0"}),ce.hidden=Z!=="overview",re.hidden=Z!=="relays",Yr.hidden=z.length===0,Ae.setAttribute("aria-busy",String(q)),$e.replaceChildren(),Fr&&$e.append(Q(Fr)),Fe&&$e.append(Q(Fe.text,Fe.tone)),ye&&$e.append(Q(`${ye}${z.length?" \u5DF2\u4FDD\u7559\u4E0A\u6B21\u663E\u793A\u7684\u6570\u636E\u3002":""}`,"error")),Ae.replaceChildren(),!ae||q&&!z.length){let t=i("div","bx-loading");bo(t,{label:ae?"\u6B63\u5728\u67E5\u8BE2\u4F59\u989D\u2026":"\u6B63\u5728\u8FDE\u63A5 OpenChamber\u2026"}),Ae.append(t)}else z.length?Ae.append(...z.map(Fn)):Ae.append(en(ye?"\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u4F59\u989D":"\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u4F59\u989D",ye?"\u70B9\u51FB\u5237\u65B0\u91CD\u8BD5\uFF0C\u6216\u68C0\u67E5\u6269\u5C55\u7684\u672C\u5730\u670D\u52A1\u6743\u9650\u3002":"\u5728 OpenCode \u914D\u7F6E Command Code\u3001StepFun\uFF0C\u6216\u6DFB\u52A0\u4E2D\u8F6C\u7AD9\u3002",()=>Io("new")));Bn();{let t=`${Z}:${Re.length}`;if(t!==Xr){let r=Be.contains(document.activeElement);Pn?.update({activeId:Z,items:[{id:"overview",label:"\u603B\u89C8"},{id:"relays",label:"\u4E2D\u8F6C\u7AD9",count:Re.length||void 0}]}),Xr=t,Be.querySelector('[role="tablist"]')?.setAttribute("aria-label","\u4F59\u989D\u89C6\u56FE");for(let s of Be.querySelectorAll('[role="tab"]'))s.id=`balance-tab-${s.dataset.id}`,s.setAttribute("aria-controls",`balance-${s.dataset.id}`),r&&s.dataset.id===Z&&s.focus();ce.setAttribute("role","tabpanel"),ce.setAttribute("aria-labelledby","balance-tab-overview"),re.setAttribute("role","tabpanel"),re.setAttribute("aria-labelledby","balance-tab-relays")}Oo.hidden=N!==null,yo.hidden=N===null,qr.textContent=N==="new"?"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9":"\u7F16\u8F91\u4E2D\u8F6C\u7AD9",N||go(),gt()}}async function kt(e=!1){if(q&&!e)return;let t=++bt;q=!0,ye=null,$();try{let r=await Ye("GET","/balances",e?{query:{refresh:"1"}}:{});if(t!==bt)return;if(!Array.isArray(r.providers))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u6709\u6548\u7684\u4F59\u989D\u5217\u8868\u3002");z=r.providers.map(Pr).filter(s=>s!==null),ge=Y(r.fetchedAt)}catch(r){t===bt&&(ye=we(r))}finally{t===bt&&(q=!1,$())}}async function No(){if(ie)return;let e=++ke;ie=!0,oe=null,$();try{let t=await Ye("GET","/relays");e===ke&&Mo(t)}catch(t){e===ke&&(oe=we(t))}finally{e===ke&&(ie=!1,$())}}Ao.onReady(e=>{if(io(e,document.documentElement),ee=e.locale.startsWith("zh")?e.locale:"zh-CN",document.documentElement.lang=ee,zr=!1,ae){$();return}ae=!0,kt(),No()});$();})();
