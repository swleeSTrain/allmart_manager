<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-bold mb-4">Edit Answer</h3>
    <form @submit.prevent="submitEdit">
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-semibold mb-2">Edit Your Answer</label>
        <textarea
            v-model="form.content"
            id="content"
            rows="4"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            required
        ></textarea>
      </div>
      <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { updateAnswer } from "../../apis/QnaAPI.js";

const answer = defineProps(["answer"]); // 현재 답변 데이터를 부모로부터 받음
const form = ref({ ...answer });

const emit = defineEmits(["answer-updated"]);

const submitEdit = async () => {
  try {
    await updateAnswer(answer.ano, form.value);
    alert("Answer updated successfully.");
    emit("answer-updated"); // 부모 컴포넌트에서 데이터를 다시 로드하도록 이벤트 발행
  } catch (error) {
    console.error("Error updating answer:", error);
    alert("Failed to update the answer. Please try again.");
  }
};
</script>
