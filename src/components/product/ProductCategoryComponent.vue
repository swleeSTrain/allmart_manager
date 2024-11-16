<template>
  <div class="max-w-7xl mx-auto p-4">
    <div
        class="flex space-x-4 py-2 overflow-x-auto items-center scrollbar-visible"
        ref="scrollContainer"
    >
      <!-- 카테고리 리스트 -->
      <div
          v-for="category in result.dtoList"
          :key="category.categoryID"
          @click="handleCategoryClick(category.categoryID)"
          :class="[
          'text-lg px-8 py-3 rounded cursor-pointer whitespace-nowrap inline-block',
          category.categoryID === selectedCategoryID
            ? 'bg-blue-500 text-white'  // 클릭된 카테고리 색상
            : 'bg-blue-100 text-black-700 hover:bg-blue-300'  // 기본 색상
        ]"
      >
        {{ category.name }}
      </div>
      <!-- 로딩 표시 -->
      <div v-if="loading" class="text-gray-500">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import useProductCategory from '../../hooks/useProductCategory.js';
import { getListCategory } from '../../apis/CategoryAPI.js';

const {
  result, loading, selectedCategoryID, scrollContainer,
  handleCategoryClick
} = useProductCategory(getListCategory);

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