<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-700 mb-4">Create New Post</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-gray-600 font-medium">Title:</label>
        <input
            type="text"
            v-model="postForm.title"
            id="title"
            required
            class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label for="author" class="block text-gray-600 font-medium">Author:</label>
        <input
            type="text"
            v-model="postForm.writer"
            id="author"
            required
            class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label for="content" class="block text-gray-600 font-medium">Content:</label>
        <textarea
            v-model="postForm.content"
            id="content"
            required
            class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>
      <div>
        <label for="files" class="block text-gray-600 font-medium">Attach Files:</label>
        <input
            type="file"
            id="files"
            multiple
            @change="handleFiles"
            class="mt-2 text-gray-600"
        />
      </div>
      <div class="flex items-center">
        <input
            type="checkbox"
            id="isPinned"
            v-model="postForm.isPinned"
            class="mr-2"
        />
        <label for="isPinned" class="text-gray-600 font-medium">Pin this post</label>
      </div>
      <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Submit Post
      </button>
    </form>
  </div>
</template>

<script>
import {postBoardOne} from '../../apis/boardAPI';

export default {
  data() {
    return {
      postForm: {
        title: '',
        writer: '',
        content: '',
        isPinned: false,
      },
      files: [],
    };
  },
  methods: {
    handleFiles(event) {
      this.files = Array.from(event.target.files);
    },
    async handleSubmit() {
      try {
        await postBoardOne(this.postForm, this.files)
        this.$router.push('/board/list');
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post');
      }
    },
  },
};
</script>

<style scoped>
/* TailwindCSS 기반으로 기본 스타일을 추가하므로 별도의 CSS는 최소화 */
</style>