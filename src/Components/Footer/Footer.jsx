export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Veteriner Kliniği. Tüm hakları saklıdır.</p>
        <div className="mt-4">
          <a href="/about" className="text-gray-400 hover:text-white mx-2">
            Hakkımızda
          </a>
          <a href="/services" className="text-gray-400 hover:text-white mx-2">
            Hizmetler
          </a>
          <a href="/contact" className="text-gray-400 hover:text-white mx-2">
            İletişim
          </a>
        </div>
      </div>
    </footer>
  )
}