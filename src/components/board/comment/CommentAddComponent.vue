<template>
  <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">댓글 작성</h3>
    <form @submit.prevent="submitComment" class="space-y-4">
      <div>
        <label for="writer" class="block text-sm font-medium text-gray-700">작성자:</label>
        <input id="writer" v-model="writer" required
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700">내용:</label>
        <textarea id="content" v-model="content" required rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
      </div>
      <button type="submit"
              class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition">
        댓글 작성
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { postCommentOne } from '../../../apis/CommentAPI.js';

export default {
  name: 'CommentForm',
  props: {
    bno: {
      type: String,
      required: true
    }
  },
  emits: ['comment-added'],
  setup(props, { emit }) {
    const writer = ref('');
    const content = ref('');

    const submitComment = async () => {
      try {
        const newComment = await postCommentOne({
          boardPost: props.bno,
          writer: writer.value,
          content: content.value
        });
        writer.value = '';
        content.value = '';
        emit('comment-added', newComment);
      } catch (error) {
        console.error('댓글 작성에 실패했습니다:', error);
      }
    };

    return {
      writer,
      content,
      submitComment
    };
  }
};
</script>