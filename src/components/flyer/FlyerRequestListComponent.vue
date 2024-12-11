<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">게시판</h1>
    <!-- 검색 및 필터 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <select
            v-model="filter"
            class="border border-gray-300 rounded px-4 py-2 mr-4"
        >
          <option value="all">전체</option>
          <option value="martA">마트 A</option>
          <option value="martB">마트 B</option>
        </select>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="검색어를 입력하세요"
            class="border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <button
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          @click="filterData"
      >
        검색
      </button>
    </div>
    <!-- 게시판 -->
    <table class="table-auto w-full border-collapse border border-gray-200">
      <thead>
      <tr class="bg-orange-100">
        <th class="border border-gray-300 px-4 py-2">번호</th>
        <th class="border border-gray-300 px-4 py-2">마트 이름</th>
        <th class="border border-gray-300 px-4 py-2">타이틀</th>
        <th class="border border-gray-300 px-4 py-2">설명</th>
        <th class="border border-gray-300 px-4 py-2">발신 날짜</th>
        <th class="border border-gray-300 px-4 py-2">음원 파일</th>
        <th class="border border-gray-300 px-4 py-2">이미지 파일</th>
        <th class="border border-gray-300 px-4 py-2">업로드 파일명</th>
        <th class="border border-gray-300 px-4 py-2">진행도</th>
        <th class="border border-gray-300 px-4 py-2">업로드</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item, index) in filteredData"
          :key="item.id"
          class="hover:bg-gray-100"
      >
        <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ item.martName }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ item.title }}</td>
        <td
            class="border border-gray-300 px-4 py-2 truncate max-w-[200px] cursor-pointer"
            @click="openDescriptionModal(item)"
        >
          {{ truncatedDescription(item.description) }}
        </td>
        <td class="border border-gray-300 px-4 py-2">{{ item.date }}</td>
        <td class="border border-gray-300 px-4 py-2 text-center">
          <button
              v-if="item.audioFile"
              @click="downloadFile(item.audioFile)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            다운로드
          </button>
          <span v-else class="text-gray-500">파일 없음</span>
        </td>
        <td class="border border-gray-300 px-4 py-2 text-center">
          <button
              v-if="item.imageFile"
              @click="downloadFile(item.imageFile)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            다운로드
          </button>
          <span v-else class="text-gray-500">파일 없음</span>
        </td>
        <td class="border border-gray-300 px-4 py-2">
          <span v-if="item.uploadedFileName">{{ item.uploadedFileName }}</span>
          <span v-else class="text-gray-500">업로드 없음</span>
        </td>
        <td class="border border-gray-300 px-4 py-2">{{ item.progress }}</td>
        <td class="border border-gray-300 px-4 py-2 text-center">
          <button
              @click="openUploadModal(item)"
              class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            업로드
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 업로드 모달 -->
    <upload-modal
        v-if="selectedItem"
        :item="selectedItem"
        @close="closeUploadModal"
        @file-uploaded="updateFileName"
    />

    <!-- 상세 설명 모달 -->
    <description-modal
        v-if="selectedDescription"
        :title="selectedDescription.title"
        :description="selectedDescription.description"
        @close="closeDescriptionModal"
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import UploadModal from "./UploadModal.vue";
import DescriptionModal from "./DescriptionModal.vue";

export default {
  components: {
    UploadModal,
    DescriptionModal,
  },
  setup() {
    const data = ref([
      {
        id: 1,
        martName: "마트 A",
        title: "홍보 요청",
        description: "홍보 이미지 작업 요청",
        date: "2024-12-06",
        audioFile: "https://example.com/audio/sample-audio.mp3",
        imageFile: "https://example.com/images/sample-image.jpg",
        uploadedFileName: "",
        progress: "진행 중",
      },
      {
        id: 2,
        martName: "마트 B",
        title: "이벤트 포스터",
        description:
            "이벤트 포스터 제작과 관련된 긴 설명입니다. 설명이 길면 게시판에서 잘려서 표시됩니다.",
        date: "2024-12-05",
        audioFile: null,
        imageFile: "https://example.com/images/poster.jpg",
        uploadedFileName: "",
        progress: "완료",
      },
    ]);

    const filter = ref("all");
    const searchQuery = ref("");
    const selectedItem = ref(null);
    const selectedDescription = ref(null);

    const filteredData = computed(() => {
      return data.value.filter((item) => {
        const matchesFilter =
            filter.value === "all" || item.martName.includes(filter.value);
        const matchesSearch =
            !searchQuery.value ||
            item.title.includes(searchQuery.value) ||
            item.description.includes(searchQuery.value);
        return matchesFilter && matchesSearch;
      });
    });

    const openUploadModal = (item) => {
      selectedItem.value = item;
    };

    const closeUploadModal = () => {
      selectedItem.value = null;
    };

    const openDescriptionModal = (item) => {
      selectedDescription.value = item;
    };

    const closeDescriptionModal = () => {
      selectedDescription.value = null;
    };

    const downloadFile = (fileUrl) => {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileUrl.split("/").pop();
      link.click();
    };

    const updateFileName = (itemId, fileName) => {
      const target = data.value.find((item) => item.id === itemId);
      if (target) {
        target.uploadedFileName = fileName;
      }
    };

    const truncatedDescription = (description) => {
      return description.length > 30
          ? description.substring(0, 30) + "..."
          : description;
    };

    return {
      data,
      filter,
      searchQuery,
      filteredData,
      selectedItem,
      selectedDescription,
      openUploadModal,
      closeUploadModal,
      openDescriptionModal,
      closeDescriptionModal,
      downloadFile,
      updateFileName,
      truncatedDescription,
    };
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
}
th,
td {
  text-align: center;
}
td.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
