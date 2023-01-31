<template>
  <component :is="isMobile ? 'MobileSidebar' : 'DesktopSidebar'">
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-icon color="white" size="40">mdi-account-circle</v-icon>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Administration
          </v-list-item-title>
          <v-list-item-subtitle>Spa Management System</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense nav>
      <template v-for="item in items">
        <v-list-item-group
          :key="item.title"
          v-model="group"
          v-if="!item.children"
          active-class="white primary--text"
        >
          <v-list-item :to="{ name: item.pathName }">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-group
          class="mt-2"
          :key="item.title"
          active-class="white primary--text"
          v-else
          no-action
          :ripple="false"
          :prepend-icon="item.icon"
          :value="isActive(item.children)"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="{ name: child.pathName }"
            active-class="white primary--text"
          >
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>

    <v-list dense nav>
      <v-btn
        class="primary--text"
        block
        color="white"
        elevation="0"
        @click="logout"
        ><v-icon class="mr-1">mdi-power</v-icon>Đăng Xuất</v-btn
      >
    </v-list>
  </component>
</template>
<script>
import MobileSidebar from '@/layout/MobileSidebar';
import DesktopSidebar from '@/layout/DesktopSidebar';

export default {
  name: 'Navbar',
  components: {
    MobileSidebar,
    DesktopSidebar,
  },
  data() {
    return {
      group: null,
      right: null,
    };
  },
  computed: {
    items() {
      const menus = [
        {
          title: this.$t('side_bar.intakes'),
          icon: 'mdi-clipboard-check',
          pathName: 'Intake',
        },

        {
          title: 'Khách hàng',
          icon: 'mdi-account-multiple',
          children: [
            {
              title: 'Danh sách KH',
              pathName: 'Customers',
            },
            {
              title: this.$t('side_bar.invoices'),
              pathName: 'Invoices',
            },
            {
              title: this.$t('side_bar.combos'),
              pathName: 'Packages',
            },
          ],
        },
        {
          title: this.$t('side_bar.services'),
          icon: 'mdi-plus',
          children: [
            {
              title: 'Danh sách',
              pathName: 'Services',
            },
            {
              title: 'Các chương trình giảm giá',
              pathName: 'Discount',
            },
            {
              title: 'Nhập/Xuất kho',
              pathName: 'ImportExport',
            },
          ],
        },

        {
          title: 'Quản Lý Công việc',
          icon: 'mdi-clipboard-outline',
          children: [
            {
              title: this.$t('side_bar.employee'),
              pathName: 'Employees',
            },
            {
              title: this.$t('side_bar.report'),
              pathName: 'Report',
            },
            {
              title: 'Thống kê việc',
              pathName: 'WorkSummary',
            },
            {
              title: 'Phân công việc',
              pathName: 'Tasks',
            },
          ],
        },
      ];
      return menus;
    },
  },
  methods: {
    isActive(children) {
      return children.some((c) => c.pathName === this.$route.name);
    },
    logout() {
      localStorage.removeItem('jwt-token');
      localStorage.removeItem('user');
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>
<style scoped lang="scss"></style>
