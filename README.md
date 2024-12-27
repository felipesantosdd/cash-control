# CashControl

## 📋 Descrição

Um aplicativo Electron para gerenciamento financeiro pessoal que permite o controle de transações por categorias, com visualização anual e mensal dos gastos e receitas. Construído com Electron, React e SQLite para fornecer uma experiência desktop robusta e responsiva.

## 🚀 Principais Funcionalidades

- Visualização de transações por categoria e mês
- Controle de status de pagamento
- Balanço mensal e anual
- Identificação visual de status (pago, pendente, atrasado)
- Navegação entre anos
- Categorização de transações
- Links externos para comprovantes ou documentos
- Suporte a múltiplas categorias
- Interface desktop nativa

## 💻 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Windows, macOS ou Linux

## 🛠️ Instalação

1. Clone o repositório

```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências

```bash
npm install
```

3. Inicie o aplicativo em modo desenvolvimento

```bash
npm run dev
```

4. Para criar o instalador

```bash
npm run dist
```

## 🏗️ Estrutura do Projeto

```
src/
├── backend/
│   ├── config/
│   │   └── database.js      # Configuração do SQLite
│   ├── models/
│   │   ├── Category.js      # Modelo de categorias
│   │   └── Transaction.js   # Modelo de transações
│   └── services/
│       ├── categoryService.js    # Serviço de categorias
│       └── transactionService.js # Serviço de transações
├── context/
│   └── TransactionContext.jsx    # Contexto React global
├── main.js                       # Entrada do Electron
└── preload.js                    # Script de preload do Electron
```

## 🔧 Tecnologias Utilizadas

- Electron 33.2.1
- React 18
- Better SQLite3
- Material-UI
- Tailwind CSS
- Webpack
- UUID para IDs únicos

## 📦 Estrutura do Banco de Dados

### Tabela: categories

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
```

### Tabela: transactions

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  valor REAL NOT NULL,
  tipo TEXT NOT NULL,
  category_id TEXT,
  comentario TEXT,
  maturity TEXT,
  pay BOOLEAN,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## 🎯 API Interna

### Categorias

- `createCategory(name)`: Cria uma nova categoria
- `getAllCategories()`: Lista todas as categorias
- `getCategoryById(id)`: Busca categoria por ID

### Transações

- `createTransaction(data)`: Cria nova transação
- `getTransactionsByYear(year)`: Busca transações por ano
- `updateTransaction(id, data)`: Atualiza transação
- `deleteTransaction(id)`: Remove transação
- `calculateBalance()`: Calcula saldo total

## 💾 Gerenciamento de Estado

O aplicativo usa React Context para gerenciamento de estado global através do `TransactionContext`, que fornece:

- Estado atual das transações e categorias
- Funções de manipulação de dados
- Estado de carregamento
- Navegação entre anos

## 🔒 Segurança

- Uso de SQLite com better-sqlite3 para dados locais
- Validação de dados em todas as operações
- Sanitização de inputs
- Prevenção de SQL injection através de prepared statements

## 🎨 Personalização

O projeto usa Tailwind CSS e Material-UI para estilização. Você pode personalizar:

- Cores dos status
- Layout da tabela
- Estilos dos componentes
- Temas e cores

## 📝 Scripts Disponíveis

- `npm start`: Inicia o app em modo desenvolvimento
- `npm run dev`: Inicia com hot reload
- `npm run build`: Compila o app
- `npm run dist`: Cria o instalador
- `npm run pack`: Cria versão não empacotada

## ❗ Troubleshooting

### Problemas Comuns

1. Erro de banco de dados:

   - Verifique permissões do diretório
   - Confirme localização do arquivo SQLite

2. Erro ao criar transações:

   - Verifique formato dos dados
   - Confirme existência da categoria

3. Problemas de build:
   - Limpe cache: `npm cache clean --force`
   - Reinstale node_modules

### Localização do Banco de Dados

- Windows: `%APPDATA%/cash-control/database.sqlite`
- macOS: `~/Library/Application Support/cash-control/database.sqlite`
- Linux: `~/.config/cash-control/database.sqlite`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
