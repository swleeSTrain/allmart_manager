import axios from "axios";

const host = "http://localhost:8080/api/v1/qna";

// Q&A 목록 가져오기
export const getQuestions = async (page = 1, params = {}) => {
    try {
        const response = await axios.get(`${host}/question/list`, {
            params: { page, ...params }, // 페이지 번호와 검색 조건 병합
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Q&A list:", error);
        throw error;
    }
};

// 특정 질문 가져오기
export const fetchQuestionById = async (qno) => {
    try {
        const response = await axios.get(`${host}/question/${qno}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching question with ID ${qno}:`, error);
        throw error;
    }
};

// 질문 등록
export const addQuestion = async (questionData) => {
    try {
        const response = await axios.post(`${host}/question/add`, questionData, {
            headers: { "Content-Type": "multipart/form-data" }, // 파일 업로드 시 필요한 헤더
        });
        return response.data;
    } catch (error) {
        console.error("Error adding question:", error);
        throw error;
    }
};

// 질문 수정
export const updateQuestion = async (qno, questionData) => {
    try {
        const response = await axios.put(`${host}/question/${qno}`, questionData, {
            headers: { "Content-Type": "multipart/form-data" }, // 파일 업로드 시 필요한 헤더
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating question with ID ${qno}:`, error);
        throw error;
    }
};

// 질문 삭제
export const deleteQuestion = async (qno) => {
    try {
        const response = await axios.delete(`${host}/question/${qno}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting question with ID ${qno}:`, error);
        throw error;
    }
};



// 특정 질문에 대한 답변 목록 가져오기
export const getAnswersByQuestion = async (qno) => {
    const response = await axios.get(`${host}/answer/${qno}`);
    return response.data;
};

// 답변 등록
export const addAnswer = async (answerData) => {
    const response = await axios.post(`${host}/answer/add`, answerData);
    return response.data;
};

// 답변 삭제
export const deleteAnswer = async (ano) => {
    const response = await axios.delete(`${host}/answer/${ano}`);
    return response.data;
};

// 답변 수정
export const updateAnswer = async (ano, answerData) => {
    const response = await axios.put(`${host}/answer/${ano}`, answerData);
    return response.data;
};
