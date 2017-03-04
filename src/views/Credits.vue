<template>
    <div>
        <v-container>
            <v-row>
                <v-col xs12 class="markdown-body">
                    <h1>LVL UP Spawn {{version}}</h1>
                    <h2>
                        <a href="https://github.com/lvlup-pro/spawn-frontend-material/graphs/contributors">{{$t('credits.contributors')}}</a>:
                    </h2>
                    <ul>
                        <li><a href="https://github.com/SystemZ/">SystemZ</a></li>
                        <li><a href="https://github.com/Libter/">Libter</a></li>
                    </ul>

                    <h2>{{$t('credits.poweredby')}}:</h2>
                    <ul>
                        <li><a href="https://vuejs.org/">Vue.js</a></li>
                        <li><a href="https://vuetifyjs.com/">Vuetify.js</a></li>
                        <li><a href="https://github.com/mzabriskie/axios">axios</a></li>
                    </ul>

                    <h2>
                        <a href="https://github.com/lvlup-pro/spawn-frontend-material/blob/master/CHANGELOG.md">{{$t('credits.changelog')}}</a>
                    </h2>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
    export default {
        mounted () {
            this.$emit('redirectLang', 'credits')
            this.$vuetify.load()
            this.$store.commit('setBackLink', false)
            this.$store.commit('setToolbarTitle', 'header.credits')
            this.$emit('view', this.meta())
        },
        preFetch (store) {
            store.commit('setMeta', this.methods.meta())
        },
        computed: {
            version() {
                return this.$store.state.version
            }
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
