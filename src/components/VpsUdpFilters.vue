<template>
  <v-container>
    <div class="display-3 grey--text text--darken-1">VPS #{{ id }}</div>
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
        addRuleProtocol: null
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
    methods: {
      refreshRules() {
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
