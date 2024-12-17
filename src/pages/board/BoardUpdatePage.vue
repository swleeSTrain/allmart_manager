<template>
  <div>
    <h2>Edit Post (Board No: {{ bno }})</h2>
    <BoardUpdateComponent :bno="bno"></BoardUpdateComponent>
  </div>
</template>

<script setup>

import {defineProps} from "vue";

import BoardUpdateComponent from "../../components/board/BoardUpdateComponent.vue";

const props = defineProps({
  bno: {
    type: String,
    required: true
  }
});
</script>