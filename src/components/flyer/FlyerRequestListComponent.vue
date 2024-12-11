<
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
        <th class="border border-gray-300 px-4 py-2">링크</th>
        <th class="border border-gray-300 px-4 py-2">진행도</th>
      </tr>
      </thead>
      <tbody>
      <!-- 데이터가 없는 경우 -->
      <tr v-if="filteredData.length === 0">
        <td colspan="10" class="text-center">데이터가 없습니다.</td>
      </tr>
      <!-- 데이터가 있는 경우 -->
      <tr
          v-for="(item, index) in filteredData"
          :key="item.flyerID"
          class="hover:bg-gray-100"
      >
        <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ item.martName || '마트 이름 없음' }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ item.title || '타이틀 없음' }}</td>
        <td
            class="border border-gray-300 px-4 py-2 truncate max-w-[200px] cursor-pointer"
            @click="openDescriptionModal(item)"
        >
          {{ truncatedDescription(item.content) }}
        </td>
        <!-- 발신 날짜 -->
        <td class="border border-gray-300 px-4 py-2"> {{ formatDate(item.createdDate) || '날짜 없음' }}</td>
        <!-- 음원 파일 -->
        <td class="border border-gray-300 px-4 py-2 text-center">
          <button
              v-if="item.audioURL && item.audioURL.length > 0"
              @click="openAudioModal(item.audioURL)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            다운로드
          </button>
          <span v-else class="text-gray-500">파일 없음</span>
        </td>
        <td class="border border-gray-300 px-4 py-2 text-center">
          <button
              v-if="item.attachImages && item.attachImages.length > 0"
              @click="openImageModal(item.attachImages)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            다운로드
          </button>
          <span v-else class="text-gray-500">파일 없음</span>
        </td>


        <!-- 업로드 파일명 -->
        <td class="border border-gray-300 px-4 py-2">
          <button
              v-if="item.producedVideo && item.producedVideo.originalFile"
              @click="downloadFile(item.producedVideo.originalFile)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {{ item.producedVideo.fileName || '없음' }}
          </button>
          <span v-else class="text-gray-500">업로드 없음</span>
        </td>


        <td class="border border-gray-300 px-4 py-2">
  <span v-if="item.producedVideo && item.producedVideo.link">
    {{ item.producedVideo.link }}
  </span>
          <span v-else class="text-gray-500">없음</span>
        </td>


        <td class="border border-gray-300 px-4 py-2">{{ item.progress || '진행중' }}</td>

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

  <file-list-modal
      v-if="audioModalVisible"
      :is-visible="audioModalVisible"
      :files="currentAudioFiles"
      title="음원 파일 목록"
      @close="closeAudioModal"
  />

  <file-list-modal
      v-if="imageModalVisible"
      :is-visible="imageModalVisible"
      :files="currentImageFiles"
      title="이미지 파일 목록"
      @close="closeImageModal"
  />
</template>


<script>
import {ref, computed, onMounted} from "vue";
import UploadModal from "./UploadModal.vue";
import DescriptionModal from "./DescriptionModal.vue";
import {getFlyerData} from "../../apis/FlyerAPI.js";
import FileListModal from "./FileListModal.vue";
import axios from "axios";

export default {
  components: {
    UploadModal,
    DescriptionModal,
    FileListModal,
  },
  setup() {
    const data = ref([]);
    const filter = ref("all");
    const searchQuery = ref("");
    const selectedItem = ref(null);
    const selectedDescription = ref(null);

    const audioModalVisible = ref(false);
    const imageModalVisible = ref(false);
    const currentAudioFiles = ref([]);
    const currentImageFiles = ref([]);

    const martId = ref(1);

    // API 호출 후 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const response = await getFlyerData();

        if (response && response.data && response.data.dtoList) {
          data.value = response.data.dtoList; // dtoList를 data에 설정
          console.log("Fetched data:", data.value);
        } else {
          console.warn("No data fetched or invalid response format:", response);
          data.value = []; // 기본 빈 배열로 초기화
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        data.value = []; // 오류 시 빈 배열로 초기화
      }
    };


    onMounted(async () => {
      await fetchData(); // 데이터 가져오기
      filter.value = "all"; // 데이터를 가져온 후 기본값 설정
    });


    const filteredData = computed(() => {
      if (!Array.isArray(data.value)) {
        console.warn("data.value is not an array:", data.value);
        return [];
      }

      return data.value.filter((item) => {
        const matchesFilter =
            filter.value === "all" || (item.martName && item.martName.includes(filter.value));
        const matchesSearch =
            !searchQuery.value ||
            (item.title && item.title.includes(searchQuery.value)) ||
            (item.description && item.description.includes(searchQuery.value));
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


    const updateFileName = (itemId, fileName) => {
      const target = data.value.find((item) => item.id === itemId);
      if (target) {
        target.uploadedFileName = fileName;
      }
    };

    const truncatedDescription = (description) => {
      if (!description) {
        // description이 undefined, null, 또는 빈 문자열일 경우
        return "내용 없음";
      }
      return description.length > 30
          ? description.substring(0, 30) + "..."
          : description;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "날짜 없음";
      const date = new Date(dateString);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    const openAudioModal = (audioFiles) => {
      currentAudioFiles.value = audioFiles.map((url, index) => ({
        name: `음원 파일 ${index + 1}`,
        url,
      }));
      audioModalVisible.value = true;
    };

    const closeAudioModal = () => {
      audioModalVisible.value = false;
      currentAudioFiles.value = [];
    };

    const openImageModal = (imageFiles) => {
      currentImageFiles.value = imageFiles.map((file) => ({
        name: file.imageURL.split("/").pop(),
        url: file.imageURL,
      }));
      imageModalVisible.value = true;
    };

    const closeImageModal = () => {
      imageModalVisible.value = false;
      currentImageFiles.value = [];
    };

    const sendData = async (item) => {
      try {
        const payload = {
          flyerId: item.flyerID, // 해당 Flyer ID
          fileName: item.uploadedFileName, // 업로드된 파일명
        };
        console.log("Sending data:", payload);

        const response = await axios.post("http://localhost:8080/api/v1/flyer/send", payload);

        if (response.status === 200) {
          alert("전송 성공!");
        } else {
          alert("전송 실패");
        }
      } catch (error) {
        console.error("Error sending data:", error);
        alert("전송 중 오류 발생");
      }
    };

    const downloadFile = (originalFile) => {
      const encodedFileName = encodeURIComponent(originalFile); // URL 인코딩
      const fileUrl = `http://localhost:8080/files/${encodedFileName}`;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = originalFile; // 파일 이름 그대로 설정
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      formatDate,
      audioModalVisible,
      imageModalVisible,
      currentAudioFiles,
      currentImageFiles,
      openAudioModal,
      closeAudioModal,
      openImageModal,
      closeImageModal,
      sendData
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
