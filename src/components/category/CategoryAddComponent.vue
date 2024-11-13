
<template>
  <div class="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Category Add Component</h2>
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700">이름</label>
      <input v-model="name" id="name" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>
    <button @click="addCategory" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">카테고리 등록</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { postAddCategory } from '../../apis/CategoryAPI.js';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2'; // SweetAlert2 가져오기

const route = useRoute();
const name = ref('');

const addCategory = async () => {
  if (name.value.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: '입력 부족',
      text: '카테고리 이름은 필수 입력 사항입니다.',
    });
    return;
  }

  const answerObj = {
    name: name.value
  };

  try {
    const response = await postAddCategory(answerObj);
    Swal.fire({
      icon: 'success',
      title: '등록 성공!',
      text: '카테고리가 성공적으로 등록되었습니다.',
    }).then(() => {
      name.value = '';
    });
  } catch (error) {
    console.error('카테고리 등록 실패:', error);
    Swal.fire({
      icon: 'error',
      title: '오류 발생',
      text: '카테고리 등록 중 오류가 발생했습니다.',
    });
  }
};
</script>