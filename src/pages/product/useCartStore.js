// src/stores/useCartStore.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  actions: {
    addToCart(product) {
      this.items.push(product)
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
    },
    clearCart() {
      this.items = []
    },
  },
  getters: {
    totalBill: state => {
      return state.items.reduce((sum, item) => sum + item.price, 0)
    },
  },
})
