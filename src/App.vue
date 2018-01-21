<template>
  <v-app light>
    <v-navigation-drawer
      fixed
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      app
      dark
    >
      <v-list dense>
        <img id="logo" src="https://lvlup.pro/assets/home/img/logo.png">
        <p class="text-xs-center">
          <span class="white--text" id="credits-link">
            {{ $t('logoSubtitle')}} v3.0.0-rc.5
          </span>
        </p>

        <hr light="" class="divider divider--light">

        <v-subheader>{{ $t('account') }}</v-subheader>

        <v-list-tile @click="$router.push('/profile')" v-if="$store.state.loggedIn">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-user" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('profile') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="logOut()" v-if="$store.state.loggedIn">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-key" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('logOut')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="$router.push('/auth/login')" v-if="!$store.state.loggedIn">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-sign-out" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('login')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader>Menu</v-subheader>

        <v-list-tile @click="$router.push('/')">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-newspaper-o" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('news') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="$router.push('/services')" v-if="$store.state.loggedIn">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-list" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('services') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="$router.push('/payments')" v-if="$store.state.loggedIn">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-money" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('payments') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="$router.push('/tickets')" v-if="$store.state.loggedIn">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-heart" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('help') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <a target="_blank" class="no-deco" href="https://status.lvlup.pro">
          <v-list-tile>
            <v-list-tile-action>
              <i class="fa fa-fw fa-lg fa-heartbeat" aria-hidden="true"></i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ $t('status') }}
                <i class="fa fa-fw fa-external-link" aria-hidden="true"></i>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </a>

        <a target="_blank" class="no-deco" href="https://stats.lvlup.pro">
          <v-list-tile>
            <v-list-tile-action>
              <i class="fa fa-fw fa-lg fa-line-chart" aria-hidden="true"></i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ $t('statistics') }}
                <i class="fa fa-fw fa-external-link" aria-hidden="true"></i>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </a>

        <v-subheader>{{ $t('language') }}</v-subheader>

        <v-list-tile @click="changeLanguage()" v-if="$store.state.language === 'en'">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-globe" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Przełącz na Polski</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="changeLanguage()" v-if="$store.state.language === 'pl'">
          <v-list-tile-action>
            <i class="fa fa-fw fa-lg fa-globe" aria-hidden="true"></i>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Switch to English</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="elevation-2" height="60" color="green" fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" dark></v-toolbar-side-icon>
      <!--
      <v-btn
        icon
        light
        @click.stop="clipped = !clipped"
      >
        <v-icon>web</v-icon>
      </v-btn>
      -->

      <v-toolbar-title v-text="title" style="color:#fff"></v-toolbar-title>
      <!--
     <v-spacer></v-spacer>
     <v-btn
       icon
       dark
       @click.stop="rightDrawer = !rightDrawer"
     >
       <v-icon>menu</v-icon>
     </v-btn>
     -->
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      dark
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; LVL UP 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    i18n: {
      messages: {
        en: {
          logoSubtitle: 'Customer panel',
          news: 'News',
          services: 'Services',
          status: "Service status",
          statistics: "Metrics",
          help: 'Help',
          payments: 'Payments',
          login: 'Log in',
          logOut: 'Log out',
          account: 'Account',
          profile: 'Profile',
          language: 'Język'
        },
        pl: {
          logoSubtitle: 'Panel klienta',
          news: 'Nowości',
          services: 'Usługi',
          status: "Status usług",
          statistics: "Statystyki",
          help: 'Pomoc',
          payments: 'Płatności',
          login: 'Zaloguj',
          logOut: 'Wyloguj',
          account: 'Konto',
          profile: 'Profil',
          language: 'Language'
        }
      }
    },
    data() {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'my.lvlup.pro'
      }
    },
    mounted() {
      //this.changeLanguage(this.language)
      this.$store.dispatch('checkLanguage')
      this.$store.dispatch('checkIfLoggedIn')
    },
    methods: {
      redirect(url) {
        if (url !== null) {
          location.href = url
        }
      },
      logOut() {
        this.$store.dispatch('setLoggedOut')
      },
      changeLanguage() {
        this.$store.dispatch('changeLanguage')
      }
    }
  }
</script>

<style scoped>
  #logo {
    width: 80%;
    margin-left: 10%;
    margin-top: 2%;
  }

  .navigation-drawer {
    width: 250px !important;
  }

  .list__tile__action {
    padding-left: 10px;
    min-width: 50px;
  }

  .no-deco {
    text-decoration: none;
  }

  /*
   source of Roboto
   https://fonts.google.com/specimen/Roboto?selection.family=Roboto&selection.subset=latin-ext
   https://github.com/google/roboto
   https://fonts.googleapis.com/css?family=Roboto&amp;subset=latin-ext
  */

  /* latin-ext */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local('Roboto'), local('Roboto-Regular'), url('/static/font/roboto/v18/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2') format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
  }

  /* latin */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local('Roboto'), local('Roboto-Regular'), url('/static/font/roboto/v18/CWB0XYA8bzo0kSThX0UTuA.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
  }

  .application--wrap aside::-webkit-scrollbar {
    width: 6px;
  }

  .application--wrap aside::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }

</style>
