<template>
  <div class="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">Product Read Component</h1>

    <div class="mb-4">
      <button
          class="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition duration-200"
          @click="moveToList()">
        LIST
      </button>
    </div>

    <div class="mb-4">
      <button
          class="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition duration-200"
          @click="moveToEdit(product.productID)">
        EDIT
      </button>
    </div>

    <div v-if="product">
      <h2 class="text-xl font-semibold mb-2">이름: {{ product.name }}</h2>
      <p class="text-sm text-gray-600">sku: {{ product.sku }}</p>
      <p class="text-sm text-gray-600">가격: {{ product.price }}</p>
      <p class="text-sm text-gray-600">등록일: {{ product.createdDate }}</p>
      <p class="text-sm text-gray-600">수정일: {{ product.modifiedDate }}</p>

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
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getReadProduct } from '../../apis/ProductAPI.js';
import { usePage } from '../../store/usePage';
import { useProductSearch } from '../../store/useProductSearch.js';

const pageStore = usePage();
const searchStore = useProductSearch();
const route = useRoute();
const router = useRouter();
const product = ref(null);

const moveToEdit = (productID) => {

  const currentPage = pageStore.currentPage;
  const query = {
    page: currentPage.value,
    ...(searchStore.keyword && {
      type: searchStore.type,
      keyword: searchStore.keyword
    })
  };

  router.push({
    path: `/product/edit/${productID}`,
    query
  });
};

const moveToList = () => {
  // 페이지와 검색 조건을 가져와서 쿼리스트링을 유지
  const currentPage = pageStore.currentPage;
  const searchParams = {
    type: searchStore.type,
    keyword: searchStore.keyword,
  };

  router.push({ path: `/product/list/`, query: { page: currentPage, ...searchParams } });
};

onMounted(async () => {

  try {
    const productID = route.params.productID;
    const data = await getReadProduct(productID);

    // 객체 데이터를 그대로 할당
    product.value = data;

    // 쿼리스트링에서 페이지와 검색 조건 가져와 Pinia 상태로 저장
    const page = route.query.page ? parseInt(route.query.page, 10) : pageStore.currentPage;
    const type = route.query.type || searchStore.type || 'all';
    const keyword = route.query.keyword || searchStore.keyword || '';

    pageStore.setCurrentPage(page);
    searchStore.setSearchParams(type, keyword);

  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }
});


</script>
