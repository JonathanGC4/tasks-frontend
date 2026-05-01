<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

        <!-- Navbar -->
        <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div class="max-w-5xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <router-link to="/dashboard"
                        class="text-gray-400 hover:text-indigo-600 transition text-sm">
                        ← Dashboard
                    </router-link>
                    <span class="text-gray-300">|</span>
                    <span class="font-bold text-gray-800 dark:text-white">Estadísticas</span>
                </div>
                <span class="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-medium">
                    Admin
                </span>
            </div>
        </nav>

        <div class="max-w-5xl mx-auto px-6 py-8">

            <!-- Loading -->
            <div v-if="statsStore.loading" class="text-center py-16 text-gray-400">
                Cargando estadísticas...
            </div>

            <template v-else-if="statsStore.stats">

                <!-- Cards resumen -->
                <div class="grid grid-cols-3 gap-4 mb-8">
                    <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Total tareas</p>
                        <p class="text-3xl font-bold text-gray-800 dark:text-white mt-1">{{ totalTasks }}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Completadas</p>
                        <p class="text-3xl font-bold text-green-500 mt-1">
                            {{ statsStore.stats.by_status.completed }}
                            <span class="text-sm font-normal text-gray-400">
                                ({{ completionRate }}%)
                            </span>
                        </p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-red-100 dark:border-red-900">
                        <p class="text-red-400 text-sm">Vencidas</p>
                        <p class="text-3xl font-bold text-red-500 mt-1">{{ statsStore.stats.by_status.overdue }}</p>
                    </div>
                </div>

                <!-- Gráficas -->
                <div class="grid grid-cols-2 gap-6 mb-6">

                    <!-- Donut — por estado -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 class="font-bold text-gray-800 dark:text-white mb-4">Tareas por estado</h3>
                        <div class="flex items-center justify-center h-56">
                            <canvas ref="donutRef"></canvas>
                        </div>
                    </div>

                    <!-- Barras — por employee -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 class="font-bold text-gray-800 dark:text-white mb-4">Tareas por employee</h3>
                        <div class="h-56">
                            <canvas ref="barRef"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Línea — última semana -->
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 class="font-bold text-gray-800 dark:text-white mb-4">Tareas creadas — últimos 7 días</h3>
                    <div class="h-56">
                        <canvas ref="lineRef"></canvas>
                    </div>
                </div>

            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStatsStore } from '../../stores/stats'

Chart.register(...registerables)

const statsStore = useStatsStore()
const donutRef   = ref(null)
const barRef     = ref(null)
const lineRef    = ref(null)

let donutChart = null
let barChart   = null
let lineChart  = null

const totalTasks = computed(() => {
    if (!statsStore.stats) return 0
    const { pending, completed } = statsStore.stats.by_status
    return (pending || 0) + (completed || 0)
})

const completionRate = computed(() => {
    if (!totalTasks.value) return 0
    return Math.round((statsStore.stats.by_status.completed / totalTasks.value) * 100)
})

function buildCharts() {
    const stats = statsStore.stats
    if (!stats) return

    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? '#9ca3af' : '#6b7280'

    // Destruir charts anteriores si existen
    donutChart?.destroy()
    barChart?.destroy()
    lineChart?.destroy()

    // 🍩 Donut — por estado
    donutChart = new Chart(donutRef.value, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'Completadas', 'Vencidas'],
            datasets: [{
                data: [
                    stats.by_status.pending,
                    stats.by_status.completed,
                    stats.by_status.overdue,
                ],
                backgroundColor: ['#f59e0b', '#22c55e', '#ef4444'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, padding: 16, font: { size: 12 } }
                }
            }
        }
    })

    // 📊 Barras — por employee
    barChart = new Chart(barRef.value, {
        type: 'bar',
        data: {
            labels: stats.by_employee.map(e => e.name),
            datasets: [{
                label: 'Tareas asignadas',
                data:  stats.by_employee.map(e => e.total),
                backgroundColor: '#6366f1',
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor, stepSize: 1 },
                    grid:  { color: isDark ? '#374151' : '#f3f4f6' }
                },
                x: {
                    ticks: { color: textColor },
                    grid:  { display: false }
                }
            }
        }
    })

    // 📈 Línea — última semana
    lineChart = new Chart(lineRef.value, {
        type: 'line',
        data: {
            labels: Object.keys(stats.last_week).map(d =>
                new Date(d).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
            ),
            datasets: [{
                label: 'Tareas creadas',
                data:  Object.values(stats.last_week),
                borderColor:     '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor, stepSize: 1 },
                    grid:  { color: isDark ? '#374151' : '#f3f4f6' }
                },
                x: {
                    ticks: { color: textColor },
                    grid:  { display: false }
                }
            }
        }
    })
}

onMounted(async () => {
    await statsStore.fetchStats()
    buildCharts()
})

// Reconstruir si cambia el tema
watch(
    () => document.documentElement.classList.contains('dark'),
    () => buildCharts()
)
</script>