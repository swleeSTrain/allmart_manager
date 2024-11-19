<script setup>
import useListData from '../../hooks/useOrderListData.js';
import { getListOrder } from '../../apis/OrderAPI.js';

const { result, pageArr, loadPageData,
  searchParams, search, onEnterKey, cleanAndLoad
} = useListData(getListOrder);
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Order List Component</h2>

    <!-- 검색 필드 -->
    <div class="flex justify-end items-center space-x-2 mb-4">
      <select v-model="searchParams.type" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="customerId">고객아이디</option>
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

    <!-- 주문 리스트 -->
    <table class="table-auto w-full border-collapse border border-gray-300">
      <!-- 테이블 헤더 -->
      <thead class="bg-gray-200 text-lg">
      <tr>
        <th class="border border-gray-300 px-4 py-4 text-left">주문 ID</th>
        <th class="border border-gray-300 px-4 py-4 text-left">고객 ID</th>
        <th class="border border-gray-300 px-4 py-4 text-left">주문상태</th>
        <th class="border border-gray-300 px-4 py-4 text-left">총가격</th>
        <th class="border border-gray-300 px-4 py-4 text-left">주문시간</th>
        <th class="border border-gray-300 px-4 py-4 text-left">주문상품</th>
      </tr>
      </thead>
      <!-- 테이블 본문 -->
      <tbody class="text-base">
      <tr
          v-for="order in result.dtoList"
          :key="order.orderId"
          class="hover:bg-gray-100 cursor-pointer"
      >
        <td class="border border-gray-300 px-4 py-4">{{ order.orderId }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ order.customerId }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ order.status }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ order.totalAmount }}원</td>
        <td class="border border-gray-300 px-4 py-4">{{ order.orderTime }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ order.orderItems }}</td>
      </tr>
      </tbody>
    </table>

    <!-- 검색 결과가 없을 때 메시지 -->
    <div v-if="result.dtoList.length === 0" class="flex items-center h-20 text-2xl text-gray-500 mb-4 ml-1">
      검색 결과가 없습니다.
    </div>


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

