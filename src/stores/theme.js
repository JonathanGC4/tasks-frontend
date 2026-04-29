import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(localStorage.getItem('theme') === 'dark')

    // Aplica la clase al arrancar
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    }

    function toggle() {
        isDark.value = !isDark.value
        if (isDark.value) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    return { isDark, toggle }
})