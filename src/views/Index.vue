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
            this.$vuetify.init();
            this.$store.commit('setNavbarTitle', "Index")
            if (typeof this.$route.params.lang === 'undefined') {
                this.$router.push('/en/home')
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