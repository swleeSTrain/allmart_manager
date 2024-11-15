import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePage } from '../store/usePage';
import { useProductSearch } from '../store/useProductSearch.js';

const useProductListData = (listFn) => {
    const fn = listFn;
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const refresh = ref(false);

    const pageStore = usePage();
    const searchStore = useProductSearch();
    const currentPage = computed(() => pageStore.currentPage);

    const searchParams = ref({
        type: searchStore.type || 'all',
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

    const loadPageData = async (page) => {
        loading.value = true;

        const apiSearchParams = {
            ...searchParams.value,
            type: searchParams.value.type === 'all' ? 'name&sku' : searchParams.value.type,
            keyword: searchParams.value.keyword || null
        };

        const data = await fn(page, apiSearchParams);
        result.value = data;
        loading.value = false;

        pageStore.setCurrentPage(page);
        searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);

        // keyword가 있을 때만 검색 파라미터 추가
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

        result.value.pageNumList.forEach(page => {
            pageArr.push({ page, label: page });
        });

        if (next) {
            pageArr.push({ page: lastPage + 1, label: 'NEXT' });
        }

        return pageArr;
    });

    onMounted(() => {

        const page = route.query.page ? parseInt(route.query.page, 10) : pageStore.currentPage;
        searchParams.value.type = route.query.type || 'all';
        searchParams.value.keyword = route.query.keyword || searchStore.keyword || '';

        loadPageData(page);
    });

    watch(refresh, () => {
        loadPageData(route.query.page || 1);
    });

    const search = () => {
        searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);
        loadPageData(1, true);
    };

    const onEnterKey = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    const cleanAndLoad = async () => {
        pageStore.clean();
        searchStore.clean();

        searchParams.value.keyword = searchStore.keyword;
        await loadPageData(1);
    };

    // 상세 페이지로 이동
    const moveToRead = (productID) => {
        // 현재 페이지는 항상 유지하고, 검색 조건은 keyword가 있을 때만 포함
        const query = {
            page: currentPage.value,
            ...(searchStore.keyword && {
                type: searchStore.type,
                keyword: searchStore.keyword
            })
        };

        router.push({
            path: `/product/read/${productID}`,
            query
        });
    };


    return {
        loading, route, router, refresh, result,
        pageArr, loadPageData, searchParams, search,
        onEnterKey, cleanAndLoad, moveToRead
    };
};

export default useProductListData;
