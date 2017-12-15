<template>
  <v-container>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        {{ $t("hello") }}
        <h2>Forum</h2>
        <discourse-latest-posts ></discourse-latest-posts>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    i18n: {
      messages: {
        en: {
          hello: 'Welcome to lvlup.pro customer panel v3! Below you can find out what is new in our community:'
        },
        pl: {
          hello: 'Witaj w panelu klienta lvlup.pro v3. Poniżej możesz zapoznać się z nowościami naszej społeczności:'
        }
      }
    },
  }
</script>
