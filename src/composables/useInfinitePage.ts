interface InfinitePageOptions {
  pageSize?: number
  data?: any[]
  dataRef?: Ref<any[]>
}

export function useInfinitePage(el: Ref<HTMLElement | undefined>, options: InfinitePageOptions = {}) {
  const {
    pageSize = 20,
    data,
    dataRef,
  } = options
  const loadedData = ref<any[]>([])
  const { reset } = useInfiniteScroll(
    el,
    () => {
      const loaded = loadedData.value.length
      if (data) {
        loadedData.value.push(...data.slice(loaded, loaded + pageSize))
      }
      else if (dataRef?.value) {
        loadedData.value.push(...dataRef.value.slice(loaded, loaded + pageSize))
      }
    },
    {
      distance: 100,
      canLoadMore: () => {
        if (data) {
          return loadedData.value.length < data.length
        }
        else if (dataRef?.value) {
          return loadedData.value.length < dataRef.value.length
        }
        return false
      },
    },
  )

  function resetList() {
    loadedData.value.length = 0
    reset()
  }

  return { data: loadedData, reset: resetList }
}
