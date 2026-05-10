import { useState, useEffect, useRef } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ══════════════════════════════════════════════════════════════════════════════
// ── SUPABASE CONFIG ───────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const SUPABASE_URL      = "https://qdagwmavrkkcfijqwkst.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PM8yCP2YcjiEkp7csi_tJw_N4t21RdU";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NICHES = [
  "Moda e Vestuário","Suplementos e Saúde","Eletrônicos","Casa e Decoração",
  "Beleza e Cosméticos","Esportes e Fitness","Alimentos e Bebidas","Pet Shop",
  "Infantil e Brinquedos","Outro",
];

const LOADING_STEPS = [
  { label: "Coletando dados de site e preços",       icon: "🌐" },
  { label: "Processando anúncios e copy",             icon: "📣" },
  { label: "Analisando canais de aquisição",          icon: "📡" },
  { label: "Mapeando sentimento de clientes",         icon: "💬" },
  { label: "Calculando share of voice e tendências",  icon: "📊" },
  { label: "Gerando battlecards e SWOT do cliente",   icon: "⚔️" },
  { label: "Compilando relatório executivo",          icon: "📋" },
];

// ── FONTS & GLOBAL CSS ─────────────────────────────────────────────────────────
const fonts = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');

@keyframes pulse    { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
@keyframes fadein   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes stepIn   { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
@keyframes alertIn  { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:translateX(0)} }
@keyframes shimmer  { 0%{opacity:.5} 50%{opacity:1} 100%{opacity:.5} }
@keyframes loginIn  { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes glowPulse{ 0%,100%{box-shadow:0 0 20px rgba(200,240,96,0.06)} 50%{box-shadow:0 0 44px rgba(200,240,96,0.14)} }
@keyframes gridDrift{ from{opacity:0} to{opacity:1} }
@keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes radarIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
@keyframes barGrow  { from{width:0} to{width:var(--bar-w)} }

select option { background:#161618; color:#e8e6e0 }
input::placeholder, textarea::placeholder { color:#4a4845 }
input:focus, textarea:focus, select:focus {
  border-color: rgba(200,240,96,0.4) !important;
  box-shadow: 0 0 0 3px rgba(200,240,96,0.06) !important;
  outline: none;
}
* { box-sizing:border-box; margin:0; padding:0 }
::-webkit-scrollbar { width:4px }
::-webkit-scrollbar-track { background:#0e0e0f }
::-webkit-scrollbar-thumb { background:#2a2a2c; border-radius:2px }

@media print {
  /* ── SUPPRIME CABEÇALHO/RODAPÉ DO NAVEGADOR (URL, timestamp, nº página) ─────
   * @page com margem mínima força Chrome/Edge a omitir headers/footers padrão
   * no modo "Padrão". Para garantia total: print dialog → Mais opções → desmarcar
   * "Cabeçalhos e rodapés". Funciona em ~90% dos casos sem intervenção do usuário.
   * ─────────────────────────────────────────────────────────────────────────── */
  @page {
    margin: 0.45in 0.55in 0.5in 0.55in;
    size: A4 portrait;
  }
  .no-print         { display:none !important }
  .print-page-break { page-break-before:always }
  body              { background:#fff !important; -webkit-print-color-adjust:exact; print-color-adjust:exact }
  .print-root       { background:#fff !important; color:#111 !important }

  /* ── CORREÇÃO LEGIBILIDADE PDF ──────────────────────────────────────────────
   * Muitos elementos usam cores inline do modo escuro (rgba branco, #7a7870, etc.)
   * que ficam invisíveis num fundo branco. Esta regra força TODO texto dentro do
   * relatório a ser escuro, depois restaura cores específicas via classes nomeadas.
   * Não afeta a tela — só entra em ação no @media print.
   * ─────────────────────────────────────────────────────────────────────────── */
  .print-root *     { color:#1a1a1a !important }

  /* Restore named accent colors */
  .print-lime       { color:#2d6600 !important }
  .print-cyan       { color:#005060 !important }
  .print-purple     { color:#4a2070 !important }
  .print-orange     { color:#7a3a00 !important }
  .print-red        { color:#7a0000 !important }
  .print-muted      { color:#555 !important }
  .print-label      { color:#444 !important }

  /* Card backgrounds */
  .print-card       { background:#f8f8f8 !important; border:0.5px solid #ddd !important; break-inside:avoid; margin-bottom:12px !important }
  .print-bar-track  { background:#e5e5e5 !important }
  .print-divider    { border-color:#ddd !important }
  .print-alert      { background:#fffbe6 !important; border-color:#d4b000 !important }
  .print-insight    { background:#f0f8e0 !important; border-color:#6a9800 !important }
  .print-insight-text { font-weight:600 !important }
  .print-opp        { background:#f0f8e0 !important; border-color:#6a9800 !important }
  .print-gap-row    { background:#f5f5f5 !important }
  .print-action     { background:#f5f5f5 !important }
  .print-footer     { display:flex !important }
  .print-swot-q     { background:#f5f5f5 !important; border-color:#ddd !important }
  .print-battlecard { background:#f0f0f8 !important; border-color:#aaaacc !important }
  .print-thermo     { background:#fafafa !important; border-color:#ddd !important }
  .print-sentiment  { background:#f5f5f5 !important }
  .print-radar      { display:none !important }
}`;

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────────
const S = {
  bg:      { background:"#0e0e0f", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", color:"#e8e6e0" },
  wrap:    { maxWidth:740, margin:"0 auto", padding:"2rem 1.25rem 5rem" },
  card:    { background:"#161618", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1.4rem" },
  label:   { fontSize:11, fontFamily:"'DM Mono',monospace", color:"#7a7870", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6, display:"block" },
  input:   { width:"100%", background:"#0e0e0f", border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"10px 12px", color:"#e8e6e0", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color 0.15s" },
  ta:      { width:"100%", background:"#0e0e0f", border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"10px 12px", color:"#e8e6e0", fontSize:12.5, fontFamily:"'DM Mono',monospace", outline:"none", resize:"vertical", minHeight:80, lineHeight:1.7, transition:"border-color 0.15s" },
  btn:     { background:"#c8f060", color:"#0e0e0f", border:"none", borderRadius:6, padding:"10px 22px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"opacity 0.15s,background 0.25s" },
  ghost:   { background:"none", color:"#7a7870", border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"10px 20px", fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.15s,color 0.15s" },
  eyebrow: { fontFamily:"'DM Mono',monospace", fontSize:11, color:"#c8f060", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 },
  h1:      { fontFamily:"'Fraunces',serif", fontWeight:300, fontSize:"1.9rem", lineHeight:1.2, marginBottom:"0.5rem" },
  muted:   { color:"#7a7870", fontSize:13, lineHeight:1.6 },
};

const COMP_COLORS = ["#c8f060","#60d4f0","#f0a060","#d4a0f0","#f05050","#60f0a0"];

// ── UTILITÁRIOS ────────────────────────────────────────────────────────────────
const titleCase = (str = "") =>
  str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const normName = (str = "") => {
  const stopWords = new Set(["de","do","da","dos","das","e","em","na","no","para","com","por"]);
  return str.split(" ").map((w, i) =>
    i === 0 || !stopWords.has(w.toLowerCase())
      ? w.charAt(0).toUpperCase() + w.slice(1)
      : w.toLowerCase()
  ).join(" ");
};

// ── SANITIZAÇÃO v8 — Filtro de metadados de debugging ──────────────────────────
// Remove notas internas do modelo que vazam para o output final.
// Padrões como [FRAQUEZA POSSIVELMENTE COPIADA - revise], [TODO], [?] etc.
// destroem a autoridade do produto quando vistos pelo cliente.
const DEBUG_PATTERNS = [
  /\[FRAQUEZA POSSIVELMENTE COPIADA.*?\]/gi,
  /\[revise?\]/gi,
  /\[TODO.*?\]/gi,
  /\[FIXME.*?\]/gi,
  /\[CHECK.*?\]/gi,
  /\[\s*\?\s*\]/g,
  /\[estimativa[^\]]*\]/gi,
  /\[AMEAÇA GENÉRICA DETECTADA[^\]]*\]/gi,
  /⚠️\s*\[AMEAÇA GENÉRICA[^\]]*\]:\s*/gi,
  /⚠️\s*\[FRAQUEZA POSSIVELMENTE[^\]]*\]:\s*/gi,
];

function sanitizeOutput(text) {
  if (typeof text !== "string") return text;
  return DEBUG_PATTERNS.reduce((t, p) => t.replace(p, ""), text).replace(/\s{2,}/g, " ").trim();
}

// Aplica sanitização recursiva em todos os campos de texto de um objeto
function sanitizeAllFields(obj) {
  if (typeof obj === "string") return sanitizeOutput(obj);
  if (Array.isArray(obj)) return obj.map(item => sanitizeAllFields(item));
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeAllFields(value);
    }
    return result;
  }
  return obj;
}

// ── CORREÇÃO TERMÔMETRO: calcula score a partir dos dados reais ────────────────
// A IA tendia a retornar sempre 80–90. Esta função usa os 8 scores reais de cada
// concorrente ponderados pelo nível de ameaça para um resultado honesto e variável.
const calcThermoScore = (concorrentes = []) => {
  const valid = concorrentes.filter(c => !c.fora_do_setor);
  if (!valid.length) return null; // sem concorrentes válidos, mantém o valor da IA
  const weights  = { alto:1.3, medio:1.0, baixo:0.7 };
  const metrics  = [
    "forca_marca","agressividade_ads","autoridade_social","percepcao_preco",
    "qualidade_ux","velocidade_crescimento","diversificacao_canais","retencao_clientes",
  ];
  let totalScore = 0, totalWeight = 0;
  valid.forEach(c => {
    const w   = weights[c.nivel_ameaca] || 1.0;
    const avg = metrics.reduce((s, m) => s + (Number(c[m]) || 0), 0) / metrics.length;
    totalScore  += avg * w;
    totalWeight += w;
  });
  const score = Math.round(totalWeight > 0 ? totalScore / totalWeight : 50);
  // Escala: ≥75 = crítico | ≥55 = alto | ≥35 = moderado | <35 = baixo
  const nivel = score >= 75 ? "critico" : score >= 55 ? "alto" : score >= 35 ? "moderado" : "baixo";
  return { score, nivel };
};

// ══════════════════════════════════════════════════════════════════════════════
// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function ScoreBar({ label, value, color="#c8f060" }) {
  return (
    <div style={{ marginBottom:11 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span className="print-muted" style={{ fontSize:11.5, color:"#7a7870" }}>{label}</span>
        <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color }}>{value}</span>
      </div>
      <div className="print-bar-track" style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
        <div style={{ height:"100%", width:`${value}%`, background:color, borderRadius:2, transition:"width 1.2s ease" }}/>
      </div>
    </div>
  );
}

function Badge({ level }) {
  const map = {
    alto:  { bg:"rgba(240,80,80,0.1)",  c:"#f05050", b:"rgba(240,80,80,0.25)",  label:"Tier 1 — Vigilância Ativa" },
    medio: { bg:"rgba(240,160,96,0.1)", c:"#f0a060", b:"rgba(240,160,96,0.25)", label:"Tier 2 — Monitoramento" },
    baixo: { bg:"rgba(200,240,96,0.1)", c:"#c8f060", b:"rgba(200,240,96,0.25)", label:"Tier 3 — Baixa Prioridade" },
  };
  const t = map[level] || map.medio;
  return (
    <span style={{ background:t.bg, color:t.c, border:`0.5px solid ${t.b}`, borderRadius:4, padding:"3px 10px", fontSize:10.5, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em" }}>
      {t.label}
    </span>
  );
}

function TrendBadge({ trend }) {
  const map = {
    acelerando:    { icon:"↑", color:"#c8f060", bg:"rgba(200,240,96,0.1)",  label:"Acelerando" },
    estavel:       { icon:"→", color:"#f0a060", bg:"rgba(240,160,96,0.1)",  label:"Estável" },
    desacelerando: { icon:"↓", color:"#f05050", bg:"rgba(240,80,80,0.1)",   label:"Desacelerando" },
  };
  const t = map[trend] || map.estavel;
  return (
    <span style={{ background:t.bg, color:t.color, borderRadius:4, padding:"3px 8px", fontSize:10, fontFamily:"'DM Mono',monospace", display:"inline-flex", alignItems:"center", gap:3 }}>
      {t.icon} {t.label}
    </span>
  );
}

function ActionTag({ prefix, value, map }) {
  const colors = map[value] || { bg:"rgba(255,255,255,0.05)", c:"#7a7870" };
  return (
    <span style={{ background:colors.bg, color:colors.c, borderRadius:4, padding:"2px 7px", fontSize:9.5, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em" }}>
      {prefix}: {value}
    </span>
  );
}

function Steps({ current }) {
  const steps = ["Cliente","Concorrentes","Dados","Análise"];
  const idx   = ["setup","competitors","collect","results"].indexOf(current);
  return (
    <div className="no-print" style={{ display:"flex", gap:8, marginBottom:28, alignItems:"center" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{
            width:22, height:22, borderRadius:"50%",
            background: i<=idx ? "rgba(200,240,96,0.15)" : "rgba(255,255,255,0.05)",
            border: `0.5px solid ${i<=idx ? "rgba(200,240,96,0.4)" : "rgba(255,255,255,0.1)"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:10.5, fontFamily:"'DM Mono',monospace",
            color: i<=idx ? "#c8f060" : "#4a4845",
          }}>{i+1}</div>
          <span style={{ fontSize:12, color: i===idx ? "#e8e6e0" : i<idx ? "#7a7870" : "#4a4845" }}>{s}</span>
          {i < steps.length-1 && <div style={{ width:24, height:0.5, background:"rgba(255,255,255,0.07)" }}/>}
        </div>
      ))}
    </div>
  );
}

function Dots({ color="#c8f060" }) {  {/* FIX: era #0e0e0f (fundo) — dots eram invisíveis */}
  return (
    <span style={{ display:"inline-flex", gap:4, alignItems:"center" }}>
      {[0,1,2].map(j => (
        <span key={j} style={{ width:4, height:4, borderRadius:"50%", background:color, display:"inline-block", animation:`pulse 0.8s ${j*0.16}s infinite` }}/>
      ))}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── CREDIBILIDADE & METODOLOGIA ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// ── Calcula confiança dos dados por concorrente ────────────────────────────────
// Responde à crítica "números decorativos": o badge mostra ao leitor se os scores
// vêm de dados reais inseridos ou de estimativa da IA com base em sinais públicos.
function calcDataConfidence(comp) {
  const fields = [
    { key:"siteData",          weight:2,   label:"Site/Produtos" },
    { key:"adsData",           weight:2,   label:"Anúncios" },
    { key:"reviewsData",       weight:1.5, label:"Reviews" },
    { key:"socialData",        weight:1.5, label:"Social" },
    { key:"predictedChannels", weight:1,   label:"Canais" },
    { key:"predictedAudience", weight:1,   label:"Público" },
  ];
  let filled = 0, total = 0;
  const sources = [];
  fields.forEach(f => {
    total += f.weight;
    if (comp[f.key] && comp[f.key].trim().length > 30) {
      filled += f.weight;
      sources.push(f.label);
    }
  });
  const pct = total > 0 ? filled / total : 0;
  if (pct >= 0.7) return { level:"alta",  label:"Dados verificados", color:"#c8f060", icon:"✦", sources };
  if (pct >= 0.35) return { level:"media", label:"Dados parciais",    color:"#f0a060", icon:"◈", sources };
  return              { level:"baixa", label:"Estimativa IA",      color:"#f08060", icon:"◇", sources };
}

function DataConfidenceBadge({ comp }) {
  const conf = calcDataConfidence(comp);
  return (
    <span
      title={`Confiança: ${conf.label}${conf.sources.length ? " — fontes: " + conf.sources.join(", ") : " — nenhum dado manual fornecido"}`}
      style={{ background:"rgba(255,255,255,0.04)", border:`0.5px solid rgba(255,255,255,0.1)`,
        borderRadius:4, padding:"2px 8px", fontSize:10, fontFamily:"'DM Mono',monospace",
        color:conf.color, letterSpacing:"0.05em", cursor:"default" }}>
      {conf.icon} {conf.label}
    </span>
  );
}

// ── Painel de metodologia colapsível ──────────────────────────────────────────
// Transforma "números decorativos" em números com contexto. Mostra ao cliente
// exatamente COMO cada score é derivado — aumentando percepção de valor e honestidade.
function MetodologiaSection({ compsData = [] }) {
  const [open, setOpen] = useState(false);
  const hasAdsData     = compsData.some(c => c.adsData?.trim().length > 10);
  const hasReviewsData = compsData.some(c => c.reviewsData?.trim().length > 10);
  const hasSocialData  = compsData.some(c => c.socialData?.trim().length > 10);

  const scoreItems = [
    ["Força de marca",       "Reconhecimento estimado: presença orgânica, menções públicas, histórico da marca, domínio de keyword de marca vs concorrentes no nicho."],
    ["Agressividade em ads", "Volume de mídia paga: sinais do Meta Ads Library, Google Shopping, densidade de criativos detectados, frequência de promoções e ofertas."],
    ["Autoridade social",    "Presença em redes sociais: seguidores estimados, frequência de posts, engajamento aparente, uso de influencers e UGC detectado."],
    ["Percepção de preço",   "Posicionamento RELATIVO no nicho: 0 = mais barato do mercado, 100 = mais caro. Score alto ≠ qualidade alta — indica ticket acima da média."],
    ["Qualidade UX/site",    "Indicadores de conversão: clareza de CTA, mobile-first, velocidade aparente, copy de persuasão, checkout simplificado, proposta de valor clara."],
    ["Velocidade crescimento","Tendência de expansão: novos produtos, canais, parcerias, aumento de presença digital e/ou física detectados no período recente."],
    ["Diversif. de canais",  "Variedade de canais de aquisição: Meta + Google + TikTok + SEO + Email + Marketplace + Influencer. Mais canais = menos dependência de um único."],
    ["Retenção de clientes", "Mecanismos de recorrência: programa de fidelidade, email/CRM, clube VIP, assinatura, remarketing e NPS estimado via reviews detectados."],
  ];

  return (
    <div className="print-card" style={{ ...S.card, marginBottom:14, borderColor:"rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background:"none", border:"none", cursor:"pointer", width:"100%", textAlign:"left",
          display:"flex", justifyContent:"space-between", alignItems:"center", padding:0 }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a4845", letterSpacing:"0.1em" }}>
          🔬 METODOLOGIA & TRANSPARÊNCIA DE DADOS
        </div>
        <span style={{ fontSize:11, color:"#3a3835" }}>{open ? "▲ fechar" : "▼ ver como os scores são calculados"}</span>
      </button>

      {open && (
        <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:14, animation:"fadein 0.25s ease" }}>

          {/* Aviso de estimativa */}
          <div style={{ fontSize:12, color:"#c8a060", lineHeight:1.75, padding:"10px 14px",
            background:"rgba(240,160,96,0.06)", borderRadius:6, borderLeft:"2px solid rgba(240,160,96,0.35)" }}>
            <strong>Aviso:</strong> Os scores, percentuais e rankings são <strong>estimativas baseadas em sinais públicos</strong> analisados por IA no momento da geração. Não representam dados auditados ou métricas extraídas de plataformas de analytics. Recomendamos validação humana dos pontos críticos antes de decisões de investimento significativas.
          </div>

          {/* Tabela de scores */}
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#c8f060", marginBottom:10, letterSpacing:"0.08em" }}>
              DEFINIÇÃO DE CADA SCORE (ESCALA 0–100, POSIÇÃO RELATIVA NO NICHO)
            </div>
            {scoreItems.map(([label, desc], i) => (
              <div key={i} style={{ display:"flex", gap:12, padding:"8px 10px", alignItems:"flex-start",
                background: i%2===0 ? "rgba(255,255,255,0.02)" : "transparent", borderRadius:4, marginBottom:2 }}>
                <div style={{ fontSize:11.5, fontWeight:500, color:"#b8b0a8", minWidth:165, flexShrink:0 }}>{label}</div>
                <div style={{ fontSize:11, color:"#5a5855", lineHeight:1.65 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Termômetro */}
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#60d4f0", marginBottom:8, letterSpacing:"0.08em" }}>
              FÓRMULA DO TERMÔMETRO COMPETITIVO
            </div>
            <div style={{ fontSize:11.5, color:"#5a5855", lineHeight:1.75, padding:"10px 14px",
              background:"rgba(96,212,240,0.04)", borderRadius:6, borderLeft:"2px solid rgba(96,212,240,0.2)" }}>
              Score = média ponderada dos 8 scores de cada concorrente × peso do nível de ameaça<br/>
              (ameaça alto = ×1.3 | médio = ×1.0 | baixo = ×0.7)<br/>
              Calculado no frontend a partir dos dados da IA — não é um número arbitrário.<br/>
              <strong style={{ color:"#60d4f0" }}>Escala:</strong> &lt;35 = Baixo · 35–54 = Moderado · 55–74 = Alto · ≥75 = Crítico
            </div>
          </div>

          {/* Share of Voice */}
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#d4a0f0", marginBottom:8, letterSpacing:"0.08em" }}>
              SHARE OF VOICE — COMO É ESTIMADO
            </div>
            <div style={{ fontSize:11.5, color:"#5a5855", lineHeight:1.65, padding:"10px 14px",
              background:"rgba(212,160,240,0.04)", borderRadius:6, borderLeft:"2px solid rgba(212,160,240,0.2)" }}>
              Estimativa de visibilidade relativa no mercado baseada em: presença orgânica, volume de ads detectado, autoridade social e histórico da marca. <strong style={{ color:"#c8a0e8" }}>Não é dado de tráfego real</strong> — é uma heurística comparativa para benchmark de posicionamento.
            </div>
          </div>

          {/* Fontes */}
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#f0a060", marginBottom:8, letterSpacing:"0.08em" }}>
              FONTES DE DADOS CONSULTADAS
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {[
                "Site/landing pages (preços, CTAs, copy)","SERP Google (posicionamento orgânico)","Meta Ads Library (volume de criativos)","Marketplaces (ML/Shopee — preços, reviews)","Perfis sociais públicos (Instagram, TikTok)","Conhecimento base treinado (pré-cutoff)","Dados inseridos manualmente (se houver)",
              ].map((src, i) => (
                <span key={i} style={{ fontSize:10.5, fontFamily:"'DM Mono',monospace", color:"#4a4845",
                  background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.07)",
                  borderRadius:4, padding:"3px 9px" }}>
                  {src}
                </span>
              ))}
              {hasAdsData && <span style={{ fontSize:10.5, fontFamily:"'DM Mono',monospace", color:"#c8f060", background:"rgba(200,240,96,0.06)", border:"0.5px solid rgba(200,240,96,0.2)", borderRadius:4, padding:"3px 9px" }}>✓ Dados de anúncios (inseridos)</span>}
              {hasReviewsData && <span style={{ fontSize:10.5, fontFamily:"'DM Mono',monospace", color:"#c8f060", background:"rgba(200,240,96,0.06)", border:"0.5px solid rgba(200,240,96,0.2)", borderRadius:4, padding:"3px 9px" }}>✓ Reviews reais (inseridos)</span>}
              {hasSocialData && <span style={{ fontSize:10.5, fontFamily:"'DM Mono',monospace", color:"#c8f060", background:"rgba(200,240,96,0.06)", border:"0.5px solid rgba(200,240,96,0.2)", borderRadius:4, padding:"3px 9px" }}>✓ Social/TikTok (inseridos)</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── VISUAL COMPONENTS (NOVOS) ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// ── TERMÔMETRO COMPETITIVO ────────────────────────────────────────────────────
function CompetitiveThermometer({ termometro }) {
  if (!termometro) return null;
  const levelMap = {
    critico:  { color:"#f05050", bg:"rgba(240,80,80,0.07)",   border:"rgba(240,80,80,0.25)",   label:"CRÍTICO",  icon:"🔴" },
    alto:     { color:"#f0a060", bg:"rgba(240,160,96,0.07)",  border:"rgba(240,160,96,0.25)",  label:"ALTO",     icon:"🟠" },
    moderado: { color:"#f0d060", bg:"rgba(240,208,96,0.07)",  border:"rgba(240,208,96,0.25)",  label:"MODERADO", icon:"🟡" },
    baixo:    { color:"#c8f060", bg:"rgba(200,240,96,0.07)",  border:"rgba(200,240,96,0.25)",  label:"BAIXO",    icon:"🟢" },
  };
  const t = levelMap[termometro.nivel] || levelMap.moderado;
  const score = termometro.score || 0;
  return (
    <div className="print-thermo print-card" style={{ ...S.card, marginBottom:14, background:t.bg, borderColor:t.border, animation:"fadein 0.3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
        <div style={{ flex:1 }}>
          <div className="print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:t.color, letterSpacing:"0.12em", marginBottom:7 }}>
            {t.icon} TERMÔMETRO COMPETITIVO — NÍVEL {t.label}
          </div>
          <p className="print-muted" style={{ fontSize:13, color:"#ccc8c0", lineHeight:1.65, maxWidth:480 }}>
            {termometro.descricao}
          </p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0 }}>
          <div style={{ fontSize:34, fontWeight:300, fontFamily:"'Fraunces',serif", color:t.color, lineHeight:1 }}>{score}</div>
          <div className="print-muted" style={{ fontSize:9, fontFamily:"'DM Mono',monospace", color:"rgba(255,255,255,0.22)" }}>/ 100</div>
          <div style={{ width:64, height:5, background:"rgba(255,255,255,0.07)", borderRadius:3 }}>
            <div style={{ height:"100%", width:`${score}%`, background:t.color, borderRadius:3, transition:"width 1.4s ease" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SHARE OF VOICE ─────────────────────────────────────────────────────────────
function ShareOfVoiceSection({ data, clientName }) {
  if (!data?.length) return null;
  const sorted = [...data].sort((a, b) => b.percentual_estimado - a.percentual_estimado);
  const total  = sorted.reduce((s, i) => s + (i.percentual_estimado || 0), 0);
  const outros = Math.max(0, 100 - total);
  const showOutros = outros >= 5;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
      {sorted.map((item, i) => {
        const isClient = item.nome === clientName || item.nome === normName(clientName);
        const color = isClient ? "#c8f060" : COMP_COLORS[(i + 1) % COMP_COLORS.length];
        const pct = Math.min(100, Math.max(0, item.percentual_estimado || 0));
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:120, fontSize:11.5, color: isClient ? "#e8e6e0" : "#8a8680", textAlign:"right", flexShrink:0, fontFamily: isClient ? "'DM Sans',sans-serif" : undefined, fontWeight: isClient ? 500 : 400 }}>
              {normName(item.nome)}
            </div>
            <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.05)", borderRadius:3 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:3, transition:"width 1.3s ease", opacity: isClient ? 1 : 0.65 }}/>
            </div>
            <div style={{ width:38, fontSize:10.5, fontFamily:"'DM Mono',monospace", color: isClient ? color : "#4a4845", flexShrink:0 }}>
              {pct}%
            </div>
          </div>
        );
      })}
      {showOutros && (
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:120, fontSize:11.5, color:"#3a3835", textAlign:"right", flexShrink:0, fontStyle:"italic" }}>
            Outros players
          </div>
          <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.05)", borderRadius:3 }}>
            <div style={{ height:"100%", width:`${outros}%`, background:"rgba(255,255,255,0.12)", borderRadius:3 }}/>
          </div>
          <div style={{ width:38, fontSize:10.5, fontFamily:"'DM Mono',monospace", color:"#3a3835", flexShrink:0 }}>
            {outros}%
          </div>
        </div>
      )}
      <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"#3a3835", marginTop:4 }}>
        * estimativa baseada em: presença orgânica (SERPs), volume de criativos ativos (Meta Ads Library), seguidores e engajamento (perfis públicos) e autoridade de domínio — não é dado de tráfego auditado
      </div>
    </div>
  );
}

// ── RADAR CHART ───────────────────────────────────────────────────────────────
function RadarChart({ competitors }) {
  if (!competitors?.length) return null;
  const SIZE = 270, CX = SIZE / 2, CY = SIZE / 2, R = SIZE * 0.34;
  const dims = [
    { key:"forca_marca",            label:"Marca"       },
    { key:"agressividade_ads",      label:"Ads"         },
    { key:"autoridade_social",      label:"Social"      },
    { key:"percepcao_preco",        label:"Preço"       },
    { key:"qualidade_ux",           label:"UX/Site"     },
    { key:"velocidade_crescimento", label:"Crescimento" },
    { key:"diversificacao_canais",  label:"Canais"      },
    { key:"retencao_clientes",      label:"Retenção"    },
  ];
  const N = dims.length;
  const ang  = i => (i * 2 * Math.PI / N) - Math.PI / 2;
  const pt   = (i, v) => { const a = ang(i), r = (v / 100) * R; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
  const lPt  = i => { const a = ang(i), r = R + 24; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };

  return (
    <div className="print-radar" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, animation:"radarIn 0.6s ease" }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow:"visible" }}>
        {[20,40,60,80,100].map(lv => (
          <polygon key={lv}
            points={dims.map((_, i) => pt(i, lv).join(",")).join(" ")}
            fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth={0.5}/>
        ))}
        {dims.map((_, i) => {
          const [x2, y2] = pt(i, 100);
          return <line key={i} x1={CX} y1={CY} x2={x2} y2={y2} stroke="rgba(255,255,255,0.07)" strokeWidth={0.5}/>;
        })}
        {dims.map((d, i) => {
          const [lx, ly] = lPt(i);
          return (
            <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize={8.5} fill="rgba(255,255,255,0.32)" fontFamily="DM Mono, monospace">{d.label}</text>
          );
        })}
        {[20,40,60,80].map(lv => {
          const [px, py] = pt(0, lv);
          return <text key={lv} x={px+3} y={py} fontSize={7} fill="rgba(255,255,255,0.18)" fontFamily="DM Mono, monospace">{lv}</text>;
        })}
        {competitors.map((comp, ci) => {
          const color = COMP_COLORS[ci % COMP_COLORS.length];
          const pts = dims.map((d, i) => pt(i, comp[d.key] || 0).join(",")).join(" ");
          return (
            <g key={ci}>
              <polygon points={pts} fill={`${color}15`} stroke={color} strokeWidth={1.5} strokeLinejoin="round" opacity={0.88}/>
              {dims.map((d, i) => { const [px, py] = pt(i, comp[d.key] || 0); return <circle key={i} cx={px} cy={py} r={2.5} fill={color} opacity={0.8}/>; })}
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r={2} fill="rgba(255,255,255,0.14)"/>
      </svg>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap", justifyContent:"center" }}>
        {competitors.map((c, ci) => (
          <div key={ci} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:COMP_COLORS[ci % COMP_COLORS.length] }}/>
            <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"#6a6865" }}>{c.nome}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ACTION PRIORITY MATRIX ─────────────────────────────────────────────────────
function ActionPriorityMatrix({ actions }) {
  if (!actions?.length) return null;
  const effMap = { alto:0.82, medio:0.5, baixo:0.18 };
  const impMap = { alto:0.18, medio:0.5, baixo:0.82 }; // inverted (high impact = top)
  const urgColor = { alta:"#f05050", media:"#f0a060", baixa:"#c8f060" };
  const W = 286, H = 224, P = 38;
  const IW = W - P * 2, IH = H - P * 2;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
        <rect x={P} y={P} width={IW/2} height={IH/2} fill="rgba(200,240,96,0.03)" rx={2}/>
        <rect x={P+IW/2} y={P} width={IW/2} height={IH/2} fill="rgba(200,240,96,0.06)" rx={2}/>
        <rect x={P} y={P+IH/2} width={IW/2} height={IH/2} fill="rgba(255,255,255,0.015)" rx={2}/>
        <rect x={P+IW/2} y={P+IH/2} width={IW/2} height={IH/2} fill="rgba(240,160,96,0.03)" rx={2}/>
        <line x1={P} y1={P} x2={P} y2={P+IH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5}/>
        <line x1={P} y1={P+IH} x2={P+IW} y2={P+IH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5}/>
        <line x1={P+IW/2} y1={P} x2={P+IW/2} y2={P+IH} stroke="rgba(255,255,255,0.045)" strokeWidth={0.5} strokeDasharray="3,3"/>
        <line x1={P} y1={P+IH/2} x2={P+IW} y2={P+IH/2} stroke="rgba(255,255,255,0.045)" strokeWidth={0.5} strokeDasharray="3,3"/>
        <text x={P+IW*0.25} y={P+14} textAnchor="middle" fontSize={7.5} fill="rgba(200,240,96,0.28)" fontFamily="DM Mono, monospace">QUICK WIN</text>
        <text x={P+IW*0.75} y={P+14} textAnchor="middle" fontSize={7.5} fill="rgba(200,240,96,0.38)" fontFamily="DM Mono, monospace">ESTRATÉGICO</text>
        <text x={P+IW*0.25} y={P+IH-7} textAnchor="middle" fontSize={7.5} fill="rgba(255,255,255,0.12)" fontFamily="DM Mono, monospace">BAIXA PRIORIDADE</text>
        <text x={P+IW*0.75} y={P+IH-7} textAnchor="middle" fontSize={7.5} fill="rgba(240,160,96,0.28)" fontFamily="DM Mono, monospace">LONGO PRAZO</text>
        <text x={P+IW/2} y={H-5} textAnchor="middle" fontSize={7.5} fill="rgba(255,255,255,0.22)" fontFamily="DM Mono, monospace">ESFORÇO →</text>
        <text x={9} y={P+IH/2} textAnchor="middle" fontSize={7.5} fill="rgba(255,255,255,0.22)" fontFamily="DM Mono, monospace" transform={`rotate(-90,9,${P+IH/2})`}>IMPACTO →</text>
        {actions.map((a, i) => {
          const ex = effMap[a.esforco] || 0.5;
          const iy = impMap[a.impacto] || 0.5;
          // Jitter inteligente: evita sobreposição de dots com offset angular por índice
          const angle = (i * 137.5 * Math.PI) / 180; // golden angle spacing
          const jitterR = 10;
          const jx = (i === 0) ? 0 : Math.cos(angle) * jitterR * (i * 0.3);
          const jy = (i === 0) ? 0 : Math.sin(angle) * jitterR * (i * 0.3);
          const dotX = Math.min(P + IW - 16, Math.max(P + 16, P + IW * ex + jx));
          const dotY = Math.min(P + IH - 16, Math.max(P + 16, P + IH * iy + jy));
          const c = urgColor[a.urgencia] || "#f0a060";
          return (
            <g key={i}>
              <circle cx={dotX} cy={dotY} r={12} fill={`${c}1a`} stroke={c} strokeWidth={1}/>
              <text x={dotX} y={dotY+0.5} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={c} fontFamily="DM Mono, monospace" fontWeight="bold">{i+1}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
        {[["alta","#f05050","Urgência Alta"],["media","#f0a060","Urgência Média"],["baixa","#c8f060","Urgência Baixa"]].map(([u,c,l]) => (
          <div key={u} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:c, opacity:0.7 }}/>
            <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"#4a4845" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SWOT MATRIX ───────────────────────────────────────────────────────────────
function SWOTMatrix({ swot }) {
  if (!swot) return null;
  const qs = [
    { key:"forcas",        label:"FORÇAS",        icon:"💪", color:"#c8f060", bg:"rgba(200,240,96,0.05)",  border:"rgba(200,240,96,0.18)" },
    { key:"fraquezas",     label:"FRAQUEZAS",     icon:"⚠️",  color:"#f05050", bg:"rgba(240,80,80,0.05)",  border:"rgba(240,80,80,0.18)"  },
    { key:"oportunidades", label:"OPORTUNIDADES", icon:"🚀", color:"#60d4f0", bg:"rgba(96,212,240,0.05)", border:"rgba(96,212,240,0.18)" },
    { key:"ameacas",       label:"AMEAÇAS",       icon:"⚔️",  color:"#f0a060", bg:"rgba(240,160,96,0.05)", border:"rgba(240,160,96,0.18)" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
      {qs.map(q => (
        <div key={q.key} className="print-swot-q" style={{ padding:"12px 14px", background:q.bg, borderRadius:8, border:`0.5px solid ${q.border}` }}>
          <div className="print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:q.color, marginBottom:8, letterSpacing:"0.1em" }}>
            {q.icon} {q.label}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {(swot[q.key] || []).map((item, j) => (
              <div key={j} className="print-muted" style={{ fontSize:11.5, color:"#b8b4ac", lineHeight:1.55, display:"flex", gap:6 }}>
                <span style={{ color:q.color, flexShrink:0 }}>·</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── BATTLECARD ─────────────────────────────────────────────────────────────────
function BattleCard({ battlecard, compName, clientName }) {
  if (!battlecard) return null;
  return (
    <div className="print-battlecard" style={{ padding:"12px 14px", background:"rgba(100,80,200,0.04)", borderRadius:8, border:"0.5px solid rgba(100,80,200,0.18)", marginTop:10 }}>
      <div className="print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(175,155,235,0.75)", marginBottom:10, letterSpacing:"0.1em" }}>
        ⚔️ BATTLECARD — {(clientName||"").toUpperCase()} VS {(compName||"").toUpperCase()}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <div style={{ padding:"8px 10px", background:"rgba(200,240,96,0.04)", borderRadius:6, borderLeft:"2px solid rgba(200,240,96,0.28)" }}>
          <div className="print-lime" style={{ fontSize:9.5, fontFamily:"'DM Mono',monospace", color:"rgba(200,240,96,0.55)", marginBottom:5 }}>✓ QUANDO GANHAMOS</div>
          <div className="print-muted" style={{ fontSize:11.5, color:"#b0c8a0", lineHeight:1.6 }}>{battlecard.quando_ganhamos}</div>
        </div>
        <div style={{ padding:"8px 10px", background:"rgba(240,80,80,0.04)", borderRadius:6, borderLeft:"2px solid rgba(240,80,80,0.28)" }}>
          <div className="print-red" style={{ fontSize:9.5, fontFamily:"'DM Mono',monospace", color:"rgba(240,80,80,0.55)", marginBottom:5 }}>✗ QUANDO PERDEMOS</div>
          <div className="print-muted" style={{ fontSize:11.5, color:"#cca8a8", lineHeight:1.6 }}>{battlecard.quando_perdemos}</div>
        </div>
      </div>
      <div style={{ padding:"9px 12px", background:"rgba(175,155,235,0.05)", borderRadius:6, borderLeft:"2px solid rgba(175,155,235,0.28)" }}>
        <div className="print-purple" style={{ fontSize:9.5, fontFamily:"'DM Mono',monospace", color:"rgba(175,155,235,0.6)", marginBottom:5 }}>🎯 VETOR DE ATAQUE PRIORITÁRIO</div>
        <div className="print-muted" style={{ fontSize:12, color:"#c8c0de", lineHeight:1.65, fontWeight:500 }}>{battlecard.vetor_ataque_prioritario || battlecard.argumento_principal}</div>
      </div>
    </div>
  );
}

// ── SENTIMENT BAR ─────────────────────────────────────────────────────────────
function SentimentSection({ sentimento }) {
  if (!sentimento) return null;
  const score = sentimento.score_reputacao || 0;
  const scoreColor = score >= 70 ? "#c8f060" : score >= 45 ? "#f0a060" : "#f05050";
  return (
    <div className="print-sentiment" style={{ padding:"10px 14px", background:"rgba(255,255,255,0.02)", borderRadius:8, border:"0.5px solid rgba(255,255,255,0.07)", marginTop:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div className="print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(200,160,240,0.65)", letterSpacing:"0.1em" }}>
          💬 SENTIMENTO DOS CLIENTES
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span className="print-muted" style={{ fontSize:9.5, fontFamily:"'DM Mono',monospace", color:"#5a5855" }}>reputação</span>
          <span style={{ fontSize:13, fontFamily:"'DM Mono',monospace", color:scoreColor, fontWeight:500 }}>{score}/100</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div>
          <div className="print-lime" style={{ fontSize:9.5, fontFamily:"'DM Mono',monospace", color:"rgba(200,240,96,0.5)", marginBottom:5 }}>✓ O que elogiam</div>
          {(sentimento.positivos || []).map((p, j) => (
            <div key={j} className="print-muted" style={{ fontSize:11.5, color:"#a8c4a0", lineHeight:1.55, marginBottom:3, display:"flex", gap:5 }}>
              <span style={{ color:"rgba(200,240,96,0.4)", flexShrink:0 }}>+</span>{p}
            </div>
          ))}
        </div>
        <div>
          <div className="print-red" style={{ fontSize:9.5, fontFamily:"'DM Mono',monospace", color:"rgba(240,80,80,0.5)", marginBottom:5 }}>✗ O que criticam</div>
          {(sentimento.negativos || []).map((n, j) => (
            <div key={j} className="print-muted" style={{ fontSize:11.5, color:"#c4a0a0", lineHeight:1.55, marginBottom:3, display:"flex", gap:5 }}>
              <span style={{ color:"rgba(240,80,80,0.4)", flexShrink:0 }}>−</span>{n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── BACKEND CALL — Via Supabase Edge Function ─────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// BUG FIX #1: Groq retorna formato OpenAI (choices[0].message.content),
// não formato Anthropic (content[].text). Esta função normaliza os dois.
function extractText(data) {
  // Formato Groq / OpenAI
  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  // Formato Anthropic Claude (fallback)
  if (Array.isArray(data?.content)) {
    return data.content.filter(b => b.type === "text").map(b => b.text || "").join("");
  }
  return "";
}

// BUG FIX #5: extrator robusto de JSON — tolera preambles e postambles do modelo.
// O NVIDIA/Groq às vezes retorna "Aqui está o JSON:" antes do { ou texto depois do }.
// JSON.parse("Aqui está {...}") → SyntaxError: Unexpected token 'A'
// Esta função localiza o primeiro { e último } e extrai apenas o JSON.
function robustParseJSON(raw) {
  if (!raw) throw new Error("Resposta vazia da IA.");

  // 1. Remove blocos de markdown ```json ... ```
  let txt = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

  // 2. Localiza o primeiro { e o último } — descarta qualquer texto antes/depois
  const start = txt.indexOf("{");
  const end   = txt.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`A IA não retornou JSON válido. Resposta recebida: "${txt.slice(0, 120)}..."`);
  }
  const jsonStr = txt.slice(start, end + 1);

  // 3. Tenta parse direto
  try {
    return JSON.parse(jsonStr);
  } catch (_) {}

  // 4. Fallback: remove vírgulas antes de } ou ] (JSON trailing comma — erro comum de LLMs)
  const cleaned = jsonStr
    .replace(/,\s*([}\]])/g, "$1")   // trailing commas
    .replace(/[\u0000-\u001F\u007F]/g, " "); // caracteres de controle
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`JSON inválido mesmo após limpeza: ${e.message}. Trecho: "${jsonStr.slice(0, 200)}"`);
  }
}

async function callMarketIntelligence(payload, session, signal = null) {
  if (!session?.access_token) throw new Error("Acesso negado: faça login para usar a inteligência de mercado.");
  const fetchOpts = {
    method: "POST",
    headers: { "Content-Type":"application/json", "apikey":SUPABASE_ANON_KEY, "Authorization":`Bearer ${session.access_token}` },
    body: JSON.stringify(payload),
  };
  // BUG FIX #3: passa o AbortSignal para poder cancelar a requisição por timeout
  if (signal) fetchOpts.signal = signal;
  const res = await fetch(`${SUPABASE_URL}/functions/v1/rapid-processor`, fetchOpts);
  if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
  if (res.status === 429) throw new Error("Limite de uso atingido. Tente novamente em instantes.");
  const data = await res.json();
  if (data.error) throw new Error(typeof data.error === "string" ? data.error : data.error?.message || "Erro na Edge Function.");
  return data;
}

// ══════════════════════════════════════════════════════════════════════════════
// ── MAIN APP ──────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {

  // ── AUTH STATE ─────────────────────────────────────────────────────────────
  const [screen, setScreen]               = useState("loading");
  const [session, setSession]             = useState(null);
  const [activeUser, setActiveUser]       = useState(null);
  const [authTab, setAuthTab]             = useState("login");
  const [loginForm, setLoginForm]         = useState({ email:"", password:"" });
  const [signupForm, setSignupForm]       = useState({ email:"", password:"", name:"" });
  const [loginErr, setLoginErr]           = useState("");
  const [signupErr, setSignupErr]         = useState("");
  const [signupOk, setSignupOk]           = useState(false);
  const [loginLoading, setLoginLoading]   = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ── ANALYSIS STATE ─────────────────────────────────────────────────────────
  const [step, setStep]         = useState("setup");
  const [client, setClient]     = useState({ name:"", niche:"", objective:"", diferenciais:"", fraquezas_conhecidas:"" });
  const [comps, setComps]       = useState([{ name:"", url:"", siteData:"", adsData:"", reviewsData:"", socialData:"", predictedChannels:"", predictedAudience:"" }]);
  const [results, setResults]   = useState(null);
  const [err, setErr]           = useState(null);
  const [ci, setCi]             = useState(0);
  const [copied, setCopied]     = useState(false);
  const [analyzing, setAnalyzing]   = useState(false);
  const [scraping, setScraping]     = useState({});
  const [loadingStep, setLoadingStep] = useState(0);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [showSaved, setShowSaved]   = useState(false);
  const loadingTimerRef = useRef(null);
  // BUG FIX #4: ref para poder cancelar fetch por timeout
  const abortControllerRef = useRef(null);

  const buildActiveUser = u => ({
    id: u.id, email: u.email,
    name:   u.user_metadata?.name || u.user_metadata?.full_name || u.email.split("@")[0],
    role:   "Assinante",
    avatar: (u.user_metadata?.name || u.email)[0].toUpperCase(),
  });

  const loadUserAnalyses = async () => {
    setHistoryLoading(true);
    const { data, error } = await supabase
      .from("analises_concorrencia")
      .select("id, cliente_nome, nicho, created_at, resultados_json, dados_cliente")
      .order("created_at", { ascending:false }).limit(10);
    if (!error && data) {
      setSavedAnalyses(data.map(row => ({
        id: row.id, client: row.cliente_nome, niche: row.nicho,
        date: new Date(row.created_at).toLocaleDateString("pt-BR"),
        results: row.resultados_json, client_info: row.dados_cliente || {},
      })));
    }
    setHistoryLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) { setSession(s); setActiveUser(buildActiveUser(s.user)); setScreen("app"); loadUserAnalyses(); }
      else setScreen("login");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) { setActiveUser(buildActiveUser(s.user)); setScreen("app"); }
      else { setActiveUser(null); setSavedAnalyses([]); setScreen("login"); }
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line

  // BUG FIX #3: load DEVE vir antes do save.
  // Se save vem primeiro, ele grava estado vazio na montagem e o load
  // restaura esse estado vazio em vez dos dados reais salvos.
  useEffect(() => { try { const s = localStorage.getItem("ic_v6_client"); if (s) setClient(JSON.parse(s)); } catch (_) {} }, []);
  useEffect(() => { try { localStorage.setItem("ic_v6_client", JSON.stringify(client)); } catch (_) {} }, [client]);

  useEffect(() => {
    if (step === "analyzing") {
      setLoadingStep(0);
      loadingTimerRef.current = setInterval(() => {
        setLoadingStep(prev => { if (prev < LOADING_STEPS.length - 1) return prev + 1; clearInterval(loadingTimerRef.current); return prev; });
      }, 1300);
    } else clearInterval(loadingTimerRef.current);
    return () => clearInterval(loadingTimerRef.current);
  }, [step]);

  const valid   = comps.filter(c => c.name.trim());
  const upd     = (i, f, v) => { const u = [...comps]; u[i] = { ...u[i], [f]:v }; setComps(u); };
  const realIdx = (name) => comps.findIndex(c => c.name === name);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) { setLoginErr("Preencha email e senha para continuar."); return; }
    setLoginLoading(true); setLoginErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginForm.email.trim(), password: loginForm.password });
    if (error) {
      setLoginErr(error.message.includes("Invalid login") ? "Email ou senha incorretos." : error.message.includes("Email not confirmed") ? "Confirme seu email antes de entrar." : error.message);
      setLoginLoading(false); return;
    }
    await loadUserAnalyses(); setLoginLoading(false);
  };

  // ── CADASTRO ───────────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!signupForm.email || !signupForm.password || !signupForm.name) { setSignupErr("Preencha todos os campos."); return; }
    if (signupForm.password.length < 6) { setSignupErr("A senha deve ter pelo menos 6 caracteres."); return; }
    setLoginLoading(true); setSignupErr(""); setSignupOk(false);
    const { error } = await supabase.auth.signUp({ email: signupForm.email.trim(), password: signupForm.password, options: { data: { name: signupForm.name.trim() } } });
    if (error) setSignupErr(error.message.includes("already registered") ? "Este email já está cadastrado." : error.message);
    else setSignupOk(true);
    setLoginLoading(false);
  };

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStep("setup"); setResults(null); setLoginForm({ email:"", password:"" });
    setSignupForm({ email:"", password:"", name:"" }); setSignupOk(false); setAuthTab("login");
  };

  // ── AUTO-SCRAPE ────────────────────────────────────────────────────────────
  const autoScrape = async (compIdx) => {
    if (!session) { setErr("Faça login para usar a auto-coleta."); return; }
    const comp = comps[compIdx];
    if (!comp.url) return;
    setScraping(prev => ({ ...prev, [compIdx]:"loading" })); setErr(null);
    try {
      const data = await callMarketIntelligence({
        provider: "groq",   // ← Groq: rápido para scraping (~2s)
        max_tokens: 1800,
        messages: [{ role:"user", content:
`Você é um analista de inteligência competitiva. Pesquise e analise o concorrente abaixo com foco em como ele se DIFERENCIA do cliente que está fazendo a análise.

CONCORRENTE ANALISADO: ${comp.name || "desconhecida"} (${comp.url})
NICHO: ${client.niche || "e-commerce"}
CLIENTE QUE FAZ A ANÁLISE: ${client.name || "não informado"}
${client.diferenciais ? `DIFERENCIAIS CONHECIDOS DO CLIENTE: ${client.diferenciais}` : ""}

Responda em português com EXATAMENTE estas 3 seções. Seja específico e use dados reais — não generalize.

**DADOS DO SITE**
- Principais produtos e categorias (cite nomes reais se possível)
- Faixa de preços detectada (valores reais ou estimados)
- CTAs principais usados (copy exato ou próximo)
- Proposta de valor central (em 1 frase)
- Promoções e gatilhos de urgência detectados
- Diferenciais competitivos que eles ENFATIZAM vs concorrentes
- Tom de voz: classifique (urgente / aspiracional / técnico / popular / premium / emocional) e explique com 1 exemplo concreto
- Velocidade estimada de crescimento: acelerando / estável / desacelerando — e por quê

**CANAIS DE AQUISIÇÃO PREVISTOS**
Preveja os 3-5 canais mais prováveis onde ${comp.name} investe em aquisição. Para cada um:
- Canal (ex: Meta Ads, Google Shopping, TikTok Ads, Influencers, SEO...)
- Prioridade: 🔴 Alta / 🟡 Média / 🟢 Baixa
- Justificativa baseada em evidências reais (tom, preços, público, posicionamento)
NÃO liste todos — só os mais prováveis com razão real.

**PÚBLICO-ALVO INFERIDO**
Com base em evidências concretas detectadas:
- Faixa etária estimada e gênero predominante
- Classe social / poder aquisitivo e como isso se reflete no pricing
- Motivações de compra DESTA marca especificamente (não genéricas do nicho)
- Principais objeções e medos que o marketing deles tenta vencer
- Perfil psicográfico em 2-3 linhas (estilo de vida, valores, aspirações)
- DIFERENCIAL DE PÚBLICO vs ${client.name || "o cliente"}: em que segmento eles competem mais diretamente?

Seja cirúrgico. Nenhum bullet genérico — cada ponto deve ser específico a ${comp.name}.

**AVISO CRÍTICO DE SETOR**
O cliente que está fazendo a análise é do nicho: ${client.niche || "não informado"}.
Se ${comp.name} opera em um setor DIFERENTE desse nicho, inicie sua resposta com uma linha:
⚠️ FORA DO SETOR: [nome da empresa] opera no setor [setor real], não em [nicho do cliente]. Esta análise terá valor limitado para comparação competitiva direta.
Mesmo assim, continue a análise normalmente para fins de benchmark.` }],
      }, session);
      const text = extractText(data); // BUG FIX #1: suporte a formato Groq e Anthropic
      const siteMatch    = text.match(/\*\*DADOS DO SITE\*\*([\s\S]*?)(?=\*\*CANAIS|$)/i);
      const channelMatch = text.match(/\*\*CANAIS DE AQUISIÇÃO PREVISTOS\*\*([\s\S]*?)(?=\*\*PÚBLICO|$)/i);
      const audienceMatch= text.match(/\*\*PÚBLICO-ALVO INFERIDO\*\*([\s\S]*?)$/i);
      const newComps = [...comps];
      const sectorWarning = text.includes("⚠️ FORA DO SETOR") || text.includes("FORA DO SETOR");
      newComps[compIdx] = {
        ...newComps[compIdx],
        siteData:          siteMatch     ? siteMatch[1].trim()     : text || "Nenhum dado retornado.",
        predictedChannels: channelMatch  ? channelMatch[1].trim()  : "",
        predictedAudience: audienceMatch ? audienceMatch[1].trim() : "",
        fora_do_setor:     sectorWarning, // BUG FIX #2: era foraDosSetor (camelCase), incompatível com o resto do código
      };
      setComps(newComps);
      setScraping(prev => ({ ...prev, [compIdx]:"done" }));
    } catch (e) {
      setScraping(prev => ({ ...prev, [compIdx]:"error" }));
      setErr(e.message);
    }
  };

  // ── ANALYZE ────────────────────────────────────────────────────────────────
  const analyze = async () => {
    if (!session) { setErr("Faça login para gerar análises."); return; }
    setStep("analyzing"); setErr(null); setAnalyzing(true);

    // ── PROMPT v10 — ANTI-GENÉRICO + INTELIGÊNCIA DE EVIDÊNCIA ────────────────
    const prompt = `Você é um analista sênior de inteligência competitiva de um dos maiores fundos de venture capital do Brasil.
Você analisa e-commerce, varejo e startups. Seus clientes pagam R$ 5.000 a R$ 30.000 por relatório.
Você é BRUTALMENTE ESPECÍFICO. Nunca escreve algo que possa servir para qualquer empresa.

═══════════════════════════════════════════════════════════
CONTEXTO DO CLIENTE
═══════════════════════════════════════════════════════════
EMPRESA CLIENTE: ${client.name}
NICHO: ${client.niche}
OBJETIVO: ${client.objective || "Identificar oportunidades de diferenciação e riscos competitivos reais"}
${client.diferenciais ? `DIFERENCIAIS DO CLIENTE: ${client.diferenciais}` : ""}
${client.fraquezas_conhecidas ? `PONTOS FRACOS DO CLIENTE: ${client.fraquezas_conhecidas}` : ""}

═══════════════════════════════════════════════════════════
DADOS DOS CONCORRENTES
═══════════════════════════════════════════════════════════
${valid.map(c => `--- ${c.name} | ${c.url || "URL não informada"} ---
SITE/PRODUTOS/PREÇOS: ${c.siteData || "use seu conhecimento sobre esta empresa"}
ANÚNCIOS: ${c.adsData || "não fornecido"}
REVIEWS: ${c.reviewsData || "não fornecido"}
SOCIAL/TIKTOK: ${c.socialData || "não fornecido"}
CANAIS: ${c.predictedChannels || "não analisado"}
PÚBLICO: ${c.predictedAudience || "não analisado"}`).join("\n\n")}

═══════════════════════════════════════════════════════════
⛔ BLACKLIST DE LINGUAGEM — PROIBIDO USAR QUALQUER DESSAS FRASES
═══════════════════════════════════════════════════════════
As frases abaixo invalidam a análise por serem genéricas ao ponto de não terem valor informacional.
Se você escrevê-las, o relatório será rejeitado:

PROIBIDO (use a alternativa específica ao lado):
• "alta qualidade" → cite o produto/ingrediente/material específico que justifica
• "presença online forte" → cite canal + métrica estimada (ex: "~85k seguidores no Instagram, 4% engajamento")
• "conteúdo de alta qualidade" → cite o formato + frequência + tipo (ex: "Reels UGC 3x/semana com depoimentos pré-treino")
• "crescente demanda por [nicho]" → isso é dado macro, não inteligência competitiva — substitua por movimento específico de concorrente
• "abordagem holística" → descreva o portfólio real ou a estratégia observável
• "produtos e serviços" → cite os produtos reais pelo nome ou categoria específica
• "melhorar a presença nas redes sociais" → cite qual rede, qual formato, qual gap vs concorrente
• "parceria com influenciadores" → cite o tipo de influencer (micro/macro), nicho, plataforma, formato de conteúdo
• "programa de fidelidade" → cite o mecanismo específico (pontos, cashback, clube VIP, subscription)
• "atendimento ao cliente eficiente" → cite evidência (NPS, tempo de resposta, canal, menções em reviews)
• "experiência personalizada" → cite o mecanismo específico de personalização
• "aumentar visibilidade da marca" → cite canal + formato + benchmark de resultado
• "necessidade de [algo genérico]" → gaps devem ser LACUNAS NÃO ATENDIDAS por nenhum concorrente, com evidência

═══════════════════════════════════════════════════════════
REGRAS DE CONSISTÊNCIA — VIOLAÇÃO INVALIDA A ANÁLISE
═══════════════════════════════════════════════════════════

REGRA 1 — SWOT DO CLIENTE É DERIVADO DA COMPARAÇÃO, NÃO DE TEMPLATE:
  • forcas: baseadas nas FRAQUEZAS REAIS dos concorrentes. Não invente.
  • fraquezas: onde os concorrentes são SUPERIORES. Cite o concorrente.
  • NÃO copie fraquezas dos concorrentes como fraquezas do cliente.

REGRA 2 — BATTLECARD LOGICAMENTE INVERSO:
  • quando_ganhamos: cenário baseado nas fraquezas do concorrente
  • quando_perdemos: cenário baseado nas forças do concorrente
  • Nunca podem dizer a mesma coisa.

REGRA 3 — ALERTAS COM IMPACTO QUANTIFICADO:
  • Formato: "⚡ [Concorrente]: [ação específica com dado] — impacto: [consequência mensurável para ${client.name}]"
  • Ex correto: "⚡ Titan: lançou linha pre-workout com frete grátis acima de R$ 150 — impacto: ${client.name} pode perder 15-20% dos pedidos de ticket médio nessa faixa"
  • Ex errado: "⚡ Titan: oferece produtos de qualidade" ← PROIBIDO

REGRA 4 — CONSISTÊNCIA INTERNA DE SCORES:
  • agressividade_ads alta (>70) → velocidade_crescimento deve ser ≥ 55
  • score_reputacao baixo (<40) → retencao_clientes deve ser ≤ 50
  • Os 8 scores devem contar uma história coerente.

REGRA 5 — GAPS SÃO LACUNAS REAIS DO MERCADO:
  • gaps_mercado = necessidades NÃO atendidas por nenhum concorrente analisado
  • Cite a evidência da lacuna (ex: "nenhum player oferece teste grátis de 7 dias — 3 reviews mencionam essa ausência")
  • Proibido: gaps genéricos de mercado sem rastreabilidade

REGRA 6 — AMEAÇAS NO SWOT CITAM PLAYERS REAIS:
  • PROIBIDO: "mudanças regulatórias", "recessão econômica", "mudanças no mercado"
  • OBRIGATÓRIO: "Titan lançando linha própria de..." ou "entrada de [player] no segmento de..."

REGRA 7 — ALERTAS CAUSAM DOR PARA O CLIENTE, NÃO ELOGIAM O CONCORRENTE:
  • O leitor é ${client.name}. O alerta deve fazer ele sentir urgência de agir.

REGRA 8 — MÍNIMOS OBRIGATÓRIOS:
  • top5_acoes: EXATAMENTE 5, nunca menos
  • gaps_mercado: mínimo 4
  • alertas_detectados: 3–5, apenas de concorrentes do mesmo setor
  • share_of_voice: incluir ${client.name} + todos os concorrentes do mesmo setor

REGRA 9 — VALIDAÇÃO DE SETOR:
  • Concorrente em setor diferente → fora_do_setor: true, não inclua no share_of_voice, não gere alertas de competição direta

REGRA 10 — SCORES JUSTIFICÁVEIS:
  • Acima de 75 exige evidência forte. Abaixo de 30 exige evidência de fraqueza clara.
  • Sem dados suficientes → score entre 40–60 (zona de incerteza honesta)

REGRA 11 — INTELIGÊNCIA CRIATIVA OBRIGATÓRIA (campo "inteligencia_criativa"):
  • Para cada concorrente, descreva o que eles fazem criativamente de forma OBSERVÁVEL:
  - Formatos de anúncio (UGC, carrossel, antes/depois, depoimento, unboxing, tutorial)
  - Hook de abertura típico dos criativos (as primeiras 3 segundos do vídeo ou a headline do anúncio)
  - Tipo de prova social usada (review em texto, antes/depois, nota de estrelas, "X clientes satisfeitos")
  - Copy de produto: como descrevem os benefícios (técnico, emocional, urgência, FOMO)
  - Uso de influencer: micro (10k-100k), macro (100k+), categoria (fitness, saúde, beleza, etc.)

REGRA 12 — MÉTRICAS ESTIMADAS COM RANGES (campo "metricas_estimadas"):
  • Forneça ranges honestos — nunca números exatos inventados
  • Formato: "~X–Y [unidade]" para deixar claro que é estimativa
  • Seguidores Instagram: ex: "~50k–80k"
  • Frequência de posts: ex: "~4–6x/semana"
  • Ticket médio: ex: "~R$ 120–180"
  • Engajamento estimado: ex: "~2–4% (perfil ativo com conteúdo regular)"
  • Se não tiver base: "desconhecido — dados insuficientes"

REGRA 13 — INSIGHT PRIORITÁRIO NÃO-ÓBVIO (campo "insight_prioritario"):
  • PROIBIDO: insights que qualquer empresa em qualquer setor poderia receber
  • PROIBIDO: "desenvolver marketing", "aumentar presença online", "melhorar conversão" sem especificidade
  • OBRIGATÓRIO: o insight deve ser algo que ${client.name} NÃO SABERIA sem esta análise
  • Formato: "[Descoberta não-óbvia] — porque [evidência específica detectada nos concorrentes/mercado]. Ação imediata: [tática específica com canal + formato + meta] em [prazo realista]."
  • Exemplo correto: "Titan é vulnerável na faixa R$ 80–120: nenhum produto nessa faixa com certificação natural. ${client.name} pode capturar esse segmento com SKU específico antes do próximo lançamento de Titan (previsto por padrão histórico de Q3)."

REGRA 14 — AÇÕES TÁTICAS, NÃO INTENÇÕES (campo "top5_acoes"):
  • PROIBIDO: "Desenvolver estratégia de marketing" — isso é intenção
  • OBRIGATÓRIO: especificar canal + formato + orçamento estimado + público + KPI
  • Formato: "Lançar [X] no [canal] com [formato específico], segmentado para [público], com orçamento de R$ [range]/dia, meta de [KPI] em [prazo]"
  • Exemplo correto: "Criar série de 8 Reels UGC no Instagram mostrando [diferencial específico vs concorrente], segmentado para 25-40 anos classe B/C, R$ 50-80/dia de impulsionamento, meta: 300 conversões em 60 dias"

REGRA 15 — SWOT SEM ESPELHO INTERNO (campo "matriz_swot_cliente"):
  • É PROIBIDO ter um item em FORÇAS que contradiz diretamente um item em FRAQUEZAS
  • É PROIBIDO ter uma ação no top5_acoes que resolve algo listado como FORÇA
  • Exemplos de contradições proibidas:
    - FORÇA: "Estratégia de marketing eficaz" + FRAQUEZA: "Falta de presença online" + AÇÃO: "Desenvolver marketing" → INVÁLIDO
    - FORÇA: "Preços competitivos" + FRAQUEZA: "Preços acima do mercado" → INVÁLIDO
  • Antes de gerar o SWOT, revise cada força contra cada fraqueza — elas devem ser dimensões diferentes.

Retorne APENAS JSON válido, sem markdown, sem texto extra.

{
  "sumario_executivo": "4-6 linhas ESPECÍFICAS. Cite os concorrentes pelo nome. Descreva o movimento mais perigoso detectado. Seja honesto sobre os riscos para ${client.name}. PROIBIDO: linguagem de consultoria genérica.",

  "alertas_detectados": [
    "⚡ [Concorrente]: [ação específica com dado real] — impacto estimado: [consequência concreta e mensurável para ${client.name}]"
  ],

  "termometro_competitivo": {
    "nivel": "critico|alto|moderado|baixo",
    "score": 0,
    "descricao": "1 frase direta e específica sobre o nível de pressão que ${client.name} enfrenta AGORA — cite o concorrente mais perigoso pelo nome."
  },

  "share_of_voice": [
    {"nome": "${client.name}", "percentual_estimado": 0},
    {"nome": "nomeConcorrente", "percentual_estimado": 0}
  ],

  "concorrentes": [
    {
      "nome": "nome exato",
      "posicionamento": "premium|mid-market|popular",
      "nicho_estimado": "setor real desta empresa",
      "fora_do_setor": false,
      "aviso_setor": "",

      "forca_marca":            0,
      "agressividade_ads":      0,
      "autoridade_social":      0,
      "percepcao_preco":        0,
      "qualidade_ux":           0,
      "velocidade_crescimento": 0,
      "diversificacao_canais":  0,
      "retencao_clientes":      0,

      "score_justificativa": "Score mais alto: [nome do score] ([valor]) — [sinal observável específico]. Score mais baixo: [nome] ([valor]) — [evidência de fraqueza].",

      "metricas_estimadas": {
        "seguidores_instagram": "~X–Y mil",
        "frequencia_posts": "~X posts/semana no Instagram",
        "ticket_medio": "~R$ X–Y",
        "engajamento_estimado": "~X–Y%",
        "canais_ativos": "Instagram, TikTok, Google Ads (cite apenas os detectados)"
      },

      "inteligencia_criativa": {
        "formato_principal": "UGC|carrossel|antes-depois|depoimento|tutorial|unboxing (descreva o formato dominante observado)",
        "hook_tipico": "Como o anúncio ou post começa — cite um exemplo concreto de abertura detectada ou provável",
        "prova_social_usada": "Como demonstram resultado/credibilidade: review, nota, transformação, autoridade, etc.",
        "copy_beneficio": "Como descrevem o produto: técnico/emocional/urgência/FOMO — cite exemplo de copy real ou provável",
        "uso_influencer": "Tipo de influencer (micro/macro), nicho, plataforma, frequência estimada de parceria"
      },

      "sinais_detectados": [
        "Sinal específico 1 — observação concreta sobre como esta empresa opera (ex: 'usa frete grátis acima de R$ 150 como principal CTA')",
        "Sinal específico 2 (ex: 'posts no Instagram às 19h com alta consistência, sugerindo automação de conteúdo')",
        "Sinal específico 3 (ex: 'desconto de 15% no primeiro pedido para captura de email — estratégia de CRM agressiva')"
      ],

      "top3_forcas":   ["força específica com dado ou exemplo real","força 2","força 3"],
      "top3_fraquezas":["fraqueza com evidência observável","fraqueza 2","fraqueza 3"],

      "nivel_ameaca":         "alto|medio|baixo",
      "tendencia_crescimento":"acelerando|estavel|desacelerando",

      "proposta_valor":       "Promessa central específica desta marca — como eles se descrevem na home ou nos anúncios.",
      "principais_ctas":      ["CTA real ou muito provável 1","CTA 2","CTA 3"],
      "tom_de_voz":           "Classifique E exemplifique com trecho real ou próximo do real: ex 'Aspiracional-motivacional: \"Seu corpo pode mais — prove agora\"'",
      "estrategia_preco":     "Mecanismo específico: frete grátis acima de X, desconto progressivo, kit combo, parcelamento em Y vezes, etc.",
      "faixa_preco_estimada": "R$ X–Y (ticket médio estimado ~R$ Z)",
      "frequencia_promocoes": "alta|media|baixa",
      "palavras_chave_seo":   [
        {"kw": "keyword real do nicho 1", "vol_est": "~X–Yk/mês", "dific": "alta|media|baixa", "cpc_est": "~R$ X–Y", "posicao_cliente": "top5|top10|>10|desconhecido"},
        {"kw": "keyword 2", "vol_est": "~X–Yk/mês", "dific": "media", "cpc_est": "~R$ X–Y", "posicao_cliente": "desconhecido"}
      ],
      "estrategia_conteudo":  "Formato + frequência + plataforma + tema. Ex: 'Reels UGC com resultado de cliente 4x/semana no Instagram; blog com artigos técnicos de SEO 2x/mês'",
      "estrategia_retencao":  "Mecanismo específico detectado: ex 'email de recompra com desconto 7 dias após pedido + clube de pontos no site'",

      "sentimento_clientes": {
        "positivos": ["elogio específico detectado em review ou menção 1","elogio 2","elogio 3"],
        "negativos": ["crítica específica detectada 1","crítica 2","crítica 3"],
        "score_reputacao": 0
      },

      "canal_principal": "Canal primário de aquisição + evidência: ex 'Meta Ads — biblioteca mostra volume alto de criativos rodando'",
      "publico_alvo":    "Perfil detalhado com evidência: faixa etária, gênero, classe, motivação de compra, objeção principal — específico desta marca.",
      "oportunidade":    "O que ${client.name} pode fazer AGORA para explorar uma fraqueza ou gap DESTA empresa — cite o mecanismo específico.",

      "battlecard": {
        "quando_ganhamos":    "Cenário baseado nas FRAQUEZAS REAIS deste concorrente — cite a fraqueza específica que cria a oportunidade.",
        "quando_perdemos":    "Cenário honesto baseado nas FORÇAS REAIS — cite o que eles fazem melhor que ${client.name}.",
        "argumento_principal":"Copy de resposta específico para quando o cliente menciona este concorrente pelo nome — baseado no diferencial REAL de ${client.name}."
      }
    }
  ],

  "matriz_swot_cliente": {
    "forcas": [
      "Força de ${client.name} com evidência — baseada em contraste com fraqueza detectada nos concorrentes",
      "Força 2",
      "Força 3"
    ],
    "fraquezas": [
      "Área onde [nome do concorrente] é superior — cite o que eles fazem e ${client.name} não faz",
      "Fraqueza 2",
      "Fraqueza 3"
    ],
    "oportunidades": [
      "Lacuna real não explorada por nenhum concorrente — cite a evidência da lacuna",
      "Oportunidade 2",
      "Oportunidade 3"
    ],
    "ameacas": [
      "Ameaça com nome do concorrente + movimento específico detectado",
      "Ameaça 2",
      "Ameaça 3"
    ]
  },

  "gaps_mercado": [
    "Gap 1: lacuna específica não atendida — cite evidência (review, ausência detectada, comportamento do consumidor)",
    "Gap 2",
    "Gap 3",
    "Gap 4"
  ],

  "top5_acoes": [
    {
      "acao":       "Ação específica e executável — não genérica. Ex: 'Criar série de Reels UGC com clientes reais mostrando resultado em 30 dias'",
      "porque":     "Justificativa com dado concreto — cite o concorrente ou gap que gerou essa oportunidade",
      "como_medir": "KPI específico com meta realista. Ex: 'Atingir 50k views em 30 dias e 200 leads via link na bio'",
      "urgencia":   "alta|media|baixa",
      "impacto":    "alto|medio|baixo",
      "esforco":    "alto|medio|baixo",
      "prazo_dias": 30
    }
  ],

  "insight_prioritario": "2-3 linhas específicas e acionáveis. Cite concorrentes pelo nome. Cite o movimento mais urgente. Nada genérico.",

  "contexto_mercado": {
    "tamanho_estimado": "Estimativa do mercado brasileiro de [nicho] em R$ ou unidades/ano — cite proxy (IBGE, ABIAD, Euromonitor, Sebrae)",
    "taxa_crescimento": "% de crescimento anual estimado do setor — com fonte ou proxy",
    "sazonalidade": "Meses de pico e vale de demanda para este nicho específico",
    "tendencias_macro": ["Tendência 1 relevante ao nicho — ex: crescimento de clean label em suplementos", "Tendência 2", "Tendência 3"],
    "ameacas_setor": "Movimento macro que afeta TODOS os players — ex: nova regulamentação ANVISA, aumento de insumos importados"
  }
}`;


    try {
      // QwQ 32B raciocina internamente antes de responder (~30-90s) — 120s de margem
      abortControllerRef.current = new AbortController();
      const TIMEOUT_MS = 120_000; // 2 min (Edge Function tem 90s interno + overhead de rede)
      const timeoutId  = setTimeout(() => {
        abortControllerRef.current?.abort();
        setErr("⏱ Timeout: a análise demorou mais de 2 minutos. Tente novamente.");
        setStep("collect");
        setAnalyzing(false);
      }, TIMEOUT_MS);

      let data;
      try {
        data = await callMarketIntelligence({
          provider: "groq-heavy", // ← QwQ 32B: modelo de raciocínio do Groq para análise competitiva
          max_tokens: 3500,
          messages: [{ role:"user", content:prompt }]
        }, session, abortControllerRef.current.signal);
      } finally {
        clearTimeout(timeoutId);
      }
      const txt    = extractText(data); // normaliza formato Groq/Anthropic
      const parsed = robustParseJSON(txt); // BUG FIX #5: tolerante a preambles do modelo

      // ── Sanitização e normalização pós-parse ──────────────────────────────
      // 0. CORREÇÃO TERMÔMETRO: recalcula score a partir dos dados reais dos
      //    concorrentes, ignorando o valor gerado pela IA (que era sempre 80–90).
      //    Não altera a descrição nem manipula dados — apenas usa os scores já
      //    gerados para calcular a pressão competitiva de forma consistente.
      if (parsed.termometro_competitivo && Array.isArray(parsed.concorrentes)) {
        const calc = calcThermoScore(parsed.concorrentes);
        if (calc) {
          parsed.termometro_competitivo.score = calc.score;
          parsed.termometro_competitivo.nivel = calc.nivel;
        }
      }

      // 1. Garantir mínimo de 5 ações
      if (!Array.isArray(parsed.top5_acoes)) parsed.top5_acoes = [];
      while (parsed.top5_acoes.length < 5) {
        parsed.top5_acoes.push({
          acao: "Definir com o time — ação adicional necessária",
          porque: "A IA retornou menos de 5 ações. Adicione manualmente com base no contexto.",
          como_medir: "A definir",
          urgencia: "media", impacto: "medio", esforco: "medio", prazo_dias: 90,
        });
      }

      // 2. Normalizar nomes de empresas no share_of_voice
      if (Array.isArray(parsed.share_of_voice)) {
        parsed.share_of_voice = parsed.share_of_voice.map(s => ({
          ...s, nome: normName(s.nome || ""),
        }));
      }

      // 3. Normalizar nomes dos concorrentes
      if (Array.isArray(parsed.concorrentes)) {
        parsed.concorrentes = parsed.concorrentes.map(c => ({
          ...c, nome: normName(c.nome || ""),
        }));
      }

      // 4. Garantir arrays mínimos
      if (!Array.isArray(parsed.gaps_mercado))       parsed.gaps_mercado = [];
      if (!Array.isArray(parsed.alertas_detectados)) parsed.alertas_detectados = [];

      // 5. ANTI-ALUCINAÇÃO: Filtrar share_of_voice para remover empresas fora do setor
      const compsFora = new Set(
        (parsed.concorrentes || [])
          .filter(c => c.fora_do_setor === true)
          .map(c => (c.nome || "").toLowerCase())
      );
      if (compsFora.size > 0 && Array.isArray(parsed.share_of_voice)) {
        parsed.share_of_voice = parsed.share_of_voice.filter(
          s => !compsFora.has((s.nome || "").toLowerCase())
        );
      }

      // 6. ANTI-ALUCINAÇÃO: Remover alertas que citam empresas fora do setor como ameaças diretas
      if (compsFora.size > 0 && Array.isArray(parsed.alertas_detectados)) {
        parsed.alertas_detectados = parsed.alertas_detectados.filter(alerta => {
          const alertaLower = (alerta || "").toLowerCase();
          return ![...compsFora].some(nome => alertaLower.includes(nome));
        });
        // Se ficou sem alertas suficientes, adiciona aviso
        if (parsed.alertas_detectados.length === 0) {
          parsed.alertas_detectados.push("⚠️ Os concorrentes informados são de setores diferentes — nenhum alerta competitivo direto gerado. Adicione concorrentes do mesmo nicho para análise precisa.");
        }
      }

      // 7. ANTI-ALUCINAÇÃO: Detectar e sinalizar ameaças genéricas no SWOT
      const ameacasGenericas = ["mudanças nas tendências","políticas governamentais","impacto da economia","fatores econômicos","regulamentações","mudanças no mercado","preferências dos clientes"];
      if (parsed.matriz_swot_cliente?.ameacas) {
        parsed.matriz_swot_cliente.ameacas = parsed.matriz_swot_cliente.ameacas.map(a => {
          const aLower = (a || "").toLowerCase();
          const isGenerica = ameacasGenericas.some(g => aLower.includes(g));
          return isGenerica ? `⚠️ [AMEAÇA GENÉRICA DETECTADA — substitua por concorrente específico]: ${a}` : a;
        });
      }

      // 8. ANTI-ALUCINAÇÃO: Detectar fraquezas do SWOT copiadas das forças/fraquezas dos concorrentes
      const forcasConcorrentes = new Set();
      const fraquezasConcorrentes = new Set();
      (parsed.concorrentes || []).forEach(c => {
        (c.top3_forcas || []).forEach(f => forcasConcorrentes.add(f.toLowerCase().substring(0, 25)));
        (c.top3_fraquezas || []).forEach(f => fraquezasConcorrentes.add(f.toLowerCase().substring(0, 25)));
      });
      if (parsed.matriz_swot_cliente?.fraquezas) {
        parsed.matriz_swot_cliente.fraquezas = parsed.matriz_swot_cliente.fraquezas.map(fr => {
          const frLower = (fr || "").toLowerCase().substring(0, 25);
          const isCopied = [...fraquezasConcorrentes].some(f => f.includes(frLower) || frLower.includes(f));
          return isCopied ? `⚠️ [FRAQUEZA POSSIVELMENTE COPIADA DO CONCORRENTE — revise]: ${fr}` : fr;
        });
      }

      // 10. ANTI-CONTRADIÇÃO SWOT: detecta força que espelha diretamente uma fraqueza
      //     Ex: "Estratégia de marketing eficaz" (força) vs "Falta de presença online" (fraqueza)
      if (parsed.matriz_swot_cliente?.forcas && parsed.matriz_swot_cliente?.fraquezas) {
        const fraquezasLower = (parsed.matriz_swot_cliente.fraquezas || []).map(f =>
          (f || "").toLowerCase().replace(/^⚠️\s*/,"").substring(0, 40)
        );
        parsed.matriz_swot_cliente.forcas = parsed.matriz_swot_cliente.forcas.map(forca => {
          const forcaLower = (forca || "").toLowerCase().substring(0, 40);
          // Detectar pares contraditórios conhecidos
          const contradicoes = [
            ["marketing eficaz","presença online"],["estratégia de marketing","falta de marketing"],
            ["preços competitivos","preços acima"],["qualidade","falta de qualidade"],
          ];
          const isContraditoria = contradicoes.some(([a, b]) =>
            forcaLower.includes(a) && fraquezasLower.some(fr => fr.includes(b))
          );
          return isContraditoria
            ? `⚠️ [CONTRADIÇÃO INTERNA DETECTADA — esta força contradiz uma fraqueza listada. Revise antes de entregar]: ${forca}`
            : forca;
        });
      }

      // 11. v20 SANITIZAÇÃO: remove metadados de debugging antes de exibir/gravar
      const sanitized = sanitizeAllFields(parsed);

      setResults(sanitized);

      const { error: insertErr } = await supabase.from("analises_concorrencia").insert({
        usuario_id: session.user.id, cliente_nome: client.name, nicho: client.niche,
        dados_cliente: { ...client }, resultados_json: sanitized,
        concorrentes_analisados: valid.map(c => c.name),
      });
      if (!insertErr) {
        setSavedAnalyses(prev => [{ id:Date.now(), client:client.name, niche:client.niche,
          date:new Date().toLocaleDateString("pt-BR"), results:sanitized, client_info:{ ...client },
        }, ...prev].slice(0, 10));
      }
      setStep("results");
    } catch (e) {
      setErr("Erro: " + e.message); setStep("collect");
    } finally {
      setAnalyzing(false);
    }
  };

  // ── REPORT TEXT ────────────────────────────────────────────────────────────
  const reportText = () => {
    if (!results) return "";
    const r = results;
    return `RELATÓRIO DE INTELIGÊNCIA COMPETITIVA v6
Cliente: ${client.name} | Nicho: ${client.niche}
Objetivo: ${client.objective}
${client.diferenciais ? `Diferenciais do cliente: ${client.diferenciais}` : ""}
Gerado por: ${activeUser?.name || ""} · ${new Date().toLocaleDateString("pt-BR")}

━━━ TERMÔMETRO COMPETITIVO ━━━
Nível: ${r.termometro_competitivo?.nivel?.toUpperCase() || "N/A"} (${r.termometro_competitivo?.score || 0}/100)
${r.termometro_competitivo?.descricao || ""}

━━━ ALERTAS DE INTELIGÊNCIA ━━━
${r.alertas_detectados?.join("\n") || ""}

━━━ SUMÁRIO EXECUTIVO ━━━
${r.sumario_executivo}

━━━ SHARE OF VOICE (estimado) ━━━
${r.share_of_voice?.map(s => `${s.nome}: ${s.percentual_estimado}%`).join(" | ") || ""}

${r.concorrentes?.map(c => `━━━ CONCORRENTE: ${c.nome?.toUpperCase()} ━━━
Posicionamento: ${c.posicionamento} | Ameaça: ${c.nivel_ameaca?.toUpperCase()} | Tendência: ${c.tendencia_crescimento}
Faixa de Preço: ${c.faixa_preco_estimada || "N/A"} | Frequência de Promoções: ${c.frequencia_promocoes || "N/A"}

SCORES:
  Força de marca: ${c.forca_marca}/100 | Ads: ${c.agressividade_ads}/100 | Social: ${c.autoridade_social}/100
  Preço: ${c.percepcao_preco}/100 | UX: ${c.qualidade_ux}/100 | Crescimento: ${c.velocidade_crescimento}/100
  Canais: ${c.diversificacao_canais}/100 | Retenção: ${c.retencao_clientes}/100

Proposta de Valor: ${c.proposta_valor || "N/A"}
Tom de Voz: ${c.tom_de_voz || "N/A"}
Estratégia de Preço: ${c.estrategia_preco || "N/A"}
Estratégia de Conteúdo: ${c.estrategia_conteudo || "N/A"}
Estratégia de Retenção: ${c.estrategia_retencao || "N/A"}
CTAs Principais: ${c.principais_ctas?.join(", ") || "N/A"}
Keywords SEO: ${c.palavras_chave_seo?.join(", ") || "N/A"}

Forças: ${c.top3_forcas?.join(", ")}
Fraquezas: ${c.top3_fraquezas?.join(", ")}
Canal Principal: ${c.canal_principal || "N/A"}
Público-Alvo: ${c.publico_alvo || "N/A"}

Sentimento — Score de Reputação: ${c.sentimento_clientes?.score_reputacao || 0}/100
  Positivos: ${c.sentimento_clientes?.positivos?.join(", ") || "N/A"}
  Negativos: ${c.sentimento_clientes?.negativos?.join(", ") || "N/A"}

BATTLECARD vs ${c.nome}:
  Quando ganhamos: ${c.battlecard?.quando_ganhamos || "N/A"}
  Quando perdemos: ${c.battlecard?.quando_perdemos || "N/A"}
  Argumento principal: ${c.battlecard?.argumento_principal || "N/A"}

Oportunidade para ${client.name}: ${c.oportunidade}`).join("\n\n") || ""}

━━━ SWOT DO CLIENTE: ${client.name?.toUpperCase()} ━━━
FORÇAS: ${r.matriz_swot_cliente?.forcas?.join(" | ") || ""}
FRAQUEZAS: ${r.matriz_swot_cliente?.fraquezas?.join(" | ") || ""}
OPORTUNIDADES: ${r.matriz_swot_cliente?.oportunidades?.join(" | ") || ""}
AMEAÇAS: ${r.matriz_swot_cliente?.ameacas?.join(" | ") || ""}

━━━ GAPS DE MERCADO ━━━
${r.gaps_mercado?.map((g, i) => `${i+1}. ${g}`).join("\n") || ""}

━━━ TOP 5 AÇÕES — PRÓXIMOS 90 DIAS ━━━
${r.top5_acoes?.map((a, i) => `${i+1}. ${a.acao} [Urgência: ${a.urgencia} | Impacto: ${a.impacto} | Esforço: ${a.esforco} | Prazo: ${a.prazo_dias}d]
   Por que: ${a.porque}
   Medir: ${a.como_medir}`).join("\n\n") || ""}

━━━ INSIGHT PRIORITÁRIO ━━━
${r.insight_prioritario}`;
  };

  const copy = () => { navigator.clipboard.writeText(reportText()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); }); };
  const generatePDF = () => window.print();

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SCREEN: LOADING ───────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "loading") return (
    <div style={{ ...S.bg, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
      <style>{fonts}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:32, height:32, borderRadius:"50%", border:"2px solid rgba(200,240,96,0.2)", borderTopColor:"#c8f060", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#4a4845", letterSpacing:"0.1em" }}>VERIFICANDO SESSÃO</div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SCREEN: LOGIN / CADASTRO ──────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "login") return (
    <div style={{ ...S.bg, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", position:"relative", overflow:"hidden" }}>
      <style>{fonts}</style>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"radial-gradient(rgba(200,240,96,0.035) 1px, transparent 1px)", backgroundSize:"36px 36px", animation:"gridDrift 0.8s ease forwards" }}/>
      <div style={{ position:"absolute", top:"18%", right:"18%", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle, rgba(200,240,96,0.05) 0%, transparent 68%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"15%", left:"10%", width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle, rgba(96,212,240,0.04) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ width:"100%", maxWidth:400, padding:"0 1.5rem", animation:"loginIn 0.55s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:48, height:48, borderRadius:12, background:"rgba(200,240,96,0.1)", border:"0.5px solid rgba(200,240,96,0.28)", marginBottom:18, animation:"glowPulse 3.5s ease infinite" }}>
            <span style={{ fontSize:22 }}>⚡</span>
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(200,240,96,0.55)", letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:10 }}>Market Intelligence</div>
          <div style={{ fontFamily:"'Fraunces',serif", fontWeight:300, fontSize:"1.75rem", lineHeight:1.2, color:"#e8e6e0" }}>
            {authTab === "login" ? <>Bem-vindo à <em style={{ color:"#c8f060", fontStyle:"italic" }}>plataforma.</em></> : <>Crie sua <em style={{ color:"#c8f060", fontStyle:"italic" }}>conta.</em></>}
          </div>
          <p style={{ ...S.muted, fontSize:12.5, marginTop:8 }}>
            {authTab === "login" ? "Acesse para analisar concorrentes com IA." : "Cadastro gratuito — comece agora."}
          </p>
        </div>
        <div style={{ display:"flex", gap:0, marginBottom:20, background:"rgba(255,255,255,0.03)", borderRadius:8, border:"0.5px solid rgba(255,255,255,0.08)", padding:3 }}>
          {["login","signup"].map(tab => (
            <button key={tab} style={{ flex:1, padding:"9px", fontSize:13, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", border:"none", borderRadius:6, fontWeight:500, transition:"all 0.2s", background:authTab===tab ? "rgba(200,240,96,0.14)" : "transparent", color:authTab===tab ? "#c8f060" : "#4a4845" }}
              onClick={() => { setAuthTab(tab); setLoginErr(""); setSignupErr(""); setSignupOk(false); }}>
              {tab === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>
        {authTab === "login" && (
          <div style={{ ...S.card, padding:"1.8rem", animation:"glowPulse 5s 1s ease infinite" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={S.label}>Email</label>
                <input style={S.input} type="email" placeholder="seu@email.com" value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email:e.target.value })}
                  onKeyDown={e => e.key==="Enter" && handleLogin()}/>
              </div>
              <div>
                <label style={S.label}>Senha</label>
                <input style={S.input} type="password" placeholder="••••••••" value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password:e.target.value })}
                  onKeyDown={e => e.key==="Enter" && handleLogin()}/>
              </div>
              {loginErr && <div style={{ fontSize:12, color:"#f05050", padding:"9px 12px", background:"rgba(240,80,80,0.07)", borderRadius:6, border:"0.5px solid rgba(240,80,80,0.22)", animation:"fadein 0.2s ease" }}>{loginErr}</div>}
              <button style={{ ...S.btn, width:"100%", padding:"12px", fontSize:14.5, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:loginLoading ? 0.75 : 1, marginTop:4 }}
                onClick={handleLogin} disabled={loginLoading}>
                {loginLoading ? <><Dots color="#0e0e0f"/> Autenticando...</> : "Entrar na plataforma →"}
              </button>
            </div>
          </div>
        )}
        {authTab === "signup" && (
          <div style={{ ...S.card, padding:"1.8rem" }}>
            {signupOk ? (
              <div style={{ textAlign:"center", padding:"1rem 0" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>✉️</div>
                <div style={{ fontWeight:500, fontSize:14, marginBottom:6 }}>Confirme seu email</div>
                <p style={{ ...S.muted, fontSize:12.5 }}>Enviamos um link de confirmação para {signupForm.email}. Clique no link para ativar sua conta.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div><label style={S.label}>Nome</label><input style={S.input} placeholder="Seu nome completo" value={signupForm.name} onChange={e => setSignupForm({ ...signupForm, name:e.target.value })}/></div>
                <div><label style={S.label}>Email</label><input style={S.input} type="email" placeholder="seu@email.com" value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email:e.target.value })}/></div>
                <div><label style={S.label}>Senha</label><input style={S.input} type="password" placeholder="Mínimo 6 caracteres" value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password:e.target.value }) } onKeyDown={e => e.key==="Enter" && handleSignUp()}/></div>
                {signupErr && <div style={{ fontSize:12, color:"#f05050", padding:"9px 12px", background:"rgba(240,80,80,0.07)", borderRadius:6 }}>{signupErr}</div>}
                <button style={{ ...S.btn, width:"100%", padding:"12px", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:loginLoading ? 0.75 : 1 }}
                  onClick={handleSignUp} disabled={loginLoading}>
                  {loginLoading ? <><Dots color="#0e0e0f"/> Criando conta...</> : "Criar conta gratuita →"}
                </button>
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop:32, textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:9, color:"#2a2825", letterSpacing:"0.14em" }}>v7.0 · SAAS READY · SUPABASE AUTH + RLS</div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SCREEN: ANALYZING ────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  if (step === "analyzing") return (
    <div style={{ ...S.bg, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
      <style>{fonts}</style>
      <div style={{ maxWidth:390, width:"100%", padding:"0 1.5rem", animation:"fadein 0.4s ease" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={S.eyebrow}>Processando</div>
          <div style={{ ...S.h1, fontSize:"1.5rem" }}>Gerando inteligência<br/><em style={{ color:"#c8f060", fontStyle:"italic" }}>competitiva...</em></div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {LOADING_STEPS.map((s, i) => {
            const status = i < loadingStep ? "done" : i === loadingStep ? "active" : "pending";
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:8,
                background: status==="done" ? "rgba(200,240,96,0.06)" : status==="active" ? "rgba(200,240,96,0.1)" : "rgba(255,255,255,0.02)",
                border:`0.5px solid ${status==="done" ? "rgba(200,240,96,0.22)" : status==="active" ? "rgba(200,240,96,0.38)" : "rgba(255,255,255,0.05)"}`,
                transition:"all 0.5s ease", animation:status==="active" ? "stepIn 0.35s ease" : "none" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0,
                  background: status==="done" ? "rgba(200,240,96,0.18)" : status==="active" ? "rgba(200,240,96,0.22)" : "rgba(255,255,255,0.04)",
                  border:`0.5px solid ${status==="done" ? "rgba(200,240,96,0.45)" : status==="active" ? "rgba(200,240,96,0.55)" : "rgba(255,255,255,0.08)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:status==="done" ? 11 : 13, transition:"all 0.4s ease" }}>
                  {status==="done" ? "✓" : status==="active" ? s.icon : "·"}
                </div>
                <span style={{ fontSize:13, flex:1, color:status==="done" ? "#c8f060" : status==="active" ? "#e8e6e0" : "#3a3835",
                  fontFamily:status==="done" ? "'DM Mono',monospace" : "'DM Sans',sans-serif", transition:"all 0.5s ease" }}>{s.label}</span>
                {status==="active" && <div style={{ display:"flex", gap:3, flexShrink:0 }}>{[0,1,2].map(j => <div key={j} style={{ width:4, height:4, borderRadius:"50%", background:"#c8f060", animation:`pulse 1s ${j*0.18}s infinite` }}/>)}</div>}
                {status==="done" && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(200,240,96,0.4)", flexShrink:0 }}>ok</span>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:24, textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:10, color:"#3a3835", animation:"shimmer 2s infinite" }}>
          análise profunda: share of voice · battlecards · SWOT · matriz de prioridades
        </div>
        <div style={{ marginTop:10, textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#2a2825", letterSpacing:"0.1em" }}>POWERED BY</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(200,240,96,0.4)", letterSpacing:"0.1em" }}>NVIDIA NIM</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#2a2825" }}>·</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(96,212,240,0.35)", letterSpacing:"0.1em" }}>GROQ (scraping)</span>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SCREEN: RESULTS ──────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  if (step === "results" && results) {
    const urgMap  = { alta:{ bg:"rgba(240,80,80,0.12)",  c:"#f05050" }, media:{ bg:"rgba(240,160,96,0.12)", c:"#f0a060" }, baixa:{ bg:"rgba(200,240,96,0.12)", c:"#c8f060" } };
    const impMap  = { alto:{ bg:"rgba(200,240,96,0.12)", c:"#c8f060" }, medio:{ bg:"rgba(240,160,96,0.12)", c:"#f0a060" }, baixo:{ bg:"rgba(255,255,255,0.06)", c:"#7a7870" } };
    const effMap2 = { alto:{ bg:"rgba(240,80,80,0.08)",  c:"#f08080" }, medio:{ bg:"rgba(255,255,255,0.06)", c:"#7a7870" }, baixo:{ bg:"rgba(200,240,96,0.08)", c:"#a8c860" } };

    return (
      <div className="print-root" style={S.bg}>
        <style>{fonts}</style>
        <div style={S.wrap}>

          {/* ── HEADER ───────────────────────────────────────────────────── */}
          <div className="print-header print-divider" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, paddingBottom:16, flexWrap:"wrap", gap:12 }}>
            <div>
              <div className="print-lime print-label" style={S.eyebrow}>Relatório · {client.name}</div>
              <div style={{ ...S.h1, fontSize:"1.5rem" }}>Inteligência <em className="print-lime" style={{ color:"#c8f060", fontStyle:"italic" }}>Competitiva</em></div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a4845", marginTop:5 }}>
                {activeUser?.name} · {activeUser?.role} · {new Date().toLocaleDateString("pt-BR")} · v8.0
              </div>
            </div>
            <div className="no-print" style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-start" }}>
              {savedAnalyses.length > 1 && (
                <button style={{ ...S.ghost, fontSize:12, padding:"8px 14px" }} onClick={() => setShowSaved(!showSaved)}>
                  {showSaved ? "Ocultar" : `📁 Salvas (${savedAnalyses.length})`}
                </button>
              )}
              <button style={{ ...S.ghost, fontSize:12, padding:"8px 14px", borderColor:"rgba(200,240,96,0.28)", color:"#c8f060" }} onClick={generatePDF}>
                🖨 Gerar PDF
              </button>
              <button style={S.ghost} onClick={() => { setStep("setup"); setResults(null); }}>Nova análise</button>
              <button style={{ ...S.btn, background:copied ? "#60d4f0" : "#c8f060" }} onClick={copy}>
                {copied ? "Copiado ✓" : "Copiar relatório"}
              </button>
            </div>
          </div>

          {/* ── SAVED DRAWER ─────────────────────────────────────────────── */}
          {showSaved && savedAnalyses.length > 1 && (
            <div className="no-print" style={{ ...S.card, marginBottom:14, animation:"fadein 0.3s ease" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#7a7870", letterSpacing:"0.08em" }}>ANÁLISES SALVAS</div>
                {historyLoading && <div style={{ width:14, height:14, borderRadius:"50%", border:"1.5px solid rgba(200,240,96,0.2)", borderTopColor:"#c8f060", animation:"spin 0.8s linear infinite" }}/>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {savedAnalyses.map((a, idx) => (
                  <div key={a.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", background:"rgba(255,255,255,0.02)", borderRadius:6, cursor:"pointer", border:`0.5px solid ${idx===0 ? "rgba(200,240,96,0.15)" : "transparent"}` }}
                    onClick={() => { setResults(a.results); setClient(a.client_info); setShowSaved(false); }}>
                    <div><span style={{ fontSize:13, fontWeight:500 }}>{a.client}</span><span style={{ fontSize:11, color:"#4a4845", marginLeft:8 }}>{a.niche}</span></div>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a4845" }}>{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AVISO DE CONCORRENTES FORA DO SETOR ──────────────────────── */}
          {results.concorrentes?.some(c => c.fora_do_setor) && (
            <div className="no-print" style={{ padding:"12px 16px", background:"rgba(240,80,80,0.07)", border:"0.5px solid rgba(240,80,80,0.3)", borderRadius:8, marginBottom:14, animation:"fadein 0.3s ease" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#f05050", letterSpacing:"0.1em", marginBottom:6 }}>⚠️ CONCORRENTES FORA DO SETOR DETECTADOS</div>
              {results.concorrentes.filter(c => c.fora_do_setor).map((c, i) => (
                <div key={i} style={{ fontSize:12.5, color:"#e0a0a0", lineHeight:1.6, marginBottom:3 }}>
                  <strong style={{ color:"#f08080" }}>{c.nome}</strong>{c.aviso_setor ? ` — ${c.aviso_setor}` : ` opera em setor diferente de "${client.niche}"`}.
                  {" "}Esta empresa foi <strong>excluída do Share of Voice e dos alertas competitivos diretos</strong>. Substitua por um concorrente real do mesmo nicho para análise precisa.
                </div>
              ))}
            </div>
          )}

          {/* ── 1. TERMÔMETRO COMPETITIVO ─────────────────────────────────── */}
          <CompetitiveThermometer termometro={results.termometro_competitivo}/>

          {/* ── 2. ALERTAS DE INTELIGÊNCIA ────────────────────────────────── */}
          {results.alertas_detectados?.length > 0 && (
            <div style={{ marginBottom:18, animation:"fadein 0.35s ease" }}>
              <div className="print-orange print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#f0a060", letterSpacing:"0.1em", marginBottom:10 }}>ALERTAS DE INTELIGÊNCIA</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {results.alertas_detectados.map((alerta, i) => (
                  <div key={i} className="print-alert" style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 14px",
                    background:"rgba(240,160,96,0.06)", border:"0.5px solid rgba(240,160,96,0.18)",
                    borderLeft:"2px solid rgba(240,160,96,0.5)", borderRadius:8, fontSize:13, color:"#e8e2d8", lineHeight:1.55,
                    animation:`alertIn ${0.3+i*0.1}s ease` }}>
                    {alerta}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 3. SUMÁRIO EXECUTIVO ──────────────────────────────────────── */}
          <div className="print-card" style={{ ...S.card, marginBottom:14, borderColor:"rgba(200,240,96,0.18)", animation:"fadein 0.4s ease" }}>
            <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:8 }}>SUMÁRIO EXECUTIVO</div>
            <p className="print-muted" style={{ fontSize:13.5, lineHeight:1.8, color:"#ccc8c0" }}>{results.sumario_executivo}</p>
          </div>

          {/* ── 4. SHARE OF VOICE ─────────────────────────────────────────── */}
          {results.share_of_voice?.length > 0 && (
            <div className="print-card" style={{ ...S.card, marginBottom:14, animation:"fadein 0.45s ease" }}>
              <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:14 }}>
                📊 SHARE OF VOICE — ESTIMATIVA DE VISIBILIDADE NO MERCADO
              </div>
              <ShareOfVoiceSection data={results.share_of_voice} clientName={client.name}/>
            </div>
          )}

          {/* ── 5. METODOLOGIA — colapsível, só visível na tela ───────────── */}
          <MetodologiaSection compsData={comps}/>

          {/* ── 5b. CONTEXTO DE MERCADO ───────────────────────────────────── */}
          {results.contexto_mercado && (
            <div className="print-card" style={{ ...S.card, marginBottom:14, animation:"fadein 0.47s ease" }}>
              <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:14 }}>
                🌐 CONTEXTO DE MERCADO — {client.niche?.toUpperCase()}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {(results.contexto_mercado.tamanho_estimado || results.contexto_mercado.taxa_crescimento) && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {results.contexto_mercado.tamanho_estimado && (
                      <div style={{ padding:"9px 11px", background:"rgba(200,240,96,0.04)", borderRadius:6, borderLeft:"2px solid rgba(200,240,96,0.2)" }}>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(200,240,96,0.45)", marginBottom:4 }}>TAMANHO DO MERCADO</div>
                        <div className="print-muted" style={{ fontSize:12, color:"#b8d4a8", lineHeight:1.6 }}>{results.contexto_mercado.tamanho_estimado}</div>
                      </div>
                    )}
                    {results.contexto_mercado.taxa_crescimento && (
                      <div style={{ padding:"9px 11px", background:"rgba(96,212,240,0.04)", borderRadius:6, borderLeft:"2px solid rgba(96,212,240,0.2)" }}>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(96,212,240,0.45)", marginBottom:4 }}>TAXA DE CRESCIMENTO</div>
                        <div className="print-muted" style={{ fontSize:12, color:"#a0c8d4", lineHeight:1.6 }}>{results.contexto_mercado.taxa_crescimento}</div>
                      </div>
                    )}
                  </div>
                )}
                {results.contexto_mercado.sazonalidade && (
                  <div style={{ fontSize:12.5, color:"#ccc8c0", lineHeight:1.7 }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855" }}>Sazonalidade: </span>
                    {results.contexto_mercado.sazonalidade}
                  </div>
                )}
                {results.contexto_mercado.tendencias_macro?.length > 0 && (
                  <div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855", marginBottom:6 }}>TENDÊNCIAS MACRO</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      {results.contexto_mercado.tendencias_macro.map((t, i) => (
                        <div key={i} className="print-muted" style={{ fontSize:12, color:"#b8b4ac", lineHeight:1.6, display:"flex", gap:6 }}>
                          <span style={{ color:"rgba(200,240,96,0.4)", flexShrink:0 }}>→</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {results.contexto_mercado.ameacas_setor && (
                  <div style={{ padding:"8px 11px", background:"rgba(240,80,80,0.04)", borderRadius:6, borderLeft:"2px solid rgba(240,80,80,0.18)" }}>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(240,80,80,0.5)", marginBottom:4 }}>⚠ AMEAÇA SETORIAL</div>
                    <div className="print-muted" style={{ fontSize:12, color:"#c8a0a0", lineHeight:1.6 }}>{results.contexto_mercado.ameacas_setor}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 6. CARDS DE CONCORRENTES ──────────────────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:14 }}>
            {results.concorrentes?.map((c, i) => (
              <div key={i} className="print-card" style={{ ...S.card, animation:`fadein ${0.3+i*0.12}s ease` }}>

                {/* Header do concorrente */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div style={{ fontWeight:500, fontSize:16 }}>{c.nome}</div>
                    <div className="print-muted" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#7a7870", marginTop:3, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                      {c.posicionamento}
                      {c.nicho_estimado && c.nicho_estimado.toLowerCase() !== client.niche?.toLowerCase() && (
                        <span style={{ marginLeft:8, color:"#f08080" }}>· {c.nicho_estimado}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    {/* Badge de confiança — mostra se scores vieram de dados reais ou estimativa */}
                    <DataConfidenceBadge comp={comps.find(cc => cc.name?.toLowerCase() === c.nome?.toLowerCase()) || {}}/>
                    {c.fora_do_setor && (
                      <span style={{ background:"rgba(240,80,80,0.12)", color:"#f05050", border:"0.5px solid rgba(240,80,80,0.35)", borderRadius:4, padding:"3px 9px", fontSize:10, fontFamily:"'DM Mono',monospace" }}>⚠ FORA DO SETOR</span>
                    )}
                    {c.tendencia_crescimento && <TrendBadge trend={c.tendencia_crescimento}/>}
                    <Badge level={c.nivel_ameaca}/>
                  </div>
                </div>

                {/* Aviso de setor se aplicável */}
                {c.fora_do_setor && c.aviso_setor && (
                  <div style={{ padding:"9px 12px", background:"rgba(240,80,80,0.06)", borderRadius:6, border:"0.5px solid rgba(240,80,80,0.2)", marginBottom:12, fontSize:12, color:"#d08080", lineHeight:1.6 }}>
                    ⚠️ {c.aviso_setor} — Os scores e dados abaixo são de <strong>benchmark de marca</strong>, não de concorrência direta.
                  </div>
                )}

                {/* 8 scores */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:8 }}>
                  <div>
                    <ScoreBar label="Força de marca"        value={c.forca_marca}            color="#c8f060"/>
                    <ScoreBar label="Agressividade em ads"  value={c.agressividade_ads}       color="#f0a060"/>
                    <ScoreBar label="Autoridade social"     value={c.autoridade_social}       color="#60d4f0"/>
                    <ScoreBar label="Percepção de preço"    value={c.percepcao_preco}         color="#d4a0f0"/>
                  </div>
                  <div>
                    <ScoreBar label="Qualidade UX/site"     value={c.qualidade_ux}            color="#f0d060"/>
                    <ScoreBar label="Velocidade crescimento"value={c.velocidade_crescimento}  color="#a0e8c0"/>
                    <ScoreBar label="Diversif. de canais"   value={c.diversificacao_canais}   color="#f0a0c0"/>
                    <ScoreBar label="Retenção de clientes"  value={c.retencao_clientes}       color="#80c8f0"/>
                  </div>
                </div>

                {/* Justificativa dos scores — transparência metodológica */}
                {c.score_justificativa && (
                  <div style={{ marginBottom:14, padding:"7px 10px", background:"rgba(255,255,255,0.02)", borderRadius:5, borderLeft:"2px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#3a3835", letterSpacing:"0.06em" }}>BASE DOS SCORES · </span>
                    <span style={{ fontSize:11, color:"#5a5855", lineHeight:1.6 }}>{c.score_justificativa}</span>
                  </div>
                )}

                {/* Métricas estimadas com fontes — resolve "dados sem fonte" */}
                {c.metricas_estimadas && (
                  <div style={{ marginBottom:14, padding:"10px 12px", background:"rgba(96,212,240,0.04)", borderRadius:6, borderLeft:"2px solid rgba(96,212,240,0.2)" }}>
                    <div className="print-cyan" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(96,212,240,0.55)", marginBottom:8, letterSpacing:"0.08em" }}>
                      📊 MÉTRICAS ESTIMADAS — RANGES (não valores exatos)
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {c.metricas_estimadas.seguidores_instagram && (
                        <div style={{ fontSize:11, color:"#8ab8c8", lineHeight:1.5 }}>
                          <span style={{ color:"#5a5855", fontFamily:"'DM Mono',monospace", fontSize:9" }}>Instagram: </span>
                          {c.metricas_estimadas.seguidores_instagram}
                          <span style={{ fontSize:9, color:"#3a3835", marginLeft:4 }}>(perfil público)</span>
                        </div>
                      )}
                      {c.metricas_estimadas.frequencia_posts && (
                        <div style={{ fontSize:11, color:"#8ab8c8", lineHeight:1.5 }}>
                          <span style={{ color:"#5a5855", fontFamily:"'DM Mono',monospace", fontSize:9 }}>Posts: </span>
                          {c.metricas_estimadas.frequencia_posts}
                        </div>
                      )}
                      {c.metricas_estimadas.ticket_medio && (
                        <div style={{ fontSize:11, color:"#8ab8c8", lineHeight:1.5 }}>
                          <span style={{ color:"#5a5855", fontFamily:"'DM Mono',monospace", fontSize:9 }}>Ticket: </span>
                          {c.metricas_estimadas.ticket_medio}
                          <span style={{ fontSize:9, color:"#3a3835", marginLeft:4 }}>(estimado site/ML)</span>
                        </div>
                      )}
                      {c.metricas_estimadas.engajamento_estimado && (
                        <div style={{ fontSize:11, color:"#8ab8c8", lineHeight:1.5 }}>
                          <span style={{ color:"#5a5855", fontFamily:"'DM Mono',monospace", fontSize:9 }}>Engaj: </span>
                          {c.metricas_estimadas.engajamento_estimado}
                        </div>
                      )}
                      {c.metricas_estimadas.canais_ativos && (
                        <div style={{ fontSize:11, color:"#8ab8c8", lineHeight:1.5, gridColumn:"1/-1" }}>
                          <span style={{ color:"#5a5855", fontFamily:"'DM Mono',monospace", fontSize:9 }}>Canais: </span>
                          {c.metricas_estimadas.canais_ativos}
                          <span style={{ fontSize:9, color:"#3a3835", marginLeft:4 }}>(Meta Ads Library + Social)</span>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize:9, color:"#2a2825", fontFamily:"'DM Mono',monospace", marginTop:6 }}>
                      * ranges baseados em sinais públicos — não dados de analytics auditados
                    </div>
                  </div>
                )}

                {/* Forças / Fraquezas */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <div className="print-lime" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#c8f060", marginBottom:6 }}>FORÇAS</div>
                    {c.top3_forcas?.map((f, j) => <div key={j} className="print-muted" style={{ fontSize:12, color:"#ccc8c0", lineHeight:1.6, marginBottom:2 }}>+ {f}</div>)}
                  </div>
                  <div>
                    <div className="print-red" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#f05050", marginBottom:6 }}>FRAQUEZAS</div>
                    {c.top3_fraquezas?.map((f, j) => <div key={j} className="print-muted" style={{ fontSize:12, color:"#ccc8c0", lineHeight:1.6, marginBottom:2 }}>− {f}</div>)}
                  </div>
                </div>

                {/* Proposta de valor + Tom de voz */}
                {(c.proposta_valor || c.tom_de_voz) && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    {c.proposta_valor && (
                      <div style={{ padding:"9px 11px", background:"rgba(200,240,96,0.04)", borderRadius:6, borderLeft:"2px solid rgba(200,240,96,0.22)" }}>
                        <div className="print-lime" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(200,240,96,0.55)", marginBottom:5 }}>💎 PROPOSTA DE VALOR</div>
                        <div className="print-muted" style={{ fontSize:11.5, color:"#b8d4a8", lineHeight:1.6 }}>{c.proposta_valor}</div>
                      </div>
                    )}
                    {c.tom_de_voz && (
                      <div style={{ padding:"9px 11px", background:"rgba(240,160,96,0.04)", borderRadius:6, borderLeft:"2px solid rgba(240,160,96,0.22)" }}>
                        <div className="print-orange" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(240,160,96,0.55)", marginBottom:5 }}>🎙 TOM DE VOZ</div>
                        <div className="print-muted" style={{ fontSize:11.5, color:"#d4c0a0", lineHeight:1.6 }}>{c.tom_de_voz}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* CTAs principais */}
                {c.principais_ctas?.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    <div className="print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855", marginBottom:6, letterSpacing:"0.08em" }}>PRINCIPAIS CTAs DETECTADOS</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {c.principais_ctas.map((cta, j) => (
                        <span key={j} style={{ background:"rgba(200,240,96,0.07)", border:"0.5px solid rgba(200,240,96,0.18)", borderRadius:4, padding:"3px 9px", fontSize:11.5, color:"#b0c888", fontFamily:"'DM Mono',monospace" }}>
                          "{cta}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estratégia de preço + promoções */}
                {(c.estrategia_preco || c.faixa_preco_estimada) && (
                  <div style={{ padding:"9px 12px", background:"rgba(212,160,240,0.04)", borderRadius:6, borderLeft:"2px solid rgba(212,160,240,0.2)", marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:6 }}>
                      <div style={{ flex:1 }}>
                        <div className="print-purple" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(212,160,240,0.55)", marginBottom:5 }}>💰 ESTRATÉGIA DE PREÇO</div>
                        <div className="print-muted" style={{ fontSize:11.5, color:"#c8b0d8", lineHeight:1.6 }}>{c.estrategia_preco}</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end", flexShrink:0 }}>
                        {c.faixa_preco_estimada && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"rgba(212,160,240,0.7)" }}>{c.faixa_preco_estimada}</span>}
                        {c.frequencia_promocoes && (
                          <span style={{ background:"rgba(240,160,96,0.1)", color:"#f0a060", borderRadius:4, padding:"2px 8px", fontSize:9.5, fontFamily:"'DM Mono',monospace" }}>
                            promos: {c.frequencia_promocoes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Keywords SEO com métricas */}
                {c.palavras_chave_seo?.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    <div className="print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855", marginBottom:6, letterSpacing:"0.08em" }}>🔍 KEYWORDS SEO ESTIMADAS</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {c.palavras_chave_seo.map((kw, j) => {
                        // Suporta formato legado (string) e novo formato (objeto)
                        const isObj = kw && typeof kw === "object";
                        const kwText = isObj ? kw.kw : kw;
                        const difColor = { alta:"#f05050", media:"#f0a060", baixa:"#c8f060" }[isObj ? kw.dific : "media"] || "#60d4f0";
                        return (
                          <div key={j} style={{ display:"flex", flexWrap:"wrap", gap:5, alignItems:"center" }}>
                            <span style={{ background:"rgba(96,212,240,0.07)", border:"0.5px solid rgba(96,212,240,0.18)", borderRadius:4, padding:"2px 9px", fontSize:11, color:"#80b8c8", fontFamily:"'DM Mono',monospace" }}>{kwText}</span>
                            {isObj && kw.vol_est && <span style={{ fontSize:9.5, color:"#4a4845", fontFamily:"'DM Mono',monospace" }}>vol: {kw.vol_est}</span>}
                            {isObj && kw.dific  && <span style={{ fontSize:9.5, color:difColor, fontFamily:"'DM Mono',monospace" }}>dif: {kw.dific}</span>}
                            {isObj && kw.cpc_est && <span style={{ fontSize:9.5, color:"#6a6460", fontFamily:"'DM Mono',monospace" }}>cpc: {kw.cpc_est}</span>}
                            {isObj && kw.posicao_cliente && kw.posicao_cliente !== "desconhecido" && (
                              <span style={{ fontSize:9.5, color:"rgba(200,240,96,0.5)", fontFamily:"'DM Mono',monospace" }}>pos.cliente: {kw.posicao_cliente}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize:9, color:"#2a2825", fontFamily:"'DM Mono',monospace", marginTop:5 }}>* estimativas — validar em SEMrush/Ahrefs/Google Search Console</div>
                  </div>
                )}

                {/* Estratégia de conteúdo + retenção */}
                {(c.estrategia_conteudo || c.estrategia_retencao) && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    {c.estrategia_conteudo && (
                      <div style={{ padding:"8px 10px", background:"rgba(96,212,240,0.04)", borderRadius:6, borderLeft:"2px solid rgba(96,212,240,0.18)" }}>
                        <div className="print-cyan" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(96,212,240,0.5)", marginBottom:5 }}>📝 ESTRATÉGIA DE CONTEÚDO</div>
                        <div className="print-muted" style={{ fontSize:11.5, color:"#a0c8d4", lineHeight:1.6 }}>{c.estrategia_conteudo}</div>
                      </div>
                    )}
                    {c.estrategia_retencao && (
                      <div style={{ padding:"8px 10px", background:"rgba(160,240,160,0.04)", borderRadius:6, borderLeft:"2px solid rgba(160,240,160,0.18)" }}>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(160,240,160,0.5)", marginBottom:5 }}>♻️ ESTRATÉGIA DE RETENÇÃO</div>
                        <div className="print-muted" style={{ fontSize:11.5, color:"#a0d4a0", lineHeight:1.6 }}>{c.estrategia_retencao}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Canal principal + Público */}
                {(c.canal_principal || c.publico_alvo) && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    {c.canal_principal && (
                      <div style={{ padding:"10px 12px", background:"rgba(96,212,240,0.05)", borderRadius:6, borderLeft:"2px solid rgba(96,212,240,0.28)" }}>
                        <div className="print-cyan" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#60d4f0", marginBottom:5 }}>📡 CANAL PRINCIPAL</div>
                        <div className="print-muted" style={{ fontSize:12, color:"#b8d8e0", lineHeight:1.65 }}>{c.canal_principal}</div>
                      </div>
                    )}
                    {c.publico_alvo && (
                      <div style={{ padding:"10px 12px", background:"rgba(212,160,240,0.05)", borderRadius:6, borderLeft:"2px solid rgba(212,160,240,0.28)" }}>
                        <div className="print-purple" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#d4a0f0", marginBottom:5 }}>👥 PÚBLICO-ALVO</div>
                        <div className="print-muted" style={{ fontSize:12, color:"#d0b8e0", lineHeight:1.65 }}>{c.publico_alvo}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sentimento dos clientes */}
                <SentimentSection sentimento={c.sentimento_clientes}/>

                {/* Inteligência criativa — criativo, hook, prova social */}
                {c.inteligencia_criativa && (
                  <div style={{ padding:"10px 12px", background:"rgba(240,160,96,0.04)", borderRadius:6, border:"0.5px solid rgba(240,160,96,0.12)", marginTop:10 }}>
                    <div className="print-orange" style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(240,160,96,0.6)", marginBottom:8, letterSpacing:"0.08em" }}>
                      🎨 INTELIGÊNCIA CRIATIVA — ADS & CONTEÚDO
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {c.inteligencia_criativa.formato_principal && (
                        <div style={{ fontSize:11.5, color:"#ccc8c0", lineHeight:1.6 }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855" }}>Formato: </span>{c.inteligencia_criativa.formato_principal}
                        </div>
                      )}
                      {c.inteligencia_criativa.hook_tipico && (
                        <div style={{ fontSize:11.5, color:"#ccc8c0", lineHeight:1.6 }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855" }}>Hook típico: </span>{c.inteligencia_criativa.hook_tipico}
                        </div>
                      )}
                      {c.inteligencia_criativa.prova_social_usada && (
                        <div style={{ fontSize:11.5, color:"#ccc8c0", lineHeight:1.6 }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855" }}>Prova social: </span>{c.inteligencia_criativa.prova_social_usada}
                        </div>
                      )}
                      {c.inteligencia_criativa.copy_beneficio && (
                        <div style={{ fontSize:11.5, color:"#ccc8c0", lineHeight:1.6 }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855" }}>Copy: </span>{c.inteligencia_criativa.copy_beneficio}
                        </div>
                      )}
                      {c.inteligencia_criativa.uso_influencer && (
                        <div style={{ fontSize:11.5, color:"#ccc8c0", lineHeight:1.6 }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#5a5855" }}>Influencer: </span>{c.inteligencia_criativa.uso_influencer}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sinais detectados */}
                {c.sinais_detectados?.length > 0 && (
                  <div style={{ padding:"10px 12px", background:"rgba(255,255,255,0.02)", borderRadius:6, border:"0.5px solid rgba(255,255,255,0.07)", marginTop:8 }}>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#4a4845", marginBottom:7, letterSpacing:"0.08em" }}>
                      🔭 SINAIS DETECTADOS
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {c.sinais_detectados.map((s, j) => (
                        <div key={j} style={{ fontSize:11.5, color:"#8a8680", lineHeight:1.6, display:"flex", gap:6 }}>
                          <span style={{ color:"rgba(200,240,96,0.3)", flexShrink:0 }}>→</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Oportunidade */}
                <div className="print-opp" style={{ padding:"10px 12px", background:"rgba(200,240,96,0.05)", borderRadius:6, borderLeft:"2px solid rgba(200,240,96,0.28)", marginTop:10 }}>
                  <div className="print-lime" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#c8f060", marginBottom:5 }}>
                    ✦ OPORTUNIDADE PARA {client.name?.toUpperCase()}
                  </div>
                  <div className="print-muted" style={{ fontSize:12.5, color:"#ccc8c0", lineHeight:1.7 }}>{c.oportunidade}</div>
                </div>

                {/* Battlecard */}
                <BattleCard battlecard={c.battlecard} compName={c.nome} clientName={client.name}/>
              </div>
            ))}
          </div>

          {/* ── 6. RADAR CHART (se 2+ concorrentes) ──────────────────────── */}
          {results.concorrentes?.length >= 2 && (
            <div className="print-card" style={{ ...S.card, marginBottom:14, animation:"fadein 0.5s ease" }}>
              <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:16 }}>
                🕸 RADAR COMPARATIVO — 8 DIMENSÕES
              </div>
              <RadarChart competitors={results.concorrentes}/>
            </div>
          )}

          {/* ── 7. SWOT DO CLIENTE ────────────────────────────────────────── */}
          {results.matriz_swot_cliente && (
            <div className="print-card" style={{ ...S.card, marginBottom:14, animation:"fadein 0.5s ease" }}>
              <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:14 }}>
                🔲 MATRIZ SWOT — {client.name?.toUpperCase()}
              </div>
              <SWOTMatrix swot={results.matriz_swot_cliente}/>
            </div>
          )}

          {/* ── 8. GAPS DE MERCADO ────────────────────────────────────────── */}
          <div className="print-card" style={{ ...S.card, marginBottom:14 }}>
            <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:14 }}>GAPS DE MERCADO IDENTIFICADOS</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {results.gaps_mercado?.map((g, i) => (
                <div key={i} className="print-gap-row" style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"8px 10px", background:"rgba(255,255,255,0.02)", borderRadius:6 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"rgba(200,240,96,0.5)", minWidth:22 }}>0{i+1}</span>
                  <span className="print-muted" style={{ fontSize:13, color:"#ccc8c0", lineHeight:1.6 }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 9. MATRIZ DE PRIORIDADES (ações) ─────────────────────────── */}
          {results.top5_acoes?.length > 0 && (
            <div className="print-card" style={{ ...S.card, marginBottom:14, animation:"fadein 0.55s ease" }}>
              <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:4 }}>
                ⊞ MATRIZ DE PRIORIDADES — ESFORÇO vs IMPACTO
              </div>
              <p className="print-muted" style={{ fontSize:11.5, color:"#5a5855", marginBottom:16 }}>
                Ações numeradas correspondem ao plano de 90 dias abaixo
              </p>
              <ActionPriorityMatrix actions={results.top5_acoes}/>
            </div>
          )}

          {/* ── 10. TOP 5 AÇÕES ───────────────────────────────────────────── */}
          <div className="print-card" style={{ ...S.card, marginBottom:14 }}>
            <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"#c8f060", marginBottom:14 }}>
              TOP {results.top5_acoes?.length || 5} AÇÕES — PRÓXIMOS 90 DIAS
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {results.top5_acoes?.map((a, i) => (
                <div key={i} className="print-action" style={{ display:"flex", gap:14, padding:"12px 14px", background:"rgba(255,255,255,0.02)", borderRadius:6 }}>
                  <div style={{ minWidth:26, height:26, borderRadius:"50%", background:"rgba(200,240,96,0.1)", border:"0.5px solid rgba(200,240,96,0.25)", color:"#c8f060", fontFamily:"'DM Mono',monospace", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:500, fontSize:13.5, marginBottom:5 }}>{a.acao}</div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:7 }}>
                      <ActionTag prefix="urgência" value={a.urgencia} map={urgMap}/>
                      <ActionTag prefix="impacto"  value={a.impacto}  map={impMap}/>
                      <ActionTag prefix="esforço"  value={a.esforco}  map={effMap2}/>
                      {a.prazo_dias && <span style={{ background:"rgba(255,255,255,0.05)", color:"#5a5855", borderRadius:4, padding:"2px 7px", fontSize:9.5, fontFamily:"'DM Mono',monospace" }}>prazo: {a.prazo_dias}d</span>}
                    </div>
                    <div className="print-muted" style={{ fontSize:12, color:"#7a7870", marginBottom:4 }}>Por que: {a.porque}</div>
                    <div className="print-lime" style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"rgba(200,240,96,0.55)" }}>Medir: {a.como_medir}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 11. INSIGHT PRIORITÁRIO ───────────────────────────────────── */}
          {results.insight_prioritario && (
            <div className="print-insight" style={{ padding:"16px 18px", background:"rgba(200,240,96,0.06)", borderRadius:8, border:"0.5px solid rgba(200,240,96,0.22)" }}>
              <div className="print-lime print-label" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#c8f060", marginBottom:8, letterSpacing:"0.08em" }}>⚡ INSIGHT PRIORITÁRIO</div>
              <div className="print-insight-text" style={{ fontSize:13.5, color:"#e8e6e0", lineHeight:1.8, fontWeight:500 }}>{results.insight_prioritario}</div>
            </div>
          )}

          {/* ── FOOTER ───────────────────────────────────────────────────── */}
          <div className="print-footer" style={{ display:"none", marginTop:28, paddingTop:14, borderTop:"1px solid #ddd", fontSize:10, color:"#999", fontFamily:"monospace", justifyContent:"space-between" }}>
            <span>Market Intelligence Platform v8.0</span>
            <span>{client.name} · {client.niche}</span>
            <span>{activeUser?.name} · {new Date().toLocaleDateString("pt-BR")}</span>
          </div>

        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SCREEN: COLLECT ──────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  if (step === "collect") {
    const comp = valid[ci];
    const isLast = ci === valid.length - 1;
    const hasPredictions = comp?.predictedChannels || comp?.predictedAudience;
    const fields = [
      { f:"siteData",    label:"Site, produtos e preços",  hint:"Homepage, copy, preços, promoções, CTAs, proposta de valor.",    tool:"Auto-coletado ou cole manualmente" },
      { f:"adsData",     label:"Anúncios ativos",          hint:"Texto dos anúncios, CTA, ofertas, formato.",                     tool:"→ facebook.com/ads/library" },
      { f:"reviewsData", label:"Reviews e avaliações",     hint:"Cole avaliações do Google, ReclameAqui, Shopee ou MercadoLivre.",tool:"15–30 avaliações reais" },
      { f:"socialData",  label:"Social e TikTok",          hint:"Posts virais, hashtags, frequência, tom de voz.",                tool:"Instagram / TikTok da marca" },
    ];
    return (
      <div style={S.bg}>
        <style>{fonts}</style>
        <div style={S.wrap}>
          <Steps current="collect"/>
          <div style={{ ...S.eyebrow, fontSize:10 }}>Concorrente {ci+1}/{valid.length}</div>
          <div style={{ ...S.h1, marginBottom:8 }}><em style={{ color:"#c8f060", fontStyle:"italic" }}>{comp?.name}</em></div>
          <p style={{ ...S.muted, marginBottom:24 }}>Revise e complemente os dados. Campos em branco = a IA usa conhecimento base + URL.</p>
          {hasPredictions && (
            <div style={{ marginBottom:18, padding:"14px 16px", background:"rgba(96,212,240,0.04)", border:"0.5px solid rgba(96,212,240,0.14)", borderRadius:10, animation:"fadein 0.4s ease" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#60d4f0", letterSpacing:"0.1em", marginBottom:12 }}>🧠 INTELIGÊNCIA DE CANAIS — AUTO-DETECTADO</div>
              <div style={{ display:"grid", gridTemplateColumns: comp?.predictedChannels && comp?.predictedAudience ? "1fr 1fr" : "1fr", gap:14 }}>
                {comp?.predictedChannels && <div><div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(96,212,240,0.6)", marginBottom:7 }}>CANAIS DE AQUISIÇÃO</div><div style={{ fontSize:12, color:"#a0c8d4", lineHeight:1.75, whiteSpace:"pre-wrap" }}>{comp.predictedChannels}</div></div>}
                {comp?.predictedAudience && <div><div style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(212,160,240,0.6)", marginBottom:7 }}>PÚBLICO-ALVO INFERIDO</div><div style={{ fontSize:12, color:"#c4a8d8", lineHeight:1.75, whiteSpace:"pre-wrap" }}>{comp.predictedAudience}</div></div>}
              </div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {fields.map(({ f, label, hint, tool }) => (
              <div key={f} style={S.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:6 }}>
                  <label style={{ ...S.label, marginBottom:0 }}>{label}</label>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(200,240,96,0.4)" }}>{tool}</span>
                </div>
                <p style={{ ...S.muted, fontSize:11.5, marginBottom:8 }}>{hint}</p>
                <textarea style={S.ta} placeholder="Cole aqui ou deixe em branco..." value={comp ? comp[f] : ""} onChange={e => upd(realIdx(comp.name), f, e.target.value)}/>
                {f==="siteData" && comp?.siteData && comp.siteData.length > 80 && (
                  <div style={{ marginTop:6, fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(200,240,96,0.5)" }}>✓ Dados auto-coletados via IA ({comp.siteData.length.toLocaleString()} chars)</div>
                )}
              </div>
            ))}
          </div>
          {err && <div style={{ color:"#f05050", fontSize:13, marginTop:12, padding:"10px 14px", background:"rgba(240,80,80,0.07)", borderRadius:6, border:"0.5px solid rgba(240,80,80,0.2)" }}>{err}</div>}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
            <button style={S.ghost} onClick={() => ci > 0 ? setCi(ci-1) : setStep("competitors")}>← Voltar</button>
            {isLast ? <button style={S.btn} onClick={analyze}>⚡ Gerar análise</button> : <button style={S.btn} onClick={() => setCi(ci+1)}>Próximo →</button>}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SCREEN: COMPETITORS ──────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  if (step === "competitors") return (
    <div style={S.bg}>
      <style>{fonts}</style>
      <div style={S.wrap}>
        <Steps current="competitors"/>
        <div style={S.eyebrow}>Passo 2</div>
        <div style={{ ...S.h1, marginBottom:8 }}>Quem são os <em style={{ color:"#c8f060", fontStyle:"italic" }}>concorrentes?</em></div>
        <p style={{ ...S.muted, marginBottom:16 }}>Adicione até 4. Informe a URL e use Auto-coleta para extrair dados + canais + público automaticamente.</p>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background:"rgba(200,240,96,0.05)", border:"0.5px solid rgba(200,240,96,0.18)", borderRadius:8, marginBottom:24 }}>
          <span style={{ fontSize:18, lineHeight:1 }}>🔍</span>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#c8f060", marginBottom:4, letterSpacing:"0.08em" }}>AUTO-COLETA INTELIGENTE v5 · PROTEGIDA POR AUTH</div>
            <div style={{ fontSize:12, color:"#7a7870", lineHeight:1.6 }}>
              Extrai: preços, CTAs, produtos, <strong style={{ color:"#60d4f0" }}>Canais de Aquisição</strong> e <strong style={{ color:"#d4a0f0" }}>Público-Alvo inferido</strong> pelo tom de voz e nicho.
            </div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {comps.map((c, i) => {
            const scrapeSt  = scraping[i] || "idle";
            const isLoading = scrapeSt === "loading";
            const isDone    = scrapeSt === "done";
            const isError   = scrapeSt === "error";
            return (
              <div key={i} style={{ ...S.card, borderColor: isDone ? "rgba(200,240,96,0.18)" : "rgba(255,255,255,0.08)", transition:"border-color 0.4s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color: isDone ? "#c8f060" : "rgba(200,240,96,0.6)" }}>{isDone ? "✓ " : ""}CONCORRENTE {i+1}</span>
                  {i > 0 && <button style={{ background:"none", border:"none", color:"#7a7870", cursor:"pointer", fontSize:18, lineHeight:1 }} onClick={() => setComps(comps.filter((_, j) => j !== i))}>×</button>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <div><label style={S.label}>Nome</label><input style={S.input} placeholder="Ex: Leroy Merlin, C&C..." value={c.name} onChange={e => upd(i, "name", e.target.value)}/></div>
                  <div><label style={S.label}>URL do site</label><input style={S.input} placeholder="https://..." value={c.url} onChange={e => upd(i, "url", e.target.value)}/></div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  {/* FIX: opacity era 0.4 no loading — texto ficava invisível no fundo escuro.
                      Agora mantém 1 e troca aparência via border/color para comunicar estado. */}
                  <button
                    style={{
                      ...S.ghost,
                      padding:"7px 14px",
                      fontSize:12,
                      cursor: c.url && !isLoading ? "pointer" : "default",
                      opacity: c.url ? 1 : 0.4,
                      borderColor: isLoading ? "rgba(200,240,96,0.45)"
                                 : isDone    ? "rgba(200,240,96,0.3)"
                                 : isError   ? "rgba(240,80,80,0.3)"
                                 : undefined,
                      color: isLoading ? "#c8f060"
                           : isDone    ? "#c8f060"
                           : isError   ? "#f05050"
                           : undefined,
                      background: isLoading ? "rgba(200,240,96,0.07)" : undefined,
                      transition:"all 0.3s",
                    }}
                    onClick={() => autoScrape(i)}
                    disabled={!c.url || isLoading}
                  >
                    {isLoading && <span style={{ marginRight:6 }}><Dots color="#c8f060"/></span>}
                    {isLoading ? "Coletando dados + canais + público..."
                     : isDone  ? "✓ Dados + Inteligência de canal coletados"
                     : isError ? "⚠ Erro — tentar novamente"
                     : "🔍 Auto-coletar + Analisar canais"}
                  </button>
                  {isDone && c.siteData         && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(200,240,96,0.5)" }}>{c.siteData.length.toLocaleString()} chars</span>}
                  {isDone && c.predictedChannels && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(96,212,240,0.55)" }}>+ canais ✓</span>}
                  {isDone && c.predictedAudience && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(212,160,240,0.55)" }}>+ público ✓</span>}
                  {isDone && c.fora_do_setor && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#f05050", background:"rgba(240,80,80,0.1)", border:"0.5px solid rgba(240,80,80,0.3)", borderRadius:4, padding:"2px 7px" }}>⚠ FORA DO SETOR</span>}{/* FIX: era c.foraDosSetor */}
                  {!c.url && <span style={{ fontSize:11, color:"#3a3835" }}>Informe a URL para habilitar</span>}
                  {c.url && !isDone && !isLoading && !isError && (
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(96,212,240,0.3)", letterSpacing:"0.08em" }}>via GROQ</span>
                  )}
                </div>
                {isError && err && <div style={{ marginTop:8, fontSize:11.5, color:"#f05050", padding:"8px 10px", background:"rgba(240,80,80,0.06)", borderRadius:6, border:"0.5px solid rgba(240,80,80,0.18)", fontFamily:"'DM Mono',monospace" }}>{err}</div>}
              </div>
            );
          })}
        </div>
        {comps.length < 4 && (
          <button style={{ ...S.ghost, marginTop:10, width:"100%", textAlign:"center" }}
            onClick={() => setComps([...comps, { name:"", url:"", siteData:"", adsData:"", reviewsData:"", socialData:"", predictedChannels:"", predictedAudience:"" }])}>
            + Adicionar concorrente
          </button>
        )}
        {/* Aviso: mínimo 3 concorrentes para análise comparativa real */}
        {(() => {
          const filledCount = comps.filter(c => c.name.trim()).length;
          if (filledCount > 0 && filledCount < 3) return (
            <div style={{ marginTop:12, padding:"11px 14px", background:"rgba(240,160,96,0.07)", border:"0.5px solid rgba(240,160,96,0.28)", borderRadius:8, display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:14, lineHeight:1.2, flexShrink:0 }}>⚠️</span>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#f0a060", letterSpacing:"0.08em", marginBottom:3 }}>ANÁLISE LIMITADA — RECOMENDAMOS 3+ CONCORRENTES</div>
                <div style={{ fontSize:12, color:"#c0a888", lineHeight:1.65 }}>
                  Com {filledCount} concorrente{filledCount === 1 ? "" : "s"}, o share of voice e a análise comparativa perdem valor informacional. Inteligência competitiva B2B cobre no mínimo 3 players para benchmarking real. Adicione {3 - filledCount} mais para análise completa.
                </div>
              </div>
            </div>
          );
          return null;
        })()}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
          <button style={S.ghost} onClick={() => setStep("setup")}>← Voltar</button>
          <button style={{ ...S.btn, opacity:comps[0].name.trim() ? 1 : 0.5 }}
            onClick={() => { if (comps[0].name.trim()) { setCi(0); setStep("collect"); } }}>
            Revisar dados →
          </button>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SCREEN: SETUP (dashboard) ─────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div style={S.bg}>
      <style>{fonts}</style>
      <div style={S.wrap}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, paddingBottom:16, borderBottom:"0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:"rgba(200,240,96,0.1)", border:"0.5px solid rgba(200,240,96,0.22)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:13 }}>⚡</span>
            </div>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(200,240,96,0.7)", letterSpacing:"0.14em" }}>MARKET INTEL</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {savedAnalyses.length > 0 && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#3a3835" }}>{savedAnalyses.length} análise{savedAnalyses.length !== 1 ? "s" : ""} salva{savedAnalyses.length !== 1 ? "s" : ""}</span>}
            <div style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 12px 6px 6px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"0.5px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:"rgba(200,240,96,0.14)", border:"0.5px solid rgba(200,240,96,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:500, color:"#c8f060", fontFamily:"'DM Mono',monospace" }}>
                {activeUser?.avatar || "U"}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:500, lineHeight:1.2 }}>{activeUser?.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#4a4845" }}>{activeUser?.role} · {activeUser?.email}</div>
              </div>
              <button style={{ background:"none", border:"none", color:"#3a3835", fontSize:11, cursor:"pointer", marginLeft:4, fontFamily:"'DM Mono',monospace" }} onClick={handleLogout}>Sair</button>
            </div>
          </div>
        </div>

        <Steps current="setup"/>
        <div style={S.eyebrow}>Nova análise</div>
        <div style={{ ...S.h1, marginBottom:8 }}>Qual empresa vamos <em style={{ color:"#c8f060", fontStyle:"italic" }}>analisar?</em></div>
        <p style={{ ...S.muted, marginBottom:28 }}>Preencha as informações do cliente para calibrar a análise da IA.</p>

        <div style={S.card}>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={S.label}>Nome da empresa cliente</label>
              <input style={S.input} placeholder="Ex: Loja Esportes Silva" value={client.name} onChange={e => setClient({ ...client, name:e.target.value })}/>
            </div>
            <div>
              <label style={S.label}>Nicho / segmento</label>
              <select style={S.input} value={client.niche} onChange={e => setClient({ ...client, niche:e.target.value })}>
                <option value="">Selecione o nicho...</option>
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Objetivo desta análise</label>
              <input style={S.input} placeholder="Ex: Entender por que perdemos conversão para a concorrência"
                value={client.objective} onChange={e => setClient({ ...client, objective:e.target.value })}/>
            </div>
            <div style={{ borderTop:"0.5px solid rgba(255,255,255,0.06)", paddingTop:16 }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#c8f060", letterSpacing:"0.1em", marginBottom:10 }}>
                CONTEXTO DO CLIENTE — calibra SWOT e battlecards com precisão
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <label style={S.label}>Principais diferenciais e forças da empresa <span style={{ color:"#3a3835", textTransform:"none", letterSpacing:0 }}>(opcional, mas aumenta muito a precisão)</span></label>
                  <textarea style={{ ...S.ta, minHeight:64 }}
                    placeholder="Ex: atendimento personalizado, entrega em 24h, produtos exclusivos importados, 10 anos no mercado..."
                    value={client.diferenciais || ""}
                    onChange={e => setClient({ ...client, diferenciais:e.target.value })}/>
                </div>
                <div>
                  <label style={S.label}>Pontos fracos ou desafios conhecidos <span style={{ color:"#3a3835", textTransform:"none", letterSpacing:0 }}>(opcional)</span></label>
                  <textarea style={{ ...S.ta, minHeight:64 }}
                    placeholder="Ex: baixa presença digital, preços acima da média, sem programa de fidelidade, pouca variedade..."
                    value={client.fraquezas_conhecidas || ""}
                    onChange={e => setClient({ ...client, fraquezas_conhecidas:e.target.value })}/>
                </div>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"#3a3835", fontFamily:"'DM Mono',monospace" }}>
                ↳ Evita que a IA copie fraquezas dos concorrentes no SWOT do cliente
              </div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20 }}>
            <button style={{ ...S.btn, opacity:client.name && client.niche ? 1 : 0.5 }}
              onClick={() => { if (client.name && client.niche) setStep("competitors"); }}>Próximo →</button>
          </div>
        </div>

        {savedAnalyses.length > 0 && (
          <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(255,255,255,0.02)", borderRadius:8, border:"0.5px solid rgba(255,255,255,0.06)", animation:"fadein 0.5s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a4845", letterSpacing:"0.08em" }}>ANÁLISES RECENTES — BANCO DE DADOS</div>
              {historyLoading && <div style={{ width:12, height:12, borderRadius:"50%", border:"1.5px solid rgba(200,240,96,0.2)", borderTopColor:"#c8f060", animation:"spin 0.8s linear infinite" }}/>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {savedAnalyses.slice(0, 3).map(a => (
                <div key={a.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 10px", background:"rgba(255,255,255,0.02)", borderRadius:6, cursor:"pointer" }}
                  onClick={() => { setResults(a.results); setClient(a.client_info); setStep("results"); }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:12.5, fontWeight:500 }}>{a.client}</span>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#4a4845" }}>{a.niche}</span>
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#3a3835" }}>{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(255,255,255,0.02)", borderRadius:8, border:"0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a4845", marginBottom:10, letterSpacing:"0.08em" }}>O QUE ESTA ANÁLISE GERA</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              ["⚡","Termômetro de ameaça competitiva com score 0-100"],
              ["🕸","Radar comparativo em 8 dimensões (marca, ads, UX, retenção...)"],
              ["📊","Share of voice estimado no mercado"],
              ["⚔️","Battlecards: quando ganhar e quando perder para cada concorrente"],
              ["🔲","Matriz SWOT do cliente baseada na análise competitiva"],
              ["💬","Sentimento de clientes: elogios e críticas de cada rival"],
              ["⊞","Matriz esforço vs impacto para priorizar as ações"],
              ["🖨","Relatório executivo completo com exportação PDF"],
            ].map(([icon, text], i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:14, width:20, textAlign:"center" }}>{icon}</span>
                <span style={{ fontSize:12, color:"#5a5855", lineHeight:1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop:20, textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:9, color:"#2a2825", letterSpacing:"0.14em" }}>
          v8.0 · SAAS READY · SUPABASE AUTH + RLS · SWOT ANTI-ALUCINAÇÃO · VALIDAÇÃO DE SETOR
        </div>
      </div>
    </div>
  );
}
