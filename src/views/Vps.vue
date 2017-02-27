<template>
    <div>
        <v-container id="vps-stats" v-if="!loading">
            <v-card>
                <v-card-row class="green darken-1">
                    <v-card-title class="white--text">{{$t('vps.control')}}</v-card-title>
                </v-card-row>
                <v-card-text>
                    <v-card-row>
                        <i class="fa fa-fw fa-2x fa-info-circle"></i>
                        {{$t('vps.state')}}:&nbsp;
                        <v-chip v-if="on" label class="green white--text">{{$t('vps.on')}}</v-chip>
                        <v-chip v-if="off" label class="red white--text">{{$t('vps.off')}}</v-chip>
                    </v-card-row>
                    <v-card-row>
                        <i class="fa fa-fw fa-2x fa-server"></i>
                        {{$t('vps.virtualization')}}:
                        {{ {kvm: 'KVM', openvz: 'OpenVZ'}[vps.virt] }}
                    </v-card-row>
                    <v-card-row v-if="on">
                        <i class="fa fa-fw fa-2x fa-clock-o"></i>
                        {{$t('vps.uptime')}}:
                        {{Math.round(vps.uptime_s / 60 / 60 / 24)}} {{$t('vps.days')}}
                    </v-card-row>
                </v-card-text>
                <v-card-row actions style="justify-content: flex-start">
                    <v-modal v-if="on" v-model="disableModal">
                        <v-btn slot="activator" error
                            v-bind:loading="changingStatus" v-bind:disabled="changingStatus"
                            class="white--text">
                            {{$t('vps.disable.submit')}}
                        </v-btn>
                        <v-card>
                          <v-card-text>
                            <h2 class="title">{{$t('vps.disable.header', {id: $route.params.id})}}</h2>
                          </v-card-text>
                          <v-card-text class="subheading">{{$t('vps.disable.description')}}</v-card-text>
                          <v-card-row actions>
                            <v-spacer></v-spacer>
                            <v-btn flat v-on:click.native="disableModal = false" class="primary--text">{{$t('vps.disable.cancel')}}</v-btn>
                            <v-btn flat v-on:click.native="disable" class="primary--text">{{$t('vps.disable.submit')}}</v-btn>
                          </v-card-row>
                        </v-card>
                    </v-modal>
                    <v-modal v-if="on" v-model="rebootModal">
                        <v-btn slot="activator" warning
                            v-bind:loading="changingStatus" v-bind:disabled="changingStatus"
                            class="white--text">
                            {{$t('vps.reboot.submit')}}
                        </v-btn>
                        <v-card>
                          <v-card-text>
                            <h2 class="title">{{$t('vps.reboot.header', {id: $route.params.id})}}</h2>
                          </v-card-text>
                          <v-card-text class="subheading">{{$t('vps.reboot.description')}}</v-card-text>
                          <v-card-row actions>
                            <v-spacer></v-spacer>
                            <v-btn flat v-on:click.native="rebootModal = false" class="primary--text">{{$t('vps.reboot.cancel')}}</v-btn>
                            <v-btn flat v-on:click.native="reboot" class="primary--text">{{$t('vps.reboot.submit')}}</v-btn>
                          </v-card-row>
                        </v-card>
                    </v-modal>
                    <v-btn v-if="off" success v-on:click.native="enable"
                        v-bind:loading="changingStatus" v-bind:disabled="changingStatus"
                        class="white--text">
                        {{$t('vps.turn_on')}}
                    </v-btn>
                </v-card-row>
            </v-card>
            <div class="mb-4"></div>
            <v-card v-if="on">
                <v-card-row class="green darken-1">
                    <v-card-title class="white--text">{{$t('vps.resources')}}</v-card-title>
                </v-card-row>
                <v-card-text>
                    <v-row>
                        <v-col md6 xs12>
                            <h6>{{$t('vps.cpu')}}: {{vps.cpu}}% </h6>
                            <div class="display-1"></div>
                            <progress-linear-color v-model="vps.cpu"></progress-linear-color>
                        </v-col>
                        <v-col md6 xs12>
                            <h6>{{$t('vps.ram')}}: {{ram}}% ({{vps.mem_mb}} MB/{{vps.max_mem_mb}} MB)</h6>
                            <progress-linear-color v-model="ram"></progress-linear-color>
                        </v-col>
                        <v-col md6 xs12 v-if="vps.virt == 'openvz'">
                            <h6>{{$t('vps.disk')}}: {{disk}}% ({{vps.disk_mb | mb_to_gb}}/{{vps.max_disk_mb | mb_to_gb}})</h6>
                            <progress-linear-color v-model="disk"></progress-linear-color>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md6 xs12>
                            <h6>{{$t('vps.network_rt')}}:</h6>
                            <v-chip label outline class="green green--text">
                                <i class="fa fa-fw fa-lg fa-cloud-download"></i>
                                {{vps.net_in_bps | prettyBytes}}/s
                            </v-chip>
                            <v-chip label outline class="blue blue--text">
                                <i class="fa fa-fw fa-lg fa-cloud-upload"></i>
                                {{vps.net_out_bps | prettyBytes}}/s
                            </v-chip>
                        </v-col>
                        <v-col md6 xs12>
                            <h6>{{$t('vps.network_all')}}:</h6>
                            <v-chip label outline class="green green--text">
                                <i class="fa fa-fw fa-lg fa-cloud-download"></i>
                                {{vps.net_in_b | prettyBytes}}
                            </v-chip>
                            <v-chip label outline class="blue blue--text">
                                <i class="fa fa-fw fa-lg fa-cloud-upload"></i>
                                {{vps.net_out_b | prettyBytes}}
                            </v-chip>
                        </v-col>
                    </v-row>
                    <v-row v-if="vps.virt == 'kvm'">
                        <v-col md6 xs12>
                            <h6>{{$t('vps.disk_rt')}}:</h6>
                            <v-chip label outline class="green green--text">
                                <i class="fa fa-fw fa-lg fa-cloud-download"></i>
                                {{vps.disk_read_bps | prettyBytes}}/s
                            </v-chip>
                            <v-chip label outline class="blue blue--text">
                                <i class="fa fa-fw fa-lg fa-cloud-upload"></i>
                                {{vps.disk_write_bps | prettyBytes}}/s
                            </v-chip>
                        </v-col>
                        <v-col md6 xs12>
                            <h6>{{$t('vps.disk_all')}}:</h6>
                            <v-chip label outline class="green green--text">
                                <i class="fa fa-fw fa-lg fa-upload"></i>
                                {{vps.disk_read_b | prettyBytes}}
                            </v-chip>
                            <v-chip label outline class="blue blue--text">
                                <i class="fa fa-fw fa-lg fa-download"></i>
                                {{vps.disk_write_b | prettyBytes}}
                            </v-chip>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <div class="mb-4"></div>
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

    span.chip--outline {
        margin-bottom: 12px;
    }

    span.chip i, div.card__row i {
        padding-right: 6px;
    }

    .card__row--actions .btn {
        margin-right: 8px;
    }

    h6 {
        font-size: 18px;
        margin-bottom: 0.5rem;
    }
</style>
<script>
    import moment from 'moment'
    export default {
        data () {
            return {
                interval: null,
                changingStatus: false,
                disableModal: false,
                rebootModal: false,
                rebooting: false
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
                return this.$store.state.vps.status == "running";
            },
            off () {
                return this.$store.state.vps.status == "stopped";
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
        watch: {
            'off': function(newValue, oldValue) {
                if (newValue === true && oldValue === false && this.rebooting) {
                    this.enable()
                    this.rebooting = false
                }
            }
        },
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
                return bytes.toFixed(i === 0 ? 0 : 2) + ' ' + units[i];
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
                this.disableModal = false
                this.$store.dispatch('vpsOff', {
                    'id': this.$route.params.id
                })
            },
            reboot() {
                this.rebootModal = false
                this.rebooting = true
                this.disable()
            }
        }
    }
</script>
