import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import axios from 'axios'
import storeConfig from './config.js'

export default new Vuex.Store({
    state: {
        apiUrl: "",
        token: null,
        reCaptchaSiteKey: "",
        loading: false,
        networkError: false,
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
        meta: {},
        logout: false
    },
    actions: {
        boot ({dispatch, state, commit}) {
            commit('setVersion', "v" + storeConfig.version)
            commit('setReCaptchaSiteKey', storeConfig.reCaptchaSiteKey)
        },
        logOut ({dispatch, state, commit}) {
            localStorage.removeItem("token");
            commit('setAccount', {})
            commit('setWallet', [{balance_pretty: ""}])
            commit('setServices', [])
            commit('setToken', null)
            commit('setNetworkError', false)
            commit('setLogout', true)
        },
        handleError({dispatch, state, commit}, args) {
            let error = args.error, msg = error.message, response = error.response, fn = args.name;
            console.log(msg + ' in ' + fn + '()!');
            if (typeof response !== 'undefined') {
                switch (response.status) {
                    case 401:
                    case 403:
                        if (fn !== 'accountLogin') {
                            //invalid token
                            dispatch('logOut')
                        }
                        break;
                    case 429:
                        //rate limit
                        break;
                }
            } else {
                //no response - network error
                commit('setNetworkError', true)
            }
        },
        //return true if not authorized
        checkSession ({dispatch, state}) {
            state.apiUrl = storeConfig.apiUrl

            //logout, force login
            if (state.logout) {
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
                        return true;
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'accountLogin', 'error': error});
                })
        },
        accountRegister({state, dispatch}, args) {
            return axios.post(state.apiUrl + 'auth/register', args)
                .then(function (res) {
                    return true
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'accountRegister', 'error': error})
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
                    dispatch('handleError', {'name': 'accountInfo', 'error': error})
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
                    for (let i = 0; i < res.data.messages.length; i++) {
                        res.data.messages[i].message = res.data.messages[i].message.replace(/(?:\r\n|\r|\n)/g, '<br>')
                    }
                    commit('setTicketMessages', res.data)
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
                    if (typeof res.data.status !== 'undefined') {
                        if (typeof state.vps.status !== 'undefined' && state.vps.status === 'running') {
                            let s = res.data.uptime_s - state.vps.uptime_s;
                            if (s > 0) {
                                let netInChange = res.data.net_in_b - state.vps.net_in_b;
                                let netOutChange = res.data.net_out_b - state.vps.net_out_b;
                                res.data.net_in_bps = netInChange / s;
                                res.data.net_out_bps = netOutChange / s;
                                if (state.vps.virt == 'kvm') {
                                    let diskReadChange = res.data.disk_read_b - state.vps.disk_read_b;
                                    let diskWriteChange = res.data.disk_write_b - state.vps.disk_write_b;
                                    res.data.disk_read_bps = diskReadChange / s;
                                    res.data.disk_write_bps = diskWriteChange / s;
                                }
                            } else {
                                res.data.net_in_bps = state.vps.net_int_bps;
                                res.data.net_out_bps = state.vps.net_out_bps;
                                if (state.vps.virt == 'kvm') {
                                    res.data.disk_read_bps = state.vps.disk_read_bps;
                                    res.data.disk_write_bps = state.vps.disk_write_bps;
                                }
                            }
                        } else {
                            res.data.net_in_bps = -1;
                            res.data.net_out_bps = -1;
                            res.data.disk_read_bps = -1;
                            res.data.disk_write_bps = -1;
                        }
                        res.data.ip = state.vps.ip
                        commit('setVps', res.data)
                    }
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'vpsInfo', 'error': error})
                })
        },
        vpsOn ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.post(state.apiUrl + 'vps/' + args.id + '/on')
                .then(function (res) {
                    return true
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'vpsOn', 'error': error})
                })
        },
        vpsOff ({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.post(state.apiUrl + 'vps/' + args.id + '/off')
                .then(function (res) {
                    return true
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'vpsOff', 'error': error})
                })
        },
        vpsIps({commit, dispatch, state}, args) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
            return axios.get(state.apiUrl + 'vps/' + args.id + '/ip')
                .then(function (res) {
                    commit('setVpsIps', res.data)
                }).catch(function (error) {
                    dispatch('handleError', {'name': 'vpsOff', 'error': error})
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
        setToken (state, newToken) {
            state.token = newToken;
        },
        setNetworkError (state, newErrorState) {
            state.networkError = newErrorState;
        },
        setReCaptchaSiteKey (state, newKey) {
            state.reCaptchaSiteKey = newKey;
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
        setVpsIps(state, newIps) {
            state.vps.ip = {}
            state.vps.ip.main = newIps.main
            state.vps.ip.additional = newIps.additional
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
        setLogout(state, newLogout) {
            state.logout = newLogout;
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
