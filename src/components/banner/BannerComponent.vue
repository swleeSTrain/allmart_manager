<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">배너 관리</h1>

    <!-- 배너 등록 폼 -->
    <div class="bg-gray-100 p-8 rounded-lg shadow-lg mb-8">
      <h2 class="text-xl font-semibold mb-6 text-blue-700">배너 등록</h2>
      <form @submit.prevent="createBanner">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-lg font-medium text-gray-700">제목</label>
            <input
                v-model="form.title"
                type="text"
                class="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 text-lg p-3"
                placeholder="배너 제목 입력"
                required
            />
          </div>
          <div>
            <label class="block text-lg font-medium text-gray-700">링크</label>
            <input
                v-model="form.link"
                type="url"
                class="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 text-lg p-3"
                placeholder="배너 링크 입력"
                required
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-lg font-medium text-gray-700">내용</label>
            <textarea
                v-model="form.content"
                class="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 text-lg p-3"
                placeholder="배너 내용 입력"
                rows="3"
                required
            ></textarea>
          </div>
          <div>
            <label class="block text-lg font-medium text-gray-700">이미지</label>
            <input
                type="file"
                @change="handleFileChange"
                class="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 text-lg p-3"
                accept="image/*"
                required
            />
          </div>
        </div>
        <div class="mt-6 flex space-x-4">
          <button
              type="submit"
              class="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 text-lg"
          >
            등록
          </button>
          <button
              type="button"
              class="bg-gray-500 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-600 text-lg"
              @click="resetForm"
          >
            초기화
          </button>
        </div>
      </form>
    </div>

    <!-- 배너 목록 -->
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-6 text-blue-700">배너 목록</h2>
      <table class="table-auto w-full border-collapse border border-gray-200">
        <thead>
        <tr class="bg-gray-100 text-lg">
          <th class="border px-4 py-3 text-left">번호</th>
          <th class="border px-4 py-3 text-left">제목</th>
          <th class="border px-4 py-3 text-left">링크</th>
          <th class="border px-4 py-3 text-left">내용</th>
          <th class="border px-4 py-3 text-left">이미지</th>
          <th class="border px-4 py-3 text-left">관리</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(banner, index) in banners"
            :key="banner.id"
            class="hover:bg-gray-50 text-lg"
        >
          <td class="border px-4 py-3">{{ index + 1 }}</td>
          <td class="border px-4 py-3">{{ banner.title }}</td>
          <td class="border px-4 py-3">
            <a
                :href="banner.link"
                target="_blank"
                class="text-blue-500 hover:underline"
            >
              보기
            </a>
          </td>
          <td class="border px-4 py-3">{{ banner.content }}</td>
          <td class="border px-4 py-3">
            <img
                :src="banner.image"
                alt="배너 이미지"
                class="w-20 h-20 object-cover rounded"
            />
          </td>
          <td class="border px-4 py-3">
            <button
                class="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 mr-3"
                @click="editBanner(banner)"
            >
              수정
            </button>
            <button
                class="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                @click="deleteBanner(banner.id)"
            >
              삭제
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {useMart} from "../../store/useMart.js";

export default {
  data() {
    return {
      banners: [],
      form: {
        id: null,
        title: "",
        link: "",
        content: "",
        image: "",
        martId: null, // MartId 추가
      },
      selectedFile: null, // 선택된 파일을 저장
    };
  },
  methods: {
    async fetchBanners() {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/banners/getAll");
        this.banners = response.data;
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async createBanner() {
      const userMart = useMart(); // useMember 가져오기
      // this.form.martId = userMart.martID; // MartId에 id할당
      this.form.martId = userMart.martId || 1; // martId가 없으면 기본값 1 설정
      console.log("martId : ", this.form.martId );
      try {
        const formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("link", this.form.link);
        formData.append("content", this.form.content);
        formData.append("martId", this.form.martId);
        if (this.selectedFile) {
          formData.append("image", this.selectedFile);
        }

        if (this.form.id) {
          // Update banner
          await axios.put(
              `http://localhost:8080/api/v1/banners/update/${this.form.id}`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          // Create new banner
          await axios.post("http://localhost:8080/api/v1/banners/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        this.fetchBanners();
        this.resetForm();
        alert("배너가 성공적으로 저장되었습니다.");
      } catch (error) {
        console.error("Error creating/updating banner:", error);
        alert("배너 저장에 실패했습니다.");
      }
    },
    async deleteBanner(id) {
      if (!confirm("이 배너를 삭제하시겠습니까?")) return;
      try {
        await axios.delete(`http://localhost:8080/api/v1/banners/delete/${id}`);
        this.fetchBanners();
        alert("배너가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting banner:", error);
        alert("배너 삭제에 실패했습니다.");
      }
    },
    editBanner(banner) {
      this.form = { ...banner };
      this.selectedFile = null;
    },
    resetForm() {
      this.form = {
        id: null,
        title: "",
        link: "",
        content: "",
        image: "",
        martId: null,
      };
      this.selectedFile = null;
    },
  },
  mounted() {
    this.fetchBanners();
  },
};
</script>

<style>
/* TailwindCSS를 사용하기 때문에 별도의 추가 스타일 없음 */
</style>
