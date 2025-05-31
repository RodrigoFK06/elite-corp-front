import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  variant = "vertical",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  variant?: "vertical" | "horizontal" | "launch"
}) {
  const { cheapestPrice } = getProductPrice({ product })

  if (variant === "launch") {
    return (
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="group"
      >
        <div className="bg-[var(--color-card-bg)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] transition-all duration-200 hover:shadow-md overflow-hidden flex flex-col h-full">
          {/* Imagen */}
          <div className="relative w-full aspect-[3/4] sm:aspect-[3/3.2]">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>

          {/* Contenido */}
          <div className="p-4 pt-3 flex flex-col justify-end gap-2 flex-grow">
            <div className="flex justify-between items-center">
              <Text className="text-base font-semibold truncate">
                {product.title}
              </Text>
              <span className="bg-[var(--color-accent)] text-black text-xs px-2 py-1 rounded-full">
                Nuevo
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-[var(--color-text-accent)]">
                {cheapestPrice?.calculated_price || "S/ --"}
              </span>
              <span className="text-yellow-400 text-sm">★★★★★</span>
            </div>

            <button className="contrast-btn w-full text-sm">
              Ver Detalles
            </button>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
    >
      <div
        className={`bg-[var(--color-card-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-all duration-200 hover:shadow-md ${
          variant === "horizontal"
            ? "flex items-center gap-4 p-3 h-full"
            : "p-3 hover:-translate-y-1 shadow-sm"
        }`}
        data-testid="product-wrapper"
      >
        {/* Imagen */}
        <div
          className={`relative overflow-hidden ${
            variant === "horizontal"
              ? "w-24 h-24 flex-shrink-0 rounded-md"
              : "w-full aspect-[4/5] rounded-md"
          }`}
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </div>

        {/* Contenido */}
        <div
          className={`flex flex-col ${
            variant === "horizontal" ? "gap-1" : "gap-2 mt-4"
          }`}
        >
          <Text className="text-base font-semibold truncate">
            {product.title}
          </Text>

          {variant === "vertical" && (
            <Text className="text-sm text-gray-400">100ml</Text>
          )}

          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
