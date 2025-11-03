<script setup>
definePageMeta({
  redirect: to => ({ path: '/', query: { unidade: to.params.slug } }),
})

useHead({
  title: 'Redirecionando...',
})
</script>
