<template>
  <div class="flex items-center justify-center h-screen mt-[-120px]">

    <div class="bg-white p-12 rounded-lg shadow-lg w-full max-w-md">

      <div class="flex justify-center mb-6">
        <img src="../../assets/logo.png" alt="ALLMart 로고" class="w-80 h-auto" />
      </div>

      <form @submit.prevent="submitSignUp">
        <div class="mb-6">
          <label for="email" class="block text-gray-700 font-bold mb-3">이메일</label>
          <input
              type="email"
              id="email"
              v-model="email"
              placeholder="이메일을 입력해주세요."
              required
              class="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-bold mb-3">비밀번호</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력해주세요."
              required
              class="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 마트 선택 -->
        <div class="mb-5">
          <label class="block text-lg font-bold text-gray-700 mb-2">마트 선택</label>
          <div
              class="mt-1 flex flex-row space-x-6 overflow-x-auto pb-4"
              ref="scrollContainer"
          >
            <label
                v-for="mart in result.dtoList"
                :key="mart.martID"
                class="flex items-center space-x-4 cursor-pointer"
                @click="handleMartClick(mart.martID)"
            >
              <input
                  type="radio"
                  v-model="selectedMartID"
                  :value="mart.martID"
                  class="form-radio"
              />
              <span class="text-gray-800 text-lg font-bold">{{ mart.martName }}</span>
            </label>
          </div>
          <p v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</p>
        </div>


        <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 px-5 rounded-md hover:bg-blue-600 transition duration-200"
        >
          회원가입
        </button>
      </form>

      <div class="flex justify-center mt-6 text-base text-blue-500">
        <button @click="moveToSignIn" class="hover:underline">로그인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postSignUp } from "../../apis/memberApi";
import { getListMart } from "../../apis/martApi"; // API 호출 추가
import useMemberMart from "../../hooks/useMemberMart";

const router = useRouter();

// 회원가입 데이터 상태
const email = ref("");
const password = ref("");
const selectedMartID = ref(null);
const errorMessage = ref("");

// 마트 리스트 불러오기
const { result, scrollContainer, handleMartClick, loadMartPage } =
    useMemberMart(getListMart);

const submitSignUp = async () => {
  try {
    const signUpData = {
      email: email.value,
      pw: password.value,
      role: "MARTADMIN",
      martID: selectedMartID.value, // 마트 ID 포함
    };

    const response = await postSignUp(signUpData);
    console.log("회원가입 성공:", response);

    await Swal.fire({
      icon: "success",
      title: "회원가입 성공",
      text: "회원가입이 완료되었습니다!",
      confirmButtonText: "확인",
    });

    router.push("/member/signIn");
  } catch (error) {
    console.error("회원가입 실패:", error.response?.data || error.message);
    await Swal.fire({
      icon: "error",
      title: "회원가입 실패",
      text: "회원가입에 실패했습니다. 다시 시도해주세요.",
      confirmButtonText: "확인",
    });
  }
};

// 로그인 페이지 이동
const moveToSignIn = () => {
  router.push("/member/signIn");
};
</script>
