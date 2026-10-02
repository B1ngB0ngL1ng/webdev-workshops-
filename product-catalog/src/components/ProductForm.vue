<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '../composables/useProduct'

interface Props {
  editingProduct: Product | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [productData: Omit<Product, 'id'>]
  update: [id: number, productData: Omit<Product, 'id'>]
  cancel: []
}>()

// Local Form State
const newProductName = ref('')
const newProductPrice = ref(0)
const newProductDescription = ref('')
const newProductStock = ref(0)
const newProductCategory = ref('General')
const formError = ref('')

// Pre-fill form when entering edit mode or reset on exit
watch(
  () => props.editingProduct,
  (product) => {
    formError.value = ''
    if (product) {
      newProductName.value = product.name
      newProductPrice.value = product.price
      newProductDescription.value = product.description
      newProductStock.value = product.stock
      newProductCategory.value = product.category
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  newProductName.value = ''
  newProductPrice.value = 0
  newProductDescription.value = ''
  newProductStock.value = 0
  newProductCategory.value = 'General'
  formError.value = ''
}

function handleSubmit() {
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

  formError.value = ''

  const payload: Omit<Product, 'id'> = {
    name: newProductName.value.trim(),
    price: newProductPrice.value,
    description: newProductDescription.value.trim() || 'No description provided.',
    stock: newProductStock.value,
    category: newProductCategory.value.trim() || 'General',
  }

  if (props.editingProduct) {
    emit('update', props.editingProduct.id, payload)
  } else {
    emit('create', payload)
    resetForm()
  }
}

function handleCancel() {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <form class="product-form" @submit.prevent="handleSubmit">
    <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>

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
        {{ editingProduct ? 'Update Product' : 'Add Product' }}
      </button>
      <button
        v-if="editingProduct"
        type="button"
        class="secondary"
        @click="handleCancel"
      >
        Cancel edit
      </button>
    </div>

    <p v-if="formError" class="form-error">{{ formError }}</p>
  </form>
</template>

<style scoped>
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
</style>