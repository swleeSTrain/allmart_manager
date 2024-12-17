<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-700 mb-4">Edit Post</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="title" class="block text-gray-600 font-medium">Title:</label>
        <input
            type="text"
            id="title"
            v-model="boardData.title"
            required
            class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label class="block text-gray-600 font-medium">Writer:</label>
        <p class="w-full p-2 mt-1 bg-gray-100 rounded-md">{{ boardData.writer }}</p>
      </div>
      <div>
        <label for="content" class="block text-gray-600 font-medium">Content:</label>
        <textarea
            id="content"
            v-model="boardData.content"
            required
            rows="6"
            class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>
      <div>
        <label for="files" class="block text-gray-600 font-medium">Attach Files:</label>
        <input
            type="file"
            id="files"
            multiple
            @change="handleFileUpload"
            class="mt-2 text-gray-600"
        />
      </div>
      <div class="flex items-center">
        <input
            type="checkbox"
            id="isPinned"
            v-model="boardData.isPinned"
            class="mr-2"
        />
        <label for="isPinned" class="text-gray-600 font-medium">Pin this post</label>
      </div>
      <div class="flex justify-between">
        <button
            type="button"
            @click="goBack"
            class="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
            type="submit"
            class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
        >
          Update Post
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { putBoardOne, getBoardOne } from "../../apis/boardApi";

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
const files = ref([]);

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

const handleFileUpload = (event) => {
  files.value = Array.from(event.target.files);
};

const submitForm = async () => {
  try {
    const { title, content, isPinned } = boardData.value;
    await putBoardOne(props.bno, { title, content, isPinned }, files.value);
    router.push('/board/list');
  } catch (error) {
    console.error("Error updating post:", error);
    alert("Failed to update post");
  }
};

const goBack = () => {
  router.push('/board/list');
};

onMounted(fetchBoardData);
</script>