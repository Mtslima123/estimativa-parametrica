import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, RadialBarChart, RadialBar, LineChart, Line,
} from 'recharts';
import {
  Calculator, Database, BarChart3, Plus, Trash2, Edit2, X, Save, Download,
  Upload, RotateCcw, ChevronRight, Building2, AlertCircle, Check,
  Sparkles, FileDown, ArrowDown, ArrowUp, Search,
} from 'lucide-react';

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
export default function EstimativaApp() {
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
      try {
        const dbRes = await window.storage.get('obras_db');
        if (dbRes?.value) setDb(JSON.parse(dbRes.value));
      } catch {}
      try {
        const pdbRes = await window.storage.get('projetos_db');
        if (pdbRes?.value) {
          const parsed = JSON.parse(pdbRes.value);
          // Verifica se os dados têm a estrutura correta (custoINCCM2 presente)
          const valid = parsed.filter(r => r.especialidade && typeof r.custoINCCM2 === 'number' && r.custoINCCM2 > 0);
          if (valid.length >= 50) {
            // Base parece correta — usa os dados salvos
            setProjectsDb(parsed);
          } else {
            // Dados inválidos/antigos — restaura o seed padrão
            setProjectsDb(PROJETOS_REAIS_SEED);
          }
        } else {
          setProjectsDb(PROJETOS_REAIS_SEED);
        }
      } catch {
        setProjectsDb(PROJETOS_REAIS_SEED);
      }
      try {
        const edbRes = await window.storage.get('elevadores_db');
        if (edbRes?.value) setElevatorsDb(JSON.parse(edbRes.value));
      } catch {}
      try {
        const idbRes = await window.storage.get('implantacao_db');
        if (idbRes?.value) setImplantacaoDb(JSON.parse(idbRes.value));
      } catch {}
      try {
        const fdbRes = await window.storage.get('fundacao_db');
        if (fdbRes?.value) setFundacaoDb(JSON.parse(fdbRes.value));
      } catch {}
      try {
        const estRes = await window.storage.get('current_estimate');
        if (estRes?.value) setEstimate({ ...EMPTY_ESTIMATE, ...JSON.parse(estRes.value) });
      } catch {}
      try {
        const apRes = await window.storage.get('apresentacao');
        if (apRes?.value) setApresentacao({ ...DEFAULT_APRESENTACAO, ...JSON.parse(apRes.value) });
      } catch {}
      try {
        const seRes = await window.storage.get('saved_estimates');
        if (seRes?.value) setSavedEstimates(JSON.parse(seRes.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // ─── Save db ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    window.storage.set('obras_db', JSON.stringify(db)).catch(() => {});
  }, [db, loaded]);

  // ─── Save projects db ─────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    window.storage.set('projetos_db', JSON.stringify(projectsDb)).catch(() => {});
  }, [projectsDb, loaded]);

  // ─── Save elevators db ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    window.storage.set('elevadores_db', JSON.stringify(elevatorsDb)).catch(() => {});
  }, [elevatorsDb, loaded]);

  // ─── Save implantacao db ──────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    window.storage.set('implantacao_db', JSON.stringify(implantacaoDb)).catch(() => {});
  }, [implantacaoDb, loaded]);

  // ─── Save fundacao db ─────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    window.storage.set('fundacao_db', JSON.stringify(fundacaoDb)).catch(() => {});
  }, [fundacaoDb, loaded]);

  // ─── Save estimate (debounced) ────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      window.storage.set('current_estimate', JSON.stringify(estimate)).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [estimate, loaded]);

  // ─── Save apresentacao ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      window.storage.set('apresentacao', JSON.stringify(apresentacao)).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [apresentacao, loaded]);

  // ─── Save savedEstimates ──────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    window.storage.set('saved_estimates', JSON.stringify(savedEstimates)).catch(() => {});
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

  // ─── Saved Estimates CRUD ─────────────────────────────────────────────
  const saveCurrentEstimate = (nome) => {
    const id = Date.now();
    const saved = {
      id,
      nome: nome || estimate.nome || `Estimativa ${new Date().toLocaleDateString('pt-BR')}`,
      savedAt: new Date().toISOString(),
      totalFinalRS: calc.totalFinalRS,
      areaConstruida: toNum(estimate.areaConstruida),
      data: { ...estimate },
    };
    setSavedEstimates((prev) => [saved, ...prev]);
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
  const deleteEstimate = (id) => {
    setSavedEstimates((prev) => prev.filter((e) => e.id !== id));
    if (currentSavedId === id) setCurrentSavedId(null);
    showToast('Estimativa removida', 'warn');
  };
  const duplicateEstimate = (saved) => {
    const id = Date.now();
    setSavedEstimates((prev) => [{ ...saved, id, nome: `${saved.nome} (cópia)`, savedAt: new Date().toISOString() }, ...prev]);
    showToast('Estimativa duplicada');
  };
  const updateEstimateName = (id, nome) => {
    setSavedEstimates((prev) => prev.map((e) => e.id === id ? { ...e, nome } : e));
  };

  const updateCurrentEstimate = () => {
    if (!currentSavedId) return;
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
          --navy: #0A1628;
          --navy-light: #0F2040;
          --amber: #F59E0B;
          --amber-dim: #92400E;
          --surface: #F6F6F3;
          --card: #FFFFFF;
          --border: #E4E4E0;
          --border-strong: #C9C9C3;
          --text-primary: #111827;
          --text-secondary: #4B5563;
          --text-muted: #9CA3AF;
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
      `}</style>

      {/* ─── HEADER ─── */}
      <header style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-[1600px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div style={{ width:34, height:34, background:'var(--amber)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4 }}>
                <Building2 style={{ width:18, height:18, color:'#0A1628' }} />
              </div>
              <div>
                <h1 style={{ fontSize:14, fontWeight:700, letterSpacing:'0.08em', color:'#fff', textTransform:'uppercase' }}>
                  Estimativa Paramétrica
                </h1>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:1, fontWeight:400 }}>
                  {currentSavedId
                    ? <span>Editando: <span style={{ color:'var(--amber)', fontWeight:500 }}>{savedEstimates.find(e => e.id === currentSavedId)?.nome}</span></span>
                    : 'Engenharia de Custos · Base Histórica'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label style={{ fontSize:11, color:'rgba(255,255,255,0.45)', cursor:'pointer', padding:'6px 12px', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', gap:6, borderRadius:4, fontWeight:500, transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}>
              <Upload style={{ width:13, height:13 }} /> Importar
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button onClick={exportData}
              style={{ fontSize:11, color:'rgba(255,255,255,0.45)', padding:'6px 12px', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', gap:6, background:'transparent', cursor:'pointer', borderRadius:4, fontWeight:500 }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}>
              <Download style={{ width:13, height:13 }} /> Backup
            </button>

            {currentSavedId && (
              <button onClick={updateCurrentEstimate}
                style={{ fontSize:11, fontWeight:600, padding:'6px 14px', background:'#059669', color:'#fff', border:'none', cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:6 }}
                onMouseEnter={e=>e.currentTarget.style.background='#047857'}
                onMouseLeave={e=>e.currentTarget.style.background='#059669'}>
                <Save style={{ width:13, height:13 }} /> Atualizar
              </button>
            )}
            <button onClick={() => setSaveModalOpen(true)}
              style={{ fontSize:11, fontWeight:600, padding:'6px 14px', background:'#065F46', color:'#fff', border:'1px solid #059669', cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:6 }}
              onMouseEnter={e=>e.currentTarget.style.background='#047857'}
              onMouseLeave={e=>e.currentTarget.style.background='#065F46'}>
              <Save style={{ width:13, height:13 }} /> Salvar
            </button>

            {confirmReset ? (
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:11, color:'#FCA5A5' }}>Confirmar?</span>
                <button onClick={resetEstimate}
                  style={{ fontSize:11, padding:'6px 10px', background:'#DC2626', color:'#fff', border:'none', cursor:'pointer', borderRadius:4 }}>Sim</button>
                <button onClick={() => setConfirmReset(false)}
                  style={{ fontSize:11, padding:'6px 10px', background:'transparent', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer', borderRadius:4 }}>Não</button>
              </span>
            ) : (
              <button onClick={() => setConfirmReset(true)}
                style={{ fontSize:11, color:'rgba(255,255,255,0.35)', padding:'6px 12px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:6 }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(239,68,68,0.5)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
                <RotateCcw style={{ width:12, height:12 }} /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* ─── NAV TABS ─── */}
        <div className="max-w-[1600px] mx-auto px-6" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <nav style={{ display:'flex', gap:0 }}>
            {[
              { id: 'estimativa',   label: 'Estimativa',        icon: Calculator },
              { id: 'estimativas',  label: 'Estimativas Salvas', icon: Save },
              { id: 'baseDados',    label: 'Base de Dados',      icon: Database },
              { id: 'apresentacao', label: 'Apresentação',       icon: FileDown },
              { id: 'analise',      label: 'Análise',            icon: BarChart3 },
              { id: 'incc',         label: 'INCC',               icon: Calculator },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{
                    padding:'10px 18px', fontSize:12, fontWeight: active ? 600 : 400,
                    color: active ? 'var(--amber)' : 'rgba(255,255,255,0.45)',
                    borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
                    background: 'transparent', border: 'none', borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
                    cursor:'pointer', display:'flex', alignItems:'center', gap:7,
                    transition:'color .15s', letterSpacing:'0.01em',
                  }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.color='rgba(255,255,255,0.75)'; }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}
                >
                  <Icon style={{ width:14, height:14 }} /> {t.label}
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
          background: toast.type === 'err' ? '#FEF2F2' : toast.type === 'warn' ? '#FFFBEB' : '#F0FDF4',
          color: toast.type === 'err' ? '#991B1B' : toast.type === 'warn' ? '#92400E' : '#14532D',
          borderLeft: `3px solid ${toast.type === 'err' ? '#DC2626' : toast.type === 'warn' ? '#F59E0B' : '#16A34A'}`,
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
        <Card title="Configuração" accent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <Field label="Obra de Referência" hint="Define os indicadores base">
              <select
                value={estimate.refProjectId || ''}
                onChange={(e) => updateEst({ refProjectId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                  className="num flex-1 px-3 py-2 bg-amber-50 border border-amber-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-right"
                />
                <button
                  onClick={() => {
                    const ultimo = INCC_HISTORICO[INCC_HISTORICO.length - 1];
                    if (ultimo) updateEst({ inccAtual: ultimo.indice });
                  }}
                  style={{ fontSize:11, fontWeight:600, padding:'6px 10px', background:'var(--navy)', color:'var(--amber)', border:'none', borderRadius:4, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}
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
        <Card title="Informações do Empreendimento">
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
                className="w-full px-2 py-1.5 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
        <Card title="Custo de Construção · Cálculo de Áreas">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-sm flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="text-stone-600">Custo INCC/m² eq.:</span>
              <span className="num font-semibold text-slate-900">
                {fmtNum(calc.custoConstrucaoM2)}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600">R$/m² atualizado:</span>
              <span className="num font-semibold text-amber-700">
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
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 hover:bg-amber-100"
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
                    <tr key={row.id} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
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
                            className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-amber-500 focus:outline-none text-sm text-stone-800"
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
                          className="num w-full px-2 py-1 text-right bg-amber-50 border border-amber-200 focus:outline-none focus:border-amber-500 text-sm"
                          placeholder="0"
                        />
                      </td>

                      {/* Coef */}
                      <td className="px-3 py-1.5">
                        <input
                          type="number" step="0.01"
                          value={list[i]?.coef ?? ''}
                          onChange={(e) => updateField('coef', e.target.value)}
                          className={`num w-full px-2 py-1 text-right text-sm border focus:outline-none focus:border-amber-500 ${
                            usingRef
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-amber-50 border-amber-200'
                          }`}
                          placeholder={fmtNum(row.defaultCoef ?? 1.00)}
                        />
                      </td>

                      <td className="px-3 py-2 text-right num text-stone-600">{fmtNum(row.areaEq)}</td>
                      <td className="px-3 py-2 text-right num text-stone-700">{fmtNum(row.areaEq * calc.custoConstrucaoM2)}</td>
                      <td className="px-4 py-2 text-right num font-medium text-slate-900">
                        {fmtR$(row.areaEq * calc.custoConstrucaoM2 * toNum(estimate.inccAtual))}
                      </td>

                      {/* Excluir */}
                      <td className="px-2 py-1.5 text-center">
                        <button
                          onClick={remove}
                          className="p-1 text-stone-300 hover:text-rose-600 transition-colors"
                          title="Excluir pavimento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                  <td className="px-4 py-2.5 text-right num text-amber-400">{fmtR$(calc.sections[0].rs)}</td>
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
        <Card title="Implantação da Obra · Detalhamento">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-end gap-2">
            <button
              onClick={() => updateEst({
                implantacaoItems: [...(estimate.implantacaoItems || []), { nome: '', valorINCC: 0, _picking: true }],
              })}
              className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 hover:bg-amber-100"
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
                    <tr key={i} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
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
                              className="flex-1 px-2 py-1 bg-white border border-amber-400 text-sm focus:outline-none focus:border-amber-500"
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
                            className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-amber-500 focus:outline-none text-sm text-stone-800"
                          />
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number" step="0.01"
                          value={valorINCC === 0 ? '' : valorINCC}
                          onChange={(e) => updateItem({ valorINCC: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="num w-full px-2 py-1 text-right bg-amber-50 border border-amber-200 focus:outline-none focus:border-amber-500 text-sm"
                        />
                      </td>
                      <td className="px-3 py-1.5 text-right num text-stone-700">
                        {fmtR$(valorRS)}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          onClick={() => updateEst({
                            implantacaoItems: estimate.implantacaoItems.filter((_, j) => j !== i),
                          })}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                  <td className="px-3 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[2].rs)}</td>
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
        <Card title="Projetos e Consultorias · Detalhamento">
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
              <span className="num font-semibold text-amber-700">{fmtR$(calc.sections[3].rs)}</span>
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
              className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 hover:bg-amber-100"
            >
              <Plus className="w-3 h-3" /> Adicionar especialidade
            </button>
          </div>

          {toNum(estimate.areaConstruida) === 0 && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-center gap-2">
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
                  <td className="px-3 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[3].rs)}</td>
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
                      className="num px-2 py-1.5 bg-emerald-50 border border-emerald-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 w-52">
                      <option value="">— Selecione —</option>
                      {tiposFundacao.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {calc.infraFundacaoRec && <span className="text-xs text-stone-400 italic ml-3">ref: {calc.infraFundacaoRec.obra} · coef {fmtNum(calc.infraFundacaoRec.coeficiente, 3)}</span>}
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Área Proj. Torre</td>
                  <td className="px-4 py-2">
                    <span className="num text-sm font-medium text-stone-700">{toNum(estimate.areaProjTorre) > 0 ? `${fmtNum(toNum(estimate.areaProjTorre), 2)} m²` : '—'}</span>
                    <span className="text-xs text-stone-400 ml-2 italic">definido em Informações</span>
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Nº Pavimentos</td>
                  <td className="px-4 py-2">
                    <span className="num text-sm font-medium text-stone-700">{toNum(estimate.numPavtos) > 0 ? estimate.numPavtos : '—'}</span>
                    <span className="text-xs text-stone-400 ml-2 italic">definido em Informações</span>
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Tipo de Contenção</td>
                  <td className="px-4 py-2">
                    <input type="text" value={estimate.infraTipoContencao || ''} onChange={(e) => updateEst({ infraTipoContencao: e.target.value })}
                      placeholder="— a definir (base futura) —"
                      className="px-2 py-1.5 bg-emerald-50 border border-emerald-300 text-sm text-slate-900 focus:outline-none focus:border-amber-500 w-52 placeholder-stone-300" />
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Infraestrutura</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[1].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[1].rs)}</td>
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
                      className="num px-2 py-1.5 bg-emerald-50 border border-emerald-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 w-52">
                      <option value="">— Selecione —</option>
                      {(elevatorsDb || []).filter(r => r.valorFechado > 0 && r.inccBase > 0).map((r) => (
                        <option key={r.id} value={r.obra}>{r.obra}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Marca</td>
                  <td className="px-4 py-2 text-sm font-medium text-stone-700">{calc.elevDbRec?.marca || '—'}</td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Nº de Paradas</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <input type="number" step="1" min="0"
                        value={estimate.elevNumParadas !== null && estimate.elevNumParadas !== undefined && estimate.elevNumParadas !== '' ? estimate.elevNumParadas : calc.elevNumParadasAuto}
                        onChange={(e) => updateEst({ elevNumParadas: e.target.value === '' ? null : parseInt(e.target.value) || 0 })}
                        className="num w-24 px-2 py-1.5 bg-amber-50 border border-amber-200 text-sm text-right font-semibold focus:outline-none focus:border-amber-500" />
                      <span className="text-xs text-stone-400 italic">
                        {(estimate.elevNumParadas === null || estimate.elevNumParadas === undefined || estimate.elevNumParadas === '') ? `auto (${calc.elevNumParadasAuto} pav. − 1)` : 'modificado'}
                      </span>
                      {(estimate.elevNumParadas !== null && estimate.elevNumParadas !== undefined && estimate.elevNumParadas !== '') && (
                        <button onClick={() => updateEst({ elevNumParadas: null })} className="text-xs text-stone-400 hover:text-amber-700 flex items-center gap-1"><RotateCcw className="w-3 h-3" /> auto</button>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Qt. Elevadores</td>
                  <td className="px-4 py-2">
                    <span className="num text-sm font-medium text-stone-700">{toNum(estimate.numElevadores) || '—'}</span>
                    <span className="text-xs text-stone-400 ml-2 italic">definido em Informações</span>
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                {calc.elevValorPPE_INCC !== null && (
                  <tr className="bg-white">
                    <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Val./parada/elev.</td>
                    <td className="px-4 py-2">
                      <span className="num text-sm font-semibold text-emerald-700">{fmtNum(calc.elevValorPPE_INCC, 4)} INCC</span>
                      <span className="text-xs text-stone-400 ml-2">× {calc.elevNumParadas} paradas × {toNum(estimate.numElevadores)} elev.</span>
                    </td>
                    <td className="px-3 py-2 text-right num text-stone-500">—</td>
                    <td className="px-4 py-2 text-right num text-stone-500">—</td>
                  </tr>
                )}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Elevadores</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[4].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[4].rs)}</td>
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
                      className="num w-28 px-2 py-1.5 bg-amber-50 border border-amber-200 text-right focus:outline-none focus:border-amber-500" placeholder="automático" />
                    <span className="text-xs text-stone-400 ml-2 italic">auto = {fmtNum(calc.fachadaArea, 0)} m² (perím. × altura)</span>
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Custo (INCC/m²)</td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01"
                      value={estimate.overrides.custoFachadaM2 !== null && estimate.overrides.custoFachadaM2 !== undefined ? estimate.overrides.custoFachadaM2 : ''}
                      onChange={(e) => updateOverride('custoFachadaM2', e.target.value === '' ? null : parseFloat(e.target.value))}
                      placeholder={refProject?.custoFachadaM2 !== undefined ? fmtNum(refProject.custoFachadaM2) : '—'}
                      className={`num w-36 px-2 py-1.5 text-right text-sm border focus:outline-none focus:border-amber-500 ${estimate.overrides.custoFachadaM2 !== null && estimate.overrides.custoFachadaM2 !== undefined ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`} />
                    {estimate.overrides.custoFachadaM2 !== null && estimate.overrides.custoFachadaM2 !== undefined && (
                      <button onClick={() => updateOverride('custoFachadaM2', null)} className="text-stone-400 hover:text-amber-700 ml-2"><RotateCcw className="w-3.5 h-3.5 inline" /></button>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Fachada</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[5].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[5].rs)}</td>
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
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-2 text-stone-500 font-semibold text-xs uppercase tracking-wider">Custo Total (INCC)</td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01"
                      value={estimate.overrides.custoEnsaios !== null && estimate.overrides.custoEnsaios !== undefined ? estimate.overrides.custoEnsaios : ''}
                      onChange={(e) => updateOverride('custoEnsaios', e.target.value === '' ? null : parseFloat(e.target.value))}
                      placeholder={refProject?.custoEnsaios !== undefined ? fmtNum(refProject.custoEnsaios) : '—'}
                      className={`num w-36 px-2 py-1.5 text-right text-sm border focus:outline-none focus:border-amber-500 ${estimate.overrides.custoEnsaios !== null && estimate.overrides.custoEnsaios !== undefined ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`} />
                    {estimate.overrides.custoEnsaios !== null && estimate.overrides.custoEnsaios !== undefined && (
                      <button onClick={() => updateOverride('custoEnsaios', null)} className="text-stone-400 hover:text-amber-700 ml-2"><RotateCcw className="w-3.5 h-3.5 inline" /></button>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right num text-stone-500">—</td>
                  <td className="px-4 py-2 text-right num text-stone-500">—</td>
                </tr>
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider" colSpan={2}>Total Ensaios + Sistemas</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[6].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[6].rs)}</td>
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
                          className="num w-full px-2 py-1 text-right bg-amber-50 border border-amber-200 focus:outline-none focus:border-amber-500 text-sm" />
                      </td>
                      <td className="px-4 py-2 text-right num text-stone-700 font-medium">{fmtR$(rsVal)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Administração</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[7].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[7].rs)}</td>
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
                        <tr key={item.id} style={{ background:'#F5F5F2', borderTop:'2px solid var(--border-strong)', borderBottom: isCollapsed ? '2px solid var(--border-strong)' : 'none' }}>
                          <td className="px-2 py-2 text-center" style={{ borderLeft:'3px solid var(--amber)' }}>
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
                                  width: 20, height: 20, borderRadius: 4, background: 'var(--navy)',
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
                                className="flex-1 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-500 focus:outline-none text-xs font-bold uppercase tracking-wide text-slate-900" />
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
                                  background: '#FFFBF0', border: '1px solid #FDE68A',
                                  borderRadius: 4, cursor: 'pointer', color: '#92400E',
                                  display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                                  marginLeft: 'auto', flexShrink: 0,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#FEF3C7'}
                                onMouseLeave={e => e.currentTarget.style.background = '#FFFBF0'}
                                title="Adicionar item dentro do grupo"
                              >
                                <Plus style={{ width: 10, height: 10 }} /> Sub-item
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right num font-bold text-slate-900">{fmtNum(groupTotal, 3)}</td>
                          <td className="px-4 py-2.5 text-right num font-bold" style={{ color:'var(--amber)' }}>{fmtR$(groupTotal * toNum(estimate.inccAtual))}</td>
                          <td className="px-2 py-2.5 text-center">
                            <button onClick={deleteItem} className="text-stone-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
                          background: item.isSubItem ? (i % 2 ? '#FAFAF8' : '#F5F5F2') : (i % 2 ? '#F9F9F7' : '#FFFFFF'),
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
                            className={`w-full bg-transparent border-b border-transparent hover:border-stone-200 focus:border-amber-500 focus:outline-none text-stone-800 ${item.isSubItem ? 'italic text-xs text-stone-600' : 'text-sm'}`}
                            placeholder="Descrição" />
                        </td>
                        <td className="px-3 py-1.5">
                          <input type="number" step="0.001"
                            value={inccVal === 0 ? '' : inccVal}
                            onChange={(e) => updateVal(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className={`num w-full px-2 py-1 text-right border focus:outline-none focus:border-amber-500 text-sm ${item.isSubItem ? 'bg-amber-50 border-amber-200' : 'bg-amber-50 border-amber-200'}`} />
                        </td>
                        <td className="px-4 py-1.5 text-right num font-medium" style={{ color: 'var(--text-primary)' }}>{fmtR$(rsVal)}</td>
                        <td className="px-2 py-1.5 text-center">
                          <button onClick={deleteItem} className="text-stone-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    );
                  });
                })()}
                <tr style={{ background:'var(--navy)' }} className="text-stone-100 font-semibold">
                  <td className="px-2 py-2.5"></td>
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Incorporação</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[8].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num" style={{ color:'var(--amber)' }}>{fmtR$(calc.sections[8].rs)}</td>
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
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:border-amber-400 hover:bg-amber-50 text-stone-700 hover:text-amber-800 transition-colors"
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
                    <tr key={item.id} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
                      <td className="px-4 py-1.5">
                        <input type="text" value={item.nome}
                          onChange={(e) => updateItem('nome', e.target.value)}
                          className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-amber-500 focus:outline-none text-sm text-stone-800"
                          placeholder="Descrição do item" />
                      </td>
                      <td className="px-3 py-1.5">
                        <input type="number" step="0.001"
                          value={inccVal === 0 ? '' : inccVal}
                          onChange={(e) => updateItem('valorINCC', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="num w-full px-2 py-1 text-right bg-amber-50 border border-amber-200 focus:outline-none focus:border-amber-500 text-sm" />
                      </td>
                      <td className="px-4 py-1.5 text-right num text-stone-700">{fmtR$(rsVal)}</td>
                      <td className="px-2 py-1.5 text-center">
                        <button onClick={() => updateEst({ extrasItems: estimate.extrasItems.filter((x) => x.id !== item.id) })}
                          className="text-stone-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
                  <td className="px-4 py-2.5 text-right num text-amber-400">{fmtR$(calc.sections[9].rs)}</td>
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
              className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 hover:bg-amber-100"
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

            {/* Taxa de Administração — label com % editável + boxes */}
            <div className="flex items-center px-5 py-3 gap-4">
              <div className="w-72 flex-shrink-0 flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Taxa de Administração (</span>
                <input
                  type="number" step="0.5"
                  value={(estimate.taxaAdm * 100).toFixed(0)}
                  onChange={(e) => updateEst({ taxaAdm: (parseFloat(e.target.value) || 0) / 100 })}
                  className="num w-12 px-1 py-0.5 bg-amber-50 border border-amber-300 text-center text-xs font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">%):</span>
              </div>
              <div className="flex items-stretch border border-slate-300 overflow-hidden ml-auto">
                <div className="flex flex-col">
                  <div className="num px-4 py-2 bg-white text-sm font-bold text-slate-900 w-36 text-right border-r border-slate-300">
                    {fmtNum(calc.taxaAdmINCC, 3)}
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center border-r border-slate-200 bg-stone-50">(INCC)</div>
                </div>
                <div className="flex flex-col">
                  <div className="num px-4 py-2 bg-slate-700 text-amber-400 text-sm font-bold w-44 text-right">
                    {fmtR$(calc.taxaAdmRS)}
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center bg-stone-50">(R$)</div>
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
      <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
        {/* Custo Final Card */}
        <div style={{ background:'var(--navy)', borderRadius:10, overflow:'hidden', boxShadow:'0 4px 20px rgba(10,22,40,0.25)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Resumo Financeiro</span>
            <Sparkles style={{ width:13, height:13, color:'var(--amber)' }} />
          </div>
          <div style={{ padding:'16px' }}>
            {/* Custo Final */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(255,255,255,0.35)', marginBottom:4 }}>Custo Final</div>
              <div className="num" style={{ fontSize:26, fontWeight:700, color:'var(--amber)', lineHeight:1, letterSpacing:'-0.02em' }}>
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
          <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', background:'#FAFAF8' }}>
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
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500" />
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
                      className="w-full text-sm font-semibold text-slate-900 border-b-2 border-amber-500 bg-transparent focus:outline-none pb-0.5"
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 leading-tight flex-1">{saved.nome}</h3>
                      <button onClick={() => startRename(saved)}
                        className="text-stone-400 hover:text-amber-600 flex-shrink-0 mt-0.5" title="Renomear">
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
                    className="px-2.5 py-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 border border-stone-200 hover:border-amber-200"
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
                  ? 'border-amber-500 bg-amber-50 text-slate-900'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                <span className={`num text-xs font-bold px-1.5 py-0.5 ${
                  isActive ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar por nome ou cidade..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="">Todos tipos</option>
            {CONSTRUCTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          onClick={onNew}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Obra
        </button>
      </div>

      <div className="bg-white border border-stone-200" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 520 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <th className="text-left px-4 py-3 font-medium">Empreendimento</th>
              <th className="text-left px-3 py-3 font-medium">Tipo</th>
              <th className="text-left px-3 py-3 font-medium">Cidade</th>
              <th className="text-right px-3 py-3 font-medium">Ano</th>
              <th className="text-right px-3 py-3 font-medium">Área (m²)</th>
              <th className="text-right px-3 py-3 font-medium">Pvtos</th>
              <th className="text-right px-3 py-3 font-medium">INCC Base</th>
              <th className="text-right px-3 py-3 font-medium">Constr. INCC/m²</th>
              <th className="text-center px-3 py-3 font-medium w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
                <td className="px-4 py-2.5">
                  <div className="font-medium text-slate-900">{p.nome}</div>
                  {p.notas && <div className="text-xs text-stone-500 truncate max-w-md">{p.notas}</div>}
                </td>
                <td className="px-3 py-2.5 text-stone-700">
                  <span className="inline-block px-2 py-0.5 bg-stone-100 text-xs">{p.tipo}</span>
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
                      className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Editar"
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
      <div className="bg-stone-50 border-l-4 border-amber-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                  className="w-full px-2 py-1.5 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
                  className="w-full px-2 py-1.5 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
              className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
    onUpdate({ obraRef: obra, projetista: '' }); // reseta projetista ao trocar obra
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
    <tr className={`${index % 2 ? 'bg-stone-50' : 'bg-white'} ${!ativo ? 'opacity-45' : ''}`}>
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
          className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-stone-200 focus:border-amber-500 focus:outline-none text-sm text-stone-800"
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
          className="num w-full px-2 py-1 text-xs bg-emerald-50 border border-emerald-200 focus:outline-none focus:border-amber-500 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
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
          className="num w-full px-2 py-1 text-xs bg-emerald-50 border border-emerald-200 focus:outline-none focus:border-amber-500 disabled:bg-stone-100 disabled:text-stone-400"
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
            className={`num flex-1 px-2 py-1 text-right text-sm border focus:outline-none focus:border-amber-500 ${
              isAuto ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200'
            }`}
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
        <button onClick={onRemove} className="text-stone-400 hover:text-rose-600">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar por projetista, obra, especialidade..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={especFilter}
            onChange={(e) => setEspecFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="">Todas especialidades</option>
            {especsDisponiveis.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select
            value={obraFilter}
            onChange={(e) => setObraFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="">Todas obras</option>
            {obrasDisponiveis.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          {(filter || especFilter || obraFilter) && (
            <button
              onClick={() => { setFilter(''); setEspecFilter(''); setObraFilter(''); }}
              className="text-xs text-stone-600 hover:text-slate-900 px-2 py-1 border border-stone-300 hover:border-stone-500"
            >
              Limpar filtros
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNew}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nova Proposta
          </button>
        </div>
      </div>

      {/* Stats summary */}
      {stats.length > 0 && (
        <div className="bg-white border border-stone-200">
          <div className="px-4 py-2 border-b border-stone-200 flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
              Estatísticas por Especialidade (INCC/m²)
            </h3>
            <span className="text-xs text-stone-500">
              {filtered.length} proposta(s) em {stats.length} especialidade(s)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-stone-100">
            {stats.slice(0, 9).map((s) => (
              <div key={s.especialidade} className="px-4 py-2">
                <div className="text-xs text-stone-600 truncate">{s.especialidade}</div>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="num text-sm font-semibold text-slate-900">
                    {s.avg.toFixed(6)}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    [{s.min.toFixed(6)} → {s.max.toFixed(6)}]
                  </span>
                  <span className="text-[10px] text-stone-500 ml-auto">{s.n}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-stone-200" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 520 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <th className="text-left px-3 py-3 font-medium">Especialidade</th>
              <th className="text-left px-3 py-3 font-medium">Projetista</th>
              <th className="text-left px-3 py-3 font-medium">Obra</th>
              <th className="text-right px-3 py-3 font-medium">Área (m²)</th>
              <th className="text-right px-3 py-3 font-medium">Proposta (R$)</th>
              <th className="text-right px-3 py-3 font-medium">R$/m²</th>
              <th className="text-right px-3 py-3 font-medium">INCC Base</th>
              <th className="text-right px-3 py-3 font-medium">INCC/m²</th>
              <th className="text-center px-3 py-3 font-medium">Mês</th>
              <th className="text-center px-3 py-3 font-medium w-20">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
                <td className="px-3 py-2 text-stone-700">{r.especialidade}</td>
                <td className="px-3 py-2 text-slate-900 font-medium">{r.projetista}</td>
                <td className="px-3 py-2 text-stone-700">
                  <span className="inline-block px-2 py-0.5 bg-stone-100 text-xs">{r.obra}</span>
                </td>
                <td className="px-3 py-2 text-right num text-stone-700 text-xs">{fmtNum(r.area, 0)}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtR$(r.valorProposta)}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtR$2(r.custoRSM2)}</td>
                <td className="px-3 py-2 text-right num text-stone-500 text-xs">{fmtNum(r.inccBase, 2)}</td>
                <td className="px-3 py-2 text-right num font-semibold text-amber-700">
                  {r.custoINCCM2.toFixed(6)}
                </td>
                <td className="px-3 py-2 text-center text-xs text-stone-500">{r.mesProposta}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(r)}
                      className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50"
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
      <div className="bg-stone-50 border-l-4 border-amber-500 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide whitespace-nowrap">
            Composição dos Itens de Implantação
          </h2>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input value={filter} onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar item ou observação..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500" />
          </div>
        </div>
        <button onClick={onNew}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Item
        </button>
      </div>

      <div className="bg-white border border-stone-200" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 520 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <th className="text-left px-3 py-3 font-medium">Observação</th>
              <th className="text-left px-3 py-3 font-medium">Item</th>
              <th className="text-right px-3 py-3 font-medium w-24">Qtd.</th>
              <th className="text-center px-3 py-3 font-medium w-16">Unid.</th>
              <th className="text-right px-3 py-3 font-medium w-32">Preço Unit. (R$)</th>
              <th className="text-right px-3 py-3 font-medium w-32">Preço Unit. (INCC)</th>
              <th className="text-right px-3 py-3 font-medium w-28 bg-amber-900/30">Total (INCC)</th>
              <th className="w-20 text-center px-2 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
                <td className="px-3 py-2 text-stone-500 text-xs italic">{r.observacao}</td>
                <td className="px-3 py-2 text-slate-900 font-medium">{r.item}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtNum(r.quantidade, 2)}</td>
                <td className="px-3 py-2 text-center text-stone-600">{r.unidade}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtR$2(r.precoUnitarioRS)}</td>
                <td className="px-3 py-2 text-right num text-stone-700">{fmtNum(r.precoUnitarioINCC, 4)}</td>
                <td className="px-3 py-2 text-right num font-semibold text-amber-700 bg-amber-50">{fmtNum(r.totalINCC, 2)}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onEdit(r)} className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50" title="Editar">
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
              <td className="px-3 py-2.5 text-right num text-amber-400">{fmtNum(totalINCC, 2)}</td>
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
      <div className="bg-stone-50 border-l-4 border-amber-500 max-w-2xl w-full">
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
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500">
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
                <div className="num px-3 py-2 bg-amber-50 border border-amber-300 text-right text-sm font-bold text-amber-800">
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

  const tipos = useMemo(() =>
    Array.from(new Set(fundacaoDb.map((r) => r.fundacao).filter(Boolean))).sort(),
    [fundacaoDb]
  );
  const filtered = useMemo(() =>
    filterFundacao ? fundacaoDb.filter((r) => r.fundacao === filterFundacao) : fundacaoDb,
    [fundacaoDb, filterFundacao]
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Custos por Tipo de Fundação</h2>
          <select value={filterFundacao} onChange={(e) => setFilterFundacao(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500">
            <option value="">Todos os tipos</option>
            {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={onNew}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.tipo} className="bg-white border border-stone-200 px-4 py-3">
              <div className="text-xs text-stone-500 uppercase tracking-wider">{s.tipo}</div>
              <div className="num text-lg font-bold text-amber-700 mt-1">{fmtNum(s.avg, 3)}</div>
              <div className="text-[10px] text-stone-400 num">coef. médio [{fmtNum(s.min,3)} → {fmtNum(s.max,3)}] · {s.n}x</div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-stone-200" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 520 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <th className="text-left px-3 py-3 font-medium">Obra</th>
              <th className="text-left px-3 py-3 font-medium">Fundação</th>
              <th className="text-right px-3 py-3 font-medium">Área Terreno (m²)</th>
              <th className="text-right px-3 py-3 font-medium">Qt. Pavimentos</th>
              <th className="text-right px-3 py-3 font-medium">Custo (R$)</th>
              <th className="text-right px-3 py-3 font-medium">INCC Base</th>
              <th className="text-right px-3 py-3 font-medium">Custo (INCC)</th>
              <th className="text-right px-3 py-3 font-medium bg-amber-900/30">Coef. INCC/m²/Pav.</th>
              <th className="w-20 text-center px-2 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
                <td className="px-3 py-2.5 font-semibold text-slate-900 uppercase">{r.obra}</td>
                <td className="px-3 py-2.5 text-stone-700">{r.fundacao}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtNum(r.areaTerrenoM2, 2)}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{r.qtPavimentos}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtR$(r.custoRS)}</td>
                <td className="px-3 py-2.5 text-right num text-stone-500 text-xs">{fmtNum(r.inccBase, 3)}</td>
                <td className="px-3 py-2.5 text-right num text-stone-700">{fmtNum(r.custoINCC, 2)}</td>
                <td className="px-3 py-2.5 text-right num font-bold text-amber-700 bg-amber-50">{fmtNum(r.coeficiente, 3)}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onEdit(r)} className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50">
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
      <div className="bg-stone-50 border-l-4 border-amber-500 max-w-2xl w-full">
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
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
                <div className="num px-3 py-2 bg-amber-50 border border-amber-300 text-right text-sm font-bold text-amber-800">
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

  const marcas = useMemo(
    () => Array.from(new Set(elevatorsDb.map((r) => r.marca).filter(Boolean))).sort(),
    [elevatorsDb]
  );
  const filtered = useMemo(() =>
    filterMarca ? elevatorsDb.filter((r) => r.marca === filterMarca) : elevatorsDb,
    [elevatorsDb, filterMarca]
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
            Base de Elevadores
          </h2>
          <select
            value={filterMarca}
            onChange={(e) => setFilterMarca(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="">Todas as marcas</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <button
          onClick={onNew}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      {/* Stats header */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-stone-200 px-4 py-3 border-l-4 border-l-amber-500">
            <div className="text-[10px] uppercase text-stone-500 tracking-wider">Registros</div>
            <div className="num text-xl font-semibold text-slate-900 mt-1">{stats.n}</div>
          </div>
          <div className="bg-white border border-stone-200 px-4 py-3">
            <div className="text-[10px] uppercase text-stone-500 tracking-wider">Mínimo (INCC/parada/elev.)</div>
            <div className="num text-xl font-semibold text-slate-900 mt-1">{fmtNum(stats.min, 2)}</div>
          </div>
          <div className="bg-white border border-stone-200 px-4 py-3 border-l-4 border-l-slate-900">
            <div className="text-[10px] uppercase text-stone-500 tracking-wider">Média (INCC/parada/elev.)</div>
            <div className="num text-xl font-semibold text-amber-700 mt-1">{fmtNum(stats.avg, 2)}</div>
          </div>
          <div className="bg-white border border-stone-200 px-4 py-3">
            <div className="text-[10px] uppercase text-stone-500 tracking-wider">Máximo (INCC/parada/elev.)</div>
            <div className="num text-xl font-semibold text-slate-900 mt-1">{fmtNum(stats.max, 2)}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-stone-200" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 520 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <th className="text-left px-4 py-3 font-medium">Obra</th>
              <th className="text-left px-3 py-3 font-medium">Marca</th>
              <th className="text-right px-3 py-3 font-medium">Nº Paradas</th>
              <th className="text-right px-3 py-3 font-medium">Qt. Elevadores</th>
              <th className="text-right px-3 py-3 font-medium">Valor Fechado (R$)</th>
              <th className="text-right px-3 py-3 font-medium">Val./Parada/Elev. (R$)</th>
              <th className="text-center px-3 py-3 font-medium">Mês Fechamento</th>
              <th className="text-right px-3 py-3 font-medium">INCC</th>
              <th className="text-right px-3 py-3 font-medium bg-amber-900/40">Val./Parada/Elev. (INCC)</th>
              <th className="text-center px-3 py-3 font-medium w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const { valorParadaElevRS, valorParadaElevINCC } = calcElevStats(r);
              return (
                <tr key={r.id} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
                  <td className="px-4 py-2.5 font-semibold text-slate-900 uppercase">{r.obra}</td>
                  <td className="px-3 py-2.5 text-stone-700">{r.marca}</td>
                  <td className="px-3 py-2.5 text-right num text-stone-700">{r.numParadas || '—'}</td>
                  <td className="px-3 py-2.5 text-right num text-stone-700">{r.qtElevadores || '—'}</td>
                  <td className="px-3 py-2.5 text-right num text-stone-700">
                    {r.valorFechado > 0 ? fmtR$(r.valorFechado) : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right num text-stone-700">
                    {valorParadaElevRS > 0 ? fmtR$(valorParadaElevRS) : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-center text-stone-500">{r.mesFechamento || '—'}</td>
                  <td className="px-3 py-2.5 text-right num text-stone-500">{r.inccBase > 0 ? fmtNum(r.inccBase, 3) : '—'}</td>
                  <td className="px-3 py-2.5 text-right num font-bold text-amber-700 bg-amber-50">
                    {valorParadaElevINCC > 0 ? fmtNum(valorParadaElevINCC, 2) : '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onEdit(r)}
                        className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50" title="Editar">
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
                          className="p-1.5 text-stone-600 hover:text-rose-700 hover:bg-rose-50" title="Excluir">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="text-center py-12 text-stone-400 text-sm">Nenhum registro.</td></tr>
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
      <div className="bg-stone-50 border-l-4 border-amber-500 max-w-2xl w-full">
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
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
                  <div className="num px-3 py-2 bg-amber-50 border border-amber-400 text-right text-base font-bold text-amber-800">
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
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
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
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-base flex items-center justify-center gap-2 transition-colors shadow"
        >
          <FileDown className="w-5 h-5" /> Gerar e Baixar PDF
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
                  className="flex-1 px-2 py-1.5 border border-stone-300 text-sm font-mono focus:outline-none focus:border-amber-500" />
              </div>
            </Field>
            <Field label="Cor de Acento" hint="barra, destaques">
              <div className="flex items-center gap-2">
                <input type="color" value={ap.corAcento}
                  onChange={(e) => set('corAcento', e.target.value)}
                  className="w-10 h-9 p-0.5 border border-stone-300 cursor-pointer" />
                <input type="text" value={ap.corAcento}
                  onChange={(e) => set('corAcento', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-stone-300 text-sm font-mono focus:outline-none focus:border-amber-500" />
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
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500 resize-none" />
            </Field>
            <Field label="Nota de Rodapé">
              <textarea value={ap.notasRodape}
                onChange={(e) => set('notasRodape', e.target.value)}
                rows={2} placeholder="Ex: Valores sujeitos a revisão. Estimativa válida por 30 dias."
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500 resize-none" />
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
            <div style={{ borderLeft: `4px solid ${cor2}`, padding: '6px 10px', margin: '8px', fontSize: 8, color: '#374151', background: '#fffbeb' }}>
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
                  <tr style={{ background: '#334155', color: '#f8fafc' }}>
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
            style={{ padding:'8px 16px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor: loading ? 'wait' : 'pointer', display:'flex', alignItems:'center', gap:6, opacity: loading ? 0.7 : 1 }}>
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

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'#FAFAF8' }}>
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
                  <Cell key={i} fill={i === arr.length - 1 ? 'var(--amber)' : '#1F3864'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'#FAFAF8', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
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
                  <tr key={d.mes} style={{ background: isLast ? '#FFFBF0' : (i % 2 ? '#FAFAF8' : 'white'), borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'9px 14px', fontWeight: isLast ? 700 : 500, color:'var(--text-primary)' }}>
                      {d.mes} {isLast && <span style={{ fontSize:9, background:'var(--amber)', color:'var(--navy)', padding:'1px 5px', borderRadius:3, marginLeft:6, fontWeight:700 }}>ATUAL</span>}
                    </td>
                    <td className="num" style={{ padding:'9px 14px', textAlign:'right', fontWeight: isLast ? 700 : 400, color: isLast ? 'var(--amber)' : 'var(--text-primary)' }}>
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
        <div style={{ padding:'10px 14px', background:'#FAFAF8', borderTop:'1px solid var(--border)', fontSize:11, color:'var(--text-muted)' }}>
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
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
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
                contentStyle={{ background: '#0f172a', border: 'none', color: '#f5f5f4', fontSize: 12 }}
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
      borderLeft: accent ? '3px solid var(--amber)' : '1px solid var(--border)',
      borderRadius:8, overflow:'hidden',
      boxShadow:'0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
    }}>
      {title ? (
        <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', background:'#FAFAF8' }}>
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
      boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
      transition:'box-shadow .15s',
    }}>
      <button onClick={() => onToggle(id)} style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'11px 16px', background: collapsed ? '#FAFAF8' : 'white',
        border:'none', cursor:'pointer', textAlign:'left',
        borderBottom: collapsed ? 'none' : '1px solid var(--border)',
        transition:'background .15s',
      }}
        onMouseEnter={e=>{ if(collapsed) e.currentTarget.style.background='#F5F5F2'; }}
        onMouseLeave={e=>{ e.currentTarget.style.background = collapsed ? '#FAFAF8' : 'white'; }}
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
            <span style={{ fontSize:11, fontFamily:'"IBM Plex Mono"', color:'var(--text-muted)' }}>{fN(totalINCC)} INCC</span>
            <span style={{ fontSize:12, fontFamily:'"IBM Plex Mono"', fontWeight:600, color:'var(--text-primary)' }}>{fR(totalRS)}</span>
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
      <h4 style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--amber)', fontWeight:700, marginBottom:8, paddingBottom:4, borderBottom:'1px solid var(--border)' }}>
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
      onFocus={e=>{ e.target.style.borderColor='var(--amber)'; e.target.style.boxShadow='0 0 0 2px rgba(245,158,11,0.12)'; }}
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
        width:'100%', padding:'7px 10px', background:'#FFFBF0', border:'1px solid #FDE68A',
        borderRadius:5, fontSize:13, textAlign:'right', color:'var(--text-primary)', outline:'none',
        transition:'border-color .15s, box-shadow .15s', boxSizing:'border-box',
      }}
      onFocus={e=>{ e.target.style.borderColor='var(--amber)'; e.target.style.boxShadow='0 0 0 2px rgba(245,158,11,0.12)'; }}
      onBlur={e=>{ e.target.style.borderColor='#FDE68A'; e.target.style.boxShadow='none'; }}
    />
  );
}

function Stat({ label, value, highlight, small }) {
  return (
    <div style={{
      background: highlight ? '#FFFBF0' : '#F9F9F7',
      borderLeft: `2px solid ${highlight ? 'var(--amber)' : 'var(--border-strong)'}`,
      padding:'8px 12px', borderRadius:'0 4px 4px 0',
    }}>
      <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-muted)', fontWeight:600 }}>{label}</div>
      <div style={{ fontFamily:'"IBM Plex Mono"', fontSize: small ? 11 : 13, fontWeight:600, color: highlight ? '#92400E' : 'var(--text-primary)', marginTop:2 }}>
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
          <div style={{ fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'2px 0', textAlign:'center', background:'#FAFAF8', borderRight:'1px solid var(--border)' }}>INCC</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column' }}>
          <div className="num" style={{
            padding:'8px 16px', fontSize:13, fontWeight:700, minWidth:160, textAlign:'right',
            background: highlight ? 'var(--amber)' : 'var(--navy)',
            color: highlight ? 'var(--navy)' : 'var(--amber)',
          }}>
            {fmtR$(rs)}
          </div>
          <div style={{ fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'2px 0', textAlign:'center', background:'#FAFAF8' }}>R$</div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'3px 0' }}>
      <span style={{ fontSize:12, color: accent ? 'var(--amber)' : 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span className="num" style={{ fontSize:12, fontWeight: accent ? 600 : 400, color: accent ? 'var(--amber)' : 'rgba(255,255,255,0.85)' }}>
        {fmtR$(value)}
      </span>
    </div>
  );
}
