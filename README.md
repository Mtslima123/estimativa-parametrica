# Estimativa Paramétrica de Obras

App de estimativa paramétrica com base histórica de dados — React + Vite.

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Conta no [GitHub](https://github.com)

---

## 🚀 Deploy no GitHub Pages — Passo a passo

### 1. Criar o repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **New repository**
3. Nome: `estimativa-parametrica` (exato, sem espaços)
4. Visibilidade: **Public** (necessário para GitHub Pages gratuito)
5. Clique em **Create repository**

---

### 2. Configurar o projeto localmente

Abra o terminal/prompt na pasta do projeto e execute:

```bash
# Instalar dependências
npm install

# Testar localmente antes de publicar
npm run dev
```

O app abre em `http://localhost:5173` — verifique se está tudo funcionando.

---

### 3. Ajustar o nome do repositório nos arquivos

Edite os dois arquivos abaixo substituindo `SEU_USUARIO` pelo seu usuário do GitHub:

**`package.json`** — linha `"homepage"`:
```json
"homepage": "https://SEU_USUARIO.github.io/estimativa-parametrica"
```

**`vite.config.js`** — linha `base`:
```js
base: '/estimativa-parametrica/'
```

> ⚠️ Se escolheu um nome diferente para o repositório, use esse nome nos dois lugares.

---

### 4. Subir o código para o GitHub

```bash
# Inicializar git no projeto
git init
git add .
git commit -m "primeiro commit"

# Conectar ao repositório criado (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/estimativa-parametrica.git
git branch -M main
git push -u origin main
```

---

### 5. Publicar no GitHub Pages

```bash
npm run deploy
```

Aguarde ~2 minutos e acesse:
```
https://SEU_USUARIO.github.io/estimativa-parametrica
```

---

## 🔄 Atualizações futuras

Sempre que quiser publicar uma versão nova:

```bash
git add .
git commit -m "descrição da mudança"
git push
npm run deploy
```

---

## 💾 Dados

Os dados ficam salvos no **localStorage** do navegador onde o app é aberto.

- **Backup**: botão "Backup" no topo → exporta `.json` com tudo
- **Restaurar**: botão "Importar" → carrega o `.json` de backup
- Os dados **não sincronizam** entre dispositivos — use o backup para migrar

---

## 📁 Estrutura do projeto

```
estimativa-parametrica/
├── index.html          ← entrada HTML
├── vite.config.js      ← configuração do bundler
├── package.json        ← dependências e scripts
├── src/
│   ├── main.jsx        ← ponto de entrada React
│   └── App.jsx         ← app completo
└── .gitignore
```
