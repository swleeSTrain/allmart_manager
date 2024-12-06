<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-10 w-[60rem] shadow-lg">
      <h2 class="text-3xl font-bold mb-6 text-center">설명 상세화면</h2>
      <div class="mb-6">
        <label class="block text-gray-700 font-semibold mb-4 text-lg">타이틀</label>
        <div
            class="border border-gray-300 rounded px-6 py-4 bg-gray-50 cursor-default text-lg"
        >
          {{ title }}
        </div>
      </div>
      <div>
        <label class="block text-gray-700 font-semibold mb-4 text-lg">설명</label>
        <div
            class="border border-gray-300 rounded px-6 py-4 bg-gray-50 cursor-default h-[20rem] overflow-y-auto text-lg"
        >
          {{ description }}
        </div>
      </div>
      <div class="mt-6 flex justify-center">
        <button
            @click="$emit('close')"
            class="bg-blue-500 text-white px-6 py-3 text-lg rounded hover:bg-blue-600"
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.fixed {
  z-index: 1000;
}
</style>
