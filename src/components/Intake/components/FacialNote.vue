<template>
  <div>
    <div class="caption" style="white-space: pre-wrap">
      <div>{{ note.text }}</div>
      <div>
        <div v-for="part in facialParts" :key="part">
          <span class="font-weight-bold">{{ $t(part) }}: </span>
          <span class="blue--text"
            >Độ ẩm ({{ note.note[part].humidity }}%)</span
          >
          -
          <span class="orange--text text--darken-4"
            >Độ dầu ({{ note.note[part].oil }}%)</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['note'],
  computed: {
    facialParts() {
      return Object.keys(this.note.note);
    },
  },
};
</script>
