import type { CommerceAPI, CommerceAPIConfig } from '@vercel/commerce/api'
import { getCommerceApi as commerceApi } from '@vercel/commerce/api'
import createFetcher from './utils/fetch-local'

import getAllPages from './operations/get-all-pages'
import getPage from './operations/get-page'
import getSiteInfo from './operations/get-site-info'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getAllProductPaths from './operations/get-all-product-paths'
import getAllProducts from './operations/get-all-products'
import getProduct from './operations/get-product'

export interface MayarConfig extends CommerceAPIConfig {}

const config: MayarConfig = {
  commerceUrl: 'https://api.mayar.id',
  apiToken: process.env.MAYAR_API_KEY!,
  cartCookie: 'mayar-commerce',
  customerCookie: 'SHOP_TOKEN',
  cartCookieMaxAge: 60 * 60 * 24 * 30,
  fetch: createFetcher(() => getCommerceApi().getConfig()),
}

const operations = {
  getAllPages,
  getPage,
  getSiteInfo,
  getCustomerWishlist,
  getAllProductPaths,
  getAllProducts,
  getProduct,
}

export const provider = { config, operations }

export type Provider = typeof provider
export type MayarAPI<P extends Provider = Provider> = CommerceAPI<P | any>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): MayarAPI<P> {
  return commerceApi(customProvider as any)
}
