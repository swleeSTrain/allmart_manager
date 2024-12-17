<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">게시판</h2>
    <div class="flex items-center space-x-2 mb-4">
      <select v-model="searchParams.type" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="all">All</option>
        <option value="title">Title</option>
        <option value="content">Content</option>
        <option value="writer">Writer</option>
      </select>
      <input
          v-model="searchParams.keyword"
          type="text"
          placeholder="검색어를 입력하세요"
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
      />
      <button @click="search" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        검색
      </button>
    </div>
    <button @click="navigateToCreate" class="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">게시물 작성</button>

    <!-- 게시물 목록 헤더 -->
    <div class="grid grid-cols-7 gap-4 font-bold bg-gray-100 p-2 rounded-t-lg">
      <div>상단고정</div>
      <div>글번호</div>
      <div class="col-span-2">제목</div>
      <div>작성자</div>
      <div>작성일</div>
      <div>수정일</div>
    </div>

    <!-- 게시물 목록 -->
    <div class="space-y-1">
      <div v-for="post in sortedPosts" :key="post.bno"
           :class="postClasses(post)"
           @click="moveToRead(post.bno)"
           @mouseenter="hoveredImage = post.fileName"
           @mouseleave="hoveredImage = null">
        <div>
          <span v-if="post.pinned" class="text-yellow-500">
            📌
          </span>
        </div>
        <div>{{ post.bno }}</div>
        <div class="col-span-2 font-semibold relative" @click="moveToRead(post.bno)">
          {{ post.title }}
          <img v-if="post.fileName && post.fileName != '' && hoveredImage === post.fileName"
               :src="post.fileName"
               class="absolute top-full left-0 w-32 h-32 object-cover shadow-lg z-10"
               alt="Preview Image" />
        </div>
        <div>{{ post.writer || 'Anonymous' }}</div>
        <div class="text-sm">{{ formatDate(post.createTime) }}</div>
        <div class="text-sm">
          {{ shouldDisplayUpdateDate(post.createTime, post.updateTime) ? formatDate(post.updateTime) : '-' }}
        </div>
      </div>
    </div>

    <!-- 페이징 컨트롤 -->
    <div class="mt-4 flex justify-center space-x-2">
      <button v-for="page in pageArr" :key="page.page"
              @click="loadPageData(page.page)"
              :class="['px-3 py-1 rounded',
                       page.page === result.current ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']">
        {{ page.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import { useRouter } from 'vue-router';
import useBoardListData from '../../hooks/useBoardListData.js';
import { getBoardList } from '../../apis/boardAPI';

const router = useRouter();
const hoveredImage = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const shouldDisplayUpdateDate = (createTime, updateTime) => {
  return createTime !== updateTime;
};

const navigateToCreate = () => {
  router.push('/board/add');
};

const { result, pageArr, loadPageData, searchParams, search, moveToRead } = useBoardListData(getBoardList);

// 게시물을 정렬하는 computed 속성
const sortedPosts = computed(() => {
  return [...result.value.dtoList].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });
});

// 게시물의 클래스를 결정하는 함수
const postClasses = (post) => [
  'grid', 'grid-cols-7', 'gap-4', 'items-center', 'border-b', 'p-2', 'cursor-pointer',
  { 'bg-gray-200': post.pinned },
  { 'hover:bg-gray-100': !post.pinned }
];
</script>