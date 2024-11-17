<template>
  <div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">

    <h1 class="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">Product Read Component</h1>

    <div v-if="product" class="space-y-4">

      <div class="mt-6">
        <div v-if="product.attachFiles && product.attachFiles.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <img
                v-for="(file, index) in product.attachFiles"
                :key="index"
                :src="`http://localhost:8080/uploads/${file}`"
                alt="첨부 이미지"
                class="w-full h-40 object-cover rounded-lg shadow-md border border-gray-200"
            />
          </div>
        </div>
      </div>

      <table class="min-w-full table-auto border-separate border-spacing-4">
        <tbody>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">이름</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ product.name }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">고유번호</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ product.sku }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">가격</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ product.price }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">카테고리</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ product.categoryName }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">등록일</td>
          <td class="text-lg text-black-500 border-b-2 border-gray-400">{{ formatDate(product.createdDate) }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">수정일</td>
          <td class="text-lg text-black-500 border-b-2 border-gray-400">{{ formatDate(product.modifiedDate) }}</td>
        </tr>
        </tbody>
      </table>
      
    </div>

    <div class="mt-8 flex justify-center space-x-4">
      <button
          class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          @click="moveToList"
      >
        목록
      </button>
      <button
          class="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition"
          @click="moveToEdit(product.productID)"
      >
        수정
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getReadProduct } from '../../apis/ProductAPI.js';
import { getCategory } from '../../apis/CategoryAPI.js'
import useDateFormatter from '../../hooks/useDateFormatter.js'

const route = useRoute();  // 현재 라우트 정보 가져오기
const router = useRouter(); // 라우터 인스턴스
const product = ref(null);

const { formatDate } = useDateFormatter();

// LIST 이동
const moveToList = () => {
  // 페이지네이션 쿼리 파라미터와 검색 파라미터를 URL에 전달
  router.push({
    path: '/product/list',
    query: {page: route.query.page, ...route.query},
  });
};

// EDIT 이동
const moveToEdit = (productID) => {
  // 편집 페이지로 이동하면서 쿼리 파라미터를 함께 전달
  router.push({
    path: `/product/edit/${productID}`,
    query: {page: route.query.page, ...route.query},
  });
};

// 컴포넌트 로드 시 API 호출
onMounted(async () => {
  const productID = route.params.productID; // URL에서 productID 가져오기

  if (!productID) {
    console.error('Missing productID in URL');
    return;
  }

  try {
    const data = await getReadProduct(productID);
    product.value = data;

    const categoryResult = await getCategory(product.value.categoryID)

    product.value.categoryName = categoryResult.name;

  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }
});
</script>
