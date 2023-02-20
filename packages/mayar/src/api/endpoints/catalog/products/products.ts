import { Product } from '@vercel/commerce/types/product'
import { IProductAPI } from '../../../../types/product'
import { ProductsEndpoint } from '.'

const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  body: { search, categoryId, brandId, sort },
  config,
  commerce,
}) => {
  let url = `https://api.mayar.id/hl/v1/product`
  if (categoryId) {
    url += `?type=${categoryId}`
  }

  let res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
    },
  })

  console.log(`[catalog/products]Status: ${res.statusText}`)
  if (!res.ok) {
    return {
      data: { products: [], found: false },
    }
  }

  const result: IProductAPI = await res.json()
  const found = result.data.length > 0
  if (!found) {
    return {
      data: { products: [], found },
    }
  }

  let products: Product[] = result.data.map((item, _) => {
    const product: Product = {
      id: item.id,
      name: item.name,
      description: '',
      descriptionHtml: item.description,
      path: `/${item.id}`,
      slug: item.link,
      category: item.category,
      type: item.type,
      images: item.coverImage
        ? [
            {
              url: item.coverImage.url,
              alt: item.name,
              width: 1000,
              height: 1000,
            },
          ]
        : item.multipleImage && item.multipleImage.length > 0
        ? [
            {
              url: item.multipleImage[0].url,
              alt: item.name,
              width: 1000,
              height: 1000,
            },
          ]
        : [],
      variants: [],
      price: {
        value: item.amount ? item.amount : 0,
        currencyCode: 'IDR',
      },
      options: [],
      createdAt: item.createdAt, // Add the createdAt property to the product
    }
    return product
  })

  if (sort && sort == 'price-desc') {
    products = products.sort((a, b) => b.price.value - a.price.value)
  }

  if (sort && sort == 'price-asc') {
    products = products.sort((a, b) => a.price.value - b.price.value)
  }

  if (sort && sort == 'lastest-desc') {
    products = products.sort((a, b) => b.createdAt - a.createdAt)
  }

  return {
    data: {
      products: products,
      found,
    },
  }
}

export default getProducts
