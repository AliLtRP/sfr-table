<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', size: number): void
}>()

const pageInput = ref(String(props.currentPage))
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.pageSize) || 1
})
const pageSizeInput = ref(String(props.pageSize))

watch(
  () => props.currentPage,
  (newPage) => {
    pageInput.value = String(newPage)
  },
)

watch(
  () => props.pageSize,
  (newSize) => {
    pageSizeInput.value = String(newSize)
  },
)

function firstPage() {
  emit('update:page', 1)
}

function prevPage() {
  if (props.currentPage > 1) {
    emit('update:page', props.currentPage - 1)
  }
}

function nextPage() {
  if (props.currentPage < totalPages.value) {
    emit('update:page', props.currentPage + 1)
  }
}

function lastPage() {
  emit('update:page', totalPages.value)
}

function goToPageInput() {
  const p = parseInt(pageInput.value)
  if (!isNaN(p) && p >= 1 && p <= totalPages.value) {
    emit('update:page', p)
  } else {
    pageInput.value = String(props.currentPage)
  }
}

function handlePageSizeInput() {
  const size = parseInt(pageSizeInput.value)
  if (!isNaN(size) && size > 0) {
    emit('update:pageSize', size)
  } else {
    pageSizeInput.value = String(props.pageSize)
  }
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 sm:px-4 space-y-3 sm:space-y-0 gap-2"
  >
    <!-- Page & Total -->
    <div class="text-xs sm:text-sm text-gray-700 order-1">
      Page <span class="font-semibold">{{ props.currentPage }}</span> of
      <span class="font-semibold">{{ totalPages }}</span>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-2 order-2 sm:order-2">
      <!-- Page Size Input -->
      <div class="flex items-center text-xs sm:text-sm">
        <span class="mr-1">Rows:</span>
        <input
          v-model="pageSizeInput"
          @keyup.enter="handlePageSizeInput"
          type="text"
          class="w-12 sm:w-16 px-1 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded text-center text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <!-- Navigation Buttons -->
      <button
        class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="props.currentPage === 1"
        @click="firstPage"
      >
        First
      </button>

      <button
        class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="props.currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>

      <div class="flex items-center space-x-1 text-xs sm:text-sm">
        <span class="hidden sm:inline">Go to</span>
        <input
          v-model="pageInput"
          @keyup.enter="goToPageInput"
          type="text"
          class="w-10 sm:w-14 px-1 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded text-center text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Page"
        />
      </div>

      <button
        class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="props.currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>

      <button
        class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="props.currentPage === totalPages"
        @click="lastPage"
      >
        Last
      </button>
    </div>
  </div>
</template>

<style scoped></style>
