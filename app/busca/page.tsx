"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Star, Play, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useContentContext } from "@/contexts/content-context"

export default function BuscaPage() {
  const { content, isLoading } = useContentContext()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [selectedGenre, setSelectedGenre] = useState("Todos")
  const [selectedType, setSelectedType] = useState("all")
  const [filteredContent, setFilteredContent] = useState(content)

  const genres = ["Todos", ...Array.from(new Set(content.map((item) => item.genre)))]

  useEffect(() => {
    let filtered = content

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por gênero
    if (selectedGenre !== "Todos") {
      filtered = filtered.filter((item) => item.genre === selectedGenre)
    }

    // Filtrar por tipo
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType)
    }

    setFilteredContent(filtered)
  }, [searchTerm, selectedGenre, selectedType, content])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl md:text-3xl font-bold text-red-600">
              Bahama Flix
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar filmes e séries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-red-600"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={selectedType === "all" ? "default" : "ghost"}
              onClick={() => setSelectedType("all")}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={selectedType === "movie" ? "default" : "ghost"}
              onClick={() => setSelectedType("movie")}
              size="sm"
            >
              Filmes
            </Button>
            <Button
              variant={selectedType === "series" ? "default" : "ghost"}
              onClick={() => setSelectedType("series")}
              size="sm"
            >
              Séries
            </Button>
          </div>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Gênero" />
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

        {/* Results Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {searchTerm ? `Resultados para "${searchTerm}"` : "Todos os Conteúdos"}
          </h1>
          <p className="text-gray-400">
            {filteredContent.length} resultado{filteredContent.length !== 1 ? "s" : ""} encontrado
            {filteredContent.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Results Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredContent.map((item) => (
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p>Tente ajustar seus filtros ou termo de busca</p>
            </div>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedGenre("Todos")
                setSelectedType("all")
              }}
              variant="outline"
              className="mt-4"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
