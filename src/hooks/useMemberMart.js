import { ref, onMounted } from 'vue';

const useMemberMart = (listFn) => {
    const result = ref({
        dtoList: [], // 마트 리스트
        totalCount: 0, // 총 데이터 수
    });

    const loading = ref(false);

    // 마트 데이터 로드 함수
    const loadMartList = async () => {
        if (loading.value) return;

        loading.value = true;

        try {
            const data = await listFn(); // 첫 페이지 데이터 호출
            result.value.dtoList = data.dtoList; // 마트 리스트 설정
            result.value.totalCount = data.totalCount; // 총 마트 수
        } catch (error) {
            console.error("마트 리스트 로드 실패:", error);
        } finally {
            loading.value = false;
        }
    };

    // 컴포넌트가 마운트될 때 마트 데이터 로드
    onMounted(() => {
        loadMartList();
    });

    return { result, loading, loadMartList };
};

export default useMemberMart;
