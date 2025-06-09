"use client"

import { useState } from "react"
import { Play, Star, Clock, Calendar, User, ArrowLeft, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useContentContext } from "@/contexts/content-context"
import { notFound } from "next/navigation"

interface MoviePageProps {
  params: {
    slug: string
  }
}

export default function MoviePage({ params }: MoviePageProps) {
  const { content, isLoading } = useContentContext()
  const [isFavorite, setIsFavorite] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl">Carregando filme...</p>
        </div>
      </div>
    )
  }

  const movie = content.find((item) => item.slug === params.slug && item.type === "movie")

  if (!movie) {
    notFound()
  }

  const relatedMovies = content
    .filter((item) => item.type === "movie" && item.genre === movie.genre && item.id !== movie.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl md:text-3xl font-bold text-red-600">
              Bahama Flix
            </Link>
            <Link href="/filmes" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Filmes
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Movie Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full rounded-lg shadow-2xl" />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-blue-600">Filme</Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {movie.genre}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{movie.year}</span>
              </div>
              {movie.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{movie.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{movie.rating}/5</span>
              </div>
              {movie.director && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{movie.director}</span>
                </div>
              )}
            </div>

            {movie.cast && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Elenco Principal</h3>
                <p className="text-gray-300">{movie.cast.join(", ")}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => window.open(movie.watchUrl, "_blank")}
              >
                <Play className="w-5 h-5 mr-2" />
                Assistir Agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`border-gray-600 ${isFavorite ? "text-red-500 border-red-500" : "text-gray-300"}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Favoritado" : "Favoritar"}
              </Button>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300">
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Filmes Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <Link key={relatedMovie.id} href={`/movie/${relatedMovie.slug}`}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
                    <div className="relative">
                      <img
                        src={relatedMovie.image || "/placeholder.svg"}
                        alt={relatedMovie.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{relatedMovie.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{relatedMovie.year}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span>{relatedMovie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
