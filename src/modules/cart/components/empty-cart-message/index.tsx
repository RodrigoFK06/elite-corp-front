import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-48 px-4 flex flex-col justify-center items-center text-center bg-[var(--color-bg-primary)]"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="text-3xl font-bold text-[var(--color-text-accent)] mb-4"
      >
        Tu carrito está vacío
      </Heading>

      <Text className="text-base text-[var(--color-text-primary)] mb-6 max-w-xl">
        Aún no has agregado ningún producto. Usa el enlace a continuación para empezar a explorar nuestras fragancias.
      </Text>

      <InteractiveLink href="/store" className="text-[var(--color-text-accent)] hover:text-[var(--color-accent)]">
        Explorar productos →
      </InteractiveLink>
    </div>
  )
}

export default EmptyCartMessage
