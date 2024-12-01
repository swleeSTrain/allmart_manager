<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Mart List Component</h1>

    <!-- 검색 필드 -->
    <div class="flex flex-wrap justify-end items-center gap-2 mb-4">
      <select
          v-model="searchParams.type"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">전체</option>
        <option value="martName">이름</option>
        <option value="phoneNumber">전화번호</option>
      </select>
      <input
          v-model="searchParams.keyword"
          type="text"
          placeholder="검색어를 입력하세요"
          @keydown="onEnterKey"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
          @click="search"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
      >
        Search
      </button>
      <button
          @click="cleanAndLoad"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
      >
        Clean
      </button>
      <button
          @click="moveToAdd"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        등록
      </button>
    </div>

    <!-- 마트 리스트 -->
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead class="bg-gray-200 text-lg">
      <tr>
        <th class="border border-gray-300 px-4 py-4 text-left">마트 ID</th>
        <th class="border border-gray-300 px-4 py-4 text-left">이미지</th>
        <th class="border border-gray-300 px-4 py-4 text-left">마트명</th>
        <th class="border border-gray-300 px-4 py-4 text-left">전화번호</th>
        <th class="border border-gray-300 px-4 py-4 text-left">주소</th>
      </tr>
      </thead>
      <tbody class="text-base">
      <tr
          v-for="mart in result.dtoList"
          :key="mart.martID"
          class="hover:bg-gray-100 cursor-pointer"
          @click="moveToRead(mart.martID)"
      >
        <td class="border border-gray-300 px-4 py-4">{{ mart.martID }}</td>
        <td class="border border-gray-300 px-4 py-4">
          <img
              v-if="mart.thumbnailImage"
              :src="`http://localhost:8080/uploads/s_${mart.thumbnailImage}`"
              alt="이미지"
              class="w-24 h-auto max-w-xs border border-gray-300 rounded-md shadow-sm"
          />
        </td>
        <td class="border border-gray-300 px-4 py-4">{{ mart.martName }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ mart.phoneNumber }}</td>
        <td class="border border-gray-300 px-4 py-4">{{ mart.address }}</td>
      </tr>
      </tbody>
    </table>

    <div v-if="result.dtoList.length === 0" class="flex items-center h-20 text-2xl text-gray-500 mb-4 ml-1">
      검색 결과가 없습니다.
    </div>

    <nav class="mt-6 flex justify-center flex-wrap gap-2">
      <ul class="flex items-center flex-wrap gap-2">
        <li v-for="page in pageArr" :key="page.page">
          <button
              class="px-5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{
          'bg-blue-500 text-white': page.page === result.pageRequestDTO.page,
          'bg-gray-200 text-gray-700 hover:bg-gray-300': page.page !== result.pageRequestDTO.page
        }"
              @click="loadPageData(page.page)"
          >
            {{ page.label }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import useMartListData from '../../hooks/useMartListData.js';
import { getListMart } from '../../apis/MartAPI.js';

const { result, pageArr, loadPageData, moveToRead,
  searchParams, search, onEnterKey, cleanAndLoad, moveToAdd } = useMartListData(getListMart);
</script>
