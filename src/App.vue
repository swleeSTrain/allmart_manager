<script setup>

import { RouterLink } from 'vue-router'

</script>

<template>
  <!-- 헤더 시작 -->

  <header class="sticky top-0 z-50 bg-white flex justify-between items-center p-4 border-b border-gray-300 ">
    <!-- 왼쪽 로고 및 상호명 -->
    <div class="flex items-center space-x-4">

      <!-- 로고 이미지 -->
      <img src="./assets/logo.png" alt="ALLMart 로고" class="w-[240px] h-auto">
      <!-- 세로 구분선 -->
      <div class="border-l border-gray-400 h-12"></div>

      <!-- 마트 이름 -->
      <div class="text-xl font-semibold">마트 이름</div>
    </div>

    <!-- 오른쪽 메뉴 버튼들 -->
    <div class="flex items-center space-x-4">
      <!-- 도움말 버튼 -->
      <button class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">도움말</button>

      <!-- 고객센터 버튼 -->
      <button class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">고객센터</button>

      <!-- 홈 아이콘과 링크 -->
      <a href="#" class="flex items-center space-x-1">
        <svg class="w-10 h-10 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="{1.5}" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span>홈</span>
      </a>

      <!-- 사용자 아이콘과 이름 -->
      <a href="#" class="flex items-center space-x-1">
        <svg class="w-10 h-10 transform transition-transform duration-300 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="{1.5}" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
        </svg>

        <span>아이디 님</span>
      </a>

      <!-- 로그아웃 버튼 -->
      <button class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">로그아웃</button>
    </div>
  </header>
  <div class="flex">
    <div class=" min-h-screen max-h-fit w-fit bg-blue-200 p-4">
      <ul class="space-y-2">
        <li>
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>공지사항</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p>공지사항</p>
              <p>공지등록</p>
              <p>시스템 공지사항</p>
            </div>
          </details>
        </li>
        <li>
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>주문관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p><RouterLink to="/order/list">주문관리</RouterLink></p>
            </div>
          </details>
        </li>
        <li>
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>상품관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p><RouterLink to="/product/list">상품목록</RouterLink></p>
              <p><RouterLink to="/product/add">상품등록</RouterLink></p>
            </div>
          </details>
        </li>
        <li>
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>회원관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p>회원 목록</p>
            </div>
          </details>
        </li>
        <li>
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>재고관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p><RouterLink to="/inventories/list">재고 목록</RouterLink></p>
              <p>재고 등록</p>
            </div>
          </details>
        </li>
        <li>
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>기능관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p>매출 관리</p>
              <p>결제 관리</p>
              <p><RouterLink to="/category/list">카테고리</RouterLink></p>
            </div>
          </details>
        </li>
        <li>
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>문의사항</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p>QnA</p>
              <p>FAQ</p>
              <p>환불</p>
            </div>
          </details>
        </li>
      </ul>
    </div>

    <!-- Main content area -->
    <div class="p-4 relative h-full w-full overflow-y-auto">
      <!-- Your main content goes here -->
      <RouterView />
    </div>
  </div>
</template>


