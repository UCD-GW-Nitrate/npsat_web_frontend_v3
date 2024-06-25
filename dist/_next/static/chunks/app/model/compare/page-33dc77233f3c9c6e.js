(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[246],{52960:function(e,t,n){Promise.resolve().then(n.bind(n,40212))},40212:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return M}});var r=n(57437),a=n(16463),o=n(52099),i=n(64029),l=n(60502),d=n(51755),s=n(18058),u=n(2265),c=n(80611);let _=e=>{let[t,n]=(0,u.useState)([]),[r,a]=(0,u.useState)([]),{data:o}=(0,c.SL)(e);return(0,u.useEffect)(()=>{n((null!=o?o:[]).map(e=>e.results)),a((null!=o?o:[]).map(e=>e.name))},[e.length,null==o?void 0:o.length]),[t,null!=o?o:[],r]};var p=n(6148),m=n(3077),y=e=>{let{data:t}=e;return(0,r.jsx)(m.Z,{pagination:!1,bordered:!0,columns:[{title:"Name",dataIndex:"name",width:400},{title:"Description",dataIndex:"description",width:400},{title:"Flow Scenario",dataIndex:"flow_scenario",render:e=>e.name},{title:"Load Scenario",dataIndex:"load_scenario",render:e=>e.name},{title:"Unsat Scenario",dataIndex:"unsat_scenario",render:e=>e.name,width:500},{title:"Well Type Scenario",dataIndex:"welltype_scenario",render:e=>e.name,width:200},{title:"Regions",dataIndex:"regions",render:e=>e.map(e=>e.name).join(","),width:200},{title:"Wells included",dataIndex:"n_wells",render:e=>e||"Not completed"},{title:"Year range",dataIndex:"sim_end_year",render:e=>"1945 - ".concat(e),width:250},{title:"Implementation start year",dataIndex:"reduction_start_year"},{title:"Implementation complete year",dataIndex:"reduction_end_year"},{title:"Water content",dataIndex:"water_content",render:e=>"".concat((100*e).toFixed(0),"%")},{title:"Date Created",dataIndex:"date_submitted",render:e=>new Date(e).toISOString().substring(0,10),width:250}],dataSource:t,scroll:{x:"max-content"}})},f=n(47559),h=n(15330),M=()=>{let[e,t,n]=_((0,a.useSearchParams)().getAll("models")),[u,c]=(0,p.T)(e);return(0,r.jsx)(i.Z,{children:(0,r.jsxs)(o.B6,{children:[(0,r.jsxs)(o.ql,{children:[(0,r.jsx)("title",{children:"Compare Scenario - NPSAT"}),(0,r.jsx)("meta",{name:"description",content:"Compare Scenario - NPSAT"})]}),(0,r.jsx)(d.n,{variant:"h1",children:"Compare Models"}),(0,r.jsxs)(s.S,{spacing:"large",children:[(0,r.jsx)(l.L,{title:"Scenarios Selected",children:(0,r.jsx)(y,{data:t})}),(0,r.jsx)(l.L,{title:"Crop Selection",children:(0,r.jsx)(h._,{modelDetails:t})}),(0,r.jsx)(l.L,{title:"Comparison Line Chart",children:(0,r.jsx)(f.Z,{comparisonChartModels:((e,t)=>{let n=[];for(let a=0;a<e.length;a+=1){var r;n.push({name:null!==(r=t[a])&&void 0!==r?r:"",plotData:e[a]})}return n})(u,n),percentiles:c})})]})]})})}},52940:function(e,t){"use strict";t.Z="http://localhost:8010"},80611:function(e,t,n){"use strict";n.d(t,{Lf:function(){return d},M3:function(){return s},SL:function(){return f},pr:function(){return h},qF:function(){return c}});var r=n(92800),a=n(81631),o=n(52940),i=n(7938),l=n(629);let d=(0,r.LC)({reducerPath:"mantis",baseQuery:(0,a.ni)({baseUrl:o.Z,prepareHeaders:(e,t)=>{let{getState:n}=t;return(0,i.Z)(e,n)}}),endpoints:e=>({runModel:e.mutation({query:e=>(console.log("run model query",{name:"03.03.541",description:e.description,water_content:e.water_content,sim_end_year:e.sim_end_year,reduction_start_year:e.reduction_start_year,reduction_end_year:e.reduction_end_year,flow_scenario:e.flow_scenario,load_scenario:e.load_scenario,unsat_scenario:e.unsat_scenario,welltype_scenario:e.welltype_scenario,regions:e.regions,modifications:e.modifications,public:!0,is_base:!1,applied_simulation_filter:e.advancedWellFilter}),{url:"api/model_run/",method:"POST",body:{name:e.name,description:e.description,water_content:e.water_content,sim_end_year:e.sim_end_year,reduction_start_year:e.reduction_start_year,reduction_end_year:e.reduction_end_year,flow_scenario:e.flow_scenario,load_scenario:e.load_scenario,unsat_scenario:e.unsat_scenario,welltype_scenario:e.welltype_scenario,regions:e.regions,modifications:e.modifications,public:!0,is_base:!1,applied_simulation_filter:!1}})}),getAllModelDetail:e.query({query:()=>({url:"api/model_run/",method:"GET"})}),getModelDetailByIds:e.query({query:e=>({url:"api/model_run/?".concat((0,l._)({modelIds:e})),method:"GET"})}),getModelDetail:e.query({query:e=>({url:"api/model_run/".concat(e,"/"),method:"GET"})}),getModelandBaseModelDetail:e.query({query:e=>({url:"api/model_run/".concat(e,"/"),method:"GET",params:{includeBase:!0}})}),getModificationDetail:e.query({query:e=>({url:"api/modification/".concat(e,"/"),method:"GET"})}),getModelResults:e.query({query:e=>({url:"api/model_result/".concat(e,"/"),method:"GET"})}),putModel:e.mutation({query:e=>({url:"api/model_run/".concat(e,"/"),method:"PUT"})}),getModelStatus:e.query({query:e=>({url:"/api/model_run__status/",method:"GET",params:{...e}})})})}),{useRunModelMutation:s,useGetModelDetailQuery:u,useGetModelandBaseModelDetailQuery:c,useGetModelResultsQuery:_,useGetModificationDetailQuery:p,usePutModelMutation:m,useGetAllModelDetailQuery:y,useGetModelDetailByIdsQuery:f,useGetModelStatusQuery:h}=d},629:function(e,t,n){"use strict";n.d(t,{_:function(){return r}});let r=e=>{let t=new URLSearchParams;for(let n in e)if(Object.hasOwn(e,n)){let r=e[n];Array.isArray(r)?r.forEach(e=>{t.append(n,e)}):t.append(n,r)}return t.toString()}},7938:function(e,t){"use strict";t.Z=(e,t)=>{let{token:n}=t().auth;return n&&e.set("authorization","Token ".concat(n)),e}},11525:function(e,t,n){"use strict";n.d(t,{Dj:function(){return a},HF:function(){return o}});let r=(0,n(90492).oM)({name:"auth",initialState:{user:null,token:null},reducers:{setCredentials:(e,t)=>{let{payload:{user:n,token:r}}=t;e.user=n,e.token=r}}}),{setCredentials:a}=r.actions;t.ZP=r.reducer;let o=e=>e.auth.user},35126:function(e,t,n){"use strict";n.d(t,{AG:function(){return u},Ao:function(){return l},Fu:function(){return D},Hl:function(){return m},KI:function(){return S},Kn:function(){return d},Mi:function(){return M},OO:function(){return w},SU:function(){return q},T0:function(){return I},Uk:function(){return o},_y:function(){return b},eC:function(){return p},fk:function(){return x},fw:function(){return g},kQ:function(){return _},sZ:function(){return j},tD:function(){return a},v3:function(){return s},yB:function(){return i},yn:function(){return c}});let r=(0,n(90492).oM)({name:"model",initialState:{},reducers:{setModelName:(e,t)=>({...e,name:t.payload}),setModelDescription:(e,t)=>({...e,description:t.payload}),setModelWaterContent:(e,t)=>({...e,water_content:t.payload}),setModelSimEndYear:(e,t)=>({...e,sim_end_year:t.payload}),setModelReductionStartYear:(e,t)=>({...e,reduction_start_year:t.payload}),setModelReductionEndYear:(e,t)=>({...e,reduction_end_year:t.payload}),setModelFlowScenario:(e,t)=>({...e,flow_scenario:t.payload}),setModelLoadScenario:(e,t)=>({...e,load_scenario:t.payload}),setModelUnsatScenario:(e,t)=>({...e,unsat_scenario:t.payload}),setModelWelltypeScenario:(e,t)=>({...e,welltype_scenario:t.payload}),setModelRegions:(e,t)=>({...e,regions:t.payload}),setModelPublic:(e,t)=>({...e,public:t.payload}),setModelIsBase:(e,t)=>({...e,is_base:t.payload}),setModelSimulationFilter:(e,t)=>({...e,applied_simulation_filter:t.payload}),setModelScreenLenRangeMin:(e,t)=>({...e,screen_length_range_min:t.payload}),setModelScreenLenRangeMax:(e,t)=>({...e,screen_length_range_max:t.payload}),setModelDepthRangeMin:(e,t)=>({...e,depth_range_min:t.payload}),setModelDepthRangeMax:(e,t)=>({...e,depth_range_max:t.payload}),setModelModifications:(e,t)=>({...e,modifications:t.payload}),setAdvancedWellFilter:(e,t)=>({...e,advancedWellFilter:t.payload}),clearModel:()=>({}),createNewModel:(e,t)=>({...t.payload})}}),{setModelName:a,setModelDescription:o,setModelWaterContent:i,setModelSimEndYear:l,setModelReductionStartYear:d,setModelReductionEndYear:s,setModelFlowScenario:u,setModelLoadScenario:c,setModelUnsatScenario:_,setModelWelltypeScenario:p,setModelRegions:m,setModelPublic:y,setModelIsBase:f,setModelSimulationFilter:h,setModelScreenLenRangeMin:M,setModelScreenLenRangeMax:g,setModelDepthRangeMin:S,setModelDepthRangeMax:w,setModelModifications:x,setAdvancedWellFilter:q,clearModel:I,createNewModel:b}=r.actions,j=r.reducer,D=e=>e.model}},function(e){e.O(0,[336,23,644,473,808,220,648,357,571,487,77,99,434,971,582,744],function(){return e(e.s=52960)}),_N_E=e.O()}]);