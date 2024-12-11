import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Cookies from "js-cookie";

export const useMember = defineStore("member", () => {
    // 상태 초기화
    const accessToken = ref(Cookies.get("accessToken") || null);
    const refreshToken = ref(Cookies.get("refreshToken") || null);
    const email = ref(Cookies.get("email") || ""); // 이메일 상태 추가
    const role = ref(Cookies.get("role") || ""); // 사용자 역할 (role)

    // 로그인 상태 확인
    const isSignedIn = computed(() => !!accessToken.value); // 로그인 여부
    const isSystemAdmin = computed(() => role.value === "SYSTEMADMIN"); // 시스템 관리자 여부
    const isMartAdmin = computed(() => role.value === "MARTADMIN"); // 마트 관리자 여부

    // 로그인 상태 설정
    const setTokens = (access, refresh) => {
        accessToken.value = access;
        refreshToken.value = refresh;

        // 쿠키에 저장 (1일, 7일 유지)
        Cookies.set("accessToken", access, { expires: 1 });
        Cookies.set("refreshToken", refresh, { expires: 7 });
    };

    // 이메일 설정
    const setEmail = (userEmail) => {
        email.value = userEmail;
        Cookies.set("email", userEmail, { expires: 7 });
    };

    // 역할(role) 설정
    const setRole = (userRole) => {
        role.value = userRole;
        Cookies.set("role", userRole, { expires: 7 });
    };

    // 로그아웃 처리
    const logout = () => {
        accessToken.value = null;
        refreshToken.value = null;
        email.value = "";
        role.value = "";

        // 쿠키 삭제
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("email");
        Cookies.remove("role");
    };

    return {
        accessToken,
        refreshToken,
        email,
        role,
        isSignedIn,
        isSystemAdmin,
        isMartAdmin,
        setTokens,
        setEmail,
        setRole,
        logout,
    };
});