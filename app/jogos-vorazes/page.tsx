"use client"

import { ArrowLeft, Star, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const jogosVorazesFilmes = [
  {
    id: 1,
    title: "Jogos Vorazes",
    image: "Acao/FT.F/Jogos Vorazes.jpg",
    rating: 4.1,
    year: 2012,
    genre: "Ação, Ficção Científica",
    watchUrl: "Jogos Vorazes (1).html",
  },
  {
    id: 2,
    title: "Jogos Vorazes A Esperança - Parte 1",
    image: "Acao/FT.F/Jogos Vorazes A Esperança - Parte 1.jpg",
    rating: 4.0,
    year: 2014,
    genre: "Ação, Ficção Científica",
    watchUrl: "Jogos Vorazes A Esperança - Parte 1.html",
  },
  {
    id: 3,
    title: "Jogos Vorazes A Esperança - Final",
    image: "Acao/FT.F/Jogos Vorazes A Esperança - Parte 2.jpg",
    rating: 4.0,
    year: 2015,
    genre: "Ação, Ficção Científica",
    watchUrl: "Jogos Vorazes A Esperança - Parte 2.html",
  },
]

export default function JogosVorazesPage() {
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
              <Link href="/comedia" className="hover:text-red-600 transition-colors">
                Comédia
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Ad Container Top */}
      <div className="ad-container-top my-3 text-center">
        <div className="bg-gray-800/50 p-4 rounded">
          <p className="text-gray-400">Anúncio Superior</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/acao" className="mr-4 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Jogos Vorazes</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {jogosVorazesFilmes.map((filme) => (
            <Card
              key={filme.id}
              className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={filme.image || "/placeholder.svg"}
                    alt={filme.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <Badge className="absolute top-2 left-2 bg-blue-600">HD</Badge>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{filme.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{filme.year}</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span>{filme.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{filme.genre}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Ad Container Bottom */}
      <div className="ad-container-bottom my-3 text-center">
        <div className="bg-gray-800/50 p-4 rounded">
          <p className="text-gray-400">Anúncio Inferior</p>
        </div>
      </div>
    </div>
  )
}
