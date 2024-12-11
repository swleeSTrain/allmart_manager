<template>
  <div class="container mx-auto py-8 px-6">
    <!-- Q&A 제목 -->
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Q&A Detail</h1>

    <!-- 질문 섹션 -->
    <div class="bg-white shadow rounded-lg p-6 mb-8 border">
      <h2 class="text-3xl font-semibold text-gray-700 mb-4">{{ question?.title }}</h2>
      <p class="text-sm text-gray-500 mb-4">
        By <span class="font-medium">{{ question?.writer }}</span>,
        <span class="italic">{{ new Date(question?.createdDate).toLocaleString() }}</span>
      </p>
      <p class="text-gray-700 text-lg leading-relaxed mb-6">{{ question?.content }}</p>

      <!-- 첨부 이미지 -->
      <div v-if="question?.attachFiles?.length" class="mt-4">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Attached Images:</h3>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <li v-for="(file, index) in question.attachFiles" :key="index">
            <img
                :src="getFileUrl(file)"
                alt="Attachment"
                class="w-full h-auto rounded-lg border shadow-md hover:shadow-lg transition-shadow"
            />
          </li>
        </ul>
      </div>
    </div>

    <!-- 답변 섹션 -->
    <div class="bg-gray-50 shadow rounded-lg p-6">
      <h3 class="text-2xl font-semibold text-gray-700 mb-6">Answers</h3>

      <!-- 답변 추가 -->
      <button
          @click="toggleAddAnswerForm"
          class="mb-6 px-4 py-2 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 transition"
      >
        {{ showAddAnswerForm ? "Cancel Answer" : "Add Answer" }}
      </button>
      <div v-show="showAddAnswerForm" class="bg-white p-4 rounded-lg shadow mb-8">
        <form @submit.prevent="submitAnswer">
          <div class="mb-4">
            <label for="answer-content" class="block text-gray-700 font-medium mb-2">Answer Content</label>
            <textarea
                id="answer-content"
                v-model="answerForm.content"
                rows="4"
                placeholder="Write your answer here..."
                class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="answer-writer" class="block text-gray-700 font-medium mb-2">Your Name</label>
            <input
                id="answer-writer"
                v-model="answerForm.writer"
                type="text"
                placeholder="Your name"
                class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
            />
          </div>
          <button
              type="submit"
              class="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition"
          >
            Submit Answer
          </button>
        </form>
      </div>

      <!-- 답변 리스트 -->
      <div>
        <ul>
          <li
              v-for="answer in question?.answers || []"
              :key="answer.ano"
              class="bg-white p-6 rounded-lg shadow border mb-4"
          >
            <div>
              <!-- 답변 내용 -->
              <p v-if="!editMode[answer.ano]" class="text-gray-800 text-base leading-relaxed mb-2">
                {{ answer.content }}
              </p>
              <div v-else>
                <textarea
                    v-model="editForm[answer.ano].content"
                    class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
                ></textarea>
              </div>
              <!-- 작성자 정보 -->
              <p class="text-sm text-gray-500 mt-2">
                <span class="font-medium">{{ answer.writer }}</span>,
                <span class="italic">{{ new Date(answer.createdDate).toLocaleString() }}</span>
              </p>
            </div>
            <!-- 버튼 그룹 -->
            <div class="mt-4 flex gap-4">
              <button
                  v-if="!editMode[answer.ano]"
                  @click="toggleEditMode(answer.ano)"
                  class="px-4 py-2 text-sm text-blue-500 font-medium rounded hover:bg-blue-50 transition"
              >
                Edit
              </button>
              <button
                  v-else
                  @click="submitEditAnswer(answer.ano)"
                  class="px-4 py-2 text-sm text-green-500 font-medium rounded hover:bg-green-50 transition"
              >
                Save
              </button>
              <button
                  @click="handleDeleteAnswer(answer.ano)"
                  class="px-4 py-2 text-sm text-red-500 font-medium rounded hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
        <p v-if="!question?.answers?.length" class="text-gray-500 text-lg text-center">
          No answers yet.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {
  fetchQuestionById,
  addAnswer,
  deleteAnswer as deleteAnswerAPI,
  updateAnswer as updateAnswerAPI,
} from "../../apis/QnaAPI.js";

const route = useRoute();
const qno = route.params.qno;
const question = ref(null);

// 파일 URL 생성 함수
const getFileUrl = (fileName) => {
  const baseUrl = "http://localhost:8080/uploads"; // 파일 저장 URL
  return `${baseUrl}/${fileName}`;
};

const toggleAddAnswerForm = () => {
  showAddAnswerForm.value = !showAddAnswerForm.value;
  console.log("Add Answer Form Visible:", showAddAnswerForm.value);
};

// 답변 추가 폼 데이터
const answerForm = ref({
  content: "",
  writer: "",
});

// 답변 수정 관련 상태
const editMode = ref({});
const editForm = ref({});

// 상태 관리
const showAddAnswerForm = ref(false);

// 질문 데이터 로드
const loadQuestion = async () => {
  try {
    question.value = await fetchQuestionById(qno);
    editMode.value = {};
    editForm.value = {};
    question.value.answers.forEach((answer) => {
      editMode.value[answer.ano] = false;
      editForm.value[answer.ano] = {content: answer.content};
    });
  } catch (error) {
    console.error("Error fetching question detail:", error);
    alert("Failed to load question details.");
  }
};

// 답변 추가
const submitAnswer = async () => {
  try {
    await addAnswer({...answerForm.value, qno});
    alert("Answer submitted successfully.");
    answerForm.value = {content: "", writer: ""};
    showAddAnswerForm.value = false;
    loadQuestion();
  } catch (error) {
    console.error("Error submitting answer:", error);
    alert("Failed to submit answer.");
  }
};

// 답변 수정
const toggleEditMode = (ano) => {
  editMode.value[ano] = !editMode.value[ano];
};

const submitEditAnswer = async (ano) => {
  try {
    await updateAnswerAPI(ano, {
      content: editForm.value[ano].content,
      writer: question.value.answers.find((answer) => answer.ano === ano).writer,
    });
    alert("Answer updated successfully.");
    toggleEditMode(ano);
    loadQuestion();
  } catch (error) {
    console.error("Error updating answer:", error);
    alert("Failed to update answer.");
  }
};

// 답변 삭제
const handleDeleteAnswer = async (ano) => {
  if (confirm("Are you sure you want to delete this answer?")) {
    try {
      await deleteAnswerAPI(ano);
      alert("Answer deleted successfully.");
      loadQuestion();
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Failed to delete answer.");
    }
  }
};

onMounted(() => {
  loadQuestion();
});
</script>
