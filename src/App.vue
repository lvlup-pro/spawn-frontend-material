<template>
    <v-app top-navbar left-fixed-sidebar>
        <header>
            <v-progress-linear id="loadingBar" v-if="loading" :indeterminate="true"></v-progress-linear>
            <v-toolbar class="green">
                <v-toolbar-side-icon @click.native.stop="sidebarOpen = !sidebarOpen" class="hidden-md-and-up white--text">
                    <v-icon class="sideicon">reorder</v-icon>
                </v-toolbar-side-icon>
                <v-toolbar-logo v-html="getToolbarTitle()"></v-toolbar-logo>
            </v-toolbar>
        </header>
        <main>
            <v-sidebar fixed ripple router unshift v-model="sidebarOpen">
                <router-link :to="'/' + language + '/home'">
                    <img id="logo" src="https://lvlup.pro/assets/home/img/logo.png">
                </router-link>
                <p class="text-xs-center">
                    <router-link id="credits-link" class="white--text" :to="'/' + language + '/credits'">
                        {{$t('sidebar.panel')}} {{version}}
                    </router-link>
                </p>
                <v-list dense>
                    <v-divider light/>
                    <template v-for="item in sidebarItems">
                        <v-list-sub-header v-if="item.header" v-text="$t(item.header)" />
                        <v-list-item v-else-if="(item.logged === 'yes' && account.email) || (item.logged === 'no' && !account.email) || !item.logged">
                            <v-list-tile v-if="item.link" router :href="'/' + language + '/' + item.link"
                                @click.native="sidebarOpen = false">
                                <v-list-tile-action>
                                    <i :class="'fa fa-fw fa-2x fa-' + item.icon"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="$t(item.title, item.args)"/>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-else @click.native="sidebarOpen = false; if (item.method) { item.method() }">
                                <v-list-tile-action>
                                    <i :class="'fa fa-fw fa-2x fa-' + item.icon"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="$t(item.title, item.args)"/>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                    </template>
                    <v-list-group :active="sidebarLanguagesOpen">
                        <v-list-item slot="item">
                            <v-list-tile @click.native="sidebarLanguagesOpen = true">
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-chevron-down"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{$t('sidebar.selectlang')}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                        <v-list-item v-for="item in sidebarLanguages" v-if="language != item.code" @click="changeLang(item.code)">
                            <v-list-tile>
                                <v-list-tile-action>
                                    <img :src="'/public/flags/' + item.flag + '.png'">
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="item.name" />
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </v-sidebar>
            <v-content>
                <v-container fluid>
                    <div class="mt-3"></div>
                    <v-row v-if="error">
                        <v-col lg1></v-col>
                        <v-col lg10>
                            <v-alert warning :value="true">
                                {{$t('error.' + error)}}
                                <v-btn v-if="account.email" @click.native="logOut" class="white--text" success>
                                    {{$t('sidebar.logout')}}
                                </v-btn>
                                <v-btn @click.native="refresh" class="white--text" success>
                                    {{$t('sidebar.refresh')}}
                                </v-btn>
                            </v-alert>
                            <div class="mt-3"></div>
                        </v-col>
                    </v-row>
                    <transition mode="out-in">
                        <router-view @view="view" @redirectLang="redirectLang"></router-view>
                    </transition>
                </v-container>
            </v-content>
        </main>
    </v-app>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'
    export default {
        computed: {
            error() {
                return this.$store.state.error
            },
            loading() {
                return this.$store.state.loading
            },
            account() {
                return this.$store.state.account
            },
            wallet() {
                return this.$store.state.wallet[0]
            },
            version() {
                return this.$store.state.version
            },
            language() {
                return this.$store.state.language
            },
            logout() {
                return this.$store.state.logout
            },
            toolbarTitle() {
                return this.$store.state.toolbarTitle
            },
            toolbarTitleArgs() {
                return this.$store.state.toolbarTitleArgs
            },
            sidebarItems() {
                return [
                    { header: 'sidebar.account' },
                    { logged: 'no', title: 'sidebar.login', link: 'login', icon: 'sign-in' },
                    { logged: 'yes', title: 'sidebar.profile', link: 'profile', icon: 'user', args: this.account },
                    { logged: 'yes', title: 'sidebar.payments', icon: 'money', args: this.wallet },
                    { logged: 'yes', title: 'sidebar.paymenthistory', link: 'payment', icon: 'history' },
                    { header: 'sidebar.menu' },
                    { title: 'sidebar.home', link: 'home', icon: 'home' },
                    { logged: 'yes', title: 'sidebar.services', link: 'service', icon: 'server' },
                    { logged: 'yes', title: 'sidebar.help', link: 'ticket', icon: 'question-circle' },
                    { logged: 'yes', title: 'sidebar.logout', method: this.logOut, icon: 'sign-out' },
                    { header: 'sidebar.lang' }
                ]
            },
            sidebarLanguages() {
                return [
                    { code: 'en', flag: 'EN', name: 'English (EN)' },
                    { code: 'pl', flag: 'PL', name: 'Polski (PL)' },
                    { code: 'de', flag: 'DE', name: 'Deutsch (DE)' },
                    { code: 'es', flag: 'ES', name: 'Español (ES)' }
                ]
            }
        },
        data () {
            return {
                lg: '',
                sidebarOpen: false,
                sidebarLanguagesOpen: false
            }
        },
        watch: {
            logout: function(newValue, oldValue) {
                if (newValue) {
                    this.$store.commit('setLogout', false)
                    this.$vuetify.toast.create(this.$t('auth.invalidsession'), 'right')
                    this.$router.push('/' + this.language + '/login')
                }
            },
            toolbarTitle: function(newValue, oldValue) {
                this.getToolbarTitle(true)
            },
            toolbarTitleArgs: function(newValue, oldValue) {
                this.getToolbarTitle(true)
            }
        },
        methods: {
            view (meta) {
                this.changeLang(this.$route.params.lg)
                this.$store.commit('setDescription', meta.description)
                this.$store.commit('setKeywords', meta.keywords)
            },
            logOut() {
                this.$store.dispatch('logOut').then((res) => {
                    this.$router.push('/login')
                })
            },
            changeLang(lang) {
                localStorage.setItem('lang', lang)
                moment.locale(lang)
                this.$validator.setLocale(lang)
                this.$store.commit('setLanguage', lang)
                this.$router.replace({'params': {'lg': lang}})
                this.getToolbarTitle(true)
                this.sidebarLanguagesOpen = false
            },
            redirectLang(url) {
                if (typeof this.$route.params.lg === 'undefined') {
                    var lang = localStorage.getItem('lang')
                    if (lang != 'pl' && lang != 'en') {
                        lang = window.navigator.languages ? window.navigator.languages[0] : null
                        lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage || 'en';
                        if (lang.indexOf('-') !== -1)
                            lang = lang.split('-')[0]
                        if (lang.indexOf('_') !== -1)
                            lang = lang.split('_')[0]
                        localStorage.setItem('lang', lang)
                    }
                    this.$router.push('/' + lang + '/' + url)
                }
            },
            getToolbarTitle(setTitle) {
                let title = this.$t(
                    this.$store.state.toolbarTitle,
                    this.$store.state.toolbarTitleArgs
                )
                let hideSmStart = '[hide-sm]', hideSmEnd = '[/hide-sm]'

                if (setTitle) {
                    let docTitle = this.removeAll(title, [hideSmStart, hideSmEnd])
                    this.$store.commit('setTitle', docTitle)
                }

                title = this.replaceAll(title, hideSmStart, '<span class="hidden-sm-and-down" style="white-space: pre;">')
                title = this.replaceAll(title, hideSmEnd, '</span>')
                return title
            },
            refresh() {
                window.location.reload()
            },
            replaceAll(string, oldString, newString) {
                while (string.indexOf(oldString) > -1) {
                    string = string.replace(oldString, newString)
                }
                return string
            },
            removeAll(string, toRemove) {
                let self = this
                toRemove.forEach(function (element) {
                    string = self.replaceAll(string, element, '')
                })
                return string
            }
        },
        beforeMount() {
            //FIXME
            if (window.localStorage.getItem("token") === null) {
            } else {
                this.$store.commit('setToken', window.localStorage.getItem("token"))
            }
        },
        mounted () {
            this.$store.dispatch('boot')
        }
    }
</script>

<style>
    html {
        overflow-x: hidden;
    }

    /* smaller toolbar */
    .toolbar {
        height: 60px;
    }

    @media screen and (min-width: 992px) {
        /* fix sidebar padding after sidebar resize */
        .with.left-fixed-sidebar main, .with.left-fixed-sidebar footer {
            padding-left: 250px;
        }

        /* fix logo title padding after sidebar resize */
        .with.left-fixed-sidebar header .toolbar {
            padding-left: 277px; /*264px*/
        }

        /* smaller sidebar */
        #app main aside {
            width: 250px;
        }

        /* don't hide loading bar behind sidebar */
        #loadingBar {
            margin: 0 0 0 250px;
        }
    }

    @media screen and (max-width: 768px) {
        ul.pagination a.pagination__item {
            width: 24px;
            height: 24px;
            margin: 0.2rem;
        }

        ul.pagination a.pagination__navigation {
            margin: 0.3rem;
        }
    }

    /* prevent dark background under sidebar */
    #app main {
        background: none;
    }

    .noclick a {
        cursor: not-allowed;
    }

    .click a {
        cursor: pointer;
    }

    /* smaller and more stylish loading bar */
    #loadingBar {
        margin: 0px;
        height: 5px!important;
        position: absolute;
    }

    #logo {
        width: 80%;
        margin-left: 10%;
        margin-top: 5%
    }

    .list__tile--active .list__tile__title {
        color: #00cc00;
    }

    .toolbar__logo {
        font-size: 2rem;
    }

    .material-icons.right {
        padding-left: 6px;
    }

    .alert {
        color: #424242;
        border: 1px solid #ccc;
    }

    .alert--info {
        background: white;
    }

    .alert--warning {
        border-color: #b80;
    }

    .material-icons.alert__icon {
        color: #424242;
    }

    td .input-group input[type=checkbox] + label {
        padding-left: 0;
    }

    th.select {
        width: 35px;
    }

    #credits-link {
        text-decoration: none;
    }

    .list--group .list__tile {
        padding-left: 32px;
    }

    aside.sidebar {
        padding-bottom: 0;
    }

    @media screen and (min-width: 992px) {
        aside.sidebar--close {
            transform: none;
        }
    }

    aside.sidebar::-webkit-scrollbar {
        width: 6px;
    }

    aside.sidebar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 3px;
    }

    button.btn.aligned {
        margin-left: 0;
        margin-right: 0;
    }

    td.empty {
        text-align: center;
        font-weight: bold;
    }

    aside.sidebar div.list__tile__action {
        flex: 1 0 40px;
    }

    aside.sidebar .list__tile--active .list__tile__title {
        color: #00cc00;
    }

    i.fa-2x {
        font-size: 1.5em;
    }
</style>
