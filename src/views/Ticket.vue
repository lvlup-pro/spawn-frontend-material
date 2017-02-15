<template>
    <div>
        <v-container v-if="!loading">
            <v-row>
                <v-col xl2></v-col>
                <v-col xs12 xl8>

                    <v-alert warning>
                        {{$t('response_time')}}
                    </v-alert>
                    <div class="mb-4"></div>
                    <h4>{{$t('subject')}}: {{ticket.subject}}</h4>

                    <h5 v-if="!ticket.closed_at && !ticket.staff_response_needed">
                        <v-chip class="blue white--text" label>
                            {{$t('waiting_for_client_label')}}
                        </v-chip>
                        {{$t('waiting_for_client')}}
                    </h5>

                    <h5 v-if="!ticket.closed_at && ticket.staff_response_needed">
                        <v-chip class="yellow" label>
                            {{$t('staff_is_working_label')}}
                        </v-chip>
                        {{$t('staff_is_working')}}
                    </h5>

                    <h5 v-if="ticket.closed_at">
                        <v-chip class="red white--text" label>
                            {{$t('case_closed_label')}}
                        </v-chip>
                        {{$t('case_closed')}}
                    </h5>

                    <v-card class="grey lighten-4" id="ticket-topic">
                        <v-card-row actions class="blue">
                            <v-btn flat class="white--text">
                                <v-icon class="white--text">face</v-icon>
                                <div class="ml-2"></div>
                                {{$t('client')}}
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn flat class="white--text">
                                <v-icon class="white--text">event</v-icon>
                                <div class="mr-1"></div>
                                {{ticket.created_at | prettyDate}}
                            </v-btn>
                        </v-card-row>
                        <v-card-text>
                            <div v-html="ticket.message">
                            </div>
                        </v-card-text>
                    </v-card>

                    <div class="mt-4"></div>

                    <div v-for="tmsg in ticketMessages" id="ticket-messages">
                        <v-card class="grey lighten-4">

                            <v-card-row actions class="green" v-if="tmsg.staff">
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">grade</v-icon>
                                    <div class="ml-2"></div>
                                    {{$t('staff')}}
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">event</v-icon>
                                    <div class="mr-1"></div>
                                    {{tmsg.created_at | prettyDate}}
                                </v-btn>
                            </v-card-row>

                            <v-card-row actions class="blue" v-if="!tmsg.staff">
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">face</v-icon>
                                    <div class="ml-2"></div>
                                    {{$t('client')}}
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">event</v-icon>
                                    <div class="mr-1"></div>
                                    {{tmsg.created_at | prettyDate}}
                                </v-btn>
                            </v-card-row>

                            <v-card-text>
                                <div v-html="tmsg.message">
                                </div>
                            </v-card-text>
                        </v-card>
                        <br>
                    </div>
                    <div v-if="!ticket.closed_at">
                        <textarea v-bind:placeholder="$t('textarea')" v-model="msg"></textarea>
                        <p>
                            <span v-if="msg.length >= 0 && msg.length <= 1">{{msg.length}}/3000</span>
                            <span id="counter-ok"
                                  v-if="msg.length <= 3000 && msg.length >= 2">{{msg.length}}/3000</span>
                            <span id="counter-slow-down" v-if="msg.length > 3000">{{msg.length}}/3000</span>
                        </p>
                        <v-btn v-on:click.native="addTicketMessage(msg)" class="btn-flat-focused">{{$t('send')}}</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
    #counter-ok {
        color: green;
    }

    #counter-slow-down {
        color: red;
    }

    textarea {
        width: 100%;
        border-bottom: 1px solid #ddd;
        outline: none;
        height: 5rem;
    }

    #ticket-messages button,
    #ticket-topic button {
        pointer-events: none;
    }
</style>
<script>
    import moment from 'moment'
    export default {
        data () {
            return {
                msg: ''
            }
        },
        mounted () {
            this.$emit('view', this.meta())
            moment.locale(this.$lang);
            this.$store.commit('setToolbarTitle', 'header_ticket_init')
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth_no'), "right")
                    this.$router.push('/login')
                } else {
                    this.loadTicket()
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
            ticket () {
                return this.$store.state.ticket
            },
            ticketMessages () {
                return this.$store.state.ticketMessages
            }
        },
        filters: {
            prettyDate (unixtimestamp) {
                var timestamp = moment.unix(unixtimestamp);
                return timestamp.format("HH:mm DD.MM.YYYY")
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
            loadTicket() {
                this.$store.commit('setLoading')
                this.$store.dispatch('ticketInfo', {
                    'id': this.$route.params.id
                }).then(() => {
                    //after ticket loaded, load messages in this ticket
                    this.$store.commit('setLoaded')
                    this.loadMessages()
                })
            },
            loadMessages() {
                this.$store.dispatch('ticketMessages', {
                    'id': this.$route.params.id
                }).then(() => {
                    //FIXME set by API not user input
                    this.$store.commit('setToolbarTitle', 'header_ticket')
                    this.$store.commit('setToolbarTitleArgs', {'id': this.$route.params.id})
                })
            },
            addTicketMessage(msg) {
                //check if duplicate of previous message, precaution to prevent nervous users spamming to backend
                //or just some network problem just occurred
                var messages = this.$store.state.ticketMessages
                var len = messages.length
                var lastMsg = messages[len - 1].message
                if (msg == lastMsg) {
                    this.$vuetify.toast.create(this.$t("msg_duplicate"), "right")
                    //show user that message was probably send earlier when some Internet connection errors occurred
                    this.loadMessages()
                    return false
                }

                //too short?
                if (msg.length < 2) {
                    this.$vuetify.toast.create(this.$t("msg_too_short"), "right")
                    return false
                }

                //too long?
                if (msg.length > 3000) {
                    this.$vuetify.toast.create(this.$t("msg_too_long"), "right")
                    return false
                }

                this.$store.dispatch('ticketAddMessage', {
                    'id': this.$route.params.id,
                    'msg': msg
                }).then(() => {
                    this.$store.commit('setLoaded')
                    //prevent refresh
                    this.$store.dispatch('ticketInfo', {
                        'id': this.$route.params.id
                    }).then(() => {
                        //after ticket loaded, load messages in this ticket
                        this.loadMessages()
                    })
                    this.msg = ""
                })
            }
        },
        locales: {
            en: {
                waiting_for_client_label: "Waiting for client",
                waiting_for_client: "Awaiting your response",
                staff_is_working_label: "Staff is working",
                staff_is_working: "Staff is working on response",
                case_closed_label: "Case closed",
                case_closed: "Staff is not working on this case anymore",
                subject: "Subject",
                response_time: "Dear customer, reply to your messages may take up to 48h",
                client: "You",
                staff: "lvlup.pro Staff",
                textarea: "Write your message to staff",
                send: "Send",
                msg_too_long: "Message is too long",
                msg_too_short: "Message is too short",
                msg_duplicate: "Message already sent (duplicate)"
            },
            pl: {
                waiting_for_client_label: "Oczekiwanie na klienta",
                waiting_for_client: "Czekamy na twoją odpowiedź",
                staff_is_working_label: "Praca obsługi",
                staff_is_working: "Obsługa pracuje nad odpowiedzią",
                case_closed_label: "Sprawa zamknięta",
                case_closed: "Obsługa nie zajmuje się już tym zgłoszeniem",
                subject: "Temat",
                response_time: "Szanowny kliencie, odpowiedź może zająć do 48h, prosimy o cierpliwość",
                client: "Ty",
                staff: "Obsługa lvlup.pro",
                textarea: "Napisz swoją wiadomość do obsługi",
                send: "Wyślij",
                msg_too_long: "Wiadomość jest za długa",
                msg_too_short: "Wiadomość jest za krótka",
                msg_duplicate: "Wiadomość już wysłana (duplikat)"
            }
        }
    }
</script>
