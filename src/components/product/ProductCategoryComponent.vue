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
          'px-4 py-2 rounded cursor-pointer whitespace-nowrap',
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import useCategoryListData from '../../hooks/useCategoryListData.js';
import { getListCategory } from '../../apis/CategoryAPI.js';

const { result, loading, loadCategoryPage } = useCategoryListData(getListCategory);

const scrollContainer = ref(null);
const currentPage = ref(1);

// 선택된 카테고리 ID
const selectedCategoryID = ref(null);

// 카테고리 클릭 핸들러
const handleCategoryClick = (categoryID) => {

  selectedCategoryID.value = categoryID;

  console.log('Selected Category:', categoryID);
};

// 스크롤 및 드래그 관련 상태
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// 마우스 이벤트 핸들러
const handleMouseDown = (e) => {
  isDragging = true;
  startX = e.pageX - scrollContainer.value.offsetLeft;
  scrollLeft = scrollContainer.value.scrollLeft;
};

const handleMouseMove = (e) => {
  if (!isDragging) return;
  const x = e.pageX - scrollContainer.value.offsetLeft;
  const walk = (x - startX) * 2; // 스크롤 속도 조정
  scrollContainer.value.scrollLeft = scrollLeft - walk;
};

const handleMouseUp = () => (isDragging = false);

// 스크롤 끝 감지 및 페이지 로드
const handleScroll = async () => {
  if (loading.value) return;

  const container = scrollContainer.value;
  const nearEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

  if (nearEnd) {
    currentPage.value += 1;
    await loadCategoryPage(currentPage.value);
  }
};

// 이벤트 등록 및 해제
onMounted(async () => {
  await loadCategoryPage(1);

  const container = scrollContainer.value;
  container.addEventListener('scroll', handleScroll);
  container.addEventListener('mousedown', handleMouseDown);
  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseup', handleMouseUp);
  container.addEventListener('mouseleave', handleMouseUp);
});

onBeforeUnmount(() => {
  const container = scrollContainer.value;
  container.removeEventListener('scroll', handleScroll);
  container.removeEventListener('mousedown', handleMouseDown);
  container.removeEventListener('mousemove', handleMouseMove);
  container.removeEventListener('mouseup', handleMouseUp);
  container.removeEventListener('mouseleave', handleMouseUp);
});
</script>

<style scoped>
.scrollbar-visible {
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: thin;
}

.scrollbar-visible::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-visible::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}

.scrollbar-visible::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
