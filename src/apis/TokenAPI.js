
import axios from 'axios';
import { useMember } from '../store/useMember';

const tokenAPI = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000, // 요청 타임아웃 설정 (10초)
});

// 요청 인터셉터 추가: 모든 요청에 Authorization 헤더 추가
tokenAPI.interceptors.request.use(
    (config) => {

        const memberStore = useMember();

        // Pinia 우선, 없으면 쿠키에서 가져오기
        const token = memberStore.accessToken || Cookies.get("accessToken");

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default tokenAPI;
