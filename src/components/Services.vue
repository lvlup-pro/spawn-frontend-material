<template>
  <v-container>
    <div class="display-3 grey--text text--darken-1">{{ $t('services') }}</div>
    <br>
    <div class="display-1 grey--text text--darken-1">VPS</div>
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
                {{ $t('type') }}
              </th>
              <th class="text-xs-left">
                {{ $t('name') }}
              </th>
              <th class="text-xs-left">
                IP
              </th>
              <th class="text-xs-right">
                {{ $t('state') }}
              </th>
              <th class="text-xs-right">
                {{ $t('validTo') }}
              </th>
              <!--<th>-->
              <!--<v-checkbox-->
              <!--primary-->
              <!--hide-details-->
              <!--@click.native="toggleAll"-->
              <!--:input-value="props.all"-->
              <!--:indeterminate="props.indeterminate"-->
              <!--&gt;</v-checkbox>-->
              <!--</th>-->
              <!--<th v-for="header in props.headers" :key="header.text"-->
              <!--:class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"-->
              <!--@click="changeSort(header.value)"-->
              <!--&gt;-->
              <!--<v-icon>arrow_upward</v-icon>-->
              <!--{{ header.text }}-->
              <!--</th>-->
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td>#{{ props.item.id }}</td>
            <td>{{ props.item.virt | vpsType }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.ip }}</td>
            <td class="text-xs-right">
               <span v-if="props.item.active === 1">
               <i class="fa fa-circle green--text"></i>
                 {{$t('active')}}
               </span>
              <span v-else>
              <i class="fa fa-circle red--text"></i>
                {{$t('locked')}}
              </span>
            </td>
            <td class="text-xs-right">{{ props.item.payed_to | prettyDateTime }}</td>
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
          services: 'Services',
          state: 'State',
          active: 'Active',
          locked: 'Locked',
          type: 'Type',
          name: 'Name',
          validTo: 'Valid to',
          rowsPerPage: 'Rows per page',
          from: 'From',
          to: 'to'
        },
        pl: {
          services: 'Usługi',
          state: 'Stan',
          active: 'Aktywny',
          locked: 'Nieaktywny',
          type: 'Typ',
          name: 'Nazwa',
          validTo: 'Ważny do',
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
        pagination: {},
        headers: [
          {
            text: 'ID',
            align: 'left',
            sortable: false,
            value: 'id'
          },
          {
            text: this.$t('type'),
            align: 'left',
            value: 'virt'
          },
          {
            text: 'Name',
            align: 'left',
            value: 'name'
          },
          {
            text: 'IP',
            align: 'left',
            value: 'ip'
          },
          {
            align: 'right',
            text: 'Active',
            value: 'active'
          },
          {
            text: 'Payed to',
            value: 'payed_to'
          }
        ]
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
      if (!this.$store.state.loggedIn) {
        this.$router.push('/auth/login')
      }
      // this.getDataFromApi()
      //   .then(data => {
      //     this.items = data.items
      //     this.totalItems = data.total
      //   })
    },
    filters: {
      vpsType(id) {
        if (id === 2) {
          return 'KVM'
        }
        return 'OpenVZ'
      }
    },
    methods: {
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const {sortBy, descending, page, rowsPerPage} = this.pagination
          axios({
            method: 'get',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            url: this.$config.apiUrl + 'vps?page=' + page + '&limit=' + rowsPerPage
          }).then((res) => {
            //console.log(res.data.items)
            this.loading = false
            let items = res.data.items
            let total = res.data.paging.total_items
            resolve({
              items,
              total
            })
          }).catch((err) => {
            this.loading = false
          })

        })
      },
      zgetDataFromApi() {
        this.getList()
        this.loading = true
        return new Promise((resolve, reject) => {
          const {sortBy, descending, page, rowsPerPage} = this.pagination

          let items = this.getDesserts()
          const total = items.length

          if (this.pagination.sortBy) {
            items = items.sort((a, b) => {
              const sortA = a[sortBy]
              const sortB = b[sortBy]

              if (descending) {
                if (sortA < sortB) return 1
                if (sortA > sortB) return -1
                return 0
              } else {
                if (sortA < sortB) return -1
                if (sortA > sortB) return 1
                return 0
              }
            })
          }

          if (rowsPerPage > 0) {
            items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
          }

          setTimeout(() => {
            this.loading = false
            resolve({
              items,
              total
            })
          }, 1000)
        })
      }
    }
  }
</script>
