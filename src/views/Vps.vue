<template>
    <div>
        <v-container id="vps-stats" v-if="!loading">
            <v-row>
                <v-col md6 xs12="xs12">
                    <h3>CPU</h3><h4>{{vps.cpu}}%</h4>
                    <v-progress-linear v-model="vps.cpu"></v-progress-linear>
                </v-col>
                <v-col md6 xs12="xs12">
                    <h3>RAM</h3><h4>{{ram}}%</h4>
                    <!-- 0 - 70% green -->
                    <v-progress-linear v-if="ram <= 70" v-model="ram" success></v-progress-linear>
                    <!-- 71 - 90% yellow-->
                    <v-progress-linear v-if="ram > 70 && ram <= 90" v-model="ram" warning></v-progress-linear>
                    <!-- 91 - 100% red-->
                    <v-progress-linear v-if="ram > 90" v-model="ram" error></v-progress-linear>
                </v-col>
        </v-container>
    </div>
</template>
<style>
    #vps-stats .progress-linear {
        position: relative
    }
</style>
<script>
    import moment from 'moment'
    export default {
        data () {
            return {
                interval: null
            }
        },
        mounted () {
            this.$emit('view', this.meta())
            moment.locale(this.$lang)
            this.$store.commit('setNavbarTitle', "VPS")
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth_no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('vpsInfo', {
                        'id': this.$route.params.id
                    }).then(() => {
                        this.interval = setInterval(this.stats, 3500)
                        this.$store.commit('setLoaded')
                        this.$store.commit('setNavbarTitle', "VPS #" + this.$route.params.id)//FIXME set by API not user input
                    })
                }
            })
        },
        destroyed () {
            clearInterval(this.interval)
        },
        computed: {
            loading () {
                return this.$store.state.loading
            },
            vps () {
                return this.$store.state.vps
            },
            ram () {
                return Math.round((this.$store.state.vps.mem / this.$store.state.vps.maxmem) * 100)
            }
        },
        watch: {},
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
            },
            stats() {
                this.$store.dispatch('vpsInfo', {
                    'id': this.$route.params.id
                })
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

