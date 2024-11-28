<script setup>
import { ref, onMounted, nextTick } from "vue";
import { fetchDeliveryStatusCount } from "../../apis/DeliveryAPI.js";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";
import {useRouter} from "vue-router";

// Chart.js에 필요한 컴포넌트 등록
Chart.register(ArcElement, Tooltip, Legend, PieController);

// 데이터 상태 관리
const statusCounts = ref({
  PENDING: 0,
  IN_PROGRESS: 0,
  COMPLETED: 0,
});

const router = useRouter();

// 차트 인스턴스 (중복 렌더링 방지)
let pieChartInstance = null;

// API 호출하여 데이터 로드
const loadStatusCounts = async () => {
  try {
    const data = await fetchDeliveryStatusCount();
    statusCounts.value = data;
  } catch (error) {
    console.error("Failed to fetch delivery status count:", error);
  }
};

// 차트 렌더링 함수
const renderPieChart = () => {
  const ctx = document.getElementById("deliveryStatusChart").getContext("2d");

  // 기존 차트가 있으면 삭제
  if (pieChartInstance) {
    pieChartInstance.destroy();
  }

  // 새 차트 생성
  pieChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["대기 중", "진행 중", "완료"],
      datasets: [
        {
          label: "배달 상태 비율",
          data: [statusCounts.value.PENDING, statusCounts.value.IN_PROGRESS, statusCounts.value.COMPLETED],
          backgroundColor: ["#60a5fa", "#fbbf24", "#34d399"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
};

// 컴포넌트가 마운트되었을 때 데이터 로드
onMounted(async () => {
  await loadStatusCounts(); // 데이터 로드
  await nextTick(); // DOM 렌더링 이후 실행
  renderPieChart(); // 차트 렌더링
});

// 특정 상태를 클릭하면 주문 목록 페이지로 이동
const goToOrderList = (status) => {
  router.push({
    path: "/delivery/orders",
    query: { status }, // 쿼리로 전달
  });
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">배달 상태별 통계</h2>
    <!-- 상태별 배달 통계 카드 -->
    <div class="grid grid-cols-3 gap-6">
      <div
          class="p-4 bg-gray-200 rounded shadow text-center cursor-pointer hover:bg-blue-100"
          @click="goToOrderList('PENDING')"
      >
        <h3 class="text-lg font-semibold text-gray-700">대기 중</h3>
        <p class="text-4xl font-bold text-blue-600">{{ statusCounts.PENDING }}</p>
      </div>
      <div
          class="p-4 bg-gray-200 rounded shadow text-center cursor-pointer hover:bg-yellow-100"
          @click="goToOrderList('IN_PROGRESS')"
      >
        <h3 class="text-lg font-semibold text-gray-700">진행 중</h3>
        <p class="text-4xl font-bold text-yellow-500">{{ statusCounts.IN_PROGRESS }}</p>
      </div>
      <div
          class="p-4 bg-gray-200 rounded shadow text-center cursor-pointer hover:bg-green-100"
          @click="goToOrderList('COMPLETED')"
      >
        <h3 class="text-lg font-semibold text-gray-700">완료</h3>
        <p class="text-4xl font-bold text-green-600">{{ statusCounts.COMPLETED }}</p>
      </div>
    </div>

    <!-- Pie Chart -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">전체 배달 상태 비율</h3>
      <div class="bg-gray-200 rounded shadow p-4">
        <canvas id="deliveryStatusChart" class="chart-canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-canvas {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
  display: block;
}
</style>
