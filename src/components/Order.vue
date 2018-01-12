<template>
  <v-container>
    <div class="display-2 grey--text text--darken-1">{{ $t('head') }}</div>
    <br>

    <v-layout row wrap>
      <v-flex xs12 lg9>
        <!-- <div class="display-1 grey--text text--darken-1">{{ $t('privateData') }}</div> -->
        <!--<br>-->

        <v-stepper v-model="step" vertical>
          <v-stepper-step step="1" v-bind:complete="step > 1">
            {{ $t('stepOneTitle') }}
            <small v-if="step === 1">{{ $t('stepOneHelper') }}</small>
          </v-stepper-step>
          <v-stepper-content step="1">

            <v-container
              fluid
              style="min-height: 0;"
              grid-list-lg
            >

              <v-layout row wrap>
                <v-flex xs12>
                  <v-card color="grey darken-2" class="white--text clickable" @click.native="chooseService('domain')">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs7>
                          <div>
                            <div class="headline">Domain</div>
                            <div>
                              Everything starts from the domain
                              <br>
                              It's like your office address but in the Internet
                            </div>
                            <div><a href="#">Read more...</a></div>
                            <br>
                            <br>
                            <div>First year of a .pl domain just 29 PLN</div>
                          </div>
                        </v-flex>
                        <v-flex xs5>
                          <v-card-media
                            src="http://via.placeholder.com/130x125"
                            height="125px"
                            contain
                          ></v-card-media>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>

                <v-flex xs12>
                  <v-card color="cyan darken-2" class="white--text clickable" @click.native="chooseService('www')">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs7>
                          <div>
                            <div class="headline">WWW hosting</div>
                            <div>Place to put your website to the public. Be visible on the Internet!</div>
                            <div><a href="#">Read more...</a></div>
                            <br>
                            <br>
                            <div>From just 2 PLN / mo for a "Basic" plan</div>
                          </div>
                        </v-flex>
                        <v-flex xs5>
                          <v-card-media
                            src="http://via.placeholder.com/130x125"
                            height="125px"
                            contain
                          ></v-card-media>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>

                <v-flex xs12>
                  <v-card color="purple" class="white--text clickable" @click.native="chooseService('vps-ovz')">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs7>
                          <div>
                            <div class="headline">VPS OpenVZ</div>
                            <div>Good for beginners to start with Linux</div>
                            <div><a href="#">Read more...</a></div>
                            <br>
                            <br>
                            <div>From 21,95 PLN / mo for 4GB RAM and 2vCPU</div>
                          </div>
                        </v-flex>
                        <v-flex xs5>
                          <v-card-media
                            src="http://via.placeholder.com/130x125"
                            height="125px"
                            contain
                          ></v-card-media>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>

                <v-flex xs12>
                  <v-card color="green" class="white--text clickable" @click.native="chooseService('vps-kvm')">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs7>
                          <div>
                            <div class="headline">VPS KVM</div>
                            <div>VPS but with more power and stability</div>
                            <div><a href="#">Read more...</a></div>
                            <br>
                            <br>
                            <div>From 29,90 PLN / mo for 2GB RAM and 1vCPU</div>
                          </div>
                        </v-flex>
                        <v-flex xs5>
                          <v-card-media
                            src="http://via.placeholder.com/130x125"
                            height="125px"
                            contain
                          ></v-card-media>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>

              </v-layout>

            </v-container>

            <!--<v-btn color="primary" @click.native="step = 2">{{ $t('next') }}</v-btn>-->
            <!--<v-btn flat>Cancel</v-btn>-->
          </v-stepper-content>
          <v-stepper-step step="2" v-bind:complete="step > 2">
            {{ $t('stepTwoTitle') }}
          </v-stepper-step>
          <v-stepper-content step="2">

            <div v-if="service === 'domain'">
              Domain name
              <v-text-field

              ></v-text-field>
            </div>

            <div v-if="service === 'vps-ovz' || service === 'vps-kvm'">
              <v-layout row wrap>
                <v-flex xs12 lg6>
                  Location
                  <v-checkbox
                    input-value="true"
                    value
                    disabled
                    label=""
                  >
                    <template slot="label">
                      Fastest installation in France
                      <span class="flag-icon  flag-icon-fr"></span>
                    </template>
                  </v-checkbox>

                  <br>
                  Plan: {{ plans[plan-1].name }}
                  <br>
                  <v-card-text>
                    <v-slider
                      v-model="plan"
                      min="1"
                      :max="plans.length"
                      ticks
                      hint="Slide to select plan"
                      :persistent-hint="true">
                    </v-slider>
                  </v-card-text>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-card color="teal white--text" height="200px" class="pa-3">
                    <h3 class="text-xs-center">Plan info</h3>
                    <ul style="list-style-type: none">
                      <li v-for="value, name in plans[plan-1].extra">
                        {{ name }}: {{ value }}
                      </li>
                    </ul>
                  </v-card>
                </v-flex>
              </v-layout>
            </div>

            <!-- location selector -->
            <!--
            <v-select
              label="Select"
              v-bind:items="locations"
              v-model="e11"
              item-text="name"
              item-value="name"
              max-height="auto"
              autocomplete
            >
              <template slot="selection" slot-scope="data">
                <v-chip
                  @input="data.parent.selectItem(data.item)"
                  :selected="data.selected"
                  class="chip--select-multi"
                  :key="JSON.stringify(data.item)"
                >
                  <v-avatar>
                    <img :src="data.item.avatar">
                  </v-avatar>
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template slot="item" slot-scope="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                </template>
                <template v-else>
                  <v-list-tile-avatar>
                    <img v-bind:src="data.item.avatar"/>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-select>
            <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
            -->
            <!-- location end, consider map preview here with this plugin https://github.com/KoRiGaN/Vue2Leaflet -->


            <v-btn color="primary" @click.native="step = 3">{{ $t('next') }}</v-btn>
            <v-btn flat @click.native="step = 1">{{ $t('back') }}</v-btn>
          </v-stepper-content>

          <v-stepper-step step="3" v-bind:complete="step > 3">{{ $t('stepThreeTitle') }}</v-stepper-step>
          <v-stepper-content step="3">


            <div class="display-1 grey--text text--darken-1">
              {{ $t('tos') }}
            </div>

            <div id="" style="overflow-y:scroll; overflow-x:hidden; height:300px;">
              {{ loremIpsum }}
            </div>

            <br>

            <v-checkbox
              :label="$t('acceptTerms')"
              v-model="tosAccept"
              light
              color="success"
            ></v-checkbox>

            <v-btn color="primary" @click.native="step = 4" :disabled="!tosAccept">{{ $t('next') }}</v-btn>
            <v-btn flat @click.native="step = 2">{{ $t('back') }}</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">{{ $t('stepFourTitle') }}</v-stepper-step>
          <v-stepper-content step="4">

            <div class="display-1 grey--text text--darken-1">
              To pay: xx,xx PLN
            </div>

            Choose payment channel
            <br>
            <br>

            <v-btn color="primary" @click.native="step = 1">{{ $t('next') }}</v-btn>
            <v-btn flat @click.native="step = 3">{{ $t('back') }}</v-btn>
          </v-stepper-content>
        </v-stepper>

      </v-flex>

    </v-layout>

  </v-container>
</template>

<script>
  import axios from 'axios'
  import flags from 'flag-icon-css/css/flag-icon.css'

  export default {
    i18n: {
      messages: {
        en: {
          next: 'Next',
          back: 'Back',
          head: 'Order new service',
          stepOneTitle: 'Choose service',
          stepOneHelper: 'Click card to select',
          stepTwoTitle: 'Set service details',
          stepThreeTitle: 'Accept ToS',
          stepFourTitle: 'Review and make payment',
          tos: 'Terms of Service',
          acceptTerms: 'I accept terms of service'
        },
        pl: {
          next: 'Przejdź dalej',
          back: 'Wróć',
          head: 'Zamów nową usługę',
          stepOneTitle: 'Wybierz usługę',
          stepOneHelper: 'Kliknij na interesującą Cię usługę',
          stepTwoTitle: 'Podaj szczegóły',
          stepThreeTitle: 'Zapoznaj się z regulaminem',
          stepFourTitle: 'Sprawdź i dokonaj płatności',
          tos: 'Regulamin usługi',
          acceptTerms: 'Akceptuję regulamin usługi'
        }
      }
    },
    data() {
      return {
        service: 'vps-ovz',
        step: 2,
        plan: 1,
        tosAccept: false,
        plans: [
          {
            id: 77,
            name: '4GB RAM',
            extra: {
              'ram': '4096',
              'disk': '10240'
            }
          },
          {
            id: 66,
            name: '6GB RAM',
            extra: {
              'ram': '6144',
              'disk': '20480'
            }
          },
          {
            id: 55,
            name: '8GB RAM',
            extra: {
              'ram': '8192',
              'disk': '40960'
            }
          }
        ],
        e11: [],
        locations: [
          {header: 'France'},
          {name: 'Roubaix', group: 'Group 1', avatar: 'http://via.placeholder.com/128x128'},
          {name: 'Gravelines', group: 'Group 1', avatar: 'http://via.placeholder.com/128x128'},
          {name: 'Strasbourg', group: 'Group 1', avatar: 'http://via.placeholder.com/128x128'},
          {divider: true},
          {header: 'Poland'},
          {name: 'Warsaw', group: 'Group 2', avatar: 'http://via.placeholder.com/128x128'},
        ],
        loremIpsum: ''
      }
    },
    mounted() {
      this.$store.dispatch('whenMounted')
      this.getLoremIpsum()
      //this.getProfileInfo()
    },
    methods: {
      chooseService(service) {
        this.service = service
        this.step = 2
      },
      getLoremIpsum() {
        axios({
          method: 'get',
          url: 'https://baconipsum.com/api/?type=all-meat&paras=22&start-with-lorem=1'
        }).then((res) => {
          this.loremIpsum = res.data.toString()
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
