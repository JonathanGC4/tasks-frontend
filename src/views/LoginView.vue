<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

            <!-- Header -->
            <div class="text-center mb-8">
                <div class="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
                <p class="text-gray-500 mt-1">Inicia sesión en tu cuenta</p>
            </div>

            <!-- Error -->
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {{ error }}
            </div>

            <!-- Form -->
            <div class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="juan@example.com"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                        v-model="form.password"
                        type="password"
                        placeholder="••••••••"
                        @keyup.enter="handleLogin"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                </div>

                <button
                    @click="handleLogin"
                    :disabled="loading"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition duration-200"
                >
                    <span v-if="loading">Iniciando sesión...</span>
                    <span v-else>Iniciar sesión</span>
                </button>
            </div>

            <!-- Footer -->
            <p class="text-center text-gray-500 text-sm mt-6">
                ¿No tienes cuenta?
                <router-link to="/register" class="text-indigo-600 font-medium hover:underline">
                    Regístrate
                </router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const router  = useRouter()
const auth    = useAuthStore()
const toast   = useToastStore()
const loading = ref(false)
const error   = ref(null)

const form = ref({ email: '', password: '' })

async function handleLogin() {
    if (!form.value.email || !form.value.password) {
        toast.error('Por favor completa todos los campos.')
        return
    }

    loading.value = true
    error.value   = null

    try {
        await auth.login(form.value)
        toast.success('Bienvenido de vuelta 👋')
        router.push('/dashboard')
    } catch (e) {
        toast.error(e.response?.data?.message || 'Error al iniciar sesión.')
    } finally {
        loading.value = false
    }
}
</script>