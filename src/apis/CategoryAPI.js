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

// 삭제
export const deleteCategory = async (categoryID) => {

    const res = await axios.delete(`${host}/${categoryID}`)

    return res.data
}

// 수정
export const putEditCategory = async (obj) => {

    const res = await axios.put(`${host}/${obj.categoryID}`, obj, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res.data;
};

// 조회
export const getCategory = async (categoryID) => {

    const res = await axios.get(`${host}/${categoryID}`);

    return res.data;
};
