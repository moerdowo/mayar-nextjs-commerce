import createEndpoints from '@vercel/commerce/api/endpoints'
import type { MayarAPI } from '.'

import products from './endpoints/catalog/products'
import cart from './endpoints/cart'

const endpoints = {
  'catalog/products': products,
  cart,
}

export default function mayarAPI(commerce: MayarAPI): any {
  return createEndpoints(commerce, endpoints)
}
