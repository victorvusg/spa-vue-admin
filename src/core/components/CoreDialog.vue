<template>
  <v-dialog v-model="dialog" persistent :max-width="350">
    <v-card v-if="dialog">
      <v-card-title class="headline" v-html="config.title" />
      <v-card-text class="pb-0">
        <component
          v-if="config.contentType === 'component'"
          :is="config.content"
          v-bind="config.contentProps"
        />
        <div v-else v-html="config.content" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!!config.callBackFunc"
          color="error"
          text
          @click="config.callBackFunc()"
          v-html="config.agreeBtnLabel"
          :disabled="config.agreeBtnDisable"
        />
        <v-btn
          color="black"
          text
          @click="dispatch('coreDialog/closeDialog')"
          v-html="config.closeBtnLabel"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import entryComponents from '@/helpers/entryComponents';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'CoreDialog',
  components: { ...entryComponents },
  methods: {
    ...mapActions('coreDialog', ['openDialog', 'closeDialog']),
  },
  computed: {
    ...mapState('coreDialog', ['model', 'config']),
    dialog: {
      get() {
        return this.model;
      },
      set(val) {
        if (val) {
          this.openDialog();
          return;
        }
        this.closeDialog();
      },
    },
  },
};
</script>
