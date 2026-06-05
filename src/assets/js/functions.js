// ── ROLES ─────────────────────────────────────────────────────────────────────
const ROLE_USERS = { cfg: [{ user: 'config', pass: 'cfg123', name: 'Configurador' }], admin: [{ user: 'admin', pass: 'admin123', name: 'Administrador' }] };
let IS_CFG = false, IS_ADMIN = false, pendingRole = null;

function openRoleModal(role) {
    pendingRole = role;
    document.getElementById('R_USER').value = '';
    document.getElementById('R_PASS').value = '';
    document.getElementById('R_ERR').style.display = 'none';
    document.getElementById('ROLE_MODAL_TITLE').innerHTML = role === 'admin' ? '<span class="material-symbols-outlined text-amber-500">lock</span> Acceso administrador' : '<span class="material-symbols-outlined text-[#4c86ff]">construction</span> Acceso configurador';
    document.getElementById('MODAL_ROLE').style.display = 'flex';
    setTimeout(() => document.getElementById('R_USER').focus(), 100);
}
function closeRoleModal() { document.getElementById('MODAL_ROLE').style.display = 'none'; pendingRole = null; }
function doRoleLogin() {
    const u = document.getElementById('R_USER').value.trim();
    const p = document.getElementById('R_PASS').value;
    const found = (ROLE_USERS[pendingRole] || []).find(x => x.user === u && x.pass === p);
    if (!found) { document.getElementById('R_ERR').style.display = 'block'; document.getElementById('R_PASS').value = ''; return; }
    const role = pendingRole;
    closeRoleModal();
    if (role === 'cfg') {
        IS_CFG = true;
        document.getElementById('CFG_PLANT_PANEL').style.display = 'block';
        document.getElementById('CFG_PANEL').style.display = 'none';
        document.getElementById('BTN_CFG_WRAP').style.display = 'none';
        document.getElementById('BTN_CFG_LOGOUT').style.display = 'block';
        document.getElementById('ROLE_BADGE').innerHTML = '<span class="material-symbols-outlined text-[#4c86ff] text-sm">construction</span><span class="text-[#4c86ff]">' + found.name + '</span>';
        document.getElementById('PC_COMPANY').value = PLANT.company || '';
        document.getElementById('PC_FAENA').value = PLANT.faena || '';
        document.getElementById('PC_PROCESS').value = PLANT.process || '';
        rendMotorList(); rendTechList();
    } else {
        IS_ADMIN = true;
        document.getElementById('CFG_PANEL').style.display = 'block';
        document.getElementById('CFG_PLANT_PANEL').style.display = 'none';
        document.getElementById('BTN_ADMIN_WRAP').style.display = 'none';
        document.getElementById('BTN_ADMIN_LOGOUT').style.display = 'block';
        document.getElementById('ROLE_BADGE').innerHTML = '<span class="material-symbols-outlined text-emerald-600 text-sm">shield</span><span class="text-emerald-600">' + found.name + '</span>';
    }
}
function doLogout(role) {
    if (role === 'cfg') { IS_CFG = false; document.getElementById('CFG_PLANT_PANEL').style.display = 'none'; document.getElementById('BTN_CFG_WRAP').style.display = 'block'; document.getElementById('BTN_CFG_LOGOUT').style.display = 'none'; }
    else { IS_ADMIN = false; document.getElementById('CFG_PANEL').style.display = 'none'; document.getElementById('BTN_ADMIN_WRAP').style.display = 'block'; document.getElementById('BTN_ADMIN_LOGOUT').style.display = 'none'; }
    if (!IS_CFG && !IS_ADMIN) document.getElementById('ROLE_BADGE').innerHTML = '<span class="material-symbols-outlined text-sm">account_circle</span><span>Operador</span>';
    else if (IS_CFG) document.getElementById('ROLE_BADGE').innerHTML = '<span class="material-symbols-outlined text-[#4c86ff] text-sm">construction</span><span class="text-[#4c86ff]">Configurador</span>';
}

// ── PLANTA ────────────────────────────────────────────────────────────────────
let PLANT = { company: '', faena: '', process: '' };
let TECHS_LIST = ['C. Ramírez', 'J. Flores', 'M. Soto', 'P. Lagos'];

function updTopbar() {
    const t = PLANT.company ? 'Monitor de escobillas — ' + PLANT.company : 'Monitor de escobillas';
    const s = [PLANT.faena, PLANT.process].filter(Boolean).join(' · ') || 'Motores de molinos · Minería';
    const ttl = document.getElementById('TTL');
    const sub = document.getElementById('SUB');
    if (ttl) ttl.textContent = t;
    if (sub) sub.textContent = s;
}
function savePlantInfo() {
    PLANT.company = document.getElementById('PC_COMPANY').value.trim();
    PLANT.faena = document.getElementById('PC_FAENA').value.trim();
    PLANT.process = document.getElementById('PC_PROCESS').value.trim();
    updTopbar(); rendCfgSummary(); showToast('Datos generales guardados');
}

// ── MOTORES ───────────────────────────────────────────────────────────────────
let MOTORS = [
    { id: 'SAG-01', type: 'SAG', rate: 1.8, st: 'run', phases: 3, brushPerPhase: 5, seed: [[72, 58, 44], [68, 62, 50], [75, 55, 48]] },
    { id: 'SAG-02', type: 'SAG', rate: 2.1, st: 'run', phases: 3, brushPerPhase: 5, seed: [[50, 48, 55], [44, 52, 46], [58, 40, 53]] },
    { id: 'SAG-03', type: 'SAG', rate: 1.5, st: 'run', phases: 3, brushPerPhase: 5, seed: [[38, 42, 35], [40, 36, 44], [33, 45, 38]] },
    { id: 'BOL-01', type: 'Bolas', rate: 1.2, st: 'run', phases: 3, brushPerPhase: 5, seed: [[76, 70, 68], [72, 74, 65], [78, 66, 70]] },
    { id: 'BOL-02', type: 'Bolas', rate: 2.0, st: 'run', phases: 3, brushPerPhase: 5, seed: [[25, 28, 22], [30, 20, 26], [24, 32, 18]] },
    { id: 'BOL-03', type: 'Bolas', rate: 1.6, st: 'run', phases: 3, brushPerPhase: 5, seed: [[62, 58, 55], [60, 64, 52], [65, 56, 58]] },
    { id: 'BOL-04', type: 'Bolas', rate: 0, st: 'off', phases: 3, brushPerPhase: 5, seed: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] },
    { id: 'SAG-04', type: 'SAG', rate: 1.9, st: 'run', phases: 3, brushPerPhase: 5, seed: [[33, 30, 36], [28, 35, 32], [36, 25, 34]] },
    { id: 'MAQUETA', type: 'ESP32', rate: 0, st: 'run', phases: 1, brushPerPhase: 1, seed: [[55]], isMaqueta: true },
];

function rendMotorList() {
    const list = document.getElementById('MOTOR_LIST'); list.innerHTML = '';
    MOTORS.forEach((m, idx) => {
        const row = document.createElement('div'); row.className = 'motor-row flex items-center gap-2 p-2 bg-[#f8fafc] rounded border border-gray-200 flex-wrap text-sm';
        row.innerHTML = '<input value="' + m.id + '" placeholder="ID motor" style="max-width:90px" data-field="id" data-idx="' + idx + '" class="bg-white border rounded px-2 py-1 outline-none">'
            + '<select data-field="type" data-idx="' + idx + '" class="bg-white border rounded px-2 py-1 outline-none"><option' + (m.type === 'SAG' ? ' selected' : '') + '>SAG</option><option' + (m.type === 'Bolas' ? ' selected' : '') + '>Bolas</option><option' + (m.type === 'Otro' ? ' selected' : '') + '>Otro</option></select>'
            + '<select data-field="st" data-idx="' + idx + '" class="bg-white border rounded px-2 py-1 outline-none"><option value="run"' + (m.st === 'run' ? ' selected' : '') + '>Activo</option><option value="off"' + (m.st === 'off' ? ' selected' : '') + '>Fuera servicio</option></select>'
            + '<div class="flex items-center gap-1 text-gray-900 font-semibold">Fases:<select data-field="phases" data-idx="' + idx + '" class="bg-white border rounded px-1 py-0.5" style="max-width:50px"><option' + (m.phases === 2 ? ' selected' : '') + '>2</option><option' + (m.phases === 3 ? ' selected' : '') + '>3</option></select></div>'
            + '<div class="flex items-center gap-1 text-gray-900 font-semibold">Esc/fase:<input type="number" min="1" max="10" value="' + m.brushPerPhase + '" data-field="brushPerPhase" data-idx="' + idx + '" class="bg-white border rounded px-1 py-0.5" style="max-width:50px"></div>'
            + '<div class="flex items-center gap-1 text-gray-900 font-semibold">mm/día:<input type="number" min="0" max="10" step="0.1" value="' + m.rate + '" data-field="rate" data-idx="' + idx + '" class="bg-white border rounded px-1 py-0.5" style="max-width:55px"></div>'
            + '<button class="btn danger !p-1 cursor-pointer" onclick="removeMotor(' + idx + ')" style="margin-left:auto"><span class="material-symbols-outlined text-sm font-bold">delete</span></button>';
        list.appendChild(row);
    });
}
function addMotorRow() { MOTORS.push({ id: 'NUEVO-' + (MOTORS.length + 1), type: 'SAG', rate: 1.5, st: 'run', phases: 3, brushPerPhase: 5, seed: [] }); rendMotorList(); }
function removeMotor(idx) { if (MOTORS.length <= 1) { showToast('Debe haber al menos un motor'); return; } MOTORS.splice(idx, 1); rendMotorList(); }
function saveMotors() {
    document.querySelectorAll('#MOTOR_LIST [data-field]').forEach(el => {
        const f = el.dataset.field, i = +el.dataset.idx;
        MOTORS[i][f] = (f === 'rate' || f === 'phases' || f === 'brushPerPhase') ? +el.value : el.value;
    });
    initData(); rendAll(); buildMSel(); showToast('Motores guardados');
}

function rendTechList() {
    const list = document.getElementById('TECH_LIST'); list.innerHTML = '';
    TECHS_LIST.forEach((t, idx) => {
        const row = document.createElement('div'); row.className = 'tech-row flex items-center gap-2 p-2 bg-[#f8fafc] rounded border border-gray-200 text-sm';
        row.innerHTML = '<input value="' + t + '" placeholder="Nombre técnico" data-idx="' + idx + '" class="bg-white border rounded px-2 py-1 outline-none flex-grow">'
            + '<button class="btn danger !p-1 cursor-pointer" onclick="removeTech(' + idx + ')"><span class="material-symbols-outlined text-sm font-bold">delete</span></button>';
        list.appendChild(row);
    });
}
function addTechRow() { TECHS_LIST.push(''); rendTechList(); }
function removeTech(idx) { if (TECHS_LIST.length <= 1) { showToast('Debe haber al menos un técnico'); return; } TECHS_LIST.splice(idx, 1); rendTechList(); }
function saveTechs() { TECHS_LIST = Array.from(document.querySelectorAll('#TECH_LIST input')).map(i => i.value.trim()).filter(Boolean); rendTechList(); showToast('Técnicos guardados'); }

function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ffffff;color:#0d193c;padding:12px 20px;border-radius:8px;font-size:12px;z-index:999;opacity:0;transition:opacity .3s;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(0,0,0,0.08);text-transform:uppercase;font-weight:700;letter-spacing:.5px';
    t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.style.opacity = '1', 10);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ── ALARMAS ISA-18.2 ──────────────────────────────────────────────────────────
const P1_COL = '#ff00ff', P2_COL = '#c83e3a', P3_COL = '#f2b705', P4_COL = '#4c86ff';
let ACK_SET = new Set(); // IDs de alarmas reconocidas

function alarmId(motorId, pi, bi, type) { return motorId + '-' + pi + '-' + bi + '-' + type; }

function getAlarms() {
    const alarms = [];
    MOTORS.forEach(m => {
        if (m.st === 'off' || !MD[m.id]) return;
        const ph = getPhases(m);
        MD[m.id].forEach((phase, pi) => phase.forEach((b, bi) => {
            const ws = wSt(b.mm, m.st), ts = tSt(b.temp, m.st), bs = bSt(b.batt, m.st);
            const sig = sigSt(b.lastSeen);
            const loc = m.id + ' · Fase ' + ph[pi] + ' · Esc.' + (bi + 1);
            const candidates = [];
            if (ws === 'rd') candidates.push({ pri: 2, type: 'wear', col: P2_COL, loc, msg: 'Desgaste crítico: ' + fmt1(b.mm) + ' mm', action: 'Reemplazo inmediato' });
            else if (ws === 'yw') candidates.push({ pri: 3, type: 'wear', col: P3_COL, loc, msg: 'Alerta desgaste: ' + fmt1(b.mm) + ' mm', action: 'Programar reemplazo' });
            if (ts === 'rd') candidates.push({ pri: 2, type: 'temp', col: P2_COL, loc, msg: 'Temperatura crítica: ' + b.temp + '°C', action: 'Verificar refrigeración' });
            else if (ts === 'yw') candidates.push({ pri: 3, type: 'temp', col: P3_COL, loc, msg: 'Temp. elevada: ' + b.temp + '°C', action: 'Monitorear' });
            if (bs === 'rd') candidates.push({ pri: 2, type: 'batt', col: P2_COL, loc, msg: 'Batería crítica: ' + b.batt + '%', action: 'Reemplazar sensor' });
            else if (bs === 'yw') candidates.push({ pri: 4, type: 'batt', col: P4_COL, loc, msg: 'Batería baja: ' + b.batt + '%', action: 'Programar recarga' });
            if (sig.st === 'rd') candidates.push({ pri: 2, type: 'sig', col: P2_COL, loc, msg: 'Señal perdida (' + fmtAgo(sig.hoursAgo) + ')', action: 'Verificar sensor urgente' });
            else if (sig.st === 'yw') candidates.push({ pri: 3, type: 'sig', col: P3_COL, loc, msg: 'Esperando actualización (' + fmtAgo(sig.hoursAgo) + ')', action: 'Verificar conectividad' });
            if (candidates.length > 0) {
                const worst = candidates.sort((a, b) => a.pri - b.pri)[0];
                const id = alarmId(m.id, pi, bi, worst.type);
                alarms.push({ ...worst, id, acked: ACK_SET.has(id), motorId: m.id, pi, bi });
            }
        }));
    });
    return alarms.sort((a, b) => a.pri - b.pri || a.loc.localeCompare(b.loc));
}

function ackAlarm(id) {
    ACK_SET.add(id); rendAll();
}
function ackAll() {
    getAlarms().forEach(a => ACK_SET.add(a.id)); rendAll();
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const REASONS = ['programado', 'preventivo', 'critico', 'temperatura'];
let NOM = 80, THY = 0.6, THR = 0.3, TTY = 80, TTR = 110, TB = 20, BD = 1, SIG_N = 8;
let SIM_SECS = 1200, SIM_HRS = 0.5;
let MD = {}, HIST = {}, RECS = {};
let CUR = null, CURTAB = 'est', FILTER = null;
let simOn = true, simT = null, simPT = null, simProg = 0;
let chG = null, chPh = null, chTr = null, chM = null, chH = null;
let CARDS = [];

const rnd = (a, b) => Math.round(a + Math.random() * (b - a));
const UL_PCT = 0.55, IM_PCT = 0.20;
const ulMm = () => NOM * UL_PCT;
const imMm = () => ulMm() + (NOM - ulMm()) * IM_PCT;
const wSt = (mm, st) => st === 'off' ? 'gy' : mm / NOM >= THY ? 'neu' : mm / NOM >= THR ? 'yw' : 'rd';
const tSt = (t, st) => st === 'off' ? 'gy' : t < TTY ? 'neu' : t < TTR ? 'yw' : 'rd';
const bSt = (b, st) => st === 'off' ? 'gy' : b > TB * 2 ? 'neu' : b > TB ? 'yw' : 'rd';
const stLbl = s => ({ neu: 'Normal', yw: 'Alerta', rd: 'Crítico', gy: 'Fuera de servicio' })[s] || s;
const pct = (mm, st) => st === 'off' ? 0 : Math.min(100, Math.round(mm / NOM * 100));
const fmt1 = v => Number(v).toFixed(1);
const wDays = (mm, rate) => { const r = mm - imMm(); return r <= 0 ? 0 : Math.round(r / (rate * SIM_HRS / 24)); };
const bDays = b => { const r = b - TB; return r <= 0 ? 0 : Math.round(r / BD); };
const combined = (mm, rate, b) => {
    const wd = wDays(mm, rate), bd = bDays(b), days = Math.min(wd, bd);
    const both = Math.abs(wd - bd) <= 7;
    return { days, wd, bd, cause: both ? 'desgaste y batería' : wd <= bd ? 'desgaste' : 'batería' };
};
const urgCls = d => d <= 7 ? 'rd' : d <= 30 ? 'yw' : 'neu';
const urgLbl = d => d <= 7 ? 'Crítico' : d <= 30 ? 'Alerta' : 'Normal';
const fmtDate = d => d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
const getPhases = m => Array.from({ length: m.phases || 3 }, (_, i) => ['R', 'S', 'T', 'U', 'V'][i]);

// ── INDICADORES ISA-101 ───────────────────────────────────────────────────────
function wearBar(mm, st) {
    const ws = wSt(mm, st);
    const p = pct(mm, st);
    const col = ws === 'rd' ? 'var(--p2)' : ws === 'yw' ? 'var(--p3)' : 'var(--ok)';
    const tyP = Math.round(THY * 100);
    const trP = Math.round(THR * 100);
    return '<div style="position:relative;height:8px;background:var(--bg3);overflow:visible;margin:4px 0;border-radius:4px">'
        + '<div style="position:absolute;left:0;top:0;height:100%;width:' + p + '%;background:' + col + ';transition:width .3s;border-radius:4px"></div>'
        + '<div title="Alerta ' + tyP + '%" style="position:absolute;left:' + tyP + '%;top:-2px;height:12px;width:2px;background:var(--p3);border-radius:1px;opacity:.8"></div>'
        + '<div title="Crítico ' + trP + '%" style="position:absolute;left:' + trP + '%;top:-2px;height:12px;width:2px;background:var(--p2);border-radius:1px;opacity:.8"></div>'
        + '</div>'
        + '<div style="display:flex;justify-content:space-between;font-size:9px;color:var(--txt3);font-family:var(--fd);margin-top:1px">'
        + '<span>' + fmt1(mm) + ' mm</span><span>' + p + '%</span></div>';
}

function battBar(batt, st) {
    const bs = bSt(batt, st);
    const col = bs === 'rd' ? 'var(--p2)' : bs === 'yw' ? 'var(--p3)' : 'var(--ok)';
    return '<div style="position:relative;height:6px;background:var(--bg3);overflow:visible;margin:4px 0;border-radius:3px">'
        + '<div style="position:absolute;left:0;top:0;height:100%;width:' + batt + '%;background:' + col + ';transition:width .3s;border-radius:3px"></div>'
        + '<div title="Bat. baja ' + TB + '%" style="position:absolute;left:' + TB + '%;top:-2px;height:10px;width:2px;background:var(--p3);border-radius:1px;opacity:.8"></div>'
        + '</div>'
        + '<div style="font-size:9px;color:var(--txt3);font-family:var(--fd);margin-top:1px;text-align:right">' + (batt === 0 ? 'SIN SEÑAL' : batt + '%') + '</div>';
}

function tempBar(temp, st) {
    const ts = tSt(temp, st);
    const col = ts === 'rd' ? 'var(--p2)' : ts === 'yw' ? 'var(--p3)' : 'var(--ok)';
    const maxT = TTR + 20;
    const p = Math.min(100, Math.round(temp / maxT * 100));
    const tyP = Math.round(TTY / maxT * 100);
    const trP = Math.round(TTR / maxT * 100);
    return '<div style="position:relative;height:6px;background:var(--bg3);overflow:visible;margin:4px 0;border-radius:3px">'
        + '<div style="position:absolute;left:0;top:0;height:100%;width:' + p + '%;background:' + col + ';transition:width .3s;border-radius:3px"></div>'
        + '<div title="Alerta ' + TTY + '°C" style="position:absolute;left:' + tyP + '%;top:-2px;height:10px;width:2px;background:var(--p3);border-radius:1px;opacity:.8"></div>'
        + '<div title="Crítico ' + TTR + '°C" style="position:absolute;left:' + trP + '%;top:-2px;height:10px;width:2px;background:var(--p2);border-radius:1px;opacity:.8"></div>'
        + '</div>'
        + '<div style="font-size:9px;color:var(--txt3);font-family:var(--fd);margin-top:1px;text-align:right">' + temp + '°C</div>';
}

function sigSt(lastSeen) {
    if (!lastSeen) return { st: 'rd', label: 'Sin señal', color: 'var(--p2)' };
    const hoursAgo = (Date.now() - lastSeen) / 3600000;
    if (hoursAgo >= SIG_N) return { st: 'rd', label: 'Perdida', hoursAgo, color: 'var(--p2)' };
    if (hoursAgo >= SIG_N / 2) return { st: 'yw', label: 'Espera', hoursAgo, color: 'var(--p3)' };
    return { st: 'neu', label: 'Normal', hoursAgo, color: 'var(--ok)' };
}

function fmtAgo(h) { if (h < 1 / 60) return 'ahora'; if (h < 1) return Math.round(h * 60) + 'min'; return h.toFixed(1) + 'h'; }
function fmtLastSeen(ts) { return new Date(ts).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }

function setFilter(f) {
    const box = document.getElementById('MC_' + (FILTER || 'neu')); if (box) box.style.outline = 'none';
    if (FILTER === f) { FILTER = null; rendDet(); return; } FILTER = f;
    const newBox = document.getElementById('MC_' + f); if (newBox) newBox.style.outline = '2px solid var(--accent)';
    applyFilter();
}
function applyFilter() {
    if (!FILTER) { CARDS.forEach(c => c.el.style.opacity = '1'); return; }
    CARDS.forEach(c => {
        let show = false;
        if (FILTER === 'neu' && c.ws === 'neu') show = true;
        else if (FILTER === 'yw' && c.ws === 'yw') show = true;
        else if (FILTER === 'rd' && c.ws === 'rd') show = true;
        else if (FILTER === 'tmp' && c.temp >= TTY) show = true;
        else if (FILTER === 'bat' && c.batt <= TB * 2) show = true;
        c.el.style.opacity = show ? '1' : '0.15';
    });
}

function rendCfgSummary() {
    const elNom = document.getElementById('VAL_NOM');
    const elUl = document.getElementById('VAL_UL');
    const elThy = document.getElementById('VAL_THY');
    const elThr = document.getElementById('VAL_THR');
    const elTty = document.getElementById('VAL_TTY');
    const elTtr = document.getElementById('VAL_TTR');
    const elTb = document.getElementById('VAL_TB');
    const elSn = document.getElementById('VAL_SN');

    if (elNom) elNom.textContent = NOM;
    if (elUl) elUl.innerHTML = Math.round(ulMm()) + ' <span class="text-sm font-bold text-[#0d193c]">MM (' + Math.round(UL_PCT * 100) + '%)</span>';
    if (elThy) elThy.innerHTML = fmt1(NOM * THY) + ' <span class="text-sm font-bold text-[#0d193c]">MM (' + Math.round(THY * 100) + '%)</span>';
    if (elThr) elThr.innerHTML = fmt1(NOM * THR) + ' <span class="text-sm font-bold text-[#0d193c]">MM (' + Math.round(THR * 100) + '%)</span>';
    if (elTty) elTty.textContent = TTY;
    if (elTtr) elTtr.textContent = TTR;
    if (elTb) elTb.textContent = TB;
    if (elSn) elSn.textContent = SIG_N;
}

function initData() {
    MOTORS.forEach(m => {
        if (!MD[m.id]) {
            MD[m.id] = Array.from({ length: m.phases || 3 }, (_, pi) => Array.from({ length: m.brushPerPhase || 5 }, (_, bi) => {
                const seedVal = (m.seed && m.seed[pi] && m.seed[pi][bi]) || rnd(ulMm() + 5, NOM);
                return { mm: seedVal, temp: rnd(35, 55), batt: rnd(60, 100), lastSeen: Date.now() - rnd(0, 100000) };
            }));
            HIST[m.id] = Array.from({ length: 30 }, (_, i) => NOM - (30 - i) * m.rate * (0.8 + 0.4 * Math.random()));
            seedRecs(m);
        }
    });
}

function seedRecs(m) {
    if (RECS[m.id]) return;
    RECS[m.id] = [];
    if (m.id === 'MAQUETA') return;
    const ph = getPhases(m);
    const t = ['C. Ramírez', 'J. Flores', 'M. Soto'];
    for (let i = 0; i < rnd(2, 6); i++) {
        const d = new Date(); d.setDate(d.getDate() - rnd(15, 120));
        RECS[m.id].push({
            date: d.toISOString().slice(0, 10), phase: ph[rnd(0, ph.length - 1)], brush: rnd(1, m.brushPerPhase || 5),
            mmOut: rnd(ulMm() - 3, ulMm() + 4), mmIn: NOM, type: rnd(0, 5) > 3 ? 'ambos' : 'escobilla', reason: REASONS[rnd(0, REASONS.length - 1)],
            tech: t[rnd(0, t.length - 1)], obs: 'Reemplazo periódico'
        });
    }
    RECS[m.id].sort((a, b) => b.date.localeCompare(a.date));
}

function avgMm(m) {
    if (!MD[m.id]) return NOM;
    const arr = MD[m.id].flat();
    return arr.reduce((a, b) => a + b.mm, 0) / arr.length;
}

function mSum(m) {
    const ph = getPhases(m); const b = MD[m.id].flat();
    const avg = avgMm(m); const wp = Math.min(100, Math.round((avg - ulMm()) / (NOM - ulMm()) * 100));
    const maxT = Math.max(...b.map(x => x.temp)); const minB = Math.min(...b.map(x => x.batt));
    const ws = wSt(avg, m.st);
    let nRed = 0, nYel = 0;
    b.forEach(x => {
        const s = wSt(x.mm, m.st), t = tSt(x.temp, m.st), bt = bSt(x.batt, m.st);
        if (s === 'rd' || t === 'rd' || bt === 'rd') nRed++;
        else if (s === 'yw' || t === 'yw' || bt === 'yw') nYel++;
    });
    return { avg, wp, maxT, minB, ws, nRed, nYel };
}

function simCycle() {
    let changed = false;
    MOTORS.forEach(m => {
        if (m.st === 'off' || !MD[m.id] || m.id === 'MAQUETA') return;
        MD[m.id].forEach(phase => phase.forEach(b => {
            // Desgaste progresivo
            const wearStep = m.rate * (SIM_HRS / 24);
            b.mm = Math.max(0, +(b.mm - wearStep * (0.8 + 0.4 * Math.random())).toFixed(2));
            // Batería progresiva
            b.batt = Math.max(0, Math.round(b.batt - BD * (SIM_HRS / 24) * (0.7 + 0.6 * Math.random())));
            // Temperatura fluctuante
            b.temp = Math.min(130, Math.max(25, Math.round(b.temp + rnd(-5, 5))));
            // Actualizar señal
            if (Math.random() > 0.05) b.lastSeen = Date.now();
        }));
        // Registrar tendencia
        HIST[m.id].push(+(avgMm(m)).toFixed(1));
        if (HIST[m.id].length > 40) HIST[m.id].shift();
        changed = true;
    });
    if (changed) rendAll();
}

function startSim() {
    if (simT) clearInterval(simT);
    if (simPT) clearInterval(simPT);
    simProg = 0;
    simT = setInterval(simCycle, SIM_SECS * 1000);
    simPT = setInterval(() => {
        simProg += 100 / (SIM_SECS);
        if (simProg >= 100) simProg = 0;
        document.getElementById('SPF').style.width = simProg + '%';
        const remSecs = Math.max(0, Math.round(SIM_SECS * (100 - simProg) / 100));
        const min = Math.floor(remSecs / 60), sec = remSecs % 60;
        document.getElementById('SCD').textContent = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }, 1000);
}

function toggleSim() {
    simOn = !simOn;
    document.getElementById('SICO').textContent = simOn ? 'pause' : 'play_arrow';
    document.getElementById('SLBL').textContent = simOn ? 'Pausar' : 'Reanudar';
    simOn ? startSim() : (clearInterval(simT), clearInterval(simPT));
}
function updCyc() {
    SIM_HRS = +document.getElementById('S_CYC').value;
    const L = { 0.5: '30 min', 1: '1 hora', 1.5: '1h 30min', 2: '2 horas' };
    document.getElementById('SV_CYC').textContent = (L[SIM_HRS] || SIM_HRS) + ' / ciclo';
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────
let dataKey = '';
function rendAll() {
    rendGen();
    if (CUR) {
        if (CURTAB == 'est') rendDet();
        else if (CURTAB == 'mnt') rendMnt();
        else rendHist();
    }
}

// ── GENERAL ───────────────────────────────────────────────────────────────────
function updAlarmBar() {
    const alarms = getAlarms();
    const unacked = alarms.filter(a => !a.acked);
    const p1 = unacked.filter(a => a.pri === 1).length;
    const p2 = unacked.filter(a => a.pri === 2).length;
    const p3 = unacked.filter(a => a.pri === 3).length;
    const el1 = document.getElementById('ALM_P1');
    const el2 = document.getElementById('ALM_P2');
    const el3 = document.getElementById('ALM_P3');
    const elOK = document.getElementById('ALM_OK');

    if (el1) { el1.style.display = p1 ? 'inline-flex' : 'none'; if (p1) document.getElementById('ALM_P1_N').textContent = p1; }
    if (el2) { el2.style.display = p2 ? 'inline-flex' : 'none'; if (p2) document.getElementById('ALM_P2_N').textContent = p2; }
    if (el3) { el3.style.display = p3 ? 'inline-flex' : 'none'; if (p3) document.getElementById('ALM_P3_N').textContent = p3; }
    if (elOK) elOK.style.display = (!p1 && !p2 && !p3) ? 'inline' : 'none';

    document.querySelector('header').style.borderBottom = p1 ? '3px solid #ff00ff' : p2 ? '3px solid #c83e3a' : p3 ? '3px solid #f2b705' : 'none';
}

function rendGen() {
    rendCfgSummary();
    const all = MOTORS.filter(m => m.st === 'run' && MD[m.id]).flatMap(m => MD[m.id].flat());
    const ws = all.map(b => wSt(b.mm, 'run'));
    const offC = MOTORS.filter(m => m.st === 'off' && MD[m.id]).flatMap(m => MD[m.id].flat()).length;
    const total = MOTORS.reduce((a, m) => a + (m.phases || 3) * (m.brushPerPhase || 5), 0);
    document.getElementById('G_TOT').textContent = total;
    document.getElementById('G_GRN').textContent = ws.filter(s => s === 'neu').length;
    document.getElementById('G_YEL').textContent = ws.filter(s => s === 'yw').length;
    document.getElementById('G_RED').textContent = ws.filter(s => s === 'rd').length + offC;
    document.getElementById('G_MOTOR_COUNT').textContent = '(' + MOTORS.length + ' motores)';
    document.getElementById('SV_UL').textContent = Math.round(ulMm());

    document.getElementById('G_MTBL').innerHTML = MOTORS.map(m => {
        const s = mSum(m);
        const ts = tSt(s.maxT, m.st), bs = bSt(s.minB, m.st);

        const clrClass = x => x === 'rd' ? 'text-error-600' : x === 'yw' ? 'text-warning-600' : 'text-gray-900';
        const bgClass = x => x === 'rd' ? 'bg-error-50 text-error-600' : x === 'yw' ? 'bg-warning-50 text-warning-800' : 'bg-success-50 text-success-600';
        const bfcls = x => x === 'rd' ? 'rd' : x === 'yw' ? 'yw' : 'neu';

        const ab = m.st === 'off' ? '—' :
            (s.nRed > 0 ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-bold bg-error-50 text-error-800 mr-1">' + s.nRed + ' P2</span>' : '') +
            (s.nYel > 0 ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-bold bg-warning-50 text-warning-800">' + s.nYel + ' P3</span>' : '') ||
            '<span class="text-sm text-gray-900 font-semibold uppercase tracking-wider">Sin alarmas</span>';

        const ph = getPhases(m);

        return '<tr class="odd:bg-[#f9fafb] hover:bg-gray-50/50 transition-colors">'
            + '<td class="py-3 px-4 font-semibold text-gray-900"><strong class="font-bold">' + m.id + '</strong> <span class="text-sm text-gray-900 font-medium ml-1">' + m.type + ' ' + ph.length + 'F&times;' + (m.brushPerPhase || 5) + '</span></td>'
            + '<td class="py-3 px-4 font-semibold ' + clrClass(s.ws) + '">' + (m.st === 'off' ? '—' : fmt1(s.avg) + ' mm') + '</td>'
            + '<td class="py-3 px-4">'
            + '<div class="flex items-center gap-3">'
            + '<div class="w-24 bg-gray-200 rounded-full h-2">'
            + '<div class="bf ' + bfcls(s.ws) + ' h-2 rounded-full" style="width:' + s.wp + '%"></div>'
            + '</div>'
            + '<span class="text-sm text-gray-900 font-semibold">' + s.wp + '%</span>'
            + '</div>'
            + '</td>'
            + '<td class="py-3 px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-bold ' + bgClass(ts) + '">' + (m.st === 'off' ? '—' : s.maxT + '&deg;C') + '</span></td>'
            + '<td class="py-3 px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-bold ' + bgClass(bs) + '">' + (m.st === 'off' ? '—' : s.minB + '%') + '</span></td>'
            + '<td class="py-3 px-4 text-center">' + ab + '</td>'
            + '<td class="py-3 px-4 text-right">'
            + '<span class="material-symbols-outlined text-gray-900 cursor-pointer hover:text-primary transition-colors text-[32px] align-middle" onclick="showDet(\'' + m.id + '\')">search</span>'
            + '</td>'
            + '</tr>';
    }).join('');

    rendAlrts(); updTrG();
}

function rendAlrts() {
    const alarms = getAlarms();
    updAlarmBar();
    const box = document.getElementById('G_ALRT');
    if (!alarms.length) {
        box.innerHTML = '<div class="text-center py-6 text-gray-900 font-bold uppercase tracking-wider text-sm flex flex-col items-center gap-2"><span class="material-symbols-outlined text-emerald-500 text-[32px]" style="font-variation-settings: \'FILL\' 1">check_circle</span> Sin alarmas activas</div>';
        return;
    }
    const priLbl = { 1: 'P1', 2: 'P2', 3: 'P3', 4: 'P4' };
    const shown = alarms.slice(0, 8);

    box.innerHTML = shown.map(a => {
        const opacity = a.acked ? '0.4' : '1';
        const bgClass = a.pri === 2 ? 'bg-error-50 border-error-500' : 'bg-warning-50 border-warning-500';
        const txtClass = a.pri === 2 ? 'text-error-800' : 'text-warning-800';
        const subClass = a.pri === 2 ? 'text-error-600' : 'text-warning-700';
        const btnBorderClass = a.pri === 2 ? 'border-error-500 text-error-600 hover:bg-error-500' : 'border-warning-500 text-warning-700 hover:bg-amber-500';

        return '<div class="flex items-center justify-between p-4 rounded ' + bgClass + ' border-left border-l-[6px] shadow-sm gap-4 opacity-[' + opacity + '] transition-opacity" style="opacity:' + opacity + '">'
            + '<div class="flex-grow">'
            + '<div class="text-lg font-bold ' + txtClass + ' leading-tight">' + a.loc + ' &mdash; ' + a.msg + '</div>'
            + '<div class="text-base font-bold ' + subClass + ' uppercase tracking-wide mt-1.5">' + a.action + '</div>'
            + '</div>'
            + (!a.acked ? '<button class="px-4 py-4 border bg-white ' + btnBorderClass + ' text-lg font-bold rounded hover:text-white transition-colors shrink-0 cursor-pointer" onclick="ackAlarm(\'' + a.id + '\')">ACK</button>' : '<span class="text-lg text-gray-900 font-bold uppercase shrink-0">ACK</span>')
            + '</div>';
    }).join('')
        + (alarms.length > 8 ? '<div class="text-center font-bold text-[#0d193c] text-lg mt-6 hover:underline cursor-pointer">+ ' + (alarms.length - 8) + ' alertas más</div>' : '');
}

function buildMSel() {
    const sel = document.getElementById('G_MSEL'); sel.innerHTML = '';
    MOTORS.filter(m => m.st === 'run').forEach(m => { const o = document.createElement('option'); o.value = m.id; o.textContent = m.id; sel.appendChild(o); });
    sel.addEventListener('change', updTrG);
}

function updTrG() {
    const m = MOTORS.find(x => x.id === document.getElementById('G_MSEL').value) || MOTORS[0];
    if (!HIST[m.id]) return;
    const data = [...HIST[m.id]], labels = data.map((_, i) => 'C-' + (i + 1));
    const ty = +(NOM * THY).toFixed(1), tr = +(NOM * THR).toFixed(1);

    if (chG) chG.destroy();
    chG = new Chart(document.getElementById('G_TRCH'), {
        type: 'line',
        data: {
            labels, datasets: [
                { label: 'mm', data, borderColor: '#4c86ff', backgroundColor: 'rgba(76,134,255,.05)', tension: .3, pointRadius: 2, fill: true },
                { label: 'Alerta', data: Array(data.length).fill(ty), borderColor: '#f2b705', borderDash: [4, 3], pointRadius: 0, borderWidth: 1.5 },
                { label: 'Crítico', data: Array(data.length).fill(tr), borderColor: '#c83e3a', borderDash: [4, 3], pointRadius: 0, borderWidth: 1.5 },
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: NOM + 10, grid: { color: '#e2e8f0' }, ticks: { font: { size: 10 }, color: '#5f7282' } }, x: { grid: { color: 'rgba(226,232,240,.5)' }, ticks: { font: { size: 9 }, color: '#5f7282', autoSkip: true, maxTicksLimit: 10 } } }
        }
    });
}

// ── DETALLE ───────────────────────────────────────────────────────────────────
function showDet(id) {
    CUR = MOTORS.find(x => x.id === id); FILTER = null;
    document.getElementById('VGEN').style.display = 'none';
    document.getElementById('VDET').style.display = 'block';
    const ttl = document.getElementById('TTL');
    const sub = document.getElementById('SUB');
    if (ttl) ttl.textContent = 'Motor ' + CUR.id + ' — Detalle';
    if (sub) sub.textContent = CUR.type + ' · ' + getPhases(CUR).length + ' fases · ' + (CUR.brushPerPhase || 5) + ' escobillas/fase';
    document.getElementById('BREAD').textContent = 'General / ' + CUR.id;
    const hfph = document.getElementById('HF_PH');
    hfph.innerHTML = '<option value="">Todas las fases</option>';
    getPhases(CUR).forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = 'Fase ' + p; hfph.appendChild(o); });
    switchTab('est');
}
function showGen() {
    CUR = null; FILTER = null;
    document.getElementById('VGEN').style.display = 'block';
    document.getElementById('VDET').style.display = 'none';
    updTopbar();
}
function switchTab(t) {
    CURTAB = t; FILTER = null;
    ['est', 'mnt', 'hst'].forEach(k => {
        document.getElementById('TAB_' + k.toUpperCase()).className = 'tab' + (k === t ? ' on' : '');
        document.getElementById('V' + k.toUpperCase()).style.display = k === t ? 'flex' : 'none';
    });
    if (t === 'est') rendDet();
    else if (t === 'mnt') rendMnt();
    else rendHist();
}

function rendDet() {
    const m = CUR; if (!m || !MD[m.id]) return;
    const ph = getPhases(m);
    const brushes = MD[m.id].flat();
    const ws = brushes.map(b => wSt(b.mm, m.st));
    const maxT = Math.max(...brushes.map(b => b.temp));
    const minB = Math.min(...brushes.map(b => b.batt));
    const bpf = m.brushPerPhase || 5;

    document.getElementById('D_TOT').textContent = ph.length * bpf;
    document.getElementById('D_GRN').textContent = ws.filter(s => s === 'neu').length;
    document.getElementById('D_YEL').textContent = ws.filter(s => s === 'yw').length;
    document.getElementById('D_RED').textContent = ws.filter(s => s === 'rd').length;

    const tm = document.getElementById('D_TMX');
    tm.textContent = m.st === 'off' ? '—' : maxT + '°C';
    tm.className = 'vl text-lg font-bold ' + (maxT >= TTR ? 'text-error-600' : maxT >= TTY ? 'text-warning-600' : 'text-success-600');

    const bm = document.getElementById('D_BMN');
    bm.textContent = m.st === 'off' ? '—' : minB + '%';
    bm.className = 'vl text-lg font-bold ' + (minB <= TB ? 'text-error-600' : minB <= TB * 2 ? 'text-warning-600' : 'text-success-600');

    CARDS = [];
    const grid = document.getElementById('D_PHGRID');
    grid.innerHTML = '';
    grid.className = 'grid gap-6';
    grid.style.gridTemplateColumns = 'repeat(' + ph.length + ',1fr)';

    ph.forEach((phName, pi) => {
        const phase = MD[m.id][pi];
        const aM = Math.round(phase.reduce((a, x) => a + x.mm, 0) / phase.length);
        const aT = Math.round(phase.reduce((a, x) => a + x.temp, 0) / phase.length);
        const aB = Math.round(phase.reduce((a, x) => a + x.batt, 0) / phase.length);
        const ps = wSt(aM, m.st);
        const phDiv = document.createElement('div'); phDiv.className = 'phc';

        const hdr = document.createElement('div'); hdr.className = 'pht border-b pb-2 mb-3';
        hdr.innerHTML = '<span class="font-bold text-sm text-[#0d193c]">Fase ' + phName + '</span>'
            + '<span class="float-right text-sm bg-gray-50 border border-gray-150 px-2 py-0.5 rounded text-gray-900 font-semibold">' + fmt1(aM) + ' mm · ' + aT + '°C · ' + aB + '%</span>';
        phDiv.appendChild(hdr);

        const brl = document.createElement('div'); brl.className = 'brl flex flex-col gap-3';

        phase.forEach((brush, bi) => {
            const wsCur = wSt(brush.mm, m.st);
            const tsCur = tSt(brush.temp, m.st);
            const bsCur = bSt(brush.batt, m.st);
            const sig = sigSt(brush.lastSeen);

            const card = document.createElement('div'); card.className = 'brc ' + wsCur;
            const brh = document.createElement('div'); brh.className = 'brh flex justify-between items-center mb-2';

            const stClass = wsCur === 'rd' ? 'bg-error-50 text-error-600' : wsCur === 'yw' ? 'bg-warning-50 text-warning-800' : 'bg-success-50 text-success-600';
            brh.innerHTML = '<span class="brn font-bold text-sm text-gray-900">ESC ' + (bi + 1) + '</span>'
                + '<span class="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold uppercase ' + stClass + '">' + stLbl(wsCur) + '</span>';
            card.appendChild(brh);

            const brm = document.createElement('div'); brm.className = 'brm grid grid-cols-3 gap-2 mb-3';
            brm.innerHTML = '<div class="bri"><span class="bril text-sm text-gray-900 font-bold uppercase">Desgaste</span>' + (m.st === 'off' ? '<span class="briv neu">—</span>' : wearBar(brush.mm, m.st)) + '</div>'
                + '<div class="bri"><span class="bril text-sm text-gray-900 font-bold uppercase">Temperatura</span>' + (m.st === 'off' ? '<span class="briv neu">—</span>' : tempBar(brush.temp, m.st)) + '</div>'
                + '<div class="bri"><span class="bril text-sm text-gray-900 font-bold uppercase">Batería</span>' + (m.st === 'off' ? '<span class="briv neu">—</span>' : battBar(brush.batt, m.st)) + '</div>';
            card.appendChild(brm);

            const sigRow = document.createElement('div');
            sigRow.className = 'flex items-center gap-1.5 pt-2 border-t border-gray-100 text-sm text-gray-900';
            sigRow.innerHTML = '<span class="material-symbols-outlined text-[14px]" style="color:' + sig.color + '">sensors</span>'
                + '<span>Última señal: <strong style="color:' + sig.color + '; font-family:var(--fd)">' + (fmtLastSeen(brush.lastSeen || Date.now())) + '</strong> (' + fmtAgo(sig.hoursAgo) + ') &middot; <span style="color:' + sig.color + '">' + sig.label + '</span></span>';
            card.appendChild(sigRow);
            brl.appendChild(card);
            CARDS.push({ el: card, ws: wsCur, temp: brush.temp, batt: brush.batt });
        });
        phDiv.appendChild(brl); grid.appendChild(phDiv);
    });
    applyFilter(); updPhCh(); updPhTr(); rendDetAlrts();
}

function updPhCh() {
    const m = CUR; if (!m || !MD[m.id]) return;
    const ph = getPhases(m);
    const met = document.getElementById('D_PMET').value;
    const vals = ph.map((_, pi) => {
        const phase = MD[m.id][pi];
        return met === 'wear' ? Math.round(phase.reduce((a, b) => a + b.mm, 0) / phase.length) :
            met === 'temp' ? Math.round(phase.reduce((a, b) => a + b.temp, 0) / phase.length) :
                Math.round(phase.reduce((a, b) => a + b.batt, 0) / phase.length);
    });
    let ty, tr, yM, yL;
    if (met === 'wear') { ty = +(NOM * THY).toFixed(0); tr = +(NOM * THR).toFixed(0); yM = NOM + 10; yL = 'mm'; }
    else if (met === 'temp') { ty = TTY; tr = TTR; yM = 140; yL = '°C'; }
    else { ty = TB * 2; tr = TB; yM = 100; yL = '%'; }

    if (chPh) chPh.destroy();
    chPh = new Chart(document.getElementById('D_PHCH'), {
        type: 'bar',
        data: {
            labels: ph.map(p => 'Fase ' + p), datasets: [
                { label: 'Prom', data: vals, backgroundColor: vals.map(v => met === 'wear' ? (v / NOM < THR ? '#c83e3a' : v / NOM < THY ? '#f2b705' : '#2e8b57') : met === 'temp' ? (v >= TTR ? '#c83e3a' : v >= TTY ? '#f2b705' : '#2e8b57') : (v <= TB ? '#c83e3a' : v <= TB * 2 ? '#f2b705' : '#2e8b57')), borderRadius: 4 },
                { label: 'Alerta', data: Array(ph.length).fill(ty), type: 'line', borderColor: '#f2b705', borderDash: [4, 3], pointRadius: 0, borderWidth: 1.5 },
                { label: 'Crítico', data: Array(ph.length).fill(tr), type: 'line', borderColor: '#c83e3a', borderDash: [4, 3], pointRadius: 0, borderWidth: 1.5 },
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: yM, grid: { color: '#e2e8f0' }, title: { display: true, text: yL, font: { size: 9 }, color: '#5f7282' }, ticks: { font: { size: 9 }, color: '#5f7282' } }, x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#5f7282' } } }
        }
    });
}

function updPhTr() {
    const m = CUR; if (!m || !HIST[m.id]) return;
    const ph = getPhases(m);
    const met = document.getElementById('D_TMET').value;
    const labels = HIST[m.id].map((_, i) => 'C-' + (i + 1));
    const cols = ['#4c86ff', '#2e8b57', '#ff671f', '#e8b84a'];
    const datasets = ph.map((phName, pi) => {
        const aT = Math.round(MD[m.id][pi].reduce((a, b) => a + b.temp, 0) / MD[m.id][pi].length);
        const data = met === 'wear' ? HIST[m.id].map(v => Math.max(0, +(v * (0.9 + 0.1 * pi / 2)).toFixed(1))) :
            HIST[m.id].map((_, i) => Math.max(20, Math.round(aT + (HIST[m.id].length - 1 - i) * 0.6 * (pi + 1))));
        return { label: 'Fase ' + phName, data, borderColor: cols[pi], tension: .3, pointRadius: 2, fill: false };
    });
    const ty = met === 'wear' ? +(NOM * THY).toFixed(1) : TTY;
    const tr = met === 'wear' ? +(NOM * THR).toFixed(1) : TTR;
    datasets.push({ label: 'A', data: Array(labels.length).fill(ty), borderColor: '#f2b705', borderDash: [4, 3], pointRadius: 0, borderWidth: 1.5, fill: false });
    datasets.push({ label: 'C', data: Array(labels.length).fill(tr), borderColor: '#c83e3a', borderDash: [4, 3], pointRadius: 0, borderWidth: 1.5, fill: false });

    if (chTr) chTr.destroy();
    chTr = new Chart(document.getElementById('D_TRCH'), {
        type: 'line', data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: met === 'wear' ? NOM + 10 : 145, grid: { color: '#e2e8f0' }, ticks: { font: { size: 9 }, color: '#5f7282' } }, x: { grid: { color: 'rgba(226,232,240,.5)' }, ticks: { font: { size: 9 }, color: '#5f7282', autoSkip: true, maxTicksLimit: 10 } } }
        }
    });
}

function rendDetAlrts() {
    const m = CUR; if (!m || !MD[m.id]) return;
    const alarms = getAlarms().filter(a => a.motorId === m.id);

    document.getElementById('D_ALRT').innerHTML = alarms.length ?
        alarms.map(a => {
            const opacity = a.acked ? '0.4' : '1';
            const bgClass = a.pri === 2 ? 'bg-error-50 border-error-500' : 'bg-warning-50 border-warning-500';
            const txtClass = a.pri === 2 ? 'text-error-800' : 'text-warning-800';
            const subClass = a.pri === 2 ? 'text-error-600' : 'text-warning-700';
            const btnBorderClass = a.pri === 2 ? 'border-error-500 text-error-600 hover:bg-error-500' : 'border-warning-500 text-warning-700 hover:bg-amber-500';

            return '<div class="flex items-center justify-between p-3 rounded ' + bgClass + ' border-left border-l-[6px] shadow-sm gap-4 opacity-[' + opacity + ']" style="opacity:' + opacity + '">'
                + '<div class="flex-grow">'
                + '<div class="text-sm font-bold ' + txtClass + ' leading-tight">' + a.loc + ' &mdash; ' + a.msg + '</div>'
                + '<div class="text-sm font-bold ' + subClass + ' uppercase tracking-wide mt-1">' + a.action + '</div>'
                + '</div>'
                + (!a.acked ? '<button class="px-3 py-1.5 border bg-white ' + btnBorderClass + ' text-sm font-bold rounded hover:text-white transition-colors shrink-0 cursor-pointer" onclick="ackAlarm(\'' + a.id + '\');rendDetAlrts()">ACK</button>' : '<span class="text-sm text-gray-900 font-bold uppercase shrink-0">ACK</span>')
                + '</div>';
        }).join('') :
        '<div class="text-center py-6 text-gray-900 font-bold uppercase tracking-wider text-sm flex flex-col items-center gap-2"><span class="material-symbols-outlined text-emerald-500 text-[32px]" style="font-variation-settings: \'FILL\' 1">check_circle</span> Sin alarmas activas</div>';
}

// ── PROYECCIÓN ────────────────────────────────────────────────────────────────
function rendMnt() {
    const m = CUR; if (!m || !MD[m.id]) return;
    const ph = getPhases(m); const today = new Date(); const rows = [];
    MD[m.id].forEach((phase, pi) => phase.forEach((b, bi) => {
        if (m.st === 'off') return;
        const c = combined(b.mm, m.rate, b.batt);
        const date = new Date(today); date.setDate(date.getDate() + c.days);
        const lifeRem = Math.max(0, Math.round((b.mm - ulMm()) / (NOM - ulMm()) * 100));
        const bs = bSt(b.batt, m.st), wUrg = urgCls(c.wd), urg = urgCls(c.days);
        rows.push({ ph: ph[pi], br: bi + 1, mm: b.mm, lifeRem, days: c.days, cause: c.cause, date, urg, wUrg, batt: b.batt, bs });
    }));
    rows.sort((a, b) => a.urg === 'rd' && b.urg !== 'rd' ? -1 : b.urg === 'rd' && a.urg !== 'rd' ? 1 : a.days - b.days);
    const inM = (d, off) => { const s = new Date(today); s.setDate(1); s.setMonth(s.getMonth() + off); const e = new Date(s); e.setMonth(e.getMonth() + 1); return d >= s && d < e; };

    document.getElementById('M_THIS').textContent = rows.filter(r => inM(r.date, 0)).length;
    document.getElementById('M_NEXT').textContent = rows.filter(r => inM(r.date, 1)).length;
    document.getElementById('M_URG').textContent = Math.min(...rows.map(r => r.days)) <= 0 ? 'HOY' : Math.min(...rows.map(r => r.days)) + 'd';
    document.getElementById('M_AVG').textContent = Math.round(rows.reduce((a, r) => a + r.lifeRem, 0) / rows.length) + '%';

    const tbl = document.getElementById('M_TBL'); tbl.innerHTML = '';
    const thead = tbl.createTHead(); const hr = thead.insertRow();
    hr.className = "bg-gray-100 text-gray-900";
    ['Fase', 'Escobilla', 'Urgencia', 'Intervención en', 'Fecha estimada', 'Longitud actual', 'Vida útil (%)', 'Batería (%)'].forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        th.className = "py-3 px-4 font-semibold text-sm border-b border-gray-200";
        hr.appendChild(th);
    });

    const tbody = tbl.createTBody();
    rows.forEach(r => {
        const tr = tbody.insertRow();
        tr.className = "odd:bg-[#f9fafb] hover:bg-gray-50/50 transition-colors";
        const bCol = r.bs === 'rd' ? '#c83e3a' : r.bs === 'yw' ? '#f2b705' : '#0d193c';
        const bBar = '<div style="display:flex;align-items:center;gap:5px"><div style="flex:1;height:5px;background:var(--bg3);border-radius:2.5px;overflow:hidden"><div style="height:100%;width:' + r.batt + '%;background:' + (r.bs === 'rd' ? '#c83e3a' : r.bs === 'yw' ? '#f2b705' : '#2e8b57') + '"></div></div><span style="font-size:10px;font-family:var(--fd);color:' + bCol + ';font-weight:700">' + r.batt + '%</span></div>';
        const wBar2 = '<div style="display:flex;align-items:center;gap:5px"><div style="flex:1;height:5px;background:var(--bg3);border-radius:2.5px;overflow:hidden"><div style="height:100%;width:' + r.lifeRem + '%;background:' + (r.wUrg === 'rd' ? '#c83e3a' : r.wUrg === 'yw' ? '#f2b705' : '#2e8b57') + '"></div></div><span style="font-size:10px;font-family:var(--fd);color:#0d193c;font-weight:700">' + r.lifeRem + '%</span></div>';

        const badgeClass = r.urg === 'rd' ? 'bg-error-50 text-error-600 border-error-500' : r.urg === 'yw' ? 'bg-warning-50 text-warning-800 border-warning-500' : 'bg-success-50 text-success-600 border-success-500';
        const chipClass = r.urg === 'rd' ? 'bg-error-50 text-error-600 border-error-500' : r.urg === 'yw' ? 'bg-warning-50 text-warning-800 border-warning-500' : 'bg-success-50 text-success-600 border-success-500';

        ['<strong style="font-family:var(--fd)" class="text-sm font-bold text-gray-900">' + r.ph + '</strong>',
        '<span class="text-sm font-semibold text-gray-900">' + r.br + '</span>',
        '<span class="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold uppercase border ' + badgeClass + '">' + urgLbl(r.days) + '</span><div class="text-sm text-gray-900 font-bold uppercase mt-1">' + r.cause + '</div>',
        '<span class="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold border ' + chipClass + '">' + (r.days <= 0 ? 'INMEDIATO' : 'En ' + r.days + 'd') + '</span>',
        '<span style="font-size:11px;font-family:var(--fd)" class="font-bold text-gray-900">' + fmtDate(r.date) + '</span>',
        '<span style="font-family:var(--fd)" class="font-bold text-sm ' + (r.wUrg === 'rd' ? 'text-error-600' : r.wUrg === 'yw' ? 'text-warning-600' : 'text-gray-900') + '">' + fmt1(r.mm) + ' mm</span>',
            wBar2, bBar
        ].forEach(html => {
            const td = tr.insertCell();
            td.innerHTML = html;
            td.className = "py-3 px-4 border-b border-gray-150 align-middle";
        });
    });

    const months = []; for (let i = 0; i < 6; i++) { const d = new Date(today); d.setDate(1); d.setMonth(d.getMonth() + i); months.push(d); }
    const mc = months.map(ms => { const me = new Date(ms); me.setMonth(me.getMonth() + 1); return rows.filter(r => r.date >= ms && r.date < me).length; });

    if (chM) chM.destroy();
    chM = new Chart(document.getElementById('M_CHTM'), {
        type: 'bar',
        data: {
            labels: months.map(d => d.toLocaleDateString('es-CL', { month: 'short', year: '2-digit' })),
            datasets: [{ label: 'Reemplazos', data: mc, backgroundColor: mc.map((_, i) => i === 0 ? '#c83e3a' : i === 1 ? '#f2b705' : '#a6b8c1'), borderRadius: 4 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { min: 0, grid: { color: '#e2e8f0' }, ticks: { stepSize: 1, font: { size: 9 }, color: '#5f7282' } }, x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#5f7282' } } }
        }
    });
}

// ── HISTORIAL ─────────────────────────────────────────────────────────────────
function rendHist() {
    const m = CUR; if (!m) return;
    const all = RECS[m.id] || [];
    const pf = document.getElementById('HF_PH').value, rf = document.getElementById('HF_RE').value;
    const fil = all.filter(r => (pf === '' || r.phase === pf) && (rf === '' || r.reason === rf));
    const today = new Date();

    document.getElementById('H_TOT').textContent = all.length;
    document.getElementById('H_MON').textContent = all.filter(r => { const d = new Date(r.date); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); }).length;
    document.getElementById('H_LST').textContent = all.length ? new Date(all[0].date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) : '—';

    const tc = {}; all.forEach(r => { if (r.tech) tc[r.tech] = (tc[r.tech] || 0) + 1; });
    const top = Object.entries(tc).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('H_TEC').textContent = top ? top[0].split(' ').pop() : '—';

    const empty = document.getElementById('H_EMPTY'), tbl = document.getElementById('H_TBL'), cs = document.getElementById('H_CHSEC');
    if (!fil.length) { empty.style.display = 'block'; tbl.style.display = 'none'; cs.style.display = 'none'; return; }
    empty.style.display = 'none'; tbl.style.display = 'table'; cs.style.display = 'block';

    const rLbl = { programado: 'Programado', critico: 'Crítico', preventivo: 'Preventivo', temperatura: 'Temperatura', bateria: 'Batería', sin_senal: 'Sin señal' };
    const tLbl = { escobilla: 'Esc.', sensor: 'Sensor', ambos: 'Esc.+Sensor' };

    document.getElementById('H_TBODY').innerHTML = fil.map(r => {
        const reasonClass = r.reason === 'critico' ? 'bg-error-50 text-error-600 border-error-500' :
            r.reason === 'programado' ? 'bg-blue-50 text-blue-600 border-blue-500' :
                r.reason === 'preventivo' ? 'bg-success-50 text-success-600 border-success-500' :
                    'bg-warning-50 text-warning-800 border-warning-500';
        return '<tr class="odd:bg-[#f9fafb] hover:bg-gray-50/50 transition-colors">'
            + '<td class="py-3 px-4 text-sm text-gray-900 font-mono font-semibold">' + new Date(r.date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) + '</td>'
            + '<td class="py-3 px-4 font-bold text-sm text-[#0d193c]">' + r.phase + '</td>'
            + '<td class="py-3 px-4 text-sm font-semibold text-gray-900">' + r.brush + '</td>'
            + '<td class="py-3 px-4"><span class="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold bg-gray-50 border border-gray-200 text-gray-900 uppercase">' + (tLbl[r.type] || 'Esc.') + '</span></td>'
            + '<td class="py-3 px-4 font-semibold text-gray-900">' + r.mmOut + ' mm</td>'
            + '<td class="py-3 px-4 font-semibold text-gray-900">' + r.mmIn + ' mm</td>'
            + '<td class="py-3 px-4"><span class="inline-flex items-center px-2 py-0.5 rounded border text-sm font-bold uppercase ' + reasonClass + '">' + (rLbl[r.reason] || r.reason) + '</span></td>'
            + '<td class="py-3 px-4 font-semibold text-sm text-gray-900">' + (r.tech || '—') + '</td>'
            + '<td class="py-3 px-4 text-sm text-gray-900">' + (r.obs || '—') + '</td></tr>';
    }).join('');

    const months = []; for (let i = 5; i >= 0; i--) { const d = new Date(today); d.setDate(1); d.setMonth(d.getMonth() - i); months.push(d); }
    const mc = months.map(ms => { const me = new Date(ms); me.setMonth(me.getMonth() + 1); return all.filter(r => { const d = new Date(r.date); return d >= ms && d < me; }).length; });

    if (chH) chH.destroy();
    chH = new Chart(document.getElementById('H_CHTM'), {
        type: 'bar',
        data: { labels: months.map(d => d.toLocaleDateString('es-CL', { month: 'short', year: '2-digit' })), datasets: [{ label: 'Reemplazos', data: mc, backgroundColor: '#4c86ff', borderRadius: 4 }] },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { min: 0, grid: { color: '#e2e8f0' }, ticks: { stepSize: 1, font: { size: 9 }, color: '#5f7282' } }, x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#5f7282' } } }
        }
    });
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function openModal() {
    if (!CUR) return;
    const ph = getPhases(CUR); const bpf = CUR.brushPerPhase || 5;
    const msel = document.getElementById('f-motor'); msel.innerHTML = '';
    MOTORS.filter(m => m.st === 'run').forEach(m => { const o = document.createElement('option'); o.value = m.id; o.textContent = m.id; if (m.id === CUR.id) o.selected = true; msel.appendChild(o); });
    const phsel = document.getElementById('f-phase'); phsel.innerHTML = '';
    ph.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; phsel.appendChild(o); });
    const bsel = document.getElementById('f-brush'); bsel.innerHTML = '';
    for (let i = 1; i <= bpf; i++) { const o = document.createElement('option'); o.value = i; o.textContent = i; bsel.appendChild(o); }
    const tsel = document.getElementById('f-tech'); tsel.innerHTML = '';
    TECHS_LIST.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; tsel.appendChild(o); });
    document.getElementById('f-date').value = new Date().toISOString().slice(0, 10);
    document.getElementById('f-mmin').value = NOM;
    document.getElementById('f-mmout').value = ''; document.getElementById('f-obs').value = '';
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function saveRec() {
    const mid = document.getElementById('f-motor').value;
    const rec = { date: document.getElementById('f-date').value, phase: document.getElementById('f-phase').value, brush: +document.getElementById('f-brush').value, mmOut: +document.getElementById('f-mmout').value || 0, mmIn: +document.getElementById('f-mmin').value || NOM, type: document.getElementById('f-type').value, reason: document.getElementById('f-reason').value, tech: document.getElementById('f-tech').value, obs: document.getElementById('f-obs').value.trim() };
    if (!RECS[mid]) RECS[mid] = [];
    RECS[mid].unshift(rec); RECS[mid].sort((a, b) => b.date.localeCompare(a.date));
    const mo = MOTORS.find(x => x.id === mid);
    const pi = getPhases(mo).indexOf(rec.phase);
    if (pi >= 0 && MD[mid] && MD[mid][pi] && MD[mid][pi][rec.brush - 1]) {
        if (rec.type === 'escobilla' || rec.type === 'ambos') MD[mid][pi][rec.brush - 1].mm = rec.mmIn;
        if (rec.type === 'sensor' || rec.type === 'ambos') MD[mid][pi][rec.brush - 1].batt = 100;
    }
    closeModal(); rendAll();
    if (CURTAB !== 'hst') switchTab('hst');
}

// ── EXCEL ─────────────────────────────────────────────────────────────────────
function exportXLS() {
    const m = CUR; if (!m || !MD[m.id]) return;
    const wb = XLSX.utils.book_new();
    const now = new Date();
    const ts = now.toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const by = IS_ADMIN ? 'Administrador' : IS_CFG ? 'Configurador' : 'Operador';
    const ph = getPhases(m);
    const meta = [['Compañía:', PLANT.company || '—'], ['Faena:', PLANT.faena || '—'], ['Proceso:', PLANT.process || '—'], ['Exportado:', ts], ['Por:', by], ['Motor:', m.id], []];
    const e1 = [...meta, ['Motor', 'Fase', 'Escobilla', 'Long. (mm)', '% Nominal', 'Estado desgaste', 'Temp (°C)', 'Estado temp', 'Batería (%)', 'Estado batería', 'Intervención (días)', 'Causa']];
    MD[m.id].forEach((phase, pi) => phase.forEach((b, bi) => { const c = combined(b.mm, m.rate, b.batt); e1.push([m.id, ph[pi], bi + 1, fmt1(b.mm), pct(b.mm, m.st), stLbl(wSt(b.mm, m.st)), b.temp, stLbl(tSt(b.temp, m.st)), b.batt, stLbl(bSt(b.batt, m.st)), c.days <= 0 ? 'Inmediato' : c.days, c.cause]); }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(e1), 'Estado actual');
    const e2 = [...meta, ['Fase', 'Esc.', 'Long. actual', 'Vida útil (%)', 'Batería (%)', 'Días desgaste', 'Días batería', 'Intervención', 'Causa', 'Fecha est.', 'Urgencia']];
    MD[m.id].forEach((phase, pi) => phase.forEach((b, bi) => { if (m.st === 'off') return; const c = combined(b.mm, m.rate, b.batt); const lr = Math.max(0, Math.round((b.mm - ulMm()) / (NOM - ulMm()) * 100)); const d = new Date(now); d.setDate(d.getDate() + c.days); e2.push([ph[pi], bi + 1, fmt1(b.mm), lr + '%', b.batt + '%', c.wd, c.bd, c.days <= 0 ? 'Inmediato' : c.days, c.cause, fmtDate(d), urgLbl(c.days)]); }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(e2), 'Proyección');
    const e3 = [...meta, ['Fecha', 'Fase', 'Esc.', 'Tipo', 'Mm ret.', 'Mm inst.', 'Motivo', 'Técnico', 'Obs.']];
    (RECS[m.id] || []).forEach(r => e3.push([r.date, 'Fase ' + r.phase, 'Esc. ' + r.brush, r.type, r.mmOut, r.mmIn, r.reason, r.tech, r.obs]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(e3), 'Historial');
    XLSX.writeFile(wb, 'escobillas_' + m.id + '_' + now.toISOString().slice(0, 16).replace('T', '_').replace(':', '') + '.xlsx');
}

// ── SLIDERS ───────────────────────────────────────────────────────────────────
document.getElementById('S_NOM').addEventListener('input', function () { NOM = +this.value; document.getElementById('SV_NOM').textContent = NOM; document.getElementById('SV_UL').textContent = Math.round(ulMm()); initData(); rendAll(); });
document.getElementById('S_THY').addEventListener('input', function () { THY = +this.value / 100; document.getElementById('SV_THY').textContent = this.value; rendAll(); });
document.getElementById('S_THR').addEventListener('input', function () { THR = +this.value / 100; document.getElementById('SV_THR').textContent = this.value; rendAll(); });
document.getElementById('S_TTY').addEventListener('input', function () { TTY = +this.value; document.getElementById('SV_TTY').textContent = this.value; rendAll(); });
document.getElementById('S_TTR').addEventListener('input', function () { TTR = +this.value; document.getElementById('SV_TTR').textContent = this.value; rendAll(); });
document.getElementById('S_TB').addEventListener('input', function () { TB = +this.value; document.getElementById('SV_TB').textContent = this.value; rendAll(); });
document.getElementById('S_BD').addEventListener('input', function () { BD = +this.value; document.getElementById('SV_BD').textContent = this.value; rendAll(); });
document.getElementById('S_SN').addEventListener('input', function () { SIG_N = +this.value; document.getElementById('SV_SN').textContent = this.value; rendAll(); });
document.getElementById('S_INT').addEventListener('input', function () { SIM_SECS = +this.value * 60; document.getElementById('SV_INT').textContent = this.value; if (simOn) startSim(); });

Chart.defaults.color = '#5f7282';
Chart.defaults.borderColor = '#e2e8f0';
function updTs() {
    const ts = document.getElementById('TS');
    if (!ts) return;
    ts.textContent = new Date().toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── MQTT ───────────────────────────────────────────────────────────────────────
let mqClient = null;
let mqConnected = false;

function toggleMqttPanel() {
    const p = document.getElementById('MQTT_PANEL');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function toggleParametersMetrics() {
    const grid = document.getElementById('PARAM_METRICS_GRID');
    const btn = document.getElementById('BTN_TOGGLE_PARAMS');
    if (!grid || !btn) return;

    const isHidden = grid.style.display === 'none';
    grid.style.display = isHidden ? '' : 'none';
    btn.textContent = isHidden ? 'OCULTAR PARÁMETROS DE OPERACIÓN' : 'VER PARÁMETROS DE OPERACIÓN';
    btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
}

function mqttConnect() {
    const host = document.getElementById('MQ_HOST').value.trim() || 'localhost';
    const port = parseInt(document.getElementById('MQ_PORT').value) || 9001;
    const topic = document.getElementById('MQ_TOPIC').value.trim() || 'wila/sensores';
    const url = 'ws://' + host + ':' + port + '/mqtt';
    mqttSetStatus('connecting', 'Conectando...', '#f2b705'); document.getElementById('MQ_LAST').textContent = 'Intentando ws://' + (document.getElementById('MQ_HOST').value) + ':' + (document.getElementById('MQ_PORT').value);
    try {
        if (mqClient) { try { mqClient.end(true); } catch (e) { } }
        mqClient = mqtt.connect(url, { connectTimeout: 5000, reconnectPeriod: 0, clientId: 'dashboard_' + Math.random().toString(16).slice(2, 8) });
        mqClient.on('connect', () => {
            mqConnected = true;
            mqClient.subscribe(topic + '/#', { qos: 0 });
            mqClient.subscribe(topic, { qos: 0 });
            mqttSetStatus('ok', 'MQTT OK', '#2e8b57');
            document.getElementById('MQ_BTN_CONN').style.display = 'none';
            document.getElementById('MQ_BTN_DISC').style.display = 'inline-flex';
            showToast('MQTT conectado a ' + host + ':' + port);
        });
        mqClient.on('message', (t, payload) => {
            document.getElementById('MQ_LAST').textContent = 'RAW: ' + payload.toString();
            mqttHandleMessage(t, payload.toString());
        });
        mqClient.on('error', e => {
            mqttSetStatus('error', 'Error MQTT', '#c83e3a');
            showToast('Error MQTT: ' + e.message);
        });
        mqClient.on('close', () => {
            if (mqConnected) { mqConnected = false; mqttSetStatus('off', 'Desconectado', '#778a97'); }
        });
    } catch (e) { mqttSetStatus('error', 'Error', '#c83e3a'); showToast('Error al conectar: ' + e.message); }
}

function mqttDisconnect() {
    if (mqClient) { try { mqClient.end(); } catch (e) { } }
    mqClient = null; mqConnected = false;
    mqttSetStatus('off', 'MQTT off', '#778a97');
    document.getElementById('MQ_BTN_CONN').style.display = 'inline-flex';
    document.getElementById('MQ_BTN_DISC').style.display = 'none';
    showToast('MQTT desconectado');
}

function mqttSetStatus(st, label, color) {
    const ico = document.getElementById('MQTT_ICO');
    const txt = document.getElementById('MQTT_ST');
    const chip = document.getElementById('MQTT_CHIP');
    txt.textContent = label; txt.style.color = color;
    ico.style.color = color;
    chip.style.borderColor = (st === 'ok' ? '#2e8b57' : st === 'connecting' ? '#f2b705' : st === 'error' ? '#c83e3a' : 'rgba(255,255,255,0.1)');
}

function mqttHandleMessage(topic, raw) {
    const ts = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('MQ_LAST').textContent = '[' + ts + '] ' + topic + ' → ' + raw;
    try {
        const data = JSON.parse(raw);
        const m = MOTORS.find(x => x.id === 'MAQUETA');
        if (!m) return;
        if (!MD['MAQUETA']) MD['MAQUETA'] = [[]];
        if (!MD['MAQUETA'][0]) MD['MAQUETA'][0] = [];
        if (!MD['MAQUETA'][0][0]) MD['MAQUETA'][0][0] = { mm: NOM, temp: 25, batt: 100, lastSeen: Date.now() };
        const b = MD['MAQUETA'][0][0];
        if (data.mm !== undefined) { const rawVal = +data.mm; b.mm = Math.max(0, Math.round((55 - rawVal) * NOM / 55 * 10) / 10); }
        if (data.longitud !== undefined) b.mm = +data.longitud;
        if (data.temp !== undefined) b.temp = +data.temp;
        if (data.temperatura !== undefined) b.temp = +data.temperatura;
        if (data.batt !== undefined) b.batt = +data.batt;
        if (data.bateria !== undefined) b.batt = +data.bateria;
        if (data.battery !== undefined) b.batt = +data.battery;
        b.lastSeen = Date.now();
        if (m.st === 'off') m.st = 'run';
        const newKey = b.mm + '|' + b.temp + '|' + b.batt;
        if (mqttHandleMessage._lastKey !== newKey) {
            mqttHandleMessage._lastKey = newKey;
            rendAll();
        }
    } catch (e) { }
}

const _origRendGen = rendGen;
const _patchedRendGen = function () {
    _origRendGen.call(this, ...arguments);
    const rows = document.querySelectorAll('#G_MTBL tr');
    rows.forEach(r => {
        if (r.querySelector('strong') && r.querySelector('strong').textContent.trim() === 'MAQUETA') {
            r.style.outline = '1px solid rgba(76, 134, 255, 0.3)';
            r.style.background = 'rgba(76, 134, 255, 0.04)';
        }
    });
};

// updTopbar();
initData();
buildMSel();
rendGen();
updTs();
setInterval(updTs, 60000); startSim();

window.addEventListener('load', () => {
    document.getElementById('MQ_HOST').value = 'localhost';
    document.getElementById('MQ_PORT').value = '9001';
    document.getElementById('MQ_TOPIC').value = 'wila/sensores';
    setTimeout(() => mqttConnect(), 2000);
});

// ── MAQUETA live badge & row highlight ────────────────────────────────────────
const _mqObserver = new MutationObserver(() => {
    document.querySelectorAll('#G_MTBL tr').forEach(r => {
        const strong = r.querySelector('td strong');
        if (strong && strong.textContent.trim() === 'MAQUETA') {
            r.style.outline = '1px solid rgba(76, 134, 255, 0.3)';
            r.style.background = 'rgba(76, 134, 255, 0.04)';
            if (!r.querySelector('.maqueta-live-badge')) {
                const td = r.querySelector('td');
                if (td && !td.querySelector('.maqueta-live-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'maqueta-live-badge';
                    badge.style.cssText = 'display:inline-flex;align-items:center;gap:3px;margin-left:6px;font-size:8px;color:#4c86ff;font-weight:700;text-transform:uppercase;letter-spacing:.4px;border:1px solid #4c86ff;padding:0 4px;border-radius:2px;background:rgba(76,134,255,.08)';
                    badge.innerHTML = '<span style="width:5px;height:5px;border-radius:50%;background:#4c86ff;display:inline-block;animation:mqpulse 1.2s ease-in-out infinite"></span>MQTT';
                    td.appendChild(badge);
                }
            }
        }
    });
});
_mqObserver.observe(document.getElementById('G_MTBL'), { childList: true, subtree: true });

const _mqStyle = document.createElement('style');
_mqStyle.textContent = '@keyframes mqpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(0.7)}}';
document.head.appendChild(_mqStyle);