# App Barber - Sistema de Agendamento de Barbearia

Aplicação mobile de agendamento e gerenciamento de barbearia com autenticação completa, tema dark premium com detalhes dourados, e sistema seguro de agendamento com validação de conflitos de horários.

## 🎯 Características

- **Autenticação Completa**: Sistema de login e registro de usuários
- **Três Perfis de Usuário**: Cliente, Barbeiro e Admin
- **Fluxo de Agendamento em 7 Etapas**: Home → Serviço → Barbeiro → Data → Horário → Resumo → Confirmação
- **Calendário em Português**: Interface localizada com formatação de datas em português
- **Validação de Conflitos**: Sistema inteligente que evita agendamentos sobrepostos
- **Abas de Filtro**: Visualize agendamentos (Todos, Próximos, Concluídos, Cancelados)
- **Timezone Brasília (UTC-3)**: Todas as comparações de data/hora usam o fuso horário correto
- **Tema Dark Premium**: Design elegante com detalhes dourados

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18+)
- **npm** (incluído com Node.js)
- **PostgreSQL** (versão 12+) - ou use o banco de dados do Replit

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/mamede573/appbarber.git
cd appbarber
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

#### Opção A: Usando Replit Database (Recomendado)
O banco de dados já vem configurado automaticamente se estiver rodando no Replit.

#### Opção B: Usando PostgreSQL Local

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/appbarber
PGHOST=localhost
PGPORT=5432
PGUSER=seu_usuario_pg
PGPASSWORD=sua_senha_pg
PGDATABASE=appbarber
```

Substitua os valores com suas credenciais do PostgreSQL.

### 4. Configure o banco de dados

```bash
npm run db:push
```

## 🏃 Como Rodar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5000`

### Modo Produção

Primeiro, compile o projeto:

```bash
npm run build
```

Depois, inicie a aplicação:

```bash
npm start
```

## 📦 Dependências Principais

### Frontend
- **React 19**: Framework UI
- **Vite**: Build tool e desenvolvimento rápido
- **Wouter**: Roteamento simples para SPA
- **React Hook Form**: Gerenciamento de formulários
- **TanStack React Query**: Gerenciamento de estado do servidor
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes acessíveis
- **Framer Motion**: Animações
- **React Day Picker**: Seletor de datas em português
- **Zod**: Validação de dados

### Backend
- **Express**: Framework web
- **Passport**: Autenticação
- **Drizzle ORM**: ORM para PostgreSQL
- **Drizzle Zod**: Validação com Zod

### Banco de Dados
- **PostgreSQL**: Banco de dados relacional
- **@neondatabase/serverless**: Client PostgreSQL serverless

## 📁 Estrutura do Projeto

```
appbarber/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilidades
│   │   └── App.tsx           # Componente raiz
│   ├── index.html            # HTML principal
│   └── vite.config.ts        # Config Vite
├── server/                   # Backend Express
│   ├── index.ts             # Servidor Express
│   ├── routes.ts            # Rotas da API
│   ├── storage.ts           # Interface de armazenamento
│   └── middleware/          # Middlewares
├── shared/                  # Código compartilhado
│   └── schema.ts           # Schemas Drizzle
├── package.json            # Dependências
└── tsconfig.json           # Config TypeScript
```

## 🔗 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário atual

### Agendamentos
- `GET /api/appointments` - Listar todos os agendamentos
- `POST /api/appointments` - Criar novo agendamento
- `GET /api/appointments/:id` - Obter agendamento específico
- `PATCH /api/appointments/:id` - Atualizar agendamento
- `PATCH /api/appointments/:id/cancel` - Cancelar agendamento

### Barbeiros
- `GET /api/barbers` - Listar barbeiros
- `GET /api/barbers/:id` - Obter barbeiro específico

### Serviços
- `GET /api/services` - Listar serviços
- `GET /api/services/barber/:barberId` - Serviços por barbeiro

## 🔐 Variáveis de Ambiente

Caso esteja rodando localmente, crie um arquivo `.env`:

```env
# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@host:porta/database
PGHOST=localhost
PGPORT=5432
PGUSER=seu_usuario
PGPASSWORD=sua_senha
PGDATABASE=appbarber

# Sessão
SESSION_SECRET=sua_chave_secreta_aqui
```

## 📱 Funcionalidades Implementadas

✅ Sistema de autenticação com Passport
✅ Agendamento com validação de conflitos
✅ Calendário em português
✅ Filtro de agendamentos por status
✅ Validação de horários com fuso horário Brasília
✅ Interface responsiva e intuitiva
✅ Mensagens de erro claras em português
✅ Persistência de dados em PostgreSQL

## 🐛 Resolução de Problemas

### Erro: "Cannot find module"
```bash
npm install
```

### Erro de conexão com banco de dados
Verifique se:
- PostgreSQL está rodando
- As credenciais em `.env` estão corretas
- O banco de dados foi criado com `npm run db:push`

### Porta 5000 já está em uso
Você pode mudar a porta no `client/vite.config.ts`:
```js
dev: {
  host: '0.0.0.0',
  port: 3000  // Mude para uma porta disponível
}
```

## 🛠 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor em modo desenvolvimento
npm run build        # Compila o projeto
npm start            # Inicia servidor em produção
npm run check        # Verifica tipos TypeScript
npm run db:push      # Sincroniza schema com banco de dados
npm run dev:client   # Inicia apenas frontend (Vite)
```

## 📝 Licença

MIT - Veja o arquivo LICENSE para mais detalhes

## 👨‍💻 Autor

Ricardo Marcio - [GitHub](https://github.com/mamede573)

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório GitHub.

---

**Desenvolvido com ❤️ para gerenciar sua barbearia com eficiência**
