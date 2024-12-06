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
        flyerRouting
    ],
});

// beforeEach 라우터 가드
// routeConfig.beforeEach((to, from, next) => {
//     const memberStore = useMember(); // Pinia 스토어 접근
//
//     // 새로고침 시 Pinia 상태 초기화
//     if (!memberStore.accessToken && Cookies.get("accessToken")) {
//         memberStore.setTokens(Cookies.get("accessToken"), Cookies.get("refreshToken"));
//     }
//
//     const isAuthenticated = !!memberStore.accessToken;
//     const isMartAdmin = () => {
//         if (!memberStore.accessToken) return false;
//         const payload = JSON.parse(atob(memberStore.accessToken.split(".")[1])); // JWT 디코딩
//         return payload.role === "MARTADMIN"; // MARTADMIN 권한 확인
//     };
//
//     // 인증 및 권한 확인
//     if (to.path !== "/member/signIn" && to.path !== "/member/signUp") {
//         if (!isAuthenticated) {
//             return next("/member/signIn"); // 로그인 상태가 아닐 경우
//         }
//         if (!isMartAdmin()) {
//             return next("/member/signIn"); // 권한이 없는 경우
//         }
//     }
//
//     // 인증 및 권한 문제가 없을 경우 이동
//     next();
// });

export default routeConfig;