<template>
  <v-container>
    <h2>Configurações</h2>
    <v-form>
      <h3>Introdução</h3>
      <AdminEditor/>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'AdminConfig',
  layout: 'admin',
  head: {
    title: 'Configurações',
  },
}
</script>
