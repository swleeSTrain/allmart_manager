import { defineStore } from 'pinia';
import { ref } from 'vue';
import Cookies from 'js-cookie';

export const useMember = defineStore('member', () => {
    const accessToken = ref(Cookies.get('accessToken') || null);
    const refreshToken = ref(Cookies.get('refreshToken') || null);
    const email = ref(Cookies.get('email') || ""); // 이메일 상태 추가

    // 로그인 상태 설정
    const setTokens = (access, refresh) => {
        accessToken.value = access;
        refreshToken.value = refresh;

        // 1일, 7일 유지
        Cookies.set('accessToken', access, { expires: 1 });
        Cookies.set('refreshToken', refresh, { expires: 7 });
    };

    // 이메일 설정 메서드
    const setEmail = (userEmail) => {
        email.value = userEmail;
        Cookies.set('email', userEmail, { expires: 7 }); // 쿠키에 이메일 저장
    };

    // 로그아웃 상태 설정
    const logout = () => {
        accessToken.value = null;
        refreshToken.value = null;
        email.value = ""; // 이메일 초기화
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('email');
    };

    return { accessToken, refreshToken, email, setTokens, setEmail, logout };
});
