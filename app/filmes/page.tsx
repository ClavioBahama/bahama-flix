"use client"

import { useState } from "react"
import { Film, Star, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useContentContext } from "@/contexts/content-context"

export default function FilmesPage() {
  const { content, isLoading } = useContentContext()
  const [selectedGenre, setSelectedGenre] = useState("Todos")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl">Carregando filmes...</p>
        </div>
      </div>
    )
  }

  const movies = content.filter((item) => item.type === "movie")
  const genres = ["Todos", ...Array.from(new Set(movies.map((movie) => movie.genre)))]

  const filteredMovies = selectedGenre === "Todos" ? movies : movies.filter((movie) => movie.genre === selectedGenre)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl md:text-3xl font-bold text-red-600">
              Bahama Flix
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-red-600 transition-colors">
                Início
              </Link>
              <Link href="/filmes" className="text-red-600">
                Filmes
              </Link>
              <Link href="/series" className="hover:text-red-600 transition-colors">
                Séries
              </Link>
              <Link href="/acao" className="hover:text-red-600 transition-colors">
                Ação
              </Link>
              <Link href="/comedia" className="hover:text-red-600 transition-colors">
                Comédia
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Film className="w-8 h-8 mr-3 text-red-600" />
            Filmes ({filteredMovies.length})
          </h1>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Filtrar por gênero" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre} className="text-white hover:bg-gray-700">
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.slug}`}>
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-blue-600">Filme</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{movie.year}</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{movie.genre}</p>
                    {movie.duration && <p className="text-xs text-gray-500">{movie.duration}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
