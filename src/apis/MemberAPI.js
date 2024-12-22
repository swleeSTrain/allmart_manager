import axios from "axios";
import tokenAPI from './TokenAPI.js';

// const host = 'https://allmartsystem.shop/api/v1/member';
const host = 'http://localhost:8080/api/v1/member';

export const getMartInfo = async (email) => {

    const res = await tokenAPI.get(`${host}/mart/${email}`);

    return res.data;
}

// 회원가입
export const postSignUp = async (obj) => {

    const res = await axios.post(`${host}/signUp`, obj, {
        headers: {
            'Content-Type': 'application/json'
        }
        , withCredentials: true
    });

    return res.data;
};

// 로그인
export const postSignIn = async (obj) => {

    const res = await axios.post(`${host}/makeToken`, obj, {
        headers: {
            'Content-Type': 'application/json'
        }
        , withCredentials: true
    });

    return res.data;
};
//
// // 회원 조회
// export const getCategory = async (categoryID) => {
//
//     const res = await axios.get(`${host}/${categoryID}`);
//
//     return res.data;
// };
//
// // 삭제
// export const deleteCategory = async (categoryID) => {
//
//     const res = await axios.delete(`${host}/${categoryID}`)
//
//     return res.data
// }
//
// // 수정
// export const putEditCategory = async (obj) => {
//
//     const res = await axios.put(`${host}/${obj.categoryID}`, obj, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//
//     return res.data;
// };


