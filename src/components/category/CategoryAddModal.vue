<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">카테고리 등록</h2>
      <input v-model="name" type="text" placeholder="카테고리 이름" class="border p-2 w-full mb-4" />
      <button @click="addCategory" class="px-4 py-2 bg-blue-600 text-white rounded">등록</button>
      <button @click="closeModal" class="px-4 py-2 bg-gray-400 text-white rounded ml-2">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { postAddCategory } from '../../apis/CategoryAPI.js';
import Swal from 'sweetalert2';

const props = defineProps(['isOpen', 'closeModal']);
const name = ref('');

const addCategory = async () => {
  if (name.value.trim() === '') {
    Swal.fire({ icon: 'warning', title: '입력 부족', text: '카테고리 이름을 입력해주세요.' });
    return;
  }

  try {
    await postAddCategory({ name: name.value });
    Swal.fire({ icon: 'success', title: '등록 성공!', text: '카테고리가 등록되었습니다.' });
    name.value = '';
    props.closeModal();
  } catch (error) {
    console.error(error);
    Swal.fire({ icon: 'error', title: '오류 발생', text: '등록 중 문제가 발생했습니다.' });
  }
};
</script>
