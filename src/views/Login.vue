<template>
    <div>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="authsuccess">{{ $t('auth.success') }}</v-snackbar>
        <v-snackbar :timeout="2000" :top="true" :right="true" v-model="authfail">{{ $t('auth.fail') }}</v-snackbar>
        <v-container>
            <v-row class="mt-5">
                <v-col md3></v-col>
                <v-col xs12 md6>
                    <v-card class="mp-5">
                        <v-card-text>
                            <h5>{{ $t('user.login.header') }}</h5>
                            <form @submit.prevent="" novalidate>
                                <text-input
                                    :label="$t('user.username')"
                                    :placeholder="$t('user.placeholder.username')"
                                     name="username" v-model="username"
                                ></text-input>
                                <text-input
                                    :label="$t('user.password')"
                                    :placeholder="$t('user.placeholder.password')"
                                    name="password" type="password" v-model="password"
                                ></text-input>
                                <!--<v-select-->
                                <!--:options="options"-->
                                <!--label="Remember me for..."-->
                                <!--v-model="remember"-->
                                <!--&gt;</v-select>-->
                                <v-btn class="aligned" flat="flat" dark="dark" success block type="submit"
                                    @click.native="login"
                                    :loading="loading" :disabled="loading">
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
                options: [
                    {"text": "5 minutes"},
                    {"text": "1 hour"},
                    {"text": "1 day"},
                    {"text": "7 days"},
                ],
                authsuccess: false,
                authfail: false
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
                if (!nosession) {
                    this.$store.commit('setAlreadyAuth')
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
            validate(component) {
                let noerrors = true
                component.$validator.validateAll()
                component.$children.forEach(child => {
                    noerrors = this.validate(child) && noerrors
                })
                return noerrors && !component.verrors.any()
            },
            login() {
                if(this.validate(this)) {
                    this.$store.commit('setLoading')
                    this.$store.dispatch('accountLogin', {
                        username: this.username,
                        password: this.password
                    }).then((res) => {
                        if (res) {
                            this.authsuccess = true
                            this.$router.push('/'+this.$route.params.lg+'/service')
                            this.$store.dispatch('walletInfo')
                        } else {
                            this.authfail = true
                        }
                        this.$store.commit('setLoaded')
                    })
                }
            }
        }
    }
</script>
