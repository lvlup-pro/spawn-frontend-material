<template>
  <v-container>
    <div class="display-3 grey--text text--darken-1">{{ $t('payments') }}</div>
    <br>

    <v-layout row wrap>
      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('currentBalance') }}</div>
        <br>
        <v-layout row>
          <v-flex xs11>
            <v-card color="green darken-4" class="white--text" v-if="walletBalanceLoading">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs10>
                    <div>
                      <div class="headline">{{ walletBalance }}</div>
                      <div>{{ $t('walletFunds') }}</div>
                    </div>
                  </v-flex>
                  <v-flex xs2>
                    <i class="fa fa-money fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

            <v-card color="green" class="white--text" v-if="!walletBalanceLoading">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs10>
                    <div>
                      <div class="headline">{{ walletBalance }}</div>
                      <div>{{ $t('walletFunds') }}</div>
                    </div>
                  </v-flex>
                  <v-flex xs2>
                    <i class="fa fa-money fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('useFunds') }}</div>
        <br>
        <v-layout row>
          <v-flex xs11>

            <v-card color="blue" class="white--text">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs10>
                    <div>
                      <div class="headline">
                        <v-snackbar
                          bottom
                          multiline
                          vertical
                          timeout="10000"
                          v-model="shoppingNotImplementedYetSnack"
                        >
                          {{ $t('shoppingNotYetReady') }}
                          <v-btn flat color="pink" @click.native="shoppingNotImplementedYetSnack = false">
                            {{ $t('okIWillWait') }}
                          </v-btn>
                        </v-snackbar>
                        <v-btn @click="shoppingNotImplementedYetSnack = true" large>
                          {{ $t('buyNewServices') }}
                        </v-btn>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs2>
                    <i class="fa fa-shopping-cart fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>


    <br>
    <div class="display-1 grey--text text--darken-1">{{ $t('history') }}</div>
    <br>
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
                {{ $t('amount') }}
              </th>
              <th class="text-xs-left">
                {{ $t('description') }}
              </th>
              <th class="text-xs-right">
                {{ $t('createdAt') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td>#{{ props.item.id }}</td>
            <td v-if="props.item.amount > 0" class="green--text">
              +{{props.item.amount}}
              <span class="hidden-sm-and-down">PLN</span>
            </td>
            <td v-if="props.item.amount == 0">
              {{props.item.amount}}
              <span class="hidden-sm-and-down">PLN</span>
            </td>
            <td v-if="props.item.amount < 0" class="red--text">
              {{props.item.amount}}
              <span class="hidden-sm-and-down">PLN</span>
            </td>
            <td class="text-xs-left">
              {{ props.item.description }}
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

  export default {
    i18n: {
      messages: {
        en: {
          payments: 'Payments',
          currentBalance: 'Current balance',
          walletFunds: 'in lvlup.pro wallet funds',
          useFunds: 'Use your funds',
          buyNewServices: 'Buy new services',
          history: 'History',
          amount: 'Amount',
          description: 'Description',
          createdAt: 'Created',
          rowsPerPage: 'Rows per page',
          from: 'From',
          to: 'to',
          shoppingNotYetReady: "Shopping is not yet available in v3 panel",
          okIWillWait: "Ok, I'll wait"
        },
        pl: {
          payments: 'Płatności',
          currentBalance: 'Obecny stan konta',
          walletFunds: 'środków w portfelu lvlup.pro',
          useFunds: 'Skorzystaj z środków',
          buyNewServices: 'Zakup nowe usługi',
          history: 'Historia',
          amount: 'Kwota',
          description: 'Opis',
          createdAt: 'Utworzono',
          rowsPerPage: 'Wyników na stronę',
          from: 'Od',
          to: 'do',
          shoppingNotYetReady: "Zamówienia nie są jeszcze dostępne w panelu v3",
          okIWillWait: "Rozumiem, poczekam"
        }
      }
    },
    data() {
      return {
        perPage: [10, 50, 100, 200],
        search: '',
        totalItems: 0,
        items: [],
        loading: true,
        pagination: {},
        walletBalance: '? PLN',
        walletBalanceLoading: true,
        shoppingNotImplementedYetSnack: false
      }
    },
    watch: {
      pagination: {
        handler() {
          this.getDataFromApi()
            .then(data => {
              this.items = data.items
              this.totalItems = data.total
            })
        },
        deep: true
      }
    },
    mounted() {
      this.getWalletInfo()
    },
    methods: {
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const {sortBy, descending, page, rowsPerPage} = this.pagination
          axios({
            method: 'get',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            url: this.$config.apiUrl + 'payment?page=' + page + '&limit=' + rowsPerPage
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
      getWalletInfo() {
        axios({
          method: 'get',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'me/balance'
        }).then((res) => {
          this.walletBalanceLoading = false
          this.walletBalance = res.data[0]['balance_pretty']
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      }
    }
  }
</script>
