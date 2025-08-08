// ====== AVVISI & PRELOAD LOGO ======
window.addEventListener('DOMContentLoaded', () => {
  if (!window.pdfMake) {
    alert('PDF non generato: pdfMake non è caricato. Controlla gli <script> nel tuo index.html.');
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

// ====== LOGIN (utente: rspp / sicurezza2025) ======
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

// ====== CHECKLIST ======
function buildChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container || typeof CHECKS === 'undefined') return;

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th style="min-width:320px;">Voce di controllo</th>
        <th>SI</th><th>NO</th><th>N.A.</th>
        <th>Valido fino a (se applicabile)</th>
      </tr>
    </thead>
    <tbody id="tbodyChecks"></tbody>
  `;
  container.innerHTML = '';
  container.appendChild(table);

  const tbody = table.querySelector('#tbodyChecks');
  CHECKS.forEach(c => {
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

// ====== FIRME ======
function initFirmaCanvas(id) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  let drawing = false;

  const pos = (e) => {
    const r = c.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x, y };
  };
  const start = (e) => { drawing = true; ctx.beginPath(); const { x, y } = pos(e); ctx.moveTo(x, y); };
  const move = (e) => { if (!drawing) return; const { x, y } = pos(e); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#111'; ctx.lineTo(x, y); ctx.stroke(); };
  const end = () => { drawing = false; };

  c.addEventListener('mousedown', start);
  c.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  c.addEventListener('touchstart', start, { passive: true });
  c.addEventListener('touchmove', move, { passive: true });
  c.addEventListener('touchend', end);
}
function clearFirma(id) {
  const c = document.getElementById(id);
  if (!c) return;
  c.getContext('2d').clearRect(0, 0, c.width, c.height);
}

// ====== BOZZE ======
function serialize() {
  const data = {
    sito: document.getElementById('sito')?.value || '',
    data: document.getElementById('data')?.value || '',
    datore: document.getElementById('datore')?.value || '',
    rspp: document.getElementById('rspp')?.value || '',
    collab: document.getElementById('collab')?.value || '',
    relazione: document.getElementById('relazione')?.value || '',
    checks: {}, dates: {},
    sigIsp: document.getElementById('firmaIspettore')?.toDataURL('image/png') || null,
    sigDatore: document.getElementById('firmaDatore')?.toDataURL('image/png') || null,
  };
  CHECKS.forEach(c => {
    const sel = document.querySelector(`input[name="${c.id}"]:checked`);
    data.checks[c.id] = sel ? sel.value : '';
    if (c.date) {
      const v = (document.querySelector(`input[name="${c.id}_scad"]`)?.value || '').trim();
      data.dates[c.id] = v || 'N.A.';
    }
  });
  return data;
}
function salvaBozza() {
  localStorage.setItem('bozza_sopralluogo', JSON.stringify(serialize()));
  alert('Bozza salvata.');
}
function caricaBozza() {
  const raw = localStorage.getItem('bozza_sopralluogo');
  if (!raw) return alert('Nessuna bozza trovata.');
  const d = JSON.parse(raw);
  ['sito','data','datore','rspp','collab','relazione'].forEach(k=>{
    const el = document.getElementById(k);
    if (el) el.value = d[k] || '';
  });
  CHECKS.forEach(c=>{
    if (d.checks && d.checks[c.id]) {
      const v = d.checks[c.id];
      const inp = document.querySelector(`input[name="${c.id}"][value="${v}"]`);
      if (inp) inp.checked = true;
    }
    if (c.date && d.dates && d.dates[c.id] && d.dates[c.id] !== 'N.A.') {
      const dd = document.querySelector(`input[name="${c.id}_scad"]`);
      if (dd) dd.value = d.dates[c.id];
    }
  });
}

// ====== PDF ======
function generaPDF() {
  if (!window.pdfMake) {
    return alert('pdfMake non è caricato: impossibile generare il PDF.');
  }

  const d = serialize();
  const rows = [ ['Voce', 'Risposta', 'Valido fino a'] ];
  CHECKS.forEach(c=>{
    const resp = d.checks[c.id] || '';
    const val = c.date ? (d.dates[c.id] || 'N.A.') : 'N.A.';
    rows.push([ c.lbl, resp, val ]);
  });

  // Header con LOGO (dataURL) + titolo
  const header = (DEFAULT_LOGO
    ? { columns:[ { image: DEFAULT_LOGO, width:60 }, { text:'Rapporto di Sopralluogo', style:'h1', alignment:'right' } ] }
    : { text:'Rapporto di Sopralluogo', style:'h1' });

  const dichiarazione = 'Il datore di lavoro accetta e conferma quanto riportato nel presente rapporto di sopralluogo, con riferimento al D.Lgs. 81/08 e s.m.i.';

  const docDefinition = {
    pageMargins:[28,36,28,36],
    content:[
      header,
      { text:`Sito: ${d.sito}    Data: ${d.data}`, margin:[0,6,0,2] },
      { text:`Datore di Lavoro: ${d.datore}    RSPP: ${d.rspp}    Collab. esterni: ${d.collab}`, margin:[0,0,0,8] },
      { table:{ headerRows:1, widths:['*', 80, 110], body: rows }, layout:'lightHorizontalLines' },
      { text:'\nRelazione', style:'h2' },
      { text:(d.relazione || '(nessuna)'), margin:[0,0,0,6] },
      { text:'\nDichiarazione', style:'h2' },
      { text:dichiarazione, margin:[0,2,0,8] },
      { columns:[
          [ { text:'Firma Datore di Lavoro', margin:[0,0,0,4] }, (d.sigDatore?{ image:d.sigDatore, width:200 }:{ text:'(non firmato)' }) ],
          [ { text:'Firma RSPP', margin:[0,0,0,4] }, (d.sigIsp?{ image:d.sigIsp, width:200 }:{ text:'(non firmato)' }) ]
        ], columnGap:16, margin:[0,8,0,0]
      }
    ],
    styles:{ h1:{ fontSize:18, bold:true }, h2:{ fontSize:14, bold:true } }
  };

  const nome = `rapporto_sopralluogo_${(d.sito||'sito').replace(/\s+/g,'_')}_${d.data||''}.pdf`;
  pdfMake.createPdf(docDefinition).download(nome);
}

// ====== INIT ======
function init() {
  if (typeof CHECKS !== 'undefined') buildChecklist();
  initFirmaCanvas('firmaIspettore');
  initFirmaCanvas('firmaDatore');
}
window.addEventListener('DOMContentLoaded', init);

// Esporta globali
window.login = login;
window.clearFirma = clearFirma;
window.salvaBozza = salvaBozza;
window.caricaBozza = caricaBozza;
window.generaPDF = generaPDF;
