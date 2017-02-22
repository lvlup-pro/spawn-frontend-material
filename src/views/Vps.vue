<template>
    <div>
        <v-container id="vps-stats" v-if="!loading">
            <v-row>
                <v-col xs12 lg4>
                    <h4>{{$t('state')}}</h4>
                    <v-chip v-if="vps.status == 'running'" label class="green white--text">On</v-chip>
                    <v-chip v-if="vps.status == 'stopped'" label class="red white--text">Off</v-chip>
                    <div class="mb-4"></div>
                </v-col>
            </v-row>
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
            moment.locale(this.$lang)
            this.$emit('view', this.meta())
            this.$store.commit('setToolbarTitle', 'header_vps_init')
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
                        //FIXME set by API not user input
                        this.$store.commit('setToolbarTitle', 'header_vps')
                        this.$store.commit('setToolbarTitleArgs', {'id': this.$route.params.id})
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
                return Math.round((this.$store.state.vps.mem_mb / this.$store.state.vps.max_mem_mb) * 100)
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
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'VPS',
                    description: 'Example VPS description',
                    keywords: 'vuetify, vps'
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
                state: "State"
            },
            pl: {
                state: "Stan"
            }
        }
    }
</script>
