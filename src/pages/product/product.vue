<script setup>
import { ref } from "vue"
import axiosIns from "@/plugins/axios"
import { useToast } from "vue-toastification"

const dialog = ref(false)
const toast = useToast()
const loading = ref(false)

const form = ref({
  name: "",
  price: "",
  category: "",
})

const imageFile = ref(null)
const imagePreview = ref(null)

const categories =  ref([])
const fileInput = ref(null)

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleImage = e => {
  const file = e.target.files[0]
  if (file && file instanceof File) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
    console.log("Selected file:", file)
  } else {
    console.warn("File not valid", file)
  }
}


const fetchCategory = async () => {
  try {
    const ret = await axiosIns.get("/category")

    categories.value = ret.data.data
  } catch (error) {
    console.log(error)
    toast.error("Failed to load product data")
  }
}

watchEffect(() => {
  fetchCategory()
})

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    name: "",
    price: "",
    category: "",
  }
  imageFile.value = null
  imagePreview.value = null
}



const submitProduct = async () => {
  loading.value = true

  const price = parseFloat(form.value.price)

  if (!form.value.name || !form.value.category || isNaN(price)) {
    toast.error("Please fill all fields correctly.")
    
    return
  }

  try {
    const formData = new FormData()

    formData.append("name", form.value.name)
    formData.append("price", price) // Sekarang dalam bentuk number
    formData.append("category_id", form.value.category)

    if (imageFile.value) {
      formData.append("image", imageFile.value)
    }

    await axiosIns.post("/product", formData)

    toast.success("Product added successfully!")
    closeDialog()
  } catch (err) {
    toast.error("Failed to add product.")
  } finally {
    loading.value = false
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
    <template #activator="{props}">
      <VBtn
        v-bind="props"
        prepend-icon="tabler-plus"
        variant="outlined"
      >
        Add Product
      </VBtn>
    </template>

    <DialogCloseBtn @click="closeDialog" />
    <VCard :loading="loading">
      <VCardTitle>Add Product</VCardTitle>
      <VDivider />
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="4"
            class="text-center"
          >
            <VImg
              :src="imagePreview || 'https://via.placeholder.com/150'"
              class="mb-2"
              width="100"
              height="100"
              cover
            />
            <VBtn
              color="primary"
              variant="outlined"
              @click="triggerFileUpload"
            >
              Upload Image
            </VBtn>
            <input
              id="image-upload"
              ref="fileInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="handleImage"
            >
          </VCol>

          <VCol
            cols="12"
            sm="8"
          >
            <VTextField
              v-model="form.name"
              label="Product Name"
              class="mb-4"
              :rules="[requiredValidator]"
            />
            <VTextField
              v-model="form.price"
              label="Price"
              type="number"
              class="mb-4"
              :rules="[requiredValidator]"
            />
            <VSelect
              v-model="form.category"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Select Category"
              class="mb-4"
              :rules="[requiredValidator]"
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          variant="outlined"
          :disabled="loading"
          color="error"
          @click="closeDialog"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          :disabled="loading"
          variant="outlined"
          @click="submitProduct"
        >
          Confirm
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
