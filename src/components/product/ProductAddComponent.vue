<template>
  <div class="container max-w-xl mx-auto p-6 bg-gray-50 shadow-lg rounded-md">
    <h1 class="text-2xl font-bold mb-4 text-center">Product Add Component</h1>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">이름</label>
        <input
            v-model="form.name"
            type="text"
            id="name"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <div class="mb-4">
        <label for="sku" class="block text-sm font-medium text-gray-700">고유번호</label>
        <input
            v-model="form.sku"
            type="text"
            id="sku"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <div class="mb-4">
        <label for="price" class="block text-sm font-medium text-gray-700">가격</label>
        <input
            v-model="form.price"
            type="number"
            id="price"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">카테고리</label>
        <div class="mt-1 flex space-x-4">
          <label class="inline-flex items-center">
            <input
                type="radio"
                v-model="form.tag"
                value="식료품"
                class="form-radio"
            />
            <span class="ml-2">식료품</span>
          </label>
          <label class="inline-flex items-center">
            <input
                type="radio"
                v-model="form.tag"
                value="세탁세제"
                class="form-radio"
            />
            <span class="ml-2">세탁세제</span>
          </label>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</p>
      </div>

      <div class="mb-4">
        <label for="files" class="block text-sm font-medium text-gray-700">Files</label>
        <input
            ref="fileInput"
            type="file"
            id="files"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            multiple
        />
      </div>

      <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
      >
        등록
      </button>
    </form>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {postAddProduct} from '../../apis/ProductAPI.js';
import {useRouter} from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();

// Form 데이터를 저장할 객체
const form = ref({
  name: '',
  sku: '',
  price: '',
  tags: [] // 배열로 초기화하여 다중 선택 가능
});

// 에러 메시지를 저장할 변수
const errorMessage = ref('');

// 파일 입력을 참조하는 변수
const fileInput = ref(null);

const handleSubmit = async () => {
  // 태그 선택 유효성 검사
  if (form.value.tags.length === 0) {
    errorMessage.value = "태그를 선택해야 합니다."; // 에러 메시지 설정
    return; // 제출을 중단
  }

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('sku', form.value.sku);
  formData.append('price', form.value.price);

  // 선택된 tags 배열을 반복문으로 추가
  form.value.tags.forEach(tag => {
    formData.append('tags', tag);
  });

  // 선택한 파일 추가
  const files = fileInput.value.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  }

  try {
    const response = await postAddProduct(formData);
    console.log('Product added:', response);

    // 성공 알림 표시 후 리다이렉트
    Swal.fire({
      icon: 'success',
      title: '작성 완료 !!!',
      text: '질문이 성공적으로 등록되었습니다.',
    }).then(() => {
      router.push("/qna/question/list"); // 등록 완료 후 질문 목록으로 리다이렉트
    });

  } catch (error) {
    console.error('Failed to add question:', error);

    Swal.fire({
      icon: 'error',
      title: '오류 발생',
      text: '질문을 등록하는 도중 오류가 발생했습니다.',
    });
  }
};
</script>