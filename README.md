# FURIA Chat - A Comunidade Conectada

Este é o repositório da aplicação FURIA Chat, um espaço dedicado para a torcida da FURIA Esports se conectar, interagir e vibrar junta durante as partidas e eventos. O projeto consiste em um frontend construído com React e um backend robusto utilizando Node.js, Express e Socket.IO para comunicação em tempo real.

## Visão Geral

O FURIA Chat oferece uma experiência de chat em tempo real com diversas funcionalidades engajadoras:

- **Mensagens em Tempo Real:** Troca de mensagens instantânea entre torcedores.
- **Comandos Especiais:** Utilize comandos como `!help`, `!cheer`, `!stats` e `!furia` para interagir de maneiras únicas.
- **Reações:** Demonstre seu apoio e emoção com reações às mensagens.
- **Respostas:** Responda diretamente a mensagens de outros usuários para manter o contexto da conversa.
- **Edição e Exclusão de Mensagens:** Tenha controle sobre suas próprias mensagens.
- **Menções:** Responda a usuários específicos para direcionar a conversa.
- **Painel de Partida ao Vivo:** Acompanhe informações em tempo real sobre as partidas da FURIA.
- **Badges de Conquistas:** Desbloqueie e exiba conquistas especiais.
- **Gritos de Guerra:** Envie "cheers" para mostrar seu apoio fervoroso.
- **Persistência de Dados:** Histórico de mensagens armazenado para não perder a conversa.
- **API para o Frontend:** Backend fornece os dados e a comunicação para a interface do usuário.

## Estrutura de Pastas

furia-chat/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── chatController.js
│   ├── models/
│   │   └── message.js
│   ├── routes/
│   │   └── chatRoutes.js
│   ├── services/
│   │   └── chatService.js
│   ├── sockets/
│   │   └── socketHandler.js
│   ├── utils/
│   │   └── ...
│   ├── server.js
│   ├── package-lock.json
│   └── package.json
└── frontend/
├── public/
│   └── ... (arquivos estáticos)
└── src/
├── assets/
│   ├── Faze_Clan-logo.webp
│   ├── furia-esports-logo.png
│   ├── react.svg
│   └── team-liguid-logo.png
├── components/
│   ├── AchievementBadge.jsx
│   ├── LiveEvent.jsx
│   ├── LiveMatchPanel.jsx
│   ├── LiveMatchPanel.module.css
│   ├── Message.jsx
│   └── ...
├── pages/
│   └── ChatPage.jsx
├── services/
│   └── esportsAPI.js
├── styles/
│   ├── ChatStyle.js
│   └── ...
├── App.css
├── App.jsx
├── index.css
├── main.jsx
└── ...
├── .gitignore
├── README.md        <-- Este arquivo
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js


## Tecnologias Utilizadas

### Frontend

-   **React (v19.0.0):** Biblioteca JavaScript para construção de interfaces de usuário.
-   **React DOM (v19.0.0):** Ponto de entrada para o DOM do React.
-   **React Router DOM (v7.5.2):** Para gerenciamento de rotas (se aplicável).
-   **React Transition Group (v4.4.5):** Para animações e transições.
-   **Styled Components (v6.1.17):** Para estilização de componentes com CSS-in-JS.
-   **Sass (v1.87.0):** Pré-processador CSS.
-   **Socket.IO Client (v4.8.1):** Para comunicação em tempo real com o backend.
-   **Axios (v1.9.0):** Cliente HTTP para requisições de API.
-   **Vite (v6.3.1):** Ferramenta de build e servidor de desenvolvimento rápido.
-   **ESLint (v9.22.0):** Linter para qualidade do código JavaScript.

### Backend

-   **Node.js:** Ambiente de execução JavaScript para o servidor.
-   **Express (v4.18.2):** Framework web para Node.js.
-   **Socket.IO (v4.7.4):** Biblioteca para comunicação bidirecional em tempo real.
-   **MongoDB (via Mongoose v8.4.1):** Banco de dados NoSQL.
-   **Mongoose (v8.4.1):** Biblioteca de modelagem de objetos MongoDB.
-   **Cors (v2.8.5):** Middleware para habilitar CORS.
-   **Nodemon (v3.1.0):** Ferramenta para reiniciar o servidor em desenvolvimento.
-   **Dotenv (v16.4.7):** Para carregar variáveis de ambiente.

## Configuração e Execução

Para executar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://docs.github.com/articles/referencing-and-citing-content](https://docs.github.com/articles/referencing-and-citing-content)
    cd furia-chat
    ```

2.  **Configure o Backend:**
    -   Navegue até a pasta `backend`: `cd backend`
    -   Instale as dependências: `npm install` (ou `yarn install` / `pnpm install`)
    -   Crie um arquivo `.env` com as configurações (porta, URI do MongoDB, etc.).
    -   Inicie o servidor de desenvolvimento: `npm run dev` (ou `yarn dev` / `pnpm dev`). O servidor estará rodando em `http://localhost:5000` (ou a porta configurada).

3.  **Configure o Frontend:**
    -   Navegue até a pasta `frontend`: `cd ../frontend`
    -   Instale as dependências: `npm install` (ou `yarn install` / `pnpm install`)
    -   Inicie o servidor de desenvolvimento: `npm run dev` (ou `yarn dev` / `pnpm dev`). O frontend geralmente roda em `http://localhost:5173`.

Certifique-se de ter o Node.js e o MongoDB instalados em sua máquina.

## Scripts Disponíveis

### Backend

No diretório `backend`:

-   `start`: Inicia o servidor em modo de produção.
-   `dev`: Inicia o servidor em modo de desenvolvimento com `nodemon`.

### Frontend

No diretório `frontend`:

-   `dev`: Inicia o servidor de desenvolvimento Vite.
-   `build`: Compila o projeto para produção.
-   `lint`: Executa o ESLint.
-   `preview`: Inicia um servidor de pré-visualização da build de produção.

## Endpoints da API (Backend)

-   `/api/chat`: `GET` - Retorna o histórico de mensagens do chat.
-   `/api/match-live`: `GET` - Retorna informações sobre a partida ao vivo (se implementado).
-   `/api/chat/:id`: `PATCH` - Edita uma mensagem específica.
-   `/api/chat/:id`: `DELETE` - Exclui uma mensagem específica.
-   `/api/chat/:id/react`: `POST` - Adiciona uma reação a uma mensagem.

## Socket.IO Events (Backend)

-   `connection`: Novo cliente conectado.
-   `disconnect`: Cliente desconectado.
-   `send_message`: Recebe e transmite novas mensagens.
-   `send_cheer`: Recebe e atualiza a contagem de cheers.
-   `edit_message`: Recebe e processa edições de mensagens.
-   `delete_message`: Recebe e processa exclusões de mensagens.
-   `react_message`: Recebe e processa reações a mensagens.
-   `initial_messages`: Envia o histórico de mensagens para novos clientes.
-   `new_message`: Emite novas mensagens para todos os clientes.
-   `cheer_update`: Emite atualizações da contagem de cheers.
6

**#GoFURIA** 🐆🔥
