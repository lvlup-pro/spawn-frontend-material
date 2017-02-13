<template>
    <div>
        <v-container>
            <v-row>
                <v-col xs12>
                    <h4>Hello</h4>
                    <p>Welcome to lvlup.pro customer panel preview!</p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.$vuetify.load()
            this.$store.commit('setNavbarTitle', this.$t('header_home'))
            if (this.$route.params.lg === undefined) {
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
                this.$router.push('/' + lang + '/home')
            }
//            this.$store.dispatch('checkSession').then((nosession) => {
//                if (nosession) {
//                    this.$vuetify.toast.create(this.$t('auth_no'), "right")
//                    this.$router.push('/login')
//                }
//            })
        }
    }
</script>
