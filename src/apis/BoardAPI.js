import axios from "axios";
import tokenAPI from "./TokenAPI.js";

// const host = 'https://allmartsystem.shop/api/v1/board';
const host = 'http://localhost:8080/api/v1/board';

// 게시글 리스트를 가져오는 함수 (페이징 처리)
export const getBoardList = async (page, searchParams = {}) => {
    const { type = 'all', keyword = '' } = searchParams; // searchParams에서 type과 keyword 추출
    const response = await tokenAPI.get(`${host}/list`, {
        params: {
            page: page,
            size: 10,
            type: type,
            keyword: keyword,
        },
    });
    return response.data;
}

// 특정 게시글을 읽는 함수
export const getBoardOne = async (bno) => {
    const response = await tokenAPI.get(`${host}/${bno}`);
    return response.data;
}

// 새로운 게시글을 생성하는 함수 (JSON 데이터 + 파일)
export const postBoardOne = async (boardData, files = []) => {
    const formData = new FormData();

    // boardData의 모든 필드를 FormData에 추가
    for (const key in boardData) {
        formData.append(key, boardData[key]);
    }

    // 파일이 있을 경우에만 FormData에 파일 추가
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append('files', file);  // 서버에서 List<MultipartFile>로 처리
        });
    }

    // 요청 보내기
    const response = await tokenAPI.post(`${host}/add`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 게시글을 삭제하는 함수
export const deleteBoardOne = async (bno) => {
    const response = await tokenAPI.delete(`${host}/${bno}`);
    return response.data;
}

// 게시글을 수정하는 함수 (JSON 데이터 + 파일)
export const putBoardOne = async (bno, boardData, files = []) => {
    const formData = new FormData();

    // boardData의 모든 필드를 FormData에 추가
    for (const key in boardData) {
        formData.append(key, boardData[key]);
    }

    // 파일이 있으면 파일 추가 (빈 배열이면 추가하지 않음)

    if (files.length > 0) {
        files.forEach(file => {
            formData.append('files', file);  // 'files' 키로 파일 전송
        });
    }

    try {
        const response = await tokenAPI.put(`${host}/${bno}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 생략해도 무방
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// 게시글 상단 고정/해제 토글 함수
export const togglePinPost = async (bno) => {
    try {
        const response = await tokenAPI.post(`${host}/${bno}/toggle-pin`);
        return response.data;
    } catch (error) {
        console.error('Error toggling pin status:', error.response ? error.response.data : error.message);
        throw error;
    }
};