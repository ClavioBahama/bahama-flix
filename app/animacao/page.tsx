"use client"

import { Star, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { allContent } from "@/lib/data"

export default function AnimacaoPage() {
  const animationContent = allContent.filter((item) => item.genre === "Animação")

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
              <Link href="/filmes" className="hover:text-red-600 transition-colors">
                Filmes
              </Link>
              <Link href="/series" className="hover:text-red-600 transition-colors">
                Séries
              </Link>
              <Link href="/acao" className="hover:text-red-600 transition-colors">
                Ação
              </Link>
              <Link href="/animacao" className="text-red-600">
                Animação
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <span className="text-purple-500 mr-3">🎨</span>
            Filmes e Séries de Animação ({animationContent.length})
          </h1>
          <p className="text-gray-400">Diversão para toda a família!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {animationContent.map((item) => (
            <Link key={item.id} href={`/${item.type}/${item.slug}`}>
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 cursor-pointer group">
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
                      {item.type === "movie" ? "Filme" : "Série"}
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
      </main>
    </div>
  )
}
