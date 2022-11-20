<template>
  <v-card class="mx-auto" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-2 d-flex">
          <div class="mr-auto">{{ $t('comboInformationCard.title') }}</div>
          <div
            :class="{
              'green--text': dataSource.is_valid,
              'red--text': !dataSource.is_valid,
            }"
          >
            <span v-if="dataSource.is_valid">
              {{ dataSource.expiry_date | formatDate }}
            </span>
            <span v-else>
              {{ $t('comboInformationCard.invalid') }}
            </span>
          </div>
        </div>
        <v-list-item-subtitle>
          {{ $t('comboInformationCard.service') }}:
        </v-list-item-subtitle>
        <v-list-item-title class="headline mb-3">
          {{ dataSource.service.name }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="dataSource.is_valid">
          <strong>{{ $t('comboInformationCard.used') }}: </strong>
          <span class="error--text">
            {{ dataSource.number_used }}
          </span>
          / <span class="primary--text">{{ dataSource.amount }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <strong>{{ $t('comboInformationCard.create_time') }}: </strong>
          {{
            dataSource.created_at
              ? dataSource.created_at
              : $t('comboInformationCard.unknown') | formatDate(true)
          }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <strong>{{ $t('comboInformationCard.total') }}: </strong>
          {{ dataSource.total_price | currency }}
        </v-list-item-subtitle>
        <slot></slot>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script>
export default {
  name: 'ComboInformationCard',
  props: {
    dataSource: {
      type: Object,
      require: true,
    },
  },
};
</script>
