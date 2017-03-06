<template>
    <div>
        <v-container id="vps-stats" v-if="!loading">
            <v-card>
                <v-card-row class="green darken-1">
                    <v-card-title class="white--text">{{$t('vps.control')}}</v-card-title>
                </v-card-row>
                <v-card-text>
                    <v-row>
                        <v-col md6 xs12>
                            <v-card-row>
                                <i class="fa fa-fw fa-2x fa-info-circle"></i>
                                <b>{{$t('vps.state')}}:&nbsp;</b>
                                <v-chip v-if="locked" label class="red white--text">{{$t('vps.locked')}}</v-chip>
                                <v-chip v-else-if="on" label class="green white--text">{{$t('vps.on')}}</v-chip>
                                <v-chip v-else label class="red white--text">{{$t('vps.off')}}</v-chip>
                            </v-card-row>
                            <v-card-row>
                                <i class="fa fa-fw fa-2x fa-server"></i>
                                <b>{{$t('vps.virtualization')}}:&nbsp;</b>
                                {{ {kvm: 'KVM', openvz: 'OpenVZ'}[vps.virt] }}
                            </v-card-row>
                            <v-card-row v-if="vps.ip">
                                <i class="fa fa-fw fa-2x fa-globe"></i>
                                <b>{{$t('vps.ips')}}:&nbsp;</b>
                                <u v-if="vps.ip.additional.length > 0">{{vps.ip.main}}</u>
                                <span v-else>{{vps.ip.main}}</span>
                                <span v-for="(item, index) in vps.ip.additional">
                                	, {{item}}
                                </span>
                            </v-card-row>
                        </v-col>
                        <v-col md6 xs12>
                            <v-card-row v-if="on">
                                <i class="fa fa-fw fa-2x fa-clock-o"></i>
                                <b>{{$t('vps.uptime')}}:&nbsp;</b>
                                {{upfrom | prettyDateFormat}}
                                <span class="hidden-sm-and-down">- {{upfrom | prettyDateFrom}}</span>
                            </v-card-row>
                            <v-card-row>
                                <i class="fa fa-fw fa-2x fa-calendar-plus-o"></i>
                                <b>{{$t('vps.createdat')}}:&nbsp;</b>
                                {{vps.created_at | prettyDateFormat}}
                                <span class="hidden-sm-and-down">- {{vps.created_at | prettyDateFrom}}</span>
                            </v-card-row>
                            <v-card-row v-if="locked">
                                <i class="fa fa-fw fa-2x fa-calendar-times-o"></i>
                                <b>{{$t('vps.lockedfrom')}}:&nbsp;</b>
                                {{vps.payed_to | prettyDateFormat}}
                                <span class="hidden-sm-and-down">- {{vps.payed_to | prettyDateFrom}}</span>
                            </v-card-row>
                            <v-card-row v-else>
                                <i class="fa fa-fw fa-2x fa-calendar-check-o"></i>
                                <b>{{$t('vps.activeto')}}:&nbsp;</b>
                                {{vps.payed_to | prettyDateFormat}}
                                <span class="hidden-sm-and-down">- {{vps.payed_to | prettyDateFrom}}</span>
                            </v-card-row>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-row v-if="!locked" actions style="justify-content: flex-start">
                    <v-modal v-if="on" v-model="disableModal">
                        <v-btn slot="activator" error
                            :loading="changingStatus" :disabled="changingStatus"
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
                            :loading="changingStatus" :disabled="changingStatus"
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
                        :loading="changingStatus" :disabled="changingStatus"
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
                        <v-col md6 xs12 v-if="vps.virt == 'openvz'">
                            <h6>{{$t('vps.swap')}}: {{swap}}% ({{vps.swap_mb}} MB/{{vps.max_swap_mb}} MB)</h6>
                            <progress-linear-color v-model="swap"></progress-linear-color>
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
            <v-row>
                <v-col md6 xs12>
                    <div class="mb-4"></div>
                    <v-card v-if="!locked">
                        <v-card-row class="green darken-1">
                            <v-card-title class="white--text">{{$t('vps.settings')}}</v-card-title>
                        </v-card-row>
                        <v-card-text>
                            <v-card-row>
                                <i class="fa fa-fw fa-2x fa-pencil" style="padding-bottom: 1rem;"></i>
                                <v-text-input
                                    v-model="newname"
                                    :label="$t('vps.name')"
                                    :placeholder="$t('vps.placeholder.name')">
                                    {{vps.name}}
                                </v-text-input>
                            </v-card-row>
                        </v-card-text>
                        <v-card-row actions style="justify-content: flex-start">
                            <v-btn :loading="changingSettings" :disabled="!settingsChanged"
                                success v-on:click.native="save" class="white--text">
                                {{$t('vps.save')}}
                            </v-btn>
                        </v-card-row>
                    </v-card>
                </v-col>
                <v-col md6 xs12>
                    <div class="mb-4"></div>
                    <v-card v-if="!locked && vps.virt === 'kvm' && vps.ip">
                        <v-card-row class="green darken-1">
                            <v-card-title class="white--text">{{$t('vps.firewall.label')}}</v-card-title>
                        </v-card-row>
                        <v-list two-line>
                            <v-list-item>
                                <v-list-tile>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{vps.ip.main}}</v-list-tile-title>
                                    <v-list-tile-sub-title>IP główne</v-list-tile-sub-title>
                                  </v-list-tile-content>
                                  <v-list-tile-action>
                                    <v-btn icon ripple>
                                      <v-icon class="black--text">settings</v-icon>
                                    </v-btn>
                                  </v-list-tile-action>
                                </v-list-tile>
                            </v-list-item>
                            <v-list-item v-for="(item, index) in vps.ip.additional">
                                <v-list-tile>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{item}}</v-list-tile-title>
                                    <v-list-tile-sub-title>IP dodatkowe</v-list-tile-sub-title>
                                  </v-list-tile-content>
                                  <v-list-tile-action>
                                    <v-btn icon ripple>
                                      <v-icon class="black--text">settings</v-icon>
                                    </v-btn>
                                  </v-list-tile-action>
                                </v-list-tile>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
            <div class="mb-4"></div>
            <!--
             TODO
             - OpenVZ use vps.nproc
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

    ul.list {
        padding: 0;
    }

    div.list__tile__sub-title {
        color: #6e6e6e;
    }
</style>
<script>
    export default {
        data () {
            return {
                interval: null,
                changingStatus: false,
                changingSettings: false,
                disableModal: false,
                rebootModal: false,
                rebooting: false,
                newname: ""
            }
        },
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.vps')
            //FIXME set by API not user input
            this.$store.commit('setToolbarTitleArgs', {'id': this.$route.params.id})
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth.no'), "right")
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.stats().then(() => {
                        this.$store.commit('setLoaded')
                        this.$emit('view', this.meta())
                        this.newname = this.name
                        this.interval = setInterval(this.stats, 1000)
                    })
                    this.ips()
                }
            })
        },
        destroyed () {
            clearInterval(this.interval)
        },
        computed: {
            on () {
                return this.vps.status === 'running'
            },
            off () {
                return this.vps.status === 'stopped'
            },
            locked() {
                return !this.vps.active
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
                return Math.round((this.vps.mem_mb / this.vps.max_mem_mb) * 100)
            },
            disk() {
                return Math.round((this.vps.disk_mb / this.vps.max_disk_mb) * 100)
            },
            swap() {
                return Math.round((this.vps.swap_mb / this.vps.max_swap_mb) * 100)
            },
            language() {
                return this.$store.state.language
            },
            upfrom() {
                return new Date().getTime() / 1000 - this.vps.uptime_s
            },
            name() {
                return this.vps.name === null ? "" : this.vps.name
            },
            settingsChanged() {
                return !this.changingSettings && this.newname !== this.name
            }
        },
        watch: {
            off(newValue, oldValue) {
                if (newValue === true && oldValue === false && this.rebooting) {
                    this.enable()
                    this.rebooting = false
                }
            }
        },
        filters: {
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
                return this.$store.dispatch('vpsInfo', {
                    'id': this.$route.params.id
                })
            },
            ips() {
                return this.$store.dispatch('vpsIps', {
                    'id': this.$route.params.id
                })
            },
            enable() {
                this.changingStatus = true
                return this.$store.dispatch('vpsOn', {
                    'id': this.$route.params.id
                })
            },
            disable() {
                this.changingStatus = true
                this.disableModal = false
                return this.$store.dispatch('vpsOff', {
                    'id': this.$route.params.id
                })
            },
            reboot() {
                this.rebootModal = false
                this.rebooting = true
                this.disable()
            },
            save() {
                this.changingSettings = true
                this.$store.dispatch('vpsChangeInfo', {
                    'id': this.$route.params.id,
                    'name': this.newname === "" ? null : this.newname
                }).then(() => {
                    this.changingSettings = false
                })
            }
        }
    }
</script>
