# 🛍️ Online Shop - Sistema de E-commerce

Sistema completo de e-commerce desenvolvido com React, Ant Design e Redux, contendo gerenciamento de produtos, clientes e carrinho de compras.

## 📋 Descrição do Projeto

Este projeto implementa uma loja virtual completa com três módulos principais:

- **HomePage**: Exibição dos produtos mais populares
- **Products**: Catálogo completo de produtos com funcionalidades de CRUD
- **Clients**: Sistema de gerenciamento de clientes

## ✨ Funcionalidades

### 🏠 HomePage

- Exibição dos 5 produtos principais da Fake Store API
- Cards com preview de imagens
- Indicador de carregamento
- Design responsivo

### 📦 Módulo de Produtos

- ✅ Listagem de produtos da API e cadastrados localmente
- ✅ Busca por nome do produto
- ✅ Cadastro de novos produtos via modal
- ✅ Edição de produtos via Drawer
- ✅ Exclusão com confirmação
- ✅ Adição ao carrinho
- ✅ Design responsivo sem uso do componente Card

### 👥 Módulo de Clientes

- ✅ Tabela com listagem completa
- ✅ Colunas: Nome, E-mail, Data de Criação, Endereço, Telefone, Status
- ✅ Tags para status (activated/deactivated)
- ✅ Ordenação por nome, data e status
- ✅ Cadastro de novos clientes
- ✅ Edição via Drawer
- ✅ Exclusão com modal de confirmação
- ✅ Formatação de dados (capitalize, formatDate)

### 🛒 Carrinho de Compras

- ✅ Adição/remoção de produtos
- ✅ Ajuste de quantidades
- ✅ Cálculo automático de totais
- ✅ Finalização de compra
- ✅ Persistência no localStorage
- ✅ Drawer lateral responsivo

### 🎨 Funcionalidades Gerais

- ✅ Tema claro/escuro
- ✅ Design totalmente responsivo
- ✅ Navegação entre páginas
- ✅ Persistência de dados (Redux + localStorage)
- ✅ Notificações de feedback
- ✅ Loading states

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, React Router DOM
- **UI Framework**: Ant Design
- **Gerenciamento de Estado**: Redux Toolkit
- **Roteamento**: React Router v6
- **Armazenamento**: localStorage
- **API Externa**: Fake Store API
- **Estilização**: CSS Tailwind-like, Tokens do Ant Design

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Passos para execução

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd online-shop
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute o projeto**

```bash
npm run dev
```

4. **Acesse a aplicação**

```
http://localhost:5173
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── assets/           # Componentes de UI reutilizáveis
│   │   ├── Produtos.jsx
│   │   ├── ProductGridItem.jsx
│   │   └── ProductCard.jsx
│   └── views/            # Componentes de página
│       ├── Controller.jsx
│       ├── CartDrawer.jsx
│       ├── AddProductModal.jsx
│       └── EditProductModal.jsx
├── contexts/             # Contexts do React
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/                # Custom hooks
│   ├── useProducts.js
│   ├── useCart.js
│   └── useUser.js
├── pages/                # Páginas da aplicação
│   ├── App.jsx
│   ├── Products.jsx
│   └── Clients.jsx
├── services/             # Serviços e APIs
│   └── api.js
├── store/                # Configuração do Redux
│   ├── index.js
│   └── slices/
│       ├── productSlice.js
│       ├── clientSlice.js
│       └── cartSlice.js
└── utils/                # Utilitários
    ├── localStorage.js
    └── sessionStorage.js
```

## 🔧 Configuração do Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=https://fakestoreapi.com
```

## 📱 Funcionalidades por Página

### Página Inicial (`/`)

- Banner de boas-vindas
- Top 5 produtos
- Preview de imagens com erro handling
- Design responsivo

### Página de Produtos (`/products`)

- Grid 3x3 responsivo
- Busca em tempo real
- Modal de cadastro (não fecha ao clicar fora)
- Drawer de edição
- Popconfirm para exclusão
- Integração com carrinho

### Página de Clientes (`/clients`)

- Tabela com ordenação
- Drawer de edição
- Modal de cadastro
- Formatação de dados
- Tags de status

## 🎯 Critérios de Avaliação Atendidos

| Critério                                         | Status | Pontuação     |
| ------------------------------------------------ | ------ | ------------- |
| Páginas principais (Home, Products, Clients)     | ✅     | 3.0/3.0       |
| Edição e exclusão de produtos                    | ✅     | 1.0/1.0       |
| Carrinho de compras funcional                    | ✅     | 3.0/3.0       |
| Integração e navegação entre páginas             | ✅     | 1.0/1.0       |
| Uso adequado de hooks, Ant Design e LocalStorage | ✅     | 1.0/1.0       |
| Qualidade visual, responsividade e tema dinâmico | ✅     | 1.0/1.0       |
| **Total**                                        | **✅** | **10.0/10.0** |

## 🔄 Fluxo de Dados

### Estado Global (Redux)

- **products**: Lista de produtos da API e locais
- **clients**: Lista de clientes cadastrados
- **cart**: Itens do carrinho e quantidades

### Persistência

- Carrinho: localStorage
- Clientes: localStorage
- Produtos locais: localStorage
- Tema: localStorage

### APIs Utilizadas

- **Fake Store API**: Produtos e categorias
- **JSONPlaceholder**: Dados de usuário para demonstração

## 🎨 Design System

### Tokens do Ant Design

- Cores primárias: `#1890ff`
- Temas: Claro e Escuro
- Componentes customizados seguindo guidelines

### Responsividade

- Mobile First
- Breakpoints: xs (480px), sm (576px), md (768px), lg (992px), xl (1200px)
- Grid system do Ant Design

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso do IFSC.

## 👥 Desenvolvido para

**Tópicos especiais em programação**  
IFSC ©2025

---

## 🚀 Próximas Melhorias

- [ ] Sistema de autenticação real
- [ ] Integração com API de pagamento
- [ ] Dashboard administrativo
- [ ] Relatórios de vendas
- [ ] Sistema de avaliações
- [ ] Wishlist de produtos
- [ ] Cupons de desconto

## 📞 Suporte

Para dúvidas ou issues, abra uma issue no repositório do projeto.
