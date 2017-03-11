<template>
    <div>
        <v-container>
            <v-card>
                <v-card-row class="green darken-1">
                    <v-card-title class="white--text">{{$t('vpsip.header')}}</v-card-title>
                </v-card-row>
                <v-card-text v-if="loadedStatus">
                    <v-card-row>
                        <b>{{$t('vpsip.status.label')}}:&nbsp;</b>
                        <v-chip v-if="status.enable_pending" label class="yellow">
                            {{$t('vpsip.status.enabling')}}
                        </v-chip>
                        <v-chip v-else-if="status.disable_pending" label class="yellow">
                            {{$t('vpsip.status.disabling')}}
                        </v-chip>
                        <v-chip v-else-if="status.enabled" label class="green white--text">
                            {{$t('vpsip.status.enabled')}}
                        </v-chip>
                        <v-chip v-else label class="red white--text">
                            {{$t('vpsip.status.disabled')}}
                        </v-chip>
                    </v-card-row>
                </v-card-text>
                <v-table-overflow v-if="loadedRules">
                    <table>
                        <thead>
                        <tr>
                            <th class="select"><i class="fa fa-check"></i></th>
                            <th>{{$t('table.id')}}</th>
                            <th>{{$t('table.protocol')}}</th>
                            <th>{{$t('table.ports')}}</th>
                            <th>{{$t('table.status')}}</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!rules.error" v-for="(item, index) in rules">
                                <td>
                                    <v-checkbox v-bind:id="'checkbox' + index" filled class="text-xs-center"></v-checkbox>
                                </td>
                                <td>#{{item.id}}</td>
                                <td>{{protocols[item.protocol]}}</td>
                                <td v-if="item.port_range.from === item.port_range.to">{{item.port_range.from}}</td>
                                <td v-else>{{item.port_range.from}} - {{item.port_range.to}}</td>
                                <td>
                                    <span v-if="item.create_pending">
                                        <i class="fa fa-circle yellow--text"></i>
                                        {{$t('vpsip.rule.creating')}}
                                    </span>
                                    <span v-else-if="item.delete_pending">
                                        <i class="fa fa-circle red--text"></i>
                                        {{$t('vpsip.rule.deleting')}}
                                    </span>
                                    <span v-else>
                                        <i class="fa fa-circle green--text"></i>
                                        {{$t('vpsip.rule.created')}}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="rules.error">
                                <td colspan="100%" class="red--text text--darken-3 empty">
                                    {{ $t('table.empty.rules') }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-table-overflow>
                <v-card-row actions style="justify-content: flex-start" v-if="loadedStatus">
                    <v-btn success v-if="(!status.enabled || status.enable_pending) && !status.disable_pending" v-on:click.native="enable"
                        :loading="changingStatus" :disabled="changingStatus">
                        {{$t('vpsip.enable')}}
                    </v-btn>
                    <v-btn error v-if="(status.enabled || status.disable_pending) && !status.enable_pending" v-on:click.native="disable"
                        :loading="changingStatus" :disabled="changingStatus">
                        {{$t('vpsip.disable')}}
                    </v-btn>
                    <v-modal v-model="addModal">
                        <v-btn slot="activator" success class="white--text">
                            {{$t('vpsip.add.submit')}}
                        </v-btn>
                        <v-card>
                            <v-card-text>
                                <h2 class="title">{{$t('vpsip.add.header')}}</h2>
                            </v-card-text>
                            <v-card-text>
                                <text-input
                                    :validationmessage="$t('validation.port')" :validation="validatePortFrom"
                                    :label="$t('vpsip.add.portfrom.label')"
                                    :placeholder="$t('vpsip.add.portfrom.placeholder')"
                                    name="portfrom" type="number" v-model="portFrom"
                                ></text-input>
                                <text-input
                                    :validationmessage="$t('validation.port')" :validation="validatePortTo"
                                    :label="$t('vpsip.add.portto.label')"
                                    :placeholder="$t('vpsip.add.portto.placeholder')"
                                    name="portto" type="number" v-model="portTo"
                                ></text-input>
                                <v-select
                                    :options="selectProtocols"
                                    :label="$t('vpsip.add.protocol')"
                                    v-model="protocol"
                                ></v-select>
                            </v-card-text>
                            <v-card-row actions>
                                <v-spacer></v-spacer>
                                <v-btn flat v-on:click.native="addModal = false" class="primary--text">
                                    {{$t('vpsip.add.cancel')}}
                                </v-btn>
                                <v-btn flat v-on:click.native="addRule" class="primary--text"
                                    :loading="addingRule" :disabled="addingRule">
                                    {{$t('vpsip.add.submit')}}
                                </v-btn>
                            </v-card-row>
                        </v-card>
                    </v-modal>
                </v-card-row>
            </v-card>
        </v-container>
    </div>
</template>
<style>
</style>
<script>
    export default {
        data () {
            return {
                loadedRules: false,
                loadedStatus: false,
                interval: null,
                addModal: false,
                addingRule: false,
                portFrom: 0,
                portTo: 0,
                protocol: 'other',
                protocols: {
                    'arkSurvivalEvolved': 'ARK: Survival Evolved',
                    'arma': 'Arma',
                    'gtaMultiTheftAutoSanAndreas': 'Multi Theft Auto: San Andreas',
                    'gtaSanAndreasMultiplayerMod': 'Grand Theft Auto: San Andreas',
                    'hl2Source': 'HL2/Source',
                    'minecraftPocketEdition': 'Minecraft: Pocket Edition',
                    'minecraftQuery': 'Minecraft Query',
                    'mumble': 'Mumble',
                    'rust': 'Rust',
                    'teamspeak2': 'TeamSpeak 2',
                    'teamspeak3': 'TeamSpeak 3',
                    'trackmaniaShootmania': 'Trackmania/Shootmania',
                    'other': 'Other'
                }
            }
        },
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.vpsip')
            this.$store.commit('setToolbarTitleArgs', this.$route.params)
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$vuetify.toast.create(this.$t('auth.no'), 'right')
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.fetchStatus().then(() => {
                        this.loadedStatus = true
                        this.setLoaded()
                    })
                    this.fetchRules().then(() => {
                        this.loadedRules = true
                        this.setLoaded()
                    })
                }
            })
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        destroyed () {
            clearInterval(this.interval)
        },
        computed: {
            status () {
                return this.$store.state.vpsipstatus
            },
            rules () {
                return this.$store.state.vpsiprules
            },
            changingStatus() {
                return this.status.enable_pending || this.status.disable_pending
            },
            selectProtocols() {
                let array = []
                for (let key in this.protocols) {
                    array.push({ text: this.protocols[key], value: key })
                }
                return array
            }
        },
        methods: {
            meta() {
                return {
                    title: 'VPS IP',
                    description: 'Example VPS IP description',
                    keywords: 'vuetify, vps, ip'
                }
            },
            fetchRules() {
                return this.$store.dispatch('vpsIpGameRules', this.$route.params)
            },
            fetchStatus() {
                return this.$store.dispatch('vpsIpGameStatus', this.$route.params)
            },
            refresh() {
                let rulesPending = false
                this.rules.forEach(function(rule) {
                    if (rule.create_pending || rule.delete_pending) {
                        rulesPending = true
                    }
                })
                if (rulesPending) {
                    this.fetchRules()
                }
                if (this.changingStatus) {
                    this.fetchStatus()
                }
            },
            setLoaded() {
                if (this.loadedRules && this.loadedStatus) {
                    this.$store.commit('setLoaded')
                    this.interval = setInterval(this.refresh, 5000)
                }
            },
            enable() {
                return this.$store.dispatch('vpsIpGameToggle', Object.assign(this.$route.params, { enabled: true }))
            },
            disable() {
                return this.$store.dispatch('vpsIpGameToggle', Object.assign(this.$route.params, { enabled: false }))
            },
            validate(component) {
                let noerrors = true
                component.$validator.validateAll()
                component.$children.forEach(child => {
                    noerrors = this.validate(child) && noerrors
                })
                return noerrors && !component.errors.any()
            },
            clearValidation(component) {
                component.errors.clear()
                component.$children.forEach(child => {
                    this.clearValidation(child)
                })
            },
            validatePort(port) {
                return {
                    valid: Number.isInteger(port) && port > 0 && port < 65536
                }
            },
            validatePortFrom() {
                return this.validatePort(this.portFrom)
            },
            validatePortTo() {
                return this.validatePort(this.portTo)
            },
            addRule() {
                if(this.validate(this)) {
                    let portFrom = this.portFrom, portTo = this.portTo
                    if (portFrom > portTo) {
                        let tmp = portFrom
                        portFrom = portTo
                        portTo = tmp
                    }
                    this.addingRule = true
                    this.$store.dispatch('vpsIpGameRuleAdd', Object.assign(this.$route.params,
                        { protocol: this.protocol, port_from: portFrom, port_to: portTo })).then(() => {
                            this.addingRule = false
                            this.addModal = false
                            this.portFrom = ''
                            this.portTo = ''
                            this.protocol = 'other'
                        }).then(() => {
                            setTimeout(() => {
                                this.errors.clear()
                                this.clearValidation(this)
                            }, 1);
                        })
                }
            }
        }
    }
</script>
