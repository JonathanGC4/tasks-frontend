import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../plugins/axios'

export const useUsersStore = defineStore('users', () => {
    const users   = ref([])
    const loading = ref(false)

    async function fetchUsers() {
        loading.value = true
        try {
            const { data } = await api.get('/users')
            users.value = data.data
        } finally {
            loading.value = false
        }
    }

    async function createUser(userData) {
        const { data } = await api.post('/users', userData)
        users.value.unshift(data.data)
        return data.data
    }

    async function deleteUser(id) {
        await api.delete(`/users/${id}`)
        users.value = users.value.filter(u => u.id !== id)
    }

    return { users, loading, fetchUsers, createUser, deleteUser }
})