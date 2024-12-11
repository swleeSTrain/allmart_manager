<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white w-96 rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold mb-4 text-center">전단지 선택</h2>
      <table class="w-full border border-gray-200 rounded-lg">
        <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2 border-b border-gray-300">마트 이름</th>
          <th class="p-2 border-b border-gray-300">전단지 타이틀</th>
          <th class="p-2 border-b border-gray-300 text-center">선택</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="flyer in filteredFlyers"
            :key="flyer.flyerID"
            class="hover:bg-gray-100"
        >
          <td class="p-2 border-b border-gray-300">{{ flyer.flyerID }}</td>
          <td class="p-2 border-b border-gray-300">{{ flyer.martName }}</td>
          <td class="p-2 border-b border-gray-300">{{ flyer.title }}</td>
          <td class="p-2 border-b border-gray-300 text-center">
            <button
                class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                @click="$emit('selectFlyer',
                {
                  flyerId: flyer.flyerID,
                  martName: flyer.martName,
                  title: flyer.title,
                })"

            >

              선택
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="mt-4 text-center">
        <button
            class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            @click="$emit('close')"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    filter: String,
  },
  data() {
    return {
      flyers: [],
    };
  },
  computed: {
    filteredFlyers() {
      if (this.filter) {
        return this.flyers.filter((flyer) =>
            flyer.martName.includes(this.filter)
        );
      }
      return this.flyers;
    },
  },
  async mounted() {
    try {
      const response = await axios.get(
          "http://localhost:8080/api/v1/flyer/list"
      );
      this.flyers = response.data.dtoList;
    } catch (error) {
      console.error("전단지 목록 조회 실패:", error);
    }
  },
};
</script>
