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
            this.$vuetify.load();
            this.$store.commit('setNavbarTitle', this.$t('header_home'))
            if (typeof this.$route.params.lang === 'undefined') {
                this.$router.push('/en/home')
            }
            this.$store.dispatch('checkSession')
        }
    }
</script>
