import type { Cart, MayarCartAPI } from '../../../types/cart'
import type { CartEndpoint } from '.'
import getCartCookie from '../../utils/get-cart-cookie'
import { LineItem } from '@vercel/commerce/types/cart'

const updateItem: CartEndpoint['handlers']['updateItem'] = async ({
  body: { cartId, itemId, item },
  config,
}) => {
  const res = await fetch(
    `https://api.mayar.id/hl/v1/cart?sessionId=${
      cartId ? cartId : getCartCookie(config.cartCookie)
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
      },
    }
  )
  let items: LineItem[] = []
  const result: MayarCartAPI = await res.json()

  if (!res.ok) {
    return {
      headers: {
        'Set-Cookie': getCartCookie(
          config.cartCookie,
          cartId,
          config.cartCookieMaxAge
        ),
      },
    }
  }

  console.log(`[cart/update-cart]Status: ${res.statusText}`)

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
        price: item.product.amount ? item.product.amount : 0,
        type: item.product.type,
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
        cartId,
        config.cartCookieMaxAge
      ),
    },
  }
}

export default updateItem
