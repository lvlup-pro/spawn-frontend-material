<template>
    <div>
        <v-container>

            <div class="mt-4"></div>
            <div class="text-xs-center">
                <v-pagination v-bind:length.number="pagination.paging.total_pages"
                              v-bind:disabled="loading"
                              v-model="page"
                ></v-pagination>
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
                                    <th>{{$t('id')}}</th>
                                    <th>{{$t('amount')}}</th>
                                    <th>{{$t('created_at')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-for="(item, index) in pagination.items">
                                    <tr>
                                        <td>
                                            <v-checkbox v-bind:id="'checkbox' + index" filled
                                                        class="text-xs-center"></v-checkbox>
                                        </td>
                                        <td>
                                            #{{item.id}}
                                        </td>
                                        <td>{{item.amount}}</td>
                                        <td>{{item.created_at | prettyDateFrom}}</td>
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
            this.$emit('view', this.meta())
            moment.locale(this.$lang);
            this.$store.commit('setToolbarTitle', 'header_payments')
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth_no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('paginationList', {
                        'url': 'payment',
                        'page': 1,
                        'limit': 10
                    }).then(() => {
                        this.$store.commit('setLoaded')
                    })
                }
            })
        },
        computed: {
            pagination () {
                return this.$store.state.pagination
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
                page: 1
            }
        },
        watch: {
            page (val, old) {
                if (!this.loading) {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('paginationList', {
                        'url': 'payment',
                        'page': val,
                        'limit': 10
                    }).then(() => {
                        this.$store.commit('setLoaded')
                    })
                } else {
                    this.page = old; //FIXME find another way of blocking update when loading
                }
            },
            language(val, old) {
                moment.locale(val)
            }
        },
        filters: {
            prettyDateFrom (unixtimestamp) {
                var timestamp = moment.unix(unixtimestamp);
                //DD.MM.YYYY or "L"
                return timestamp.format("L") + " - " + timestamp.from()
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
            goToTicket(id) {
                this.$router.push('/' + this.$route.params.lg + '/ticket/' + id)
            }
        },
        locales: {
            en: {
                amount: "Amount",
                created_at: "Created",
                id: "ID"
            },
            pl: {
                amount: "Kwota",
                created_at: "Utworzono",
                id: "ID"
            }
        }
    }
</script>
