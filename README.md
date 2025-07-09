# CashControl

## 📋 Descrição

CashControl é um aplicativo desktop desenvolvido com Electron para gerenciamento financeiro pessoal. Ele permite controlar transações por categorias, oferecendo visualizações anuais e mensais de gastos e receitas, com uma interface intuitiva e recursos avançados de organização.

## 🚀 Funcionalidades Principais

### 📊 **Visualização de Dados**

- **Aba de Gráficos**: Visualização em pizza das despesas por categoria
- **Gráficos Interativos**: Hover para detalhes e percentuais
- **Navegação por Abas**: Transações e Gráficos
- **Dados em Tempo Real**: Atualização automática dos gráficos

### 💰 **Gestão de Transações**

- Visualização por categoria e mês
- Controle de status de pagamento (pago, pendente, atrasado)
- Adição de links para comprovantes, página de compra ou documentos
- Sistema de categorização flexível
- Data padrão automática (ano atual)

### 📈 **Visualização Financeira**

- Balanço mensal e anual detalhado
- Identificação visual de status por cores
- Navegação intuitiva entre períodos
- Agrupamento por categorias
- Gráficos de distribuição de gastos

### 🔄 **Sistema de Backup**

- **Backup Automático**: Criação de backup do banco de dados
- **Localização Inteligente**: Salva em `Documents/Cash Control Backups/`
- **Timestamp Automático**: Nome do arquivo inclui data e hora
- **Abertura Automática**: Pasta é aberta após o backup
- **Interface Intuitiva**: Botão de backup no menu principal

### ⚡ **Recursos Avançados**

- Clonagem de transações entre meses
- Limpeza de dados mensais
- Suporte a múltiplas categorias
- Interface desktop nativa multiplataforma
- Sistema de logs detalhados para debug

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

### 📊 **Visualizando Gráficos**

1. **Clique na aba "Gráficos"** no topo da interface
2. **Visualize o gráfico de pizza** com suas despesas por categoria
3. **Passe o mouse** sobre as seções para ver detalhes
4. **Veja os percentuais** de cada categoria na legenda

### 💰 **Gerenciando Categorias**

1. Clique no botão de menu flutuante (canto inferior direito)
2. Clique em "Adicionar nova transação"
3. Clique em "Nova Categoria"
4. Digite o nome desejado
5. Salve a categoria

### 📝 **Criando Transações**

1. Clique no botão de menu flutuante (canto inferior direito)
2. Clique em "Adicionar nova transação"
3. Preencha os campos:
   - Valor
   - Tipo (entrada/saída)
   - Categoria
   - Data de vencimento (padrão: ano atual)
   - Link para comprovante (opcional)
   - Comentário (opcional)

### 🔄 **Criando Backup**

1. **Clique no botão de menu flutuante** (canto inferior direito)
2. **Clique no ícone de backup** (ícone de disco)
3. **Aguarde a confirmação** - O backup será criado automaticamente
4. **A pasta será aberta** - Você verá o arquivo de backup com timestamp

### ⚡ **Recursos Especiais**

- **Clonagem de Transações**: Use o botão de duplicação para copiar transações entre meses
- **Limpeza Mensal**: Remova todas as transações de um mês específico
- **Links Externos**: Adicione links para comprovantes ou documentação
- **Documentação**: Acesse a documentação completa pelo botão do menu
- **Navegação por Anos**: Use as setas para navegar entre diferentes anos

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
   - Use o sistema de backup para proteger seus dados

2. **Erro ao Criar Transações**

   - Verifique se todos os campos obrigatórios estão preenchidos
   - Confirme se a categoria selecionada existe
   - A data padrão é o ano atual, mas pode ser alterada

3. **Problemas com Gráficos**

   - Certifique-se de ter transações cadastradas
   - Verifique se as categorias estão corretamente associadas
   - Os gráficos mostram apenas despesas (tipo "saída")

4. **Problemas com Backup**

   - Verifique se o antivírus não está bloqueando
   - Confirme as permissões da pasta Documents
   - O backup é salvo em `Documents/Cash Control Backups/`

5. **Problemas na Instalação**
   - Limpe o cache: `npm cache clean --force`
   - Remova node_modules e reinstale as dependências
   - Atualize o browserslist: `npx update-browserslist-db@latest`

## 🆕 **Novidades da Versão 1.01.00**

### 📊 **Nova Aba de Gráficos**

- Visualização em pizza das despesas por categoria
- Gráficos interativos com hover para detalhes
- Percentuais automáticos de cada categoria
- Cores dinâmicas para melhor identificação
- Navegação por abas - Transações e Gráficos
- Dados em tempo real - Atualiza automaticamente

### 🔄 **Sistema de Backup Automático**

- Novo botão de backup no menu flutuante
- Backup automático do banco de dados SQLite
- Localização inteligente: Salva em `Documents/Cash Control Backups/`
- Timestamp automático: Nome do arquivo inclui data e hora
- Abertura automática da pasta após o backup
- Interface intuitiva: Ícone de backup no menu principal

### 🎯 **Melhorias na Interface**

- Sistema de abas - Transações e Gráficos
- Navegação intuitiva entre diferentes visualizações
- Design responsivo e moderno
- Cores consistentes com a identidade visual
- Data padrão automática (ano atual)

### 🔧 **Correções Técnicas**

- Corrigido problema de criação de transações
- Corrigido problema de parâmetros nos handlers IPC
- Melhorada comunicação entre processos
- Logs detalhados para debug
- Código mais robusto e organizado

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.
