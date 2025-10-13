<script setup>
definePageMeta({
  redirect: to => ({ path: '/', query: { unidade: to.params.slug } }),
})

useHeadSafe({
  title: 'Redirecionando...',
})
</script>
