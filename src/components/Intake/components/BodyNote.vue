<template>
  <div>
    <div class="caption" style="white-space: pre-wrap">
      <div>{{ note.text }}</div>
      <div>_<strong>Các vùng cần lưu ý:</strong> {{ bodyPartString }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['note'],
  computed: {
    bodyPartString() {
      return this.note.note.map((p) => this.$t(p)).join(', ');
    },
  },
};
</script>
