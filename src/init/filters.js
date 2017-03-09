import Vue from 'vue'
import moment from 'moment'

Vue.filter('prettyDateFormat', function (uts) {
    return moment.unix(uts).format("DD.MM.YYYY")
})
Vue.filter('prettyDateFrom', function (uts) {
    return moment.unix(uts).from()
})
Vue.filter('prettyDateTime', function (uts) {
    return moment.unix(uts).format("HH:mm DD.MM.YYYY")
})
