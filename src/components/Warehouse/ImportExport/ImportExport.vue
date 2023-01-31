<template>
  <div class="service-list">
    <div class="d-flex align-center justify-space-between py-4">
      <h3>{{ $t('services.manage') }}</h3>
      <v-btn
        depressed
        small
        color="primary"
        @click="toggleDialog('AddNewServiceForm', true)"
        ><v-icon left small>mdi-plus</v-icon>
        <span> {{ $t('services.add') }}</span></v-btn
      >
    </div>
    <v-card class="pa-4 rounded-lg d-flex align-center mb-8" elevation="4">
      <div class="flex-grow-1">
        <label class="font-weight-bold subtitle-2"
          >{{ $t('services.search') }}
        </label>
        <v-text-field
          class="rounded-lg"
          :placeholder="''"
          dense
          filled
          rounded
          v-model="searchString"
          clearable
          hide-details
        />
      </div>
      <div>
        <v-btn
          style="margin-top: 23px"
          class="ml-2"
          depressed
          color="primary"
          @click="fetchData()"
          ><v-icon small dark>mdi-refresh</v-icon></v-btn
        >
      </div>
    </v-card>
    <!-- <div class="d-flex  mb-4 align-center">
      <div class=" mr-auto d-flex align-center justify-center"></div>
      <div class="searchbox ml-auto"></div>
    </div> -->
    <v-card class="rounded-lg overflow-hidden" elevation="4">
      <v-tabs
        show-arrows
        fixed-tabs
        hide-slider
        v-model="tab"
        background-color="grey lighten-4"
        color="black"
        class="service-tabs custom"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab :href="'#warehouse-import'">Nhập kho</v-tab>
        <v-tab :href="'#warehouse-export'">Xuất kho</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="warehouse-import">
          <v-data-table
            :headers="headers"
            :items="desserts"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>DANH SÁCH NHẬP KHO</v-toolbar-title>
                <v-spacer></v-spacer>
                <ImportForm />
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5"
                      >Are you sure you want to delete this item?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item value="warehouse-export">Xuat kho</v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<!-- eslint-disable no-unused-expressions -->
<script>
import ImportForm from './components/ImportForm';

export default {
  name: 'ImportExport',
  components: {
    ImportForm,
  },
  data() {
    return {
      tab: null,
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Tên sản phẩm', value: 'calories', sortable: false },
        {
          text: 'Hãng',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Số lượng', value: 'fat', sortable: false },
        { text: 'Giá Nhập', value: 'carbs', sortable: false },
        { text: 'Giá bán', value: 'protein', sortable: false },
        { text: 'Ngày nhập', value: 'protein', sortable: false },
        { text: '', value: 'actions', sortable: false },
      ],
      desserts: [],
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.desserts = [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
        },
      ];
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
<style lang="scss">
.service-list {
  .v-data-table__expanded__content {
    background-color: #fafafa !important;
    box-shadow: none !important;
    .variants {
      background-color: #fff;
    }
  }
}
</style>
