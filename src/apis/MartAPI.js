// import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

import axios from 'axios';

const host = 'https://allmartsystem.shop/api/v1/mart';

// 리스트
export const getListMart = async (page, searchParams = {}) => {

    const { keyword, type } = searchParams;

    try {
        const res = await axios.get(`${host}/list`, {
            params: {
                page: page,
                size: 10,
                keyword: keyword || null,
                type: type || null,
            },
            withCredentials: true,
        });

        console.log(res.data);

        return res.data;

    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error;
    }
};

// 조회
export const getReadMart = async (martID) => {

    const res = await axios.get(`${host}/${martID}`, { withCredentials: true });

    return res.data
}

// 등록
export const postAddMart = async (formData) => {

    try {
        const res = await axios.post(`${host}/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            , withCredentials: true
        });

        return res.data;
    } catch (error) {
        console.error('Error posting question:', error);
        throw error;
    }
};

// 삭제
export const deleteMart = async (martID) => {

    const res = await axios.delete(`${host}/${martID}`, { withCredentials: true });

    return res.data
}

// 수정
export const putEditMart = async (martID, formData) => {

    try {
        console.log("==============================test");

        const res = await axios.put(`${host}/${martID}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        console.log(res.data);

        return res.data;
    } catch (error) {
        console.error('Error during mart update API call:', error);
        throw error;
    }
};