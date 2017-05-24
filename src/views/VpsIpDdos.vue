<template>
    <div>
        <v-container fluid>
            <v-layout justify-center>
                <v-flex xs12>
                    <!-- pagination with margins for datatable -->
                    <div class="text-xs-center mb-4">
                        <v-pagination
                            v-if="page"
                            :length.number="pagination.paging.total_pages"
                            :disabled="loading"
                            v-model="page"
                        ></v-pagination>
                    </div>
                    <v-card class="mb-4">
                        <v-data-table
                            :headers="headers"
                            :items="pagination.items"
                            :no-data-text="$t('table.empty.ddos')"
                            hide-actions
                            class="elevation-1"
                        >
                            <template slot="items" scope="props">
                                <td>
                                    #{{props.item.id}}
                                </td>
                                <td>
                                    {{props.item.started_at | prettyDateTime}}
                                    <span>- {{props.item.started_at | prettyDateFrom}}</span>
                                </td>
                                <td>
                            <span v-if="props.item.ended_at === null">
                                -
                            </span>
                                    <span v-else>
                                {{props.item.ended_at | prettyDateTime}}
                            </span>
                                    <span>- {{props.item.ended_at | prettyDateFrom}}</span>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<style scope="props">
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
                    this.$store.commit('setNoAuth')
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
            },
            headers() {
                return [
                    {
                        sortable: true,
                        left: true,
                        text: this.$t('table.id'),
                        value: this.$t('table.id')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.start'),
                        value: this.$t('table.start')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.end'),
                        value: this.$t('table.end')
                    }
                ]
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
