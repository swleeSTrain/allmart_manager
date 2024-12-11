<script setup>

import { RouterLink } from 'vue-router'
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useMember } from "./store/useMember.js";
import {computed} from "vue";
import { useMart } from "./store/useMart.js";

const router = useRouter();
const route = useRoute(); // 현재 경로 가져오기
const isLoginPage = computed(() => route.path === "/member/signIn");

// 구조 분해 하면 반응성 유지 안됨, 구조 분해 안써야 됨
const memberStore = useMember();
const martStore = useMart();

const isSignIn = computed(() => !!memberStore.accessToken); // 반응성 유지

const isMartStore = computed(() => !!martStore.martName);

// 현재 사용자의 역할 확인
const userRole = computed(() => {
  if (!memberStore.accessToken) return null;
  const payload = JSON.parse(atob(memberStore.accessToken.split(".")[1])); // JWT 디코딩
  return payload.role; // "SYSTEMADMIN" 또는 "MARTADMIN"
});

// 역할 확인
const isSystemAdmin = computed(() => userRole.value === "SYSTEMADMIN");
const isMartAdmin = computed(() => userRole.value === "MARTADMIN");

// 로그아웃 처리 함수
const handleLogout = () => {
  memberStore.logout();
  martStore.clearMartInfo();
  router.push("/member/signIn");
};

const handleLogin = () => {
  router.push("/member/signIn")
}

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

      <div v-if="isMartStore && !isSystemAdmin" class="flex items-center space-x-4">
        <img
            :src="`http://localhost:8080/uploads/s_${martStore.logoURL}`"
            alt="마트 로고"
            class="w-24 h-auto max-w-xs border border-gray-300 rounded-md shadow-sm"
        />
        <div class="text-xl font-semibold">{{ martStore.martName }}</div>
      </div>


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

      <div v-if="isSignIn" class="flex items-center space-x-4">
        <!-- 사용자 아이콘과 이름 -->
        <a href="#" class="flex items-center space-x-2">
          <svg class="w-10 h-10 transform transition-transform duration-300 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
          </svg>
          <span>{{ memberStore.email }}님</span>
        </a>

        <button class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100" @click="handleLogout">로그아웃</button>
      </div>


      <div v-else>
        <button class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100" @click="handleLogin">로그인</button>
      </div>

    </div>
  </header>
  <div class="flex">
    <div v-if="!isLoginPage" class=" min-h-screen max-h-fit w-fit bg-blue-200 p-4">
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
        <li v-if="isSystemAdmin">
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>마트관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p><RouterLink to="/mart/list">마트목록</RouterLink></p>
              <p><RouterLink to="/mart/add">마트등록</RouterLink></p>
            </div>
          </details>
        </li>
        <li v-if="isMartAdmin">
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
              <p><RouterLink to="/delivery/dashboard">배달관리</RouterLink></p>
            </div>
          </details>
        </li>
        <li v-if="isMartAdmin">
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
        <li v-if="isMartAdmin">
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>회원관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p><RouterLink to ="/customer">회원 목록 </RouterLink></p>
              <p><RouterLink to="/customer/register">회원 등록</RouterLink></p>
            </div>
          </details>
        </li>
        <li v-if="isMartAdmin">
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
        <li v-if="isSystemAdmin">
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>전단지관리</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p><RouterLink to="/flyer/upload">전단지 업로드</RouterLink></p>
              <p><RouterLink to="/flyer/list">전단지 파일목록</RouterLink></p>
              <p><RouterLink to="/flyer/request">전단지 요청목록</RouterLink></p>
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
        <li v-if="isMartAdmin">
          <details class="w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <summary class="cursor-pointer bg-blue-400 text-white p-4 flex justify-between items-center">
              <span>문의사항</span>
              <!-- Arrow icon -->
              <svg class="w-4 h-4 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="p-4 space-y-2 text-gray-700">
              <p><RouterLink to="/qna/list">QnA</RouterLink></p>
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