import Enumerable from "linq";

import store from '../store/store';

export const priceCalculator = {
  compute(item) {
    let price = parseFloat(item.price);
    if (item.extras){
      let extraPrices = Enumerable.from(item.extras).sum(extraId => {
        let extra = store.getters.product(extraId);
        if (!extra) {
          console.error('product not found', extraId)
          return 0;
        }
        return parseFloat(extra.price)
      });
      price += extraPrices;
    }

    // console.error('price', price, ' for item ', item);
    return price;
  }
}
