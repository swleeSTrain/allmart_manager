import axios from "axios";

const host = 'http://localhost:8080/api/v1/category';

// 리스트
export const getListCategory = async (page, searchParams = {}) => {
    const { keyword, type } = searchParams;

    const res = await axios.get(`${host}/list`, {
        params: {
            page: page,
            size: 10,
            keyword: keyword || null,
            type: type || null
        },
    });

    return res.data;
};

// 등록
export const postAddCategory = async (obj) => {
    const res = await axios.post(`${host}/add`, obj, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.data;
};