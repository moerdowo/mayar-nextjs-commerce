import { GetAPISchema, createEndpoint } from '@vercel/commerce/api'
import productsEndpoint from '@vercel/commerce/api/endpoints/catalog/products'
import type { ProductsSchema } from '@vercel/commerce/types/product'
import type { MayarAPI } from '../../..'
import getProducts from './products'

export type ProductsAPI = GetAPISchema<MayarAPI, ProductsSchema>

export type ProductsEndpoint = ProductsAPI['endpoint']

export const handlers: ProductsEndpoint['handlers'] = { getProducts }

const productsApi = createEndpoint<ProductsAPI>({
  handler: productsEndpoint,
  handlers,
})

export default productsApi
