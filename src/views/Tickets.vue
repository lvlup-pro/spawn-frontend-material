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
                                    <th><i class="fa fa-check"></i></th>
                                    <th>{{$t('id')}}</th>
                                    <th>{{$t('status')}}</th>
                                    <th>{{$t('subject')}}</th>
                                    <th>{{$t('created_at')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-for="(ticket, index) in pagination.items">
                                    <tr>
                                        <td>
                                            <v-checkbox v-bind:id="'checkbox' + index" filled class="text-xs-center"></v-checkbox>
                                        </td>
                                        <td v-on:click="goToTicket(ticket.id)">#{{ticket.id}}</td>
                                        <td v-on:click="goToTicket(ticket.id)">
                                            <span v-if="!ticket.closed_at && !ticket.staff_response_needed"
                                                v-tooltip:bottom="{ html: $t('waiting_for_client') }">
                                                {{$t('waiting_for_client_label')}}
                                            </span>
                                            <span v-if="!ticket.closed_at && ticket.staff_response_needed"
                                                v-tooltip:bottom="{ html: $t('staff_is_working') }">
                                                {{$t('staff_is_working_label')}}
                                            </span>
                                            <span v-if="ticket.closed_at"
                                                v-tooltip:bottom="{ html: $t('case_closed') }">
                                                {{$t('case_closed_label')}}
                                            </span>
                                        </td>
                                        <td v-on:click="goToTicket(ticket.id)">{{ticket.subject}}</td>
                                        <td v-on:click="goToTicket(ticket.id)">{{ticket.created_at | prettyDate}}</td>
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
    tr {
        cursor: pointer
    }
</style>
<script>
    import moment from 'moment'
    export default {
        mounted () {
            this.$emit('view', this.meta())
            moment.locale(this.$lang);
            this.$store.commit('setToolbarTitle', 'header_tickets')
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth_no'), "right")
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
            prettyDate (unixtimestamp) {
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
                id: "ID",
                status: "Status",
                subject: "Subject",
                created_at: "Created",
                waiting_for_client_label: "Waiting",
                waiting_for_client: "Awaiting your response",
                staff_is_working_label: "Processing",
                staff_is_working: "Staff is working on response",
                case_closed_label: "Closed",
                case_closed: "Staff is not working on this case anymore"
            },
            pl: {
                id: "ID",
                status: "Status",
                subject: "Temat",
                created_at: "Utworzono",
                waiting_for_client_label: "Oczekiwanie",
                waiting_for_client: "Czekamy na twoją odpowiedź",
                staff_is_working_label: "Przetwarzanie",
                staff_is_working: "Obsługa pracuje nad odpowiedzią",
                case_closed_label: "Zamknięte",
                case_closed: "Obsługa nie zajmuje się już tym zgłoszeniem",
            }
        }
    }
</script>
