<!-- ./Chart.vue -->
<template>
  <VDialog
    v-model="dialog"
    max-width="500"
  >
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        prepend-icon="tabler-shopping-cart"
        color="info"
      >
        Cart ({{ cartItems.length }})
      </VBtn>
    </template>

    <VCard elevation="5" class="pa-4">
      <h3>Keranjang Belanja</h3>
      <ul>
        <li
          v-for="item in cartItems"
          :key="item.id"
        >
          {{ item.name }} - Rp{{ item.price.toLocaleString() }}
        </li>
      </ul>
      <h4>Total: Rp{{ totalBill.toLocaleString() }}</h4>
      <div class="d-flex justify-end mt-4">
        <VBtn
          color="error"
          @click="clearCart"
        >
          Clear Cart
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from './useCartStore'

const dialog = ref(false)

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const totalBill = computed(() => cartStore.totalBill)

const clearCart = () => {
  cartStore.clearCart()
}
</script>
