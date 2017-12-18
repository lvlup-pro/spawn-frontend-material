<template>
  <v-container>
    <div class="display-3 grey--text text--darken-1">VPS #{{ id }}</div>
    <br>
    <div class="display-1 grey--text text--darken-1">{{ $t('status') }}</div>
    <br>
    <v-layout row wrap>
      <v-flex xs12 sm6>

        <v-card color="green" class="white--text"
                v-if="filtering.enabled && !filtering.enable_pending && !filtering.disable_pending">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs9 sm10>
                <div>
                  <div class="headline">
                    <span v-if="filtering.enabled">
                      {{ $t('filteringEnabled') }}
                    </span>
                  </div>
                  <div>
                    <v-btn
                      color="red"
                      dark
                      large
                      v-if="filtering.enabled && !filtering.enable_pending && !filtering.disable_pending"
                      @click="disableFilteringViaApi()"
                    >
                      <i class="fa fa-fw fa-stop"></i>
                      {{ $t('disableFilter')}}
                    </v-btn>
                  </div>
                </div>
              </v-flex>
              <v-flex xs3 sm2>
                <i class="fa fa-check fa-4x" aria-hidden="true"></i>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-card color="red" class="white--text"
                v-if="!filtering.enabled && !filtering.enable_pending && !filtering.disable_pending">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs9 sm10>
                <div>
                  <div class="headline">
                    {{ $t('filteringDisabled') }}
                  </div>
                  <div>
                    <v-btn
                      color="green"
                      dark large
                      v-if="!filtering.enabled && !filtering.enable_pending && !filtering.disable_pending"
                      @click="enableFilteringViaApi()"
                    >
                      <i class="fa fa-fw fa-play"></i>
                      {{ $t('enableFilter')}}
                    </v-btn>
                  </div>
                </div>
              </v-flex>
              <v-flex xs3 sm2>
                <i class="fa fa-times fa-4x" aria-hidden="true"></i>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-card color="blue" class="white--text" v-if="filtering.enable_pending || filtering.disable_pending">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs9 sm10>
                <div>
                  <div class="headline">

                    <span v-if="filtering.enable_pending">
                      {{ $t('filteringEnabling') }}
                    </span>

                    <span v-if="filtering.disable_pending">
                      {{ $t('filteringDisabling') }}
                    </span>

                  </div>
                </div>
              </v-flex>
              <v-flex xs3 sm2>
                <i class="fa fa-refresh fa-4x" aria-hidden="true"></i>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

      </v-flex>

    </v-layout>

    <br>
    <div class="display-1 grey--text text--darken-1">{{ $t('head') }}</div>
    <br>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-data-table
          v-model="selected"
          select-all
          item-key="id"
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
              <th>
                <v-checkbox
                  primary
                  hide-details
                  @click.native="toggleAll"
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                ></v-checkbox>
              </th>
              <th class="text-xs-left">
                ID
              </th>
              <th class="text-xs-left">
                {{ $t('protocol') }}
              </th>
              <th class="text-xs-right">
                {{ $t('portFrom') }}
              </th>
              <th class="text-xs-right">
                {{ $t('portTo') }}
              </th>
              <th class="text-xs-right">
                {{ $t('status') }}
              </th>
            </tr>
          </template>

          <template slot="items" slot-scope="props">
            <td>
              <v-checkbox
                primary
                hide-details
                v-model="props.selected"
              ></v-checkbox>
            </td>
            <td>#{{ props.item.id }}</td>
            <td>{{ props.item.protocol }}</td>
            <td class="text-xs-right">{{ props.item.port_range.from }}</td>
            <td class="text-xs-right">{{ props.item.port_range.to }}</td>

            <td class="text-xs-right" v-if="props.item.create_pending">
              <v-chip label color="orange" text-color="white">
                <i class="fa fa-fw fa-2x fa-refresh"></i> {{ $t('ruleCreating') }}
              </v-chip>
            </td>
            <td class="text-xs-right" v-if="props.item.delete_pending">
              <v-chip label color="red" text-color="white">
                <i class="fa fa-fw fa-2x fa-refresh"></i> {{ $t('ruleDeleting') }}
              </v-chip>
            </td>
            <!-- FIXME showing "removing" and "ok" simultaneously -->
            <td class="text-xs-right" v-if="!props.item.create_pending && !props.item.create_pending">
              <v-chip label color="green" text-color="white">
                <i class="fa fa-fw fa-2x fa-check"></i>
                {{ $t('ruleOk') }}
              </v-chip>
            </td>
          </template>

          <template slot="no-data">
            <v-alert :value="true" color="info" icon="info" v-if="!loading">
              Sorry, nothing to display here :(
            </v-alert>
          </template>

          <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            {{ $t('from') }} {{ pageStart }} {{ $t('to') }} {{ pageStop }}
          </template>

          <template slot="footer">
            <td colspan="100%">
              <v-btn color="red" dark @click="removeRules()">
                {{ $t('deleteRule') }}
              </v-btn>
              <v-btn color="green" dark @click="ruleAddDialog = true">
                {{ $t('createRule') }}
              </v-btn>
              <v-btn color="blue" dark @click="refreshRules()">
                {{ $t('refresh') }}
              </v-btn>
            </td>
          </template>

        </v-data-table>
      </div>
    </v-slide-y-transition>

    <v-dialog v-model="ruleAddDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('addNewRule') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="addRulePortFrom" :label="$t('portFrom')" type="number" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="addRulePortTo" :label="$t('portTo')" type="number" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="addRuleProtocol"
                  :label="$t('protocol')"
                  required
                  :items="protocols"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <!--<small>*indicates required field</small>-->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="ruleAddDialog = false">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="blue darken-1" flat @click.native="addRuleViaApi(); ruleAddDialog = false">
            {{ $t('createRule') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    i18n: {
      messages: {
        en: {
          head: 'UDP whitelist rules',
          protocol: 'Protocol',
          portFrom: 'Port from',
          portTo: 'Port to',
          status: 'Status',
          ruleOk: 'OK',
          ruleCreating: 'Adding...',
          ruleDeleting: 'Removing...',
          addNewRule: 'Add new rule',
          createRule: 'Add',
          deleteRule: 'Remove',
          enableFilter: 'Turn on filtering',
          filteringEnabled: 'Filtering enabled',
          filteringEnabling: 'Enabling filtering...',
          disableFilter: 'Turn off filtering',
          filteringDisabled: 'Filtering disabled',
          filteringDisabling: 'Disabling filtering...',
          rowsPerPage: 'Rows per page',
          from: 'From',
          to: 'to',
          cancel: 'Cancel',
          refresh: 'Refresh'
        },
        pl: {
          head: 'Reguły filtrowania UDP',
          protocol: 'Protokół',
          portFrom: 'Port od',
          portTo: 'Port do',
          status: 'Stan',
          ruleOk: 'OK',
          ruleCreating: 'Tworzenie...',
          ruleDeleting: 'Usuwanie...',
          addNewRule: 'Dodaj nową regułę',
          createRule: 'Dodaj',
          deleteRule: 'Usuń',
          enableFilter: 'Włącz filtrowanie',
          filteringEnabled: 'Filtrowanie jest włączone',
          filteringEnabling: 'Filtrowanie jest włączane...',
          disableFilter: 'Wyłącz filtrowanie',
          filteringDisabled: 'Filtrowanie jest wyłączone',
          filteringDisabling: 'Filtrowanie jest wyłączane...',
          rowsPerPage: 'Wyników na stronę',
          from: 'Od',
          to: 'do',
          cancel: 'Anuluj',
          refresh: 'Odśwież'
        }
      }
    },
    data() {
      return {
        perPage: [100],
        search: '',
        totalItems: 0,
        items: [],
        loading: true,
        pagination: {},
        selected: [],
        ruleAddDialog: false,
        protocols: [
          'arkSurvivalEvolved',
          'arma',
          'gtaMultiTheftAutoSanAndreas',
          'gtaSanAndreasMultiplayerMod',
          'hl2Source',
          'minecraftPocketEdition',
          'minecraftQuery',
          'mumble',
          'rust',
          'teamspeak2',
          'teamspeak3',
          'trackmaniaShootmania',
          'other'
        ],
        addRulePortFrom: null,
        addRulePortTo: null,
        addRuleProtocol: null,
        filtering: false,
        filterTurnedOnSnack: false,
        filterTurnedOffSnack: false
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
      this.checkFilteringStatusViaApi()
    },
    methods: {
      refreshRules() {
        this.checkFilteringStatusViaApi()
        this.getDataFromApi()
          .then(data => {
            this.items = data.items
            this.totalItems = data.total
          })
      },
      toggleAll() {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      removeRules() {
        //FIXME removing already removed :/
        this.selected.forEach((rule) => {
          this.removeRuleViaApi(rule.id)
          let ind = this.selected.indexOf(rule.id)
          if (ind > -1) {
            this.selected.splice(ind, 1);
          }
        })
      },
      checkFilteringStatusViaApi() {
        axios({
          method: 'get',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/ip/' + this.ip + '/game'
        }).then((res) => {
          this.filtering = res.data
          console.log(res.data)
        }).catch((err) => {
          console.log(err.response.status)
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      enableFilteringViaApi() {
        axios({
          method: 'put',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/ip/' + this.ip + '/game',
          data: {
            enabled: true
          }
        }).then((res) => {
          console.log(res.data)
          this.checkFilteringStatusViaApi()
        }).catch((err) => {
          console.log(err.response.status)
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      disableFilteringViaApi() {
        axios({
          method: 'put',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/ip/' + this.ip + '/game',
          data: {
            enabled: false
          }
        }).then((res) => {
          console.log(res.data)
          this.checkFilteringStatusViaApi()
        }).catch((err) => {
          console.log(err.response.status)
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      addRuleViaApi() {
        axios({
          method: 'post',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/ip/' + this.ip + '/game/rule/',
          data: {
            port_from: parseInt(this.addRulePortFrom),
            port_to: parseInt(this.addRulePortTo),
            protocol: this.addRuleProtocol
          },
        }).then((res) => {
          this.refreshRules()
        }).catch((err) => {
          console.log(err.response.status)
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      removeRuleViaApi(ruleId) {
        axios({
          method: 'delete',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/ip/' + this.ip + '/game/rule/' + ruleId
        }).then((res) => {
          this.refreshRules()
        }).catch((err) => {
          console.log(err.response.status)
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const {sortBy, descending, page, rowsPerPage} = this.pagination
          axios({
            method: 'get',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            url: this.$config.apiUrl + 'vps/' + this.id + '/ip/' + this.ip + '/game/rule'
          }).then((res) => {
            this.loading = false
            if (res.data.error !== true && res.data) {
              let items = res.data
              let total = res.data.length
              resolve({
                items,
                total
              })
            } else {
              resolve({
                function () {
                },
                function () {
                }
              })
            }
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
