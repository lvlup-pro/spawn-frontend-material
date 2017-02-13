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
                                    <th>{{$t('select')}}</th>
                                    <th>{{$t('service')}}</th>
                                    <th>ID</th>
                                    <th>{{$t('name')}}</th>
                                    <th>{{$t('payed_to')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-for="(item, index) in services.items">
                                    <tr>
                                        <td>
                                            <v-checkbox v-bind:id="'checkbox' + index" filled
                                                        class="text-xs-center"></v-checkbox>
                                        </td>
                                        <td v-on:click="goToVps(item.id)">VPS</td>
                                        <td v-on:click="goToVps(item.id)">{{item.id}}</td>
                                        <td v-on:click="goToVps(item.id)">{{item.name}}</td>
                                        <td v-on:click="goToVps(item.id)">{{item.payed_to | prettyDate}}</td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </v-table-overflow>
                    </v-card>
                </v-col>
            </v-row>

            <div class="mt-4"></div>
            <div class="text-xs-center">
                <v-pagination v-bind:length="totalPages" v-bind:disabled="loading" v-model="page"></v-pagination>
            </div>

        </v-container>
    </div>
</template>
<style>
    .pagination {
        justify-content: center;
    }
</style>
<script>
    import moment from 'moment'
    export default {
        mounted () {
            this.$emit('view', this.meta())
            moment.locale(this.$lang);
            this.$store.commit('setNavbarTitle', this.$t('header_services'))
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth_no'), "right")
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
            services () {
                return this.$store.state.services
            },
            loading () {
                return this.$store.state.loading
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
        filters: {
            prettyDate (unixtimestamp) {
                var timestamp = moment.unix(unixtimestamp);
                //DD.MM.YYYY or "L"
                return timestamp.format("L") + " - " + timestamp.to()
            }
        },
        preFetch () {
            return this.methods.meta()
        },
        methods: {
            meta() {
                return {
                    title: 'Pagination Component | Vuetify.js',
                    h1: 'Pagination',
                    description: 'Pagination component for Vuetify Framework',
                    keywords: 'vuetify, pagination, components'
                }
            },
            goToVps(id) {
                this.$router.push('/' + this.$route.params.lg + '/service/vps/' + id)
            }
        },
        locales: {
            en: {
                payed_to: 'Valid for',
                name: "Name",
                service: "Service",
                select: "Select",
                panel_preview: "This preview version of customer panel shows only VPS servers"
            },
            pl: {
                payed_to: 'Koniec ważności usługi',
                name: "Nazwa",
                service: "Usługa",
                select: "Zaznaczenie",
                panel_preview: "Obecnie ta poglądowa wersja panelu wyświetla tylko serwery VPS"
            }
        }
    }
</script>
