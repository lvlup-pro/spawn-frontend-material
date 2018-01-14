<template>
  <v-container>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        <div class="display-2 grey--text text--darken-1">{{ $t('news') }}</div>
        <div class="grey--text text--darken-1 mb-3">
          {{ $t("hello") }}
        </div>
        <br><br>
        <discourse-latest-posts></discourse-latest-posts>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    i18n: {
      messages: {
        en: {
          news: 'News',
          hello: 'Welcome to lvlup.pro customer panel v3! Below you can find out what is new in our community'
        },
        pl: {
          news: 'Nowości',
          hello: 'Witaj w panelu klienta lvlup.pro v3. Poniżej możesz zapoznać się z nowościami naszej społeczności'
        }
      }
    },
    mounted() {
      this.$store.dispatch('whenMounted')
    },
  }
</script>
