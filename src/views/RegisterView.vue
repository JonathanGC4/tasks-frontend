<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

            <div class="text-center mb-8">
                <div class="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-800">Crear cuenta</h1>
                <p class="text-gray-500 mt-1">Empieza a gestionar tus tareas</p>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {{ error }}
            </div>

            <div class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Juan Pérez"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="juan@example.com"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                        v-model="form.password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                    <input
                        v-model="form.password_confirmation"
                        type="password"
                        placeholder="Repite tu contraseña"
                        @keyup.enter="handleRegister"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <button
                    @click="handleRegister"
                    :disabled="loading"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition duration-200"
                >
                    <span v-if="loading">Creando cuenta...</span>
                    <span v-else>Crear cuenta</span>
                </button>
            </div>

            <p class="text-center text-gray-500 text-sm mt-6">
                ¿Ya tienes cuenta?
                <router-link to="/login" class="text-indigo-600 font-medium hover:underline">
                    Inicia sesión
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

const form = ref({
    name:                  '',
    email:                 '',
    password:              '',
    password_confirmation: '',
})

async function handleRegister() {
    if (!form.value.name || !form.value.email || !form.value.password) {
        toast.error('Por favor completa todos los campos.')
        return
    }

    if (form.value.password !== form.value.password_confirmation) {
        toast.error('Las contraseñas no coinciden.')
        return
    }

    loading.value = true
    error.value   = null

    try {
        await auth.register(form.value)
        toast.success('¡Cuenta creada exitosamente! 🎉')
        router.push('/dashboard')
    } catch (e) {
        error.value = e.response?.data?.message || 'Error al crear la cuenta.'
    } finally {
        loading.value = false
    }
}
</script>