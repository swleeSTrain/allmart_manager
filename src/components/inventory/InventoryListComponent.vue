<script setup>
import { ref } from 'vue';
import useInventoryListData from '../../hooks/useInventoryListData.js';
import { getInventoryList } from '../../apis/InventoryAPI.js';
import InventoryEditModal from './InventoryEditModal.vue'; // InventoryEditModal 가져오기

// Inventory List Data 훅 초기화
const { result, pageArr, loadPageData, searchParams, search, onEnterKey, cleanAndLoad } =
    useInventoryListData(getInventoryList);

// 수정 모달 제어
const isEditModalOpen = ref(false);
const selectedInventoryId = ref(null);

// 수정 모달 열기
const openEditModal = (inventoryID) => {
  selectedInventoryId.value = inventoryID;
  isEditModalOpen.value = true;
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-3xl font-bold text-gray-700 border-b pb-4 mb-6">📦 재고 조회</h2>

    <!-- 검색 필드 -->
    <div class="flex flex-wrap items-center justify-between space-y-4 md:space-y-0 md:flex-row mb-6">
      <div class="flex items-center space-x-2">
        <select
            v-model="searchParams.type"
            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="sku">SKU</option>
        </select>
        <input
            v-model="searchParams.keyword"
            type="text"
            placeholder="검색어를 입력하세요"
            @keydown="onEnterKey"
            class="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex items-center space-x-4">
        <button
            @click="search"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          🔍 Search
        </button>
      </div>
    </div>

    <!-- 검색 결과가 없을 때 메시지 -->
    <div v-if="result?.dtoList?.length === 0" class="text-center text-xl text-gray-500 py-8">
      😔 검색 결과가 없습니다.
    </div>

    <!-- 재고 리스트 -->
    <div v-if="result?.dtoList?.length > 0" class="overflow-x-auto">
      <table class="w-full table-auto border-collapse border border-gray-300">
        <!-- 테이블 헤더 -->
        <thead class="bg-gray-200">
        <tr>
          <th class="border border-gray-300 px-4 py-2 text-left">Product ID</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Product Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">SKU</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Quantity</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Status</th>
          <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
        </tr>
        </thead>
        <!-- 테이블 본문 -->
        <tbody>
        <tr
            v-for="inventory in result.dtoList"
            :key="inventory.inventoryID"
            class="hover:bg-gray-100 cursor-pointer"
        >
          <td class="border border-gray-300 px-4 py-2">{{ inventory.inventoryID }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ inventory.productName }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ inventory.sku }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ inventory.quantity }}</td>
          <td class="border border-gray-300 px-4 py-2">
              <span
                  :class="{
                  'bg-green-100 text-green-700 px-2 py-1 rounded-lg': inventory.inStock,
                  'bg-red-100 text-red-700 px-2 py-1 rounded-lg': !inventory.inStock,
                }"
              >
                {{ inventory.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
          </td>
          <td class="border border-gray-300 px-4 py-2 text-center">
            <button
                @click="openEditModal(inventory.inventoryID)"
                class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none"
            >
              수정
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 로딩 상태 -->
    <div v-else-if="result?.dtoList === undefined" class="text-center text-gray-500 text-xl py-8">
      🔄 Loading or no data available...
    </div>

    <!-- 페이징 처리 -->
    <nav v-if="pageArr.length > 0" class="mt-8 flex justify-center">
      <ul class="inline-flex items-center space-x-2">
        <li v-for="page in pageArr" :key="page.page">
          <button
              class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-100 transition-colors focus:outline-none"
              :class="{
              'bg-blue-500 text-white': page.page === result.pageRequestDTO?.page,
              'bg-gray-200 text-gray-700': page.page !== result.pageRequestDTO?.page,
            }"
              @click="loadPageData(page.page)"
          >
            {{ page.label }}
          </button>
        </li>
      </ul>
    </nav>

    <!-- 수정 모달 -->
    <InventoryEditModal
        v-if="isEditModalOpen"
        :inventoryID="selectedInventoryId"
        @close="isEditModalOpen = false"
        @refreshList="cleanAndLoad"
    />
  </div>
</template>
