<script setup lang="ts">
interface Props {
  id: number
  name: string
  price: number
  description: string
  stock: number
  category: string
}

defineProps<Props>()

const emit = defineEmits<{
  delete: [id: number]
  edit: [id: number]
}>()
</script>

<template>
  <div class="product-card">
    <div class="header">
      <span class="badge">{{ category }}</span>
      <h3>{{ name }}</h3>
    </div>

    <p>${{ price.toFixed(2) }}</p>
    <p>{{ description }}</p>

    <!-- Stock Status Indicator -->
    <p v-if="stock === 0" class="stock-status out-of-stock">Out of Stock</p>
    <p v-else-if="stock < 5" class="stock-status low-stock">Low Stock ({{ stock }} left)</p>
    <p v-else class="stock-status in-stock">In Stock: {{ stock }}</p>

    <!-- Action Buttons -->
    <div class="actions">
      <button @click="emit('edit', id)">Edit</button>
      <button class="secondary" @click="emit('delete', id)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid var(--color-border, #ddd);
  border-radius: var(--radius, 8px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background-color: #e2e8f0;
  color: #4a5568;
}

.stock-status {
  font-weight: 600;
  margin: 0;
}

.out-of-stock {
  color: #e53e3e;
}

.low-stock {
  color: #dd6b20;
}

.in-stock {
  color: #38a169;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}
</style>