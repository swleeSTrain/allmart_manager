import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useProductListData = (listFn) => {
    const fn = listFn;
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const refresh = ref(false);

    const currentPage = ref(parseInt(route.query.page, 10) || 1);

    const searchParams = ref({
        type: route.query.type || 'all',
        keyword: route.query.keyword || '',
        categoryID: route.query.categoryID || null
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

        const apiSearchParams = {
            ...searchParams.value,
            type: searchParams.value.type === 'all' ? 'name&sku' : searchParams.value.type,
            keyword: searchParams.value.keyword || null,
            categoryID: searchParams.value.categoryID
        };

        const data = await fn(page, apiSearchParams);

        result.value = data;
        currentPage.value = page;

        const query = {
            page,
            ...(searchParams.value.keyword ? { keyword: searchParams.value.keyword } : {}),
            ...(searchParams.value.categoryID ? { categoryID: searchParams.value.categoryID } : {})
        };

        router.replace({ path: route.path, query });
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

        const page = parseInt(route.query.page, 10) || 1;

        searchParams.value = {
            type: route.query.type || 'all',
            keyword: route.query.keyword || '',
            categoryID: route.query.categoryID || null
        };

        loadPageData(page);
    });

    watch(refresh, () => {
        loadPageData(currentPage.value);
    });

    const search = () => {
        loadPageData(1);
    };

    const onEnterKey = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    const cleanAndLoad = async () => {
        searchParams.value.type = 'all';
        searchParams.value.keyword = '';
        currentPage.value = 1;
        await loadPageData(1);
    };

    const moveToRead = (productID) => {
        const query = {
            page: currentPage.value,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword
            })
        };

        router.push({
            path: `/product/read/${productID}`,
            query
        });
    };

    const moveToAdd = () => {
        const query = {
            page: currentPage.value,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword
            })
        };

        router.push({
            path: `/product/add`,
            query
        });
    };

    const updateCategory = (categoryID) => {

        // 다른 검색 조건 유지하면서 categoryID만 변경
        searchParams.value = {
            ...searchParams.value,
            categoryID
        };

        console.log("Updated searchParams:", searchParams.value);

        // 카테고리 변경 후 첫 페이지 로드
        loadPageData(1);
    };

    return {
        loading, route, router, refresh, result,
        pageArr, loadPageData, searchParams, search,
        onEnterKey, cleanAndLoad, moveToRead, moveToAdd,
        updateCategory
    };
};

export default useProductListData;
