<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { InterfaceTableColumn, InterfaceTableDataSource, TableConfig } from '../types'
import TablePagination from './TablePagination.vue'
import { useTableUrlState } from '../composables/useTableUrlState'
import { useTableSorting } from '../composables/useTableSorting'
import { useTableFiltering } from '../composables/useTableFiltering'
import { useTablePagination } from '../composables/useTablePagination'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-vue-next'

// Props
const props = defineProps({
  columns: {
    type: Array as PropType<InterfaceTableColumn[]>,
    default: () => [],
  },
  dataSource: {
    type: Array as PropType<InterfaceTableDataSource[]>,
    default: () => [],
  },
  config: {
    type: Object as PropType<TableConfig>,
    default: () => ({
      sortableColumns: ['name', 'date'],
      searchableFields: ['name', 'phone', 'address'],
      dateFields: ['date'],
    }),
  },
})

// URL-synced state
const urlState = useTableUrlState()

// Composables handle all business logic
const sorting = useTableSorting(
  urlState.sortRules,
  props.config.sortableColumns,
  props.config.dateFields,
)
const filtering = useTableFiltering(urlState.searchQuery, props.config.searchableFields)
const pagination = useTablePagination(urlState)

// Data pipeline: filter → sort → paginate
const filteredData = computed(() => filtering.filterData(props.dataSource))
const sortedData = computed(() => sorting.sortData(filteredData.value))
const paginatedData = computed(() => pagination.paginateData(sortedData.value))

// Expose computed total for pagination component
const totalItems = computed(() => sortedData.value.length)
</script>

<template>
  <!-- Filter Control Panel -->
  <div class="mb-4">
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <!-- Search Input -->
      <div class="mb-2">
        <label for="search-input" class="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          id="search-input"
          v-model="filtering.searchQuery.value"
          type="text"
          placeholder="Search name, phone or address..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Sort Mode -->
      <div class="pt-3 border-t border-gray-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">Sort Mode</label>
        <div class="inline-flex rounded-md shadow-sm w-full" role="group">
          <button
            type="button"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium border rounded-l-md transition-colors',
              sorting.sortMode.value === 'replace'
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
            ]"
            @click="sorting.handleSortModeChange('replace')"
          >
            Replace
          </button>
          <button
            type="button"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium border border-l-0 rounded-r-md transition-colors',
              sorting.sortMode.value === 'add'
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
            ]"
            @click="sorting.handleSortModeChange('add')"
          >
            Add Within Groups
          </button>
        </div>
      </div>

      <!-- Mobile Sort Controls - Only visible on small screens -->
      <div class="block sm:hidden mt-4 pt-4 border-t border-gray-200">
        <label class="block text-sm font-medium text-gray-700 mb-2"> Sort By </label>
        <div class="space-y-2">
          <!-- Name Sort -->
          <button
            type="button"
            @click="sorting.handleSort('name')"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm transition-colors',
              sorting.sortRules.value.some((r) => r.key === 'name')
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            ]"
          >
            <span class="font-medium">Name</span>
            <span class="text-xs flex items-center gap-1">
              <template v-if="sorting.sortRules.value.find((r) => r.key === 'name')">
                <span
                  v-if="sorting.sortRules.value.find((r) => r.key === 'name')!.order === 'asc'"
                  class="flex items-center gap-1"
                >
                  <ArrowUp :size="14" /> Ascending
                </span>
                <span v-else class="flex items-center gap-1">
                  <ArrowDown :size="14" /> Descending
                </span>
              </template>
              <span v-else class="opacity-50">Tap to sort</span>
            </span>
          </button>

          <!-- Date Sort -->
          <button
            type="button"
            @click="sorting.handleSort('date')"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm transition-colors',
              sorting.sortRules.value.some((r) => r.key === 'date')
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            ]"
          >
            <span class="font-medium">Date</span>
            <span class="text-xs flex items-center gap-1">
              <template v-if="sorting.sortRules.value.find((r) => r.key === 'date')">
                <span
                  v-if="sorting.sortRules.value.find((r) => r.key === 'date')!.order === 'asc'"
                  class="flex items-center gap-1"
                >
                  <ArrowUp :size="14" /> Ascending
                </span>
                <span v-else class="flex items-center gap-1">
                  <ArrowDown :size="14" /> Descending
                </span>
              </template>
              <span v-else class="opacity-50">Tap to sort</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="sorting.sortRules.value.length > 0" class="pt-3 border-t border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Active Sorts</span>
          <button
            type="button"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium"
            @click="sorting.clearAllSorts"
          >
            Clear All
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(rule, idx) in sorting.sortRules.value"
            :key="rule.key"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
          >
            <span class="font-semibold">{{ idx + 1 }}.</span>
            {{ rule.key }}
            <ArrowUp v-if="rule.order === 'asc'" :size="12" />
            <ArrowDown v-else :size="12" />
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll wrapper for responsiveness -->
  <div class="overflow-x-auto sm:rounded-lg">
    <table class="min-w-full table-auto border-collapse text-sm sm:text-base responsive-table">
      <thead class="bg-gray-200 text-gray-700">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2 sm:px-4 sm:py-3 font-semibold border-b border-r border-gray-300 cursor-pointer select-none text-xs sm:text-sm"
            @click="sorting.handleSort(col.dataIndex)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ col.title }}</span>
              <span v-if="config.sortableColumns.includes(col.dataIndex)">
                <span v-for="r in sorting.sortRules.value" :key="r.key">
                  <template v-if="r.key === col.dataIndex">
                    <ArrowUp v-if="r.order === 'asc'" :size="16" />
                    <ArrowDown v-else :size="16" />
                  </template>
                </span>
                <ArrowUpDown
                  v-if="!sorting.sortRules.value.some((r) => r.key === col.dataIndex)"
                  :size="16"
                  class="opacity-50"
                />
              </span>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, index) in paginatedData"
          :key="index"
          class="hover:bg-gray-50 sm:hover:bg-gray-100 transition-colors"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            :data-label="col.title"
            class="px-3 py-2 sm:px-4 sm:py-3 border-b border-r border-gray-300 text-xs sm:text-sm wrap-break-word sm:break-normal"
          >
            {{ row[col.dataIndex] }}
          </td>
        </tr>

        <!-- No Results -->
        <tr v-if="paginatedData.length === 0">
          <td :colspan="columns.length" class="text-center py-4 text-gray-500">
            No matching records
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <TablePagination
    :currentPage="pagination.currentPage.value"
    :totalItems="totalItems"
    :pageSize="pagination.rowsPerPage.value"
    @update:page="pagination.handlePageChange"
    @update:pageSize="pagination.handlePageSizeChange"
  />
</template>

<style scoped>
/* Mobile Card Layout - Transform table into stacked cards on small screens */
@media (max-width: 639px) {
  .responsive-table {
    border: none;
  }

  .responsive-table thead {
    display: none;
  }

  .responsive-table,
  .responsive-table tbody,
  .responsive-table tr,
  .responsive-table td {
    display: block;
  }

  .responsive-table tr {
    margin-bottom: 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  .responsive-table tr:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }

  .responsive-table td {
    border: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 1rem;
    text-align: left;
    position: relative;
    padding-left: 50%;
  }

  .responsive-table td:last-child {
    border-bottom: none;
  }

  .responsive-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 1rem;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
  }
}

/* Tablet and Desktop Optimizations */
@media (min-width: 640px) {
  .responsive-table {
    border: 1px solid #d1d5db;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px 0 rgb(0 0 0 / 0.06);
  }

  .responsive-table th {
    white-space: nowrap;
  }

  .responsive-table th:last-child,
  .responsive-table td:last-child {
    border-right: none;
  }

  .responsive-table td {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* Desktop Large Screens */
@media (min-width: 1024px) {
  .responsive-table td {
    max-width: 300px;
    white-space: nowrap;
  }
}
</style>
