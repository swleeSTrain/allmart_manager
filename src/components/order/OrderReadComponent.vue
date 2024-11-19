<template>
  <div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">

    <h1 class="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">주문 상세</h1>

    <div v-if="order" class="space-y-6">

      <!-- 기본 정보 -->
      <table class="min-w-full table-auto border-separate border-spacing-4">
        <tbody>
        <tr>
          <td class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-r-2 border-gray-400">주문 ID</td>
          <td class="text-2xl text-black-600 border-b-2 border-gray-400">{{ order.orderId }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-r-2 border-gray-400">고객 ID</td>
          <td class="text-2xl text-black-600 border-b-2 border-gray-400">{{ order.customerId }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-r-2 border-gray-400">주문 상태</td>
          <td class="text-2xl text-black-600 border-b-2 border-gray-400">{{ order.status }}</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-r-2 border-gray-400">총 가격</td>
          <td class="text-2xl text-black-600 border-b-2 border-gray-400">{{ order.totalAmount.toLocaleString() }}원</td>
        </tr>
        <tr>
          <td class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-r-2 border-gray-400">주문 시간</td>
          <td class="text-xl text-black-500 border-b-2 border-gray-400">{{ formatDate(order.orderTime) }}</td>
        </tr>
        </tbody>
      </table>

      <!-- 주문 상품 목록 -->
      <div>
        <h2 class="text-3xl font-bold text-gray-700 mb-4">주문 상품</h2>
        <table class="min-w-full table-auto border-separate border-spacing-4">
          <thead class="bg-gray-200">
          <tr>
            <th class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-gray-400 px-4">상품명</th>
            <th class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-gray-400 px-4">수량</th>
            <th class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-gray-400 px-4">단가</th>
            <th class="text-left font-semibold text-gray-700 text-2xl border-b-2 border-gray-400 px-4">상품 ID</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in order.orderItems" :key="item.orderItemId">
            <td class="text-black-600 text-2xl border-b-2 border-gray-400 px-4">{{ item.productName }}</td>
            <td class="text-black-600 text-2xl border-b-2 border-gray-400 px-4">{{ item.quantity }}</td>
            <td class="text-black-600 text-2xl border-b-2 border-gray-400 px-4">{{ item.unitPrice.toLocaleString() }}원</td>
            <td class="text-black-600 text-2xl border-b-2 border-gray-400 px-4">{{ item.productId }}</td>
          </tr>
          </tbody>
        </table>
      </div>


    </div>

    <div class="mt-8 flex justify-center">
      <button
          class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          @click="moveToList"
      >
        목록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useDateFormatter from '../../hooks/useDateFormatter.js';
import { getReadOrder } from '../../apis/OrderAPI.js';

const route = useRoute();
const router = useRouter();
const order = ref(null);

const { formatDate } = useDateFormatter();

// LIST 이동
const moveToList = () => {
  router.push({
    path: '/order/list',
    query: { page: route.query.page, ...route.query },
  });
};

// 컴포넌트 로드 시 API 호출
onMounted(async () => {
  const orderId = route.params.orderId; // URL에서 orderId 가져오기

  if (!orderId) {
    console.error('Missing orderId in URL');
    return;
  }

  try {

    console.log("============");
    const data = await getReadOrder(orderId);
    order.value = data;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
  }
});
</script>
