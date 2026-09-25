import { ref, computed } from 'vue'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

export function useProducts() {
  // Reactive State
  const products = ref<Product[]>([
    { id: 1, name: "Pen", price: 12.99, description: "Smooth gel ink rollerball", stock: 12, category: "Stationery" },
    { id: 2, name: "Book", price: 16.99, description: "Hardcover guide to Vue and TypeScript", stock: 3, category: "Books" },
    { id: 3, name: "Mug", price: 7.99, description: "Ceramic dishwasher-safe coffee mug", stock: 0, category: "Kitchenware" },
    { id: 4, name: "Headphones", price: 49.99, description: "Noise-isolating over-ear wired headphones", stock: 1, category: "Electronics" },
    { id: 5, name: "Notebook", price: 5.49, description: "Dotted grid journal for note taking", stock: 25, category: "Stationery" },
  ])

  const editingId = ref<number | null>(null)

  // Computed Properties
  const productCount = computed(() => products.value.length)

  const totalValue = computed(() => {
    return products.value.reduce((sum, p) => sum + p.price, 0)
  })

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
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts, // Exported here
  }


}