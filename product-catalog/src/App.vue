<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from './components/ProductCard.vue'

interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

const products = ref<Product[]>([
  { id: 1, name: "Pen", price: 12.99, description: "Smooth gel ink rollerball", stock: 12, category: "Stationery" },
  { id: 2, name: "Book", price: 16.99, description: "Hardcover guide to Vue and TypeScript", stock: 3, category: "Books" },
  { id: 3, name: "Mug", price: 7.99, description: "Ceramic dishwasher-safe coffee mug", stock: 0, category: "Kitchenware" },
  { id: 4, name: "Headphones", price: 49.99, description: "Noise-isolating over-ear wired headphones", stock: 1, category: "Electronics" },
  { id: 5, name: "Notebook", price: 5.49, description: "Dotted grid journal for note taking", stock: 25, category: "Stationery" },
])

const testInput = ref<string>('')
const formError = ref<string>('')
// Form State
const newProductName = ref<string>('')
const newProductPrice = ref<number>(0)

function addProduct() {
  // Validate input
  if (newProductName.value.trim() === '') {
    formError.value = 'Product name cannot be empty.'
    return
  }

  if (newProductPrice.value <= 0) {
    formError.value = 'Price must be greater than 0.'
    return
  }

  // Clear previous error on success
  formError.value = ''

  const newProduct: Product = {
    id: Date.now(),
    name: newProductName.value.trim(),
    price: newProductPrice.value,
    description: 'No description provided.',
    stock: 1,
    category: 'General',
  }

  products.value.push(newProduct)

  // Reset inputs
  newProductName.value = ''
  newProductPrice.value = 0
}

function deleteProduct(id: number) {
  products.value = products.value.filter(p => p.id !== id)
}

function handleEdit(id: number) {
  alert(`Edit requested for product ID: ${id}`)
}

const message = ref<string>('welcome to vue with typescript!')
const showmessage = ref<boolean>(false)
const warningmessage = ref<string>("raffff")
const subtitle = ref<string>('rah')
const count = ref<number>(0)
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <p>{{ subtitle }}</p>
    <p>{{ count }}</p>

    <p class="warningmessage" v-if="count > 10 || count < -10">{{ warningmessage }}</p>
    <p v-if="count === 0">Start counting!</p>
    <p v-else-if="count > 0">The count is positive</p>
    <p v-else>The count is negative.</p>
    <p v-if="showmessage">this element is removed from the DOM WHEN FALSE</p>
    <p v-show="showmessage">this stays in dom but its hidden</p>

    <button @click="count++">Increment</button>
    <button @click="count--">Decrement</button>
    <button @click="count = 0">Reset</button>
    <button @click="showmessage = !showmessage">Toggle message</button>

    <div class="test-binding">
      <h3>Two-Way Binding Demo</h3>
      <input v-model="testInput" type="text" placeholder="Type something..." />
      <p>Current value: <strong>{{ testInput }}</strong></p>
    </div>

    <!-- Create Product Form -->
    <form class="product-form" @submit.prevent="addProduct">
      <h2>Add New Product</h2>

      <label>
        Product Name
        <input v-model="newProductName" type="text" placeholder="e.g. Ergonomic Keyboard" />
      </label>

      <label>
        Price
        <input v-model.number="newProductPrice" type="number" step="0.01" min="0" />
      </label>

      <button type="submit">Add Product</button>
      <p v-if="formError" class="form-error">{{ formError }}</p>
    </form>

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
        @edit="handleEdit"
      />
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #42b982;
}

.warningmessage {
  color: red;
}

.test-binding {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px dashed #42b982;
  border-radius: 8px;
}

.product-form {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--color-border, #ddd);
  border-radius: var(--radius, 8px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.form-error {
  color: #e53e3e;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}
</style>