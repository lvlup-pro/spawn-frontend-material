<template>
  <v-container>
    <div class="display-3 grey--text text--darken-1">
      <span v-if="vps.name">{{ vps.name}} -</span>
      {{ $t('service') }} {{ $t('vps') }} #{{ id }}
    </div>
    <br>

    <v-layout row wrap>
      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('payments') }}</div>
        <br>
        <v-layout row>
          <v-flex xs12 sm11>

            <v-card color="green" class="white--text" v-if="vps.active">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs9 sm10>
                    <div>
                      <div class="headline">
                        {{ $t('active') }}
                      </div>
                      <div>{{ $t('payedTo') }} {{ vps.payed_to | prettyDateTime }}</div>
                    </div>
                  </v-flex>
                  <v-flex xs3 sm2>
                    <i class="fa fa-check fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

            <v-card color="red darken-3" class="white--text" v-else>
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs9 sm10>
                    <div>
                      <div class="headline">
                        {{ $t('notActive') }}
                      </div>
                      <div>{{ $t('payedTo') }} {{ vps.payed_to | prettyDateTime }}</div>
                    </div>
                  </v-flex>
                  <v-flex xs3 sm2>
                    <i class="fa fa-times fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('state') }}</div>
        <br>
        <v-layout row>
          <v-flex xs12 sm11>

            <v-card color="green" class="white--text" v-if="vps.status === 'running'">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs9 sm10>
                    <div>
                      <div class="headline">
                        {{ $t('turnedOn') }}
                      </div>
                      <div>
                        {{ $t('since')}} {{ vps.uptime_s | secondsToStartDate }} ({{ vps.uptime_s | secondsToDays }}d)
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs3 sm2>
                    <i class="fa fa-play fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

            <v-card color="red darken-3" class="white--text" v-else>
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs9 sm10>
                    <div>
                      <div class="headline">
                        {{ $t('turnedOff') }}
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs3 sm2>
                    <i class="fa fa-stop-circle-o fa-4x" aria-hidden="true"></i>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>

    <br>

    <v-layout row wrap v-if="vps.status === 'running'">
      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('performance') }}</div>
        <br>
        <v-layout row>
          <v-flex xs12 sm11>

            <v-card>
              <v-container>
                <v-layout row>
                  <v-flex xs12>
                    <v-layout row wrap>

                      <v-flex xs6 md3>
                        <v-progress-circular
                          v-bind:size="120"
                          v-bind:width="15"
                          v-bind:rotate="-90"
                          v-bind:value="vps.cpu"
                          color="primary"
                        >
                          {{ vps.cpu }}% CPU
                        </v-progress-circular>
                        <div class="text-xs-center">
                          CPU
                        </div>
                      </v-flex>

                      <v-flex xs6 md3>
                        <v-progress-circular
                          v-bind:size="120"
                          v-bind:width="15"
                          v-bind:rotate="-90"
                          v-bind:value="vps.cpu"
                          color="primary"
                        >
                          {{ memPercent }}%
                        </v-progress-circular>
                        <div class="text-xs-center">
                          RAM
                        </div>
                      </v-flex>

                      <v-flex xs6 md3>
                        <v-progress-circular
                          v-bind:size="120"
                          v-bind:width="15"
                          v-bind:rotate="-90"
                          v-bind:value="netInBSpeedPercent"
                          color="green"
                        >
                          <span v-if="netOutBSpeed >= 1024">
                           {{ Math.round((netInBSpeed / 1024)) }}MB/s
                          </span>
                          <span v-else>
                            {{ netInBSpeed }}kB/s
                          </span>
                        </v-progress-circular>
                        <div class="text-xs-center">
                          Download
                        </div>
                      </v-flex>

                      <v-flex xs6 md3>
                        <v-progress-circular
                          v-bind:size="120"
                          v-bind:width="15"
                          v-bind:rotate="-90"
                          v-bind:value="netOutBSpeedPercent"
                          color="red"
                        >
                          <span v-if="netOutBSpeed >= 1024">
                           {{ Math.round((netOutBSpeed / 1024)) }}MB/s
                          </span>
                          <span v-else>
                            {{ netOutBSpeed }}kB/s
                          </span>
                        </v-progress-circular>
                        <div class="text-xs-center">
                          Upload
                        </div>
                      </v-flex>

                    </v-layout>

                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('state') }}</div>
        <br>
        <v-layout row>
          <v-flex xs12 sm11>

            <v-card>
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs10>
                    <v-layout row wrap>

                    </v-layout>
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
          service: 'Service',
          vps: 'VPS',
          payments: 'Payments',
          active: 'Active',
          notActive: 'Not active',
          payedTo: 'Payed to',
          state: 'State',
          turnedOn: 'Turned on',
          turnedOff: 'Turned off',
          since: 'Since',
          performance: 'Performance'
        },
        pl: {
          service: 'Usługa',
          vps: 'VPS',
          payments: 'Płatności',
          active: 'Aktywny',
          notActive: 'Nieaktywny',
          payedTo: 'Opłacony do',
          state: 'Stan',
          turnedOn: 'Włączony',
          turnedOff: 'Wyłączony',
          since: 'Od',
          performance: 'Wydajność'
        }
      }
    },
    data() {
      return {
        refreshMs: 2000,
        vps: false,
        netInB: 0,
        netInBPrev: 0,
        netInBSpeed: 0,
        netInBSpeedPercent: 0,
        netOutB: 0,
        netOutBPrev: 0,
        netOutBSpeed: 0,
        netOutBSpeedPercent: 0,
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      memPercent() {
        return Math.floor((this.vps.mem_mb / this.vps.max_mem_mb) * 100)
      }
    },
    mounted() {
      this.getVpsInfo()
      setInterval(() => {
        this.getVpsInfo()
      }, this.refreshMs)
    },
    methods: {
      getVpsInfo() {
        axios({
          method: 'get',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id
        }).then((res) => {
          //console.log(res.data)
          this.vps = res.data

          // set current data as previously checked
          this.netInBPrev = this.netInB
          this.netOutBPrev = this.netOutB

          // set fresh data as current
          this.netInB = res.data.net_in_b
          this.netOutB = res.data.net_out_b

          // calculate throughput
          //this.netInBSpeed = this.netInBPrev - this.netInB
          //this.netOutBSpeed = this.netOutBPrev - this.netOutB

          // calculate throughput
          this.netInBSpeed = Math.round((this.netInB - this.netInBPrev) / 1024)
          this.netOutBSpeed = Math.round((this.netOutB - this.netOutBPrev) / 1024)

          // consider refresh speed
          let secondsBetween = Math.floor(this.refreshMs / 1000)
          this.netInBSpeed = Math.round(this.netInBSpeed / secondsBetween)
          this.netOutBSpeed = Math.round(this.netOutBSpeed / secondsBetween)

          // 200Mbit = 25MB/s max
          this.netInBSpeedPercent = Math.round(this.netInBSpeed / (25 * 1024))
          this.netOutBSpeedPercent = Math.round(this.netInBSpeed / (25 * 1024))

        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      }
    }
  }
</script>
