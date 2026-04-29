import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
    const toasts = ref([])

    function add({ type = 'info', title = '', message, duration = 3000 }) {
        const id = Date.now()

        toasts.value.push({ id, type, title, message, progress: 100 })

        // Barra de progreso
        const interval = setInterval(() => {
            const toast = toasts.value.find(t => t.id === id)
            if (toast) {
                toast.progress -= 2
            }
        }, duration / 50)

        // Auto eliminar
        setTimeout(() => {
            clearInterval(interval)
            remove(id)
        }, duration)
    }

    function remove(id) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    // Helpers
    const success = (message, title = '¡Éxito!')  => add({ type: 'success', title, message })
    const error   = (message, title = 'Error')     => add({ type: 'error',   title, message })
    const info    = (message, title = 'Info')      => add({ type: 'info',    title, message })
    const warning = (message, title = 'Atención')  => add({ type: 'warning', title, message })

    return { toasts, add, remove, success, error, info, warning }
})