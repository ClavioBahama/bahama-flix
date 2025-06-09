"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Film, Tv, Star, Play, Settings, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useContentContext } from "@/contexts/content-context"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"
import { AdminPanel } from "@/components/admin-panel"

export default function HomePage() {
  const { content, isLoading } = useContentContext()
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof content>([])
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = content.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.genre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, content])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchTerm)}`
    }
  }

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

  const movies = content.filter((item) => item.type === "movie").slice(0, 8)
  const series = content.filter((item) => item.type === "series").slice(0, 8)

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
            <span className="text-gray-400">Espaço para Anúncio 728x90</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-red-600 font-semibold">
                Bahama Flix
              </Link>
              <Link href="/filmes" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                <Film className="w-4 h-4" />
                Filmes
              </Link>
              <Link href="/series" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                <Tv className="w-4 h-4" />
                Séries
              </Link>

              {/* Dropdown Opções */}
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
                  <i className="fas fa-list"></i>
                  Opções
                </button>
                <div className="absolute top-full left-0 bg-gray-800 border border-gray-700 rounded-lg mt-1 py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/comedia" className="block px-4 py-2 hover:bg-gray-700">
                    😂 Comédia
                  </Link>
                  <Link href="/acao" className="block px-4 py-2 hover:bg-gray-700">
                    💥 Ação
                  </Link>
                  <Link href="/animacao" className="block px-4 py-2 hover:bg-gray-700">
                    🎬 Animação
                  </Link>
                  <Link href="/terror" className="block px-4 py-2 hover:bg-gray-700">
                    👻 Terror
                  </Link>
                  <Link href="/drama" className="block px-4 py-2 hover:bg-gray-700">
                    😢 Drama
                  </Link>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Escreva a sua pesquisa"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-600"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-b-lg mt-1 max-h-96 overflow-y-auto z-50">
                  {searchResults.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      href={`/${item.type}/${item.slug}`}
                      className="flex items-center p-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-400">
                          {item.year} • {item.genre}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => setIsAdminPanelOpen(true)} className="hover:bg-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        Painel Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="hover:bg-gray-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setIsLoginModalOpen(true)} className="bg-red-600 hover:bg-red-700 border-red-600">
                Logar
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Seção Filmes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Film className="w-6 h-6 mr-2 text-red-600" />
              Filmes
            </h2>
            <Link href="/filmes" className="text-red-600 hover:text-red-500 text-sm">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {movies.map((item) => (
              <Link key={item.id} href={`/movie/${item.slug}`}>
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
                      <Badge className="absolute top-2 left-2 bg-blue-600">HD</Badge>
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
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Native Banner entre seções */}
        <div className="bg-gray-800 py-4 text-center mb-8 rounded">
          <div className="bg-gray-700 mx-auto max-w-2xl h-16 flex items-center justify-center rounded">
            <span className="text-gray-400">Espaço para Anúncio Native</span>
          </div>
        </div>

        {/* Seção Séries */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Tv className="w-6 h-6 mr-2 text-red-600" />
              Séries
            </h2>
            <Link href="/series" className="text-red-600 hover:text-red-500 text-sm">
              Ver todas
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {series.map((item) => (
              <Link key={item.id} href={`/series/${item.slug}`}>
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
                      <Badge className="absolute top-2 left-2 bg-green-600">Série</Badge>
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
                      {item.seasons && (
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
        </section>

        {/* Banner Mobile */}
        <div className="bg-gray-800 py-3 text-center mb-8 rounded">
          <div className="bg-gray-700 mx-auto max-w-sm h-12 flex items-center justify-center rounded">
            <span className="text-gray-400">Anúncio Mobile 320x50</span>
          </div>
        </div>

        {/* Seção Filmes e Séries Adicionais */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <i className="fas fa-child mr-2 text-red-600"></i>
              Filmes e Séries
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {content.slice(16, 20).map((item) => (
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
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Banner Rodapé */}
        <div className="bg-gray-800 py-4 text-center mb-8 rounded">
          <div className="bg-gray-700 mx-auto max-w-lg h-16 flex items-center justify-center rounded">
            <span className="text-gray-400">Anúncio Rodapé 468x60</span>
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
                <p>
                  <Link href="/avaliar" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Avaliar o Site
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-700" />

          <div className="text-center text-gray-400 text-sm">© 2025 Bahama Flix. Todos os direitos reservados.</div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </div>
  )
}
