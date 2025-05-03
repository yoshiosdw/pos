<script setup>

</script>
<template>
   <div>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VLabel class="d-flex justify-center">
                  <h3>YOSHIO SUDEWA </h3>
                </VLabel>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VLabel class="d-flex justify-center">
                  <h5>MAS POS</h5>
                </VLabel>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
<route lang="yaml">
  meta:
    action: Read
    subject: Auth
    redirectIfLoggedIn: false
  </route>
