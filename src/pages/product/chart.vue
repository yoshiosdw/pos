<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from './useCartStore'
import Swal from 'sweetalert2'

const dialog = ref(false)

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const totalBill = computed(() => cartStore.totalBill)

const closeDialog = () => {
  dialog.value = false
}

const removeItem = id => {
  cartStore.removeFromCart(id)
}

const payBill = async () => {
  const result = await Swal.fire({
    title: 'Are you sure to pay?',
    text: `Total: Rp${totalBill.value.toLocaleString()}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Pay Now!',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'v-btn v-btn--outlined v-btn--variant-outlined v-btn--density-default v-btn--size-default v-btn--rounded text-primary border-primary mx-2',
      cancelButton: 'v-btn v-btn--outlined v-btn--variant-outlined v-btn--density-default v-btn--size-default v-btn--rounded text-secondary border-secondary mx-2',
    },
  })

  if (result.isConfirmed) {
    cartStore.clearCart()
    dialog.value = false

    Swal.fire({
      title: 'Payment Successful',
      html: `<div style="font-size: 20px; margin: 10px 0;">Rp${totalBill.value.toLocaleString()}</div>`,
      icon: 'success',
      confirmButtonText: 'Back to Home',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'v-btn v-btn--outlined v-btn--variant-outlined v-btn--density-default v-btn--size-default v-btn--rounded text-primary border-primary',
      },
    })
  }
}
</script>

<template>
  <VDialog
    v-model="dialog"
    width="1024"
    transition="dialog-bottom-transition"
    persistent
    z-index="1024"
  >
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        prepend-icon="tabler-shopping-cart"
        variant="outlined"
      >
        Cart ({{ cartItems.length }})
      </VBtn>
    </template>

    <DialogCloseBtn @click="closeDialog" />
    <VCard
      elevation="5"
      class="pa-4"
    >
      <h3 class="mb-4">
        Keranjang Belanja
      </h3>

      <!-- Header tabel -->
      <div class="d-flex font-weight-bold mb-2 px-2">
        <div style="width: 40px;" />
        <div class="flex-grow-1">
          Nama Produk
        </div>
        <div
          style="width: 150px;"
          class="text-right"
        >
          Harga
        </div>
      </div>

      <!-- List items -->
      <VList>
        <VListItem
          v-for="item in cartItems"
          :key="item.id"
          class="px-2 py-1"
        >
          <div class="d-flex align-center w-100">
            <VBtn
              icon
              size="x-small"
              color="error"
              class="mr-2"
              @click="removeItem(item.id)"
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
            <div class="flex-grow-1">
              {{ item.name }}
            </div>
            <div
              style="width: 150px;"
              class="text-right"
            >
              Rp{{ item.price.toLocaleString() }}
            </div>
          </div>
        </VListItem>
      </VList>

      <h4 class="mt-4 text-right">
        Total: Rp{{ totalBill.toLocaleString() }}
      </h4>

      <div class="d-flex justify-end mt-4 gap-2">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="closeDialog"
        >
          Back to Bill
        </VBtn>
        <VBtn
          color="primary"
          variant="outlined"
          @click="payBill"
        >
          Pay Bill
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>
