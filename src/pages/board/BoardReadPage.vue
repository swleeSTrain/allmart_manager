<template>
  <div>
    <BoardReadComponent :bno="bno" />
    <CommentListComponent :bno="bno"></CommentListComponent>
    <CommentAddComponent :bno="bno"></CommentAddComponent>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
import BoardReadComponent from "../../components/board/BoardReadComponent.vue";
import CommentListComponent from "../../components/board/comment/CommentListComponent.vue";
import CommentAddComponent from "../../components/board/comment/CommentAddComponent.vue";
// Using defineProps for props declaration in script setup
const props = defineProps({
  bno: {
    type: String,
    required: true
  }
});
</script>
