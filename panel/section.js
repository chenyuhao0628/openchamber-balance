"use strict";(()=>{var p="openchamber.sdk";var Oe="data-oc-scrolling",st=`
:root {
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 40%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 65%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${Oe}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${Oe}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${Oe}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${Oe}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function it(e){let t=e.documentElement;if(t.hasAttribute("data-oc-scrollbar-activity"))return;t.setAttribute("data-oc-scrollbar-activity","");let r=new WeakMap;e.addEventListener("scroll",s=>{let a=s.target===e?t:s.target;if(!(a instanceof Element))return;a.hasAttribute("data-oc-scrolling")||a.setAttribute("data-oc-scrolling","");let c=r.get(a);c!==void 0&&clearTimeout(c),r.set(a,setTimeout(()=>{r.delete(a),a.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var Vo=`(${it.toString()})(document);`;var Wt=["file","directory","other","missing"],ct=e=>!!(e&&"sessionId"in e),lt=e=>!!(e&&"sent"in e&&!("sessionId"in e));var qt=/^[0-9a-f]{7,64}$/i,dt=e=>qt.test(e),Ie=500,Ue=32e3,Yt=16e3,Jt=128,Qt=200,Zt=2e3,eo=16e3,to=80,oo=200,ro=16e3;var no=2e3;var pt=2e4,Me=1024,Ne=2e6;var Le=64e3,Ge=8e3,ut=4e3;var ft=9e4;var so=999,io=1e4,He=500,ao=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],co=["stopped","starting","ready","failed"],Ko=new Set(ao),lo=e=>Ko.has(e),po=e=>e&&lo(e)?e:"HOST_REJECTED",oe=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(oe):Object(e)===e?Object.values(e).every(oe):!1,uo=e=>oe(e)&&JSON.stringify(e).length<=ro,jt=e=>e?.trim().slice(0,oo)??"",re=e=>{let t=e.id.trim().slice(0,Jt),r=e.title.trim().slice(0,Qt),s=e.url.trim().slice(0,Zt),a=e.text?.trim().slice(0,eo),c=e.author?.trim().slice(0,to),b=e.kind==="pull"?"pull":"issue",E={providerId:e.providerId.trim(),id:t,title:r||t,url:s,kind:b};if(a&&(E.text=a),c&&(E.author=c),b==="pull"){let T=jt(e.branches?.head),I=jt(e.branches?.base);T&&I&&(E.branches={head:T,base:I})}return uo(e.data)&&(E.data=e.data),E},mt=e=>{let t=re(e);return e.projectId&&(t.projectId=e.projectId),e.navigation&&(t.navigation=e.navigation),e.worktree&&(t.worktree=e.worktree),t},xt=e=>{let t={text:e.text.trim().slice(0,Yt)};return e.send&&(t.send=!0),t},bt=e=>e===null||!Number.isFinite(e)?null:Math.min(so,Math.max(0,Math.round(e))),Et=e=>Number.isFinite(e)?Math.min(io,Math.max(0,Math.ceil(e))):0;var ne=e=>e.length>0&&e.length<=Me&&!e.includes("\0")&&!e.includes("\\");var Pe=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>no?!1:!e.split("/").some(r=>r==="."||r===".."),jo=new Set(co),ht=e=>!!(e&&"status"in e&&jo.has(String(e.status))&&!("body"in e)),$e=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),gt=e=>!!(e&&"content"in e&&String(e.content)===e.content),St=e=>!!(e&&"written"in e&&e.written===!0),_t=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),Wo=new Set(Wt),Tt=e=>!!(e&&"kind"in e&&"size"in e&&Wo.has(String(e.kind))&&Number.isFinite(e.size)),yt=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),qo=new Set(["workspace","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action"]),Yo=e=>Object(e)===e?e:null,at=e=>String(e)===e&&e.length>0,Jo=e=>{if(!at(e.id))return null;if(e.ok===!0){let t={channel:p,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(t.payload=e.payload),t}return e.ok===!1&&at(e.error)?{channel:p,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:po(at(e.code)?e.code:void 0)}:null},kt=e=>{let t=Yo(e);return!t||t.channel!==p||t.v!==1?null:t.type==="result"?Jo(t):!qo.has(String(t.type))||Object(t.payload)!==t.payload?null:t};var l=class extends Error{code;constructor(t,r){super(r),this.name="HostRequestError",this.code=t}},fo=()=>Promise.reject(new l("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),De=()=>Promise.reject(new l("BAD_PATH",`File path must be 1 to ${Me} characters without NUL or backslash.`)),m=e=>(e.value+=1,`oc-${e.value}`),At=(e={})=>{let t=e.target??("window"in globalThis?window:null);if(!t)throw new l("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let r=e.acceptSource??(o=>o===t.parent),s=e.requestTimeoutMs??pt,a=new Set,c=new Set,b=new Set,E=new Set,T=new Set,I=new Set,z=new Set,pe=null,ue=null,ee=new Map,te=new Map,fe=!1,f={value:0},x=null,$=null,Vt=o=>o?{sessionId:o.id,phase:o.busy?"started":"completed"}:null,j=o=>{t.parent.postMessage(o,"*")},R=(o,n)=>{for(let d of o)try{d(n)}catch(S){console.error(S)}},Kt=o=>{if(!(o instanceof MessageEvent)||!r(o.source))return;let n=kt(o.data);if(!n)return;if(n.type==="workspace"){let S=te.get(n.payload.subscriptionId);S&&R([S],n.payload.snapshot);return}if(n.type==="ready"){x=n.payload,$=Vt(n.payload.session),R(a,n.payload),R(c,n.payload.directory),R(b,n.payload.session),$&&R(E,$),R(T,n.payload.connection),R(I,n.payload.settings),R(z,n.payload.item);return}if(n.type==="directory"){x&&(x={...x,directory:n.payload.directory}),R(c,n.payload.directory);return}if(n.type==="session"){x&&(x={...x,session:n.payload.session}),n.payload.session?$?.sessionId!==n.payload.session.id&&($=Vt(n.payload.session)):$=null,R(b,n.payload.session);return}if(n.type==="session-lifecycle"){$=n.payload,R(E,n.payload);return}if(n.type==="connection"){x&&(x={...x,connection:n.payload.connection}),R(T,n.payload.connection);return}if(n.type==="settings"){x&&(x={...x,settings:n.payload.settings}),R(I,n.payload.settings);return}if(n.type==="item"){x&&(x={...x,item:n.payload.item}),R(z,n.payload.item);return}if(n.type==="action"){let S=w=>{fe||j({channel:p,v:1,type:"action-result",id:n.id,payload:w})},H=ue;if(!H){S({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>H(n.payload)).then(()=>S({ok:!0}),w=>{let nt=(w instanceof Error?w.message:String(w)).trim();S({ok:!1,error:(nt||"Action failed.").slice(0,He)})});return}if(n.type==="resolve"){let S=w=>{j({channel:p,v:1,type:"resolve-result",id:n.id,payload:w})},H=pe;if(!H){S({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>H(n.payload)).then(w=>S({item:w?re(w):null}),w=>{let nt=(w instanceof Error?w.message:String(w)).trim();S({error:(nt||"Command failed.").slice(0,He)})});return}let d=ee.get(n.id);if(d){if(clearTimeout(d.timer),ee.delete(n.id),n.ok){d.resolve(n.payload);return}d.reject(new l(n.code,n.error))}};t.addEventListener("message",Kt),j({channel:p,v:1,type:"hello"});let U=(o,n=s)=>fe||t.parent===t?Promise.reject(new l("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((d,S)=>{let H=setTimeout(()=>{ee.delete(o.id),S(new l("HOST_TIMEOUT","Host did not answer in time."))},n);ee.set(o.id,{resolve:d,reject:S,timer:H}),j(o)}),v=o=>U(o).then(()=>{}),W={channel:p,v:1},q=(o,n=1024)=>{if(!o.trim()||o.length>n)throw new l("HOST_REJECTED",`Identity must contain 1 to ${n} characters.`)},ot=async o=>{o.kind!=="projects"&&q(o.projectId);let n=await U({...W,type:"workspace-read",id:m(f),payload:o});if(!n||!("kind"in n)||!("state"in n)||n.kind!==o.kind)throw new l("HOST_REJECTED","Host did not return workspace data.");return n},rt=async(o,n)=>{o.kind!=="projects"&&q(o.projectId);let d=m(f);te.set(d,n);try{await v({...W,type:"workspace-subscribe",id:m(f),payload:{subscriptionId:d,query:o}})}catch(S){throw te.delete(d),fe||j({...W,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:d}}),S}return()=>{!te.delete(d)||fe||j({...W,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:d}})}},Ce=async o=>{if("key"in o&&(o.key.length===0||o.key.length>128))throw new l("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(o.op==="set"&&!oe(o.value))throw new l("HOST_REJECTED","Storage values must be JSON.");if(o.op==="set"&&new TextEncoder().encode(JSON.stringify(o.value)).length>65536)throw new l("HOST_REJECTED","Storage value exceeds 64 KiB.");let n=await U({...W,type:"storage",id:m(f),payload:o});if(!n||!("storage"in n)||n.op!==o.op)throw new l("HOST_REJECTED","Host did not return storage data.");return n};return{onAction:o=>(ue=o,()=>{ue===o&&(ue=null)}),listProjects:async()=>{let o=await ot({kind:"projects"});if(o.kind!=="projects")throw new l("HOST_REJECTED","Expected projects.");return o},listWorktrees:async o=>{let n=await ot({kind:"worktrees",projectId:o});if(n.kind!=="worktrees")throw new l("HOST_REJECTED","Expected worktrees.");return n},listSessions:async o=>{let n=await ot({kind:"sessions",projectId:o});if(n.kind!=="sessions")throw new l("HOST_REJECTED","Expected sessions.");return n},onProjects:o=>rt({kind:"projects"},n=>{n.kind==="projects"&&o(n)}),onWorktrees:(o,n)=>rt({kind:"worktrees",projectId:o},d=>{d.kind==="worktrees"&&n(d)}),onSessions:(o,n)=>rt({kind:"sessions",projectId:o},d=>{d.kind==="sessions"&&n(d)}),openSession:async o=>{q(o),await v({...W,type:"open-session",id:m(f),payload:{sessionId:o}})},storage:{get:async o=>{let n=await Ce({op:"get",key:o});return n.op==="get"&&n.found?n.value:void 0},set:async(o,n)=>{await Ce({op:"set",key:o,value:n})},delete:async o=>{await Ce({op:"delete",key:o})},keys:async()=>{let o=await Ce({op:"keys"});if(o.op!=="keys")throw new l("HOST_REJECTED","Expected storage keys.");return o.keys}},onReady:o=>(a.add(o),x&&o(x),()=>{a.delete(o)}),onDirectory:o=>(c.add(o),x&&o(x.directory),()=>{c.delete(o)}),onSession:o=>(b.add(o),x&&o(x.session),()=>{b.delete(o)}),onSessionLifecycle:o=>(E.add(o),$&&o($),()=>{E.delete(o)}),onConnection:o=>(T.add(o),x&&o(x.connection),()=>{T.delete(o)}),onSettings:o=>(I.add(o),x&&o(x.settings),()=>{I.delete(o)}),onItem:o=>(z.add(o),x&&o(x.item),()=>{z.delete(o)}),onResolve:o=>(pe=o,()=>{pe===o&&(pe=null)}),toast:o=>{let n=o.message.trim();return!n||n.length>Ie?Promise.reject(new l("HOST_REJECTED",`Toast message must contain 1 to ${Ie} characters.`)):o.copy&&o.copy!==!0&&(!o.copy.text.length||o.copy.text.length>Ue)?Promise.reject(new l("HOST_REJECTED",`Toast copy text must contain 1 to ${Ue} characters.`)):v({channel:p,v:1,type:"toast",id:m(f),payload:{...o,message:n}})},openUrl:o=>v({channel:p,v:1,type:"open-url",id:m(f),payload:{url:o}}),openCommit:o=>dt(o)?v({channel:p,v:1,type:"open-commit",id:m(f),payload:{sha:o}}):Promise.reject(new l("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:o=>v({channel:p,v:1,type:"open-surface",id:m(f),payload:{surfaceId:o}}),writeClipboard:o=>v({channel:p,v:1,type:"clipboard-write",id:m(f),payload:{text:o}}),compose:o=>v({channel:p,v:1,type:"compose",id:m(f),payload:o}),attach:o=>v({channel:p,v:1,type:"attach",id:m(f),payload:re(o)}),startSession:async o=>{o.projectId!==void 0&&q(o.projectId);let n=o.worktree;n&&n!==!0&&(n.kind==="existing"?q(n.directory):(n.name!==void 0&&q(n.name,200),n.baseBranch!==void 0&&q(n.baseBranch,200)));let d=await U({channel:p,v:1,type:"start-session",id:m(f),payload:mt(o)},e.requestTimeoutMs??18e4);if(!ct(d))throw new l("HOST_REJECTED","Host did not return a session.");return d},prompt:o=>U({channel:p,v:1,type:"prompt",id:m(f),payload:xt(o)}).then(n=>{if(!lt(n))throw new l("HOST_REJECTED","Host did not return a prompt result.");return n}),sessionLink:o=>v({channel:p,v:1,type:"session-link",id:m(f),payload:re(o)}),close:()=>v({channel:p,v:1,type:"close",id:m(f)}),oauthStart:()=>v({channel:p,v:1,type:"oauth-start",id:m(f)}),oauthDisconnect:()=>v({channel:p,v:1,type:"oauth-disconnect",id:m(f)}),request:o=>(Pe(o.path)?U({channel:p,v:1,type:"request",id:m(f),payload:o}):fo()).then(n=>{if(!$e(n))throw new l("HOST_REJECTED","Host request result was empty.");return n}),serviceRequest:o=>(Pe(o.path)?U({channel:p,v:1,type:"service-request",id:m(f),payload:o}):fo()).then(n=>{if(!$e(n))throw new l("HOST_REJECTED","Host service request result was empty.");return n}),serviceStatus:()=>U({channel:p,v:1,type:"service-status",id:m(f)}).then(o=>{if(!ht(o))throw new l("HOST_REJECTED","Host did not return service status.");return o}),readFile:o=>(ne(o)?U({channel:p,v:1,type:"file-read",id:m(f),payload:{path:o}}):De()).then(n=>{if(!gt(n))throw new l("HOST_REJECTED","Host did not return file content.");return n}),writeFile:(o,n)=>ne(o)?n.length>Ne?Promise.reject(new l("FILE_TOO_LARGE",`Content is over ${Ne} characters.`)):U({channel:p,v:1,type:"file-write",id:m(f),payload:{path:o,content:n}}).then(d=>{if(!St(d))throw new l("HOST_REJECTED","Host did not confirm the write.");return d}):De(),listDir:o=>(ne(o)?U({channel:p,v:1,type:"file-list",id:m(f),payload:{path:o}}):De()).then(n=>{if(!_t(n))throw new l("HOST_REJECTED","Host did not return directory entries.");return n}),stat:o=>(ne(o)?U({channel:p,v:1,type:"file-stat",id:m(f),payload:{path:o}}):De()).then(n=>{if(!Tt(n))throw new l("HOST_REJECTED","Host did not return file status.");return n}),generate:o=>{let n=o.prompt.trim(),d=o.system?.trim();if(n.length===0||n.length>Le)return Promise.reject(new l("HOST_REJECTED",`Prompt must be 1 to ${Le} characters.`));if(d!==void 0&&(d.length===0||d.length>Ge))return Promise.reject(new l("HOST_REJECTED",`System prompt must be 1 to ${Ge} characters.`));let S=o.maxOutputTokens===void 0?void 0:Math.min(ut,Math.max(1,Math.floor(o.maxOutputTokens)));if(S!==void 0&&!Number.isFinite(S))return Promise.reject(new l("HOST_REJECTED","maxOutputTokens must be a number."));let H={prompt:n};return d!==void 0&&(H.system=d),S!==void 0&&(H.maxOutputTokens=S),U({channel:p,v:1,type:"generate",id:m(f),payload:H},e.requestTimeoutMs??ft).then(w=>{if(!yt(w))throw new l("HOST_REJECTED","Host did not return generated text.");return w})},setBadge:o=>v({channel:p,v:1,type:"badge",id:m(f),payload:{count:bt(o)}}),setHeight:o=>v({channel:p,v:1,type:"resize",id:m(f),payload:{height:Et(o)}}),dispose:()=>{for(let o of te.keys())j({...W,type:"workspace-unsubscribe",id:m(f),payload:{subscriptionId:o}});te.clear(),fe=!0,pe=null,ue=null,t.removeEventListener("message",Kt);for(let o of ee.values())clearTimeout(o.timer),o.reject(new l("HOST_UNAVAILABLE","Host client was disposed."));ee.clear(),a.clear(),c.clear(),b.clear(),E.clear(),T.clear(),I.clear(),z.clear()}}};var bo=["browser.open","browser.snapshot","browser.click","browser.type","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize"];var Dr=new Set(bo);var Eo=["none","agent","user"];var Xr=new Set(Eo);var Qo=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],ho=(e,t)=>{t.style.colorScheme=e.mode;for(let[r,s]of Qo)t.style.setProperty(r,e.tokens[s]);t.style.setProperty("font-family",e.tokens.font),t.style.setProperty("font-size","0.875rem"),t.style.setProperty("line-height","1.45"),t.style.setProperty("color",e.tokens.foreground)},wt=(e,t)=>{ho(e.theme,t),t.dataset&&(t.dataset.ocSurface=e.surface,t.dataset.ocTheme=e.theme.mode)};var go="oc-sdk-ui-style";var k=e=>{let t=document.getElementById(go);if(t instanceof HTMLStyleElement){t.textContent!==e&&(t.textContent=e);return}it(document);let r=document.createElement("style");r.id=go,r.textContent=e,document.head.appendChild(r)},h=(e,t)=>{let r=document.createElement(e);return t&&(r.className=t),r},B=e=>{let t=h("button",e);return t.type="button",t},C=(e,t)=>{let r=t??"";e.textContent!==r&&(e.textContent=r)},se=(e,t,r)=>{r==null||r===""?e.removeAttribute(t):e.getAttribute(t)!==r&&e.setAttribute(t,r)};var Zo={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},g=(e,t)=>`var(--${e}, var(--oc-${Zo[e]}, ${t}))`,Y=g("surface-background","transparent"),Fe=g("surface-elevated","transparent"),me=g("surface-elevated-foreground","inherit"),xe=g("surface-foreground","inherit"),_=g("surface-muted-foreground","gray"),er=g("surface-muted","transparent"),G=g("interactive-border","currentColor"),M=g("interactive-hover","transparent"),J=g("interactive-active","transparent"),vt=g("interactive-selection","transparent"),Rt=g("interactive-selection-foreground","inherit"),To=g("interactive-focus-ring","currentColor"),P=g("primary","currentColor"),Ct=g("primary-text","inherit"),Ot=g("error-text","inherit"),tr=g("font-sans","inherit"),It=g("font-mono","monospace"),So=g("radius","9px"),y=(e,t,r="transparent")=>`color-mix(in srgb, ${e} ${t}%, ${r})`,_o=`box-shadow: 0 0 0 2px ${To};`,Xe=e=>{let t=g(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${t}; --oc-sdk-tone-text: ${g(`${e}-text`,"inherit")}; }`},A=`
${st}
.oc-sdk { box-sizing: border-box; color: ${xe}; font-family: ${tr}; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }
.oc-sdk :focus-visible { outline: none; ${_o} }
.oc-sdk-mono { font-family: ${It}; }
.oc-sdk-muted { color: ${_}; }
${Xe("success")}${Xe("warning")}${Xe("error")}${Xe("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${P}; --oc-sdk-tone-text: ${Ct}; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 14px; border: 1px solid transparent; border-radius: ${So}; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="sm"] { height: 32px; padding: 0 10px; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { height: 24px; padding: 0 8px; font-size: 0.75rem; border-radius: 6px; }
.oc-sdk-btn[data-variant="default"] { color: ${Ct}; background: ${y(P,10,Y)}; border-color: ${y(P,12)}; }
.oc-sdk-btn[data-variant="default"]:hover { background: ${y(P,16,Y)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${y(P,22,Y)}; }
.oc-sdk-btn[data-variant="secondary"] { background: ${er}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${M}, ${M}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${J}, ${J}); }
.oc-sdk-btn[data-variant="outline"] { background: ${Fe}; color: ${me}; border-color: ${G}; }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${M}, ${M}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${J}, ${J}); }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${M}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${J}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${g("status-error","red")}; color: ${Ot}; background: ${y("var(--oc-sdk-tone)",7,Y)}; border-color: ${y("var(--oc-sdk-tone)",12)}; }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${y("var(--oc-sdk-tone)",9,Y)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${y("var(--oc-sdk-tone)",11,Y)}; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: 14px; height: 14px; }

.oc-sdk-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; color: ${_}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${Ot}; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: 36px; padding: 0 12px; border: 0; border-radius: ${So}; background: ${Fe}; color: ${me}; font-size: 0.875rem; line-height: 1.45; appearance: none; box-shadow: inset 0 0 0 1px ${y(G,60)}; transition: background 150ms ease-out, box-shadow 150ms ease-out; }
textarea.oc-sdk-input { height: auto; padding: 8px 12px; resize: vertical; }
.oc-sdk-input::placeholder { color: ${_}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${M}, ${M}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { box-shadow: inset 0 0 0 2px ${To}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input { box-shadow: inset 0 0 0 1px ${g("status-error","red")}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { box-shadow: inset 0 0 0 2px ${g("status-error","red")}; }
.oc-sdk-input[data-mono="true"] { font-family: ${It}; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: 34px; padding-right: 34px; }
.oc-sdk-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: ${_}; pointer-events: none; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${P}; }
.oc-sdk-search-clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; color: ${_}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }
.oc-sdk-search-clear:hover { background: ${M}; color: ${xe}; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: 6px; width: 100%; min-width: 0; height: 32px; padding: 0 8px 0 10px; border: 1px solid ${G}; border-radius: 6px; background: ${Fe}; color: ${me}; font-size: 0.8125rem; text-align: left; transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${M}, ${M}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${J}, ${J}); }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-value[data-empty="true"] { color: ${_}; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; color: ${_}; }
.oc-sdk-popup { --surface-foreground: ${me}; position: fixed; z-index: 50; display: flex; flex-direction: column; gap: 2px; min-width: 160px; max-width: calc(100vw - 16px); max-height: min(320px, calc(100vh - 16px)); overflow: auto; padding: 4px; border: 1px solid ${y(G,60)}; border-radius: 12px; background: ${Fe}; color: ${me}; box-shadow: 0 8px 24px ${y(xe,12)}; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: 2px 2px 4px; }
.oc-sdk-popup-search .oc-sdk-input { height: 32px; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border-radius: 8px; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option[data-active="true"] { background: ${M}; }
.oc-sdk-option[aria-selected="true"] { background: ${vt}; color: ${Rt}; }
.oc-sdk-option[data-destructive="true"] { color: ${Ot}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${y(g("status-error","red"),10)}; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; color: ${_}; }
.oc-sdk-option-check { flex: 0 0 auto; width: 12px; }
.oc-sdk-popup-empty { padding: 8px; font-size: 0.8125rem; color: ${_}; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-top: 3px; border: 1px solid ${G}; border-radius: 4px; color: ${P}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${y(P,65,G)}; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: 36px; height: 20px; border-radius: 9999px; background: ${G}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 9999px; background: ${Y}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${P}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${_o} }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; color: ${_}; }

.oc-sdk-tabs { display: inline-flex; gap: 2px; padding: 2px; border-radius: 10px; max-width: 100%; overflow: auto; }
.oc-sdk-tabs[data-track="true"] { background: ${y(xe,4)}; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid transparent; border-radius: 8px; font-size: 0.8125rem; font-weight: 500; color: ${_}; white-space: nowrap; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${xe}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Rt}; background: ${vt}; border-color: ${G}; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; color: ${_}; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: 1px 6px; border-radius: 9999px; font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; background: ${M}; color: ${_}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${y("var(--oc-sdk-tone)",15)}; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border-radius: 6px; text-align: left; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${M}; }
.oc-sdk-row[aria-selected="true"] { background: ${vt}; color: ${Rt}; }
.oc-sdk-row-lead { flex: 0 0 auto; width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: ${It}; font-size: 0.75rem; color: ${_}; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; color: ${_}; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; color: ${_}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { padding: 16px 8px; text-align: center; font-size: 0.8125rem; color: ${_}; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 40px 16px; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; color: ${_}; }
.oc-sdk-empty-action { margin-top: 12px; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8125rem; color: ${_}; }
.oc-sdk-spinner-ring { width: 16px; height: 16px; border: 2px solid ${G}; border-top-color: ${P}; border-radius: 9999px; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: 12px; height: 12px; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px; border: 1px solid ${y("var(--oc-sdk-tone)",40)}; border-radius: 8px; background: ${y("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { font-size: 0.8125rem; color: ${_}; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: 8px; width: 100%; margin: 8px 0; font-size: 0.75rem; color: ${_}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; background: ${y(G,40)}; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: 4px 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; color: ${_}; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: 6px; border-radius: 9999px; background: ${G}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; border-radius: 9999px; background: var(--oc-sdk-tone, ${P}); transform-origin: left; transition: transform 200ms ease-out; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text a { color: ${Ct}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { display: block; max-width: 100%; margin: 8px 0; border-radius: 8px; border: 1px solid ${y(G,60)}; }
`;var or=()=>{let e=document.createElement("span");return e.className="oc-sdk-spinner-ring",e.setAttribute("aria-hidden","true"),e},N=(e,t)=>{k(A);let r=t,s=B("oc-sdk oc-sdk-btn"),a=or(),c=document.createElement("span");s.append(c),e.append(s);let b=()=>{s.dataset.variant=r.variant??"default",s.dataset.size=r.size??"default",s.disabled=!!r.disabled||!!r.loading,s.dataset.loading=r.loading?"true":"false",s.setAttribute("aria-busy",r.loading?"true":"false"),r.loading&&a.parentNode!==s?s.prepend(a):!r.loading&&a.parentNode===s&&a.remove(),C(c,r.label)},E=()=>{r.disabled||r.loading||r.onClick()};return s.addEventListener("click",E),b(),{update:T=>{r={...r,...T},b()},dispose:()=>{s.removeEventListener("click",E),s.remove()}}};var be=(e,t)=>{k(A);let r=t,s=h("label","oc-sdk oc-sdk-field"),a=h("span","oc-sdk-field-label"),c=r.multiline?h("textarea","oc-sdk-input"):h("input","oc-sdk-input"),b=h("span","oc-sdk-field-note");s.append(a,c,b),e.append(s);let E=()=>{C(a,r.label),a.hidden=!r.label,c instanceof HTMLInputElement?c.type=r.password?"password":"text":c.rows=r.rows??3,c.value!==r.value&&(c.value=r.value),c.disabled=!!r.disabled,se(c,"placeholder",r.placeholder),c.dataset.mono=r.mono?"true":"false";let I=!!r.error;s.dataset.invalid=I?"true":"false",c.setAttribute("aria-invalid",I?"true":"false");let z=r.error??r.helper??"";C(b,z),b.hidden=z===""},T=()=>{r.onChange(c.value)};return c.addEventListener("input",T),E(),{update:I=>{r={...r,...I},E()},dispose:()=>{c.removeEventListener("input",T),s.remove()}}};var Ut=(e,t={})=>{k(A);let r=t,s=h("span","oc-sdk oc-sdk-spinner");s.setAttribute("role","status");let a=h("span","oc-sdk-spinner-ring");a.setAttribute("aria-hidden","true");let c=h("span");s.append(a,c),e.append(s);let b=()=>{s.dataset.size=r.size??"default",C(c,r.label),c.hidden=!r.label,s.setAttribute("aria-label",r.label??"Loading")};return b(),{update:E=>{r={...r,...E},b()},dispose:()=>{s.remove()}}};var Ke=e=>{let t=e.trim();if(!t)throw new Error("\u8BF7\u586B\u5199\u670D\u52A1\u5730\u5740");let r;try{r=new URL(t.includes("://")?t:`https://${t}`)}catch{throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u670D\u52A1\u5730\u5740\uFF0C\u4F8B\u5982 https://relay.example.com")}if(!["https:","http:"].includes(r.protocol)||!r.hostname)throw new Error("\u670D\u52A1\u5730\u5740\u4EC5\u652F\u6301 HTTP \u6216 HTTPS");if(r.username||r.password||r.search||r.hash)throw new Error("\u670D\u52A1\u5730\u5740\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u5BC6\u94A5\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u951A\u70B9");let s=r.pathname.replace(/\/+$/,"").replace(/\/v1$/i,"");return`${r.origin}${s}`},ko=(e,t)=>new URL(Ke(e)).origin!==new URL(Ke(t)).origin;var D=e=>typeof e=="number"&&Number.isFinite(e)?e:null,ar=e=>{if(!e||typeof e!="object")return null;let t=e,r=D(t.usedPercent);return typeof t.key!="string"||typeof t.label!="string"||r===null?null:{key:t.key,label:t.label,usedPercent:r,remainingPercent:D(t.remainingPercent)??Math.max(0,100-r),resetAt:D(t.resetAt),resetAtText:typeof t.resetAtText=="string"?t.resetAtText:null,detail:typeof t.detail=="string"?t.detail:null}},Ao=e=>{if(!e||typeof e!="object")return null;let t=e;if(typeof t.id!="string"||typeof t.name!="string")return null;let r=t.balance&&typeof t.balance=="object"?t.balance:null;return{id:t.id,name:t.name,ok:t.ok!==!1,plan:typeof t.plan=="string"?t.plan:null,balance:r&&typeof r.label=="string"?{value:D(r.value),label:r.label,unit:typeof r.unit=="string"?r.unit:""}:null,detail:typeof t.detail=="string"?t.detail:null,windows:Array.isArray(t.windows)?t.windows.map(ar).filter(s=>s!==null):[],updatedAt:D(t.updatedAt),stale:t.stale===!0,error:typeof t.error=="string"?t.error:void 0}},wo=e=>{if(!e||typeof e!="object")return null;let t=e;return typeof t.id!="string"||typeof t.name!="string"||typeof t.baseUrl!="string"?null:{id:t.id,name:t.name,baseUrl:t.baseUrl,hasKey:t.hasKey===!0}};var je=(e,t="zh-CN",r=!1)=>new Intl.DateTimeFormat(t,{...r?{month:"numeric",day:"numeric"}:{},hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e),vo=(e,t="zh-CN",r=Date.now())=>{if(!e||!Number.isFinite(e))return null;if(e<=r)return"\u91CD\u7F6E\u65F6\u95F4\u5DF2\u5230\uFF0C\u8BF7\u5237\u65B0";let s=new Date(e),a=new Date(r),c=new Date(r);c.setDate(c.getDate()+1);let b=s.toDateString()===a.toDateString()?"\u4ECA\u5929 ":s.toDateString()===c.toDateString()?"\u660E\u5929 ":"";return`${b}${je(e,t,!b)} \u91CD\u7F6E`},Mt=(e,t,r="zh-CN")=>{if(e===null||!Number.isFinite(e))return"\u2014";let s=t==="USD"||t==="$"?"USD":t==="CNY"||t==="\xA5"?"CNY":null,a=new Intl.NumberFormat(r,{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:1}).format(e);return`${s==="USD"?"$":s==="CNY"?"\xA5":""}${a}${s?"":` ${t}`}`};var Ro=`:root {
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
html[data-oc-surface="status"] .bx-view { padding: 0 2px 4px; overflow: visible; flex: none; }
html[data-oc-surface="status"] .bx-provider { padding: 10px 0; }
html[data-oc-surface="status"] .bx-name { font-size: 12px; }
html[data-oc-surface="status"] .bx-amount { font-size: 14px; }
html[data-oc-surface="status"] .bx-amount-label, html[data-oc-surface="status"] .bx-plan { font-size: 10px; }
html[data-oc-surface="status"] .bx-windows { gap: 8px; margin-top: 8px; }
html[data-oc-surface="status"] .bx-track { margin-top: 3px; height: 3px; }
html[data-oc-surface="status"] .bx-window-label, html[data-oc-surface="status"] .bx-percent { font-size: 11px; }
html[data-oc-surface="status"] .bx-window-foot { font-size: 10px; margin-top: 2px; }
html[data-oc-surface="status"] .bx-empty { padding: 16px 0; }
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
`;var Co=`/* Shared foundation for OpenChamber extensions. Colors and fonts belong to the host. */
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
`;async function Oo(e,t){try{await e.openSurface(`plugin:${t.id}`)}catch{throw new Error(`\u672A\u80FD\u6253\u5F00\u300C${t.name}\u300D\u3002\u8BF7\u91CD\u65B0\u52A0\u8F7D\u754C\u9762\u540E\u91CD\u8BD5\u3002`)}}var Je=At({requestTimeoutMs:3e4}),Io=document.querySelector("#root");if(!Io)throw new Error("Missing #root");var Uo=document.createElement("style");Uo.textContent=Co+Ro;document.head.append(Uo);var i=(e,t="",r)=>{let s=document.createElement(e);return s.className=t,r!==void 0&&(s.textContent=r),s},ie=[],dr=[],ae=null,F="zh-CN",ge=!1,V=!1,Mo=!1,le=null,No=null,We=0,pr=0,Lo="overview";var O=null,ur=null,L=null,Te="",qe="",de="",Ee=!1,Se=null,Nt=null,Qe=e=>e instanceof l?e.code==="NO_SERVICE"?"\u8BF7\u5728\u8BBE\u7F6E \u2192 \u6269\u5C55\u4E2D\u5141\u8BB8\u201C\u4F59\u989D\u201D\u8FD0\u884C\u672C\u5730\u670D\u52A1\u3002":e.code==="SERVICE_FAILED"?"\u672C\u5730\u670D\u52A1\u5C1A\u672A\u5C31\u7EEA\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u6269\u5C55\u540E\u91CD\u8BD5\u3002":e.code==="HOST_TIMEOUT"?"\u67E5\u8BE2\u8017\u65F6\u8F83\u957F\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e.code==="DISABLED"?"\u4F59\u989D\u6269\u5C55\u5DF2\u505C\u7528\uFF0C\u8BF7\u5728\u6269\u5C55\u8BBE\u7F6E\u4E2D\u542F\u7528\u3002":"\u6682\u65F6\u65E0\u6CD5\u8FDE\u63A5\u672C\u5730\u670D\u52A1\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":e instanceof Error?e.message:"\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",Gt=async(e,t,r={})=>{let s=await Je.serviceRequest({method:e,path:t,...r.query?{query:r.query}:{},...r.body===void 0?{}:{body:JSON.stringify(r.body)}}),a;try{a=JSON.parse(s.body)}catch{throw new Error("\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u6570\u636E\uFF0C\u8BF7\u91CD\u8BD5\u3002")}if(!a||typeof a!="object"||Array.isArray(a))throw new Error("\u670D\u52A1\u8FD4\u56DE\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E\u3002");if(s.status>=400)throw new Error(typeof a.error=="string"?a.error:`\u8BF7\u6C42\u5931\u8D25\uFF08${s.status}\uFF09`);return a},Q=(e,t="warning")=>{let r=i("div","bx-notice",e);return r.dataset.tone=t,r.setAttribute("role",t==="error"?"alert":"status"),r},ye=i("main","ext bx");ye.setAttribute("aria-label","\u4F59\u989D\u4E0E\u989D\u5EA6");var Go=i("header","bx-top"),fc=i("div","bx-tabs"),Ho=i("div","bx-toolbar"),Po=i("div","bx-meta"),$o=i("span","bx-count"),Ye=i("span","bx-time");Ye.setAttribute("role","status");Po.append($o,Ye);var Ht=i("div","bx-actions"),fr=N(Ht,{label:"\u5237\u65B0",variant:"ghost",size:"sm",onClick:()=>{Se=null,Bt(!0)}});N(Ht,{label:"\u7BA1\u7406",variant:"ghost",size:"sm",onClick:()=>{Oo(Je,{id:"balance",name:"\u4F59\u989D"}).catch(e=>{Nt=e.message,X()})}});Ho.append(Po,Ht);Go.append(Ho);var ve=i("section","bx-view");ve.id="balance-overview";ve.setAttribute("aria-label","\u4F59\u989D\u603B\u89C8");var he=i("div"),ce=i("div"),Do=i("p","bx-footer","\u4F59\u989D\u6309\u670D\u52A1\u5206\u522B\u663E\u793A\u3002\u70B9\u51FB\u5237\u65B0\uFF0C\u83B7\u53D6\u6700\u65B0\u6570\u636E\u3002");ve.append(he,ce,Do);var Re=i("section","bx-view");Re.id="balance-relays";Re.setAttribute("aria-label","\u4E2D\u8F6C\u7AD9\u7BA1\u7406");var Fo=i("div"),Ze=i("div","bx-management-head");Ze.append(i("p","","\u7BA1\u7406\u7528\u4E8E\u67E5\u8BE2\u4F59\u989D\u7684\u8FDE\u63A5"));var mr=N(Ze,{label:"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9",size:"sm",onClick:()=>_r("new")}),xr=i("div");Fo.append(Ze,xr);var Xo=i("div","bx-editor"),Pt=i("div","bx-editor-head"),br=i("h2","bx-editor-title"),Er=N(Pt,{label:"\u53D6\u6D88",variant:"ghost",size:"sm",onClick:()=>Tr()});Pt.prepend(br);var hr=i("p","bx-editor-intro","\u586B\u5199\u8FDE\u63A5\u4FE1\u606F\uFF0C\u53EF\u5148\u6D4B\u8BD5\u518D\u4FDD\u5B58\u3002"),et=i("form","bx-form");et.noValidate=!0;et.addEventListener("submit",e=>{e.preventDefault(),kr()});var $t=i("div","bx-field"),Dt=i("div","bx-field"),tt=i("div","bx-field"),ke=be($t,{label:"\u540D\u79F0",placeholder:"\u4F8B\u5982\uFF1A\u65E5\u5E38\u4F7F\u7528",value:"",onChange:e=>{Te=e,ke.update({value:e,error:void 0}),Z()}}),Ae=be(Dt,{label:"\u670D\u52A1\u5730\u5740",placeholder:"https://relay.example.com",value:"",helper:"\u53EF\u7C98\u8D34\u7F51\u7AD9\u5730\u5740\u6216\u4EE5 /v1 \u7ED3\u5C3E\u7684 API \u5730\u5740\u3002",onChange:e=>{qe=e,Ae.update({value:e,error:void 0}),Z()}}),K=be(tt,{label:"API Key",placeholder:"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key",password:!0,mono:!0,value:"",onChange:e=>{de=e,K.update({value:e,error:void 0}),Z()}}),zo=i("div","bx-key-actions"),Ft=N(zo,{label:"\u663E\u793A\u5BC6\u94A5",variant:"ghost",size:"xs",onClick:()=>{Ee=!Ee,K.update({password:!Ee}),Ft.update({label:Ee?"\u9690\u85CF\u5BC6\u94A5":"\u663E\u793A\u5BC6\u94A5"})}});tt.append(zo);var we=i("div"),Xt=i("div","bx-form-actions"),gr=N(Xt,{label:"\u6D4B\u8BD5\u8FDE\u63A5",variant:"outline",size:"sm",onClick:()=>{yr()}}),zt=i("span"),Sr=N(zt,{label:"\u4FDD\u5B58",size:"sm",onClick:()=>{}});zt.querySelector("button").type="submit";Xt.append(zt);et.append($t,Dt,tt,we,Xt);Xo.append(Pt,hr,et);Re.append(Fo,Xo);ye.append(Go,ve);Io.append(ye);var _e=[$t,Dt,tt].map((e,t)=>{let r=e.querySelector("input"),s=e.querySelector(".oc-sdk-field-note");return r.id=["relay-name","relay-url","relay-key"][t],r.name=r.id,r.setAttribute("aria-label",["\u540D\u79F0","\u670D\u52A1\u5730\u5740","API Key"][t]),r.autocomplete=t===2?"new-password":"off",r.spellcheck=!1,r.maxLength=[60,2048,4096][t],s.id=`${r.id}-hint`,r.setAttribute("aria-describedby",s.id),r});_e[1].inputMode="url";var Z=()=>{we.replaceChildren()},Lt=()=>{let e=L!==null;ke.update({disabled:e}),Ae.update({disabled:e}),K.update({disabled:e}),Er.update({disabled:e}),Ft.update({disabled:e}),mr.update({disabled:e||!!No||Mo}),gr.update({disabled:e,loading:L==="test",label:L==="test"?"\u6D4B\u8BD5\u4E2D\u2026":"\u6D4B\u8BD5\u8FDE\u63A5"}),Sr.update({disabled:e,loading:L==="save",label:L==="save"?"\u4FDD\u5B58\u4E2D\u2026":O==="new"?"\u6DFB\u52A0\u4E2D\u8F6C\u7AD9":"\u4FDD\u5B58\u66F4\u6539"})};function _r(e){L||(O=e,ur=null,Te=e==="new"?"":e.name,qe=e==="new"?"":e.baseUrl,de="",Ee=!1,ke.update({value:Te,error:void 0}),Ae.update({value:qe,error:void 0}),K.update({value:"",error:void 0,password:!0,placeholder:e==="new"?"\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5",helper:e==="new"?"\u4FDD\u5B58\u540E\u4E0D\u4F1A\u663E\u793A\u5B8C\u6574\u5BC6\u94A5\u3002":"\u7559\u7A7A\u4FDD\u7559\u73B0\u6709\u5BC6\u94A5\uFF1B\u66F4\u6362\u7AD9\u70B9\u65F6\u9700\u91CD\u65B0\u586B\u5199\u3002"}),Ft.update({label:"\u663E\u793A\u5BC6\u94A5"}),Z(),Lo="relays",X(),Re.scrollTop=0,_e[0].focus())}function Tr(){L||(O=null,de="",K.update({value:"",password:!0}),Z(),X(),Ze.querySelector("button")?.focus())}var Bo=e=>{ke.update({error:void 0}),Ae.update({error:void 0}),K.update({error:void 0});let t=null;e&&!Te.trim()&&(ke.update({error:"\u4E3A\u8FD9\u4E2A\u8FDE\u63A5\u53D6\u4E00\u4E2A\u4FBF\u4E8E\u8BC6\u522B\u7684\u540D\u79F0\u3002"}),t=_e[0]);let r="";try{r=Ke(qe)}catch(a){Ae.update({error:Qe(a)}),t??=_e[1]}let s=O==="new";return r&&O&&O!=="new"&&(s=ko(O.baseUrl,r)),s&&!de.trim()&&(K.update({error:O==="new"?"\u8BF7\u586B\u5199 API Key\u3002":"\u66F4\u6362\u7AD9\u70B9\u65F6\uFF0C\u8BF7\u586B\u5199\u65B0\u7AD9\u70B9\u7684 API Key\u3002"}),t??=_e[2]),t?(t.focus(),null):{name:Te.trim(),baseUrl:r,apiKey:de.trim(),...O&&O!=="new"?{id:O.id}:{}}};async function yr(){if(L||!O)return;let e=Bo(!1);if(e){L="test",Z(),Lt();try{let t=await Gt("POST","/relays/test",{body:e});if(t.ok!==!0)throw new Error(typeof t.error=="string"?t.error:"\u8FDE\u63A5\u672A\u6210\u529F\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u548C\u5BC6\u94A5\u3002");let r=t.balance,s=r&&D(r.value)!==null?` \xB7 \u53EF\u7528 ${Mt(D(r.value),typeof r.unit=="string"?r.unit:"USD",F)}`:"";we.replaceChildren(Q(`\u8FDE\u63A5\u6210\u529F${s}\u3002\u5C1A\u672A\u4FDD\u5B58\u3002`,"success"))}catch(t){we.replaceChildren(Q(Qe(t),"error"))}finally{L=null,Lt()}}}async function kr(){if(L||!O)return;let e=Bo(!0);if(e){L="save",Z(),Lt();try{let t=await Gt("POST","/relays",{body:e});pr+=1,Mo=!1,Ar(t),O=null,de="",K.update({value:"",password:!0}),Lo="overview",Se={text:`\u5DF2\u4FDD\u5B58\u201C${e.name}\u201D\u3002`,tone:"success"},X(),await Bt(!0)}catch(t){we.replaceChildren(Q(Qe(t),"error"))}finally{L=null,X()}}}var Ar=e=>{if(!Array.isArray(e.relays))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u4E2D\u8F6C\u7AD9\u5217\u8868\uFF0C\u8BF7\u91CD\u8BD5\u3002");dr=e.relays.map(wo).filter(t=>t!==null),No=null},wr=e=>{let t=i("div","bx-window");t.dataset.tone=e.usedPercent>=90?"error":e.usedPercent>=70?"warning":"normal";let r=i("div","bx-window-head");r.append(i("span","bx-window-label",e.label),i("span","bx-percent",`\u5DF2\u7528 ${Math.round(e.usedPercent)}%`));let s=i("div","bx-track");s.setAttribute("role","progressbar"),s.setAttribute("aria-label",`${e.label}\u5DF2\u7528\u989D\u5EA6`),s.setAttribute("aria-valuemin","0"),s.setAttribute("aria-valuemax","100"),s.setAttribute("aria-valuenow",String(Math.round(e.usedPercent)));let a=i("div","bx-fill");a.style.width=`${Math.max(0,Math.min(100,e.usedPercent))}%`,s.append(a);let c=i("div","bx-window-foot");e.detail&&c.append(i("span","",e.detail));let b=vo(e.resetAt,F);if(b){let E=i("span","bx-reset",b);E.title=new Date(e.resetAt).toLocaleString(F),c.append(E)}return t.append(r,s),c.childNodes.length&&t.append(c),t},vr=e=>{let t=i("article","bx-provider");t.setAttribute("aria-label",e.name);let r=i("div","bx-provider-head"),s=i("div"),a=i("h2","bx-name",e.name);a.title=e.name,s.append(a),e.plan&&s.append(i("div","bx-plan",e.plan));let c=i("div","bx-balance"),b=e.balance?.value??null,E=e.balance?.unit??"";if(c.append(i("strong","bx-amount",Mt(b,E,F)),i("span","bx-amount-label",b!==null?e.stale?"\u4E0A\u6B21\u4F59\u989D":E==="\u79EF\u5206"?"\u5269\u4F59\u79EF\u5206":"\u53EF\u7528\u4F59\u989D":"\u4F59\u989D\u672A\u63D0\u4F9B")),r.append(s,c),t.append(r),e.detail&&t.append(i("p","bx-detail",e.detail)),e.windows.length){let T=i("div","bx-windows");T.append(...e.windows.map(wr)),t.append(T)}if(e.ok)!e.balance&&!e.windows.length&&!e.detail&&t.append(i("p","bx-detail","\u5DF2\u8FDE\u63A5\uFF0C\u4F46\u63A5\u53E3\u6682\u672A\u63D0\u4F9B\u4F59\u989D\u6216\u989D\u5EA6\u3002"));else{let T=Q(e.error??"\u67E5\u8BE2\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u3002",e.stale?"warning":"error");e.stale&&e.updatedAt&&T.append(i("p","",`\u4EE5\u4E0A\u4E3A ${je(e.updatedAt,F,!0)} \u7684\u6210\u529F\u7ED3\u679C\u3002`)),t.append(T)}return t},Rr=(e,t,r,s="\u6DFB\u52A0\u4E2D\u8F6C\u7AD9")=>{let a=i("div","bx-empty");return a.append(i("h2","",e),i("p","",t)),r&&N(a,{label:s,size:"sm",onClick:r}),a};function X(){let e=ie.filter(t=>!t.ok).length;if($o.textContent="",Ye.textContent=V?"\u6B63\u5728\u66F4\u65B0\u2026":ae?`\u66F4\u65B0\u4E8E ${je(ae,F,new Date(ae).toDateString()!==new Date().toDateString())}`:"",Ye.title=ae?new Date(ae).toLocaleString(F):"",fr.update({loading:V,disabled:!ge,label:V?"\u5237\u65B0\u4E2D":"\u5237\u65B0"}),ve.hidden=!1,Re.hidden=!0,Do.hidden=!0,ce.setAttribute("aria-busy",String(V)),he.replaceChildren(),Nt&&he.append(Q(Nt)),Se&&he.append(Q(Se.text,Se.tone)),le&&he.append(Q(`${le}${ie.length?" \u5DF2\u4FDD\u7559\u4E0A\u6B21\u663E\u793A\u7684\u6570\u636E\u3002":""}`,"error")),ce.replaceChildren(),!ge||V&&!ie.length){let t=i("div","bx-loading");Ut(t,{label:ge?"\u6B63\u5728\u67E5\u8BE2\u4F59\u989D\u2026":"\u6B63\u5728\u8FDE\u63A5 OpenChamber\u2026"}),ce.append(t)}else ie.length?ce.append(...ie.map(vr)):ce.append(Rr(le?"\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u4F59\u989D":"\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u4F59\u989D",le?"\u70B9\u51FB\u5237\u65B0\u91CD\u8BD5\uFF0C\u6216\u68C0\u67E5\u6269\u5C55\u7684\u672C\u5730\u670D\u52A1\u6743\u9650\u3002":"\u5728 OpenCode \u914D\u7F6E Command Code\u3001StepFun\uFF0C\u6216\u6DFB\u52A0\u4E2D\u8F6C\u7AD9\u3002",void 0))}async function Bt(e=!1){if(V&&!e)return;let t=++We;V=!0,le=null,X();try{let r=await Gt("GET","/balances",e?{query:{refresh:"1"}}:{});if(t!==We)return;if(!Array.isArray(r.providers))throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u6709\u6548\u7684\u4F59\u989D\u5217\u8868\u3002");ie=r.providers.map(Ao).filter(s=>s!==null),ae=D(r.fetchedAt)}catch(r){t===We&&(le=Qe(r))}finally{t===We&&(V=!1,X())}}Je.onReady(e=>{if(wt(e,document.documentElement),F=e.locale.startsWith("zh")?e.locale:"zh-CN",document.documentElement.lang=F,ge){X();return}ge=!0,Bt()});{let e=-1;new ResizeObserver(()=>{let t=Math.ceil(ye.getBoundingClientRect().height);t>0&&t!==e&&(e=t,Je.setHeight(t).catch(()=>{}))}).observe(ye)}X();})();
