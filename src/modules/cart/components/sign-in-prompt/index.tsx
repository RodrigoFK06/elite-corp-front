import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-[var(--color-card-bg)] p-4 rounded-md shadow-md border border-[var(--color-border)]">
      <div>
        <Heading level="h2" className="txt-xlarge text-[var(--color-text-accent)]">
          ¿Ya tienes una cuenta?
        </Heading>
        <Text className="txt-medium text-[var(--color-text-primary)] mt-2">
          Inicia sesión para una mejor experiencia.
        </Text>
      </div>
      <div className="mt-4">
        <LocalizedClientLink href="/account">
          <Button
            className="h-10 w-full bg-[var(--color-text-accent)] text-black hover:bg-[var(--color-accent)]"
            data-testid="sign-in-button"
          >
            Iniciar sesión
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
