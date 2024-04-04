<script setup>
  definePageMeta({
    title: 'Redirecionando...',
    redirect: (to) => ({ path: '/', query: { unidade: to.params.slug } }),
  })
</script>
