# Sistema de Controle de Almoxarifado

Este é um sistema de controle de almoxarifado desenvolvido em **TypeScript**, com **React** no frontend e **Node.js** no backend. O sistema permite o gerenciamento de entradas e saídas de produtos, controle de estoque, registro de entidades que retiraram produtos, geração de relatórios, entre outras funcionalidades.

---

## Funcionalidades

- **Controle de Entradas e Saídas de Produtos**: Registre a entrada e a saída de itens do almoxarifado.
- **Gerenciamento de Estoque**: Monitore os níveis de estoque em tempo real.
- **Controle de Entidades**: Cadastre e gerencie as entidades (departamentos, usuários ou clientes) que retiram produtos.
- **Relatórios**: Gere relatórios detalhados sobre movimentações, níveis de estoque e histórico de retiradas.
- **Autenticação e Autorização**: Sistema de login seguro utilizando **JWT**.
- **CRUD Completo**: Operações de criação, leitura, atualização e exclusão para produtos, entidades e movimentações.

---

## Tecnologias Utilizadas

### Backend
- **Node.js**: Plataforma de execução para o servidor.
- **Express**: Framework para construção de APIs.
- **Sequelize**: ORM para manipulação do banco de dados.
- **JWT (JSON Web Token)**: Gerenciamento de autenticação e autorização.
- **TypeScript**: Para tipagem estática e maior confiabilidade no código.

### Frontend
- **React**: Biblioteca para construção de interfaces de usuário.
- **Axios**: Para requisições HTTP.
- **Tailwind CSS**: Estilização moderna e flexível.
- **TypeScript**: Para um frontend tipado.

---

## Pré-requisitos

- **Node.js** na versão 16 ou superior.
- **npm** ou **yarn** como gerenciador de pacotes.
- Banco de dados compatível com Sequelize (MySQL, PostgreSQL, SQLite, etc.).

---
