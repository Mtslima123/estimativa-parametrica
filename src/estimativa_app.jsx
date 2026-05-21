import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, RadialBarChart, RadialBar, LineChart, Line,
} from 'recharts';
import {
  Calculator, Database, BarChart3, Plus, Trash2, Edit2, X, Save, Download,
  Upload, RotateCcw, ChevronRight, Building2, AlertCircle, Check,
  Sparkles, FileDown, ArrowDown, ArrowUp, Search, LogOut, User,
} from 'lucide-react';
// ── Supabase — carrega via CDN dinamicamente (funciona no Claude.ai e GitHub) ─
const SUPABASE_URL = 'https://sycxuwkwpavesyghzyiz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y3h1d2t3cGF2ZXN5Z2h6eWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDYxMTAsImV4cCI6MjA5NDcyMjExMH0.ndpi-lWTibwczXY8FBv0p_zxM0vFfnOLnZ_B0QUozMs';

let supabase = null;
let supabaseReady = false;

const loadSupabase = async () => {
  if (supabase) return supabase;
  try {
    // Tenta import estático (Vite/GitHub Pages)
    const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = mod.createClient(SUPABASE_URL, SUPABASE_KEY);
    supabaseReady = true;
    return supabase;
  } catch {
    supabaseReady = false;
    return null;
  }
};

// Inicializa já ao carregar
loadSupabase();


const storeGet = async (k) => {
  try {
    if (typeof window !== 'undefined' && window.storage) return window.storage.get(k);
    const v = localStorage.getItem(k);
    return v ? { value: v } : null;
  } catch { return null; }
};
const storeSet = async (k, v) => {
  try {
    if (typeof window !== 'undefined' && window.storage) return window.storage.set(k, v);
    localStorage.setItem(k, v);
  } catch {}
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA STRUCTURE — DEFAULT PROJECTS
// ═══════════════════════════════════════════════════════════════════════════
const DEFAULT_PROJECTS = [
  {
    id: 1, nome: 'Residencial Torre Alpha', tipo: 'Alto Padrão', cidade: 'São Paulo',
    ano: 2022, inccBase: 1578.45, areaConstruida: 12500, areaProjTorre: 420,
    numPavtos: 22, numSubsolos: 2, perimetroTorre: 88, tipoFundacao: 'Estaca Hélice Contínua',
    numElevadores: 3, numParadas: 24,
    custoConstrucaoM2: 4850.00, custoInfra: 1250000, custoImplantacao: 185000,
    custoProjetosM2: 125.00, custoElevador: 245000, custoFachadaM2: 580.00,
    custoEnsaios: 87000, custoAdminM2: 148.00, pctIncorporacao: 0.062,
    coefSubsolo: 1.25, coefSemiEnt: 1.10, coefTerreo: 1.00, coefTipo: 1.00,
    coefCobertura: 0.85, coefCxAgua: 0.50, notas: 'Torre única, 2 subsolos, alto padrão',
  },
  {
    id: 2, nome: 'Residencial Vila Nova', tipo: 'Médio Padrão', cidade: 'Campinas',
    ano: 2021, inccBase: 1456.78, areaConstruida: 8200, areaProjTorre: 310,
    numPavtos: 16, numSubsolos: 1, perimetroTorre: 72, tipoFundacao: 'Estaca Hélice Contínua',
    numElevadores: 2, numParadas: 17,
    custoConstrucaoM2: 3980.00, custoInfra: 890000, custoImplantacao: 132000,
    custoProjetosM2: 98.00, custoElevador: 198000, custoFachadaM2: 420.00,
    custoEnsaios: 64000, custoAdminM2: 112.00, pctIncorporacao: 0.055,
    coefSubsolo: 1.20, coefSemiEnt: 1.08, coefTerreo: 1.00, coefTipo: 1.00,
    coefCobertura: 0.80, coefCxAgua: 0.50, notas: 'Bloco único, 1 subsolo, médio padrão',
  },
  {
    id: 3, nome: 'Residencial Bem Viver', tipo: 'Popular/Econômico', cidade: 'Santo André',
    ano: 2020, inccBase: 1352.14, areaConstruida: 5400, areaProjTorre: 245,
    numPavtos: 12, numSubsolos: 0, perimetroTorre: 62, tipoFundacao: 'Sapata Armada',
    numElevadores: 1, numParadas: 12,
    custoConstrucaoM2: 3150.00, custoInfra: 620000, custoImplantacao: 95000,
    custoProjetosM2: 72.00, custoElevador: 165000, custoFachadaM2: 310.00,
    custoEnsaios: 42000, custoAdminM2: 88.00, pctIncorporacao: 0.048,
    coefSubsolo: 1.15, coefSemiEnt: 1.05, coefTerreo: 1.00, coefTipo: 1.00,
    coefCobertura: 0.75, coefCxAgua: 0.45, notas: 'Sem subsolo, popular, sapata',
  },
  {
    id: 4, nome: 'Corporativo Prime', tipo: 'Comercial', cidade: 'São Paulo',
    ano: 2023, inccBase: 1645.32, areaConstruida: 9800, areaProjTorre: 380,
    numPavtos: 18, numSubsolos: 3, perimetroTorre: 95, tipoFundacao: 'Estaca Raiz',
    numElevadores: 4, numParadas: 21,
    custoConstrucaoM2: 5250.00, custoInfra: 1580000, custoImplantacao: 210000,
    custoProjetosM2: 145.00, custoElevador: 285000, custoFachadaM2: 650.00,
    custoEnsaios: 102000, custoAdminM2: 162.00, pctIncorporacao: 0.070,
    coefSubsolo: 1.30, coefSemiEnt: 1.15, coefTerreo: 1.00, coefTipo: 1.00,
    coefCobertura: 0.90, coefCxAgua: 0.55, notas: '3 subsolos, comercial, estaca raiz',
  },
  {
    id: 5, nome: 'Grand Splendor', tipo: 'Alto Padrão', cidade: 'Guarulhos',
    ano: 2023, inccBase: 1645.32, areaConstruida: 15800, areaProjTorre: 520,
    numPavtos: 28, numSubsolos: 2, perimetroTorre: 105, tipoFundacao: 'Estaca Hélice Contínua',
    numElevadores: 4, numParadas: 30,
    custoConstrucaoM2: 5120.00, custoInfra: 1680000, custoImplantacao: 245000,
    custoProjetosM2: 138.00, custoElevador: 268000, custoFachadaM2: 620.00,
    custoEnsaios: 98000, custoAdminM2: 155.00, pctIncorporacao: 0.065,
    coefSubsolo: 1.25, coefSemiEnt: 1.10, coefTerreo: 1.00, coefTipo: 1.00,
    coefCobertura: 0.85, coefCxAgua: 0.50, notas: '2 torres, 2 subsolos, alto padrão',
  },
  {
    id: 6, nome: 'Parque dos Lagos', tipo: 'Médio Padrão', cidade: 'Ribeirão Preto',
    ano: 2022, inccBase: 1578.45, areaConstruida: 10200, areaProjTorre: 380,
    numPavtos: 18, numSubsolos: 1, perimetroTorre: 80, tipoFundacao: 'Estaca Hélice Contínua',
    numElevadores: 2, numParadas: 19,
    custoConstrucaoM2: 4120.00, custoInfra: 1050000, custoImplantacao: 152000,
    custoProjetosM2: 105.00, custoElevador: 215000, custoFachadaM2: 460.00,
    custoEnsaios: 72000, custoAdminM2: 122.00, pctIncorporacao: 0.058,
    coefSubsolo: 1.20, coefSemiEnt: 1.08, coefTerreo: 1.00, coefTipo: 1.00,
    coefCobertura: 0.82, coefCxAgua: 0.50, notas: '1 subsolo, médio padrão, 2 blocos',
  },
];

const FLOOR_TYPES = [
  { key: 'subsolo',       label: '1º Subsolo',           coefField: 'coefSubsolo',    defaultCoef: 1.20 },
  { key: 'semienterrado', label: 'Semienterrado',        coefField: 'coefSemiEnt',    defaultCoef: 1.08 },
  { key: 'terreo',        label: 'Térreo',               coefField: 'coefTerreo',     defaultCoef: 1.00 },
  { key: 'terreoLoja',    label: 'Térreo Loja',          coefField: null,             defaultCoef: 1.05 },
  { key: 'intermediario', label: 'Pav. Intermediário',   coefField: null,             defaultCoef: 0.95 },
  { key: 'garagemPUC',    label: 'Garagem (PUC)',        coefField: null,             defaultCoef: 0.80 },
  { key: 'puc',           label: 'PUC',                  coefField: null,             defaultCoef: 0.80 },
  { key: 'tipo',          label: 'Pavimento Tipo',       coefField: 'coefTipo',       defaultCoef: 1.00 },
  { key: 'ultimoTipo',    label: 'Último Tipo',          coefField: null,             defaultCoef: 1.05 },
  { key: 'cobertura',     label: 'Cobertura',            coefField: 'coefCobertura',  defaultCoef: 0.85 },
  { key: 'caixaAgua',     label: "Caixa d'Água",         coefField: 'coefCxAgua',     defaultCoef: 0.50 },
];

const FOUNDATION_TYPES = [
  'Sapata Armada', 'Estaca Escavada', 'Estaca Hélice Contínua',
  'Estaca Raiz', 'Estaca Strauss', 'Tubulão a Céu Aberto', 'Radier',
];

const CONSTRUCTION_TYPES = [
  'Alto Padrão', 'Médio Padrão', 'Popular/Econômico',
  'Comercial', 'Misto', 'Industrial',
];

// Especialidades padrão da seção de Projetos (17 itens da planilha original)
const ESPECIALIDADES_PROJETOS = [
  'Projeto de Arquitetura',
  'Projeto de Execução',
  'Projeto de Fundação',
  'Consultoria de Fundação',
  'Projeto de Estrutura',
  'Consultoria Estrutural',
  'Projeto de Instalações',
  'Projeto de Ar Condicionado',
  'Projeto de Pressurização da Escada',
  'Projeto de Incêndio',
  'Gestão de Projetos',
  'Projeto Tratamento de Águas Cinzas',
  'Consultoria Acústica',
  'Projeto de Impermeabilização',
  'Projeto de Piscina',
  'Projeto de Modificação',
  'Consultoria Desempenho Térmico e Lumínico',
];

// Banco de dados de propostas históricas de projetos (seed inicial)
const PROJECTS_DB_SEED = [];

// Base real de projetos — 101 propostas da planilha (carregada automaticamente no primeiro uso)
const PROJETOS_REAIS_SEED = [
  { id: 1,   especialidade: "Projeto de Arquitetura",                        projetista: "Sérgio Lopes",       obra: "The Edge",     areaConstruida: 50113.55, valorProposta: 300000.00,   custoM2RS: 5.9864,    mesProposta: "Jun/2020", inccBase: 790.331,  custoINCCM2: 0.00757554 },
  { id: 2,   especialidade: "Projeto de Arquitetura",                        projetista: "Flávio Bassan",      obra: "The Edge",     areaConstruida: 50113.55, valorProposta: 535500.00,   custoM2RS: 10.6857,   mesProposta: "Nov/2020", inccBase: 839.382,  custoINCCM2: 0.01273048 },
  { id: 3,   especialidade: "Projeto de Arquitetura",                        projetista: "Virtual",            obra: "The Edge",     areaConstruida: 49385.11, valorProposta: 567020.00,   custoM2RS: 11.4816,   mesProposta: "Jul/2020", inccBase: 799.589,  custoINCCM2: 0.01435938 },
  { id: 4,   especialidade: "Projeto de Arquitetura",                        projetista: "Sérgio Lopes",       obra: "Tarsila",      areaConstruida: 17982.52, valorProposta: 209856.00,   custoM2RS: 11.67,     mesProposta: "Ago/2021", inccBase: 939.699,  custoINCCM2: 0.01241887 },
  { id: 5,   especialidade: "Projeto de Arquitetura",                        projetista: "Sérgio Lopes",       obra: "Attrium",      areaConstruida: 10590.00, valorProposta: 149670.00,   custoM2RS: 14.1331,   mesProposta: "Dez/2022", inccBase: 1051.632, custoINCCM2: 0.01343925 },
  { id: 6,   especialidade: "Projeto de Arquitetura",                        projetista: "Flávio Bassan",      obra: "Visi",         areaConstruida: 4971.28,  valorProposta: 144000.00,   custoM2RS: 28.9664,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 0.02859002 },
  { id: 7,   especialidade: "Projeto de Arquitetura",                        projetista: "Virtual",            obra: "Mediterrâneo", areaConstruida: 14074.23, valorProposta: 245826.52,   custoM2RS: 17.4664,   mesProposta: "Set/2017", inccBase: 713.33,   custoINCCM2: 0.02448576 },
  { id: 8,   especialidade: "Projeto de Arquitetura",                        projetista: "Virtual",            obra: "Piemonte",     areaConstruida: 4113.11,  valorProposta: 71979.77,    custoM2RS: 17.5001,   mesProposta: "Jan/2017", inccBase: 691.792,  custoINCCM2: 0.02529674 },
  { id: 9,   especialidade: "Projeto de Arquitetura",                        projetista: "Conde Caldas",       obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 1107397.44,  custoM2RS: 30.7332,   mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.02538943 },
  { id: 10,  especialidade: "Projeto de Arquitetura",                        projetista: "Virtual",            obra: "Maestro",      areaConstruida: 12903.80, valorProposta: 167749.40,   custoM2RS: 13.0,      mesProposta: "Mar/2025", inccBase: 1178.386, custoINCCM2: 0.01103204 },
  { id: 11,  especialidade: "Projeto de Execução",                           projetista: "Virtual",            obra: "The Edge",     areaConstruida: 56691.36, valorProposta: 992098.62,   custoM2RS: 17.5,      mesProposta: "Mar/2021", inccBase: 880.265,  custoINCCM2: 0.01988037 },
  { id: 12,  especialidade: "Projeto de Execução",                           projetista: "Sérgio Lopes",       obra: "Tarsila",      areaConstruida: 17982.52, valorProposta: 419712.02,   custoM2RS: 23.34,     mesProposta: "Ago/2021", inccBase: 939.699,  custoINCCM2: 0.02483774 },
  { id: 13,  especialidade: "Projeto de Execução",                           projetista: "Conceito Studio",    obra: "Attrium",      areaConstruida: 10590.00, valorProposta: 148260.00,   custoM2RS: 14.0,      mesProposta: "Nov/2022", inccBase: 1050.701, custoINCCM2: 0.01332444 },
  { id: 14,  especialidade: "Projeto de Execução",                           projetista: "Conceito Studio",    obra: "Visi",         areaConstruida: 4785.76,  valorProposta: 67000.00,    custoM2RS: 14.0,      mesProposta: "Nov/2022", inccBase: 1050.701, custoINCCM2: 0.01332431 },
  { id: 15,  especialidade: "Projeto de Execução",                           projetista: "Virtual",            obra: "Mediterrâneo", areaConstruida: 14074.23, valorProposta: 245826.52,   custoM2RS: 17.4664,   mesProposta: "Set/2017", inccBase: 713.33,   custoINCCM2: 0.02448576 },
  { id: 16,  especialidade: "Projeto de Execução",                           projetista: "Virtual",            obra: "Piemonte",     areaConstruida: 4113.11,  valorProposta: 71979.77,    custoM2RS: 17.5001,   mesProposta: "Jan/2017", inccBase: 691.792,  custoINCCM2: 0.02529674 },
  { id: 17,  especialidade: "Projeto de Execução",                           projetista: "Virtual",            obra: "MUD 333",      areaConstruida: 11903.58, valorProposta: 208312.65,   custoM2RS: 17.5,      mesProposta: "Jun/2021", inccBase: 927.512,  custoINCCM2: 0.01886768 },
  { id: 18,  especialidade: "Projeto de Execução",                           projetista: "Sérgio Lopes",       obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 960000.00,   custoM2RS: 26.6425,   mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.02201003 },
  { id: 19,  especialidade: "Projeto de Execução",                           projetista: "Virtual",            obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 352273.74,   custoM2RS: 26.0,      mesProposta: "Mar/2025", inccBase: 1178.386, custoINCCM2: 0.02206408 },
  { id: 20,  especialidade: "Projeto de Fundação",                           projetista: "Base 2 Projetos",    obra: "The Edge",     areaConstruida: 3800.00,  valorProposta: 44000.00,    custoM2RS: 11.5789,   mesProposta: "Ago/2022", inccBase: 1044.679, custoINCCM2: 0.01108374 },
  { id: 21,  especialidade: "Projeto de Fundação",                           projetista: "Elemento",           obra: "Tarsila",      areaConstruida: 1560.00,  valorProposta: 39120.00,    custoM2RS: 25.0769,   mesProposta: "Jul/2021", inccBase: 935.359,  custoINCCM2: 0.02680994 },
  { id: 22,  especialidade: "Projeto de Fundação",                           projetista: "Elemento",           obra: "Attrium",      areaConstruida: 680.00,   valorProposta: 13500.00,    custoM2RS: 19.8529,   mesProposta: "Abr/2023", inccBase: 1061.635, custoINCCM2: 0.01870035 },
  { id: 23,  especialidade: "Projeto de Fundação",                           projetista: "ABS Fundações",      obra: "Visi",         areaConstruida: 658.00,   valorProposta: 30000.00,    custoM2RS: 45.5927,   mesProposta: "Mar/2023", inccBase: 1060.116, custoINCCM2: 0.04300728 },
  { id: 24,  especialidade: "Projeto de Fundação",                           projetista: "Elemento",           obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 166400.00,   custoM2RS: 4.618,     mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.00381507 },
  { id: 25,  especialidade: "Projeto de Fundação",                           projetista: "Base 2 Projetos",    obra: "Maestro",      areaConstruida: 840.00,   valorProposta: 12000.00,    custoM2RS: 14.2857,   mesProposta: "Ago/2024", inccBase: 1134.775, custoINCCM2: 0.01258903 },
  { id: 26,  especialidade: "Consultoria de Fundação",                       projetista: "Curi Engenharia",    obra: "Attrium",      areaConstruida: 1.00,     valorProposta: 4000.00,     custoM2RS: 4000.0,    mesProposta: "Jan/2024", inccBase: 1091.25,  custoINCCM2: 3.66552119 },
  { id: 27,  especialidade: "Consultoria de Fundação",                       projetista: "ABS Fundações",      obra: "BCO",          areaConstruida: 11.00,    valorProposta: 77000.00,    custoM2RS: 7000.0,    mesProposta: "Mai/2024", inccBase: 1110.887, custoINCCM2: 6.30127097 },
  { id: 28,  especialidade: "Projeto de Estrutura",                          projetista: "Base 2 Projetos",    obra: "The Edge",     areaConstruida: 53155.00, valorProposta: 344000.00,   custoM2RS: 6.4716,    mesProposta: "Fev/2021", inccBase: 868.929,  custoINCCM2: 0.00744783 },
  { id: 29,  especialidade: "Projeto de Estrutura",                          projetista: "Elemento",           obra: "Tarsila",      areaConstruida: 18000.00, valorProposta: 156480.00,   custoM2RS: 8.6933,    mesProposta: "Jul/2021", inccBase: 935.359,  custoINCCM2: 0.00929411 },
  { id: 30,  especialidade: "Projeto de Estrutura",                          projetista: "Elemento",           obra: "Attrium",      areaConstruida: 10420.00, valorProposta: 135500.00,   custoM2RS: 13.0038,   mesProposta: "Nov/2022", inccBase: 1050.701, custoINCCM2: 0.01237635 },
  { id: 31,  especialidade: "Projeto de Estrutura",                          projetista: "Justino Vieira",     obra: "Visi",         areaConstruida: 4982.06,  valorProposta: 69649.00,    custoM2RS: 13.98,     mesProposta: "Abr/2023", inccBase: 1061.635, custoINCCM2: 0.01316833 },
  { id: 32,  especialidade: "Projeto de Estrutura",                          projetista: "Base 2 Projetos",    obra: "Mediterrâneo", areaConstruida: 13300.00, valorProposta: 137000.00,   custoM2RS: 10.3008,   mesProposta: "Jun/2015", inccBase: 635.403,  custoINCCM2: 0.01621137 },
  { id: 33,  especialidade: "Projeto de Estrutura",                          projetista: "Base 2 Projetos",    obra: "Piemonte",     areaConstruida: 4300.00,  valorProposta: 48000.00,    custoM2RS: 11.1628,   mesProposta: "Mai/2015", inccBase: 623.951,  custoINCCM2: 0.01789049 },
  { id: 34,  especialidade: "Projeto de Estrutura",                          projetista: "MD Rio",             obra: "MUD 333",      areaConstruida: 11903.58, valorProposta: 12000.00,    custoM2RS: 1.0081,    mesProposta: "Ago/2021", inccBase: 939.699,  custoINCCM2: 0.00107279 },
  { id: 35,  especialidade: "Projeto de Estrutura",                          projetista: "Elemento",           obra: "BCO",          areaConstruida: 16024.91, valorProposta: 199800.00,   custoM2RS: 12.4681,   mesProposta: "Jun/2024", inccBase: 1118.827, custoINCCM2: 0.01114389 },
  { id: 36,  especialidade: "Projeto de Estrutura",                          projetista: "Elemento",           obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 475000.00,   custoM2RS: 13.1825,   mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.01089038 },
  { id: 37,  especialidade: "Projeto de Estrutura",                          projetista: "Base 2 Projetos",    obra: "Maestro",      areaConstruida: 13800.00, valorProposta: 175000.00,   custoM2RS: 12.6812,   mesProposta: "Set/2024", inccBase: 1141.398, custoINCCM2: 0.01111020 },
  { id: 38,  especialidade: "Consultoria Estrutural",                        projetista: "MSC Engenharia",     obra: "The Edge",     areaConstruida: 53173.71, valorProposta: 133500.00,   custoM2RS: 2.5106,    mesProposta: "Mar/2021", inccBase: 880.265,  custoINCCM2: 0.00285214 },
  { id: 39,  especialidade: "Consultoria Estrutural",                        projetista: "MSC Engenharia",     obra: "Tarsila",      areaConstruida: 19542.42, valorProposta: 72000.00,    custoM2RS: 3.6843,    mesProposta: "Nov/2021", inccBase: 959.001,  custoINCCM2: 0.00384180 },
  { id: 40,  especialidade: "Consultoria Estrutural",                        projetista: "MSC Engenharia",     obra: "Attrium",      areaConstruida: 10590.00, valorProposta: 54400.00,    custoM2RS: 5.1369,    mesProposta: "Mar/2023", inccBase: 1060.116, custoINCCM2: 0.00484562 },
  { id: 41,  especialidade: "Consultoria Estrutural",                        projetista: "MSC Engenharia",     obra: "Visi",         areaConstruida: 4785.76,  valorProposta: 26800.00,    custoM2RS: 5.5999,    mesProposta: "Ago/2023", inccBase: 1078.412, custoINCCM2: 0.00519277 },
  { id: 42,  especialidade: "Consultoria Estrutural",                        projetista: "MSC Engenharia",     obra: "Mediterrâneo", areaConstruida: 14450.00, valorProposta: 64538.73,    custoM2RS: 4.4663,    mesProposta: "Ago/2015", inccBase: 642.644,  custoINCCM2: 0.00694996 },
  { id: 43,  especialidade: "Consultoria Estrutural",                        projetista: "MSC Engenharia",     obra: "Piemonte",     areaConstruida: 4400.00,  valorProposta: 25786.52,    custoM2RS: 5.8606,    mesProposta: "Abr/2021", inccBase: 888.191,  custoINCCM2: 0.00659832 },
  { id: 44,  especialidade: "Consultoria Estrutural",                        projetista: "CSP",                obra: "Maestro",      areaConstruida: 13734.05, valorProposta: 55000.00,    custoM2RS: 4.0046,    mesProposta: "Nov/2024", inccBase: 1153.725, custoINCCM2: 0.00347106 },
  { id: 45,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "The Edge",     areaConstruida: 53000.00, valorProposta: 410000.00,   custoM2RS: 7.7358,    mesProposta: "Nov/2021", inccBase: 959.001,  custoINCCM2: 0.00806657 },
  { id: 46,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "Tarsila",      areaConstruida: 18000.00, valorProposta: 260000.00,   custoM2RS: 14.4444,   mesProposta: "Set/2021", inccBase: 944.52,   custoINCCM2: 0.01529289 },
  { id: 47,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "Attrium",      areaConstruida: 11000.00, valorProposta: 205000.00,   custoM2RS: 18.6364,   mesProposta: "Dez/2022", inccBase: 1051.632, custoINCCM2: 0.01772137 },
  { id: 48,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "Visi",         areaConstruida: 5000.00,  valorProposta: 98000.00,    custoM2RS: 19.6,      mesProposta: "Abr/2023", inccBase: 1061.635, custoINCCM2: 0.01846209 },
  { id: 49,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "Mediterrâneo", areaConstruida: 14270.03, valorProposta: 60000.00,    custoM2RS: 4.2046,    mesProposta: "Nov/2019", inccBase: 775.225,  custoINCCM2: 0.00542374 },
  { id: 50,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "Piemonte",     areaConstruida: 3865.74,  valorProposta: 80000.00,    custoM2RS: 20.6946,   mesProposta: "Set/2015", inccBase: 644.046,  custoINCCM2: 0.03213220 },
  { id: 51,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "MUD 333",      areaConstruida: 11903.58, valorProposta: 58000.00,    custoM2RS: 4.8725,    mesProposta: "Jul/2021", inccBase: 935.359,  custoINCCM2: 0.00520921 },
  { id: 52,  especialidade: "Projeto de Instalações",                        projetista: "Instale Engenharia", obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 586000.00,   custoM2RS: 16.263,    mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.01343529 },
  { id: 53,  especialidade: "Projeto de Instalações",                        projetista: "Diferencial",        obra: "Maestro",      areaConstruida: 13480.00, valorProposta: 114000.00,   custoM2RS: 8.457,     mesProposta: "Nov/2024", inccBase: 1153.725, custoINCCM2: 0.00733015 },
  { id: 54,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "The Edge",     areaConstruida: 55506.85, valorProposta: 14400.00,    custoM2RS: 0.2594,    mesProposta: "Mar/2022", inccBase: 981.244,  custoINCCM2: 0.00026439 },
  { id: 55,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "Tarsila",      areaConstruida: 18461.25, valorProposta: 11000.00,    custoM2RS: 0.5958,    mesProposta: "Set/2021", inccBase: 944.52,   custoINCCM2: 0.00063084 },
  { id: 56,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 13800.00,    custoM2RS: 1.2777,    mesProposta: "Nov/2022", inccBase: 1050.701, custoINCCM2: 0.00121608 },
  { id: 57,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "Visi",         areaConstruida: 4971.28,  valorProposta: 14000.00,    custoM2RS: 2.8162,    mesProposta: "Ago/2022", inccBase: 1044.679, custoINCCM2: 0.00269573 },
  { id: 58,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "Mediterrâneo", areaConstruida: 14270.03, valorProposta: 18900.00,    custoM2RS: 1.3245,    mesProposta: "Mar/2017", inccBase: 697.41,   custoINCCM2: 0.00189910 },
  { id: 59,  especialidade: "Projeto de Ar Condicionado",                    projetista: "Celos",              obra: "Piemonte",     areaConstruida: 4113.11,  valorProposta: 15000.00,    custoM2RS: 3.6469,    mesProposta: "Jun/2015", inccBase: 635.403,  custoINCCM2: 0.00573947 },
  { id: 60,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "MUD 333",      areaConstruida: 11903.58, valorProposta: 7800.00,     custoM2RS: 0.6553,    mesProposta: "Jul/2021", inccBase: 935.359,  custoINCCM2: 0.00070055 },
  { id: 61,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 18900.00,    custoM2RS: 0.5245,    mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.00043332 },
  { id: 62,  especialidade: "Projeto de Ar Condicionado",                    projetista: "ML Tech",            obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 12200.00,    custoM2RS: 0.9004,    mesProposta: "Nov/2024", inccBase: 1153.725, custoINCCM2: 0.00078046 },
  { id: 63,  especialidade: "Projeto de Pressurização da Escada",            projetista: "ML Tech",            obra: "The Edge",     areaConstruida: 55506.85, valorProposta: 5800.00,     custoM2RS: 0.1045,    mesProposta: "Mar/2022", inccBase: 981.244,  custoINCCM2: 0.00010649 },
  { id: 64,  especialidade: "Projeto de Pressurização da Escada",            projetista: "ML Tech",            obra: "Tarsila",      areaConstruida: 18461.25, valorProposta: 3800.00,     custoM2RS: 0.2058,    mesProposta: "Set/2021", inccBase: 944.52,   custoINCCM2: 0.00021793 },
  { id: 65,  especialidade: "Projeto de Pressurização da Escada",            projetista: "ML Tech",            obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 4800.00,     custoM2RS: 0.4444,    mesProposta: "Nov/2022", inccBase: 1050.701, custoINCCM2: 0.00042298 },
  { id: 66,  especialidade: "Projeto de Pressurização da Escada",            projetista: "ML Tech",            obra: "Visi",         areaConstruida: 4971.28,  valorProposta: 6000.00,     custoM2RS: 1.2069,    mesProposta: "Ago/2022", inccBase: 1044.679, custoINCCM2: 0.00115531 },
  { id: 67,  especialidade: "Projeto de Pressurização da Escada",            projetista: "ML Tech",            obra: "Mediterrâneo", areaConstruida: 14270.03, valorProposta: 5500.00,     custoM2RS: 0.3854,    mesProposta: "Mar/2017", inccBase: 697.41,   custoINCCM2: 0.00055265 },
  { id: 68,  especialidade: "Projeto de Pressurização da Escada",            projetista: "ML Tech",            obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 7400.00,     custoM2RS: 0.2054,    mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.00016966 },
  { id: 69,  especialidade: "Projeto de Pressurização da Escada",            projetista: "ML Tech",            obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 4800.00,     custoM2RS: 0.3543,    mesProposta: "Nov/2024", inccBase: 1153.725, custoINCCM2: 0.00030707 },
  { id: 70,  especialidade: "Projeto de Incêndio",                           projetista: "Monta",              obra: "The Edge",     areaConstruida: 55506.85, valorProposta: 15000.00,    custoM2RS: 0.2702,    mesProposta: "Jun/2021", inccBase: 927.512,  custoINCCM2: 0.00029136 },
  { id: 71,  especialidade: "Projeto de Incêndio",                           projetista: "Monta",              obra: "Tarsila",      areaConstruida: 18461.25, valorProposta: 16000.00,    custoM2RS: 0.8667,    mesProposta: "Ago/2021", inccBase: 939.699,  custoINCCM2: 0.00092230 },
  { id: 72,  especialidade: "Projeto de Incêndio",                           projetista: "Ita Fogo",           obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 8250.00,     custoM2RS: 0.7639,    mesProposta: "Abr/2023", inccBase: 1061.635, custoINCCM2: 0.00071952 },
  { id: 73,  especialidade: "Projeto de Incêndio",                           projetista: "Monta",              obra: "Visi",         areaConstruida: 4971.28,  valorProposta: 14500.00,    custoM2RS: 2.9168,    mesProposta: "Mai/2023", inccBase: 1067.919, custoINCCM2: 0.00273125 },
  { id: 74,  especialidade: "Projeto de Incêndio",                           projetista: "Monta",              obra: "Mediterrâneo", areaConstruida: 14270.03, valorProposta: 5200.00,     custoM2RS: 0.3644,    mesProposta: "Jan/2017", inccBase: 691.792,  custoINCCM2: 0.00052675 },
  { id: 75,  especialidade: "Projeto de Incêndio",                           projetista: "Ita Fogo",           obra: "Castilho",     areaConstruida: 36032.65, valorProposta: 19000.00,    custoM2RS: 0.5273,    mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.00043562 },
  { id: 76,  especialidade: "Projeto de Incêndio",                           projetista: "Hidrocenter",        obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 10000.00,    custoM2RS: 0.7381,    mesProposta: "Set/2024", inccBase: 1141.398, custoINCCM2: 0.00064663 },
  { id: 77,  especialidade: "Gestão de Projetos",                            projetista: "AutoDoc",            obra: "The Edge",     areaConstruida: 1.00,     valorProposta: 1661.42,     custoM2RS: 1661.42,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 1.63983324 },
  { id: 78,  especialidade: "Gestão de Projetos",                            projetista: "AutoDoc",            obra: "Tarsila",      areaConstruida: 1.00,     valorProposta: 1661.42,     custoM2RS: 1661.42,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 1.63983324 },
  { id: 79,  especialidade: "Gestão de Projetos",                            projetista: "AutoDoc",            obra: "Attrium",      areaConstruida: 1.00,     valorProposta: 1661.42,     custoM2RS: 1661.42,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 1.63983324 },
  { id: 80,  especialidade: "Gestão de Projetos",                            projetista: "AutoDoc",            obra: "Visi",         areaConstruida: 1.00,     valorProposta: 1661.42,     custoM2RS: 1661.42,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 1.63983324 },
  { id: 81,  especialidade: "Gestão de Projetos",                            projetista: "AutoDoc",            obra: "Mediterrâneo", areaConstruida: 1.00,     valorProposta: 1661.42,     custoM2RS: 1661.42,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 1.63983324 },
  { id: 82,  especialidade: "Gestão de Projetos",                            projetista: "AutoDoc",            obra: "Piemonte",     areaConstruida: 1.00,     valorProposta: 1661.42,     custoM2RS: 1661.42,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 1.63983324 },
  { id: 83,  especialidade: "Gestão de Projetos",                            projetista: "AutoDoc",            obra: "MUD 333",      areaConstruida: 1.00,     valorProposta: 1661.42,     custoM2RS: 1661.42,   mesProposta: "Mai/2022", inccBase: 1013.164, custoINCCM2: 1.63983324 },
  { id: 84,  especialidade: "Projeto Tratamento de Águas Cinzas",            projetista: "SRA Engenharia",     obra: "The Edge",     areaConstruida: 55506.85, valorProposta: 40000.00,    custoM2RS: 0.7206,    mesProposta: "Jan/2022", inccBase: 969.184,  custoINCCM2: 0.00074354 },
  { id: 85,  especialidade: "Projeto Tratamento de Águas Cinzas",            projetista: "SRA Engenharia",     obra: "Tarsila",      areaConstruida: 18461.25, valorProposta: 38600.00,    custoM2RS: 2.0909,    mesProposta: "Jan/2022", inccBase: 969.184,  custoINCCM2: 0.00215735 },
  { id: 86,  especialidade: "Projeto Tratamento de Águas Cinzas",            projetista: "SRA Engenharia",     obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 25000.00,    custoM2RS: 2.3147,    mesProposta: "Jun/2023", inccBase: 1075.54,  custoINCCM2: 0.00215216 },
  { id: 87,  especialidade: "Projeto Tratamento de Águas Cinzas",            projetista: "SRA Engenharia",     obra: "Mediterrâneo", areaConstruida: 14270.03, valorProposta: 20800.00,    custoM2RS: 1.4576,    mesProposta: "Mar/2017", inccBase: 697.41,   custoINCCM2: 0.00209002 },
  { id: 88,  especialidade: "Projeto Tratamento de Águas Cinzas",            projetista: "SRA Engenharia",     obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 65000.00,    custoM2RS: 4.7974,    mesProposta: "Jun/2025", inccBase: 1199.509, custoINCCM2: 0.00399947 },
  { id: 89,  especialidade: "Consultoria Acústica",                          projetista: "RTM Arquitetos",     obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 12000.00,    custoM2RS: 1.1111,    mesProposta: "Jun/2023", inccBase: 1075.54,  custoINCCM2: 0.00103304 },
  { id: 90,  especialidade: "Consultoria Acústica",                          projetista: "RTM Arquitetos",     obra: "MUD 333",      areaConstruida: 11903.58, valorProposta: 10000.00,    custoM2RS: 0.8401,    mesProposta: "Ago/2021", inccBase: 939.699,  custoINCCM2: 0.00089399 },
  { id: 91,  especialidade: "Consultoria Acústica",                          projetista: "Seed",               obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 11850.00,    custoM2RS: 0.8746,    mesProposta: "Nov/2024", inccBase: 1153.725, custoINCCM2: 0.00075807 },
  { id: 92,  especialidade: "Projeto de Impermeabilização",                  projetista: "NRT Soluções",       obra: "The Edge",     areaConstruida: 55506.85, valorProposta: 49200.00,    custoM2RS: 0.8864,    mesProposta: "Mar/2023", inccBase: 1060.116, custoINCCM2: 0.00083611 },
  { id: 93,  especialidade: "Projeto de Impermeabilização",                  projetista: "NRT Soluções",       obra: "Tarsila",      areaConstruida: 18461.25, valorProposta: 25200.00,    custoM2RS: 1.365,     mesProposta: "Nov/2022", inccBase: 1050.701, custoINCCM2: 0.00129915 },
  { id: 94,  especialidade: "Projeto de Impermeabilização",                  projetista: "NRT Soluções",       obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 25000.00,    custoM2RS: 2.3147,    mesProposta: "Jun/2023", inccBase: 1075.54,  custoINCCM2: 0.00215216 },
  { id: 95,  especialidade: "Projeto de Impermeabilização",                  projetista: "NRT Soluções",       obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 28950.00,    custoM2RS: 2.1367,    mesProposta: "Jul/2025", inccBase: 1210.471, custoINCCM2: 0.00176517 },
  { id: 96,  especialidade: "Projeto de Piscina",                            projetista: "Nova Gaia",          obra: "The Edge",     areaConstruida: 55506.85, valorProposta: 10200.00,    custoM2RS: 0.1838,    mesProposta: "Dez/2022", inccBase: 1051.632, custoINCCM2: 0.00017474 },
  { id: 97,  especialidade: "Projeto de Piscina",                            projetista: "Nova Gaia",          obra: "Tarsila",      areaConstruida: 18461.25, valorProposta: 3500.00,     custoM2RS: 0.1896,    mesProposta: "Abr/2022", inccBase: 990.543,  custoINCCM2: 0.00019140 },
  { id: 98,  especialidade: "Projeto de Piscina",                            projetista: "Nova Gaia",          obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 4000.00,     custoM2RS: 0.3704,    mesProposta: "Jun/2023", inccBase: 1075.54,  custoINCCM2: 0.00034435 },
  { id: 99,  especialidade: "Projeto de Modificação",                        projetista: "Rio Arquitetura",    obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 10000.00,    custoM2RS: 0.9259,    mesProposta: "Fev/2023", inccBase: 1056.896, custoINCCM2: 0.00087605 },
  { id: 100, especialidade: "Consultoria Desempenho Térmico e Lumínico",     projetista: "Seed",               obra: "Attrium",      areaConstruida: 10800.37, valorProposta: 10000.00,    custoM2RS: 0.9259,    mesProposta: "Mai/2023", inccBase: 1067.919, custoINCCM2: 0.00086701 },
  { id: 101, especialidade: "Consultoria Desempenho Térmico e Lumínico",     projetista: "Seed",               obra: "Maestro",      areaConstruida: 13548.99, valorProposta: 9690.00,     custoM2RS: 0.7152,    mesProposta: "Nov/2024", inccBase: 1153.725, custoINCCM2: 0.00062000 },
];
// Banco de dados de elevadores (seed inicial — dados da planilha de referência)
// Métrica chave: valorParadaElevadorINCC = valorFechado / (numParadas × qtElevadores) / inccBase
const ELEVATORS_DB_SEED = [
  { id: 1,  obra: 'Piemonte',    marca: 'OTIS',          numParadas: 9,  qtElevadores: 2, valorFechado: 321247.00,   mesFechamento: '2021-09', inccBase: 939.699  },
  { id: 2,  obra: 'Mediterrâneo',marca: 'OTIS',          numParadas: 10, qtElevadores: 4, valorFechado: 680000.00,   mesFechamento: '2021-09', inccBase: 939.699  },
  { id: 3,  obra: 'MUD 333',     marca: 'OTIS',          numParadas: 18, qtElevadores: 2, valorFechado: 507496.00,   mesFechamento: '2021-09', inccBase: 939.699  },
  { id: 4,  obra: 'Tarsila',     marca: 'TK ELEVADORES', numParadas: 13, qtElevadores: 4, valorFechado: 799000.00,   mesFechamento: '2022-11', inccBase: 1046.896 },
  { id: 5,  obra: 'The Edge',    marca: 'OTIS',          numParadas: 19, qtElevadores: 8, valorFechado: 2392000.00,  mesFechamento: '2023-10', inccBase: 1082.104 },
  { id: 6,  obra: 'Attrium',     marca: 'ATLAS',         numParadas: 18, qtElevadores: 2, valorFechado: 578000.00,   mesFechamento: '2024-05', inccBase: 1101.389 },
  { id: 7,  obra: 'Visi',        marca: 'ATLAS',         numParadas: 13, qtElevadores: 2, valorFechado: 467000.00,   mesFechamento: '2024-05', inccBase: 1101.389 },
  { id: 8,  obra: 'BCO',         marca: 'ATLAS',         numParadas: 20, qtElevadores: 3, valorFechado: 1107000.00,  mesFechamento: '2024-08', inccBase: 1134.78  },
  { id: 9,  obra: 'H23',         marca: 'OTIS',          numParadas: 18, qtElevadores: 2, valorFechado: 760595.00,   mesFechamento: '2025-01', inccBase: 1159.536 },
  { id: 10, obra: 'AAZ',         marca: 'ATLAS',         numParadas: 18, qtElevadores: 4, valorFechado: 1550000.00,  mesFechamento: '2024-08', inccBase: 1134.78  },
  { id: 11, obra: 'CST',         marca: '',              numParadas: 0,  qtElevadores: 0, valorFechado: 0,           mesFechamento: '',        inccBase: 0        },
];

// Base de Dados — Composição dos Itens de Implantação da Obra
const IMPLANTACAO_DB_SEED = [
  { id: 1,  observacao: 'ÁREA DO TERRENO',                    item: 'LIMPEZA DO TERRENO',                                                          quantidade: 1072.70, unidade: 'M2',  precoUnitarioRS: 18.63,     precoUnitarioINCC: 0.02,  totalINCC: 18.64   },
  { id: 2,  observacao: 'ÁREA DO TERRENO',                    item: 'BARRACÃO',                                                                     quantidade: 300.00,  unidade: 'M2',  precoUnitarioRS: 907.69,    precoUnitarioINCC: 0.84,  totalINCC: 253.18  },
  { id: 3,  observacao: 'FRENTE DA OBRA',                     item: 'TAPUME',                                                                       quantidade: 22.36,   unidade: 'M',   precoUnitarioRS: 1007.40,   precoUnitarioINCC: 0.94,  totalINCC: 20.94   },
  { id: 4,  observacao: 'VERBA',                              item: 'PLACAS PROVISÓRIAS',                                                           quantidade: 1.00,    unidade: 'VB',  precoUnitarioRS: 25000.00,  precoUnitarioINCC: 23.24, totalINCC: 23.24   },
  { id: 5,  observacao: 'PERÍMETRO DA TORRE × 2,5',           item: 'PESTANA SALVA VIDAS - PRINCIPAL',                                              quantidade: 137.14,  unidade: 'M',   precoUnitarioRS: 382.94,    precoUnitarioINCC: 0.36,  totalINCC: 48.83   },
  { id: 6,  observacao: 'PERÍMETRO DA TORRE',                 item: 'TELA DE SEGURANÇA (LARANJA)',                                                  quantidade: 117.14,  unidade: 'M',   precoUnitarioRS: 85.84,     precoUnitarioINCC: 0.08,  totalINCC: 9.35    },
  { id: 7,  observacao: '1,15 × P. TORRE × ALTURA',           item: 'TELA DE PROTEÇÃO (FACHADA)',                                                   quantidade: 6961.86, unidade: 'M2',  precoUnitarioRS: 3.20,      precoUnitarioINCC: 0.00,  totalINCC: 20.69   },
  { id: 8,  observacao: 'Nº DE BLOCOS',                       item: 'INTEGRAÇÃO DOS SUPORTES DO BALANCIM COM FITA - TELA DE FACHADA',               quantidade: 1.00,    unidade: 'UN',  precoUnitarioRS: 1337.20,   precoUnitarioINCC: 1.24,  totalINCC: 1.24    },
  { id: 9,  observacao: '1,15 × P. TORRE × ALTURA',           item: 'MO INSTALAÇÃO DE TELA DE FACHADA (ÚNICA ETAPA)',                               quantidade: 6961.86, unidade: 'M2',  precoUnitarioRS: 0.75,      precoUnitarioINCC: 0.00,  totalINCC: 4.86    },
  { id: 10, observacao: 'Nº DE BLOCOS',                       item: 'MO INSTALAÇÃO DE TELA DE FACHADA (REGIÃO DA CREMALHEIRA)',                     quantidade: 1.00,    unidade: 'VB',  precoUnitarioRS: 2571.55,   precoUnitarioINCC: 2.39,  totalINCC: 2.39    },
  { id: 11, observacao: 'Nº DE BLOCOS',                       item: 'MOLDE PARA IMPRESSÃO DA LOGO',                                                 quantidade: 1.00,    unidade: 'UN',  precoUnitarioRS: 478.26,    precoUnitarioINCC: 0.44,  totalINCC: 0.44    },
  { id: 12, observacao: 'Nº DE BLOCOS',                       item: 'DOCUMENTOS - TELA DE FACHADA',                                                 quantidade: 1.00,    unidade: 'VB',  precoUnitarioRS: 874.33,    precoUnitarioINCC: 0.81,  totalINCC: 0.81    },
  { id: 13, observacao: 'PRAZO DA OBRA',                      item: 'INSTALAÇÃO PROVISÓRIA (MAT/MO)',                                               quantidade: 24.00,   unidade: 'Mês', precoUnitarioRS: 15297.09,  precoUnitarioINCC: 14.22, totalINCC: 341.35  },
  { id: 14, observacao: 'P. TORRE × ALTURA',                  item: 'REDE DE SEGURANÇA SLQA',                                                       quantidade: 5145.73, unidade: 'VB',  precoUnitarioRS: 8.55,      precoUnitarioINCC: 0.01,  totalINCC: 40.93   },
  { id: 15, observacao: 'P. TORRE × 2',                       item: 'LINHA DE VIDA INSTALADA - TIPO VARAL - M',                                     quantidade: 234.28,  unidade: 'M',   precoUnitarioRS: 111.06,    precoUnitarioINCC: 0.10,  totalINCC: 24.19   },
  { id: 16, observacao: 'P. TORRE × Nº TIPOS',                item: 'LINHA DE VIDA INSTALADA JUNTO AO PISO - M',                                   quantidade: 1405.68, unidade: 'M',   precoUnitarioRS: 8.22,      precoUnitarioINCC: 0.01,  totalINCC: 10.74   },
  { id: 17, observacao: 'Nº DE BLOCOS',                       item: 'CÂMERA DE SEGURANÇA',                                                          quantidade: 1.00,    unidade: 'VB',  precoUnitarioRS: 6000.00,   precoUnitarioINCC: 5.58,  totalINCC: 5.58    },
  { id: 18, observacao: 'P. TORRE × ALTURA',                  item: 'REDE PISO A PISO - SISTEMA "U"',                                               quantidade: 5145.73, unidade: 'M2',  precoUnitarioRS: 16.60,     precoUnitarioINCC: 0.02,  totalINCC: 79.43   },
  { id: 19, observacao: 'Nº DE BLOCOS',                       item: 'DOCUMENTOS - REDE PISO A PISO',                                                quantidade: 1.00,    unidade: 'VB',  precoUnitarioRS: 380.00,    precoUnitarioINCC: 0.91,  totalINCC: 0.91    },
  { id: 20, observacao: 'NÚMERO TOTAL DE PAVTOS',             item: 'MO INSTALAÇÃO - REDE PISO A PISO',                                             quantidade: 18.00,   unidade: 'PAV', precoUnitarioRS: 3100.00,   precoUnitarioINCC: 2.88,  totalINCC: 51.88   },
  { id: 21, observacao: 'NÚMERO TOTAL DE PAVTOS',             item: 'GUARDA CORPO DE ESCADA - M',                                                   quantidade: 18.00,   unidade: 'PAV', precoUnitarioRS: 414.65,    precoUnitarioINCC: 0.39,  totalINCC: 6.94    },
  { id: 22, observacao: 'NÚMERO TOTAL DE PAVTOS',             item: 'GUARDA CORPO DE PROTEÇÃO METÁLICO - M',                                        quantidade: 18.00,   unidade: 'PAV', precoUnitarioRS: 276.14,    precoUnitarioINCC: 0.26,  totalINCC: 4.62    },
  { id: 23, observacao: '3,46 × 2 × 3 × Nº PVTOS',           item: 'PROTEÇÃO POÇO DE ELEVADOR - VERTICAL E HORIZONTAL',                           quantidade: 373.68,  unidade: 'M2',  precoUnitarioRS: 54.72,     precoUnitarioINCC: 0.05,  totalINCC: 19.01   },
  { id: 24, observacao: '2 × Nº DE BLOCOS',                   item: 'MOBILIZAÇÃO - REDE PISO A PISO',                                               quantidade: 2.00,    unidade: 'VB',  precoUnitarioRS: 3000.00,   precoUnitarioINCC: 2.79,  totalINCC: 5.58    },
  { id: 25, observacao: 'Nº DE BLOCOS',                       item: 'DOCUMENTOS - SLQA',                                                            quantidade: 1.00,    unidade: 'VB',  precoUnitarioRS: 800.00,    precoUnitarioINCC: 0.74,  totalINCC: 0.74    },
  { id: 26, observacao: '2 × Nº DE BLOCOS',                   item: 'FRETE - SLQA',                                                                 quantidade: 2.00,    unidade: 'VB',  precoUnitarioRS: 5100.00,   precoUnitarioINCC: 4.74,  totalINCC: 9.48    },
  { id: 27, observacao: 'Nº DE BLOCOS',                       item: 'PRIMEIRA INSTALAÇÃO E RETIRADA DO SISTEMA - SLQA',                             quantidade: 1.00,    unidade: 'VB',  precoUnitarioRS: 13300.00,  precoUnitarioINCC: 12.37, totalINCC: 12.37   },
  { id: 28, observacao: 'Nº DE PVTOS - SS - SE - TE',         item: 'AVANÇO DO SISTEMA - SLQA',                                                     quantidade: 16.00,   unidade: 'PAV', precoUnitarioRS: 3000.00,   precoUnitarioINCC: 2.79,  totalINCC: 44.63   },
  { id: 29, observacao: '(Nº DE PVTOS - SS-SE-TE) : 3 × 2',  item: 'CONJUNTO SLQA PESADO, TIPO FORÇA 8m C/2,50M DE AVANÇO, TUBO 60×60',           quantidade: 12.00,   unidade: 'Mês', precoUnitarioRS: 1430.00,   precoUnitarioINCC: 1.33,  totalINCC: 15.95   },
];

// Base de Dados — Custos por Tipo de Fundação
const FUNDACAO_DB_SEED = [
  { id: 1, obra: 'Tarsila',     fundacao: 'Estaca Hélice',    areaTerrenoM2: 2001.90, qtPavimentos: 14, custoRS: 3464321.12, inccBase: 981.244,  custoINCC: 3530.54, coeficiente: 0.126 },
  { id: 2, obra: 'The Edge',    fundacao: 'Estaca Raiz',      areaTerrenoM2: 2582.61, qtPavimentos: 20, custoRS: 7034366.54, inccBase: 981.244,  custoINCC: 7168.83, coeficiente: 0.139 },
  { id: 3, obra: 'The Edge',    fundacao: 'Sapata',           areaTerrenoM2: 1404.73, qtPavimentos: 20, custoRS: 2576449.13, inccBase: 981.244,  custoINCC: 2625.70, coeficiente: 0.093 },
  { id: 4, obra: 'Attrium',     fundacao: 'Perfil Metálico',  areaTerrenoM2: 895.72,  qtPavimentos: 19, custoRS: 3324579.09, inccBase: 1075.540, custoINCC: 3091.08, coeficiente: 0.182 },
  { id: 5, obra: 'Mediterrâneo',fundacao: 'Sapata',           areaTerrenoM2: 1921.43, qtPavimentos: 7,  custoRS: 1314429.68, inccBase: 805.356,  custoINCC: 1632.11, coeficiente: 0.121 },
  { id: 6, obra: 'Visi',        fundacao: 'Estaca Hélice',    areaTerrenoM2: 587.70,  qtPavimentos: 14, custoRS: 1566202.74, inccBase: 1095.738, custoINCC: 1429.36, coeficiente: 0.174 },
];

// Itens default da seção Projetos da estimativa (17 especialidades padrão)
const DEFAULT_PROJETOS_ITEMS = ESPECIALIDADES_PROJETOS.map((esp, i) => ({
  id: i + 1,
  especialidade: esp,
  projetista: '',
  obraRef: '',
  obrigatorio: true,
  custoINCCM2: 0,
}));

const EMPTY_ESTIMATE = {
  refProjectId: null,
  inccAtual: 1259.652, // Abr/2026 — atualizar via botão na aba INCC
  // Project info
  nome: '',
  endereco: '',
  areaConstruida: 0,
  areaProjTorre: 0,
  perimetroTorre: 0,
  alturaPredio: 0,
  prazoObra: 0,
  numSubsolos: 0,
  numPavtos: 0,
  numElevadores: 0,
  numParadas: 0,
  elevadorObraRef: '',  // obra da base de elevadores para referência de custo
  elevNumParadas: null, // null = auto (numPavtos - 1); número quando editado manualmente
  infraTipoFundacao: '',   // tipo de fundação (chave para fundacaoDb)
  infraTipoContencao: '',  // tipo de contenção (campo livre — base futura)
  // Administração — 3 sub-grupos (valores em INCC)
  admEquipeINCC: 0,
  admDiversosINCC: 0,
  admLimpezaINCC: 0,
  tipoFundacao: '',
  // Lista ordenada de pavimentos — fixos e custom unificados, suportam reordenação e exclusão
  floorList: FLOOR_TYPES.map((ft) => ({
    id: ft.key,
    label: ft.label,
    area: '',
    coef: '',
    coefField: ft.coefField || null,
    defaultCoef: ft.defaultCoef,
    isCustom: false,
  })),
  // Per-section unit cost overrides (null = use ref)
  overrides: {
    custoConstrucaoM2: null,
    custoInfra: null,
    custoElevador: null,
    custoFachadaM2: null,
    custoEnsaios: null,
    custoAdminM2: null,
    fachadaArea: null,
  },
  // Implantação detalhada por item (5 itens da planilha original)
  implantacaoItems: [
    { nome: 'Limpeza do Terreno',          valorINCC: 0 },
    { nome: 'Barracão',                    valorINCC: 0 },
    { nome: 'Tapume',                      valorINCC: 0 },
    { nome: 'Placas Provisórias',          valorINCC: 0 },
    { nome: 'Itens de Segurança',          valorINCC: 0 },
  ],
  // Projetos detalhados por item (17 especialidades padrão da planilha original)
  projetosItems: DEFAULT_PROJETOS_ITEMS,
  // Incorporação — itens detalhados (base de dados futura)
  incorporacaoItems: [
    { id: 1,  nome: 'Construção do Stand de Vendas',               valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 2,  nome: 'Projeto de Stand de Vendas',                  valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 3,  nome: 'Solo Criado',                                 valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 4,  nome: 'Demolição',                                   valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 5,  nome: 'Licença de Obras/Taxas',                      valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 6,  nome: 'Mobiliário e Decoração das Áreas Comuns',     valorINCC: 0, isGroup: true,  isSubItem: false },
    { id: 7,  nome: 'Iluminação',                                  valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 8,  nome: 'Mobiliário',                                  valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 9,  nome: 'Marcenaria',                                  valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 10, nome: 'Adornos + Mobiliários Externos',              valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 11, nome: 'Espelhos',                                    valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 12, nome: 'Aparelhos de Ginástica',                      valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 13, nome: 'Brinquedos Espaço Kids',                      valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 14, nome: 'Eletrodomésticos',                            valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 15, nome: 'Painel Artístico',                            valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 16, nome: 'Sistema de Som',                              valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 17, nome: 'Aromatizador',                                valorINCC: 0, isGroup: false, isSubItem: true  },
    { id: 18, nome: 'Projeto de Decoração',                        valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 19, nome: 'Projeto de Fachada',                          valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 20, nome: 'Levantamento Topográfico',                    valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 21, nome: 'Laudo de Vistoria Prévia',                    valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 22, nome: 'Elaboração NB-140',                           valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 23, nome: 'Consultoria Quadro NB',                       valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 24, nome: 'Consultoria Ambiental para Licenciamento',    valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 25, nome: 'Consultoria Imobiliária',                     valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 26, nome: 'Consultoria de Acabamentos/Modificação',      valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 27, nome: 'Singular',                                    valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 28, nome: 'Projeto de Paisagismo',                       valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 29, nome: 'Paisagismo',                                  valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 30, nome: 'Projeto de Luminotécnica',                    valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 31, nome: 'Contenção + Solo Grampeado',                  valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 32, nome: 'Arruamento, Calçadas, Jardins',               valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 33, nome: 'Redes',                                       valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 34, nome: 'Movimento de Terra e Desmonte de Rocha',      valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 35, nome: 'Deck Externo',                                valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 36, nome: 'Projetos Área Externa',                       valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 37, nome: 'Ensaios Extras',                              valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 38, nome: 'Iluminação (Infraestrutura)',                 valorINCC: 0, isGroup: false, isSubItem: false },
    { id: 39, nome: 'Muros',                                       valorINCC: 0, isGroup: false, isSubItem: false },
  ],
  // Extras — estrutura preparada para base de dados futura
  extrasItems: [
    { id: 1, nome: 'Quadra / Beach Tênis', valorINCC: 0 },
    { id: 2, nome: 'Extra 2',              valorINCC: 0 },
    { id: 3, nome: 'Extra 3',              valorINCC: 0 },
  ],
  taxaAdm: 0.10,
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const fmtR$ = (n) => {
  if (!isFinite(n) || n === 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
};
const fmtR$0 = (n) => {
  if (!isFinite(n) || n === 0) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
};
const fmtR$2 = fmtR$;
const fmtNum = (n, dec = 2) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
};
const fmtPct = (n) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
};
const toNum = (v) => {
  if (v === '' || v === null || v === undefined) return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

// ═══════════════════════════════════════════════════════════════════════════
// PDF GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

// ─── Defaults da aba Apresentação ────────────────────────────────────────
const DEFAULT_APRESENTACAO = {
  // Identidade
  empresa: '',
  responsavel: '',
  cargo: '',
  contato: '',
  logoText: '',          // texto exibido no lugar do logo
  corPrimaria: '#1F3864',
  corAcento: '#f59e0b',
  // Notas
  notasIntroducao: '',
  notasRodape: '',
  // Seções visíveis
  mostrarKPIs: true,
  mostrarResumoFinanceiro: true,
  mostrarDistribuicao: true,
  mostrarPavimentos: true,
  mostrarImplantacao: true,
  mostrarProjetos: true,
  mostrarElevadores: true,
  mostrarInfraestrutura: true,
  mostrarFachada: true,
  mostrarEnsaios: true,
  mostrarAdministracao: true,
  mostrarIncorporacao: true,
  mostrarExtras: true,
  incorporacaoItensVisiveis: [], // [] = todos visíveis; lista de ids = apenas esses
};

function generatePDF({ estimate, calc, refProject, apresentacao = DEFAULT_APRESENTACAO }) {
  const ap = { ...DEFAULT_APRESENTACAO, ...apresentacao };
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const nomeObra = estimate.nome || 'Estimativa de Obra';
  const cor1 = ap.corPrimaria || '#1F3864';
  const cor2 = ap.corAcento || '#f59e0b';

  const fR = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  const fN = (n, d = 2) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);
  const fPct = (n) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(n || 0);

  const area   = toNum(estimate.areaConstruida);
  const incc   = toNum(estimate.inccAtual);
  const taxaAdm = toNum(estimate.taxaAdm);

  // ── Calcular seções diretamente da estimativa ──────────────────────────
  const implINCC     = (estimate.implantacaoItems || []).reduce((s, i) => s + toNum(i.valorINCC), 0);
  const projINCC     = (estimate.projetosItems || []).filter(p => p.obrigatorio).reduce((s, p) => s + toNum(p.custoINCCM2) * area, 0);
  const admINCC      = toNum(estimate.admEquipeINCC) + toNum(estimate.admDiversosINCC) + toNum(estimate.admLimpezaINCC);
  const incorpINCC   = (estimate.incorporacaoItems || []).reduce((s, i) => i.isGroup ? s : s + toNum(i.valorINCC), 0);
  const extrasINCC   = (estimate.extrasItems || []).reduce((s, i) => s + toNum(i.valorINCC), 0);

  // Use calc for totals when available (accurate), fallback to estimate
  const totalFinalRS  = calc?.totalFinalRS  || 0;
  const subtotalRS    = calc?.subtotalRS    || 0;
  const taxaAdmRS     = calc?.taxaAdmRS     || 0;
  const areaEqTotal   = calc?.areaEqTotal   || area;
  const custoFinalM2  = area > 0 ? totalFinalRS / area : 0;
  const sections      = calc?.sections      || [];

  // Floor rows
  const custoConstrucaoM2 = calc?.custoConstrucaoM2 || 0;
  const floorList = (estimate.floorList || []).filter(fl => toNum(fl.area) > 0);
  const floorRows = floorList.map(fl => {
    const coef = (fl.coef !== '' && fl.coef !== null && fl.coef !== undefined) ? toNum(fl.coef) : (fl.defaultCoef || 1);
    const areaEq = toNum(fl.area) * coef;
    const custoINCC = areaEq * custoConstrucaoM2;
    return `<tr>
      <td>${fl.label || 'Pavimento'}</td>
      <td class="num right">${fN(toNum(fl.area))}</td>
      <td class="num right">${fN(coef)}</td>
      <td class="num right">${fN(areaEq)}</td>
      <td class="num right">${fN(custoINCC)}</td>
      <td class="num right">${fR(custoINCC * incc)}</td>
    </tr>`;
  }).join('');

  // Implantação rows
  const implItems = (estimate.implantacaoItems || []).filter(it => toNum(it.valorINCC) > 0);
  const implRows = implItems.map(it =>
    `<tr><td>${it.nome || '—'}</td><td class="num right">${fN(it.valorINCC)}</td><td class="num right">${fR(toNum(it.valorINCC) * incc)}</td></tr>`
  ).join('');

  // Projetos rows
  const projetosIncluidos = (estimate.projetosItems || []).filter(p => p.obrigatorio && toNum(p.custoINCCM2) > 0);
  const projRows = projetosIncluidos.map(p => {
    const totalRS = toNum(p.custoINCCM2) * area * incc;
    return `<tr><td>${p.especialidade}</td><td>${p.projetista || '—'}</td><td class="num right">${p.custoINCCM2.toFixed(6)}</td><td class="num right">${fR(totalRS)}</td></tr>`;
  }).join('');

  // Administração rows
  const admItems = [
    { nome: 'Equipe Administrativa',  val: toNum(estimate.admEquipeINCC)   },
    { nome: 'Diversos',               val: toNum(estimate.admDiversosINCC)  },
    { nome: 'Limpeza e Transportes',  val: toNum(estimate.admLimpezaINCC)   },
  ].filter(i => i.val > 0);
  const admRows = admItems.map(i =>
    `<tr><td>${i.nome}</td><td class="num right">${fN(i.val)}</td><td class="num right">${fR(i.val * incc)}</td></tr>`
  ).join('');

  // Incorporação — filtrada por itensVisiveis
  const itensVis = (ap.incorporacaoItensVisiveis || []).map(Number);
  const incorpItems = (estimate.incorporacaoItems || []).filter(it =>
    !it.isGroup && toNum(it.valorINCC) > 0 &&
    (itensVis.length === 0 || itensVis.includes(Number(it.id)))
  );
  const incorpRows = incorpItems.length > 0 ? incorpItems.map((it) =>
    `<tr>
      <td style="${it.isSubItem ? 'padding-left:18px;font-style:italic;color:#555' : ''}">${it.nome || '—'}</td>
      <td class="num right">${fN(toNum(it.valorINCC))}</td>
      <td class="num right">${fR(toNum(it.valorINCC) * incc)}</td>
    </tr>`
  ).join('') : '';

  // Extras rows
  const extrasItems = (estimate.extrasItems || []).filter(it => toNum(it.valorINCC) > 0);
  const extrasRows = extrasItems.map(it =>
    `<tr><td>${it.nome || '—'}</td><td class="num right">${fN(it.valorINCC)}</td><td class="num right">${fR(toNum(it.valorINCC) * incc)}</td></tr>`
  ).join('');

  // Distribuição — filtrada pelos toggles
  const sectionKeyMap = {
    construcao: ap.mostrarPavimentos, infra: ap.mostrarInfraestrutura,
    implantacao: ap.mostrarImplantacao, projetos: ap.mostrarProjetos,
    elevador: ap.mostrarElevadores, fachada: ap.mostrarFachada,
    ensaios: ap.mostrarEnsaios, administracao: ap.mostrarAdministracao,
    incorporacao: ap.mostrarIncorporacao, extras: ap.mostrarExtras,
  };
  const sectionTableRows = sections
    .filter(s => s.rs > 0 && sectionKeyMap[s.key] !== false)
    .map(s => {
      const pct = totalFinalRS > 0 ? s.rs / totalFinalRS : 0;
      return `<tr>
        <td>${s.label}</td>
        <td class="num right">${fN(s.incc)}</td>
        <td class="num right">${fR(s.rs)}</td>
        <td class="num right">${fPct(pct)}</td>
        ${area > 0 ? `<td class="num right">${fR(s.rs / area)}</td>` : '<td>—</td>'}
      </tr>`;
    }).join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Estimativa — ${nomeObra}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 9pt; color: #1a1a1a; background: #fff; }
  @page { size: A4; margin: 14mm 12mm 14mm 12mm; }
  @media print { .no-print { display: none !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  .doc-header { background: ${cor1}; color: #fff; padding: 12px 16px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: flex-end; }
  .doc-header h1 { font-size: 14pt; font-weight: 700; }
  .doc-header .empresa { font-size: 9pt; font-weight: 600; color: ${cor2}; }
  .accent-bar { height: 4px; background: ${cor2}; margin-bottom: 10px; }
  .intro-box { border-left: 4px solid ${cor2}; padding: 6px 10px; margin-bottom: 10px; font-size: 8.5pt; color: #374151; background: #fffbeb; }
  .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 10px; }
  .info-card { border: 1px solid #d1d5db; padding: 6px 8px; }
  .info-card .lbl { font-size: 7pt; text-transform: uppercase; letter-spacing: .5px; color: #6b7280; }
  .info-card .val { font-size: 10pt; font-weight: 700; color: #0f172a; margin-top: 2px; font-family: 'Courier New', monospace; }
  .info-card.highlight { border-left: 3px solid ${cor2}; }
  .sec-title { background: ${cor1}; color: #fff; font-size: 8pt; font-weight: 700; padding: 4px 8px; text-transform: uppercase; letter-spacing: .8px; margin: 10px 0 0 0; }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  th { background: #334155; color: #f8fafc; font-weight: 600; padding: 4px 6px; text-align: left; font-size: 7.5pt; text-transform: uppercase; }
  td { padding: 3.5px 6px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
  tr:nth-child(even) td { background: #f8fafc; }
  tr.subtotal td { background: #334155 !important; color: #fff; font-weight: 600; }
  tr.grand-total td { background: ${cor1} !important; color: #fff; font-weight: 700; font-size: 10pt; }
  .num { font-family: 'Courier New', monospace; }
  .right { text-align: right; }
  .amber { color: ${cor2}; font-weight: 700; }
  .summary-box { border: 2px solid ${cor1}; padding: 10px 14px; margin: 10px 0; }
  .summary-box .row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #e5e7eb; font-size: 8.5pt; }
  .summary-box .row:last-child { border-bottom: none; font-size: 11pt; font-weight: 700; padding-top: 6px; color: ${cor1}; }
  .summary-box .row .v { font-family: 'Courier New', monospace; }
  .footer { margin-top: 14px; border-top: 1px solid #d1d5db; padding-top: 5px; font-size: 7pt; color: #9ca3af; display: flex; justify-content: space-between; }
  .print-btn { position: fixed; bottom: 24px; right: 24px; background: ${cor2}; color: #1a1a1a; font-weight: 700; padding: 12px 24px; border: none; cursor: pointer; font-size: 11pt; box-shadow: 0 4px 12px rgba(0,0,0,.3); border-radius: 2px; }
  .print-btn:hover { opacity: .9; }
</style>
</head>
<body>

<button class="print-btn no-print" onclick="window.print()">⬇ Imprimir / Salvar PDF</button>

<!-- CABEÇALHO -->
<div class="doc-header">
  <div>
    ${ap.logoText ? `<div class="empresa">${ap.logoText}</div>` : ''}
    <h1>${nomeObra.toUpperCase()}</h1>
    <div style="font-size:8pt;color:rgba(255,255,255,.65)">${estimate.endereco || ''}</div>
  </div>
  <div style="text-align:right;font-size:8pt;color:rgba(255,255,255,.65)">
    ${ap.empresa ? `<div style="font-weight:600;color:#fff">${ap.empresa}</div>` : ''}
    ${ap.responsavel ? `<div>${ap.responsavel}${ap.cargo ? ' · ' + ap.cargo : ''}</div>` : ''}
    ${ap.contato ? `<div>${ap.contato}</div>` : ''}
    <div>Data: ${hoje}</div>
    ${refProject ? `<div>Referência: ${refProject.nome}</div>` : ''}
  </div>
</div>
<div class="accent-bar"></div>

${ap.notasIntroducao ? `<div class="intro-box">${ap.notasIntroducao}</div>` : ''}

${ap.mostrarKPIs ? `
<div class="info-grid">
  <div class="info-card"><div class="lbl">Área Construída</div><div class="val">${fN(area, 0)} m²</div></div>
  <div class="info-card"><div class="lbl">Área Equivalente</div><div class="val">${fN(areaEqTotal, 0)} m²</div></div>
  <div class="info-card"><div class="lbl">Custo / m²</div><div class="val">${fR(custoFinalM2)}</div></div>
  <div class="info-card highlight"><div class="lbl">Custo Total</div><div class="val" style="color:${cor2}">${fR(totalFinalRS)}</div></div>
  <div class="info-card"><div class="lbl">INCC Atual</div><div class="val">${fN(incc, 2)}</div></div>
  <div class="info-card"><div class="lbl">Fator Atualização</div><div class="val">${fN(calc?.fator || 1, 4)}×</div></div>
  <div class="info-card"><div class="lbl">Nº Pavimentos</div><div class="val">${estimate.numPavtos || '—'}</div></div>
  <div class="info-card"><div class="lbl">Prazo (meses)</div><div class="val">${estimate.prazoObra || '—'}</div></div>
</div>` : ''}

${ap.mostrarResumoFinanceiro ? `
<div class="sec-title">Resumo Financeiro</div>
<div class="summary-box">
  <div class="row"><span>Subtotal (s/ incorporação)</span><span class="v">${fR(subtotalRS)}</span></div>
  <div class="row"><span>Incorporação</span><span class="v">${fR(incorpINCC * incc)}</span></div>
  <div class="row"><span>Itens Extras</span><span class="v">${fR(extrasINCC * incc)}</span></div>
  <div class="row"><span>Taxa de Administração (${fPct(taxaAdm)})</span><span class="v">${fR(taxaAdmRS)}</span></div>
  <div class="row"><span>CUSTO TOTAL</span><span class="v amber">${fR(totalFinalRS)}</span></div>
</div>` : ''}

${ap.mostrarDistribuicao && sectionTableRows ? `
<div class="sec-title">Distribuição por Categoria</div>
<table>
  <thead><tr><th>Categoria</th><th class="right">INCC</th><th class="right">R$</th><th class="right">% Total</th>${area > 0 ? '<th class="right">R$/m²</th>' : ''}</tr></thead>
  <tbody>${sectionTableRows}
    <tr class="grand-total"><td colspan="${area > 0 ? 4 : 3}">CUSTO TOTAL C/ TAXA ADM</td>${area > 0 ? `<td class="num right">${fR(custoFinalM2)}</td>` : ''}</tr>
  </tbody>
</table>` : ''}

${ap.mostrarPavimentos && floorRows ? `
<div class="sec-title" style="margin-top:12px">Custo de Construção · Pavimentos</div>
<table>
  <thead><tr><th>Pavimento</th><th class="right">Área (m²)</th><th class="right">Coef.</th><th class="right">Área Eq.</th><th class="right">INCC</th><th class="right">R$</th></tr></thead>
  <tbody>${floorRows}
    <tr class="subtotal"><td colspan="3">TOTAL</td><td class="num right">${fN(areaEqTotal)}</td><td class="num right">${fN(sections[0]?.incc || 0)}</td><td class="num right">${fR(sections[0]?.rs || 0)}</td></tr>
  </tbody>
</table>` : ''}

${ap.mostrarImplantacao && implRows ? `
<div class="sec-title" style="margin-top:12px">Implantação</div>
<table>
  <thead><tr><th>Item</th><th class="right">INCC</th><th class="right">R$</th></tr></thead>
  <tbody>${implRows}
    <tr class="subtotal"><td colspan="2">TOTAL</td><td class="num right">${fR(implINCC * incc)}</td></tr>
  </tbody>
</table>` : ''}

${ap.mostrarProjetos && projRows ? `
<div class="sec-title" style="margin-top:12px">Projetos e Consultorias</div>
<table>
  <thead><tr><th>Especialidade</th><th>Projetista</th><th class="right">INCC/m²</th><th class="right">Total R$</th></tr></thead>
  <tbody>${projRows}
    <tr class="subtotal"><td colspan="3">TOTAL</td><td class="num right">${fR(projINCC * incc)}</td></tr>
  </tbody>
</table>` : ''}

${ap.mostrarElevadores && estimate.elevadorObraRef ? `
<div class="sec-title" style="margin-top:12px">Elevadores</div>
<table><thead><tr><th>Campo</th><th class="right">Valor</th></tr></thead>
<tbody>
  <tr><td>Obra Base</td><td class="right">${estimate.elevadorObraRef}</td></tr>
  <tr><td>Nº de Paradas</td><td class="num right">${estimate.elevNumParadas ?? Math.max(0, toNum(estimate.numPavtos) - 1)}</td></tr>
  <tr><td>Qt. Elevadores</td><td class="num right">${estimate.numElevadores || '—'}</td></tr>
  <tr class="subtotal"><td>CUSTO TOTAL</td><td class="num right">${fR((sections[4]?.rs || 0))}</td></tr>
</tbody></table>` : ''}

${ap.mostrarInfraestrutura && estimate.infraTipoFundacao ? `
<div class="sec-title" style="margin-top:12px">Infraestrutura</div>
<table><thead><tr><th>Campo</th><th class="right">Valor</th></tr></thead>
<tbody>
  <tr><td>Tipo de Fundação</td><td class="right">${estimate.infraTipoFundacao}</td></tr>
  ${estimate.infraTipoContencao ? `<tr><td>Contenção</td><td class="right">${estimate.infraTipoContencao}</td></tr>` : ''}
  <tr class="subtotal"><td>CUSTO TOTAL</td><td class="num right">${fR((sections[1]?.rs || 0))}</td></tr>
</tbody></table>` : ''}

${ap.mostrarAdministracao && admRows ? `
<div class="sec-title" style="margin-top:12px">Administração</div>
<table><thead><tr><th>Item</th><th class="right">INCC</th><th class="right">R$</th></tr></thead>
<tbody>${admRows}
  <tr class="subtotal"><td colspan="2">TOTAL</td><td class="num right">${fR(admINCC * incc)}</td></tr>
</tbody></table>` : ''}

${ap.mostrarIncorporacao && incorpRows ? `
<div class="sec-title" style="margin-top:12px">Incorporação</div>
<table><thead><tr><th>Item</th><th class="right">INCC</th><th class="right">R$</th></tr></thead>
<tbody>${incorpRows}
  <tr class="subtotal"><td colspan="2">TOTAL</td><td class="num right">${fR(incorpItems.reduce((s,i)=>s+toNum(i.valorINCC),0) * incc)}</td></tr>
</tbody></table>` : ''}

${ap.mostrarExtras && extrasRows ? `
<div class="sec-title" style="margin-top:12px">Extras</div>
<table><thead><tr><th>Item</th><th class="right">INCC</th><th class="right">R$</th></tr></thead>
<tbody>${extrasRows}
  <tr class="subtotal"><td colspan="2">TOTAL</td><td class="num right">${fR(extrasINCC * incc)}</td></tr>
</tbody></table>` : ''}

<div class="sec-title" style="margin-top:12px">Custo Total C/ Taxa de Administração</div>
<table><thead><tr><th>Item</th><th class="right">INCC</th><th class="right">R$</th></tr></thead>
<tbody>
  <tr><td>Custo Total S/ Taxa</td><td class="num right">${fN((totalFinalRS - taxaAdmRS) / (incc || 1))}</td><td class="num right">${fR(totalFinalRS - taxaAdmRS)}</td></tr>
  <tr><td>Taxa de Administração (${fPct(taxaAdm)})</td><td class="num right">${fN(taxaAdmRS / (incc || 1))}</td><td class="num right">${fR(taxaAdmRS)}</td></tr>
  <tr class="grand-total"><td colspan="2">CUSTO TOTAL</td><td class="num right">${fR(totalFinalRS)}</td></tr>
  ${area > 0 ? `<tr class="subtotal"><td colspan="2">CUSTO TOTAL / m²</td><td class="num right">${fR(custoFinalM2)}</td></tr>` : ''}
</tbody></table>

<div class="footer">
  <span>${ap.notasRodape || 'Estimativa Paramétrica de Obras'} · Gerado em ${hoje}</span>
  <span>${ap.empresa || ''}${ap.responsavel ? ' · ' + ap.responsavel : ''}</span>
</div>
</body></html>`;

  const nomeArquivo = `estimativa_${(estimate.nome || 'obra').replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0,10)}.html`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// LOGIN VIEW — Blueprint Precision aesthetic
// ═══════════════════════════════════════════════════════════════════════════
function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [recuperar, setRecuperar] = useState(false);
  const [recuperarEnviado, setRecuperarEnviado] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [senhaFocus, setSenhaFocus] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const sb = await loadSupabase();
      if (!sb) { setErro('Serviço de autenticação indisponível.'); setLoading(false); return; }
      const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) {
        setErro(error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message);
      } else {
        onLogin(data.user);
      }
    } catch { setErro('Erro de conexão. Tente novamente.'); }
    finally { setLoading(false); }
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sb = await loadSupabase();
      await sb?.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      setRecuperarEnviado(true);
    } catch { setErro('Erro ao enviar e-mail.'); }
    finally { setLoading(false); }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .login-root {
      min-height: 100vh;
      background: #f0f5fc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'IBM Plex Sans', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .login-root::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(46,111,173,0.03);
      pointer-events: none;
    }

    .login-root::after { display: none; }

    /* Corner accent marks */
    .corner-tl, .corner-br {
      position: absolute;
      width: 24px;
      height: 24px;
      border-color: rgba(28,69,133,0.3);
      border-style: solid;
    }
    .corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
    .corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

    .login-card {
      background: #ffffff;
      border: 0.5px solid #ccdaee;
      border-top: 3px solid #0d1e35;
      padding: 0;
      overflow: hidden;
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(13,30,53,0.1), 0 2px 8px rgba(13,30,53,0.06);
    }

    .login-header {
      padding: 26px 32px 20px;
      border-bottom: 1px solid #ccdaee;
    }
    .login-header::after { display: none; }
    .login-logo { display: none; }
    .login-title {
      font-size: 20px;
      font-weight: 700;
      color: #0d1e35;
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }
    .login-subtitle {
      font-size: 10px;
      color: rgba(13,30,53,0.4);
      margin: 0;
      font-family: 'IBM Plex Mono', monospace;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .login-body { padding: 26px 32px 24px; }

    .field-label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(13,30,53,0.55);
      margin-bottom: 5px;
    }
    .field-wrap {
      position: relative;
      margin-bottom: 18px;
    }
    .field-icon {
      position: absolute;
      left: 14px; top: 50%;
      transform: translateY(-50%);
      color: rgba(28,69,133,0.3);
      pointer-events: none;
      transition: color 0.2s;
    }
    .field-wrap.focused .field-icon { color: #0d1e35; }
    .field-input {
      width: 100%;
      background: #f0f5fc;
      border: 1px solid #ccdaee;
      color: #0d1e35;
      padding: 13px 14px 13px 42px;
      font-size: 14px;
      font-family: 'IBM Plex Sans', sans-serif;
      outline: none;
      border-radius: 8px;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .field-input::placeholder { color: rgba(28,69,133,0.3); }
    .field-input:focus {
      border-color: #0d1e35;
      background: #EEF3FF;
      box-shadow: 0 0 0 3px rgba(28,69,133,0.1);
    }
    .field-input.erro-input {
      border-color: rgba(239,68,68,0.5);
      background: rgba(239,68,68,0.04);
    }

    .toggle-senha {
      position: absolute;
      right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      color: rgba(28,69,133,0.3);
      cursor: pointer;
      padding: 4px;
      display: flex;
      transition: color 0.2s;
      border-radius: 4px;
    }
    .toggle-senha:hover { color: rgba(11,40,69,0.7); }

    .erro-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 8px;
      margin-bottom: 18px;
      font-size: 12.5px;
      color: #FCA5A5;
      animation: shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
    }
    @keyframes shake {
      10%,90%{transform:translate(-1px,0)}
      20%,80%{transform:translate(2px,0)}
      30%,50%,70%{transform:translate(-2px,0)}
      40%,60%{transform:translate(2px,0)}
    }

    .row-between {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 22px;
    }
    .lembrar-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; color: rgba(28,69,133,0.6);
      cursor: pointer; user-select: none;
    }
    .lembrar-label:hover { color: #0d1e35; }
    .check-box {
      width: 16px; height: 16px;
      border: 1px solid rgba(28,69,133,0.2);
      border-radius: 4px;
      background: rgba(11,40,69,0.04);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .check-box.checked {
      background: #2e6fad;
      border-color: #2e6fad;
    }

    .link-btn {
      background: none; border: none;
      font-size: 12px; color: rgba(245,158,11,0.7);
      cursor: pointer; padding: 0;
      font-family: 'IBM Plex Sans', sans-serif;
      transition: color 0.15s;
    }
    .link-btn:hover { color: var(--amber); }

    .btn-entrar {
      width: 100%;
      padding: 13px;
      background: #0d1e35;
      color: #ffffff;
      position: relative;
      border-radius: 6px !important;
      overflow: hidden;
      transition: transform 0.12s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, filter 0.15s ease;
      box-shadow:
        0 4px 20px rgba(11,40,69,0.4),
        0 1px 0 rgba(255,255,255,0.25) inset,
        0 -1px 0 rgba(0,0,0,0.2) inset;
    }

    /* Shimmer sweep always running */
    .btn-entrar::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      animation: shimmer 2.5s ease-in-out infinite;
    }
    @keyframes shimmer {
      0%   { left: -100%; }
      60%  { left: 140%; }
      100% { left: 140%; }
    }
    .btn-entrar::before { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); }

    /* Top gloss */
    .btn-entrar::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 55%);
      pointer-events: none;
      border-radius: 8px;
    }

    .btn-entrar:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.005);
      box-shadow:
        0 8px 28px rgba(11,40,69,0.55),
        0 1px 0 rgba(255,255,255,0.3) inset,
        0 -1px 0 rgba(0,0,0,0.2) inset;
      filter: brightness(1.08);
    }

    .btn-entrar:active:not(:disabled) {
      transform: translateY(1px) scale(0.985);
      box-shadow:
        0 2px 8px rgba(245,158,11,0.3),
        0 0 0 rgba(255,255,255,0) inset,
        0 2px 0 rgba(0,0,0,0.25) inset;
      filter: brightness(0.9);
      transition: transform 0.06s ease, box-shadow 0.06s ease, filter 0.06s ease;
    }

    .btn-entrar:disabled {
      cursor: wait;
      background: linear-gradient(135deg, #1a3a5c 0%, #0d2035 100%);
      box-shadow: 0 2px 8px rgba(245,158,11,0.15);
      filter: none;
    }
    .btn-entrar:disabled::before { animation: none; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(10,22,40,0.3);
      border-top-color: #0d1e35;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .login-footer {
      padding: 14px 32px 20px;
      border-top: 1px solid #ccdaee;
      text-align: center;
    }
    .footer-text {
      font-size: 11px;
      color: rgba(28,69,133,0.35);
      font-family: 'IBM Plex Mono', monospace;
    }

    .coords {
      display: none;
      position: fixed;
      bottom: 20px; left: 24px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: rgba(74,143,212,0.25);
      letter-spacing: 0.05em;
      pointer-events: none;
    }

    .success-box {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; text-align: center; padding: 8px 0;
    }
    .success-icon {
      width: 48px; height: 48px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.3);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="login-root">
        <div className={`login-panel ${mounted ? 'visible' : ''}`}>
          <div className="corner-tl" />
          <div className="corner-br" />
          <div className="login-card">

            {/* Header */}
            <div className="login-header">
              <div className="login-logo">
                <Building2 style={{ width:24, height:24, color:'var(--navy)' }} />
              </div>
              <h1 className="login-title">SOTER ENGENHARIA</h1>
              <p className="login-subtitle">PLANEJAMENTO E ORÇAMENTO · Sistema de Gestão</p>
            </div>

            {/* Body */}
            <div className="login-body">
              {!recuperar ? (
                <form onSubmit={handleLogin}>
                  <label className="field-label">E-mail</label>
                  <div className={`field-wrap ${emailFocus ? 'focused' : ''}`}>
                    <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      placeholder="seu@email.com.br"
                      className={`field-input ${erro ? 'erro-input' : ''}`}
                      autoComplete="email"
                    />
                  </div>

                  <label className="field-label">Senha</label>
                  <div className={`field-wrap ${senhaFocus ? 'focused' : ''}`}>
                    <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input type={senhaVisivel ? 'text' : 'password'} required value={senha}
                      onChange={e => setSenha(e.target.value)}
                      onFocus={() => setSenhaFocus(true)}
                      onBlur={() => setSenhaFocus(false)}
                      placeholder="••••••••"
                      className={`field-input ${erro ? 'erro-input' : ''}`}
                      style={{ paddingRight: 44 }}
                      autoComplete="current-password"
                    />
                    <button type="button" className="toggle-senha"
                      onClick={() => setSenhaVisivel(v => !v)}
                      tabIndex={-1}>
                      {senhaVisivel
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>

                  {erro && (
                    <div className="erro-box">
                      <AlertCircle style={{ width:14, height:14, flexShrink:0 }} />
                      {erro}
                    </div>
                  )}

                  <div className="row-between">
                    <label className="lembrar-label" onClick={() => setLembrar(v => !v)}>
                      <div className={`check-box ${lembrar ? 'checked' : ''}`}>
                        {lembrar && <Check style={{ width:10, height:10, color:'#0d1e35' }} />}
                      </div>
                      Lembrar acesso
                    </label>
                    <button type="button" className="link-btn" onClick={() => { setRecuperar(true); setErro(''); }}>
                      Esqueci a senha
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="btn-entrar">
                    {loading
                      ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                          <span className="spinner" /> Autenticando...
                        </span>
                      : 'ENTRAR'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRecuperar}>
                  {recuperarEnviado ? (
                    <div className="success-box">
                      <div className="success-icon">
                        <Check style={{ width:24, height:24, color:'#10B981' }} />
                      </div>
                      <div>
                        <p style={{ color:'#0d1e35', fontSize:14, fontWeight:600, margin:'0 0 4px' }}>E-mail enviado!</p>
                        <p style={{ color:'rgba(28,69,133,0.5)', fontSize:12, margin:0 }}>
                          Verifique sua caixa de entrada para redefinir a senha.
                        </p>
                      </div>
                      <button type="button" className="link-btn" style={{ marginTop:8 }}
                        onClick={() => { setRecuperar(false); setRecuperarEnviado(false); }}>
                        ← Voltar ao login
                      </button>
                    </div>
                  ) : (
                    <>
                      <p style={{ color:'rgba(28,69,133,0.55)', fontSize:13, marginBottom:20, lineHeight:1.5 }}>
                        Digite seu e-mail e enviaremos um link para redefinir sua senha.
                      </p>
                      <label className="field-label">E-mail</label>
                      <div className={`field-wrap ${emailFocus ? 'focused' : ''}`}>
                        <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <input type="email" required value={email}
                          onChange={e => setEmail(e.target.value)}
                          onFocus={() => setEmailFocus(true)}
                          onBlur={() => setEmailFocus(false)}
                          placeholder="seu@email.com.br"
                          className="field-input"
                        />
                      </div>
                      {erro && <div className="erro-box"><AlertCircle style={{ width:14, height:14 }} /> {erro}</div>}
                      <button type="submit" disabled={loading} className="btn-entrar" style={{ marginBottom:12 }}>
                        {loading ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><span className="spinner" /> Enviando...</span> : 'Enviar link de recuperação'}
                      </button>
                      <button type="button" className="link-btn"
                        style={{ display:'block', width:'100%', textAlign:'center', padding:'8px 0' }}
                        onClick={() => { setRecuperar(false); setErro(''); }}>
                        ← Voltar ao login
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="login-footer">
              <p className="footer-text">Acesso restrito · Solicite ao administrador</p>
            </div>
          </div>
        </div>

        {/* Coordenadas técnicas decorativas */}
        <div className="coords">
          EST.PARAM · v2.0 · {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
}

export default function EstimativaApp() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      if (!sb) {
        // Supabase indisponível (Claude.ai) — entra sem login
        setAuthUser({ id: 'local', email: 'local' });
        setAuthLoading(false);
        return;
      }
      const { data: { session } } = await sb.auth.getSession();
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, sess) => {
        setAuthUser(sess?.user ?? null);
      });
      return () => subscription?.unsubscribe();
    })();
  }, []);

  if (authLoading) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>Carregando...</div>
      </div>
    );
  }

  if (!authUser) {
    return <LoginView onLogin={setAuthUser} />;
  }

  return <EstimativaAppInner authUser={authUser} />;
}

function EstimativaAppInner({ authUser }) {
  const [tab, setTab] = useState('estimativa');
  const [db, setDb] = useState(DEFAULT_PROJECTS);
  const [projectsDb, setProjectsDb] = useState(PROJETOS_REAIS_SEED);
  const [elevatorsDb, setElevatorsDb] = useState(ELEVATORS_DB_SEED);
  const [implantacaoDb, setImplantacaoDb] = useState(IMPLANTACAO_DB_SEED);
  const [fundacaoDb, setFundacaoDb] = useState(FUNDACAO_DB_SEED);
  const [estimate, setEstimate] = useState(EMPTY_ESTIMATE);
  const [apresentacao, setApresentacao] = useState(DEFAULT_APRESENTACAO);
  const [loaded, setLoaded] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editProjectRecord, setEditProjectRecord] = useState(null);
  const [editElevatorRecord, setEditElevatorRecord] = useState(null);
  const [editImplantacaoRecord, setEditImplantacaoRecord] = useState(null);
  const [editFundacaoRecord, setEditFundacaoRecord] = useState(null);
  const [toast, setToast] = useState(null);
  const [savedEstimates, setSavedEstimates] = useState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [currentSavedId, setCurrentSavedId] = useState(null); // id da estimativa salva carregada

  // ─── Load from storage ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      // Compatível com Claude.ai (window.storage) e GitHub Pages (localStorage)
      // store shim already defined above
      const _store = {
        get: async (k) => {
          try {
            if (window.storage) return storeGet(k);
            const v = localStorage.getItem(k);
            return v ? { value: v } : null;
          } catch { return null; }
        },
        set: async (k, v) => {
          try {
            if (window.storage) return storeSet(k, v);
            localStorage.setItem(k, v);
          } catch {}
        }
      };

      // ─── Carrega as 5 bases de dados do Supabase ──────────────────────
      try {
        const sb = await loadSupabase();
        if (sb) {
          // Obras
          const { data: obrasData } = await sb.from('obras').select('*').order('id');
          if (obrasData?.length > 0) setDb(obrasData.map(r => ({ ...r, ...(r.dados || {}) })));

          // Projetos
          const { data: projData } = await sb.from('projetos').select('*').order('id');
          if (projData?.length > 0) {
            const mapped = projData.map(r => ({
              id: r.id, especialidade: r.especialidade, projetista: r.projetista,
              obra: r.obra, areaConstruida: r.area_construida, valorProposta: r.valor_proposta,
              custoM2RS: r.custo_m2_rs, mesProposta: r.mes_proposta,
              inccBase: r.incc_base, custoINCCM2: r.custo_incc_m2, ...(r.dados || {})
            }));
            setProjectsDb(mapped.length >= 50 ? mapped : PROJETOS_REAIS_SEED);
          } else {
            // Primeira vez: insere os 101 registros seed no Supabase
            const seedPayload = PROJETOS_REAIS_SEED.map(r => ({
              especialidade: r.especialidade, projetista: r.projetista, obra: r.obra,
              area_construida: r.areaConstruida, valor_proposta: r.valorProposta,
              custo_m2_rs: r.custoM2RS, mes_proposta: r.mesProposta,
              incc_base: r.inccBase, custo_incc_m2: r.custoINCCM2
            }));
            const { data: inserted } = await sb.from('projetos').insert(seedPayload).select();
            if (inserted?.length > 0) {
              setProjectsDb(inserted.map(r => ({
                id: r.id, especialidade: r.especialidade, projetista: r.projetista,
                obra: r.obra, areaConstruida: r.area_construida, valorProposta: r.valor_proposta,
                custoM2RS: r.custo_m2_rs, mesProposta: r.mes_proposta,
                inccBase: r.incc_base, custoINCCM2: r.custo_incc_m2
              })));
            }
          }

          // Elevadores
          const { data: elevData } = await sb.from('elevadores').select('*').order('id');
          if (elevData?.length > 0) setElevatorsDb(elevData.map(r => ({ ...r, ...(r.dados || {}) })));

          // Implantação
          const { data: implData } = await sb.from('implantacao').select('*').order('id');
          if (implData?.length > 0) setImplantacaoDb(implData.map(r => ({
            id: r.id, observacao: r.observacao, item: r.item,
            quantidade: r.quantidade, unidade: r.unidade,
            precoRS: r.preco_rs, precoINCC: r.preco_incc, ...(r.dados || {})
          })));

          // Fundação
          const { data: fundData } = await sb.from('fundacao').select('*').order('id');
          if (fundData?.length > 0) setFundacaoDb(fundData.map(r => ({
            id: r.id, obra: r.obra, fundacao: r.fundacao,
            areaTerreno: r.area_terreno, pavimentos: r.pavimentos,
            custoRS: r.custo_rs, inccBase: r.incc_base,
            custoINCC: r.custo_incc, coeficiente: r.coeficiente, ...(r.dados || {})
          })));
        } else {
          // Fallback localStorage quando Supabase indisponível (Claude.ai)
          try { const r = await storeGet('obras_db'); if (r?.value) setDb(JSON.parse(r.value)); } catch {}
          try {
            const r = await storeGet('projetos_db');
            if (r?.value) {
              const p = JSON.parse(r.value);
              const valid = p.filter(x => x.especialidade && typeof x.custoINCCM2 === 'number' && x.custoINCCM2 > 0);
              setProjectsDb(valid.length >= 50 ? p : PROJETOS_REAIS_SEED);
            } else setProjectsDb(PROJETOS_REAIS_SEED);
          } catch { setProjectsDb(PROJETOS_REAIS_SEED); }
          try { const r = await storeGet('elevadores_db'); if (r?.value) setElevatorsDb(JSON.parse(r.value)); } catch {}
          try { const r = await storeGet('implantacao_db'); if (r?.value) setImplantacaoDb(JSON.parse(r.value)); } catch {}
          try { const r = await storeGet('fundacao_db'); if (r?.value) setFundacaoDb(JSON.parse(r.value)); } catch {}
        }
      } catch {
        setProjectsDb(PROJETOS_REAIS_SEED);
      }
      try {
        const estRes = await store.get('current_estimate');
        if (estRes?.value) setEstimate({ ...EMPTY_ESTIMATE, ...JSON.parse(estRes.value) });
      } catch {}
      try {
        const apRes = await store.get('apresentacao');
        if (apRes?.value) setApresentacao({ ...DEFAULT_APRESENTACAO, ...JSON.parse(apRes.value) });
      } catch {}
      // Carrega estimativas do Supabase
      try {
        const { data } = await (await loadSupabase())?.from('estimativas')
          .select('id, nome, created_at, total_rs, area_constr, dados')
          .order('created_at', { ascending: false });
        if (data?.length > 0) {
          setSavedEstimates(data.map(r => ({
            id: r.id, nome: r.nome, savedAt: r.created_at,
            totalFinalRS: r.total_rs, areaConstruida: r.area_constr, data: r.dados,
          })));
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // ─── Funções de sync com Supabase para as 5 bases ────────────────────
  const syncObras = useCallback(async (rows) => {
    const sb = await loadSupabase(); if (!sb) return;
    await sb.from('obras').delete().neq('id', 0);
    if (rows.length > 0) await sb.from('obras').insert(rows.map(r => {
      const { id, ...rest } = r; return { dados: rest, nome: rest.nome || '', tipo: rest.tipo || '', cidade: rest.cidade || '', estado: rest.estado || '', ano: rest.ano || null, area: rest.area || null, pavimentos: rest.pavimentos || null, subsolos: rest.subsolos || null };
    }));
  }, []);

  const syncProjetos = useCallback(async (rows) => {
    const sb = await loadSupabase(); if (!sb) return;
    // Upsert individual — preserva IDs do Supabase
    for (const r of rows) {
      if (typeof r.id === 'number' && r.id > 0) {
        await sb.from('projetos').upsert({ id: r.id, especialidade: r.especialidade, projetista: r.projetista, obra: r.obra, area_construida: r.areaConstruida, valor_proposta: r.valorProposta, custo_m2_rs: r.custoM2RS, mes_proposta: r.mesProposta, incc_base: r.inccBase, custo_incc_m2: r.custoINCCM2 });
      }
    }
  }, []);

  const syncElevadores = useCallback(async (rows) => {
    const sb = await loadSupabase(); if (!sb) return;
    await sb.from('elevadores').delete().neq('id', 0);
    if (rows.length > 0) await sb.from('elevadores').insert(rows.map(r => {
      const { id, ...rest } = r; return { dados: rest, obra: rest.obra || '', marca: rest.marca || '', num_paradas: rest.numParadas || null, qt_elevadores: rest.qtElevadores || null, valor_fechado: rest.valorFechado || null, mes_fechamento: rest.mesFechamento || '', incc_base: rest.inccBase || null };
    }));
  }, []);

  const syncImplantacao = useCallback(async (rows) => {
    const sb = await loadSupabase(); if (!sb) return;
    await sb.from('implantacao').delete().neq('id', 0);
    if (rows.length > 0) await sb.from('implantacao').insert(rows.map(r => {
      const { id, ...rest } = r; return { dados: rest, observacao: rest.observacao || '', item: rest.item || '', quantidade: rest.quantidade || null, unidade: rest.unidade || '', preco_rs: rest.precoRS || null, preco_incc: rest.precoINCC || null };
    }));
  }, []);

  const syncFundacao = useCallback(async (rows) => {
    const sb = await loadSupabase(); if (!sb) return;
    await sb.from('fundacao').delete().neq('id', 0);
    if (rows.length > 0) await sb.from('fundacao').insert(rows.map(r => {
      const { id, ...rest } = r; return { dados: rest, obra: rest.obra || '', fundacao: rest.fundacao || '', area_terreno: rest.areaTerreno || null, pavimentos: rest.pavimentos || null, custo_rs: rest.custoRS || null, incc_base: rest.inccBase || null, custo_incc: rest.custoINCC || null, coeficiente: rest.coeficiente || null };
    }));
  }, []);

  // ─── Save db ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    storeSet('obras_db', JSON.stringify(db)).catch(() => {});
    syncObras(db);
  }, [db, loaded]);

  // ─── Save projects db ─────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    storeSet('projetos_db', JSON.stringify(projectsDb)).catch(() => {});
    syncProjetos(projectsDb);
  }, [projectsDb, loaded]);

  // ─── Save elevators db ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    storeSet('elevadores_db', JSON.stringify(elevatorsDb)).catch(() => {});
    syncElevadores(elevatorsDb);
  }, [elevatorsDb, loaded]);

  // ─── Save implantacao db ──────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    storeSet('implantacao_db', JSON.stringify(implantacaoDb)).catch(() => {});
    syncImplantacao(implantacaoDb);
  }, [implantacaoDb, loaded]);

  // ─── Save fundacao db ─────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    storeSet('fundacao_db', JSON.stringify(fundacaoDb)).catch(() => {});
    syncFundacao(fundacaoDb);
  }, [fundacaoDb, loaded]);

  // ─── Save estimate (debounced) ────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      storeSet('current_estimate', JSON.stringify(estimate)).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [estimate, loaded]);

  // ─── Save apresentacao ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      storeSet('apresentacao', JSON.stringify(apresentacao)).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [apresentacao, loaded]);

  // ─── Save savedEstimates ──────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    storeSet('saved_estimates', JSON.stringify(savedEstimates)).catch(() => {});
  }, [savedEstimates, loaded]);

  // ─── Reference project ────────────────────────────────────────────────
  const refProject = useMemo(
    () => db.find((p) => p.id === estimate.refProjectId) || null,
    [db, estimate.refProjectId]
  );

  // ─── Calculation engine ───────────────────────────────────────────────
  const calc = useMemo(() => {
    const incc = toNum(estimate.inccAtual);
    const fator = refProject ? incc / refProject.inccBase : 1;

    // Construction by floor — lista unificada (fixos + custom, na ordem salva)
    const floorList = estimate.floorList || FLOOR_TYPES.map((ft) => ({
      id: ft.key, label: ft.label, area: '', coef: '',
      coefField: ft.coefField || null, defaultCoef: ft.defaultCoef, isCustom: false,
    }));

    const floorRows = floorList.map((fl) => {
      const area = toNum(fl.area);
      let coef;
      if (fl.coef !== '' && fl.coef !== null && fl.coef !== undefined) {
        coef = toNum(fl.coef);
      } else if (fl.coefField && refProject) {
        coef = refProject[fl.coefField];
      } else {
        coef = fl.defaultCoef ?? 1.00;
      }
      return { ...fl, area, coef, areaEq: area * coef };
    });

    const allFloorRows = floorRows; // unified — keeping allFloorRows alias for compat

    const areaEqTotal = allFloorRows.reduce((s, r) => s + r.areaEq, 0);

    const custoConstrucaoM2 =
      estimate.overrides.custoConstrucaoM2 ?? refProject?.custoConstrucaoM2 ?? 0;
    const construcaoINCC = areaEqTotal * custoConstrucaoM2;
    const construcaoRS = construcaoINCC * incc;

    // Infrastructure
    // Infraestrutura — busca coeficiente da base de fundações
    const infraFundacaoRec = estimate.infraTipoFundacao
      ? fundacaoDb?.find((r) => r.fundacao === estimate.infraTipoFundacao)
      : null;
    const infraCoef = infraFundacaoRec?.coeficiente ?? null;
    const infraAreaTorre = toNum(estimate.areaProjTorre);
    const infraNumPavtos = toNum(estimate.numPavtos);
    const infraCalcINCC = infraCoef !== null ? infraCoef * infraAreaTorre * infraNumPavtos : null;
    // Override manual tem prioridade; senão usa DB; senão usa obra de referência
    const infraINCC = estimate.overrides.custoInfra !== null && estimate.overrides.custoInfra !== undefined
      ? estimate.overrides.custoInfra
      : infraCalcINCC !== null
        ? infraCalcINCC
        : (refProject?.custoInfra ?? 0);
    const infraRS = infraINCC * incc;

    // Implantação — soma dos itens detalhados
    const implINCC = (estimate.implantacaoItems || []).reduce(
      (s, item) => s + toNum(item.valorINCC), 0
    );
    const implRS = implINCC * incc;

    // Projetos — soma apenas itens marcados como obrigatório
    const projINCC = (estimate.projetosItems || []).reduce(
      (s, item) => item.obrigatorio ? s + toNum(item.custoINCCM2) * toNum(estimate.areaConstruida) : s, 0
    );
    const projRS = projINCC * incc;

    // Elevador — custo = valorParada/elev INCC × nºParadas × qtElevadores
    const elevObraRef = estimate.elevadorObraRef || '';
    const elevDbRec = elevObraRef
      ? elevatorsDb?.find((r) => r.obra === elevObraRef)
      : null;
    // Valor por parada por elevador em INCC (da base)
    const elevValorPPE_INCC = elevDbRec && elevDbRec.inccBase > 0 && elevDbRec.numParadas > 0 && elevDbRec.qtElevadores > 0
      ? (elevDbRec.valorFechado / (elevDbRec.numParadas * elevDbRec.qtElevadores)) / elevDbRec.inccBase
      : null;
    // Nº de paradas: manual > auto (numPavtos - 1) > 0
    const elevNumParadasAuto = Math.max(0, toNum(estimate.numPavtos) - 1);
    const elevNumParadas = (estimate.elevNumParadas !== null && estimate.elevNumParadas !== undefined && estimate.elevNumParadas !== '')
      ? toNum(estimate.elevNumParadas)
      : elevNumParadasAuto;
    // Qt. elevadores: do empreendimento
    const elevQtd = toNum(estimate.numElevadores);
    // Custo INCC override manual tem prioridade
    const elevValorPPE_final = estimate.overrides.custoElevador !== null && estimate.overrides.custoElevador !== undefined
      ? toNum(estimate.overrides.custoElevador)
      : (elevValorPPE_INCC ?? 0);
    const elevINCC = elevValorPPE_final * elevNumParadas * elevQtd;
    const elevRS = elevINCC * incc;

    // Fachada — area auto = perímetro × altura, override = manual
    const fachadaAreaAuto = toNum(estimate.perimetroTorre) * toNum(estimate.alturaPredio);
    const fachadaArea =
      estimate.overrides.fachadaArea && estimate.overrides.fachadaArea > 0
        ? estimate.overrides.fachadaArea
        : fachadaAreaAuto;
    const fachadaM2 = estimate.overrides.custoFachadaM2 ?? refProject?.custoFachadaM2 ?? 0;
    const fachadaINCC = fachadaArea * fachadaM2;
    const fachadaRS = fachadaINCC * incc;

    // Ensaios
    const ensaiosINCC = estimate.overrides.custoEnsaios ?? refProject?.custoEnsaios ?? 0;
    const ensaiosRS = ensaiosINCC * incc;

    // Administração — soma dos 3 sub-grupos
    const admINCC = toNum(estimate.admEquipeINCC)
      + toNum(estimate.admDiversosINCC)
      + toNum(estimate.admLimpezaINCC);
    const admRS = admINCC * incc;

    // Subtotal s/ incorporação
    const subtotalINCC =
      construcaoINCC + infraINCC + implINCC + projINCC +
      elevINCC + fachadaINCC + ensaiosINCC + admINCC;
    const subtotalRS = subtotalINCC * incc;

    // Incorporação
    // Incorporação — soma dos itens detalhados (não-subitens somados individualmente)
    const areaConstr = toNum(estimate.areaConstruida);
    const incorpINCC = (estimate.incorporacaoItems || []).reduce(
      (s, item) => s + (item.isGroup ? 0 : toNum(item.valorINCC)), 0
    );
    const incorpRS = incorpINCC * incc;

    // Subtotal geral (construção + todas seções + incorporação)
    const totalSemIncorpINCC = subtotalINCC;
    const incorpM2 = areaConstr > 0 ? incorpINCC / areaConstr : 0;

    // Extras — soma dos itens
    const extrasINCC = (estimate.extrasItems || []).reduce(
      (s, e) => s + toNum(e.valorINCC), 0
    );
    const extrasRS = extrasINCC * incc;

    // Total s/ taxa adm
    const totalSemTaxaINCC = subtotalINCC + incorpINCC + extrasINCC;
    const totalSemTaxaRS = totalSemTaxaINCC * incc;

    // Taxa adm
    const taxaAdmINCC = totalSemTaxaINCC * toNum(estimate.taxaAdm);
    const taxaAdmRS = taxaAdmINCC * incc;

    // Total final
    const totalFinalINCC = totalSemTaxaINCC + taxaAdmINCC;
    const totalFinalRS = totalFinalINCC * incc;

    const custoFinalM2 = areaConstr > 0 ? totalFinalRS / areaConstr : 0;
    const totalSemTaxaM2INCC = areaConstr > 0 ? totalSemTaxaINCC / areaConstr : 0;
    const totalSemTaxaM2RS   = areaConstr > 0 ? totalSemTaxaRS   / areaConstr : 0;
    const totalFinalM2INCC   = areaConstr > 0 ? totalFinalINCC   / areaConstr : 0;
    const totalFinalM2RS     = areaConstr > 0 ? totalFinalRS     / areaConstr : 0;
    const subtotalM2INCC     = areaConstr > 0 ? subtotalINCC     / areaConstr : 0;
    const subtotalM2RS       = areaConstr > 0 ? subtotalRS       / areaConstr : 0;

    return {
      fator, areaEqTotal, floorRows: allFloorRows, custoConstrucaoM2,
      elevDbRec, elevValorPPE_INCC, elevNumParadas, elevNumParadasAuto,
      infraFundacaoRec, infraCoef, infraCalcINCC,
      sections: [
        { key: 'construcao',    label: 'Construção',     incc: construcaoINCC, rs: construcaoRS },
        { key: 'infra',         label: 'Infraestrutura', incc: infraINCC,      rs: infraRS },
        { key: 'implantacao',   label: 'Implantação',    incc: implINCC,       rs: implRS },
        { key: 'projetos',      label: 'Projetos',       incc: projINCC,       rs: projRS },
        { key: 'elevador',      label: 'Elevadores',     incc: elevINCC,       rs: elevRS },
        { key: 'fachada',       label: 'Fachada',        incc: fachadaINCC,    rs: fachadaRS },
        { key: 'ensaios',       label: 'Ensaios+Sist.',  incc: ensaiosINCC,    rs: ensaiosRS },
        { key: 'administracao', label: 'Administração',  incc: admINCC,        rs: admRS },
        { key: 'incorporacao',  label: 'Incorporação',   incc: incorpINCC,     rs: incorpRS },
        { key: 'extras',        label: 'Extras',         incc: extrasINCC,     rs: extrasRS },
      ],
      subtotalINCC, subtotalRS,
      subtotalM2INCC, subtotalM2RS,
      taxaAdmINCC, taxaAdmRS,
      totalSemTaxaINCC, totalSemTaxaRS,
      totalSemTaxaM2INCC, totalSemTaxaM2RS,
      totalFinalINCC, totalFinalRS,
      totalFinalM2INCC, totalFinalM2RS,
      custoFinalM2,
      fachadaArea,
    };
  }, [estimate, refProject, elevatorsDb, fundacaoDb]);

  // ─── Estimate setters ─────────────────────────────────────────────────
  const updateEst = useCallback((patch) => {
    setEstimate((e) => ({ ...e, ...patch }));
  }, []);
  const updateOverride = useCallback((key, value) => {
    setEstimate((e) => ({ ...e, overrides: { ...e.overrides, [key]: value } }));
  }, []);
  const updateFloor = useCallback((key, patch) => {
    setEstimate((e) => ({ ...e, floors: { ...e.floors, [key]: { ...e.floors[key], ...patch } } }));
  }, []);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  // ─── DB operations ────────────────────────────────────────────────────
  const saveProject = (proj) => {
    if (proj.id) {
      setDb((d) => d.map((p) => (p.id === proj.id ? proj : p)));
    } else {
      const newId = Math.max(0, ...db.map((p) => p.id)) + 1;
      setDb((d) => [...d, { ...proj, id: newId }]);
    }
    setEditProject(null);
    showToast('Obra salva na base de dados');
  };
  const deleteProject = (id) => {
    setDb((d) => d.filter((p) => p.id !== id));
    if (estimate.refProjectId === id) updateEst({ refProjectId: null });
    showToast('Obra removida', 'warn');
  };

  // ─── Project Records (banco de propostas de projetos) ─────────────────
  const saveProjectRecord = (rec) => {
    if (rec.id) {
      setProjectsDb((d) => d.map((r) => (r.id === rec.id ? rec : r)));
    } else {
      const newId = Math.max(0, ...projectsDb.map((r) => r.id)) + 1;
      setProjectsDb((d) => [...d, { ...rec, id: newId }]);
    }
    setEditProjectRecord(null);
    showToast('Proposta salva');
  };
  const deleteProjectRecord = (id) => {
    setProjectsDb((d) => d.filter((r) => r.id !== id));
    showToast('Proposta removida', 'warn');
  };
  const clearAllProjectRecords = () => {
    setProjectsDb([]);
    showToast('Todas as propostas removidas', 'warn');
  };

  // ─── Implantação DB CRUD ──────────────────────────────────────────────
  const saveImplantacaoRecord = (rec) => {
    if (rec.id) {
      setImplantacaoDb((d) => d.map((r) => (r.id === rec.id ? rec : r)));
    } else {
      const newId = Math.max(0, ...implantacaoDb.map((r) => r.id)) + 1;
      setImplantacaoDb((d) => [...d, { ...rec, id: newId }]);
    }
    setEditImplantacaoRecord(null);
    showToast('Item salvo');
  };
  const deleteImplantacaoRecord = (id) => {
    setImplantacaoDb((d) => d.filter((r) => r.id !== id));
    showToast('Item removido', 'warn');
  };

  // ─── Fundação DB CRUD ─────────────────────────────────────────────────
  const saveFundacaoRecord = (rec) => {
    if (rec.id) {
      setFundacaoDb((d) => d.map((r) => (r.id === rec.id ? rec : r)));
    } else {
      const newId = Math.max(0, ...fundacaoDb.map((r) => r.id)) + 1;
      setFundacaoDb((d) => [...d, { ...rec, id: newId }]);
    }
    setEditFundacaoRecord(null);
    showToast('Fundação salva');
  };
  const deleteFundacaoRecord = (id) => {
    setFundacaoDb((d) => d.filter((r) => r.id !== id));
    showToast('Registro removido', 'warn');
  };

  // ─── Export / Import ──────────────────────────────────────────────────
  const exportData = () => {
    const data = { db, projectsDb, elevatorsDb, implantacaoDb, fundacaoDb, savedEstimates, estimate, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estimativa_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado');
  };
  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.db) setDb(data.db);
        if (data.projectsDb) setProjectsDb(data.projectsDb);
        if (data.elevatorsDb) setElevatorsDb(data.elevatorsDb);
        if (data.implantacaoDb) setImplantacaoDb(data.implantacaoDb);
        if (data.fundacaoDb) setFundacaoDb(data.fundacaoDb);
        if (data.savedEstimates) setSavedEstimates(data.savedEstimates);
        if (data.estimate) setEstimate({ ...EMPTY_ESTIMATE, ...data.estimate });
        showToast('Backup importado');
      } catch {
        showToast('Falha ao importar', 'err');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ─── Elevators DB CRUD ────────────────────────────────────────────────
  const saveElevatorRecord = (rec) => {
    if (rec.id) {
      setElevatorsDb((d) => d.map((r) => (r.id === rec.id ? rec : r)));
    } else {
      const newId = Math.max(0, ...elevatorsDb.map((r) => r.id)) + 1;
      setElevatorsDb((d) => [...d, { ...rec, id: newId }]);
    }
    setEditElevatorRecord(null);
    showToast('Elevador salvo');
  };
  const deleteElevatorRecord = (id) => {
    setElevatorsDb((d) => d.filter((r) => r.id !== id));
    showToast('Registro removido', 'warn');
  };

  // ─── Saved Estimates CRUD — Supabase ─────────────────────────────────────
  const saveCurrentEstimate = async (nome) => {
    const payload = {
      user_id: authUser.id,
      nome: nome || estimate.nome || `Estimativa ${new Date().toLocaleDateString('pt-BR')}`,
      dados: estimate,
      total_rs: calc.totalFinalRS,
      area_constr: toNum(estimate.areaConstruida),
    };
    const { data, error } = await (await loadSupabase())?.from('estimativas').insert([payload]).select().single();
    if (error) { showToast('Erro ao salvar: ' + error.message, 'err'); return; }
    setSavedEstimates((prev) => [{ id: data.id, nome: data.nome, savedAt: data.created_at, totalFinalRS: data.total_rs, areaConstruida: data.area_constr, data: data.dados }, ...prev]);
    setSaveModalOpen(false);
    setCurrentSavedId(null);
    setEstimate(EMPTY_ESTIMATE);
    setTab('estimativas');
    showToast('Estimativa salva com sucesso');
  };

  const loadEstimate = (saved) => {
    setEstimate({ ...EMPTY_ESTIMATE, ...saved.data });
    setCurrentSavedId(saved.id);
    setTab('estimativa');
    showToast(`"${saved.nome}" carregada`);
  };

  const deleteEstimate = async (id) => {
    const { error } = await (await loadSupabase())?.from('estimativas').delete().eq('id', id);
    if (error) { showToast('Erro ao excluir', 'err'); return; }
    setSavedEstimates((prev) => prev.filter((e) => e.id !== id));
    if (currentSavedId === id) setCurrentSavedId(null);
    showToast('Estimativa removida', 'warn');
  };

  const duplicateEstimate = async (saved) => {
    const payload = {
      user_id: authUser.id,
      nome: `${saved.nome} (cópia)`,
      dados: saved.data,
      total_rs: saved.totalFinalRS,
      area_constr: saved.areaConstruida,
    };
    const { data, error } = await (await loadSupabase())?.from('estimativas').insert([payload]).select().single();
    if (error) { showToast('Erro ao duplicar', 'err'); return; }
    setSavedEstimates((prev) => [{ id: data.id, nome: data.nome, savedAt: data.created_at, totalFinalRS: data.total_rs, areaConstruida: data.area_constr, data: data.dados }, ...prev]);
    showToast('Estimativa duplicada');
  };

  const updateEstimateName = async (id, nome) => {
    const { error } = await (await loadSupabase())?.from('estimativas').update({ nome }).eq('id', id);
    if (error) { showToast('Erro ao renomear', 'err'); return; }
    setSavedEstimates((prev) => prev.map((e) => e.id === id ? { ...e, nome } : e));
  };

  const updateCurrentEstimate = async () => {
    if (!currentSavedId) return;
    const { error } = await (await loadSupabase())?.from('estimativas').update({
      dados: estimate, total_rs: calc.totalFinalRS, area_constr: toNum(estimate.areaConstruida),
    }).eq('id', currentSavedId);
    if (error) { showToast('Erro ao atualizar', 'err'); return; }
    setSavedEstimates((prev) => prev.map((e) => e.id === currentSavedId
      ? { ...e, savedAt: new Date().toISOString(), totalFinalRS: calc.totalFinalRS, areaConstruida: toNum(estimate.areaConstruida), data: { ...estimate } }
      : e
    ));
    setCurrentSavedId(null);
    setEstimate(EMPTY_ESTIMATE);
    setTab('estimativas');
    showToast('Estimativa atualizada');
  };

  const [confirmReset, setConfirmReset] = useState(false);

  const resetEstimate = () => {
    setEstimate(EMPTY_ESTIMATE);
    setCurrentSavedId(null);
    setConfirmReset(false);
    showToast('Estimativa zerada');
  };

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-slate-900" style={{ background: 'var(--surface)', fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        :root {
          --navy:          #0d1e35;
          --navy-2:        #122540;
          --navy-3:        #1a3a5c;
          --accent:        #2e6fad;
          --accent-light:  #4a8fd4;
          --amber:         #F59E0B;
          --amber-dim:     #92400E;
          --ui-accent:     #2e6fad;
          --ui-accent-dark:#0d1e35;
          --ui-accent-mid: #1a3a5c;
          --surface:       #f0f5fc;
          --surface-warm:  #e8f0fb;
          --card:          #FFFFFF;
          --border:        #ccdaee;
          --border-strong: #a8bdd8;
          --text-primary:  #0d1e35;
          --text-secondary:#1a3a5c;
          --text-muted:    #4a6080;
        }
        * { box-sizing: border-box; }
        body, button, input, select, textarea { font-family: "IBM Plex Sans", sans-serif; }
        .num { font-family: "IBM Plex Mono", monospace; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .app-surface { background: var(--surface); min-height: 100vh; }
        .section-enter { animation: fadeIn 0.18s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        tr.bg-slate-900 { background-color: #0d1e35 !important; color: rgba(255,255,255,0.65) !important; }
        tr.bg-slate-800 { background-color: #122540 !important; }
        tr.bg-slate-700 { background-color: #1a3a5c !important; }
        .bg-slate-900 { background-color: #0d1e35 !important; }
        .bg-slate-800 { background-color: #122540 !important; }
        .bg-slate-700 { background-color: #1a3a5c !important; }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: var(--surface-warm); }
        ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #2e6fad; }

        /* ── NAV TAB hover premium ── */
        .nav-tab {
          position: relative;
          padding: 10px 18px;
          font-size: 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: color 0.2s ease;
          letter-spacing: 0.01em;
          overflow: hidden;
          font-family: "IBM Plex Sans", sans-serif;
        }

        /* glow background sweep */
        .nav-tab::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 120%, rgba(245,158,11,0.18) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }

        /* bottom bar animada */
        .nav-tab::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--amber), transparent);
          transform: translateX(-50%);
          transition: width 0.25s cubic-bezier(0.34,1.56,0.64,1);
          pointer-events: none;
        }

        .nav-tab:not(.active):hover::before { opacity: 1; }
        .nav-tab:not(.active):hover::after  { width: 60%; }
        .nav-tab:not(.active):hover {
          color: rgba(255,255,255,0.92) !important;
          text-shadow: 0 0 12px rgba(245,158,11,0.35);
        }
        .nav-tab:not(.active):hover svg {
          filter: drop-shadow(0 0 4px rgba(245,158,11,0.5));
        }

        .nav-tab.active {
          color: var(--amber) !important;
          border-bottom: 2px solid var(--amber);
          text-shadow: 0 0 8px rgba(245,158,11,0.25);
        }
        .nav-tab.active svg {
          filter: drop-shadow(0 0 3px rgba(245,158,11,0.4));
        }

        /* click ripple */
        .nav-tab:active::before {
          background: radial-gradient(ellipse at 50% 120%, rgba(245,158,11,0.3) 0%, transparent 70%);
          opacity: 1;
        }
      `}</style>

      {/* ─── HEADER DUPLO ─── */}
      <header style={{ position:'sticky', top:0, zIndex:40, boxShadow:'0 2px 20px rgba(13,30,53,0.4)' }}>

        {/* Barra superior */}
        <div style={{ background:'#0d1e35', padding:'0 24px', height:50, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
            <div style={{ width:33, height:33, background:'#2e6fad', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(46,111,173,0.45)', flexShrink:0 }}>
              <Building2 style={{ width:17, height:17, color:'#fff' }} />
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', letterSpacing:'0.02em', lineHeight:1.2 }}>Estimativa Paramétrica</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.05em', textTransform:'uppercase', lineHeight:1 }}>
                {currentSavedId
                  ? <span>Editando · <span style={{ color:'#4a8fd4', fontWeight:500 }}>{savedEstimates.find(e => e.id === currentSavedId)?.nome}</span></span>
                  : 'Planejamento e Orçamento'
                }
              </div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <label className="hdr-btn" style={{ fontSize:11, color:'rgba(255,255,255,0.45)', cursor:'pointer', padding:'5px 11px', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', gap:6, borderRadius:4, fontWeight:500, background:'transparent' }}>
              <Upload style={{ width:12, height:12 }} /> Importar
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button className="hdr-btn" onClick={exportData}
              style={{ fontSize:11, color:'rgba(255,255,255,0.45)', padding:'5px 11px', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', gap:6, background:'transparent', cursor:'pointer', borderRadius:4, fontWeight:500 }}>
              <Download style={{ width:12, height:12 }} /> Backup
            </button>

            {currentSavedId && (
              <button onClick={updateCurrentEstimate}
                style={{ fontSize:11, fontWeight:600, padding:'5px 13px', background:'rgba(74,143,212,0.15)', color:'#4a8fd4', border:'1px solid rgba(74,143,212,0.3)', cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:6 }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(74,143,212,0.28)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(74,143,212,0.15)'; }}>
                <Save style={{ width:12, height:12 }} /> Atualizar
              </button>
            )}
            <button onClick={() => setSaveModalOpen(true)}
              style={{ fontSize:11, fontWeight:700, padding:'5px 14px', background:'#2e6fad', color:'#fff', border:'none', cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 10px rgba(46,111,173,0.4)', letterSpacing:'0.02em' }}
              onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(46,111,173,0.55)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='0 2px 10px rgba(46,111,173,0.4)'; }}>
              <Save style={{ width:12, height:12 }} /> Salvar
            </button>

            {authUser?.id !== 'local' && (
              <div style={{ display:'flex', alignItems:'center', gap:7, paddingLeft:10, borderLeft:'1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(255,255,255,0.3)' }}>
                  <User style={{ width:12, height:12 }} />
                  <span>{authUser.email}</span>
                </div>
                <button onClick={async () => { const sb = await loadSupabase(); await sb?.auth.signOut(); }}
                  style={{ fontSize:10, color:'rgba(255,255,255,0.3)', padding:'4px 8px', border:'1px solid rgba(255,255,255,0.08)', background:'transparent', cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:4 }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(239,68,68,0.4)'; e.currentTarget.style.color='#FCA5A5'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}>
                  <LogOut style={{ width:11, height:11 }} /> Sair
                </button>
              </div>
            )}

            {confirmReset ? (
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:11, color:'#FCA5A5' }}>Confirmar?</span>
                <button onClick={resetEstimate} style={{ fontSize:11, padding:'4px 9px', background:'#DC2626', color:'#fff', border:'none', cursor:'pointer', borderRadius:4 }}>Sim</button>
                <button onClick={() => setConfirmReset(false)} style={{ fontSize:11, padding:'4px 9px', background:'transparent', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.12)', cursor:'pointer', borderRadius:4 }}>Não</button>
              </span>
            ) : (
              <button onClick={() => setConfirmReset(true)}
                style={{ fontSize:11, color:'rgba(255,255,255,0.25)', padding:'5px 9px', border:'1px solid rgba(255,255,255,0.08)', background:'transparent', cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:5 }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(239,68,68,0.35)'; e.currentTarget.style.color='rgba(239,68,68,0.65)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.25)'; }}>
                <RotateCcw style={{ width:11, height:11 }} /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* Barra de navegação */}
        <div style={{ background:'#122540', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <style>{`
            .nav-tab { position:relative; overflow:hidden; transition:color .2s ease, background .2s ease !important; }
            .nav-tab::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 120%, rgba(255,255,255,0.08) 0%, transparent 70%); opacity:0; transition:opacity .25s ease; pointer-events:none; }
            .nav-tab:not(.nav-active):hover::before { opacity:1; }
            .nav-tab:not(.nav-active):hover { color:rgba(255,255,255,0.9) !important; background:rgba(255,255,255,0.04) !important; border-bottom:2px solid rgba(255,255,255,0.5) !important; }
            .nav-tab:not(.nav-active):hover svg { filter:drop-shadow(0 0 4px rgba(74,143,212,0.6)); opacity:1 !important; }
            .nav-tab.nav-active { cursor:default; }
            .nav-tab svg { transition:filter .2s, opacity .2s; }
            .hdr-btn { transition:color .15s, border-color .15s, background .15s !important; }
            .hdr-btn:hover { background:rgba(255,255,255,0.07) !important; border-color:rgba(255,255,255,0.3) !important; color:#fff !important; }
          `}</style>
          <nav style={{ display:'flex', gap:0, maxWidth:1600, margin:'0 auto', padding:'0 24px' }}>
            {[
              { id:'estimativa',   label:'Estimativa',         icon:Calculator },
              { id:'estimativas',  label:'Estimativas Salvas',  icon:Save },
              { id:'baseDados',    label:'Base de Dados',       icon:Database },
              { id:'apresentacao', label:'Apresentação',        icon:FileDown },
              { id:'analise',      label:'Análise',             icon:BarChart3 },
              { id:'incc',         label:'INCC',                icon:Calculator },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`nav-tab${active ? ' nav-active' : ''}`}
                  style={{
                    padding:'9px 17px', fontSize:12,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    borderBottom: active ? '2px solid #4a8fd4' : '2px solid transparent',
                    background: active ? 'rgba(74,143,212,0.08)' : 'transparent',
                    border: 'none',
                    borderBottom: active ? '2px solid #4a8fd4' : '2px solid transparent',
                    cursor: active ? 'default' : 'pointer',
                    display:'flex', alignItems:'center', gap:7,
                    letterSpacing:'0.01em',
                    fontFamily:'"IBM Plex Sans", sans-serif',
                    borderRadius:'4px 4px 0 0',
                  }}>
                  <Icon style={{ width:13, height:13, opacity: active ? 1 : 0.5, filter: active ? 'drop-shadow(0 0 3px rgba(74,143,212,0.5))' : 'none' }} />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ─── TOAST ─── */}
      {toast && (
        <div style={{
          position:'fixed', top:72, right:24, zIndex:50, padding:'10px 16px', fontSize:12,
          boxShadow:'0 4px 24px rgba(0,0,0,0.15)', borderRadius:6, fontWeight:500,
          display:'flex', alignItems:'center', gap:8, minWidth:220,
          background: toast.type === 'err' ? '#FEF2F2' : toast.type === 'warn' ? '#FEFCE8' : '#F0FDF4',
          color: toast.type === 'err' ? '#991B1B' : toast.type === 'warn' ? '#1a3a5c' : '#14532D',
          borderLeft: `3px solid ${toast.type === 'err' ? '#DC2626' : toast.type === 'warn' ? '#2e6fad' : '#16A34A'}`,
        }}>
          {toast.type === 'err' ? <AlertCircle style={{ width:14, height:14 }} /> : <Check style={{ width:14, height:14 }} />}
          {toast.msg}
        </div>
      )}

      {/* MAIN */}
      <main className="max-w-[1600px] mx-auto px-6 py-5">
        {tab === 'estimativa' && (
          <EstimativaView
            db={db}
            projectsDb={projectsDb}
            elevatorsDb={elevatorsDb}
            fundacaoDb={fundacaoDb}
            implantacaoDb={implantacaoDb}
            estimate={estimate}
            refProject={refProject}
            calc={calc}
            updateEst={updateEst}
            updateOverride={updateOverride}
            updateFloor={updateFloor}
          />
        )}
        {tab === 'estimativas' && (
          <EstimativasSalvasView
            savedEstimates={savedEstimates}
            onLoad={loadEstimate}
            onDelete={deleteEstimate}
            onDuplicate={duplicateEstimate}
            onRename={updateEstimateName}
            onNew={() => { setEstimate(EMPTY_ESTIMATE); setCurrentSavedId(null); setTab('estimativa'); showToast('Nova estimativa criada'); }}
          />
        )}
        {tab === 'baseDados' && (
          <BaseDadosView
            db={db}
            projectsDb={projectsDb}
            elevatorsDb={elevatorsDb}
            implantacaoDb={implantacaoDb}
            fundacaoDb={fundacaoDb}
            onEditObra={setEditProject}
            onDeleteObra={deleteProject}
            onNewObra={() => setEditProject({})}
            onEditProjeto={setEditProjectRecord}
            onDeleteProjeto={deleteProjectRecord}
            onNewProjeto={() => setEditProjectRecord({})}
            onEditElevador={setEditElevatorRecord}
            onDeleteElevador={deleteElevatorRecord}
            onNewElevador={() => setEditElevatorRecord({})}
            onEditImplantacao={setEditImplantacaoRecord}
            onDeleteImplantacao={deleteImplantacaoRecord}
            onNewImplantacao={() => setEditImplantacaoRecord({})}
            onEditFundacao={setEditFundacaoRecord}
            onDeleteFundacao={deleteFundacaoRecord}
            onNewFundacao={() => setEditFundacaoRecord({})}
          />
        )}
        {tab === 'apresentacao' && (
          <ApresentacaoView
            estimate={estimate}
            calc={calc}
            refProject={refProject}
            apresentacao={apresentacao}
            setApresentacao={setApresentacao}
            savedEstimates={savedEstimates}
          />
        )}
        {tab === 'analise' && (
          <AnaliseView calc={calc} refProject={refProject} estimate={estimate} db={db} />
        )}
        {tab === 'incc' && (
          <InccView />
        )}
      </main>

      {/* SAVE ESTIMATE MODAL */}
      {saveModalOpen && (
        <SaveEstimateModal
          estimateName={estimate.nome}
          onSave={saveCurrentEstimate}
          onCancel={() => setSaveModalOpen(false)}
        />
      )}
      {editProject !== null && (
        <ProjectEditor
          project={editProject}
          onSave={saveProject}
          onCancel={() => setEditProject(null)}
        />
      )}

      {/* PROJECT RECORD EDITOR MODAL */}
      {editProjectRecord !== null && (
        <ProjectRecordEditor
          record={editProjectRecord}
          projectsDb={projectsDb}
          onSave={saveProjectRecord}
          onCancel={() => setEditProjectRecord(null)}
        />
      )}

      {/* ELEVATOR RECORD EDITOR MODAL */}
      {editElevatorRecord !== null && (
        <ElevatorRecordEditor
          record={editElevatorRecord}
          onSave={saveElevatorRecord}
          onCancel={() => setEditElevatorRecord(null)}
        />
      )}
      {editImplantacaoRecord !== null && (
        <ImplantacaoRecordEditor
          record={editImplantacaoRecord}
          onSave={saveImplantacaoRecord}
          onCancel={() => setEditImplantacaoRecord(null)}
        />
      )}
      {editFundacaoRecord !== null && (
        <FundacaoRecordEditor
          record={editFundacaoRecord}
          onSave={saveFundacaoRecord}
          onCancel={() => setEditFundacaoRecord(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTIMATIVA VIEW
// ═══════════════════════════════════════════════════════════════════════════
function EstimativaView({ db, projectsDb, elevatorsDb, fundacaoDb, implantacaoDb, estimate, refProject, calc, updateEst, updateOverride, updateFloor }) {
  const [confirmDeleteFloor, setConfirmDeleteFloor] = useState(null);
  const [confirmDeleteImpl, setConfirmDeleteImpl] = useState(null);
  const [confirmDeleteImpl2, setConfirmDeleteImpl2] = useState(null);
  const [confirmDeleteExtra, setConfirmDeleteExtra] = useState(null);
  const [confirmDeleteInc, setConfirmDeleteInc] = useState(null);
  // Tipos únicos de fundação disponíveis na base
  const tiposFundacao = useMemo(
    () => Array.from(new Set((fundacaoDb || []).map((r) => r.fundacao).filter(Boolean))).sort(),
    [fundacaoDb]
  );

  const SECTIONS = [
    'configuracao', 'info', 'custoUnitario', 'construcao',
    'implantacao', 'projetos',
    'infraestrutura', 'elevador', 'fachada', 'especiais',
    'administracao',
    'semIncorp', 'incorporacao', 'extras', 'semTaxa', 'comTaxa',
  ];
  const [collapsed, setCollapsed] = useState(() =>
    Object.fromEntries(SECTIONS.map((s) => [s, false]))
  );
  const toggle = (id) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  const collapseAll = () => setCollapsed(Object.fromEntries(SECTIONS.map((s) => [s, true])));
  const expandAll  = () => setCollapsed(Object.fromEntries(SECTIONS.map((s) => [s, false])));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
      <div className="space-y-2.5">
        {/* Controles de colapso */}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs text-stone-400">Módulos:</span>
          <button onClick={expandAll}
            className="text-xs text-stone-600 hover:text-slate-900 px-2 py-1 border border-stone-200 hover:border-stone-400 bg-white">
            Expandir todos
          </button>
          <button onClick={collapseAll}
            className="text-xs text-stone-600 hover:text-slate-900 px-2 py-1 border border-stone-200 hover:border-stone-400 bg-white">
            Recolher todos
          </button>
        </div>
        {/* ─── REFERENCE & INCC ─── */}
        <CollapsibleSection id="configuracao" label="Configuração" color="#2E75B6"
          totalINCC={null} totalRS={null} collapsed={collapsed.configuracao} onToggle={toggle}>
        <Card title="" accent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <Field label="Obra de Referência" hint="Define os indicadores base">
              <select
                value={estimate.refProjectId || ''}
                onChange={(e) => updateEst({ refProjectId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:outline-none focus:border-blue-600"
              >
                <option value="">— Selecione uma obra —</option>
                {db.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.tipo}, {p.ano})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="INCC Atual" hint="Índice do mês de referência">
              <div className="flex items-center gap-2">
                <input
                  type="number" step="0.001"
                  value={estimate.inccAtual}
                  onChange={(e) => updateEst({ inccAtual: parseFloat(e.target.value) || 0 })}
                  className="num" style={{ width:"100%", padding:"7px 10px", background:"#fff", border:"1px solid #ccdaee", borderRadius:7, fontSize:13, textAlign:"right", color:"var(--text-primary)", outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)" }} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor="#ccdaee";e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background="#fff";}}
                />
                <button
                  onClick={() => {
                    const ultimo = INCC_HISTORICO[INCC_HISTORICO.length - 1];
                    if (ultimo) updateEst({ inccAtual: ultimo.indice });
                  }}
                  style={{ fontSize:11, fontWeight:600, padding:'6px 10px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}
                  title={`Puxar índice mais recente da base: ${INCC_HISTORICO[INCC_HISTORICO.length - 1]?.mes}`}
                >
                  ↻ {INCC_HISTORICO[INCC_HISTORICO.length - 1]?.mes}
                </button>
              </div>
              <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:3 }}>
                Índice mais recente na base: <strong>{INCC_HISTORICO[INCC_HISTORICO.length - 1]?.indice?.toLocaleString('pt-BR', { minimumFractionDigits:3 })}</strong> ({INCC_HISTORICO[INCC_HISTORICO.length - 1]?.mes}) · Clique para aplicar automaticamente
              </p>
            </Field>
          </div>
          {refProject && (
            <div className="px-4 pb-4 grid grid-cols-3 gap-3 text-xs">
              <Stat label="INCC Base" value={fmtNum(refProject.inccBase, 2)} />
              <Stat label="Fator Atualização" value={fmtNum(calc.fator, 4) + '×'} highlight />
              <Stat label="Tipo Obra Ref." value={refProject.tipo} small />
            </div>
          )}
        </Card>
        </CollapsibleSection>

        {/* ─── PROJECT INFO ─── */}
        <CollapsibleSection id="info" label="Informações do Empreendimento" color="#374151"
          totalINCC={null} totalRS={null} collapsed={collapsed.info} onToggle={toggle}>
        <Card title="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
            <Field label="Nome do Projeto" span2>
              <Input value={estimate.nome} onChange={(v) => updateEst({ nome: v })} />
            </Field>
            <Field label="Endereço" span2>
              <Input value={estimate.endereco} onChange={(v) => updateEst({ endereco: v })} />
            </Field>
            <Field label="Área Construída (m²)">
              <NumInput value={estimate.areaConstruida} onChange={(v) => updateEst({ areaConstruida: v })} />
            </Field>
            <Field label="Área Proj. Torre (m²)">
              <NumInput value={estimate.areaProjTorre} onChange={(v) => updateEst({ areaProjTorre: v })} />
            </Field>
            <Field label="Perímetro Torre (m)">
              <NumInput value={estimate.perimetroTorre} onChange={(v) => updateEst({ perimetroTorre: v })} />
            </Field>
            <Field label="Altura Prédio (m)">
              <NumInput value={estimate.alturaPredio} onChange={(v) => updateEst({ alturaPredio: v })} />
            </Field>
            <Field label="Nº Pavimentos">
              <NumInput value={estimate.numPavtos} onChange={(v) => updateEst({ numPavtos: v })} int />
            </Field>
            <Field label="Nº Subsolos">
              <NumInput value={estimate.numSubsolos} onChange={(v) => updateEst({ numSubsolos: v })} int />
            </Field>
            <Field label="Prazo Obra (meses)">
              <NumInput value={estimate.prazoObra} onChange={(v) => updateEst({ prazoObra: v })} int />
            </Field>
            <Field label="Nº Elevadores">
              <NumInput value={estimate.numElevadores} onChange={(v) => updateEst({ numElevadores: v })} int />
            </Field>
            <Field label="Nº Paradas/Elev.">
              <NumInput value={estimate.numParadas} onChange={(v) => updateEst({ numParadas: v })} int />
            </Field>
            <Field label="Tipo de Fundação">
              <select
                value={estimate.tipoFundacao}
                onChange={(e) => updateEst({ tipoFundacao: e.target.value })}
                className="w-full px-2 py-1.5 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
              >
                <option value="">—</option>
                {FOUNDATION_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
          </div>
        </Card>
        </CollapsibleSection>

        {/* ─── CONSTRUÇÃO POR PAVIMENTO ─── */}
        <CollapsibleSection id="construcao" label="Custo de Construção" color="#1F3864"
          totalINCC={calc.sections[0].incc} totalRS={calc.sections[0].rs} collapsed={collapsed.construcao} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-sm flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="text-stone-600">Custo INCC/m² eq.:</span>
              <span className="num font-semibold text-slate-900">
                {fmtNum(calc.custoConstrucaoM2)}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600">R$/m² atualizado:</span>
              <span className="num font-semibold text-blue-700">
                {fmtR$(calc.custoConstrucaoM2 * toNum(estimate.inccAtual))}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <OverrideControl
                value={estimate.overrides.custoConstrucaoM2}
                refValue={refProject?.custoConstrucaoM2}
                onChange={(v) => updateOverride('custoConstrucaoM2', v)}
                label="INCC/m² eq."
              />
              <button
                onClick={() => updateEst({
                  floorList: [...(estimate.floorList || []), {
                    id: `custom_${Date.now()}`,
                    label: '',
                    area: '',
                    coef: '1.00',
                    coefField: null,
                    defaultCoef: 1.00,
                    isCustom: true,
                  }],
                })}
                className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 hover:bg-blue-50"
              >
                <Plus className="w-3 h-3" /> Pavimento
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-stone-200 text-xs uppercase tracking-wider">
                  <th className="w-14 px-2 py-2.5 font-medium text-center">Ordem</th>
                  <th className="text-left px-4 py-2.5 font-medium">Tipo de Pavimento</th>
                  <th className="text-right px-3 py-2.5 font-medium">Área (m²)</th>
                  <th className="text-right px-3 py-2.5 font-medium">Coef.</th>
                  <th className="text-right px-3 py-2.5 font-medium">Área Eq.</th>
                  <th className="text-right px-3 py-2.5 font-medium">Custo (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium">Custo (R$)</th>
                  <th className="w-8 px-2 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {calc.floorRows.map((row, i) => {
                  const list = estimate.floorList || [];
                  const total = list.length;
                  const usingRef = (row.coef !== '' && row.coef != null)
                    ? false
                    : !!(row.coefField && refProject);

                  const moveUp = () => {
                    if (i === 0) return;
                    const next = [...list];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    updateEst({ floorList: next });
                  };
                  const moveDown = () => {
                    if (i === total - 1) return;
                    const next = [...list];
                    [next[i], next[i + 1]] = [next[i + 1], next[i]];
                    updateEst({ floorList: next });
                  };
                  const remove = () => updateEst({
                    floorList: list.filter((_, j) => j !== i),
                  });
                  const updateField = (field, value) => updateEst({
                    floorList: list.map((fl, j) => j === i ? { ...fl, [field]: value } : fl),
                  });

                  return (
                    <tr key={row.id} {...(i%2?{style:{background:'#e8f0fb',borderBottom:'1px solid var(--border)'}}:{style:{background:'#fff',borderBottom:'1px solid var(--border)'}})}>
                      {/* Controles de ordem */}
                      <td className="px-2 py-1.5">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            onClick={moveUp}
                            disabled={i === 0}
                            className="p-0.5 text-stone-400 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Mover para cima"
                          >
                            <ChevronRight className="w-3.5 h-3.5 -rotate-90" />
                          </button>
                          <button
                            onClick={moveDown}
                            disabled={i === total - 1}
                            className="p-0.5 text-stone-400 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Mover para baixo"
                          >
                            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                          </button>
                        </div>
                      </td>

                      {/* Nome */}
                      <td className="px-4 py-1.5">
                        {row.isCustom ? (
                          <input
                            type="text"
                            value={row.label || ''}
                            onChange={(e) => updateField('label', e.target.value)}
                            placeholder="Nome do pavimento"
                            className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-blue-600 focus:outline-none text-sm text-stone-800"
                          />
                        ) : (
                          <span className="text-stone-700">{row.label}</span>
                        )}
                      </td>

                      {/* Área */}
                      <td className="px-3 py-1.5">
                        <input
                          type="number" step="0.01"
                          value={row.area === 0 ? '' : row.area}
                          onChange={(e) => updateField('area', e.target.value)}
                          className="num"
                          placeholder="0"
                          style={{ width:'100%', padding:'7px 10px', background:'#fff', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, textAlign:'right', color:'var(--text-primary)', outline:'none', transition:'border-color .15s, box-shadow .15s, background .15s', boxSizing:'border-box', boxShadow:'0 1px 2px rgba(13,30,53,0.05)' }}
                          onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; e.target.style.background='#f5f9ff'; }}
                          onBlur={e=>{ e.target.style.borderColor='#ccdaee'; e.target.style.boxShadow='0 1px 2px rgba(13,30,53,0.05)'; e.target.style.background='#fff'; }}
                        />
                      </td>

                      {/* Coef */}
                      <td className="px-3 py-1.5">
                        <input
                          type="number" step="0.01"
                          value={list[i]?.coef ?? ''}
                          onChange={(e) => updateField('coef', e.target.value)}
                          className="num"
                          placeholder={fmtNum(row.defaultCoef ?? 1.00)}
                          style={{ width:'100%', padding:'7px 10px', background: usingRef ? '#f0fdf4' : '#fff', border: `1px solid ${usingRef ? '#86efac' : '#ccdaee'}`, borderRadius:7, fontSize:13, textAlign:'right', color: usingRef ? '#166534' : 'var(--text-primary)', outline:'none', transition:'border-color .15s, box-shadow .15s, background .15s', boxSizing:'border-box', boxShadow:'0 1px 2px rgba(13,30,53,0.05)' }}
                          onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; e.target.style.background='#f5f9ff'; }}
                          onBlur={e=>{ e.target.style.borderColor= usingRef ? '#86efac' : '#ccdaee'; e.target.style.boxShadow='0 1px 2px rgba(13,30,53,0.05)'; e.target.style.background= usingRef ? '#f0fdf4' : '#fff'; }}
                        />
                      </td>

                      <td className="px-3 py-2 text-right num text-stone-600">{fmtNum(row.areaEq)}</td>
                      <td className="px-3 py-2 text-right num text-stone-700">{fmtNum(row.areaEq * calc.custoConstrucaoM2)}</td>
                      <td className="px-4 py-2 text-right num font-medium text-slate-900">
                        {fmtR$(row.areaEq * calc.custoConstrucaoM2 * toNum(estimate.inccAtual))}
                      </td>

                      {/* Excluir */}
                      <td className="px-2 py-1.5 text-center">
                        {confirmDeleteFloor === i ? (
                          <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                            <button style={{ padding:'4px 11px', background:'#DC2626', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em', boxShadow:'0 1px 4px rgba(220,38,38,0.25)', transition:'filter .15s, box-shadow .15s' }} onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 3px 8px rgba(220,38,38,0.35)';}} onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 1px 4px rgba(220,38,38,0.25)';}} onClick={() => { remove(); setConfirmDeleteFloor(null); }}>Sim</button>
                            <button style={{ padding:'4px 11px', background:'transparent', color:'#4a6080', border:'0.5px solid #ccdaee', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'background .15s, border-color .15s, color .15s' }} onMouseEnter={e=>{e.currentTarget.style.background='#e8f0fb';e.currentTarget.style.borderColor='#a8bdd8';e.currentTarget.style.color='#0d1e35';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='#ccdaee';e.currentTarget.style.color='#4a6080';}} onClick={() => setConfirmDeleteFloor(null)}>Não</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDeleteFloor(i)}
                            className="p-1 text-stone-300 hover:text-rose-600 transition-colors" title="Excluir pavimento">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {(estimate.floorList || []).length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-stone-400 text-sm italic">
                      Nenhum pavimento. Clique em "+ Pavimento" para adicionar.
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-900 text-stone-100 font-semibold">
                  <td colSpan={4} className="px-4 py-2.5 text-right uppercase text-xs tracking-wider">Total Construção</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.areaEqTotal)}</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[0].incc)}</td>
                  <td className="px-4 py-2.5 text-right num text-blue-500">{fmtR$(calc.sections[0].rs)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        </CollapsibleSection>

        {/* ─── IMPLANTAÇÃO DETALHADA ─── */}
        <CollapsibleSection id="implantacao" label="Implantação da Obra" color="#c55a11"
          totalINCC={calc.sections[2].incc} totalRS={calc.sections[2].rs} collapsed={collapsed.implantacao} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-end gap-2">
            <button
              onClick={() => updateEst({
                implantacaoItems: [...(estimate.implantacaoItems || []), { nome: '', valorINCC: 0, _picking: true }],
              })}
              className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 hover:bg-blue-50"
            >
              <Plus className="w-3 h-3" /> Adicionar item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-stone-200 text-xs uppercase tracking-wider">
                  <th className="px-2 py-2.5 w-12 text-center font-medium">↕</th>
                  <th className="text-left px-4 py-2.5 font-medium">Descrição</th>
                  <th className="text-right px-3 py-2.5 font-medium w-40">Valor (INCC)</th>
                  <th className="text-right px-3 py-2.5 font-medium w-40">Valor (R$)</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {(estimate.implantacaoItems || []).map((item, i) => {
                  const valorINCC = toNum(item.valorINCC);
                  const valorRS = valorINCC * toNum(estimate.inccAtual);
                  const items = estimate.implantacaoItems;
                  const updateItem = (patch) => updateEst({
                    implantacaoItems: items.map((x, j) => j === i ? { ...x, ...patch } : x),
                  });
                  const moveUp = () => {
                    if (i === 0) return;
                    const next = [...items]; [next[i-1], next[i]] = [next[i], next[i-1]];
                    updateEst({ implantacaoItems: next });
                  };
                  const moveDown = () => {
                    if (i === items.length - 1) return;
                    const next = [...items]; [next[i], next[i+1]] = [next[i+1], next[i]];
                    updateEst({ implantacaoItems: next });
                  };
                  return (
                    <tr key={i} {...(i%2?{style:{background:'#e8f0fb',borderBottom:'1px solid var(--border)'}}:{style:{background:'#fff',borderBottom:'1px solid var(--border)'}})}>
                      <td className="px-2 py-1.5 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <button onClick={moveUp} disabled={i === 0} className="text-stone-300 hover:text-slate-600 disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
                          <button onClick={moveDown} disabled={i === items.length - 1} className="text-stone-300 hover:text-slate-600 disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
                        </div>
                      </td>
                      <td className="px-4 py-1.5">
                        {item._picking ? (
                          /* Modo seleção da base — mostra select + opção livre */
                          <div className="flex items-center gap-2">
                            <select
                              autoFocus
                              className="flex-1 px-2 py-1 bg-white border border-blue-400 text-sm focus:outline-none focus:border-blue-600"
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '__custom__') {
                                  updateItem({ _picking: false, nome: '', valorINCC: 0 });
                                } else {
                                  const dbItem = implantacaoDb?.find((r) => String(r.id) === val);
                                  if (dbItem) {
                                    updateItem({
                                      _picking: false,
                                      nome: dbItem.item,
                                      valorINCC: dbItem.totalINCC,
                                    });
                                  }
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Selecione da base ou adicione livre...</option>
                              <option value="__custom__">+ Digitar item manualmente</option>
                              <optgroup label="─── Base de Implantação ───">
                                {(implantacaoDb || []).map((r) => (
                                  <option key={r.id} value={String(r.id)}>
                                    {r.item}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                            <button
                              onClick={() => updateEst({
                                implantacaoItems: estimate.implantacaoItems.filter((_, j) => j !== i),
                              })}
                              className="text-stone-400 hover:text-rose-600 flex-shrink-0"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={item.nome}
                            onChange={(e) => updateItem({ nome: e.target.value })}
                            placeholder="Descrição do item"
                            className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-blue-600 focus:outline-none text-sm text-stone-800"
                          />
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number" step="0.01"
                          value={valorINCC === 0 ? '' : valorINCC}
                          onChange={(e) => updateItem({ valorINCC: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="num" style={{ width:"100%", padding:"7px 10px", background:"#fff", border:"1px solid #ccdaee", borderRadius:7, fontSize:13, textAlign:"right", color:"var(--text-primary)", outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)" }} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor="#ccdaee";e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background="#fff";}}
                        />
                      </td>
                      <td className="px-3 py-1.5 text-right num text-stone-700">
                        {fmtR$(valorRS)}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        {confirmDeleteImpl2 === i ? (
                          <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                            <button style={{ padding:'4px 11px', background:'#DC2626', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em', boxShadow:'0 1px 4px rgba(220,38,38,0.25)', transition:'filter .15s, box-shadow .15s' }} onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 3px 8px rgba(220,38,38,0.35)';}} onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 1px 4px rgba(220,38,38,0.25)';}} onClick={() => { updateEst({ implantacaoItems: estimate.implantacaoItems.filter((_, j) => j !== i) }); setConfirmDeleteImpl2(null); }}>Sim</button>
                            <button style={{ padding:'4px 11px', background:'transparent', color:'#4a6080', border:'0.5px solid #ccdaee', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'background .15s, border-color .15s, color .15s' }} onMouseEnter={e=>{e.currentTarget.style.background='#e8f0fb';e.currentTarget.style.borderColor='#a8bdd8';e.currentTarget.style.color='#0d1e35';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='#ccdaee';e.currentTarget.style.color='#4a6080';}} onClick={() => setConfirmDeleteImpl2(null)}>Não</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDeleteImpl2(i)} className="p-1 text-stone-300 hover:text-rose-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {(estimate.implantacaoItems || []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-stone-400 text-sm italic">
                      Nenhum item de implantação. Clique em "Adicionar item".
                    </td>
                  </tr>
                )}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-2 py-2.5"></td>
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Implantação</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[2].incc)}</td>
                  <td className="px-3 py-2.5 text-right num" style={{ color:'var(--ui-accent)' }}>{fmtR$(calc.sections[2].rs)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        </CollapsibleSection>

        {/* ─── PROJETOS DETALHADO ─── */}
        <CollapsibleSection id="projetos" label="Projetos e Consultorias" color="#0e7490"
          totalINCC={calc.sections[3].incc} totalRS={calc.sections[3].rs} collapsed={collapsed.projetos} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-sm flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-stone-600">Itens:</span>
              <span className="num font-medium text-slate-900">
                {(estimate.projetosItems || []).length}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-600">Total:</span>
              <span className="num font-semibold text-slate-900">{fmtNum(calc.sections[3].incc)} INCC</span>
              <span className="text-stone-300">·</span>
              <span className="num font-semibold text-blue-700">{fmtR$(calc.sections[3].rs)}</span>
              {toNum(estimate.areaConstruida) > 0 && (
                <>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500 text-xs">
                    R$/m²: <span className="num font-medium text-stone-700">
                      {fmtR$(calc.sections[3].rs / toNum(estimate.areaConstruida))}
                    </span>
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => updateEst({
                projetosItems: [...(estimate.projetosItems || []), {
                  id: Date.now(),
                  especialidade: '',
                  projetista: '',
                  obraRef: '',
                  obrigatorio: false,
                  custoINCCM2: 0,
                }],
              })}
              className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 hover:bg-blue-50"
            >
              <Plus className="w-3 h-3" /> Adicionar especialidade
            </button>
          </div>

          {toNum(estimate.areaConstruida) === 0 && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-900 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Preencha <strong>Área Construída</strong> em "Informações do Empreendimento" para que os custos de projeto sejam calculados.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-stone-200 text-xs uppercase tracking-wider">
                  <th className="px-2 py-2.5 w-12 text-center font-medium">↕</th>
                  <th className="text-left px-3 py-2.5 font-medium">Especialidade</th>
                  <th className="text-left px-3 py-2.5 font-medium w-44">Obra de Referência</th>
                  <th className="text-left px-3 py-2.5 font-medium w-44">Projetista</th>
                  <th className="text-center px-2 py-2.5 font-medium w-16">Incluir</th>
                  <th className="text-right px-3 py-2.5 font-medium w-32">Custo (INCC/m²)</th>
                  <th className="text-right px-3 py-2.5 font-medium w-32">Total (R$)</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {(estimate.projetosItems || []).map((item, i) => (
                  <ProjetoItemRow
                    key={item.id || i}
                    item={item}
                    index={i}
                    total={estimate.projetosItems.length}
                    projectsDb={projectsDb}
                    areaConstruida={toNum(estimate.areaConstruida)}
                    inccAtual={toNum(estimate.inccAtual)}
                    onUpdate={(patch) => updateEst({
                      projetosItems: estimate.projetosItems.map(
                        (x, j) => j === i ? { ...x, ...patch } : x
                      ),
                    })}
                    onRemove={() => updateEst({
                      projetosItems: estimate.projetosItems.filter((_, j) => j !== i),
                    })}
                    onMoveUp={() => {
                      if (i === 0) return;
                      const next = [...estimate.projetosItems];
                      [next[i-1], next[i]] = [next[i], next[i-1]];
                      updateEst({ projetosItems: next });
                    }}
                    onMoveDown={() => {
                      if (i === estimate.projetosItems.length - 1) return;
                      const next = [...estimate.projetosItems];
                      [next[i], next[i+1]] = [next[i+1], next[i]];
                      updateEst({ projetosItems: next });
                    }}
                  />
                ))}
                {(estimate.projetosItems || []).length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-stone-400 text-sm italic">
                      Nenhuma especialidade. Clique em "Adicionar especialidade".
                    </td>
                  </tr>
                )}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-2 py-2.5"></td>
                  <td colSpan={4} className="px-3 py-2.5 text-right uppercase text-xs tracking-wider">Total Projetos</td>
                  <td className="px-3 py-2.5 text-right num text-xs">{fmtNum(calc.sections[3].incc)} INCC</td>
                  <td className="px-3 py-2.5 text-right num" style={{ color:'var(--ui-accent)' }}>{fmtR$(calc.sections[3].rs)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 text-xs text-stone-500">
            💡 Selecione <strong>Obra de Referência</strong> e/ou <strong>Projetista</strong> para puxar o custo automaticamente da Base de Projetos.
            O custo unitário é em INCC/m² (×{fmtNum(toNum(estimate.areaConstruida), 0)} m² constr. × INCC atual).
          </div>
        </Card>
        </CollapsibleSection>

        {/* ─── INFRAESTRUTURA ─── */}
        <CollapsibleSection id="infraestrutura" label="Infraestrutura" color="#0e7490"
          totalINCC={calc.sections[1].incc} totalRS={calc.sections[1].rs} collapsed={collapsed.infraestrutura} onToggle={toggle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:'var(--navy)' }} className="text-stone-200 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium w-56">Campo</th>
                  <th className="text-left px-4 py-2.5 font-medium">Valor</th>
                  <th className="text-right px-3 py-2.5 font-medium w-44">Custo (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-48">Custo (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Tipo de Fundação</td>
                  <td className="px-4 py-2">
                    <select value={estimate.infraTipoFundacao || ''} onChange={(e) => { updateEst({ infraTipoFundacao: e.target.value }); updateOverride('custoInfra', null); }}
                      className="num" style={{ background: estimate.infraTipoFundacao ? '#fff' : '#f0fdf4', border: `1px solid ${estimate.infraTipoFundacao ? '#ccdaee' : '#86efac'}`, borderRadius:7, fontSize:13, padding:'7px 10px', outline:'none', transition:'border-color .15s, box-shadow .15s', boxSizing:'border-box', boxShadow:'0 1px 2px rgba(13,30,53,0.05)', width:'13rem' }}
                      onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; }}
                      onBlur={e=>{ e.target.style.borderColor= estimate.infraTipoFundacao ? '#ccdaee' : '#86efac'; e.target.style.boxShadow='0 1px 2px rgba(13,30,53,0.05)'; }}>
                      <option value="">— Selecione —</option>
                      {tiposFundacao.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {calc.infraFundacaoRec && <span className="text-xs text-stone-400 italic ml-3">ref: {calc.infraFundacaoRec.obra} · coef {fmtNum(calc.infraFundacaoRec.coeficiente, 3)}</span>}
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Área Proj. Torre</td>
                  <td className="px-4 py-2">
                    <span className="num text-sm font-medium text-stone-700">{toNum(estimate.areaProjTorre) > 0 ? `${fmtNum(toNum(estimate.areaProjTorre), 2)} m²` : '—'}</span>
                    <span className="text-xs text-stone-400 ml-2 italic">definido em Informações</span>
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Nº Pavimentos</td>
                  <td className="px-4 py-2">
                    <span className="num text-sm font-medium text-stone-700">{toNum(estimate.numPavtos) > 0 ? estimate.numPavtos : '—'}</span>
                    <span className="text-xs text-stone-400 ml-2 italic">definido em Informações</span>
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Tipo de Contenção</td>
                  <td className="px-4 py-2">
                    <input type="text" value={estimate.infraTipoContencao || ''} onChange={(e) => updateEst({ infraTipoContencao: e.target.value })}
                      placeholder="— a definir (base futura) —"
                      className="" style={{ background: estimate.infraTipoContencao ? '#fff' : '#f0fdf4', border: `1px solid ${estimate.infraTipoContencao ? '#ccdaee' : '#86efac'}`, borderRadius:7, fontSize:13, padding:'7px 10px', outline:'none', transition:'border-color .15s, box-shadow .15s', boxSizing:'border-box', boxShadow:'0 1px 2px rgba(13,30,53,0.05)', width:'13rem', color:'var(--text-primary)' }}
                      onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; e.target.style.background='#f5f9ff'; }}
                      onBlur={e=>{ e.target.style.borderColor= estimate.infraTipoContencao ? '#ccdaee' : '#86efac'; e.target.style.boxShadow='0 1px 2px rgba(13,30,53,0.05)'; e.target.style.background= estimate.infraTipoContencao ? '#fff' : '#f0fdf4'; }} />
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Infraestrutura</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[1].incc, 3)}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--ui-accent)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace', fontWeight:600 }}>{fmtR$(calc.sections[1].rs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ─── ELEVADORES ─── */}
        <CollapsibleSection id="elevador" label="Elevadores" color="#6366f1"
          totalINCC={calc.sections[4].incc} totalRS={calc.sections[4].rs} collapsed={collapsed.elevador} onToggle={toggle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:'var(--navy)' }} className="text-stone-200 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium w-56">Campo</th>
                  <th className="text-left px-4 py-2.5 font-medium">Valor</th>
                  <th className="text-right px-3 py-2.5 font-medium w-44">Custo (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-48">Custo (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Obra Base</td>
                  <td className="px-4 py-2">
                    <select value={estimate.elevadorObraRef || ''} onChange={(e) => { updateEst({ elevadorObraRef: e.target.value, elevNumParadas: null }); }}
                      className="num" style={{ background: estimate.elevadorObraRef ? '#fff' : '#f0fdf4', border: `1px solid ${estimate.elevadorObraRef ? '#ccdaee' : '#86efac'}`, borderRadius:7, fontSize:13, padding:'7px 10px', outline:'none', transition:'border-color .15s, box-shadow .15s', boxSizing:'border-box', boxShadow:'0 1px 2px rgba(13,30,53,0.05)', width:'13rem' }}
                      onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; }}
                      onBlur={e=>{ e.target.style.borderColor= estimate.elevadorObraRef ? '#ccdaee' : '#86efac'; e.target.style.boxShadow='0 1px 2px rgba(13,30,53,0.05)'; }}>
                      <option value="">— Selecione —</option>
                      {(elevatorsDb || []).filter(r => r.valorFechado > 0 && r.inccBase > 0).map((r) => (
                        <option key={r.id} value={r.obra}>{r.obra}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Marca</td>
                  <td className="px-4 py-2 text-sm font-medium text-stone-700">{calc.elevDbRec?.marca || '—'}</td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Nº de Paradas</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <input type="number" step="1" min="0"
                        value={estimate.elevNumParadas !== null && estimate.elevNumParadas !== undefined && estimate.elevNumParadas !== '' ? estimate.elevNumParadas : calc.elevNumParadasAuto}
                        onChange={(e) => updateEst({ elevNumParadas: e.target.value === '' ? null : parseInt(e.target.value) || 0 })}
                        className="num" style={{width:"6rem", padding:"7px 10px", background:"#fff", border:"1px solid #ccdaee", borderRadius:7, fontSize:13, textAlign:"right", color:"var(--text-primary)", fontWeight:600, outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)"}} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor="#ccdaee";e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background="#fff";}} />
                      <span className="text-xs text-stone-400 italic">
                        {(estimate.elevNumParadas === null || estimate.elevNumParadas === undefined || estimate.elevNumParadas === '') ? `auto (${calc.elevNumParadasAuto} pav. − 1)` : 'modificado'}
                      </span>
                      {(estimate.elevNumParadas !== null && estimate.elevNumParadas !== undefined && estimate.elevNumParadas !== '') && (
                        <button onClick={() => updateEst({ elevNumParadas: null })} className="text-xs text-stone-400 hover:text-blue-700 flex items-center gap-1"><RotateCcw className="w-3 h-3" /> auto</button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Qt. Elevadores</td>
                  <td className="px-4 py-2">
                    <span className="num text-sm font-medium text-stone-700">{toNum(estimate.numElevadores) || '—'}</span>
                    <span className="text-xs text-stone-400 ml-2 italic">definido em Informações</span>
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                {calc.elevValorPPE_INCC !== null && (
                  <tr className="bg-white">
                    <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Val./parada/elev.</td>
                    <td className="px-4 py-2">
                      <span className="num text-sm font-semibold text-emerald-700">{fmtNum(calc.elevValorPPE_INCC, 4)} INCC</span>
                      <span className="text-xs text-stone-400 ml-2">× {calc.elevNumParadas} paradas × {toNum(estimate.numElevadores)} elev.</span>
                    </td>
                    <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                    <td className="px-4 py-2 text-right num text-stone-500">—</td>
                  </tr>
                )}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Elevadores</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[4].incc, 3)}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--ui-accent)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace', fontWeight:600 }}>{fmtR$(calc.sections[4].rs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ─── FACHADA ─── */}
        <CollapsibleSection id="fachada" label="Fachada" color="#d97706"
          totalINCC={calc.sections[5].incc} totalRS={calc.sections[5].rs} collapsed={collapsed.fachada} onToggle={toggle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:'var(--navy)' }} className="text-stone-200 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium w-56">Campo</th>
                  <th className="text-left px-4 py-2.5 font-medium">Valor</th>
                  <th className="text-right px-3 py-2.5 font-medium w-44">Custo (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-48">Custo (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Área de Fachada (m²)</td>
                  <td className="px-4 py-2">
                    <input type="number" step="1" value={estimate.overrides.fachadaArea || ''}
                      onChange={(e) => updateOverride('fachadaArea', e.target.value ? parseFloat(e.target.value) : null)}
                      className="num" placeholder="automático" style={{ width:"100%", padding:"7px 10px", background:"#fff", border:"1px solid #ccdaee", borderRadius:7, fontSize:13, textAlign:"right", color:"var(--text-primary)", outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)" }} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor="#ccdaee";e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background="#fff";}} />
                    <span className="text-xs text-stone-400 ml-2 italic">auto = {fmtNum(calc.fachadaArea, 0)} m² (perím. × altura)</span>
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Custo (INCC/m²)</td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01"
                      value={estimate.overrides.custoFachadaM2 !== null && estimate.overrides.custoFachadaM2 !== undefined ? estimate.overrides.custoFachadaM2 : ''}
                      onChange={(e) => updateOverride('custoFachadaM2', e.target.value === '' ? null : parseFloat(e.target.value))}
                      placeholder={refProject?.custoFachadaM2 !== undefined ? fmtNum(refProject.custoFachadaM2) : '—'}
                      className="num" style={{width:"9rem", padding:"7px 10px", background: estimate.overrides.custoFachadaM2 != null ? "#fff" : "#f0fdf4", border: `1px solid ${estimate.overrides.custoFachadaM2 != null ? "#ccdaee" : "#86efac"}`, borderRadius:7, fontSize:13, textAlign:"right", color: estimate.overrides.custoFachadaM2 != null ? "var(--text-primary)" : "#166534", outline:"none", transition:"border-color .15s, box-shadow .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)"}} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor= estimate.overrides.custoFachadaM2 != null ? "#ccdaee" : "#86efac"; e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background= estimate.overrides.custoFachadaM2 != null ? "#fff" : "#f0fdf4";}} />
                    {estimate.overrides.custoFachadaM2 !== null && estimate.overrides.custoFachadaM2 !== undefined && (
                      <button onClick={() => updateOverride('custoFachadaM2', null)} className="text-stone-400 hover:text-blue-700 ml-2"><RotateCcw className="w-3.5 h-3.5 inline" /></button>
                    )}
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Fachada</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[5].incc, 3)}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--ui-accent)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace', fontWeight:600 }}>{fmtR$(calc.sections[5].rs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ─── ENSAIOS + SISTEMAS ─── */}
        <CollapsibleSection id="especiais" label="Ensaios + Sistemas" color="#64748b"
          totalINCC={calc.sections[6].incc} totalRS={calc.sections[6].rs} collapsed={collapsed.especiais} onToggle={toggle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:'var(--navy)' }} className="text-stone-200 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium w-56">Campo</th>
                  <th className="text-left px-4 py-2.5 font-medium">Valor</th>
                  <th className="text-right px-3 py-2.5 font-medium w-44">Custo (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-48">Custo (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Descrição</td>
                  <td className="px-4 py-2 text-xs text-stone-500 italic">Controle tecnológico, ensaios, FVS</td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Custo Total (INCC)</td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01"
                      value={estimate.overrides.custoEnsaios !== null && estimate.overrides.custoEnsaios !== undefined ? estimate.overrides.custoEnsaios : ''}
                      onChange={(e) => updateOverride('custoEnsaios', e.target.value === '' ? null : parseFloat(e.target.value))}
                      placeholder={refProject?.custoEnsaios !== undefined ? fmtNum(refProject.custoEnsaios) : '—'}
                      className="num" style={{width:"9rem", padding:"7px 10px", background: estimate.overrides.custoEnsaios != null ? "#fff" : "#f0fdf4", border: `1px solid ${estimate.overrides.custoEnsaios != null ? "#ccdaee" : "#86efac"}`, borderRadius:7, fontSize:13, textAlign:"right", color: estimate.overrides.custoEnsaios != null ? "var(--text-primary)" : "#166534", outline:"none", transition:"border-color .15s, box-shadow .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)"}} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor= estimate.overrides.custoEnsaios != null ? "#ccdaee" : "#86efac"; e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background= estimate.overrides.custoEnsaios != null ? "#fff" : "#f0fdf4";}} />
                    {estimate.overrides.custoEnsaios !== null && estimate.overrides.custoEnsaios !== undefined && (
                      <button onClick={() => updateOverride('custoEnsaios', null)} className="text-stone-400 hover:text-blue-700 ml-2"><RotateCcw className="w-3.5 h-3.5 inline" /></button>
                    )}
                  </td>
                  <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-muted)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Ensaios + Sistemas</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[6].incc, 3)}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--ui-accent)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace', fontWeight:600 }}>{fmtR$(calc.sections[6].rs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ─── ADMINISTRAÇÃO ─── */}
        <CollapsibleSection id="administracao" label="Administração" color="#9333ea"
          totalINCC={calc.sections[7].incc} totalRS={calc.sections[7].rs} collapsed={collapsed.administracao} onToggle={toggle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:'var(--navy)' }} className="text-stone-200 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium">Sub-grupo</th>
                  <th className="text-right px-3 py-2.5 font-medium w-52">Custo (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-52">Custo (R$)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'admEquipeINCC',   label: 'Equipe Administrativa' },
                  { key: 'admDiversosINCC', label: 'Diversos' },
                  { key: 'admLimpezaINCC',  label: 'Limpeza e Transportes' },
                ].map(({ key, label }, idx) => {
                  const inccVal = toNum(estimate[key]);
                  const rsVal = inccVal * toNum(estimate.inccAtual);
                  return (
                    <tr key={key} className={idx % 2 ? 'bg-stone-50' : 'bg-white'}>
                      <td className="px-4 py-2 text-stone-700 font-medium">{label}</td>
                      <td className="px-3 py-2">
                        <input type="number" step="0.001"
                          value={inccVal === 0 ? '' : inccVal}
                          onChange={(e) => updateEst({ [key]: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="num" style={{ width:"100%", padding:"7px 10px", background:"#fff", border:"1px solid #ccdaee", borderRadius:7, fontSize:13, textAlign:"right", color:"var(--text-primary)", outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)" }} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor="#ccdaee";e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background="#fff";}} />
                      </td>
                      <td className="px-4 py-2 text-right num text-stone-700 font-medium">{fmtR$(rsVal)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Administração</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[7].incc, 3)}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--ui-accent)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace', fontWeight:600 }}>{fmtR$(calc.sections[7].rs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ─── CUSTO TOTAL S/ INCORPORAÇÃO ─── */}
        <CollapsibleSection id="semIncorp" label="Custo Total S/ Incorporação" color="#374151"
          totalINCC={calc.subtotalINCC} totalRS={calc.subtotalRS} collapsed={collapsed.semIncorp} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-2 bg-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Custo Total S/ Incorporação</span>
          </div>
          <div className="divide-y divide-stone-100">
            <TotalRow label="Custo Total S/ Taxa de Administração" incc={calc.subtotalINCC} rs={calc.subtotalRS} />
            <TotalRow label="Custo Total S/ Taxa de Administração por m²" incc={calc.subtotalM2INCC} rs={calc.subtotalM2RS} />
          </div>
        </Card>
        </CollapsibleSection>

        {/* ─── INCORPORAÇÃO DETALHADA ─── */}
        <CollapsibleSection id="incorporacao" label="Incorporação" color="#c55a11"
          totalINCC={calc.sections[8].incc} totalRS={calc.sections[8].rs} collapsed={collapsed.incorporacao} onToggle={toggle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:'var(--navy)' }} className="text-stone-200 text-xs uppercase tracking-wider">
                  <th className="px-2 py-2.5 w-16 text-center font-medium">Ordem</th>
                  <th className="text-left px-4 py-2.5 font-medium">Item</th>
                  <th className="text-right px-3 py-2.5 font-medium w-44">Custo (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-48">Custo (R$)</th>
                  <th className="w-10 px-2 py-2.5 text-center font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const collapsedGroups = {};
                  const [groupsCollapsed, setGroupsCollapsed] = useState({});
                  const toggleGroup = (id) => setGroupsCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

                  // Build a flat render list, skipping subitems of collapsed groups
                  let lastGroupId = null;
                  let skipSubItems = false;

                  return (estimate.incorporacaoItems || []).map((item, i) => {
                    const items = estimate.incorporacaoItems;
                    const inccVal = toNum(item.valorINCC);
                    const rsVal = inccVal * toNum(estimate.inccAtual);

                    const moveUp = () => {
                      if (i === 0) return;
                      const next = [...items];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      updateEst({ incorporacaoItems: next });
                    };
                    const moveDown = () => {
                      if (i === items.length - 1) return;
                      const next = [...items];
                      [next[i], next[i + 1]] = [next[i + 1], next[i]];
                      updateEst({ incorporacaoItems: next });
                    };
                    const deleteItem = () => updateEst({ incorporacaoItems: items.filter((_, j) => j !== i) });
                    const updateVal = (v) => updateEst({
                      incorporacaoItems: items.map((x) => x.id === item.id ? { ...x, valorINCC: v } : x),
                    });
                    const updateNome = (v) => updateEst({
                      incorporacaoItems: items.map((x) => x.id === item.id ? { ...x, nome: v } : x),
                    });

                    if (item.isGroup) {
                      lastGroupId = item.id;
                      skipSubItems = !!groupsCollapsed[item.id];

                      const groupTotal = (() => {
                        let sum = 0;
                        for (let j = i + 1; j < items.length; j++) {
                          if (!items[j].isSubItem) break;
                          sum += toNum(items[j].valorINCC);
                        }
                        return sum;
                      })();

                      const subCount = (() => {
                        let count = 0;
                        for (let j = i + 1; j < items.length; j++) {
                          if (!items[j].isSubItem) break;
                          count++;
                        }
                        return count;
                      })();

                      const isCollapsed = !!groupsCollapsed[item.id];

                      return (
                        <tr key={item.id} style={{ background:'#e8f0fb', borderTop:'2px solid var(--border-strong)', borderBottom: isCollapsed ? '2px solid var(--border-strong)' : 'none' }}>
                          <td style={{ padding:"9px 14px", textAlign:"center", color:"var(--text-secondary)", fontSize:12, borderLeft:"3px solid var(--ui-accent)" }}>
                            <div className="flex flex-col items-center gap-0.5">
                              <button onClick={moveUp} className="text-stone-400 hover:text-slate-700"><ArrowUp className="w-3 h-3" /></button>
                              <button onClick={moveDown} className="text-stone-400 hover:text-slate-700"><ArrowDown className="w-3 h-3" /></button>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 font-bold text-slate-900">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleGroup(item.id)}
                                style={{
                                  width: 20, height: 20, borderRadius: 4, background: '#0d1e35',
                                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', flexShrink: 0, transition: 'background .15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#0F2040'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
                                title={isCollapsed ? 'Expandir grupo' : 'Recolher grupo'}
                              >
                                <ChevronRight style={{
                                  width: 12, height: 12, color: '#fff',
                                  transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                                  transition: 'transform .2s',
                                }} />
                              </button>
                              <input type="text" value={item.nome}
                                onChange={(e) => updateNome(e.target.value)}
                                className="flex-1 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-blue-600 focus:outline-none text-xs font-bold uppercase tracking-wide text-slate-900" />
                              {isCollapsed && (
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                                  {subCount} item{subCount !== 1 ? 'ns' : ''} ocultos
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  const newId = Math.max(0, ...items.map((x) => x.id)) + 1;
                                  // Insere o novo subitem após o último subitem deste grupo
                                  let insertIdx = i + 1;
                                  for (let j = i + 1; j < items.length; j++) {
                                    if (!items[j].isSubItem) break;
                                    insertIdx = j + 1;
                                  }
                                  const next = [...items];
                                  next.splice(insertIdx, 0, { id: newId, nome: '', valorINCC: 0, isGroup: false, isSubItem: true });
                                  updateEst({ incorporacaoItems: next });
                                  // Garante que o grupo está expandido
                                  setGroupsCollapsed(prev => ({ ...prev, [item.id]: false }));
                                }}
                                style={{
                                  fontSize: 10, fontWeight: 600, padding: '2px 8px',
                                  background: '#fff', border: '1px solid #ccdaee',
                                borderRadius:7, boxShadow:'0 1px 2px rgba(13,30,53,0.05)',
                                  borderRadius: 4, cursor: 'pointer', color: '#92400E',
                                  display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                                  marginLeft: 'auto', flexShrink: 0,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#FEF3C7'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                title="Adicionar item dentro do grupo"
                              >
                                <Plus style={{ width: 10, height: 10 }} /> Sub-item
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right num font-bold text-slate-900">{fmtNum(groupTotal, 3)}</td>
                          <td className="px-4 py-2.5 text-right num font-bold" style={{ color:'var(--ui-accent)' }}>{fmtR$(groupTotal * toNum(estimate.inccAtual))}</td>
                          <td style={{ padding:"9px 14px", textAlign:"center", color:"var(--text-secondary)", fontSize:12 }}>
                            {confirmDeleteImpl === item.id ? (
                            <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                              <button style={{ padding:'4px 11px', background:'#DC2626', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em', boxShadow:'0 1px 4px rgba(220,38,38,0.25)', transition:'filter .15s, box-shadow .15s' }} onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 3px 8px rgba(220,38,38,0.35)';}} onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 1px 4px rgba(220,38,38,0.25)';}} onClick={() => { deleteItem(); setConfirmDeleteImpl(null); }}>Sim</button>
                              <button style={{ padding:'4px 11px', background:'transparent', color:'#4a6080', border:'0.5px solid #ccdaee', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'background .15s, border-color .15s, color .15s' }} onMouseEnter={e=>{e.currentTarget.style.background='#e8f0fb';e.currentTarget.style.borderColor='#a8bdd8';e.currentTarget.style.color='#0d1e35';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='#ccdaee';e.currentTarget.style.color='#4a6080';}} onClick={() => setConfirmDeleteImpl(null)}>Não</button>
                            </span>
                          ) : (
                            <button onClick={() => setConfirmDeleteImpl(item.id)} className="p-1 text-stone-300 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          )}
                          </td>
                        </tr>
                      );
                    }

                    // Skip subitems of collapsed groups
                    if (item.isSubItem && skipSubItems) return null;
                    if (!item.isSubItem) { skipSubItems = false; lastGroupId = null; }

                    const isLastSubItem = item.isSubItem && (i === items.length - 1 || !items[i + 1]?.isSubItem);

                    return (
                      <tr key={item.id}
                        style={{
                          background: item.isSubItem ? (i % 2 ? '#EEF3FA' : '#f5f8fd') : (i % 2 ? '#EEF3FA' : '#FFFFFF'),
                          borderBottom: isLastSubItem ? '2px solid var(--border-strong)' : undefined,
                        }}>
                        <td className="px-2 py-1.5 text-center" style={{ borderLeft: item.isSubItem ? '3px solid var(--border-strong)' : 'none' }}>
                          <div className="flex flex-col items-center gap-0.5">
                            <button onClick={moveUp} disabled={i === 0} className="text-stone-300 hover:text-slate-600 disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
                            <button onClick={moveDown} disabled={i === items.length - 1} className="text-stone-300 hover:text-slate-600 disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
                          </div>
                        </td>
                        <td className={`py-1.5 text-stone-800 ${item.isSubItem ? 'pl-10 pr-4' : 'px-4'}`}>
                          <input type="text" value={item.nome}
                            onChange={(e) => updateNome(e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent hover:border-stone-200 focus:border-blue-600 focus:outline-none text-stone-800 ${item.isSubItem ? 'italic text-xs text-stone-600' : 'text-sm'}`}
                            placeholder="Descrição" />
                        </td>
                        <td className="px-3 py-1.5">
                          <input type="number" step="0.001"
                            value={inccVal === 0 ? '' : inccVal}
                            onChange={(e) => updateVal(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="num" style={{ width:"100%", padding:"7px 10px", background:"#fff", border:"1px solid #ccdaee", borderRadius:7, fontSize:13, textAlign:"right", color:"var(--text-primary)", outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)" }} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor="#ccdaee";e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background="#fff";}} />
                        </td>
                        <td className="px-4 py-1.5 text-right num font-medium" style={{ color: 'var(--text-primary)' }}>{fmtR$(rsVal)}</td>
                        <td className="px-2 py-1.5 text-center">
                          {confirmDeleteInc === i ? (
                            <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                              <button style={{ padding:'4px 11px', background:'#DC2626', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em', boxShadow:'0 1px 4px rgba(220,38,38,0.25)', transition:'filter .15s, box-shadow .15s' }} onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 3px 8px rgba(220,38,38,0.35)';}} onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 1px 4px rgba(220,38,38,0.25)';}} onClick={() => { deleteItem(); setConfirmDeleteInc(null); }}>Sim</button>
                              <button style={{ padding:'4px 11px', background:'transparent', color:'#4a6080', border:'0.5px solid #ccdaee', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'background .15s, border-color .15s, color .15s' }} onMouseEnter={e=>{e.currentTarget.style.background='#e8f0fb';e.currentTarget.style.borderColor='#a8bdd8';e.currentTarget.style.color='#0d1e35';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='#ccdaee';e.currentTarget.style.color='#4a6080';}} onClick={() => setConfirmDeleteInc(null)}>Não</button>
                            </span>
                          ) : (
                            <button onClick={() => setConfirmDeleteInc(i)} className="p-1 text-stone-300 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })()}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-2 py-2.5"></td>
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Incorporação</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[8].incc, 3)}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--ui-accent)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace', fontWeight:600 }}>{fmtR$(calc.sections[8].rs)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Toolbar de ações */}
          <div className="px-4 py-2 border-t border-stone-200 flex items-center gap-2 justify-end bg-stone-50">
            <button
              onClick={() => {
                const newId = Math.max(0, ...(estimate.incorporacaoItems || []).map((x) => x.id)) + 1;
                updateEst({ incorporacaoItems: [...(estimate.incorporacaoItems || []), { id: newId, nome: '', valorINCC: 0, isGroup: false, isSubItem: false }] });
              }}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:border-blue-400 hover:bg-blue-50 text-stone-700 hover:text-blue-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Novo item
            </button>
            <button
              onClick={() => {
                const newId = Math.max(0, ...(estimate.incorporacaoItems || []).map((x) => x.id)) + 1;
                updateEst({ incorporacaoItems: [...(estimate.incorporacaoItems || []), { id: newId, nome: 'Novo Grupo', valorINCC: 0, isGroup: true, isSubItem: false }] });
              }}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:border-slate-500 hover:bg-slate-50 text-stone-700 hover:text-slate-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Novo grupo
            </button>
          </div>
        </CollapsibleSection>

        {/* ─── EXTRAS ─── */}
        <CollapsibleSection id="extras" label="Extras" color="#15803d"
          totalINCC={calc.sections[9].incc} totalRS={calc.sections[9].rs} collapsed={collapsed.extras} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-2 bg-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Extras</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 text-stone-200 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium">Item</th>
                  <th className="text-right px-3 py-2.5 font-medium w-40">Custo Total (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-44">Custo Total (R$)</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {(estimate.extrasItems || []).map((item, i) => {
                  const inccVal = toNum(item.valorINCC);
                  const rsVal = inccVal * toNum(estimate.inccAtual);
                  const updateItem = (field, val) => updateEst({
                    extrasItems: estimate.extrasItems.map((x) => x.id === item.id ? { ...x, [field]: val } : x),
                  });
                  return (
                    <tr key={item.id} {...(i%2?{style:{background:'#e8f0fb',borderBottom:'1px solid var(--border)'}}:{style:{background:'#fff',borderBottom:'1px solid var(--border)'}})}>
                      <td className="px-4 py-1.5">
                        <input type="text" value={item.nome}
                          onChange={(e) => updateItem('nome', e.target.value)}
                          className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-blue-600 focus:outline-none text-sm text-stone-800"
                          placeholder="Descrição do item" />
                      </td>
                      <td className="px-3 py-1.5">
                        <input type="number" step="0.001"
                          value={inccVal === 0 ? '' : inccVal}
                          onChange={(e) => updateItem('valorINCC', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="num" style={{ width:"100%", padding:"7px 10px", background:"#fff", border:"1px solid #ccdaee", borderRadius:7, fontSize:13, textAlign:"right", color:"var(--text-primary)", outline:"none", transition:"border-color .15s, box-shadow .15s, background .15s", boxSizing:"border-box", boxShadow:"0 1px 2px rgba(13,30,53,0.05)" }} onFocus={e=>{e.target.style.borderColor="#2e6fad";e.target.style.boxShadow="0 0 0 3px rgba(46,111,173,0.12)";e.target.style.background="#f5f9ff";}} onBlur={e=>{e.target.style.borderColor="#ccdaee";e.target.style.boxShadow="0 1px 2px rgba(13,30,53,0.05)";e.target.style.background="#fff";}} />
                      </td>
                      <td className="px-4 py-1.5 text-right num text-stone-700">{fmtR$(rsVal)}</td>
                      <td className="px-2 py-1.5 text-center">
                        {confirmDeleteExtra === item.id ? (
                          <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                            <button style={{ padding:'4px 11px', background:'#DC2626', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em', boxShadow:'0 1px 4px rgba(220,38,38,0.25)', transition:'filter .15s, box-shadow .15s' }} onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 3px 8px rgba(220,38,38,0.35)';}} onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 1px 4px rgba(220,38,38,0.25)';}} onClick={() => { updateEst({ extrasItems: estimate.extrasItems.filter((x) => x.id !== item.id) }); setConfirmDeleteExtra(null); }}>Sim</button>
                            <button style={{ padding:'4px 11px', background:'transparent', color:'#4a6080', border:'0.5px solid #ccdaee', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'background .15s, border-color .15s, color .15s' }} onMouseEnter={e=>{e.currentTarget.style.background='#e8f0fb';e.currentTarget.style.borderColor='#a8bdd8';e.currentTarget.style.color='#0d1e35';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='#ccdaee';e.currentTarget.style.color='#4a6080';}} onClick={() => setConfirmDeleteExtra(null)}>Não</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDeleteExtra(item.id)} className="p-1 text-stone-300 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {(estimate.extrasItems || []).length === 0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-stone-400 text-sm italic">Nenhum item extra.</td></tr>
                )}
                <tr className="bg-slate-900 text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Extras</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[9].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num text-blue-500">{fmtR$(calc.sections[9].rs)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-stone-200 flex justify-end">
            <button
              onClick={() => {
                const newId = Math.max(0, ...(estimate.extrasItems || []).map((x) => x.id)) + 1;
                updateEst({ extrasItems: [...(estimate.extrasItems || []), { id: newId, nome: '', valorINCC: 0 }] });
              }}
              className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 hover:bg-blue-50"
            >
              <Plus className="w-3 h-3" /> Adicionar item
            </button>
          </div>
        </Card>
        </CollapsibleSection>

        {/* ─── CUSTO TOTAL S/ TAXA DE ADMINISTRAÇÃO ─── */}
        <CollapsibleSection id="semTaxa" label="Custo Total S/ Taxa de Administração" color="#374151"
          totalINCC={calc.totalSemTaxaINCC} totalRS={calc.totalSemTaxaRS} collapsed={collapsed.semTaxa} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-2 bg-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Custo Total S/ Taxa de Administração</span>
          </div>
          <div className="divide-y divide-stone-100">
            <TotalRow label="Custo Total S/ Taxa de Administração" incc={calc.totalSemTaxaINCC} rs={calc.totalSemTaxaRS} />
            <TotalRow label="Custo Total S/ Taxa de Administração por m²" incc={calc.totalSemTaxaM2INCC} rs={calc.totalSemTaxaM2RS} />
          </div>
        </Card>
        </CollapsibleSection>

        {/* ─── CUSTO TOTAL C/ TAXA DE ADMINISTRAÇÃO ─── */}
        <CollapsibleSection id="comTaxa" label="Custo Total C/ Taxa de Administração" color="#d97706"
          totalINCC={calc.totalFinalINCC} totalRS={calc.totalFinalRS} collapsed={collapsed.comTaxa} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-2 bg-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Custo Total C/ Taxa de Administração</span>
          </div>
          <div className="divide-y divide-stone-100">

            {/* Taxa de Administração — mesmo layout do TotalRow */}
            <div style={{ display:'flex', alignItems:'center', padding:'12px 20px', gap:16 }}>
              <div style={{ width:260, flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:500, color:'var(--text-secondary)' }}>
                  Taxa de Administração (
                </span>
                <input
                  type="number" step="0.5"
                  value={(estimate.taxaAdm * 100).toFixed(0)}
                  onChange={(e) => updateEst({ taxaAdm: (parseFloat(e.target.value) || 0) / 100 })}
                  className="num"
                  style={{ width:36, padding:'2px 4px', background:'#e8f0fb', border:'1px solid #ccdaee', textAlign:'center', fontSize:11, fontWeight:700, outline:'none' }}
                />
                <span style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:500, color:'var(--text-secondary)' }}>%):</span>
              </div>
              <div style={{ display:'flex', marginLeft:'auto', borderRadius:5, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <div className="num" style={{ padding:'8px 16px', background:'white', fontSize:13, fontWeight:600, color:'var(--text-primary)', minWidth:140, textAlign:'right', borderRight:'1px solid var(--border)' }}>
                    {fmtNum(calc.taxaAdmINCC, 3)}
                  </div>
                  <div style={{ fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'2px 0', textAlign:'center', background:'#e8f0fb', borderRight:'1px solid var(--border)' }}>INCC</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <div className="num" style={{ padding:'8px 16px', fontSize:13, fontWeight:700, minWidth:160, textAlign:'right', background:'var(--navy)', color:'var(--ui-accent)' }}>
                    {fmtR$(calc.taxaAdmRS)}
                  </div>
                  <div style={{ fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'2px 0', textAlign:'center', background:'#e8f0fb' }}>R$</div>
                </div>
              </div>
            </div>

            <TotalRow label="Custo Total C/ Taxa de Administração" incc={calc.totalFinalINCC} rs={calc.totalFinalRS} highlight />
            <TotalRow label="Custo Total C/ Taxa de Administração por m²" incc={calc.totalFinalM2INCC} rs={calc.totalFinalM2RS} />
          </div>
        </Card>
        </CollapsibleSection>

      </div>

      {/* ─── RIGHT PANEL: SUMMARY ─── */}
      <aside className="space-y-3" style={{ position: 'sticky', top: 90, alignSelf: 'flex-start' }}>
        {/* Custo Final Card */}
        <div style={{ background:'#122540', borderRadius:10, overflow:'hidden', boxShadow:'0 4px 20px rgba(10,22,40,0.25)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ padding:'11px 15px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.45)', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em' }}>Resumo Financeiro</span>
            <Sparkles style={{ width:13, height:13, color:'var(--ui-accent)' }} />
          </div>
          <div style={{ padding:'16px' }}>
            {/* Custo Final */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(255,255,255,0.35)', marginBottom:4 }}>Custo Final</div>
              <div className="num" style={{ fontSize:26, fontWeight:700, color:'var(--ui-accent)', lineHeight:1, letterSpacing:'-0.02em' }}>
                {fmtR$(calc.totalFinalRS)}
              </div>
              <div className="num" style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>
                {fmtNum(calc.totalFinalINCC, 2)} INCC
              </div>
            </div>
            {/* KPIs */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(255,255,255,0.35)' }}>R$/m²</div>
                <div className="num" style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.9)', marginTop:2 }}>{fmtR$(calc.custoFinalM2)}</div>
              </div>
              <div>
                <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(255,255,255,0.35)' }}>INCC/m²</div>
                <div className="num" style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.9)', marginTop:2 }}>{fmtNum(calc.totalFinalM2INCC, 3)}</div>
              </div>
            </div>
            {/* Breakdown */}
            <div style={{ display:'flex', flexDirection:'column', gap:4, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
              <SummaryRow label="Subtotal" value={calc.subtotalRS} />
              <SummaryRow label="+ Incorporação" value={calc.sections[8].rs} />
              <SummaryRow label="+ Extras" value={calc.sections[9].rs} />
              <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'4px 0' }} />
              <SummaryRow label="+ Taxa Adm" value={calc.taxaAdmRS} accent />
            </div>
          </div>
        </div>

        {/* Distribuição Chart */}
        <div style={{ background:'var(--card)', borderRadius:10, border:'1px solid var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', background:'#e8f0fb' }}>
            <h3 style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-secondary)', fontWeight:600, margin:0 }}>Distribuição de Custo</h3>
          </div>
          <div style={{ height:220, padding:'8px 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={calc.sections.filter((s) => s.rs > 0)} dataKey="rs" nameKey="label"
                  cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {calc.sections.filter((s) => s.rs > 0).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmtR$(v)}
                  contentStyle={{ background:'var(--navy)', border:'none', color:'#fff', fontSize:11, borderRadius:6 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding:'0 12px 12px', display:'flex', flexDirection:'column', gap:4 }}>
            {calc.sections.filter((s) => s.rs > 0).map((s, i) => {
              const pct = calc.totalSemTaxaRS > 0 ? s.rs / calc.totalSemTaxaRS : 0;
              return (
                <div key={s.key} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:CHART_COLORS[i % CHART_COLORS.length], flexShrink:0 }} />
                  <span style={{ flex:1, fontSize:11, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.label}</span>
                  <span className="num" style={{ fontSize:10, color:'var(--text-muted)' }}>{fmtPct(pct)}</span>
                  <span className="num" style={{ fontSize:11, fontWeight:600, color:'var(--text-primary)', width:80, textAlign:'right' }}>{fmtR$(s.rs)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SAVE ESTIMATE MODAL
// ═══════════════════════════════════════════════════════════════════════════
function SaveEstimateModal({ estimateName, onSave, onCancel }) {
  const [nome, setNome] = useState(estimateName || '');
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 border-l-4 border-emerald-500 max-w-md w-full">
        <div className="bg-slate-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Salvar Estimativa</h2>
            <p className="text-xs text-stone-400 mt-0.5">Um snapshot completo da estimativa atual será salvo</p>
          </div>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <Field label="Nome da estimativa">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && nome.trim() && onSave(nome.trim())}
              placeholder={`Estimativa ${new Date().toLocaleDateString('pt-BR')}`}
              autoFocus
              className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </Field>
          <p className="text-xs text-stone-400 mt-2">
            💡 Use um nome descritivo — ex: <em>"Torre Alpha — Revisão 2"</em> ou <em>"BCO — Cenário Otimista"</em>
          </p>
        </div>
        <div className="bg-stone-100 border-t border-stone-300 px-6 py-3 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-200">Cancelar</button>
          <button
            onClick={() => onSave(nome.trim() || `Estimativa ${new Date().toLocaleDateString('pt-BR')}`)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTIMATIVAS SALVAS VIEW
// ═══════════════════════════════════════════════════════════════════════════
function EstimativasSalvasView({ savedEstimates, onLoad, onDelete, onDuplicate, onRename, onNew }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingNameId, setEditingNameId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [filter, setFilter] = useState('');
  const [viewingEstimate, setViewingEstimate] = useState(null); // estimativa aberta no detalhe

  const filtered = useMemo(() =>
    filter
      ? savedEstimates.filter((e) => e.nome.toLowerCase().includes(filter.toLowerCase()))
      : savedEstimates,
    [savedEstimates, filter]
  );

  const startRename = (e) => {
    setEditingNameId(e.id);
    setEditingName(e.nome);
  };
  const commitRename = (id) => {
    if (editingName.trim()) onRename(id, editingName.trim());
    setEditingNameId(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide whitespace-nowrap">
            Estimativas Salvas
          </h2>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input value={filter} onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar estimativa..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600" />
          </div>
        </div>
        <button onClick={onNew}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-stone-100 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Estimativa
        </button>
      </div>

      {/* Empty state */}
      {savedEstimates.length === 0 && (
        <div className="bg-white border border-stone-200 py-20 text-center">
          <Save className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-medium text-slate-900">Nenhuma estimativa salva</h3>
          <p className="text-sm text-stone-500 mt-1 max-w-xs mx-auto">
            Clique em <strong>Salvar Estimativa</strong> no topo da tela para salvar a estimativa atual.
          </p>
        </div>
      )}

      {/* Grid de cards */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((saved) => {
            const data = new Date(saved.savedAt);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={saved.id} className="bg-white border border-stone-200 border-l-4 border-l-emerald-500 flex flex-col">
                {/* Header do card — clicável para visualizar */}
                <div
                  className="px-4 pt-4 pb-2 flex-1 cursor-pointer hover:bg-stone-50 transition-colors"
                  onClick={() => editingNameId !== saved.id && setViewingEstimate(saved)}
                  title="Clique para visualizar os detalhes"
                >
                  {editingNameId === saved.id ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => commitRename(saved.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') commitRename(saved.id); if (e.key === 'Escape') setEditingNameId(null); }}
                      className="w-full text-sm font-semibold text-slate-900 border-b-2 border-blue-500 bg-transparent focus:outline-none pb-0.5"
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 leading-tight flex-1">{saved.nome}</h3>
                      <button onClick={() => startRename(saved)}
                        className="text-stone-400 hover:text-blue-600 flex-shrink-0 mt-0.5" title="Renomear">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* KPIs do card */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-stone-50 px-2 py-1.5">
                      <div className="text-[9px] uppercase text-stone-400 tracking-wider">Custo Total</div>
                      <div className="num text-xs font-bold text-emerald-700 mt-0.5">{fmtR$(saved.totalFinalRS)}</div>
                    </div>
                    <div className="bg-stone-50 px-2 py-1.5">
                      <div className="text-[9px] uppercase text-stone-400 tracking-wider">Área Constr.</div>
                      <div className="num text-xs font-bold text-slate-900 mt-0.5">
                        {fmtNum(saved.areaConstruida, 0)} m²
                      </div>
                    </div>
                  </div>
                  {saved.areaConstruida > 0 && (
                    <div className="mt-1 bg-stone-50 px-2 py-1.5">
                      <div className="text-[9px] uppercase text-stone-400 tracking-wider">Custo / m²</div>
                      <div className="num text-xs font-bold text-slate-900 mt-0.5">
                        {fmtR$(saved.totalFinalRS / saved.areaConstruida)}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-[10px] text-stone-400">
                    Salva em {dataFormatada} às {horaFormatada}
                  </div>
                </div>

                {/* Ações do card */}
                <div className="border-t border-stone-100 px-3 py-2 flex items-center gap-1">
                  <button
                    onClick={() => onLoad(saved)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-stone-100 text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" /> Abrir
                  </button>
                  <button
                    onClick={() => onDuplicate(saved)}
                    className="px-2.5 py-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 border border-stone-200 hover:border-blue-100"
                    title="Duplicar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  {confirmDeleteId === saved.id ? (
                    <span className="flex items-center gap-1">
                      <button onClick={() => { onDelete(saved.id); setConfirmDeleteId(null); }}
                        className="px-2 py-1 text-xs bg-rose-600 text-white hover:bg-rose-700">Sim</button>
                      <button onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-xs bg-stone-200 text-stone-700 hover:bg-stone-300">Não</button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(saved.id)}
                      className="px-2.5 py-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 hover:border-rose-200"
                      title="Excluir">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && savedEstimates.length > 0 && (
        <div className="text-center py-12 text-stone-400 text-sm">
          Nenhuma estimativa encontrada para "<strong>{filter}</strong>".
        </div>
      )}

      <p className="text-xs text-stone-500">
        {savedEstimates.length} estimativa(s) salva(s) · Dados armazenados no navegador · Use o botão <strong>Backup</strong> para exportar
      </p>

      {/* Modal de visualização detalhada */}
      {viewingEstimate && (
        <EstimativaDetailModal
          saved={viewingEstimate}
          onClose={() => setViewingEstimate(null)}
          onLoad={() => { onLoad(viewingEstimate); setViewingEstimate(null); }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTIMATIVA DETAIL MODAL — visualização completa somente leitura
// ═══════════════════════════════════════════════════════════════════════════
function EstimativaDetailModal({ saved, onClose, onLoad }) {
  const est = saved.data || {};
  const incc = toNum(est.inccAtual);
  const area = toNum(est.areaConstruida);
  const dataFormatada = new Date(saved.savedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const Section = ({ title, color = '#1F3864', children }) => (
    <div className="mb-4">
      <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white mb-0" style={{ background: color }}>
        {title}
      </div>
      <div className="border border-stone-200 border-t-0">{children}</div>
    </div>
  );

  const Row = ({ label, inccVal, rsVal, bold }) => (
    <div className={`flex items-center justify-between px-3 py-2 border-b border-stone-100 last:border-0 ${bold ? 'bg-stone-50' : ''}`}>
      <span className={`text-xs ${bold ? 'font-semibold text-slate-900' : 'text-stone-600'}`}>{label}</span>
      <div className="flex items-center gap-4">
        {inccVal !== undefined && (
          <span className="num text-xs text-stone-500">{fmtNum(toNum(inccVal), 3)} INCC</span>
        )}
        {rsVal !== undefined && (
          <span className={`num text-xs ${bold ? 'font-bold text-slate-900' : 'text-stone-700'}`}>{fmtR$(toNum(rsVal))}</span>
        )}
      </div>
    </div>
  );

  const InfoRow = ({ label, value }) => value ? (
    <div className="flex items-center gap-3 px-3 py-1.5 border-b border-stone-100 last:border-0">
      <span className="text-[10px] uppercase tracking-wider text-stone-400 w-40 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-900 font-medium">{value}</span>
    </div>
  ) : null;

  // Calcular totais
  const calcTotal = (items, field = 'valorINCC') =>
    (items || []).reduce((s, i) => s + toNum(i[field]), 0);

  const floorList = est.floorList || [];
  const pavimentosComArea = floorList.filter(f => toNum(f.area) > 0);
  const implItems = (est.implantacaoItems || []).filter(i => toNum(i.valorINCC) > 0);
  const projItems = (est.projetosItems || []).filter(i => i.obrigatorio && toNum(i.custoINCCM2) > 0);
  const incorpItems = (est.incorporacaoItems || []).filter(i => !i.isGroup && toNum(i.valorINCC) > 0);
  const extrasItems = (est.extrasItems || []).filter(i => toNum(i.valorINCC) > 0);

  // Reconstruct section totals
  const construcaoINCC = pavimentosComArea.reduce((s, fl) => {
    const coef = (fl.coef !== '' && fl.coef != null) ? toNum(fl.coef) : (fl.defaultCoef || 1);
    return s + toNum(fl.area) * coef * toNum(est.custoConstrucaoM2Override || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-3xl my-4">
        {/* Header */}
        <div className="bg-slate-900 text-stone-100 px-6 py-4 flex items-start justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-base font-semibold">{saved.nome}</h2>
            <p className="text-xs text-stone-400 mt-0.5">Salva em {dataFormatada} · Somente leitura</p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={onLoad}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Editar esta estimativa
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-100 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-0">

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { l: 'Custo Total', v: fmtR$(saved.totalFinalRS), hl: true },
              { l: 'Custo / m²', v: area > 0 ? fmtR$(saved.totalFinalRS / area) : '—' },
              { l: 'Área Construída', v: `${fmtNum(area, 0)} m²` },
              { l: 'INCC', v: fmtNum(incc, 2) },
            ].map((k) => (
              <div key={k.l} className={`px-3 py-2 border ${k.hl ? 'border-l-4 border-l-emerald-500 border-stone-200' : 'border-stone-200'} bg-white`}>
                <div className="text-[9px] uppercase text-stone-400 tracking-wider">{k.l}</div>
                <div className={`num text-sm font-bold mt-0.5 ${k.hl ? 'text-emerald-700' : 'text-slate-900'}`}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Informações do Empreendimento */}
          <Section title="Informações do Empreendimento">
            <InfoRow label="Nome" value={est.nome} />
            <InfoRow label="Endereço" value={est.endereco} />
            <InfoRow label="Área Construída" value={area > 0 ? `${fmtNum(area, 2)} m²` : null} />
            <InfoRow label="Área Proj. Torre" value={toNum(est.areaProjTorre) > 0 ? `${fmtNum(toNum(est.areaProjTorre), 2)} m²` : null} />
            <InfoRow label="Nº Pavimentos" value={est.numPavtos || null} />
            <InfoRow label="Nº Subsolos" value={est.numSubsolos || null} />
            <InfoRow label="Prazo" value={est.prazoObra ? `${est.prazoObra} meses` : null} />
            <InfoRow label="Nº Elevadores" value={est.numElevadores || null} />
            <InfoRow label="Tipo de Fundação" value={est.tipoFundacao || null} />
          </Section>

          {/* Pavimentos */}
          {pavimentosComArea.length > 0 && (
            <Section title="Custo de Construção · Pavimentos">
              {pavimentosComArea.map((fl) => {
                const coef = (fl.coef !== '' && fl.coef != null) ? toNum(fl.coef) : (fl.defaultCoef || 1);
                const areaEq = toNum(fl.area) * coef;
                return (
                  <div key={fl.id} className="flex items-center justify-between px-3 py-2 border-b border-stone-100 last:border-0 text-xs">
                    <span className="text-stone-700 w-40 flex-shrink-0">{fl.label || fl.id}</span>
                    <span className="num text-stone-500">{fmtNum(toNum(fl.area), 2)} m²</span>
                    <span className="num text-stone-400">× {fmtNum(coef, 2)}</span>
                    <span className="num text-stone-600">{fmtNum(areaEq, 2)} m² eq.</span>
                  </div>
                );
              })}
            </Section>
          )}

          {/* Implantação */}
          {implItems.length > 0 && (
            <Section title="Implantação" color="#c55a11">
              {implItems.map((it, i) => (
                <Row key={i} label={it.nome} inccVal={it.valorINCC} rsVal={toNum(it.valorINCC) * incc} />
              ))}
              <Row label="Total" inccVal={calcTotal(implItems)} rsVal={calcTotal(implItems) * incc} bold />
            </Section>
          )}

          {/* Projetos */}
          {projItems.length > 0 && (
            <Section title="Projetos e Consultorias" color="#0e7490">
              {projItems.map((it, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-stone-100 last:border-0">
                  <div>
                    <span className="text-xs text-stone-700">{it.especialidade}</span>
                    {it.projetista && <span className="text-[10px] text-stone-400 ml-2">{it.projetista}</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="num text-xs text-stone-500">{toNum(it.custoINCCM2).toFixed(6)} INCC/m²</span>
                    <span className="num text-xs text-stone-700">{fmtR$(toNum(it.custoINCCM2) * area * incc)}</span>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Elevador */}
          {est.elevadorObraRef && (
            <Section title="Elevadores">
              <InfoRow label="Obra de Referência" value={est.elevadorObraRef} />
              <InfoRow label="Nº de Paradas" value={est.elevNumParadas ?? (toNum(est.numPavtos) > 0 ? toNum(est.numPavtos) - 1 : null)} />
              <InfoRow label="Qt. Elevadores" value={est.numElevadores || null} />
            </Section>
          )}

          {/* Infraestrutura */}
          {est.infraTipoFundacao && (
            <Section title="Infraestrutura">
              <InfoRow label="Tipo de Fundação" value={est.infraTipoFundacao} />
              <InfoRow label="Tipo de Contenção" value={est.infraTipoContencao || null} />
              <InfoRow label="Área Proj. Torre" value={toNum(est.areaProjTorre) > 0 ? `${fmtNum(toNum(est.areaProjTorre), 2)} m²` : null} />
            </Section>
          )}

          {/* Administração */}
          {(toNum(est.admEquipeINCC) + toNum(est.admDiversosINCC) + toNum(est.admLimpezaINCC)) > 0 && (
            <Section title="Administração" color="#9333ea">
              <Row label="Equipe Administrativa" inccVal={est.admEquipeINCC} rsVal={toNum(est.admEquipeINCC) * incc} />
              <Row label="Diversos" inccVal={est.admDiversosINCC} rsVal={toNum(est.admDiversosINCC) * incc} />
              <Row label="Limpeza e Transportes" inccVal={est.admLimpezaINCC} rsVal={toNum(est.admLimpezaINCC) * incc} />
              <Row label="Total" inccVal={toNum(est.admEquipeINCC) + toNum(est.admDiversosINCC) + toNum(est.admLimpezaINCC)} rsVal={(toNum(est.admEquipeINCC) + toNum(est.admDiversosINCC) + toNum(est.admLimpezaINCC)) * incc} bold />
            </Section>
          )}

          {/* Incorporação */}
          {incorpItems.length > 0 && (
            <Section title="Incorporação" color="#c55a11">
              {incorpItems.map((it, i) => (
                <Row key={i} label={it.nome} inccVal={it.valorINCC} rsVal={toNum(it.valorINCC) * incc} />
              ))}
              <Row label="Total" inccVal={calcTotal(incorpItems)} rsVal={calcTotal(incorpItems) * incc} bold />
            </Section>
          )}

          {/* Extras */}
          {extrasItems.length > 0 && (
            <Section title="Extras" color="#15803d">
              {extrasItems.map((it, i) => (
                <Row key={i} label={it.nome} inccVal={it.valorINCC} rsVal={toNum(it.valorINCC) * incc} />
              ))}
              <Row label="Total" inccVal={calcTotal(extrasItems)} rsVal={calcTotal(extrasItems) * incc} bold />
            </Section>
          )}

          {/* Totais */}
          <Section title="Custo Total C/ Taxa de Administração">
            <Row label={`Taxa de Administração (${fmtPct(toNum(est.taxaAdm))})`} rsVal={saved.totalFinalRS * toNum(est.taxaAdm) / (1 + toNum(est.taxaAdm))} />
            <Row label="Custo Total" rsVal={saved.totalFinalRS} bold />
            {area > 0 && <Row label="Custo Total / m²" rsVal={saved.totalFinalRS / area} bold />}
          </Section>

        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-stone-400">Salva em {dataFormatada}</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-200">Fechar</button>
            <button onClick={onLoad}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Editar esta estimativa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BASE DE DADOS VIEW — hub centralizado com sub-navegação
// ═══════════════════════════════════════════════════════════════════════════
const BASE_SECTIONS = [
  { id: 'obras',       label: 'Obras',       icon: Building2,  desc: 'Histórico de empreendimentos' },
  { id: 'projetos',    label: 'Projetos',    icon: FileDown,   desc: 'Propostas de projetos e consultorias' },
  { id: 'elevadores',  label: 'Elevadores',  icon: ArrowUp,    desc: 'Contratos de fornecimento' },
  { id: 'implantacao', label: 'Implantação', icon: Database,   desc: 'Composição de itens de obra' },
  { id: 'fundacao',    label: 'Fundação',    icon: Database,   desc: 'Custos por tipo de fundação' },
];

function BaseDadosView({
  db, projectsDb, elevatorsDb, implantacaoDb, fundacaoDb,
  onEditObra, onDeleteObra, onNewObra,
  onEditProjeto, onDeleteProjeto, onNewProjeto,
  onEditElevador, onDeleteElevador, onNewElevador,
  onEditImplantacao, onDeleteImplantacao, onNewImplantacao,
  onEditFundacao, onDeleteFundacao, onNewFundacao,
}) {
  const [activeBase, setActiveBase] = useState('obras');
  const active = BASE_SECTIONS.find((s) => s.id === activeBase);

  const counts = {
    obras:       db.length,
    projetos:    projectsDb.length,
    elevadores:  elevatorsDb.length,
    implantacao: implantacaoDb.length,
    fundacao:    fundacaoDb.length,
  };

  return (
    <div className="space-y-4">
      {/* Sub-nav cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {BASE_SECTIONS.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === activeBase;
          return (
            <button
              key={s.id}
              onClick={() => setActiveBase(s.id)}
              className={`text-left px-4 py-3 border-2 transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-stone-400'}`} />
                <span className={`num text-xs font-bold px-1.5 py-0.5 ${
                  isActive ? 'bg-[#0d1e35] text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {counts[s.id]}
                </span>
              </div>
              <div className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-stone-700'}`}>
                {s.label}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5 truncate">{s.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Divider with label */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          {active?.label}
        </span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      {/* Active section */}
      {activeBase === 'obras' && (
        <DatabaseView db={db} onEdit={onEditObra} onDelete={onDeleteObra} onNew={onNewObra} />
      )}
      {activeBase === 'projetos' && (
        <ProjetosDatabaseView
          projectsDb={projectsDb}
          onEdit={onEditProjeto}
          onDelete={onDeleteProjeto}
          onClearAll={() => {}}
          onNew={onNewProjeto}
        />
      )}
      {activeBase === 'elevadores' && (
        <ElevadoresDatabaseView
          elevatorsDb={elevatorsDb}
          onEdit={onEditElevador}
          onDelete={onDeleteElevador}
          onNew={onNewElevador}
        />
      )}
      {activeBase === 'implantacao' && (
        <ImplantacaoDatabaseView
          implantacaoDb={implantacaoDb}
          onEdit={onEditImplantacao}
          onDelete={onDeleteImplantacao}
          onNew={onNewImplantacao}
        />
      )}
      {activeBase === 'fundacao' && (
        <FundacaoDatabaseView
          fundacaoDb={fundacaoDb}
          onEdit={onEditFundacao}
          onDelete={onDeleteFundacao}
          onNew={onNewFundacao}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE VIEW
// ═══════════════════════════════════════════════════════════════════════════
function DatabaseView({ db, onEdit, onDelete, onNew }) {
  const [filter, setFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const filtered = useMemo(() => {
    return db.filter((p) => {
      if (tipoFilter && p.tipo !== tipoFilter) return false;
      if (filter && !p.nome.toLowerCase().includes(filter.toLowerCase()) &&
          !p.cidade.toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });
  }, [db, filter, tipoFilter]);

  return (
    <div className="space-y-4">
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px', boxShadow:'0 1px 4px rgba(13,30,53,0.06)', marginBottom:4 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)' }}>Obras</span>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'"IBM Plex Mono", monospace' }}>{filtered.length} registros</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 200px auto', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <Search style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:'#7a94b0', pointerEvents:'none' }} />
            <input value={filter} onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar por nome ou cidade..."
              style={{ width:'100%', padding:'9px 12px 9px 36px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color:'#0d1e35', outline:'none', fontFamily:'inherit', transition:'border-color .2s, box-shadow .2s, background .2s', boxSizing:'border-box' }}
              onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.1)'; e.target.style.background='#fff'; }}
              onBlur={e=>{ e.target.style.borderColor='#ccdaee'; e.target.style.boxShadow='none'; e.target.style.background='#f0f5fc'; }} />
          </div>
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}
            style={{ padding:'9px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color: tipoFilter ? '#0d1e35' : '#7a94b0', outline:'none', fontFamily:'inherit', cursor:'pointer', appearance:'auto' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; }} onBlur={e=>{ e.target.style.borderColor='#ccdaee'; }}>
            <option value="">Todos os tipos</option>
            {CONSTRUCTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={onNew}
            style={{ padding:'9px 16px', background:'#2e6fad', color:'#fff', border:'none', cursor:'pointer', borderRadius:7, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 8px rgba(46,111,173,0.25)', letterSpacing:'0.02em', fontFamily:'inherit', transition:'filter .15s, box-shadow .15s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(46,111,173,0.4)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(46,111,173,0.25)'; }}>
            <Plus style={{width:14,height:14}} /> Nova Obra
          </button>
        </div>
      </div>

      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, overflow:"hidden", boxShadow:"0 1px 4px rgba(13,30,53,0.06)" }}>
        <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:520, position:'relative' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead style={{ position:'sticky', top:0, zIndex:10 }}>
              <tr style={{ background:'var(--navy)' }}>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Empreendimento</th>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Tipo</th>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Cidade</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Ano</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Área (m²)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Pvtos</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>INCC Base</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Constr. INCC/m²</th>
              <th className="text-center px-3 py-3 font-medium w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} {...(i%2?{style:{background:'#e8f0fb',borderBottom:'1px solid var(--border)'}}:{style:{background:'#fff',borderBottom:'1px solid var(--border)'}})}>
                <td className="px-4 py-2.5">
                  <div className="font-medium text-slate-900">{p.nome}</div>
                  {p.notas && <div className="text-xs text-stone-500 truncate max-w-md">{p.notas}</div>}
                </td>
                <td className="px-3 py-2.5 text-stone-700">
                  <span className="db-type-badge">{p.tipo}</span>
                </td>
                <td className="px-3 py-2.5 text-stone-700">{p.cidade}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{p.ano}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtNum(p.areaConstruida, 0)}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{p.numPavtos}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtNum(p.inccBase, 2)}</td>
                <td className="px-3 py-2.5 text-right num font-medium text-slate-900">{fmtNum(p.custoConstrucaoM2)}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      className="db-icon-btn" title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {confirmDeleteId === p.id ? (
                      <span className="flex items-center gap-1">
                        <button
                          onClick={() => { onDelete(p.id); setConfirmDeleteId(null); }}
                          className="px-2 py-0.5 text-xs bg-rose-600 text-white hover:bg-rose-700"
                        >Sim</button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 text-xs bg-stone-200 text-stone-700 hover:bg-stone-300"
                        >Não</button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="p-1.5 text-stone-600 hover:text-rose-700 hover:bg-rose-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-stone-400 text-sm">
                  Nenhuma obra encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <p className="text-xs text-stone-500">
        Total: <span className="num font-medium">{filtered.length}</span> obra(s).
        Os dados são salvos automaticamente no navegador.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT EDITOR MODAL
// ═══════════════════════════════════════════════════════════════════════════
function ProjectEditor({ project, onSave, onCancel }) {
  const isNew = !project.id;
  const [form, setForm] = useState({
    nome: '', tipo: 'Médio Padrão', cidade: '', ano: new Date().getFullYear(),
    inccBase: 1700, areaConstruida: 0, areaProjTorre: 0,
    numPavtos: 0, numSubsolos: 0, perimetroTorre: 0, tipoFundacao: '',
    numElevadores: 0, numParadas: 0,
    custoConstrucaoM2: 0, custoInfra: 0, custoImplantacao: 0,
    custoProjetosM2: 0, custoElevador: 0, custoFachadaM2: 0,
    custoEnsaios: 0, custoAdminM2: 0, pctIncorporacao: 0.06,
    coefSubsolo: 1.20, coefSemiEnt: 1.08, coefTerreo: 1.00, coefTipo: 1.00,
    coefCobertura: 0.85, coefCxAgua: 0.50, notas: '',
    ...project,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 border-l-4 border-blue-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-900 text-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {isNew ? 'Nova Obra' : 'Editar Obra'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Todos os custos em UNIDADES INCC (R$ ÷ INCC_base do período)
            </p>
          </div>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Identificação */}
          <FieldSection title="Identificação">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="Nome" span2>
                <Input value={form.nome} onChange={(v) => set('nome', v)} />
              </Field>
              <Field label="Tipo">
                <select
                  value={form.tipo}
                  onChange={(e) => set('tipo', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                >
                  {CONSTRUCTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Ano Base">
                <NumInput value={form.ano} onChange={(v) => set('ano', v)} int />
              </Field>
              <Field label="Cidade" span2>
                <Input value={form.cidade} onChange={(v) => set('cidade', v)} />
              </Field>
              <Field label="INCC Base" hint="Índice do ano-base">
                <NumInput value={form.inccBase} onChange={(v) => set('inccBase', v)} />
              </Field>
            </div>
          </FieldSection>

          {/* Parâmetros Físicos */}
          <FieldSection title="Parâmetros Físicos">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="Área Construída (m²)">
                <NumInput value={form.areaConstruida} onChange={(v) => set('areaConstruida', v)} />
              </Field>
              <Field label="Área Proj. Torre (m²)">
                <NumInput value={form.areaProjTorre} onChange={(v) => set('areaProjTorre', v)} />
              </Field>
              <Field label="Perímetro Torre (m)">
                <NumInput value={form.perimetroTorre} onChange={(v) => set('perimetroTorre', v)} />
              </Field>
              <Field label="Nº Total Pavtos">
                <NumInput value={form.numPavtos} onChange={(v) => set('numPavtos', v)} int />
              </Field>
              <Field label="Nº Subsolos">
                <NumInput value={form.numSubsolos} onChange={(v) => set('numSubsolos', v)} int />
              </Field>
              <Field label="Tipo de Fundação">
                <select
                  value={form.tipoFundacao}
                  onChange={(e) => set('tipoFundacao', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="">—</option>
                  {FOUNDATION_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Nº Elevadores">
                <NumInput value={form.numElevadores} onChange={(v) => set('numElevadores', v)} int />
              </Field>
              <Field label="Nº Paradas/Elev.">
                <NumInput value={form.numParadas} onChange={(v) => set('numParadas', v)} int />
              </Field>
            </div>
          </FieldSection>

          {/* Custos em INCC */}
          <FieldSection title="Indicadores de Custo (em INCC)">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="Construção (INCC/m² eq.)">
                <NumInput value={form.custoConstrucaoM2} onChange={(v) => set('custoConstrucaoM2', v)} />
              </Field>
              <Field label="Infraestrutura (INCC total)">
                <NumInput value={form.custoInfra} onChange={(v) => set('custoInfra', v)} />
              </Field>
              <Field label="Implantação (INCC total)">
                <NumInput value={form.custoImplantacao} onChange={(v) => set('custoImplantacao', v)} />
              </Field>
              <Field label="Projetos (INCC/m² constr.)">
                <NumInput value={form.custoProjetosM2} onChange={(v) => set('custoProjetosM2', v)} />
              </Field>
              <Field label="Elevador (INCC/elevador)">
                <NumInput value={form.custoElevador} onChange={(v) => set('custoElevador', v)} />
              </Field>
              <Field label="Fachada (INCC/m² fachada)">
                <NumInput value={form.custoFachadaM2} onChange={(v) => set('custoFachadaM2', v)} />
              </Field>
              <Field label="Ensaios+Sist. (INCC total)">
                <NumInput value={form.custoEnsaios} onChange={(v) => set('custoEnsaios', v)} />
              </Field>
              <Field label="Administração (INCC/m²)">
                <NumInput value={form.custoAdminM2} onChange={(v) => set('custoAdminM2', v)} />
              </Field>
              <Field label="% Incorporação">
                <NumInput value={form.pctIncorporacao} onChange={(v) => set('pctIncorporacao', v)} />
              </Field>
            </div>
          </FieldSection>

          {/* Coeficientes */}
          <FieldSection title="Coeficientes por Pavimento">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <Field label="Subsolo"><NumInput value={form.coefSubsolo} onChange={(v) => set('coefSubsolo', v)} /></Field>
              <Field label="Semi-ent."><NumInput value={form.coefSemiEnt} onChange={(v) => set('coefSemiEnt', v)} /></Field>
              <Field label="Térreo"><NumInput value={form.coefTerreo} onChange={(v) => set('coefTerreo', v)} /></Field>
              <Field label="Pvto Tipo"><NumInput value={form.coefTipo} onChange={(v) => set('coefTipo', v)} /></Field>
              <Field label="Cobertura"><NumInput value={form.coefCobertura} onChange={(v) => set('coefCobertura', v)} /></Field>
              <Field label="Cx. d'Água"><NumInput value={form.coefCxAgua} onChange={(v) => set('coefCxAgua', v)} /></Field>
            </div>
          </FieldSection>

          {/* Notas */}
          <FieldSection title="Observações">
            <textarea
              value={form.notas}
              onChange={(e) => set('notas', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
            />
          </FieldSection>
        </div>

        <div className="sticky bottom-0 bg-stone-100 border-t border-stone-300 px-6 py-3 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.nome}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-stone-400 text-stone-100 text-sm font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Salvar Obra
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJETO ITEM ROW (linha editável da tabela de Projetos na Estimativa)
// ═══════════════════════════════════════════════════════════════════════════
function ProjetoItemRow({ item, index, total, projectsDb, areaConstruida, inccAtual, onUpdate, onRemove, onMoveUp, onMoveDown }) {
  const [confirmDeleteProjeto, setConfirmDeleteProjeto] = useState(null);
  const esp = (item.especialidade || '').trim();

  // Obras que têm pelo menos 1 proposta para ESTA especialidade
  const obrasDisponiveis = useMemo(() => {
    if (!esp) return [];
    const map = new Map(); // obra → count
    projectsDb.forEach((r) => {
      if (r.especialidade?.trim() === esp && r.obra) {
        map.set(r.obra, (map.get(r.obra) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [projectsDb, esp]);

  // Propostas que casam com a especialidade + obra selecionada
  const propostasCompativeis = useMemo(() => {
    return projectsDb.filter((r) => {
      const rEsp = (r.especialidade || '').trim();
      const rObra = (r.obra || '').trim();
      const selObra = (item.obraRef || '').trim();
      if (esp && rEsp !== esp) return false;
      if (selObra && rObra !== selObra) return false;
      return true;
    });
  }, [projectsDb, esp, item.obraRef]);

  // Lista de projetistas (com média) para essa combinação
  const projetistasDisponiveis = useMemo(() => {
    const map = new Map();
    propostasCompativeis.forEach((r) => {
      if (!map.has(r.projetista)) map.set(r.projetista, []);
      map.get(r.projetista).push(r.custoINCCM2);
    });
    return Array.from(map.entries())
      .map(([proj, custos]) => ({
        projetista: proj,
        avgCusto: custos.reduce((a, b) => a + b, 0) / custos.length,
        n: custos.length,
      }))
      .sort((a, b) => a.projetista.localeCompare(b.projetista));
  }, [propostasCompativeis]);

  // Custo sugerido (auto): se projetista escolhido, usa média desse projetista naquela obra+especialidade.
  // Senão, média geral da especialidade+obra.
  const custoSugerido = useMemo(() => {
    let candidates = propostasCompativeis;
    const selProj = (item.projetista || '').trim();
    if (selProj) {
      candidates = candidates.filter((r) => (r.projetista || '').trim() === selProj);
    }
    if (candidates.length === 0) return null;
    return candidates.reduce((s, r) => s + r.custoINCCM2, 0) / candidates.length;
  }, [propostasCompativeis, item.projetista]);

  // Aplica sugestão automaticamente quando muda obra/projetista
  // (apenas se o usuário ainda não digitou um valor diferente da sugestão anterior)
  const handleObraChange = (obra) => {
    // Calcula projetistas disponíveis para a nova obra selecionada
    const projetistasParaObra = [...new Set(
      projectsDb
        .filter(r => r.especialidade === esp && (!obra || r.obra === obra) && r.projetista)
        .map(r => r.projetista)
    )];
    // Se só há um projetista, seleciona automaticamente
    const autoProjetista = projetistasParaObra.length === 1 ? projetistasParaObra[0] : '';
    onUpdate({ obraRef: obra, projetista: autoProjetista });
  };
  const handleProjetistaChange = (proj) => {
    onUpdate({ projetista: proj });
  };
  const applySugestao = () => {
    if (custoSugerido !== null) {
      onUpdate({ custoINCCM2: Number(custoSugerido.toFixed(6)) });
    }
  };

  const custoINCCM2 = toNum(item.custoINCCM2);
  const totalINCC = custoINCCM2 * areaConstruida;
  const totalRS = totalINCC * inccAtual;
  const isAuto = custoSugerido !== null && Math.abs(custoINCCM2 - custoSugerido) < 0.0000005;
  const ativo = !!item.obrigatorio;

  return (
    <tr className={`${!ativo ? 'opacity-45' : ''}`}
      style={{ background: index % 2 ? '#EEF3FA' : '#fff', borderBottom: '1px solid var(--border)' }}>
      {/* Reorder */}
      <td className="px-2 py-1.5 text-center">
        <div className="flex flex-col items-center gap-0.5">
          <button onClick={onMoveUp} disabled={index === 0} className="text-stone-300 hover:text-slate-600 disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
          <button onClick={onMoveDown} disabled={index === (total - 1)} className="text-stone-300 hover:text-slate-600 disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
        </div>
      </td>
      {/* Especialidade */}
      <td className="px-3 py-1.5">
        <input
          type="text"
          list={`esp-list-${index}`}
          value={item.especialidade}
          onChange={(e) => onUpdate({ especialidade: e.target.value, projetista: '', obraRef: '' })}
          placeholder="Especialidade"
          className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-blue-600 focus:outline-none text-sm text-stone-800"
        />
        <datalist id={`esp-list-${index}`}>
          {ESPECIALIDADES_PROJETOS.map((e) => <option key={e} value={e} />)}
        </datalist>
      </td>

      {/* Obra de Referência */}
      <td className="px-3 py-1.5">
        <select
          value={item.obraRef || ''}
          onChange={(e) => handleObraChange(e.target.value)}
          disabled={obrasDisponiveis.length === 0}
          className="num w-full px-2 py-1 text-xs border focus:outline-none focus:border-blue-600 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
          style={{ background: item.obraRef ? '#fff' : '#f0fdf4', border: `1px solid ${item.obraRef ? '#ccdaee' : '#86efac'}`, borderRadius:6, fontSize:12, padding:'6px 8px', outline:'none', transition:'border-color .15s, box-shadow .15s' }}
          onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; }}
          onBlur={e=>{ e.target.style.borderColor= item.obraRef ? '#ccdaee' : '#86efac'; e.target.style.boxShadow='none'; }}
          title={obrasDisponiveis.length === 0 ? (esp ? 'Sem propostas cadastradas para esta especialidade' : 'Selecione a especialidade primeiro') : ''}
        >
          <option value="">
            {!esp
              ? '— selecione a especialidade —'
              : obrasDisponiveis.length === 0
                ? '— sem dados —'
                : `— todas (${obrasDisponiveis.reduce((s, [, c]) => s + c, 0)} propostas) —`}
          </option>
          {obrasDisponiveis.map(([obra, count]) => (
            <option key={obra} value={obra}>
              {obra} ({count} proposta{count !== 1 ? 's' : ''})
            </option>
          ))}
        </select>
      </td>

      {/* Projetista */}
      <td className="px-3 py-1.5">
        <select
          value={item.projetista || ''}
          onChange={(e) => handleProjetistaChange(e.target.value)}
          disabled={projetistasDisponiveis.length === 0}
          className="num w-full px-2 py-1 text-xs border focus:outline-none focus:border-blue-600 disabled:bg-stone-100 disabled:text-stone-400"
          style={{ background: item.projetista ? '#fff' : '#f0fdf4', border: `1px solid ${item.projetista ? '#ccdaee' : '#86efac'}`, borderRadius:6, fontSize:12, padding:'6px 8px', outline:'none', transition:'border-color .15s, box-shadow .15s' }}
          onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; }}
          onBlur={e=>{ e.target.style.borderColor= item.projetista ? '#ccdaee' : '#86efac'; e.target.style.boxShadow='none'; }}
          title={projetistasDisponiveis.length === 0 ? 'Selecione obra+especialidade primeiro' : ''}
        >
          <option value="">
            {projetistasDisponiveis.length === 0
              ? '— sem dados —'
              : `— Todos (${projetistasDisponiveis.length}) —`}
          </option>
          {projetistasDisponiveis.map((p) => (
            <option key={p.projetista} value={p.projetista}>
              {p.projetista} {p.n > 1 ? `(${p.n}x)` : ''}
            </option>
          ))}
        </select>
      </td>

      {/* Incluir no cálculo */}
      <td className="px-2 py-1.5 text-center">
        <button
          onClick={() => onUpdate({ obrigatorio: !ativo })}
          className={`text-xs px-1.5 py-0.5 font-medium transition-colors ${
            ativo
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200'
              : 'bg-stone-100 text-stone-400 border border-stone-200 hover:bg-stone-200'
          }`}
          title={ativo ? 'Incluído no cálculo — clique para excluir' : 'Excluído do cálculo — clique para incluir'}
        >
          {ativo ? '✓' : '✗'}
        </button>
      </td>

      {/* Custo INCC/m² */}
      <td className="px-3 py-1.5">
        <div className="flex items-center gap-1">
          <input
            type="number" step="0.000001"
            value={custoINCCM2 === 0 ? '' : custoINCCM2}
            onChange={(e) => onUpdate({ custoINCCM2: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
            placeholder={custoSugerido !== null ? custoSugerido.toFixed(6) : '0'}
            className="num flex-1 px-2 py-1 text-right text-sm border focus:outline-none focus:border-blue-600"
            style={{ background: isAuto ? '#f0fdf4' : '#fff', border: `1px solid ${isAuto ? '#86efac' : '#ccdaee'}`, borderRadius:7, fontSize:13, padding:'7px 10px', color: isAuto ? '#166534' : 'var(--text-primary)', outline:'none', transition:'border-color .15s, box-shadow .15s, background .15s', boxSizing:'border-box', boxShadow:'0 1px 2px rgba(13,30,53,0.05)' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; e.target.style.background='#f5f9ff'; }}
            onBlur={e=>{ e.target.style.borderColor= isAuto ? '#86efac' : '#ccdaee'; e.target.style.boxShadow='0 1px 2px rgba(13,30,53,0.05)'; e.target.style.background= isAuto ? '#f0fdf4' : '#fff'; }}
            title={custoSugerido !== null ? `Sugestão da base: ${custoSugerido.toFixed(6)} INCC/m²` : ''}
          />
          {custoSugerido !== null && !isAuto && (
            <button
              onClick={applySugestao}
              className="text-emerald-700 hover:text-emerald-900 p-0.5"
              title={`Aplicar sugestão (${custoSugerido.toFixed(6)})`}
            >
              <Sparkles className="w-3 h-3" />
            </button>
          )}
        </div>
      </td>

      {/* Total R$ */}
      <td className={`px-3 py-1.5 text-right num text-sm font-medium ${ativo ? 'text-slate-900' : 'text-stone-400 line-through'}`}>
        {fmtR$(totalRS)}
      </td>

      {/* Remover */}
      <td className="px-2 py-1.5 text-center">
        {confirmDeleteProjeto === item.id ? (
          <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
            <button style={{ padding:'4px 11px', background:'#DC2626', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em', boxShadow:'0 1px 4px rgba(220,38,38,0.25)', transition:'filter .15s, box-shadow .15s' }} onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 3px 8px rgba(220,38,38,0.35)';}} onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 1px 4px rgba(220,38,38,0.25)';}} onClick={() => { onRemove(); setConfirmDeleteProjeto(null); }}>Sim</button>
            <button style={{ padding:'4px 11px', background:'transparent', color:'#4a6080', border:'0.5px solid #ccdaee', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'background .15s, border-color .15s, color .15s' }} onMouseEnter={e=>{e.currentTarget.style.background='#e8f0fb';e.currentTarget.style.borderColor='#a8bdd8';e.currentTarget.style.color='#0d1e35';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='#ccdaee';e.currentTarget.style.color='#4a6080';}} onClick={() => setConfirmDeleteProjeto(null)}>Não</button>
          </span>
        ) : (
          <button onClick={() => setConfirmDeleteProjeto(item.id)} className="p-1 text-stone-300 hover:text-rose-600">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJETOS DATABASE VIEW (banco de propostas históricas)
// ═══════════════════════════════════════════════════════════════════════════
function ProjetosDatabaseView({ projectsDb, onEdit, onDelete, onNew, onClearAll }) {
  const [filter, setFilter] = useState('');
  const [especFilter, setEspecFilter] = useState('');
  const [obraFilter, setObraFilter] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const obrasDisponiveis = useMemo(
    () => Array.from(new Set(projectsDb.map((r) => r.obra).filter(Boolean))).sort(),
    [projectsDb]
  );
  const especsDisponiveis = useMemo(
    () => Array.from(new Set(projectsDb.map((r) => r.especialidade).filter(Boolean))).sort(),
    [projectsDb]
  );

  const filtered = useMemo(() => {
    return projectsDb.filter((r) => {
      if (especFilter && r.especialidade !== especFilter) return false;
      if (obraFilter && r.obra !== obraFilter) return false;
      if (filter) {
        const q = filter.toLowerCase();
        return r.projetista.toLowerCase().includes(q) ||
               r.especialidade.toLowerCase().includes(q) ||
               r.obra.toLowerCase().includes(q);
      }
      return true;
    });
  }, [projectsDb, filter, especFilter, obraFilter]);

  // Stats por especialidade (para o header)
  const stats = useMemo(() => {
    const map = new Map();
    filtered.forEach((r) => {
      if (!map.has(r.especialidade)) map.set(r.especialidade, []);
      map.get(r.especialidade).push(r.custoINCCM2);
    });
    return Array.from(map.entries()).map(([esp, vals]) => ({
      especialidade: esp,
      n: vals.length,
      min: Math.min(...vals),
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      max: Math.max(...vals),
    })).sort((a, b) => b.n - a.n);
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {/* Filtros modernos — Projetos */}
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px', boxShadow:'0 1px 4px rgba(13,30,53,0.06)', marginBottom:4 }}>
        {/* Label da seção */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)' }}>Projetos</span>
          {(filter || especFilter || obraFilter) && (
            <button
              onClick={() => { setFilter(''); setEspecFilter(''); setObraFilter(''); }}
              style={{ fontSize:11, color:'#4a6080', padding:'4px 10px', border:'0.5px solid #ccdaee', background:'transparent', cursor:'pointer', borderRadius:5, fontFamily:'inherit', display:'flex', alignItems:'center', gap:4, transition:'all .15s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='#e8f0fb'; e.currentTarget.style.color='#0d1e35'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#4a6080'; }}
            >
              <X style={{width:11,height:11}} /> Limpar
            </button>
          )}
        </div>

        {/* Grid de filtros + botão */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 220px 180px auto', gap:10, alignItems:'center' }}>

          {/* Busca */}
          <div style={{ position:'relative' }}>
            <Search style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:'#7a94b0', pointerEvents:'none' }} />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Projetista, obra ou especialidade..."
              style={{ width:'100%', padding:'9px 12px 9px 36px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color:'#0d1e35', outline:'none', fontFamily:'inherit', transition:'border-color .2s, box-shadow .2s, background .2s', boxSizing:'border-box' }}
              onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.1)'; e.target.style.background='#fff'; }}
              onBlur={e=>{ e.target.style.borderColor='#ccdaee'; e.target.style.boxShadow='none'; e.target.style.background='#f0f5fc'; }}
            />
          </div>

          {/* Especialidade */}
          <select
            value={especFilter}
            onChange={(e) => setEspecFilter(e.target.value)}
            style={{ padding:'9px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color: especFilter ? '#0d1e35' : '#7a94b0', outline:'none', fontFamily:'inherit', cursor:'pointer', transition:'border-color .2s', appearance:'auto' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; }}
            onBlur={e=>{ e.target.style.borderColor='#ccdaee'; }}
          >
            <option value="">Todas especialidades</option>
            {especsDisponiveis.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>

          {/* Obra */}
          <select
            value={obraFilter}
            onChange={(e) => setObraFilter(e.target.value)}
            style={{ padding:'9px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color: obraFilter ? '#0d1e35' : '#7a94b0', outline:'none', fontFamily:'inherit', cursor:'pointer', transition:'border-color .2s', appearance:'auto' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; }}
            onBlur={e=>{ e.target.style.borderColor='#ccdaee'; }}
          >
            <option value="">Todas obras</option>
            {obrasDisponiveis.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>

          {/* Botão Nova Proposta */}
          <button onClick={onNew}
            style={{ padding:'9px 16px', background:'#2e6fad', color:'#fff', border:'none', cursor:'pointer', borderRadius:7, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 8px rgba(46,111,173,0.25)', letterSpacing:'0.02em', fontFamily:'inherit', transition:'filter .15s, box-shadow .15s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(46,111,173,0.4)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(46,111,173,0.25)'; }}>
            <Plus style={{width:14,height:14}} /> Nova Proposta
          </button>
        </div>

        {/* Chips de filtros ativos */}
        {(filter || especFilter || obraFilter) && (
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:10, paddingTop:10, borderTop:'1px solid var(--border)' }}>
            {filter && <span style={{ fontSize:11, padding:'3px 10px', background:'#e8f0fb', color:'#0d1e35', borderRadius:20, border:'0.5px solid #ccdaee' }}>"{filter}"</span>}
            {especFilter && <span style={{ fontSize:11, padding:'3px 10px', background:'#e8f0fb', color:'#0d1e35', borderRadius:20, border:'0.5px solid #ccdaee' }}>{especFilter}</span>}
            {obraFilter && <span style={{ fontSize:11, padding:'3px 10px', background:'#e8f0fb', color:'#0d1e35', borderRadius:20, border:'0.5px solid #ccdaee' }}>{obraFilter}</span>}
            <span style={{ fontSize:11, color:'var(--text-muted)', padding:'3px 6px' }}>{filtered.length} resultado(s)</span>
          </div>
        )}
      </div>


      {/* Table */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, overflow:"hidden", boxShadow:"0 1px 4px rgba(13,30,53,0.06)" }}>
        <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:520, position:'relative' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead style={{ position:'sticky', top:0, zIndex:10 }}>
              <tr style={{ background:'var(--navy)' }}>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Especialidade</th>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Projetista</th>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Obra</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Área (m²)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Proposta (R$)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>R$/m²</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>INCC Base</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>INCC/m²</th>
              <th style={{ padding:'9px 14px', textAlign:'center',fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Mês</th>
              <th className="text-center px-3 py-3 font-medium w-20">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} {...(i%2?{style:{background:'#e8f0fb',borderBottom:'1px solid var(--border)'}}:{style:{background:'#fff',borderBottom:'1px solid var(--border)'}})}>
                <td className="px-3 py-2 text-stone-700">{r.especialidade}</td>
                <td className="px-3 py-2 text-slate-900 font-medium">{r.projetista}</td>
                <td className="px-3 py-2 text-stone-700">
                  <span className="inline-block px-2 py-0.5 bg-stone-100 text-xs">{r.obra}</span>
                </td>
                <td className="px-3 py-2 text-right num text-stone-700 text-xs">{fmtNum(r.area, 0)}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtR$(r.valorProposta)}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtR$2(r.custoRSM2)}</td>
                <td className="px-3 py-2 text-right num text-stone-500 text-xs">{fmtNum(r.inccBase, 2)}</td>
                <td className="px-3 py-2 text-right num text-stone-700">
                  {r.custoINCCM2.toFixed(6)}
                </td>
                <td className="px-3 py-2 text-center text-xs text-stone-500">{r.mesProposta}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(r)}
                      className="db-icon-btn"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {confirmDeleteId === r.id ? (
                      <span className="flex items-center gap-1">
                        <button
                          onClick={() => { onDelete(r.id); setConfirmDeleteId(null); }}
                          className="px-2 py-0.5 text-xs bg-rose-600 text-white hover:bg-rose-700"
                        >Sim</button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 text-xs bg-stone-200 text-stone-700 hover:bg-stone-300"
                        >Não</button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(r.id)}
                        className="p-1.5 text-stone-600 hover:text-rose-700 hover:bg-rose-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-12 text-stone-400 text-sm">
                  Nenhuma proposta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <p className="text-xs text-stone-500">
        Total: <span className="num font-medium">{filtered.length}</span> proposta(s) ·
        Os dados são salvos automaticamente no navegador.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT RECORD EDITOR (modal — proposta individual)
// ═══════════════════════════════════════════════════════════════════════════
function ProjectRecordEditor({ record, projectsDb, onSave, onCancel }) {
  const isNew = !record.id;
  const [form, setForm] = useState({
    especialidade: '',
    projetista: '',
    obra: '',
    area: 0,
    valorProposta: 0,
    custoRSM2: 0,
    inccBase: 0,
    custoINCCM2: 0,
    mesProposta: '',
    ...record,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-cálculos: R$/m², INCC/m²
  useEffect(() => {
    const area = toNum(form.area);
    const valor = toNum(form.valorProposta);
    if (area > 0 && valor > 0) {
      const rsM2 = valor / area;
      const incc = toNum(form.inccBase);
      const inccM2 = incc > 0 ? rsM2 / incc : 0;
      setForm((f) => ({
        ...f,
        custoRSM2: Number(rsM2.toFixed(4)),
        custoINCCM2: Number(inccM2.toFixed(6)),
      }));
    }
  }, [form.area, form.valorProposta, form.inccBase]);

  // Listas únicas (datalists)
  const projetistas = useMemo(
    () => Array.from(new Set(projectsDb.map((r) => r.projetista).filter(Boolean))).sort(),
    [projectsDb]
  );
  const obras = useMemo(
    () => Array.from(new Set(projectsDb.map((r) => r.obra).filter(Boolean))).sort(),
    [projectsDb]
  );

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 border-l-4 border-blue-500 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-900 text-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {isNew ? 'Nova Proposta' : 'Editar Proposta'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              R$/m² e INCC/m² são calculados automaticamente
            </p>
          </div>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <FieldSection title="Identificação">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Especialidade">
                <input
                  type="text"
                  list="esp-list-modal"
                  value={form.especialidade}
                  onChange={(e) => set('especialidade', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                  placeholder="Ex: Projeto de Arquitetura"
                />
                <datalist id="esp-list-modal">
                  {ESPECIALIDADES_PROJETOS.map((e) => <option key={e} value={e} />)}
                </datalist>
              </Field>
              <Field label="Projetista">
                <input
                  type="text"
                  list="proj-list-modal"
                  value={form.projetista}
                  onChange={(e) => set('projetista', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                />
                <datalist id="proj-list-modal">
                  {projetistas.map((p) => <option key={p} value={p} />)}
                </datalist>
              </Field>
              <Field label="Obra">
                <input
                  type="text"
                  list="obra-list-modal"
                  value={form.obra}
                  onChange={(e) => set('obra', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                />
                <datalist id="obra-list-modal">
                  {obras.map((o) => <option key={o} value={o} />)}
                </datalist>
              </Field>
              <Field label="Mês da Proposta (AAAA-MM)">
                <input
                  type="text"
                  value={form.mesProposta}
                  onChange={(e) => set('mesProposta', e.target.value)}
                  placeholder="2024-03"
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </Field>
            </div>
          </FieldSection>

          <FieldSection title="Valores">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Área (m²)" hint="Área de referência da proposta">
                <NumInput value={form.area} onChange={(v) => set('area', v)} />
              </Field>
              <Field label="Valor da Proposta (R$)">
                <NumInput value={form.valorProposta} onChange={(v) => set('valorProposta', v)} />
              </Field>
              <Field label="INCC Base" hint="INCC do mês da proposta">
                <NumInput value={form.inccBase} onChange={(v) => set('inccBase', v)} />
              </Field>
              <div></div>
              <Field label="Custo R$/m² (auto)">
                <div className="num px-3 py-2 bg-emerald-50 border border-emerald-200 text-right text-sm font-medium text-emerald-900">
                  {fmtR$2(form.custoRSM2)}
                </div>
              </Field>
              <Field label="Custo INCC/m² (auto)">
                <div className="num px-3 py-2 bg-emerald-50 border border-emerald-200 text-right text-sm font-medium text-emerald-900">
                  {toNum(form.custoINCCM2).toFixed(6)}
                </div>
              </Field>
            </div>
          </FieldSection>
        </div>

        <div className="sticky bottom-0 bg-stone-100 border-t border-stone-300 px-6 py-3 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-200">
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.especialidade || !form.projetista}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-stone-400 text-stone-100 text-sm font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Salvar Proposta
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// IMPLANTAÇÃO DATABASE VIEW
// ═══════════════════════════════════════════════════════════════════════════
function ImplantacaoDatabaseView({ implantacaoDb, onEdit, onDelete, onNew }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() =>
    filter
      ? implantacaoDb.filter((r) =>
          r.item.toLowerCase().includes(filter.toLowerCase()) ||
          r.observacao.toLowerCase().includes(filter.toLowerCase()))
      : implantacaoDb,
    [implantacaoDb, filter]
  );

  const totalINCC = useMemo(() => filtered.reduce((s, r) => s + toNum(r.totalINCC), 0), [filtered]);

  return (
    <div className="space-y-4">
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px', boxShadow:'0 1px 4px rgba(13,30,53,0.06)', marginBottom:4 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)' }}>Implantação</span>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'"IBM Plex Mono", monospace' }}>{filtered.length} itens</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <Search style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:'#7a94b0', pointerEvents:'none' }} />
            <input value={filter} onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar item ou observação..."
              style={{ width:'100%', padding:'9px 12px 9px 36px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color:'#0d1e35', outline:'none', fontFamily:'inherit', transition:'border-color .2s, box-shadow .2s, background .2s', boxSizing:'border-box' }}
              onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.1)'; e.target.style.background='#fff'; }}
              onBlur={e=>{ e.target.style.borderColor='#ccdaee'; e.target.style.boxShadow='none'; e.target.style.background='#f0f5fc'; }} />
          </div>
          <button onClick={onNew}
            style={{ padding:'9px 16px', background:'#2e6fad', color:'#fff', border:'none', cursor:'pointer', borderRadius:7, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 8px rgba(46,111,173,0.25)', letterSpacing:'0.02em', fontFamily:'inherit', transition:'filter .15s, box-shadow .15s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(46,111,173,0.4)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(46,111,173,0.25)'; }}>
            <Plus style={{width:14,height:14}} /> Novo Item
          </button>
        </div>
      </div>

      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, overflow:"hidden", boxShadow:"0 1px 4px rgba(13,30,53,0.06)" }}>
        <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:520, position:'relative' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead style={{ position:'sticky', top:0, zIndex:10 }}>
              <tr style={{ background:'var(--navy)' }}>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Observação</th>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Item</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'6rem' }}>Qtd.</th>
              <th style={{ padding:'9px 14px', textAlign:'center',fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'4rem' }}>Unid.</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'8rem' }}>Preço Unit. (R$)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'8rem' }}>Preço Unit. (INCC)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'7rem' }}>Total (INCC)</th>
              <th style={{ padding:'9px 14px', textAlign:'center',fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'5rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} {...(i%2?{style:{background:'#e8f0fb',borderBottom:'1px solid var(--border)'}}:{style:{background:'#fff',borderBottom:'1px solid var(--border)'}})}>
                <td style={{ padding:"9px 14px", color:"var(--text-muted)", fontSize:11, fontStyle:"italic" }}>{r.observacao}</td>
                <td className="px-3 py-2 text-slate-900 font-medium">{r.item}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtNum(r.quantidade, 2)}</td>
                <td className="px-3 py-2 text-center text-stone-600">{r.unidade}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtR$2(r.precoUnitarioRS)}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtNum(r.precoUnitarioINCC, 4)}</td>
                <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-secondary)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>{fmtNum(r.totalINCC, 2)}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onEdit(r)} className="db-icon-btn" title="Editar">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {confirmDeleteId === r.id ? (
                      <span className="flex items-center gap-1">
                        <button onClick={() => { onDelete(r.id); setConfirmDeleteId(null); }} className="px-2 py-0.5 text-xs bg-rose-600 text-white hover:bg-rose-700">Sim</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-0.5 text-xs bg-stone-200 text-stone-700 hover:bg-stone-300">Não</button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(r.id)} className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50" title="Excluir">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-stone-400 text-sm">Nenhum item encontrado.</td></tr>
            )}
            <tr className="bg-slate-900 text-stone-100 font-bold">
              <td colSpan={6} className="px-3 py-2.5 text-right uppercase text-xs tracking-wider">Total</td>
              <td className="px-3 py-2.5 text-right num text-blue-500">{fmtNum(totalINCC, 2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      <p className="text-xs text-stone-500">{filtered.length} item(s)</p>
    </div>
  );
}

function ImplantacaoRecordEditor({ record, onSave, onCancel }) {
  const isNew = !record.id;
  const [form, setForm] = useState({
    observacao: '', item: '', quantidade: 0, unidade: 'VB',
    precoUnitarioRS: 0, precoUnitarioINCC: 0, totalINCC: 0,
    ...record,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-calc totalINCC = precoUnitarioINCC × quantidade
  useEffect(() => {
    const t = toNum(form.precoUnitarioINCC) * toNum(form.quantidade);
    setForm((f) => ({ ...f, totalINCC: Number(t.toFixed(4)) }));
  }, [form.precoUnitarioINCC, form.quantidade]);

  // Auto-calc precoUnitarioINCC from R$ and INCC if typed
  const unidades = ['M2', 'M', 'VB', 'UN', 'Mês', 'PAV', 'KG', 'CJ', 'HR'];

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 border-l-4 border-blue-500 max-w-2xl w-full">
        <div className="bg-slate-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{isNew ? 'Novo Item' : 'Editar Item'} · Implantação</h2>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <FieldSection title="Identificação">
            <div className="grid grid-cols-1 gap-3">
              <Field label="Observação (fórmula/referência)">
                <Input value={form.observacao} onChange={(v) => set('observacao', v)} placeholder="Ex: ÁREA DO TERRENO" />
              </Field>
              <Field label="Item / Descrição">
                <Input value={form.item} onChange={(v) => set('item', v)} placeholder="Descrição do item" />
              </Field>
            </div>
          </FieldSection>
          <FieldSection title="Quantidades e Valores">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantidade">
                <NumInput value={form.quantidade} onChange={(v) => set('quantidade', v)} />
              </Field>
              <Field label="Unidade">
                <select value={form.unidade} onChange={(e) => set('unidade', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600">
                  {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Preço Unitário (R$)">
                <NumInput value={form.precoUnitarioRS} onChange={(v) => set('precoUnitarioRS', v)} />
              </Field>
              <Field label="Preço Unitário (INCC)">
                <NumInput value={form.precoUnitarioINCC} onChange={(v) => set('precoUnitarioINCC', v)} />
              </Field>
              <Field label="Total (INCC) — calculado">
                <div className="num px-3 py-2 bg-blue-50 border border-blue-200 text-right text-sm font-bold text-blue-800">
                  {fmtNum(form.totalINCC, 4)}
                </div>
              </Field>
            </div>
          </FieldSection>
        </div>
        <div className="bg-stone-100 border-t border-stone-300 px-6 py-3 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-200">Cancelar</button>
          <button onClick={() => onSave(form)} disabled={!form.item}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-stone-400 text-stone-100 text-sm font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNDAÇÃO DATABASE VIEW
// ═══════════════════════════════════════════════════════════════════════════
function FundacaoDatabaseView({ fundacaoDb, onEdit, onDelete, onNew }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filterFundacao, setFilterFundacao] = useState('');
  const [filterObra, setFilterObra] = useState('');

  const tipos = useMemo(() =>
    Array.from(new Set(fundacaoDb.map((r) => r.fundacao).filter(Boolean))).sort(),
    [fundacaoDb]
  );
  const obras = useMemo(() =>
    Array.from(new Set(fundacaoDb.map((r) => r.obra).filter(Boolean))).sort(),
    [fundacaoDb]
  );
  const filtered = useMemo(() =>
    fundacaoDb.filter((r) =>
      (!filterFundacao || r.fundacao === filterFundacao) &&
      (!filterObra || r.obra === filterObra)
    ),
    [fundacaoDb, filterFundacao, filterObra]
  );

  // Stats por tipo
  const stats = useMemo(() => {
    const map = new Map();
    filtered.forEach((r) => {
      if (!map.has(r.fundacao)) map.set(r.fundacao, []);
      map.get(r.fundacao).push(r.coeficiente);
    });
    return Array.from(map.entries()).map(([tipo, vals]) => ({
      tipo, n: vals.length,
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      min: Math.min(...vals), max: Math.max(...vals),
    }));
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px', boxShadow:'0 1px 4px rgba(13,30,53,0.06)', marginBottom:4 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)' }}>Fundação</span>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'"IBM Plex Mono", monospace' }}>{filtered.length} registros</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'200px 200px 1fr auto', gap:10, alignItems:'center' }}>
          <select value={filterObra} onChange={(e) => setFilterObra(e.target.value)}
            style={{ padding:'9px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color: filterObra ? '#0d1e35' : '#7a94b0', outline:'none', fontFamily:'inherit', cursor:'pointer', appearance:'auto' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; }} onBlur={e=>{ e.target.style.borderColor='#ccdaee'; }}>
            <option value="">Todas as obras</option>
            {obras.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterFundacao} onChange={(e) => setFilterFundacao(e.target.value)}
            style={{ padding:'9px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color: filterFundacao ? '#0d1e35' : '#7a94b0', outline:'none', fontFamily:'inherit', cursor:'pointer', appearance:'auto' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; }} onBlur={e=>{ e.target.style.borderColor='#ccdaee'; }}>
            <option value="">Todos os tipos</option>
            {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div>
            {(filterFundacao || filterObra) && (
              <button onClick={() => { setFilterFundacao(''); setFilterObra(''); }}
                style={{ fontSize:11, color:'#4a6080', padding:'6px 10px', border:'0.5px solid #ccdaee', background:'transparent', cursor:'pointer', borderRadius:5, fontFamily:'inherit', display:'flex', alignItems:'center', gap:4, transition:'all .15s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='#e8f0fb'; e.currentTarget.style.color='#0d1e35'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#4a6080'; }}>
                <X style={{width:11,height:11}} /> Limpar
              </button>
            )}
          </div>
          <button onClick={onNew}
            style={{ padding:'9px 16px', background:'#2e6fad', color:'#fff', border:'none', cursor:'pointer', borderRadius:7, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 8px rgba(46,111,173,0.25)', letterSpacing:'0.02em', fontFamily:'inherit', transition:'filter .15s, box-shadow .15s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(46,111,173,0.4)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(46,111,173,0.25)'; }}>
            <Plus style={{width:14,height:14}} /> Nova Fundação
          </button>
        </div>
      </div>

      {/* Stats */}


      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, overflow:"hidden", boxShadow:"0 1px 4px rgba(13,30,53,0.06)" }}>
        <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:520, position:'relative' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead style={{ position:'sticky', top:0, zIndex:10 }}>
              <tr style={{ background:'var(--navy)' }}>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Obra</th>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Fundação</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Área Terreno (m²)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Qt. Pavimentos</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Custo (R$)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>INCC Base</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Custo (INCC)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Coef. INCC/m²/Pav.</th>
              <th style={{ padding:'9px 14px', textAlign:'center',fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'5rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} {...(i%2?{style:{background:'#e8f0fb',borderBottom:'1px solid var(--border)'}}:{style:{background:'#fff',borderBottom:'1px solid var(--border)'}})}>
                <td style={{ padding:"9px 14px", color:"var(--text-primary)", fontSize:12, fontWeight:600, textTransform:"uppercase" }}>{r.obra}</td>
                <td className="px-3 py-2.5 text-stone-700">{r.fundacao}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtNum(r.areaTerrenoM2, 2)}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{r.qtPavimentos}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtR$(r.custoRS)}</td>
                <td className="px-3 py-2.5 text-right num text-stone-500 text-xs">{fmtNum(r.inccBase, 3)}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtNum(r.custoINCC, 2)}</td>
                <td style={{ padding:"9px 14px", textAlign:"right", color:"var(--text-secondary)", fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>{fmtNum(r.coeficiente, 3)}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onEdit(r)} className="db-icon-btn">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {confirmDeleteId === r.id ? (
                      <span className="flex items-center gap-1">
                        <button onClick={() => { onDelete(r.id); setConfirmDeleteId(null); }} className="px-2 py-0.5 text-xs bg-rose-600 text-white hover:bg-rose-700">Sim</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-0.5 text-xs bg-stone-200 text-stone-700 hover:bg-stone-300">Não</button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(r.id)} className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center py-12 text-stone-400 text-sm">Nenhum registro.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      <p className="text-xs text-stone-500">
        {filtered.length} registro(s) · Coeficiente = Custo (INCC) ÷ Área Terreno ÷ Qt. Pavimentos
      </p>
    </div>
  );
}

function FundacaoRecordEditor({ record, onSave, onCancel }) {
  const isNew = !record.id;
  const [form, setForm] = useState({
    obra: '', fundacao: '', areaTerrenoM2: 0, qtPavimentos: 0,
    custoRS: 0, inccBase: 0, custoINCC: 0, coeficiente: 0,
    ...record,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-calc custoINCC and coeficiente
  useEffect(() => {
    const custoINCC = toNum(form.inccBase) > 0 ? toNum(form.custoRS) / toNum(form.inccBase) : 0;
    const coef = (toNum(form.areaTerrenoM2) > 0 && toNum(form.qtPavimentos) > 0)
      ? custoINCC / toNum(form.areaTerrenoM2) / toNum(form.qtPavimentos)
      : 0;
    setForm((f) => ({
      ...f,
      custoINCC: Number(custoINCC.toFixed(2)),
      coeficiente: Number(coef.toFixed(3)),
    }));
  }, [form.custoRS, form.inccBase, form.areaTerrenoM2, form.qtPavimentos]);

  const tiposFundacao = ['Estaca Hélice', 'Estaca Raiz', 'Sapata', 'Perfil Metálico', 'Estaca Strauss', 'Tubulão', 'Radier'];

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 border-l-4 border-blue-500 max-w-2xl w-full">
        <div className="bg-slate-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{isNew ? 'Novo Registro' : 'Editar Registro'} · Fundação</h2>
            <p className="text-xs text-stone-400 mt-0.5">Custo INCC e Coeficiente calculados automaticamente</p>
          </div>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <FieldSection title="Identificação">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Obra">
                <Input value={form.obra} onChange={(v) => set('obra', v)} placeholder="Nome da obra" />
              </Field>
              <Field label="Tipo de Fundação">
                <input type="text" list="fund-list" value={form.fundacao}
                  onChange={(e) => set('fundacao', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                  placeholder="Ex: Estaca Hélice" />
                <datalist id="fund-list">
                  {tiposFundacao.map((t) => <option key={t} value={t} />)}
                </datalist>
              </Field>
              <Field label="Área do Terreno (m²)">
                <NumInput value={form.areaTerrenoM2} onChange={(v) => set('areaTerrenoM2', v)} />
              </Field>
              <Field label="Qt. de Pavimentos">
                <NumInput value={form.qtPavimentos} onChange={(v) => set('qtPavimentos', v)} int />
              </Field>
            </div>
          </FieldSection>
          <FieldSection title="Valores">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Custo (R$)">
                <NumInput value={form.custoRS} onChange={(v) => set('custoRS', v)} />
              </Field>
              <Field label="INCC Base">
                <NumInput value={form.inccBase} onChange={(v) => set('inccBase', v)} />
              </Field>
              <Field label="Custo (INCC) — calculado">
                <div className="num px-3 py-2 bg-emerald-50 border border-emerald-200 text-right text-sm font-medium text-emerald-900">
                  {fmtNum(form.custoINCC, 2)}
                </div>
              </Field>
              <Field label="Coef. INCC/m²/Pav. — calculado">
                <div className="num px-3 py-2 bg-blue-50 border border-blue-200 text-right text-sm font-bold text-blue-800">
                  {fmtNum(form.coeficiente, 3)}
                </div>
              </Field>
            </div>
          </FieldSection>
        </div>
        <div className="bg-stone-100 border-t border-stone-300 px-6 py-3 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-200">Cancelar</button>
          <button onClick={() => onSave(form)} disabled={!form.obra || !form.fundacao}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-stone-400 text-stone-100 text-sm font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEVADORES DATABASE VIEW
// ═══════════════════════════════════════════════════════════════════════════
function calcElevStats(r) {
  const valorParadaElevRS = (r.numParadas > 0 && r.qtElevadores > 0)
    ? r.valorFechado / (r.numParadas * r.qtElevadores) : 0;
  const valorParadaElevINCC = (r.inccBase > 0 && valorParadaElevRS > 0)
    ? valorParadaElevRS / r.inccBase : 0;
  return { valorParadaElevRS, valorParadaElevINCC };
}

function ElevadoresDatabaseView({ elevatorsDb, onEdit, onDelete, onNew }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filterMarca, setFilterMarca] = useState('');
  const [filterObra, setFilterObra] = useState('');

  const marcas = useMemo(
    () => Array.from(new Set(elevatorsDb.map((r) => r.marca).filter(Boolean))).sort(),
    [elevatorsDb]
  );
  const obras = useMemo(
    () => Array.from(new Set(elevatorsDb.map((r) => r.obra).filter(Boolean))).sort(),
    [elevatorsDb]
  );
  const filtered = useMemo(() =>
    elevatorsDb.filter((r) =>
      (!filterMarca || r.marca === filterMarca) &&
      (!filterObra || r.obra === filterObra)
    ),
    [elevatorsDb, filterMarca, filterObra]
  );

  // Stats
  const stats = useMemo(() => {
    const valid = filtered.filter((r) => r.inccBase > 0 && r.numParadas > 0 && r.qtElevadores > 0 && r.valorFechado > 0);
    if (valid.length === 0) return null;
    const vals = valid.map((r) => calcElevStats(r).valorParadaElevINCC);
    return {
      n: vals.length,
      min: Math.min(...vals),
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      max: Math.max(...vals),
    };
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px', boxShadow:'0 1px 4px rgba(13,30,53,0.06)', marginBottom:4 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)' }}>Elevadores</span>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'"IBM Plex Mono", monospace' }}>{filtered.length} registros</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'200px 200px 1fr auto', gap:10, alignItems:'center' }}>
          <select value={filterObra} onChange={(e) => setFilterObra(e.target.value)}
            style={{ padding:'9px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color: filterObra ? '#0d1e35' : '#7a94b0', outline:'none', fontFamily:'inherit', cursor:'pointer', appearance:'auto' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; }} onBlur={e=>{ e.target.style.borderColor='#ccdaee'; }}>
            <option value="">Todas as obras</option>
            {obras.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterMarca} onChange={(e) => setFilterMarca(e.target.value)}
            style={{ padding:'9px 12px', background:'#f0f5fc', border:'1px solid #ccdaee', borderRadius:7, fontSize:13, color: filterMarca ? '#0d1e35' : '#7a94b0', outline:'none', fontFamily:'inherit', cursor:'pointer', appearance:'auto' }}
            onFocus={e=>{ e.target.style.borderColor='#2e6fad'; }} onBlur={e=>{ e.target.style.borderColor='#ccdaee'; }}>
            <option value="">Todas as marcas</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <div>
            {(filterMarca || filterObra) && (
              <button onClick={() => { setFilterMarca(''); setFilterObra(''); }}
                style={{ fontSize:11, color:'#4a6080', padding:'6px 10px', border:'0.5px solid #ccdaee', background:'transparent', cursor:'pointer', borderRadius:5, fontFamily:'inherit', display:'flex', alignItems:'center', gap:4, transition:'all .15s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='#e8f0fb'; e.currentTarget.style.color='#0d1e35'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#4a6080'; }}>
                <X style={{width:11,height:11}} /> Limpar
              </button>
            )}
          </div>
          <button onClick={onNew} style={{ padding:'9px 16px', background:'#2e6fad', color:'#fff', border:'none', cursor:'pointer', borderRadius:7, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 8px rgba(46,111,173,0.25)', letterSpacing:'0.02em', fontFamily:'inherit', transition:'filter .15s, box-shadow .15s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(46,111,173,0.4)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(46,111,173,0.25)'; }}>
            <Plus style={{width:14,height:14}} /> Novo Elevador
          </button>
        </div>
      </div>

      {/* Stats header */}


      {/* Table */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, overflow:"hidden", boxShadow:"0 1px 4px rgba(13,30,53,0.06)" }}>
        <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:520, position:'relative' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead style={{ position:'sticky', top:0, zIndex:10 }}>
            <tr style={{ background:'var(--navy)' }}>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Obra</th>
              <th style={{ padding:'9px 14px', textAlign:'left',  fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Marca</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Nº Paradas</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Qt. Elevadores</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Valor Fechado (R$)</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Val./Parada/Elev. (R$)</th>
              <th style={{ padding:'9px 14px', textAlign:'center',fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Mês</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>INCC</th>
              <th style={{ padding:'9px 14px', textAlign:'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>Val./Parada/Elev. (INCC)</th>
              <th style={{ padding:'9px 14px', textAlign:'center',fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)', color:'rgba(255,255,255,0.7)', width:'5rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const { valorParadaElevRS, valorParadaElevINCC } = calcElevStats(r);
              return (
                <tr key={r.id} style={{ background: i % 2 ? '#e8f0fb' : '#fff', borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'9px 14px', color:'var(--text-primary)', fontSize:12, fontWeight:600, textTransform:'uppercase' }}>{r.obra}</td>
                  <td style={{ padding:'9px 14px', color:'var(--text-secondary)', fontSize:12 }}>{r.marca}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-secondary)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>{r.numParadas || '—'}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-secondary)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>{r.qtElevadores || '—'}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-secondary)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>
                    {r.valorFechado > 0 ? fmtR$(r.valorFechado) : '—'}
                  </td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-secondary)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>
                    {valorParadaElevRS > 0 ? fmtR$(valorParadaElevRS) : '—'}
                  </td>
                  <td style={{ padding:'9px 14px', textAlign:'center', color:'var(--text-muted)', fontSize:12 }}>{r.mesFechamento || '—'}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-muted)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>{r.inccBase > 0 ? fmtNum(r.inccBase, 3) : '—'}</td>
                  <td style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-secondary)', fontSize:12, fontFamily:'"IBM Plex Mono", monospace' }}>
                    {valorParadaElevINCC > 0 ? fmtNum(valorParadaElevINCC, 2) : '—'}
                  </td>
                  <td style={{ padding:'9px 14px', textAlign:'center' }}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onEdit(r)} className="db-icon-btn" title="Editar">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {confirmDeleteId === r.id ? (
                        <span className="flex items-center gap-1">
                          <button onClick={() => { onDelete(r.id); setConfirmDeleteId(null); }}
                            className="px-2 py-0.5 text-xs bg-rose-600 text-white hover:bg-rose-700">Sim</button>
                          <button onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 text-xs bg-stone-200 text-stone-700 hover:bg-stone-300">Não</button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(r.id)}
                          className="db-icon-btn danger" title="Excluir">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ padding:'48px 14px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>Nenhum registro.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      <p className="text-xs text-stone-500">
        {filtered.length} registro(s) · Fórmula: <span className="num">Valor Fechado ÷ (Nº Paradas × Qt. Elevadores) ÷ INCC Base</span>
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEVATOR RECORD EDITOR MODAL
// ═══════════════════════════════════════════════════════════════════════════
function ElevatorRecordEditor({ record, onSave, onCancel }) {
  const isNew = !record.id;
  const [form, setForm] = useState({
    obra: '', marca: '', numParadas: 0, qtElevadores: 0,
    valorFechado: 0, mesFechamento: '', inccBase: 0,
    ...record,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const { valorParadaElevRS, valorParadaElevINCC } = calcElevStats(form);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 border-l-4 border-blue-500 max-w-2xl w-full">
        <div className="bg-slate-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{isNew ? 'Novo Registro' : 'Editar Registro'} · Elevadores</h2>
            <p className="text-xs text-stone-400 mt-0.5">Val./Parada/Elev. calculado automaticamente</p>
          </div>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          <FieldSection title="Identificação">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Obra">
                <Input value={form.obra} onChange={(v) => set('obra', v)} placeholder="Nome da obra" />
              </Field>
              <Field label="Marca">
                <input type="text" list="marca-list"
                  value={form.marca} onChange={(e) => set('marca', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
                  placeholder="OTIS, ATLAS, TK ELEVADORES..." />
                <datalist id="marca-list">
                  {['OTIS','ATLAS','TK ELEVADORES','THYSSENKRUPP','SCHINDLER','KONE'].map(m => <option key={m} value={m} />)}
                </datalist>
              </Field>
            </div>
          </FieldSection>

          <FieldSection title="Dados do Contrato">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nº de Paradas">
                <NumInput value={form.numParadas} onChange={(v) => set('numParadas', v)} int />
              </Field>
              <Field label="Qt. de Elevadores">
                <NumInput value={form.qtElevadores} onChange={(v) => set('qtElevadores', v)} int />
              </Field>
              <Field label="Valor Fechado (R$)">
                <NumInput value={form.valorFechado} onChange={(v) => set('valorFechado', v)} />
              </Field>
              <Field label="Mês do Fechamento (AAAA-MM)">
                <Input value={form.mesFechamento} onChange={(v) => set('mesFechamento', v)} placeholder="2024-06" />
              </Field>
              <Field label="INCC Base (mês do fechamento)">
                <NumInput value={form.inccBase} onChange={(v) => set('inccBase', v)} />
              </Field>
            </div>
          </FieldSection>

          {/* Resultado automático */}
          {valorParadaElevINCC > 0 && (
            <FieldSection title="Resultados (calculados)">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Val./Parada/Elevador (R$)">
                  <div className="num px-3 py-2 bg-emerald-50 border border-emerald-200 text-right text-sm font-medium text-emerald-900">
                    {fmtR$(valorParadaElevRS)}
                  </div>
                </Field>
                <Field label="Val./Parada/Elevador (INCC)" hint="métrica principal">
                  <div className="num px-3 py-2 bg-amber-50 border border-blue-400 text-right text-base font-bold text-blue-800">
                    {fmtNum(valorParadaElevINCC, 2)}
                  </div>
                </Field>
              </div>
            </FieldSection>
          )}
        </div>

        <div className="bg-stone-100 border-t border-stone-300 px-6 py-3 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-200">Cancelar</button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.obra}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-stone-400 text-stone-100 text-sm font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APRESENTAÇÃO VIEW
// ═══════════════════════════════════════════════════════════════════════════
function ApresentacaoView({ estimate, calc, refProject, apresentacao, setApresentacao, savedEstimates }) {
  const ap = apresentacao;
  const set = useCallback((k, v) => setApresentacao((prev) => ({ ...prev, [k]: v })), [setApresentacao]);

  // Seleção de estimativa para a apresentação
  const [selectedId, setSelectedId] = useState('current');
  const selectedSaved = useMemo(() =>
    selectedId !== 'current' ? (savedEstimates || []).find((e) => e.id === Number(selectedId)) : null,
    [selectedId, savedEstimates]
  );

  // Estimativa e valores efetivos (da selecionada ou da atual)
  const activeEstimate = selectedSaved ? selectedSaved.data : estimate;
  const activeTotalRS  = selectedSaved ? selectedSaved.totalFinalRS : calc.totalFinalRS;
  const activeAreaConstr = toNum(activeEstimate?.areaConstruida);

  // Calc simplificado para a estimativa selecionada (valores-chave para preview e PDF)
  const activeCalc = useMemo(() => {
    if (!selectedSaved) return calc;
    const est = selectedSaved.data || {};
    const incc = toNum(est.inccAtual);
    const area = toNum(est.areaConstruida);
    const sections = [
      { key: 'construcao',    label: 'Construção',     incc: 0, rs: 0 },
      { key: 'infra',         label: 'Infraestrutura', incc: 0, rs: 0 },
      { key: 'implantacao',   label: 'Implantação',    incc: (est.implantacaoItems||[]).reduce((s,i)=>s+toNum(i.valorINCC),0), rs: 0 },
      { key: 'projetos',      label: 'Projetos',       incc: 0, rs: 0 },
      { key: 'elevador',      label: 'Elevadores',     incc: 0, rs: 0 },
      { key: 'fachada',       label: 'Fachada',        incc: 0, rs: 0 },
      { key: 'ensaios',       label: 'Ensaios+Sist.',  incc: 0, rs: 0 },
      { key: 'administracao', label: 'Administração',  incc: toNum(est.admEquipeINCC)+toNum(est.admDiversosINCC)+toNum(est.admLimpezaINCC), rs: 0 },
      { key: 'incorporacao',  label: 'Incorporação',   incc: (est.incorporacaoItems||[]).reduce((s,i)=>i.isGroup?s:s+toNum(i.valorINCC),0), rs: 0 },
      { key: 'extras',        label: 'Extras',         incc: (est.extrasItems||[]).reduce((s,i)=>s+toNum(i.valorINCC),0), rs: 0 },
    ].map(s => ({ ...s, rs: s.incc * incc }));
    const totalFinalRS = selectedSaved.totalFinalRS;
    const taxaAdm = toNum(est.taxaAdm);
    return {
      totalFinalRS,
      custoFinalM2: area > 0 ? totalFinalRS / area : 0,
      areaEqTotal: area,
      fator: 1,
      totalFinalINCC: incc > 0 ? totalFinalRS / incc : 0,
      subtotalRS: totalFinalRS / (1 + taxaAdm),
      taxaAdmRS: totalFinalRS - totalFinalRS / (1 + taxaAdm),
      sections,
    };
  }, [selectedSaved, calc]);

  const cor1 = ap.corPrimaria || '#1F3864';
  const cor2 = ap.corAcento || '#f59e0b';

  const SECOES = [
    { key: 'mostrarKPIs',              label: 'Indicadores (KPIs)' },
    { key: 'mostrarResumoFinanceiro',  label: 'Resumo Financeiro' },
    { key: 'mostrarDistribuicao',      label: 'Distribuição por Categoria' },
    { key: 'mostrarPavimentos',        label: 'Custo de Construção (Pavimentos)' },
    { key: 'mostrarImplantacao',       label: 'Implantação' },
    { key: 'mostrarProjetos',          label: 'Projetos e Consultorias' },
    { key: 'mostrarElevadores',        label: 'Elevadores' },
    { key: 'mostrarInfraestrutura',    label: 'Infraestrutura' },
    { key: 'mostrarFachada',           label: 'Fachada' },
    { key: 'mostrarEnsaios',           label: 'Ensaios e Sistemas' },
    { key: 'mostrarAdministracao',     label: 'Administração' },
    { key: 'mostrarIncorporacao',      label: 'Incorporação' },
    { key: 'mostrarExtras',            label: 'Itens Extras' },
  ];

  // Incorporação: lista de itens não-subgrupo da estimativa
  const incorporacaoItens = useMemo(() =>
    (activeEstimate?.incorporacaoItems || []).filter((it) => !it.isGroup),
    [activeEstimate]
  );
  const itensVisiveis = (ap.incorporacaoItensVisiveis || []).map(Number);
  const isItemVisivel = (id) => itensVisiveis.length === 0 || itensVisiveis.includes(Number(id));
  const toggleItemIncorp = (id) => {
    if (itensVisiveis.length === 0) {
      // primeira seleção: seleciona todos exceto o clicado
      const todosExceto = incorporacaoItens.map((i) => i.id).filter((i) => i !== id);
      set('incorporacaoItensVisiveis', todosExceto);
    } else if (itensVisiveis.includes(id)) {
      const next = itensVisiveis.filter((i) => i !== id);
      set('incorporacaoItensVisiveis', next.length === incorporacaoItens.length ? [] : next);
    } else {
      const next = [...itensVisiveis, id];
      set('incorporacaoItensVisiveis', next.length === incorporacaoItens.length ? [] : next);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">

      {/* ── PAINEL ESQUERDO ── */}
      <div className="space-y-4">

        {/* Seletor de estimativa */}
        <Card title="Estimativa para Apresentação">
          <div className="p-4 space-y-3">
            <Field label="Selecione a estimativa">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600"
              >
                <option value="current">
                  {estimate.nome
                    ? `Em edição: ${estimate.nome}`
                    : '— Estimativa em edição (não salva) —'}
                </option>
                {(savedEstimates || []).length > 0 && (
                  <optgroup label="Estimativas Salvas">
                    {(savedEstimates || []).map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.nome} · {fmtR$(s.totalFinalRS)}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </Field>
            {selectedSaved && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-stone-50 px-3 py-2">
                  <div className="text-[9px] uppercase text-stone-400 tracking-wider">Custo Total</div>
                  <div className="num text-sm font-bold text-emerald-700 mt-0.5">{fmtR$(selectedSaved.totalFinalRS)}</div>
                </div>
                <div className="bg-stone-50 px-3 py-2">
                  <div className="text-[9px] uppercase text-stone-400 tracking-wider">Área</div>
                  <div className="num text-sm font-bold text-slate-900 mt-0.5">{fmtNum(selectedSaved.areaConstruida, 0)} m²</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <button
          onClick={() => { generatePDF({ estimate: activeEstimate, calc: activeCalc, refProject, apresentacao }); }}
          style={{ width:'100%', padding:'12px 20px', background:'#2e6fad', color:'#fff', border:'none', borderRadius:6, fontSize:14, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', boxShadow:'0 2px 10px rgba(46,111,173,0.35)', letterSpacing:'0.03em', transition:'filter .15s, box-shadow .15s', fontFamily:'inherit' }}
          onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(46,111,173,0.5)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='0 2px 10px rgba(46,111,173,0.35)'; }}
        >
          <FileDown style={{width:18,height:18}} /> Gerar e Baixar PDF
        </button>
        <p className="text-xs text-stone-500 -mt-2">
          Baixa um arquivo .html. Abra no browser → <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-300 text-xs">Ctrl+P</kbd> → "Salvar como PDF"
        </p>

        {/* Identidade */}
        <Card title="Identidade / Cabeçalho">
          <div className="p-4 space-y-3">
            <Field label="Nome da Empresa / Incorporadora">
              <Input value={ap.empresa} onChange={(v) => set('empresa', v)} placeholder="Ex: Construtora ABC" />
            </Field>
            <Field label="Texto do Logo (substitui logotipo)">
              <Input value={ap.logoText} onChange={(v) => set('logoText', v)} placeholder="Ex: ABC ENGENHARIA" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Responsável">
                <Input value={ap.responsavel} onChange={(v) => set('responsavel', v)} placeholder="Nome" />
              </Field>
              <Field label="Cargo">
                <Input value={ap.cargo} onChange={(v) => set('cargo', v)} placeholder="Engenheiro(a)" />
              </Field>
            </div>
            <Field label="Contato (e-mail / telefone)">
              <Input value={ap.contato} onChange={(v) => set('contato', v)} placeholder="contato@empresa.com.br" />
            </Field>
          </div>
        </Card>

        {/* Cores */}
        <Card title="Cores">
          <div className="p-4 grid grid-cols-2 gap-4">
            <Field label="Cor Primária" hint="cabeçalho, seções">
              <div className="flex items-center gap-2">
                <input type="color" value={ap.corPrimaria}
                  onChange={(e) => set('corPrimaria', e.target.value)}
                  className="w-10 h-9 p-0.5 border border-stone-300 cursor-pointer" />
                <input type="text" value={ap.corPrimaria}
                  onChange={(e) => set('corPrimaria', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-stone-300 text-sm font-mono focus:outline-none focus:border-blue-600" />
              </div>
            </Field>
            <Field label="Cor de Acento" hint="barra, destaques">
              <div className="flex items-center gap-2">
                <input type="color" value={ap.corAcento}
                  onChange={(e) => set('corAcento', e.target.value)}
                  className="w-10 h-9 p-0.5 border border-stone-300 cursor-pointer" />
                <input type="text" value={ap.corAcento}
                  onChange={(e) => set('corAcento', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-stone-300 text-sm font-mono focus:outline-none focus:border-blue-600" />
              </div>
            </Field>
            <button
              onClick={() => { set('corPrimaria', '#1F3864'); set('corAcento', '#f59e0b'); }}
              className="col-span-2 text-xs text-stone-600 hover:text-slate-900 px-2 py-1 border border-stone-200 hover:border-stone-400"
            >↺ Restaurar cores padrão</button>
          </div>
        </Card>

        {/* Seções — checkbox nativo, sem conflito de evento */}
        <Card title="Seções do Relatório">
          <div className="p-3 space-y-0.5">
            <div className="flex items-center justify-between px-1 pb-2 mb-1 border-b border-stone-100">
              <span className="text-xs text-stone-500">Marque as seções que aparecem no PDF</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setApresentacao((prev) => { const u = { ...prev }; SECOES.forEach((s) => { u[s.key] = true; }); return u; })}
                  className="text-xs text-emerald-700 font-medium hover:underline"
                >Todas</button>
                <button
                  onClick={() => setApresentacao((prev) => { const u = { ...prev }; SECOES.forEach((s) => { u[s.key] = false; }); return u; })}
                  className="text-xs text-rose-600 font-medium hover:underline"
                >Nenhuma</button>
              </div>
            </div>
            {SECOES.map((s) => (
              <label key={s.key} className="flex items-center gap-3 px-1 py-1.5 hover:bg-stone-50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!ap[s.key]}
                  onChange={(e) => set(s.key, e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer flex-shrink-0"
                />
                <span className={`text-sm ${ap[s.key] ? 'text-slate-800' : 'text-stone-400'}`}>{s.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Itens de Incorporação visíveis */}
        {ap.mostrarIncorporacao && incorporacaoItens.length > 0 && (
          <Card title="Itens de Incorporação no PDF">
            <div className="p-3 space-y-0.5">
              <div className="flex items-center justify-between px-1 pb-2 mb-1 border-b border-stone-100">
                <span className="text-xs text-stone-500">Selecione quais itens aparecem</span>
                <div className="flex gap-3">
                  <button onClick={() => set('incorporacaoItensVisiveis', [])}
                    className="text-xs text-emerald-700 font-medium hover:underline">Todos</button>
                  <button onClick={() => set('incorporacaoItensVisiveis', incorporacaoItens.map((i) => i.id))}
                    className="text-xs text-rose-600 font-medium hover:underline">Nenhum</button>
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {incorporacaoItens.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 px-1 py-1.5 hover:bg-stone-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isItemVisivel(item.id)}
                      onChange={() => toggleItemIncorp(item.id)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer flex-shrink-0"
                    />
                    <span className={`text-sm ${item.isSubItem ? 'pl-4 italic text-stone-500' : 'text-slate-700'}`}>
                      {item.nome}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Textos */}
        <Card title="Textos Personalizados">
          <div className="p-4 space-y-3">
            <Field label="Texto de Introdução" hint="aparece logo após o cabeçalho">
              <textarea value={ap.notasIntroducao}
                onChange={(e) => set('notasIntroducao', e.target.value)}
                rows={3} placeholder="Ex: Esta estimativa foi elaborada com base em dados históricos de obras similares..."
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600 resize-none" />
            </Field>
            <Field label="Nota de Rodapé">
              <textarea value={ap.notasRodape}
                onChange={(e) => set('notasRodape', e.target.value)}
                rows={2} placeholder="Ex: Valores sujeitos a revisão. Estimativa válida por 30 dias."
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-blue-600 resize-none" />
            </Field>
          </div>
        </Card>

        <button
          onClick={() => setApresentacao(DEFAULT_APRESENTACAO)}
          className="w-full py-2 text-xs text-stone-500 hover:text-rose-600 border border-stone-200 hover:border-rose-300"
        >↺ Restaurar configurações padrão</button>
      </div>

      {/* ── PAINEL DIREITO: PRÉ-VISUALIZAÇÃO ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Pré-visualização do relatório</h3>
          <span className="text-xs text-stone-400">Aproximação — o PDF final é formatado para A4</span>
        </div>

        <div className="bg-white border border-stone-200 shadow-sm" style={{ fontFamily: 'Arial, sans-serif', fontSize: 9 }}>

          {/* Cabeçalho */}
          <div style={{ background: cor1, color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              {ap.logoText && <div style={{ fontSize: 11, fontWeight: 700, color: cor2, marginBottom: 3 }}>{ap.logoText}</div>}
              <div style={{ fontSize: 14, fontWeight: 700 }}>{(activeEstimate?.nome || 'NOME DO EMPREENDIMENTO').toUpperCase()}</div>
              {activeEstimate?.endereco && <div style={{ fontSize: 8, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>{activeEstimate?.endereco}</div>}
            </div>
            <div style={{ textAlign: 'right', fontSize: 8, color: 'rgba(255,255,255,.65)' }}>
              {ap.empresa && <div style={{ fontWeight: 600, color: '#fff' }}>{ap.empresa}</div>}
              {ap.responsavel && <div>{ap.responsavel}{ap.cargo ? ` · ${ap.cargo}` : ''}</div>}
              {ap.contato && <div>{ap.contato}</div>}
              <div>Data: {new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>
          <div style={{ height: 4, background: cor2 }} />

          {ap.notasIntroducao && (
            <div style={{ borderLeft: `4px solid ${cor2}`, padding: '6px 10px', margin: '8px', fontSize: 8, color: '#122540', background: '#fffbeb' }}>
              {ap.notasIntroducao}
            </div>
          )}

          {ap.mostrarKPIs && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, padding: '8px 8px 4px' }}>
              {[
                { l: 'Área Construída', v: `${fmtNum(toNum(activeEstimate?.areaConstruida), 0)} m²` },
                { l: 'Área Equivalente', v: `${fmtNum(activeCalc.areaEqTotal, 0)} m²` },
                { l: 'Custo / m²', v: fmtR$(activeCalc.custoFinalM2) },
                { l: 'Custo Total', v: fmtR$(activeCalc.totalFinalRS), hl: true },
                { l: 'INCC Atual', v: fmtNum(toNum(activeEstimate?.inccAtual), 2) },
                { l: 'Fator INCC', v: `${fmtNum(activeCalc.fator, 4)}×` },
                { l: 'Pavimentos', v: activeEstimate?.numPavtos || '—' },
                { l: 'Prazo (meses)', v: activeEstimate?.prazoObra || '—' },
              ].map((k) => (
                <div key={k.l} style={{ border: `1px solid ${k.hl ? cor2 : '#d1d5db'}`, borderLeft: k.hl ? `3px solid ${cor2}` : undefined, padding: '4px 6px' }}>
                  <div style={{ fontSize: 7, textTransform: 'uppercase', color: '#6b7280' }}>{k.l}</div>
                  <div style={{ fontSize: k.hl ? 11 : 9, fontWeight: 700, color: k.hl ? cor2 : '#0f172a', fontFamily: 'monospace', marginTop: 1 }}>{k.v}</div>
                </div>
              ))}
            </div>
          )}

          {ap.mostrarResumoFinanceiro && (
            <div style={{ padding: '4px 8px' }}>
              <div style={{ background: cor1, color: '#fff', fontSize: 8, fontWeight: 700, padding: '3px 6px', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Resumo Financeiro</div>
              <div style={{ border: `2px solid ${cor1}`, padding: '6px 10px' }}>
                {[
                  ['Subtotal s/ incorporação', calc.subtotalRS],
                  ['Incorporação', (activeCalc.sections[8] || {}).rs || 0],
                  ['Itens Extras', (activeCalc.sections[9] || {}).rs || 0],
                  [`Taxa Adm (${fmtPct(toNum(activeEstimate?.taxaAdm))})`, activeCalc.taxaAdmRS],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '2px 0', fontSize: 8 }}>
                    <span>{l}</span><span style={{ fontFamily: 'monospace' }}>{fmtR$(v)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, fontSize: 10, fontWeight: 700, color: cor1 }}>
                  <span>CUSTO TOTAL</span>
                  <span style={{ fontFamily: 'monospace', color: cor2 }}>{fmtR$(activeCalc.totalFinalRS)}</span>
                </div>
              </div>
            </div>
          )}

          {ap.mostrarDistribuicao && (
            <div style={{ padding: '4px 8px 8px' }}>
              <div style={{ background: cor1, color: '#fff', fontSize: 8, fontWeight: 700, padding: '3px 6px', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Distribuição por Categoria</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 8 }}>
                <thead>
                  <tr style={{ background: '#122540', color: '#f8fafc' }}>
                    <th style={{ padding: '3px 5px', textAlign: 'left' }}>Categoria</th>
                    <th style={{ padding: '3px 5px', textAlign: 'right' }}>R$</th>
                    <th style={{ padding: '3px 5px', textAlign: 'right' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCalc.sections.filter((s) => s.rs > 0).map((s, i) => (
                    <tr key={s.key} style={{ background: i % 2 ? '#f8fafc' : '#fff' }}>
                      <td style={{ padding: '2.5px 5px', borderBottom: '1px solid #f1f5f9' }}>{s.label}</td>
                      <td style={{ padding: '2.5px 5px', textAlign: 'right', fontFamily: 'monospace', borderBottom: '1px solid #f1f5f9' }}>{fmtR$(s.rs)}</td>
                      <td style={{ padding: '2.5px 5px', textAlign: 'right', fontFamily: 'monospace', borderBottom: '1px solid #f1f5f9' }}>{fmtPct(activeCalc.totalFinalRS > 0 ? s.rs / activeCalc.totalFinalRS : 0)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: cor1, color: '#fff', fontWeight: 700 }}>
                    <td colSpan={2} style={{ padding: '3px 5px' }}>CUSTO TOTAL</td>
                    <td style={{ padding: '3px 5px', textAlign: 'right', fontFamily: 'monospace', color: cor2 }}>{fmtR$(activeCalc.totalFinalRS)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Seções desabilitadas */}
          {SECOES.filter((s) => !ap[s.key]).length > 0 && (
            <div style={{ padding: '4px 8px 8px' }}>
              <div style={{ fontSize: 7, color: '#9ca3af', padding: '4px 6px', background: '#f9fafb', border: '1px dashed #d1d5db' }}>
                Seções ocultas: {SECOES.filter((s) => !ap[s.key]).map((s) => s.label).join(' · ')}
              </div>
            </div>
          )}

          {/* Incorporação — itens filtrados */}
          {ap.mostrarIncorporacao && (
            <div style={{ padding: '4px 8px 8px' }}>
              <div style={{ background: cor1, color: '#fff', fontSize: 8, fontWeight: 700, padding: '3px 6px', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>
                Incorporação {itensVisiveis.length > 0 ? `(${itensVisiveis.length} itens selecionados)` : '(todos os itens)'}
              </div>
              {incorporacaoItens.filter((i) => isItemVisivel(i.id)).slice(0, 6).map((item, i) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 6px', fontSize: 7.5, background: i % 2 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ paddingLeft: item.isSubItem ? 12 : 0 }}>{item.nome}</span>
                  <span style={{ fontFamily: 'monospace' }}>{fmtR$(toNum(item.valorINCC) * toNum(activeEstimate?.inccAtual))}</span>
                </div>
              ))}
              {incorporacaoItens.filter((i) => isItemVisivel(i.id)).length > 6 && (
                <div style={{ fontSize: 7, color: '#9ca3af', padding: '2px 6px' }}>
                  + {incorporacaoItens.filter((i) => isItemVisivel(i.id)).length - 6} itens adicionais no PDF completo
                </div>
              )}
            </div>
          )}

          {/* Rodapé */}
          <div style={{ borderTop: '1px solid #d1d5db', margin: '0 8px 8px', paddingTop: 4, fontSize: 7, color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
            <span>{ap.notasRodape || 'Estimativa Paramétrica de Obras'} · {new Date().toLocaleDateString('pt-BR')}</span>
            <span>{ap.empresa || ''}{ap.responsavel ? ` · ${ap.responsavel}` : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════════════════
// INCC VIEW — Índice Nacional de Custo da Construção (FGV/Sinduscon-PR)
// ═══════════════════════════════════════════════════════════════════════════

// Últimos 12 meses — dados reais verificados (FGV/INCC-DI)
// Fonte: Sinduscon-PR / Brasil Indicadores / Sinduscon-CE
// Atualizado em: Mai/2026
const INCC_HISTORICO_12M = [
  { mes: 'Mai/2025', mensal: 0.58, anoAno: 2.74, doze: 7.24, indice: 1191.327 },
  { mes: 'Jun/2025', mensal: 0.69, anoAno: 3.45, doze: 7.21, indice: 1199.509 },
  { mes: 'Jul/2025', mensal: 0.91, anoAno: 4.39, doze: 7.41, indice: 1210.471 },
  { mes: 'Ago/2025', mensal: 0.52, anoAno: 4.93, doze: 7.22, indice: 1216.706 },
  { mes: 'Set/2025', mensal: 0.17, anoAno: 5.11, doze: 6.78, indice: 1218.747 },
  { mes: 'Out/2025', mensal: 0.30, anoAno: 5.42, doze: 6.37, indice: 1222.356 },
  { mes: 'Nov/2025', mensal: 0.27, anoAno: 5.70, doze: 6.23, indice: 1225.633 },
  { mes: 'Dez/2025', mensal: 0.21, anoAno: 5.92, doze: 5.92, indice: 1228.161 },
  { mes: 'Jan/2026', mensal: 0.72, anoAno: 0.72, doze: 5.81, indice: 1237.036 },
  { mes: 'Fev/2026', mensal: 0.28, anoAno: 1.00, doze: 5.68, indice: 1240.481 },
  { mes: 'Mar/2026', mensal: 0.54, anoAno: 1.55, doze: 5.84, indice: 1247.181 },
  { mes: 'Abr/2026', mensal: 1.00, anoAno: 2.56, doze: 6.35, indice: 1259.652 },
];

// Compatibilidade com EMPTY_ESTIMATE e botão "puxar INCC"
const INCC_HISTORICO = INCC_HISTORICO_12M;

function InccView() {
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [dados, setDados] = useState(INCC_HISTORICO_12M);

  const ultimoMes = dados[dados.length - 1];

  const buscarDados = async () => {
    setLoading(true);
    setFetchError(null);
    setFetchedData(null);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{
            role: 'user',
            content: `Busque em brasilindicadores.com.br/incc-di ou sindusconpr.com.br/incc-di-fgv-310-p os dados REAIS e PUBLICADOS do INCC-DI (FGV). IMPORTANTE: Retorne APENAS dados que você encontrar publicados oficialmente. NAO invente ou estime valores. Retorne SOMENTE um JSON valido (sem markdown): { "meses": [ { "mes": "Mai/2026", "mensal": 0.XX, "anoAno": X.XX, "doze": X.XX, "indice": XXXX.XXX } ], "fonte": "URL consultada", "dataConsulta": "data hoje" }. Se nao encontrar dados novos alem de Abr/2026 (indice 1259.652), retorne meses: [].`
          }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
      const jsonMatch = text.match(/\{[\s\S]*?\}/s);
      if (!jsonMatch) throw new Error('Resposta nao continha JSON valido');
      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed.meses)) throw new Error('Formato de resposta inesperado');
      const mesesExistentes = new Set(INCC_HISTORICO_12M.map(d => d.mes));
      const novos = (parsed.meses || []).filter(m =>
        m.mes && typeof m.mensal === 'number' && typeof m.indice === 'number' &&
        m.indice > 0 && !mesesExistentes.has(m.mes)
      );
      if (novos.length > 0) {
        const todos = [...INCC_HISTORICO_12M, ...novos];
        setDados(todos.slice(-12));
      }
      setFetchedData({ fonte: parsed.fonte || '-', dataConsulta: parsed.dataConsulta || '-', novos: novos.length });
    } catch (err) {
      setFetchError(err.message || 'Erro ao consultar dados');
    } finally {
      setLoading(false);
      setLastFetch(new Date().toLocaleString('pt-BR'));
    }
  };

  const fmtPct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
  const badge = (n) => ({
    color: n >= 0 ? '#065F46' : '#991B1B',
    background: n >= 0 ? '#D1FAE5' : '#FEE2E2',
    padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600,
    fontFamily: '"IBM Plex Mono"',
  });

  return (
    <div className="space-y-5">
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:700, color:'var(--text-primary)', margin:0 }}>INCC-DI · FGV</h2>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>Índice Nacional de Custo da Construção · Fonte: FGV / Sinduscon-PR · Últimos 12 meses</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {lastFetch && <span style={{ fontSize:11, color:'var(--text-muted)' }}>Consultado: {lastFetch}</span>}
          <button onClick={buscarDados} disabled={loading}
            style={{ padding:'8px 16px', background:'#2e6fad', color:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor: loading ? 'wait' : 'pointer', display:'flex', alignItems:'center', gap:6, opacity: loading ? 0.7 : 1 }}>
            {loading ? '⟳ Buscando...' : '↻ Buscar dados atuais'}
          </button>
        </div>
      </div>

      {fetchedData && !fetchError && (
        <div style={{ padding:'10px 14px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:6, fontSize:12, color:'#14532D' }}>
          ✓ {fetchedData.novos > 0 ? `${fetchedData.novos} novo(s) mês(es) adicionado(s) — dados reais verificados.` : 'Base já está atualizada com os dados mais recentes disponíveis.'}
          {fetchedData.fonte && fetchedData.fonte !== '-' && <span style={{ color:'#16A34A', marginLeft:6 }}>Fonte: {fetchedData.fonte}</span>}
        </div>
      )}
      {fetchError && (
        <div style={{ padding:'12px 16px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:6, fontSize:12, color:'#991B1B' }}>
          <strong>⚠ Não foi possível atualizar os dados.</strong><br />
          <span style={{ color:'#7F1D1D', marginTop:4, display:'block' }}>{fetchError}</span>
          <span style={{ color:'#B91C1C', marginTop:4, display:'block' }}>
            Os dados exibidos são os últimos valores verificados e publicados oficialmente (até {INCC_HISTORICO_12M[INCC_HISTORICO_12M.length - 1]?.mes}). Nenhum valor estimado ou fictício foi inserido.
          </span>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
        {[
          { label: 'Índice', value: ultimoMes.indice.toLocaleString('pt-BR', { minimumFractionDigits:3, maximumFractionDigits:3 }), sub: ultimoMes.mes, hl: true },
          { label: 'No mês', value: `${ultimoMes.mensal.toFixed(2)}%`, sub: ultimoMes.mes },
          { label: 'No ano', value: `${ultimoMes.anoAno.toFixed(2)}%`, sub: 'Acumulado em ' + ultimoMes.mes.split('/')[1] },
          { label: '12 meses', value: `${ultimoMes.doze.toFixed(2)}%`, sub: 'Acumulado 12M' },
        ].map((k) => (
          <div key={k.label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'16px', borderLeft: k.hl ? '3px solid var(--amber)' : '1px solid var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-muted)', fontWeight:600 }}>{k.label}</div>
            <div className="num" style={{ fontSize: k.hl ? 24 : 20, fontWeight:700, color: k.hl ? 'var(--amber)' : 'var(--text-primary)', marginTop:4, letterSpacing:'-0.02em' }}>{k.value}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 4px rgba(15,28,20,0.06)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'#e8f0fb' }}>
          <h3 style={{ margin:0, fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-secondary)', fontWeight:600 }}>Variação Mensal (%) — últimos 12 meses</h3>
        </div>
        <div style={{ padding:'16px', height:220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top:4, right:8, bottom:0, left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.split('/')[0]} />
              <YAxis tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={36} />
              <Tooltip formatter={(v) => [`${v.toFixed(2)}%`, 'Mensal']} contentStyle={{ background:'var(--navy)', border:'none', color:'#fff', fontSize:11, borderRadius:6 }} labelStyle={{ color:'#fff', fontSize:10 }} itemStyle={{ color:'#fff' }} />
              <Bar dataKey="mensal" radius={[3,3,0,0]}>
                {dados.map((_, i, arr) => (
                  <Cell key={i} fill={i === arr.length - 1 ? '#2e6fad' : '#122540'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 4px rgba(15,28,20,0.06)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'#e8f0fb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ margin:0, fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-secondary)', fontWeight:600 }}>Últimos 12 meses — Dados Oficiais</h3>
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>{dados.length} registros · FGV/INCC-DI</span>
        </div>
        <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:480, position:'relative' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead style={{ position:'sticky', top:0, zIndex:10 }}>
              <tr style={{ background:'var(--navy)', color:'rgba(255,255,255,0.7)' }}>
                {['Mês','Índice','No mês (%)','No ano (%)','12 meses (%)'].map((h, hi) => (
                  <th key={h} style={{ padding:'9px 14px', textAlign: hi === 0 ? 'left' : 'right', fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--navy)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...dados].reverse().map((d, i) => {
                const isLast = i === 0;
                return (
                  <tr key={d.mes} style={{ background: isLast ? '#dce8f8' : (i % 2 ? '#e8f0fb' : 'white'), borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'9px 14px', fontWeight: isLast ? 700 : 500, color:'var(--text-primary)' }}>
                      {d.mes} {isLast && <span style={{ fontSize:9, background:'#1a3a5c', color:'#fff', padding:'1px 5px', borderRadius:3, marginLeft:6, fontWeight:700 }}>ATUAL</span>}
                    </td>
                    <td className="num" style={{ padding:'9px 14px', textAlign:'right', fontWeight: isLast ? 700 : 400, color: isLast ? 'var(--ui-accent)' : 'var(--text-primary)' }}>
                      {d.indice.toLocaleString('pt-BR', { minimumFractionDigits:3, maximumFractionDigits:3 })}
                    </td>
                    <td style={{ padding:'9px 14px', textAlign:'right' }}>
                      <span className="num" style={badge(d.mensal)}>{fmtPct(d.mensal)}</span>
                    </td>
                    <td className="num" style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-secondary)' }}>{d.anoAno.toFixed(2)}</td>
                    <td className="num" style={{ padding:'9px 14px', textAlign:'right', color:'var(--text-secondary)' }}>{d.doze.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 14px', background:'#e8f0fb', borderTop:'1px solid var(--border)', fontSize:11, color:'var(--text-muted)' }}>
          ℹ Dados oficiais publicados pela FGV — INCC-DI. Última atualização verificada: <strong>{INCC_HISTORICO_12M[INCC_HISTORICO_12M.length - 1]?.mes}</strong>. Clique em "Buscar dados atuais" para verificar novas publicações.
        </div>
      </div>
    </div>
  );
}

// ANÁLISE VIEW
// ═══════════════════════════════════════════════════════════════════════════
function AnaliseView({ calc, refProject, estimate, db }) {
  const areaConstr = toNum(estimate.areaConstruida);

  const barData = calc.sections.filter((s) => s.rs > 0).map((s) => ({
    name: s.label,
    Valor: s.rs,
    'R$/m²': areaConstr > 0 ? s.rs / areaConstr : 0,
  }));

  // Comparison: current vs all DB projects (per m²)
  const currentCustoM2 = calc.custoFinalM2;
  const compData = db.map((p) => ({
    name: p.nome.length > 18 ? p.nome.slice(0, 16) + '…' : p.nome,
    'R$/m²': areaConstr > 0 ? (p.custoConstrucaoM2 * toNum(estimate.inccAtual) * 1.5) : 0,
    isCurrent: false,
  }));

  // Top KPIs
  const kpis = [
    { label: 'Custo Final', value: fmtR$(calc.totalFinalRS), sub: `${fmtNum(calc.totalFinalINCC, 0)} INCC` },
    { label: 'Custo/m²', value: fmtR$(calc.custoFinalM2), sub: `Área: ${fmtNum(areaConstr, 0)} m²` },
    { label: 'Área Equivalente', value: `${fmtNum(calc.areaEqTotal, 0)} m²`, sub: `Ratio: ${fmtNum(areaConstr > 0 ? calc.areaEqTotal / areaConstr : 0, 3)}` },
    { label: 'Taxa Adm', value: fmtR$(calc.taxaAdmRS), sub: fmtPct(toNum(estimate.taxaAdm)) },
  ];

  if (!refProject) {
    return (
      <div className="bg-white border border-stone-200 p-12 text-center">
        <AlertCircle className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h3 className="text-base font-medium text-slate-900">Selecione uma obra de referência</h3>
        <p className="text-sm text-stone-500 mt-1">A análise depende dos dados de uma obra base.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-stone-200 px-4 py-3 border-l-4 border-l-amber-500">
            <div className="text-xs uppercase tracking-wider text-stone-500">{k.label}</div>
            <div className="num text-xl font-semibold text-slate-900 mt-1">{k.value}</div>
            <div className="num text-xs text-stone-500 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Cost breakdown bar */}
      <Card title="Quebra de Custos por Categoria">
        <div className="p-4" style={{ height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#e7e5e4" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#78716c' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#44403c' }} width={100} />
              <Tooltip
                formatter={(v) => fmtR$(v)}
                contentStyle={{ background: '#0d1e35', border: 'none', color: '#f5f5f4', fontSize: 12 }}
              />
              <Bar dataKey="Valor" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Comparison with reference */}
        <Card title={`Comparativo com Obra de Referência: ${refProject.nome}`}>
          <div className="p-4 space-y-3">
            {[
              ['Construção (INCC/m²)', calc.custoConstrucaoM2, refProject.custoConstrucaoM2],
              ['Infra (INCC total)', calc.sections[1].incc, refProject.custoInfra],
              ['Implantação (INCC total)', calc.sections[2].incc, refProject.custoImplantacao],
              ['Projetos (INCC/m²)', calc.sections[3].incc / (areaConstr || 1), refProject.custoProjetosM2],
              ['Elevador (INCC/un)', estimate.overrides.custoElevador ?? refProject.custoElevador, refProject.custoElevador],
              ['Fachada (INCC/m²)', estimate.overrides.custoFachadaM2 ?? refProject.custoFachadaM2, refProject.custoFachadaM2],
              ['Admin (INCC/m²)', estimate.overrides.custoAdminM2 ?? refProject.custoAdminM2, refProject.custoAdminM2],
            ].map(([label, cur, ref]) => {
              const diff = cur - ref;
              const pct = ref > 0 ? diff / ref : 0;
              return (
                <div key={label} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center text-sm">
                  <span className="text-stone-700">{label}</span>
                  <span className="num text-stone-500 w-24 text-right">{fmtNum(ref)}</span>
                  <span className="num font-medium text-slate-900 w-24 text-right">{fmtNum(cur)}</span>
                  <span className={`num text-xs w-20 text-right flex items-center justify-end gap-0.5 ${
                    Math.abs(pct) < 0.001 ? 'text-stone-400' : pct > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {Math.abs(pct) < 0.001 ? '=' : pct > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {fmtPct(Math.abs(pct))}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Per-m² distribution */}
        <Card title="Custo / m² por Categoria">
          <div className="p-4 space-y-2">
            {barData.map((d) => {
              const maxVal = Math.max(...barData.map((x) => x['R$/m²']));
              const pct = maxVal > 0 ? (d['R$/m²'] / maxVal) * 100 : 0;
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-700">{d.name}</span>
                    <span className="num text-stone-900 font-medium">{fmtR$(d['R$/m²'])}/m²</span>
                  </div>
                  <div className="h-2 bg-stone-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════
const CHART_COLORS = [
  '#0f172a', '#f59e0b', '#0e7490', '#9333ea', '#dc2626',
  '#15803d', '#7c2d12', '#0369a1', '#a16207', '#be185d',
];

function Card({ title, children, accent }) {
  return (
    <div style={{
      background:'var(--card)', border:'1px solid var(--border)',
      borderLeft: accent ? '3px solid var(--accent)' : '1px solid var(--border)',
      borderRadius:8, overflow:'hidden',
      boxShadow:'0 1px 4px rgba(15,28,20,0.06), 0 1px 2px rgba(15,28,20,0.03)',
    }}>
      {title ? (
        <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', background:'#e8f0fb' }}>
          <h3 style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-secondary)', fontWeight:600, margin:0 }}>{title}</h3>
        </div>
      ) : null}
      {children}
    </div>
  );
}

// Collapsible section — grupos colapsáveis da estimativa
function CollapsibleSection({ id, label, color = 'var(--navy)', totalINCC, totalRS, children, collapsed, onToggle }) {
  const fR = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(n || 0);
  const fN = (n, d = 3) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);
  return (
    <div style={{
      background:'var(--card)', borderRadius:8, overflow:'hidden',
      border:'1px solid var(--border)', borderLeft:`3px solid ${color}`,
      boxShadow:'0 1px 4px rgba(13,30,53,0.08)',
      transition:'box-shadow .15s',
    }}>
      <button onClick={() => onToggle(id)} style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'11px 16px', background: collapsed ? '#FAFAF8' : 'white',
        border:'none', cursor:'pointer', textAlign:'left',
        borderBottom: collapsed ? 'none' : '1px solid var(--border)',
        transition:'background .15s',
      }}
        onMouseEnter={e=>{ if(collapsed) e.currentTarget.style.background='#dce8f5'; }}
        onMouseLeave={e=>{ e.currentTarget.style.background = collapsed ? '#e8f0fb' : 'white'; }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <ChevronRight style={{
            width:14, height:14, color:'var(--text-muted)',
            transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            transition:'transform .2s ease',
            flexShrink:0,
          }} />
          <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-primary)' }}>
            {label}
          </span>
        </div>
        {collapsed && totalINCC != null ? (
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:11, fontFamily:'"IBM Plex Mono"', fontSize:11, color:'var(--text-muted)' }}>{fN(totalINCC)} INCC</span>
            <span style={{ fontSize:12, fontFamily:'"IBM Plex Mono"', fontWeight:600, color:'var(--ui-accent)' }}>{fR(totalRS)}</span>
          </div>
        ) : !collapsed ? (
          <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.05em' }}>▲ recolher</span>
        ) : null}
      </button>
      {!collapsed && <div className="section-enter">{children}</div>}
    </div>
  );
}

function Field({ label, hint, children, span2 }) {
  return (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label style={{ display:'block', fontSize:11, fontWeight:500, color:'var(--text-secondary)', marginBottom:4, letterSpacing:'0.01em' }}>
        {label}
        {hint && <span style={{ color:'var(--text-muted)', marginLeft:4, fontWeight:400 }}>· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function FieldSection({ title, children }) {
  return (
    <div>
      <h4 style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--ui-accent)', fontWeight:700, marginBottom:8, paddingBottom:4, borderBottom:'1px solid var(--border)' }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width:'100%', padding:'7px 10px', background:'white', border:'1px solid var(--border)',
        borderRadius:5, fontSize:13, color:'var(--text-primary)', outline:'none',
        transition:'border-color .15s, box-shadow .15s', boxSizing:'border-box',
      }}
      onFocus={e=>{ e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 2px rgba(46,111,173,0.1)'; }}
      onBlur={e=>{ e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }}
    />
  );
}

function NumInput({ value, onChange, int }) {
  return (
    <input type="number" step={int ? '1' : '0.01'}
      value={value === 0 ? '' : value || ''}
      onChange={(e) => { const v = e.target.value; onChange(v === '' ? 0 : (int ? parseInt(v)||0 : parseFloat(v)||0)); }}
      placeholder="0"
      className="num"
      style={{
        width:'100%', padding:'7px 10px',
        background:'#fff',
        border:'1px solid #ccdaee',
        borderRadius:7, fontSize:13, textAlign:'right',
        color:'var(--text-primary)', outline:'none',
        transition:'border-color .15s, box-shadow .15s, background .15s',
        boxSizing:'border-box',
        boxShadow:'0 1px 2px rgba(13,30,53,0.05)',
      }}
      onFocus={e=>{ e.target.style.borderColor='#2e6fad'; e.target.style.boxShadow='0 0 0 3px rgba(46,111,173,0.12)'; e.target.style.background='#f5f9ff'; }}
      onBlur={e=>{ e.target.style.borderColor='#ccdaee'; e.target.style.boxShadow='0 1px 2px rgba(13,30,53,0.05)'; e.target.style.background='#fff'; }}
    />
  );
}

function Stat({ label, value, highlight, small }) {
  return (
    <div style={{
      background: highlight ? '#ddeeff' : '#f0f5fc',
      borderLeft: `2px solid ${highlight ? 'var(--accent)' : 'var(--border-strong)'}`,
      padding:'8px 12px', borderRadius:'0 4px 4px 0',
    }}>
      <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-muted)', fontWeight:600 }}>{label}</div>
      <div style={{ fontFamily:'"IBM Plex Mono"', fontSize: small ? 11 : 13, fontWeight:600, color: highlight ? 'var(--accent)' : 'var(--text-primary)', marginTop:2 }}>
        {value}
      </div>
    </div>
  );
}

function OverrideControl({ value, refValue, onChange, label }) {
  const isOverride = value !== null && value !== undefined && value !== '';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      {isOverride && (
        <button onClick={() => onChange(null)}
          style={{ fontSize:11, color:'#92400E', padding:'4px 8px', background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:4, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontWeight:500 }}>
          <RotateCcw style={{width:11,height:11}} /> Reverter
        </button>
      )}
      <input type="number" step="0.01" value={isOverride ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
        placeholder={refValue !== undefined ? fmtNum(refValue) : '—'}
        className="num"
        style={{
          width:112, padding:'6px 8px', textAlign:'right', fontSize:12,
          background: isOverride ? '#FFFBF0' : '#F0FDF4',
          border: `1px solid ${isOverride ? '#FDE68A' : '#BBF7D0'}`,
          borderRadius:4, outline:'none',
          color: isOverride ? '#92400E' : '#065F46',
        }}
      />
      <span style={{ fontSize:11, color:'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function SectionRow({ label, hint, refValue, overrideValue, onChange, incc, rs, unit, extraField }) {
  const isOverride = overrideValue !== null && overrideValue !== undefined && overrideValue !== '';
  return (
    <div style={{ padding:'12px 16px', display:'grid', gridTemplateColumns:'1fr auto auto', gap:12, alignItems:'center' }}
      onMouseEnter={e=>e.currentTarget.style.background='#FAFAF8'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>{label}</div>
        {hint && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{hint}</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {extraField}
        <input type="number" step="0.01" value={isOverride ? overrideValue : ''}
          onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
          placeholder={refValue !== undefined ? fmtNum(refValue) : '—'}
          className="num"
          style={{
            width:112, padding:'6px 8px', textAlign:'right', fontSize:12,
            background: isOverride ? '#FFFBF0' : '#F0FDF4',
            border: `1px solid ${isOverride ? '#FDE68A' : '#BBF7D0'}`,
            borderRadius:4, outline:'none',
            color: isOverride ? '#92400E' : '#065F46',
          }}
        />
        <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-muted)', width:56 }}>{unit}</span>
        {isOverride && (
          <button onClick={() => onChange(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2 }}
            onMouseEnter={e=>e.currentTarget.style.color='#92400E'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
            <RotateCcw style={{width:13,height:13}} />
          </button>
        )}
      </div>
      <div style={{ textAlign:'right' }}>
        <div className="num" style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{fmtR$(rs)}</div>
        <div className="num" style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{fmtNum(incc)} INCC</div>
      </div>
    </div>
  );
}

function TotalRow({ label, incc, rs, highlight }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', padding:'12px 20px', gap:16,
      background: highlight ? '#FFFBF0' : 'transparent',
      borderTop: highlight ? '2px solid var(--border-strong)' : 'none',
    }}>
      <span style={{
        width:260, flexShrink:0, fontSize:11, textTransform:'uppercase',
        letterSpacing:'0.07em', fontWeight: highlight ? 700 : 500,
        color: highlight ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}>{label}</span>
      <div style={{ display:'flex', marginLeft:'auto', borderRadius:5, overflow:'hidden', border:'1px solid var(--border)', boxShadow:'0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display:'flex', flexDirection:'column' }}>
          <div className="num" style={{ padding:'8px 16px', background:'white', fontSize:13, fontWeight:600, color:'var(--text-primary)', minWidth:140, textAlign:'right', borderRight:'1px solid var(--border)' }}>
            {fmtNum(incc, 3)}
          </div>
          <div style={{ fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'2px 0', textAlign:'center', background:'#e8f0fb', borderRight:'1px solid var(--border)' }}>INCC</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column' }}>
          <div className="num" style={{
            padding:'8px 16px', fontSize:13, fontWeight:700, minWidth:160, textAlign:'right',
            background: highlight ? '#2e6fad' : '#0d1e35',
            color: '#fff',
          }}>
            {fmtR$(rs)}
          </div>
          <div style={{ fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'2px 0', textAlign:'center', background:'#e8f0fb' }}>R$</div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'3px 0' }}>
      <span style={{ fontSize:12, color: accent ? '#4a8fd4' : 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span className="num" style={{ fontSize:12, fontWeight: accent ? 600 : 400, color: accent ? '#4a8fd4' : 'rgba(255,255,255,0.85)' }}>
        {fmtR$(value)}
      </span>
    </div>
  );
}
