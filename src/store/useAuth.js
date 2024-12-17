import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        refreshToken: null,
        user: null
    }),
    actions: {
        setTokens(accessToken, refreshToken) {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
        },
        setUser(user) {
            this.user = user
        },
        logout() {
            this.accessToken = null
            this.refreshToken = null
            this.user = null
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.accessToken
    }
})