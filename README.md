# PagIF

Sistema de Pagamentos integrado ao [PagTesouro](https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro).

## Utilização

```bash
# instalação de dependências
$ npm install

# compila (com hot reload) e inicia o servidor de desenvolvimento
$ npm run dev

# compila para produção
$ npm run build

# inicia o servidor para produção
$ npm run start
```

Para mais informações confira a [documentação do Nuxt](https://nuxtjs.com).

## Criação de Super Administrador

Para criar um usuário _super_ administrador, principalmente pela primeira vez, é necessário usar um `script` personalizado conforme abaixo:

```bash
$ npm run superadmin <email_do_superadmin>
```

**Atenção:** O comando acima deve ser rodado no _console_ do _backend_.

## Licença

Esse código é distribuído sob a licença [GNU GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.txt).

A documentação, as imagens e demais mídias são distribuídas sob a licença [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/).
