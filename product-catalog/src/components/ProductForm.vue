form:
<script setup lang="ts">
import {ref} from 'vue'

const newProductName = ref<string>('')
const newProductPrice = ref<number>(0)
const newProductDescription = ref<string>('')
const newProductStock = ref<number>(0)
const newProductCategory = ref<string>('')
const formError = ref('')

const emit = defineEmits<{
 add: [
    name: string,
    price: number,
    description: string,
    stock: number,
    category: string
]
}>()

function handleSubmit() {
 if (newProductName.value.trim() === '' || newProductPrice.value <= 0) {
    formError.value = 'Please fill in all fields'
 return
 }
 emit('add', 
    newProductName.value, 
    newProductPrice.value, 
    newProductDescription.value, 
    newProductStock.value, 
    newProductCategory.value)

  newProductName.value = ''
  newProductPrice.value = 0
  newProductDescription.value = ''
  newProductStock.value = 0
  newProductCategory.value = ''
  formError.value = ''
}

</script>

<template>
 <form @submit.prevent="handleSubmit">
    <!-- <h2>{{ editingId ? 'Edit Product' : 'Add New Product' }}</h2> -->

    <label>
      Product Name
      <input v-model="newProductName" type="text" />
    </label>

    <label>
      Price
      <input v-model.number="newProductPrice" type="number" />
    </label>

    <label>
      Description
      <input v-model="newProductDescription" type="text" />
    </label>

    <label>
      Stock
      <input v-model.number="newProductStock" type="number" />
    </label>

    <label>
      Category
      <select v-model="newProductCategory">
        <option disabled value="">--Please choose a category--</option>
        <option>School</option>
        <option>House</option>
        <option>Books</option>
      </select>
    </label>

    <button type="submit">Add Product</button>
      <!-- {{ editingId ? 'Update Product' : 'Add Product' }} -->

    <!-- <button type="button" v-if="editingId !== null" @click="cancelEdit">Cancel edit</button> -->

    <p v-if="formError" class="form-error">{{ formError }}</p>
  </form>
</template>

<style>
    .form-error {
    color: red;
    }
</style>