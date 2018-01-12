<template>
  <v-container>

    <div class="display-3 grey--text text--darken-1">
      <span v-if="vps.name">{{ vps.name}} -</span>
      {{ $t('service') }} {{ $t('vps') }} #{{ id }}
    </div>
    <br>

    <v-layout row wrap>
      <v-flex xs12 lg6>
        <br class="hidden-lg-and-up">
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
    </v-layout>

    <br>

    <v-layout row wrap>

      <v-flex xs12 lg6>
        <br class="hidden-lg-and-up">
        <div class="display-1 grey--text text--darken-1">{{ $t('management') }}</div>
        <br>
        <v-layout row>
          <v-flex xs12 sm11>
            <v-card>

              <v-list>
                <v-list-tile avatar>
                  <v-btn color="green" dark large v-if="vps.status !== 'running'" @click="turnOnVps()">
                    <i class="fa fa-fw fa-play"></i>
                    {{ $t('turnOn')}}
                  </v-btn>
                  <v-btn color="red" dark large v-if="vps.status === 'running'" @click="turnOffVps()">
                    <i class="fa fa-fw fa-plug"></i>
                    {{ $t('turnOff')}}
                  </v-btn>

                  <span v-if="vps.status === 'running'">
                    {{ $t('turnOffDesc')}}
                  </span>
                  <span v-else>
                    {{ $t('turnOnDesc')}}
                  </span>

                  <v-list-tile-content>
                    <v-list-tile-title>

                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar>

                  </v-list-tile-avatar>
                </v-list-tile>
              </v-list>

              <v-snackbar
                bottom
                :timeout="2000"
                v-model="vpsTurnedOnSnack"
              >
                {{ $t('vpsJustTurnedOn') }}
              </v-snackbar>

              <v-snackbar
                bottom
                :timeout="2000"
                v-model="vpsTurnedOffSnack"
              >
                {{ $t('vpsJustTurnedOff') }}
              </v-snackbar>

            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 lg6>
        <div class="display-1 grey--text text--darken-1">{{ $t('security') }}</div>
        <br>
        <v-layout row>
          <v-flex xs12 sm11>
            <v-card>
              <v-list>
                <div v-for="ip in ipAll" :key="ip">

                  <v-list-tile avatar @click="">
                    <v-list-tile-action>
                      <v-icon v-if="ip" color="yellow">star</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title v-text="ip">
                      </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-avatar class="hidden-xs-only">
                      <v-tooltip top>
                        <v-btn
                          slot="activator"
                          :disabled="!udpFilterAvailable"
                          @click="$router.push('/service/vps/'+id+'/ip/'+ip+'/filter')"
                        >
                          {{ $t('udpFiltering') }}
                        </v-btn>
                        <span>{{ $t('kvmOnly') }}</span>
                      </v-tooltip>
                      <v-btn @click="$router.push('/service/vps/'+id+'/ip/'+ip+'/attacks')">
                        {{ $t('ddosAttacks') }}
                      </v-btn>
                    </v-list-tile-avatar>
                  </v-list-tile>

                  <v-list-tile avatar @click="" class="hidden-sm-and-up">
                    <v-list-tile-avatar>
                      <v-tooltip top>
                        <v-btn
                          slot="activator"
                          :disabled="!udpFilterAvailable"
                          @click="$router.push('/service/vps/'+id+'/ip/'+ip+'/filter')"
                        >
                          {{ $t('udpFiltering') }}
                        </v-btn>
                        <span>{{ $t('kvmOnly') }}</span>
                      </v-tooltip>
                      <v-btn @click="$router.push('/service/vps/'+id+'/ip/'+ip+'/attacks')">
                        {{ $t('ddosAttacks') }}
                      </v-btn>
                    </v-list-tile-avatar>
                  </v-list-tile>
                </div>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 lg6 v-if="vps.status === 'running'">
        <br>
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
                          {{ memAmount }}
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
          turnOn: 'Turn on',
          turnOnDesc: 'Currently VPS is offline',
          vpsJustTurnedOn: 'VPS has been turned on',
          turnedOff: 'Turned off',
          turnOff: 'Turn off',
          turnOffDesc: 'Dangerous! Better turn off from SSH',
          vpsJustTurnedOff: 'VPS has been turned off',
          since: 'Since',
          performance: 'Performance',
          security: 'Security',
          management: 'Management',
          udpFiltering: 'UDP filter',
          kvmOnly: 'Available only for KVM offer',
          ddosAttacks: 'DDoS list',
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
          turnOn: 'Włącz',
          turnOnDesc: 'Obecnie VPS jest offline',
          vpsJustTurnedOn: 'VPS został włączony',
          turnedOff: 'Wyłączony',
          turnOff: 'Wyłącz',
          turnOffDesc: 'Wyłączenie VPS \'na twardo\' - niebezpieczne!',
          vpsJustTurnedOff: 'VPS został wyłączony',
          since: 'Od',
          performance: 'Wydajność',
          security: 'Bezpieczeństwo',
          management: 'Zarządzanie',
          udpFiltering: 'Filtr UDP',
          kvmOnly: 'Dostępne tylko dla KVM',
          ddosAttacks: 'Lista DDoS'
        }
      }
    },
    data() {
      return {
        refreshMs: 2000,
        vps: false,
        ipMain: false,
        ipAdditional: false,
        ipAll: [],
        netInB: 0,
        netInBPrev: 0,
        netInBSpeed: 0,
        netInBSpeedPercent: 0,
        netOutB: 0,
        netOutBPrev: 0,
        netOutBSpeed: 0,
        netOutBSpeedPercent: 0,
        vpsTurnedOnSnack: false,
        vpsTurnedOffSnack: false,
        intervalId: null
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      memAmount() {
        if (this.vps.mem_mb >= 2048) {
          return Math.abs(this.vps.mem_mb / 1024).toFixed(2) + ' GB'
        }
        return this.vps.mem_mb + ' MB'
      },
      udpFilterAvailable() {
        if (this.vps.virt === 'kvm') {
          return true
        }
      }
    },
    mounted() {
      this.$store.dispatch('whenMounted')
      this.getVpsInfo()
      this.getVpsIps()
      this.intervalId = setInterval(() => {
        this.getVpsInfo()
      }, this.refreshMs)
    },
    destroyed() {
      clearInterval(this.intervalId)
    },
    methods: {
      getVpsIps() {
        axios({
          method: 'get',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/ip'
        }).then((res) => {
          this.ipMain = res.data.main
          this.ipAdditional = res.data.additional
          this.ipAll.push(this.ipMain)
          this.ipAdditional.forEach((element) => {
            this.ipAll.push(element)
          });
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          } else {
            setTimeout(() => {
              this.getVpsIps()
            }, 3000)
          }
        })
      },
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
      },
      turnOnVps() {
        _paq.push(['trackEvent', 'vps', 'turnOn', 'vps' + this.id]);
        axios({
          method: 'post',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/on'
        }).then((res) => {
          this.vpsTurnedOnSnack = true
          setTimeout(() => {
            this.getVpsInfo()
          }, 200)
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          } else if (err.response.status === 429) {
            //TODO snackbar in App for this
            console.log("Rate limit reached")
          }
        })
      },
      turnOffVps() {
        _paq.push(['trackEvent', 'vps', 'turnOff', 'vps' + this.id]);
        axios({
          method: 'post',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'vps/' + this.id + '/off'
        }).then((res) => {
          this.vpsTurnedOffSnack = true
          setTimeout(() => {
            this.getVpsInfo()
          }, 200)
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          } else if (err.response.status === 429) {
            console.log("Rate limit reached")
          }
        })
      }
    }
  }
</script>
