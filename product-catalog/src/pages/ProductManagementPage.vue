<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductForm from '../components/ProductForm.vue'
import { useCounter } from '../composables/useCounter'
import { useProducts, type Product } from '../composables/useProduct'

const { count, increment, decrement } = useCounter()
const {
  products,
  editingId,
  productCount,
  totalValue,
  averageProductPrice,
  expensiveWarning,
  lastSaved,
  hasUnsavedChanges,
  saveAll,
  addProduct: addToProducts,
  updateProduct: updateInProducts,
  deleteProduct: removeFromProducts,
  clearAllProducts,
} = useProducts()

const testInput = ref<string>('')
const message = ref<string>('welcome to vue with typescript!')
const showmessage = ref<boolean>(false)
const warningmessage = ref<string>('raffff')
const subtitle = ref<string>('rah')

// Derive the product currently being edited (or null if none)
const currentEditingProduct = computed(() => {
  if (editingId.value === null) return null
  return products.value.find((p) => p.id === editingId.value) || null
})

function cancelEdit() {
  editingId.value = null
}

function startEditing(product: Product) {
  editingId.value = product.id
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Escape' && editingId.value !== null) {
    cancelEdit()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})

function handleCreateProduct(productData: Omit<Product, 'id'>) {
  addToProducts(productData)
}

function handleUpdateProduct(id: number, productData: Omit<Product, 'id'>) {
  updateInProducts(id, productData)
  cancelEdit()
}

function handleDeleteProduct(id: number) {
  if (editingId.value === id) {
    cancelEdit()
  }
  removeFromProducts(id)
}

function handleClearAll() {
  if (products.value.length === 0) return

  const confirmed = confirm('Are you sure you want to remove all products?')
  if (confirmed) {
    cancelEdit()
    clearAllProducts()
  }
}
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <p>{{ subtitle }}</p>
    <p>{{ count }}</p>

    <p v-if="count > 10 || count < -10" class="warningmessage">{{ warningmessage }}</p>
    <p v-if="count === 0">Start counting!</p>
    <p v-else-if="count > 0">The count is positive</p>
    <p v-else>The count is negative.</p>
    <p v-if="showmessage">this element is removed from the DOM WHEN FALSE</p>
    <p v-show="showmessage">this stays in dom but its hidden</p>

    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <button @click="count = 0">Reset</button>
    <button @click="showmessage = !showmessage">Toggle message</button>

    <div class="test-binding">
      <h3>Two-Way Binding Demo</h3>
      <input v-model="testInput" type="text" placeholder="Type something..." />
      <p>Current value: <strong>{{ testInput }}</strong></p>
    </div>

    <!-- Reusable Extracted Form Component -->
    <ProductForm
      :editing-product="currentEditingProduct"
      @create="handleCreateProduct"
      @update="handleUpdateProduct"
      @cancel="cancelEdit"
    />

    <!-- Computed Stats Dashboard -->
    <div class="stats">
      <div class="stat">
        <strong>Total Products:</strong> {{ productCount }}
      </div>
      <div class="stat">
        <strong>Total Value:</strong> ${{ totalValue.toFixed(2) }}
      </div>
      <div class="stat">
        <strong>Average Price:</strong> ${{ averageProductPrice.toFixed(2) }}
      </div>
      <div v-if="lastSaved" class="stat">
        <strong>Last saved:</strong> {{ lastSaved }}
      </div>
      <div v-if="expensiveWarning" class="expensive-banner">
        {{ expensiveWarning }}
      </div>
    </div>

    <div class="list-controls">
      <button :disabled="!hasUnsavedChanges" @click="saveAll">
        Save All
      </button>

      <button
        class="secondary"
        :disabled="products.length === 0"
        @click="handleClearAll"
      >
        Clear All Products
      </button>

      <span v-if="hasUnsavedChanges" class="unsaved-warning">
        ⚠️ You have unsaved changes
      </span>
    </div>

    <!-- Product Grid -->
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
        @delete="handleDeleteProduct"
        @edit="startEditing(product)"
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

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f8fafc;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius, 8px);
}

.stat {
  font-size: 1rem;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.expensive-banner {
  color: #c53030;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.list-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.unsaved-warning {
  color: #e53e3e;
  font-weight: 600;
}
</style>