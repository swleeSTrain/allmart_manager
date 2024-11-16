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
          class="px-4 py-2 bg-blue-200 text-blue-700 rounded cursor-pointer hover:bg-blue-300 whitespace-nowrap"
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

// 카테고리 클릭 핸들러
const handleCategoryClick = (categoryID) => {
  console.log(categoryID);
};

// 가로 스크롤 감지 및 페이지 로드
const handleScroll = async () => {
  if (!scrollContainer.value || loading.value) return;

  const container = scrollContainer.value;
  const scrollRight = container.scrollLeft + container.clientWidth;
  const scrollWidth = container.scrollWidth;

  // 스크롤이 끝에 도달했는지 확인
  if (scrollRight >= scrollWidth - 10) {
    currentPage.value += 1;
    await loadCategoryPage(currentPage.value);
  }
};

// 마우스 클릭과 드래그로 스크롤 구현
let isMouseDown = false;
let startX;
let scrollLeft;

const handleMouseDown = (e) => {
  isMouseDown = true;
  startX = e.pageX - scrollContainer.value.offsetLeft;
  scrollLeft = scrollContainer.value.scrollLeft;
};

const handleMouseLeave = () => {
  isMouseDown = false;
};

const handleMouseUp = () => {
  isMouseDown = false;
};

const handleMouseMove = (e) => {
  if (!isMouseDown) return;
  const x = e.pageX - scrollContainer.value.offsetLeft;
  const walk = (x - startX) * 3; // 3은 드래그 속도 조절
  scrollContainer.value.scrollLeft = scrollLeft - walk;
};

// 스크롤 이벤트 초기화
onMounted(async () => {
  await loadCategoryPage(1);

  const container = scrollContainer.value;

  // 스크롤 이벤트 리스너 등록
  container.addEventListener('scroll', handleScroll);

  // 마우스 이벤트 리스너 등록
  container.addEventListener('mousedown', handleMouseDown);
  container.addEventListener('mouseleave', handleMouseLeave);
  container.addEventListener('mouseup', handleMouseUp);
  container.addEventListener('mousemove', handleMouseMove);
});

// 컴포넌트 언마운트 시 이벤트 제거
onBeforeUnmount(() => {
  const container = scrollContainer.value;

  // 스크롤 이벤트 리스너 제거
  container.removeEventListener('scroll', handleScroll);

  // 마우스 이벤트 리스너 제거
  container.removeEventListener('mousedown', handleMouseDown);
  container.removeEventListener('mouseleave', handleMouseLeave);
  container.removeEventListener('mouseup', handleMouseUp);
  container.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.scrollbar-visible {
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: thin;
}

/* Chrome, Safari, Edge에서 스크롤바 스타일링 */
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
