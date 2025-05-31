import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col">{props.children}</main>
      </body>
    </html>
  )
}
