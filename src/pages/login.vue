<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant"
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png"
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png"
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png"
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png"
import authV2MaskDark from "@images/pages/misc-mask-dark.png"
import authV2MaskLight from "@images/pages/misc-mask-light.png"
import { VForm } from "vuetify/components"

// import logo from "@images/logo.png"
// import logo from "@images/sjb.png"
import logo from "@images/pos.png"

import axiosIns from "@/plugins/axios"
import { useAppAbility } from "@/plugins/casl/useAppAbility"
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg"
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg"
import { themeConfig } from "@themeConfig"
import Swal from "sweetalert2"
import { useRoute, useRouter } from "vue-router"
import { requiredValidator } from "@/@core/utils/validators"
import { showOnHover } from "@/views/demos/components/badge/demoCodeBadge"
import { useToast } from "vue-toastification"

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true,
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAppAbility()

const toast = useToast()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref("")
const showLoading = ref(false)
const email = ref("admin@example.com")
const password = ref("secret")
const rememberMe = ref(false)

// const email = ref("admin@demo.com")
const defaultRegion = ref()

const login = async () => {
  showLoading.value = true
  try {
    const ret = await axiosIns.post("/login", {
      email: email.value,
      password: password.value,
    })

    // const abilities = ret.data.data.ability
    const userData = ret?.data?.data // Ambil data user
    const token = userData?.token 

    // localStorage.setItem("abilities", JSON.stringify(abilities))

    // ability.update(abilities)
    localStorage.setItem("appUserData", JSON.stringify(userData))
    localStorage.setItem("token", token)
    router.replace(route.query.to ? String(route.query.to) : "/")
  } catch (error) {
    console.log(error)
    toast.error("Login Failed!. Check your credential!")
  } finally {
    showLoading.value = false
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) login()
  })
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="auth-wrapper d-flex align-center justify-center pa-4">
        <div class="position-relative my-sm-16">
          <VImg
            :src="authV1TopShape"
            class="auth-v1-top-shape d-none d-sm-block"
          />
          <VImg
            :src="authV1BottomShape"
            class="auth-v1-bottom-shape d-none d-sm-block"
          />

          <VCard
            class="auth-card pa-4"
            :min-width="400"
            :loading="showLoading"
          >
            <VCardItem class="justify-center">
              <VImg :src="logo" />
              <VCardTitle class="font-weight-bold text-h5 py-2 text-center">
                {{ themeConfig.app.title }}
              </VCardTitle>
            </VCardItem>
            <VCardText>
              <VForm
                ref="refVForm"
                @submit.prevent="onSubmit"
              >
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      v-model="email"
                      label="Username"
                    />
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="password"
                      label="Password"
                      :rules="[requiredValidator]"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :error-messages="errors.password"
                      :append-inner-icon="
                        isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                      "
                      @click:append-inner="
                        isPasswordVisible = !isPasswordVisible
                      "
                    />

                    <div
                      class="d-flex align-center flex-wrap justify-space-between mt-4 mb-2"
                    >
                      <VBtn
                        block
                        type="submit"
                        :loading="showLoading"
                      >
                        Login
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>

            <!-- 👉 Footer -->
            <div class="d-flex flex-column align-center justify-center mt-6">
              <span
                class="text-caption text-center"
                style="font-size: 12 px"
              >
                &copy; {{ new Date().getFullYear() }} Made By
                <a
                  href="https://yoshiosudewa.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary ms-1"
                >
                  YOSHIO SUDEWA
                </a>
              </span>
            </div>
          </VCard>
        </div>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
