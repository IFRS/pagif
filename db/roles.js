module.exports = {
  ADMIN: {
    role: 'ADMIN',
    name: 'Administrador',
    desc: 'Pode gerenciar Serviços e Pagamentos da Unidade Gestora.',
  },
  GERENTE: {
    role: 'GERENTE',
    name: 'Gerente de Pagamentos',
    desc: 'Pode gerenciar somente os Pagamentos da Unidade Gestora.',
  },
  USER: {
    role: 'USER',
    name: 'Usuário Comum',
    desc: 'Pode visualizar somente os Pagamentos da Unidade Gestora.',
  },
};
