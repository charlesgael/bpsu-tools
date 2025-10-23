export function useRefresh(watched: Ref<any>) {
  const state = ref(true)
  function refresh() {
    state.value = false
    nextTick(() => {
      state.value = true
    })
  }
  watch(watched, refresh)
  return state
}
