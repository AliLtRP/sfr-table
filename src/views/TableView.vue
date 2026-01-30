<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Table from '@/components/table/components/Table.vue'
import type {
  InterfaceTableColumn,
  InterfaceTableDataSource,
  TableConfig,
} from '@/components/table/types'

const columns: InterfaceTableColumn[] = [
  { key: 'id', title: 'User ID', dataIndex: 'id', className: 'text-left' },
  { key: 'name', title: 'Name of the User', dataIndex: 'name', className: 'text-left' },
  {
    key: 'registered',
    title: 'Date of Registration',
    dataIndex: 'date',
    className: 'text-center',
  },
  { key: 'address', title: 'Address', dataIndex: 'address', className: 'text-left' },
  { key: 'phone', title: 'Phone Number', dataIndex: 'phone', className: 'text-center' },
]

const data = ref<InterfaceTableDataSource[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { default: tableData } = await import('@/records.json')
    data.value = tableData
  } catch (error) {
    console.error('Failed to load table data:', error)
  } finally {
    loading.value = false
  }
})

const tableConfig: TableConfig = {
  sortableColumns: ['name', 'date'],
  searchableFields: ['name', 'phone', 'address'],
  dateFields: ['date'],
}
</script>

<template>
  <div
    class="h-full w-full flex flex-col justify-start items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10"
  >
    <div class="w-full max-w-[95%] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20 space-y-4"
        role="status"
        aria-live="polite"
      >
        <div
          class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        ></div>
        <p class="text-gray-600 text-sm font-medium">Loading table data...</p>
      </div>

      <!-- Table Content -->
      <Table v-else :columns="columns" :data-source="data" :config="tableConfig" />
    </div>
  </div>
</template>
