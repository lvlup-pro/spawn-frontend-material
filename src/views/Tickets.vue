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
                <v-data-table
                        v-bind:headers="headers"
                        v-model="pagination.items"
                        v-bind:no-data-text="$t('table.empty.tickets')"
                        hide-actions
                        class="elevation-1"
                >
                    <template slot="items" scope="props">
                        <td @click="goToTicket(props.item.id)">#{{props.item.id}}</td>
                        <td @click="goToTicket(props.item.id)" style="white-space: nowrap;">
                            <!--
                            <span v-if="!props.item.closed_at && !props.item.staff_response_needed"
                                v-tooltip:bottom="{ html: $t('props.item.status.waiting.long') }">
                                <i class="fa fa-circle blue--text"></i> {{$t('props.item.status.waiting.short')}}
                            </span>
                            <span v-if="!props.item.closed_at && props.item.staff_response_needed"
                                v-tooltip:bottom="{ html: $t('props.item.status.working.long') }">
                                <i class="fa fa-circle yellow--text"></i> {{$t('props.item.status.working.short')}}
                            </span>
                            <span v-if="props.item.closed_at"
                                v-tooltip:bottom="{ html: $t('props.item.status.closed.long') }">
                                <i class="fa fa-circle red--text"></i> {{$t('props.item.status.closed.short')}}
                            !-->
                            <span v-if="!props.item.closed">
                                <i class="fa fa-circle green--text"></i> {{$t('ticket.status.open.short')}}
                            </span>
                            <span v-if="props.item.closed">
                                <i class="fa fa-circle red--text"></i> {{$t('ticket.status.closed.short')}}
                            </span>
                        </td>
                        <td @click="goToTicket(props.item.id)">{{props.item.subject}}</td>
                        <td @click="goToTicket(props.item.id)">
                            {{props.item.created_at | prettyDateFormat}}
                            <span class="hidden-sm-and-down"> - {{props.item.created_at | prettyDateFrom}}</span>
                        </td>
                    </template>
                </v-data-table>
            </v-card>

        </v-container>
    </div>
</template>
<style scope="props">
    tr {
        cursor: pointer;
    }

    span.chip.red[data-tooltip][data-tooltip-location='bottom']:before {
        left: 75%;
    }
</style>
<script>
    import moment from 'moment'
    export default {
        mounted () {
            moment.locale(this.$lang)
            this.$store.commit('setToolbarTitle', 'header.tickets')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$store.commit('setNoAuth')
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('paginationList', {
                        'url': 'help/ticket',
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
                        left: true,
                        text: this.$t('table.id'),
                        value: this.$t('table.id')
                    },
                    {
                        left: true,
                        text: this.$t('table.status'),
                        value: this.$t('table.status')
                    },
                    {
                        left: true,
                        text: this.$t('table.subject'),
                        value: this.$t('table.subject')
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
                        'url': 'help/ticket',
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
                    title: 'Tickets',
                    description: 'Example tickets description',
                    keywords: 'vuetify, tickets'
                }
            },
            goToTicket(id) {
                this.$router.push('/' + this.$route.params.lg + '/ticket/' + id)
            }
        }
    }
</script>
