import { defineStore } from 'pinia';
import { ref } from 'vue';
import Cookies from 'js-cookie'; // 쿠키 라이브러리
import { getMartInfo } from "../apis/MemberAPI.js"; // API 함수

export const useMart = defineStore('mart', () => {
    const martID = ref(Cookies.get('martID') || null); // 쿠키에서 martID 값 읽기
    const martName = ref(Cookies.get('martName') || null); // 쿠키에서 martName 값 읽기
    const logoURL = ref(Cookies.get('logoURL') || null);   // 쿠키에서 logoURL 값 읽기
    const isLoaded = ref(!!Cookies.get('martID') && !!Cookies.get('martName') && !!Cookies.get('logoURL')); // 로드 상태 초기화

    // 마트 정보 로드 함수
    const loadMartInfo = async (email) => {
        if (isLoaded.value) return; // 이미 로드된 상태라면 다시 호출하지 않음
        try {
            const data = await getMartInfo(email); // API 호출
            martID.value = data.martID;
            martName.value = data.martName;
            logoURL.value = data.logoURL;
            isLoaded.value = true;

            // 쿠키에 저장 (7일 유지)
            Cookies.set('martID', data.martID, { expires: 7 });
            Cookies.set('martName', data.martName, { expires: 7 });
            Cookies.set('logoURL', data.logoURL, { expires: 7 });
        } catch (error) {
            console.error("마트 정보를 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    // 쿠키 및 상태 초기화 함수
    const clearMartInfo = () => {
        martID.value = null;
        martName.value = null;
        logoURL.value = null;
        isLoaded.value = false;

        // 쿠키 삭제
        Cookies.remove('martID');
        Cookies.remove('martName');
        Cookies.remove('logoURL');
    };

    return { martID, martName, logoURL, isLoaded,
        loadMartInfo, clearMartInfo };
});
