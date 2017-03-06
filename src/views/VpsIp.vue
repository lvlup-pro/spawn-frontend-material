<template>
    <div>
        <v-container>
            <v-card>
                <v-table-overflow>
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
                            <tr>
                                <td>
                                    <v-checkbox v-bind:id="'checkbox' + index" filled class="text-xs-center"></v-checkbox>
                                </td>
                                <td>#ID</td>
                                <td>protocol</td>
                                <td>1-65535</td>
                                <td>status</td>
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
            return {}
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

                }
            })
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'VPS IP',
                    description: 'Example VPS IP description',
                    keywords: 'vuetify, vps, ip'
                }
            }
        }
    }
</script>
