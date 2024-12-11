<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-10 w-[60rem] shadow-lg">
      <h2 class="text-3xl font-bold mb-6 text-center">파일 업로드</h2>
      <p class="text-gray-700 mb-6 text-lg">
        <strong>항목:</strong> {{ item.title }}
      </p>

      <div>
        <label class="block text-gray-700 mb-4 text-lg">파일 선택:</label>
        <input
            type="file"
            @change="handleFileChange"
            class="w-full border px-4 py-3 rounded text-lg"
        />
      </div>

      <div class="mt-6 flex justify-end">
        <button
            @click="handleUpload"
            :disabled="!selectedFile"
            class="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:bg-gray-400 text-lg"
        >
          업로드
        </button>
        <button
            @click="$emit('close')"
            class="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 ml-4 text-lg"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(_, { emit }) {
    const selectedFile = ref(null);

    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const handleUpload = () => {
      if (selectedFile.value) {
        console.log("업로드 파일:", selectedFile.value);
        console.log("업로드 대상:", _.item);

        // 파일 이름 업데이트
        emit("file-uploaded", _.item.id, selectedFile.value.name);
        alert("업로드 성공!");
        emit("close");
      }
    };

    return {
      selectedFile,
      handleFileChange,
      handleUpload,
    };
  },
};
</script>

<style scoped>
.fixed {
  z-index: 1000;
}
</style>
