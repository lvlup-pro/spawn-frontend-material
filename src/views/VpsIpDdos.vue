<template>
    <div>
        <v-container>
            <div class="mt-4"></div>
            <div class="text-xs-center">
                <v-pagination :length.number="pagination.paging.total_pages"
                              :disabled="loading"
                              v-model="page"
                ></v-pagination>
            </div>
            <div class="mt-4"></div>
            <v-card>
                <v-table-overflow>
                    <table>
                        <thead>
                            <tr>
                                <th>{{$t('table.id')}}</th>
                                <th>{{$t('table.start')}}</th>
                                <th>{{$t('table.end')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr v-if="!pagination.error" v-for="(item, index) in pagination.items">
                            <td>
                                #{{item.id}}
                            </td>
                            <td>
                                {{item.started_at | prettyDateFormat}}
                                <span class="hidden-sm-and-down">- {{item.started_at | prettyDateFrom}}</span>
                            </td>
                            <td>
                                <span v-if="item.ended_at === null">
                                    -
                                </span>
                                <span v-else>
                                    {{item.ended_at | prettyDateFormat}}
                                </span>
                                <span class="hidden-sm-and-down">- {{item.ended_at | prettyDateFrom}}</span>
                            </td>
                        </tr>
                        <tr v-if="pagination.error">
                            <td colspan="100%" class="red--text text--darken-3 empty">
                                {{ $t('table.empty.ddos') }}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </v-table-overflow>
            </v-card>
        </v-container>
    </div>
</template>
<style scoped>
    tr {
        cursor: default
    }
</style>
<script>
    export default {
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.ddos')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth.no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('paginationList', {
                        'url': 'vps/' + this.$route.params.id + '/ip/' + this.$route.params.ip + '/ddos',
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
                        'url': 'vps/' + this.$route.params.id + '/ip/' + this.$route.params.ip + '/ddos',
                        'page': val,
                        'limit': 10
                    }).then(() => {
                        this.$store.commit('setLoaded')
                    })
                } else {
                    this.page = old; //FIXME find another way of blocking update when loading
                }
            }
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'DDoS attacks',
                    description: 'Example ddos description',
                    keywords: 'ddos, attacks, list'
                }
            }
        }
    }
</script>
