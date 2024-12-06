원래

<template>
  <div class="max-w-screen-xl mx-auto p-10 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold mb-10 text-center">전단지 영상 파일 업로드</h1>

    <!-- 제목 및 설명 -->
    <div class="grid grid-cols-2 gap-12 mb-12">
      <div>
        <label class="block text-lg font-semibold mb-2">타이틀</label>
        <input
            v-model="title"
            type="text"
            placeholder="타이틀을 정해주세요"
            class="border border-gray-300 rounded-md p-4 w-full shadow-md"
        />
      </div>
      <div>
        <label class="block text-lg font-semibold mb-2">설명</label>
        <textarea
            v-model="content"
            placeholder="영상 제작에 필요한 내용을 적어주세요"
            class="border border-gray-300 rounded-md p-4 w-full shadow-md"
            rows="5"
        ></textarea>
      </div>
    </div>

    <!-- 파일 업로드 섹션 -->
    <div class="grid grid-cols-2 gap-12">
      <!-- 첨부파일 -->
      <div>
        <h2 class="text-xl font-bold mb-6">첨부파일</h2>
        <div class="flex items-center gap-6 mb-6">
          <button
              @click="triggerFileInput('attachments')"
              class="px-6 py-3 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600"
          >
            업로드
          </button>
          <button
              @click="deleteSelected('attachments')"
              class="px-6 py-3 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600"
          >
            삭제
          </button>
        </div>
        <div class="file-table border rounded-md shadow-lg overflow-hidden">
          <table class="w-full table-auto border-collapse">
            <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 border text-center">
                <input
                    type="checkbox"
                    @change="toggleSelectAll('attachments')"
                />
              </th>
              <th class="px-4 py-3 border">순서</th>
              <th class="px-4 py-3 border">파일명</th>
              <th class="px-4 py-3 border">유형</th>
              <th class="px-4 py-3 border">크기</th>
            </tr>
            </thead>
            <draggable tag="tbody" v-model="attachments" @end="updateOrder('attachments')">
              <template #item="{ element, index }">
                <tr class="even:bg-gray-50">
                  <td class="px-4 py-3 border text-center">
                    <input type="checkbox" v-model="selectedAttachments" :value="element.id" />
                  </td>
                  <td class="px-4 py-3 border text-center">{{ index + 1 }}</td>
                  <td class="px-4 py-3 border">{{ element.name }}</td>
                  <td class="px-4 py-3 border">{{ element.type }}</td>
                  <td class="px-4 py-3 border text-right">{{ formatFileSize(element.size) }}</td>
                </tr>
              </template>
            </draggable>
          </table>
        </div>
      </div>

      <!-- 음원파일 -->
      <div>
        <h2 class="text-xl font-bold mb-6">음원파일</h2>
        <div class="flex items-center gap-6 mb-6">
          <button
              @click="triggerFileInput('audioFiles')"
              class="px-6 py-3 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600"
          >
            업로드
          </button>
          <button
              @click="deleteSelected('audioFiles')"
              class="px-6 py-3 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600"
          >
            삭제
          </button>
        </div>
        <div class="file-table border rounded-md shadow-lg overflow-hidden">
          <table class="w-full table-auto border-collapse">
            <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 border text-center">
                <input
                    type="checkbox"
                    @change="toggleSelectAll('audioFiles')"
                />
              </th>
              <th class="px-4 py-3 border">순서</th>
              <th class="px-4 py-3 border">파일명</th>
              <th class="px-4 py-3 border">유형</th>
              <th class="px-4 py-3 border">크기</th>
            </tr>
            </thead>
            <draggable tag="tbody" v-model="audioFiles" @end="updateOrder('audioFiles')">
              <template #item="{ element, index }">
                <tr class="even:bg-gray-50">
                  <td class="px-4 py-3 border text-center">
                    <input type="checkbox" v-model="selectedAudioFiles" :value="element.id" />
                  </td>
                  <td class="px-4 py-3 border text-center">{{ index + 1 }}</td>
                  <td class="px-4 py-3 border">{{ element.name }}</td>
                  <td class="px-4 py-3 border">{{ element.type }}</td>
                  <td class="px-4 py-3 border text-right">{{ formatFileSize(element.size) }}</td>
                </tr>
              </template>
            </draggable>
          </table>
        </div>
      </div>
    </div>

    <!-- 전송 버튼 -->
    <div class="flex justify-end mt-12">
      <button
          @click="sendAllData"
          class="px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 text-lg"
      >
        전송
      </button>
    </div>

    <!-- 숨겨진 파일 입력 -->
    <input ref="attachmentsInput" type="file" class="hidden" multiple @change="handleFileUpload('attachments')" />
    <input ref="audioFilesInput" type="file" class="hidden" multiple @change="handleFileUpload('audioFiles')" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import draggable from "vuedraggable";
import { useFlyerData } from "../../hooks/useFlyerData.js";
import { registerFlyers } from "../../apis/flyerAPI.js";

const { content, audioFiles, title, attachments, getFlyerData } = useFlyerData();

const selectedAttachments = ref([]);
const selectedAudioFiles = ref([]);
const attachmentsInput = ref(null);
const audioFilesInput = ref(null);



// 파일 크기 포맷 함수
const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
};

// 파일 입력 트리거 함수
const triggerFileInput = (type) => {
  if (type === "attachments") {
    attachmentsInput.value.click();
  } else if (type === "audioFiles") {
    audioFilesInput.value.click();
  }
};

// 파일 업로드 처리
const handleFileUpload = (type) => {
  const input = type === "attachments" ? attachmentsInput.value : audioFilesInput.value;
  const uploadedFiles = Array.from(input.files).map((file) => ({
    id: Date.now() + Math.random(),
    name: file.name,
    size: file.size,
    type: file.type || "Unknown",
  }));

  if (type === "attachments") {
    attachments.value = [...attachments.value, ...uploadedFiles];
  } else if (type === "audioFiles") {
    audioFiles.value = [...audioFiles.value, ...uploadedFiles];
  }

  input.value = null; // 입력 초기화
};

// 선택 파일 삭제
const deleteSelected = (type) => {
  if (type === "attachments") {
    attachments.value = attachments.value.filter((file) => !selectedAttachments.value.includes(file.id));
    selectedAttachments.value = [];
  } else if (type === "audioFiles") {
    audioFiles.value = audioFiles.value.filter((file) => !selectedAudioFiles.value.includes(file.id));
    selectedAudioFiles.value = [];
  }
};

const sendAllData = async () => {
  // 타이틀과 설명이 비어있는지 확인
  if (!title.value.trim() || !content.value.trim()) {
    alert("타이틀과 설명을 입력해 주세요.");
    return; // 유효성 검사를 통과하지 못하면 요청을 중단
  }

  // 데이터 준비
  const dataToSend = getFlyerData();
  console.log("Sending data:", dataToSend);

  try {
    // API 호출
    await registerFlyers(dataToSend);
    alert("데이터 전송 성공!");
  } catch (error) {
    console.error("데이터 전송 중 오류 발생:", error);
    alert("데이터 전송에 실패했습니다. 다시 시도해주세요.");
  }
};
</script>

<style scoped>
/* Tailwind CSS를 활용한 스타일 */
</style>
