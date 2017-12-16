<template>
  <v-container>

    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-media
            class="white--text"
            height="200px"
            src="http://www.wallpapereast.com/static/images/green-wallpaper-abstract.jpg"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline">{{$t('welcome')}}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-title>
            <div id="form-container">
              <form>
                <v-alert color="success" icon="check_circle" value="true" v-if="correctCredentials">
                  {{ $t('correctCredentials') }}
                </v-alert>
                <v-alert color="error" icon="warning" value="true" v-if="wrongCredentials">
                  {{ $t('wrongCredentials') }}
                </v-alert>
                <v-alert color="info" icon="info" value="true" v-if="checkingCredentials">
                  {{ $t('checkingCredentials') }}
                </v-alert>
                <v-alert color="info" icon="info" value="true" v-if="$store.state.userJustLoggedOff">
                  {{ $t('sucessfullLogOut') }}
                </v-alert>
                <br>
                <v-layout row wrap>
                  <v-flex xs2 sm1>
                    <i class="fa fa-fw fa-2x fa-user fa-form" aria-hidden="true"></i>
                  </v-flex>
                  <v-flex xs10 sm11>
                    <v-text-field
                      :label="$t('loginOrMail')"
                      v-model="username"
                      :error-messages="usernameErrors"
                      :counter="32"
                      @input="$v.username.$touch()"
                      @blur="$v.username.$touch()"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs2 sm1>
                    <i class="fa fa-fw fa-2x fa-key fa-form" aria-hidden="true"></i>
                  </v-flex>
                  <v-flex xs10 sm11>
                    <v-text-field
                      :label="$t('password')"
                      v-model="password"
                      :error-messages="passwordErrors"
                      :counter="32"
                      @input="$v.password.$touch()"
                      @blur="$v.password.$touch()"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <div class="text-xs-center">
                  <v-btn color="blue" dark large @click="submit">
                    {{ $t('submit') }}
                  </v-btn>
                  <br><br>
                  <div>
                    <router-link to="/auth/recover">
                      {{ $t('forgot') }}
                    </router-link>
                  </div>
                </div>

              </form>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout class="mt-4">
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="green" class="white--text">
          <v-card-title primary-title align-center>
            <div class="headline">{{ $t('noAccountYet') }}</div>
          </v-card-title>
          <div class="text-xs-center">
            <v-btn color="blue" dark large align-center>{{ $t('createNewAccount') }}</v-btn>
          </div>
          <br>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required, maxLength, email} from 'vuelidate/lib/validators'
  import axios from 'axios'

  export default {
    i18n: {
      messages: {
        en: {
          welcome: 'Log in to your account',
          login: 'Login',
          loginOrMail: 'Login/e-mail',
          password: 'Password',
          submit: 'Log in',
          forgot: 'I forgot my password',
          wrongCredentials: 'Wrong username and/or password',
          correctCredentials: 'Login correct! Redirecting...',
          checkingCredentials: 'Checking...',
          sucessfullLogOut: 'You have been logged out',
          noAccountYet: "I don't have an account yet",
          createNewAccount: 'Create new account',
        },
        pl: {
          welcome: 'Zaloguj się do swojego konta',
          login: 'Login',
          loginOrMail: 'Login/e-mail',
          password: 'Hasło',
          submit: 'Zaloguj',
          forgot: 'Zapomniałem hasła',
          wrongCredentials: 'Zły login i/lub hasło',
          correctCredentials: 'Dane poprawne, przekierowywanie...',
          checkingCredentials: 'Sprawdzam...',
          sucessfullLogOut: 'Wylogowano',
          noAccountYet: 'Jeszcze nie mam konta',
          createNewAccount: 'Załóż konto'
        }
      }
    },
    mixins: [validationMixin],
    validations: {
      username: {required, maxLength: maxLength(32)},
      password: {required},
    },
    data() {
      return {
        username: '',
        password: '',
        wrongCredentials: false,
        correctCredentials: false,
        checkingCredentials: false
      }
    },
    mounted() {
      if (this.$store.state.loggedIn) {
        this.$router.push('/services')
      }
    },
    methods: {
      login() {
        this.wrongCredentials = false
        this.correctCredentials = false
        this.checkingCredentials = true
        this.$store.dispatch('setLoggedOutOld')
        axios({
          method: 'post',
          url: this.$config.apiUrl + 'auth/login',
          data: {
            username: this.username,
            password: this.password
          }
        }).then((res) => {
          console.log('Login ok, writing token to local storage')
          this.checkingCredentials = false
          this.correctCredentials = true
          localStorage.setItem('token', res.data.token)
          this.$store.dispatch('setLoggedIn')
          setTimeout(() => {
            this.$router.push('/services')
          }, 1500)
        }).catch((err) => {
          this.checkingCredentials = false
          this.wrongCredentials = true
        })
      },
      submit() {
        this.$v.$touch()
        this.login()
      },
      clear() {
        this.$v.$reset()
      }
    },
    computed: {
      selectErrors() {
        const errors = []
        if (!this.$v.select.$dirty) return errors
        !this.$v.select.required && errors.push('Item is required')
        return errors
      },
      usernameErrors() {
        const errors = []
        if (!this.$v.username.$dirty) return errors
        !this.$v.username.maxLength && errors.push('Username must be at most 10 characters long')
        !this.$v.username.required && errors.push('Username is required.')
        return errors
      },
      passwordErrors() {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('Password is required')
        return errors
      }
    }
  }
</script>

<style scoped>
  #form-container {
    width: 100%;
  }

  .fa-form {
    position: relative;
    top: 25%;
  }
</style>