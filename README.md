# ConstrutorPRO

Sistema de gestão de obras com módulo de estimativa paramétrica.

## Instalação

```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)

1. Crie o repositório no GitHub
2. Ative GitHub Pages: Settings → Pages → Source: GitHub Actions
3. Faça push para a branch `main` — o workflow faz o deploy automaticamente

## Estrutura

```
├── src/
│   ├── main.jsx              # Entry point React
│   └── estimativa_app.jsx    # App principal (Home + Estimativa + módulos)
├── index.html
├── package.json
├── vite.config.js
└── .github/workflows/
    └── deploy.yml            # CI/CD GitHub Pages
```

## Módulos

| Módulo        | Status            |
|---------------|-------------------|
| Estimativa    | ✅ Disponível     |
| Obras         | 🚧 Em desenvolvimento |
| Orçamentos    | 🚧 Em desenvolvimento |
| Levantamentos | 🚧 Em desenvolvimento |
| Planejamento  | 🚧 Em desenvolvimento |
| Cronograma    | 🚧 Em desenvolvimento |
| Controles     | 🚧 Em desenvolvimento |
| Indicadores   | 🚧 Em desenvolvimento |
