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
                <v-btn @click.native="prevStep()" dark default class="btn--dark-flat-focused">Back</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
                <v-btn @click.native="prevStep()" dark default class="btn--dark-flat-focused">Back</v-btn>
                <v-card class="elevation-0">
                    <v-card-text>
                        <v-container fluid>
                            <v-layout row wrap>
                                <v-switch v-bind:label="`Switch 1: ${ex11.toString()}`" v-model="ex11" dark></v-switch>
                                <v-flex xs12 sm4 md2>
                                    <v-radio label="Secondary" v-model="test" value="radio-1" secondary dark hide-details></v-radio>
                                </v-flex>
                                <v-flex xs12 sm4 md2>
                                    <v-radio label="Success" v-model="test" value="radio-2" success dark hide-details></v-radio>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
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
                step: 3,
                test: 'radio-1',
                ex11: true
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
