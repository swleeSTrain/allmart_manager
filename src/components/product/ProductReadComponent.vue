<template>
  <div class="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">Product Read Component</h1>

    <!-- LIST 버튼 -->
    <div class="mb-4">
      <button
          class="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition duration-200"
          @click="moveToList()"
      >
        LIST
      </button>
    </div>

    <!-- EDIT 버튼 -->
    <div class="mb-4">
      <button
          class="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition duration-200"
          @click="moveToEdit(product.productID)"
      >
        EDIT
      </button>
    </div>

    <!-- 제품 상세 정보 -->
    <div v-if="product">
      <h2 class="text-xl font-semibold mb-2">이름: {{ product.name }}</h2>
      <p class="text-sm text-gray-600">SKU: {{ product.sku }}</p>
      <p class="text-sm text-gray-600">가격: {{ product.price }}</p>
      <p class="text-sm text-gray-600">등록일: {{ product.createdDate }}</p>
      <p class="text-sm text-gray-600">수정일: {{ product.modifiedDate }}</p>

      <!-- 첨부 이미지 -->
      <div class="mt-4">
        <div v-if="product.attachFiles && product.attachFiles.length > 0">
          <h3 class="font-medium mt-4">첨부 이미지:</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <img
                v-for="(file, index) in product.attachFiles"
                :key="index"
                :src="`http://localhost:8080/uploads/${file}`"
                alt="첨부 이미지"
                class="w-full h-auto border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getReadProduct } from '../../apis/ProductAPI.js';

const route = useRoute();  // 현재 라우트 정보 가져오기
const router = useRouter(); // 라우터 인스턴스

const product = ref(null);

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
  console.log('Received productID from route:', productID);

  if (!productID) {
    console.error('Missing productID in URL');
    return;
  }

  try {
    const data = await getReadProduct(productID);
    product.value = data;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }
});
</script>
