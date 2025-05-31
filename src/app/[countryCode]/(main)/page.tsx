import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Hero from "@modules/home/components/hero"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Perfumes Élite | Fragancias de lujo accesibles",
  description:
    "Perfumes inspirados en las mejores marcas, con alta duración y precios accesibles. Perfumes Élite, lujo para todos.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id,handle,title",
  })

  if (!collections || !region) return null

  const nuevosLanzamientos = collections.find((c) => c.title === "Nuevos Lanzamientos")
  const destacados = collections.find((c) => c.title === "Productos Destacados")
  const perfume = collections.find((c) => c.title === "Perfume")
  const perfumesHombre = collections.find((c) => c.title === "Perfumes Hombre")
  const perfumesMujer = collections.find((c) => c.title === "Perfumes Mujer")

  const categorias = [
    { title: "DAMAS", image: "/img/categorias/damas.jpg" },
    { title: "CABALLEROS", image: "/img/categorias/caballeros.jpg" },
    { title: "UNISEX", image: "/img/categorias/unisex.jpg" },
    { title: "NUEVOS LANZAMIENTOS", image: "/img/categorias/nlanzamientos.jpg" },
  ]

  return (
    <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Hero />

      {/* Sección: Productos Destacados */}
      {destacados && (
      <section className="pt-8 pb-4 bg-gradient-to-b from-black to-[#0a0f1c]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[var(--color-text-accent)] mb-4 uppercase">
            Productos Destacados
          </h2>
          <div className="w-full max-w-12xl mx-auto px-6">
            <div className="mb-2 pt-14 pl-8 sm:pl-10">
              <h3 className="text-xl font-semibold text-[var(--color-text-accent)] mb-4">
              Recomendados
              </h3>
            </div>
            <ProductRail
              collection={destacados}
              region={region}
              size="compact"
              variant="horizontal"
            />
          </div>
        </section>
      )}

      {/* Sección: Nuevos Lanzamientos */}
      {nuevosLanzamientos && (
      <section className="py-16 bg-gradient-to-b from-black to-[#0a0f1c]">
          <div className="w-full max-w-12xl mx-auto px-6">
            <ProductRail
              collection={nuevosLanzamientos}
              region={region}
              size="default"
              variant="launch"
            />
          </div>
        </section>
      )}

      {/* Sección: Categorías */}
      <section className="bg-[var(--color-bg-primary)] py-14 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-accent)] mb-10 uppercase">
            CATEGORÍAS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categorias.map((cat, index) => (
              <Link key={index} href="/store">
                <div className="relative h-[300px] rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-black/10 p-4 text-white">
                    <h3 className="text-lg font-bold">{cat.title}</h3>
                    <p className="text-sm underline underline-offset-2">
                      Ver productos →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
