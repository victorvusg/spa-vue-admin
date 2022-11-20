<template>
  <v-card class="mx-auto" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-2 d-flex">
          <div class="mr-auto">{{ $t('intakeInformationCard.title') }}</div>

          <div
            :class="{
              'green--text': dataSource.is_valid,
              'red--text': !dataSource.is_valid,
            }"
          >
            {{
              dataSource.is_valid
                ? $t('intakeInformationCard.valid')
                : $t('intakeInformationCard.invalid')
            }}
          </div>
        </div>
        <v-list-item-subtitle>
          {{ $t('intakeInformationCard.create_by') }}
        </v-list-item-subtitle>
        <v-list-item-title class="headline mb-3">{{
          dataSource.employee.name
        }}</v-list-item-title>
        <v-list-item-subtitle
          ><strong> {{ $t('intakeInformationCard.create_time') }}: </strong>
          {{
            dataSource.created_at
              ? dataSource.created_at
              : $t('intakeInformationCard.unknown') | formatDate(true)
          }}</v-list-item-subtitle
        >
        <slot></slot>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script>
export default {
  name: 'IntakeInformationCard',
  props: {
    dataSource: {
      type: Object,
      require: true,
    },
  },
};
</script>
