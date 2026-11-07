// ---- Year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Supabase ----
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const SUPABASE_URL = 'https://yrtkxvbaiqmkxhgaiapy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydGt4dmJhaXFta3hoZ2FpYXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzgwNzgsImV4cCI6MjA5NTkxNDA3OH0.BQf07XS9ao_owbr0DOxZF2HBQLFnSlZe2os0_1jDXJo';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

// ---- Services + Steps (rendered from data) ----
const ICONS = {
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
  boxes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  pkg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
};

const services = [
  { icon: 'plane', title: 'International Air Freight', desc: 'Door-to-door express shipping to 220+ countries with priority customs handling.' },
  { icon: 'truck', title: 'Same-Day Domestic', desc: 'Local courier pickups within 60 minutes and same-day delivery in major cities.' },
  { icon: 'boxes', title: 'E-commerce Fulfillment', desc: 'Warehousing, pick-and-pack and last-mile delivery integrated with your store.' },
  { icon: 'shield', title: 'Insured & Secure', desc: 'Every shipment is insured up to $5,000 with chain-of-custody scanning.' },
  { icon: 'globe', title: 'Cross-Border Trade', desc: 'Duties, taxes and documentation handled by our licensed customs brokers.' },
  { icon: 'zap', title: 'Real-Time Tracking', desc: 'Live GPS updates, push notifications and an honest estimated delivery time.' }
];
document.getElementById('serviceGrid').innerHTML = services.map(s => `
  <div class="service-card">
    <div class="service-icon">${ICONS[s.icon]}</div>
    <h3>${s.title}</h3>
    <p>${s.desc}</p>
  </div>`).join('');

const steps = [
  { n: '01', title: 'Book a pickup', desc: 'Schedule online in under a minute. We come to you.' },
  { n: '02', title: 'We collect & ship', desc: 'Your parcel enters our scanned, insured network.' },
  { n: '03', title: 'Track in real time', desc: 'Watch every leg of the journey from your dashboard.' },
  { n: '04', title: 'Delivered with proof', desc: 'Signature and photo confirmation at the doorstep.' }
];
document.getElementById('stepsGrid').innerHTML = steps.map(s => `
  <div class="step-card">
    <div class="step-n">${s.n}</div>
    <h3>${s.title}</h3>
    <p>${s.desc}</p>
  </div>`).join('');

// ---- Tracking lookup (Supabase) ----
async function lookupPackage(id){
  const key = id.toUpperCase();
  const { data: pkg, error } = await supabase
    .from('packages').select('*').eq('tracking_id', key).maybeSingle();
  if (error) throw error;
  if (!pkg) return null;
  const { data: events, error: evErr } = await supabase
    .from('tracking_events').select('*').eq('package_id', pkg.id)
    .order('position', { ascending: true });
  if (evErr) throw evErr;
  return {
    trackingId: pkg.tracking_id,
    service: pkg.service,
    origin: pkg.origin,
    destination: pkg.destination,
    estimatedDelivery: pkg.estimated_delivery,
    weight: pkg.weight,
    currentStatus: pkg.current_status,
    progress: pkg.progress,
    events: (events || []).map(e => ({
      status: e.status, location: e.location, time: e.event_time,
      done: e.done, icon: e.icon,
    })),
  };
}

function renderResult(d){
  return `
  <div class="result">
    <div class="result-head">
      <div>
        <p class="label">Tracking ID</p>
        <p class="id">${d.trackingId}</p>
        <p class="svc">${d.service}</p>
      </div>
      <div class="status-pill"><span class="pulse"></span>${d.currentStatus}</div>
    </div>
    <div class="detail-grid">
      ${[['From',d.origin],['To',d.destination],['Weight',d.weight],['ETA',d.estimatedDelivery]]
        .map(([l,v])=>`<div class="detail"><p class="l">${l}</p><p class="v">${v}</p></div>`).join('')}
    </div>
    <div class="progress-wrap">
      <div class="progress-meta"><span>Shipment progress</span><span>${d.progress}%</span></div>
      <div class="progress-bar"><div class="progress-fill" data-w="${d.progress}"></div></div>
    </div>
    <h3 class="timeline-title">Shipment timeline</h3>
    <ol class="timeline">
      ${d.events.map(e=>`
        <li>
          <span class="dot ${e.done?'done':''}">${ICONS[e.icon]}</span>
          <div class="tl-row">
            <div>
              <p class="tl-status ${e.done?'':'muted'}">${e.status}</p>
              <p class="tl-loc">${ICONS.pin}${e.location}</p>
            </div>
            <p class="tl-time">${ICONS.clock}${e.time}</p>
          </div>
        </li>`).join('')}
    </ol>
  </div>`;
}

const form = document.getElementById('track');
const input = document.getElementById('trackingInput');
const btn = document.getElementById('trackBtn');
const errEl = document.getElementById('errorMsg');
const mount = document.getElementById('resultMount');

form.addEventListener('submit', async e => {
  e.preventDefault();
  errEl.hidden = true;
  const val = input.value.trim();
  if (val.length < 6){
    errEl.textContent = 'Please enter a valid tracking number (at least 6 characters).';
    errEl.hidden = false;
    mount.innerHTML = '';
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span><span class="btn-label">Tracking...</span>';
  mount.innerHTML = '';
  try {
    const data = await lookupPackage(val);
    if (!data) {
      errEl.textContent = `No package found with tracking ID "${val.toUpperCase()}".`;
      errEl.hidden = false;
    } else {
      mount.innerHTML = renderResult(data);
      requestAnimationFrame(() => {
        const fill = mount.querySelector('.progress-fill');
        if (fill) fill.style.width = fill.dataset.w + '%';
      });
    }
  } catch (err) {
    console.error(err);
    errEl.textContent = err.message || 'Lookup failed. Please try again.';
    errEl.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-label">Track package</span>';
  }
});
