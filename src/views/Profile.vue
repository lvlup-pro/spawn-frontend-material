<template>
    <div>
        <v-container v-if="!loading">
            <v-row>
                <v-col xl3></v-col>
                <v-col xs12 xl6>
                    <v-card class="mt-4">
                        <v-card-text>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">label</v-icon>
                                <div>
                                    <div>ID</div>
                                    <strong>#{{profile.id}}</strong>
                                </div>
                            </v-card-row>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">face</v-icon>
                                <div>
                                    <div>{{$t('fullname')}}</div>
                                    <strong>{{profile.fullname}}</strong>
                                </div>
                            </v-card-row>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">assignment_ind</v-icon>
                                <div>
                                    <div>{{$t('username')}}</div>
                                    <strong>{{profile.username}}</strong>
                                </div>
                            </v-card-row>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">email</v-icon>
                                <div>
                                    <div>E-mail</div>
                                    <strong>{{profile.email}}</strong>
                                </div>
                            </v-card-row>
                        </v-card-text>
                        <!--<v-card-row actions>-->
                            <!--<v-btn flat class="green&#45;&#45;text darken-1">Change data</v-btn>-->
                        <!--</v-card-row>-->
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
</style>
<script>
    import moment from 'moment'
    export default {
        data () {
            return {}
        },
        mounted () {
            this.$emit('view', this.meta())
            moment.locale(this.$lang);
            this.$store.commit('setToolbarTitle', 'header_profile')
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    //this.$vuetify.toast.create(this.$t('auth_no'), "right")
                    this.$router.push('/login')
                } else {
                    this.loadProfile()
                }
            })
        },
        computed: {
            loading () {
                return this.$store.state.loading
            },
            profile () {
                return this.$store.state.profile
            }
        },
        filters: {
            prettyDate (unixtimestamp) {
                var timestamp = moment.unix(unixtimestamp);
                return timestamp.format("HH:mm DD.MM.YYYY")
            }
        },
        preFetch () {
            return this.methods.meta()
        },
        methods: {
            meta() {
                return {
                    title: 'Pagination Component | Vuetify.js',
                    h1: 'Pagination',
                    description: 'Pagination component for Vuetify Framework',
                    keywords: 'vuetify, pagination, components'
                }
            },
            loadProfile() {
                this.$store.commit('setLoading')
                this.$store.dispatch('profileInfo').then(() => {
                    //after ticket loaded, load messages in this ticket
                    this.$store.commit('setLoaded')
                    console.log(this.profile)
                })
            }
        },
        locales: {
            en: {
                fullname: 'Full name',
                username: 'Username'
            },
            pl: {
                fullname: 'Imię i nazwisko',
                username: 'Login'
            }
        }
    }
</script>
