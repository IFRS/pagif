# CHANGELOG

## [0.2.4] - 2026-07-21
### Changed
- Ajustado o `Dockerfile` do backend para melhorar a previsibilidade do build em ambiente containerizado, mantendo a aplicação em execução com o usuário `node`.

### Fixed
- Corrigido o comportamento dos seletores de competência e vencimento no formulário administrativo de Pagamentos, que agora fecham corretamente ao clicar fora do campo.
- Corrigido o fluxo de limpeza dos campos de competência e vencimento para evitar reabertura automática do seletor após usar `clear`.
- Adicionado suporte para limpar a competência na etapa Extra do fluxo público de Pagamento, melhorando a usabilidade em seleções feitas por engano.

## [0.2.3] - 2026-07-21
### Added
- Suporte a CNPJ alfanumérico no fluxo de pagamentos, incluindo validação no backend e ajustes de máscara, filtro e validação no frontend.
- Configuração de domínios permitidos para autenticação via Google.
- Detecção de proxy no backend para manter o rate limiting funcional em ambientes com proxy reverso.

### Changed
- Atualização da integração com ALTCHA para a nova versão, com ajustes no middleware e no widget cliente.
- Atualização de dependências principais do projeto, incluindo Vuetify, Pinia, MongoDB/ACL e Altcha, com os ajustes de compatibilidade necessários.
- Campo de competência nos formulários de pagamento passou a utilizar o componente `month-picker`.
- Melhoria no tratamento de logs do backend em ambiente Docker e no controle dos processos filho da fila.
- Melhoria na mensagem exibida em falhas de autenticação.

### Fixed
- Corrigida a incompatibilidade de BSON que afetava a sessão do login Google.
- Corrigida a exibição do aviso de configuração faltando na área administrativa.
- Ajustado o comportamento de cópia para a área de transferência na página de novo pagamento.
- Ajustado o comportamento do menu e da página administrativa de Pagamentos.
- Validação do nome do contribuinte passou a aceitar mais caracteres especiais válidos.

## [0.2.2] - 2025-11-13
### Added
- Background job (fila) para atualização automática de pagamentos com status `CRIADO` há mais de 7 dias.
- Novo campo de configuração `dias de vencimento` em Settings.
- Atributo correspondente adicionado ao store e ao formulário de Settings.

### Changed
- Ao criar pagamentos públicos, agora é usado o valor de `dias de vencimento` definido no store.
- Ajuste da redação do aviso de prazo de pagamento.
- Melhoria nas mensagens geradas pela fila de atualização de pagamentos.
- Consolidação e padronização do caminho dos arquivos de log.

### Fixed
- Removido `await` em chamadas que não retornavam Promise.

## [0.2.1] - 2025-11-05
### Fixed
- Corrige um bug na página de pagamento que fazia com que, ao limpar a URL de pagamento, a interface dispare uma requisição desnecessária ao servidor. Agora limpar a URL não aciona requisições; a interface atualiza o estado corretamente e evita chamadas, reduzindo carga no servidor.

## [0.2.0] - 2025-11-04
### Added
- Integração com PagTesouro para criação e consulta de cobranças (cliente HTTP configurado em [backend/api/pagtesouro.js](backend/api/pagtesouro.js)).
- Endpoints públicos e administrativos para Pagamentos, Unidades, Serviços, Usuários e Configurações. Exemplos:
  - Endpoint público de pagamento: [backend/api/controllers/pagamentosController.js#showPublic](backend/api/controllers/pagamentosController.js) — expõe dados sem tokens sensíveis.
  - Rotas de API organizadas em:
    - [backend/api/routes/pagamentos.js](backend/api/routes/pagamentos.js)
    - [backend/api/routes/unidades.js](backend/api/routes/unidades.js)
    - [backend/api/routes/servicos.js](backend/api/routes/servicos.js)
    - [backend/api/routes/info.js](backend/api/routes/info.js)
- Proteção CAPTCHA via ALTCHA:
  - Middleware de validação: [backend/api/middleware/altcha.js](backend/api/middleware/altcha.js)
  - Controller para gerar desafio ALTCHA: [backend/api/controllers/altchaController.js](backend/api/controllers/altchaController.js)
  - Widget cliente: [frontend/app/components/Altcha.client.vue](frontend/app/components/Altcha.client.vue)
- Autenticação via Google OAuth (backend e frontend):
  - Backend: [backend/api/auth/google.js](backend/api/auth/google.js) com verificação de token e sessão.
  - Frontend: componente de login [frontend/app/components/Autenticacao.client.vue](frontend/app/components/Autenticacao.client.vue)
- Sessões persistidas em MongoDB (configuradas em [backend/api/index.js](backend/api/index.js)) com controle de expiração e rate-limiting global.
- Processamento assíncrono / jobs periódicos com fila para atualizar pagamentos e integrar atualizações do PagTesouro: [backend/queue/index.js](backend/queue/index.js)
- Logging estruturado com Winston, separado para PagTesouro e logs gerais: [backend/logger/index.js](backend/logger/index.js)

### Backend (data models & scripts)
- Modelos Mongoose para recursos principais:
  - Unidade: [backend/db/models/Unidade.js](backend/db/models/Unidade.js)
  - Servico: [backend/db/models/Servico.js](backend/db/models/Servico.js)
  - Settings (config global do app): [backend/db/models/Settings.js](backend/db/models/Settings.js)
  - Pagamento (modelo usado em controllers/filas) — utilizado em vários controllers.
- Script auxiliar para criar superadmin: [backend/db/scripts/superadmin.js](backend/db/scripts/superadmin.js)

### Frontend (UX / admin / fluxo de pagamento)
- SPA Nuxt 4 com Vuetify e Pinia. Configuração central em [frontend/nuxt.config.js](frontend/nuxt.config.js)
- Fluxo de criação de pagamento multi-step com validações, CAPTCHAs e etapas:
  - Componentes de passos: [frontend/app/components/Pagamento/Steps/Resumo.vue](frontend/app/components/Pagamento/Steps/Resumo.vue) (ex.: `Resumo.vue`, `Extra.vue`, `CodigoServico.vue`)
  - Formulários administrativos para Unidades, Serviços, Usuários e Configurações:
    - [frontend/app/components/Form/Pagamento.vue](frontend/app/components/Form/Pagamento.vue)
    - [frontend/app/components/Form/Servico.vue](frontend/app/components/Form/Servico.vue)
    - [frontend/app/components/Form/Unidade.vue](frontend/app/components/Form/Unidade.vue)
    - [frontend/app/components/Form/Usuario.vue](frontend/app/components/Form/Usuario.vue)
- Páginas administrativas com controle de acesso (ACL) e componentes de visualização de dados (tabelas, gráficos):
  - Admin dashboard e listas de Unidades/Serviços/Pagamentos/Usuários: [frontend/app/pages/admin/index.vue](frontend/app/pages/admin/index.vue)
  - Gráficos de uso e estatísticas utilizando endpoints de `info` (ex.: [frontend/app/components/Charts/Servicos.vue](frontend/app/components/Charts/Servicos.vue))
- Editor rico tiptap integrado com estilos customizados: plugin [frontend/app/plugins/11.tiptap.js](frontend/app/plugins/11.tiptap.js) e scss em [frontend/app/assets/scss/tiptap-github-markdown.scss](frontend/app/assets/scss/tiptap-github-markdown.scss)

### Security & ops
- Rate limiting global em API para mitigar abuso (configurado em [backend/api/index.js](backend/api/index.js)).
- Uso de Helmet e CORS bem configurado no backend.
- Compatibilidade com deploy via Docker Compose (`docker-compose.yml` na raiz).

### Changed
- Padronização do uso de ES Modules no backend (`type: module`) e uso de hooks Nuxt/Vuetify no frontend.
- Normalização de datas e formatos entre PagTesouro e o sistema (tratamento em [backend/api/pagtesouro.js](backend/api/pagtesouro.js)).

### Fixed
- Tratamento de dados sensíveis retornados em endpoints públicos (remoção de tokens/infos sensíveis em [backend/api/controllers/pagamentosController.js](backend/api/controllers/pagamentosController.js)).

## [0.1.0]

Sistema legado.

---

## Notas de Release
- Antes do release, verifique:
  - Variáveis de ambiente usadas em [frontend/nuxt.config.js](frontend/nuxt.config.js) e em eventuais exemplos de `.env` no backend (ex.: `backend/.env.example` se existir).
  - Tokens ALTCHA e PagTesouro (env: ALTCHA_HMAC_KEY, PAGTESOURO_URL, APP_URL, etc.).
  - Criar um Super Admin usando [backend/db/scripts/superadmin.js](backend/db/scripts/superadmin.js).

## Como contribuir com o CHANGELOG
- Sugestão: manter formato "Unreleased" → Tag por versão (ex.: v1.0.0) no momento do release.
- Atualize as seções Added / Changed / Fixed / Removed conforme commits.
