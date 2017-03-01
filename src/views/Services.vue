<template>
    <div>
        <v-container>
            <v-row>
                <v-col xs12>
                    <v-alert info>{{$t('panel_preview')}}</v-alert>
                </v-col>
            </v-row>

            <div class="mt-4"></div>
            <div class="text-xs-center">
                <v-pagination v-bind:length="totalPages" v-bind:disabled="loading" v-model="page"></v-pagination>
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
                                    <th>{{$t('table.status')}}</th>
                                    <th class="hidden-sm-and-down">{{$t('table.ip')}}</th>
                                    <th>{{$t('table.payed_to')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-for="(item, index) in services.items">
                                    <tr>
                                        <td>
                                            <v-checkbox v-bind:id="'checkbox' + index" filled
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
                                        <td v-on:click="goToVps(item.id)">{{item.name}}</td>
                                        <td v-on:click="goToVps(item.id)" style="white-space: nowrap;">
                                            <span v-if="item.active === 1">
                                                <i class="fa fa-circle green--text"></i> {{$t('vps.active')}}
                                            </span>
                                            <span v-else>
                                                <i class="fa fa-circle red--text"></i> {{$t('vps.locked')}}
                                            </span>
                                        </td>
                                        <td v-on:click="goToVps(item.id)" class="hidden-sm-and-down">{{item.ip}}</td>
                                        <td v-on:click="goToVps(item.id)">
                                            {{item.payed_to | prettyDateFormat}}
                                            <span class="hidden-sm-and-down"> - {{item.payed_to | prettyDateFrom}}</span>
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </v-table-overflow>
                    </v-card>
                </v-col>
            </v-row>

        </v-container>
    </div>
</template>
<style>
</style>
<script>
    import moment from 'moment'
    export default {
        mounted () {
            moment.locale(this.$lang)
            this.$store.commit('setBackLink', false)
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
                        this.totalPages = this.$store.state.services.paging.total_pages
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
            },
            language(val, old) {
                moment.locale(val)
            }
        },
        filters: {
            prettyDateFormat (unixtimestamp) {
                return moment.unix(unixtimestamp).format("DD.MM.YYYY")
            },
            prettyDateFrom (unixtimestamp) {
                return moment.unix(unixtimestamp).from()
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
