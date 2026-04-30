import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../plugins/axios'

export const useAuthStore = defineStore('auth', () => {
    const user  = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('token') || null)

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin         = computed(() => user.value?.role === 'admin')
    const isEmployee      = computed(() => user.value?.role === 'employee')

    async function register(credentials) {
        const { data } = await api.post('/register', credentials)
        setAuth(data)
        return data
    }

    async function login(credentials) {
        const { data } = await api.post('/login', credentials)
        setAuth(data)
        return data
    }

    async function logout() {
        await api.post('/logout')
        clearAuth()
    }

    function setAuth(data) {
        user.value  = data.user
        token.value = data.access_token
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    function clearAuth() {
        user.value  = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return { user, token, isAuthenticated, isAdmin, isEmployee, register, login, logout }
})