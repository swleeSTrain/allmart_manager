<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <ul>
        <li
            v-for="(file, index) in files"
            :key="index"
            class="flex justify-between items-center mb-2"
        >
          <span>{{ file.name || `파일 ${index + 1}` }}</span>
          <button
              @click="downloadFile(file.url)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            다운로드
          </button>
        </li>
      </ul>
      <div class="text-right mt-4">
        <button
            @click="closeModal"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          닫기
        </button>
      </div>
    </div>
  </div>




</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    files: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "파일 목록",
    },
  },
  methods: {
    downloadFile(url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop();
      link.click();
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
