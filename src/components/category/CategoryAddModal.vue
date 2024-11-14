<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-8 rounded-lg max-w-lg w-full mx-4">
      <h2 class="text-lg font-semibold mb-4">카테고리 등록</h2>
      <input v-model="name" type="text" @keydown="onEnterKey"
             placeholder="카테고리 이름" class="border p-2 w-full mb-4" />

      <div class="flex justify-end space-x-2">
        <button @click="addCategory" class="px-4 py-2 bg-blue-600 text-white rounded">등록</button>
        <button @click="closeModal" class="px-4 py-2 bg-gray-400 text-white rounded">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { postAddCategory } from '../../apis/CategoryAPI.js';
import Swal from 'sweetalert2';

const emit = defineEmits(['close', 'refreshList']);
const isOpen = ref(true);
const name = ref('');

const onEnterKey = (event) => {
  if (event.key === 'Enter') {
    addCategory();
  }
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const addCategory = async () => {
  if (name.value.trim() === '') {
    Swal.fire({icon: 'warning', title: '입력 부족', text: '카테고리 이름을 입력해주세요.'});
    return;
  }

  const categoryObj = {name: name.value};

  try {

    await postAddCategory(categoryObj);
    Swal.fire({icon: 'success', title: '등록 성공!', text: '카테고리가 등록되었습니다.'});
    emit('refreshList'); // 리스트 갱신 요청
    closeModal();

  } catch (error) {
    console.error(error);
    Swal.fire({icon: 'error', title: '오류 발생', text: '등록 중 문제가 발생했습니다.'});
  }
};
</script>
