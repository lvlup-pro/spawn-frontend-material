<template>
    <div>
        <v-container>
            <v-card>
                <v-table-overflow>
                    <table v-if="loadedRules">
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
                            <tr v-for="(item, index) in vpsip.list">
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
                loadedRules: false
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
                    this.list().then(() => {
                        this.loadedRules = true
                        this.$store.commit('setLoaded')
                    })
                }
            })
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
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
            list() {
                return this.$store.dispatch('vpsIpGameList', this.$route.params)
            }
        }
    }
</script>
