const state = {
    message: '',
    is_show: false,
    color: 'bg-green'
}

const mutations = {
    SHOW_HIDE(state, data) {
        state.message = data.msg
        state.is_show = data.is_show
        data.is_success ? state.color = 'bg-green' : state.color = 'bg-red'
    }
}

const actions = {
    showHide({ commit }, { is_success = false, msg = '', is_show, timeout = 1000 }) {
        commit('SHOW_HIDE', { is_success, msg, is_show })
        if (is_show) {
            setTimeout(function() {
                commit('SHOW_HIDE', false)
            }, timeout)
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
