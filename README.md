# PagIF

Sistema de Pagamentos integrado ao [PagTesouro](https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro).

## Utilização

O sistema é dividido em dois "serviços", um para o _backend_ e outro para o _frontend_.

### Backend

O _backend_ é desenvolvido em [NodeJS](https://nodejs.org/) com [Express](https://expressjs.com/) e banco de dados MongoDB através do [Mongoose](https://mongoosejs.com/). Confira abaixo os comandos disponíveis.


```bash
# instalação de dependências
$ npm install

# roda o linter para verificar inconsistências no código
$ npm run lint

# corrige automaticamente as inconsistências encontradas, quando possível
$ npm run lint:fix

# roda o código e inicia o servidor de desenvolvimento (com monitoramento de mudanças)
$ npm run dev

# roda o código e inicia o servidor de produção
$ npm run start
```

### Frontend

O _frontend_ é desenvolvido com [VueJS 3](https://vuejs.org/) + [Nuxt 4](https://nuxt.com/), usando [Vuetify](https://vuetifyjs.com/) como biblioteca UI. Confira abaixo os comandos disponíveis.

```bash
# instalação de dependências
$ npm install

# roda o linter para verificar inconsistências no código
$ npm run lint

# corrige automaticamente as inconsistências encontradas, quando possível
$ npm run lint:fix

# remove arquivos de compilação e caches
$ npm run clean

# compila (com hot reload) e inicia o servidor de desenvolvimento
$ npm run dev

# compila para produção
$ npm run build

# inicia um servidor para conferir a aplicação após o build de produção
$ npm run preview
```

Para mais informações confira a [documentação do Nuxt](https://nuxt.com/docs).

## Criação de Super Administrador

Para criar um usuário _super_ administrador, principalmente pela primeira vez, é necessário rodar um `script` no backend conforme abaixo:

```bash
$ npm run superadmin email@example.com
```

**Atenção:** O comando acima deve ser rodado no _console_ do _backend_.

## Deploy

O _deploy_ é feito com **Docker Compose**. O repositório já traz Dockerfiles, healthchecks e exemplos de ambiente, mas cada instalação deve ajustar as variáveis conforme o domínio, o banco e o provedor de autenticação da instituição.

### Arquivos de ambiente

- `backend/.env`: variáveis de execução do backend, incluindo banco, sessão, proxy e URL pública da aplicação.
- `frontend/.env`: variáveis usadas no frontend em desenvolvimento e build de produção.
- `/.env`: variáveis usadas pelo `docker compose` para interpolação.

### Variáveis mais importantes

- `APP_URL`: URL pública da aplicação, usada para CORS, nas URLs de retorno e notificação do PagTesouro.
- `API_BASE`: URL que o frontend usa para alcançar o backend. Em Compose, normalmente aponta para o serviço interno `http://backend:3030`.
- `TRUST_PROXY`: use `1` ou um valor equivalente quando houver reverse proxy ou ingress na frente do backend.
- `PAGTESOURO_URL`: ambiente do PagTesouro usado pela instituição.
- `GOOGLE_CLIENT_ID` e `GOOGLE_ALLOWED_HOSTED_DOMAINS`: necessários quando a autenticação Google estiver habilitada.

### Subida padrão com Compose

```bash
# inicia a stack (todos os containers necessários) construindo as imagens antes
docker compose up -d --build
```

### Cenários recomendados

- Instalação simples em uma única rede: use o backend e o frontend pela rede interna do Compose e exponha apenas o frontend.
- Instalação atrás de proxy reverso: mantenha `TRUST_PROXY=1`, aponte `APP_URL` para o domínio público e configure o proxy para encaminhar `HTTP`/`HTTPS` corretamente.
- Instalação com domínios diferentes por instituição: mantenha `API_BASE` apontando para o backend alcançável pelo frontend e ajuste `GOOGLE_ALLOWED_HOSTED_DOMAINS` e `PAGTESOURO_URL` conforme o ambiente.

### Antes de subir em produção

1. Copie os arquivos de exemplo para os arquivos reais de ambiente.
2. Preencha as URLs públicas da instituição e os segredos do banco/sessão.
3. Revise o valor de `TRUST_PROXY` se houver proxy, load balancer ou ingress.
4. Rode `docker compose up -d --build` e valide os healthchecks.

## Contribuição

Toda contribuição é bem-vinda. Por favor, entre em contato em caso de dúvidas.

As contribuições no código devem ser feitas através de um [PR](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Licença

Esse código é distribuído sob a licença [GNU GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.txt).

A documentação, as imagens e demais mídias são distribuídas sob a licença [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/).
