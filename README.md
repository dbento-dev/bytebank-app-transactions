# Bytebank - App Transactions

Este é o micro-frontend de Transações para a aplicação Bytebank, desenvolvido como parte da pós-graduação em Front-End Engineering da FIAP! 🚀

Neste projeto, aplicamos o conceito de Arquitetura de Micro-Frontends utilizando Webpack Module Federation para criar um componente de listagem de transações dinâmico e reutilizável.

---

### ✅ Status do projeto

🚧 App Transactions 🚀 Em construção... 🚧

---

### ❗ Sobre o Projeto

O **App Transactions** é responsável por exibir o extrato detalhado da conta do usuário no Bytebank. Ele permite a visualização, busca e gerenciamento das movimentações financeiras.

Este componente é projetado para ser consumido por uma aplicação host, integrando-se de forma transparente com outros micro-frontends, como a UI de componentes (`utilUi`), a camada de API (`utilApi`) e o gerenciamento de estado centralizado (`utilStore`).

---

### ✔️ Funcionalidades

- [x] Exibição das informações do usuário (nome e avatar).
- [x] Listagem de transações agrupadas por mês.
- [x] Busca por transações específicas.
- [x] Exclusão de transações com modal de confirmação.
- [x] Edição de transações vinculado ao formulário de cadastro/edição.
- [x] Paginação para navegar entre as transações.
- [x] Tratamento de estados de carregamento (loading) e erros.
- [x] Exibição de mensagem quando nenhuma transação é encontrada.

---

### 💻 WEB Layout

!Web Layout

### 📱 MOBILE Layout

!Mobile Layout

---

### 🛠️ Tecnologias

As tecnologias principais utilizadas no desenvolvimento deste micro-frontend são:

- **React.js**
- **TypeScript**
- **Material-UI**
- **Zustand**
- **React Toastify**
- **Webpack (Module Federation)**
- **Babel**
- **ESLint**
- **Prettier**

---

### 🚀 Como rodar localmente

#### Pré-requisitos

- **Node.js**
- **npm** ou **Yarn**
- Outros micro-frontends do Bytebank (`utilUi`, `utilApi`, `utilStore`) devem estar em execução.

#### Passos

1. Clone o repositório (se ainda não o fez) e navegue até a pasta do projeto:

   ```bash
   # git clone <url-do-monorepo-bytebank>
   cd projects/app-transactions
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

O App Transactions estará disponível em: `http://localhost:3003`

> **Atenção:** Este é um micro-frontend e depende de outros serviços para funcionar corretamente. Certifique-se de que os seguintes serviços estejam rodando em suas respectivas portas, conforme configurado em `config/webpack.dev.js`:
>
> - **utilUi:** `http://localhost:8310`
> - **utilApi:** `http://localhost:8311`
> - **utilStore:** `http://localhost:8312`

---

### 📂 Estrutura do Projeto

```
📦app-transactions
 ┣ 📂config
 ┃ ┣ 📜getEnvVars.js
 ┃ ┣ 📜webpack.common.js
 ┃ ┣ 📜webpack.dev.js
 ┃ ┗ 📜webpack.prod.js
 ┣ 📂public
 ┃ ┗ 📜index.html
 ┣ 📂src
 ┃ ┣ 📂components
 ┃ ┃ ┗ 📂TransactionList
 ┃ ┣ 📂hooks
 ┃ ┃ ┗ 📜useTransaction.ts
 ┃ ┣ 📂styles
 ┃ ┃ ┗ 📜style.css
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜formatters.ts
 ┃ ┗ 📜main.tsx
 ┣ 📜package.json
 ┗ 📜tsconfig.json
```

---

Feito com 💙 para fins educacionais.
