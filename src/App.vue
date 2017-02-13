<template>
    <v-app top-navbar left-fixed-sidebar>
        <header>
            <v-progress-linear v-if="loading" v-bind:indeterminate="true"></v-progress-linear>
            <v-toolbar class="green">
                <v-toolbar-side-icon @click.native.stop="nav = !nav" class="hidden-md-and-up white--text">
                    <v-icon class="sideicon">reorder</v-icon>
                </v-toolbar-side-icon>
                <v-toolbar-logo class="hidden-xs-and-down">{{navbarTitle}}</v-toolbar-logo>
                <v-toolbar-items>
                    <v-toolbar-item v-on:click.native="logOut">
                        {{$t('logout')}}
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
                <ul data-uid="15" class="list list--dense list--sub-header">
                    <hr class="divider divider--light">

                    <li class="list__sub-header">{{$t('account')}}</li>
                    <li v-if="account.email" class="list__item noclick"><a class="list__tile list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-user"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">{{account.email}}</div>
                        </div>
                    </a></li>
                    <li v-if="wallet.balance_pretty" class="list__item noclick"><a class="list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-money"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">{{wallet.balance_pretty}}</div>
                        </div>
                    </a></li>
                    <li v-if="!account.email" class="list__item click"><router-link :to="'/'+lg+'/login'" class="list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-sign-in"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">{{$t('login')}}</div>
                        </div>
                    </router-link></li>

                    <li class="list__sub-header">Menu</li>
                    <li class="list__item"><router-link :to="'/'+lg+'/home'"
                            class="list__tile list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-home"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">
                                {{$t('home')}}
                            </div>
                        </div>
                    </router-link></li>
                    <li class="list__item"><router-link :to="'/'+lg+'/service'"
                                                        class="list__tile list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-server"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">
                                {{$t('services')}}
                            </div>
                        </div>
                    </router-link></li>
                    <li class="list__item"><router-link :to="'/'+lg+'/ticket'"
                                                        class="list__tile list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-question-circle"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">
                                {{$t('help')}}
                            </div>
                        </div>
                    </router-link></li>

                    <li class="list__sub-header">{{$t('lang')}}</li>
                    <li v-if="lg == 'en'" v-on:click="changeLang('pl')" class="click list__item"><a
                            class="list__tile list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-globe"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">
                                English (EN)
                            </div>
                        </div>
                    </a></li>
                    <li v-if="lg == 'pl'" v-on:click="changeLang('en')" class="click list__item"><a
                            class="list__tile list__tile">
                        <div class="list__tile__action"><i class="fa fa-fw fa-2x fa-globe"></i></div>
                        <div class="list__tile__content">
                            <div class="list__tile__title">
                                Polski (PL)
                            </div>
                        </div>
                    </a></li>
                </ul>
            </v-sidebar>
            <v-content>
                <v-container fluid>
                    <div class="mt-3"></div>
                    <transition mode="out-in">
                        <router-view></router-view>
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
            navbarTitle() {
                return this.$store.state.navbarTitle
            },
            account() {
                return this.$store.state.account
            },
            wallet() {
                return this.$store.state.wallet[0]
            },
            version() {
                return this.$store.state.version
            }
        },
        data () {
            return {
                lg: '',
                nav: null
            }
        },
        methods: {
            //meta (obj) {
            view(obj) {
                if (typeof obj === 'string') {
                    return this.title = obj
                }
                this.title = obj.h1
                this.$vuetify.bus.pub('meta:title', obj.title)
                this.$vuetify.bus.pub('meta:description', obj.description)
                this.$vuetify.bus.pub('meta:keywords', obj.keywords)
            },
//            view(meta){
//                this.$vuetify.bus.pub('meta:title', obj.title)
//                this.$vuetify.bus.pub('meta:description', obj.description)
//                this.$vuetify.bus.pub('meta:keywords', obj.keywords)
//            },
            logOut() {
                this.$store.dispatch('logOut').then((res) => {
                    this.$router.push('/login')
                })
            },
            changeLang(lang) {
                Vue.config.lang = lang;
                this.lg = lang;
                this.$router.replace({'params': {'lg': lang}});
                localStorage.setItem('lang', lang);
            }
        },
        mounted () {
            this.$vuetify.load();
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
                wallet: "Wallet",
                panel: "Customer panel",
                news: "News",
                order: "Order",
                services: "Services",
                payments: "Payments",
                help: "Help"
            },
            pl: {
                lang: "Język",
                home: "Nowości",
                login: "Zaloguj się",
                logout: "Wyloguj się",
                account: "Konto",
                wallet: "Portfel",
                panel: "Panel klienta",
                news: "Nowości",
                order: "Zamów",
                services: "Usługi",
                payments: "Płatności",
                help: "Pomoc"
            }
        }
    }
</script>

<style>
    .noclick a {
        cursor: not-allowed;
    }

    .click a {
        cursor: pointer;
    }

    .progress-linear {
        margin: 0px;
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

    #dropdown3 li {
        cursor: pointer;
    }

    .toolbar__logo {
        font-size: 2rem;
    }
</style>
