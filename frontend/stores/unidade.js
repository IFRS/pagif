export const useUnidadeStore = defineStore('unidade', {
  state: () => ({
    _id: null,
    nome: '',
    slug: '',
    token: '',
    imagem: null,
    link_url: '',
    link_titulo: '',
    contato: '',
    createdAt: null,
    updatedAt: null,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUnidadeStore, import.meta.hot))
}
