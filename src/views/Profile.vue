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
                </v-col>
            </v-row>
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
                    //this.$vuetify.toast.create(this.$t('auth.no'), "right")
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
