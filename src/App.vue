<template>
    <v-app top-navbar left-fixed-sidebar>
        <header>
            <v-progress-linear id="loadingBar" v-if="loading" v-bind:indeterminate="true"></v-progress-linear>
            <v-toolbar class="green">
                <v-toolbar-side-icon @click.native.stop="nav = !nav" class="hidden-md-and-up white--text">
                    <v-icon class="sideicon">reorder</v-icon>
                </v-toolbar-side-icon>
                <v-toolbar-logo class="hidden-xs-and-down">{{getToolbarTitle()}}</v-toolbar-logo>
            </v-toolbar>
        </header>
        <main>
            <v-sidebar fixed ripple router unshift v-model="nav">
                <img id="logo" src="https://lvlup.pro/assets/home/img/logo.png"/>
                <p class="text-xs-center">
                    <router-link id="credits-link" class="white--text" :to="'/' + language + '/credits'">
                        {{$t('sidebar.panel')}} {{version}}
                    </router-link>
                </p>
                <v-list dense>
                    <v-divider light/>
                    <v-list-sub-header>{{$t('sidebar.account')}}</v-list-sub-header>
                    <div v-if="!account.email">
                        <!--<v-list-item>
                            <v-list-tile router :href="'/' + language + '/register'">
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-plus-circle"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="$t('sidebar.register')"/>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>-->
                        <v-list-item>
                            <v-list-tile router :href="'/' + language + '/login'">
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-sign-in"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="$t('sidebar.login')"/>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                    </div>
                    <div v-else>
                        <v-list-item>
                            <v-list-tile v-on:click.native="logOut">
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-sign-out"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="$t('sidebar.logout')"/>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                        <v-list-item>
                            <v-list-tile router :href="'/' + language + '/profile'">
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-user"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title
                                            v-text="format($t('sidebar.profile'), { 'nick': account.username, 'email': account.email })"/>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                        <v-list-item>
                            <v-list-tile router :href="'/' + language + '/payment'">
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-money"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title
                                            v-text="format($t('sidebar.payments'), { 'balance': wallet.balance_pretty })"/>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                    </div>

                    <v-list-sub-header>{{$t('sidebar.menu')}}</v-list-sub-header>
                    <v-list-item>
                        <v-list-tile router :href="'/' + language + '/home'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-home"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="$t('sidebar.home')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="account.email">
                        <v-list-tile router :href="'/' + language + '/service'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-server"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="$t('sidebar.services')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="account.email">
                        <v-list-tile router :href="'/' + language + '/ticket'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-question-circle"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="$t('sidebar.help')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>

                    <v-list-sub-header>{{$t('sidebar.lang')}}</v-list-sub-header>
                    <v-list-group>
                        <v-list-item slot="item">
                            <v-list-tile>
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-chevron-down"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{$t('sidebar.selectlang')}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                        <v-list-item v-if="language != 'en'" v-on:click="changeLang('en')">
                            <v-list-tile>
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-globe"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>English (EN)</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                        <v-list-item v-if="language != 'pl'" v-on:click="changeLang('pl')">
                            <v-list-tile>
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-globe"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>Polski (PL)</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                        <v-list-item v-if="language != 'de'" v-on:click="changeLang('de')">
                            <v-list-tile>
                                <v-list-tile-action>
                                    <i class="fa fa-fw fa-2x fa-globe"></i>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>Deutsch (DE)</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </v-sidebar>
            <v-content>
                <v-container fluid>
                    <div class="mt-3"></div>
                    <v-row v-if="networkError">
                        <v-col lg1></v-col>
                        <v-col lg10>
                            <v-alert warning>
                                {{$t('network_error')}} <v-btn v-on:click.native="logOut" class="white--text" success>{{$t('sidebar.logout')}}</v-btn>
                            </v-alert>
                        </v-col>
                    </v-row>
                    <transition mode="out-in">
                        <router-view v-on:view="view" v-on:redirectLang="redirectLang"></router-view>
                    </transition>
                </v-container>
            </v-content>
        </main>
    </v-app>
</template>

<script>
    import Vue from 'vue'
    export default {
        computed: {
            networkError() {
                return this.$store.state.networkError
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
            }
        },
        data () {
            return {
                lg: '',
                nav: null
            }
        },
        watch: {
            'logout': function(newValue, oldValue) {
                if (newValue) {
                    this.$store.commit('setLogout', false)
                    this.$vuetify.toast.create(this.$t('auth.invalidsession'), 'right')
                    this.$router.push('/' + this.language + '/login')
                }
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
                localStorage.setItem('lang', lang);
                this.$validator.setLocale(lang);
                this.$store.commit('setLanguage', lang);
                this.$router.replace({'params': {'lg': lang}});
                this.$store.commit('setTitle', this.getToolbarTitle())
            },
            redirectLang(url) {
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
                    this.$router.push('/' + lang + '/' + url)
                }
            },
            getToolbarTitle() {
                let title = this.$t(this.$store.state.toolbarTitle);
                let args = this.$store.state.toolbarTitleArgs;
                return this.format(title, args);
            },
            format(string, args) {
                for (let key in args) {
                    let find = '{' + key + '}';
                    while (string.indexOf(find) !== -1) {
                        string = string.replace(find, args[key]);
                    }
                }
                return string;
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
        height: initial !important;
        min-height: 100vh;
    }

    button.btn.aligned {
        margin-left: 0;
        margin-right: 0;
    }
</style>
