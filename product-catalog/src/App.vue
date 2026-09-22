<script setup lang="ts">
import { ref } from 'vue'

const message = ref<string>('welcome to vue with typescript!')
const showmessage = ref<boolean>()
const warningmessage = ref<string>("raffff")
const subtitle = ref<string>('rah')
const count = ref<number>(0)
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <p>{{ subtitle }}</p>
    <p>{{ count }}</p>

    <p class="warningmessage" v-if="count > 10 || count < -10"> {{warningmessage}}</p>
    <p v-if="count === 0">Start counting!</p>
    <p v-else-if="count > 0">The count is positive</p>
    <p v-else>The count is negative.</p>
    <p v-if="showmessage"> this element is removed from the DOM WHEN FALSE</p>
    <p v-show="showmessage"> this stays in dom but its hidden</p>

    <button @click="count++">Increment</button>
    <button @click="count--">Decrement</button>
    <button @click="count = 0">Reset</button>
    <button @click="showmessage = !showmessage">
  Toggle message
</button>

  </div>
</template>

<style scoped>
h1 {
  color: #42b982;
}
.warningmessage{
  color: red;

}

</style>
