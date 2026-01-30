import { computed, type Ref } from 'vue'
import type { InterfaceTableDataSource, UseTablePaginationReturn } from '../types'

/**
 * Composable for managing table pagination logic
 * Handles page changes and calculates paginated data slices
 *
 * @param currentPage - Reactive current page number from URL state
 * @param rowsPerPage - Reactive rows per page from URL state
 * @param dataLength - Computed total items count
 * @returns Object with pagination state and functions
 */
export function useTablePagination(urlState: {
  currentPage: Ref<number>
  rowsPerPage: Ref<number>
}): UseTablePaginationReturn {
  const { currentPage, rowsPerPage } = urlState

  const totalItems = computed(() => 0)

  /**
   * Paginate data based on current page and page size
   * Also returns total count for use in pagination controls
   */
  function paginateData(data: InterfaceTableDataSource[]): InterfaceTableDataSource[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(totalItems as any).value = data.length

    const totalPages = Math.ceil(data.length / rowsPerPage.value) || 1
    if (currentPage.value > totalPages) {
      currentPage.value = 1
    }

    const start = (currentPage.value - 1) * rowsPerPage.value
    return data.slice(start, start + rowsPerPage.value)
  }

  /**
   * Handle page change
   */
  function handlePageChange(page: number) {
    currentPage.value = page
  }

  /**
   * Handle page size change
   * Resets to page 1 when page size changes
   */
  function handlePageSizeChange(size: number) {
    rowsPerPage.value = size
    currentPage.value = 1
  }

  return {
    currentPage,
    rowsPerPage,
    totalItems,
    paginateData,
    handlePageChange,
    handlePageSizeChange,
  }
}
