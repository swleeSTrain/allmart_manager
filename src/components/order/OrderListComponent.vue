<script setup>
import useOrderListData from '../../hooks/useOrderListData.js';
import { getListOrder, updateOrderStatus as updateOrderStatusAPI } from '../../apis/OrderAPI.js';
import useDateFormatter from '../../hooks/useDateFormatter.js';

const { formatDate } = useDateFormatter();

const { result, pageArr, loadPageData, moveToRead,
  searchParams, search, onEnterKey, cleanAndLoad
} = useOrderListData(getListOrder);

// 주문 상태 업데이트
const handleOrderStatusUpdate = async (orderId, newStatus) => {
  try {
    await updateOrderStatusAPI(orderId, newStatus); // API 호출 함수 사용
    alert('주문 상태가 성공적으로 변경되었습니다.');
  } catch (error) {
    console.error('Failed to update order status:', error);
    alert('주문 상태 변경에 실패했습니다.');
  }
};

// 테이블 로우 클릭 시 이동
const handleRowClick = (event, orderId) => {
  // 드롭다운 선택 시 상세 페이지로 이동하지 않도록 처리
  if (event.target.tagName !== 'SELECT') {
    moveToRead(orderId);
  }
};

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
      </tr>
      </thead>
      <!-- 테이블 본문 -->
      <tbody class="text-base">
      <tr
          v-for="order in result.dtoList"
          :key="order.orderId"
          class="hover:bg-gray-100 cursor-pointer"
          @click="(event) => handleRowClick(event, order.orderId)"
      >
        <td class="border border-gray-300 px-4 py-4">{{ order.orderId }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ order.customerId }}</td>
        <td class="border border-gray-300 px-4 py-4">
          <select
              v-model="order.status"
              @change="handleOrderStatusUpdate(order.orderId, order.status)"
              class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING">대기</option>
            <option value="COMPLETED">완료</option>
            <option value="CANCELLED">취소</option>
          </select>
        </td>
        <td class="border border-gray-300 px-4 py-4">{{ order.totalAmount }}원</td>
        <td class="border border-gray-300 px-4 py-4">{{ formatDate(order.orderTime) }}</td>
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

