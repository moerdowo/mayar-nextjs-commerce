# Next.js Local Provider

## How to change providers

Open `site/.env.local` and change the value of `COMMERCE_PROVIDER` to the provider you would like to use, then set the environment variables for that provider (use `site/.env.template` as the base).

The setup for Shopify would look like this for example:

```env
COMMERCE_PROVIDER=@vercel/commerce-mayar
MAYAR_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
