<template>
  <v-container>
    <div class="display-2 grey--text text--darken-1">{{ $t('help') }}</div>
    <br>
    <div class="display-1 grey--text text--darken-1">{{ $t('tickets') }}</div>
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
                {{ $t('subject') }}
              </th>
              <th class="text-xs-right">
                {{ $t('state') }}
              </th>
              <th class="text-xs-right">
                {{ $t('createdAt') }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td @click="goToTicket(props.item.id)" class="clickable">#{{ props.item.id }}</td>
            <td @click="goToTicket(props.item.id)" class="clickable">{{ props.item.subject }}</td>
            <td @click="goToTicket(props.item.id)" class="text-xs-right clickable">
               <span v-if="props.item.closed === null">
               <i class="fa fa-circle green--text"></i>
                 {{$t('open')}}
               </span>
              <span v-else>
              <i class="fa fa-circle red--text"></i>
                {{$t('closed')}}
              </span>
            </td>
            <td @click="goToTicket(props.item.id)" class="text-xs-right">{{ props.item.created_at | prettyDateTime }}</td>
          </template>
          <template slot="no-data">
            <v-alert :value="true" color="info" icon="info" v-if="!loading">
              {{ $t('noTickets') }}
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
          help: 'Help',
          tickets: 'Tickets',
          state: 'State',
          open: 'Open',
          closed: 'Closed',
          subject: 'Subject',
          createdAt: 'Created',
          rowsPerPage: 'Rows per page',
          from: 'From',
          to: 'to',
          noTickets: 'No tickets created (yet)'
        },
        pl: {
          help: 'Pomoc',
          tickets: 'Zgłoszenia',
          state: 'Stan',
          open: 'Otwarte',
          closed: 'Zamknięte',
          subject: 'Temat',
          createdAt: 'Utworzono',
          rowsPerPage: 'Wyników na stronę',
          from: 'Od',
          to: 'do',
          noTickets: 'Nie utworzono żadnych zgłoszeń (jeszcze)'
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
    filters: {
      vpsType(id) {
        if (id === 2) {
          return 'KVM'
        }
        return 'OpenVZ'
      }
    },
    mounted() {
      this.$store.dispatch('whenMounted')
    },
    methods: {
      goToTicket(id) {
        this.$router.push('/ticket/' + id)
      },
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const {sortBy, descending, page, rowsPerPage} = this.pagination
          axios({
            method: 'get',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            url: this.$config.apiUrl + 'help/ticket?page=' + page + '&limit=' + rowsPerPage
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
      }
    }
  }
</script>
<style scoped>
  .clickable {
    cursor: pointer;
  }
</style>
