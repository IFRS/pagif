export default function ({ $axios, store, redirect }) {
  $axios.onError(error => {
    if (error.response.status === 401) {
      store.commit('auth/clear');
      redirect('/');
    }
  });
}
