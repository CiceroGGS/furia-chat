# 💬 FURIA CHAT

Este é um projeto de aplicação de chat em tempo real, que permite aos usuários registrar-se, fazer login e trocar mensagens com outros usuários. Ele utiliza **WebSocket** para comunicação em tempo real e possui funcionalidades como envio de mensagens, respostas, edição, exclusão e reações com emojis.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- React
- Styled-components
- React Router
- Socket.IO (WebSocket)

### 🧠 Backend
- Node.js
- Express
- MongoDB
- Socket.IO (WebSocket)

### 🔐 Autenticação
- JSON Web Token (JWT)

---

## ✨ Funcionalidades

- ✅ Cadastro de Usuário
- ✅ Login de Usuário
- 💬 Chat em Tempo Real
- 💬 Respostas a Mensagens
- ✏️ Edição de Mensagens
- 🗑️ Exclusão de Mensagens
- 😄 Reações com Emojis

---

## 📦 Instruções de Instalação

### ⚙️ Pré-requisitos
- Node.js (v16 ou superior)
- MongoDB (pode ser local ou MongoDB Atlas)

### 📥 Instalação

```bash
# 1. Clone o repositório:
git clone https://github.com/seu-usuario/furia-chat.git

# 2. Instale as dependências do backend:
cd furia-chat/backend
npm install

# 3. Instale as dependências do frontend:
cd ../frontend
npm install
```

### ⚙️ Configuração de Ambiente (Backend)

Crie um arquivo `.env` dentro da pasta `backend` com o seguinte conteúdo:

```env
MONGO_URI=mongodb://localhost:27017/chatApp
JWT_SECRET=sua-chave-secreta-aqui
```

---

## ▶️ Como Rodar o Projeto

### 🔙 Backend

```bash
cd backend
node server.js
```

### 🔜 Frontend

```bash
cd frontend
npm run dev
```

Abra seu navegador e acesse: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Como Usar

### 👤 Registro
- Acesse `/register`
- Crie uma conta com nome de usuário e senha

### 🔐 Login
- Acesse `/login`
- Faça login com as credenciais criadas

### 💬 Chat
- Após o login, você será redirecionado para a página do chat
- Envie mensagens em tempo real
- Responda mensagens específicas
- Edite ou exclua suas mensagens
- Reaja com emojis às mensagens

---

## 📁 Estrutura de Pastas

```
furia-chat/
├── backend/
│   ├── controllers/       # Controladores das rotas
│   ├── models/            # Modelos Mongoose (usuário, mensagem)
│   ├── routes/            # Definição das rotas
│   ├── server.js          # Arquivo principal do backend
│   └── .env               # Variáveis de ambiente
├── frontend/
│   ├── components/        # Componentes React (chat, formulário etc.)
│   ├── contexts/          # Contexto de autenticação
│   ├── pages/             # Páginas (Login, Registro, Chat)
│   ├── styles/            # Estilos com styled-components
│   ├── App.js             # Arquivo principal do frontend
│   └── index.js           # Ponto de entrada do React
├── README.md              # Este arquivo
└── package.json           # Dependências e scripts principais
```

---

## 🤝 Contribuindo

```bash
# 1. Faça um fork deste repositório
# 2. Crie uma nova branch
git checkout -b feature/nova-funcionalidade

# 3. Faça suas alterações e commit
git commit -m "Adiciona nova funcionalidade"

# 4. Envie a branch para o repositório remoto
git push origin feature/nova-funcionalidade

# 5. Abra um Pull Request 🚀
```

---

## 📝 Observações Finais

- A aplicação está dividida em frontend e backend, facilitando a manutenção.
- A arquitetura do frontend usa componentes reutilizáveis e contexto para autenticação.
- O backend usa Mongoose para interagir com o MongoDB.
- A comunicação em tempo real é feita com Socket.IO.
- Todo o fluxo de autenticação é feito com JWT de forma segura.

---

## 📫 Contato

Caso queira contribuir, relatar bugs ou sugerir melhorias, entre em contato:

- GitHub: [github.com/CiceroGGS](https://github.com/CiceroGGS)
- Email: cicerog.silvestre@gmail.com

---
