import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryPage } from '../store/useCategoryPage';
import { useCategorySearch } from '../store/useCategorySearch.js';

const useCategoryListData = (listFn) => {

    const fn = listFn;
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const refresh = ref(false);

    // 스토어 사용
    const categoryPageStore = useCategoryPage();
    const searchStore = useCategorySearch();
    const currentPage = computed(() => categoryPageStore.currentPage);

    const searchParams = ref({
        type: 'name',
        keyword: searchStore.keyword || '',
        filter: '', // 새로운 필터 추가
        sort: '' // 정렬 기준 추가
    });

    const result = ref({
        dtoList: [],
        pageNumList: [],
        pageRequestDTO: {
            page: 1,
            size: 10
        },
        totalCount: 0,
        totalPage: 0,
        current: 1,
        prev: false,
        next: false
    });

    // 페이지 데이터 로드
    const loadPageData = async (page) => {
        loading.value = true;

        const apiSearchParams = {
            ...searchParams.value,
            keyword: searchParams.value.keyword || null
        };

        try {
            const data = await fn(page, apiSearchParams);
            result.value = data;

            // 상태 업데이트
            categoryPageStore.setCurrentPage(page);
            searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);

            // 항상 검색 조건 포함
            const query = {
                page,
                ...(searchParams.value.keyword && {
                    type: searchParams.value.type,
                    keyword: searchParams.value.keyword
                })
            };

            router.replace({
                path: route.path,
                query
            });
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        } finally {
            loading.value = false;
        }
    };

    const loadCategoryPage = async (page) => {
        if (loading.value || !result.value.next) {
            return;
        }

        loading.value = true;

        try {
            const data = await fn(page, { keyword: null });
            result.value.dtoList = [...result.value.dtoList, ...data.dtoList];
            result.value.next = data.next;
        } catch (error) {
            console.error('추가 페이지 로드 실패:', error);
        } finally {
            loading.value = false;
        }
    };

    // 페이지네이션 버튼 생성
    const pageArr = computed(() => {
        const currentPageValue = result.value.current;
        let lastPage = Math.ceil(currentPageValue / 10.0) * 10;
        const start = lastPage - 9;
        const prev = result.value.prev;
        const next = result.value.next;

        const pageArr = [];

        if (prev) {
            pageArr.push({ page: start - 1, label: 'PREV' });
        }

        result.value.pageNumList.forEach((page) => {
            pageArr.push({ page, label: page });
        });

        if (next) {
            pageArr.push({ page: lastPage + 1, label: 'NEXT' });
        }

        return pageArr;
    });

    // 초기 데이터 로드
    onMounted(() => {
        const page = route.query.page ? parseInt(route.query.page, 10) : categoryPageStore.currentPage;
        searchParams.value.type = route.query.type || 'name';
        searchParams.value.keyword = route.query.keyword || searchStore.keyword || '';
        loadPageData(page);
    });

    watch(refresh, () => {
        loadPageData(route.query.page || 1);
    });

    // 검색
    const search = () => {
        searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);
        loadPageData(1);
    };

    // Enter 키로 검색
    const onEnterKey = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    // 검색 조건 초기화 후 로드
    const cleanAndLoad = async () => {
        categoryPageStore.clean();
        searchStore.clean();
        searchParams.value.keyword = searchStore.keyword;
        searchParams.value.filter = ''; // 필터 초기화
        searchParams.value.sort = ''; // 정렬 초기화
        await loadPageData(1);
    };

    // 정렬 기능
    const sortData = (sortOption) => {
        searchParams.value.sort = sortOption;
        loadPageData(currentPage.value);
    };

    // 필터 기능
    const applyFilter = (filterOption) => {
        searchParams.value.filter = filterOption;
        loadPageData(1);
    };

    return { loading, result, loadCategoryPage, loadPageData,
        searchParams, pageArr, cleanAndLoad, onEnterKey,
        sortData, applyFilter };
};

export default useCategoryListData;
