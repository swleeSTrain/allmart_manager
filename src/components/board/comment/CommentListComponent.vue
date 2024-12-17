<template>
  <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">댓글 목록</h3>
    <ul v-if="comments.length > 0" class="space-y-4">
      <li v-for="comment in comments" :key="comment.cno"
          class="bg-gray-50 p-4 rounded-lg shadow">
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>작성자: {{ comment.writer }}</span>
          <span>작성일: {{ formatDate(comment.createTime) }}</span>
        </div>
        <div v-if="editingCommentId === comment.cno">
          <textarea v-model="editContent" rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
          <div class="mt-2 space-x-2">
            <button @click="updateComment(comment.cno)"
                    class="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none">
              저장
            </button>
            <button @click="cancelEdit"
                    class="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 focus:outline-none">
              취소
            </button>
          </div>
        </div>
        <p v-else class="text-gray-800 mb-2">{{ comment.content }}</p>
        <div v-if="editingCommentId !== comment.cno" class="mt-2 space-x-2">
          <button @click="editComment(comment)"
                  class="text-blue-500 hover:text-blue-700 focus:outline-none">
            수정
          </button>
          <button @click="deleteComment(comment.cno)"
                  class="text-red-500 hover:text-red-700 focus:outline-none">
            삭제
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500 italic">댓글이 없습니다.</p>

    <!-- 페이지네이션 -->
    <div class="mt-6 flex justify-center items-center space-x-4">
      <button @click="changePage(-1)" :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 transition">
        이전
      </button>
      <span class="text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(1)" :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 transition">
        다음
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { getCommentList, deleteCommentOne, updateCommentOne } from '../../../apis/CommentAPI.js';

export default {
  name: 'CommentList',
  props: {
    bno: {
      type: String,
      required: true
    }
  },
  emits: ['update-comment-count'],
  setup(props, { emit }) {
    const comments = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const editingCommentId = ref(null);
    const editContent = ref('');

    const fetchComments = async () => {
      try {
        const response = await getCommentList(props.bno, currentPage.value);
        comments.value = response.dtoList;
        totalPages.value = response.totalPage;
        emit('update-comment-count', response.totalCount);
      } catch (error) {
        console.error('댓글 목록을 불러오는 데 실패했습니다:', error);
      }
    };

    const editComment = (comment) => {
      editingCommentId.value = comment.cno;
      editContent.value = comment.content;
    };

    const updateComment = async (cno) => {
      try {
        console.log('수정할 댓글:', cno, editContent.value);
        await updateCommentOne(cno, { content: editContent.value });
        await fetchComments();
        cancelEdit();
      } catch (error) {
        console.error('댓글 수정에 실패했습니다:', error);
      }
    };

    const cancelEdit = () => {
      editingCommentId.value = null;
      editContent.value = '';
    };

    const deleteComment = async (cno) => {
      if (confirm('댓글을 삭제하시겠습니까?')) {
        try {
          await deleteCommentOne(cno);
          await fetchComments();
        } catch (error) {
          console.error('댓글 삭제에 실패했습니다:', error);
        }
      }
    };

    const changePage = (direction) => {
      currentPage.value += direction;
      fetchComments();
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    onMounted(fetchComments);
    watch(() => props.bno, fetchComments);

    return {
      comments,
      currentPage,
      totalPages,
      editingCommentId,
      editContent,
      editComment,
      updateComment,
      cancelEdit,
      deleteComment,
      changePage,
      formatDate
    };
  }
};
</script>