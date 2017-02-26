<template>
    <div>
        <v-container id="vps-stats" v-if="!loading">
            <v-row>
                <v-col xs12 lg4>
                    <h5>{{$t('vps.control')}}</h5>
                    <v-btn v-if="off" success
                           v-bind:loading="changingStatus"
                           v-on:click.native="enable"
                           v-bind:disabled="changingStatus"
                           class="white--text no-margin-button"
                    >
                        {{$t('vps.turn_on')}}
                    </v-btn>
                    <v-btn v-if="on" error
                           v-bind:loading="changingStatus"
                           v-on:click.native="disable"
                           v-bind:disabled="changingStatus"
                           class="white--text no-margin-button"
                    >
                        {{$t('vps.turn_off')}}
                    </v-btn>
                </v-col>
            </v-row>
            <div class="mb-4"></div>
            <v-row>
                <v-col xs12 lg4>
                    <h5>{{$t('vps.info')}}</h5>
                    <h6>
                        {{$t('vps.state')}}:
                        <v-chip v-if="on" label class="green white--text">
                            {{$t('vps.on')}}
                        </v-chip>
                        <v-chip v-if="off" label class="red white--text">
                            {{$t('vps.off')}}
                        </v-chip>
                    </h6>
                    <h6>{{$t('vps.virtualization')}}: {{ {kvm: 'KVM', openvz: 'OpenVZ'}[vps.virt] }}</h6>
                    <h6 v-if="on">{{$t('vps.uptime')}}: {{Math.round(vps.uptime_s / 60 / 60 / 24)}} {{$t('vps.days')}}</h6>
                    <div class="mb-4"></div>
                </v-col>
            </v-row>
            <div v-if="on">
                <v-row>
                    <v-col xs12 lg4>
                        <h5>{{$t('vps.resources')}}</h5>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md6 xs12="xs12">
                        <h6>{{$t('vps.cpu')}}: {{vps.cpu}}% </h6>
                        <div class="display-1"></div>
                        <progress-linear-color v-model="vps.cpu"></progress-linear-color>
                    </v-col>
                    <v-col md6 xs12="xs12">
                        <h6>{{$t('vps.ram')}}: {{ram}}% ({{vps.mem_mb}} MB/{{vps.max_mem_mb}} MB)</h6>
                        <progress-linear-color v-model="ram"></progress-linear-color>
                    </v-col>
                    <v-col md6 xs12="xs12" v-if="vps.virt == 'openvz'">
                        <h6>{{$t('vps.disk')}}: {{disk}}% ({{vps.disk_mb | mb_to_gb}}/{{vps.max_disk_mb | mb_to_gb}})</h6>
                        <progress-linear-color v-model="disk"></progress-linear-color>
                    </v-col>
                    <v-col md6 xs12="xs12" v-else>
                        <h6>{{$t('vps.disk')}}: {{vps.max_disk_mb | mb_to_gb}}</h6>
                    </v-col>
                </v-row>
                <div class="mb-2"></div>
                <v-row>
                    <v-col md6 xs12="xs12">
                        <h6>{{$t('vps.network')}}</h6>
                        <v-chip label outline class="green green--text">
                            <i class="fa fa-fw fa-lg fa-cloud-download"></i>
                            {{vps.net_in_b | prettyBytes}}
                        </v-chip>
                        <v-chip label outline class="red red--text">
                            <i class="fa fa-fw fa-lg fa-cloud-upload"></i>
                            {{vps.net_out_b | prettyBytes}}
                        </v-chip>
                        <v-chip label outline class="green green--text">
                            <i class="fa fa-fw fa-lg fa-cloud-download"></i>
                            {{vps.net_in_bps | prettyBytes}}/s
                        </v-chip>
                        <v-chip label outline class="red red--text">
                            <i class="fa fa-fw fa-lg fa-cloud-upload"></i>
                            {{vps.net_out_bps | prettyBytes}}/s
                        </v-chip>
                    </v-col>
                </v-row>
                <div class="mb-2"></div>
                <v-row v-if="vps.virt == 'kvm'">
                    <v-col md6 xs12="xs12">
                        <h6>{{$t('vps.disk')}}</h6>
                        <v-chip label outline class="green green--text">
                            <i class="fa fa-fw fa-lg fa-upload"></i>
                            {{vps.disk_read_b | prettyBytes}}
                        </v-chip>
                        <v-chip label outline class="red red--text">
                            <i class="fa fa-fw fa-lg fa-download"></i>
                            {{vps.disk_write_b | prettyBytes}}
                        </v-chip>
                        <v-chip label outline class="green green--text">
                            <i class="fa fa-fw fa-lg fa-cloud-download"></i>
                            {{vps.disk_read_bps | prettyBytes}}/s
                        </v-chip>
                        <v-chip label outline class="red red--text">
                            <i class="fa fa-fw fa-lg fa-cloud-upload"></i>
                            {{vps.disk_write_bps | prettyBytes}}/s
                        </v-chip>
                    </v-col>
                </v-row>
                <div class="mb-4"></div>
            </div>
            <!--
             TODO
             - OpenVZ use vps.nproc vps.max_swap_mb vps.swap_mb
             -->
        </v-container>
    </div>
</template>
<style>
    #vps-stats .progress-linear {
        position: relative
    }

    span.chip i {
        padding-right: 6px;
    }

    .no-margin-button {
        margin-left: 0px;
        margin-top: -0.5rem;
    }

    h6 {
        font-size: 18px;
    }
</style>
<script>
    import moment from 'moment'
    export default {
        data () {
            return {
                interval: null,
                changingStatus: false
            }
        },
        mounted () {
            moment.locale(this.$lang)
            this.$store.commit('setToolbarTitle', 'header.vps_init')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth.no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('vpsInfo', {
                        'id': this.$route.params.id
                    }).then(() => {
                        this.interval = setInterval(this.stats, 1000)
                        this.$store.commit('setLoaded')
                        //FIXME set by API not user input
                        this.$store.commit('setToolbarTitle', 'header.vps')
                        this.$store.commit('setToolbarTitleArgs', {'id': this.$route.params.id})
                        this.$emit('view', this.meta())
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
                //FIXME may introduce strange behaviour, need to diff previous and current state to be good
                this.changingStatus = false
                return this.$store.state.vps
            },
            ram () {
                return Math.round((this.$store.state.vps.mem_mb / this.$store.state.vps.max_mem_mb) * 100)
            },
            disk() {
                return Math.round((this.$store.state.vps.disk_mb / this.$store.state.vps.max_disk_mb) * 100)
            }
        },
        watch: {},
        filters: {
            prettyDate (unixtimestamp) {
                var timestamp = moment.unix(unixtimestamp);
                //DD.MM.YYYY or "L"
                return timestamp.format("H:mm L")
            },
            prettyBytes(bytes) {
                if (typeof bytes === 'undefined' || bytes < 0) {
                    return '... B'
                }
                let i = 0;
                var units = ['B', 'KB', 'MB', 'GB', 'TB'];
                while (bytes > 1024) {
                    bytes /= 1024;
                    i++;
                }
                return bytes.toFixed(2) + ' ' + units[i];
            },
            mb_to_gb(mb) {
                if (mb < 0) {
                    return '... GB'
                }
                return (mb / 1024.0).toFixed(2) + ' GB'
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
            },
            enable() {
                this.changingStatus = true
                this.$store.dispatch('vpsOn', {
                    'id': this.$route.params.id
                })
            },
            disable() {
                this.changingStatus = true
                this.$store.dispatch('vpsOff', {
                    'id': this.$route.params.id
                })
            }
        }
    }
</script>
