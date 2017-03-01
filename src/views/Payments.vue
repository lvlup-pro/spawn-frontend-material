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
                                    <th>{{$t('table.id')}}</th>
                                    <th>{{$t('table.amount')}}</th>
                                    <th>{{$t('table.created_at')}}</th>
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
                                        <td v-if="item.amount > 0" class="green--text">
                                            +{{item.amount}}
                                            <span class="hidden-sm-and-down">PLN</span>
                                        </td>
                                        <td v-if="item.amount == 0">
                                            {{item.amount}}
                                            <span class="hidden-sm-and-down">PLN</span>
                                        </td>
                                        <td v-if="item.amount < 0" class="red--text">
                                            {{item.amount}}
                                            <span class="hidden-sm-and-down">PLN</span>
                                        </td>
                                        <td>
                                            {{item.created_at | prettyDateFormat}}
                                            <span class="hidden-sm-and-down"> - {{item.created_at | prettyDateFrom}}</span>
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
<style scoped>
tr {cursor:default}
</style>
<script>
    import moment from 'moment'
    export default {
        mounted () {
            moment.locale(this.$lang)
            this.$store.commit('setBackLink', false)
            this.$store.commit('setToolbarTitle', 'header.payments')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth.no'), "right")
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
                    title: 'Payments',
                    description: 'Example payments description',
                    keywords: 'vuetify, payments'
                }
            },
            goToTicket(id) {
                this.$router.push('/' + this.$route.params.lg + '/ticket/' + id)
            }
        }
    }
</script>
