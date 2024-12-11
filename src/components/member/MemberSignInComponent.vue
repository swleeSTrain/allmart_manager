<template>
  <div class="flex items-center justify-center h-screen mt-[-120px]">

    <div class="bg-white p-12 rounded-lg shadow-lg w-full max-w-md">

      <div class="flex justify-center mb-6">
        <img src="../../assets/logo.png" alt="ALLMart 로고" class="w-80 h-auto" />
      </div>

      <form @submit.prevent="submitSignIn">
        <div class="mb-6">
          <label for="email" class="block text-gray-700 font-bold mb-3">이메일</label>
          <input
              v-model="email"
              type="email"
              id="email"
              placeholder="이메일을 입력해주세요."
              class="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-bold mb-3">비밀번호</label>
          <input
              v-model="password"
              type="password"
              id="password"
              placeholder="비밀번호를 입력해주세요."
              class="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
          />
        </div>

        <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 px-5 rounded-md hover:bg-blue-600 transition duration-200"
        >
          로그인
        </button>
      </form>

      <div class="flex justify-between items-center mt-6 text-base text-blue-500">
        <button class="hover:underline">이메일 찾기</button>
        <button class="hover:underline">비밀번호 찾기</button>
        <button @click="moveToSignUp" class="hover:underline">회원가입</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { postSignIn } from "../../apis/MemberAPI.js";
import { useMember } from "../../store/useMember.js";
import { useMart } from "../../store/useMart.js";

const email = ref("");
const password = ref("");
const router = useRouter();

const moveToSignUp = () => {
  router.push("/member/signUp");
};

// 로그인 처리 함수
const submitSignIn = async () => {
  try {
    const signInData = {
      email: email.value,
      pw: password.value,
    };

    const response = await postSignIn(signInData);

    if (!response || !response.accessToken || !response.role) {
      throw new Error("로그인 응답이 올바르지 않습니다.");
    }

    // Pinia 스토어 가져오기
    const memberStore = useMember();
    const martStore = useMart();

    // 토큰과 이메일 저장
    memberStore.setTokens(response.accessToken, response.refreshToken);
    memberStore.setEmail(response.email); // 이메일 저장
    memberStore.setRole(response.role); // 사용자 유형 저장

    // 마트 관리자일 경우에만 마트 정보 로드
    if (response.role === "MARTADMIN") {
      await martStore.loadMartInfo(email.value);
    }
    if (response.role === "SYSTEMADMIN") {
      await martStore.loadMartInfo(email.value);
    }


    // 메인 페이지로 이동
    router.push("/"); // MainPage로 이동
  } catch (error) {
    console.error("로그인 실패:", error.response?.data || error.message);

    await Swal.fire({
      icon: "error",
      title: "로그인 실패",
      text: "이메일 또는 비밀번호를 확인해주세요.",
      confirmButtonText: "확인",
    });
  }
};


</script>
