<template>
  <div class="mb-5">
    <label for="files" class="block text-lg font-bold text-gray-700 mb-2">Files</label>
    <input
        ref="fileInput"
        type="file"
        id="files"
        class="hidden"
        multiple
        @change="handleFileChange"
    />
    <button
        type="button"
        @click="triggerFileInput"
        class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 text-left px-4"
    >
      {{ selectedFiles.length > 0 ? `파일 ${selectedFiles.length}개` : '이미지 첨부' }}
    </button>

    <div v-if="selectedFiles.length" class="mt-3">
      <ul>
        <li
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded"
        >
          <span class="text-gray-700">{{ file.name }}</span>
          <button
              type="button"
              @click="removeFile(index)"
              class="text-red-500 font-bold hover:underline"
          >
            X
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['updateFiles']);
const fileInput = ref(null);
const selectedFiles = ref([]);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  selectedFiles.value = [...selectedFiles.value, ...files];
  emit('updateFiles', selectedFiles.value); // 부모에게 선택된 파일 전달
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
  emit('updateFiles', selectedFiles.value); // 변경된 파일 목록 다시 전달
};
</script>
