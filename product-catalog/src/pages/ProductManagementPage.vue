<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductForm from '../components/ProductForm.vue'
onMounted(() => {
  console.log('onMounted is ready!')
  console.log('# products: ', products.value.length)
})

console.log('MY MESSAGE TOO SOON?!')
// console.log('# products: ', products.value.length)

import { useCounter } from '../composables/useCounter.ts'
import { useProducts } from '../composables/useProduct.ts'


const {
  products,
  editingId,
  productCount,
  totalValue,
  addProduct: addToProducts,
  updateProduct: updateInProducts,
  deleteProduct,
  lastSaved,
  hasUnsavedChanges,
} = useProducts()


const { count, increment, decrement } = useCounter()

console.log(count.value)
count.value = 5

function reset() {
  count.value = 0
}

// function updateProduct() {
//   // Validate
//   if (newProductName.value.trim() === '' || newProductPrice.value <= 0) {
//     formError.value = 'Please fill in all fields'
//     return
//   }

//   updateInProducts(
//     newProductName.value,
//     newProductPrice.value,
//     newProductDescription.value,
//     newProductStock.value,
//     newProductCategory.value,
//   )
//   // Reset form and exit edit mode
//   editingId.value = null
//   newProductName.value = ''
//   newProductPrice.value = 0
//   newProductDescription.value = ''
//   newProductStock.value = 0
//   newProductCategory.value = ''
//   formError.value = ''
// }

// function startEditing(product: Product) {
//   editingId.value = product.id
//   newProductName.value = product.name
//   newProductPrice.value = product.price
//   newProductDescription.value = product.description
//   newProductStock.value = product.stock
//   newProductCategory.value = product.category
// }

// function cancelEdit() {
//   editingId.value = null // or 0, depending on how you typed the ref()
//   newProductName.value = ''
//   newProductPrice.value = 0
//   newProductDescription.value = ''
//   newProductStock.value = 0
//   newProductCategory.value = ''
//   formError.value = ''
// }

function handleAdd(
  name: string,
  price: number,
  description: string,
  stock: number,
  category: string
) {
  addToProducts({
    name,
    price,
    description,
    stock,
    category,
  })
}


function saveAll() {
  localStorage.setItem('products', JSON.stringify(products.value))
  hasUnsavedChanges.value = false
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Escape' && editingId.value !== null) {
    // cancelEdit()
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
  console.log('Cleaned up keyboard listener')
})

interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}
</script>

<template>
  <div class="stats">
    <div class="stat"><strong>Products:</strong> {{ productCount }}</div>
    <div class="stat"><strong>Total Value:</strong> ${{ totalValue.toFixed(2) }}</div>
    <div v-if="lastSaved">Last saved: {{ lastSaved }}</div>
    <div>
      <p v-if="hasUnsavedChanges" class="warning">You have unsaved changes!</p>
      <button type="button" @click="saveAll">Save all</button>
    </div>
  </div>

  <div class="product-list">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :id="product.id"
      :name="product.name"
      :price="product.price"
      :description="product.description"
      :stock="product.stock"
      :category="product.category"
      @delete="deleteProduct"
    />
  </div>
    <ProductForm @add="handleAdd" />

</template>

<style scoped>
h1 {
  color: #42b983;
}

.warning {
  color: red;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.form-error {
  color: red;
}

.stat {
  margin: 1rem;
}
</style>