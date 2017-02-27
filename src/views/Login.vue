<template>
    <div>
        <v-container>
            <v-row class="mt-5">
                <v-col lg3></v-col>
                <v-col xs12 md6 lg6>
                    <v-card class="mp-5">
                        <v-card-text>
                            <h5>{{ $t('user.login.header') }}</h5>
                            <form v-on:submit.prevent="onSubmit">
                                <v-text-input
                                        :label="$t('user.username')"
                                        :placeholder="$t('user.placeholder.username')"
                                        v-model="username"
                                ></v-text-input>
                                <v-text-input
                                        :label="$t('user.password')"
                                        type="password"
                                        :placeholder="$t('user.placeholder.password')"
                                        v-model="password"
                                ></v-text-input>
                                <!--<v-select-->
                                <!--v-bind:options="options"-->
                                <!--label="Remember me for..."-->
                                <!--v-model="remember"-->
                                <!--&gt;</v-select>-->
                                <v-btn class="aligned" flat="flat" dark="dark" success block type="submit"
                                       v-on:click.native="login(username,password)"
                                       v-bind:loading="loading"
                                       v-bind:disabled="loading"
                                >
                                    <v-icon left>vpn_key</v-icon>
                                    {{$t('user.login.button')}}
                                </v-btn>
                            </form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
    @keyframes loader {
        from {
            transform: rotate(0);
        }

        to {
            transform: rotate(360deg);
        }
    }

    .loader {
        animation: loader 1s infinite
    }

</style>

<script>
    import Vue from 'vue' //FIXME use global or something
    export default {
        data () {
            return {
                username: "",
                password: "",
                remember: "",
                test: false,
                options: [
                    {"text": "5 minutes"},
                    {"text": "1 hour"},
                    {"text": "1 day"},
                    {"text": "7 days"},
                ]
            }
        },
        computed: {
            loading() {
                return this.$store.state.loading
            }
        },
        mounted () {
            this.$emit('redirectLang', 'login')
            this.$store.commit('setToolbarTitle', 'header.login')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    //this.$vuetify.toast.create(this.$t('auth.no'), "right")
                } else {
                    this.$vuetify.toast.create(this.$t('auth.already'), "right")
                    this.$router.push('/'+this.$route.params.lg+'/service')
                }
            })
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Login',
                    description: 'Example login description',
                    keywords: 'vuetify, login'
                }
            },
            login(username, password) {
                this.$store.commit('setLoading')
                this.$store.dispatch('accountLogin', {
                    username: username,
                    password: password
                }).then((res) => {
                    if (res) {
                        var auth = this.$t('auth.success');
                        this.$vuetify.toast.create(auth, "right")
                        this.$router.push('/'+this.$route.params.lg+'/service')
                        this.$store.dispatch('walletInfo')
                    } else {
                        var auth = this.$t('auth.fail');
                        this.$vuetify.toast.create(auth, "right")
                    }
                    this.$store.commit('setLoaded')
                })
            }
        }
    }
</script>
