import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Logo + descripción */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-elite.png"
              alt="Perfumes Élite"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-semibold">Perfumes Élite</span>
          </div>
          <p className="text-sm text-gray-300 max-w-xs">
            Réplicas de perfumes de alta calidad inspiradas en las grandes marcas,
            con excelente duración y aroma.
          </p>
        </div>

        {/* Información */}
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-yellow-400 font-semibold">Atención al cliente</span>
          <p>Teléfono: 960 481 012</p>
          <p>Lun-Vie: 9:00 a. m. – 6:00 p. m.</p>
          <p>Sáb: 9:00 a. m. – 1:00 p. m.</p>
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-yellow-400 font-semibold">Síguenos</span>
          <Link href="https://www.instagram.com/perfumeselite24/profilecard/?igsh=MWN5ZHMzY253cG1vcg==" target="_blank">
            Instagram
          </Link>
          <Link href="https://www.facebook.com/share/16DVrqXjFG/" target="_blank">
            Facebook
          </Link>
          <Link href="https://www.tiktok.com/@perfumes.elite?_t=ZM-8vwZqnZNfZG&_r=1" target="_blank">
            TikTok
          </Link>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © 2025 Corporación Perfumes Élite. Todos los derechos reservados.
      </div>
    </footer>
  )
}
