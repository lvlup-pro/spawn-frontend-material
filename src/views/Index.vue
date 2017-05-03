<template>
    <div>
        <v-container>
            <v-row>
                <v-col xs12>
                    <h4>Forum</h4>
                    <discourse-latest-posts></discourse-latest-posts>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
    import axios from "axios"
    export default {
        mounted () {
            this.$emit('redirectLang', 'home')
            this.$vuetify.load()
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
