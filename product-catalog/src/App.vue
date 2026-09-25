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

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
</style>