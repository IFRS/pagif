export const useServicoStore = defineStore('servico', {
  state: () => ({
    _id: null,
    unidade: null,
    codigo: null,
    nome: '',
    desc: '',
    referencia_required: null,
    createdAt: null,
    updatedAt: null,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServicoStore, import.meta.hot))
}
