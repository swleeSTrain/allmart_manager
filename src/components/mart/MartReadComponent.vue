<template>
  <div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">Mart Read Component</h1>

    <div v-if="mart" class="space-y-4">
      <div class="mt-6">
        <div v-if="mart.attachLogo && mart.attachLogo.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <img
                v-for="(file, index) in mart.attachLogo"
                :key="index"
                :src="`http://localhost:8080/uploads/${file}`"
                alt="마트 로고"
                class="w-full h-40 object-cover rounded-lg shadow-md border border-gray-200"
            />
          </div>
        </div>
      </div>

      <table class="min-w-full table-auto border-separate border-spacing-4">
        <tbody>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">마트 이름</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ mart.martName }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">전화번호</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ mart.phoneNumber }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">주소</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ mart.address }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">사업자 등록증</td>
          <td class="text-xl text-black-600 border-b-2 border-gray-400">{{ mart.certificate }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">등록일</td>
          <td class="text-lg text-black-500 border-b-2 border-gray-400">{{ formatDate(mart.createdDate) }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 border-b-2 border-r-2 border-gray-400">수정일</td>
          <td class="text-lg text-black-500 border-b-2 border-gray-400">{{ formatDate(mart.modifiedDate) }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-8 flex justify-center space-x-4">
      <button
          class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          @click="moveToList"
      >
        목록
      </button>
      <button
          class="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition"
          @click="moveToEdit(mart.martID)"
      >
        수정
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getReadMart } from '../../apis/MartAPI.js';
import useDateFormatter from '../../hooks/useDateFormatter.js';

const route = useRoute();
const router = useRouter();
const mart = ref(null);

const { formatDate } = useDateFormatter();

// LIST 이동
const moveToList = () => {
  router.push({
    path: '/mart/list',
    query: { page: route.query.page, ...route.query },
  });
};

// EDIT 이동
const moveToEdit = (martID) => {
  router.push({
    path: `/mart/edit/${martID}`,
    query: { page: route.query.page, ...route.query },
  });
};

// 컴포넌트 로드 시 API 호출
onMounted(async () => {
  const martID = route.params.martID;

  if (!martID) {
    console.error('Missing martID in URL');
    return;
  }

  try {
    const data = await getReadMart(martID);
    mart.value = data;
  } catch (error) {
    console.error('Failed to fetch mart details:', error);
  }
});
</script>
