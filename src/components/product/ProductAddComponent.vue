<template>
  <div class="container max-w-xl mx-auto p-8 bg-gray-50 shadow-lg rounded-md">
    <h1 class="text-3xl font-bold mb-6 text-center">Product Add Component</h1>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- 이름 입력 -->
      <div class="mb-5">
        <label for="name" class="block text-lg font-bold text-gray-700 mb-2">이름</label>
        <input
            v-model="form.name"
            type="text"
            id="name"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <!-- 고유번호 입력 -->
      <div class="mb-5">
        <label for="sku" class="block text-lg font-bold text-gray-700 mb-2">고유번호</label>
        <input
            v-model="form.sku"
            type="text"
            id="sku"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <!-- 가격 입력 -->
      <div class="mb-5">
        <label for="price" class="block text-lg font-bold text-gray-700 mb-2">가격</label>
        <input
            v-model="form.price"
            type="number"
            id="price"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <!-- 카테고리 선택 -->
      <div class="mb-5">
        <label class="block text-lg font-bold text-gray-700 mb-2">카테고리</label>
        <div class="mt-1 flex flex-row space-x-6 scrollbar-visible overflow-x-auto pb-4" ref="scrollContainer">
          <label
              v-for="category in result.dtoList"
              :key="category.categoryID"
              class="flex items-center space-x-4 cursor-pointer"
              @click="handleCategoryClick(category.categoryID)"
          >
            <input
                type="radio"
                v-model="form.categoryID"
                :value="category.categoryID"
                class="form-radio"
            />
            <span class="text-gray-800 text-lg font-bold">{{ category.name }}</span>
          </label>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</p>
      </div>

      <FileUploadComponent @updateFiles="updateSelectedFiles" />

      <div class="flex justify-center space-x-4 mt-6">
        <button
            type="button"
            @click="moveToList"
            class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-bold"
        >
          목록
        </button>

        <button
            type="submit"
            class="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 text-lg font-bold"
        >
          등록
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postAddProduct } from '../../apis/ProductAPI.js';
import useProductCategory from '../../hooks/useProductCategory.js';
import { getListCategory } from '../../apis/CategoryAPI.js';
import Swal from 'sweetalert2';
import FileUploadComponent from '../common/FileUploadComponent.vue'; // 컴포넌트 임포트

const route = useRoute();
const router = useRouter();
const errorMessage = ref('');
const selectedFiles = ref([]); // 이 파일들을 FileUploadComponent로 전달받음

const updateSelectedFiles = (files) => {
  selectedFiles.value = files;
};

const { result, scrollContainer, handleCategoryClick } = useProductCategory(getListCategory, false);

// 폼 데이터
const form = ref({
  name: '',
  sku: '',
  price: '',
  categoryID: null,
});

// 태그 선택 유효성 검사 및 제출 처리
const handleSubmit = async () => {
  if (!form.value.categoryID) {
    errorMessage.value = '카테고리를 선택해야 합니다.';
    return;
  }

  if (selectedFiles.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: '이미지 첨부 필요',
      text: '상품 이미지를 하나 이상 첨부해야 합니다.',
    });
    return;
  }

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('sku', form.value.sku);
  formData.append('price', form.value.price);
  formData.append('categoryID', form.value.categoryID);

  selectedFiles.value.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await postAddProduct(formData);
    Swal.fire({
      icon: 'success',
      title: '작성 완료 !!!',
      text: '상품이 성공적으로 등록되었습니다.',
    }).then(() => {
      router.push({ path: '/product/list', query: { page: 1 } });
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || '상품을 등록하는 도중 오류가 발생했습니다.';
    Swal.fire({
      icon: 'error',
      title: '오류 발생',
      text: errorMessage,
    });
  }
};

const moveToList = () => {
  const query = {
    page: route.query.page || 1,
    ...(route.query.keyword && { keyword: route.query.keyword }),
    ...(route.query.type && { type: route.query.type }),
  };

  router.push({ path: '/product/list', query });
};
</script>


<style scoped>
.scrollbar-visible {
  overflow-x: scroll; /* 가로 스크롤바 항상 표시 */
  white-space: nowrap;
  width: 100%;
  min-width: 100%;
}

.scrollbar-visible::-webkit-scrollbar {
  height: 10px; /* 스크롤바 높이 설정 */
  visibility: visible; /* 항상 스크롤바 표시 */
}

.scrollbar-visible::-webkit-scrollbar-thumb {
  background-color: #bbb; /* 스크롤바 색상 */
  border-radius: 4px; /* 스크롤바 둥글게 */
}

.scrollbar-visible::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 스크롤바 트랙 색상 */
}
</style>