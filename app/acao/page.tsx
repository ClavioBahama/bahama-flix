"use client"

import { useState } from "react"
import { Star, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useContentContext } from "@/contexts/content-context"

export default function AcaoPage() {
  const { content, isLoading } = useContentContext()
  const [selectedGenre, setSelectedGenre] = useState("Todos")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl">Carregando conteúdo...</p>
        </div>
      </div>
    )
  }

  const acaoContent = content.filter((item) => item.genre === "Ação")
  const genres = ["Todos", ...Array.from(new Set(acaoContent.map((item) => item.genre)))]

  const filteredContent =
    selectedGenre === "Todos" ? acaoContent : acaoContent.filter((item) => item.genre === selectedGenre)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Animado */}
      <header className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
            <span className="inline-block animate-pulse">B</span>
            <span className="inline-block animate-pulse delay-100">a</span>
            <span className="inline-block animate-pulse delay-200">h</span>
            <span className="inline-block animate-pulse delay-300">a</span>
            <span className="inline-block animate-pulse delay-400">m</span>
            <span className="inline-block animate-pulse delay-500">a</span>
            <span className="mx-2"></span>
            <span className="inline-block animate-pulse delay-600">F</span>
            <span className="inline-block animate-pulse delay-700">l</span>
            <span className="inline-block animate-pulse delay-800">i</span>
            <span className="inline-block animate-pulse delay-1000">x</span>
          </h1>
        </div>

        {/* Banner Anúncio Topo */}
        <div className="bg-gray-800 py-3 text-center">
          <div className="bg-gray-700 mx-auto max-w-3xl h-20 flex items-center justify-center rounded">
            <span className="text-gray-400">Espaço para Anúncio Superior</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-red-600 font-semibold">
                Ação
              </Link>
              <Link href="/" className="hover:text-red-600 transition-colors">
                <i className="fas fa-home mr-1"></i> Casa
              </Link>
              <Link href="/filmes" className="hover:text-red-600 transition-colors">
                <i className="fas fa-film mr-1"></i> Filmes
              </Link>
              <Link href="/series" className="hover:text-red-600 transition-colors">
                <i className="fas fa-tv mr-1"></i> Séries
              </Link>
            </div>

            <form className="flex items-center">
              <input
                type="search"
                placeholder="Escreva a sua pesquisa"
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-l text-white placeholder-gray-400"
              />
              <button className="px-3 py-2 bg-gray-600 border border-gray-600 rounded-r hover:bg-gray-500">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Sidebar com anúncios */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-gray-800 p-3 rounded w-32 h-40 flex items-center justify-center">
          <span className="text-gray-400 text-xs text-center">Anúncio Lateral</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <span className="text-red-600 mr-3">💥</span>
            Ação ({filteredContent.length})
          </h2>

          <div className="dropdown relative">
            <button className="bg-gray-800 border border-gray-700 px-4 py-2 rounded flex items-center">
              <i className="fas fa-filter mr-2"></i> Ver Mais
            </button>
            <div className="absolute top-full right-0 bg-gray-800 border border-gray-700 rounded mt-1 py-2 w-48 opacity-0 invisible hover:opacity-100 hover:visible transition-all z-50">
              <Link href="/filmes" className="block px-4 py-2 hover:bg-gray-700">
                Todos
              </Link>
              <Link href="/animacao" className="block px-4 py-2 hover:bg-gray-700">
                🎬 Animação
              </Link>
              <Link href="/terror" className="block px-4 py-2 hover:bg-gray-700">
                👻 Terror
              </Link>
              <Link href="/comedia" className="block px-4 py-2 hover:bg-gray-700">
                😂 Comédia
              </Link>
              <Link href="/drama" className="block px-4 py-2 hover:bg-gray-700">
                😢 Drama
              </Link>
              <Link href="/ficcao" className="block px-4 py-2 hover:bg-gray-700">
                🚀 Ficção Científica
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredContent.map((item) => (
            <Link key={item.id} href={`/${item.type}/${item.slug}`}>
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge
                      className={`absolute top-2 left-2 ${item.type === "movie" ? "bg-blue-600" : "bg-green-600"}`}
                    >
                      {item.type === "movie" ? "HD" : "Série"}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{item.year}</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.genre}</p>
                    {item.type === "series" && item.seasons && (
                      <p className="text-xs text-gray-500">
                        {item.seasons} temporada{item.seasons > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Banner Anúncio Inferior */}
        <div className="bg-gray-800 py-4 text-center mt-8 rounded">
          <div className="bg-gray-700 mx-auto max-w-lg h-16 flex items-center justify-center rounded">
            <span className="text-gray-400">Anúncio Inferior</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h5 className="font-semibold mb-3">Contato</h5>
              <p className="text-gray-400 text-sm mb-1">
                <a href="mailto:claviochitsulete@icloud.com" className="hover:text-white transition-colors">
                  <i className="fas fa-envelope mr-2"></i>claviochitsulete@icloud.com
                </a>
              </p>
              <p className="text-gray-400 text-sm">
                <a href="tel:+25883384656" className="hover:text-white transition-colors">
                  <i className="fas fa-phone mr-2"></i>(+258) 83 384 6565
                </a>
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Redes Sociais</h5>
              <div className="flex justify-center md:justify-start gap-4">
                <a
                  href="https://www.facebook.com/ranilde.paulo"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors"
                  rel="noreferrer"
                >
                  <i className="fab fa-facebook-f fa-lg"></i>
                </a>
                <a
                  href="https://www.instagram.com/claviochitsulete"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors"
                  rel="noreferrer"
                >
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
                <a
                  href="https://wa.me/258847944630"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors"
                  rel="noreferrer"
                >
                  <i className="fab fa-whatsapp fa-lg"></i>
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Links Úteis</h5>
              <div className="space-y-1">
                <p>
                  <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Política de Privacidade
                  </Link>
                </p>
                <p>
                  <Link href="/termos" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Termos de Uso
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-700" />

          <div className="text-center text-gray-400 text-sm">© 2025 Bahama Flix. Todos os direitos reservados.</div>
        </div>
      </footer>
    </div>
  )
}
