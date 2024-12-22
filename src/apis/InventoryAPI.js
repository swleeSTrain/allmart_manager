import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

const host = 'https://allmartsystem.shop/api/v1/inventories';
// const host = 'http://localhost:8080/api/v1/inventories';

export const getInventoryList = async (page, searchParams = {}) => {

    try {
        const res = await tokenAPI.get(`${host}/list`, {
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

// 재고 수정 API
export const updateInventory = async (id, inventoryData) => {
    try {
        const res = await tokenAPI.put(`${host}/${id}`, inventoryData);
        console.log('수정된 데이터:', res.data); // 응답 데이터 확인
        return res.data;
    } catch (error) {
        console.error('수정 API 호출 에러:', error); // 에러 로그 출력
        throw error;
    }
};
