<template>
    <div>
        <v-container v-if="!loading">

            <v-alert info>
                {{$t('response_time')}}
            </v-alert>
            <br>
            <h4>{{$t('subject')}}: {{ticket.subject}}</h4>

            <v-card class="grey lighten-4">
                <v-card-row actions class="blue">
                    <v-icon class="white--text">face</v-icon>
                    <v-btn flat class="white--text">Client</v-btn>
                    <!--<v-spacer></v-spacer>-->
                    <v-icon class="white--text">event</v-icon>
                    <v-btn flat class="white--text">{{ticket.created_at | prettyDate}}</v-btn>
                </v-card-row>
                <v-card-text>
                    <div v-html="ticket.message">
                    </div>
                </v-card-text>
            </v-card>

            <br>

            <div v-for="tmsg in ticketMessages">
                <v-card class="grey lighten-4">

                    <v-card-row actions class="green" v-if="tmsg.staff">
                        <v-icon class="white--text">face</v-icon>
                        <v-btn flat class="white--text">Staff</v-btn>
                        <!--<v-spacer></v-spacer>-->
                        <v-icon class="white--text">event</v-icon>
                        <v-btn flat class="white--text">{{tmsg.created_at | prettyDate}}</v-btn>
                    </v-card-row>

                    <v-card-row actions class="blue" v-if="!tmsg.staff">
                        <v-icon class="white--text">face</v-icon>
                        <v-btn flat class="white--text">Client</v-btn>
                        <v-icon class="white--text">event</v-icon>
                        <v-btn flat class="white--text">{{tmsg.created_at | prettyDate}}</v-btn>
                    </v-card-row>

                    <v-card-text>
                        <div v-html="tmsg.message">
                        </div>
                    </v-card-text>
                </v-card>
                <br>
            </div>

            <br>

            <textarea placeholder="Write your message"></textarea>
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
</style>
<script>
    import moment from 'moment'
    export default {
        mounted () {
            this.$emit('view', this.meta())
            moment.locale(this.$lang);
            this.$store.commit('setNavbarTitle', this.$t('header_ticket'))
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth_no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('ticketInfo', {
                        'id': this.$route.params.id
                    }).then(() => {
                        //after ticket loaded, load messages in this ticket
                        this.$store.dispatch('ticketMessages', {
                            'id': this.$route.params.id
                        }).then(() => {
                            this.$store.commit('setLoaded')
                            this.$store.commit('setNavbarTitle', "Ticket #" + this.$route.params.id)//FIXME set by API not user input
                        })
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
            ticket () {
                return this.$store.state.ticket
            },
            ticketMessages () {
                return this.$store.state.ticketMessages
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
//            '$route' (to, from) {
//                // react to route changes...
//            }
        },
        filters: {
            prettyDate (unixtimestamp) {
                var timestamp = moment.unix(unixtimestamp);
                //DD.MM.YYYY or "L"
                return timestamp.format("H:mm L")
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
            }
        },
        locales: {
            en: {
                subject: "Subject",
                response_time: "Dear customer, reply to your messages may take up to 48h",
            },
            pl: {
                subject: "Temat",
                response_time: "Szanowny kliencie, odpowiedź może zająć do 48h, prosimy o cierpliwość",
            }
        }
    }
</script>
