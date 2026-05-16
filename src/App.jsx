import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, RadialBarChart, RadialBar,
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
const PROJECTS_DB_SEED = [
  // Vazio — adicione suas propostas reais pela aba "Base de Projetos"
  /*{ id: 1, especialidade: "Projeto de Arquitetura", projetista: "Sérgio Lopes", obra: "The Edge", area: 50113.55, valorProposta: 300000.0, custoRSM2: 5.9864, inccBase: 790.331, custoINCCM2: 0.007575, mesProposta: "2020-06" },
  { id: 2, especialidade: "Projeto de Arquitetura", projetista: "Flávio Bassan", obra: "The Edge", area: 50113.55, valorProposta: 535500.0, custoRSM2: 10.6857, inccBase: 839.382, custoINCCM2: 0.01273, mesProposta: "2020-11" },
  { id: 3, especialidade: "Projeto de Arquitetura", projetista: "Virtual", obra: "The Edge", area: 49385.11, valorProposta: 567020.0, custoRSM2: 11.4816, inccBase: 799.589, custoINCCM2: 0.014359, mesProposta: "2020-07" },
  { id: 4, especialidade: "Projeto de Arquitetura", projetista: "Virtual", obra: "The Edge", area: 56691.36, valorProposta: 992098.62, custoRSM2: 17.5, inccBase: 880.265, custoINCCM2: 0.01988, mesProposta: "2021-03" },
  { id: 5, especialidade: "Projeto de Arquitetura", projetista: "Base 2 Projetos", obra: "The Edge", area: 3800.0, valorProposta: 44000.0, custoRSM2: 11.5789, inccBase: 1044.679, custoINCCM2: 0.011084, mesProposta: "2022-08" },
  { id: 6, especialidade: "Projeto de Arquitetura", projetista: "Base 2 Projetos", obra: "The Edge", area: 53155.0, valorProposta: 388000.0, custoRSM2: 7.2994, inccBase: 868.929, custoINCCM2: 0.0084, mesProposta: "2021-02" },
  { id: 7, especialidade: "Projeto de Arquitetura", projetista: "MSC Engenharia", obra: "The Edge", area: 53173.71, valorProposta: 133500.0, custoRSM2: 2.5106, inccBase: 880.265, custoINCCM2: 0.002852, mesProposta: "2021-03" },
  { id: 8, especialidade: "Projeto de Arquitetura", projetista: "Instale Engenharia", obra: "The Edge", area: 53000.0, valorProposta: 410000.0, custoRSM2: 7.7358, inccBase: 959.001, custoINCCM2: 0.008067, mesProposta: "2021-11" },
  { id: 9, especialidade: "Projeto de Execução", projetista: "ML Tech", obra: "The Edge", area: 55506.85, valorProposta: 14400.0, custoRSM2: 0.2594, inccBase: 981.244, custoINCCM2: 0.000264, mesProposta: "2022-03" },
  { id: 10, especialidade: "Projeto de Execução", projetista: "ML Tech", obra: "The Edge", area: 55506.85, valorProposta: 5800.0, custoRSM2: 0.1045, inccBase: 981.244, custoINCCM2: 0.000106, mesProposta: "2022-03" },
  { id: 11, especialidade: "Projeto de Execução", projetista: "Monta", obra: "The Edge", area: 55506.85, valorProposta: 15000.0, custoRSM2: 0.2702, inccBase: 927.512, custoINCCM2: 0.000291, mesProposta: "2021-06" },
  { id: 12, especialidade: "Projeto de Execução", projetista: "SRA Engenharia", obra: "The Edge", area: 55506.85, valorProposta: 40000.0, custoRSM2: 0.7206, inccBase: 969.184, custoINCCM2: 0.000744, mesProposta: "2022-01" },
  { id: 13, especialidade: "Projeto de Execução", projetista: "Nova Gaia", obra: "The Edge", area: 55506.85, valorProposta: 10200.0, custoRSM2: 0.1838, inccBase: 1051.632, custoINCCM2: 0.000175, mesProposta: "2022-12" },
  { id: 14, especialidade: "Projeto de Fundação", projetista: "Sérgio Lopes", obra: "Tarsila", area: 17982.52, valorProposta: 209856.0, custoRSM2: 11.67, inccBase: 939.699, custoINCCM2: 0.012419, mesProposta: "2021-08" },
  { id: 15, especialidade: "Projeto de Fundação", projetista: "Sérgio Lopes", obra: "Tarsila", area: 17982.52, valorProposta: 419712.02, custoRSM2: 23.34, inccBase: 939.699, custoINCCM2: 0.024838, mesProposta: "2021-08" },
  { id: 16, especialidade: "Projeto de Fundação", projetista: "Elemento", obra: "Tarsila", area: 18000.0, valorProposta: 195600.0, custoRSM2: 10.8667, inccBase: 935.359, custoINCCM2: 0.011618, mesProposta: "2021-07" },
  { id: 17, especialidade: "Consultoria de Fundação", projetista: "MSC Engenharia", obra: "Tarsila", area: 19542.42, valorProposta: 72000.0, custoRSM2: 3.6843, inccBase: 959.001, custoINCCM2: 0.003842, mesProposta: "2021-11" },
  { id: 18, especialidade: "Consultoria de Fundação", projetista: "Instale Engenharia", obra: "Tarsila", area: 18000.0, valorProposta: 260000.0, custoRSM2: 14.4444, inccBase: 944.52, custoINCCM2: 0.015293, mesProposta: "2021-09" },
  { id: 19, especialidade: "Consultoria de Fundação", projetista: "ML Tech", obra: "Tarsila", area: 18461.25, valorProposta: 11000.0, custoRSM2: 0.5958, inccBase: 944.52, custoINCCM2: 0.000631, mesProposta: "2021-09" },
  { id: 20, especialidade: "Consultoria de Fundação", projetista: "ML Tech", obra: "Tarsila", area: 18461.25, valorProposta: 3800.0, custoRSM2: 0.2058, inccBase: 944.52, custoINCCM2: 0.000218, mesProposta: "2021-09" },
  { id: 21, especialidade: "Consultoria de Fundação", projetista: "Monta", obra: "Tarsila", area: 18461.25, valorProposta: 16000.0, custoRSM2: 0.8667, inccBase: 939.699, custoINCCM2: 0.000922, mesProposta: "2021-08" },
  { id: 22, especialidade: "Consultoria de Fundação", projetista: "SRA Engenharia", obra: "Tarsila", area: 18461.25, valorProposta: 38600.0, custoRSM2: 2.0909, inccBase: 969.184, custoINCCM2: 0.002157, mesProposta: "2022-01" },
  { id: 23, especialidade: "Projeto de Estrutura", projetista: "Nova Gaia", obra: "Tarsila", area: 18461.25, valorProposta: 3500.0, custoRSM2: 0.1896, inccBase: 990.543, custoINCCM2: 0.000191, mesProposta: "2022-04" },
  { id: 24, especialidade: "Projeto de Estrutura", projetista: "Sérgio Lopes", obra: "Attrium", area: 10590.0, valorProposta: 149670.0, custoRSM2: 14.1331, inccBase: 1051.632, custoINCCM2: 0.013439, mesProposta: "2022-12" },
  { id: 25, especialidade: "Projeto de Estrutura", projetista: "Conceito Studio", obra: "Attrium", area: 10590.0, valorProposta: 148260.0, custoRSM2: 14.0, inccBase: 1050.701, custoINCCM2: 0.013324, mesProposta: "2022-11" },
  { id: 26, especialidade: "Projeto de Estrutura", projetista: "Elemento", obra: "Attrium", area: 680.0, valorProposta: 13500.0, custoRSM2: 19.8529, inccBase: 1061.635, custoINCCM2: 0.0187, mesProposta: "2023-04" },
  { id: 27, especialidade: "Consultoria Estrutural", projetista: "Elemento", obra: "Attrium", area: 10420.0, valorProposta: 135500.0, custoRSM2: 13.0038, inccBase: 1050.701, custoINCCM2: 0.012376, mesProposta: "2022-11" },
  { id: 28, especialidade: "Consultoria Estrutural", projetista: "MSC Engenharia", obra: "Attrium", area: 10590.0, valorProposta: 54400.0, custoRSM2: 5.1369, inccBase: 1060.116, custoINCCM2: 0.004846, mesProposta: "2023-03" },
  { id: 29, especialidade: "Consultoria Estrutural", projetista: "Instale Engenharia", obra: "Attrium", area: 11000.0, valorProposta: 205000.0, custoRSM2: 18.6364, inccBase: 1051.632, custoINCCM2: 0.017721, mesProposta: "2022-12" },
  { id: 30, especialidade: "Consultoria Estrutural", projetista: "ML Tech", obra: "Attrium", area: 10800.37, valorProposta: 13800.0, custoRSM2: 1.2777, inccBase: 1050.701, custoINCCM2: 0.001216, mesProposta: "2022-11" },
  { id: 31, especialidade: "Consultoria Estrutural", projetista: "ML Tech", obra: "Attrium", area: 10800.37, valorProposta: 4800.0, custoRSM2: 0.4444, inccBase: 1050.701, custoINCCM2: 0.000423, mesProposta: "2022-11" },
  { id: 32, especialidade: "Consultoria Estrutural", projetista: "Ita Fogo", obra: "Attrium", area: 10800.37, valorProposta: 8250.0, custoRSM2: 0.7639, inccBase: 1061.635, custoINCCM2: 0.00072, mesProposta: "2023-04" },
  { id: 33, especialidade: "Consultoria Estrutural", projetista: "SRA Engenharia", obra: "Attrium", area: 10800.37, valorProposta: 25000.0, custoRSM2: 2.3147, inccBase: 1075.54, custoINCCM2: 0.002152, mesProposta: "2023-06" },
  { id: 34, especialidade: "Projeto de Instalações", projetista: "Nova Gaia", obra: "Attrium", area: 10800.37, valorProposta: 4000.0, custoRSM2: 0.3704, inccBase: 1075.54, custoINCCM2: 0.000344, mesProposta: "2023-06" },
  { id: 35, especialidade: "Projeto de Instalações", projetista: "Flávio Bassan", obra: "Visi", area: 4971.28, valorProposta: 144000.0, custoRSM2: 28.9664, inccBase: 1013.164, custoINCCM2: 0.02859, mesProposta: "2022-05" },
  { id: 36, especialidade: "Projeto de Ar Condicionado", projetista: "Conceito Studio", obra: "Visi", area: 4785.76, valorProposta: 67000.0, custoRSM2: 13.9999, inccBase: 1050.701, custoINCCM2: 0.013324, mesProposta: "2022-11" },
  { id: 37, especialidade: "Projeto de Ar Condicionado", projetista: "ABS Fundações", obra: "Visi", area: 658.0, valorProposta: 30000.0, custoRSM2: 45.5927, inccBase: 1060.116, custoINCCM2: 0.043007, mesProposta: "2023-03" },
  { id: 38, especialidade: "Projeto de Ar Condicionado", projetista: "Justino Vieira", obra: "Visi", area: 4982.06, valorProposta: 69649.0, custoRSM2: 13.98, inccBase: 1061.635, custoINCCM2: 0.013168, mesProposta: "2023-04" },
  { id: 39, especialidade: "Projeto de Ar Condicionado", projetista: "MSC Engenharia", obra: "Visi", area: 4785.76, valorProposta: 26800.0, custoRSM2: 5.5999, inccBase: 1078.412, custoINCCM2: 0.005193, mesProposta: "2023-08" },
  { id: 40, especialidade: "Projeto de Ar Condicionado", projetista: "Instale Engenharia", obra: "Visi", area: 5000.0, valorProposta: 98000.0, custoRSM2: 19.6, inccBase: 1061.635, custoINCCM2: 0.018462, mesProposta: "2023-04" },
  { id: 41, especialidade: "Projeto de Ar Condicionado", projetista: "ML Tech", obra: "Visi", area: 4971.28, valorProposta: 14000.0, custoRSM2: 2.8162, inccBase: 1044.679, custoINCCM2: 0.002696, mesProposta: "2022-08" },
  { id: 42, especialidade: "Projeto de Ar Condicionado", projetista: "ML Tech", obra: "Visi", area: 4971.28, valorProposta: 6000.0, custoRSM2: 1.2069, inccBase: 1044.679, custoINCCM2: 0.001155, mesProposta: "2022-08" },
  { id: 43, especialidade: "Projeto de Ar Condicionado", projetista: "Monta", obra: "Visi", area: 4971.28, valorProposta: 14500.0, custoRSM2: 2.9168, inccBase: 1067.919, custoINCCM2: 0.002731, mesProposta: "2023-05" },
  { id: 44, especialidade: "Projeto de Incêndio", projetista: "Virtual", obra: "Mediterrâneo", area: 14074.23, valorProposta: 245826.52, custoRSM2: 17.4664, inccBase: 713.33, custoINCCM2: 0.024486, mesProposta: "2017-09" },
  { id: 45, especialidade: "Projeto de Incêndio", projetista: "Virtual", obra: "Mediterrâneo", area: 14074.23, valorProposta: 245826.52, custoRSM2: 17.4664, inccBase: 713.33, custoINCCM2: 0.024486, mesProposta: "2017-09" },
  { id: 46, especialidade: "Projeto de Incêndio", projetista: "Base 2 Projetos", obra: "Mediterrâneo", area: 13300.0, valorProposta: 137000.0, custoRSM2: 10.3008, inccBase: 635.403, custoINCCM2: 0.016211, mesProposta: "2015-06" },
  { id: 47, especialidade: "Projeto de Incêndio", projetista: "MSC Engenharia", obra: "Mediterrâneo", area: 14450.0, valorProposta: 64538.73, custoRSM2: 4.4663, inccBase: 642.644, custoINCCM2: 0.00695, mesProposta: "2015-08" },
  { id: 48, especialidade: "Projeto de Incêndio", projetista: "Instale Engenharia", obra: "Mediterrâneo", area: 14270.03, valorProposta: 60000.0, custoRSM2: 4.2046, inccBase: 775.225, custoINCCM2: 0.005424, mesProposta: "2019-11" },
  { id: 49, especialidade: "Projeto de Incêndio", projetista: "ML Tech", obra: "Mediterrâneo", area: 14270.03, valorProposta: 18900.0, custoRSM2: 1.3245, inccBase: 697.41, custoINCCM2: 0.001899, mesProposta: "2017-03" },
  { id: 50, especialidade: "Gestão de Projetos", projetista: "ML Tech", obra: "Mediterrâneo", area: 14270.03, valorProposta: 5500.0, custoRSM2: 0.3854, inccBase: 697.41, custoINCCM2: 0.000553, mesProposta: "2017-03" },
  { id: 51, especialidade: "Gestão de Projetos", projetista: "Monta", obra: "Mediterrâneo", area: 14270.03, valorProposta: 5200.0, custoRSM2: 0.3644, inccBase: 691.792, custoINCCM2: 0.000527, mesProposta: "2017-01" },
  { id: 52, especialidade: "Gestão de Projetos", projetista: "SRA Engenharia", obra: "Mediterrâneo", area: 14270.03, valorProposta: 20800.0, custoRSM2: 1.4576, inccBase: 697.41, custoINCCM2: 0.00209, mesProposta: "2017-03" },
  { id: 53, especialidade: "Projeto Tratamento de Águas Cinzas", projetista: "Virtual", obra: "Piemonte", area: 4113.11, valorProposta: 71979.77, custoRSM2: 17.5001, inccBase: 691.792, custoINCCM2: 0.025297, mesProposta: "2017-01" },
  { id: 54, especialidade: "Projeto Tratamento de Águas Cinzas", projetista: "Virtual", obra: "Piemonte", area: 4113.11, valorProposta: 71979.77, custoRSM2: 17.5001, inccBase: 691.792, custoINCCM2: 0.025297, mesProposta: "2017-01" },
  { id: 55, especialidade: "Consultoria Acústica", projetista: "Base 2 Projetos", obra: "Piemonte", area: 4300.0, valorProposta: 48000.0, custoRSM2: 11.1628, inccBase: 623.951, custoINCCM2: 0.01789, mesProposta: "2015-05" },
  { id: 56, especialidade: "Consultoria Acústica", projetista: "MSC Engenharia", obra: "Piemonte", area: 4400.0, valorProposta: 25786.52, custoRSM2: 5.8606, inccBase: 888.191, custoINCCM2: 0.006598, mesProposta: "2021-04" },
  { id: 57, especialidade: "Consultoria Acústica", projetista: "Instale Engenharia", obra: "Piemonte", area: 3865.74, valorProposta: 80000.0, custoRSM2: 20.6946, inccBase: 644.046, custoINCCM2: 0.032132, mesProposta: "2015-09" },
  { id: 58, especialidade: "Consultoria Acústica", projetista: "Celos", obra: "Piemonte", area: 4113.11, valorProposta: 15000.0, custoRSM2: 3.6469, inccBase: 635.403, custoINCCM2: 0.005739, mesProposta: "2015-06" },
  { id: 59, especialidade: "Projeto de Piscina", projetista: "Virtual", obra: "MUD 333", area: 11903.58, valorProposta: 208312.65, custoRSM2: 17.5, inccBase: 927.512, custoINCCM2: 0.018868, mesProposta: "2021-06" },
  { id: 60, especialidade: "Projeto de Piscina", projetista: "MD Rio", obra: "MUD 333", area: 11903.58, valorProposta: 12000.0, custoRSM2: 1.0081, inccBase: 939.699, custoINCCM2: 0.001073, mesProposta: "2021-08" },
  { id: 61, especialidade: "Projeto de Piscina", projetista: "Instale Engenharia", obra: "MUD 333", area: 11903.58, valorProposta: 58000.0, custoRSM2: 4.8725, inccBase: 935.359, custoINCCM2: 0.005209, mesProposta: "2021-07" },
  { id: 62, especialidade: "Projeto de Piscina", projetista: "ML Tech", obra: "MUD 333", area: 11903.58, valorProposta: 7800.0, custoRSM2: 0.6553, inccBase: 935.359, custoINCCM2: 0.000701, mesProposta: "2021-07" },
  { id: 63, especialidade: "Projeto de Modificação", projetista: "RTM Arquitetos", obra: "MUD 333", area: 11903.58, valorProposta: 10000.0, custoRSM2: 0.8401, inccBase: 939.699, custoINCCM2: 0.000894, mesProposta: "2021-08" },
  */
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
  inccAtual: 1700.00,
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
function generatePDF({ estimate, calc, refProject, apresentacao = DEFAULT_APRESENTACAO }) {
  const ap = { ...DEFAULT_APRESENTACAO, ...apresentacao };
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const nomeObra = estimate.nome || 'Estimativa de Obra';
  const cor1 = ap.corPrimaria || '#1F3864';
  const cor2 = ap.corAcento || '#f59e0b';

  const fR = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n || 0);
  const fN = (n, d = 2) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);
  const fPct = (n) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(n || 0);
  const area = toNum(estimate.areaConstruida);

  // Floor rows (only non-zero area)
  const floorList = (estimate.floorList || []).filter((fl) => toNum(fl.area) > 0);

  // Sections
  const sections = calc.sections || [];
  const totalFinal = calc.totalFinalRS || 0;

  // Projetos incluídos
  const projetosIncluidos = (estimate.projetosItems || []).filter((p) => p.obrigatorio && toNum(p.custoINCCM2) > 0);

  const sectionTableRows = sections
    .filter((s) => {
      const map = {
        construcao: ap.mostrarPavimentos, infra: ap.mostrarInfraestrutura,
        implantacao: ap.mostrarImplantacao, projetos: ap.mostrarProjetos,
        elevador: ap.mostrarElevadores, fachada: ap.mostrarFachada,
        ensaios: ap.mostrarEnsaios, administracao: ap.mostrarAdministracao,
        incorporacao: ap.mostrarIncorporacao, extras: ap.mostrarExtras,
      };
      return s.rs > 0 && (map[s.key] !== false);
    })
    .map((s) => {
      const pct = totalFinal > 0 ? s.rs / totalFinal : 0;
      return `
        <tr>
          <td>${s.label}</td>
          <td class="num right">${fN(s.incc)}</td>
          <td class="num right">${fR(s.rs)}</td>
          <td class="num right">${fPct(pct)}</td>
          ${area > 0 ? `<td class="num right">${fR(s.rs / area)}</td>` : '<td>—</td>'}
        </tr>`;
    }).join('');

  const floorRows = floorList.map((fl) => {
    const coef = (fl.coef !== '' && fl.coef !== null && fl.coef !== undefined) ? toNum(fl.coef) : (fl.defaultCoef || 1);
    const areaEq = toNum(fl.area) * coef;
    const custoINCC = areaEq * calc.custoConstrucaoM2;
    const custoRS = custoINCC * toNum(estimate.inccAtual);
    return `
      <tr>
        <td>${fl.label || 'Pavimento'}</td>
        <td class="num right">${fN(toNum(fl.area))}</td>
        <td class="num right">${fN(coef)}</td>
        <td class="num right">${fN(areaEq)}</td>
        <td class="num right">${fN(custoINCC)}</td>
        <td class="num right">${fR(custoRS)}</td>
      </tr>`;
  }).join('');

  const implRows = (estimate.implantacaoItems || [])
    .filter((it) => toNum(it.valorINCC) > 0)
    .map((it) => `<tr><td>${it.nome}</td><td class="num right">${fN(it.valorINCC)}</td><td class="num right">${fR(toNum(it.valorINCC) * toNum(estimate.inccAtual))}</td></tr>`)
    .join('');

  const projRows = projetosIncluidos.map((p) => {
    const totalRS = toNum(p.custoINCCM2) * area * toNum(estimate.inccAtual);
    return `<tr><td>${p.especialidade}</td><td>${p.projetista || '—'}</td><td class="num right">${p.custoINCCM2.toFixed(6)}</td><td class="num right">${fR(totalRS)}</td></tr>`;
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
  .doc-header h1 { font-size: 14pt; font-weight: 700; letter-spacing: 0.5px; }
  .doc-header .sub { font-size: 8pt; color: rgba(255,255,255,.65); margin-top: 2px; }
  .doc-header .meta { text-align: right; font-size: 8pt; color: rgba(255,255,255,.65); }
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
  th { background: #334155; color: #f8fafc; font-weight: 600; padding: 4px 6px; text-align: left; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .4px; }
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

<div class="doc-header">
  <div>
    ${ap.logoText ? `<div class="empresa">${ap.logoText}</div>` : ''}
    <h1>${nomeObra.toUpperCase()}</h1>
    <div class="sub">${estimate.endereco || ''}</div>
  </div>
  <div class="meta">
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
  <div class="info-card"><div class="lbl">Área Equivalente</div><div class="val">${fN(calc.areaEqTotal, 0)} m²</div></div>
  <div class="info-card"><div class="lbl">Custo / m²</div><div class="val">${fR(calc.custoFinalM2)}</div></div>
  <div class="info-card highlight"><div class="lbl">Custo Total</div><div class="val" style="font-size:11pt;color:${cor2}">${fR(calc.totalFinalRS)}</div></div>
  <div class="info-card"><div class="lbl">INCC Atual</div><div class="val">${fN(toNum(estimate.inccAtual), 2)}</div></div>
  <div class="info-card"><div class="lbl">Fator Atualização</div><div class="val">${fN(calc.fator, 4)}×</div></div>
  <div class="info-card"><div class="lbl">Nº Pavimentos</div><div class="val">${estimate.numPavtos || '—'}</div></div>
  <div class="info-card"><div class="lbl">Prazo (meses)</div><div class="val">${estimate.prazoObra || '—'}</div></div>
</div>` : ''}

${ap.mostrarResumoFinanceiro ? `
<div class="sec-title">Resumo Financeiro</div>
<div class="summary-box">
  <div class="row"><span>Subtotal (s/ incorporação)</span><span class="v">${fR(calc.subtotalRS)}</span></div>
  <div class="row"><span>Incorporação</span><span class="v">${fR((calc.sections[8] || {}).rs || 0)}</span></div>
  <div class="row"><span>Itens Extras</span><span class="v">${fR((calc.sections[9] || {}).rs || 0)}</span></div>
  <div class="row"><span>Taxa de Administração (${fPct(toNum(estimate.taxaAdm))})</span><span class="v">${fR(calc.taxaAdmRS)}</span></div>
  <div class="row"><span>CUSTO TOTAL</span><span class="v amber">${fR(calc.totalFinalRS)}</span></div>
</div>` : ''}

${ap.mostrarDistribuicao ? `
<div class="sec-title">Distribuição por Categoria</div>
<table>
  <thead><tr>
    <th>Categoria</th><th class="right">INCC</th><th class="right">R$</th>
    <th class="right">% Total</th>${area > 0 ? '<th class="right">R$/m²</th>' : ''}
  </tr></thead>
  <tbody>
    ${sectionTableRows}
    <tr class="grand-total">
      <td colspan="${area > 0 ? 4 : 3}">CUSTO TOTAL C/ TAXA ADM</td>
      ${area > 0 ? `<td class="num right">${fR(calc.custoFinalM2)}</td>` : ''}
    </tr>
  </tbody>
</table>` : ''}

${ap.mostrarPavimentos && floorRows ? `
<div class="sec-title" style="margin-top:12px">Custo de Construção · Pavimentos</div>
<table>
  <thead><tr><th>Pavimento</th><th class="right">Área (m²)</th><th class="right">Coef.</th><th class="right">Área Eq.</th><th class="right">Custo (INCC)</th><th class="right">Custo (R$)</th></tr></thead>
  <tbody>${floorRows}
    <tr class="subtotal"><td colspan="3">TOTAL</td><td class="num right">${fN(calc.areaEqTotal)}</td><td class="num right">${fN(calc.sections[0].incc)}</td><td class="num right">${fR(calc.sections[0].rs)}</td></tr>
  </tbody>
</table>` : ''}

${ap.mostrarImplantacao && implRows ? `
<div class="sec-title" style="margin-top:12px">Implantação</div>
<table>
  <thead><tr><th>Item</th><th class="right">INCC</th><th class="right">R$</th></tr></thead>
  <tbody>${implRows}<tr class="subtotal"><td colspan="2">TOTAL</td><td class="num right">${fR(calc.sections[2].rs)}</td></tr></tbody>
</table>` : ''}

${ap.mostrarProjetos && projRows ? `
<div class="sec-title" style="margin-top:12px">Projetos e Consultorias</div>
<table>
  <thead><tr><th>Especialidade</th><th>Projetista</th><th class="right">INCC/m²</th><th class="right">Total R$</th></tr></thead>
  <tbody>${projRows}<tr class="subtotal"><td colspan="3">TOTAL</td><td class="num right">${fR(calc.sections[3].rs)}</td></tr></tbody>
</table>` : ''}

<div class="footer">
  <span>${ap.notasRodape || 'Estimativa Paramétrica de Obras'} · Gerado em ${hoje}</span>
  <span>${ap.empresa || ''} ${ap.responsavel ? '· ' + ap.responsavel : ''}</span>
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
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function EstimativaApp() {
  const [tab, setTab] = useState('estimativa');
  const [db, setDb] = useState(DEFAULT_PROJECTS);
  const [projectsDb, setProjectsDb] = useState(PROJECTS_DB_SEED);
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

  // ─── Load from localStorage ───────────────────────────────────────────
  useEffect(() => {
    const load = (key, fallback) => {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    };
    setDb(load('obras_db', DEFAULT_PROJECTS));
    setProjectsDb(load('projetos_db', PROJECTS_DB_SEED));
    setElevatorsDb(load('elevadores_db', ELEVATORS_DB_SEED));
    setImplantacaoDb(load('implantacao_db', IMPLANTACAO_DB_SEED));
    setFundacaoDb(load('fundacao_db', FUNDACAO_DB_SEED));
    setEstimate({ ...EMPTY_ESTIMATE, ...load('current_estimate', {}) });
    setApresentacao({ ...DEFAULT_APRESENTACAO, ...load('apresentacao', {}) });
    setLoaded(true);
  }, []);

  // ─── Save db ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem('obras_db', JSON.stringify(db)); } catch {}
  }, [db, loaded]);

  // ─── Save projects db ─────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem('projetos_db', JSON.stringify(projectsDb)); } catch {}
  }, [projectsDb, loaded]);

  // ─── Save elevators db ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem('elevadores_db', JSON.stringify(elevatorsDb)); } catch {}
  }, [elevatorsDb, loaded]);

  // ─── Save implantacao db ──────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem('implantacao_db', JSON.stringify(implantacaoDb)); } catch {}
  }, [implantacaoDb, loaded]);

  // ─── Save fundacao db ─────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem('fundacao_db', JSON.stringify(fundacaoDb)); } catch {}
  }, [fundacaoDb, loaded]);

  // ─── Save estimate (debounced) ────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try { localStorage.setItem('current_estimate', JSON.stringify(estimate)); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [estimate, loaded]);

  // ─── Save apresentacao ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try { localStorage.setItem('apresentacao', JSON.stringify(apresentacao)); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [apresentacao, loaded]);

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
    const data = { db, projectsDb, elevatorsDb, implantacaoDb, fundacaoDb, estimate, exportedAt: new Date().toISOString() };
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

  const [confirmReset, setConfirmReset] = useState(false);
  const resetEstimate = () => {
    setEstimate(EMPTY_ESTIMATE);
    setConfirmReset(false);
    showToast('Estimativa zerada');
  };

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900" style={{
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .num { font-family: "JetBrains Mono", monospace; font-variant-numeric: tabular-nums; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* HEADER */}
      <header className="bg-slate-900 text-stone-100 border-b-4 border-amber-500">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">ESTIMATIVA PARAMÉTRICA</h1>
              <p className="text-xs text-stone-400 -mt-0.5">Engenharia de Custos · Base Histórica</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-stone-400 cursor-pointer hover:text-stone-200 px-3 py-1.5 border border-stone-700 hover:border-stone-500 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Importar
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button onClick={exportData} className="text-xs text-stone-400 hover:text-stone-200 px-3 py-1.5 border border-stone-700 hover:border-stone-500 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Backup
            </button>
            <button
              onClick={() => { generatePDF({ estimate, calc, refProject, apresentacao }); showToast('Abra o arquivo .html e imprima como PDF'); }}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-3 py-1.5 flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" /> Gerar PDF
            </button>
            {confirmReset ? (
              <span className="flex items-center gap-1">
                <span className="text-xs text-rose-300 mr-1">Confirmar?</span>
                <button onClick={resetEstimate} className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2 py-1">Sim</button>
                <button onClick={() => setConfirmReset(false)} className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1 border border-stone-700">Não</button>
              </span>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="text-xs text-stone-400 hover:text-rose-300 px-3 py-1.5 border border-stone-700 hover:border-rose-700 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-[1600px] mx-auto px-6">
          <nav className="flex gap-0">
            {[
              { id: 'estimativa',    label: 'Estimativa',      icon: Calculator },
              { id: 'baseDados',     label: 'Base de Dados',   icon: Database },
              { id: 'apresentacao',  label: 'Apresentação',    icon: FileDown },
              { id: 'analise',       label: 'Análise',         icon: BarChart3 },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-5 py-3 text-sm flex items-center gap-2 transition-all border-b-2 ${
                    active
                      ? 'text-amber-400 border-amber-500 bg-slate-800/50'
                      : 'text-stone-400 border-transparent hover:text-stone-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-2.5 text-sm shadow-xl border-l-4 ${
          toast.type === 'err' ? 'bg-rose-50 border-rose-500 text-rose-900' :
          toast.type === 'warn' ? 'bg-amber-50 border-amber-500 text-amber-900' :
          'bg-emerald-50 border-emerald-500 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'err' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {toast.msg}
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
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
          />
        )}
        {tab === 'analise' && (
          <AnaliseView calc={calc} refProject={refProject} estimate={estimate} db={db} />
        )}
      </main>

      {/* PROJECT EDITOR MODAL */}
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
    'implantacao', 'projetos', 'demais', 'administracao',
    'semIncorp', 'incorporacao', 'extras', 'semTaxa', 'comTaxa',
  ];
  const [collapsed, setCollapsed] = useState(() =>
    Object.fromEntries(SECTIONS.map((s) => [s, false]))
  );
  const toggle = (id) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  const collapseAll = () => setCollapsed(Object.fromEntries(SECTIONS.map((s) => [s, true])));
  const expandAll  = () => setCollapsed(Object.fromEntries(SECTIONS.map((s) => [s, false])));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-3">
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
              <input
                type="number" step="0.01"
                value={estimate.inccAtual}
                onChange={(e) => updateEst({ inccAtual: parseFloat(e.target.value) || 0 })}
                className="num w-full px-3 py-2 bg-amber-50 border border-amber-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-right"
              />
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
                  const updateItem = (patch) => updateEst({
                    implantacaoItems: estimate.implantacaoItems.map((x, j) => j === i ? { ...x, ...patch } : x),
                  });
                  return (
                    <tr key={i} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
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
                    <td colSpan={4} className="text-center py-6 text-stone-400 text-sm italic">
                      Nenhum item de implantação. Clique em "Adicionar item".
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-900 text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Implantação</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[2].incc)}</td>
                  <td className="px-3 py-2.5 text-right num text-amber-400">{fmtR$(calc.sections[2].rs)}</td>
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
                  />
                ))}
                {(estimate.projetosItems || []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-stone-400 text-sm italic">
                      Nenhuma especialidade. Clique em "Adicionar especialidade".
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-900 text-stone-100 font-semibold">
                  <td colSpan={4} className="px-3 py-2.5 text-right uppercase text-xs tracking-wider">
                    Total Projetos
                  </td>
                  <td className="px-3 py-2.5 text-right num text-xs">
                    {fmtNum(calc.sections[3].incc)} INCC
                  </td>
                  <td className="px-3 py-2.5 text-right num text-amber-400">{fmtR$(calc.sections[3].rs)}</td>
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

        {/* ─── OUTRAS SEÇÕES ─── */}
        <CollapsibleSection id="demais" label="Demais Categorias de Custo" color="#1F3864"
          totalINCC={calc.sections[1].incc + calc.sections[4].incc + calc.sections[5].incc + calc.sections[6].incc}
          totalRS={calc.sections[1].rs + calc.sections[4].rs + calc.sections[5].rs + calc.sections[6].rs}
          collapsed={collapsed.demais} onToggle={toggle}>
        <Card title="Demais Categorias de Custo">
          <div className="divide-y divide-stone-200">

            {/* ─── INFRAESTRUTURA ─── */}
            <div className="border-b border-stone-100">
              <div className="px-4 py-2 bg-slate-800 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Infraestrutura</span>
              </div>
              <div className="divide-y divide-stone-100">

                {/* Tipo de Fundação */}
                <div className="flex items-center px-5 py-2.5 gap-4">
                  <span className="w-52 flex-shrink-0 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Tipo de Fundação</span>
                  <select
                    value={estimate.infraTipoFundacao || ''}
                    onChange={(e) => { updateEst({ infraTipoFundacao: e.target.value }); updateOverride('custoInfra', null); }}
                    className="num px-3 py-1.5 bg-emerald-50 border border-emerald-400 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 w-56"
                  >
                    <option value="">— Selecione —</option>
                    {tiposFundacao.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                  {calc.infraFundacaoRec && (
                    <span className="text-xs text-stone-400 italic">
                      ref: {calc.infraFundacaoRec.obra} · coef {fmtNum(calc.infraFundacaoRec.coeficiente, 3)}
                    </span>
                  )}
                </div>

                {/* Área de Projeção da Torre */}
                <div className="flex items-center px-5 py-2.5 gap-4 bg-stone-50">
                  <span className="w-52 flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Área de Projeção da Torre</span>
                  <span className="num text-sm text-stone-700 font-medium w-28 text-right">
                    {toNum(estimate.areaProjTorre) > 0 ? fmtNum(toNum(estimate.areaProjTorre), 2) : <span className="text-stone-300">—</span>}
                  </span>
                  <span className="text-xs text-stone-400">m²</span>
                </div>

                {/* Nº Total de Pavimentos */}
                <div className="flex items-center px-5 py-2.5 gap-4">
                  <span className="w-52 flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Nº Total de Pavimentos</span>
                  <span className="num text-sm text-stone-700 font-medium w-28 text-right">
                    {toNum(estimate.numPavtos) > 0 ? estimate.numPavtos : <span className="text-stone-300">—</span>}
                  </span>
                </div>

                {/* Tipo de Contenção */}
                <div className="flex items-center px-5 py-2.5 gap-4 bg-stone-50">
                  <span className="w-52 flex-shrink-0 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Tipo de Contenção</span>
                  <input
                    type="text"
                    value={estimate.infraTipoContencao || ''}
                    onChange={(e) => updateEst({ infraTipoContencao: e.target.value })}
                    placeholder="— a definir —"
                    className="num px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 w-56 placeholder-stone-300"
                  />
                  <span className="text-[10px] text-stone-400 italic">base de dados futura</span>
                </div>

                {/* Override manual */}
                <div className="flex items-center px-5 py-2.5 gap-4">
                  <span className="w-52 flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Override INCC total</span>
                  <input
                    type="number" step="0.01"
                    value={estimate.overrides.custoInfra ?? ''}
                    onChange={(e) => updateOverride('custoInfra', e.target.value === '' ? null : parseFloat(e.target.value))}
                    placeholder={calc.infraCalcINCC !== null ? fmtNum(calc.infraCalcINCC, 2) : '—'}
                    className="num w-36 px-3 py-1.5 text-right text-sm bg-amber-50 border border-amber-200 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-stone-400">sobrescreve o cálculo da base</span>
                  {estimate.overrides.custoInfra !== null && estimate.overrides.custoInfra !== undefined && (
                    <button onClick={() => updateOverride('custoInfra', null)} className="text-stone-400 hover:text-amber-700">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Custo Total */}
                <div className="flex items-center px-5 py-3 gap-4 bg-slate-50 border-t-2 border-slate-200">
                  <span className="w-52 flex-shrink-0 text-[11px] font-bold text-slate-900 uppercase tracking-wider">Custo Total</span>
                  <div className="flex items-stretch gap-0 border border-slate-300 overflow-hidden">
                    <div className="flex flex-col items-center">
                      <div className="num px-5 py-2 bg-white text-sm font-bold text-slate-900 min-w-[140px] text-right border-r border-slate-300">
                        {fmtNum(calc.sections[1].incc, 2)}
                      </div>
                      <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 w-full text-center border-r border-slate-200 bg-stone-50">INCC</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="num px-5 py-2 bg-slate-700 text-amber-400 text-sm font-bold min-w-[160px] text-right">
                        {fmtR$2(calc.sections[1].rs)}
                      </div>
                      <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 w-full text-center bg-stone-50">R$</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ─── ELEVADORES ─── */}
            <div className="border-b border-stone-100">
              <div className="px-4 py-2 bg-slate-800 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Elevador</span>
              </div>

              <div className="divide-y divide-stone-100">

                {/* Obra Base */}
                <div className="flex items-center px-5 py-2.5 gap-4">
                  <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Obra Base</span>
                  <select
                    value={estimate.elevadorObraRef || ''}
                    onChange={(e) => {
                      updateEst({ elevadorObraRef: e.target.value, elevNumParadas: null });
                      updateOverride('custoElevador', null);
                    }}
                    className="num px-3 py-1.5 bg-emerald-50 border border-emerald-400 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 w-56"
                  >
                    <option value="">— Selecione —</option>
                    {(elevatorsDb || []).filter(r => r.valorFechado > 0 && r.inccBase > 0).map((r) => (
                      <option key={r.id} value={r.obra}>{r.obra}</option>
                    ))}
                  </select>
                </div>

                {/* Marca */}
                <div className="flex items-center px-5 py-2.5 gap-4 bg-stone-50">
                  <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Marca</span>
                  <span className="text-sm text-stone-700 font-medium num">
                    {calc.elevDbRec?.marca || <span className="text-stone-300 font-normal">—</span>}
                  </span>
                </div>

                {/* Nº de Paradas */}
                <div className="flex items-center px-5 py-2.5 gap-4">
                  <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Nº de Paradas</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number" step="1" min="0"
                      value={estimate.elevNumParadas !== null && estimate.elevNumParadas !== undefined && estimate.elevNumParadas !== ''
                        ? estimate.elevNumParadas
                        : calc.elevNumParadasAuto}
                      onChange={(e) => updateEst({ elevNumParadas: e.target.value === '' ? null : parseInt(e.target.value) || 0 })}
                      className="num w-28 px-3 py-1.5 bg-amber-50 border border-amber-300 text-sm text-right font-semibold focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-stone-400 italic">
                      {(estimate.elevNumParadas === null || estimate.elevNumParadas === undefined || estimate.elevNumParadas === '')
                        ? `automático (${calc.elevNumParadasAuto} pav. − 1) · Modificar se necessário`
                        : 'modificado manualmente'}
                    </span>
                    {(estimate.elevNumParadas !== null && estimate.elevNumParadas !== undefined && estimate.elevNumParadas !== '') && (
                      <button
                        onClick={() => updateEst({ elevNumParadas: null })}
                        className="text-xs text-stone-400 hover:text-amber-700 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> auto
                      </button>
                    )}
                  </div>
                </div>

                {/* Qt. de Elevadores */}
                <div className="flex items-center px-5 py-2.5 gap-4 bg-stone-50">
                  <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Qt. de Elevadores</span>
                  <span className="text-sm text-stone-700 font-semibold num w-28 text-right">
                    {toNum(estimate.numElevadores) || '—'}
                  </span>
                  <span className="text-xs text-stone-400 italic">definido em Informações do Empreendimento</span>
                </div>

                {/* Val/parada/elev */}
                {calc.elevValorPPE_INCC !== null && (
                  <div className="flex items-center px-5 py-2.5 gap-4">
                    <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Val./parada/elev.</span>
                    <span className="text-sm num font-semibold text-emerald-700">
                      {fmtNum(calc.elevValorPPE_INCC, 4)}
                      <span className="text-stone-400 font-normal text-xs ml-1">INCC</span>
                    </span>
                    <span className="text-xs text-stone-400">
                      × {calc.elevNumParadas} paradas × {toNum(estimate.numElevadores)} elev.
                    </span>
                  </div>
                )}

                {/* Override */}
                <div className="flex items-center px-5 py-2.5 gap-4 bg-stone-50">
                  <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Override INCC/p.e.</span>
                  <input
                    type="number" step="0.0001"
                    value={estimate.overrides.custoElevador ?? ''}
                    onChange={(e) => updateOverride('custoElevador', e.target.value === '' ? null : parseFloat(e.target.value))}
                    placeholder={calc.elevValorPPE_INCC !== null ? fmtNum(calc.elevValorPPE_INCC, 4) : '—'}
                    className="num w-28 px-3 py-1.5 text-right text-sm bg-amber-50 border border-amber-200 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-stone-400">sobrescreve o valor da base</span>
                  {estimate.overrides.custoElevador !== null && estimate.overrides.custoElevador !== undefined && (
                    <button onClick={() => updateOverride('custoElevador', null)} className="text-stone-400 hover:text-amber-700">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Custo Total */}
                <div className="flex items-center px-5 py-3 gap-4 bg-slate-50 border-t-2 border-slate-200">
                  <span className="w-44 flex-shrink-0 text-[11px] font-bold text-slate-900 uppercase tracking-wider">Custo Total</span>
                  <div className="flex items-stretch gap-0 border border-slate-300 overflow-hidden">
                    <div className="flex flex-col items-center">
                      <div className="num px-5 py-2 bg-white text-sm font-bold text-slate-900 min-w-[140px] text-right border-r border-slate-300">
                        {fmtNum(calc.sections[4].incc, 2)}
                      </div>
                      <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 w-full text-center border-r border-slate-200 bg-stone-50">INCC</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="num px-5 py-2 bg-slate-700 text-amber-400 text-sm font-bold min-w-[160px] text-right">
                        {fmtR$2(calc.sections[4].rs)}
                      </div>
                      <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 w-full text-center bg-stone-50">R$</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <SectionRow
              label="Fachada"
              hint={`× ${fmtNum(calc.fachadaArea, 0)} m² (perím × altura)`}
              refValue={refProject?.custoFachadaM2}
              overrideValue={estimate.overrides.custoFachadaM2}
              onChange={(v) => updateOverride('custoFachadaM2', v)}
              incc={calc.sections[5].incc}
              rs={calc.sections[5].rs}
              unit="INCC/m²"
              extraField={
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-stone-500">Área manual:</span>
                  <input
                    type="number" step="1"
                    value={estimate.overrides.fachadaArea || ''}
                    onChange={(e) => updateOverride('fachadaArea', e.target.value ? parseFloat(e.target.value) : null)}
                    className="num w-20 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-right focus:outline-none focus:border-amber-500"
                    placeholder="auto"
                  />
                </div>
              }
            />
            <SectionRow
              label="Ensaios + Sistemas"
              hint="Controle tecnológico, ensaios, FVS"
              refValue={refProject?.custoEnsaios}
              overrideValue={estimate.overrides.custoEnsaios}
              onChange={(v) => updateOverride('custoEnsaios', v)}
              incc={calc.sections[6].incc}
              rs={calc.sections[6].rs}
              unit="INCC total"
            />
          </div>
        </Card>

        </CollapsibleSection>

        {/* ─── ADMINISTRAÇÃO ─── */}
        <CollapsibleSection id="administracao" label="Administração" color="#9333ea"
          totalINCC={calc.sections[7].incc} totalRS={calc.sections[7].rs} collapsed={collapsed.administracao} onToggle={toggle}>
        <Card title="">
          <div className="px-4 py-2 bg-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Administração</span>
          </div>

          <div className="divide-y divide-stone-100">
            {[
              { key: 'admEquipeINCC',   label: 'Equipe Administrativa' },
              { key: 'admDiversosINCC', label: 'Diversos'              },
              { key: 'admLimpezaINCC',  label: 'Limpeza e Transportes' },
            ].map(({ key, label }, idx) => {
              const inccVal = toNum(estimate[key]);
              const rsVal = inccVal * toNum(estimate.inccAtual);
              return (
                <div key={key} className={idx % 2 === 0 ? '' : 'bg-stone-50'}>
                  {/* Sub-header — mesmo estilo do infra */}
                  <div className="px-5 pt-3 pb-1">
                    <div className="border border-stone-300 text-center py-1">
                      <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">{label}</span>
                    </div>
                  </div>
                  {/* Linha Custo Total — mesmo padrão elevador/infra */}
                  <div className="flex items-center px-5 py-3 gap-4">
                    <span className="w-44 flex-shrink-0 text-[11px] font-bold text-slate-900 uppercase tracking-wider">Custo Total</span>
                    <div className="flex items-stretch border border-slate-300 overflow-hidden">
                      <div className="flex flex-col">
                        <input
                          type="number" step="0.001"
                          value={inccVal === 0 ? '' : inccVal}
                          onChange={(e) => updateEst({ [key]: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="num px-4 py-2 bg-white text-sm font-bold text-slate-900 w-36 text-right border-r border-slate-300 focus:outline-none focus:bg-amber-50"
                        />
                        <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center border-r border-slate-200 bg-stone-50">(INCC)</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="num px-4 py-2 bg-slate-700 text-amber-400 text-sm font-bold w-44 text-right">
                          {fmtR$(rsVal)}
                        </div>
                        <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center bg-stone-50">(R$)</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total geral */}
            <div className="bg-slate-800">
              <div className="px-5 py-1.5 text-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-200">Total</span>
              </div>
            </div>
            <div className="flex items-center px-5 py-3 gap-4 bg-slate-50 border-t-2 border-slate-300">
              <span className="w-44 flex-shrink-0 text-[11px] font-bold text-slate-900 uppercase tracking-wider">Custo Total</span>
              <div className="flex items-stretch border border-slate-300 overflow-hidden">
                <div className="flex flex-col">
                  <div className="num px-4 py-2 bg-white text-sm font-bold text-slate-900 w-36 text-right border-r border-slate-300">
                    {fmtNum(calc.sections[7].incc, 3)}
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center border-r border-slate-200 bg-stone-50">(INCC)</div>
                </div>
                <div className="flex flex-col">
                  <div className="num px-4 py-2 bg-slate-700 text-amber-400 text-sm font-bold w-44 text-right">
                    {fmtR$(calc.sections[7].rs)}
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center bg-stone-50">(R$)</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
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
        <Card title="">
          <div className="px-4 py-2 bg-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-200">Incorporação</span>
          </div>

          {/* Resumo incorporação */}
          <div className="divide-y divide-stone-100">
            <TotalRow label="Custo Incorporação" incc={calc.sections[8].incc} rs={calc.sections[8].rs} />
            <TotalRow label="Custo Incorporação por m²" incc={toNum(estimate.areaConstruida) > 0 ? calc.sections[8].incc / toNum(estimate.areaConstruida) : 0} rs={toNum(estimate.areaConstruida) > 0 ? calc.sections[8].rs / toNum(estimate.areaConstruida) : 0} />
          </div>

          {/* Detalhamento */}
          <div className="border-t border-stone-300">
            <div className="px-4 py-2 border border-stone-300 mx-4 my-2 text-center">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">Custo Incorporação Detalhado</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 text-stone-200 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium">Item</th>
                  <th className="text-right px-3 py-2.5 font-medium w-40">Custo Total (INCC)</th>
                  <th className="text-right px-4 py-2.5 font-medium w-44">Custo Total (R$)</th>
                </tr>
              </thead>
              <tbody>
                {(estimate.incorporacaoItems || []).map((item, i) => {
                  const inccVal = toNum(item.valorINCC);
                  const rsVal = inccVal * toNum(estimate.inccAtual);
                  const updateItem = (v) => updateEst({
                    incorporacaoItems: estimate.incorporacaoItems.map((x) => x.id === item.id ? { ...x, valorINCC: v } : x),
                  });

                  // Group row: sum of sub-items
                  if (item.isGroup) {
                    const groupTotal = (estimate.incorporacaoItems || [])
                      .filter((x) => x.isSubItem)
                      .reduce((s, x) => s + toNum(x.valorINCC), 0);
                    const groupRS = groupTotal * toNum(estimate.inccAtual);
                    return (
                      <tr key={item.id} className="bg-stone-100 border-t border-stone-300">
                        <td className="px-4 py-2 font-semibold text-slate-900 uppercase text-xs tracking-wide">{item.nome}</td>
                        <td className="px-3 py-2 text-right num font-semibold text-slate-900">{fmtNum(groupTotal, 3)}</td>
                        <td className="px-4 py-2 text-right num font-semibold text-amber-700">{fmtR$(groupRS)}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.id} className={`${i % 2 ? 'bg-stone-50' : 'bg-white'} ${item.isSubItem ? 'opacity-90' : ''}`}>
                      <td className={`px-4 py-1.5 text-stone-700 ${item.isSubItem ? 'pl-10 text-xs italic' : ''}`}>{item.nome}</td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number" step="0.001"
                          value={inccVal === 0 ? '' : inccVal}
                          onChange={(e) => updateItem(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="num w-full px-2 py-1 text-right bg-amber-50 border border-amber-200 focus:outline-none focus:border-amber-500 text-sm"
                        />
                      </td>
                      <td className="px-4 py-1.5 text-right num text-stone-700">{fmtR$(rsVal)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-900 text-stone-100 font-semibold">
                  <td className="px-4 py-2.5 text-left uppercase text-xs tracking-wider">Total Incorporação</td>
                  <td className="px-3 py-2.5 text-right num">{fmtNum(calc.sections[8].incc, 3)}</td>
                  <td className="px-4 py-2.5 text-right num text-amber-400">{fmtR$(calc.sections[8].rs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
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
      <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <div className="bg-slate-900 text-stone-100 border-l-4 border-amber-500">
          <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-stone-400 font-medium">Resumo Financeiro</h3>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-[10px] uppercase text-stone-500 tracking-wider mb-1">Custo Final</div>
              <div className="num text-3xl font-semibold text-amber-400 leading-none">
                {fmtR$(calc.totalFinalRS)}
              </div>
              <div className="num text-xs text-stone-400 mt-1.5">
                {fmtNum(calc.totalFinalINCC, 2)} INCC
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
              <div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">R$/m²</div>
                <div className="num text-base font-medium text-stone-100 mt-0.5">
                  {fmtR$(calc.custoFinalM2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-stone-500 tracking-wider">Área Eq.</div>
                <div className="num text-base font-medium text-stone-100 mt-0.5">
                  {fmtNum(calc.areaEqTotal, 2)} m²
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-700">
              <SummaryRow label="Subtotal" value={calc.subtotalRS} />
              <SummaryRow label="+ Incorporação" value={calc.sections[8].rs} />
              <SummaryRow label="+ Extras" value={calc.sections[9].rs} />
              <SummaryRow label="+ Taxa Adm" value={calc.taxaAdmRS} accent />
            </div>
          </div>
        </div>

        {/* Mini chart */}
        <div className="bg-white border border-stone-200">
          <div className="px-5 py-3 border-b border-stone-200">
            <h3 className="text-xs uppercase tracking-wider text-stone-500 font-medium">Distribuição de Custo</h3>
          </div>
          <div className="p-3" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calc.sections.filter((s) => s.rs > 0)}
                  dataKey="rs" nameKey="label"
                  cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                  paddingAngle={1}
                >
                  {calc.sections.filter((s) => s.rs > 0).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => fmtR$(v)}
                  contentStyle={{ background: '#0f172a', border: 'none', color: '#f5f5f4', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-3 pb-3 space-y-1">
            {calc.sections.filter((s) => s.rs > 0).map((s, i) => {
              const pct = calc.totalSemTaxaRS > 0 ? s.rs / calc.totalSemTaxaRS : 0;
              return (
                <div key={s.key} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="flex-1 text-stone-600 truncate">{s.label}</span>
                  <span className="num text-stone-500">{fmtPct(pct)}</span>
                  <span className="num font-medium text-stone-800 w-20 text-right">{fmtR$(s.rs)}</span>
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

      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider">
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
function ProjetoItemRow({ item, index, projectsDb, areaConstruida, inccAtual, onUpdate, onRemove }) {
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
      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider">
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

      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider">
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

      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider">
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
      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-stone-200 text-xs uppercase tracking-wider">
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
function ApresentacaoView({ estimate, calc, refProject, apresentacao, setApresentacao }) {
  const ap = apresentacao;
  const set = (k, v) => setApresentacao((prev) => ({ ...prev, [k]: v }));

  // Mini preview colors
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

      {/* ── PAINEL ESQUERDO: CONFIGURAÇÕES ── */}
      <div className="space-y-4">

        {/* Botão principal */}
        <button
          onClick={() => { generatePDF({ estimate, calc, refProject, apresentacao }); }}
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
                <input
                  type="color"
                  value={ap.corPrimaria}
                  onChange={(e) => set('corPrimaria', e.target.value)}
                  className="w-10 h-9 p-0.5 border border-stone-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={ap.corPrimaria}
                  onChange={(e) => set('corPrimaria', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-stone-300 text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </Field>
            <Field label="Cor de Acento" hint="barra, destaques">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={ap.corAcento}
                  onChange={(e) => set('corAcento', e.target.value)}
                  className="w-10 h-9 p-0.5 border border-stone-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={ap.corAcento}
                  onChange={(e) => set('corAcento', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-stone-300 text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </Field>
            <button
              onClick={() => { set('corPrimaria', '#1F3864'); set('corAcento', '#f59e0b'); }}
              className="col-span-2 text-xs text-stone-600 hover:text-slate-900 px-2 py-1 border border-stone-200 hover:border-stone-400"
            >
              ↺ Restaurar cores padrão
            </button>
          </div>
        </Card>

        {/* Seções visíveis */}
        <Card title="Seções do Relatório">
          <div className="p-3 space-y-1">
            <div className="flex items-center justify-between px-1 pb-2 mb-1 border-b border-stone-100">
              <span className="text-xs text-stone-500">Marque as seções que devem aparecer no PDF</span>
              <div className="flex gap-2">
                <button onClick={() => SECOES.forEach((s) => set(s.key, true))}
                  className="text-xs text-emerald-700 hover:underline">Todas</button>
                <button onClick={() => SECOES.forEach((s) => set(s.key, false))}
                  className="text-xs text-rose-600 hover:underline">Nenhuma</button>
              </div>
            </div>
            {SECOES.map((s) => (
              <label key={s.key} className="flex items-center gap-3 px-1 py-1.5 rounded hover:bg-stone-50 cursor-pointer">
                <div
                  onClick={() => set(s.key, !ap[s.key])}
                  className={`w-9 h-5 flex-shrink-0 relative cursor-pointer transition-colors ${ap[s.key] ? 'bg-emerald-500' : 'bg-stone-300'}`}
                  style={{ borderRadius: 2 }}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${ap[s.key] ? 'translate-x-4' : 'translate-x-0.5'}`}
                    style={{ borderRadius: 1 }} />
                </div>
                <span className={`text-sm ${ap[s.key] ? 'text-slate-800' : 'text-stone-400'}`}>{s.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Textos */}
        <Card title="Textos Personalizados">
          <div className="p-4 space-y-3">
            <Field label="Texto de Introdução" hint="aparece logo após o cabeçalho">
              <textarea
                value={ap.notasIntroducao}
                onChange={(e) => set('notasIntroducao', e.target.value)}
                rows={3}
                placeholder="Ex: Esta estimativa foi elaborada com base em dados históricos de obras similares..."
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </Field>
            <Field label="Nota de Rodapé">
              <textarea
                value={ap.notasRodape}
                onChange={(e) => set('notasRodape', e.target.value)}
                rows={2}
                placeholder="Ex: Valores sujeitos a revisão. Estimativa válida por 30 dias."
                className="w-full px-3 py-2 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </Field>
          </div>
        </Card>

        {/* Reset */}
        <button
          onClick={() => setApresentacao(DEFAULT_APRESENTACAO)}
          className="w-full py-2 text-xs text-stone-500 hover:text-rose-600 border border-stone-200 hover:border-rose-300"
        >
          ↺ Restaurar configurações padrão
        </button>
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
              <div style={{ fontSize: 14, fontWeight: 700 }}>{(estimate.nome || 'NOME DO EMPREENDIMENTO').toUpperCase()}</div>
              {estimate.endereco && <div style={{ fontSize: 8, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>{estimate.endereco}</div>}
            </div>
            <div style={{ textAlign: 'right', fontSize: 8, color: 'rgba(255,255,255,.65)' }}>
              {ap.empresa && <div style={{ fontWeight: 600, color: '#fff' }}>{ap.empresa}</div>}
              {ap.responsavel && <div>{ap.responsavel}{ap.cargo ? ` · ${ap.cargo}` : ''}</div>}
              {ap.contato && <div>{ap.contato}</div>}
              <div>Data: {new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>
          <div style={{ height: 4, background: cor2 }} />

          {/* Introdução */}
          {ap.notasIntroducao && (
            <div style={{ borderLeft: `4px solid ${cor2}`, padding: '6px 10px', margin: '8px', fontSize: 8, color: '#374151', background: '#fffbeb' }}>
              {ap.notasIntroducao}
            </div>
          )}

          {/* KPIs */}
          {ap.mostrarKPIs && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, padding: '8px 8px 4px' }}>
              {[
                { l: 'Área Construída', v: `${fmtNum(toNum(estimate.areaConstruida), 0)} m²` },
                { l: 'Área Equivalente', v: `${fmtNum(calc.areaEqTotal, 0)} m²` },
                { l: 'Custo / m²', v: fmtR$(calc.custoFinalM2) },
                { l: 'Custo Total', v: fmtR$(calc.totalFinalRS), hl: true },
                { l: 'INCC Atual', v: fmtNum(toNum(estimate.inccAtual), 2) },
                { l: 'Fator INCC', v: `${fmtNum(calc.fator, 4)}×` },
                { l: 'Pavimentos', v: estimate.numPavtos || '—' },
                { l: 'Prazo (meses)', v: estimate.prazoObra || '—' },
              ].map((k) => (
                <div key={k.l} style={{ border: `1px solid ${k.hl ? cor2 : '#d1d5db'}`, borderLeft: k.hl ? `3px solid ${cor2}` : undefined, padding: '4px 6px' }}>
                  <div style={{ fontSize: 7, textTransform: 'uppercase', color: '#6b7280' }}>{k.l}</div>
                  <div style={{ fontSize: k.hl ? 11 : 9, fontWeight: 700, color: k.hl ? cor2 : '#0f172a', fontFamily: 'monospace', marginTop: 1 }}>{k.v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Resumo financeiro */}
          {ap.mostrarResumoFinanceiro && (
            <div style={{ padding: '4px 8px' }}>
              <div style={{ background: cor1, color: '#fff', fontSize: 8, fontWeight: 700, padding: '3px 6px', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Resumo Financeiro</div>
              <div style={{ border: `2px solid ${cor1}`, padding: '6px 10px' }}>
                {[
                  ['Subtotal s/ incorporação', calc.subtotalRS],
                  ['Incorporação', (calc.sections[8] || {}).rs || 0],
                  ['Itens Extras', (calc.sections[9] || {}).rs || 0],
                  [`Taxa Adm (${fmtPct(toNum(estimate.taxaAdm))})`, calc.taxaAdmRS],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '2px 0', fontSize: 8 }}>
                    <span>{l}</span><span style={{ fontFamily: 'monospace' }}>{fmtR$(v)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, fontSize: 10, fontWeight: 700, color: cor1 }}>
                  <span>CUSTO TOTAL</span>
                  <span style={{ fontFamily: 'monospace', color: cor2 }}>{fmtR$(calc.totalFinalRS)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Distribuição por categoria */}
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
                  {calc.sections.filter((s) => s.rs > 0).map((s, i) => (
                    <tr key={s.key} style={{ background: i % 2 ? '#f8fafc' : '#fff' }}>
                      <td style={{ padding: '2.5px 5px', borderBottom: '1px solid #f1f5f9' }}>{s.label}</td>
                      <td style={{ padding: '2.5px 5px', textAlign: 'right', fontFamily: 'monospace', borderBottom: '1px solid #f1f5f9' }}>{fmtR$(s.rs)}</td>
                      <td style={{ padding: '2.5px 5px', textAlign: 'right', fontFamily: 'monospace', borderBottom: '1px solid #f1f5f9' }}>{fmtPct(calc.totalFinalRS > 0 ? s.rs / calc.totalFinalRS : 0)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: cor1, color: '#fff', fontWeight: 700 }}>
                    <td colSpan={2} style={{ padding: '3px 5px' }}>CUSTO TOTAL</td>
                    <td style={{ padding: '3px 5px', textAlign: 'right', fontFamily: 'monospace', color: cor2 }}>{fmtR$(calc.totalFinalRS)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Seções desabilitadas: label visual */}
          {SECOES.filter((s) => !ap[s.key]).length > 0 && (
            <div style={{ padding: '4px 8px 8px' }}>
              <div style={{ fontSize: 7, color: '#9ca3af', padding: '4px 6px', background: '#f9fafb', border: '1px dashed #d1d5db' }}>
                Seções ocultas: {SECOES.filter((s) => !ap[s.key]).map((s) => s.label).join(' · ')}
              </div>
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
    <div className={`bg-white border border-stone-200 ${accent ? 'border-l-4 border-l-amber-500' : ''}`}>
      <div className="px-5 py-3 border-b border-stone-200 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider text-stone-600 font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Collapsible section wrapper — usado para agrupar módulos na Estimativa
function CollapsibleSection({ id, label, color = '#1F3864', totalINCC, totalRS, inccAtual, children, collapsed, onToggle }) {
  const fR = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  const fN = (n, d = 3) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);
  return (
    <div className="border border-stone-200 bg-white overflow-hidden" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
      {/* Header clicável */}
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors text-left"
        style={{ background: collapsed ? '#f8fafc' : 'white' }}
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            className="w-4 h-4 text-stone-400 transition-transform flex-shrink-0"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">{label}</span>
        </div>
        {collapsed && totalINCC != null && (
          <div className="flex items-center gap-4 text-xs num">
            <span className="text-stone-500">{fN(totalINCC)} INCC</span>
            <span className="font-semibold text-slate-900">{fR(totalRS)}</span>
          </div>
        )}
        {!collapsed && (
          <span className="text-[10px] text-stone-400 uppercase tracking-wider">Clique para recolher</span>
        )}
      </button>
      {/* Conteúdo */}
      {!collapsed && (
        <div className="border-t border-stone-200">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children, span2 }) {
  return (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label className="block text-xs text-stone-600 mb-1">
        {label}
        {hint && <span className="text-stone-400 ml-1">· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function FieldSection({ title, children }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2 pb-1 border-b border-stone-200">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-1.5 bg-white border border-stone-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
    />
  );
}

function NumInput({ value, onChange, int }) {
  return (
    <input
      type="number"
      step={int ? '1' : '0.01'}
      value={value === 0 ? '' : value || ''}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? 0 : (int ? parseInt(v) || 0 : parseFloat(v) || 0));
      }}
      placeholder="0"
      className="num w-full px-3 py-1.5 bg-amber-50 border border-amber-200 text-sm text-right focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
    />
  );
}

function Stat({ label, value, highlight, small }) {
  return (
    <div className={`bg-stone-50 px-3 py-2 border-l-2 ${highlight ? 'border-amber-500' : 'border-stone-300'}`}>
      <div className="text-[10px] uppercase tracking-wider text-stone-500">{label}</div>
      <div className={`num ${small ? 'text-xs' : 'text-sm'} font-medium ${highlight ? 'text-amber-700' : 'text-slate-900'} mt-0.5`}>
        {value}
      </div>
    </div>
  );
}

function OverrideControl({ value, refValue, onChange, label }) {
  const isOverride = value !== null && value !== undefined && value !== '';
  return (
    <div className="flex items-center gap-2">
      {isOverride ? (
        <button
          onClick={() => onChange(null)}
          className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200"
          title="Voltar ao valor da obra de referência"
        >
          <RotateCcw className="w-3 h-3" /> Reverter
        </button>
      ) : null}
      <input
        type="number" step="0.01"
        value={isOverride ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
        placeholder={refValue !== undefined ? fmtNum(refValue) : '—'}
        className={`num w-32 px-2 py-1 text-right text-sm border focus:outline-none focus:border-amber-500 ${
          isOverride ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}
      />
      <span className="text-xs text-stone-500">{label}</span>
    </div>
  );
}

function SectionRow({ label, hint, refValue, overrideValue, onChange, incc, rs, unit, extraField }) {
  const isOverride = overrideValue !== null && overrideValue !== undefined && overrideValue !== '';
  return (
    <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center hover:bg-stone-50">
      <div>
        <div className="text-sm font-medium text-slate-900">{label}</div>
        <div className="text-xs text-stone-500">{hint}</div>
      </div>
      <div className="flex items-center gap-2">
        {extraField}
        <input
          type="number" step="0.01"
          value={isOverride ? overrideValue : ''}
          onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
          placeholder={refValue !== undefined ? fmtNum(refValue) : '—'}
          className={`num w-32 px-2 py-1 text-right text-sm border focus:outline-none focus:border-amber-500 ${
            isOverride ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        />
        <span className="text-[10px] uppercase tracking-wider text-stone-400 w-16">{unit}</span>
        {isOverride && (
          <button
            onClick={() => onChange(null)}
            className="text-stone-400 hover:text-amber-700"
            title="Reverter ao valor da obra de referência"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="text-right">
        <div className="num text-sm font-semibold text-slate-900">{fmtR$(rs)}</div>
        <div className="num text-xs text-stone-500">{fmtNum(incc)} INCC</div>
      </div>
    </div>
  );
}

function TotalRow({ label, incc, rs, highlight }) {
  return (
    <div className={`flex items-center px-5 py-3 gap-4 ${highlight ? 'bg-slate-50 border-t-2 border-slate-300' : ''}`}>
      <span className={`w-72 flex-shrink-0 text-[11px] uppercase tracking-wider ${highlight ? 'font-bold text-slate-900' : 'font-semibold text-stone-500'}`}>
        {label}
      </span>
      <div className="flex items-stretch border border-slate-300 overflow-hidden ml-auto">
        <div className="flex flex-col">
          <div className={`num px-4 py-2 text-sm font-bold w-36 text-right border-r border-slate-300 ${highlight ? 'bg-white text-slate-900' : 'bg-white text-slate-900'}`}>
            {fmtNum(incc, 3)}
          </div>
          <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center border-r border-slate-200 bg-stone-50">(INCC)</div>
        </div>
        <div className="flex flex-col">
          <div className={`num px-4 py-2 text-sm font-bold w-44 text-right ${highlight ? 'bg-amber-600 text-white' : 'bg-slate-700 text-amber-400'}`}>
            {fmtR$(rs)}
          </div>
          <div className="text-[9px] text-stone-400 uppercase tracking-wider py-0.5 text-center bg-stone-50">(R$)</div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={accent ? 'text-amber-300' : 'text-stone-400'}>{label}</span>
      <span className={`num ${accent ? 'text-amber-300 font-medium' : 'text-stone-200'}`}>
        {fmtR$(value)}
      </span>
    </div>
  );
}
