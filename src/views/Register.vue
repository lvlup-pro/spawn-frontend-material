<template>
    <div>
        <v-container>
        </v-container>
    </div>
</template>
<script>
    export default {
        mounted () {
            this.$emit('view', this.meta())
            this.$emit('redirectLang', 'register')
            this.$store.commit('setToolbarTitle', 'header.register')
            this.$store.dispatch('checkSession').then((nosession) => {
                if (nosession) {
                    //this.$vuetify.toast.create(this.$t('auth.no'), "right")
                } else {
                    this.$vuetify.toast.create(this.$t('auth.already'), "right")
                    this.$router.push('/'+this.$route.params.lg+'/service')
                }
            })
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
            }
        }
    }
</script>
