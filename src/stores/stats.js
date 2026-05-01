import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../plugins/axios'

export const useStatsStore = defineStore('stats', () => {
    const stats   = ref(null)
    const loading = ref(false)

    async function fetchStats() {
        loading.value = true
        try {
            const { data } = await api.get('/stats')
            stats.value = data.data
        } finally {
            loading.value = false
        }
    }

    return { stats, loading, fetchStats }
})