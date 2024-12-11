<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Register Q&A</h1>

    <form @submit.prevent="submitForm">
      <input v-model="title" placeholder="Title" class="border px-3 py-2 rounded mb-2 w-full" />
      <textarea
          v-model="content"
          placeholder="Content"
          class="border px-3 py-2 rounded mb-2 w-full"
      ></textarea>

      <!-- FileUploadComponent 활용 -->
      <FileUploadComponent @updateFiles="updateFiles" />

      <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQna } from '../../hooks/useQna';
import FileUploadComponent from '../common/FileUploadComponent.vue';

const { createQuestion } = useQna();

const title = ref('');
const content = ref('');
const files = ref([]);

const updateFiles = (uploadedFiles) => {
  files.value = uploadedFiles; // FileUploadComponent에서 전달된 파일 업데이트
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('content', content.value);
  files.value.forEach((file) => formData.append('files', file));

  await createQuestion(formData);
};
</script>
