# CHANGELOG

## [Unreleased] - Rascunho do próximo release
### (Unreleased)
- Nenhuma alteração documentada ainda.

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

---

## Notas de Release
- Antes do release, verifique:
  - Variáveis de ambiente usadas em [frontend/nuxt.config.js](frontend/nuxt.config.js) e em eventuais exemplos de `.env` no backend (ex.: `backend/.env.example` se existir).
  - Tokens ALTCHA e PagTesouro (env: ALTCHA_HMAC_KEY, PAGTESOURO_URL, APP_URL, etc.).
  - Criar um Super Admin usando [backend/db/scripts/superadmin.js](backend/db/scripts/superadmin.js).

## Como contribuir com o CHANGELOG
- Sugestão: manter formato "Unreleased" → Tag por versão (ex.: v1.0.0) no momento do release.
- Atualize as seções Added / Changed / Fixed / Removed conforme commits.
