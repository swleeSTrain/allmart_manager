import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

const host = 'http://localhost:8080/api/v1/category';

// 리스트
export const getListCategory = async (page, searchParams = {}) => {
    const { keyword, type } = searchParams;

    const res = await tokenAPI.get(`${host}/list`, {
        params: {
            page: page,
            size: 10,
            keyword: keyword || null,
            type: type || null,
        },
    });

    return res.data;
};

// 등록
export const postAddCategory = async (obj) => {
    const res = await tokenAPI.post(`${host}/add`, obj);
    return res.data;
};

// 삭제
export const deleteCategory = async (categoryID) => {
    const res = await tokenAPI.delete(`${host}/${categoryID}`);
    return res.data;
};

// 수정
export const putEditCategory = async (obj) => {
    const res = await tokenAPI.put(`${host}/${obj.categoryID}`, obj);
    return res.data;
};

// 조회
export const getCategory = async (categoryID) => {
    const res = await tokenAPI.get(`${host}/${categoryID}`);
    return res.data;
};
