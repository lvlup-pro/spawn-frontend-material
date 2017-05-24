<template>
    <div>
        <v-container fluid v-if="!loading">
            <v-layout justify-center>
                <v-flex xs12 md6 lg4>
                    <v-card class="mt-4 mb-4 pl-4 pr-4">
                        <v-card-text>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">label</v-icon>
                                <div>
                                    <div>{{$t('user.id')}}</div>
                                    <strong>#{{profile.id}}</strong>
                                </div>
                            </v-card-row>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">face</v-icon>
                                <div>
                                    <div>{{$t('user.fullname')}}</div>
                                    <strong>{{profile.fullname}}</strong>
                                </div>
                            </v-card-row>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">assignment_ind</v-icon>
                                <div>
                                    <div>{{$t('user.username')}}</div>
                                    <strong>{{profile.username}}</strong>
                                </div>
                            </v-card-row>
                            <v-card-row height="75px">
                                <v-icon class="mr-5">email</v-icon>
                                <div>
                                    <div>{{$t('user.email')}}</div>
                                    <strong>{{profile.email}}</strong>
                                </div>
                            </v-card-row>
                        </v-card-text>
                        <!--<v-card-row actions>-->
                            <!--<v-btn flat class="green&#45;&#45;text darken-1">Change data</v-btn>-->
                        <!--</v-card-row>-->
                    </v-card>
                </v-flex>
            </v-layout>
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
            this.$store.commit('setToolbarTitle', 'header.profile')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    this.$store.commit('setNoAuth')
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
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Profile',
                    description: 'Example profile description',
                    keywords: 'vuetify, profile'
                }
            },
            loadProfile() {
                this.$store.commit('setLoading')
                this.$store.dispatch('profileInfo').then(() => {
                    this.$store.commit('setLoaded')
                })
            }
        }
    }
</script>
