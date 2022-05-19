<template>
  <v-app>
    <v-app-bar fixed app>
      <v-app-bar-title>IFpag</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',
  }
</script>
