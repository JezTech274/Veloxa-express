// Veloxa Admin — Supabase-backed package CRUD
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://yrtkxvbaiqmkxhgaiapy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydGt4dmJhaXFta3hoZ2FpYXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzgwNzgsImV4cCI6MjA5NTkxNDA3OH0.BQf07XS9ao_owbr0DOxZF2HBQLFnSlZe2os0_1jDXJo';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { storage: localStorage, persistSession: true, autoRefreshToken: true },
});

const ICON_OPTIONS = ['pkg','truck','plane','check','pin','clock','boxes','shield','globe','zap'];
const STATUS_OPTIONS = [
  'Order placed','Picked up by courier','Departed origin facility','In Transit',
  'Customs clearance','Arrived at destination country','Out for delivery',
  'Delivered','Delivery attempted','On hold','Returned to sender','Cancelled',
];

const $ = sel => document.querySelector(sel);
const listEl = $('#pkgList');
const emptyEl = $('#emptyList');
const form = $('#pkgForm');
const formTitle = $('#formTitle');
const deleteBtn = $('#deleteBtn');
const newBtn = $('#newBtn');
const searchInput = $('#searchInput');
const eventsList = $('#eventsList');
const addEventBtn = $('#addEventBtn');
const formMsg = $('#formMsg');

$('#currentStatusSelect').innerHTML = STATUS_OPTIONS.map(s => `<option value="${s}">${s}</option>`).join('');

let packages = {};         // { trackingId: { ...row, events: [...] } }
let currentTrackingId = null;
let currentPkgId = null;   // db uuid
let originalTrackingId = null;

const escapeAttr = s => String(s ?? '').replace(/"/g,'&quot;');

// ---------- Data load ----------
async function loadAll(){
  const { data: pkgs, error } = await supabase
    .from('packages').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); showMsg(error.message, true); return; }
  const { data: events, error: evErr } = await supabase
    .from('tracking_events').select('*').order('position', { ascending: true });
  if (evErr) { console.error(evErr); showMsg(evErr.message, true); return; }
  packages = {};
  for (const p of pkgs) {
    packages[p.tracking_id] = { ...p, events: [] };
  }
  for (const ev of events) {
    const owner = pkgs.find(p => p.id === ev.package_id);
    if (owner) packages[owner.tracking_id].events.push(ev);
  }
  renderList(searchInput.value);
}

// ---------- List ----------
function renderList(filter=''){
  const ids = Object.keys(packages).filter(id => id.toLowerCase().includes((filter||'').toLowerCase()));
  emptyEl.hidden = ids.length > 0;
  listEl.innerHTML = ids.map(id => {
    const p = packages[id];
    return `<li data-id="${id}" class="${id===currentTrackingId?'active':''}">
      <div class="pid">${id}</div>
      <div class="psub">${p.current_status} • ${p.destination}</div>
    </li>`;
  }).join('');
  listEl.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => loadIntoForm(li.dataset.id));
  });
}

// ---------- Editor ----------
function blankEvent(){ return { status:'', location:'', event_time:'', done:false, icon:'pkg' }; }

function renderEvents(events){
  eventsList.innerHTML = events.map((e,i)=>`
    <div class="event-row" data-i="${i}">
      <select data-k="status">
        <option value="">— Status —</option>
        ${STATUS_OPTIONS.map(s=>`<option value="${escapeAttr(s)}" ${s===e.status?'selected':''}>${s}</option>`).join('')}
      </select>
      <input data-k="location" placeholder="Location" value="${escapeAttr(e.location)}" />
      <input data-k="event_time" placeholder="Time" value="${escapeAttr(e.event_time)}" />
      <select data-k="icon">
        ${ICON_OPTIONS.map(ic=>`<option value="${ic}" ${ic===e.icon?'selected':''}>${ic}</option>`).join('')}
      </select>
      <label class="done-toggle"><input type="checkbox" data-k="done" ${e.done?'checked':''}/> Done</label>
      <button type="button" class="rm" title="Remove">×</button>
    </div>`).join('');
  eventsList.querySelectorAll('.rm').forEach(btn=>{
    btn.addEventListener('click', () => btn.closest('.event-row').remove());
  });
}

function readEvents(){
  return [...eventsList.querySelectorAll('.event-row')].map(row => {
    const ev = {};
    row.querySelectorAll('[data-k]').forEach(inp => {
      const k = inp.dataset.k;
      ev[k] = inp.type === 'checkbox' ? inp.checked : (inp.value || '').trim();
    });
    if (!ev.icon) ev.icon = 'pkg';
    return ev;
  }).filter(ev => ev.status || ev.location);
}

function loadIntoForm(id){
  const p = packages[id]; if (!p) return;
  currentTrackingId = id; originalTrackingId = id; currentPkgId = p.id;
  formTitle.textContent = 'Edit package';
  deleteBtn.hidden = false;
  form.trackingId.value = p.tracking_id;
  form.service.value = p.service;
  form.origin.value = p.origin;
  form.destination.value = p.destination;
  form.weight.value = p.weight;
  form.estimatedDelivery.value = p.estimated_delivery;
  const sel = $('#currentStatusSelect');
  if (p.current_status && ![...sel.options].some(o => o.value === p.current_status)) {
    const opt = document.createElement('option'); opt.value = p.current_status; opt.textContent = p.current_status; sel.appendChild(opt);
  }
  form.currentStatus.value = p.current_status;
  form.progress.value = p.progress;
  renderEvents(p.events && p.events.length ? p.events : [blankEvent()]);
  hideMsg();
  renderList(searchInput.value);
}

function resetForm(){
  currentTrackingId = null; originalTrackingId = null; currentPkgId = null;
  form.reset();
  form.progress.value = 50;
  formTitle.textContent = 'New package';
  deleteBtn.hidden = true;
  renderEvents([blankEvent()]);
  hideMsg();
  renderList(searchInput.value);
}

function showMsg(text, isError=false){
  formMsg.textContent = text;
  formMsg.classList.toggle('error', isError);
  formMsg.hidden = false;
  if (!isError) setTimeout(()=>{ formMsg.hidden = true; }, 2500);
}
function hideMsg(){ formMsg.hidden = true; }

// ---------- Save ----------
form.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(form);
  const trackingId = fd.get('trackingId').toString().trim().toUpperCase();
  if (!trackingId) return showMsg('Tracking ID is required.', true);

  const row = {
    tracking_id: trackingId,
    service: fd.get('service').toString().trim(),
    origin: fd.get('origin').toString().trim(),
    destination: fd.get('destination').toString().trim(),
    weight: fd.get('weight').toString().trim(),
    estimated_delivery: fd.get('estimatedDelivery').toString().trim(),
    current_status: fd.get('currentStatus').toString().trim(),
    progress: Math.max(0, Math.min(100, Number(fd.get('progress')) || 0)),
  };

  try {
    let pkgId = currentPkgId;
    if (pkgId) {
      const { error } = await supabase.from('packages').update(row).eq('id', pkgId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('packages').insert(row).select('id').single();
      if (error) throw error;
      pkgId = data.id;
    }

    // Replace events: delete existing then insert fresh
    const events = readEvents();
    const { error: delErr } = await supabase.from('tracking_events').delete().eq('package_id', pkgId);
    if (delErr) throw delErr;
    if (events.length) {
      const rows = events.map((e, i) => ({
        package_id: pkgId, position: i,
        status: e.status || '', location: e.location || '',
        event_time: e.event_time || '', icon: e.icon || 'pkg', done: !!e.done,
      }));
      const { error: insErr } = await supabase.from('tracking_events').insert(rows);
      if (insErr) throw insErr;
    }

    showMsg(`Saved "${trackingId}".`);
    await loadAll();
    loadIntoForm(trackingId);
  } catch (err) {
    console.error(err); showMsg(err.message || 'Save failed', true);
  }
});

deleteBtn.addEventListener('click', async () => {
  if (!currentPkgId) return;
  if (!confirm(`Delete package "${currentTrackingId}"?`)) return;
  const { error } = await supabase.from('packages').delete().eq('id', currentPkgId);
  if (error) return showMsg(error.message, true);
  await loadAll(); resetForm();
});

newBtn.addEventListener('click', resetForm);
addEventBtn.addEventListener('click', () => {
  const current = readEvents();
  current.push(blankEvent());
  renderEvents(current);
});
searchInput.addEventListener('input', () => renderList(searchInput.value));

// ---------- Init ----------
(async () => {
  await loadAll();
  resetForm();
})();
