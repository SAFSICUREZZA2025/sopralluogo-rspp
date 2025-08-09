/* ====== MODELLI ====== */
const CHECKS_MAIN = [
  {id:'info', lbl:'Effettuata informazione art. 36', date:false},
  {id:'form_gen_spec', lbl:'Formazione generale/specifica (art. 37) aggiornata', date:true},
  {id:'addestramento', lbl:'Addestramento (art. 37 c.5 e art. 73) effettuato', date:false},
  {id:'preposto', lbl:'Preposto nominato e formato', date:false},
  {id:'incendio', lbl:'Formazione antincendio presente e aggiornata', date:true},
  {id:'primo_soccorso', lbl:'Formazione primo soccorso presente e aggiornata', date:true},
  {id:'registro_antincendio', lbl:'Registro antincendio presente', date:false},
  {id:'verbali_riunione', lbl:'Verbali riunione periodica presenti (se >15 dip.)', date:false},
  {id:'piano_emergenza', lbl:'Piano di emergenza e prove effettuate', date:false},
  {id:'dvr', lbl:'DVR presente e aggiornato', date:true},
  {id:'rls', lbl:'RLS interno/esterno', date:true},
  {id:'rspp_int_est', lbl:'RSPP interno/esterno', date:false},
  {id:'mc', lbl:'Nomina del Medico competente e data di nomina', date:true},
  {id:'sorv', lbl:'Ultima sorveglianza sanitaria (visite mediche) effettuata in data', date:true},
  {id:'dpi_consegnati', lbl:'DPI consegnati e utilizzati (foglio consegna presente)', date:false},
  {id:'dpi_terza', lbl:'Presenza di DPI di terza categoria', date:false},
  {id:'addestramento_dpi3', lbl:'Addestramento per DPI 3ª cat. (art.77) effettuato', date:false},
  {id:'libretti_attrezz', lbl:'Libretti attrezzature presenti (carrelli, PLE, ecc.)', date:false},
  {id:'estintori', lbl:'Estintori posizionati e accessibili', date:false},
  {id:'cartellonistica', lbl:'Cartellonistica aggiornata', date:false},
  {id:'squadra_emergenza', lbl:'Presenza squadra emergenza', date:false},
  {id:'cpi', lbl:'Presenza del CPI', date:false},
  {id:'impianto_elettrico', lbl:'Certificato impianto elettrico presente', date:false},
  {id:'messa_terra', lbl:'Data ultima verifica di messa a terra', date:true},
  {id:'ventilazione_illuminazione', lbl:'Ventilazione e illuminazione adeguate', date:false},
  {id:'pulizia_ordine', lbl:'Pulizia e ordine ambienti comuni', date:false},
  {id:'no_infiammabili_non_protetti', lbl:'Assenza materiali infiammabili non protetti', date:false},
  {id:'no_cavi_volanti_ostacoli', lbl:'Assenza cavi volanti e ostacoli', date:false},
  {id:'dpi_indossati', lbl:'DPI indossati correttamente', date:false},
  {id:'chimici_ok', lbl:'Sostanze chimiche stoccate correttamente', date:false},
  {id:'chimici_locale', lbl:'Locale sostanze chimiche arieggiato costantemente', date:false},
  {id:'chimici_armadio', lbl:'Armadio idoneo per stoccaggio sostanze chimiche', date:false},
  {id:'chimici_sds', lbl:'Schede di sicurezza (SDS) disponibili ai lavoratori', date:false},
  {id:'carrelli', lbl:'Presenza di carrelli elevatori', date:false},
  {id:'formazione_carrelli', lbl:'Formazione per uso carrelli elevatori – valido fino a', date:true},
  {id:'ricarica_batt', lbl:'Zona ricarica batterie protetta/arieggiata/cappa', date:false}
];

const CHECKS_SPEC = [
  {id:'atex', lbl:'Valutazione rischio ATEX presente/necessaria', date:false},
  {id:'rischio_incendio_dm20210903', lbl:'Valutazione rischio incendio (DM 03/09/2021) presente', date:false},
  {id:'legionella', lbl:'Valutazione rischio legionella e controlli di manutenzione', date:false},
  {id:'spazi_confinati', lbl:'Spazi confinati/sospetti di inquinamento valutati', date:false},
  {id:'lavori_quota_formazione', lbl:'Lavori in quota: corso di formazione valido fino a', date:true},
  {id:'haccp_manual', lbl:'Manuale HACCP presente e aggiornato', date:false},
  {id:'haccp_formazione', lbl:'Formazione HACCP valida fino a', date:true},
  {id:'corso_sab', lbl:'Corso SAB ex REC valido fino a', date:true},
  {id:'rumore', lbl:'Valutazione rischio Rumore valida fino a', date:true},
  {id:'vibrazioni', lbl:'Valutazione rischio Vibrazioni CI/MB valida fino a', date:true},
  {id:'roa', lbl:'Valutazione rischio ROA valida fino a', date:true},
  {id:'stress', lbl:'Valutazione rischio Stress L.C. valida fino a', date:true},
  {id:'vdt', lbl:'Valutazione rischio Videoterminali valida fino a', date:true},
  {id:'biologico', lbl:'Valutazione rischio Biologico valida fino a', date:true},
  {id:'chimico', lbl:'Valutazione rischio Chimico valida fino a', date:true},
  {id:'mutageno_cancerogeno', lbl:'Valutazione rischio Mutageno/Cancerogeno valida fino a', date:true},
  {id:'mmc', lbl:'Valutazione rischio MMC valida fino a', date:true},
  {id:'ergonomia', lbl:'Valutazione rischio Ergonomia valida fino a', date:true},
  {id:'microclima', lbl:'Valutazione rischio Microclima valida fino a', date:true},
  {id:'esl_laser', lbl:'Obbligo presenza di ESL II con relazione sul LASER presente', date:false}
];

/* ====== LOGIN ====== */
function login(){
  const u=(document.getElementById('username')?.value||'').trim().toLowerCase();
  const p=(document.getElementById('password')?.value||'').trim();
  if(u==='rspp' && p==='sicurezza2025'){
    document.getElementById('login').style.display='none';
    document.getElementById('app').style.display='block';
  }else alert('Credenziali errate.');
}

/* ====== UI ====== */
function buildTable(targetId, model){
  const host=document.getElementById(targetId); if(!host) return;
  host.innerHTML='';
  const tbl=document.createElement('table');
  tbl.innerHTML=`<thead><tr>
    <th style="min-width:320px;">Voce di controllo</th>
    <th>SI</th><th>NO</th><th>N.A.</th><th>Valido fino a (se applicabile)</th>
  </tr></thead><tbody></tbody>`;
  host.appendChild(tbl);
  const tb=tbl.querySelector('tbody');
  model.forEach(c=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${c.lbl}</td>
      <td><input type="radio" name="${c.id}" value="SI"></td>
      <td><input type="radio" name="${c.id}" value="NO"></td>
      <td><input type="radio" name="${c.id}" value="N.A."></td>
      <td>${c.date?`<input type="date" name="${c.id}_scad">`:''}</td>`;
    tb.appendChild(tr);
  });
}

/* ====== FIRME: blocco scroll ====== */
function initSignature(id){
  const c=document.getElementById(id); if(!c) return;
  const ctx=c.getContext('2d'); let drawing=false;
  const pos=e=>{const r=c.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return {x:t.clientX-r.left,y:t.clientY-r.top}};
  const start=e=>{e.preventDefault();drawing=true;ctx.beginPath();const {x,y}=pos(e);ctx.moveTo(x,y)};
  const move =e=>{if(!drawing)return;e.preventDefault();const {x,y}=pos(e);ctx.lineWidth=2;ctx.lineCap='round';ctx.strokeStyle='#111';ctx.lineTo(x,y);ctx.stroke()};
  const end  =e=>{if(!drawing)return;e.preventDefault();drawing=false};
  c.addEventListener('mousedown',start,{passive:false});
  c.addEventListener('mousemove',move,{passive:false});
  window.addEventListener('mouseup',end,{passive:false});
  c.addEventListener('touchstart',start,{passive:false});
  c.addEventListener('touchmove',move,{passive:false});
  c.addEventListener('touchend',end,{passive:false});
  c.addEventListener('touchcancel',end,{passive:false});
}
function clearFirma(id){const c=document.getElementById(id); if(c) c.getContext('2d').clearRect(0,0,c.width,c.height);}

/* ====== SERIALIZE & PDF ====== */
const LOGO_URL='logo_saf.jpg'; let LOGO_B64=null;
(async()=>{try{const r=await fetch(LOGO_URL,{cache:'no-store'});if(r.ok){const b=await r.blob();const fr=new FileReader();fr.onload=e=>LOGO_B64=e.target.result;fr.readAsDataURL(b);}}catch(_){}})();

function collect(model){
  const out={checks:{},dates:{}};
  model.forEach(c=>{
    const v=document.querySelector(`input[name="${c.id}"]:checked`)?.value||'';
    out.checks[c.id]=v;
    if(c.date){ const d=document.querySelector(`input[name="${c.id}_scad"]`)?.value||''; out.dates[c.id]=d||'N.A.'; }
  });
  return out;
}
function serialize(){
  return {
    gen:{
      sito:document.getElementById('sito')?.value||'',
      data:document.getElementById('data')?.value||'',
      datore:document.getElementById('datore')?.value||'',
      rspp:document.getElementById('rspp')?.value||'',
      collab:document.getElementById('collab')?.value||'',
      relazione:document.getElementById('relazione')?.value||'',
      sigRspp:document.getElementById('firmaRspp')?.toDataURL('image/png')||null,
      sigDatore:document.getElementById('firmaDatore')?.toDataURL('image/png')||null
    },
    main:collect(CHECKS_MAIN),
    spec:collect(CHECKS_SPEC)
  };
}
function rows(model,data){const a=[['Voce','Risposta','Valido fino a']];model.forEach(c=>a.push([c.lbl,data.checks[c.id]||'',c.date?(data.dates[c.id]||'N.A.'):'N.A.']));return a;}

function generaPDF(){
  if(!window.pdfMake) return alert('pdfMake non è caricato.');
  const d=serialize();
  const header=LOGO_B64?{columns:[{image:LOGO_B64,width:60},{text:'Rapporto di Sopralluogo',style:'h1',alignment:'right'}]}:{text:'Rapporto di Sopralluogo',style:'h1'};
  const dd={
    pageMargins:[28,36,28,36],
    content:[
      header,
      {text:`Sito: ${d.gen.sito}    Data: ${d.gen.data}`,margin:[0,6,0,2]},
      {text:`Datore di Lavoro: ${d.gen.datore}    RSPP: ${d.gen.rspp}    Collab. esterni: ${d.gen.collab}`,margin:[0,0,0,10]},
      {text:'Checklist generale',style:'h2',margin:[0,4,0,6]},
      {table:{headerRows:1,widths:['*',80,110],body:rows(CHECKS_MAIN,d.main)},layout:'lightHorizontalLines'},
      {text:'\nValutazioni specifiche',style:'h2',margin:[0,10,0,6]},
      {table:{headerRows:1,widths:['*',80,110],body:rows(CHECKS_SPEC,d.spec)},layout:'lightHorizontalLines'},
      {text:'\nRelazione',style:'h2'},{text:(d.gen.relazione||'(nessuna)'),margin:[0,0,0,8]},
      {text:'Dichiarazione',style:'h2'},
      {text:'Il datore di lavoro accetta e conferma quanto riportato nel presente rapporto di sopralluogo, con riferimento al D.Lgs. 81/08 e s.m.i.',margin:[0,2,0,10]},
      {columns:[
        [{text:'Firma Datore di Lavoro',margin:[0,0,0,4]},(d.gen.sigDatore?{image:d.gen.sigDatore,width:200}:{text:'(non firmato)'})],
        [{text:'Firma RSPP',margin:[0,0,0,4]},(d.gen.sigRspp?{image:d.gen.sigRspp,width:200}:{text:'(non firmato)'})]
      ],columnGap:16}
    ],
    styles:{h1:{fontSize:18,bold:true},h2:{fontSize:14,bold:true}}
  };
  const nome=`rapporto_sopralluogo_${(d.gen.sito||'sito').replace(/\s+/g,'_')}_${d.gen.data||''}.pdf`;
  pdfMake.createPdf(dd).download(nome);
}

/* ====== BOZZE ====== */
function salvaBozza(){localStorage.setItem('bozza_sopralluogo',JSON.stringify(serialize()));alert('Bozza salvata.')}
function caricaBozza(){
  const r=localStorage.getItem('bozza_sopralluogo'); if(!r) return alert('Nessuna bozza.');
  const d=JSON.parse(r);
  ['sito','data','datore','rspp','collab','relazione'].forEach(k=>{const e=document.getElementById(k); if(e) e.value=d.gen?.[k]||'';});
  const restore=(model,src)=>model.forEach(c=>{
    const v=src.checks?.[c.id]; if(v){const i=document.querySelector(`input[name="${c.id}"][value="${v}"]`); i&& (i.checked=true);}
    if(c.date){const f=document.querySelector(`input[name="${c.id}_scad"]`); const vv=src.dates?.[c.id]; if(f&&vv&&vv!=='N.A.') f.value=vv;}
  });
  restore(CHECKS_MAIN,d.main||{}); restore(CHECKS_SPEC,d.spec||{});
}

/* ====== INIT ====== */
function init(){
  buildTable('checklist-generale',CHECKS_MAIN);
  buildTable('checklist-specifiche',CHECKS_SPEC);
  initSignature('firmaRspp'); initSignature('firmaDatore');
  if('serviceWorker' in navigator){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}
}
window.addEventListener('DOMContentLoaded',init);

/* expose */
window.login=login; window.generaPDF=generaPDF;
window.salvaBozza=salvaBozza; window.caricaBozza=caricaBozza;
window.clearFirma=clearFirma=function(id){const c=document.getElementById(id); if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);}
