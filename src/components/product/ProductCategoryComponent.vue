<template>
  <div class="max-w-7xl mx-auto p-4">
    <div class="flex space-x-4 py-2 overflow-x-auto items-center">
      <!-- 카테고리 리스트 -->
      <div
          v-for="category in result.dtoList"
          :key="category.categoryID"
          @click="handleCategoryClick(category.categoryID)"
          class="px-4 py-2 bg-blue-200 text-blue-700 rounded cursor-pointer hover:bg-blue-300 whitespace-nowrap"
      >
        {{ category.name }}
      </div>
      <!-- 로딩 표시 -->
      <div v-if="loading" class="text-gray-500">Loading...</div>
      <!-- 다음 페이지 로드를 위한 가상 요소 -->
      <div ref="loadTrigger" class="w-1"></div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
import useCategoryListData from '../../hooks/useCategoryListData.js';
import {getListCategory} from '../../apis/CategoryAPI.js';

// useCategoryListData에서 데이터 로드 메서드와 상태 가져오기
const {result, loading, loadCategoryPage} = useCategoryListData(getListCategory);

// 카테고리 클릭 핸들러
const handleCategoryClick = (categoryID) => {
  console.log('Clicked categoryID:', categoryID);
};

// 현재 페이지 상태
const currentPage = ref(1);
// IntersectionObserver의 트리거 요소
const loadTrigger = ref(null);

// 무한 스크롤을 감지하는 메서드
const observeScrollEnd = async () => {
  await nextTick(); // DOM이 렌더링된 이후 loadTrigger 요소가 초기화되도록 보장
  if (!loadTrigger.value) return;

  const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loading.value) {
          currentPage.value += 1;
          await loadCategoryPage(currentPage.value); // 다음 페이지 로드
        }
      },
      {root: null, threshold: 1.0} // 화면에 100% 보였을 때만 트리거
  );

  observer.observe(loadTrigger.value); // 트리거 요소 관찰 시작
};

// 컴포넌트가 마운트되었을 때 첫 데이터 로드 및 무한 스크롤 초기화
onMounted(() => {
  loadCategoryPage(1); // 첫 페이지 로드
  observeScrollEnd();
});
</script>
