import type { Cart, MayarCartAPI } from '../../../types/cart'
import type { CartEndpoint } from '.'

import getCartCookie from '../../utils/get-cart-cookie'
import { LineItem } from '@vercel/commerce/types/cart'

const removeItem: CartEndpoint['handlers']['removeItem'] = async ({
  body: { cartId, itemId },
  config,
}) => {
  console.log({ cartId, itemId })
  const res = await fetch(`https://api.mayar.id/hl/v1/cart/remove`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: itemId,
      sessionId: cartId,
    }),
  })

  console.log(`[cart/remote-item]Status: ${res.statusText}`)
  if (!res.ok) {
    return {
      data: null,
    }
  }

  const result: MayarCartAPI = await res.json()

  let items: LineItem[] = []
  result.data.productItems.map((item, _) => {
    items.push({
      id: item.product.id,
      variantId: item.product.id,
      productId: item.product.id,
      name: item.product.name,
      quantity: item.qty,
      discounts: [],
      path: item.product.path,
      variant: {
        id: item.product.id,
        name: item.product.name,
        type: item.product.type,
        price: item.product.amount ? item.product.amount : 0,
        listPrice: item.product.amount ? item.product.amount : 0,
      },
    })
  })

  const cartData: Cart = {
    id: result.data.sessionId,
    customerId: result.data.userId,
    createdAt: new Date().toString(),
    currency: { code: 'IDR' },
    taxesIncluded: false,
    lineItems: items,
    lineItemsSubtotalPrice: result.data.amountTotal,
    subtotalPrice: result.data.amountTotal,
    totalPrice: result.data.amountTotal,
  }

  return {
    data: cartData,
    headers: {
      'Set-Cookie': getCartCookie(
        config.cartCookie,
        result.data.sessionId,
        config.cartCookieMaxAge
      ),
    },
  }
}

export default removeItem
