import { groupBy, cloneDeep } from 'lodash';
import { formatCurrency } from '@/helpers/filters';
/* eslint-disable camelcase */
export const parseNote = (noteString) => {
  try {
    return JSON.parse(noteString);
  } catch (err) {
    return { text: noteString };
  }
};

export const mapIntakeFunc = (intakeDetailInfo) => {
  const intake = JSON.parse(JSON.stringify(intakeDetailInfo));
  const orders = [];
  const groupedOrders = groupBy(intake.orders, 'promotion_hash');
  Object.keys(groupedOrders).forEach((key) => {
    // For non-promotion orders
    if (key === 'null') {
      groupedOrders[key].forEach((o) => {
        const order = cloneDeep(o);
        const note = parseNote(o.note);
        const type = o.variant.service.service_category.name;
        // If intake is not approved yet, price and base price is variant price
        let { price, base_price, name } = o;
        if (!intake.is_valid) {
          price = o.variant.price;
          base_price = o.variant.price;
          name = o.variant.service.name;
          if (o.variant.name) {
            name = o.variant.name;
          }
        }
        orders.push({ ...order, note, type, name, price, base_price });
      });
      // For promotion orders groups
    } else {
      const promotionsOrders = [...groupedOrders[key]].map((o) => {
        const order = cloneDeep(o);
        const note = parseNote(o.note);
        const type = o.variant.service.service_category.name;
        let { name, price, base_price } = o;
        if (!intake.is_valid) {
          price = o.variant.price;
          base_price = o.variant.price;
          name = o.variant.service.name;
          if (o.variant.name) {
            name = o.variant.name;
          }
        }
        return { ...order, note, type, name, price, base_price };
      });
      const { name } = promotionsOrders[0].variant.service;
      const {
        discount_note,
        discount_amount,
        discount_percentage,
      } = promotionsOrders[0];
      /* eslint-disable no-param-reassign */
      // Calculate promotion pack price and base_price
      const { price, base_price } = promotionsOrders.reduce(
        (sumObj, item) => {
          if (!item.variant.is_free) {
            sumObj.price += item.price;
            sumObj.base_price += item.base_price;
          }
          return sumObj;
        },
        { price: 0, base_price: 0 },
      );
      orders.push({
        type: 'promotion',
        orders: promotionsOrders,
        price,
        base_price,
        name,
        discount_note,
        discount_amount,
        discount_percentage,
      });
    }
  });
  intake.orders = [...orders];
  return intake;
};

export const totalPackagePrice = (item) => {
  let total = 0;
  if (item.is_valid) {
    total = item.total_price;
  } else {
    total = item.combos.reduce((sum, combo) => {
      if (!combo.is_promotion_combo) {
        sum += combo.total_price;
      }
      return sum;
    }, 0);
  }
  return formatCurrency(total);
};
