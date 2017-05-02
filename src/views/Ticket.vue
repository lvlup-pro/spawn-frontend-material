<template>
    <div>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="duplicate">{{ $t('ticket.msg_duplicate') }}
        </v-snackbar>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="tooShort">{{ $t('ticket.msg_too_short') }}
        </v-snackbar>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="tooLong">{{ $t('ticket.msg_too_long') }}
        </v-snackbar>
        <v-container v-if="!loading">
            <v-row>
                <v-col xl2></v-col>
                <v-col xs12 xl8>
                    <ticket-messages
                        :ticket="ticket"
                        :messages="ticketMessages"
                        :textLock="messageLock"
                        @newMessage="addTicketMessage"
                    >
                    </ticket-messages>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
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
                tooLong: false,
                messageLock: false
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
                let messages = this.$store.state.ticketMessages.messages
                if (messages.length > 0) {
                    let lastMsg = messages[messages.length - 1].message
                    if (msg === lastMsg) {
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

                //message is ok, lock form
                this.messageLock = true

                this.$store.dispatch('ticketAddMessage', {
                    'id': this.$route.params.id,
                    'msg': msg
                }).then(() => {
                    this.$store.commit('setLoaded')
                    //prevent refresh
                    this.$store.dispatch('ticketInfo', {
                        'id': this.$route.params.id
                    }).then(() => {
                        //after ticket loaded, load messages in this ticket...
                        this.loadMessages()
                        //...and unlock text area
                        this.messageLock = false
                    })
                })
            }
        }
    }
</script>
