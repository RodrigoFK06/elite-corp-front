import Culqi from "culqi-node"

export async function createCulqiCharge({
  amount,
  currency_code,
  email,
  source_id,
}: {
  amount: string // en céntimos
  currency_code: "PEN" | "USD"
  email: string
  source_id: string
}) {
  if (!process.env.CULQI_PRIVATE_KEY) {
    throw new Error("CULQI_PRIVATE_KEY no está definido")
  }

  // 👉 Ahora se inicializa solo cuando se llama a esta función
  const culqi = new Culqi({ privateKey: process.env.CULQI_PRIVATE_KEY })

  return await culqi.charges.createCharge({
    amount,
    currency_code,
    email,
    source_id,
  })
}