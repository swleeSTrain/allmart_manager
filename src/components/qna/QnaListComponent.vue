<template>
  <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">Q&A List</h1>

    <!-- 상단 검색 및 등록 버튼 -->
    <div class="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between bg-white p-4 rounded-lg shadow-md">
      <!-- 검색 필드 -->
      <div class="flex flex-1 gap-4 items-center">
        <input
            v-model="searchParams.keyword"
            type="text"
            placeholder="Search by keyword..."
            @keydown.enter="search"
            class="flex-1 border border-gray-300 px-4 py-3 rounded-lg shadow focus:ring focus:ring-blue-400 focus:border-blue-500"
        />
        <button
            @click="search"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Search
        </button>
        <button
            @click="cleanAndLoad"
            class="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
        >
          Reset
        </button>
      </div>
<!--      <button-->
<!--          @click="goToRegister"-->
<!--          class="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"-->
<!--      >-->
<!--        Register Question-->
<!--      </button>-->
    </div>

    <!-- Q&A 리스트 -->
    <div class="space-y-4">
      <div
          v-for="qna in result.dtoList"
          :key="qna.qno"
          @click="goToDetail(qna.qno)"
          class="flex justify-between items-center p-6 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ qna.title }}</h3>
          <p class="text-sm text-gray-600 flex items-center">
            <span class="material-icons text-blue-500 mr-2">writer</span> {{ qna.writer }}
          </p>
        </div>
        <span class="text-sm text-gray-500">{{ new Date(qna.createdDate).toLocaleString() }}</span>
      </div>
      <div v-if="result.dtoList.length === 0" class="p-6 text-center text-gray-500">
        No Q&A found.
      </div>
    </div>

    <!-- 페이징 -->
    <nav class="mt-8 flex justify-center">
      <ul class="flex gap-3">
        <li v-for="page in pageArr" :key="page.page">
          <button
              @click="loadPageData(page.page)"
              class="px-4 py-2 rounded-lg border shadow font-medium transition-colors"
              :class="{
              'bg-blue-600 text-white hover:bg-blue-700': page.page === result.currentPage,
              'bg-gray-200 text-gray-800 hover:bg-gray-300': page.page !== result.currentPage,
            }"
          >
            {{ page.label }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import useQnaListData from '../../hooks/useQnaListData.js';
import { getQuestions } from '../../apis/QnaAPI.js';

const { loading, result, searchParams, pageArr, loadPageData, search, cleanAndLoad } =
    useQnaListData(getQuestions);

const router = useRouter();

const goToDetail = (qno) => {
  router.push(`/qna/read/${qno}`);
};

// const goToRegister = () => {
//   router.push('/qna/add');
// };
</script>
