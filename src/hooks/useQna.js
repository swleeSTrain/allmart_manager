import { ref } from "vue";
import {
    getQuestions,
    fetchQuestionById,
    addQuestion,
    updateQuestion,
    deleteQuestion,
} from "../apis/QnaAPI.js";

export const useQna = () => {
    const questions = ref([]);
    const question = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchQuestions = async (params = {}) => {
        loading.value = true;
        try {
            const data = await getQuestions(params);
            questions.value = data.dtoList; // API에서 이미 data를 반환
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    const fetchQuestion = async (qno) => {
        loading.value = true;
        try {
            question.value = await fetchQuestionById(qno); // API에서 data를 반환
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    const createQuestion = async (formData) => {
        try {
            await addQuestion(formData);
        } catch (err) {
            error.value = err;
        }
    };

    const updateQuestionDetails = async (qno, formData) => {
        try {
            await updateQuestion(qno, formData);
        } catch (err) {
            error.value = err;
        }
    };

    const removeQuestion = async (qno) => {
        try {
            await deleteQuestion(qno);
        } catch (err) {
            error.value = err;
        }
    };

    return {
        questions,
        question,
        loading,
        error,
        fetchQuestions,
        fetchQuestion,
        createQuestion,
        updateQuestionDetails,
        removeQuestion,
    };
};
