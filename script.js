// ====== AVVISO PDFMAKE & PRELOAD LOGO ======
window.addEventListener('DOMContentLoaded', () => {
  if (!window.pdfMake) {
    alert('PDF non generato: pdfMake non è caricato. Controlla gli <script> pdfmake nel tuo index.html.');
  }
});

let DEFAULT_LOGO = null;
(async function preloadLogo(){
  try {
    const res = await fetch('logo_saf.jpg', {cache:'no-store'});
    if (res.ok) {
      const blob = await res.blob();
      const r = new FileReader();
      r.onload = e => { DEFAULT_LOGO = e.target.result; };
      r.readAsDataURL(blob);
    }
  } catch(e) { /* ok senza logo */ }
})();

// ====== LOGIN (rspp / sicurezza2025) ======
function login() {
  const u = document.getElementById('username')?.value || '';
  const p = document.getElementById('password')?.value || '';
  if (u.toLowerCase() === 'rspp' && p === 'sicurezza2025') {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
  } else {
    alert('Credenziali errate.');
  }
}

// ====== COSTRUZIONE TABELLE ======
function buildTable(containerId, model) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(model)) return;

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th style="min-width:320px;">Voce di controllo</th>
        <th>SI</th><th>NO</th><th>N.A.</th>
        <th>Valido fino a (se applicabile)</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  container.innerHTML = '';
  container.appendChild(table);

  const tbody = table.querySelector('tbody');
  model.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.lbl}</td>
      <td><input type="radio" name="${c.id}" value="SI"></td>
      <td><input type="radio" name="${c.id}" value="NO"></td>
      <td><input type="radio" name="${c.id}" value="N.A."></td>
      <td>${c.date ? `<input type="date" name="${c.id}_scad">` : ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ====== FIRME (blocco scroll Apple Pencil) ======
function initFirmaCanvas(id) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  let drawing = false;

  const pos = (e) => {
    const r = c.getBoundingClientRect();
    const p = (e.touches ? e.touches[0] : e);
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawing = true;
    ctx.beginPath();
    const { x, y } = pos(e);
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = pos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111';
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = (e) => {
    if (!drawing) return;
    e.preventDefault();
    drawing = false;
  };

  // mouse
  c.addEventListener('mousedown', start, { passive: false });
  c.addEventListener('mousemove', move,   { passive: false });
  window.addEventListener('mouseup', end, { passive: false });
  // touch
  c.addEventListener('touchstart', start, { passive: false });
  c.addEventListener('touchmove',  move,  { passive: false });
  c.addEventListener('touchend',   end,   { passive: false });
  c.addEventListener('touchcancel',end,   { passive: false });
}
function clearFirma(id) {
  const c = document.getElementById(id);
  if (!c) return;
  c.getContext('2d').clearRect(0, 0, c.width, c.height);
}

// ====== SERIALIZZAZIONE ======
function serializeSection(model) {
  const result = { checks:{}, dates:{} };
  model.forEach(c=>{
    const sel = document.querySelector(`input[name="${c.id}"]:checked`);
    result.checks[c.id] = sel ? sel.value : '';
    if (c.date) {
      const v = (document.querySelector(`input[name="${c.id}_scad"]`)?.value || '').trim();
      result.dates[c.id] = v || 'N.A.';
    }
  });
  return result;
}
function serializeAll() {
  const gen = {
    sito: document.getElementById('sito')?.value || '',
    data: document.getElementById('data')?.value || '',
    datore: document.getElementById('datore')?.value || '',
    rspp: document.getElementById('rspp')?.value || '',
    collab: document.getElementById('collab')?.value || '',
    relazione: document.getElementById('relazione')?.value || '',
    sigIsp: document.getElementById('firmaIspettore')?.toDataURL('image/png') || null,
    sigDatore: document.getElementById('firmaDatore')?.toDataURL('image/png') || null,
  };
  const main = serializeSection(window.CHECKS_MAIN || []);
  const spec = serializeSection(window.CHECKS_SPEC || []);
  return { gen, main, spec };
}

// ====== BOZZE ======
function salvaBozza() {
  localStorage.setItem('bozza_sopralluogo', JSON.stringify(serializeAll()));
  alert('Bozza salvata.');
}
function caricaBozza() {
  const raw = localStorage.getItem('bozza_sopralluogo');
  if (!raw) return alert('Nessuna bozza trovata.');
  const d = JSON.parse(raw);
  ['sito','data','datore','rspp','collab','relazione'].forEach(k=>{
    const el = document.getElementById(k); if (el) el.value = d.gen?.[k] || '';
  });
  const restore = (model) => {
    model.forEach(c=>{
      const v = d.main?.checks?.[c.id] ?? d.spec?.checks?.[c.id] ?? '';
      if (v) {
        const inp = document.querySelector(`input[name="${c.id}"][value="${v}"]`);
        if (inp) inp.checked = true;
      }
      if (c.date) {
        const dd = document.querySelector(`input[name="${c.id}_scad"]`);
        const vv = d.main?.dates?.[c.id] ?? d.spec?.dates?.[c.id];
        if (dd && vv && vv !== 'N.A.') dd.value = vv;
      }
    });
  };
  restore(window.CHECKS_MAIN||[]);
  restore(window.CHECKS_SPEC||[]);
}

// ====== PDF ======
function tableRowsFrom(model, dataObj){
  const rows = [ ['Voce', 'Risposta', 'Valido fino a'] ];
  model.forEach(c=>{
    const resp = (dataObj.checks?.[c.id]) || '';
    const val = c.date ? ((dataObj.dates?.[c.id]) || 'N.A.') : 'N.A.';
    rows.push([ c.lbl, resp, val ]);
  });
  return rows;
}

function generaPDF() {
  if (!window.pdfMake) return alert('pdfMake non è caricato: impossibile generare il PDF.');

  const { gen, main, spec } = serializeAll();

  const header = (DEFAULT_LOGO
    ? { columns:[ { image: DEFAULT_LOGO, width:60 }, { text:'Rapporto di Sopralluogo', style:'h1', alignment:'right' } ] }
    : { text:'Rapporto di Sopralluogo', style:'h1' });

  const tabMain = tableRowsFrom(window.CHECKS_MAIN||[], main);
  const tabSpec = tableRowsFrom(window.CHECKS_SPEC||[], spec);

  const dichiarazione = 'Il datore di lavoro accetta e conferma quanto riportato nel presente rapporto di sopralluogo, con riferimento al D.Lgs. 81/08 e s.m.i.';

  const docDefinition = {
    pageMargins:[28,36,28,36],
    content:[
      header,
      { text:`Sito: ${gen.sito}    Data: ${gen.data}`, margin:[0,6,0,2] },
      { text:`Datore di Lavoro: ${gen.datore}    RSPP: ${gen.rspp}    Collab. esterni: ${gen.collab}`, margin:[0,0,0,10] },

      { text:'Checklist generale', style:'h2', margin:[0,4,0,6] },
      { table:{ headerRows:1, widths:['*',80,110], body: tabMain }, layout:'lightHorizontalLines' },

      { text:'\nValutazioni specifiche', style:'h2', margin:[0,10,0,6] },
      { table:{ headerRows:1, widths:['*',80,110], body: tabSpec }, layout:'lightHorizontalLines' },

      { text:'\nRelazione', style:'h2' },
      { text:(gen.relazione || '(nessuna)'), margin:[0,0,0,8] },

      { text:'Dichiarazione', style:'h2' },
      { text:dichiarazione, margin:[0,2,0,10] },

      { columns:[
          [ { text:'Firma Datore di Lavoro', margin:[0,0,0,4] }, (gen.sigDatore?{ image:gen.sigDatore, width:200 }:{ text:'(non firmato)' }) ],
          [ { text:'Firma RSPP',             margin:[0,0,0,4] }, (gen.sigIsp?    { image:gen.sigIsp,     width:200 }:{ text:'(non firmato)' }) ]
        ], columnGap:16, margin:[0,6,0,0]
      }
    ],
    styles:{ h1:{ fontSize:18, bold:true }, h2:{ fontSize:14, bold:true } }
  };

  const nome = `rapporto_sopralluogo_${(gen.sito||'sito').replace(/\s+/g,'_')}_${gen.data||''}.pdf`;
  pdfMake.createPdf(docDefinition).download(nome);
}

// ====== INIT ======
function init() {
  buildTable('checklist-generale', window.CHECKS_MAIN||[]);
  buildTable('checklist-specifiche', window.CHECKS_SPEC||[]);
  initFirmaCanvas('firmaIspettore');
  initFirmaCanvas('firmaDatore');
  // (opzionale) service worker per PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
}
window.addEventListener('DOMContentLoaded', init);

// Esporta globali
window.login = login;
window.clearFirma = clearFirma;
window.salvaBozza = salvaBozza;
window.caricaBozza = caricaBozza;
window.generaPDF = generaPDF;

