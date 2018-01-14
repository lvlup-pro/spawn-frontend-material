<template>
  <v-container>
    <div class="display-2 grey--text text--darken-1">VPS #{{ id }}</div>
    <br>
    <div class="display-1 grey--text text--darken-1">{{ $t('attacks') }}</div>
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
              <th class="text-xs-right">
                {{ $t('startedAt') }}
              </th>
              <th class="text-xs-right">
                {{ $t('endedAt') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td>#{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.started_at | prettyDateTime }}</td>
            <td class="text-xs-right" v-if="props.item.ended_at">{{ props.item.ended_at | prettyDateTime }}</td>
            <td class="text-xs-right" v-else>-</td>
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
          attacks: 'DDoS attacks list',
          startedAt: 'Started at',
          endedAt: 'Ended at',
          rowsPerPage: 'Rows per page',
          from: 'From',
          to: 'to'
        },
        pl: {
          attacks: 'Lista ataków DDoS',
          startedAt: 'Rozpoczęcie',
          endedAt: 'Zakończenie',
          rowsPerPage: 'Wyników na stronę',
          from: 'Od',
          to: 'do'
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
        pagination: {}
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      ip() {
        return this.$route.params.ip
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
      this.$store.dispatch('whenMounted')
    },
    methods: {
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const {sortBy, descending, page, rowsPerPage} = this.pagination
          axios({
            method: 'get',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            url: this.$config.apiUrl + 'vps/' + this.id + '/ip/' + this.ip + '/ddos?page=' + page + '&limit=' + rowsPerPage
          }).then((res) => {
            this.loading = false
            console.log(res)
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
      }
    }
  }
</script>
