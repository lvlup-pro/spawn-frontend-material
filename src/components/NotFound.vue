<template>
  <v-container>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        <div class="display-3 grey--text text--darken-1">404</div>
        <br>
        {{ $t('notFound') }}
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    i18n: {
      messages: {
        en: {
          notFound: 'This page was not found'
        },
        pl: {
          notFound: 'Nie znaleziono podanej strony'
        }
      }
    },
    mounted() {
      this.$store.dispatch('whenMounted')
    },
  }
</script>
