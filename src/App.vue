<template>
    <v-app top-navbar left-fixed-sidebar>
        <header>
            <v-progress-linear id="loadingBar" v-if="loading" v-bind:indeterminate="true"></v-progress-linear>
            <v-toolbar class="green">
                <v-toolbar-side-icon @click.native.stop="nav = !nav" class="hidden-md-and-up white--text">
                    <v-icon class="sideicon">reorder</v-icon>
                </v-toolbar-side-icon>
                <v-toolbar-logo class="hidden-xs-and-down">{{getToolbarTitle()}}</v-toolbar-logo>
                <v-toolbar-items>
                    <v-toolbar-item v-on:click.native="logOut">
                        {{$t('logout')}}
                        <v-icon class="right">cloud_off</v-icon>
                    </v-toolbar-item>
                    <!--<v-menu>
                        <v-btn dark icon slot="activator">
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list>
                            <v-list-item>
                                <v-list-tile v-on:click="logOut">
                                    <v-list-tile-title>
                                        {{$t('logout')}}
                                    </v-list-tile-title>
                                </v-list-tile>
                            </v-dropdown>
                        </v-list>
                    </v-menu>!-->
                </v-toolbar-items>
            </v-toolbar>
        </header>
        <main>
            <v-sidebar fixed ripple router unshift v-model="nav">
                <img id="logo" src="https://lvlup.pro/assets/home/img/logo.png"/>
                <p class="text-xs-center white--text">{{$t('panel')}} {{version}}</p>
                <v-list dense>
                    <v-divider light/>
                    <v-list-sub-header>{{$t('account')}}</v-list-sub-header>
                    <v-list-item v-if="account.email">
                        <v-list-tile router :href="'/' + language + '/profile'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-user"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title
                                        v-text="format($t('profile'), { 'nick': account.username, 'email': account.email })"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="wallet.balance_pretty">
                        <v-list-tile router :href="'/' + language + '/payment'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-money"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title
                                        v-text="format($t('payments'), { 'balance': wallet.balance_pretty })"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="!account.email">
                        <v-list-tile router :href="'/' + language + '/login'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-sign-in"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="$t('login')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>

                    <v-list-sub-header>{{$t('menu')}}</v-list-sub-header>
                    <v-list-item>
                        <v-list-tile router :href="'/' + language + '/home'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-home"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="$t('home')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="account.email">
                        <v-list-tile router :href="'/' + language + '/service'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-server"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="$t('services')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="account.email">
                        <v-list-tile router :href="'/' + language + '/ticket'">
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-question-circle"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="$t('help')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>

                    <v-list-sub-header>{{$t('lang')}}</v-list-sub-header>
                    <v-list-item v-if="language == 'en'" v-on:click="changeLang('pl')">
                        <v-list-tile>
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-globe"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>English (EN)</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="language == 'pl'" v-on:click="changeLang('en')">
                        <v-list-tile>
                            <v-list-tile-action>
                                <i class="fa fa-fw fa-2x fa-globe"></i>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Polski (PL)</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                </v-list>
            </v-sidebar>
            <v-content>
                <v-container fluid>
                    <div class="mt-3"></div>
                    <transition mode="out-in">
                        <router-view v-on:view="view"></router-view>
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
            }
        },
        data () {
            return {
                lg: '',
                nav: null
            }
        },
        methods: {
            view (meta) {
                this.$store.commit('setTitle', meta.title)
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
                this.$store.commit('setLanguage', lang);
                this.$router.replace({'params': {'lg': lang}});
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
            //this.$vuetify.load();
            this.$store.dispatch('boot')
            this.changeLang(this.$route.params.lg)
        },
        locales: {
            en: {
                lang: "Language",
                home: "Home",
                login: "Log in",
                logout: "Logout",
                account: "Account",
                menu: "Menu",
                profile: "{email}",
                payments: "Payments ({balance})",
                panel: "Customer panel",
                news: "News",
                order: "Order",
                services: "Services",
                help: "Help"
            },
            pl: {
                lang: "Język",
                home: "Nowości",
                login: "Zaloguj",
                logout: "Wyloguj",
                account: "Konto",
                menu: "Menu",
                profile: "{email}",
                payments: "Płatności ({balance})",
                panel: "Panel klienta",
                news: "Nowości",
                order: "Zamów",
                services: "Usługi",
                help: "Pomoc"
            }
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
</style>
