<template>
  <div class="container mx-auto p-6">
    <!-- 제목 -->
    <h1 class="text-2xl font-bold mb-6">전단지 영상 목록</h1>

    <!-- 검색 및 필터 -->
    <div class="flex items-center space-x-4 mb-6">
      <select
          v-model="filter"
          class="border rounded-md px-3 py-2 bg-white shadow-sm"
      >
        <option value="all">전체</option>
        <option value="name">이름</option>
      </select>
      <input
          type="text"
          v-model="searchQuery"
          placeholder="검색어를 입력하세요"
          class="border rounded-md px-3 py-2 shadow-sm flex-1"
      />
      <button
          @click="resetSearch"
          class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
      >
        초기화
      </button>
    </div>

    <!-- 데이터 테이블 -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead>
        <tr class="bg-yellow-200">
          <th class="border border-gray-300 px-4 py-2">번호</th>
          <th class="border border-gray-300 px-4 py-2">파일 이름</th>
          <th class="border border-gray-300 px-4 py-2">크기</th>
          <th class="border border-gray-300 px-4 py-2">업로드 날짜</th>
          <th class="border border-gray-300 px-4 py-2">링크</th>
          <th class="border border-gray-300 px-4 py-2">원본 파일</th>
          <th class="border border-gray-300 px-4 py-2">비고</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in filteredData"
            :key="item.id"
            class="odd:bg-gray-100 even:bg-white"
        >
          <td class="border border-gray-300 px-4 py-2 text-center">{{ index + 1 }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
          <td class="border border-gray-300 px-4 py-2 text-center">{{ item.size }}</td>
          <td class="border border-gray-300 px-4 py-2 text-center">{{ item.uploadDate }}</td>
          <td class="border border-gray-300 px-4 py-2 text-center">
            <a :href="item.link" class="text-blue-500 hover:underline" target="_blank">보기</a>
          </td>
          <td class="border border-gray-300 px-4 py-2 text-center">
            <a :href="item.originalFile" class="text-blue-500 hover:underline" target="_blank">다운로드</a>
          </td>
          <td class="border border-gray-300 px-4 py-2">{{ item.note }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 하단 메시지 -->
    <div class="mt-6 bg-yellow-100 p-4 rounded-md">
      <p class="text-gray-700">
        • 보통 제작 기간은 <strong class="font-bold">3~5일</strong> 정도 소요됩니다.
      </p>
      <p class="text-gray-700">
        • 문의사항은 게시판이나 <strong class="text-yellow-600 font-bold">010-000-0000</strong>
        으로 연락주시면 됩니다.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const boardData = ref([
      {
        id: 1,
        name: "12월 세일",
        size: "10MB",
        uploadDate: "2023-12-01",
        link: "http://example.com/view/1",
        originalFile: "http://example.com/download/1",
        note: "메모1",
      },

    ]);

    const searchQuery = ref("");
    const filter = ref("all");

    const sortedData = computed(() => {
      return [...boardData.value].sort((a, b) => {
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      });
    });

    const filteredData = computed(() => {
      if (filter.value === "name" && searchQuery.value) {
        return sortedData.value.filter((item) =>
            item.name.includes(searchQuery.value)
        );
      }
      return sortedData.value;
    });

    const resetSearch = () => {
      searchQuery.value = "";
      filter.value = "all";
    };

    return {
      boardData,
      searchQuery,
      filter,
      filteredData,
      resetSearch,
    };
  },
};
</script>
