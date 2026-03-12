'use client'

import { useState, useTransition, useRef } from 'react'
import { Plus, Trash2, Loader2, Tags, Edit2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { addCategory, deleteCategory, updateCategory } from '@/app/actions/categories'
import { useToastStore } from '@/store/toast'
import { ImageInput } from '@/components/admin/ImageInput'
import { createClient } from '@/lib/supabase/client'

type Category = {
  id: string
  name: string
  slug: string
  image_url?: string | null
  created_at: string
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const { showToast } = useToastStore()

  // États pour la création/édition
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const selectedFileRef = useRef<File | null>(null)

  const resetForm = () => {
    setEditingCategory(null)
    setName('')
    setImageUrl('')
    selectedFileRef.current = null
  }

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat)
    setName(cat.name)
    setImageUrl(cat.image_url || '')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    
    startTransition(async () => {
      let finalImageUrl = imageUrl

      // Gestion de l'upload d'image si nécessaire
      if (selectedFileRef.current && imageUrl.startsWith('FILE:')) {
        const file = selectedFileRef.current
        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const filePath = `categories/${Date.now()}.${fileExt}`

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true })

        if (uploadError) {
          showToast('Erreur upload image: ' + uploadError.message, 'error')
          return
        }

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path)
        finalImageUrl = urlData.publicUrl
      }

      let res
      if (editingCategory) {
        res = await updateCategory(editingCategory.id, name, finalImageUrl)
      } else {
        res = await addCategory(name, finalImageUrl)
      }

      if (res?.error) {
        showToast(res.error, 'error')
      } else {
        showToast(editingCategory ? 'Catégorie mise à jour !' : 'Catégorie ajoutée !', 'success')
        resetForm()
      }
    })
  }

  const openDeleteConfirm = (id: string) => {
    setDeleteTargetId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return

    startTransition(async () => {
      const res = await deleteCategory(deleteTargetId)
      if (res?.error) {
        showToast(res.error, 'error')
      } else {
        showToast('Catégorie supprimée.', 'success')
      }
      setIsDeleteDialogOpen(false)
      setDeleteTargetId(null)
    })
  }

  return (
    <>
      <Button
        onClick={() => {
          resetForm()
          setIsOpen(true)
        }}
        className="gap-2"
      >
        <Tags className="w-4 h-4" />
        Gérer les catégories
      </Button>

      {/* Main Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tags className="w-6 h-6" />
              Catégories de produits
            </DialogTitle>
            <DialogDescription>
              Gérez vos catégories pour mieux organiser votre inventaire et la homepage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Form Section */}
            <div className="border rounded-lg p-5 bg-muted/30">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                {editingCategory ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Modifier la catégorie
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Nouvelle catégorie
                  </>
                )}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Nom de la catégorie</Label>
                  <Input
                    id="cat-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: T-shirts (Femme)"
                    required
                    disabled={isPending}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image de la catégorie</Label>
                  <ImageInput
                    value={imageUrl}
                    onChange={setImageUrl}
                    onFileSelect={(file) => { selectedFileRef.current = file }}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isPending || !name}
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {editingCategory ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                  {editingCategory && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isPending}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Categories Grid */}
            <div>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded text-primary text-xs font-bold">
                  {initialCategories.length}
                </span>
                Catégories existantes
              </h3>

              {initialCategories.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">Aucune catégorie créée pour le moment.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {initialCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card"
                    >
                      {cat.image_url ? (
                        <div
                          className="w-full h-32 bg-muted bg-cover bg-center"
                          style={{ backgroundImage: `url('${cat.image_url}')` }}
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted flex items-center justify-center">
                          <Tags className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-base mb-1">{cat.name}</h4>
                        <p className="text-xs text-muted-foreground font-mono mb-4">/{cat.slug}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEdit(cat)}
                            disabled={isPending}
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openDeleteConfirm(cat.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <DialogTitle>Supprimer cette catégorie?</DialogTitle>
              </div>
            </div>
            <DialogDescription className="mt-4">
              Cette action est irréversible. La catégorie sera supprimée définitivement.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
