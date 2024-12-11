<!--<template>-->
<!--  <div class="container mx-auto p-6">-->
<!--    <h1 class="text-3xl font-bold text-gray-800 mb-6">Edit Question</h1>-->

<!--    <form @submit.prevent="submitForm" class="bg-white shadow-md rounded-lg p-6">-->
<!--      <div class="mb-4">-->
<!--        <label for="title" class="block text-gray-700 font-semibold mb-2">Title</label>-->
<!--        <input-->
<!--            v-model="form.title"-->
<!--            type="text"-->
<!--            id="title"-->
<!--            placeholder="Enter question title"-->
<!--            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"-->
<!--            required-->
<!--        />-->
<!--      </div>-->
<!--      <div class="mb-4">-->
<!--        <label for="writer" class="block text-gray-700 font-semibold mb-2">Writer</label>-->
<!--        <input-->
<!--            v-model="form.writer"-->
<!--            type="text"-->
<!--            id="writer"-->
<!--            placeholder="Enter your name"-->
<!--            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"-->
<!--            required-->
<!--        />-->
<!--      </div>-->
<!--      <div class="mb-4">-->
<!--        <label for="content" class="block text-gray-700 font-semibold mb-2">Content</label>-->
<!--        <textarea-->
<!--            v-model="form.content"-->
<!--            id="content"-->
<!--            rows="5"-->
<!--            placeholder="Enter your question"-->
<!--            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"-->
<!--            required-->
<!--        ></textarea>-->
<!--      </div>-->
<!--      <button-->
<!--          type="submit"-->
<!--          class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"-->
<!--      >-->
<!--        Save Changes-->
<!--      </button>-->
<!--    </form>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import {ref, onMounted} from 'vue';-->
<!--import {useRoute, useRouter} from 'vue-router';-->
<!--import {fetchQuestionById, updateQuestion} from '../../apis/QnaAPI.js';-->

<!--const route = useRoute();-->
<!--const router = useRouter();-->
<!--const qno = route.params.qno;-->

<!--const form = ref({-->
<!--  title: '',-->
<!--  writer: '',-->
<!--  content: '',-->
<!--});-->

<!--const loadQuestion = async () => {-->
<!--  try {-->
<!--    const questionData = await fetchQuestionById(qno);-->
<!--    form.value = {-->
<!--      title: questionData?.title || '',-->
<!--      writer: questionData?.writer || '',-->
<!--      content: questionData?.content || '',-->
<!--    };-->
<!--  } catch (error) {-->
<!--    console.error('Failed to fetch question:', error);-->
<!--    alert('Failed to load question details.');-->
<!--  }-->
<!--};-->

<!--const submitForm = async () => {-->
<!--  try {-->
<!--    await updateQuestion(qno, form.value);-->
<!--    alert('Question updated successfully.');-->
<!--    router.push(`/qna/read/${qno}`);-->
<!--  } catch (error) {-->
<!--    console.error('Error updating question:', error);-->
<!--    alert('Failed to update the question.');-->
<!--  }-->
<!--};-->

<!--onMounted(() => {-->
<!--  loadQuestion();-->
<!--});-->
<!--</script>-->
