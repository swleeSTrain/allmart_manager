<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-bold mb-4">Add an Answer</h3>
    <form @submit.prevent="submitAnswer">
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-semibold mb-2">Your Answer</label>
        <textarea
            v-model="form.content"
            id="content"
            rows="4"
            placeholder="Write your answer here..."
            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            required
        ></textarea>
      </div>
      <div class="mb-4">
        <label for="writer" class="block text-gray-700 font-semibold mb-2">Your Name</label>
        <input
            v-model="form.writer"
            id="writer"
            type="text"
            placeholder="Your name"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            required
        />
      </div>
      <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Submit Answer
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { addAnswer } from "../../apis/QnaAPI.js";

const form = ref({
  content: "",
  writer: "",
});

const qno = inject("qno"); // 질문 ID를 부모 컴포넌트에서 전달받음
const emit = defineEmits(["answer-added"]); // 부모 컴포넌트에 이벤트 전달

const submitAnswer = async () => {
  try {
    await addAnswer({ ...form.value, qno });
    alert("Your answer has been submitted successfully.");
    emit("answer-added"); // 부모 컴포넌트에서 데이터를 다시 로드하도록 이벤트 발행
    form.value = { content: "", writer: "" }; // 폼 초기화
  } catch (error) {
    console.error("Error submitting answer:", error);
    alert("Failed to submit your answer. Please try again.");
  }
};
</script>
