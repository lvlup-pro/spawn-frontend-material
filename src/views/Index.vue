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
            this.$emit('redirectLang', 'home')
            this.$vuetify.load()
            this.$store.commit('setBackLink', false)
            this.$store.commit('setToolbarTitle', 'header.home')
            this.$emit('view', this.meta())
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
