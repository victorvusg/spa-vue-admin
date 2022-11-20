export default class IntakeCustomerModel {
  constructor(data) {
    const baseObject = {
      id: null,
      phone: null,
      name: 'GUEST',
      email: null,
      points: 0,
      gender: 'both',
      user_id: null,
      birthday: null,
      district: null,
      province: null,
      combos: [],
    };
    if (data) {
      return { ...baseObject, ...data };
    }
    return { ...baseObject };
  }
}
