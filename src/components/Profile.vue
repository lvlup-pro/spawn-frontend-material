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
              Sorry, nothing to display here :(
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
          loginSucessful: 'Successful',
          loginFailed: 'Failed',
          ipAddress: 'IP adress',
          browser: 'Browser',
          loginAction: 'Log in to the account'
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
          loginSucessful: 'Udane',
          loginFailed: 'Nieudane',
          ipAddress: 'Adres IP',
          browser: 'Przeglądarka',
          loginAction: 'Logowanie do konta'
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
        showFullUseragent: false
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
    }
  }
</script>
