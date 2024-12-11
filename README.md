# CashControl

## 📋 Descrição
Um aplicativo Electron para gerenciamento financeiro pessoal que permite o controle de transações por categorias, com visualização anual e mensal dos gastos e receitas.

## 🚀 Principais Funcionalidades
- Visualização de transações por categoria e mês
- Controle de status de pagamento
- Balanço mensal e anual
- Identificação visual de status (pago, pendente, atrasado)
- Navegação entre anos
- Categorização de transações

## 💻 Pré-requisitos
- Node.js
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o aplicativo
```bash
npm start
```

## 🎯 Como Usar

### Criando Categorias
1. Acesse a seção de categorias
2. Clique em "Nova Categoria"
3. Digite o nome da categoria
4. Confirme a criação

### Adicionando Transações
1. Clique em "Nova Transação"
2. Preencha os dados:
   - Valor
   - Tipo (entrada/saída)
   - Categoria
   - Data de vencimento
   - Comentário (opcional)
3. Confirme a criação

### Visualizando Transações
- Use os botões de navegação para mudar o ano
- Clique na seta ao lado do valor mensal para expandir os detalhes
- Verde indica transação paga
- Vermelho indica transação atrasada
- Cinza indica transação pendente dentro do prazo

### Atualizando Status de Pagamento
- Use o switch na linha da transação para marcar como pago/não pago
- A atualização é automática e reflete imediatamente na interface

## 🔧 Configuração do Banco de Dados
O aplicativo usa SQLite como banco de dados. As tabelas necessárias são:

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  valor REAL NOT NULL,
  tipo TEXT NOT NULL,
  category_id TEXT NOT NULL,
  comentario TEXT,
  maturity TEXT,
  pay INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## 🌟 Funcionalidades Principais

### TransactionContext
Gerencia o estado global das transações e fornece métodos para:
- Buscar transações por ano
- Criar novas transações
- Atualizar status de pagamento
- Gerenciar categorias

### CollapsibleTable
Componente principal que:
- Exibe transações agrupadas por categoria
- Permite expansão/contração de detalhes mensais
- Mostra balanço mensal e anual
- Fornece navegação entre anos

## 🤝 Contribuindo
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença
Este projeto está sob a licença [MIT](LICENSE.md)

## 🎨 Customização
O projeto usa Tailwind CSS para estilização. Você pode personalizar:
- Cores dos status (pago, pendente, atrasado)
- Layout da tabela
- Estilos dos botões e switches
- Temas e cores gerais

## ❗ Observações Importantes
- Mantenha o banco SQLite atualizado
- Faça backup regularmente
- As datas são armazenadas em formato ISO
- Os valores monetários são armazenados como números

## 🐛 Resolução de Problemas
Se encontrar problemas:
1. Verifique as permissões do banco de dados
2. Confirme se todas as dependências estão instaladas
3. Verifique os logs do console
4. Limpe o cache do aplicativo se necessário