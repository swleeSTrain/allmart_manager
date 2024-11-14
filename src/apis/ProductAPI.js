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