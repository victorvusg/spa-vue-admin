<template>
  <div class="service-list" v-if="isFetched">
    <v-breadcrumbs :items="breadcrumbsItems" class="pl-0" />
    <h3 class="mb-4">Nhắc nhở cho nhân viên</h3>
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn depressed color="secondary" small @click="refresh">
          <v-icon small dark>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          :label="$t('services.search')"
          single-line
          dense
          filled
          v-model="searchString"
          clearable
          rounded
        />
      </v-col>
    </v-row>
    <v-data-iterator
      :items="reminders"
      :search="searchString"
      v-if="reminders"
      :footer-props="{
        itemsPerPageText: 'Per Page',
      }"
    >
      <template v-slot:default="props">
        <masonry :cols="{ default: 3, 600: 1, 1024: 2 }" gutter="15">
          <template v-for="item in props.items">
            <v-list-item :key="item.id" class="pa-2">
              <v-list-item-content class="message-layout">
                <div class="mb-2 text-caption d-flex align-center">
                  <v-icon size="15" class="mr-1">mdi-account</v-icon>
                  <strong>{{ item.employee.name }}</strong>
                </div>
                <div v-html="item.title"></div>
                <div class="d-flex align-center justify-end">
                  <DeleteReminder :item="item" />
                </div>
              </v-list-item-content>
            </v-list-item>
          </template>
        </masonry>
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';
import DeleteReminder from '@/components/Reminder/DeleteReminder';
import taskMixins from '@/mixins/task.mixins';

export default {
  name: 'ReminderIndex',
  mixins: [taskMixins],
  components: {
    DeleteReminder,
  },
  data() {
    return {
      isFetched: false,
      isUpdating: false,
      breadcrumbsItems: [
        {
          text: this.$t('breadcrumbs.dashboard'),
          disabled: false,
          href: routeHelper.getPath('Dashboard'),
        },
        {
          text: 'Nhắc nhở cho nhân viên',
          disabled: true,
          href: '/reminder',
        },
      ],
      searchString: '',
    };
  },
  methods: {
    async updateActiveValue(item) {
      item.isEditing = true;
      try {
        await this.updateDiscount({ id: item.id, is_active: item.is_active });
        item.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async refresh() {
      this.setLoading(true);
      await this.fetchReminders();
      this.setLoading(false);
    },
  },
  async created() {
    this.isFetched = false;
    this.setLoading(true);
    await this.fetchReminders();
    this.isFetched = true;
    this.setLoading(false);
  },
};
</script>
<style lang="scss">
</style>
