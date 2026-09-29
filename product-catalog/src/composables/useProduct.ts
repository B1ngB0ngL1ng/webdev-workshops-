import { ref, computed, watch } from 'vue'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

// export function useProducts() {
//   // Reactive State
//   const products = ref<Product[]>([
//     { id: 1, name: "Pen", price: 12.99, description: "Smooth gel ink rollerball", stock: 12, category: "Stationery" },
//     { id: 2, name: "Book", price: 16.99, description: "Hardcover guide to Vue and TypeScript", stock: 3, category: "Books" },
//     { id: 3, name: "Mug", price: 7.99, description: "Ceramic dishwasher-safe coffee mug", stock: 0, category: "Kitchenware" },
//     { id: 4, name: "Headphones", price: 49.99, description: "Noise-isolating over-ear wired headphones", stock: 1, category: "Electronics" },
//     { id: 5, name: "Notebook", price: 5.49, description: "Dotted grid journal for note taking", stock: 25, category: "Stationery" },
//   ])

  export function useProducts() {
  // Reactive State
  const products = ref<Product[]>(JSON.parse(localStorage.getItem('products') || '[]'))
watch(products, (latest) => {
 localStorage.setItem('products', JSON.stringify(latest))
 lastSaved.value = new Date().toLocaleTimeString()
}, { deep: true})
watch(
 () => products.value.find(p => p.price > 1000),
 (expensiveProduct) => {
 if (expensiveProduct) {
 console.log('Expensive product detected:', expensiveProduct.name)
 }
 }
)
const expensiveProduct = computed(() => {
  return products.value.find(p => p.price > 1000)
})

const expensiveWarning = computed(() => {
  if (!expensiveProduct.value) return null
  return `Warning: High-value item detected — "${expensiveProduct.value.name}" is listed at $${expensiveProduct.value.price.toFixed(2)}.`
})
  
  const lastSaved = ref<string | null>(null)
  const editingId = ref<number | null>(null)
// Exercise 2 State: Track unsaved changes
  const hasUnsavedChanges = ref<boolean>(false)

  // Exercise 2 Watcher: Detect modifications to products and mark as dirty
  watch(
    products,
    () => {
      hasUnsavedChanges.value = true
    },
    { deep: true }
  )

  // Exercise 2 Function: Save to localStorage and clear dirty state
  function saveAll() {
    localStorage.setItem('products', JSON.stringify(products.value))
    lastSaved.value = new Date().toLocaleTimeString()
    hasUnsavedChanges.value = false
  }
  // Computed Properties
  const productCount = computed(() => products.value.length)

const totalValue = computed(() => {
  return products.value.reduce((sum, p) => sum + p.price * p.stock, 0)
})
  watch(
  () => totalValue.value,
  (newTotal, oldTotal) => {
    if (newTotal > 5000) {
      console.log(`High inventory value alert! Total: $${newTotal.toFixed(2)} (was $${oldTotal?.toFixed(2) ?? 0})`)
    }
  }
)

  const averageProductPrice = computed(() => {
    if (products.value.length === 0) return 0
    return totalValue.value / productCount.value
  })

  // Pure Data Operations (No UI alerts or form resets here)
  function addProduct(productData: Omit<Product, 'id'>) {
    const newProduct: Product = {
      id: Date.now(),
      ...productData,
    }
    products.value.push(newProduct)
  }

  function updateProduct(id: number, updatedData: Omit<Product, 'id'>) {
    const product = products.value.find(p => p.id === id)
    if (product) {
      product.name = updatedData.name
      product.price = updatedData.price
      product.description = updatedData.description
      product.stock = updatedData.stock
      product.category = updatedData.category
    }
  }

  function deleteProduct(id: number) {
    products.value = products.value.filter(p => p.id !== id)
  }

  function clearAllProducts() {
    products.value = []
  }

  return {
    products,
    editingId,
    productCount,
    totalValue,
    averageProductPrice,
    lastSaved,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    expensiveWarning,
    hasUnsavedChanges, // Exported for Exercise 2
    saveAll,
  }


}