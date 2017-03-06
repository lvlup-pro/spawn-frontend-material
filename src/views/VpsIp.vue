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
                        <v-chip v-if="vpsip.status.enable_pending" label class="yellow">
                            {{$t('vpsip.status.enabling')}}
                        </v-chip>
                        <v-chip v-else-if="vpsip.status.disable_pending" label class="yellow">
                            {{$t('vpsip.status.disabling')}}
                        </v-chip>
                        <v-chip v-else-if="vpsip.status.enabled" label class="green white--text">
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
                            <tr v-for="(item, index) in vpsip.rules">
                                <td>
                                    <v-checkbox v-bind:id="'checkbox' + index" filled class="text-xs-center"></v-checkbox>
                                </td>
                                <td>#{{item.id}}</td>
                                <td>{{item.protocol}}</td>
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
                        </tbody>
                    </table>
                </v-table-overflow>
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
                interval: null
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
                    this.status().then(() => {
                        this.loadedStatus = true
                        this.setLoaded()
                    })
                    this.rules().then(() => {
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
            vpsip () {
                return this.$store.state.vpsip
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
            rules() {
                return this.$store.dispatch('vpsIpGameRules', this.$route.params)
            },
            status() {
                return this.$store.dispatch('vpsIpGameStatus', this.$route.params)
            },
            refresh() {
                let status = this.vpsip.status, rules = this.vpsip.rules, rulesPending = false
                rules.forEach(function(rule) {
                    if (rule.create_pending || rule.delete_pending) {
                        rulesPending = true
                    }
                })
                if (rulesPending) {
                    this.rules()
                }
                if (status.enable_pending || status.disable_pending) {
                    this.status()
                }
            },
            setLoaded() {
                if (this.loadedRules && this.loadedStatus) {
                    this.$store.commit('setLoaded')
                    setInterval(this.refresh, 5000)
                }
            }
        }
    }
</script>
