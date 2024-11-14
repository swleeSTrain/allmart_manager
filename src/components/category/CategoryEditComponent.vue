<template>
  <div class="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Category Edit Component</h2>
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700">이름</label>
      <input
          v-model="name"
          id="name"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <button @click="moveToList" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
      목록
    </button>
    <button @click="editCategory" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
      수정
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCategory, putEditCategory } from '../../apis/CategoryAPI.js';
import { usePage } from '../../store/usePage';
import { useCategorySearch } from '../../store/useCategorySearch.js';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const pageStore = usePage();
const searchStore = useCategorySearch();
const router = useRouter();
const route = useRoute();

const name = ref(''); // 카테고리 이름 초기화

// 컴포넌트가 마운트될 때 기존 카테고리 정보를 조회
onMounted(async () => {
  const categoryID = route.params.categoryID;
  try {
    const category = await getCategory(categoryID);
    name.value = category.name; // 기존 카테고리 이름을 입력 필드에 표시
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    Swal.fire({
      icon: 'error',
      title: '조회 실패',
      text: '카테고리 정보를 불러오는 데 실패했습니다.',
    });
  }
});

// 카테고리 목록 페이지로 이동
const moveToList = () => {
  const currentPage = pageStore.currentPage;
  const searchParams = {
    type: searchStore.type,
    keyword: searchStore.keyword,
  };

  router.push({ path: `/category/list`, query: { page: currentPage, ...searchParams } });
};

// 카테고리 수정하기
const editCategory = async () => {
  if (name.value.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: '입력 부족',
      text: '카테고리 이름은 필수 입력 사항입니다.',
    });
    return;
  }

  const categoryID = route.params.categoryID;
  if (!categoryID) {
    Swal.fire({
      icon: 'error',
      title: '잘못된 요청',
      text: '카테고리 ID가 유효하지 않습니다.',
    });
    return;
  }

  const categoryObj = {categoryID, name: name.value};

  try {
    await putEditCategory(categoryObj);
    Swal.fire({
      icon: 'success',
      title: '수정 성공!',
      text: '카테고리가 성공적으로 수정되었습니다.',
    }).then(() => {
      moveToList();
    });
  } catch (error) {
    console.error('카테고리 수정 실패:', error);
    Swal.fire({
      icon: 'error',
      title: '오류 발생',
      text: '카테고리 수정 중 오류가 발생했습니다.',
    });
  }
};

</script>
