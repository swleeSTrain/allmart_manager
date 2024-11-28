<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchOrdersByStatus } from "../../apis/DeliveryAPI.js";

// 주문 데이터를 저장할 상태
const orders = ref([]);

// 현재 경로에서 상태를 가져오기
const route = useRoute();
const status = ref(route.query.status || "");

// 상태 매핑 (영문 -> 한글)
const statusLabels = {
  PENDING: "대기 중",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

// API 호출하여 주문 데이터를 로드
const loadOrders = async () => {
  try {
    const data = await fetchOrdersByStatus(status.value); // API 호출
    orders.value = data; // 응답 데이터 설정
  } catch (error) {
    console.error("Failed to fetch orders by status:", error);
  }
};

// 컴포넌트가 마운트되었을 때 데이터 로드
onMounted(() => {
  loadOrders();
});

// 날짜 포맷 함수 (ISO 8601 → "년-월-일 시:분")
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}시 : ${minutes}분`;
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- 상태에 따라 동적으로 제목 표시 -->
    <h2 class="text-2xl font-bold mb-6 text-gray-800">
      주문 목록 ({{ statusLabels[status] }})
    </h2>

    <!-- 주문 목록 표시 -->
    <div v-if="orders.length > 0">
      <table class="table-auto w-full border-collapse border border-gray-300">
        <thead class="bg-gray-200">
        <tr>
          <th class="border border-gray-300 px-4 py-2 text-left">주문 ID</th>
          <th class="border border-gray-300 px-4 py-2 text-left">고객 ID</th>
          <th class="border border-gray-300 px-4 py-2 text-left">총 금액</th>
          <th class="border border-gray-300 px-4 py-2 text-left">주문 시간</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.orderId" class="hover:bg-gray-100">
          <td class="border border-gray-300 px-4 py-2">{{ order.orderId }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ order.customerId }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ order.totalAmount }}원</td>
          <td class="border border-gray-300 px-4 py-2">{{ formatDate(order.orderTime) }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 데이터가 없을 때 메시지 -->
    <div v-else class="text-center text-gray-500 text-lg mt-6">
      해당 상태의 주문이 없습니다.
    </div>
  </div>
</template>

<style scoped>
/* 간단한 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
}

thead th {
  background-color: #f3f4f6;
}

tbody tr:hover {
  background-color: #f9fafb;
}
</style>
