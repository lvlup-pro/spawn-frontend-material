<template>
  <v-container>
    <div class="display-3 grey--text text--darken-1">{{ $t('profile') }}</div>
    <br>

    <v-layout row wrap>
      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('privateData') }}</div>
        <br>
        <v-layout row>
          <v-flex xs12>
            <v-card class="white--text">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs12>
                    <div>
                      <v-text-field
                        v-model="id"
                        :label="$t('id')"
                        disabled
                      ></v-text-field>
                      <v-text-field
                        v-model="username"
                        :label="$t('username')"
                        disabled
                      ></v-text-field>
                      <v-text-field
                        v-model="fullname"
                        :label="$t('fullname')"
                      ></v-text-field>
                      <v-text-field
                        v-model="email"
                        :label="$t('email')"
                      ></v-text-field>

                    </div>
                  </v-flex>
                  <v-flex xs2>
                    <i class="fa fa-user fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>

  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    i18n: {
      messages: {
        en: {
          profile: 'Your profile',
          privateData: 'Private data',
          id: 'Customer ID',
          fullname: 'Full name',
          username: 'Username',
          email: 'E-mail'
        },
        pl: {
          profile: 'Twój profil',
          privateData: 'Dane prywatne',
          id: 'Numer klienta (ID)',
          fullname: 'Imię i nazwisko',
          username: 'Login',
          email: 'E-mail'
        }
      }
    },
    data() {
      return {
        id: 0,
        fullname: '',
        username: '',
        email: ''
      }
    },
    mounted() {
      this.$store.dispatch('whenMounted')
      this.getProfileInfo()
    },
    methods: {
      getProfileInfo() {
        axios({
          method: 'get',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'me'
        }).then((res) => {
          console.log(res.data)
          this.id = '#' + res.data.id
          this.fullname = res.data.fullname
          this.username = res.data.username
          this.email = res.data.email
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      }
    }
  }
</script>
