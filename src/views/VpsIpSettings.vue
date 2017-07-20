<template>
    <div>
        <v-container fluid>
            <v-layout>
                <v-flex xs12 md10 offset-md1>
                    <v-card class="mb-4">
                        <v-card-row class="grey darken-3">
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

                        <v-data-table
                            v-if="loadedRules"
                            v-bind:headers="headers"
                            :items="rules"
                            v-bind:no-data-text="$t('table.empty.rules')"
                            hide-actions
                        >
                            <template slot="items" scope="props">
                                <td>
                                    <!-- FIXME make use of datatable checkbox -->
                                    <div class="input-group text-xs-center">
                                        <input :id="'checkbox' + props.item.id" type="checkbox" class="filled"
                                               :value="props.item.id" v-model="checked">
                                        <label :for="'checkbox' + props.item.id"></label>
                                    </div>
                                </td>
                                <td>#{{props.item.id}}</td>
                                <td>{{protocols[props.item.protocol]}}</td>
                                <td v-if="props.item.port_range.from === props.item.port_range.to">
                                    {{props.item.port_range.from}}
                                </td>
                                <td v-else>{{props.item.port_range.from}} - {{props.item.port_range.to}}</td>
                                <td>
                            <span v-if="props.item.create_pending">
                                <i class="fa fa-circle yellow--text"></i>
                                {{$t('vpsip.rule.creating')}}
                            </span>
                                    <span v-else-if="props.item.delete_pending">
                                <i class="fa fa-circle red--text"></i>
                                {{$t('vpsip.rule.deleting')}}
                            </span>
                                    <span v-else>
                                <i class="fa fa-circle green--text"></i>
                                {{$t('vpsip.rule.created')}}
                            </span>
                                </td>
                            </template>
                        </v-data-table>

                        <v-card-row actions style="justify-content: flex-start" v-if="loadedStatus">
                            <v-btn class="white--text" success
                                   v-if="(!status.enabled || status.enable_pending) && !status.disable_pending"
                                   @click.native="enable"
                                   :loading="changingStatus" :disabled="changingStatus">
                                {{$t('vpsip.enable')}}
                            </v-btn>
                            <v-btn class="white--text" error
                                   v-if="(status.enabled || status.disable_pending) && !status.enable_pending"
                                   @click.native="disable"
                                   :loading="changingStatus" :disabled="changingStatus">
                                {{$t('vpsip.disable')}}
                            </v-btn>

                            <!-- FIXME validation -->
                            <!-- TODO use fullscreen dialog for mobile -->
                            <v-dialog v-model="addModal">
                                <v-btn slot="activator" success class="white--text">
                                    {{$t('vpsip.add.submit')}}
                                </v-btn>
                                <v-card>
                                    <v-card-row>
                                        <v-card-title>{{$t('vpsip.add.header')}}</v-card-title>
                                    </v-card-row>
                                    <v-card-row height="400px">
                                        <v-card-text>
                                            <v-container fluid>
                                                <v-text-field
                                                    :validationmessage="$t('validation.port')"
                                                    :validation="validatePortFrom"
                                                    :label="$t('vpsip.add.portfrom.label')"
                                                    :placeholder="$t('vpsip.add.portfrom.placeholder')"
                                                    name="portfrom" type="number" v-model="portFrom" required
                                                ></v-text-field>
                                                <v-text-field
                                                    :validationmessage="$t('validation.port')"
                                                    :validation="validatePortTo"
                                                    :label="$t('vpsip.add.portto.label')"
                                                    :placeholder="$t('vpsip.add.portto.placeholder')"
                                                    name="portto" type="number" v-model="portTo" required
                                                ></v-text-field>
                                                <v-select
                                                    :items="selectProtocols"
                                                    :label="$t('vpsip.add.protocol')"
                                                    v-model="protocol"
                                                ></v-select>
                                                <!--<v-text-field label="Legal last name" hint="example of persistent helper text"
                                                persistent-hint
                                                required />
                                                <small>*indicates required field</small>-->
                                            </v-container>
                                        </v-card-text>
                                    </v-card-row>
                                    <v-card-row actions>
                                        <v-btn flat @click.native="addModal = false">
                                            {{$t('vpsip.add.cancel')}}
                                        </v-btn>
                                        <v-btn class="white--text" success @click.native="addRule"
                                               :loading="addingRule" :disabled="addingRule">
                                            {{$t('vpsip.add.submit')}}
                                        </v-btn>
                                    </v-card-row>
                                </v-card>
                            </v-dialog>
                            <v-btn error class="white--text" @click.native="deleteRules"
                                   :disabled='checked.length === 0'>
                                {{$t('vpsip.delete')}}
                            </v-btn>
                        </v-card-row>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<style scope="props">
    select option[disabled] {
        display: none;
    }

    div.modal {
        max-height: initial;
    }
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
                portFrom: '',
                portTo: '',
                protocol: {value: 'other', text: 'Other'},
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
                },
                checked: []
            }
        },
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.vpsip')
            this.$store.commit('setToolbarTitleArgs', this.$route.params)
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$store.commit('setNoAuth')
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
                    array.push({text: this.protocols[key], value: key})
                }
                return array
            },
            language() {
                return this.$store.state.language
            },
            headers() {
                return [
                    {
                        sortable: false,
                        left: true,
                        text: '✓',
                        value: 'check'
                    },
                    {
                        sortable: true,
                        left: true,
                        text: this.$t('table.id'),
                        value: this.$t('table.id')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.protocol'),
                        value: this.$t('table.protocol')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.ports'),
                        value: this.$t('table.ports')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.status'),
                        value: this.$t('table.status')
                    }
                ]
            }
        },
        watch: {
            language: function (newValue, oldValue) {
                this.protocols['other'] = this.$t('vpsip.otherprotocol')
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
                if (!this.rules.error) {
                    let rulesPending = false
                    this.rules.forEach(function (rule) {
                        if (rule.create_pending || rule.delete_pending) {
                            rulesPending = true
                        }
                    })
                    if (rulesPending) {
                        this.fetchRules()
                    }
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
                return this.$store.dispatch('vpsIpGameToggle', Object.assign(this.$route.params, {enabled: true}))
            },
            disable() {
                return this.$store.dispatch('vpsIpGameToggle', Object.assign(this.$route.params, {enabled: false}))
            },
            validate(component) {
                let noerrors = true
                component.$validator.validateAll()
                component.$children.forEach(child => {
                    noerrors = this.validate(child) && noerrors
                })
                return noerrors && !component.verrors.any()
            },
            clearValidation(component) {
                component.verrors.clear()
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
                if (this.validate(this)) {
                    let portFrom = this.portFrom, portTo = this.portTo
                    if (portFrom > portTo) {
                        let tmp = portFrom
                        portFrom = portTo
                        portTo = tmp
                    }
                    this.addingRule = true
                    this.$store.dispatch('vpsIpGameRuleAdd', Object.assign(this.$route.params,
                        {protocol: this.protocol.value, port_from: parseInt(portFrom), port_to: parseInt(portTo)})).then(() => {
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
            },
            deleteRules() {
                let self = this
                this.checked.forEach(function (id) {
                    self.$store.dispatch('vpsIpGameRuleDelete', Object.assign(self.$route.params, {rule_id: id}))
                })
                this.checked = []
            }
        }
    }
</script>
