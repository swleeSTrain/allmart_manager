<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-8 rounded-lg max-w-lg w-full mx-4">
      <h2 class="text-lg font-semibold mb-4">QR 코드 스캔</h2>

      <div class="flex justify-center mb-4">
        <img
            v-if="qrCodeUrl"
            :src="qrCodeUrl"
            alt="QR Code"
            class="border border-gray-300 rounded-lg shadow-md"
        />
        <p v-else class="text-gray-500">QR 코드를 불러오는 중...</p>
      </div>

      <p class="text-sm text-gray-600 text-center mb-4">
        이 QR 코드를 휴대폰으로 스캔하여 링크에 접속하세요.
      </p>

      <div class="flex justify-end space-x-2">
        <button @click="closeModal" class="px-4 py-2 bg-gray-400 text-white rounded">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);
const isOpen = ref(true);

// QR 코드 이미지 URL을 부모 컴포넌트로부터 받음
const props = defineProps({
  qrCodeUrl: {
    type: String,
    required: true,
  },
});

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};
</script>
