import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import axios from 'axios'
import storeConfig from './config.js'

export default new Vuex.Store({
    state: {
        apiUrl: "",
        loading: false,
        errorOnReq: false,
        account: {
            username: ""
        },
        wallet: [
            {
                balance_pretty: ""
            }
        ],
        ticket: {},
        vps: {},
        ticketMessages: {},
        services: {"paging": {"total_pages": 1}},
        pagination: {"paging": {"total_pages": 1}},
        count: 1,
        navbarTitle: "",
        version: ""
    },
    actions: {
        boot ({dispatch, state, commit}) {
            commit('setVersion', "v" + storeConfig.version)
        },
        logOut ({dispatch, state, commit}) {
            localStorage.removeItem("token");
            commit('setAccount', {})
            commit('setWallet', [{balance_pretty: ""}])
            commit('setServices', [])
            state.errorOnReq = true;
        },
        //return true if not authorized
        checkSession ({dispatch, state}) {
            state.apiUrl = storeConfig.apiUrl
            // if (process.env.NODE_ENV === "development") {
            //     state.apiUrl = 'https://demoapi.lvlup.pro/v3/';
            // }

            //recent problem with request, force login
            if (state.errorOnReq) {
                return true
            }
            //no token, force login
            if (localStorage.getItem("token") === null) {
                return true
            } else {
                dispatch('accountInfo').then((res) => {
                    //if no proper response then "log out" and force new login
                    if (res !== true) {
                        localStorage.removeItem("token");
                        return true
                    }
                })
                dispatch('walletInfo')
            }
        },
        accountLogin ({commit, dispatch, state}, args) {
            return axios.post(state.apiUrl + 'auth/login', args)
                .then(function (res) {
                    if (typeof res.data.token !== 'undefined') {
                        localStorage.setItem("token", res.data.token);
                        state.errorOnReq = false;
                        //dispatch('accountInfo').dispatch('walletInfo')
                        return true;
                    }
                }).catch(function () {
                    console.log("accountLogin connection error")
                })
        },
        accountInfo ({commit, state}) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'me')
                .then(function (res) {
                    if (typeof res.data.username !== 'undefined') {
                        commit('setAccount', res.data)
                        return true
                    }
                }).catch(function () {
                    state.errorOnReq = true;
                    console.log("account info connection error")
                })
        },
        walletInfo ({commit, state}) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'me/balance')
                .then(function (res) {
                    if (typeof res.data[0].balance !== 'undefined') {
                        commit('setWallet', res.data)
                    }
                }).catch(function () {
                    console.log("connection error")
                })
        },
        ticketInfo ({commit, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'help/ticket/' + args.id)
                .then(function (res) {
                    if (typeof res.data.id !== 'undefined') {
                        //http://stackoverflow.com/a/784547/1351857
                        res.data.message = res.data.message.replace(/(?:\r\n|\r|\n)/g, '<br>');
                        commit('setTicket', res.data)
                    }
                }).catch(function () {
                    console.log("ticket connection error")
                })
        },
        ticketMessages ({commit, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'help/ticket/' + args.id + '/message')
                .then(function (res) {
                    if (typeof res.data[0] !== 'undefined') {
                        //http://stackoverflow.com/a/784547/1351857
                        //res.data.message = res.data.message.replace(/(?:\r\n|\r|\n)/g, '<br>'); //FIXME iterate all msg
                        commit('setTicketMessages', res.data)
                    }
                }).catch(function () {
                    console.log("ticketmsg connection error")
                })
        },
        ticketAddMessage ({commit, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.post(state.apiUrl + 'help/ticket/' + args.id + '/message', args)
                .then(function (res) {
                    if (typeof res.data.error !== false) {
                        //commit('setTicketMessages', res.data)
                        return true
                    }
                }).catch(function () {
                    console.log("ticketAddMessage connection error")
                })
        },
        servicesList ({commit, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'vps?page=' + args.page + '&limit=' + args.limit)
                .then(function (res) {
                    if (typeof res.data !== 'undefined') {
                        commit('setServices', res.data)
                    }
                }).catch(function () {
                    console.log("connection error")
                })
        },
        paginationList ({commit, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + args.url + '?page=' + args.page + '&limit=' + args.limit)
                .then(function (res) {
                    if (typeof res.data !== 'undefined') {
                        commit('setPagination', res.data)
                    }
                }).catch(function () {
                    console.log("connection error")
                })
        },
        vpsInfo ({commit, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'vps/' + args.id)
                .then(function (res) {
                    if (typeof res.data.active !== 'undefined') {
                        commit('setVps', res.data)
                    }
                }).catch(function () {
                    console.log("vps connection error")
                })
        },
    },
    mutations: {
        setVersion (state, newVersion) {
            state.version = newVersion;
        },
        setUsername (state, newUsername) {
            state.account.username = newUsername;
        },
        setAccount (state, newAccount) {
            state.account = newAccount;
        },
        setWallet (state, newWallet) {
            state.wallet = newWallet;
        },
        setTicket (state, newTicket) {
            state.ticket = newTicket;
        },
        setVps (state, newVps) {
            state.vps = newVps;
        },
        setTicketMessages (state, newTicketMessages) {
            state.ticketMessages = newTicketMessages;
        },
        setServices (state, newServices) {
            state.services = newServices;
        },
        setPagination (state, newPagination) {
            state.pagination = newPagination;
        },
        setNavbarTitle (state, newTitle) {
            state.navbarTitle = newTitle;
        },
        setLoading (state) {
            state.loading = true;
        },
        setLoaded (state) {
            state.loading = false;
        }
    }
})