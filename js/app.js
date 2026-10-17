// ========== HELPERS ==========
const KEY='health_v10';
let currentDate=today();
let currentTab='today';
let chartInstances={};

function today(d){d=d||new Date();const x=new Date(d);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
function showModal(html,centered){
  const cls=centered?'modal modal-center':'modal';
  document.getElementById('modalRoot').innerHTML='<div class="'+cls+'" onclick="if(event.target===this)closeModal()">'+html+'</div>';
  document.body.classList.add('modal-open');
}
function closeModal(){
  document.getElementById('modalRoot').innerHTML='';
  document.body.classList.remove('modal-open');
}
function weekKey(d){d=d||new Date();const t=new Date(d);t.setHours(0,0,0,0);t.setDate(t.getDate()+4-(t.getDay()||7));const y=t.getFullYear();const w=Math.ceil(((t-new Date(y,0,1))/86400000+1)/7);return y+'-W'+String(w).padStart(2,'0');}
function fmtDate(d){return new Date(d+'T00:00:00').toLocaleDateString('vi-VN',{day:'numeric',month:'numeric'});}
function normalize(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'d');}

// ========== DATA ==========
function defaultData(){
  return {
    settings:{
      height:null,birthYear:null,gender:null,
      startWeight:null,targetWeight:null,startDate:today(),
      activityLevel:1.3,targetLossPerWeek:0.5,manualTarget:0,
      targetSteps:8000,targetSleep:7,
      features:{bp:true,cycle:true,symptoms:true,moods:true,cravings:true,meds:true,cheat:true,sleep:true,steps:true,weight:true,glucose:true,labs:true}
    },
    days:{},weights:[],periods:[],medications:[],medLog:{},
    customFoods:[],customExercises:[],favoriteFoods:[],
    cheatWeeks:{},bmrHistory:[],labTests:[],
    glucoseUnit:'mmol/L',
    checklistTemplate:null
  };
}
function save(){
  if(typeof queueSave==='function'){
    queueSave(data,function(err){if(err)console.error('Save error:',err);});
  }
}
let data=defaultData();

function getDay(d){
  if(!data.days[d])data.days[d]={checklist:{},meals:{},exercises:[],steps:0,sleep:{},symptoms:[],moods:[],cravings:[],symptomNote:'',bps:[],glucose:[],water:false,cycle:{}};
  const dd=data.days[d];
  if(!dd.symptoms)dd.symptoms=[];
  if(!dd.moods)dd.moods=[];
  if(!dd.cravings)dd.cravings=[];
  if(!dd.cycle)dd.cycle={};
  if(!dd.bps){dd.bps=[];if(dd.bp){dd.bps.push(dd.bp);delete dd.bp;}}
  if(!dd.glucose)dd.glucose=[];
  return dd;
}

// ========== CALC ==========
function getCurrentWeight(){const s=[...data.weights].sort((a,b)=>b.date.localeCompare(a.date));return s[0]?s[0].weight:(data.settings.startWeight||65);}
function getLatestWeightRecord(){const s=[...data.weights].sort((a,b)=>b.date.localeCompare(a.date));return s[0]||null;}
function calcBMRFromFormula(w){const s=data.settings;if(!w||!s.height||!s.birthYear||!s.gender)return 1500;const age=new Date().getFullYear()-s.birthYear;return Math.round(10*w+6.25*s.height-5*age+(s.gender==='male'?5:-161));}
function getBMR(){const l=getLatestWeightRecord();if(l&&l.bmr&&l.bmr>500)return Math.round(l.bmr);return calcBMRFromFormula(getCurrentWeight());}
function getBMRSource(){const l=getLatestWeightRecord();if(l&&l.bmr&&l.bmr>500)return 'Cân điện tử';return 'Công thức';}
function getTDEE(){return Math.round(getBMR()*(data.settings.activityLevel||1.3));}
function getTargetCalories(){const s=data.settings;if(s.manualTarget>0)return s.manualTarget;const d=Math.round((s.targetLossPerWeek||0)*7700/7);return Math.max(1200,getTDEE()-d);}
function getTargetDeficit(){return getTDEE()-getTargetCalories();}
function activityLabel(l){if(l<=1.25)return 'Ít vận động';if(l<=1.45)return 'Hoạt động nhẹ';if(l<=1.6)return 'Hoạt động vừa';return 'Hoạt động nhiều';}
function calcBMI(w){const h=data.settings.height/100;return +(w/(h*h)).toFixed(1);}
function bmiRate(b){if(b<18.5)return['Gầy','low'];if(b<23)return['Bình thường','good'];if(b<25)return['Thừa cân','high'];if(b<30)return['Béo phì I','high'];return['Béo phì II','low'];}
function bfRate(p){if(p<14)return['Rất thấp','low'];if(p<21)return['VĐV','excellent'];if(p<25)return['Fit','good'];if(p<32)return['TB','normal'];return['Béo','high'];}
function visceralRate(v){if(v<=9)return['BT','good'];if(v<=14)return['Cao','high'];return['Rất cao','low'];}
function waterRate(p){if(p<45)return['Thấp','low'];if(p<=60)return['BT','good'];return['Cao','normal'];}
function muscleRate(p){if(p<30)return['Thấp','low'];if(p<35)return['TB','normal'];return['Tốt','good'];}
function calcSleep(b,w){if(!b||!w)return 0;const[bh,bm]=b.split(':').map(Number);const[wh,wm]=w.split(':').map(Number);let m=(wh*60+wm)-(bh*60+bm);if(m<0)m+=1440;return +(m/60).toFixed(1);}
function bpRate(s,d){if(s>=180||d>=120)return['Khủng hoảng','low'];if(s>=140||d>=90)return['Tăng HA độ 2','high'];if(s>=130||d>=80)return['Tăng HA độ 1','high'];if(s>=120&&d<80)return['Tiền THA','normal'];if(s<90||d<60)return['HA thấp','low'];return['Bình thường','good'];}
function calcMETCalo(met,minutes){const w=getCurrentWeight();return Math.round(met*w*(minutes/60));}
function rebuildBMRHistory(){data.bmrHistory=data.weights.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(w=>{const bmr=w.bmr||calcBMRFromFormula(w.weight);return {date:w.date,bmr,tdee:Math.round(bmr*(data.settings.activityLevel||1.3)),weight:w.weight};});}

// ========== CYCLE ==========
function analyzeCycle(){
  const ps=[...data.periods].sort((a,b)=>a.start.localeCompare(b.start));
  if(!ps.length)return null;
  const last=ps[ps.length-1];
  const daysSince=Math.floor((new Date(today())-new Date(last.start))/86400000);

  const cycles=[];
  const allCycles=[];
  for(let i=1;i<ps.length;i++){
    const d=Math.round((new Date(ps[i].start)-new Date(ps[i-1].start))/86400000);
    allCycles.push({days:d,from:ps[i-1].start,to:ps[i].start});
    if(d>=21&&d<=35){
      cycles.push({days:d,from:ps[i-1].start,to:ps[i].start});
    }
  }

  let avg=28,median=28,minCycle=null,maxCycle=null;
  let hasCycleData=false;

  if(cycles.length>0){
    hasCycleData=true;
    const arr=cycles.map(c=>c.days).sort((a,b)=>a-b);
    avg=Math.round(arr.reduce((s,c)=>s+c,0)/arr.length);
    const mid=Math.floor(arr.length/2);
    median=arr.length%2===0?Math.round((arr[mid-1]+arr[mid])/2):arr[mid];
    minCycle=arr[0];
    maxCycle=arr[arr.length-1];
  }

  const refCycle=hasCycleData?median:28;
  const diff=daysSince-refCycle;

  let status='info',text='';
  const nextDate=new Date(new Date(last.start).getTime()+refCycle*86400000);
  const untilNext=Math.ceil((nextDate-new Date())/86400000);
  const nextExpected=untilNext>0?('Còn '+untilNext+' ngày tới kỳ dự kiến'):('Đã tới ngày dự kiến '+Math.abs(untilNext)+' ngày');

  if(!hasCycleData){
    status='info';
    text='Kỳ đầu tiên đã ghi · Đang ngày '+(daysSince+1)+' của chu kỳ';
  } else if(daysSince < 7){
    status='info';
    text='🩸 Đang trong kỳ kinh · Ngày '+(daysSince+1)+' của kỳ';
  } else if(daysSince>refCycle+35){
    status='late';
    text='⚠️ Trễ kinh '+daysSince+' ngày (TB '+refCycle+' ngày)';
  } else if(diff>=7){
    status='late';
    text='Kỳ trễ '+diff+' ngày so với TB ('+refCycle+' ngày)';
  } else if(diff<=-7){
    status='info';
    text='Kỳ sớm '+Math.abs(diff)+' ngày so với TB ('+refCycle+' ngày)';
  } else {
    status='ok';
    text='Chu kỳ đều ('+refCycle+' ngày) · Ngày '+(daysSince+1);
  }

  const warnings=[];

  ps.forEach(p=>{
    if(p.end){
      const len=Math.round((new Date(p.end)-new Date(p.start))/86400000)+1;
      const dateLabel=new Date(p.start+'T00:00:00').toLocaleDateString('vi-VN');
      if(len>7)warnings.push({msg:'Kỳ '+dateLabel+' kéo dài '+len+' ngày (bình thường 3-5 ngày)',level:'warn'});
      else if(len<2)warnings.push({msg:'Kỳ '+dateLabel+' chỉ '+len+' ngày (quá ngắn)',level:'warn'});
    }
  });

  allCycles.forEach(c=>{
    const fromLabel=new Date(c.from+'T00:00:00').toLocaleDateString('vi-VN');
    const toLabel=new Date(c.to+'T00:00:00').toLocaleDateString('vi-VN');
    if(c.days<21)warnings.push({msg:'Chu kỳ '+fromLabel+' → '+toLabel+' chỉ '+c.days+' ngày (ngắn hơn 21)',level:'warn'});
    else if(c.days>35)warnings.push({msg:'Chu kỳ '+fromLabel+' → '+toLabel+' dài '+c.days+' ngày (hơn 35)',level:'warn'});
  });

  ps.forEach(p=>{
    if(!p.end){
      const len=Math.round((new Date(today())-new Date(p.start))/86400000);
      if(len>10){
        const dateLabel=new Date(p.start+'T00:00:00').toLocaleDateString('vi-VN');
        warnings.push({msg:'Kỳ '+dateLabel+' chưa ghi ngày kết thúc (đã '+len+' ngày)',level:'info'});
      }
    }
  });

  return {avg,median,minCycle,maxCycle,refCycle,last,daysSince,diff,status,text,nextExpected,cyclesCount:cycles.length,cycles,warnings,hasCycleData};
}
function isInPeriod(dateStr){
  return data.periods.some(p=>{
    if(!p.end){
      const endDate=new Date(new Date(p.start).getTime()+7*86400000);
      const endStr=today(endDate);
      return dateStr>=p.start && dateStr<=endStr;
    }
    return dateStr>=p.start && dateStr<=p.end;
  });
}

// ========== PLAN ==========
function getPlan(dateStr){
  const d=new Date(dateStr+'T00:00:00').getDay();
  if(data.checklistTemplate){
    if(d===6 && data.checklistTemplate.saturday) return data.checklistTemplate.saturday;
    if(d===0 && data.checklistTemplate.sunday) return data.checklistTemplate.sunday;
    if(data.checklistTemplate.weekday) return data.checklistTemplate.weekday;
  }
  if(d===6)return PLAN.saturday;
  if(d===0)return PLAN.sunday;
  return PLAN.weekday;
}

// ========== RENDER MAIN ==========
function render(){
  const titles={today:'Theo dõi ăn uống & bệnh lý',health:'Chỉ số cơ thể & sức khỏe',progress:'Tiến độ & biểu đồ',knowledge:'Bảng tham khảo chỉ số sức khỏe',settings:'Cài đặt & mục tiêu'};
  const subEl=document.getElementById('hsub');
  if(subEl)subEl.textContent=titles[currentTab]||'';

  const chip=document.getElementById('userChip');
  if(chip){
    if(window.__myUser){
      const p=window.__myProfile||{};
      const displayName=p.display_name||window.__myUser.email||'User';
      const isEmailName=displayName.includes('@');
      const shortName=isEmailName?displayName.split('@')[0]:displayName;
      const initial=(shortName[0]||'U').toUpperCase();
      chip.innerHTML='<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.2);padding:5px 10px;border-radius:20px;font-size:11px;font-weight:600;color:#fff">'+
        '<span style="width:20px;height:20px;border-radius:50%;background:#fff;color:#667eea;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">'+initial+'</span>'+
        '<span style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+shortName+'</span>'+
        '</span>';
      chip.style.display='block';
    } else {
      chip.style.display='none';
    }
  }

  Object.keys(chartInstances).forEach(k=>{try{chartInstances[k].destroy();}catch(e){}});
  chartInstances={};
  const app=document.getElementById('app');
  if(currentTab==='today')app.innerHTML=renderToday();
  else if(currentTab==='health')app.innerHTML=renderHealth();
  else if(currentTab==='progress')app.innerHTML=renderProgress();
  else if(currentTab==='knowledge')app.innerHTML=renderKnowledge();
  else app.innerHTML=renderSettings();
  if(currentTab==='health'||currentTab==='progress')setTimeout(renderCharts,50);
}

// ========== SUMMARY ==========
function renderCompactSummary(dateStr){
  const s=buildDaySummary(dateStr);
  let cls='neutral',icon='📝',line='';
  if(s.pct>=80){cls='great';icon='🎉';line='Hoàn thành '+s.done+'/'+s.total+' ('+s.pct+'%) — Xuất sắc!';}
  else if(s.pct>=60){cls='good';icon='💪';line='Hoàn thành '+s.done+'/'+s.total+' ('+s.pct+'%) — Khá tốt';}
  else if(s.pct>=40){cls='warn';icon='⚠️';line='Chỉ '+s.done+'/'+s.total+' ('+s.pct+'%) — Cần cải thiện';}
  else if(s.done+s.skip>0){cls='bad';icon='❌';line='Chỉ '+s.done+'/'+s.total+' ('+s.pct+'%) — Cố lên!';}
  else{cls='neutral';icon='📝';line='Chưa có dữ liệu — tick mục để xem tổng kết';}
  const quick=[];
  if(s.totalIntake>0&&s.intakeStatus==='bad')quick.push('ăn '+s.totalIntake+' kcal');
  if(s.totalIntake===0)quick.push('chưa nhập bữa ăn');
  if(s.exCount===0&&s.steps>0)quick.push('không tập');
  if(!s.hasSleep&&s.totalIntake>0)quick.push('chưa nhập giấc ngủ');
  return '<div class="summary-compact '+cls+'"><div class="sc-head">'+icon+' TỔNG KẾT NGÀY</div><div>'+line+'</div>'+(quick.length?'<div style="margin-top:4px;font-size:11px;opacity:.9">('+quick.join(' · ')+')</div>':'')+'</div>';
}

function renderDetailSummary(dateStr){
  const s=buildDaySummary(dateStr);
  const dt=new Date(dateStr+'T00:00:00');
  const dateLabel=dt.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'numeric',year:'numeric'});
  let html='<div class="card"><h2><span class="title">📝 Tổng kết chi tiết</span></h2><div class="summary-detail">';
  html+='<div class="sd-section"><div class="sd-title">📅 '+dateLabel+'</div><div class="sd-line">Checklist: <strong>'+s.done+'/'+s.total+'</strong> · '+s.skip+' bỏ qua · '+s.pending+' chưa làm (<strong>'+s.pct+'%</strong>)</div></div>';
  html+='<div class="sd-section"><div class="sd-title">🍽️ Ăn uống</div>';
  if(s.mealCount===0)html+='<div class="sd-line sd-warn">Chưa nhập bữa ăn</div>';
  else html+='<div class="sd-line">'+s.mealCount+' bữa · '+s.totalIntake+' kcal · '+s.intakeMsg+'</div>';
  html+='</div>';
  html+='<div class="sd-section"><div class="sd-title">🏃 Vận động</div><div class="sd-line '+(s.exStatus==='good'?'sd-good':s.exStatus==='bad'?'sd-bad':'')+'">'+s.exMsg+'</div></div>';
  html+='<div class="sd-section"><div class="sd-title">😴 Giấc ngủ</div><div class="sd-line '+(s.sleepStatus==='good'?'sd-good':s.sleepStatus==='bad'?'sd-bad':'')+'">'+s.sleepMsg+'</div></div>';
  if(data.settings.features.glucose){const d=getDay(dateStr);if(d.glucose&&d.glucose.length){html+='<div class="sd-section"><div class="sd-title">🩸 Đường huyết</div>';d.glucose.forEach(g=>{const r=glucoseRate(g.value,g.moment,data.glucoseUnit);html+='<div class="sd-line">'+g.value+' '+data.glucoseUnit+' ('+g.moment+') <span class="rating '+r[1]+'">'+r[0]+'</span></div>';});html+='</div>';}}
  html+='<div class="sd-section"><div class="sd-title">🩸 Huyết áp</div><div class="sd-line">'+s.bpMsg+'</div></div>';
  html+='<div class="sd-section"><div class="sd-title">🩸 Kinh nguyệt</div><div class="sd-line">'+s.cycleMsg+'</div></div>';
  if(s.symCount>0){const d=getDay(dateStr);html+='<div class="sd-section"><div class="sd-title">🤒 Triệu chứng & cảm xúc</div>';if(d.symptoms.length)html+='<div class="sd-line">Thể chất: '+d.symptoms.join(', ')+'</div>';if(d.moods.length)html+='<div class="sd-line">Cảm xúc: '+d.moods.join(', ')+'</div>';if(d.cravings.length)html+='<div class="sd-line">Thèm ăn: '+d.cravings.join(', ')+'</div>';if(d.symptomNote)html+='<div class="sd-line" style="font-style:italic">Ghi chú: '+esc(d.symptomNote)+'</div>';html+='</div>';}
  if(s.praises.length)html+='<div class="sd-section"><div class="sd-title">✅ Điểm tốt</div>'+s.praises.map(p=>'<div class="sd-line sd-good">· '+p+'</div>').join('')+'</div>';
  if(s.issues.length)html+='<div class="sd-section"><div class="sd-title">⚠️ Cần chú ý</div>'+s.issues.map(p=>'<div class="sd-line sd-bad">· '+p+'</div>').join('')+'</div>';
  const vCls={great:'verdict-great',good:'verdict-good',warn:'verdict-warn',bad:'verdict-bad',neutral:'verdict-neutral'}[s.verdict];
  html+='<div class="sd-verdict '+vCls+'">'+s.verdictText+'</div>';
  html+='<div class="sd-section" style="margin-top:10px"><div class="sd-title">💡 Gợi ý cho ngày mai</div>'+s.tips.map(t=>'<div class="sd-line">· '+t+'</div>').join('')+'</div>';
  html+='</div></div>';
  return html;
}

function buildDaySummary(dateStr){
  const d=getDay(dateStr);
  const plan=getPlan(dateStr);
  const target=getTargetCalories(),tdee=getTDEE();
  let mealCount=0,totalIntake=0;
  Object.keys(d.meals||{}).forEach(k=>{if(d.meals[k].length){mealCount++;totalIntake+=d.meals[k].reduce((s,f)=>s+(f.cal||0),0);}});
  const intakePct=target>0?Math.round(totalIntake/target*100):0;
  const totalBurned=d.exercises.reduce((s,e)=>s+(e.cal||0),0);
  const steps=d.steps||0;
  const stepsPct=data.settings.targetSteps>0?Math.round(steps/data.settings.targetSteps*100):0;
  const exCount=d.exercises.length;
  const sleepH=d.sleep.bed&&d.sleep.wake?calcSleep(d.sleep.bed,d.sleep.wake):0;
  let done=0,skip=0,pending=0;
  plan.forEach(it=>{const st=d.checklist[it.id]&&d.checklist[it.id].state;if(st==='done')done++;else if(st==='skip')skip++;else pending++;});
  const evaluated=(done+skip)||1;
  const pct=Math.round(done/evaluated*100);
  const issues=[],praises=[];
  let intakeStatus='neutral',intakeMsg='';
  if(totalIntake===0){intakeStatus='neutral';intakeMsg='Chưa nhập bữa ăn';}
  else if(totalIntake<1000){intakeStatus='bad';intakeMsg='Chỉ '+totalIntake+' kcal — quá ít';issues.push('Ăn quá ít');}
  else if(intakePct<50){intakeStatus='bad';intakeMsg=totalIntake+' / '+target+' ('+intakePct+'%)';issues.push('Ăn dưới 50%');}
  else if(intakePct<70){intakeStatus='warn';intakeMsg=totalIntake+' / '+target+' ('+intakePct+'%)';issues.push('Ăn dưới 70%');}
  else if(intakePct<=110){intakeStatus='good';intakeMsg=totalIntake+' / '+target+' ('+intakePct+'%) — đạt';praises.push('Ăn đúng target');}
  else if(intakePct<=130){intakeStatus='warn';intakeMsg=totalIntake+' / '+target+' ('+intakePct+'%)';issues.push('Vượt '+(intakePct-100)+'%');}
  else{intakeStatus='bad';intakeMsg=totalIntake+' / '+target+' ('+intakePct+'%)';issues.push('Vượt '+(intakePct-100)+'%');}
  let exStatus='neutral',exMsg='';
  if(exCount===0&&steps===0){exStatus='neutral';exMsg='Chưa có dữ liệu';}
  else if(exCount===0){exStatus='warn';exMsg='Không tập · '+steps.toLocaleString()+' bước';issues.push('Không tập');}
  else if(exCount>0&&stepsPct>=70){exStatus='good';exMsg=exCount+' bài ('+totalBurned+' kcal) · '+steps.toLocaleString()+' bước';praises.push('Tập đầy đủ');}
  else{exStatus='warn';exMsg=exCount+' bài ('+totalBurned+' kcal) · '+steps.toLocaleString()+' bước';}
  let sleepStatus='neutral',sleepMsg='';
  if(!d.sleep.bed||!d.sleep.wake){sleepStatus='neutral';sleepMsg='Chưa nhập giấc ngủ';}
  else if(sleepH<6){sleepStatus='bad';sleepMsg=d.sleep.bed+'→'+d.sleep.wake+' ('+sleepH+'h)';issues.push('Ngủ dưới 6h');}
  else if(sleepH<7){sleepStatus='warn';sleepMsg=d.sleep.bed+'→'+d.sleep.wake+' ('+sleepH+'h)';}
  else{sleepStatus='good';sleepMsg=d.sleep.bed+'→'+d.sleep.wake+' ('+sleepH+'h)';praises.push('Ngủ '+sleepH+'h');}
  let bpMsg='';
  if(d.bps&&d.bps.length){const latest=d.bps[d.bps.length-1];const r=bpRate(latest.sys,latest.dia);bpMsg=latest.sys+'/'+latest.dia+' ('+r[0]+') · '+d.bps.length+' lần';if(r[1]==='high'||r[1]==='low')issues.push('HA '+r[0]);}else bpMsg='Chưa đo';
  let cycleMsg='';
  if(isInPeriod(dateStr))cycleMsg='🩸 Trong kỳ';else{const cyc=analyzeCycle();if(cyc&&cyc.status==='late')cycleMsg='⚠️ Trễ kinh '+cyc.daysSince+' ngày';else cycleMsg='Không trong kỳ';}
  const symCount=(d.symptoms||[]).length+(d.moods||[]).length+(d.cravings||[]).length;
  const craveList=(d.cravings||[]).filter(c=>c.indexOf('Thèm')>=0||c==='Ăn uống vô độ');
  let verdict='neutral',verdictText='';
  if(pct>=80){verdict='great';verdictText='🎉 XUẤT SẮC!';}
  else if(pct>=60&&issues.length<=2){verdict='good';verdictText='💪 KHÁ TỐT!';}
  else if(pct>=60){verdict='warn';verdictText='⚠️ Khá ổn nhưng còn điểm chú ý';}
  else if(pct>=40){verdict='warn';verdictText='⚠️ CẦN CẢI THIỆN';}
  else{verdict='bad';verdictText='❌ CẦN CỐ GẮNG';}
  const tips=[];
  if(intakeStatus==='bad'&&totalIntake<1000)tips.push('Sáng mai ăn đủ 3 bữa chính');
  if(intakePct>130)tips.push('Ngày mai ăn nhiều rau, giảm tinh bột');
  if(exCount===0)tips.push('Tập xe đạp 15-20 phút');
  if(sleepH>0&&sleepH<7)tips.push('Ngủ trước 22:30');
  if(!d.sleep.bed)tips.push('Sáng mai nhập giờ ngủ + thức');
  if(symCount>3)tips.push('Nghỉ ngơi, uống đủ nước');
  if(craveList.length>=2)tips.push('Thử sữa chua/trái cây thay vì đồ ngọt');
  if(!tips.length)tips.push('Tiếp tục duy trì phong độ!');
  return {date:dateStr,pct,done,skip,pending,total:plan.length,mealCount,totalIntake,intakePct,intakeStatus,intakeMsg,exCount,totalBurned,steps,stepsPct,exStatus,exMsg,sleepH,sleepStatus,sleepMsg,bpMsg,cycleMsg,issues,praises,verdict,verdictText,tips,symCount,hasSleep:!!(d.sleep.bed&&d.sleep.wake)};
}

// ========== TAB KIẾN THỨC ==========
function renderKnowledge(){
  if(typeof REF_TABLES === 'undefined'){
    return '<div class="card"><div class="empty">Lỗi: Chưa load được bảng tham khảo. Kiểm tra lại js/data.js</div></div>';
  }

  let html = '<div class="card" style="background:linear-gradient(135deg,#ebf8ff,#fff)">'+
    '<h2 style="margin-bottom:8px"><span class="title">📚 Bảng tham khảo chỉ số sức khỏe</span></h2>'+
    '<div style="font-size:12px;color:#4a5568;line-height:1.6">'+
      'Các bảng dưới đây dựa trên tiêu chuẩn quốc tế (WHO, AHA, ADA, ACE...). '+
      'Nếu bạn đã nhập chỉ số → dòng bạn đang ở sẽ được <strong style="color:#744210">tô vàng</strong>.'+
    '</div></div>';

  REF_TABLES.forEach(tbl => {
    const matchIdx = typeof tbl.match === 'function' ? tbl.match() : -1;
    const userVal = typeof tbl.userValue === 'function' ? tbl.userValue() : null;

    html += '<div class="card">';
    html += '<h2><span class="title">'+tbl.icon+' '+esc(tbl.title)+'</span>'+(userVal!==null?'<span class="user-badge">👤 '+esc(userVal)+'</span>':'')+'</h2>';
    html += '<div class="ref-desc">'+tbl.desc+'</div>';

    html += '<table class="ref-table"><thead><tr>';
    tbl.columns.forEach(col => { html += '<th>'+esc(col)+'</th>'; });
    html += '</tr></thead><tbody>';

    tbl.rows.forEach((row, idx) => {
      const isUserRow = (idx === matchIdx);
      html += '<tr'+(isUserRow?' class="user-in-row"':'')+'>';
      row.values.forEach((val, ci) => {
        const isFirst = (ci === 0);
        // ĐÃ SỬA LỖI ĐÈ MÀU: Thêm !isUserRow
        const colorStyle = (isFirst && row.color && !isUserRow) ? ' style="color:'+row.color+'"' : '';
        html += '<td'+colorStyle+'>'+esc(val);
        if(isUserRow && ci === 0) html += ' <span class="user-badge">Bạn ở đây</span>';
        html += '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    html += '<div class="ref-source">📖 Nguồn: '+tbl.source+'</div>';
    html += '</div>';
  });

  html += '<div class="card" style="background:#f7fafc">'+
    '<div style="font-size:11px;color:#718096;line-height:1.7">'+
      '<strong>⚠️ Lưu ý:</strong> Các chỉ số này mang tính tham khảo chung. '+
      'Không thay thế chẩn đoán của bác sĩ. Nếu chỉ số của bạn ở mức cao/thấp bất thường → hãy đi khám chuyên khoa.'+
    '</div></div>';

  return html;
}

// ========== TAB TODAY ==========
function renderToday(){
  const d=getDay(currentDate);
  const plan=getPlan(currentDate);
  const isToday=currentDate===today();
  const dt=new Date(currentDate+'T00:00:00');
  const dateLabel=isToday?'Hôm nay':dt.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'numeric'});
  const target=getTargetCalories(),tdee=getTDEE(),bmr=getBMR(),targetDef=getTargetDeficit();
  const f=data.settings.features;
  let totalActual=0,totalBurned=0;
  plan.forEach(it=>{if(it.type==='meal')totalActual+=(d.meals[it.id]||[]).reduce((s,x)=>s+(x.cal||0),0);});
  totalBurned=d.exercises.reduce((s,e)=>s+(e.cal||0),0);
  const actualDef=tdee+totalBurned-totalActual;
  let done=0,skip=0;
  plan.forEach(it=>{const st=d.checklist[it.id]&&d.checklist[it.id].state;if(st==='done')done++;else if(st==='skip')skip++;});
  const evaluated=(done+skip)||1;
  const pct=Math.round(done/evaluated*100);

  let html='';
  html+=renderCompactSummary(currentDate);
  html+='<div class="card"><div class="day-nav"><button class="sec sm" onclick="changeDate(-1)">◀</button><div class="dn-title">'+dateLabel+'</div><button class="sec sm" onclick="changeDate(1)" '+(isToday?'disabled':'')+'>▶</button></div><input type="date" value="'+currentDate+'" onchange="currentDate=this.value;render()" style="margin:0"></div>';
  if(f.cycle&&isInPeriod(currentDate))html+='<div class="card" style="background:linear-gradient(135deg,#fed7e2,#fc8181);color:#742a2a"><div style="font-weight:700;font-size:13px">🩸 Đang trong kỳ kinh nguyệt</div></div>';
  const defColor=actualDef>=targetDef?'#48bb78':actualDef>=targetDef*0.6?'#ed8936':'#e53e3e';
  const defIcon=actualDef>=targetDef?'✅':actualDef>=targetDef*0.6?'⚠️':'❌';
  const defText=actualDef>=targetDef?'Đạt mục tiêu':actualDef>=targetDef*0.6?'Hơi thiếu':'Chưa đạt';
  html+='<div class="card"><h2><span class="title">🔥 Chỉ số năng lượng</span></h2><div class="stat-grid-3"><div class="stat"><div class="stat-v">'+bmr+'</div><div class="stat-l">BMR</div></div><div class="stat"><div class="stat-v">'+tdee+'</div><div class="stat-l">TDEE</div></div><div class="stat"><div class="stat-v">'+target+'</div><div class="stat-l">Target nạp</div></div></div></div>';
  html+='<div class="card"><h2><span class="title">📊 Thực tế hôm nay</span></h2><div class="stat-grid-3"><div class="stat"><div class="stat-v">'+totalActual+'</div><div class="stat-l">Đã nạp</div><div class="pbar"><div class="pfill '+(totalActual>target?'bad':'')+'" style="width:'+Math.min(100,totalActual/target*100)+'%"></div></div></div><div class="stat"><div class="stat-v">'+totalBurned+'</div><div class="stat-l">Đốt do tập</div></div><div class="stat"><div class="stat-v" style="color:'+defColor+'">'+actualDef+'</div><div class="stat-l">Thâm hụt</div></div></div><div style="margin-top:8px;font-size:11px;color:#718096;text-align:center;padding:6px;background:'+(actualDef>=targetDef?'#f0fff4':'#fffaf0')+';border-radius:6px">'+defIcon+' '+defText+' · Mục tiêu: <strong>'+targetDef+' kcal</strong> · Thực tế: <strong>'+actualDef+' kcal</strong></div></div>';

  // Checklist
  html+='<div class="card"><h2><span class="title">✅ Checklist ('+done+'/'+plan.length+')</span><span style="display:flex;gap:6px;align-items:center"><button class="sec xs" onclick="openChecklistEditor()">⚙️ Sửa</button><span class="badge '+(pct>=80?'green':pct>=50?'yellow':'red')+'">'+pct+'%</span></span></h2>';
  plan.forEach(it=>{
    const cl=d.checklist[it.id]||{state:'pending'};
    const st=cl.state;
    const iconCls=st==='done'?'done':st==='skip'?'skip':'pending';
    const icon=st==='done'?'✓':st==='skip'?'⊘':'○';
    let meta='';
    if(it.type==='meal'){
      const foods=d.meals[it.id]||[];
      const totalCal=foods.reduce((s,x)=>s+(x.cal||0),0);
      const plannedCal=(it.planned||[]).reduce((s,x)=>s+(x.cal||0)*(x.qty||1),0);
      if(foods.length===0)meta='<span style="color:#a0aec0">KH: '+plannedCal+' kcal</span>';
      else{const col=totalCal>plannedCal+100?'#e53e3e':'#48bb78';meta='<span style="color:'+col+'">Thực: '+totalCal+' kcal</span> · '+foods.length+' món';}
    }else if(it.type==='exercise'){const exs=d.exercises.filter(e=>e.slotId===it.id);meta=exs.length===0?'<span style="color:#a0aec0">Chưa tập</span>':exs.map(e=>e.type+' '+e.duration+'p').join(', ');}
    else if(it.id==='h_steps'){meta=d.steps?d.steps.toLocaleString()+' bước':'<span style="color:#a0aec0">Chưa nhập</span>';}
    else if(it.id==='h_sleep'){meta=d.sleep.bed&&d.sleep.wake?d.sleep.bed+' → '+d.sleep.wake+' ('+calcSleep(d.sleep.bed,d.sleep.wake)+'h)':'<span style="color:#a0aec0">Chưa nhập</span>';}
    else if(it.id==='h_water'){meta=d.water?'<span style="color:#48bb78">Đã uống đủ</span>':'<span style="color:#a0aec0">Chưa đánh dấu</span>';}
    else if(it.type==='habit'){meta=st==='done'?'<span style="color:#48bb78">Đã làm</span>':st==='skip'?'<span style="color:#ed8936">Bỏ qua</span>':'<span style="color:#a0aec0">Chưa làm</span>';}
    html+='<div class="item" onclick="tapItem(\''+it.id+'\',\''+it.type+'\')"><div class="item-icon '+iconCls+'">'+icon+'</div><div class="item-info"><div class="item-name">'+it.icon+' '+esc(it.label)+'</div><div class="item-meta">'+meta+'</div></div><button class="sec xs" onclick="event.stopPropagation();markItem(\''+it.id+'\')">⋯</button></div>';
  });
  html+='</div>';

  // Bữa ăn hôm nay
  const mealSummary=[];
  plan.forEach(it=>{
    if(it.type==='meal'){
      const foods=d.meals[it.id]||[];
      const cl=d.checklist[it.id]||{state:'pending'};
      const totalCal=foods.reduce((s,x)=>s+(x.cal||0),0);
      mealSummary.push({slotId:it.id,label:it.label,icon:it.icon,foods,totalCal,checked:cl.state==='done'});
    }
  });
  if(mealSummary.some(m=>m.foods.length>0||m.checked)){
    html+='<div class="card"><h2><span class="title">🍽️ Bữa ăn hôm nay</span></h2>';
    mealSummary.forEach(m=>{
      if(m.foods.length===0&&!m.checked)return;
      if(m.foods.length===0&&m.checked){
        html+='<div style="padding:8px 0;border-bottom:1px dashed #f0f4f8"><div style="font-size:13px;font-weight:600">'+m.icon+' '+m.label+'</div><div style="font-size:11px;color:#ed8936;margin-top:3px">⚠️ Chưa chọn món — <a href="javascript:void(0)" style="color:#667eea;text-decoration:underline" onclick="openMealEditor(\''+m.slotId+'\')">Chọn món ngay</a></div></div>';
      } else {
        html+='<div style="padding:8px 0;border-bottom:1px dashed #f0f4f8"><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:13px;font-weight:600">'+m.icon+' '+m.label+'</div><div style="font-size:12px;font-weight:700;color:#48bb78">'+m.totalCal+' kcal <button class="sec xs" onclick="openMealEditor(\''+m.slotId+'\')" style="margin-left:6px">Sửa</button></div></div><div style="font-size:11px;color:#718096;margin-top:3px">'+m.foods.map(f=>esc(f.name)).join(' · ')+'</div></div>';
      }
    });
    const totalMeal=mealSummary.reduce((s,m)=>s+m.totalCal,0);
    html+='<div style="margin-top:8px;text-align:right;font-size:12px;color:#4a5568">Tổng: <strong>'+totalMeal+' kcal</strong></div></div>';
  }

  // Đường huyết
  if(f.glucose){
    html+='<div class="card"><h2><span class="title">🩸 Đường huyết ('+data.glucoseUnit+')</span><button class="sec xs" onclick="openGlucose()">+ Thêm</button></h2>';
    if(d.glucose&&d.glucose.length){
      const sorted=d.glucose.slice().sort((a,b)=>(a.time||'').localeCompare(b.time||''));
      sorted.forEach(g=>{const r=glucoseRate(g.value,g.moment,data.glucoseUnit);html+='<div class="bp-entry"><div><div class="bp-val">'+g.value+' '+data.glucoseUnit+' <span class="rating '+r[1]+'">'+r[0]+'</span></div><div class="bp-time">'+g.moment+(g.time?' · '+g.time:'')+(g.med?' · '+g.med:'')+(g.place?' · '+esc(g.place):'')+(g.note?' · '+esc(g.note):'')+'</div></div><button class="sec xs" onclick="removeGlucoseById(\''+g._id+'\')">×</button></div>';});
    } else html+='<div class="empty">Chưa đo</div>';
    html+='</div>';
  }
  // BP
  if(f.bp){
    html+='<div class="card"><h2><span class="title">🩸 Huyết áp</span><button class="sec xs" onclick="openBP()">+ Thêm</button></h2>';
    if(d.bps&&d.bps.length){d.bps.forEach((bp,i)=>{const r=bpRate(bp.sys,bp.dia);html+='<div class="bp-entry"><div><div class="bp-val">'+bp.sys+'/'+bp.dia+' <span class="rating '+r[1]+'">'+r[0]+'</span></div><div class="bp-time">'+(bp.time||'--:--')+(bp.pulse?' · '+bp.pulse+' bpm':'')+(bp.place?' · '+esc(bp.place):'')+'</div></div><button class="sec xs" onclick="removeBP('+i+')">×</button></div>';});}
    else html+='<div class="empty">Chưa đo</div>';
    html+='</div>';
  }
  // Symptoms
  if(f.symptoms){html+='<div class="card"><h2><span class="title">🤒 Triệu chứng thể chất</span></h2><div class="sym-grid">';SYM_BODY.forEach(s=>{const on=(d.symptoms||[]).includes(s);html+='<button class="sym-btn '+(on?'on':'')+'" onclick="toggleSym(\''+s+'\')">'+s+'</button>';});html+='</div></div>';}
  if(f.moods){html+='<div class="card"><h2><span class="title">💭 Cảm xúc</span></h2><div class="sym-grid">';SYM_MOOD.forEach(s=>{const on=(d.moods||[]).includes(s);html+='<button class="sym-btn mood '+(on?'on':'')+'" onclick="toggleMood(\''+s+'\')">'+s+'</button>';});html+='</div></div>';}
  if(f.cravings){html+='<div class="card"><h2><span class="title">🍫 Thèm ăn</span></h2><div class="sym-grid">';SYM_CRAVE.forEach(s=>{const on=(d.cravings||[]).includes(s);html+='<button class="sym-btn crave '+(on?'on':'')+'" onclick="toggleCrave(\''+s+'\')">'+s+'</button>';});html+='</div><textarea placeholder="Ghi chú..." rows="2" style="margin-top:8px" onchange="getDay(\''+currentDate+'\').symptomNote=this.value;save()">'+esc(d.symptomNote)+'</textarea></div>';}
  else if(f.symptoms||f.moods){html+='<div class="card"><textarea placeholder="Ghi chú triệu chứng..." rows="2" onchange="getDay(\''+currentDate+'\').symptomNote=this.value;save()">'+esc(d.symptomNote)+'</textarea></div>';}

  if(f.steps)html+='<div class="card"><h2><span class="title">👟 Bước chân</span></h2><input type="number" placeholder="Số bước (VD: 8000)" value="'+(d.steps||'')+'" onchange="setSteps(this.value)"></div>';
  if(f.sleep){
    html+='<div class="card"><h2><span class="title">😴 Giấc ngủ</span></h2><div class="row"><div><label class="flabel">Đi ngủ</label><input type="time" value="'+(d.sleep.bed||'')+'" onchange="setSleep(\'bed\',this.value)"></div><div><label class="flabel">Thức</label><input type="time" value="'+(d.sleep.wake||'')+'" onchange="setSleep(\'wake\',this.value)"></div></div>';
    if(d.sleep.bed&&d.sleep.wake){const h=calcSleep(d.sleep.bed,d.sleep.wake);html+='<p style="margin:4px 0 0;font-size:12px;color:'+(h>=7?'#48bb78':'#ed8936')+'">Đã ngủ: <strong>'+h+' giờ</strong> '+(h>=7?'✅':'⚠️')+'</p>';}
    html+='</div>';
  }
  if(f.cycle){
    const cyc=analyzeCycle();
    html+='<div class="card"><h2><span class="title">🩸 Kinh nguyệt</span><button class="sec xs" onclick="openPeriod()">+ Ghi kỳ</button></h2>';
    if(cyc){
      html+='<div class="sd-line" style="font-size:12px;padding:3px 0">Kỳ gần nhất: <strong>'+new Date(cyc.last.start+'T00:00:00').toLocaleDateString('vi-VN')+'</strong>'+(cyc.last.end?' → '+new Date(cyc.last.end+'T00:00:00').toLocaleDateString('vi-VN'):'')+'</div>';
      html+='<div class="sd-line" style="font-size:12px;padding:3px 0">Chu kỳ TB: <strong>'+cyc.refCycle+' ngày</strong>'+(cyc.hasCycleData && cyc.cycles.length>=2?' (min '+cyc.minCycle+' - max '+cyc.maxCycle+')':'')+' · Ngày <strong>'+(cyc.daysSince+1)+'</strong></div>';
      html+='<div class="cycle-alert '+(cyc.status==='late'?'late':cyc.status==='ok'?'ok':'info')+'">'+cyc.text+'<br>'+cyc.nextExpected+'</div>';
      if(cyc.warnings.length){
        cyc.warnings.slice(0,3).forEach(w=>{
          const bg=w.level==='warn'?'#fff5f5':'#ebf8ff';
          const col=w.level==='warn'?'#742a2a':'#2a4365';
          html+='<div style="font-size:11px;padding:6px 8px;border-radius:6px;margin-top:4px;background:'+bg+';color:'+col+'">'+(w.level==='warn'?'⚠️ ':'💡 ')+w.msg+'</div>';
        });
      }
    }
    else html+='<div class="empty">Chưa có dữ liệu</div>';
    html+='</div>';
  }
  if(f.meds)html+='<div class="card"><h2><span class="title">💊 Thuốc hôm nay</span></h2>'+renderMedsToday()+'</div>';
  if(f.cheat){
    const wk=weekKey(new Date(currentDate+'T00:00:00'));
    const cheat=data.cheatWeeks[wk]||0;
    html+='<div class="card"><h2><span class="title">🎁 Cheat meal tuần</span></h2><div style="display:flex;align-items:center;gap:10px"><div style="flex:1"><div class="stat-v">'+cheat+'/3</div></div><button class="sec sm" onclick="addCheat()">+1</button><button class="sec sm" onclick="resetCheat()">Reset</button></div></div>';
  }
  html+=renderDetailSummary(currentDate);
  return html;
}

// ========== TAB HEALTH ==========
function renderHealth(){
  const f=data.settings.features;
  let html='';
  const latest=getLatestWeightRecord();

  if(f.weight){
    html+='<div class="card"><h2><span class="title">⚖️ Cân nặng & thành phần cơ thể</span><button class="sec xs" onclick="openWeight()">+ Nhập</button></h2>';
    if(!latest)html+='<div class="empty">Chưa có dữ liệu</div>';
    else{
      const bmi=latest.bmi||calcBMI(latest.weight);
      const br=bmiRate(bmi);
      html+='<div class="stat-grid-3"><div class="stat"><div class="stat-v">'+latest.weight+'</div><div class="stat-l">Cân nặng (kg)</div></div><div class="stat"><div class="stat-v">'+bmi+'</div><div class="stat-l">BMI <span class="rating '+br[1]+'">'+br[0]+'</span></div></div><div class="stat"><div class="stat-v">'+(latest.bmr||calcBMRFromFormula(latest.weight))+'</div><div class="stat-l">BMR</div></div></div>';
      html+='<div class="stat-grid-3" style="margin-top:6px">';
      if(latest.bodyFatPct)html+='<div class="stat"><div class="stat-v">'+latest.bodyFatPct+'%</div><div class="stat-l">Mỡ <span class="rating '+bfRate(latest.bodyFatPct)[1]+'">'+bfRate(latest.bodyFatPct)[0]+'</span></div></div>';
      if(latest.musclePct)html+='<div class="stat"><div class="stat-v">'+latest.musclePct+'%</div><div class="stat-l">Cơ <span class="rating '+muscleRate(latest.musclePct)[1]+'">'+muscleRate(latest.musclePct)[0]+'</span></div></div>';
      if(latest.waterPct)html+='<div class="stat"><div class="stat-v">'+latest.waterPct+'%</div><div class="stat-l">Nước <span class="rating '+waterRate(latest.waterPct)[1]+'">'+waterRate(latest.waterPct)[0]+'</span></div></div>';
      html+='</div>';
    }
    html+='</div>';
  }

  if(f.weight && data.weights.length>0){
    const sortedW=[...data.weights].sort((a,b)=>b.date.localeCompare(a.date));
    html+='<div class="card"><h2><span class="title">📋 Lịch sử cân nặng ('+sortedW.length+')</span></h2>';
    sortedW.forEach(w=>{
      const bmi=w.bmi||calcBMI(w.weight);
      const br=bmiRate(bmi);
      html+='<div class="item" style="cursor:default"><div class="item-info"><div class="item-name">'+w.weight+' kg · BMI '+bmi+' <span class="rating '+br[1]+'">'+br[0]+'</span></div><div class="item-meta">'+new Date(w.date+'T00:00:00').toLocaleDateString('vi-VN')+(w.bodyFatPct?' · Mỡ '+w.bodyFatPct+'%':'')+(w.place?' · '+esc(w.place):'')+(w.note?' · '+esc(w.note):'')+'</div></div><button class="sec xs" onclick="openWeight(\''+w.date+'\')">Sửa</button><button class="sec xs" onclick="delWeight(\''+w.date+'\')">×</button></div>';
    });
    html+='</div>';
  }

  html+='<div class="card"><h2><span class="title">📉 BMR/TDEE theo thời gian</span></h2><div class="chart-toolbar" id="tbBmr"><button data-r="7">7 ngày</button><button data-r="30" class="active">30 ngày</button><button data-r="90">3 tháng</button><button data-r="365">1 năm</button></div><div class="chart-wrap" id="chartBmr"></div></div>';

  if(f.bp){
    html+='<div class="card"><h2><span class="title">🩸 Huyết áp theo thời gian</span></h2><div class="chart-toolbar" id="tbBp"><button data-r="7">7 ngày</button><button data-r="30" class="active">30 ngày</button><button data-r="90">3 tháng</button></div><div class="chart-wrap" id="chartBp"></div></div>';
    html+='<div class="card"><h2><span class="title">📋 Lịch sử đo huyết áp</span></h2>';
    const bpH=[];
    Object.keys(data.days).sort((a,b)=>b.localeCompare(a)).forEach(dt=>{const day=data.days[dt];if(day.bps&&day.bps.length)day.bps.forEach(bp=>bpH.push({date:dt,...bp}));});
    if(!bpH.length)html+='<div class="empty">Chưa có dữ liệu</div>';
    else bpH.slice(0,20).forEach(bp=>{const r=bpRate(bp.sys,bp.dia);html+='<div class="item" style="cursor:default"><div class="item-info"><div class="item-name">'+bp.sys+'/'+bp.dia+' mmHg <span class="rating '+r[1]+'">'+r[0]+'</span></div><div class="item-meta">'+new Date(bp.date+'T00:00:00').toLocaleDateString('vi-VN')+' '+(bp.time||'')+(bp.pulse?' · '+bp.pulse+' bpm':'')+(bp.place?' · '+esc(bp.place):'')+'</div></div></div>';});
    html+='</div>';
  }
  if(f.glucose){
    html+='<div class="card"><h2><span class="title">🩸 Đường huyết theo thời gian</span></h2><div class="chart-toolbar" id="tbGlu"><button data-r="7">7 ngày</button><button data-r="30" class="active">30 ngày</button><button data-r="90">3 tháng</button></div><div class="chart-wrap" id="chartGlu"></div></div>';
    html+='<div class="card"><h2><span class="title">📋 Lịch sử đo đường huyết</span></h2>';
    const gluH=[];
    Object.keys(data.days).sort((a,b)=>b.localeCompare(a)).forEach(dt=>{const day=data.days[dt];if(day.glucose&&day.glucose.length)day.glucose.forEach(g=>gluH.push({date:dt,...g}));});
    if(!gluH.length)html+='<div class="empty">Chưa có dữ liệu</div>';
    else gluH.slice(0,20).forEach(g=>{const r=glucoseRate(g.value,g.moment,data.glucoseUnit);html+='<div class="item" style="cursor:default"><div class="item-info"><div class="item-name">'+g.value+' '+data.glucoseUnit+' <span class="rating '+r[1]+'">'+r[0]+'</span></div><div class="item-meta">'+new Date(g.date+'T00:00:00').toLocaleDateString('vi-VN')+' · '+g.moment+(g.time?' '+g.time:'')+(g.med?' · '+g.med:'')+(g.place?' · '+esc(g.place):'')+'</div></div></div>';});
    html+='</div>';
  }
  if(f.labs){
    html+='<div class="card"><h2><span class="title">🧪 Kết quả xét nghiệm</span><button class="sec xs" onclick="openLab()">+ Thêm</button></h2>';
    if(!data.labTests.length)html+='<div class="empty">Chưa có kết quả</div>';
    else{
      const byCat={};
      data.labTests.forEach(t=>{const cat=t.cat||'Khác';if(!byCat[cat])byCat[cat]=[];byCat[cat].push(t);});
      Object.keys(byCat).forEach(cat=>{
        html+='<div class="section-title">'+cat+'</div>';
        byCat[cat].forEach(t=>{
          const ref=LAB_TESTS_REF.find(r=>r.name===t.name);
          const r=labRate(t.value,ref);
          const prev=data.labTests.filter(x=>x.name===t.name&&x.date<t.date).sort((a,b)=>b.date.localeCompare(a.date))[0];
          let trend='';
          if(prev){const diff=+t.value-+prev.value;if(Math.abs(diff)>0.001){const better=ref&&ref.higherBetter?diff>0:diff<0;trend=' <span style="font-size:10px;color:'+(better?'#48bb78':'#e53e3e')+'">('+(diff>0?'+':'')+diff.toFixed(2)+')</span>';}}
          html+='<div class="item" style="cursor:default"><div class="item-info"><div class="item-name">'+esc(t.name)+': <strong>'+t.value+' '+esc(t.unit)+'</strong> <span class="rating '+r[1]+'">'+r[0]+'</span>'+trend+'</div><div class="item-meta">'+new Date(t.date+'T00:00:00').toLocaleDateString('vi-VN')+(t.place?' · '+esc(t.place):'')+(t.note?' · '+esc(t.note):'')+'</div></div><button class="sec xs" onclick="delLab(\''+t.id+'\')">×</button></div>';
        });
      });
    }
    html+='</div>';
  }
  if(f.cycle){
    html+='<div class="card"><h2><span class="title">🩸 Chu kỳ kinh nguyệt</span><button class="sec xs" onclick="openPeriod()">+ Ghi kỳ</button></h2>';
    const cyc=analyzeCycle();
    if(!cyc){
      html+='<div class="empty">Chưa có dữ liệu</div>';
    } else {
      html+='<div class="stat-grid-3">';
      html+='<div class="stat"><div class="stat-v">'+cyc.refCycle+'</div><div class="stat-l">Chu kỳ TB (ngày)</div></div>';
      html+='<div class="stat"><div class="stat-v">'+(cyc.daysSince+1)+'</div><div class="stat-l">Ngày của chu kỳ</div></div>';
      html+='<div class="stat"><div class="stat-v">'+cyc.cyclesCount+'</div><div class="stat-l">Số chu kỳ đã ghi</div></div>';
      html+='</div>';
      if(cyc.hasCycleData && cyc.cycles.length >= 2){
        html+='<div style="font-size:12px;color:#718096;margin-top:8px;text-align:center">Ngắn nhất: <strong>'+cyc.minCycle+'</strong> · Dài nhất: <strong>'+cyc.maxCycle+'</strong> · Median: <strong>'+cyc.median+'</strong></div>';
      }
      html+='<div class="cycle-alert '+(cyc.status==='late'?'late':cyc.status==='ok'?'ok':'info')+'">'+cyc.text+'<br>'+cyc.nextExpected+'</div>';
      if(cyc.warnings.length){
        cyc.warnings.slice(0,5).forEach(w=>{
          const bg=w.level==='warn'?'#fff5f5':'#ebf8ff';
          const col=w.level==='warn'?'#742a2a':'#2a4365';
          const bd=w.level==='warn'?'#e53e3e':'#4299e1';
          html+='<div style="font-size:12px;padding:8px 10px;border-radius:6px;margin-top:6px;background:'+bg+';color:'+col+';border-left:3px solid '+bd+'">'+(w.level==='warn'?'⚠️ ':'💡 ')+w.msg+'</div>';
        });
      }
    }
    html+='</div>';
  }
  if(f.meds){
    html+='<div class="card"><h2><span class="title">💊 Danh sách thuốc</span><button class="sec xs" onclick="openMed()">+ Thêm</button></h2>';
    if(!data.medications.length)html+='<div class="empty">Chưa có thuốc</div>';
    else data.medications.forEach(m=>{html+='<div class="item" style="cursor:default"><div class="item-info"><div class="item-name">'+esc(m.name)+(m.dosage?' - '+esc(m.dosage):'')+'</div><div class="item-meta">'+(m.timing||[]).map(timingLabel).join(' · ')+' '+(m.active?'':'<span class="badge gray">Đã ngưng</span>')+'</div></div><button class="sec xs" onclick="toggleMedActive(\''+m.id+'\')">'+(m.active?'Ngưng':'Bật')+'</button><button class="sec xs" onclick="delMed(\''+m.id+'\')">×</button></div>';});
    html+='</div>';
  }
  return html;
}

// ========== TAB PROGRESS ==========
function renderProgress(){
  const ws=[...data.weights].sort((a,b)=>a.date.localeCompare(b.date));
  const startW=data.settings.startWeight||65,targetW=data.settings.targetWeight||63;
  const curW=ws.length?ws[ws.length-1].weight:startW;
  const lost=startW-curW,need=startW-targetW;
  const pctW=need>0?Math.max(0,Math.min(100,lost/need*100)):0;
  let html='<div class="card"><h2><span class="title">🎯 Tiến độ giảm cân</span></h2><div class="stat-grid"><div class="stat"><div class="stat-v">'+curW+'</div><div class="stat-l">Hiện tại (kg)</div></div><div class="stat"><div class="stat-v" style="color:'+(lost>0?'#48bb78':'#e53e3e')+'">'+(lost>0?'-':'')+Math.abs(lost).toFixed(1)+'</div><div class="stat-l">Đã giảm (kg)</div></div><div class="stat"><div class="stat-v">'+targetW+'</div><div class="stat-l">Mục tiêu (kg)</div></div><div class="stat"><div class="stat-v">'+Math.max(0,curW-targetW).toFixed(1)+'</div><div class="stat-l">Còn lại (kg)</div></div></div><div style="margin-top:10px"><div style="display:flex;justify-content:space-between;font-size:12px;color:#718096"><span>Tiến độ</span><span>'+pctW.toFixed(0)+'%</span></div><div class="pbar"><div class="pfill" style="width:'+pctW+'%"></div></div></div></div>';
  html+='<div class="card"><h2><span class="title">⚖️ Xu hướng cân nặng</span></h2><div class="chart-toolbar" id="tbWeight"><button data-r="7">7 ngày</button><button data-r="30" class="active">30 ngày</button><button data-r="90">3 tháng</button><button data-r="365">1 năm</button></div><div class="chart-wrap" id="chartWeight"></div></div>';
  html+='<div class="card"><h2><span class="title">📈 Calo nạp</span></h2><div class="chart-toolbar" id="tbCal"><button data-r="7">7 ngày</button><button data-r="30" class="active">30 ngày</button><button data-r="90">3 tháng</button></div><div class="chart-wrap" id="chartCal"></div></div>';
  html+='<div class="card"><h2><span class="title">👟 Bước chân</span></h2><div class="chart-toolbar" id="tbSteps"><button data-r="7">7 ngày</button><button data-r="30" class="active">30 ngày</button><button data-r="90">3 tháng</button></div><div class="chart-wrap" id="chartSteps"></div></div>';
  return html;
}

// ========== CHARTS ==========
function renderCharts(){
  if(currentTab==='health'){renderBmrChart();if(data.settings.features.bp)renderBpChart();if(data.settings.features.glucose)renderGluChart();}
  else if(currentTab==='progress'){renderWeightChart();renderCalChart();renderStepsChart();}
}
function filterByDays(arr,dateKey,days){const cutoff=new Date();cutoff.setDate(cutoff.getDate()-days);const cutoffStr=today(cutoff);return arr.filter(x=>x[dateKey]>=cutoffStr);}
let bmrRange=30;
function renderBmrChart(){
  const wrap=document.getElementById('chartBmr');if(!wrap)return;
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-bmrRange);const cutoffStr=today(cutoff);
  const hist=data.weights.filter(w=>w.date>=cutoffStr).sort((a,b)=>a.date.localeCompare(b.date)).map(w=>{const bmr=w.bmr||calcBMRFromFormula(w.weight);const tdee=Math.round(bmr*(data.settings.activityLevel||1.3));return {date:w.date,bmr,tdee,weight:w.weight};});
  if(hist.length<2){wrap.innerHTML='<div class="chart-empty"><div class="ce-icon">📉</div>Chưa đủ dữ liệu (cần ≥2 ngày cân)<br><span style="font-size:11px">Trong '+bmrRange+' ngày: '+hist.length+' điểm</span></div>';return;}
  wrap.innerHTML='<canvas></canvas>';
  const ctx=wrap.querySelector('canvas').getContext('2d');
  chartInstances.bmr=new Chart(ctx,{type:'line',data:{labels:hist.map(h=>fmtDate(h.date)),datasets:[{label:'BMR',data:hist.map(h=>h.bmr),borderColor:'#f6ad55',backgroundColor:'rgba(246,173,85,.1)',tension:0.3,pointRadius:4,pointHoverRadius:7,fill:true,borderWidth:2},{label:'TDEE',data:hist.map(h=>h.tdee),borderColor:'#667eea',backgroundColor:'rgba(102,126,234,.1)',tension:0.3,pointRadius:4,pointHoverRadius:7,fill:true,borderWidth:2}]},options:chartOpts('kcal')});
}
let bpRange=30;
function renderBpChart(){
  const wrap=document.getElementById('chartBp');if(!wrap)return;
  const entries=[];
  Object.keys(data.days).forEach(dt=>{const day=data.days[dt];if(day.bps&&day.bps.length)day.bps.forEach(bp=>entries.push({date:dt,sys:bp.sys,dia:bp.dia,time:bp.time||''}));});
  entries.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const filtered=filterByDays(entries,'date',bpRange);
  if(filtered.length<2){wrap.innerHTML='<div class="chart-empty"><div class="ce-icon">🩸</div>Chưa đủ dữ liệu (cần ≥2 lần đo)</div>';return;}
  wrap.innerHTML='<canvas></canvas>';
  const ctx=wrap.querySelector('canvas').getContext('2d');
  const sysColors=filtered.map((x,i)=>{if(i===0)return '#718096';const prev=filtered[i-1].sys;if(x.sys<prev)return '#48bb78';if(x.sys>prev)return '#e53e3e';return '#ecc94b';});
  const diaColors=filtered.map((x,i)=>{if(i===0)return '#718096';const prev=filtered[i-1].dia;if(x.dia<prev)return '#48bb78';if(x.dia>prev)return '#e53e3e';return '#ecc94b';});
  chartInstances.bp=new Chart(ctx,{type:'line',data:{labels:filtered.map(x=>fmtDate(x.date)+(x.time?' '+x.time:'')),datasets:[{label:'Tâm thu',data:filtered.map(x=>x.sys),borderColor:'#667eea',backgroundColor:'rgba(102,126,234,.1)',tension:0.2,pointRadius:5,pointHoverRadius:8,pointBackgroundColor:sysColors,fill:false,borderWidth:2},{label:'Tâm trương',data:filtered.map(x=>x.dia),borderColor:'#f6ad55',backgroundColor:'rgba(246,173,85,.1)',tension:0.2,pointRadius:5,pointHoverRadius:8,pointBackgroundColor:diaColors,fill:false,borderWidth:2}]},options:chartOpts('mmHg')});
}
let gluRange=30;
function renderGluChart(){
  const wrap=document.getElementById('chartGlu');if(!wrap)return;
  const entries=[];
  Object.keys(data.days).forEach(dt=>{const day=data.days[dt];if(day.glucose&&day.glucose.length)day.glucose.forEach(g=>entries.push({date:dt,...g}));});
  entries.sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  const filtered=filterByDays(entries,'date',gluRange);
  if(filtered.length<2){wrap.innerHTML='<div class="chart-empty"><div class="ce-icon">🩸</div>Chưa đủ dữ liệu (cần ≥2 lần đo)</div>';return;}
  wrap.innerHTML='<canvas></canvas>';
  const ctx=wrap.querySelector('canvas').getContext('2d');
  const colors=filtered.map(g=>{const r=glucoseRate(g.value,g.moment,data.glucoseUnit);return r[1]==='good'?'#48bb78':r[1]==='high'?'#ed8936':'#e53e3e';});
  chartInstances.glu=new Chart(ctx,{type:'line',data:{labels:filtered.map(x=>fmtDate(x.date)+(x.time?' '+x.time:'')),datasets:[{label:'Đường huyết ('+data.glucoseUnit+')',data:filtered.map(x=>+x.value),borderColor:'#e53e3e',backgroundColor:'rgba(229,62,62,.1)',tension:0.2,pointRadius:5,pointHoverRadius:8,pointBackgroundColor:colors,fill:true,borderWidth:2}]},options:chartOpts(data.glucoseUnit)});
}
let weightRange=30;
function renderWeightChart(){
  const wrap=document.getElementById('chartWeight');if(!wrap)return;
  const ws=[...data.weights].sort((a,b)=>a.date.localeCompare(b.date));
  const filtered=filterByDays(ws,'date',weightRange);
  if(filtered.length<2){wrap.innerHTML='<div class="chart-empty"><div class="ce-icon">⚖️</div>'+(filtered.length===0?'Chưa có dữ liệu':'Cần ≥2 lần cân')+'</div>';return;}
  wrap.innerHTML='<canvas></canvas>';
  const ctx=wrap.querySelector('canvas').getContext('2d');
  const colors=filtered.map((x,i)=>{if(i===0)return '#718096';const delta=x.weight-filtered[i-1].weight;if(Math.abs(delta)<0.1)return '#ecc94b';return delta<0?'#48bb78':'#e53e3e';});
  chartInstances.weight=new Chart(ctx,{type:'line',data:{labels:filtered.map(w=>fmtDate(w.date)),datasets:[{label:'Cân nặng',data:filtered.map(w=>w.weight),borderColor:'#dd6b20',backgroundColor:'rgba(221,107,32,.1)',tension:0.3,pointRadius:5,pointHoverRadius:8,pointBackgroundColor:colors,fill:true,borderWidth:2}]},options:chartOpts('kg')});
}
let calRange=30;
function renderCalChart(){
  const wrap=document.getElementById('chartCal');if(!wrap)return;
  const days=[];
  for(let i=calRange-1;i>=0;i--){const dd=new Date();dd.setDate(dd.getDate()-i);const ds=today(dd);const day=data.days[ds]||{meals:{}};const intake=Object.values(day.meals||{}).flat().reduce((s,x)=>s+(x.cal||0),0);days.push({date:ds,intake});}
  if(!days.some(x=>x.intake>0)){wrap.innerHTML='<div class="chart-empty"><div class="ce-icon">📊</div>Chưa có dữ liệu calo</div>';return;}
  wrap.innerHTML='<canvas></canvas>';
  const ctx=wrap.querySelector('canvas').getContext('2d');
  const tgt=getTargetCalories();
  chartInstances.cal=new Chart(ctx,{type:'line',data:{labels:days.map(x=>fmtDate(x.date)),datasets:[{label:'Calo nạp',data:days.map(x=>x.intake),borderColor:'#667eea',backgroundColor:'rgba(102,126,234,.1)',tension:0.3,pointRadius:4,fill:true,borderWidth:2},{label:'Target',data:days.map(()=>tgt),borderColor:'#48bb78',borderDash:[5,5],pointRadius:0,borderWidth:1.5,fill:false}]},options:chartOpts('kcal')});
}
let stepsRange=30;
function renderStepsChart(){
  const wrap=document.getElementById('chartSteps');if(!wrap)return;
  const days=[];
  for(let i=stepsRange-1;i>=0;i--){const dd=new Date();dd.setDate(dd.getDate()-i);const ds=today(dd);const day=data.days[ds]||{};days.push({date:ds,steps:day.steps||0});}
  if(!days.some(x=>x.steps>0)){wrap.innerHTML='<div class="chart-empty"><div class="ce-icon">👟</div>Chưa có dữ liệu bước chân</div>';return;}
  wrap.innerHTML='<canvas></canvas>';
  const ctx=wrap.querySelector('canvas').getContext('2d');
  const tgt=data.settings.targetSteps;
  chartInstances.steps=new Chart(ctx,{type:'line',data:{labels:days.map(x=>fmtDate(x.date)),datasets:[{label:'Bước chân',data:days.map(x=>x.steps),borderColor:'#48bb78',backgroundColor:'rgba(72,187,120,.1)',tension:0.3,pointRadius:4,fill:true,borderWidth:2},{label:'Target',data:days.map(()=>tgt),borderColor:'#ed8936',borderDash:[5,5],pointRadius:0,borderWidth:1.5,fill:false}]},options:chartOpts('bước')});
}
function chartOpts(unit){
  return {responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:true,position:'bottom',labels:{boxWidth:12,font:{size:11}}},tooltip:{backgroundColor:'rgba(45,55,72,.95)',padding:10,titleFont:{size:13},bodyFont:{size:12},callbacks:{label:function(ctx){return ctx.dataset.label+': '+ctx.parsed.y.toLocaleString()+' '+unit;}}}},scales:{y:{beginAtZero:false,ticks:{font:{size:10}},grid:{color:'#f0f4f8'}},x:{ticks:{font:{size:9},maxRotation:45,autoSkip:true,maxTicksLimit:10},grid:{display:false}}}};
}
document.addEventListener('click',function(e){
  const btn=e.target.closest('.chart-toolbar button');if(!btn)return;
  const tb=btn.parentElement;const range=+btn.dataset.r;
  tb.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  if(tb.id==='tbBmr'){bmrRange=range;renderBmrChart();}
  else if(tb.id==='tbBp'){bpRange=range;renderBpChart();}
  else if(tb.id==='tbGlu'){gluRange=range;renderGluChart();}
  else if(tb.id==='tbWeight'){weightRange=range;renderWeightChart();}
  else if(tb.id==='tbCal'){calRange=range;renderCalChart();}
  else if(tb.id==='tbSteps'){stepsRange=range;renderStepsChart();}
});

// ========== TAB SETTINGS ==========
function renderSettings(){
  const s=data.settings;
  const bmr=getBMR(),tdee=getTDEE(),target=getTargetCalories(),tgtDef=getTargetDeficit();
  const myProfile=window.__myProfile||{};
  const myUser=window.__myUser||{};
  const isAdmin=!!myProfile.is_admin;
  const featList=[
    ['weight','⚖️ Cân nặng'],['bp','🩸 Huyết áp'],['glucose','🩸 Đường huyết'],['labs','🧪 Xét nghiệm'],
    ['cycle','🩸 Kinh nguyệt'],['symptoms','🤒 Triệu chứng thể chất'],['moods','💭 Cảm xúc'],['cravings','🍫 Thèm ăn'],
    ['meds','💊 Thuốc'],['cheat','🎁 Cheat meal'],['sleep','😴 Giấc ngủ'],['steps','👟 Bước chân']
  ];
  let featHtml='';
  featList.forEach(ft=>{
    if(ft[0]==='cycle'&&s.gender==='male')return;
    const on=s.features[ft[0]];
    featHtml+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f4f8"><div style="font-size:13px">'+ft[1]+'</div><div style="width:44px;height:24px;border-radius:12px;background:'+(on?'#48bb78':'#cbd5e0')+';position:relative;cursor:pointer" onclick="toggleFeature(\''+ft[0]+'\')"><div style="position:absolute;top:2px;'+(on?'left:22px':'left:2px')+';width:20px;height:20px;border-radius:50%;background:#fff"></div></div></div>';
  });
  let accountCard='<div class="card"><h2><span class="title">👤 Tài khoản</span></h2><div class="info-box"><div class="metric-row"><span>Email</span><span class="val" style="font-size:11px">'+esc(myUser.email||'--')+'</span></div><div class="metric-row"><span>Tên hiển thị</span><span class="val">'+esc(myProfile.display_name||'--')+'</span></div><div class="metric-row"><span>Mối quan hệ</span><span class="val">'+esc(myProfile.relationship||'Bản thân')+'</span></div>'+(isAdmin?'<div class="metric-row"><span>Quyền</span><span class="val" style="color:#ed8936">👑 Admin</span></div>':'')+'</div><button style="width:100%;margin-top:8px;margin-bottom:6px" onclick="openEditProfile()">✏️ Đổi tên hiển thị</button><button class="sec" style="width:100%" onclick="showForgotPasswordPopup()">🔐 Đổi/Quên mật khẩu? Liên hệ admin</button></div>';
  let adminCard='';
  if(isAdmin){
    adminCard='<div class="card" style="border:2px solid #ed8936"><h2><span class="title">👑 Quản lý người dùng</span></h2><div style="font-size:12px;color:#718096;margin-bottom:10px">Chỉ admin thấy mục này.</div><button style="width:100%;margin-bottom:8px" onclick="openAdminCreateUser()">+ Tạo tài khoản mới</button><button class="warn" style="width:100%" onclick="openAdminResetPass()">🔐 Reset mật khẩu user</button></div>';
  }
  return accountCard+adminCard+
  '<div class="card"><h2><span class="title">🔥 Chỉ số năng lượng</span></h2><div class="stat-grid-3"><div class="stat"><div class="stat-v">'+bmr+'</div><div class="stat-l">BMR</div></div><div class="stat"><div class="stat-v">'+tdee+'</div><div class="stat-l">TDEE</div></div><div class="stat"><div class="stat-v">'+target+'</div><div class="stat-l">Target</div></div></div></div>'+
  '<div class="card"><h2><span class="title">👁️ Chọn module hiện</span></h2><p style="font-size:12px;color:#718096;margin:0 0 8px">Tick cái nào bạn muốn dùng.</p>'+featHtml+'<div style="margin-top:10px;padding-top:10px;border-top:1px dashed #e2e8f0"><label class="flabel">Đơn vị đường huyết</label><select onchange="data.glucoseUnit=this.value;save();render()"><option value="mmol/L" '+(data.glucoseUnit==='mmol/L'?'selected':'')+'>mmol/L (Việt Nam)</option><option value="mg/dL" '+(data.glucoseUnit==='mg/dL'?'selected':'')+'>mg/dL (Mỹ)</option></select></div></div>'+
  '<div class="card"><h2><span class="title">👤 Thông tin cá nhân</span></h2>'+
    '<label class="flabel">Chiều cao (cm)</label><input type="number" value="'+(s.height||'')+'" placeholder="VD: 170" onchange="data.settings.height=+this.value||null;rebuildBMRHistory();save();render()">'+
    '<label class="flabel">Năm sinh</label><input type="number" value="'+(s.birthYear||'')+'" placeholder="VD: '+(new Date().getFullYear()-30)+'" onchange="data.settings.birthYear=+this.value||null;rebuildBMRHistory();save();render()">'+
    '<label class="flabel">Giới tính</label><select onchange="data.settings.gender=this.value;rebuildBMRHistory();save();render()"><option value="female" '+(s.gender==='female'?'selected':'')+'>Nữ</option><option value="male" '+(s.gender==='male'?'selected':'')+'>Nam</option></select>'+
    '<label class="flabel">Cân nặng ban đầu (kg)</label><input type="number" step="0.1" value="'+(s.startWeight||'')+'" placeholder="VD: 65" onchange="data.settings.startWeight=+this.value||null;save();render()">'+
    '<label class="flabel">Cân nặng mục tiêu (kg)</label><input type="number" step="0.1" value="'+(s.targetWeight||'')+'" placeholder="VD: 63" onchange="data.settings.targetWeight=+this.value||null;save();render()"></div>'+
  '<div class="card"><h2><span class="title">🏃 Mức vận động</span></h2><select onchange="data.settings.activityLevel=+this.value;rebuildBMRHistory();save();render()">'+
    '<option value="1.2" '+(s.activityLevel==1.2?'selected':'')+'>1.2 — Ngồi nhiều</option>'+
    '<option value="1.3" '+(s.activityLevel==1.3?'selected':'')+'>1.3 — WFH + đi lại nhẹ</option>'+
    '<option value="1.375" '+(s.activityLevel==1.375?'selected':'')+'>1.375 — Tập nhẹ 1-3 ngày/tuần</option>'+
    '<option value="1.55" '+(s.activityLevel==1.55?'selected':'')+'>1.55 — Tập vừa 3-5 ngày/tuần</option>'+
    '<option value="1.725" '+(s.activityLevel==1.725?'selected':'')+'>1.725 — Tập nặng 6-7 ngày/tuần</option></select></div>'+
  '<div class="card"><h2><span class="title">🎯 Mục tiêu giảm cân</span></h2><label class="flabel">Giảm bao nhiêu kg/tuần?</label><select onchange="data.settings.targetLossPerWeek=+this.value;save();render()">'+
    '<option value="0" '+(s.targetLossPerWeek==0?'selected':'')+'>0 (giữ cân)</option>'+
    '<option value="0.25" '+(s.targetLossPerWeek==0.25?'selected':'')+'>0.25 kg/tuần</option>'+
    '<option value="0.5" '+(s.targetLossPerWeek==0.5?'selected':'')+'>0.5 kg/tuần (khuyến nghị)</option>'+
    '<option value="0.75" '+(s.targetLossPerWeek==0.75?'selected':'')+'>0.75 kg/tuần</option>'+
    '<option value="1" '+(s.targetLossPerWeek==1?'selected':'')+'>1 kg/tuần</option></select>'+
    '<label class="flabel">Hoặc target calo thủ công (0 = tự tính)</label><input type="number" value="'+(s.manualTarget||0)+'" onchange="data.settings.manualTarget=+this.value||0;save();render()"></div>'+
  '<div class="card"><h2><span class="title">📊 Mục tiêu hàng ngày</span></h2><label class="flabel">Bước chân</label><input type="number" value="'+s.targetSteps+'" onchange="data.settings.targetSteps=+this.value||8000;save();render()"><label class="flabel">Giờ ngủ tối thiểu</label><input type="number" value="'+s.targetSleep+'" onchange="data.settings.targetSleep=+this.value||7;save();render()"></div>'+
  '<div class="card"><h2><span class="title">💾 Dữ liệu</span></h2><button style="width:100%;margin-bottom:6px" onclick="exportJSON()">📤 Xuất JSON</button><button class="sec" style="width:100%;margin-bottom:6px" onclick="exportReport()">📄 Xuất báo cáo .txt</button><button class="danger" style="width:100%" onclick="handleLogout()">🚪 Đăng xuất</button></div>';
}

// ========== ACTIONS ==========
function changeDate(delta){const d=new Date(currentDate+'T00:00:00');d.setDate(d.getDate()+delta);currentDate=today(d);render();}
function tapItem(id,type){
  if(type==='meal')openMealEditor(id);
  else if(type==='exercise')openExerciseEditor(id);
  else if(id==='h_water')toggleWater();
  else markItem(id);
}
function markItem(id){
  showModal('<div class="mc"><div class="mh"><h3>Đánh dấu mục</h3><button class="close" onclick="closeModal()">×</button></div><button class="ok" style="width:100%;margin-bottom:6px" onclick="setState(\''+id+'\',\'done\')">✅ Đã làm</button><button class="warn" style="width:100%;margin-bottom:6px" onclick="setState(\''+id+'\',\'skip\')">⚪ Bỏ qua (có lý do)</button><button class="sec" style="width:100%" onclick="setState(\''+id+'\',\'pending\')">⬜ Chưa làm</button></div>');
}
function setState(id,state){
  const d=getDay(currentDate);
  if(state==='skip'){closeModal();setTimeout(()=>{showModal('<div class="mc"><div class="mh"><h3>Lý do bỏ qua</h3><button class="close" onclick="closeModal()">×</button></div>'+['Bận','Mệt','Ốm','Quên note','Không có điều kiện','Khác'].map(r=>'<button class="sec" style="width:100%;margin-bottom:6px;text-align:left" onclick="setStateReason(\''+id+'\',\''+r+'\')">'+r+'</button>').join('')+'</div>');},150);return;}
  d.checklist[id]={state};save();closeModal();render();
}
function setStateReason(id,reason){getDay(currentDate).checklist[id]={state:'skip',reason};save();closeModal();render();}
function toggleSym(s){const d=getDay(currentDate);const i=d.symptoms.indexOf(s);if(i>=0)d.symptoms.splice(i,1);else d.symptoms.push(s);save();render();}
function toggleMood(s){const d=getDay(currentDate);const i=d.moods.indexOf(s);if(i>=0)d.moods.splice(i,1);else d.moods.push(s);save();render();}
function toggleCrave(s){const d=getDay(currentDate);const i=d.cravings.indexOf(s);if(i>=0)d.cravings.splice(i,1);else d.cravings.push(s);save();render();}
function setSteps(v){const n=+v||0;const d=getDay(currentDate);d.steps=n;if(n>0)d.checklist.h_steps={state:'done'};else delete d.checklist.h_steps;save();render();}
function toggleWater(){const d=getDay(currentDate);d.water=!d.water;if(d.water)d.checklist.h_water={state:'done'};else delete d.checklist.h_water;save();render();}
function setSleep(k,v){const d=getDay(currentDate);d.sleep[k]=v;if(d.sleep.bed&&d.sleep.wake)d.checklist.h_sleep={state:'done'};save();render();}
function addCheat(){const wk=weekKey(new Date(currentDate+'T00:00:00'));data.cheatWeeks[wk]=(data.cheatWeeks[wk]||0)+1;save();render();if(data.cheatWeeks[wk]>3)toast('⚠️ Vượt 3 cheat meal tuần');}
function resetCheat(){const wk=weekKey(new Date(currentDate+'T00:00:00'));delete data.cheatWeeks[wk];save();render();}
function toggleFeature(key){data.settings.features[key]=!data.settings.features[key];save();render();toast(data.settings.features[key]?'✅ Đã bật':'⚪ Đã ẩn');}

// ========== PLACE PICKER ==========
const PLACE_OPTIONS = ['Ở nhà','Bệnh viện','Phòng khám','Công ty','Hiệu thuốc','Khác'];

function placeFieldHtml(idPrefix, currentVal){
  const val = currentVal || '';
  const isCustom = val && PLACE_OPTIONS.indexOf(val) < 0;
  let html = '<label class="flabel">Nơi đo (không bắt buộc)</label>';
  html += '<select id="'+idPrefix+'Place" onchange="onPlaceChange(\''+idPrefix+'\')">';
  html += '<option value="">-- Không chọn --</option>';
  PLACE_OPTIONS.forEach(p => {
    const sel = (val === p) ? 'selected' : '';
    html += '<option value="'+p+'" '+sel+'>'+p+'</option>';
  });
  html += '<option value="__custom__" '+(isCustom?'selected':'')+'>+ Nhập khác...</option>';
  html += '</select>';
  html += '<input type="text" id="'+idPrefix+'PlaceCustom" placeholder="Nhập nơi đo..." value="'+(isCustom?esc(val):'')+'" style="display:'+(isCustom?'block':'none')+';margin-top:6px">';
  return html;
}
function onPlaceChange(prefix){
  const sel = document.getElementById(prefix+'Place');
  const custom = document.getElementById(prefix+'PlaceCustom');
  if(!sel || !custom) return;
  if(sel.value === '__custom__'){ custom.style.display='block'; custom.focus(); }
  else { custom.style.display='none'; custom.value=''; }
}
function getPlaceValue(prefix){
  const sel = document.getElementById(prefix+'Place');
  const custom = document.getElementById(prefix+'PlaceCustom');
  if(!sel) return '';
  if(sel.value === '__custom__') return custom ? custom.value.trim() : '';
  return sel.value || '';
}

// ========== BP ==========
function openBP(){
  showModal('<div class="mc"><div class="mh"><h3>🩸 Thêm lần đo</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<div class="row"><div><label class="flabel">Tâm thu</label><input type="number" id="bpSys" placeholder="VD: 115" inputmode="numeric"></div><div><label class="flabel">Tâm trương</label><input type="number" id="bpDia" placeholder="VD: 75" inputmode="numeric"></div></div>'+
    '<div class="row"><div><label class="flabel">Nhịp tim</label><input type="number" id="bpPulse" placeholder="VD: 68" inputmode="numeric"></div><div><label class="flabel">Giờ đo</label><input type="time" id="bpTime" value="'+new Date().toTimeString().slice(0,5)+'"></div></div>'+
    placeFieldHtml('bp','')+
    '<button style="width:100%;margin-top:10px" onclick="saveBP()">💾 Lưu</button></div>');
}
function saveBP(){
  const sys=+document.getElementById('bpSys').value;
  const dia=+document.getElementById('bpDia').value;
  const pulse=+document.getElementById('bpPulse').value||0;
  const time=document.getElementById('bpTime').value;
  const place=getPlaceValue('bp');
  if(!sys||!dia){toast('Nhập đủ 2 số');return;}
  const d=getDay(currentDate);
  if(!d.bps)d.bps=[];
  d.bps.push({sys,dia,pulse,time,place});
  d.bps.sort((a,b)=>(a.time||'').localeCompare(b.time||''));
  save();closeModal();render();toast('Đã lưu');
}
function removeBP(i){const d=getDay(currentDate);if(confirm('Xóa lần đo này?')){d.bps.splice(i,1);save();render();}}

// ========== GLUCOSE ==========
function openGlucose(){
  const unit=data.glucoseUnit;
  const moments=Object.keys(GLUCOSE_THRESHOLDS);
  showModal('<div class="mc"><div class="mh"><h3>🩸 Thêm đo đường huyết</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<label class="flabel">Giá trị ('+unit+')</label><input type="number" step="0.1" id="glValue" placeholder="VD: 5.2" inputmode="decimal">'+
    '<label class="flabel">Thời điểm đo</label><select id="glMoment">'+moments.map(m=>'<option value="'+m+'">'+GLUCOSE_THRESHOLDS[m].label+'</option>').join('')+'</select>'+
    '<label class="flabel">Trước/Sau thuốc</label><select id="glMed"><option value="">Không rõ</option><option value="Trước thuốc">Trước thuốc</option><option value="Sau thuốc">Sau thuốc</option><option value="Không uống thuốc">Không uống thuốc</option></select>'+
    '<label class="flabel">Giờ đo</label><input type="time" id="glTime" value="'+new Date().toTimeString().slice(0,5)+'">'+
    placeFieldHtml('gl','')+
    '<label class="flabel">Ghi chú</label><input type="text" id="glNote" placeholder="VD: đo sau khi đi bộ">'+
    '<button style="width:100%;margin-top:10px" onclick="saveGlucose()">💾 Lưu</button></div>');
}
function saveGlucose(){
  const value=+document.getElementById('glValue').value;
  const moment=document.getElementById('glMoment').value;
  const med=document.getElementById('glMed').value;
  const time=document.getElementById('glTime').value;
  const note=document.getElementById('glNote').value.trim();
  const place=getPlaceValue('gl');
  if(!value){toast('Nhập giá trị');return;}
  const d=getDay(currentDate);
  d.glucose.push({_id:uid(),value,moment,med,time,place,note});
  d.glucose.sort((a,b)=>(a.time||'').localeCompare(b.time||''));
  save();closeModal();render();toast('Đã lưu');
}
function removeGlucoseById(id){
  const d=getDay(currentDate);
  if(!confirm('Xóa lần đo này?'))return;
  d.glucose=d.glucose.filter(g=>g._id!==id);
  save();render();
}

// ========== WEIGHT ==========
function openWeight(editDate){
  let w=null;
  if(editDate)w=data.weights.find(x=>x.date===editDate);
  const v=(field)=>w&&w[field]?w[field]:'';
  const vDate=w?w.date:today();
  const title=w?'⚖️ Sửa ngày '+new Date(w.date+'T00:00:00').toLocaleDateString('vi-VN'):'⚖️ Nhập cân nặng';
  showModal('<div class="mc"><div class="mh"><h3>'+title+'</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<label class="flabel">Ngày</label><input type="date" id="wDate" value="'+vDate+'" '+(w?'readonly':'')+'>'+
    '<div class="row"><div><label class="flabel">Cân nặng (kg)*</label><input type="number" step="0.1" id="wWeight" value="'+v('weight')+'" placeholder="VD: 65" inputmode="decimal"></div><div><label class="flabel">BMI</label><input type="number" step="0.1" id="wBmi" value="'+v('bmi')+'" placeholder="--" inputmode="decimal"></div></div>'+
    '<div class="row"><div><label class="flabel">Mỡ %</label><input type="number" step="0.1" id="wFat" value="'+v('bodyFatPct')+'" placeholder="VD: 22" inputmode="decimal"></div><div><label class="flabel">Mỡ (kg)</label><input type="number" step="0.1" id="wFatKg" value="'+v('bodyFatKg')+'" inputmode="decimal"></div></div>'+
    '<div class="row"><div><label class="flabel">Cơ %</label><input type="number" step="0.1" id="wMuscle" value="'+v('musclePct')+'" placeholder="VD: 35" inputmode="decimal"></div><div><label class="flabel">Cơ (kg)</label><input type="number" step="0.1" id="wMuscleKg" value="'+v('muscleKg')+'" inputmode="decimal"></div></div>'+
    '<div class="row"><div><label class="flabel">Xương %</label><input type="number" step="0.1" id="wBone" value="'+v('bonePct')+'" inputmode="decimal"></div><div><label class="flabel">Xương (kg)</label><input type="number" step="0.1" id="wBoneKg" value="'+v('boneKg')+'" inputmode="decimal"></div></div>'+
    '<div class="row"><div><label class="flabel">Mỡ nội tạng</label><input type="number" id="wVis" value="'+v('visceralFat')+'" placeholder="VD: 5" inputmode="numeric"></div><div><label class="flabel">Thon gọn (kg)</label><input type="number" step="0.1" id="wLean" value="'+v('leanMass')+'" inputmode="decimal"></div></div>'+
    '<div class="row"><div><label class="flabel">Nước %</label><input type="number" step="0.1" id="wWater" value="'+v('waterPct')+'" placeholder="VD: 55" inputmode="decimal"></div><div><label class="flabel">BMR (kcal)</label><input type="number" id="wBmr" value="'+v('bmr')+'" placeholder="--" inputmode="numeric"></div></div>'+
    placeFieldHtml('w', v('place'))+
    '<label class="flabel">Ghi chú</label><input type="text" id="wNote" value="'+v('note')+'" placeholder="VD: sáng CN, sau vệ sinh">'+
    '<button style="width:100%;margin-top:10px" onclick="saveWeight()">💾 Lưu</button></div>');
}
function saveWeight(){
  const date=document.getElementById('wDate').value;
  const weight=+document.getElementById('wWeight').value;
  if(!date||!weight){toast('Nhập ngày + cân nặng');return;}
  const bmrInput=+document.getElementById('wBmr').value||0;
  const bmr=bmrInput>500?bmrInput:calcBMRFromFormula(weight);
  const place=getPlaceValue('w');
  const rec={date,weight,bmi:+document.getElementById('wBmi').value||calcBMI(weight),bodyFatPct:+document.getElementById('wFat').value||0,bodyFatKg:+document.getElementById('wFatKg').value||0,musclePct:+document.getElementById('wMuscle').value||0,muscleKg:+document.getElementById('wMuscleKg').value||0,bonePct:+document.getElementById('wBone').value||0,boneKg:+document.getElementById('wBoneKg').value||0,visceralFat:+document.getElementById('wVis').value||0,leanMass:+document.getElementById('wLean').value||0,waterPct:+document.getElementById('wWater').value||0,bmr,place,note:document.getElementById('wNote').value.trim()};
  const i=data.weights.findIndex(x=>x.date===date);
  if(i>=0)data.weights[i]=rec;else data.weights.push(rec);
  rebuildBMRHistory();
  save();closeModal();render();toast('Đã lưu');
}
function delWeight(date){
  if(!confirm('Xóa lần cân ngày '+new Date(date+'T00:00:00').toLocaleDateString('vi-VN')+'?'))return;
  data.weights=data.weights.filter(w=>w.date!==date);
  rebuildBMRHistory();
  save();render();toast('Đã xóa');
}

// ========== PERIOD ==========
function openPeriod(){
  const todayInP=isInPeriod(today());
  const ps=[...data.periods].sort((a,b)=>b.start.localeCompare(a.start));
  let html='<div class="mc"><div class="mh"><h3>🩸 Ghi kỳ kinh</h3><button class="close" onclick="closeModal()">×</button></div>';

  if(ps.length){
    html+='<div class="section-title">Các kỳ đã ghi ('+ps.length+')</div>';
    ps.forEach((p,idx)=>{
      const days=p.end?Math.round((new Date(p.end)-new Date(p.start))/86400000)+1:null;
      html+='<div class="item" style="cursor:default">'+
        '<div class="item-info">'+
          '<div class="item-name">'+new Date(p.start+'T00:00:00').toLocaleDateString('vi-VN')+
            (p.end?' → '+new Date(p.end+'T00:00:00').toLocaleDateString('vi-VN'):'')+
            (days?' · '+days+' ngày':' · <span style="color:#ed8936">Chưa kết thúc</span>')+
          '</div>'+
          (p.note?'<div class="item-meta">'+esc(p.note)+'</div>':'')+
        '</div>'+
        '<button class="sec xs" onclick="closeModal();editPeriod('+idx+')">Sửa</button>'+
        '<button class="sec xs" onclick="deletePeriod('+idx+')">×</button>'+
      '</div>';
    });
    html+='<div class="section-title">Thêm kỳ mới</div>';
  }

  if(!todayInP){
    html+='<button class="warn" style="width:100%;margin-bottom:10px" onclick="startPeriodToday()">🩸 Bắt đầu kỳ hôm nay</button>';
  }

  html+='<label class="flabel">Ngày bắt đầu</label><input type="date" id="pStart" value="'+today()+'">'+
    '<label class="flabel">Ngày kết thúc (nếu đã xong)</label><input type="date" id="pEnd">'+
    '<label class="flabel">Ghi chú</label><input type="text" id="pNote" placeholder="VD: đau bụng, ra nhiều">'+
    '<button style="width:100%" onclick="savePeriod()">💾 Lưu kỳ mới</button></div>';
  showModal(html);
}

function editPeriod(idx){
  const ps=[...data.periods].sort((a,b)=>b.start.localeCompare(a.start));
  const p=ps[idx];
  if(!p)return;
  const realIdx=data.periods.findIndex(x=>x.start===p.start&&x.end===p.end);
  if(realIdx<0)return;
  window._editPeriodIdx=realIdx;
  showModal('<div class="mc"><div class="mh"><h3>✏️ Sửa kỳ kinh</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<label class="flabel">Ngày bắt đầu</label><input type="date" id="epStart" value="'+p.start+'">'+
    '<label class="flabel">Ngày kết thúc</label><input type="date" id="epEnd" value="'+(p.end||'')+'">'+
    '<label class="flabel">Ghi chú</label><input type="text" id="epNote" value="'+esc(p.note||'')+'">'+
    '<button style="width:100%;margin-bottom:6px" onclick="saveEditPeriod()">💾 Lưu</button>'+
    '<button class="sec" style="width:100%" onclick="closeModal();openPeriod()">◀ Quay lại</button></div>');
}

function saveEditPeriod(){
  const idx=window._editPeriodIdx;
  if(idx==null||idx<0||!data.periods[idx])return;
  const start=document.getElementById('epStart').value;
  const end=document.getElementById('epEnd').value;
  const note=document.getElementById('epNote').value.trim();
  if(!start){toast('Nhập ngày bắt đầu');return;}
  data.periods[idx]={start,end,note};
  save();closeModal();render();toast('✅ Đã sửa kỳ');
}

function deletePeriod(idx){
  const ps=[...data.periods].sort((a,b)=>b.start.localeCompare(a.start));
  const p=ps[idx];
  if(!p)return;
  if(!confirm('Xóa kỳ ngày '+new Date(p.start+'T00:00:00').toLocaleDateString('vi-VN')+'?'))return;
  const realIdx=data.periods.findIndex(x=>x.start===p.start&&x.end===p.end);
  if(realIdx>=0)data.periods.splice(realIdx,1);
  save();closeModal();render();toast('Đã xóa');
}
function startPeriodToday(){
  const dt=today();
  const existing=data.periods.find(p=>!p.end&&p.start<=dt);
  if(existing){toast('Đã có kỳ chưa kết thúc');return;}
  data.periods.push({start:dt,end:'',note:''});
  save();closeModal();render();toast('Đã bắt đầu kỳ');
}
function savePeriod(){
  const start=document.getElementById('pStart').value;
  const end=document.getElementById('pEnd').value;
  const note=document.getElementById('pNote').value.trim();
  if(!start){toast('Nhập ngày');return;}
  data.periods.push({start,end,note});save();closeModal();render();toast('Đã lưu');
}

// ========== MED ==========
function timingLabel(t){const f=TIMINGS.find(x=>x[0]===t);return f?f[1]:t;}
function openMed(){showModal('<div class="mc"><div class="mh"><h3>💊 Thêm thuốc</h3><button class="close" onclick="closeModal()">×</button></div><label class="flabel">Tên thuốc</label><input type="text" id="mName" placeholder="VD: Metformin"><label class="flabel">Liều lượng</label><input type="text" id="mDose" placeholder="VD: 500mg"><label class="flabel">Uống khi nào</label><div class="sym-grid">'+TIMINGS.map(t=>'<button class="sym-btn" data-t="'+t[0]+'" onclick="this.classList.toggle(\'on\')">'+t[1]+'</button>').join('')+'</div><button style="width:100%;margin-top:12px" onclick="saveMed()">💾 Lưu</button></div>');}
function saveMed(){const name=document.getElementById('mName').value.trim();const dosage=document.getElementById('mDose').value.trim();const timing=[...document.querySelectorAll('#modalRoot .sym-btn.on')].map(b=>b.dataset.t);if(!name){toast('Nhập tên');return;}data.medications.push({id:uid(),name,dosage,timing,active:true,startDate:today()});save();closeModal();render();toast('Đã thêm');}
function toggleMedActive(id){const m=data.medications.find(x=>x.id===id);if(m)m.active=!m.active;save();render();}
function delMed(id){if(!confirm('Xóa thuốc?'))return;data.medications=data.medications.filter(x=>x.id!==id);save();render();}
function renderMedsToday(){
  if(!data.medications.length)return '<div class="empty">Chưa có thuốc nào</div>';
  const active=data.medications.filter(m=>m.active);
  if(!active.length)return '<div class="empty">Không có thuốc đang dùng</div>';
  const taken=data.medLog[currentDate]||[];
  return active.map(m=>{const is=taken.indexOf(m.id)>=0;return '<div class="med-item"><div><div style="font-weight:600;font-size:13px">'+esc(m.name)+(m.dosage?' - '+esc(m.dosage):'')+'</div><div style="font-size:11px;color:#718096">'+(m.timing||[]).map(timingLabel).join(' · ')+'</div></div><div class="med-check '+(is?'on':'')+'" onclick="toggleMed(\''+m.id+'\')">'+(is?'✓':'')+'</div></div>';}).join('');
}
function toggleMed(id){if(!data.medLog[currentDate])data.medLog[currentDate]=[];const i=data.medLog[currentDate].indexOf(id);if(i>=0)data.medLog[currentDate].splice(i,1);else data.medLog[currentDate].push(id);save();render();}

// ========== MEAL EDITOR ==========
function openMealEditor(slotId){
  const d=getDay(currentDate);
  const plan=getPlan(currentDate);
  const item=plan.find(x=>x.id===slotId);
  if(!item)return;
  const foods=d.meals[slotId]||[];
  const mealNote=(d.mealNotes&&d.mealNotes[slotId])||'';
  let html='<div class="mc"><div class="mh"><h3>'+item.icon+' '+esc(item.label)+'</h3><button class="close" onclick="closeModal()">×</button></div>';
  if(foods.length){
    html+='<div class="section-title">Món đã ăn ('+foods.reduce((s,f)=>s+f.cal,0)+' kcal)</div>';
    foods.forEach((f,i)=>{
      const tag=f.tag||'green';
      const portionText=f.portion&&f.portion!==1?' (×'+f.portion+')':'';
      html+='<div class="item" style="cursor:default"><div class="item-info"><div class="item-name">'+esc(f.name)+portionText+'</div><div class="item-meta"><span class="tag '+tag+'">'+(tag==='green'?'🟢':tag==='yellow'?'🟡':'🔴')+'</span> '+f.cal+' kcal'+(f.note?' · '+esc(f.note):'')+'</div></div><button class="sec xs" onclick="removeFood(\''+slotId+'\','+i+')">×</button></div>';
    });
  }
  html+='<div class="section-title">Thêm món</div>';
  html+='<button class="sec" style="width:100%;margin-bottom:8px" onclick="quickAddPlan(\''+slotId+'\')">⚡ Thêm đúng theo kế hoạch</button>';
  if(data.favoriteFoods.length){
    html+='<div style="margin-bottom:8px"><label class="flabel">⭐ Yêu thích</label>';
    data.favoriteFoods.slice(0,5).forEach((fav,i)=>{html+='<button class="sec sm" style="margin-right:4px;margin-bottom:4px" onclick="addFavorite(\''+slotId+'\','+i+')">'+esc(fav.name)+'</button>';});
    html+='</div>';
  }
  html+='<input type="text" id="foodSearch" placeholder="Gõ tên món (không dấu cũng được)..." oninput="searchFoods(this.value)" autocomplete="off">';
  html+='<div id="foodResults" class="food-list hidden"></div>';
  html+='<div class="section-title">Hoặc món tùy chỉnh</div>';
  html+='<input type="text" id="cfName" placeholder="Tên món">';
  html+='<div class="row"><input type="number" id="cfCal" placeholder="Calo" inputmode="numeric"><input type="text" id="cfUnit" placeholder="Đơn vị" value="1 phần"></div>';
  html+='<select id="cfTag"><option value="green">🟢 Tốt</option><option value="yellow">🟡 Vừa</option><option value="red">🔴 Hạn chế</option></select>';
  html+='<button class="sec" style="width:100%;margin-top:4px" onclick="addCustomFood(\''+slotId+'\')">+ Thêm món tùy chỉnh</button>';
  html+='<div style="margin-top:12px"><label class="flabel">📝 Ghi chú bữa ăn</label><textarea id="mealNoteBox" rows="2" placeholder="VD: ít bún, nhiều rau..." onchange="saveMealNote(\''+slotId+'\',this.value)">'+esc(mealNote)+'</textarea></div>';
  html+='<button style="width:100%;margin-top:8px" onclick="markMealDone(\''+slotId+'\')">✓ Hoàn thành bữa</button></div>';
  showModal(html);
  window._currentSlot=slotId;
}
function searchFoods(q){
  const normQ=normalize(q);
  const box=document.getElementById('foodResults');
  if(!normQ){box.classList.add('hidden');return;}
  const all=FOOD_DB.concat(data.customFoods||[]);
  const matches=all.filter(f=>{if(normalize(f.n).indexOf(normQ)>=0)return true;if(f.alt&&f.alt.some(a=>normalize(a).indexOf(normQ)>=0))return true;return false;}).slice(0,20);
  const compMatches=COMPOSITE_FOODS.filter(f=>normalize(f.n).indexOf(normQ)>=0);
  if(!matches.length&&!compMatches.length){box.classList.add('hidden');return;}
  window._foodMatches=matches;
  window._compMatches=compMatches;
  let html='';
  if(compMatches.length){
    html+='<div style="padding:6px 10px;background:#fefcbf;font-size:11px;font-weight:700;color:#744210">🍜 MÓN TỔ HỢP</div>';
    compMatches.forEach((f,i)=>{const t=f.t||'yellow';const ti=t==='green'?'🟢':t==='yellow'?'🟡':'🔴';html+='<div class="food-item" style="background:#fffef5" onclick="pickComposite('+i+')"><div class="fname"><span><span class="tag '+t+'">'+ti+'</span> '+f.icon+' '+esc(f.n)+'</span><span style="font-size:10px;color:#744210">Chi tiết →</span></div></div>';});
  }
  if(matches.length){
    if(compMatches.length)html+='<div style="padding:6px 10px;background:#e2e8f0;font-size:11px;font-weight:700;color:#4a5568">🍽️ MÓN ĐƠN GIẢN</div>';
    html+=matches.map((f,i)=>{const t=f.t||'green';const ti=t==='green'?'🟢':t==='yellow'?'🟡':t==='red'?'🔴':'🔵';return '<div class="food-item" onclick="pickFood('+i+')"><div class="fname"><span><span class="tag '+t+'">'+ti+'</span> '+esc(f.n)+'</span><span class="fc">'+f.c+' kcal</span></div></div>';}).join('');
  }
  box.innerHTML=html;
  box.classList.remove('hidden');
}
function pickFood(i){
  const f=window._foodMatches[i];if(!f)return;
  const slotId=window._currentSlot;
  showModal('<div class="mc"><div class="mh"><h3>'+esc(f.n)+'</h3><button class="close" onclick="closeModal();openMealEditor(\''+slotId+'\')">×</button></div>'+
    '<div style="text-align:center;font-size:13px;color:#718096;margin-bottom:8px">Calo ('+(f.u||'1 phần')+'): <strong style="color:#e53e3e;font-size:16px">'+f.c+' kcal</strong></div>'+
    '<label class="flabel">Khẩu phần</label><div class="portion-grid"><button class="portion-btn" onclick="choosePortion(0.25,event)">1/4</button><button class="portion-btn" onclick="choosePortion(0.5,event)">1/2</button><button class="portion-btn" onclick="choosePortion(0.75,event)">3/4</button><button class="portion-btn on" onclick="choosePortion(1,event)">1</button><button class="portion-btn" onclick="choosePortion(1.5,event)">1.5</button><button class="portion-btn" onclick="choosePortion(2,event)">2</button><button class="portion-btn" onclick="choosePortion(2.5,event)">2.5</button><button class="portion-btn" onclick="choosePortion(3,event)">3</button></div>'+
    '<label class="flabel">Hoặc nhập calo thủ công</label><input type="number" id="manualCal" placeholder="VD: 125" inputmode="numeric">'+
    '<label class="flabel">Ghi chú</label><input type="text" id="pickNote" placeholder="VD: ít bún, nhiều rau">'+
    '<button style="width:100%;margin-top:8px" onclick="confirmPick('+i+')">+ Thêm vào bữa ăn</button></div>');
  window._pickedPortion=1;
}
function choosePortion(p,ev){window._pickedPortion=p;document.querySelectorAll('.portion-btn').forEach(b=>b.classList.remove('on'));if(ev&&ev.target)ev.target.classList.add('on');}
function confirmPick(i){
  const f=window._foodMatches[i];const slotId=window._currentSlot;
  const manual=document.getElementById('manualCal').value;
  const note=document.getElementById('pickNote').value.trim();
  let cal,portion;
  if(manual&&+manual>0){cal=+manual;portion=1;}else{portion=window._pickedPortion||1;cal=Math.round(f.c*portion);}
  const d=getDay(currentDate);
  if(!d.meals[slotId])d.meals[slotId]=[];
  d.meals[slotId].push({name:f.n,cal,tag:f.t||'green',portion,note});
  save();closeModal();setTimeout(()=>openMealEditor(slotId),100);toast('Đã thêm: '+f.n);
}
function addCustomFood(slotId){
  const name=document.getElementById('cfName').value.trim();
  const cal=+document.getElementById('cfCal').value||0;
  const unit=document.getElementById('cfUnit').value.trim()||'1 phần';
  const tag=document.getElementById('cfTag').value;
  if(!name||!cal){toast('Nhập tên và calo');return;}
  const d=getDay(currentDate);
  if(!d.meals[slotId])d.meals[slotId]=[];
  const fullName=name+' ('+unit+')';
  d.meals[slotId].push({name:fullName,cal,tag});
  if(!data.customFoods)data.customFoods=[];
  if(!data.customFoods.some(c=>c.n===fullName))data.customFoods.push({n:fullName,c:cal,t:tag,u:unit,alt:[]});
  save();openMealEditor(slotId);toast('Đã thêm');
}
function removeFood(slotId,i){getDay(currentDate).meals[slotId].splice(i,1);save();openMealEditor(slotId);}
function quickAddPlan(slotId){
  const item=getPlan(currentDate).find(x=>x.id===slotId);
  if(!item||!item.planned)return;
  const d=getDay(currentDate);
  if(!d.meals[slotId])d.meals[slotId]=[];
  item.planned.forEach(f=>{d.meals[slotId].push({name:f.name,cal:f.cal*(f.qty||1),tag:f.tag||'green'});});
  save();openMealEditor(slotId);toast('Đã thêm theo KH');
}
function saveMealNote(slotId,v){
  const d=getDay(currentDate);
  if(!d.mealNotes)d.mealNotes={};
  d.mealNotes[slotId]=v;
  save();
}
function markMealDone(slotId){
  const d=getDay(currentDate);
  if(!d.meals[slotId]||!d.meals[slotId].length){toast('Thêm món trước');return;}
  d.checklist[slotId]={state:'done'};save();closeModal();render();
}

// ========== COMPOSITE ==========
let currentComposite=null;
function pickComposite(i){
  currentComposite=window._compMatches[i];
  if(!currentComposite)return;
  if(!window._compState||window._compStateName!==currentComposite.n){
    window._compState={};
    currentComposite.components.forEach(comp=>{window._compState[comp.id]=comp.default||0;});
    window._compStateName=currentComposite.n;
    window._compQty=1;
    window._compNote='';
  }
  showCompositePicker();
}
function showCompositePicker(){
  const c=currentComposite;
  if(!c)return;
  const slotId=window._currentSlot;
  let total=0;
  c.components.forEach(comp=>{total+=(comp.cal||0)*(window._compState[comp.id]||0);});
  total=Math.round(total*window._compQty);
  let html='<div class="mc"><div class="mh"><h3>'+c.icon+' '+esc(c.n)+'</h3><button class="close" onclick="closeModal();openMealEditor(\''+slotId+'\')">×</button></div>';
  if(c.presets){
    html+='<div style="margin-bottom:8px"><label class="flabel">⚡ Chọn nhanh</label><div style="display:flex;flex-wrap:wrap;gap:4px">';
    Object.keys(c.presets).forEach(pk=>{html+='<button class="sec sm" onclick="applyPreset(\''+pk+'\')">'+pk+'</button>';});
    html+='</div></div>';
  }
  html+='<div style="margin-bottom:8px"><label class="flabel">✅ Tick thành phần</label>';
  c.components.forEach(comp=>{
    const mult=window._compState[comp.id]||0;
    const checked=mult>0;
    const calNow=Math.round((comp.cal||0)*mult);
    html+='<div style="padding:8px 0;border-bottom:1px dashed #f0f4f8">';
    html+='<div style="display:flex;align-items:center;gap:8px">';
    html+='<input type="checkbox" '+(checked?'checked':'')+' onchange="toggleComp(\''+comp.id+'\',this.checked)" style="width:20px;height:20px;margin:0;flex-shrink:0">';
    html+='<div style="flex:1"><div style="font-size:13px;font-weight:600">'+esc(comp.name)+'</div><div style="font-size:11px;color:#718096">'+esc(comp.note||'1 phần')+' · '+comp.cal+' kcal</div></div>';
    if(checked)html+='<div style="font-size:12px;font-weight:700;color:#e53e3e;white-space:nowrap">'+calNow+'</div>';
    html+='</div>';
    if(checked){
      html+='<div class="portion-grid" style="margin-top:4px;grid-template-columns:repeat(6,1fr)">';
      [0.25,0.5,0.75,1,1.5,2].forEach(p=>{html+='<button class="portion-btn '+(mult===p?'on':'')+'" style="font-size:11px;padding:6px 2px" onclick="setCompMult(\''+comp.id+'\','+p+')">'+p+'</button>';});
      html+='</div>';
    }
    html+='</div>';
  });
  html+='</div>';
  html+='<div style="margin-bottom:8px"><label class="flabel">🍽️ Số lượng</label><div class="portion-grid" style="grid-template-columns:repeat(5,1fr)">';
  [1,1.5,2,2.5,3].forEach(q=>{html+='<button class="portion-btn '+(window._compQty===q?'on':'')+'" onclick="setCompQty('+q+')">'+q+'</button>';});
  html+='</div></div>';
  html+='<div style="margin-bottom:8px"><label class="flabel">📝 Ghi chú</label><textarea rows="2" onchange="window._compNote=this.value" placeholder="VD: nước trong, ít bún, nhiều rau...">'+esc(window._compNote||'')+'</textarea></div>';
  html+='<div style="padding:10px;background:#f7fafc;border-radius:8px;text-align:center;margin-bottom:8px"><div style="font-size:11px;color:#718096">TỔNG</div><div style="font-size:24px;font-weight:700;color:#e53e3e">'+total+' kcal</div></div>';
  html+='<button style="width:100%" onclick="confirmComposite(\''+slotId+'\')">+ Thêm vào bữa ăn</button></div>';
  showModal(html);
}
function toggleComp(id,checked){
  if(checked){window._compState[id]=window._compState[id]||1;if(!window._compState[id])window._compState[id]=1;}
  else window._compState[id]=0;
  showCompositePicker();
}
function setCompMult(id,m){window._compState[id]=m;showCompositePicker();}
function setCompQty(q){window._compQty=q;showCompositePicker();}
function applyPreset(name){
  const c=currentComposite;
  if(!c||!c.presets||!c.presets[name])return;
  window._compState={};
  c.components.forEach(comp=>{window._compState[comp.id]=0;});
  Object.keys(c.presets[name]).forEach(k=>{window._compState[k]=c.presets[name][k];});
  showCompositePicker();
}
function confirmComposite(slotId){
  const c=currentComposite;
  if(!c)return;
  let total=0;
  const parts=[];
  c.components.forEach(comp=>{
    const m=window._compState[comp.id]||0;
    if(m>0){total+=(comp.cal||0)*m;parts.push(comp.name+(m!==1?'×'+m:''));}
  });
  total=Math.round(total*window._compQty);
  if(total<=0){toast('Tick ít nhất 1 thành phần');return;}
  const d=getDay(currentDate);
  if(!d.meals[slotId])d.meals[slotId]=[];
  const nameStr=c.n+(window._compQty!==1?' ×'+window._compQty:'')+' ['+parts.join(', ')+']';
  d.meals[slotId].push({name:nameStr,cal:total,tag:c.t||'yellow',portion:1,note:window._compNote||''});
  const favName=c.n+(window._compNote?' ('+window._compNote+')':'');
  if(!data.favoriteFoods.some(f=>f.name===favName)){
    data.favoriteFoods.push({name:favName,cal:total,note:window._compNote||''});
    if(data.favoriteFoods.length>20)data.favoriteFoods.shift();
  }
  save();closeModal();setTimeout(()=>openMealEditor(slotId),100);
  toast('Đã thêm: '+c.n);
}
function addFavorite(slotId,i){
  const fav=data.favoriteFoods[i];
  if(!fav)return;
  const d=getDay(currentDate);
  if(!d.meals[slotId])d.meals[slotId]=[];
  d.meals[slotId].push({name:fav.name,cal:fav.cal,tag:'green',portion:1,note:fav.note||''});
  save();openMealEditor(slotId);toast('Đã thêm');
}

// ========== EXERCISE ==========
function openExerciseEditor(slotId){
  const item=getPlan(currentDate).find(x=>x.id===slotId);
  if(!item)return;
  const d=getDay(currentDate);
  const exs=d.exercises.filter(e=>e.slotId===slotId);
  let html='<div class="mc"><div class="mh"><h3>'+item.icon+' '+esc(item.label)+'</h3><button class="close" onclick="closeModal()">×</button></div>';
  if(exs.length){
    html+='<div class="section-title">Đã tập</div>';
    exs.forEach((e,i)=>{html+='<div class="item" style="cursor:default"><div class="item-info"><div class="item-name">'+esc(e.type)+'</div><div class="item-meta">'+e.duration+' phút · '+(e.cal||0)+' kcal</div></div><button class="sec xs" onclick="removeEx(\''+slotId+'\','+i+')">×</button></div>';});
  }
  html+='<div class="section-title">Thêm bài tập</div>';
  html+='<label class="flabel">Bộ môn</label><select id="exType" onchange="updateMETPreview(\''+slotId+'\')">';
  EXERCISE_DB.forEach(ex=>{html+='<option value="'+esc(ex.n)+'" data-met="'+ex.met+'">'+ex.icon+' '+esc(ex.n)+' (MET '+ex.met+')</option>';});
  if(data.customExercises.length){
    html+='<optgroup label="⭐ Tự thêm">';
    data.customExercises.forEach(ex=>{html+='<option value="'+esc(ex.n)+'" data-met="'+ex.met+'">'+esc(ex.n)+' (MET '+ex.met+')</option>';});
    html+='</optgroup>';
  }
  html+='</select>';
  html+='<button class="sec sm" style="margin-bottom:8px" onclick="openAddCustomExercise()">+ Thêm bộ môn</button>';
  html+='<label class="flabel">Thời gian (phút)</label><input type="number" id="exDur" placeholder="30" inputmode="numeric" value="'+(item.defaultMin||30)+'" oninput="updateMETPreview(\''+slotId+'\')">';
  html+='<div id="metPreview" style="padding:10px;background:#ebf8ff;border-radius:8px;margin-bottom:8px;font-size:13px;text-align:center"><span style="color:#2c5282">Calo đốt: </span><strong id="metCal" style="color:#e53e3e;font-size:16px">--</strong></div>';
  html+='<label class="flabel">Hoặc tự nhập calo đốt</label><input type="number" id="exCal" placeholder="Để trống = dùng MET" inputmode="numeric">';
  html+='<button style="width:100%;margin-top:6px" onclick="saveEx(\''+slotId+'\')">+ Thêm bài tập</button>';
  html+='<button class="ok" style="width:100%;margin-top:6px" onclick="doneEx(\''+slotId+'\')">✓ Hoàn thành</button></div>';
  showModal(html);
  window._currentSlot=slotId;
  if(item.defaultEx){
    const opt=[...document.querySelectorAll('#exType option')].find(o=>o.value===item.defaultEx);
    if(opt)document.getElementById('exType').value=item.defaultEx;
  }
  setTimeout(()=>updateMETPreview(slotId),50);
}
function updateMETPreview(slotId){
  const sel=document.getElementById('exType');
  const dur=+document.getElementById('exDur').value||0;
  if(!sel||!dur)return;
  const met=+sel.options[sel.selectedIndex].dataset.met||5;
  const cal=calcMETCalo(met,dur);
  const el=document.getElementById('metCal');
  if(el)el.textContent=cal+' kcal';
}
function openAddCustomExercise(){
  showModal('<div class="mc"><div class="mh"><h3>+ Bộ môn mới</h3><button class="close" onclick="closeModal()">×</button></div><label class="flabel">Tên bộ môn</label><input type="text" id="ceName" placeholder="VD: BJJ, Muay Thái..."><label class="flabel">MET (cường độ)</label><select id="ceMet"><option value="3">3 — Nhẹ</option><option value="5" selected>5 — Vừa</option><option value="7">7 — Nặng</option><option value="10">10 — Rất nặng</option><option value="12">12 — Cực nặng</option></select><button style="width:100%;margin-top:8px" onclick="saveCustomExercise()">💾 Lưu</button></div>');
}
function saveCustomExercise(){
  const name=document.getElementById('ceName').value.trim();
  const met=+document.getElementById('ceMet').value||5;
  if(!name){toast('Nhập tên');return;}
  data.customExercises.push({n:name,met});
  save();closeModal();
  const slotId=window._currentSlot;
  if(slotId)openExerciseEditor(slotId);
  toast('Đã thêm: '+name);
}
function saveEx(slotId){
  const d=getDay(currentDate);
  const type=document.getElementById('exType').value;
  const duration=+document.getElementById('exDur').value||0;
  const sel=document.getElementById('exType');
  const met=+sel.options[sel.selectedIndex].dataset.met||5;
  const manualCal=+document.getElementById('exCal').value||0;
  const cal=manualCal>0?manualCal:calcMETCalo(met,duration);
  if(!duration){toast('Nhập thời gian');return;}
  d.exercises.push({slotId,type,duration,cal,met,time:new Date().toTimeString().slice(0,5)});
  save();openExerciseEditor(slotId);toast('Đã thêm');
}
function removeEx(slotId,i){const d=getDay(currentDate);const list=d.exercises.filter(e=>e.slotId===slotId);const t=list[i];const idx=d.exercises.indexOf(t);if(idx>=0)d.exercises.splice(idx,1);save();openExerciseEditor(slotId);}
function doneEx(slotId){
  const d=getDay(currentDate);
  if(!d.exercises.filter(e=>e.slotId===slotId).length){toast('Thêm bài tập trước');return;}
  d.checklist[slotId]={state:'done'};save();closeModal();render();
}

// ========== LAB ==========
function openLab(){
  let opts='<option value="">-- Chọn chỉ số --</option>';
  const byCat={};
  LAB_TESTS_REF.forEach(r=>{if(!byCat[r.cat])byCat[r.cat]=[];byCat[r.cat].push(r);});
  Object.keys(byCat).forEach(cat=>{
    opts+='<optgroup label="'+cat+'">';
    byCat[cat].forEach(r=>{opts+='<option value="'+esc(r.name)+'">'+esc(r.name)+' ('+r.unit+')</option>';});
    opts+='</optgroup>';
  });
  opts+='<optgroup label="Khác"><option value="__custom__">+ Chỉ số tùy chỉnh</option></optgroup>';
  showModal('<div class="mc"><div class="mh"><h3>🧪 Thêm kết quả xét nghiệm</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<label class="flabel">Chỉ số</label><select id="lbName" onchange="onLabNameChange()">'+opts+'</select>'+
    '<div id="labCustomBox" class="hidden"><label class="flabel">Tên chỉ số</label><input type="text" id="lbCustomName"></div>'+
    '<div class="row"><div><label class="flabel">Giá trị</label><input type="number" step="0.01" id="lbValue" inputmode="decimal"></div><div><label class="flabel">Đơn vị</label><input type="text" id="lbUnit" readonly></div></div>'+
    '<label class="flabel">Ngày lấy kết quả</label><input type="date" id="lbDate" value="'+today()+'">'+
    placeFieldHtml('lb','')+
    '<label class="flabel">Ghi chú</label><input type="text" id="lbNote" placeholder="VD: lấy máu lúc đói">'+
    '<button style="width:100%;margin-top:10px" onclick="saveLab()">💾 Lưu</button></div>');
  onLabNameChange();
}
function onLabNameChange(){
  const name=document.getElementById('lbName').value;
  const box=document.getElementById('labCustomBox');
  const unitInput=document.getElementById('lbUnit');
  if(name==='__custom__'){box.classList.remove('hidden');unitInput.value='';unitInput.readOnly=false;}
  else{box.classList.add('hidden');const ref=LAB_TESTS_REF.find(r=>r.name===name);unitInput.value=ref?ref.unit:'';unitInput.readOnly=true;}
}
function saveLab(){
  const sel=document.getElementById('lbName').value;
  let name=sel;
  if(sel==='__custom__')name=document.getElementById('lbCustomName').value.trim();
  const value=+document.getElementById('lbValue').value;
  const unit=document.getElementById('lbUnit').value.trim();
  const date=document.getElementById('lbDate').value;
  const note=document.getElementById('lbNote').value.trim();
  const place=getPlaceValue('lb');
  if(!name||!value||!date){toast('Nhập đủ tên, giá trị, ngày');return;}
  const ref=LAB_TESTS_REF.find(r=>r.name===name);
  data.labTests.push({id:uid(),name,value,unit:unit||(ref?ref.unit:''),date,note,place,cat:ref?ref.cat:'Khác'});
  save();closeModal();render();toast('Đã lưu');
}
function delLab(id){
  if(!confirm('Xóa kết quả này?'))return;
  data.labTests=data.labTests.filter(x=>x.id!==id);
  save();render();
}

// ========== ADMIN ==========
function generateTempPass(){
  const chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let p='';
  for(let i=0;i<8;i++)p+=chars[Math.floor(Math.random()*chars.length)];
  return p;
}
function openAdminCreateUser(){
  showModal('<div class="mc"><div class="mh"><h3>👑 Tạo tài khoản mới</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<div style="background:#fefcbf;padding:10px;border-radius:8px;font-size:12px;color:#744210;margin-bottom:12px">Sau khi tạo, gửi <strong>email + pass tạm</strong> cho user qua Zalo.</div>'+
    '<label class="flabel">Email</label><input type="email" id="acEmail" placeholder="VD: me.vy@gmail.com" autocomplete="off">'+
    '<label class="flabel">Mật khẩu tạm</label><div class="row"><input type="text" id="acPass" value="'+generateTempPass()+'" style="flex:1"><button class="sec" style="flex:0 0 60px" onclick="document.getElementById(\'acPass\').value=generateTempPass()">🔄</button></div>'+
    '<label class="flabel">Tên hiển thị</label><input type="text" id="acName" placeholder="VD: Mẹ Vy">'+
    '<label class="flabel">Mối quan hệ</label><select id="acRel"><option>Bản thân</option><option>Vợ / Chồng</option><option>Cha / Mẹ</option><option>Con</option><option>Ông / Bà</option><option>Anh / Chị / Em</option><option>Người thân khác</option><option>Người được chăm sóc</option></select>'+
    '<div id="acErr" style="color:#e53e3e;font-size:12px;margin-top:8px;min-height:16px"></div>'+
    '<button style="width:100%;margin-top:8px" id="acBtn" onclick="doAdminCreateUser()">💾 Tạo tài khoản</button></div>');
}
async function doAdminCreateUser(){
  const email=document.getElementById('acEmail').value.trim().toLowerCase();
  const pass=document.getElementById('acPass').value;
  const name=document.getElementById('acName').value.trim();
  const rel=document.getElementById('acRel').value;
  const errEl=document.getElementById('acErr');
  const btn=document.getElementById('acBtn');
  if(!email||!email.includes('@')){errEl.textContent='Nhập email hợp lệ';return;}
  if(!pass||pass.length<6){errEl.textContent='Mật khẩu tối thiểu 6 ký tự';return;}
  errEl.textContent='';btn.disabled=true;btn.textContent='Đang tạo...';
  try {
    await adminCreateUser(email,pass,name||email,rel);
    closeModal();
    showModal('<div class="mc"><div class="mh"><h3>✅ Đã tạo tài khoản</h3><button class="close" onclick="closeModal()">×</button></div>'+
      '<div style="background:#f0fff4;padding:12px;border-radius:8px;margin-bottom:12px;font-size:13px;line-height:1.7"><div><strong>Email:</strong> '+esc(email)+'</div><div><strong>Pass tạm:</strong> <code style="background:#fff;padding:2px 6px;border-radius:4px">'+esc(pass)+'</code></div><div><strong>Tên:</strong> '+esc(name||email)+'</div><div><strong>Mối quan hệ:</strong> '+esc(rel)+'</div></div>'+
      '<button style="width:100%;margin-bottom:6px" onclick="copyAcInfo(\''+esc(email)+'\',\''+esc(pass)+'\')">📋 Copy thông tin</button><button class="sec" style="width:100%" onclick="closeModal()">Đóng</button></div>');
  } catch(err){
    console.error('Create user error:',err);
    let msg=err.message||'Không tạo được';
    if(msg.includes('already exists')||msg.includes('đã tồn tại'))msg='Email này đã tồn tại';
    if(msg.includes('Chỉ admin'))msg='Bạn không có quyền. Kiểm tra set is_admin trong Supabase.';
    errEl.textContent=msg;btn.disabled=false;btn.textContent='💾 Tạo tài khoản';
  }
}
function copyAcInfo(email,pass){
  const text='Đã tạo tài khoản cho bạn:\n\n📧 Email: '+email+'\n🔑 Mật khẩu tạm: '+pass+'\n\nVào: https://suc-khoe-seven.vercel.app\nLogin xong sẽ được yêu cầu đổi mật khẩu riêng.\nLiên hệ admin nếu quên mật khẩu.';
  if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>toast('Đã copy'));}
  else{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast('Đã copy');}
}
function openAdminResetPass(){
  showModal('<div class="mc"><div class="mh"><h3>🔐 Reset mật khẩu user</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<div style="background:#fefcbf;padding:10px;border-radius:8px;font-size:12px;color:#744210;margin-bottom:12px">Data của user KHÔNG mất. Chỉ đổi mật khẩu.</div>'+
    '<label class="flabel">Email user</label><input type="email" id="rpEmail" placeholder="VD: me.vy@gmail.com">'+
    '<label class="flabel">Mật khẩu mới</label><div class="row"><input type="text" id="rpPass" value="'+generateTempPass()+'" style="flex:1"><button class="sec" style="flex:0 0 60px" onclick="document.getElementById(\'rpPass\').value=generateTempPass()">🔄</button></div>'+
    '<div id="rpErr" style="color:#e53e3e;font-size:12px;margin-top:8px;min-height:16px"></div>'+
    '<button style="width:100%;margin-top:8px" id="rpBtn" onclick="doAdminResetPass()">🔐 Reset</button></div>');
}
async function doAdminResetPass(){
  const email=document.getElementById('rpEmail').value.trim().toLowerCase();
  const pass=document.getElementById('rpPass').value;
  const errEl=document.getElementById('rpErr');
  const btn=document.getElementById('rpBtn');
  if(!email||!email.includes('@')){errEl.textContent='Nhập email hợp lệ';return;}
  if(!pass||pass.length<6){errEl.textContent='Mật khẩu tối thiểu 6 ký tự';return;}
  errEl.textContent='';btn.disabled=true;btn.textContent='Đang reset...';
  try {
    await adminResetPassword(email,pass);
    closeModal();
    showModal('<div class="mc"><div class="mh"><h3>✅ Đã reset mật khẩu</h3><button class="close" onclick="closeModal()">×</button></div>'+
      '<div style="background:#f0fff4;padding:12px;border-radius:8px;margin-bottom:12px;font-size:13px;line-height:1.7"><div><strong>Email:</strong> '+esc(email)+'</div><div><strong>Pass mới:</strong> <code style="background:#fff;padding:2px 6px;border-radius:4px">'+esc(pass)+'</code></div></div>'+
      '<button style="width:100%;margin-bottom:6px" onclick="copyResetInfo(\''+esc(email)+'\',\''+esc(pass)+'\')">📋 Copy thông tin</button><button class="sec" style="width:100%" onclick="closeModal()">Đóng</button></div>');
  } catch(err){
    console.error('Reset pass error:',err);
    let msg=err.message||'Không reset được';
    if(msg.includes('không tồn tại'))msg='Email không tồn tại trong hệ thống';
    if(msg.includes('Chỉ admin'))msg='Bạn không có quyền.';
    errEl.textContent=msg;btn.disabled=false;btn.textContent='🔐 Reset';
  }
}
function copyResetInfo(email,pass){
  const text='Mật khẩu mới cho '+email+':\n\n🔑 '+pass+'\n\nLogin xong nhớ đổi mật khẩu riêng nhé.';
  if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>toast('Đã copy'));}
  else{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast('Đã copy');}
}

// ========== EDIT PROFILE ==========
function openEditProfile(){
  const p=window.__myProfile||{};
  showModal('<div class="mc"><div class="mh"><h3>✏️ Đổi tên hiển thị</h3><button class="close" onclick="closeModal()">×</button></div>'+
    '<label class="flabel">Tên hiển thị</label><input type="text" id="epName" value="'+esc(p.display_name||'')+'" placeholder="VD: Vy, Mẹ Vy, Ba...">'+
    '<label class="flabel">Mối quan hệ</label><select id="epRel">'+['Bản thân','Vợ / Chồng','Cha / Mẹ','Con','Ông / Bà','Anh / Chị / Em','Người thân khác','Người được chăm sóc'].map(r=>'<option '+(p.relationship===r?'selected':'')+'>'+r+'</option>').join('')+'</select>'+
    '<div id="epErr" style="color:#e53e3e;font-size:12px;margin-bottom:8px;min-height:16px"></div>'+
    '<button style="width:100%" onclick="doEditProfile()">💾 Lưu</button></div>',true);
}
async function doEditProfile(){
  const name=document.getElementById('epName').value.trim();
  const rel=document.getElementById('epRel').value;
  const errEl=document.getElementById('epErr');
  if(!name){errEl.textContent='Nhập tên hiển thị';return;}
  try {
    await updateMyProfile({display_name:name,relationship:rel});
    const p=await getMyProfile();
    window.__myProfile=p;
    closeModal();render();toast('✅ Đã lưu');
  } catch(err){
    console.error('Edit profile error:',err);
    errEl.textContent='Lỗi: '+err.message;
  }
}

// ========== CHECKLIST CUSTOMIZATION ==========
function openChecklistEditor(){
  const d = new Date(currentDate+'T00:00:00').getDay();
  const dayType = d===6 ? 'saturday' : d===0 ? 'sunday' : 'weekday';
  const dayLabel = dayType==='weekday' ? 'T2-T6' : dayType==='saturday' ? 'Thứ 7' : 'Chủ nhật';
  const current = getPlan(currentDate);
  window._editDayType = dayType;
  window._editDayLabel = dayLabel;
  window._editItems = JSON.parse(JSON.stringify(current));
  renderChecklistEditor();
}

function renderChecklistEditor(){
  const items = window._editItems;
  const dayLabel = window._editDayLabel;
  let html = '<div class="mc" style="padding:20px">';
  html += '<div class="mh"><h3>⚙️ Sửa checklist — '+dayLabel+'</h3><button class="close" onclick="closeModal()">×</button></div>';
  html += '<div style="font-size:12px;color:#718096;margin-bottom:12px;padding:10px;background:#ebf8ff;border-radius:8px">💡 Sửa giờ, đổi tên, xóa mục. Bấm <strong>Lưu</strong> để áp dụng cho TẤT CẢ ngày cùng loại ('+dayLabel+').</div>';

  if(items.length===0){
    html += '<div class="empty">Checklist trống. Bấm "+ Thêm mục mới" để bắt đầu.</div>';
  } else {
    items.forEach((it, i)=>{
      html += '<div class="checklist-edit-item">';
      html += '<div class="cei-row">';
      html += '<div class="cei-icon">'+(it.icon||'📌')+'</div>';
      html += '<input type="text" class="cei-label-input" value="'+esc(it.label||'')+'" onchange="editItemLabel('+i+',this.value)">';
      html += '<button class="cei-delete" onclick="deleteChecklistItem('+i+')">×</button>';
      html += '</div>';
      if(it.time!==undefined){
        html += '<div class="cei-time-row">';
        html += '<label>Giờ:</label>';
        html += '<input type="time" value="'+(it.time||'')+'" onchange="editItemTime('+i+',this.value)">';
        html += '<span class="cei-type">'+(it.type==='meal'?'🍽️ Ăn uống':it.type==='exercise'?'🏃 Thể dục':'💧 Thói quen')+'</span>';
        html += '</div>';
      } else {
        html += '<div class="cei-time-row"><span class="cei-type" style="margin-left:0">'+(it.type==='meal'?'🍽️ Ăn uống':it.type==='exercise'?'🏃 Thể dục':'💧 Thói quen')+'</span></div>';
      }
      html += '</div>';
    });
  }

  html += '<button style="width:100%;margin-top:14px;background:#e2e8f0;color:#4a5568" onclick="openAddChecklistItem()">+ Thêm mục mới</button>';
  html += '<button style="width:100%;margin-top:8px" onclick="saveChecklistTemplate()">💾 Lưu checklist</button>';
  html += '<button class="sec" style="width:100%;margin-top:8px" onclick="resetChecklistTemplate()">↩️ Khôi phục mặc định</button>';
  html += '</div>';
  showModal(html, true);
}

function editItemLabel(i, val){ window._editItems[i].label = val; }
function editItemTime(i, val){ window._editItems[i].time = val; }

function deleteChecklistItem(i){
  if(!confirm('Xóa mục này khỏi checklist?'))return;
  window._editItems.splice(i, 1);
  renderChecklistEditor();
}

function openAddChecklistItem(){
  showModal(
    '<div class="mc" style="padding:20px;max-width:480px">'+
      '<div class="mh"><h3>+ Thêm mục mới</h3><button class="close" onclick="renderChecklistEditor()">×</button></div>'+
      '<label class="flabel">Loại mục</label>'+
      '<select id="newItemType" onchange="onNewItemTypeChange()">'+
        '<option value="meal">🍽️ Ăn uống</option>'+
        '<option value="exercise">🏃 Thể dục</option>'+
        '<option value="habit">💧 Thói quen</option>'+
      '</select>'+
      '<label class="flabel">Tên mục</label>'+
      '<input type="text" id="newItemLabel" placeholder="VD: Bữa tối, Tập gym...">'+
      '<div id="timeBox"><label class="flabel">Giờ</label><input type="time" id="newItemTime" value="12:00"></div>'+
      '<div id="iconBox" style="display:none"><label class="flabel">Icon (emoji)</label><input type="text" id="newItemIcon" value="🍽️" maxlength="3"></div>'+
      '<div id="itemErr" style="color:#e53e3e;font-size:12px;margin-bottom:8px;min-height:16px"></div>'+
      '<button style="width:100%" onclick="addChecklistItem()">+ Thêm vào checklist</button>'+
    '</div>',
    true
  );
  onNewItemTypeChange();
}

function onNewItemTypeChange(){
  const t = document.getElementById('newItemType').value;
  const timeBox = document.getElementById('timeBox');
  const iconBox = document.getElementById('iconBox');
  if(t==='meal'){
    timeBox.style.display='block';
    iconBox.style.display='block';
    document.getElementById('newItemIcon').value='🍽️';
  } else if(t==='exercise'){
    timeBox.style.display='block';
    iconBox.style.display='block';
    document.getElementById('newItemIcon').value='🏃';
  } else {
    timeBox.style.display='none';
    iconBox.style.display='none';
  }
}

function addChecklistItem(){
  const type = document.getElementById('newItemType').value;
  const label = document.getElementById('newItemLabel').value.trim();
  const errEl = document.getElementById('itemErr');
  if(!label){errEl.textContent='Nhập tên mục';return;}

  const newItem = {
    id: 'custom_'+uid(),
    type: type,
    label: label,
    icon: type==='meal'?'🍽️':type==='exercise'?'🏃':'💧'
  };

  if(type==='meal'||type==='exercise'){
    newItem.time = document.getElementById('newItemTime').value || '12:00';
    const customIcon = document.getElementById('newItemIcon').value.trim();
    if(customIcon) newItem.icon = customIcon;
    if(type==='meal') newItem.planned = [];
    if(type==='exercise'){ newItem.defaultType = 'Đi bộ'; newItem.defaultMin = 20; }
  }

  window._editItems.push(newItem);
  renderChecklistEditor();
}

function saveChecklistTemplate(){
  const dayType = window._editDayType;
  const items = window._editItems;
  if(!data.checklistTemplate) data.checklistTemplate = {};
  data.checklistTemplate[dayType] = JSON.parse(JSON.stringify(items));
  save(); closeModal(); render();
  toast('✅ Đã lưu checklist');
}

function resetChecklistTemplate(){
  if(!confirm('Khôi phục checklist mặc định? Template riêng của bạn sẽ bị xóa.'))return;
  const dayType = window._editDayType;
  if(data.checklistTemplate && data.checklistTemplate[dayType]){
    delete data.checklistTemplate[dayType];
    if(Object.keys(data.checklistTemplate).length===0) data.checklistTemplate = null;
    save();
  }
  const current = PLAN[dayType] || PLAN.weekday;
  window._editItems = JSON.parse(JSON.stringify(current));
  renderChecklistEditor();
  toast('↩️ Đã khôi phục mặc định');
}

// ========== EXPORT ==========
function exportJSON(){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='suc-khoe-'+today()+'.json';a.click();
  URL.revokeObjectURL(url);toast('Đã xuất JSON');
}
function exportReport(){
  const s=data.settings;
  const ws=[...data.weights].sort((a,b)=>a.date.localeCompare(b.date));
  const curW=ws.length?ws[ws.length-1].weight:(s.startWeight||0);
  const startW=s.startWeight||curW;
  const bmi=calcBMI(curW);
  const lost=startW-curW;
  let txt='=== BÁO CÁO SỨC KHỎE ===\n';
  txt+='Ngày xuất: '+new Date().toLocaleString('vi-VN')+'\n';
  txt+='Người dùng: '+(window.__myProfile&&window.__myProfile.display_name||'--')+'\n\n';
  txt+='--- THÔNG TIN ---\n';
  txt+='Chiều cao: '+s.height+'cm | Tuổi: '+(new Date().getFullYear()-s.birthYear)+' | '+(s.gender==='male'?'Nam':'Nữ')+'\n';
  txt+='Cân nặng: '+startW+'kg → '+curW+'kg | Mục tiêu '+s.targetWeight+'kg\n';
  txt+='Đã giảm: '+lost.toFixed(1)+'kg | BMI: '+bmi+'\n\n';
  txt+='--- CHỈ SỐ NĂNG LƯỢNG ---\n';
  txt+='BMR: '+getBMR()+' kcal | TDEE: '+getTDEE()+' kcal\nTarget: '+getTargetCalories()+' kcal | Thâm hụt: '+getTargetDeficit()+' kcal/ngày\n\n';
  txt+='--- 7 NGÀY GẦN NHẤT ---\n';
  for(let i=6;i>=0;i--){
    const dd=new Date();dd.setDate(dd.getDate()-i);const ds=today(dd);
    const day=data.days[ds];if(!day)continue;
    const sum=buildDaySummary(ds);
    const dLabel=dd.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'numeric'});
    txt+='\n['+dLabel+']\n';
    txt+='- Nạp: '+sum.totalIntake+' | Đốt: '+sum.totalBurned+'\n';
    if(day.bps&&day.bps.length){day.bps.forEach(bp=>{txt+='- HA: '+bp.sys+'/'+bp.dia+(bp.pulse?' | Nhịp: '+bp.pulse:'')+(bp.place?' | '+bp.place:'')+'\n';});}
    if(day.glucose&&day.glucose.length){day.glucose.forEach(g=>{const r=glucoseRate(g.value,g.moment,data.glucoseUnit);txt+='- ĐH: '+g.value+' '+data.glucoseUnit+' ('+g.moment+') — '+r[0]+(g.place?' | '+g.place:'')+'\n';});}
    if(day.symptoms&&day.symptoms.length)txt+='- Triệu chứng: '+day.symptoms.join(', ')+'\n';
    if(day.moods&&day.moods.length)txt+='- Cảm xúc: '+day.moods.join(', ')+'\n';
    Object.keys(day.meals||{}).forEach(slot=>{if(day.meals[slot].length){txt+='  • '+slot+': '+day.meals[slot].map(f=>f.name+'('+f.cal+')').join(', ')+'\n';}});
    if(day.exercises.length)day.exercises.forEach(e=>{txt+='  • Tập: '+e.type+' '+e.duration+'p ('+e.cal+' kcal)\n';});
  }
  txt+='\n--- CÂN NẶNG ---\n';
  ws.slice(-8).forEach(w=>{txt+=w.date+': '+w.weight+'kg'+(w.bodyFatPct?' | Mỡ '+w.bodyFatPct+'%':'')+(w.place?' | '+w.place:'')+'\n';});
  if(data.labTests.length){txt+='\n--- XÉT NGHIỆM ---\n';data.labTests.slice().sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>{const ref=LAB_TESTS_REF.find(r=>r.name===t.name);const r=labRate(t.value,ref);txt+=t.date+' | '+t.name+': '+t.value+' '+t.unit+' — '+r[0]+(t.place?' | '+t.place:'')+'\n';});}
  const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='bao-cao-'+today()+'.txt';a.click();
  URL.revokeObjectURL(url);toast('Đã xuất báo cáo');
}

// ========== INIT ==========
document.querySelectorAll('.nav button').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentTab=btn.dataset.tab;
    render();
  };
});

window.initApp = async function(cloudData){
  if(cloudData && typeof cloudData === 'object'){
    data = cloudData;
  } else {
    data = defaultData();
    if(window.__myProfile){
      const p=window.__myProfile;
      data.settings.gender=p.gender||'female';
      data.settings.birthYear=p.birth_year||2000;
      data.settings.height=p.height||157;
      data.settings.startWeight=p.start_weight||85;
      data.settings.targetWeight=p.target_weight||75;
      data.settings.activityLevel=p.activity_level||1.3;
      data.settings.targetLossPerWeek=p.target_loss_per_week||0.5;
      if(p.features)data.settings.features=p.features;
    }
  }
  if(!data.settings)data.settings=defaultData().settings;
  if(!data.settings.features)data.settings.features={bp:true,cycle:true,symptoms:true,moods:true,cravings:true,meds:true,cheat:true,sleep:true,steps:true,weight:true,glucose:true,labs:true};
  if(data.settings.features.glucose===undefined)data.settings.features.glucose=true;
  if(data.settings.features.labs===undefined)data.settings.features.labs=true;
  if(!data.weights)data.weights=[];
  if(!data.periods)data.periods=[];
  if(!data.medications)data.medications=[];
  if(!data.medLog)data.medLog={};
  if(!data.customFoods)data.customFoods=[];
  if(!data.customExercises)data.customExercises=[];
  if(!data.favoriteFoods)data.favoriteFoods=[];
  if(!data.cheatWeeks)data.cheatWeeks={};
  if(!data.bmrHistory)data.bmrHistory=[];
  if(!data.labTests)data.labTests=[];
  if(!data.glucoseUnit)data.glucoseUnit='mmol/L';
  if(!data.days)data.days={};
  if(data.checklistTemplate===undefined) data.checklistTemplate = null;
  if(data.weights && data.weights.length && (!data.bmrHistory || data.bmrHistory.length < data.weights.length)){
    if(typeof rebuildBMRHistory === 'function') rebuildBMRHistory();
  }
  render();
  save();
};

window.forceSaveNow = async function(){
  try {
    if(typeof cloudSaveData === 'function'){
      await cloudSaveData(data);
    }
  } catch(e){ console.error('forceSave error:', e); }
};