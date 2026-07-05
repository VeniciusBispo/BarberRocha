# BarberRocha 💈🪒✂️

Sistema completo de agendamento online e painel administrativo para a Barbearia Rocha 20. 

Este ecossistema foi refatorado utilizando as melhores práticas de Engenharia de Software, incluindo Clean Architecture no backend e um padrão modular baseado em recursos (Features) no frontend React.

---

## 📁 Estrutura do Projeto

- `/backend`: Servidor Express em TypeScript configurado com MongoDB (Mongoose), autenticação JWT, tratamento estruturado de erros e integrações (WhatsApp/Logger).
- `/frontend`: Aplicação SPA React 19 (Vite) utilizando Hooks customizados, Contexts globais para estados comuns, Skeletons de carregamento e interface premium dark mode com detalhes dourados.

---

## ⚡ Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (v18+)
- MongoDB Atlas (ou instância local do MongoDB)

### 1. Configurando o Backend
1. Entre na pasta `/backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie e preencha as variáveis de ambiente no arquivo `.env` (use `.env.example` como referência):
   ```env
   PORT=3000
   MONGODB_URI=sua_uri_mongodb
   JWT_SECRET=sua_chave_secreta_jwt
   ```
4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 2. Configurando o Frontend
1. Entre na pasta `/frontend`:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute a aplicação de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O frontend estará disponível em `http://localhost:5173/`.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express, TypeScript, Mongoose, Zod (Validation), Bcryptjs, JWT.
- **Frontend:** React 19, Vite, TypeScript, React Router v7, Axios, Lucide React (Icons).
