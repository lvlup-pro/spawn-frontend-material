import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import axios from 'axios'
import storeConfig from './config.js'

function request({dispatch, state}, method, url, args, callback) {
    for (let key in args) {
        let find = '{' + key + '}'
        while (url.indexOf(find) !== -1) {
            url = url.replace(find, args[key])
        }
    }
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    return method(state.apiUrl + url, args)
        .then(function(response) {
            return callback(response)
        })
        .catch(function (error) {
            dispatch('handleError', {'name': url, 'error': error})
        })
}

function get({dispatch, state}, url, args, callback) {
    return request({dispatch, state}, axios.get, url, args, callback)
}

function post({dispatch, state}, url, args, callback) {
    return request({dispatch, state}, axios.post, url, args, callback)
}

function put({dispatch, state}, url, args, callback) {
    return request({dispatch, state}, axios.put, url, args, callback)
}

export default new Vuex.Store({
    state: {
        apiUrl: '',
        token: null,
        reCaptchaSiteKey: '',
        loading: false,
        error: false,
        account: {
            username: ''
        },
        wallet: [
            {
                balance_pretty: ''
            }
        ],
        ticket: {},
        vps: {},
        vpsip: {},
        profile: {},
        ticketMessages: {},
        services: {'paging': {'total_pages': 1}},
        pagination: {'paging': {'total_pages': 1}},
        count: 1,
        toolbarTitle: '',
        toolbarTitleArgs: {},
        version: '',
        language: '',
        meta: {},
        logout: false
    },
    actions: {
        boot ({dispatch, state, commit}) {
            commit('setVersion', 'v' + storeConfig.version)
            commit('setReCaptchaSiteKey', storeConfig.reCaptchaSiteKey)
        },
        logOut ({dispatch, state, commit}) {
            localStorage.removeItem('token')
            commit('setAccount', {})
            commit('setWallet', [{balance_pretty: ''}])
            commit('setServices', [])
            commit('setToken', null)
            commit('setError', false)
            commit('setLogout', true)
        },
        handleError({dispatch, state, commit}, args) {
            let error = args.error, msg = error.message, response = error.response, url = args.name
            console.log(msg + ' while calling ' + url)
            if (typeof response !== 'undefined') {
                switch (response.status) {
                    case 401:
                    case 403:
                        if (url !== 'auth/login') {
                            commit('setError', 'invalidtoken')
                        }
                        break
                    case 429:
                        commit('setError', 'ratelimit')
                        break
                    default:
                        commit('setError', 'unknown')
                        break
                }
            } else {
                //no response == network error
                commit('setError', 'network')
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
            if (localStorage.getItem('token') === null) {
                return true
            } else {
                dispatch('accountInfo').then((res) => {
                    //if no proper response then 'log out' and force new login
                    if (res !== true) {
                        localStorage.removeItem('token')
                        return true
                    }
                })
                dispatch('walletInfo')
            }
        },
        accountLogin ({commit, dispatch, state}, args) {
            return post({dispatch, state}, 'auth/login', args, function (res) {
                if (typeof res.data.token !== 'undefined') {
                    localStorage.setItem('token', res.data.token)
                    return true
                }
            })
        },
        accountRegister({state, dispatch}, args) {
            return post({dispatch, state}, 'auth/register', args, function (res) {
                return true
            })
        },
        accountInfo ({commit, dispatch, state}) {
            return get({dispatch, state}, 'me', {}, function (res) {
                if (typeof res.data.username !== 'undefined') {
                    commit('setAccount', res.data)
                    return true
                }
            })
        },
        walletInfo ({commit, dispatch, state}) {
            return get({dispatch, state}, 'me/balance', {}, function (res) {
                if (typeof res.data[0].balance !== 'undefined') {
                    commit('setWallet', res.data)
                }
            })
        },
        ticketInfo ({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'help/ticket/{id}', args, function (res) {
                if (typeof res.data.id !== 'undefined') {
                    //http://stackoverflow.com/a/784547/1351857
                    res.data.message = res.data.message.replace(/(?:\r\n|\r|\n)/g, '<br>')
                    commit('setTicket', res.data)
                }
            })
        },
        ticketMessages ({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'help/ticket/{id}/message', args, function (res) {
                for (let i = 0; i < res.data.messages.length; i++) {
                    res.data.messages[i].message = res.data.messages[i].message.replace(/(?:\r\n|\r|\n)/g, '<br>')
                }
                commit('setTicketMessages', res.data)
            })
        },
        ticketAddMessage ({commit, dispatch, state}, args) {
            return post({dispatch, state}, 'help/ticket/{id}/message', args, function (res) {
                if (typeof res.data.error !== false) {
                    //commit('setTicketMessages', res.data)
                    return true
                }
            })
        },
        servicesList ({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'vps?page={page}&limit={limit}', args, function (res) {
                if (typeof res.data !== 'undefined') {
                    commit('setServices', res.data)
                }
            })
        },
        paginationList ({commit, dispatch, state}, args) {
            return get({dispatch, state}, '{url}?page={page}&limit={limit}', args, function (res) {
                if (typeof res.data !== 'undefined') {
                    if (res.data.error) {
                        res.data.paging = {}
                        res.data.paging.total_pages = 1
                    }
                    commit('setPagination', res.data)
                }
            })
        },
        vpsInfo ({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'vps/{id}', args, function (res) {
                if (typeof res.data.status !== 'undefined') {
                    if (typeof state.vps.status !== 'undefined' && state.vps.status === 'running') {
                        let s = res.data.uptime_s - state.vps.uptime_s
                        if (s > 0) {
                            let netInChange = res.data.net_in_b - state.vps.net_in_b
                            let netOutChange = res.data.net_out_b - state.vps.net_out_b
                            res.data.net_in_bps = netInChange / s
                            res.data.net_out_bps = netOutChange / s
                            if (state.vps.virt == 'kvm') {
                                let diskReadChange = res.data.disk_read_b - state.vps.disk_read_b
                                let diskWriteChange = res.data.disk_write_b - state.vps.disk_write_b
                                res.data.disk_read_bps = diskReadChange / s
                                res.data.disk_write_bps = diskWriteChange / s
                            }
                        } else {
                            res.data.net_in_bps = state.vps.net_int_bps
                            res.data.net_out_bps = state.vps.net_out_bps
                            if (state.vps.virt == 'kvm') {
                                res.data.disk_read_bps = state.vps.disk_read_bps
                                res.data.disk_write_bps = state.vps.disk_write_bps
                            }
                        }
                    } else {
                        res.data.net_in_bps = -1
                        res.data.net_out_bps = -1
                        res.data.disk_read_bps = -1
                        res.data.disk_write_bps = -1
                    }
                    res.data.ip = state.vps.ip
                    commit('setVps', res.data)
                }
            })
        },
        vpsOn ({commit, dispatch, state}, args) {
            return post({dispatch, state}, 'vps/{id}/on', args, function (res) {
                return true
            })
        },
        vpsOff ({commit, dispatch, state}, args) {
            return post({dispatch, state}, 'vps/{id}/off', args, function (res) {
                return true
            })
        },
        vpsIps({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'vps/{id}/ip', args, function (res) {
                commit('setVpsIps', res.data)
            })
        },
        vpsIpGameStatus({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'vps/{id}/ip/{ip}/game', args, function (res) {
                commit('setVpsIpGameStatus', res.data)
            })
        },
        vpsIpGameRules({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'vps/{id}/ip/{ip}/game/rule', args, function (res) {
                commit('setVpsIpGameRules', res.data)
            })
        },
        vpsChangeInfo({commit, dispatch, state}, args) {
            return put({dispatch, state}, 'vps/{id}', args, function (res) {
                state.vps.name = args.name
            })
        },
        profileInfo ({commit, dispatch, state}, args) {
            return get({dispatch, state}, 'me', {}, function (res) {
                if (typeof res.data.id !== 'undefined') {
                    commit('setProfile', res.data)
                }
            })
        }
    },
    mutations: {
        setVersion (state, newVersion) {
            state.version = newVersion
        },
        setToken (state, newToken) {
            state.token = newToken
        },
        setError (state, newErrorState) {
            state.error = newErrorState
        },
        setReCaptchaSiteKey (state, newKey) {
            state.reCaptchaSiteKey = newKey
        },
        setUsername (state, newUsername) {
            state.account.username = newUsername
        },
        setAccount (state, newAccount) {
            state.account = newAccount
        },
        setWallet (state, newWallet) {
            state.wallet = newWallet
        },
        setTicket (state, newTicket) {
            state.ticket = newTicket
        },
        setVps (state, newVps) {
            state.vps = newVps
        },
        setVpsIps(state, newIps) {
            state.vps.ip = {}
            state.vps.ip.main = newIps.main
            state.vps.ip.additional = newIps.additional
        },
        setVpsIpGameStatus(state, newStatus) {
            state.vpsip.status = newStatus
        },
        setVpsIpGameRules(state, newRules) {
            state.vpsip.rules = newRules
        },
        setProfile (state, newProfile) {
            state.profile = newProfile
        },
        setTicketMessages (state, newTicketMessages) {
            state.ticketMessages = newTicketMessages
        },
        setServices (state, newServices) {
            state.services = newServices
        },
        setPagination (state, newPagination) {
            state.pagination = newPagination
        },
        setToolbarTitle (state, newTitle) {
            state.toolbarTitle = newTitle
        },
        setToolbarTitleArgs (state, newTitleArgs) {
            state.toolbarTitleArgs = newTitleArgs
        },
        setLanguage (state, newLanguage) {
            state.language = newLanguage
            Vue.config.lang = newLanguage
        },
        setMeta(state, newMeta) {
            state.meta = newMeta
        },
        setLoading (state) {
            state.loading = true
        },
        setLoaded (state) {
            state.loading = false
        },
        setLogout(state, newLogout) {
            state.logout = newLogout
        },
        setTitle (state, newTitle) {
            document.title = newTitle
        },
        setDescription (state, newDescription) {
            document.head.querySelector('meta[name=description]').content = newDescription
        },
        setKeywords (state, newKeywords) {
            document.head.querySelector('meta[name=keywords]').content = newKeywords
        }
    }
})
