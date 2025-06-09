"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CheckCircle2, Star } from "lucide-react"
import { useContentContext } from "@/contexts/content-context"
import type { ContentItem } from "@/lib/data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { content, addContent, updateContent, removeContent } = useContentContext()
  const [activeTab, setActiveTab] = useState("overview")
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [success, setSuccess] = useState("")

  // Estados para adicionar novo conteúdo
  const [newContent, setNewContent] = useState({
    title: "",
    type: "movie" as "movie" | "series",
    genre: "",
    year: new Date().getFullYear(),
    rating: 4.0,
    image: "",
    description: "",
    watchUrl: "",
    duration: "",
    director: "",
    cast: "",
    seasons: 1,
  })

  const movies = content.filter((item) => item.type === "movie")
  const series = content.filter((item) => item.type === "series")

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deleteId) {
      removeContent(deleteId)
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
      showSuccess("Conteúdo removido com sucesso!")
    }
  }

  const handleSaveEdit = () => {
    if (editingItem) {
      updateContent(editingItem.id, editingItem)
      setIsEditModalOpen(false)
      setEditingItem(null)
      showSuccess("Conteúdo atualizado com sucesso!")
    }
  }

  const handleAddContent = () => {
    const slug = newContent.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")

    const contentToAdd = {
      ...newContent,
      slug,
      cast: newContent.cast
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }

    addContent(contentToAdd)
    setIsAddModalOpen(false)
    resetNewContent()
    showSuccess("Conteúdo adicionado com sucesso!")
  }

  const resetNewContent = () => {
    setNewContent({
      title: "",
      type: "movie",
      genre: "",
      year: new Date().getFullYear(),
      rating: 4.0,
      image: "",
      description: "",
      watchUrl: "",
      duration: "",
      director: "",
      cast: "",
      seasons: 1,
    })
  }

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600">Painel Administrativo</DialogTitle>
          </DialogHeader>

          {success && (
            <Alert className="bg-green-900 border-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="movies">Filmes ({movies.length})</TabsTrigger>
              <TabsTrigger value="series">Séries ({series.length})</TabsTrigger>
              <TabsTrigger value="add">Adicionar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total de Filmes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{movies.length}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total de Séries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{series.length}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total de Conteúdo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{content.length}</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle>Conteúdo Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-400">
                              {item.year} • {item.genre}
                            </p>
                          </div>
                        </div>
                        <Badge className={item.type === "movie" ? "bg-blue-600" : "bg-green-600"}>
                          {item.type === "movie" ? "Filme" : "Série"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="movies" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gerenciar Filmes</h3>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Filme
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.map((movie) => (
                  <Card key={movie.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={movie.image || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-blue-600">Filme</Badge>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-1">{movie.title}</h4>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <span>{movie.year}</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span>{movie.rating}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(movie)}
                            className="flex-1 border-gray-600 hover:bg-gray-600"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(movie.id)}
                            className="border-gray-600 hover:bg-red-900"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="series" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gerenciar Séries</h3>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Série
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {series.map((serie) => (
                  <Card key={serie.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={serie.image || "/placeholder.svg"}
                          alt={serie.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-green-600">Série</Badge>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-1">{serie.title}</h4>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <span>{serie.year}</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span>{serie.rating}</span>
                          </div>
                        </div>
                        {serie.seasons && (
                          <p className="text-xs text-gray-500 mb-3">
                            {serie.seasons} temporada{serie.seasons > 1 ? "s" : ""}
                          </p>
                        )}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(serie)}
                            className="flex-1 border-gray-600 hover:bg-gray-600"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(serie.id)}
                            className="border-gray-600 hover:bg-red-900"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle>Adicionar Novo Conteúdo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Preencha os detalhes do filme ou série que deseja adicionar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Título *</label>
                      <Input
                        value={newContent.title}
                        onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Nome do filme/série"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Tipo *</label>
                      <select
                        value={newContent.type}
                        onChange={(e) => setNewContent({ ...newContent, type: e.target.value as "movie" | "series" })}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white"
                      >
                        <option value="movie">Filme</option>
                        <option value="series">Série</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Gênero *</label>
                      <Input
                        value={newContent.genre}
                        onChange={(e) => setNewContent({ ...newContent, genre: e.target.value })}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Ex: Ação, Drama"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Ano *</label>
                      <Input
                        type="number"
                        value={newContent.year}
                        onChange={(e) => setNewContent({ ...newContent, year: Number(e.target.value) })}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Avaliação *</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={newContent.rating}
                        onChange={(e) => setNewContent({ ...newContent, rating: Number(e.target.value) })}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                  </div>

                  {newContent.type === "movie" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Duração</label>
                      <Input
                        value={newContent.duration}
                        onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Ex: 120 min"
                      />
                    </div>
                  )}

                  {newContent.type === "series" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Temporadas</label>
                      <Input
                        type="number"
                        min="1"
                        value={newContent.seasons}
                        onChange={(e) => setNewContent({ ...newContent, seasons: Number(e.target.value) })}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">URL da Imagem *</label>
                    <Input
                      value={newContent.image}
                      onChange={(e) => setNewContent({ ...newContent, image: e.target.value })}
                      className="bg-gray-600 border-gray-500 text-white"
                      placeholder="Ex: /Acao/FT.F/nome-do-filme.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">URL para Assistir *</label>
                    <Input
                      value={newContent.watchUrl}
                      onChange={(e) => setNewContent({ ...newContent, watchUrl: e.target.value })}
                      className="bg-gray-600 border-gray-500 text-white"
                      placeholder="Ex: https://drive.google.com/file/d/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Descrição *</label>
                    <Textarea
                      value={newContent.description}
                      onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                      className="bg-gray-600 border-gray-500 text-white min-h-[100px]"
                      placeholder="Descrição do filme/série"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Diretor</label>
                      <Input
                        value={newContent.director}
                        onChange={(e) => setNewContent({ ...newContent, director: e.target.value })}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Nome do diretor"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Elenco (separado por vírgulas)</label>
                      <Input
                        value={newContent.cast}
                        onChange={(e) => setNewContent({ ...newContent, cast: e.target.value })}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Ator 1, Atriz 2, Ator 3"
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddContent} className="w-full bg-red-600 hover:bg-red-700">
                    Adicionar {newContent.type === "movie" ? "Filme" : "Série"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar {editingItem?.type === "movie" ? "Filme" : "Série"}</DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Título</label>
                  <Input
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Gênero</label>
                  <Input
                    value={editingItem.genre}
                    onChange={(e) => setEditingItem({ ...editingItem, genre: e.target.value })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Ano</label>
                  <Input
                    type="number"
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: Number(e.target.value) })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Avaliação</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>

                {editingItem.type === "series" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Temporadas</label>
                    <Input
                      type="number"
                      min="1"
                      value={editingItem.seasons || 1}
                      onChange={(e) => setEditingItem({ ...editingItem, seasons: Number(e.target.value) })}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                )}

                {editingItem.type === "movie" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Duração</label>
                    <Input
                      value={editingItem.duration || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">URL da Imagem</label>
                <Input
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">URL para Assistir</label>
                <Input
                  value={editingItem.watchUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, watchUrl: e.target.value })}
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Descrição</label>
                <Textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="bg-gray-600 border-gray-500 text-white min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Diretor</label>
                  <Input
                    value={editingItem.director || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, director: e.target.value })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Elenco</label>
                  <Input
                    value={Array.isArray(editingItem.cast) ? editingItem.cast.join(", ") : editingItem.cast || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, cast: e.target.value.split(",").map((s) => s.trim()) })
                    }
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveEdit} className="flex-1 bg-red-600 hover:bg-red-700">
                  Salvar Alterações
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-gray-600 hover:bg-gray-600"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
