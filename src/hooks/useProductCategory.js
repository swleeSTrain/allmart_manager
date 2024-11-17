import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const useProductCategory = (fetchCategoriesFn) => {

    const route = useRoute(); // 쿼리스트링 접근

    const result = ref({
        dtoList: [],
        next: false,
    });

    const loading = ref(false);
    const currentPage = ref(1);
    const selectedCategoryID = ref(Number(route.query.categoryID) || null);

    const loadCategoryPage = async (page) => {

        if (loading.value || (!result.value.next && page > 1)) return;

        loading.value = true;

        try {
            const data = await fetchCategoriesFn(page, { keyword: null });

            // "전체" 항목 추가
            if (page === 1) {
                data.dtoList.unshift({ categoryID: null, name: '전체' });
            }

            result.value.dtoList =
                page === 1
                    ? data.dtoList
                    : [...result.value.dtoList, ...data.dtoList];
            result.value.next = data.next;
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        } finally {
            loading.value = false;
        }
    };


    // 스크롤 관련 상태
    const scrollContainer = ref(null);
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainer.value.offsetLeft;
        scrollLeft = scrollContainer.value.scrollLeft;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollContainer.value.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도
        scrollContainer.value.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => (isDragging = false);

    const handleScroll = async () => {
        if (loading.value) return;

        const container = scrollContainer.value;
        const nearEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

        if (nearEnd) {
            currentPage.value += 1;
            await loadCategoryPage(currentPage.value);
        }
    };

    onMounted(async () => {

        await loadCategoryPage(1);

        const container = scrollContainer.value;

        if(container) {

            container.addEventListener('scroll', handleScroll);
            container.addEventListener('mousedown', handleMouseDown);
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseup', handleMouseUp);
            container.addEventListener('mouseleave', handleMouseUp);
        }
    });

    onBeforeUnmount(() => {

        const container = scrollContainer.value;

        if(container) {

            container.removeEventListener('scroll', handleScroll);
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mouseleave', handleMouseUp);
        }
    });

    const handleCategoryClick = (categoryID) => {

        selectedCategoryID.value = categoryID;
    };


    return {
        result, loading, selectedCategoryID, scrollContainer,
        handleCategoryClick, loadCategoryPage,
    };
};

export default useProductCategory;
