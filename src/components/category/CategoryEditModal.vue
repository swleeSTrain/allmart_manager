<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-8 rounded-lg max-w-lg w-full mx-4">
      <h2 class="text-lg font-semibold mb-4">카테고리 수정</h2>
      <input v-model="name" type="text" placeholder="카테고리 이름"
             class="border p-2 w-full mb-4" @keydown="onEnterKey" />

      <div class="flex justify-end space-x-2">
        <button @click="editCategory" class="px-4 py-2 bg-blue-600 text-white rounded">수정</button>
        <button @click="closeModal" class="px-4 py-2 bg-gray-400 text-white rounded">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { getCategory, putEditCategory } from '../../apis/CategoryAPI.js';
import Swal from 'sweetalert2';

const emit = defineEmits(['close', 'refreshList']);
const props = defineProps(['categoryID']);
const isOpen = ref(true);
const name = ref('');

const onEnterKey = (event) => {
  if (event.key === 'Enter') {
    editCategory();
  }
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

onMounted(async () => {
  if (props.categoryID) {

    try {
      const category = await getCategory(props.categoryID);

      console.log(category);  // 콘솔 확인

      name.value = category.name;
    } catch (error) {

      console.error(error);
      Swal.fire({icon: 'error', title: '오류 발생', text: '카테고리 정보를 불러오는데 실패했습니다.'});
      closeModal();
    }
  }
});

const editCategory = async () => {
  if (name.value.trim() === '') {
    Swal.fire({icon: 'warning', title: '입력 부족', text: '카테고리 이름을 입력해주세요.'});
    return;
  }

  const categoryObj = {categoryID: props.categoryID, name: name.value}; // categoryID로 변경

  try {
    await putEditCategory(categoryObj);
    Swal.fire({
      icon: 'success',
      title: '수정 성공!',
      text: '카테고리가 수정되었습니다.'
    });
    emit('refreshList'); // 리스트 갱신 요청
    closeModal();

  } catch (error) {
    console.error(error);
    if (error.response && error.response.data) {

      // 백엔드에서 보낸 구체적인 오류 메시지를 표시
      Swal.fire({
        icon: 'error',
        title: '오류 발생',
        text: error.response.data.message || '수정 중 문제가 발생했습니다.'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '오류 발생',
        text: '수정 중 문제가 발생했습니다.'
      });
    }
  }

};
</script>