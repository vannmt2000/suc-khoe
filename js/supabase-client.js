// ========== SUPABASE CLIENT ==========
const SUPABASE_URL = 'https://clyjgpwsczoymvtreoby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseWpncHdzY3pveW12dHJlb2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMTI0NDEsImV4cCI6MjEwNzY4ODQ0MX0.R9gVlNHCrKxr2iXBzGXw0FptGJieenocaZTMgktA8f4';

let supabaseClient = null;

function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('Supabase SDK chưa load');
    return null;
  }
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

// ========== AUTH ==========
async function authLogin(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: cleanEmail,
    password
  });
  if (error) throw error;
  return data;
}

async function authLogout() {
  await supabaseClient.auth.signOut();
}

async function authGetUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session ? session.user : null;
}

// Check email có tồn tại trong hệ thống không
async function checkEmailExists(email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const { data, error } = await supabaseClient.rpc('check_email_exists', {
    input_email: cleanEmail
  });
  if (error) {
    console.error('check_email_exists error:', error);
    return false;
  }
  return data === true;
}

// ========== LOAD / SAVE DATA ==========
async function cloudLoadData() {
  const user = await authGetUser();
  if (!user) throw new Error('Chưa đăng nhập');

  const { data, error } = await supabaseClient
    .from('user_data')
    .select('data')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.data || Object.keys(data.data).length === 0) return null;
  return data.data;
}

async function cloudSaveData(dataObj) {
  const user = await authGetUser();
  if (!user) throw new Error('Chưa đăng nhập');

  const { error } = await supabaseClient
    .from('user_data')
    .upsert({
      user_id: user.id,
      data: dataObj,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) throw error;
}

// ========== PROFILE ==========
async function getMyProfile() {
  const user = await authGetUser();
  if (!user) return null;
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error) { console.error('getMyProfile error:', error); return null; }
  return data;
}

async function updateMyProfile(fields) {
  const user = await authGetUser();
  if (!user) throw new Error('Chưa đăng nhập');
  const { error } = await supabaseClient
    .from('profiles')
    .update(fields)
    .eq('id', user.id);
  if (error) throw error;
}

// ========== CHANGE PASSWORD ==========
async function changeMyPassword(newPassword) {
  const { data, error } = await supabaseClient.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
  // Set must_change_password = false
  await updateMyProfile({ must_change_password: false });
  return data;
}

// ========== ADMIN ==========
async function adminCreateUser(email, password, displayName, relationship) {
  const { data, error } = await supabaseClient.rpc('admin_create_user', {
    user_email: email,
    user_password: password,
    user_display_name: displayName || email,
    user_relationship: relationship || 'Bản thân'
  });
  if (error) throw error;
  return data;
}

async function adminResetPassword(email, newPassword) {
  const { data, error } = await supabaseClient.rpc('admin_reset_password', {
    target_email: email,
    new_password: newPassword
  });
  if (error) throw error;
  return data;
}

async function adminListUsers() {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ========== SYNC QUEUE ==========
let saveQueueTimer = null;
let saveQueueData = null;
let saveQueueCallback = null;

function queueSave(dataObj, callback) {
  saveQueueData = dataObj;
  saveQueueCallback = callback;
  if (saveQueueTimer) clearTimeout(saveQueueTimer);
  saveQueueTimer = setTimeout(async () => {
    try {
      await cloudSaveData(saveQueueData);
      if (saveQueueCallback) saveQueueCallback(null);
    } catch (err) {
      console.error('Save error:', err);
      if (saveQueueCallback) saveQueueCallback(err);
    }
    saveQueueTimer = null;
  }, 1500);
}