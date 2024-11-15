<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Product List Component</h1>

    <!-- 검색 필드 -->
    <div class="flex items-center space-x-2 mb-4">
      <select v-model="searchParams.type" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="all">전체</option>
        <option value="name">이름</option>
        <option value="sku">고유번호</option>
      </select>
      <input
          v-model="searchParams.keyword"
          type="text"
          placeholder="검색어를 입력하세요"
          @keydown="onEnterKey"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button @click="search" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
        Search
      </button>
      <button @click="cleanAndLoad" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
        Clean
      </button>
    </div>


    <!-- 검색 결과가 없을 때 메시지 -->
    <div v-if="result.dtoList.length === 0" class="flex items-center h-20 text-2xl text-gray-500 mb-4 ml-1">
      검색 결과가 없습니다.
    </div>

    <!-- 카테고리 컴포넌트  -->
    <ProductCategoryComponent />

    <!-- 질문 리스트 -->
    <ul class="divide-y divide-gray-300">
      <li v-for="product in result.dtoList"
          :key="product.productID"
          class="py-4 cursor-pointer hover:bg-gray-100"
          @click="moveToRead(product.productID)">

        <div v-if="product.thumbnailImage">
          <div class="mt-2">
            <img
                :src="`http://localhost:8080/uploads/s_${product.thumbnailImage}`"
                alt="썸네일 이미지"
                class="w-full h-auto max-w-xs border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <span class="font-medium text-lg">{{ product.productID }}</span>
        <div class="flex justify-between">
          <span class="font-medium text-lg">{{ product.name }}</span>
          <span class="text-sm text-gray-500">{{ product.sku }}</span>
        </div>
        <div class="text-sm text-gray-500">
          <span>{{ product.price }}원</span>
        </div>
      </li>
    </ul>

    <!-- 페이징 처리 -->
    <nav class="mt-6 flex justify-center">
      <ul class="inline-flex items-center space-x-1">
        <li v-for="page in pageArr" :key="page.page">
          <button
              class="px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'bg-blue-500 text-white': page.page === result.pageRequestDTO.page, 'bg-gray-200 text-gray-700': page.page !== result.pageRequestDTO.page }"
              @click="loadPageData(page.page)">
            {{ page.label }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import useListData from '../../hooks/useProductListData.js';
import { getListProduct } from '../../apis/ProductAPI.js';
import ProductCategoryComponent from "./ProductCategoryComponent.vue";

const { result, pageArr, loadPageData, moveToRead,
  searchParams, search, onEnterKey, cleanAndLoad,
  } = useListData(getListProduct);

</script>
