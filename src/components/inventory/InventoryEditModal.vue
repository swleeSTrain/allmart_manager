<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
      <h2 class="text-lg font-semibold mb-4">재고 수량 수정</h2>

      <!-- 수량 입력 -->
      <div class="mb-4">
        <label for="quantity" class="block text-gray-700 font-medium mb-2">수량</label>
        <input
            id="quantity"
            v-model.number="quantity"
            type="number"
            min="0"
            placeholder="수량을 입력하세요"
            class="border p-2 w-full"
            @keydown="onEnterKey"
        />
      </div>

      <!-- 버튼 -->
      <div class="flex justify-end space-x-2">
        <button @click="editQuantity" class="px-4 py-2 bg-blue-600 text-white rounded">수정</button>
        <button @click="closeModal" class="px-4 py-2 bg-gray-400 text-white rounded">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getInventoryList, updateInventory } from '../../apis/InventoryAPI.js';
import Swal from 'sweetalert2';

const emit = defineEmits(['close', 'refreshList']);
const props = defineProps(['inventoryID']);
const isOpen = ref(true);
const quantity = ref(0);

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const onEnterKey = (event) => {
  if (event.key === 'Enter') {
    editQuantity();
  }
};

onMounted(async () => {
  if (props.inventoryID) {
    try {
      const inventory = await getInventoryList(props.inventoryID);
      quantity.value = inventory.quantity;
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: '오류 발생', text: '재고 정보를 불러오는데 실패했습니다.' });
      closeModal();
    }
  }
});

const editQuantity = async () => {
  if (quantity.value < 0) {
    Swal.fire({ icon: 'warning', title: '입력 오류', text: '수량은 0 이상이어야 합니다.' });
    return;
  }

  try {
    await updateInventory(props.inventoryID, { quantity: quantity.value });
    Swal.fire({ icon: 'success', title: '수정 성공!', text: '재고 수량이 수정되었습니다.' });
    emit('refreshList'); // 리스트 갱신 요청
    closeModal();
  } catch (error) {
    console.error(error);
    Swal.fire({ icon: 'error', title: '오류 발생', text: '수정 중 문제가 발생했습니다.' });
  }
};
</script>
