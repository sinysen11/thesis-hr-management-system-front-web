const state = {
  isValidToken: false
}

const mutations = {
  VERIFY_TOKEN: async (state, token) => {
		state.isValidToken = token
	}
}

const actions = {
	verifyToken({ commit }, token) {
		commit('VERIFY_TOKEN', token)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}