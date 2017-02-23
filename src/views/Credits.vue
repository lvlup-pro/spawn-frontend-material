<template>
    <div>
        <v-container>
            <v-row>
                <v-col xs12>
                    <h4>...</h4>
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
            this.$store.commit('setToolbarTitle', 'header.credits')
            if (typeof this.$route.params.lg === 'undefined') {
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
                this.$router.push('/' + lang + '/credits')
            }
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        methods: {
            meta() {
                return {
                    title: 'Credits',
                    description: 'Example credits description',
                    keywords: 'vuetify, credits'
                }
            }
        }
    }
</script>
