<template>
  <div v-if="product" class="container max-w-xl mx-auto p-8 bg-gray-50 shadow-lg rounded-md">
    <h1 class="text-3xl font-bold mb-6 text-center">Product Edit Component</h1>

    <form @submit.prevent="handleEdit" enctype="multipart/form-data">
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

      <!-- 파일 입력 -->
      <div class="mb-5">
        <label for="files" class="block text-lg font-bold text-gray-700 mb-2">Files</label>
        <input
            ref="fileInput"
            type="file"
            id="files"
            class="hidden"
            multiple
            @change="handleFileChange"
        />
        <button
            type="button"
            @click="triggerFileInput"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 text-left px-4"
        >
          {{ selectedFiles.length > 0 ? `파일 ${selectedFiles.length}개` : '이미지 첨부' }}
        </button>

        <div v-if="selectedFiles.length" class="mt-3">
          <ul>
            <li
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded"
            >
              <span class="text-gray-700">{{ file.name }}</span>
              <button
                  type="button"
                  @click="removeFile(index)"
                  class="text-red-500 font-bold hover:underline"
              >
                X
              </button>
            </li>
          </ul>
        </div>

      </div>


      <div class="flex justify-center space-x-4 mt-6">
        <button
            type="button"
            @click="moveToRead(product.productID)"
            class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-bold"
        >
          조회
        </button>

        <button
            type="submit"
            @click="handleEdit"
            class="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 text-lg font-bold"
        >
          수정
        </button>

        <button
            type="submit"
            @click="handleDelete"
            class="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 text-lg font-bold"
        >
          삭제
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { putEditProduct, getReadProduct, deleteProduct } from '../../apis/ProductAPI.js';
import useProductCategory from '../../hooks/useProductCategory.js';
import { getListCategory } from '../../apis/CategoryAPI.js';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const errorMessage = ref('');
const fileInput = ref(null);
const selectedFiles = ref([]);
const product = ref(null);

const {
  result, scrollContainer, handleCategoryClick
} = useProductCategory(getListCategory, false);

// 폼 데이터
const form = ref({
  name: '',
  sku: '',
  price: '',
  categoryID: null,
  attachFiles: []
});

// 파일 선택 창 열기
const triggerFileInput = () => {
  fileInput.value.click();
};

// 파일 변경 처리
const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  selectedFiles.value = [...selectedFiles.value, ...files];
};

// 파일 제거
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

// 태그 선택 유효성 검사 및 제출 처리
const handleEdit = async () => {

  console.log(form.value.categoryID);

  if (!form.value.categoryID) {
    errorMessage.value = '카테고리를 선택해야 합니다.';
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
    const productID = route.params.productID;

    await putEditProduct(productID, formData);

    Swal.fire({
      icon: 'success',
      title: '수정 완료 !!!',
      text: '상품이 성공적으로 수정되었습니다.',
    }).then(() => {
      router.push({ path: `/product/read/${productID}` });
    });
  } catch (error) {
    console.error('Failed to edit product:', error);

    Swal.fire({
      icon: 'error',
      title: '오류 발생',
      text: '상품을 수정하는 도중 오류가 발생했습니다.',
    });
  }
};

const handleDelete = async () => {

  const productID = route.params.productID;

  Swal.fire({
    title: '정말 삭제하시겠습니까?',
    text: '삭제하면 복구할 수 없습니다!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  }).then(async (result) => {

    if (result.isConfirmed) {
      try {

        await deleteProduct(productID);
        Swal.fire({
          icon: 'success',
          title: '삭제 완료!',
          text: '상품이 성공적으로 삭제되었습니다.'
        });

        moveToList(); // 삭제 후 목록 페이지로 이동

      } catch (error) {
        console.error('Failed to delete question:', error);
        Swal.fire({
          icon: 'error',
          title: '오류 발생',
          text: '상품을 삭제하는 도중 오류가 발생했습니다.'
        });
      }
    }
  });
};

// 조회로 이동
const moveToRead = (productID) => {
  const query = {
    page: route.query.page || 1,
    ...(route.query.keyword && {keyword: route.query.keyword}),
    ...(route.query.type && {type: route.query.type}),
    ...(route.query.categoryID && {categoryID: route.query.categoryID}),
  };

  router.push({
    path: `/product/read/${productID}`,
    query
})
  ;
};

const moveToList = () => {
  const query = {
    page: route.query.page || 1,
    ...(route.query.keyword && {keyword: route.query.keyword}),
    ...(route.query.type && {type: route.query.type}),
    ...(route.query.categoryID && {categoryID: route.query.categoryID}),
  };

  router.push({
    path: '/product/list',
    query
  });
};

onMounted(async () => {
  try {
    const productID = route.params.productID;

    const data = await getReadProduct(productID);
    product.value = data;

    // 폼 데이터 초기화
    form.value.name = product.value.name || '';
    form.value.sku = product.value.sku || '';
    form.value.price = product.value.price || '';
    form.value.categoryID = product.value.categoryID || null;
    form.value.attachFiles = product.value.attachFiles || [];

    // 카테고리 로드
    await getListCategory();
  } catch (error) {
    console.error('Failed to load product data:', error);
  }
});

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