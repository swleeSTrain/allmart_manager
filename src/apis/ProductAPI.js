import axios from "axios";

const host = 'http://localhost:8080/api/v1/product';

// 리스트
export const getListProduct = async (page, searchParams = {}) => {
    const { keyword, type, categoryID } = searchParams;

    const res = await axios.get(`${host}/list`, {
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

    const res = await axios.get(`${host}/${productID}`)

    return res.data
}

// 등록
export const postAddProduct = async (formData) => {

    try {
        const res = await axios.post(`${host}/add`, formData, {
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

    const res = await axios.delete(`${host}/${productID}`)

    return res.data
}