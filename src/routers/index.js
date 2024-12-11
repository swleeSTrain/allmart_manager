import { createRouter, createWebHistory } from "vue-router";
import { useMember } from "../store/useMember"; // Pinia 스토어 import
import Cookies from "js-cookie";
import productRouting from "./product.js";
import categoryRouting from "./category.js";
import inventoryRouting from "./inventory.js";
import orderRouting from "./order.js";
import memberRouting from "./member.js";
import customerRouting from "./customer.js";
import deliveryRouting from "./delivery.js";
import martRouting from "./mart.js";
import bannerRouting from "./banner.js";
import flyerRouting from "./flyer.js";


const MainPage = () => import("../pages/MainPage.vue");
const MemberSignIn = () => import("../pages/member/MemberSignInPage.vue");

// 라우터 설정
const routeConfig = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: MainPage },
        { path: "/member/signIn", component: MemberSignIn },
        productRouting,
        categoryRouting,
        orderRouting,
        inventoryRouting,
        customerRouting,
        deliveryRouting,
        memberRouting,
        customerRouting,
        martRouting,
        flyerRouting,
        bannerRouting
    ],
});


routeConfig.beforeEach((to, from, next) => {
    const memberStore = useMember(); // Pinia 스토어 접근

    // 새로고침 시 Pinia 상태 초기화
    if (!memberStore.accessToken && Cookies.get("accessToken")) {
        memberStore.setTokens(Cookies.get("accessToken"), Cookies.get("refreshToken"));
    }

    const isAuthenticated = !!memberStore.accessToken;

    const getRole = () => {
        if (!memberStore.accessToken) return null;
        const payload = JSON.parse(atob(memberStore.accessToken.split(".")[1])); // JWT 디코딩
        return payload.role;
    };

    const userRole = getRole();

    // 인증 확인
    if (!isAuthenticated && to.path !== "/member/signIn" && to.path !== "/member/signUp") {
        return next("/member/signIn"); // 로그인 상태가 아닐 경우
    }

    // 권한 확인
    if (to.meta.requiresMartAdmin && userRole !== "MARTADMIN") {
        alert("마트 관리자 권한이 필요합니다.");
        return next("/"); // 홈으로 리다이렉트
    }

    if (to.meta.requiresSystemAdmin && userRole !== "SYSTEMADMIN") {
        alert("시스템 관리자 권한이 필요합니다.");
        return next("/"); // 홈으로 리다이렉트
    }

    console.log("현재 사용자 역할:", userRole);
    console.log("현재 경로 meta:", to.meta);

    // 모든 조건 만족 시 이동
    next();
});




export default routeConfig;