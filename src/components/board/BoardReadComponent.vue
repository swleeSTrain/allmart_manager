<template>
  <div>
    <!-- 타이틀 섹션 -->
    <div class="border-b pb-4 mb-6 flex justify-between items-start">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ boardData.title }}</h2>
        <p class="text-sm text-gray-500">
          <span class="font-semibold">Writer:</span> {{ boardData.writer || 'Anonymous' }} &bull;
          <span class="font-semibold">Created:</span> {{ formatDate(boardData.createTime) }} &bull;
          <span class="font-semibold">Updated:</span> {{ formatDate(boardData.updateTime) }}
        </p>
      </div>
      <button
          @click="togglePin"
          :class="['px-4 py-2 rounded-lg transition',
                 boardData.isPinned
                   ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                   : 'bg-gray-200 hover:bg-gray-300 text-gray-700']"
      >
        {{ boardData.isPinned ? 'Unpin Post' : 'Pin Post' }}
      </button>
    </div>

    <!-- 내용 섹션 -->
    <div class="mb-8">
      <!-- 썸네일을 제외한 모든 이미지 출력 -->
      <div v-if="nonThumbnailFiles.length" class="mb-6 flex flex-wrap gap-4">
        <img
            v-for="file in nonThumbnailFiles"
            :src="file"
            :key="file"
            class="w-1/4 h-auto object-contain rounded-lg shadow-md hover:shadow-lg transition"
            alt="Attached Image"
        />
      </div>

      <!-- 게시글 내용 -->
      <p class="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">{{ boardData.content }}</p>
    </div>

    <!-- 첨부 파일 섹션 -->
    <div v-if="boardData.filename && boardData.filename.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Attached Files:</h3>
      <div class="flex flex-wrap gap-4">
        <a
            v-for="file in boardData.filename"
            :key="file"
            :href="file"
            :download="getFileName(file)"
            class="text-blue-500 hover:underline cursor-pointer flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 transition hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{{ getFileName(file) }}</span>
        </a>
      </div>
    </div>

    <!-- 버튼 섹션 -->
    <div class="flex justify-end space-x-4">
      <button
          @click="goBack"
          class="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 transition"
      >
        Back to List
      </button>
      <button
          @click="editPost"
          class="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:ring focus:ring-green-300 transition"
      >
        Edit Post
      </button>
      <button
          @click="deletePost"
          class="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:ring focus:ring-red-300 transition"
      >
        Delete Post
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getBoardOne, deleteBoardOne, togglePinPost } from '../../apis/boardAPI';

const props = defineProps({
  bno: {
    type: String,
    required: true,
  }
});

const boardData = ref({
  title: '',
  writer: '',
  content: '',
  filename: [],
  createTime: '',
  updateTime: '',
  isPinned: false,
});

const router = useRouter();

const fetchBoardData = async () => {
  try {
    const response = await getBoardOne(props.bno);
    if (response && response.dtoList && response.dtoList.length > 0) {
      boardData.value = response.dtoList[0];
    } else {
      console.error('No data found for the given board number.');
    }
  } catch (error) {
    console.error('Error fetching board data:', error);
  }
};

// 썸네일이 아닌 파일 리스트 필터링
const nonThumbnailFiles = computed(() =>
    boardData.value.filename.filter(file => !file.includes('s_'))
);

const getFileName = (url) => {
  return url.split('/').pop();
};

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

const goBack = () => {
  router.push('/board/list');
};

const editPost = () => {
  router.push(`/board/update/${props.bno}`);
};

const deletePost = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await deleteBoardOne(props.bno);
      console.log('Post deleted successfully.');
      goBack();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
};

const togglePin = async () => {
  try {
    await togglePinPost(props.bno);
    boardData.value.isPinned = !boardData.value.isPinned;
  } catch (error) {
    console.error('Error toggling pin status:', error);
  }
};

onMounted(fetchBoardData);
</script>