import { computed, onMounted, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { usePage } from '../store/usePage';
import { useSearch } from '../store/useSearch';

// 상수 정의
const PAGE_SIZE = 10;
const DEFAULT_SEARCH_TYPE = 'all';

// 페이지네이션 로직을 위한 별도의 컴포저블
const usePagination = (result) => {
    return computed(() => {
        const currentPageValue = result.value.current;
        let lastPage = Math.ceil(currentPageValue / 10.0) * 10;
        const start = lastPage - 9;
        const prev = result.value.prev;
        const next = result.value.next;
        const pageArr = [];

        if (prev) {
            pageArr.push({ page: start - 1, label: 'PREV' });
        }

        result.value.pageNumList.forEach(page => {
            pageArr.push({ page, label: page });
        });

        if (next) {
            pageArr.push({ page: lastPage + 1, label: 'NEXT' });
        }

        return pageArr;
    });
};

const useBoardListData = (listFn, togglePinFn) => {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const error = ref(null);

    const pageStore = usePage();
    const searchStore = useSearch();
    const currentPage = computed(() => pageStore.currentPage);

    const searchParams = ref({
        type: searchStore.type || DEFAULT_SEARCH_TYPE,
        keyword: searchStore.keyword || ''
    });

    const result = ref({
        dtoList: [],
        pageNumList: [],
        pageRequestDTO: {
            page: 1,
            size: PAGE_SIZE
        },
        totalCount: 0,
        totalPage: 0,
        current: 1,
        prev: false,
        next: false
    });

    const loadPageData = async (page) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await listFn(page, searchParams.value);
            // 상단 고정 게시글을 일반 게시글보다 먼저 정렬
            data.dtoList.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
            result.value = data;
            pageStore.setCurrentPage(page);
            searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);

            const query = { page };
            if (searchParams.value.keyword.trim() !== '' || searchParams.value.type !== DEFAULT_SEARCH_TYPE) {
                query.type = searchParams.value.type;
                query.keyword = searchParams.value.keyword;
            }

            router.push({ path: route.path, query });
        } catch (err) {
            console.error("데이터 로딩 중 오류 발생:", err);
            error.value = "데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.";
        } finally {
            loading.value = false;
        }
    };

    const togglePin = async (bno) => {
        try {
            await togglePinFn(bno);
            // 상단 고정 상태 변경 후 현재 페이지 데이터 다시 로드
            await loadPageData(currentPage.value);
        } catch (err) {
            console.error("게시글 고정 상태 변경 중 오류 발생:", err);
            error.value = "게시글 고정 상태를 변경하는 데 실패했습니다.";
        }
    };

    const pageArr = usePagination(result);

    onMounted(() => {
        const page = route.query.page ? parseInt(route.query.page, 10) : pageStore.currentPage;
        searchParams.value.type = route.query.type || searchStore.type || DEFAULT_SEARCH_TYPE;
        searchParams.value.keyword = route.query.keyword || searchStore.keyword || '';
        loadPageData(page);
    });

    watch(() => route.query, (newQuery) => {
        const page = newQuery.page ? parseInt(newQuery.page, 10) : 1;
        searchParams.value.type = newQuery.type || DEFAULT_SEARCH_TYPE;
        searchParams.value.keyword = newQuery.keyword || '';
        loadPageData(page);
    }, { deep: true });

    onBeforeRouteUpdate((to, from, next) => {
        const page = to.query.page ? parseInt(to.query.page, 10) : pageStore.currentPage;
        searchParams.value.type = to.query.type || DEFAULT_SEARCH_TYPE;
        searchParams.value.keyword = to.query.keyword || '';
        loadPageData(page);
        next();
    });

    const moveToRead = (bno) => {
        const query = {
            page: currentPage.value,
            type: searchStore.type,
            keyword: searchStore.keyword
        };
        router.push({
            path: `/board/read/${bno}`,
            query
        });
    };

    const search = () => {
        searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);
        loadPageData(1);
    };

    return {
        loading,
        error,
        moveToRead,
        result,
        pageArr,
        loadPageData,
        searchParams,
        search,
        togglePin
    };
};

export default useBoardListData;