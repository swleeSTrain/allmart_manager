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

    // 새로 만든 useCategoryPage 스토어 사용
    const categoryPageStore = useCategoryPage();
    const searchStore = useCategorySearch();
    const currentPage = computed(() => categoryPageStore.currentPage);

    const searchParams = ref({
        type: 'name',
        keyword: searchStore.keyword || ''
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

        const data = await fn(page, apiSearchParams);
        result.value = data;
        loading.value = false;

        // 페이지 상태 업데이트
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
    };

    const loadCategoryPage = async (page) => {
        // 이미 로딩 중이거나 다음 페이지가 없으면 중단
        if (loading.value || !result.value.next) {
            return;
        }

        loading.value = true;

        try {
            const data = await fn(page, { keyword: null });
            result.value.dtoList = [...result.value.dtoList, ...data.dtoList];
            result.value.next = data.next; // 다음 페이지 유무 업데이트
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        const page = route.query.page ? parseInt(route.query.page, 10) : categoryPageStore.currentPage;
        searchParams.value.type = route.query.type || 'name';
        searchParams.value.keyword = route.query.keyword || searchStore.keyword || '';
        loadPageData(page);
    });

    watch(refresh, () => {
        loadPageData(route.query.page || 1);
    });

    return { loading, result, loadCategoryPage, loadPageData, searchParams };
};

export default useCategoryListData;
