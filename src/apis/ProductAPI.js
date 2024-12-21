import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기
import { useMart } from '../store/useMart.js';

const martStore = useMart();
const martID = martStore.martID;

const host = `https://allmartsystem.shop/api/v1/product/${martID}`;

// 리스트
export const getListProduct = async (page, searchParams = {}) => {

    const { keyword, type, categoryID } = searchParams;

    const res = await tokenAPI.get(`${host}/list`, {
        params: {
            page: page,
            size: 10,
            keyword: keyword || null,
            type: type || null,
            categoryID: categoryID || null,
        },
    });

    return res.data;
};

// 조회
export const getReadProduct = async (productID) => {

    const res = await tokenAPI.get(`${host}/${productID}`)

    return res.data
}

// 등록
export const postAddProduct = async (formData) => {

    try {
        const res = await tokenAPI.post(`${host}/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (error) {
        console.error('Error posting question:', error);
        throw error;
    }
};

// 삭제
export const deleteProduct = async (productID) => {

    const res = await tokenAPI.delete(`${host}/${productID}`)

    return res.data
}

// 수정
export const putEditProduct = async (productID, formData) => {

    try {

        const res = await tokenAPI.put(`${host}/${productID}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    } catch (error) {
        console.error('Error during product update API call:', error);
        throw error;
    }
};