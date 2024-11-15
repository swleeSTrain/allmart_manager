import axios from "axios";

const host = 'http://localhost:8080/api/v1/inventories';

export const getInventoryList = async (page, searchParams = {}) => {
    try {
        const res = await axios.get(host, {
            params: {
                page: page,
                size: 10,
                keyword: searchParams.keyword || null,
                sku: searchParams.sku || null,
            },
        });
        console.log('API 응답 데이터:', res.data); // 응답 데이터 확인
        return res.data;
    } catch (error) {
        console.error('API 호출 에러:', error); // 에러 로그 출력
        throw error;
    }
};
