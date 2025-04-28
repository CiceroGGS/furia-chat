Furia Chat

Furia Chat é uma aplicação de chat em tempo real que oferece dois modos distintos: Live Mode (para conversas em tempo real) e Offline Mode (para mensagens assíncronas). Este projeto foi desenvolvido para fornecer uma experiência flexível de comunicação adaptável a diferentes cenários de conectividade.

Tecnologias Utilizadas
Frontend
React.js: Biblioteca JavaScript para construção de interfaces de usuário

TypeScript: Adiciona tipagem estática ao JavaScript para melhor desenvolvimento

Styled Components: Para estilização componentizada

Socket.IO Client: Para comunicação em tempo real com o servidor

React Router: Para navegação entre páginas

Backend
Node.js: Ambiente de execução JavaScript server-side

Express.js: Framework para construção da API REST

Socket.IO: Para funcionalidades de WebSocket e comunicação em tempo real

MongoDB: Banco de dados NoSQL para armazenamento de mensagens

Mongoose: ODM para interação com o MongoDB

Outras Ferramentas
ESLint: Para padronização e qualidade de código

Prettier: Formatação automática de código

Jest: Para testes unitários

Funcionalidades Principais
Live Mode
Conversas em tempo real com atualização instantânea de mensagens

Notificação quando outros usuários estão digitando

Indicadores de presença online/offline

Histórico de conversas recentes

Offline Mode
Envio de mensagens quando o destinatário está offline

Notificação por e-mail (opcional) quando novas mensagens são recebidas

Armazenamento seguro de mensagens até o destinatário voltar online

Sincronização automática quando o usuário retorna

Como Utilizar
Pré-requisitos
Node.js (v14 ou superior)

MongoDB (local ou Atlas)

Yarn ou npm

Instalação
Clone o repositório:

bash
git clone https://github.com/CiceroGGS/furia-chat.git
cd furia-chat
Instale as dependências:

bash
yarn install
# ou
npm install
Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

MONGODB_URI=sua_string_de_conexao_mongodb
PORT=3001
JWT_SECRET=seu_segredo_jwt
EMAIL_SERVICE=servico_de_email (opcional)
EMAIL_USER=seu_email (opcional)
EMAIL_PASS=sua_senha (opcional)
Executando o Projeto
Inicie o servidor:

bash
yarn start:server
# ou
npm run start:server
Inicie o cliente:

bash
yarn start:client
# ou
npm run start:client
Acesse a aplicação no navegador:

http://localhost:3000
Scripts Úteis
yarn build: Compila o projeto para produção

yarn test: Executa os testes

yarn lint: Verifica problemas de linting

yarn format: Formata o código automaticamente

Estrutura do Projeto
furia-chat/
├── client/              # Frontend React
│   ├── public/          # Assets públicos
│   └── src/             # Código fonte
│       ├── components/  # Componentes React
│       ├── pages/       # Páginas da aplicação
│       ├── services/    # Serviços (API calls)
│       └── styles/      # Estilos globais
├── server/              # Backend Node.js
│   ├── controllers/     # Lógica dos endpoints
│   ├── models/          # Modelos do MongoDB
│   ├── routes/          # Rotas da API
│   └── sockets/         # Lógica do Socket.IO
├── .env.example         # Exemplo de variáveis de ambiente
└── package.json         # Dependências e scripts


Contribuição
Contribuições são bem-vindas! Siga os passos abaixo:

Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request
Contato
Cicero Guilherme

Link do Projeto: https://github.com/CiceroGGS/furia-chat

