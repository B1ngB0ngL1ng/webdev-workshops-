// composables/useCounter.ts
import { ref } from 'vue'

export function useCounter() {
  const count = ref<number>(0)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return { count, increment, decrement }
}