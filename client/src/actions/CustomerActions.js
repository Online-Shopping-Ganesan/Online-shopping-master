import * as actions from './actions.js';

export const setCustomerDtls = (data) => {
    return {
      type: actions.SET_CUSTOMER_DTLS,
      data: data
    }
};
