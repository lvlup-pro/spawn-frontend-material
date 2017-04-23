<template>
    <div>
        <v-container>

            <!-- pagination with margins for datatable -->
            <div class="text-xs-center mt-4 mb-4">
                <v-pagination
                        v-if="page"
                        :length.number="pagination.paging.total_pages"
                        :disabled="loading"
                        v-model="page"
                ></v-pagination>
            </div>

            <v-card class="mb-4">
                <!--
                 <tr v-if="pagination.error">
                            <td colspan="100%" class="red--text text--darken-3 empty">
                                {{  }}
                            </td>
                </tr>
                v-bind:search="search"
                v-bind:items="pagination.items"
                :rows-per-page="limit"
                FIXME empty payments string
                -->
                <v-data-table
                        v-bind:headers="headers"
                        v-model="pagination.items"
                        v-bind:no-data-text="$t('table.empty.payments')"
                        hide-actions
                        class="elevation-1"
                >
                    <template slot="items" scope="props">
                        <!--<td class="text-xs-right">{{ props.item.id}}</td>-->
                        <td>
                            #{{props.item.id}}
                        </td>
                        <td v-if="props.item.amount > 0" class="green--text">
                            +{{props.item.amount}}
                            <span class="hidden-sm-and-down">PLN</span>
                        </td>
                        <td v-if="props.item.amount == 0">
                            {{props.item.amount}}
                            <span class="hidden-sm-and-down">PLN</span>
                        </td>
                        <td v-if="props.item.amount < 0" class="red--text">
                            {{props.item.amount}}
                            <span class="hidden-sm-and-down">PLN</span>
                        </td>
                        <td>
                            {{ props.item.description}}
                        </td>
                        <td>
                            {{props.item.created_at | prettyDateFormat}}
                            <span class="hidden-sm-and-down"> - {{props.item.created_at | prettyDateFrom}}</span>
                        </td>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>
<style scoped>
</style>
<script>
    export default {
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.payments')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$store.commit('setNoAuth')
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
            },
            headers() {
                return [
                    {
                        //sortable: false,
                        left: true,
                        text: this.$t('table.id'),
                        value: this.$t('table.id')
                    },
                    {
                        left: true,
                        text: this.$t('table.amount'),
                        value: this.$t('table.amount')
                    },
                    {
                        left: true,
                        text: this.$t('table.description'),
                        value: this.$t('table.description')
                    },
                    {
                        left: true,
                        text: this.$t('table.created_at'),
                        value: this.$t('table.created_at')
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
                        'url': 'payment',
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
                    title: 'Payments',
                    description: 'Example payments description',
                    keywords: 'vuetify, payments'
                }
            }
        }
    }
</script>
