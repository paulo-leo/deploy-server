# Documentação do Deploy Server

**Autor**: Paulo Leonardo da Silva Cassimiro

## Visão Geral

Este servidor de deploy é uma aplicação Node.js que facilita a automação do processo de deploy em servidores. Pode ser instalado em qualquer servidor para gerenciar e executar comandos de deploy com base em requisições HTTP. Utiliza o framework Express.js para servir as requisições e a biblioteca `dotenv` para gerenciar variáveis de ambiente.

## Funcionalidades

- **Automatização de Deploy**: Executa comandos de deploy com base em dados fornecidos via requisição HTTP POST.
- **Autenticação**: Verifica o IP do cliente e as credenciais (usuário e senha) antes de permitir a execução do comando de deploy.
- **Logs**: Registra todas as operações e erros em um arquivo de log para rastreamento e diagnóstico.

## Instalação

### Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para Instalação

1. **Clonar o Repositório**

   Clone o repositório que contém o código fonte da ferramenta:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <DIRETORIO_DO_PROJETO>
   ```

2. **Instalar Dependências**

   Instale as dependências necessárias usando npm ou yarn:

   ```bash
   npm install
   ```

   ou

   ```bash
   yarn install
   ```

3. **Configurar Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   PORT=3000
   ```

   Ajuste a variável `PORT` conforme necessário para a configuração do servidor.

## Uso

### Executar o Servidor

Inicie o servidor com o comando:

```bash
npm start
```

ou

```bash
yarn start
```

O servidor estará disponível em `http://localhost:3000/`, a menos que você tenha configurado uma porta diferente.

### Requisições de Deploy

- **URL**: `http://localhost:3000/`
- **Método**: POST
- **Corpo da Requisição**: JSON contendo os seguintes campos:
  - `deploy`: Nome do deploy que será realizado.
  - `user`: Nome do usuário para autenticação.
  - `password`: Senha para autenticação.

  Exemplo de corpo de requisição:

  ```json
  {
    "deploy": "deploy_name",
    "user": "username",
    "password": "password"
  }
  ```

  Exemplo de requisição via `curl`:

  ```bash
  curl -X POST http://192.168.0.175:3000/ -H "Content-Type: application/json" -d "{\"user\": \"paulo\",\"password\": \"123456\",\"deploy\": \"teste\"}"
  ```

  O comando acima pode ser salvo como um script personalizado no seu `package.json` do Node.js ou `composer.json` do PHP.

### Adicionando Scripts no `package.json`

1. **Abra o arquivo `package.json`** no diretório raiz do seu projeto Node.js.

2. **Localize a seção `scripts`** e adicione o script `deploy`:

   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js",
     "deploy": "curl -X POST http://192.168.0.175:3000/ -H \"Content-Type: application/json\" -d \"{\\\"user\\\": \\\"paulo\\\", \\\"password\\\": \\\"123456\\\", \\\"deploy\\\": \\\"teste\\\"}\""
   }
   ```

3. **Execute o script** usando o comando:

   ```bash
   npm run deploy
   ```

### Adicionando Scripts no `composer.json`

1. **Abra o arquivo `composer.json`** no diretório raiz do seu projeto PHP.

2. **Localize a seção `scripts`** e adicione o script `deploy`:

   ```json
   "scripts": {
     "post-install-cmd": [
       "echo 'Post-install script executed'"
     ],
     "deploy": "curl -X POST http://192.168.0.175:3000/ -H \"Content-Type: application/json\" -d \"{\\\"user\\\": \\\"paulo\\\", \\\"password\\\": \\\"123456\\\", \\\"deploy\\\": \\\"teste\\\"}\""
   }
   ```

3. **Execute o script** usando o comando:

   ```bash
   composer run deploy
   ```

### Respostas

- **200 OK**: Se o deploy for executado com sucesso, a resposta conterá a saída do comando.
- **401 Unauthorized**: Se as credenciais forem inválidas ou o IP não estiver autorizado.
- **404 Not Found**: Se o deploy solicitado não existir.
- **500 Internal Server Error**: Se ocorrer um erro ao processar a requisição ou executar o comando.

## Arquitetura

### Estrutura do Código

- **`index.js`**: Arquivo principal que configura e executa o servidor Express.
- **`deploy.json`**: Arquivo JSON que contém os dados de configuração para os deploys.
- **`deploy.log`**: Arquivo de log onde são registrados os eventos e erros.

### Funções Principais

- `logMessage(message)`: Adiciona uma mensagem ao arquivo de log com um timestamp.
- `convertIPv6ToIPv4(ip)`: Converte endereços IP no formato IPv6 com IPv4 embutido para o formato IPv4.
- `getClientIp(req)`: Obtém o endereço IP do cliente da requisição HTTP.

## Contribuição

Se você deseja contribuir para o desenvolvimento desta ferramenta, por favor, envie um pull request ou abra uma issue no repositório.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
