<template>
	<v-card class="mx-auto" color="grey lighten-5" elevation="0">
		<v-list-item three-line>
			<v-list-item-content>
				<div class="overline mb-2 d-flex">
					<div class="mr-auto">
						{{ type.toUpperCase() }}
						<span v-if="dataSource.rank">
							-
							<strong v-rank="dataSource.rank">{{
								$t(dataSource.rank)
							}}</strong>
						</span>
					</div>
				</div>
				<router-link
					:to="
						dataSource.role_id && dataSource.role_id === 2
							? {
									name: 'EmployeeDetail',
									params: { employeeid: dataSource.id },
							  }
							: dataSource.id
							? {
									name: 'CustomerDetail',
									params: { customerid: dataSource.id },
							  }
							: {}
					"
				>
					<v-list-item-title class="headline mb-3">
						{{ dataSource.name }}
					</v-list-item-title>
				</router-link>
				<v-list-item-subtitle>
					<strong>{{ $t("userInformationCard.email") }}:</strong>
					<span :class="{ 'red--text': !dataSource.email }">
						{{
							dataSource.email
								? dataSource.email
								: $t("userInformationCard.unknown")
						}}
					</span>
				</v-list-item-subtitle>
				<v-list-item-subtitle>
					<strong>{{ $t("userInformationCard.phone") }}:</strong>
					<span :class="{ 'red--text': !dataSource.phone }">
						{{
							dataSource.phone
								? dataSource.phone
								: $t("userInformationCard.unknown") | formatPhone
						}}
					</span>
				</v-list-item-subtitle>
				<v-list-item-subtitle v-if="dataSource.balance">
					<strong>Số xu hiện tại:</strong>
					<span class="warning--text">
						{{ dataSource.balance | coin }}
					</span>
				</v-list-item-subtitle>
				<v-list-item-subtitle v-if="dataSource.total_spend">
					<strong>Tổng chi:</strong>
					<span class="warning--text">
						{{ dataSource.total_spend | currency }}
					</span>
				</v-list-item-subtitle>
				<v-list-item-subtitle v-if="dataSource.balance">
					<strong>Tích lũy: </strong>
					<span class="warning--text">
						{{ dataSource.cash_point | currency }}
					</span>
				</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
	</v-card>
</template>
<script>
export default {
	name: "UserInformationCard",
	props: {
		type: {
			type: String,
			default: "Customer",
			require: true,
		},
		dataSource: {
			type: Object,
			require: true,
		},
	},
};
</script>
