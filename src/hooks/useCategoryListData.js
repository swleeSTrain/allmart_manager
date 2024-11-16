import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { deleteCategory } from '../apis/CategoryAPI.js';

const useCategoryListData = (listFn) => {
    const fn = listFn;
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const refresh = ref(false);

    const searchParams = ref({
        type: route.query.type || 'name',
        keyword: route.query.keyword || ''
    });

    const currentPage = ref(parseInt(route.query.page, 10) || 1);

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
            keyword: searchParams.value.keyword || null
        };

        const data = await fn(page, apiSearchParams);
        result.value = data;
        loading.value = false;

        currentPage.value = page;

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
        searchParams.value.type = route.query.type || 'name';
        searchParams.value.keyword = route.query.keyword || '';
        loadPageData(page);
    });

    watch(refresh, () => {
        loadPageData(route.query.page || 1);
    });

    const moveToEdit = (categoryID) => {
        const query = {
            page: currentPage.value,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword
            })
        };

        router.push({
            path: `/category/edit/${categoryID}`,
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
            path: `/category/add`,
            query
        });
    };

    const search = () => {
        loadPageData(1);
    };

    const onEnterKey = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    const cleanAndLoad = async () => {
        searchParams.value.type = 'name';
        searchParams.value.keyword = '';
        currentPage.value = 1;
        await loadPageData(1);
    };

    const editAndLoad = async () => {
        await loadPageData(currentPage.value);
    };

    const handleDelete = async (categoryID) => {
        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제하면 복구할 수 없습니다!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCategory(categoryID);
                    Swal.fire({
                        icon: 'success',
                        title: '삭제 완료!',
                        text: '성공적으로 삭제되었습니다.'
                    });
                    cleanAndLoad();
                } catch (error) {
                    console.error('Failed to delete category:', error);
                    Swal.fire({
                        icon: 'error',
                        title: '오류 발생',
                        text: '삭제하는 도중 오류가 발생했습니다.'
                    });
                }
            }
        });
    };

    return {
        loading, route, router, refresh, result,
        pageArr, loadPageData, searchParams, search,
        onEnterKey, cleanAndLoad, moveToAdd, handleDelete,
        moveToEdit, editAndLoad
    };
};

export default useCategoryListData;
