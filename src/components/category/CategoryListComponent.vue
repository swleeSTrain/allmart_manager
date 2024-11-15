<template>
  <div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Category List Component</h2>

    <!-- 검색 필드 -->
    <div class="flex justify-end items-center space-x-2 mb-4">
      <select v-model="searchParams.type" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="name">이름</option>
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

      <button @click="isAddModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        등록
      </button>
    </div>

    <!-- 검색 결과가 없을 때 메시지 -->
    <div v-if="result.dtoList.length === 0" class="flex items-center h-20 text-2xl text-gray-500 mb-4 ml-1">
      검색 결과가 없습니다.
    </div>

    <!-- 카테고리 리스트 -->
    <ul class="divide-y divide-gray-300">
      <li v-for="category in result.dtoList" :key="category.categoryID" class="py-4 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="font-medium text-lg">{{ category.categoryID }}</span>
          <span class="text-gray-400">|</span>
          <span class="font-medium text-lg">{{ category.name }}</span>
        </div>

        <!-- 수정 및 삭제 버튼 -->
        <div class="flex space-x-2">
          <button @click="openEditModal(category.categoryID)" class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            수정
          </button>
          <button @click="handleDelete(category.categoryID)" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            삭제
          </button>
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

    <!-- 등록 모달 -->
    <AddCategoryModal v-if="isAddModalOpen" @close="isAddModalOpen=false" @refreshList="cleanAndLoad" />

    <!-- 수정 모달 -->
    <EditCategoryModal v-if="isEditModalOpen" :categoryID="selectedCategoryId" @close="isEditModalOpen = false" @refreshList="editAndLoad" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useCategoryListData from '../../hooks/useCategoryListData.js';
import { getListCategory } from '../../apis/CategoryAPI.js';
import AddCategoryModal from './CategoryAddModal.vue';
import EditCategoryModal from './CategoryEditModal.vue';

const {
  result, pageArr, loadPageData, handleDelete, searchParams,
  search, onEnterKey, cleanAndLoad, editAndLoad
} = useCategoryListData(getListCategory);

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedCategoryId = ref(null);

const openEditModal = (categoryID) => {
  selectedCategoryId.value = categoryID;
  isEditModalOpen.value = true;
};
</script>
