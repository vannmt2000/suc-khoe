// ========== UI CONTROL ==========
function showLoading() {
  document.getElementById('loadingScreen').classList.remove('hidden');
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('onboardingScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.add('hidden');
}
function showLogin() {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('onboardingScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.add('hidden');
  const u=document.getElementById('loginUser');
  const p=document.getElementById('loginPass');
  const e=document.getElementById('loginErr');
  if(u)u.value='';
  if(p)p.value='';
  if(e)e.textContent='';
  const btn=document.getElementById('loginBtn');
  if(btn){btn.disabled=false;btn.textContent='Đăng nhập';}
}
function showMainApp() {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('onboardingScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
}
function toggleOnboardingScreen() {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('onboardingScreen').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');
}

// ========== LOGIN ==========
async function handleLogin(event) {
  event.preventDefault();
  const emailInput=document.getElementById('loginUser').value.trim().toLowerCase();
  const passInput=document.getElementById('loginPass').value;
  const errEl=document.getElementById('loginErr');
  const btn=document.getElementById('loginBtn');

  if(!emailInput||!passInput){errEl.textContent='Vui lòng nhập đủ email và mật khẩu';return false;}
  if(!emailInput.includes('@')||!emailInput.includes('.')){errEl.textContent='Vui lòng nhập email đầy đủ (VD: ten@gmail.com)';return false;}

  errEl.textContent='';
  btn.disabled=true;
  btn.textContent='Đang đăng nhập...';

  try {
    const exists=await checkEmailExists(emailInput);
    if(!exists){errEl.textContent='Email chưa được cấp tài khoản. Vui lòng liên hệ admin.';btn.disabled=false;btn.textContent='Đăng nhập';return false;}
    await authLogin(emailInput,passInput);
    await startApp();
  } catch(err) {
    console.error('Login error:',err);
    let msg='Đăng nhập thất bại';
    if(err.message&&(err.message.includes('Invalid login')||err.message.includes('invalid_credentials')))msg='Sai mật khẩu. Nếu quên, vui lòng liên hệ admin để reset.';
    else if(err.message&&err.message.includes('Email not confirmed'))msg='Tài khoản chưa xác nhận. Liên hệ admin.';
    else if(err.message)msg=err.message;
    errEl.textContent=msg;
    btn.disabled=false;
    btn.textContent='Đăng nhập';
  }
  return false;
}

// ========== LOGOUT ==========
async function handleLogout() {
  if(!confirm('Đăng xuất khỏi tài khoản?'))return;
  try {
    if(typeof forceSaveNow==='function')await forceSaveNow();
    await authLogout();
    showLogin();
  } catch(err){console.error('Logout error:',err);showLogin();}
}

// ========== START APP — FIX THỨ TỰ ==========
async function startApp() {
  try {
    const profile=await getMyProfile();
    window.__myProfile=profile;
    const user=await authGetUser();
    window.__myUser=user;

    // BƯỚC 1: Nếu chưa đổi pass → hiện popup đổi pass TRƯỚC
    if(profile && profile.must_change_password){
      // Vẫn load data nền để không mất context
      const cloudData=await cloudLoadData();
      window.__loadedData=cloudData;
      showMainApp();  // Hiện app nền
      if(typeof initApp==='function') await initApp(cloudData);
      // Sau đó hiện popup đổi pass lên trên
      showChangePasswordPopup();
      return;
    }

    // BƯỚC 2: Nếu chưa onboarding → vào onboarding
    if(!profile || !profile.onboarding_done){
      startOnboarding();
      return;
    }

    // BƯỚC 3: Bình thường → vào app
    const cloudData=await cloudLoadData();
    window.__loadedData=cloudData;
    showMainApp();
    if(typeof initApp==='function')await initApp(cloudData);

  } catch(err) {
    console.error('startApp error:',err);
    alert('Lỗi tải dữ liệu: '+err.message);
    showLogin();
  }
}

// ========== POPUP ĐỔI MẬT KHẨU ==========
function showChangePasswordPopup() {
  document.getElementById('modalRoot').innerHTML=`
    <div class="modal" style="z-index:600;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.6)">
      <div class="mc" style="border-radius:16px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;padding:24px">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:40px;margin-bottom:8px">🔐</div>
          <h3 style="margin:0;font-size:18px;color:#2d3748">Đổi mật khẩu lần đầu</h3>
        </div>
        <div style="font-size:13px;color:#4a5568;line-height:1.6;text-align:center;margin-bottom:20px;padding:12px;background:#fefcbf;border-radius:10px">
          Mật khẩu bạn vừa dùng do admin cấp tạm. Để bảo mật, vui lòng đổi sang mật khẩu riêng của bạn.
        </div>
        <label style="display:block;font-size:12px;font-weight:600;color:#4a5568;margin-bottom:6px">Mật khẩu mới</label>
        <input type="password" id="newPass1" placeholder="Ít nhất 8 ký tự, có chữ và số" autocomplete="new-password" style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;background:#f7fafc;margin-bottom:14px;box-sizing:border-box;font-family:inherit">
        <label style="display:block;font-size:12px;font-weight:600;color:#4a5568;margin-bottom:6px">Nhập lại mật khẩu mới</label>
        <input type="password" id="newPass2" placeholder="Nhập lại mật khẩu" autocomplete="new-password" style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;background:#f7fafc;margin-bottom:14px;box-sizing:border-box;font-family:inherit">
        <div id="cpErr" style="color:#e53e3e;font-size:12px;margin-bottom:12px;min-height:16px;text-align:center"></div>
        <button style="width:100%;padding:14px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff" id="cpBtn" onclick="doChangePassword()">Đổi mật khẩu</button>
        <div style="font-size:11px;color:#a0aec0;text-align:center;margin-top:12px">Không thể bỏ qua bước này</div>
      </div>
    </div>
  `;
  const lb=document.getElementById('logoutBtn');
  if(lb)lb.style.display='none';
}
async function doChangePassword() {
  const p1=document.getElementById('newPass1').value;
  const p2=document.getElementById('newPass2').value;
  const errEl=document.getElementById('cpErr');
  const btn=document.getElementById('cpBtn');

  if(!p1||!p2){errEl.textContent='Nhập đủ 2 ô';return;}
  if(p1!==p2){errEl.textContent='Hai mật khẩu không khớp';return;}
  if(p1.length<8){errEl.textContent='Mật khẩu tối thiểu 8 ký tự';return;}
  if(!/[a-zA-Z]/.test(p1)||!/[0-9]/.test(p1)){errEl.textContent='Mật khẩu phải có cả chữ và số';return;}

  errEl.textContent='';
  btn.disabled=true;
  btn.textContent='Đang đổi...';

  try {
    await changeMyPassword(p1);
    document.getElementById('modalRoot').innerHTML='';
    const lb=document.getElementById('logoutBtn');
    if(lb)lb.style.display='';
    toast('✅ Đổi mật khẩu thành công');
    // Sau khi đổi pass → check lại profile → tiếp tục flow (có thể cần onboarding)
    const profile=await getMyProfile();
    window.__myProfile=profile;
    if(!profile.onboarding_done){
      startOnboarding();
    }
  } catch(err) {
    console.error('Change password error:',err);
    errEl.textContent='Lỗi: '+(err.message||'Không đổi được');
    btn.disabled=false;
    btn.textContent='Đổi mật khẩu';
  }
}

// ========== QUÊN MẬT KHẨU ==========
function showForgotPasswordPopup() {
  document.getElementById('modalRoot').innerHTML=`
    <div class="modal" onclick="if(event.target===this)closeModal()">
      <div class="mc">
        <div class="mh"><h3>🔐 Quên mật khẩu</h3><button class="close" onclick="closeModal()">×</button></div>
        <div style="font-size:14px;color:#4a5568;line-height:1.7;padding:8px 0">
          Để bảo mật, việc reset mật khẩu do <strong>admin</strong> thực hiện.<br><br>
          Vui lòng liên hệ admin qua Zalo/Facebook để được cấp lại mật khẩu tạm.<br><br>
          Sau khi đăng nhập bằng mật khẩu tạm, bạn sẽ được yêu cầu đổi sang mật khẩu riêng.
        </div>
        <button style="width:100%;margin-top:12px" onclick="closeModal()">Đã hiểu</button>
      </div>
    </div>
  `;
}

// ========== ONBOARDING ==========
let obStep=0;
let obData={gender:null,birthYear:null,height:null,weight:null,goal:null,modules:null,activityLevel:null};

function startOnboarding() {
  obStep=0;
  obData={gender:null,birthYear:null,height:null,weight:null,goal:null,modules:null,activityLevel:null};
  window.__obModules={weight:true,bp:true,glucose:true,labs:true,symptoms:true,moods:true,cravings:true,meds:true,cheat:true,sleep:true,steps:true};
  toggleOnboardingScreen();
  renderOnboardingStep();
}

function renderOnboardingStep() {
  const content=document.getElementById('obContent');
  const bar=document.getElementById('obBar');
  const totalSteps=6;
  bar.style.width=((obStep/totalSteps)*100)+'%';

  let html='';

  if(obStep===0){
    html=`
      <h2>👋 Chào mừng!</h2>
      <div class="ob-desc">Bắt đầu bằng việc cho chúng tôi biết về bạn. Thông tin này giúp app tính toán chỉ số sức khỏe phù hợp.</div>
      <label>Giới tính</label>
      <div class="ob-choices">
        <div class="ob-choice ${obData.gender==='male'?'on':''}" onclick="obSetGender('male')"><span class="ob-icon">👨</span>Nam</div>
        <div class="ob-choice ${obData.gender==='female'?'on':''}" onclick="obSetGender('female')"><span class="ob-icon">👩</span>Nữ</div>
      </div>
      <div class="ob-nav">
        <button class="ob-btn-next" onclick="obNext()" ${!obData.gender?'disabled':''}>Tiếp tục</button>
      </div>
      <div class="ob-note">Chọn giới tính giúp app tính đúng BMR và chọn ngưỡng chỉ số phù hợp. Nếu bạn chọn Nam, module Kinh nguyệt sẽ tự ẩn.</div>
    `;
  }

  if(obStep===1){
    const now=new Date().getFullYear();
    html=`
      <h2>📏 Thông tin cơ bản</h2>
      <div class="ob-desc">Ví dụ mẫu người khỏe mạnh: cao 1m70, nặng 65kg, 30 tuổi</div>
      <label>Năm sinh</label>
      <input type="number" id="obBirthYear" placeholder="VD: ${now-30}" value="${obData.birthYear||''}" inputmode="numeric">
      <label>Chiều cao (cm)</label>
      <input type="number" id="obHeight" placeholder="VD: 170" value="${obData.height||''}" inputmode="numeric">
      <label>Cân nặng hiện tại (kg)</label>
      <input type="number" step="0.1" id="obWeight" placeholder="VD: 65" value="${obData.weight||''}" inputmode="decimal">
      <div class="ob-err" id="obErr"></div>
      <div class="ob-nav">
        <button class="ob-btn-back" onclick="obBack()">◀ Quay lại</button>
        <button class="ob-btn-next" onclick="obNext()">Tiếp tục</button>
      </div>
    `;
  }

  if(obStep===2){
    html=`
      <h2>🎯 Mục tiêu của bạn</h2>
      <div class="ob-desc">App sẽ tính calo mục tiêu phù hợp với lựa chọn của bạn.</div>
      <label>Mục tiêu</label>
      <div class="ob-choices" style="grid-template-columns:1fr">
        <div class="ob-choice ${obData.goal==='lose'?'on':''}" onclick="obSetGoal('lose')"><span class="ob-icon">📉</span>Giảm cân</div>
        <div class="ob-choice ${obData.goal==='maintain'?'on':''}" onclick="obSetGoal('maintain')"><span class="ob-icon">⚖️</span>Giữ cân</div>
        <div class="ob-choice ${obData.goal==='gain'?'on':''}" onclick="obSetGoal('gain')"><span class="ob-icon">📈</span>Tăng cân</div>
        <div class="ob-choice ${obData.goal==='monitor'?'on':''}" onclick="obSetGoal('monitor')"><span class="ob-icon">🩺</span>Theo dõi bệnh lý</div>
      </div>
      <div class="ob-nav">
        <button class="ob-btn-back" onclick="obBack()">◀ Quay lại</button>
        <button class="ob-btn-next" onclick="obNext()" ${!obData.goal?'disabled':''}>Tiếp tục</button>
      </div>
    `;
  }

  if(obStep===3){
    const hasCycle = obData.gender==='female';
    html=`
      <h2>📊 Chọn mục muốn theo dõi</h2>
      <div class="ob-desc">Tick các mục bạn muốn sử dụng. Có thể bật/tắt sau trong Cài đặt.</div>
      <div class="ob-check-list">
        <div class="ob-check-item ${window.__obModules.weight?'on':''}" onclick="obToggleModule('weight',this)"><div class="ob-check-icon">✓</div>⚖️ Cân nặng & thành phần cơ thể</div>
        <div class="ob-check-item ${window.__obModules.bp?'on':''}" onclick="obToggleModule('bp',this)"><div class="ob-check-icon">✓</div>🩸 Huyết áp</div>
        <div class="ob-check-item ${window.__obModules.glucose?'on':''}" onclick="obToggleModule('glucose',this)"><div class="ob-check-icon">✓</div>🩸 Đường huyết</div>
        <div class="ob-check-item ${window.__obModules.labs?'on':''}" onclick="obToggleModule('labs',this)"><div class="ob-check-icon">✓</div>🧪 Xét nghiệm</div>
        ${hasCycle?'<div class="ob-check-item '+(window.__obModules.cycle?'on':'')+'" onclick="obToggleModule(\'cycle\',this)"><div class="ob-check-icon">✓</div>🩸 Kinh nguyệt</div>':''}
        <div class="ob-check-item ${window.__obModules.symptoms?'on':''}" onclick="obToggleModule('symptoms',this)"><div class="ob-check-icon">✓</div>🤒 Triệu chứng thể chất</div>
        <div class="ob-check-item ${window.__obModules.moods?'on':''}" onclick="obToggleModule('moods',this)"><div class="ob-check-icon">✓</div>💭 Cảm xúc</div>
        <div class="ob-check-item ${window.__obModules.cravings?'on':''}" onclick="obToggleModule('cravings',this)"><div class="ob-check-icon">✓</div>🍫 Thèm ăn</div>
        <div class="ob-check-item ${window.__obModules.meds?'on':''}" onclick="obToggleModule('meds',this)"><div class="ob-check-icon">✓</div>💊 Thuốc</div>
        <div class="ob-check-item ${window.__obModules.cheat?'on':''}" onclick="obToggleModule('cheat',this)"><div class="ob-check-icon">✓</div>🎁 Cheat meal</div>
        <div class="ob-check-item ${window.__obModules.sleep?'on':''}" onclick="obToggleModule('sleep',this)"><div class="ob-check-icon">✓</div>😴 Giấc ngủ</div>
        <div class="ob-check-item ${window.__obModules.steps?'on':''}" onclick="obToggleModule('steps',this)"><div class="ob-check-icon">✓</div>👟 Bước chân</div>
      </div>
      <div class="ob-nav">
        <button class="ob-btn-back" onclick="obBack()">◀ Quay lại</button>
        <button class="ob-btn-next" onclick="obNext()">Tiếp tục</button>
      </div>
    `;
  }

  if(obStep===4){
    html=`
      <h2>🏃 Mức vận động</h2>
      <div class="ob-desc">Mức vận động giúp app tính TDEE (calo đốt mỗi ngày).</div>
      <div class="ob-choices" style="grid-template-columns:1fr">
        <div class="ob-choice ${obData.activityLevel===1.2?'on':''}" onclick="obSetActivity(1.2)">🪑 Ngồi nhiều, không tập</div>
        <div class="ob-choice ${obData.activityLevel===1.3?'on':''}" onclick="obSetActivity(1.3)">💼 WFH + đi lại nhẹ</div>
        <div class="ob-choice ${obData.activityLevel===1.375?'on':''}" onclick="obSetActivity(1.375)">🚶 Tập nhẹ 1-3 ngày/tuần</div>
        <div class="ob-choice ${obData.activityLevel===1.55?'on':''}" onclick="obSetActivity(1.55)">🚴 Tập vừa 3-5 ngày/tuần</div>
        <div class="ob-choice ${obData.activityLevel===1.725?'on':''}" onclick="obSetActivity(1.725)">🏋️ Tập nặng 6-7 ngày/tuần</div>
      </div>
      <div class="ob-nav">
        <button class="ob-btn-back" onclick="obBack()">◀ Quay lại</button>
        <button class="ob-btn-next" onclick="obNext()" ${!obData.activityLevel?'disabled':''}>Tiếp tục</button>
      </div>
    `;
  }

  if(obStep===5){
    html=`
      <h2>✅ Sẵn sàng!</h2>
      <div class="ob-desc">Chúng tôi đã có đủ thông tin để bắt đầu. Bấm "Vào app" để sử dụng.</div>
      <div style="background:#f7fafc;padding:14px;border-radius:10px;font-size:13px;line-height:1.8;color:#4a5568">
        <div>👤 Giới tính: <strong>${obData.gender==='male'?'Nam':'Nữ'}</strong></div>
        <div>📅 Năm sinh: <strong>${obData.birthYear}</strong></div>
        <div>📏 Chiều cao: <strong>${obData.height} cm</strong></div>
        <div>⚖️ Cân nặng: <strong>${obData.weight} kg</strong></div>
        <div>🎯 Mục tiêu: <strong>${obData.goal==='lose'?'Giảm cân':obData.goal==='maintain'?'Giữ cân':obData.goal==='gain'?'Tăng cân':'Theo dõi bệnh lý'}</strong></div>
        <div>🏃 Vận động: <strong>${obData.activityLevel}</strong></div>
      </div>
      <div class="ob-nav">
        <button class="ob-btn-back" onclick="obBack()">◀ Quay lại</button>
        <button class="ob-btn-next" onclick="obFinish()" id="obFinishBtn">Vào app →</button>
      </div>
    `;
    bar.style.width='100%';
  }

  content.innerHTML=html;
}

function obSetGender(g){obData.gender=g;renderOnboardingStep();}
function obSetGoal(g){obData.goal=g;renderOnboardingStep();}
function obSetActivity(a){obData.activityLevel=a;renderOnboardingStep();}
function obToggleModule(key,el){
  window.__obModules[key]=!window.__obModules[key];
  if(window.__obModules[key])el.classList.add('on');
  else el.classList.remove('on');
}

function obBack(){
  if(obStep>0){obStep--;renderOnboardingStep();}
}

async function obNext(){
  const errEl=document.getElementById('obErr');
  if(errEl)errEl.textContent='';

  if(obStep===1){
    const by=+document.getElementById('obBirthYear').value;
    const h=+document.getElementById('obHeight').value;
    const w=+document.getElementById('obWeight').value;
    const now=new Date().getFullYear();
    if(!by||by<1900||by>now){if(errEl)errEl.textContent='Năm sinh không hợp lệ';return;}
    if(!h||h<100||h>220){if(errEl)errEl.textContent='Chiều cao không hợp lệ (100-220cm)';return;}
    if(!w||w<30||w>250){if(errEl)errEl.textContent='Cân nặng không hợp lệ (30-250kg)';return;}
    obData.birthYear=by;
    obData.height=h;
    obData.weight=w;
  }

  obStep++;
  renderOnboardingStep();
}

async function obFinish(){
  const btn=document.getElementById('obFinishBtn');
  btn.disabled=true;
  btn.textContent='Đang lưu...';

  try {
    const features={
      weight:!!window.__obModules.weight,bp:!!window.__obModules.bp,glucose:!!window.__obModules.glucose,
      labs:!!window.__obModules.labs,cycle:obData.gender==='female'?!!window.__obModules.cycle:false,
      symptoms:!!window.__obModules.symptoms,moods:!!window.__obModules.moods,cravings:!!window.__obModules.cravings,
      meds:!!window.__obModules.meds,cheat:!!window.__obModules.cheat,sleep:!!window.__obModules.sleep,steps:!!window.__obModules.steps
    };

    let targetLossPerWeek = 0.5;
    let targetWeight = obData.weight;
    if(obData.goal==='lose'){targetLossPerWeek = 0.5; targetWeight = obData.weight - 5;}
    else {targetLossPerWeek = 0;}

    await updateMyProfile({
      gender:obData.gender,
      birth_year:obData.birthYear,
      height:obData.height,
      start_weight:obData.weight,
      target_weight:targetWeight,
      activity_level:obData.activityLevel,
      target_loss_per_week:targetLossPerWeek,
      features:features,
      onboarding_done:true,
      must_change_password:false
    });

    const initData=defaultData();
    initData.settings.gender=obData.gender;
    initData.settings.birthYear=obData.birthYear;
    initData.settings.height=obData.height;
    initData.settings.startWeight=obData.weight;
    initData.settings.targetWeight=targetWeight;
    initData.settings.activityLevel=obData.activityLevel;
    initData.settings.targetLossPerWeek=targetLossPerWeek;
    initData.settings.startDate=today();
    initData.settings.features=features;
    initData.weights=[{date:today(),weight:obData.weight,bmr:null,bodyFatPct:0}];

    await cloudSaveData(initData);

    const profile=await getMyProfile();
    window.__myProfile=profile;

    window.__loadedData=initData;
    showMainApp();
    if(typeof initApp==='function')await initApp(initData);
    toast('✅ Đã lưu. Bắt đầu sử dụng!');
  } catch(err) {
    console.error('Onboarding finish error:',err);
    alert('Lỗi lưu thông tin: '+err.message);
    btn.disabled=false;
    btn.textContent='Vào app →';
  }
}

// ========== AUTO START ==========
window.addEventListener('DOMContentLoaded', async () => {
  showLoading();
  initSupabase();
  if(!supabaseClient){
    document.getElementById('loadingScreen').innerHTML='<div style="text-align:center;color:#e53e3e;padding:20px">Lỗi: Không load được Supabase SDK</div>';
    return;
  }
  try {
    const user=await authGetUser();
    if(user)await startApp();
    else showLogin();
  } catch(err){console.error('Init error:',err);showLogin();}
});