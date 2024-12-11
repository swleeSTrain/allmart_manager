<template>
  <div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8">전단지 영상 생성</h1>
    <form @submit.prevent="handleSubmit">
      <!-- 마트 이름 -->
      <div class="mb-6">
        <label for="martName" class="block text-lg font-medium text-gray-700 mb-2">
          마트 이름
        </label>
        <div class="flex items-center gap-4">
          <input
              type="text"
              id="martName"
              v-model="martName"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
              type="button"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              @click="openFlyerModal"
          >
            찾기
          </button>
        </div>
      </div>

      <!-- 전단지 타이틀 -->
      <div class="mb-6">
        <label for="flyerTitle" class="block text-lg font-medium text-gray-700 mb-2">
          전단지 타이틀
        </label>
        <input
            type="text"
            id="flyerTitle"
            v-model="flyerTitle"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            readonly
        />
      </div>

      <!-- 파일 이름 -->
      <div class="mb-6">
        <label for="fileName" class="block text-lg font-medium text-gray-700 mb-2">
          파일 이름
        </label>
        <input
            type="text"
            id="fileName"
            v-model="fileName"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            readonly
        />
      </div>

      <!-- 링크 -->
      <div class="mb-6">
        <label for="link" class="block text-lg font-medium text-gray-700 mb-2">
          링크
        </label>
        <input
            type="text"
            id="link"
            v-model="link"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <!-- 파일 업로드 -->
      <div class="mb-6">
        <label for="uploadFile" class="block text-lg font-medium text-gray-700 mb-2">
          파일 업로드
        </label>
        <input
            type="file"
            id="uploadFile"
            @change="handleFileUpload"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none"
        />
      </div>

      <!-- 버튼 -->
      <div class="flex justify-between mt-8">
        <button
            type="button"
            class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            @click="resetForm"
        >
          초기화
        </button>
        <button
            type="submit"
            class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          전송
        </button>
      </div>
    </form>

    <!-- 전단지 선택 모달 -->
    <flyer-modal
        v-if="isModalOpen"
        :filter="martName"
        @close="isModalOpen = false"
        @selectFlyer="selectFlyer"
    />
  </div>
</template>

<script>
import FlyerModal from "./FindFlyerModal.vue";
import axios from "axios";

export default {
  components: {
    FlyerModal,
  },
  data() {
    return {
      martName: "",
      flyerTitle: "",
      fileName: "",
      link: "",
      file: null,
      isModalOpen: false,
      flyerId: null
    };
  },
  methods: {
    openFlyerModal() {
      this.isModalOpen = true;
    },
    selectFlyer(selectedFlyer) {
      console.log("선택된 전단지:", selectedFlyer); // 디버깅 로그 추가
      this.martName = selectedFlyer.martName;
      this.flyerTitle = selectedFlyer.title;
      this.flyerId = selectedFlyer.flyerId;
      this.isModalOpen = false;
    },
    handleFileUpload(event) {
      const uploadedFile = event.target.files[0];
      if (uploadedFile) {
        this.fileName = uploadedFile.name;
        this.file = uploadedFile;
      }
    },
    resetForm() {
      this.martName = "";
      this.flyerTitle = "";
      this.fileName = "";
      this.link = "";
      this.file = null;
    },
    async handleSubmit() {
      if (!this.martName || !this.flyerTitle || !this.link || !this.file) {
        alert("모든 필드를 채워주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("martName", this.martName);
      formData.append("flyerTitle", this.flyerTitle);
      formData.append("fileName", this.fileName);
      formData.append("link", this.link);
      formData.append("file", this.file);
      formData.append("flyerId", this.flyerId);

      console.log("폼 데이터 확인:", {
        martName: this.martName,
        flyerTitle: this.flyerTitle,
        fileName: this.fileName,
        link: this.link,
        file: this.file,
        flyerId: this.flyerId,
      });

      try {
        const response = await axios.post(
            "http://localhost:8080/api/v1/videos/save",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
        );
        alert("전송 성공!");
        this.resetForm();
      } catch (error) {
        console.error("전송 실패:", error);
        alert("전송 실패");
      }
    },

  },
};
</script>
