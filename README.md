# PagIF

Sistema de Pagamentos integrado ao [PagTesouro](https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro).

## Utilização

O sistema é dividido em dois "serviços", um para o _backend_ e outro para o _frontend_.

### Backend

O backend é desenvolvido em [NodeJS](https://nodejs.org/) com [Express](https://expressjs.com/) e banco de dados MongoDB através do [Mongoose](https://mongoosejs.com/). Confira abaixo os comandos disponíveis.


```bash
# instalação de dependências
$ npm install

# roda o linter para verificar inconsistências no código
$ npm run lint

# corrige automaticamente as insconsistências encontras, quando possível
$ npm run lint -- --fix

# roda o código e inicia o servidor de desenvolvimento (com monitoramento de mudanças)
$ npm run dev

# roda o código e inicia o servidor de produção
$ npm run start
```

### Frontend

O _frontend_ é desenvolvido com [Nuxt 3](https://nuxt.com/). Confira abaixo os comandos disponíveis.

```bash
# instalação de dependências
$ npm install

# roda o linter para verificar inconsistências no código
$ npm run lint

# corrige automaticamente as insconsistências encontras, quando possível
$ npm run lint -- --fix

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

Para criar um usuário _super_ administrador, principalmente pela primeira vez, é necessário roda um `script` no backend conforme abaixo:

```bash
$ npm run superadmin email@example.com
```

**Atenção:** O comando acima deve ser rodado no _console_ do _backend_.

## Contribuição

Toda contribuição é bem-vinda. Por favor, entre em contato em caso de dúvidas.

As contribuições no código devem ser feitas através de um [PR](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Licença

Esse código é distribuído sob a licença [GNU GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.txt).

A documentação, as imagens e demais mídias são distribuídas sob a licença [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/).
