<template>
    <div>
        <v-container id="vps-stats" v-if="!loading">
            <v-row>
                <v-col xs12 lg4>
                    <h4>{{$t('vps.state')}}</h4>
                    <v-chip v-if="on" label class="green white--text">On</v-chip>
                    <v-chip v-if="off" label class="red white--text">Off</v-chip>
                    <v-chip v-if="on" label outline class="green green--text">
                        <i class="fa fa-fw fa-lg fa-cloud-download"></i>
                        {{vps.net_in_b | b_to_kb}} KB/s
                    </v-chip>
                    <v-chip v-if="on" label outline class="red red--text">
                        <i class="fa fa-fw fa-lg fa-cloud-upload"></i>
                        {{vps.net_out_b | b_to_kb}} KB/s
                    </v-chip>
                    <div class="mb-4"></div>
                </v-col>
            </v-row>
            <v-row v-if="on">
                <v-col md6 xs12="xs12">
                    <h3>{{$t('vps.cpu')}}</h3>
                    <div class="display-1">{{vps.cpu}}%</div>
                    <progress-linear-color v-model="vps.cpu"></progress-linear-color>
                </v-col>
                <v-col md6 xs12="xs12">
                    <h3>{{$t('vps.ram')}}</h3><h4>{{ram}}%</h4>
                    <progress-linear-color v-model="ram"></progress-linear-color>
                </v-col>
            </v-row>
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
            this.$store.commit('setToolbarTitle', 'header.vps_init')
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth.no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('vpsInfo', {
                        'id': this.$route.params.id
                    }).then(() => {
                        this.interval = setInterval(this.stats, 3500)
                        this.$store.commit('setLoaded')
                        //FIXME set by API not user input
                        this.$store.commit('setToolbarTitle', 'header.vps')
                        this.$store.commit('setToolbarTitleArgs', {'id': this.$route.params.id})
                    })
                }
            })
        },
        destroyed () {
            clearInterval(this.interval)
        },
        computed: {
            on () {
                if (this.$store.state.vps.status == "running") {
                    return true;
                }
            },
            off () {
                if (this.$store.state.vps.status == "stopped") {
                    return true;
                }
            },
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
            },
            b_to_kb(b) {
                return Math.round(b / 1024);
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
        }
    }
</script>
