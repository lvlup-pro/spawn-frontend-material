<template>
    <div>
        <v-container>
            <v-row class="mt-5">
                <v-col lg3></v-col>
                <v-col xs12 md6 lg6>
                    <v-card class="mp-5">
                        <v-card-text>
                            <h5>{{ $t('user.register.header') }}</h5>
                            <form v-on:submit.prevent="register" novalidate>
                                <text-input
                                    :label="$t('user.fullname')"
                                    :placeholder="$t('user.placeholder.fullname')"
                                    name="fullname" v-model="fullname"
                                ></text-input>
                                <text-input
                                    :label="$t('user.username')"
                                    :placeholder="$t('user.placeholder.username')"
                                    name="username" v-model="username"
                                ></text-input>
                                <text-input type="email"
                                    :label="$t('user.email')"
                                    :placeholder="$t('user.placeholder.email')"
                                    name="email" v-model="email"
                                ></text-input>
                                <text-input type="password"
                                    :label="$t('user.password')"
                                    :placeholder="$t('user.placeholder.password')"
                                    name="password" v-model="password"
                                ></text-input>
                                <text-input type="password"
                                    :validationmessage="$t('validation.repeatpassword')" :validation="validatePassword"
                                    :label="$t('user.repeatpassword')"
                                    :placeholder="$t('user.placeholder.password')"
                                    name="repeatpassword" v-model="repeatpassword"
                                ></text-input>
                                <div id="captcha-container">
                                    <div id="captcha-register"></div>
                                </div>
                                <v-btn class="aligned" flat="flat" dark="dark" success block type="submit">
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

            function scaleCaptcha() {
                let reCaptchaWidth = 304
                let containerWidth = document.getElementById('captcha-container').clientWidth
                if(reCaptchaWidth > containerWidth) {
                    let captchaScale = containerWidth / reCaptchaWidth
                    document.getElementById('captcha-register').style.transform = 'scale(' + captchaScale + ')'
                }
            }
            scaleCaptcha()
            window.addEventListener('resize', scaleCaptcha)
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
            validate(component) {
                let noerrors = true
                component.$validator.validateAll()
                component.$children.forEach(child => {
                    noerrors = this.validate(child) && noerrors
                })
                return noerrors && !component.errors.any()
            },
            validatePassword() {
                return {
                    valid: this.password === this.repeatpassword
                }
            },
            register() {
                if(this.validate(this)) {
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
    }
</script>
