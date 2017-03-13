<template>
    <div>
        <v-container>
            <v-row>
                <v-col xs12>
                    <v-alert info>{{$t('panel_preview')}}</v-alert>
                </v-col>
            </v-row>

            <div>

                <div class="mt-4"></div>
                <div class="text-xs-center">
                    <v-pagination :length="totalPages" :disabled="loading" v-model="page"></v-pagination>
                </div>
                <div class="mt-4"></div>

                <v-row>
                    <v-col xs12>
                        <v-card>
                            <v-table-overflow>
                                <table>
                                    <thead>
                                    <tr>
                                        <th class="select"><i class="fa fa-check"></i></th>
                                        <th>{{$t('table.service')}}</th>
                                        <th>{{$t('table.id')}}</th>
                                        <th>{{$t('table.name')}}</th>
                                        <th class="hidden-sm-and-down">{{$t('table.ip')}}</th>
                                        <th>{{$t('table.status')}}</th>
                                        <th>{{$t('table.payed_to')}}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="!services.error" v-for="(item, index) in services.items">
                                            <td>
                                                <v-checkbox :id="'checkbox' + index" filled
                                                            class="text-xs-center"></v-checkbox>
                                            </td>
                                            <td v-on:click="goToVps(item.id)">
                                                VPS
                                                <span class="hidden-sm-and-down">
                                                <span v-if="item.virt === 0">OpenVZ</span>
                                                <span v-else-if="item.virt === 2">KVM</span>
                                            </span>
                                            </td>
                                            <td v-on:click="goToVps(item.id)">#{{item.id}}</td>
                                            <td v-on:click="goToVps(item.id)">
                                            <span v-if="item.name === null" class="grey--text">
                                                {{ $t('vps.notset') }}
                                            </span>
                                                <span v-else>
                                                {{ item.name }}
                                            </span>
                                            </td>
                                            <td v-on:click="goToVps(item.id)" class="hidden-sm-and-down">{{item.ip}}
                                            </td>
                                            <td v-on:click="goToVps(item.id)" style="white-space: nowrap;">
                                            <span v-if="item.active === 1">
                                                <i class="fa fa-circle green--text"></i> {{$t('vps.active')}}
                                            </span>
                                                <span v-else>
                                                <i class="fa fa-circle red--text"></i> {{$t('vps.locked')}}
                                            </span>
                                            </td>
                                            <td v-on:click="goToVps(item.id)">
                                                {{item.payed_to | prettyDateFormat}}
                                                <span class="hidden-sm-and-down"> - {{item.payed_to | prettyDateFrom}}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="services.error" >
                                            <td colspan="100%" class="red--text text--darken-3 empty">
                                                {{ $t('table.empty.services') }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </v-table-overflow>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>
<style>
</style>
<script>
    export default {
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.services')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth.no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('servicesList', {
                        'page': 1,
                        'limit': 10
                    }).then(() => {
                        if (this.$store.state.services.error !== true) {
                            this.totalPages = this.$store.state.services.paging.total_pages
                        }
                        this.$store.commit('setLoaded')
                    })
                }
            })
        },
        computed: {
            currentTimestamp () {
                return Math.floor(Date.now() / 1000)
            },
            services () {
                return this.$store.state.services
            },
            loading () {
                return this.$store.state.loading
            },
            language() {
                return this.$store.state.language
            }
        },
        data () {
            return {
                page: 1,
                totalPages: 1
            }
        },
        watch: {
            page (val, old) {
                if (!this.loading) {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('servicesList', {
                        'page': val,
                        'limit': 10
                    }).then(() => {
                        this.$store.commit('setLoaded')
                    })
                } else {
                    //this.page = old; //FIXME find another way of blocking update when loading
                }
            }
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Services',
                    description: 'Example services description',
                    keywords: 'vuetify, services'
                }
            },
            goToVps(id) {
                this.$router.push('/' + this.$route.params.lg + '/service/vps/' + id)
            }
        }
    }
</script>
