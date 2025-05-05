# FURIA CHAT

Este é um projeto de aplicação de chat em tempo real, que permite aos usuários registrar-se, fazer login e trocar mensagens com outros usuários. Ele utiliza WebSocket para comunicação em tempo real e permite o envio de mensagens, respostas, edição, exclusão e reações.

## Tecnologias Utilizadas

- **Frontend:**
  - React
  - Styled-components
  - React Router
  - Socket.IO (para WebSocket)
  
- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Socket.IO (para WebSocket)
  
- **Autenticação:**
  - JSON Web Token (JWT)

## Funcionalidades

- **Cadastro de Usuário:** Permite que um novo usuário crie uma conta e faça login.
- **Login de Usuário:** Permite que um usuário registrado faça login no sistema.
- **Chat em Tempo Real:** Usuários podem trocar mensagens em tempo real.
- **Respostas a Mensagens:** Usuários podem responder a mensagens específicas.
- **Edição de Mensagens:** Usuários podem editar mensagens enviadas.
- **Exclusão de Mensagens:** Usuários podem excluir mensagens enviadas.
- **Reações a Mensagens:** Usuários podem adicionar reações (emojis) às mensagens.

## Instruções de Instalação

### Pré-requisitos

- Node.js (v16 ou superior)
- MongoDB (ou use uma solução de banco de dados em nuvem como MongoDB Atlas)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/chat-app.git
Navegue até o diretório do backend e instale as dependências:

bash
Copy
Edit
cd backend
npm install
Navegue até o diretório do frontend e instale as dependências:

bash
Copy
Edit
cd frontend
npm install
Configure o MongoDB e o JWT:

Crie um banco de dados no MongoDB.

Defina a chave secreta do JWT no backend (adicione JWT_SECRET ao arquivo .env).

Execute o servidor:

No backend:

bash
Copy
Edit
cd backend
npm start
No frontend:

bash
Copy
Edit
cd frontend
npm start
Abra o navegador e acesse a aplicação em:

arduino
Copy
Edit
http://localhost:3000
Variáveis de Ambiente
Crie um arquivo .env na raiz do seu diretório backend e defina as variáveis abaixo:

bash
Copy
Edit
MONGO_URI=mongodb://localhost:27017/chatApp
JWT_SECRET=sua-chave-secreta-aqui
Como Usar
Registro:

Acesse a página de registro e crie uma conta com um nome de usuário e senha.

Login:

Após o registro, faça login com as credenciais criadas.

Chat:

Após o login, você será redirecionado para a página de chat, onde poderá enviar mensagens em tempo real, responder a mensagens e interagir com outras pessoas.

Edição e Exclusão de Mensagens:

Clique em uma mensagem para editá-la ou excluí-la.

Reações:

Adicione emojis como reações às mensagens para mostrar sua resposta.

## 📁 Estrutura de Pastas

furia-chat/
├── backend/ # Servidor backend em Node.js com Express
│ ├── controllers/ # Lógica das rotas e manipulação de dados
│ ├── middleware/ # Middlewares personalizados (ex: autenticação, logs)
│ ├── models/ # Modelos de dados com Mongoose (MongoDB)
│ ├── routes/ # Definições de rotas da API
│ └── server.js # Ponto de entrada do servidor backend
│
├── frontend/ # Aplicação frontend em React
│ ├── public/ # Arquivos estáticos públicos
│ ├── src/
│ │ ├── assets/ # Imagens, ícones e outros recursos estáticos
│ │ ├── components/ # Componentes reutilizáveis do React
│ │ ├── contexts/ # Contextos globais (ex: autenticação)
│ │ ├── hooks/ # Hooks personalizados
│ │ ├── pages/ # Páginas principais da aplicação
│ │ ├── routes/ # Rotas da aplicação React
│ │ ├── styles/ # Estilos globais e específicos por componente
│ │ └── App.jsx # Componente raiz da aplicação
│ └── ...
│
└── README.md # Documentação do projeto

### 📝 Observações
- O projeto é dividido entre `backend` e `frontend`, facilitando a manutenção e escalabilidade.
- Utiliza MongoDB no backend com Mongoose para modelagem de dados.
- O frontend é estruturado com boas práticas, usando componentes, hooks e contextos para uma melhor organização.

Contribuindo
Faça um fork deste repositório.

Crie uma branch para a sua funcionalidade (git checkout -b feature/nome-da-funcionalidade).

Faça commit das suas alterações (git commit -m 'Adiciona nova funcionalidade').

Envie para o repositório remoto (git push origin feature/nome-da-funcionalidade).

Abra um pull request.
