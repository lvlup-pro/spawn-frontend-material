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
        profile: {},
        ticketMessages: {},
        services: {"paging": {"total_pages": 1}},
        pagination: {"paging": {"total_pages": 1}},
        count: 1,
        toolbarTitle: "",
        toolbarTitleArgs: {},
        version: "",
        language: "",
        meta: {}
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
        handleError({}, args) {
            console.log(args.error.message + ' in ' + args.name + '()!');
            if (args.error.message === 'Network Error') {
                //Network Error
            } else {
                //Other Error
            }
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
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'accountLogin', 'error': error});
                })
        },
        accountInfo ({commit, dispatch, state}) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'me')
                .then(function (res) {
                    if (typeof res.data.username !== 'undefined') {
                        commit('setAccount', res.data)
                        return true
                    }
                }).catch(function (error) {
                    dispatch('handleError', 'accountInfo', error)
                })
        },
        walletInfo ({commit, dispatch, state}) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'me/balance')
                .then(function (res) {
                    if (typeof res.data[0].balance !== 'undefined') {
                        commit('setWallet', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'walletInfo', 'error': error})
                })
        },
        ticketInfo ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'help/ticket/' + args.id)
                .then(function (res) {
                    if (typeof res.data.id !== 'undefined') {
                        //http://stackoverflow.com/a/784547/1351857
                        res.data.message = res.data.message.replace(/(?:\r\n|\r|\n)/g, '<br>');
                        commit('setTicket', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'ticketInfo', 'error': error})
                })
        },
        ticketMessages ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'help/ticket/' + args.id + '/message')
                .then(function (res) {
                    if (res.data.error !== false || typeof res.data.messages[0] !== 'undefined') {
                        //http://stackoverflow.com/a/784547/1351857
                        //res.data.message = res.data.message.replace(/(?:\r\n|\r|\n)/g, '<br>'); //FIXME iterate all msg
                        commit('setTicketMessages', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'ticketMessages', 'error': error})
                })
        },
        ticketAddMessage ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.post(state.apiUrl + 'help/ticket/' + args.id + '/message', args)
                .then(function (res) {
                    if (typeof res.data.error !== false) {
                        //commit('setTicketMessages', res.data)
                        return true
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'ticketAddMessage', 'error': error})
                })
        },
        servicesList ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'vps?page=' + args.page + '&limit=' + args.limit)
                .then(function (res) {
                    if (typeof res.data !== 'undefined') {
                        commit('setServices', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'servicesList', 'error': error})
                })
        },
        paginationList ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + args.url + '?page=' + args.page + '&limit=' + args.limit)
                .then(function (res) {
                    if (typeof res.data !== 'undefined') {
                        commit('setPagination', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'paginationList', 'error': error})
                })
        },
        vpsInfo ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'vps/' + args.id)
                .then(function (res) {
                    if (typeof res.data.active !== 'undefined') {
                        commit('setVps', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'vpsInfo', 'error': error})
                })
        },
        profileInfo ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'me')
                .then(function (res) {
                    if (typeof res.data.id !== 'undefined') {
                        commit('setProfile', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'profileInfo', 'error': error})
                })
        }
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
        setProfile (state, newProfile) {
            state.profile = newProfile
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
        setToolbarTitle (state, newTitle) {
            state.toolbarTitle = newTitle;
        },
        setToolbarTitleArgs (state, newTitleArgs) {
            state.toolbarTitleArgs = newTitleArgs;
        },
        setLanguage (state, newLanguage) {
            state.language = newLanguage;
            Vue.config.lang = newLanguage;
        },
        setMeta(state, newMeta) {
            state.meta = newMeta;
        },
        setLoading (state) {
            state.loading = true;
        },
        setLoaded (state) {
            state.loading = false;
        },
        setTitle (state, newTitle) {
          document.title = newTitle;
        },
        setDescription (state, newDescription) {
          document.head.querySelector('meta[name=description]').content = newDescription;
        },
        setKeywords (state, newKeywords) {
          document.head.querySelector('meta[name=keywords]').content = newKeywords;
        }
    }
})
