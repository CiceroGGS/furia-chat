# FURIA Chat - A Comunidade Conectada

Este é o repositório do frontend da aplicação FURIA Chat, um espaço dedicado para a torcida da FURIA Esports se conectar, interagir e vibrar junta durante as partidas e eventos.

## Visão Geral

O FURIA Chat oferece uma experiência de chat em tempo real com diversas funcionalidades engajadoras, incluindo:

- **Mensagens em Tempo Real:** Troca de mensagens instantânea com outros torcedores.
- **Comandos Especiais:** Utilize comandos como `!help`, `!cheer`, `!stats` e `!furia` para interagir de maneiras únicas.
- **Reações:** Demonstre seu apoio e emoção com reações às mensagens.
- **Respostas:** Responda diretamente a mensagens de outros usuários para manter o contexto da conversa.
- **Edição e Exclusão de Mensagens:** Tenha controle sobre suas próprias mensagens.
- **Menções:** Responda a usuários específicos para direcionar a conversa.
- **Painel de Partida ao Vivo:** Acompanhe informações em tempo real sobre as partidas da FURIA.
- **Badges de Conquistas:** Desbloqueie e exiba conquistas especiais.
- **Gritos de Guerra:** Envie "cheers" para mostrar seu apoio fervoroso.

## Estrutura de Pastas

frontend/
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
│   └── ... (outros componentes)
├── pages/
│   └── ChatPage.jsx
├── services/
│   └── esportsAPI.js
├── styles/
│   ├── ChatStyle.js
│   └── ... (outros arquivos de estilo)
├── App.css
├── App.jsx
├── index.css
├── main.jsx
└── ... (outros arquivos)
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js

## Tecnologias Utilizadas

Este projeto frontend foi construído utilizando as seguintes tecnologias:

- **React (v19.0.0):** Biblioteca JavaScript para construção de interfaces de usuário.
- **React DOM (v19.0.0):** Ponto de entrada para o DOM do React.
- **React Router DOM (v7.5.2):** Para gerenciamento de rotas na aplicação (se aplicável, embora não explicitamente visto nos arquivos).
- **React Transition Group (v4.4.5):** Para animações e transições de componentes.
- **Styled Components (v6.1.17):** Para estilização de componentes com CSS-in-JS.
- **Sass (v1.87.0):** Pré-processador CSS para estilos mais eficientes e organizados.
- **Socket.IO Client (v4.8.1):** Para comunicação em tempo real com o backend.
- **Axios (v1.9.0):** Cliente HTTP para fazer requisições para APIs.
- **Vite (v6.3.1):** Ferramenta de build e servidor de desenvolvimento rápido.
- **ESLint (v9.22.0):** Linter para garantir a qualidade e o estilo do código JavaScript.

## Configuração e Execução

Para executar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://docs.github.com/articles/referencing-and-citing-content](https://docs.github.com/articles/referencing-and-citing-content)
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

    Isso iniciará o frontend em um servidor de desenvolvimento local (geralmente em `http://localhost:5173`).

## Scripts Disponíveis

No `package.json`, você encontrará os seguintes scripts:

-   `dev`: Inicia o servidor de desenvolvimento Vite.
-   `build`: Compila o projeto para produção.
-   `lint`: Executa o ESLint para verificar problemas no código.
-   `preview`: Inicia um servidor de pré-visualização para a build de produção.

## Próximos Passos (Opcional)

Se houver planos futuros para o frontend, você pode mencioná-los aqui, como:

-   Implementação de autenticação de usuários.
-   Adição de mais comandos e funcionalidades interativas.
-   Melhorias na interface do usuário e experiência do usuário.
-   Testes unitários e de integração.

## Contribuição

Se você deseja contribuir para este projeto, por favor, siga as diretrizes de contribuição (se houver um arquivo `CONTRIBUTING.md`).

## Licença

[Sua Licença]

---

**#GoFURIA** 🐆🔥
