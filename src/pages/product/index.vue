<script setup>
import axiosIns from "@/plugins/axios"
import { ref, watchEffect, computed } from "vue"
import { useToast } from "vue-toastification"

import Chart from './chart.vue'
import { useCartStore } from './useCartStore'

// State
const products = ref([])

// Store
const cartStore = useCartStore()

// Computed
const totalBill = computed(() => cartStore.totalBill)

// Fungsi
const fetchProduct = async () => {
  try {
    const ret = await axiosIns.get("/product")

    products.value = ret.data.data
  } catch (error) {
    console.log(error)
    toast.error("Failed to load product data")
  }
}

const addToCart = product => {
  cartStore.addToCart(product)
}

const removeFromCart = productId => {
  cartStore.removeFromCart(productId)
}

watchEffect(() => {
  fetchProduct()
})

const toast = useToast()
</script>

<template>
  <div class="pa-5">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h2>Products</h2>
      <div>
        <VBtn
          color="primary"
          class="mx-2"
        >
          + Add Category
        </VBtn>
        <VBtn color="secondary">
          + Add Product
        </VBtn>
        <!-- Gunakan Chart dengan activator tombol bawaan -->
        <Chart />
      </div>
    </div>

    <!-- Grid Produk -->
    <VRow>
      <VCol
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <VCard
          elevation="4"
          class="pa-4 d-flex flex-column justify-space-between"
          height="250"
        >
          <i
            class="mdi mdi-silverware-fork-knife"
            style="font-size: 64px; color: #A8AAAE;"
          />
          <div class="mt-4">
            <h4>{{ product.name }}</h4>
            <p>Rp {{ product.price.toLocaleString() }}</p>
          </div>
          <div class="d-flex justify-space-between mt-auto">
            <VBtn
              color="success"
              small
              @click="addToCart(product)"
            >
              Add to Cart
            </VBtn>
            <VBtn
              color="error"
              small
              @click="removeFromCart(product.id)"
            >
              Delete
            </VBtn>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- Total Billing -->
    <div class="mt-8 text-center">
      <VCard
        color="blue lighten-5"
        class="pa-5"
      >
        <h3>Total Bill: Rp {{ totalBill.toLocaleString() }}</h3>
      </VCard>
    </div>
  </div>
</template>
