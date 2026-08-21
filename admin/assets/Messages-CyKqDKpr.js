import{b as o,a as k,j as s}from"./index-BVSuu4cF.js";import{o as I}from"./whatsapp-BR5u8aGr.js";/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=(...a)=>a.filter((n,r,c)=>!!n&&n.trim()!==""&&c.indexOf(n)===r).join(" ").trim();/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(n,r,c)=>c?c.toUpperCase():r.toLowerCase());/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=a=>{const n=R(a);return n.charAt(0).toUpperCase()+n.slice(1)};/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var y={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=a=>{for(const n in a)if(n.startsWith("aria-")||n==="role"||n==="title")return!0;return!1},W=o.createContext({}),E=()=>o.useContext(W),M=o.forwardRef(({color:a,size:n,strokeWidth:r,absoluteStrokeWidth:c,className:u="",children:d,iconNode:h,...w},p)=>{const{size:_=24,strokeWidth:i=2,absoluteStrokeWidth:g=!1,color:x="currentColor",className:b=""}=E()??{},m=c??g?Number(r??i)*24/Number(n??_):r??i;return o.createElement("svg",{ref:p,...y,width:n??_??y.width,height:n??_??y.height,stroke:a??x,strokeWidth:m,className:q("lucide",b,u),...!d&&!T(w)&&{"aria-hidden":"true"},...w},[...h.map(([v,f])=>o.createElement(v,f)),...Array.isArray(d)?d:[d]])});/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=(a,n)=>{const r=o.forwardRef(({className:c,...u},d)=>o.createElement(M,{ref:d,iconNode:n,className:q(`lucide-${B(S(a))}`,`lucide-${a}`,c),...u}));return r.displayName=S(a),r};/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],H=F("message-circle",U),D="_newBadge_ogwuq_1",z="_searchForm_ogwuq_13",O="_searchInput_ogwuq_19",P="_list_ogwuq_21",Z="_card_ogwuq_23",K="_cardNew_ogwuq_31",Q="_cardHeader_ogwuq_33",V="_sender_ogwuq_42",X="_avatar_ogwuq_43",G="_senderInfo_ogwuq_50",J="_name_ogwuq_51",Y="_email_ogwuq_52",ee="_meta_ogwuq_54",se="_subject_ogwuq_55",ae="_date_ogwuq_56",te="_actions_ogwuq_58",ne="_expand_ogwuq_59",oe="_body_ogwuq_61",re="_msgText_ogwuq_66",ce="_bodyActions_ogwuq_73",de="_cardAnswered_ogwuq_80",t={newBadge:D,searchForm:z,searchInput:O,list:P,card:Z,cardNew:K,cardHeader:Q,sender:V,avatar:X,senderInfo:G,name:J,email:Y,meta:ee,subject:se,date:ae,actions:te,expand:ne,body:oe,msgText:re,bodyActions:ce,cardAnswered:de},ie={new:"Nuevo",read:"Leído",archived:"Archivado",answered:"Respondido"},le=[{key:"all",label:"Todos"},{key:"new",label:"Nuevos"},{key:"read",label:"Leídos"},{key:"answered",label:"Respondidos"},{key:"archived",label:"Archivados"}];function ue(a){return new Date(a).toLocaleDateString("es-MX",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function pe(){const[a,n]=o.useState([]),[r,c]=o.useState(!0),[u,d]=o.useState(""),[h,w]=o.useState("all"),[p,_]=o.useState(null),i=o.useRef(null),[g,x]=o.useState(""),b=o.useCallback(async()=>{c(!0),d("");try{const e=h!=="all"?{status:h}:{},{data:l}=await k.get("/contact",{params:e});n(l)}catch{d("No se pudieron cargar los mensajes")}finally{c(!1)}},[h]);o.useEffect(()=>{b()},[b]);const m=async(e,l)=>{try{await k.patch(`/contact/${e}/status`,{status:l}),n($=>$.map(N=>N.id===e?{...N,status:l}:N))}catch{}},v=e=>{e.phone&&(I(e.phone,`Hola ${e.full_name}, te contactamos de NORIA Creative Film Studio respecto a tu mensaje "${e.subject}".`),m(e.id,"answered"))},f=e=>{var l;e.preventDefault(),x(((l=i.current)==null?void 0:l.value.trim())??"")},L=()=>{x(""),i.current&&(i.current.value="")},j=g.toLowerCase(),C=j?a.filter(e=>e.full_name.toLowerCase().includes(j)||e.email.toLowerCase().includes(j)||e.subject.toLowerCase().includes(j)):a,A=a.filter(e=>e.status==="new").length;return s.jsxs("div",{className:"admin-page",children:[s.jsx("div",{className:"admin-head",children:s.jsxs("div",{children:[s.jsxs("h1",{className:"admin-title",children:["Mensajes",A>0&&s.jsxs("span",{className:t.newBadge,children:[A," nuevos"]})]}),s.jsx("p",{className:"admin-sub",children:"Mensajes del formulario de contacto"})]})}),s.jsx("div",{className:"filter-tabs",children:le.map(e=>s.jsx("button",{className:`filter-tab ${h===e.key?"active":""}`,onClick:()=>w(e.key),children:e.label},e.key))}),s.jsxs("form",{className:t.searchForm,onSubmit:f,children:[s.jsx("input",{ref:i,type:"search",placeholder:"Buscar por nombre, email o asunto...",className:`admin-input ${t.searchInput}`,defaultValue:""}),s.jsx("button",{type:"submit",className:"btn-sm btn-ghost",children:"Buscar"}),g&&s.jsx("button",{type:"button",className:"btn-sm btn-ghost",onClick:L,children:"Limpiar"})]}),u&&s.jsx("p",{className:"msg-error",children:u}),r&&s.jsx("p",{className:"msg-loading",children:"Cargando mensajes..."}),!r&&C.length===0&&s.jsx("div",{className:"empty-state",children:g?"Sin resultados para esa búsqueda":"Sin mensajes en este estado"}),!r&&s.jsx("div",{className:t.list,children:C.map(e=>s.jsxs("div",{className:`${t.card} ${e.status==="new"?t.cardNew:""} ${e.status==="answered"?t.cardAnswered:""}`,children:[s.jsxs("div",{className:t.cardHeader,onClick:()=>_(p===e.id?null:e.id),children:[s.jsxs("div",{className:t.sender,children:[s.jsx("div",{className:t.avatar,children:e.full_name.charAt(0).toUpperCase()}),s.jsxs("div",{className:t.senderInfo,children:[s.jsx("span",{className:t.name,children:e.full_name}),s.jsxs("span",{className:t.email,children:[e.email,e.phone?` · ${e.phone}`:""]})]})]}),s.jsxs("div",{className:t.meta,children:[s.jsx("span",{className:t.subject,children:e.subject}),s.jsx("span",{className:t.date,children:ue(e.created_at)})]}),s.jsxs("div",{className:t.actions,children:[s.jsx("span",{className:`badge bd-${e.status}`,children:ie[e.status]??e.status}),s.jsx("span",{className:t.expand,children:p===e.id?"▲":"▼"})]})]}),p===e.id&&s.jsxs("div",{className:t.body,children:[s.jsx("p",{className:t.msgText,children:e.message}),s.jsxs("div",{className:t.bodyActions,children:[e.status!=="read"&&e.status!=="answered"&&s.jsx("button",{className:"btn-sm btn-ghost",onClick:()=>void m(e.id,"read"),children:"Marcar leído"}),e.status!=="archived"&&s.jsx("button",{className:"btn-sm btn-ghost",onClick:()=>void m(e.id,"archived"),children:"Archivar"}),e.status==="archived"&&s.jsx("button",{className:"btn-sm btn-ghost",onClick:()=>void m(e.id,"read"),children:"Restaurar"}),s.jsxs("button",{className:"btn-sm btn-primary",disabled:!e.phone,title:e.phone?void 0:"Sin teléfono registrado",onClick:()=>v(e),children:[s.jsx(H,{size:13,style:{marginRight:"4px",verticalAlign:"middle"}}),"Seguimiento por WhatsApp"]})]})]})]},e.id))})]})}export{pe as default};
