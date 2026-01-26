<template>
  <div class="p-4 w-full h-full flex">
    <a-row :gutter="16" class="grid-card">
      <a-col :span="6" class="h-full">
        <PaymentDebugger @success="handlePaymentSuccess" />
      </a-col>
      <a-col :span="18" class="h-full">
        <TransactionTable ref="transactionTableRef" />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  import PaymentDebugger from './components/PaymentDebugger.vue';
  import TransactionTable from './components/TransactionTable.vue';

  const transactionTableRef = ref<InstanceType<typeof TransactionTable> | null>(null);

  const handlePaymentSuccess = () => {
    transactionTableRef.value?.refresh();
  };

  onMounted(() => {
    //
  });
</script>

<style scoped></style>
