<template>
  <div>
    <h1>로그인</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="이메일" required>
      <input v-model="password" type="password" placeholder="비밀번호" required>
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../store/useAuth.js'
import axios from 'axios'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/v1/member/makeToken', {
      email: email.value,
      pw: password.value
    })

    const { accessToken, refreshToken } = response.data
    authStore.setTokens(accessToken, refreshToken)
    // 필요한 경우 사용자 정보도 저장
    // authStore.setUser(response.data.user)
  } catch (error) {
    console.error('로그인 실패:', error)
  }
}
</script>

