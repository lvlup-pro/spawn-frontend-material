<template>
    <div>
        <v-container>
            <v-row class="mt-5">
                <v-col lg3></v-col>
                <v-col xs12 md6 lg6>
                    <v-card class="mp-5">
                        <v-card-text>
                            <h5>{{ $t("i_have_account") }}</h5>
                            <form>
                                <v-text-input
                                        :label="$t('username')"
                                        :placeholder="$t('username_placeholder')"
                                        v-model="username"
                                ></v-text-input>
                                <v-text-input
                                        :label="$t('password')"
                                        type="password"
                                        :placeholder="$t('password_placeholder')"
                                        v-model="password"
                                ></v-text-input>
                                <!--<v-select-->
                                <!--v-bind:options="options"-->
                                <!--label="Remember me for..."-->
                                <!--v-model="remember"-->
                                <!--&gt;</v-select>-->
                                <v-btn success block type="submit"
                                       v-on:click.native="login(username,password)"
                                       v-bind:loading="loading"
                                       v-bind:disabled="loading"
                                >
                                    <v-icon left>vpn_key</v-icon>
                                    {{$t('log_in')}}
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
            this.$store.commit('setNavbarTitle', this.$t('header_login'))
            if (typeof this.$route.params.lang === 'undefined') {
                var lang = localStorage.getItem('lang')
                if (lang === 'undefined') {
                    lang = window.navigator.languages ? window.navigator.languages[0] : null
                    lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage || 'en';
                    if (lang.indexOf('-') !== -1)
                        lang = lang.split('-')[0];
                    if (lang.indexOf('_') !== -1)
                        lang = lang.split('_')[0]
                    localStorage.setItem('lang', lang)
                }
                this.$router.push('/' + lang + '/login')
            }
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    //this.$vuetify.toast.create(this.$t('auth_no'), "right")
                } else {
                    this.$vuetify.toast.create(this.$t('auth_already'), "right")
                    this.$router.push('/'+this.$route.params.lg+'/service')
                }
            })
        },
        methods: {
            login(username, password) {
                this.$store.commit('setLoading')
                this.$store.dispatch('accountLogin', {
                    username: username,
                    password: password
                }).then((res) => {
                    if (res) {
                        var auth = this.$t('auth_success');
                        this.$vuetify.toast.create(auth, "right")
                        this.$router.push('/'+this.$route.params.lg+'/service')
                    } else {
                        var auth = this.$t('auth_fail');
                        this.$vuetify.toast.create(auth, "right")
                    }
                    this.$store.commit('setLoaded')
                })
            }
        },
        locales: {
            en: {
                i_have_account: 'I already have lvlup.pro account',
                username: "Username",
                username_placeholder: "joe@example.com",
                password: "Password",
                password_placeholder: "****",
                log_in: "Log in"
            },
            pl: {
                i_have_account: 'Mam już konto lvlup.pro',
                username: "Login",
                username_placeholder: "j.kowalski@example.com",
                password: "Hasło",
                password_placeholder: "****",
                log_in: "Zaloguj"
            }
        }
    }
</script>
