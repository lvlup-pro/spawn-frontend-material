<template>
    <div>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="duplicate">{{ $t('ticket.msg_duplicate') }}</v-snackbar>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="tooShort">{{ $t('ticket.msg_too_short') }}</v-snackbar>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="tooLong">{{ $t('ticket.msg_too_long') }}</v-snackbar>
        <v-container v-if="!loading">
            <v-row>
                <v-col xl2></v-col>
                <v-col xs12 xl8>

                    <v-alert warning>
                        {{$t('ticket.response_time')}}
                    </v-alert>
                    <div class="mb-4"></div>
                    <h4>
                        <v-chip v-if="!ticket.closed_at && !ticket.staff_response_needed" label
                            class="blue white--text" v-tooltip:bottom="{ html: $t('ticket.status.waiting.long') }">
                            {{$t('ticket.status.waiting.medium')}}
                        </v-chip>
                        <v-chip v-if="!ticket.closed_at && ticket.staff_response_needed" label
                            class="yellow" v-tooltip:bottom="{ html: $t('ticket.status.working.long') }">
                            {{$t('ticket.status.working.medium')}}
                        </v-chip>
                        <v-chip v-if="ticket.closed_at" label
                            class="red white--text" v-tooltip:bottom="{ html: $t('ticket.status.closed.long') }">
                            {{$t('ticket.status.closed.medium')}}
                        </v-chip>
                        {{$t('ticket.subject')}}: {{ticket.subject}}
                    </h4>

                    <v-card class="grey lighten-4" id="ticket-topic">
                        <v-card-row actions class="blue">
                            <v-btn flat class="white--text">
                                <v-icon class="white--text">face</v-icon>
                                <div class="ml-2"></div>
                                {{$t('ticket.client')}}
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn flat class="white--text">
                                <v-icon class="white--text">event</v-icon>
                                <div class="mr-1"></div>
                                {{ticket.created_at | prettyDateTime}}
                            </v-btn>
                        </v-card-row>
                        <v-card-text>
                            <div v-html="ticket.message">
                            </div>
                        </v-card-text>
                    </v-card>

                    <div class="mt-4"></div>

                    <div v-for="tmsg in ticketMessages.messages" id="ticket-messages">
                        <v-card class="grey lighten-4">

                            <v-card-row actions class="green" v-if="tmsg.staff">
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">grade</v-icon>
                                    <div class="ml-2"></div>
                                    {{$t('ticket.staff')}}
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">event</v-icon>
                                    <div class="mr-1"></div>
                                    {{tmsg.created_at | prettyDateTime}}
                                </v-btn>
                            </v-card-row>

                            <v-card-row actions class="blue" v-if="!tmsg.staff">
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">face</v-icon>
                                    <div class="ml-2"></div>
                                    {{$t('ticket.client')}}
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn flat class="white--text">
                                    <v-icon class="white--text">event</v-icon>
                                    <div class="mr-1"></div>
                                    {{tmsg.created_at | prettyDateTime}}
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
                        <textarea :placeholder="$t('ticket.textarea')" v-model="msg"></textarea>
                        <p>
                            <span v-if="msg.length >= 0 && msg.length <= 1">{{msg.length}}/3000</span>
                            <span id="counter-ok"
                                  v-if="msg.length <= 3000 && msg.length >= 2">{{msg.length}}/3000</span>
                            <span id="counter-slow-down" v-if="msg.length > 3000">{{msg.length}}/3000</span>
                        </p>
                        <v-btn @click.native="addTicketMessage(msg)" success>{{$t('ticket.send')}}</v-btn>
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

    span.chip {
        font-size: 1rem;
    }
</style>
<script>
    export default {
        data () {
            return {
                msg: '',
                duplicate: false,
                tooShort: false,
                tooLong: false
            }
        },
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.ticket_init')
            this.$emit('view', this.meta())
            this.$store.commit('setTicketMessages', [])
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$store.commit('setNoAuth')
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
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Ticket',
                    description: 'Example ticket description',
                    keywords: 'vuetify, ticket'
                }
            },
            loadTicket() {
                this.$store.commit('setLoading')
                this.$store.dispatch('ticketInfo', this.$route.params).then(() => {
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
                    this.$store.commit('setToolbarTitle', 'header.ticket')
                    this.$store.commit('setToolbarTitleArgs', {'id': this.$route.params.id})
                    this.$emit('view', this.meta())
                })
            },
            addTicketMessage(msg) {
                //check if duplicate of previous message, precaution to prevent nervous users spamming to backend
                //or just some network problem just occurred
                //skip if no messages so far to prevent crash on message submit
                var messages = this.$store.state.ticketMessages.messages
                if (messages.length > 0) {
                    var lastMsg = messages[messages.length - 1].message
                    if (msg == lastMsg) {
                        this.duplicate = true
                        //show user that message was probably send earlier when some Internet connection errors occurred
                        this.loadMessages()
                        return false
                    }
                }

                //too short?
                if (msg.length < 2) {
                    this.tooShort = true
                    return false
                }

                //too long?
                if (msg.length > 3000) {
                    this.tooLong = true
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
        }
    }
</script>
