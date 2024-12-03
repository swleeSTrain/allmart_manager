<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6">마트 등록</h1>
    <form @submit.prevent="registerMart" class="space-y-4">
      <!-- 마트 이름 -->
      <div>
        <label for="martName" class="block font-medium text-gray-700">마트 이름:</label>
        <input
            type="text"
            id="martName"
            v-model="mart.martName"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="마트 이름을 입력하세요"
            required
        />
      </div>

      <!-- 전화번호 -->
      <div>
        <label for="phoneNumber" class="block font-medium text-gray-700">전화번호:</label>
        <input
            type="text"
            id="phoneNumber"
            v-model="mart.phoneNumber"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="01012345678"
            required
        />
      </div>

      <!-- 템플릿 -->
      <div>
        <label for="template" class="block font-medium text-gray-700">템플릿:</label>
        <input
            type="text"
            id="template"
            v-model="mart.template"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="템플릿 이름을 입력하세요"
            required
        />
      </div>

      <!-- 주소 검색 -->
      <div>
        <label class="block font-medium text-gray-700">주소 검색:</label>
        <AddressSearchComponent @address-selected="setAddress" />
      </div>

      <!-- 우편번호 -->
      <div>
        <label for="postcode" class="block font-medium text-gray-700">우편번호:</label>
        <input
            type="text"
            id="postcode"
            v-model="mart.postcode"
            readonly
            class="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      <!-- 도로명 주소 -->
      <div>
        <label for="roadAddress" class="block font-medium text-gray-700">도로명 주소:</label>
        <input
            type="text"
            id="roadAddress"
            v-model="mart.roadAddress"
            readonly
            class="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      <!-- 상세 주소 -->
      <div>
        <label for="detailAddress" class="block font-medium text-gray-700">상세 주소:</label>
        <input
            type="text"
            id="detailAddress"
            v-model="mart.detailAddress"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="상세 주소를 입력하세요"
        />
      </div>

      <!-- 전체 주소 -->
      <div>
        <label for="fullAddress" class="block font-medium text-gray-700">전체 주소:</label>
        <input
            type="text"
            id="fullAddress"
            v-model="mart.fullAddress"
            readonly
            class="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
            placeholder="자동으로 입력됩니다"
        />
      </div>

      <!-- 사업자 등록증 -->
      <div>
        <label for="certificate" class="block font-medium text-gray-700">사업자 등록증:</label>
        <input
            type="text"
            id="certificate"
            v-model="mart.certificate"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="사업자 등록증 번호를 입력하세요"
            required
        />
      </div>

      <FileUploadComponent @updateFiles="updateSelectedFiles" />

      <div class="flex justify-center space-x-4 mt-6">

        <button
            type="button"
            @click="moveToList"
            class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-bold"
        >
          목록
        </button>

        <button
            type="submit"
            class="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 text-lg font-bold"
        >
          등록
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import AddressSearchComponent from '../address/AddressSearchComponent.vue';
import FileUploadComponent from "../common/FileUploadComponent.vue";
import {getGeoLocation} from "../../apis/KakaoMapAPI.js";
import {postAddMart} from "../../apis/MartAPI.js";
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const mart = ref({
  martName: '',
  phoneNumber: '',
  template: '',
  postcode: '',
  roadAddress: '',
  detailAddress: '',
  fullAddress: '',
  certificate: '',
});

const setAddress = (address) => {
  mart.value.postcode = address.zonecode;
  mart.value.roadAddress = address.roadAddress;
  mart.value.fullAddress = `${address.roadAddress} ${mart.value.detailAddress}`;
};

const selectedFiles = ref([]); // 이 파일들을 FileUploadComponent로 전달받음

const updateSelectedFiles = (files) => {
  selectedFiles.value = files;
};

watch(
    () => mart.value.detailAddress,
    (newDetail) => {
      mart.value.fullAddress = `${mart.value.roadAddress} ${newDetail}`;
    }
);

const registerMart = async () => {
  try {
    // 주소로 위도와 경도 가져오기
    const geoData = await getGeoLocation(mart.value.roadAddress);

    // FormData 생성
    const formData = new FormData();
    formData.append('martName', mart.value.martName);
    formData.append('phoneNumber', mart.value.phoneNumber);
    formData.append('template', mart.value.template);
    formData.append('address', mart.value.fullAddress);
    formData.append('certificate', mart.value.certificate);
    formData.append('lat', geoData.y); // 위도
    formData.append('lng', geoData.x); // 경도

    // 파일 추가
    selectedFiles.value.forEach((file) => {
      formData.append('files', file);
    });

    // API 호출
    const response = await postAddMart(formData);

    // 성공 메시지 표시
    Swal.fire({
      icon: 'success',
      title: '등록 성공',
      text: '마트가 성공적으로 등록되었습니다.',
    }).then(() => {
      router.push({ path: '/mart/list', query: { page: 1 } });
    })
    ;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '등록 실패',
      text: '마트 등록 중 오류가 발생했습니다.',
    });
    console.error('Error registering mart:', error);
  }
};

const moveToList = () => {
  const query = {
    page: route.query.page || 1,
    ...(route.query.keyword && { keyword: route.query.keyword }),
    ...(route.query.type && { type: route.query.type }),
  };

  router.push({ path: '/mart/list', query });
};

</script>
