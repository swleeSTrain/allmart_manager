<template>
  <div v-if="mart" class="container max-w-xl mx-auto p-8 bg-gray-50 shadow-lg rounded-md">
    <h1 class="text-3xl font-bold mb-6 text-center">Mart Edit Component</h1>

    <form @submit.prevent="handleEdit" enctype="multipart/form-data">
      <!-- 이름 입력 -->
      <div class="mb-5">
        <label for="martName" class="block text-lg font-bold text-gray-700 mb-2">마트 이름</label>
        <input
            v-model="form.martName"
            type="text"
            id="martName"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <!-- 전화번호 입력 -->
      <div class="mb-5">
        <label for="phoneNumber" class="block text-lg font-bold text-gray-700 mb-2">전화번호</label>
        <input
            v-model="form.phoneNumber"
            type="text"
            id="phoneNumber"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <!-- 템플릿 입력 -->
      <div class="mb-5">
        <label for="template" class="block text-lg font-bold text-gray-700 mb-2">템플릿</label>
        <input
            v-model="form.template"
            type="text"
            id="template"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <!-- 주소 입력 -->
      <div class="mb-5">
        <label for="address" class="block text-lg font-bold text-gray-700 mb-2">주소</label>
        <input
            v-model="form.address"
            type="text"
            id="address"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            required
        />
      </div>

      <!-- 인증서 입력 -->
      <div class="mb-5">
        <label for="certificate" class="block text-lg font-bold text-gray-700 mb-2">인증서</label>
        <input
            v-model="form.certificate"
            type="text"
            id="certificate"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <!-- 파일 입력 -->
      <div class="mb-5">
        <label for="files" class="block text-lg font-bold text-gray-700 mb-2">Files</label>
        <input
            ref="fileInput"
            type="file"
            id="files"
            class="hidden"
            multiple
            @change="handleFileChange"
        />
        <button
            type="button"
            @click="triggerFileInput"
            class="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 text-left px-4"
        >
          이미지 첨부
        </button>

        <div v-if="selectedFiles.length" class="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="relative group"
          >
            <img
                :src="file.url ? file.url : `http://localhost:8080/uploads/${file.name}`"
                alt="첨부 이미지"
                class="w-full h-40 object-cover rounded-lg shadow-md border border-gray-200"
            />
            <button
                type="button"
                @click="removeFile(index)"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-center space-x-4 mt-6">
        <button
            type="button"
            @click="moveToRead(mart.martID)"
            class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-bold"
        >
          조회
        </button>

        <button
            type="button"
            @click="handleEdit"
            class="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 text-lg font-bold"
        >
          수정
        </button>

        <button
            type="button"
            @click="handleDelete"
            class="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 text-lg font-bold"
        >
          삭제
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { putEditMart, deleteMart, getReadMart } from '../../apis/MartAPI.js';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const mart = ref(null);

const form = ref({
  martName: '',
  phoneNumber: '',
  template: '',
  address: '',
  certificate: '',
  existingFileNames: [],
  files: [],
});

const selectedFiles = ref([]);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    for (const file of files) {
      const isDuplicate = selectedFiles.value.some(selectedFile => selectedFile.name === file.name);
      if (!isDuplicate) {
        selectedFiles.value.push({
          name: file.name,
          url: URL.createObjectURL(file),
          raw: file,
        });
      }
    }
  }
  event.target.value = '';
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const handleEdit = async () => {

  if (selectedFiles.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: '이미지 첨부 필요',
      text: '상품 이미지를 하나 이상 첨부해야 합니다.',
    });
    return;
  }

  const formData = new FormData();
  formData.append('martName', form.value.martName);
  formData.append('phoneNumber', form.value.phoneNumber);
  formData.append('template', form.value.template);
  formData.append('address', form.value.address);
  formData.append('certificate', form.value.certificate);

  for (const file of selectedFiles.value) {
    if (file.raw) {
      // 새로 추가된 파일
      formData.append('files', file.raw);
    } else {
      // 기존 파일의 이름만 전송
      formData.append('existingFileNames', file.name);
    }
  }

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {

    const martID = route.params.martID
    await putEditMart(martID, formData);
    Swal.fire('성공', '마트 정보가 성공적으로 수정되었습니다.', 'success');
    moveToRead(martID);
  } catch (error) {
    Swal.fire('오류', '마트 정보를 수정하는 데 실패했습니다.', 'error');
  }
};

const handleDelete = async () => {
  Swal.fire({
    title: '정말 삭제하시겠습니까?',
    text: '삭제하면 복구할 수 없습니다!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteMart(route.params.martID);
        Swal.fire('삭제 완료', '마트가 성공적으로 삭제되었습니다.', 'success');
        moveToList();
      } catch (error) {
        Swal.fire('오류', '마트를 삭제하는 데 실패했습니다.', 'error');
      }
    }
  });
};

const moveToRead = (martID) => {
  const query = {
    page: route.query.page || 1,
    ...(route.query.keyword && { keyword: route.query.keyword }),
    ...(route.query.type && { type: route.query.type }),
  };

  router.push({
    path: `/mart/read/${martID}`,
    query,
  });
};

const moveToList = () => {
  const query = {
    page: route.query.page || 1,
    ...(route.query.keyword && { keyword: route.query.keyword }),
    ...(route.query.type && { type: route.query.type }),
  };

  router.push({
    path: '/mart/list',
    query,
  });
};

onMounted(async () => {
  try {
    const martID = route.params.martID;
    const data = await getReadMart(martID);
    mart.value = data;

    form.value.martName = mart.value.martName || '';
    form.value.phoneNumber = mart.value.phoneNumber || '';
    form.value.template = mart.value.template || '';
    form.value.address = mart.value.address || '';
    form.value.certificate = mart.value.certificate || '';

    selectedFiles.value = mart.value.attachLogo.map((file) => {
      const fileName = file.split('/').pop();
      return { name: fileName, raw: null };
    });
  } catch (error) {
    console.error('마트 데이터를 불러오는 데 실패했습니다:', error);
  }
});
</script>