<template>
    <div>
        <v-container fluid>
            <v-layout justify-center>
                <v-flex xs12>
                <!--<v-alert info>{{$t('panel_preview')}}</v-alert>-->
                <!-- pagination with margins for datatable -->
                <div class="text-xs-center mb-4">
                    <v-pagination
                            v-if="page"
                            :length="totalPages"
                            :disabled="loading"
                            v-model="page"
                    ></v-pagination>
                </div>
                </v-flex>
            </v-layout>

            <v-row>
                <v-flex xs12 md10 offset-md1>
                <v-card class="mb-4">
                    <v-data-table
                            :headers="headers"
                            :items="services.items"
                            :no-data-text="$t('table.empty.services')"
                            hide-actions
                    >
                        <template slot="items" scope="props">
                            <td @click="goToVps(props.item.id)">
                                VPS
                                <span v-if="props.item.virt === 0">OpenVZ</span>
                                <span v-else-if="props.item.virt === 2">KVM</span>
                            </td>
                            <td @click="goToVps(props.item.id)">#{{props.item.id}}</td>
                            <td @click="goToVps(props.item.id)">
                            <span v-if="props.item.name === null" class="grey--text">
                                {{ $t('vps.notset') }}
                            </span>
                                <span v-else>
                                {{ props.item.name }}
                            </span>
                            </td>
                            <td @click="goToVps(props.item.id)">
                                {{props.item.ip}}
                            </td>
                            <td @click="goToVps(props.item.id)" style="white-space: nowrap;">
                            <span v-if="props.item.active === 1">
                                <i class="fa fa-circle green--text"></i> {{$t('vps.active')}}
                            </span>
                                <span v-else>
                                <i class="fa fa-circle red--text"></i> {{$t('vps.locked')}}
                            </span>
                            </td>
                            <td @click="goToVps(props.item.id)">
                                {{props.item.payed_to | prettyDateFormat}}
                                <span> - {{props.item.payed_to | prettyDateFrom}}</span>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
                </v-flex>
            </v-row>
        </v-container>
    </div>
</template>
<style scope="props">
    tr {
        cursor: pointer;
    }
</style>
<script>
    export default {
        mounted () {
            this.$store.commit('setToolbarTitle', 'header.services')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$store.commit('setNoAuth')
                    this.$router.push('/login')
                } else {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('servicesList', {
                        'page': 1,
                        'limit': 10
                    }).then(() => {
                        if (this.$store.state.services.error !== true) {
                            this.totalPages = this.$store.state.services.paging.total_pages
                        }
                        this.$store.commit('setLoaded')
                    })
                }
            })
        },
        computed: {
            currentTimestamp () {
                return Math.floor(Date.now() / 1000)
            },
            services () {
                return this.$store.state.services
            },
            loading () {
                return this.$store.state.loading
            },
            language() {
                return this.$store.state.language
            },
            headers() {
                return [
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.service'),
                        value: this.$t('table.service')
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
                        text: this.$t('table.name'),
                        value: this.$t('table.name')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.ip'),
                        value: this.$t('table.ip')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.status'),
                        value: this.$t('table.status')
                    },
                    {
                        sortable: false,
                        left: true,
                        text: this.$t('table.payed_to'),
                        value: this.$t('table.payed_to')
                    }
                ]
            }
        },
        data () {
            return {
                page: 1,
                totalPages: 1
            }
        },
        watch: {
            page (val, old) {
                if (!this.loading) {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('servicesList', {
                        'page': val,
                        'limit': 10
                    }).then(() => {
                        this.$store.commit('setLoaded')
                    })
                } else {
                    //this.page = old; //FIXME find another way of blocking update when loading
                }
            }
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Services',
                    description: 'Example services description',
                    keywords: 'vuetify, services'
                }
            },
            goToVps(id) {
                this.$router.push('/' + this.$route.params.lg + '/service/vps/' + id)
            }
        }
    }
</script>
