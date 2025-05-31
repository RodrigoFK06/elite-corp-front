import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) return notFound()

  return (
    <>
      {/* 🟡 DETALLE PRINCIPAL */}
    <div className="w-full bg-transparent text-[var(--color-text-primary)] py-10">
        <div className="content-container grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="w-full">
            <ImageGallery images={product?.images || []} />
          </div>

          {/* Información del producto */}
          <div className="flex flex-col justify-start w-full px-4 space-y-3">
            <ProductInfo product={product} />
            <ProductTabs product={product} />
            <Suspense fallback={<ProductActions disabled={true} product={product} region={region} />}>
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* 🟡 PRODUCTOS RELACIONADOS */}
      <div className="content-container my-16 small:my-28 text-[var(--color-text-primary)]">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
