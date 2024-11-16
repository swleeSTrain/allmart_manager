<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Product List Component</h1>

    <!-- 검색 필드 -->
    <div class="flex justify-end items-center space-x-2 mb-4">
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

      <button @click="moveToAdd" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        등록
      </button>
    </div>


    <!-- 검색 결과가 없을 때 메시지 -->
    <div v-if="result.dtoList.length === 0" class="flex items-center h-20 text-2xl text-gray-500 mb-4 ml-1">
      검색 결과가 없습니다.
    </div>

    <!-- 카테고리 컴포넌트  -->
    <ProductCategoryComponent />

    <!-- 상품 리스트 -->
    <table class="table-auto w-full border-collapse border border-gray-300">
      <!-- 테이블 헤더 -->
      <thead class="bg-gray-200">
      <tr>
        <th class="border border-gray-300 px-4 py-4 text-left">상품 ID</th>
        <th class="border border-gray-300 px-4 py-4 text-left">이미지</th>
        <th class="border border-gray-300 px-4 py-4 text-left">상품명</th>
        <th class="border border-gray-300 px-4 py-4 text-left">고유번호</th>
        <th class="border border-gray-300 px-4 py-4 text-left">가격</th>
      </tr>
      </thead>
      <!-- 테이블 본문 -->
      <tbody>
      <tr
          v-for="(product, index) in result.dtoList.slice(0, 10)"
          :key="product.productID"
          class="hover:bg-gray-100 cursor-pointer"
          @click="moveToRead(product.productID)"
      >
        <td class="border border-gray-300 px-4 py-4">{{ product.productID }}</td>
        <td class="border border-gray-300 px-4 py-4">
          <img
              v-if="product.thumbnailImage"
              :src="`http://localhost:8080/uploads/s_${product.thumbnailImage}`"
              alt="이미지"
              class="w-20 h-auto max-w-xs border border-gray-300 rounded-md shadow-sm"
          />
        </td>
        <td class="border border-gray-300 px-4 py-4">{{ product.name }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ product.sku }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ product.price }}원</td>
      </tr>
      </tbody>
    </table>

    <!-- 페이징 처리 -->
    <nav class="mt-6 flex justify-center">
      <ul class="inline-flex items-center space-x-2">
        <li v-for="page in pageArr" :key="page.page">
          <button
              class="px-5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{
          'bg-blue-500 text-white': page.page === result.pageRequestDTO.page,
          'bg-gray-200 text-gray-700 hover:bg-gray-300': page.page !== result.pageRequestDTO.page
        }"
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
  searchParams, search, onEnterKey, cleanAndLoad, moveToAdd
  } = useListData(getListProduct);

</script>
