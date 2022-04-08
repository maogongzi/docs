<script setup lang="ts">
import { VTLink } from '@vue/theme'
import PartnerHero from './PartnerHero.vue'
import PartnerList from './PartnerList.vue'
</script>

<template>
  <div class="PartnerPage">
    <PartnerHero>
      <template #title>Socios de Vue</template>
      <template #lead
        >Vue Partners son negocios premium que brindan consultoría y
        desarrollo de Vue de primera clase. Si su empresa está interesada
        en aparecer como socio, por favor
        <VTLink href="https://airtable.com/shrCQhat57SApJI2l" no-icon
          >registre su interés aquí</VTLink
        >.</template
      >
    </PartnerHero>

    <PartnerList />
  </div>
</template>

<style scoped>
.PartnerPage {
  padding-bottom: 16px;
}
</style>
