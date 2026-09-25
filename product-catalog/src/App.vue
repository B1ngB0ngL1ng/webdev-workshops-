<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from './components/ProductCard.vue'
import { useCounter } from './composables/useCounter'
import { useProducts, type Product } from './composables/useProduct.ts'
// Use Composables
const { count, increment, decrement } = useCounter()
const {
  products,
  editingId,
  productCount,
  totalValue,
  averageProductPrice,
  addProduct: addToProducts,
  updateProduct: updateInProducts,
  deleteProduct: removeFromProducts,
  clearAllProducts,
} = useProducts()

// UI Form State
const newProductName = ref<string>('')
const newProductPrice = ref<number>(0)
const newProductDescription = ref<string>('')
const newProductStock = ref<number>(0)
const newProductCategory = ref<string>('General')
const formError = ref<string>('')

const testInput = ref<string>('')
const message = ref<string>('welcome to vue with typescript!')
const showmessage = ref<boolean>(false)
const warningmessage = ref<string>('raffff')
const subtitle = ref<string>('rah')

// Form Helpers
function cancelEdit() {
  editingId.value = null
  newProductName.value = ''
  newProductPrice.value = 0
  newProductDescription.value = ''
  newProductStock.value = 0
  newProductCategory.value = 'General'
  formError.value = ''
}

function startEditing(product: Product) {
  formError.value = ''
  editingId.value = product.id
  newProductName.value = product.name
  newProductPrice.value = product.price
  newProductDescription.value = product.description
  newProductStock.value = product.stock
  newProductCategory.value = product.category
}


  const confirmed = confirm('Are you sure you want to remove all products?')
  if (confirmed) {
    cancelEdit() // Reset form if in edit mode
    clearAllProducts()
  }


// UI Handlers (Validation + Composable Calls)
function handleAddProduct() {
  if (newProductName.value.trim() === '') {
    formError.value = 'Product name cannot be empty.'
    return
  }
  if (newProductPrice.value <= 0) {
    formError.value = 'Price must be greater than 0.'
    return
  }
  if (newProductStock.value < 0) {
    formError.value = 'Stock cannot be negative.'
    return
  }

  addToProducts({
    name: newProductName.value.trim(),
    price: newProductPrice.value,
    description: newProductDescription.value.trim() || 'No description provided.',
    stock: newProductStock.value,
    category: newProductCategory.value.trim() || 'General',
  })

  cancelEdit()
}

function handleUpdateProduct() {
  if (!editingId.value) return

  if (newProductName.value.trim() === '') {
    formError.value = 'Product name cannot be empty.'
    return
  }
  if (newProductPrice.value <= 0) {
    formError.value = 'Price must be greater than 0.'
    return
  }
  if (newProductStock.value < 0) {
    formError.value = 'Stock cannot be negative.'
    return
  }

  updateInProducts(editingId.value, {
    name: newProductName.value.trim(),
    price: newProductPrice.value,
    description: newProductDescription.value.trim() || 'No description provided.',
    stock: newProductStock.value,
    category: newProductCategory.value.trim() || 'General',
  })

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
    cancelEdit() // Reset form if in edit mode
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

    <!-- Use counter composable actions -->
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <button @click="count = 0">Reset</button>
    <button @click="showmessage = !showmessage">Toggle message</button>

    <div class="test-binding">
      <h3>Two-Way Binding Demo</h3>
      <input v-model="testInput" type="text" placeholder="Type something..." />
      <p>Current value: <strong>{{ testInput }}</strong></p>
    </div>

    <!-- Product Form -->
    <form class="product-form" @submit.prevent="editingId ? handleUpdateProduct() : handleAddProduct()">
      <h2>{{ editingId ? 'Edit Product' : 'Add New Product' }}</h2>

      <label>
        Product Name
        <input v-model="newProductName" type="text" placeholder="e.g. Ergonomic Keyboard" />
      </label>

      <label>
        Category
        <input v-model="newProductCategory" type="text" placeholder="e.g. Electronics, Books" />
      </label>

      <label>
        Price ($)
        <input v-model.number="newProductPrice" type="number" step="0.01" min="0" />
      </label>

      <label>
        Stock
        <input v-model.number="newProductStock" type="number" step="1" min="0" />
      </label>

      <label>
        Description
        <textarea v-model="newProductDescription" rows="2" placeholder="Brief product overview..."></textarea>
      </label>

      <div class="form-actions">
        <button type="submit">
          {{ editingId ? 'Update Product' : 'Add Product' }}
        </button>
        <button v-if="editingId" type="button" class="secondary" @click="cancelEdit">
          Cancel
        </button>
      </div>

      <p v-if="formError" class="form-error">{{ formError }}</p>
    </form>

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
    </div>
<div class="list-controls">
    <button 
      class="secondary" 
      :disabled="products.length === 0" 
      @click="handleClearAll"
    >
      Clear All Products
    </button>
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

.product-form {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--color-border, #ddd);
  border-radius: var(--radius, 8px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 450px;
}

.product-form label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-weight: 500;
}

.product-form textarea {
  resize: vertical;
  padding: 0.5rem;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.form-error {
  color: #e53e3e;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
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
</style>