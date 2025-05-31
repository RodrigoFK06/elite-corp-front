import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-2 lg:max-w-[500px]">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm text-[var(--color-accent)] hover:underline font-medium"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        <Heading
          level="h2"
          className="text-3xl font-bold text-[var(--color-text-primary)] leading-9"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-sm text-[var(--color-text-secondary)] whitespace-pre-line leading-tight"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
