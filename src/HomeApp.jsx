import React, { useState, useEffect } from 'react';
import {
  Calculator, Building2, ClipboardList, Layers, Calendar,
  BarChart3, TrendingUp, Activity, Home, Settings, Search, AlertCircle,
} from 'lucide-react';
import EstimativaApp from './estimativa_app.jsx';

// ── Mesmas credenciais do app de estimativa ─────────────────────────────────
const SUPABASE_URL = 'https://sycxuwkwpavesyghzyiz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y3h1d2t3cGF2ZXN5Z2h6eWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDYxMTAsImV4cCI6MjA5NDcyMjExMH0.ndpi-lWTibwczXY8FBv0p_zxM0vFfnOLnZ_B0QUozMs';

let supabase = null;
const loadSupabase = async () => {
  if (supabase) return supabase;
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = mod.createClient(SUPABASE_URL, SUPABASE_KEY);
    return supabase;
  } catch { return null; }
};
loadSupabase();

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN VIEW
// ═══════════════════════════════════════════════════════════════════════════
function LoginView({ onLogin }) {
  const [email, setEmail]   = useState('');
  const [senha, setSenha]   = useState('');
  const [erro,  setErro]    = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      const sb = await loadSupabase();
      if (!sb) { onLogin({ id:'local', email:'local' }); return; }
      const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) setErro(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
      else onLogin(data.user);
    } catch { setErro('Erro de conexao. Tente novamente.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f0f5fc', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"IBM Plex Sans",sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ background:'#fff', border:'0.5px solid #ccdaee', borderTop:'3px solid #0d1e35', borderRadius:'0 0 8px 8px', width:360, boxShadow:'0 8px 32px rgba(13,30,53,0.1)' }}>
        <div style={{ padding:'24px 28px 18px', borderBottom:'1px solid #ccdaee' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:28, height:28, background:'#2e6fad', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Building2 style={{ width:15, height:15, color:'#fff' }} />
            </div>
            <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:13, fontWeight:500, color:'#0d1e35', letterSpacing:'0.04em' }}>CONSTRUTOR PRO</span>
          </div>
          <div style={{ fontSize:10, color:'rgba(13,30,53,0.4)', fontFamily:'"IBM Plex Mono",monospace', letterSpacing:'0.08em', textTransform:'uppercase' }}>Acesso ao sistema</div>
        </div>
        <form onSubmit={handleLogin} style={{ padding:'22px 28px 24px' }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:'rgba(13,30,53,0.55)', marginBottom:5 }}>E-mail</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{ width:'100%', padding:'10px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:6, fontSize:13, color:'#0d1e35', outline:'none', boxSizing:'border-box', fontFamily:'"IBM Plex Sans",sans-serif' }}
              onFocus={e => e.target.style.borderColor='#2e6fad'}
              onBlur={e  => e.target.style.borderColor='#ccdaee'} />
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:'rgba(13,30,53,0.55)', marginBottom:5 }}>Senha</label>
            <input type="password" required value={senha} onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{ width:'100%', padding:'10px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:6, fontSize:13, color:'#0d1e35', outline:'none', boxSizing:'border-box', fontFamily:'"IBM Plex Sans",sans-serif' }}
              onFocus={e => e.target.style.borderColor='#2e6fad'}
              onBlur={e  => e.target.style.borderColor='#ccdaee'} />
          </div>
          {erro && (
            <div style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, marginBottom:14, fontSize:12, color:'#b91c1c' }}>
              <AlertCircle style={{ width:13, height:13, flexShrink:0 }} /> {erro}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'11px', background:'#0d1e35', color:'#fff', border:'none', borderRadius:5, fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:'0.04em', fontFamily:'"IBM Plex Sans",sans-serif', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Autenticando...' : 'ENTRAR'}
          </button>
        </form>
        <div style={{ padding:'10px 28px 14px', borderTop:'1px solid #ccdaee', textAlign:'center', fontSize:10, color:'rgba(13,30,53,0.35)', fontFamily:'"IBM Plex Mono",monospace', letterSpacing:'0.05em' }}>
          Acesso restrito · Solicite ao administrador
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULO EM DESENVOLVIMENTO
// ═══════════════════════════════════════════════════════════════════════════
function ModuloEmDesenvolvimento({ nome, Icone, iconeC, iconeTxt, descricao, onVoltar }) {
  return (
    <div style={{ minHeight:'100vh', background:'#f0f5fc', fontFamily:'"IBM Plex Sans",sans-serif', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#0d1e35', height:44, display:'flex', alignItems:'center', padding:'0 20px', gap:12, borderBottom:'1px solid rgba(46,111,173,0.25)' }}>
        <button onClick={onVoltar}
          style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:3, padding:'4px 10px', cursor:'pointer', fontFamily:'"IBM Plex Sans",sans-serif', transition:'color .15s' }}
          onMouseEnter={e => e.currentTarget.style.color='#fff'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
          ← Inicio
        </button>
        <div style={{ width:1, height:16, background:'rgba(255,255,255,0.1)' }} />
        <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:11, color:'rgba(255,255,255,0.6)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{nome}</span>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center', maxWidth:340 }}>
          <div style={{ width:60, height:60, background: iconeC || '#ddeeff', border:'1px solid #ccdaee', borderTop:'3px solid #2e6fad', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', color: iconeTxt || '#1c5ea0' }}>
            {Icone && <Icone style={{ width:26, height:26 }} />}
          </div>
          <div style={{ fontSize:17, fontWeight:600, color:'#0d1e35', marginBottom:8 }}>{nome}</div>
          <div style={{ fontSize:12, color:'#6b7a90', lineHeight:1.6, marginBottom:18 }}>{descricao}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 13px', background:'#fef3c7', border:'1px solid #fde68a', borderRadius:3 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#f59e0b', display:'inline-block' }} />
            <span style={{ fontSize:9, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'"IBM Plex Mono",monospace' }}>Em desenvolvimento</span>
          </div>
          <div style={{ marginTop:20 }}>
            <button onClick={onVoltar}
              style={{ fontSize:12, color:'#2e6fad', background:'none', border:'1px solid #ccdaee', borderRadius:3, padding:'7px 16px', cursor:'pointer', fontFamily:'"IBM Plex Sans",sans-serif', transition:'background .15s, border-color .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#ddeeff'; e.currentTarget.style.borderColor='#2e6fad'; }}
              onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='#ccdaee'; }}>
              ← Voltar ao inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOME VIEW
// ═══════════════════════════════════════════════════════════════════════════
function HomeView({ authUser, onSelectModulo, onLogout }) {
  const [favoritos,  setFavoritos]  = useState(['estimativa', 'planejamento']);
  const [notifOpen,  setNotifOpen]  = useState(false);

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const emailDisplay  = authUser?.id === 'local' ? null : authUser?.email;
  const nomeUsuario   = emailDisplay
    ? emailDisplay.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Usuario';
  const hora          = new Date().getHours();
  const saudacao      = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const initials      = ((nomeUsuario[0]||'U') + (nomeUsuario.split(' ')[1]?.[0]||'')).toUpperCase();

  const MODULOS = [
    { id:'estimativa',    nome:'Estimativa',    desc:'Parametrico, INCC, banco de obras', iconeC:'#ddeeff', iconeTxt:'#1c5ea0', Icone:Calculator,    ativo:true  },
    { id:'obras',         nome:'Obras',         desc:'Cadastro, equipes, documentos',     iconeC:'#d4f1e8', iconeTxt:'#0a5c47', Icone:Building2,     ativo:false },
    { id:'orcamentos',    nome:'Orcamentos',    desc:'Composicoes, BDI, aprovacoes',      iconeC:'#fef3c7', iconeTxt:'#92400e', Icone:ClipboardList, ativo:false, badge:'Novo' },
    { id:'levantamentos', nome:'Levantamentos', desc:'Quantitativos e memoria de calculo',iconeC:'#ffedd5', iconeTxt:'#9a3412', Icone:Layers,        ativo:false },
    { id:'planejamento',  nome:'Planejamento',  desc:'EAP, cronograma e curva S',         iconeC:'#ede9fe', iconeTxt:'#5b21b6', Icone:Calendar,      ativo:false },
    { id:'cronograma',    nome:'Cronograma',    desc:'Gantt, linha de balanco e prazo',   iconeC:'#dcfce7', iconeTxt:'#166534', Icone:BarChart3,     ativo:false },
    { id:'controles',     nome:'Controles',     desc:'Medicoes, desvios fisico-financ.',  iconeC:'#e8edf5', iconeTxt:'#334155', Icone:TrendingUp,    ativo:false, badge:'Beta' },
    { id:'indicadores',   nome:'Indicadores',   desc:'KPIs, dashboards e acompanhamento', iconeC:'#fce7f3', iconeTxt:'#9d174d', Icone:Activity,      ativo:false },
  ];

  const RECENTES = [
    { mod:'estimativa',   nome:'Estimativa - Castilho',     tempo:'14 min', iconeC:'#ddeeff', iconeTxt:'#1c5ea0', Icone:Calculator    },
    { mod:'orcamentos',   nome:'Orc. Torre Alpha Rev.3',    tempo:'2h',     iconeC:'#fef3c7', iconeTxt:'#92400e', Icone:ClipboardList },
    { mod:'planejamento', nome:'Cronograma Grand Splendor', tempo:'Ontem',  iconeC:'#ede9fe', iconeTxt:'#5b21b6', Icone:Calendar      },
    { mod:'obras',        nome:'Corporativo Prime',         tempo:'Ontem',  iconeC:'#d4f1e8', iconeTxt:'#0a5c47', Icone:Building2     },
  ];

  const NOTIFS = [
    { tipo:'warn',   texto:'Orc. Torre Alpha Rev.3 aguarda aprovacao', tempo:'Ha 2 dias', lida:false },
    { tipo:'danger', texto:'5 atividades vencidas - Grand Splendor',   tempo:'Hoje',      lida:false },
    { tipo:'info',   texto:'INCC maio disponivel - atualizar estimativas', tempo:'Hoje',  lida:true  },
    { tipo:'ok',     texto:'Medicao maio - Corporativo Prime concluida', tempo:'Ontem',   lida:true  },
  ];

  const OBRAS = [
    { nome:'Residencial Torre Alpha', meta:'Sao Paulo - Alto Padrao', pct:78, plan:80, cor:'#1a7a4a' },
    { nome:'Corporativo Prime',       meta:'Sao Paulo - Comercial',   pct:42, plan:50, cor:'#d97706' },
    { nome:'Grand Splendor',          meta:'Guarulhos - Alto Padrao', pct:61, plan:72, cor:'#b91c1c' },
    { nome:'Parque dos Lagos',        meta:'Ribeirao Preto - Medio',  pct:19, plan:18, cor:'#2e6fad' },
  ];

  const KPIS = [
    { label:'Obras ativas',          valor:'12',    sub:'Mais 2 este mes',      cor:'#2e6fad', subCor:'#1a7a4a' },
    { label:'Orcamentos abertos',    valor:'7',     sub:'3 aguard. aprovacao',  cor:'#d97706', subCor:'#b45309' },
    { label:'Atividades em atraso',  valor:'5',     sub:'2 a mais desde ontem', cor:'#b91c1c', subCor:'#b91c1c' },
    { label:'Desvio medio de custo', valor:'+4,2%', sub:'Monitorar',            cor:'#d97706', subCor:'#b45309' },
  ];

  const SNAV = [
    { id:'home',         title:'Inicio',       Icone:Home          },
    { id:'obras',        title:'Obras',        Icone:Building2     },
    { id:'orcamentos',   title:'Orcamentos',   Icone:ClipboardList },
    { id:'planejamento', title:'Planejamento', Icone:Calendar      },
    { id:'controles',    title:'Controles',    Icone:TrendingUp    },
    { id:'indicadores',  title:'Indicadores',  Icone:Activity      },
  ];

  const favRow = MODULOS.filter(m => favoritos.includes(m.id));
  const SL = { fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'#6b7a90', fontWeight:700, marginBottom:8, display:'flex', alignItems:'center', gap:8 };

  const notifDotColor = (tipo) =>
    tipo === 'warn' ? '#d97706' : tipo === 'danger' ? '#b91c1c' : tipo === 'info' ? '#2e6fad' : '#1a7a4a';

  const ModCard = ({ m }) => (
    <div onClick={() => m.ativo && onSelectModulo(m.id)}
      style={{ background:'#fff', border:'1px solid #ccdaee', borderRadius:4, padding:'13px 12px 11px', cursor: m.ativo ? 'pointer' : 'default', position:'relative', opacity: m.ativo ? 1 : 0.72, transition:'border-color .15s, background .15s, transform .12s' }}
      onMouseEnter={e => { if (m.ativo) { e.currentTarget.style.borderColor='#2e6fad'; e.currentTarget.style.background='#f5f9ff'; e.currentTarget.style.transform='translateY(-1px)'; }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor='#ccdaee'; e.currentTarget.style.background='#fff'; e.currentTarget.style.transform='none'; }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background: m.ativo ? '#2e6fad' : '#ccdaee', borderRadius:'4px 4px 0 0' }} />
      {m.badge && (
        <div style={{ position:'absolute', top:7, right: m.ativo ? 26 : 8, fontSize:8, padding:'2px 5px', borderRadius:2, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', background: m.badge==='Novo'?'#d4f1e8':'#ede9fe', color: m.badge==='Novo'?'#065f46':'#4c1d95', fontFamily:'"IBM Plex Mono",monospace' }}>
          {m.badge}
        </div>
      )}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:9 }}>
        <div style={{ width:30, height:30, background:m.iconeC, borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center', color:m.iconeTxt }}>
          <m.Icone style={{ width:15, height:15 }} />
        </div>
        {m.ativo && (
          <button onClick={e => toggleFav(m.id, e)}
            style={{ color: favoritos.includes(m.id) ? '#f59e0b' : '#ccdaee', fontSize:15, background:'none', border:'none', cursor:'pointer', padding:0, lineHeight:1, transition:'color .12s' }}
            onMouseEnter={e => e.currentTarget.style.color = favoritos.includes(m.id) ? '#d97706' : '#a0b5cc'}
            onMouseLeave={e => e.currentTarget.style.color = favoritos.includes(m.id) ? '#f59e0b' : '#ccdaee'}>
            {favoritos.includes(m.id) ? '\u2605' : '\u2606'}
          </button>
        )}
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:'#0d1e35', marginBottom:2, letterSpacing:'0.01em' }}>{m.nome}</div>
      <div style={{ fontSize:10, color:'#6b7a90', lineHeight:1.4 }}>{m.desc}</div>
      {!m.ativo && (
        <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:4 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#f59e0b', flexShrink:0 }} />
          <span style={{ fontSize:9, color:'#92400e', fontFamily:'"IBM Plex Mono",monospace', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Em desenvolvimento</span>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#eef2f8', fontFamily:'"IBM Plex Sans",sans-serif', display:'flex', position:'relative' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>

      {/* SIDEBAR */}
      <div style={{ position:'fixed', top:0, left:0, width:52, height:'100vh', background:'#0d1e35', display:'flex', flexDirection:'column', alignItems:'center', padding:'14px 0', gap:4, borderRight:'1px solid rgba(46,111,173,0.2)', zIndex:30 }}>
        <div style={{ width:32, height:32, background:'#2e6fad', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, flexShrink:0 }}>
          <Building2 style={{ width:17, height:17, color:'#fff' }} />
        </div>
        {SNAV.map(s => (
          <button key={s.id} title={s.title}
            onClick={() => s.id !== 'home' && onSelectModulo(s.id)}
            style={{ width:36, height:36, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', border:'none', background: s.id==='home' ? 'rgba(46,111,173,0.3)' : 'none', color: s.id==='home' ? '#7db8ea' : 'rgba(255,255,255,0.35)', cursor: s.id==='home' ? 'default' : 'pointer', flexShrink:0, transition:'background .15s, color .15s' }}
            onMouseEnter={e => { if (s.id !== 'home') { e.currentTarget.style.background='rgba(46,111,173,0.25)'; e.currentTarget.style.color='rgba(255,255,255,0.9)'; }}}
            onMouseLeave={e => { if (s.id !== 'home') { e.currentTarget.style.background='none'; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}}>
            <s.Icone style={{ width:17, height:17 }} />
          </button>
        ))}
        <div style={{ width:28, height:1, background:'rgba(255,255,255,0.08)', margin:'6px 0' }} />
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          <div style={{ width:28, height:1, background:'rgba(255,255,255,0.08)', marginBottom:4 }} />
          <button title="Configuracoes"
            style={{ width:36, height:36, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', border:'none', background:'none', color:'rgba(255,255,255,0.35)', cursor:'pointer', transition:'background .15s, color .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(46,111,173,0.25)'; e.currentTarget.style.color='rgba(255,255,255,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}>
            <Settings style={{ width:17, height:17 }} />
          </button>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'#2e6fad', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color:'#fff', fontFamily:'"IBM Plex Mono",monospace', border:'2px solid rgba(46,111,173,0.5)' }}>
            {initials}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft:52, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* TOPBAR */}
        <div style={{ background:'#0d1e35', height:44, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', borderBottom:'1px solid rgba(46,111,173,0.25)', position:'sticky', top:0, zIndex:20, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:11, fontWeight:500, color:'rgba(255,255,255,0.9)', letterSpacing:'0.08em', textTransform:'uppercase' }}>ConstrutorPRO</span>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Inicio</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:3, padding:'4px 10px', fontSize:11, color:'rgba(255,255,255,0.35)', cursor:'pointer' }}>
              <Search style={{ width:11, height:11 }} />
              <span>Buscar obra, orcamento...</span>
              <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:9, border:'1px solid rgba(255,255,255,0.15)', borderRadius:2, padding:'1px 4px', color:'rgba(255,255,255,0.2)', marginLeft:4 }}>&#8984;K</span>
            </div>
            <div style={{ position:'relative' }}>
              <button onClick={() => setNotifOpen(v => !v)}
                style={{ width:28, height:28, borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', color:'rgba(255,255,255,0.5)', position:'relative' }}>
                <AlertCircle style={{ width:14, height:14 }} />
                <div style={{ position:'absolute', top:5, right:5, width:6, height:6, borderRadius:'50%', background:'#f59e0b', border:'1.5px solid #0d1e35' }} />
              </button>
              {notifOpen && (
                <div style={{ position:'absolute', top:34, right:0, width:300, background:'#fff', border:'1px solid #ccdaee', borderRadius:4, boxShadow:'0 4px 20px rgba(13,30,53,0.15)', zIndex:50 }}>
                  <div style={{ padding:'8px 12px', borderBottom:'1px solid #eef2f8', fontSize:9, textTransform:'uppercase', letterSpacing:'0.08em', color:'#6b7a90', fontWeight:700 }}>Notificacoes</div>
                  {NOTIFS.map((n,i) => (
                    <div key={i} style={{ padding:'9px 12px', borderBottom: i < NOTIFS.length-1 ? '1px solid #f0f4f9':'none', display:'flex', alignItems:'flex-start', gap:8, background: n.lida ? '#fff':'#fafcff' }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, marginTop:4, background: notifDotColor(n.tipo) }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:'#0d1e35', lineHeight:1.4, fontWeight: n.lida ? 400 : 500 }}>{n.texto}</div>
                        <div style={{ fontSize:10, color:'#9baaba', marginTop:1, fontFamily:'"IBM Plex Mono",monospace' }}>{n.tempo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:7, borderLeft:'1px solid rgba(255,255,255,0.08)', paddingLeft:10 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:'#2e6fad', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:600, color:'#fff', fontFamily:'"IBM Plex Mono",monospace' }}>{initials}</div>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{nomeUsuario.split(' ')[0]}</span>
              <button onClick={onLogout}
                style={{ fontSize:10, color:'rgba(255,255,255,0.3)', padding:'4px 8px', border:'1px solid rgba(255,255,255,0.08)', background:'transparent', cursor:'pointer', borderRadius:3, fontFamily:'"IBM Plex Sans",sans-serif', transition:'border-color .15s, color .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(239,68,68,0.4)'; e.currentTarget.style.color='#fca5a5'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}>
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding:'18px 20px 32px', flex:1 }}>

          {/* WELCOME */}
          <div style={{ background:'#fff', border:'1px solid #ccdaee', borderLeft:'4px solid #2e6fad', borderRadius:'0 4px 4px 0', padding:'11px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'#0d1e35' }}>{saudacao}, {nomeUsuario.split(' ')[0]}</div>
              <div style={{ fontSize:11, color:'#6b7a90', marginTop:2 }}>
                {new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })} &middot; 12 obras ativas
              </div>
            </div>
            <div style={{ display:'flex', gap:7 }}>
              {[{ label:'Nova estimativa', id:'estimativa' }, { label:'Novo orcamento', id:'orcamentos' }, { label:'Nova obra', id:'obras' }].map(c => (
                <div key={c.label} onClick={() => onSelectModulo(c.id)}
                  style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', background:'#eef2f8', border:'1px solid #ccdaee', borderRadius:3, fontSize:10, color:'#3d5170', fontWeight:500, letterSpacing:'0.02em', userSelect:'none', cursor:'pointer', transition:'background .15s, border-color .15s, color .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#ddeeff'; e.currentTarget.style.borderColor='#2e6fad'; e.currentTarget.style.color='#2e6fad'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#eef2f8'; e.currentTarget.style.borderColor='#ccdaee'; e.currentTarget.style.color='#3d5170'; }}>
                  <span style={{ fontSize:12 }}>+</span> {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* KPIS */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
            {KPIS.map((k,i) => (
              <div key={i} style={{ background:'#fff', border:'1px solid #ccdaee', borderTop:`2px solid ${k.cor}`, borderRadius:'0 0 4px 4px', padding:'10px 12px' }}>
                <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.08em', color:'#6b7a90', fontWeight:700, marginBottom:5 }}>{k.label}</div>
                <div style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:20, fontWeight:500, color:'#0d1e35', lineHeight:1 }}>{k.valor}</div>
                <div style={{ fontSize:10, marginTop:3, color:k.subCor }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* TWO-COLUMN */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 286px', gap:12, marginBottom:12 }}>
            <div>
              <div style={SL}>Modulos <div style={{ flex:1, height:1, background:'#ccdaee' }} /></div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:8 }}>
                {MODULOS.slice(0,4).map(m => <ModCard key={m.id} m={m} />)}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {MODULOS.slice(4,8).map(m => <ModCard key={m.id} m={m} />)}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div>
                <div style={SL}>Acessos recentes <div style={{ flex:1, height:1, background:'#ccdaee' }} /></div>
                <div style={{ background:'#fff', border:'1px solid #ccdaee', borderRadius:4, overflow:'hidden' }}>
                  {RECENTES.map((r,i) => (
                    <div key={i} onClick={() => onSelectModulo(r.mod)}
                      style={{ padding:'7px 12px', borderBottom: i < RECENTES.length-1 ? '1px solid #f0f4f9':'none', display:'flex', alignItems:'center', gap:8, cursor:'pointer', transition:'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f5f9ff'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <div style={{ width:24, height:24, borderRadius:3, background:r.iconeC, color:r.iconeTxt, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <r.Icone style={{ width:12, height:12 }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11, fontWeight:500, color:'#0d1e35', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.nome}</div>
                      </div>
                      <span style={{ fontSize:9, color:'#9baaba', fontFamily:'"IBM Plex Mono",monospace', flexShrink:0 }}>{r.tempo}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={SL}>Notificacoes <div style={{ flex:1, height:1, background:'#ccdaee' }} /></div>
                <div style={{ background:'#fff', border:'1px solid #ccdaee', borderRadius:4, overflow:'hidden' }}>
                  {NOTIFS.map((n,i) => (
                    <div key={i} style={{ padding:'8px 12px', borderBottom: i < NOTIFS.length-1 ? '1px solid #f0f4f9':'none', display:'flex', alignItems:'flex-start', gap:8, background: n.lida ? '#fff':'#fafcff' }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', flexShrink:0, marginTop:4, background: notifDotColor(n.tipo) }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:'#0d1e35', lineHeight:1.4, fontWeight: n.lida ? 400 : 500 }}>{n.texto}</div>
                        <div style={{ fontSize:9, color:'#9baaba', marginTop:1, fontFamily:'"IBM Plex Mono",monospace' }}>{n.tempo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <div>
              <div style={SL}>Obras em andamento <div style={{ flex:1, height:1, background:'#ccdaee' }} /></div>
              <div style={{ background:'#fff', border:'1px solid #ccdaee', borderRadius:4, overflow:'hidden' }}>
                {OBRAS.map((o,i) => (
                  <div key={i} style={{ padding:'8px 12px', borderBottom: i < OBRAS.length-1 ? '1px solid #f0f4f9':'none', display:'flex', alignItems:'center', gap:8, cursor:'pointer', transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f8fafd'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <div style={{ width:3, height:32, borderRadius:2, background:o.cor, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:'#0d1e35', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{o.nome}</div>
                      <div style={{ fontSize:10, color:'#6b7a90', marginTop:1 }}>{o.meta}</div>
                      <div style={{ height:3, background:'#e8edf5', borderRadius:2, overflow:'hidden', marginTop:4 }}>
                        <div style={{ width:`${o.pct}%`, height:'100%', background:o.cor, borderRadius:2 }} />
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:12, fontWeight:500, color:'#0d1e35' }}>{o.pct}%</div>
                      <div style={{ fontSize:9, color: o.pct < o.plan ? '#b91c1c':'#6b7a90', marginTop:1 }}>plan. {o.plan}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={SL}>Favoritos <div style={{ flex:1, height:1, background:'#ccdaee' }} /></div>
              <div style={{ background:'#fff', border:'1px solid #ccdaee', borderRadius:4, overflow:'hidden' }}>
                {favRow.length === 0 && (
                  <div style={{ padding:'16px 12px', fontSize:11, color:'#9baaba', textAlign:'center' }}>Nenhum favorito. Clique na estrela nos modulos.</div>
                )}
                {favRow.map((m,i) => (
                  <div key={m.id} onClick={() => onSelectModulo(m.id)}
                    style={{ padding:'8px 12px', borderBottom:'1px solid #f0f4f9', display:'flex', alignItems:'center', gap:8, cursor:'pointer', transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f5f9ff'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <div style={{ width:24, height:24, borderRadius:3, background:m.iconeC, color:m.iconeTxt, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <m.Icone style={{ width:12, height:12 }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, fontWeight:500, color:'#0d1e35' }}>{m.nome}</div>
                      <div style={{ fontSize:10, color:'#6b7a90' }}>{m.desc}</div>
                    </div>
                    <span style={{ fontSize:14, color:'#ccdaee' }}>&rsaquo;</span>
                  </div>
                ))}
                {favRow.length < 3 && (
                  <div style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:8, borderTop: favRow.length > 0 ? '1px solid #f0f4f9':'none' }}>
                    <div style={{ width:24, height:24, borderRadius:3, background:'#eef2f8', color:'#6b7a90', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:13 }}>&#9734;</div>
                    <div style={{ fontSize:11, color:'#9baaba' }}>Adicionar favorito...</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:20, fontSize:10, color:'#9baaba', fontFamily:'"IBM Plex Mono",monospace', letterSpacing:'0.05em' }}>
            CONSTRUTOR &middot; PRO &middot; EST.PARAM v2.0 &middot; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTIMATIVA WRAPPER — botao voltar no canto inferior direito, sem interferir
// ═══════════════════════════════════════════════════════════════════════════
function EstimativaWrapper({ onVoltar }) {
  return (
    <div>
      <EstimativaApp />
      <button
        onClick={onVoltar}
        title="Voltar ao Inicio"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          fontWeight: 600,
          color: '#fff',
          background: '#0d1e35',
          border: '1px solid rgba(46,111,173,0.5)',
          borderRadius: 4,
          padding: '8px 14px',
          cursor: 'pointer',
          fontFamily: '"IBM Plex Sans",sans-serif',
          boxShadow: '0 4px 16px rgba(13,30,53,0.35)',
          letterSpacing: '0.02em',
          transition: 'background .15s, box-shadow .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#2e6fad'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(46,111,173,0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#0d1e35'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,30,53,0.35)'; }}
      >
        <Home style={{ width: 13, height: 13 }} /> Inicio
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
const MODULOS_META = {
  obras:         { nome:'Obras',         desc:'Cadastro de obras, equipes, documentos e diario de obra.',      iconeC:'#d4f1e8', iconeTxt:'#0a5c47', Icone:Building2     },
  orcamentos:    { nome:'Orcamentos',    desc:'Composicoes de custo, BDI, revisoes e fluxo de aprovacoes.',   iconeC:'#fef3c7', iconeTxt:'#92400e', Icone:ClipboardList },
  levantamentos: { nome:'Levantamentos', desc:'Quantitativos de servicos e memoria de calculo.',              iconeC:'#ffedd5', iconeTxt:'#9a3412', Icone:Layers        },
  planejamento:  { nome:'Planejamento',  desc:'EAP, cronograma fisico-financeiro e curva S.',                 iconeC:'#ede9fe', iconeTxt:'#5b21b6', Icone:Calendar      },
  cronograma:    { nome:'Cronograma',    desc:'Grafico de Gantt, linha de balanco e controle de prazo.',      iconeC:'#dcfce7', iconeTxt:'#166534', Icone:BarChart3     },
  controles:     { nome:'Controles',     desc:'Medicoes, avanco fisico-financeiro e analise de desvios.',     iconeC:'#e8edf5', iconeTxt:'#334155', Icone:TrendingUp    },
  indicadores:   { nome:'Indicadores',   desc:'KPIs, dashboards gerenciais e acompanhamento da obra.',        iconeC:'#fce7f3', iconeTxt:'#9d174d', Icone:Activity      },
};

export default function HomeApp() {
  const [authUser,    setAuthUser]    = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [modulo,      setModulo]      = useState(null);

  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      if (!sb) { setAuthUser({ id:'local', email:'local' }); setAuthLoading(false); return; }
      const { data: { session } } = await sb.auth.getSession();
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
      const { data: { subscription } } = sb.auth.onAuthStateChange((_e, sess) => setAuthUser(sess?.user ?? null));
      return () => subscription?.unsubscribe();
    })();
  }, []);

  const handleLogout = async () => {
    const sb = await loadSupabase();
    await sb?.auth.signOut();
    setAuthUser(null);
    setModulo(null);
  };

  if (authLoading) return (
    <div style={{ minHeight:'100vh', background:'#0d1e35', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13, fontFamily:'"IBM Plex Mono",monospace' }}>Carregando...</div>
    </div>
  );

  if (!authUser) return <LoginView onLogin={setAuthUser} />;

  if (!modulo) return <HomeView authUser={authUser} onSelectModulo={setModulo} onLogout={handleLogout} />;

  if (modulo === 'estimativa') return <EstimativaWrapper onVoltar={() => setModulo(null)} />;

  const meta = MODULOS_META[modulo] || { nome: modulo, desc:'', iconeC:'#ddeeff', iconeTxt:'#1c5ea0', Icone:Building2 };
  return <ModuloEmDesenvolvimento {...meta} onVoltar={() => setModulo(null)} />;
}
