<template>
  <div class="container max-w-xl mx-auto p-6 bg-gray-50 shadow-lg rounded-md">
    <h1 class="text-2xl font-bold mb-4 text-center">Product Add Component</h1>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- 이름 입력 -->
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

      <!-- 고유번호 입력 -->
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

      <!-- 가격 입력 -->
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

      <!-- 카테고리 -->
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

      <!-- 파일 입력 -->
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

      <div class="flex justify-center space-x-2 mt-4">
        <button
            type="button"
            @click="moveToList"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          목록
        </button>

        <button
            type="submit"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          등록
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { postAddProduct } from '../../apis/ProductAPI.js';
import { usePage } from '../../store/usePage.js'
import { useProductSearch } from '../../store/useProductSearch.js'
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const searchStore = useProductSearch();
const pageStore = usePage();
const router = useRouter();

// 폼 데이터
const form = ref({
  name: '',
  sku: '',
  price: '',
  tags: [] // 배열로 초기화하여 다중 선택 가능
});

// 에러 메시지
const errorMessage = ref('');

// 파일 입력 참조
const fileInput = ref(null);

// 태그 선택 유효성 검사 및 제출 처리
const handleSubmit = async () => {
  if (form.value.tags.length === 0) {
    errorMessage.value = "태그를 선택해야 합니다.";
    return;
  }

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('sku', form.value.sku);
  formData.append('price', form.value.price);

  form.value.tags.forEach(tag => {
    formData.append('tags', tag);
  });

  const files = fileInput.value.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  }

  try {
    const response = await postAddProduct(formData);
    console.log('Product added:', response);

    Swal.fire({
      icon: 'success',
      title: '작성 완료 !!!',
      text: '질문이 성공적으로 등록되었습니다.',
    }).then(() => {
      router.push("/qna/question/list");
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

// 목록으로 이동
const moveToList = () => {
  const currentPage = pageStore.currentPage;
  const searchParams = {
    type: searchStore.type,
    keyword: searchStore.keyword,
  };

  router.push({path: `/product/list`, query: {page: currentPage, ...searchParams}});
};
</script>
