<template>
  <v-container>
    <div class="display-2 grey--text text--darken-1">{{ $t('profile') }}</div>
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
                        disabled
                      ></v-text-field>
                      <v-text-field
                        v-model="email"
                        :label="$t('email')"
                        disabled
                      ></v-text-field>

                      <v-dialog v-model="changeEmailDialog" persistent max-width="500px">
                        <v-btn color="primary" slot="activator">{{ $t('changeEmail') }}</v-btn>
                        <v-card>
                          <v-card-title>
                            <span class="headline">{{ $t('changeEmail') }}</span>
                          </v-card-title>
                          <v-card-text>

                            <v-container grid-list-md v-if="!changeEmailStep1Done">
                              {{ $t('step')}} 1

                              <v-alert color="error" icon="warning" dismissible v-model="stepOneEmailAlreadyTaken">
                                {{ $t('emailAlreadyTaken') }}
                              </v-alert>
                              <v-alert color="error" icon="warning" dismissible v-model="stepOneWrongEmail">
                                {{ $t('wrongEmail') }}
                              </v-alert>
                              <v-alert color="error" icon="warning" dismissible v-model="stepOneWrongPassword">
                                {{ $t('wrongPassword') }}
                              </v-alert>

                              <v-layout wrap>
                                <v-flex xs12>
                                  <v-text-field
                                    v-model="newEmail"
                                    :rules="emailRules"
                                    :label="$t('newEmail')"
                                    required>
                                  </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                  <v-text-field
                                    v-model="password"
                                    :label="$t('password')"
                                    type="password"
                                    required>
                                  </v-text-field>
                                </v-flex>
                              </v-layout>
                              <br>
                              <v-btn
                                :disabled="emailChangeLoading"
                                :loading="emailChangeLoading"
                                @click="sendConfirmation()"
                                color="primary"
                              >
                                {{ $t('sendConfirmation') }}
                              </v-btn>
                              <br>
                              {{ $t('sendConfirmationTip') }}
                            </v-container>

                            <v-container grid-list-md v-if="changeEmailStep1Done && !changeEmailStep2Done">
                              {{ $t('step')}} 2

                              <v-alert color="error" icon="warning" dismissible v-model="stepTwoWrongToken">
                                {{ $t('wrongToken') }}
                              </v-alert>

                              <v-layout wrap>
                                <v-flex xs12>
                                  <v-text-field
                                    v-model="verificationToken"
                                    :label="$t('confirmationCode')"
                                    required>
                                  </v-text-field>
                                </v-flex>
                              </v-layout>
                              <br>
                              <v-btn
                                :disabled="emailChangeLoading"
                                :loading="emailChangeLoading"
                                @click="verifyEmail()"
                                color="primary"
                              >
                                {{ $t('verifyEmail') }}
                              </v-btn>
                            </v-container>

                            <v-container grid-list-md v-if="changeEmailStep2Done">
                              {{ $t('step')}} 3
                              <v-alert color="success" icon="check_circle" value="true">
                                {{ $t('emailChangeOk') }}
                              </v-alert>
                            </v-container>

                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click.native="changeEmailDialog = false">
                              {{ $t('close') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>

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

    <br>
    <div class="display-1 grey--text text--darken-1">{{ $t('log') }}</div>
    <br>
    <v-switch v-bind:label="$t('showFullUseragent')" v-model="showFullUseragent" color="success"></v-switch>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-data-table
          v-bind:items="items"
          v-bind:search="search"
          v-bind:pagination.sync="pagination"
          :rows-per-page-items="perPage"
          :rows-per-page-text="$t('rowsPerPage')"
          :total-items="totalItems"
          :loading="loading"
          class="elevation-2"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th class="text-xs-left">
                ID
              </th>
              <th class="text-xs-left">
                {{ $t('action') }}
              </th>
              <th class="text-xs-left">
                {{ $t('result') }}
              </th>
              <th class="text-xs-left">
                {{ $t('ipAddress') }}
              </th>
              <th class="text-xs-left">
                {{ $t('browser') }}
              </th>
              <th class="text-xs-right">
                {{ $t('createdAt') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td>#{{ props.item.id }}</td>
            <td>
              {{ $t('loginAction') }}
            </td>
            <td v-if="props.item.action === 'LOGIN_SUCCESSFUL'">
              {{ $t('loginSucessful') }}
            </td>
            <td v-if="props.item.action === 'LOGIN_FAILED'">
              {{ $t('loginFailed') }}
            </td>
            <td v-if="props.item.action === 'EMAIL_CHANGE_INIT'">
              {{ $t('emailChangeInit') }}
            </td>
            <td v-if="props.item.action === 'EMAIL_CHANGE_FINISH'">
              {{ $t('emailChangeFinish') }}
            </td>
            <td>
              {{ props.item.ip }}
            </td>
            <td v-if="showFullUseragent">
              {{ props.item.useragent }}
            </td>
            <td v-else>
              {{ props.item.useragent | parseUserAgent }}
            </td>
            <td class="text-xs-right">{{ props.item.created_at | prettyDateTime }}</td>
          </template>
          <template slot="no-data">
            <v-alert :value="true" color="info" icon="info" v-if="!loading">
              {{ $t('noLog') }}
            </v-alert>
          </template>
          <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            {{ $t('from') }} {{ pageStart }} {{ $t('to') }} {{ pageStop }}
          </template>
        </v-data-table>
      </div>
    </v-slide-y-transition>

  </v-container>
</template>

<script>
  import axios from 'axios'
  import uaParser from 'ua-parser-js'

  export default {
    i18n: {
      messages: {
        en: {
          profile: 'Your profile',
          privateData: 'Private data',
          id: 'Customer ID',
          fullname: 'Full name',
          username: 'Username',
          email: 'E-mail',
          log: 'Log',
          showFullUseragent: 'Show full useragent of the browser',
          createdAt: 'Time of event',
          rowsPerPage: 'Rows per page',
          from: 'From',
          to: 'to',
          action: 'Action',
          result: 'Result',
          // log actions
          loginSucessful: 'Successful',
          loginFailed: 'Failed',
          emailChangeInit: 'E-mail change started',
          emailChangeFinish: 'E-mail change ended',
          // rest of table
          ipAddress: 'IP adress',
          browser: 'Browser',
          loginAction: 'Log in to the account',
          changeEmail: 'Change e-mail',
          newEmail: 'New e-mail',
          password: 'Password for lvlup.pro account',
          wrongPassword: 'Wrong password',
          wrongEmail: 'Wrong e-mail',
          emailAlreadyTaken: 'This e-mail is already taken, please use other address',
          emailRequired: 'E-mail field is required',
          confirmationCode: 'Confirmation code',
          sendConfirmation: 'Send confirmation code',
          sendConfirmationTip: 'Sends confirmation code to new e-mail address',
          verifyEmail: 'Verify e-mail',
          emailChangeOk: 'E-mail address changed',
          wrongToken: 'Token doesn\'t match',
          step: 'Step',
          close: 'Close',
          noLog: 'No log entries yet'
        },
        pl: {
          profile: 'Twój profil',
          privateData: 'Dane prywatne',
          id: 'Numer klienta (ID)',
          fullname: 'Imię i nazwisko',
          username: 'Login',
          email: 'E-mail',
          log: 'Dziennik zdarzeń',
          showFullUseragent: 'Pokaż pełne ID przeglądarki',
          createdAt: 'Czas zdarzenia',
          rowsPerPage: 'Wyników na stronę',
          from: 'Od',
          to: 'do',
          action: 'Akcja',
          result: 'Wynik',
          // log actions
          loginSucessful: 'Udane',
          loginFailed: 'Nieudane',
          emailChangeInit: 'Zmiana e-mail rozpoczęta',
          emailChangeFinish: 'Zmiana e-mail zakończona',
          // rest of table
          ipAddress: 'Adres IP',
          browser: 'Przeglądarka',
          loginAction: 'Logowanie do konta',
          changeEmail: 'Zmień e-mail',
          newEmail: 'Nowy e-mail',
          password: 'Hasło do panelu lvlup.pro',
          wrongPassword: 'Niepoprawne hasło',
          wrongEmail: 'Niepoprawny e-mail',
          emailAlreadyTaken: 'Ten adres e-mail jest już zajęty, należy użyć innego',
          emailRequired: 'Pole e-mail jest wymagane',
          confirmationCode: 'Kod potwierdzający',
          sendConfirmation: 'Wyślij kod',
          sendConfirmationTip: 'Wysyła wiadomość z kodem potwierdzającym na nowy adres e-mail',
          verifyEmail: 'Zweryfikuj e-mail',
          emailChangeOk: 'Adres e-mail został zmieniony',
          wrongToken: 'Kod nie zgadza się z tym wysłanym na email',
          step: 'Krok',
          close: 'Zamknij',
          noLog: 'Póki co brak wpisów w dzienniku'
        }
      }
    },
    data() {
      return {
        id: 0,
        fullname: '',
        username: '',
        email: '',
        perPage: [10, 50, 100, 200],
        search: '',
        totalItems: 0,
        items: [],
        loading: true,
        pagination: {},
        // auth log
        showFullUseragent: false,
        // change email
        emailChangeLoading: false,
        newEmail: '',
        password: '',
        verificationToken: '',
        changeEmailDialog: false,
        changeEmailStep1Done: false,
        changeEmailStep2Done: false,
        stepOneEmailAlreadyTaken: false,
        stepOneWrongEmail: false,
        stepOneWrongPassword: false,
        stepTwoWrongToken: false,
        emailRules: [
          (v) => !!v || this.$t('emailRequired'),
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('wrongEmail')
        ]
      }
    },
    watch: {
      pagination: {
        handler() {
          this.getLogFromApi()
            .then(data => {
              this.items = data.items
              this.totalItems = data.total
            })
        },
        deep: true
      }
    },
    filters: {
      parseUserAgent(uaString) {
        let useragent = uaParser(uaString)
        let result = ''

        if (useragent.browser.name && useragent.browser.name.length !== 0) {
          result += ' ' + useragent.browser.name
        }
        if (useragent.browser.version && useragent.browser.version.length !== 0) {
          result += ' ' + useragent.browser.version
        }
        if (useragent.os.name && useragent.os.name.length !== 0) {
          result += ' ' + useragent.os.name
        }
        if (useragent.os.version && useragent.os.version.length !== 0) {
          result += ' ' + useragent.os.version
        }

        return result
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
          this.id = '#' + res.data.id
          this.fullname = res.data.fullname
          this.username = res.data.username
          this.email = res.data.email
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      getLogFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const {sortBy, descending, page, rowsPerPage} = this.pagination
          axios({
            method: 'get',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            url: this.$config.apiUrl + 'me/log?page=' + page + '&limit=' + rowsPerPage
          }).then((res) => {
            this.loading = false
            let items = res.data.items
            let total = res.data.paging.total_items
            resolve({
              items,
              total
            })
          }).catch((err) => {
            this.loading = false
            console.log(err.response.status)
            if (err.response.status === 401) {
              this.$store.dispatch('setLoggedOut')
            }
          })

        })
      },
      sendConfirmation() {
        this.emailChangeLoading = true
        this.stepOneEmailAlreadyTaken = false
        this.stepOneWrongEmail = false
        this.stepOneWrongPassword = false
        axios({
          method: 'post',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'me/email/main/change/init',
          data: {
            new_email: this.newEmail,
            password: this.password
          }
        }).then((res) => {
          this.emailChangeLoading = false
          this.changeEmailStep1Done = true
          this.getLogFromApi()
            .then(data => {
              this.items = data.items
              this.totalItems = data.total
            })
        }).catch((err) => {
          this.emailChangeLoading = false
          if (err.response.status === 400) {
            if (err.response.data.message.includes('already taken')) {
              this.stepOneEmailAlreadyTaken = true
            } else if (err.response.data.message[0].includes('valid email')) {
              this.stepOneWrongEmail = true
            } else if (err.response.data.message.includes('password')) {
              this.stepOneWrongPassword = true
            }
          }
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      verifyEmail() {
        this.emailChangeLoading = true
        this.stepTwoWrongToken = false
        axios({
          method: 'post',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'me/email/main/change/finish',
          data: {
            token: this.verificationToken,
            password: this.password
          }
        }).then((res) => {
          this.emailChangeLoading = false
          this.password = ''
          this.changeEmailStep2Done = true
          this.getProfileInfo()
          this.getLogFromApi()
            .then(data => {
              this.items = data.items
              this.totalItems = data.total
            })
        }).catch((err) => {
          this.emailChangeLoading = false
          if (err.response.status === 400) {
            if (err.response.data.message.includes('Token')) {
              this.stepTwoWrongToken = true
            }
          }
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      }
    }
  }
</script>
