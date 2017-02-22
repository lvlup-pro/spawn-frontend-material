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
            this.$emit('view', this.meta())
            this.$vuetify.load()
            this.$store.commit('setToolbarTitle', 'header.home')
            if (this.$route.params.lg === undefined) {
                var lang = localStorage.getItem('lang')
                if (lang != 'pl' && lang != 'en') {
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
            this.$store.dispatch('checkSession')
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Index',
                    description: 'Example index description',
                    keywords: 'vuetify, index'
                }
            }
        }
    }
</script>
