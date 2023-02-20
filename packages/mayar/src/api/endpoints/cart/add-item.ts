import { LineItem } from '@vercel/commerce/types/cart'
import type { CartEndpoint } from '.'
import type { Cart, MayarCartAPI } from '../../../types/cart'

import getCartCookie from '../../utils/get-cart-cookie'
import generateUUID from '../../utils/uuid-generator'

const addItem: CartEndpoint['handlers']['addItem'] = async ({
  body: { cartId, item },
  config,
}) => {
  const sessionId = cartId ? cartId : generateUUID()
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
    },
    body: JSON.stringify({
      id: item.variantId,
      sessionId: sessionId,
    }),
  }

  const url = `https://api.mayar.id/hl/v1/cart/add`
  const res = await fetch(url, options)

  console.log(`[cart/add-item]Status: ${res.statusText}`)
  if (!res.ok) {
    return {
      data: null,
    }
  }

  const result: MayarCartAPI = await res.json()

  let items: LineItem[] = []

  result.data.productItems.map((item, _) => {
    if (item.product.coverImage) {
      return items.push({
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
          listPrice: item.product.amount ? item.product.amount : 0,
          type: item.product.type,
          image: {
            url: item.product.coverImage.url,
            alt: item.product.name,
            width: 1000,
            height: 1000,
          },
        },
      })
    }

    if (item.product.multipleImage && item.product.multipleImage.length > 0) {
      return items.push({
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
          listPrice: item.product.amount ? item.product.amount : 0,
          type: item.product.type,
          image: {
            url: item.product.multipleImage[0].url,
            alt: item.product.name,
            width: 1000,
            height: 1000,
          },
        },
      })
    }

    return items.push({
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
        listPrice: item.product.amount ? item.product.amount : 0,
        type: item.product.type,
        image: {
          url: '',
          alt: item.product.name,
          width: 1000,
          height: 1000,
        },
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

  console.log(cartData)

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

export default addItem
