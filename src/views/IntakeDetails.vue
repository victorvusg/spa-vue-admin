<template>
  <div  class="main-content pa-0">
    <div
      class="pa-2 primary d-flex align-center justify-space-between white--text"
    >
      <div class="title">CHI TIẾT ĐƠN</div>
      <v-btn dark @click="back" text color="white" depressed elevation="0">
        <v-icon>mdi-arrow-left</v-icon> Quay lại
      </v-btn>
    </div>
    <Detail  v-if="id !== null" :id="id" :style="!isMobile ? {height: 'calc(100vh - 64px)'} : {}"/>
  </div>
</template>
<script>
/* eslint-disable camelcase */
import Detail from '@/components/Intake/Detail';

export default {
  name: 'IntakeDetailView',
  components: {
    Detail,
  },
  data() {
    return {
      id: null,
    };
  },
  async created() {
    const { id } = this.$route.params;
    this.id = id;
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss"></style>
