<template>
    <div>
        <v-container>
            <v-row class="mt-5">
                <v-col lg3></v-col>
                <v-col xs12 md6 lg6>
                    <v-card class="mp-5">
                        <v-card-text>
                            <h5>{{ $t('user.register.header') }}</h5>
                            <form v-on:submit.prevent="">
                                <v-text-input
                                    :label="$t('user.fullname')"
                                    :placeholder="$t('user.placeholder.fullname')"
                                    v-model="fullname"
                                ></v-text-input>
                                <v-text-input
                                    :label="$t('user.username')"
                                    :placeholder="$t('user.placeholder.username')"
                                    v-model="username"
                                ></v-text-input>
                                <v-text-input
                                    :label="$t('user.email')"
                                    :placeholder="$t('user.placeholder.email')"
                                    v-model="email"
                                ></v-text-input>
                                <v-text-input
                                    :label="$t('user.password')"
                                    type="password"
                                    :placeholder="$t('user.placeholder.password')"
                                    v-model="password"
                                ></v-text-input>
                                <v-text-input
                                    :label="$t('user.repeatpassword')"
                                    type="password"
                                    :placeholder="$t('user.placeholder.password')"
                                    v-model="repeatpassword"
                                ></v-text-input>
                                <div id="captcha-container">
                                    <div id="captcha-register"></div>
                                </div>
                                <v-btn class="aligned" flat="flat" dark="dark" success block type="submit" v-on:click.native="register()">
                                    <v-icon left>vpn_key</v-icon>
                                    {{$t('user.register.button')}}
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
    #captcha-register {
        transform-origin: left top;
    }

    #captcha-register > div {
        margin: auto;
    }
</style>
<script>
    export default {
        data () {
            return {
                fullname: "",
                username: "",
                email: "",
                password: "",
                repeatpassword: "",
                captcha: ""
            }
        },
        computed: {
            reCaptchaSiteKey () {
                return this.$store.state.reCaptchaSiteKey
            }
        },
        mounted () {
            this.checkCaptcha()
            this.$emit('redirectLang', 'register')
            this.$store.commit('setToolbarTitle', 'header.register')
            this.$emit('view', this.meta())
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    //this.$vuetify.toast.create(this.$t('auth.no'), "right")
                } else {
                    this.$vuetify.toast.create(this.$t('auth.already'), "right")
                    this.$router.push('/'+this.$route.params.lg+'/service')
                }
            })

            //https://codepen.io/dloewen/pen/jbgeZj/
            function scaleCaptcha(elementWidth) {
                var reCaptchaWidth = 304;
                var containerWidth = $('#captcha-container').width();
                if(reCaptchaWidth > containerWidth) {
                    var captchaScale = containerWidth / reCaptchaWidth;
                    $('#captcha-register').css({
                        'transform':'scale('+captchaScale+')'
                    });
                }
            }
            $(function() {
                scaleCaptcha();
                $(window).resize(scaleCaptcha);
            });
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Register',
                    description: 'Example register description',
                    keywords: 'vuetify, register'
                }
            },
            checkCaptcha() {
                if (window.grecaptcha !== undefined) {
                    grecaptcha.render('captcha-register', {
                        'sitekey' : this.reCaptchaSiteKey,
                        'callback' : this.captchaCallback
                    })
                } else {
                    setTimeout(this.checkCaptcha, 10)
                }
            },
            captchaCallback(response) {
                this.captcha = response
            },
            register() {
                this.$store.dispatch('accountRegister', {
                    fullname: this.fullname,
                    username: this.username,
                    password: this.password,
                    email: this.email,
                    captcha_response: this.captcha
                }).then((res) => {
                    if (res) {
                        this.$vuetify.toast.create(this.$t('auth.register.success'), 'right')
                    } else {
                        this.$vuetify.toast.create(this.$t('auth.register.fail'), 'right')
                    }
                    this.$store.commit('setLoaded')
                })
            }
        }
    }
</script>
