# CashControl

## 📋 Descrição

CashControl é um aplicativo desktop desenvolvido com Electron para gerenciamento financeiro pessoal. Ele permite controlar transações por categorias, oferecendo visualizações anuais e mensais de gastos e receitas, com uma interface intuitiva e recursos avançados de organização.

## 🚀 Funcionalidades Principais

- **Gestão de Transações**

  - Visualização por categoria e mês
  - Controle de status de pagamento (pago, pendente, atrasado)
  - Adição de links para comprovantes, pagina de compra ou documentos
  - Sistema de categorização flexível

- **Visualização Financeira**

  - Balanço mensal e anual detalhado
  - Identificação visual de status por cores
  - Navegação intuitiva entre períodos
  - Agrupamento por categorias

- **Recursos Avançados**
  - Clonagem de transações entre meses
  - Limpeza de dados mensais
  - Suporte a múltiplas categorias
  - Interface desktop nativa multiplataforma

## 💻 Como Instalar

1. **Pré-requisitos**

   - Node.js 18 ou superior
   - npm ou yarn
   - Sistema operacional: Windows, macOS ou Linux

2. **Instalação para Desenvolvimento**

   ```bash
   # Clone o repositório
   git clone [URL_DO_REPOSITÓRIO]

   # Entre na pasta do projeto
   cd cash-control

   # Instale as dependências
   npm install

   # Inicie em modo desenvolvimento
   npm run dev
   ```

3. **Criar Versão de Produção**
   ```bash
   # Gerar instalador
   npm run dist
   ```

## 🎯 Como Usar

### Gerenciando Categorias

1. Clique no botão "+" no menu flutuante
2. Clique em "Nova Categoria"
3. Digite o nome desejado
4. Salve a categoria

### Criando Transações

1. Clique no botão "+" no menu flutuante
2. Preencha os campos:
   - Valor
   - Tipo (entrada/saída)
   - Categoria
   - Data de vencimento
   - Link para comprovante (opcional)
   - Comentário (opcional)

### Recursos Especiais

- **Clonagem de Transações**: Use o botão de duplicação para copiar transações entre meses
- **Limpeza Mensal**: Remova todas as transações de um mês específico
- **Links Externos**: Adicione links para comprovantes ou documentação
- **Documentação**: Acesse a documentação completa pelo botão do menu

### Localização dos Dados

O banco de dados SQLite fica armazenado em:

- Windows: `%APPDATA%/cash-control/database.sqlite`
- macOS: `~/Library/Application Support/cash-control/database.sqlite`
- Linux: `~/.config/cash-control/database.sqlite`

## 🔧 Solução de Problemas

### Problemas Comuns

1. **Erro no Banco de Dados**

   - Verifique as permissões do diretório
   - Confirme se o caminho do banco está correto

2. **Erro ao Criar Transações**

   - Verifique se todos os campos obrigatórios estão preenchidos
   - Confirme se a categoria selecionada existe

3. **Problemas na Instalação**
   - Limpe o cache: `npm cache clean --force`
   - Remova node_modules e reinstale as dependências

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.
