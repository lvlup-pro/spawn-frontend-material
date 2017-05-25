<template>
    <div>
        <v-stepper v-model="step">

            <v-stepper-header>
                <v-stepper-step step="1" :complete="step > 1">Type of order</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="2" :complete="step > 2">Service</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="3" :complete="step > 3">Package</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="4" :complete="step > 4">Duration</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step step="5">Payment</v-stepper-step>

            </v-stepper-header>

            <v-stepper-content step="1">
                <v-layout wrap class="mt-5 mb-4">
                    <v-flex xs12 lg4 @click="nextStep()" class="next-step mb-4">
                        <v-card style="min-height: 189px"
                                class="blue white--text"
                                v-tooltip:top="{ html: 'I just want to buy something' }">
                            <v-card-text>
                                <div class="mt-5 mb-5">
                                    <div class="pa-3 text-xs-center">
                                        I don't have promo code or voucher
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 lg4>
                        <v-card
                            class="green darken-1 white--text mb-4"
                            v-tooltip:top="{ html: 'Receive discount' }">
                            <v-card-text>
                                <div class="pa-4 text-xs-center">
                                    I have promo code
                                    <v-text-field
                                        light
                                        single-line
                                        label="Code"
                                    ></v-text-field>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 lg4>
                        <v-card
                            class="grey darken-1 white--text"
                            v-tooltip:top="{ html: 'Free service to redeem' }">
                            <v-card-text>
                                <div class="pa-4 text-xs-center">
                                    I have voucher
                                    <v-text-field
                                        light
                                        single-line
                                        label="Code"
                                    ></v-text-field>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-stepper-content>

            <v-stepper-content step="2">
                <v-btn @click.native="prevStep()" dark default class="btn--dark-flat-focused">Back</v-btn>
                <v-layout wrap class="mt-5 mb-4">
                    <v-flex xs12 lg4 @click="nextStep()" class="next-step mb-4">
                        <v-card style="min-height: 189px"
                                class="light-blue white--text"
                                v-tooltip:top="{ html: 'Great speed and stability for power users' }">
                            <v-card-text>
                                <div class="mt-5 mb-5">
                                    <div class="pa-3 text-xs-center">
                                        VPS KVM Game Pro
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 lg4 @click="nextStep()" class="next-step mb-4">
                        <v-card style="min-height: 189px"
                                class="cyan white--text"
                                v-tooltip:top="{ html: 'VPS with low price good for beginners' }">
                            <v-card-text>
                                <div class="mt-5 mb-5">
                                    <div class="pa-3 text-xs-center">
                                        VPS OpenVZ
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 lg4 @click="nextStep()" class="next-step mb-4">
                        <v-card style="min-height: 189px"
                                class="blue white--text"
                                v-tooltip:top="{ html: 'Admin care for your VPS' }">
                            <v-card-text>
                                <div class="mt-5 mb-5">
                                    <div class="pa-3 text-xs-center">
                                        VPS management service
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 lg4>
                        <v-card
                            class="purple darken-2 white--text"
                            v-tooltip:top="{ html: 'Easiest choice to have your own WWW site' }">
                            <v-card-text>
                                <div class="pa-4 text-xs-center">
                                    WWW Hosting with DirectAdmin
                                    <v-text-field
                                        light
                                        single-line
                                        label="Username"
                                    ></v-text-field>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 lg4>
                        <v-card
                            class="deep-purple darken-1 white--text"
                            v-tooltip:top="{ html: 'Easy to remember address for you and your users' }">
                            <v-card-text>
                                <div class="pa-4 text-xs-center">
                                    Domain
                                    <v-text-field
                                        light
                                        single-line
                                        label=".tld"
                                    ></v-text-field>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-stepper-content>

            <v-stepper-content step="3">
                <v-btn @click.native="prevStep()" dark default class="btn--light-flat-focused">Back</v-btn>
                <v-btn @click.native="nextStep()" light primary class="btn--light-flat-focused">Next</v-btn>

                <v-container fluid>
                    <v-layout row wrap>
                        <v-flex xs12 md6 class="text-xs-center">
                            <v-card class="elevation-0">
                                <v-card-text>
                                    <v-radio label="4GB RAM" v-model="test" value="radio-1" primary dark
                                             hide-details></v-radio>
                                    <v-radio label="6GB RAM" v-model="test" value="radio-2" primary dark
                                             hide-details></v-radio>
                                    <v-radio label="8GB RAM" v-model="test" value="radio-3" primary dark
                                             hide-details></v-radio>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-card class="grey lighten-4 elevation-0">
                                <v-card-text>
                                    <v-container fluid>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Service</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>VPS</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Package</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>4GB RAM</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Virtualization</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>OpenVZ</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>RAM</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>4 GB</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Virtual RAM</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>512 MB</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Virtual CPU</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>2</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Type of disk</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>SSD</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Size of disk</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>10 GB</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Max network speed</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>200 Mbps</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Monthly bandwidth</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>∞</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Datacenter</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>OVH</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg4>
                                                <v-subheader>Estimated delivery time</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg4>
                                                <v-subheader><strong>1 minute</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-stepper-content>

            <v-stepper-content step="4">
                <v-btn @click.native="prevStep()" dark default class="btn--dark-flat-focused">Back</v-btn>
                <v-btn @click.native="nextStep()" light primary class="btn--light-flat-focused">Next</v-btn>
                <v-card class="elevation-0">
                    <v-card-text>
                        <v-radio label="7 days" v-model="test" value="radio-1" primary dark hide-details></v-radio>
                        <v-radio label="14 days" v-model="test" value="radio-2" primary dark hide-details></v-radio>
                        <v-radio label="1 month" v-model="test" value="radio-3" primary dark hide-details></v-radio>
                        <v-radio label="2 months" v-model="test" value="radio-4" primary dark hide-details></v-radio>
                        <v-radio label="3 months" v-model="test" value="radio-5" primary dark hide-details></v-radio>
                    </v-card-text>
                </v-card>
            </v-stepper-content>

            <v-stepper-content step="5">

                <v-btn @click.native="prevStep()" dark default class="btn--light-flat-focused">Back</v-btn>

                <v-container fluid>
                    <v-layout row>
                        <v-flex xs12 md6 class="text-xs-center">
                            <h4 class="pa-5">
                                To be paid
                            </h4>
                            <h3 class="green--text">
                                50,00 PLN
                            </h3>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-card class="grey lighten-4 elevation-0">
                                <v-card-text>
                                    <v-container fluid>
                                        <v-layout row>
                                            <v-flex xs4 lg3>
                                                <v-subheader>Service</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg3>
                                                <v-subheader><strong>VPS OpenVZ</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg3>
                                                <v-subheader>Package</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg3>
                                                <v-subheader><strong>4GB RAM</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg3>
                                                <v-subheader>Duration</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg3>
                                                <v-subheader><strong>7 days</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row>
                                            <v-flex xs4 lg3>
                                                <v-subheader>Estimated delivery time</v-subheader>
                                            </v-flex>
                                            <v-flex xs8 lg3>
                                                <v-subheader><strong>1 minute</strong></v-subheader>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>

                <section class="mt-4">
                    <section-header>
                        Legal stuff
                    </section-header>
                    <blockquote class="mb-5">
                        This is just a <a href="#">demo</a>, no service will be provided
                    </blockquote>
                </section>


                <v-checkbox label="I agree to the terms above" v-model="agree" dark primary></v-checkbox>

                <v-btn v-if="agree" block success light>
                    Buy now
                    <v-icon right light>shopping_cart</v-icon>
                </v-btn>
                <v-btn v-else block default light>
                    Buy now
                    <v-icon right light>shopping_cart</v-icon>
                </v-btn>

            </v-stepper-content>

        </v-stepper>
    </div>
</template>
<style>
    .next-step {
        cursor: pointer;
    }
</style>
<script>
    export default {
        data () {
            return {
                step: 5,
                test: 'radio-1',
                agree: false
            }
        },
        mounted () {
            this.$emit('redirectLang', 'credits')
            this.$vuetify.load()
            this.$store.commit('setToolbarTitle', 'header.credits')
            this.$emit('view', this.meta())
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        computed: {
            version() {
                return this.$store.state.version
            }
        },
        methods: {
            nextStep() {
                this.step++
            },
            prevStep() {
                this.step--
            },
            meta() {
                return {
                    title: 'Order',
                    description: 'Example order description',
                    keywords: 'order'
                }
            }
        }
    }
</script>
