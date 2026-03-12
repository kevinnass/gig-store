'use client'

import { useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToastStore } from '@/store/toast'
import { createProduct, updateProduct } from '@/app/actions/products'
import { createClient } from '@/lib/supabase/client'
import { ImageInput } from '@/components/admin/ImageInput'
import Link from 'next/link'

// Schéma de validation
const variantSchema = z.object({
  id: z.string().optional(), // ID de la variante si elle existe déjà
  size: z.string().min(1, 'La taille est requise (ex: M, 42, Unique)'),
  color: z.string().min(1, 'La couleur/variante est requise'),
  stock_quantity: z.coerce.number().min(0, 'Le stock ne peut pas être négatif')
})

const productSchema = z.object({
  name: z.string().min(3, 'Le nom doit faire au moins 3 caractères'),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(1, 'Le prix doit être supérieur à 0'),
  category_id: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  is_featured: z.boolean().default(false),
  main_image: z.string().url('URL invalide').optional().nullable().or(z.literal('')),
  variants: z.array(variantSchema).min(1, 'Au moins une variante (stock) est requise'),
})

type ProductFormValues = z.infer<typeof productSchema>
type Category = { id: string, name: string }

interface ProductFormProps {
  categories: Category[]
  productId?: string
  initialData?: Partial<ProductFormValues>
}

export function ProductForm({ categories, productId, initialData }: ProductFormProps) {
  const router = useRouter()
  const { showToast } = useToastStore()
  const [isPending, startTransition] = useTransition()
  const selectedFileRef = useRef<File | null>(null)

  const isEditing = !!productId

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<ProductFormValues, any, ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      category_id: initialData?.category_id || '',
      is_featured: initialData?.is_featured || false,
      main_image: initialData?.main_image || '',
      variants: initialData?.variants || [{ size: '', color: '', stock_quantity: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: 'variants',
    control: form.control,
  })

  async function onSubmit(data: ProductFormValues) {
    startTransition(async () => {
      let imageUrl: string | null = data.main_image ?? null

      // Upload du fichier si l'utilisateur en a sélectionné un
      if (selectedFileRef.current && data.main_image?.startsWith('FILE:')) {
        const file = selectedFileRef.current
        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const filePath = `products/${Date.now()}.${fileExt}`

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
        imageUrl = urlData.publicUrl
      } else if (!data.main_image || data.main_image === '') {
        imageUrl = null
      }

      const payload = { ...data, main_image: imageUrl }

      let res
      if (isEditing && productId) {
        res = await updateProduct(productId, payload)
      } else {
        res = await createProduct(payload)
      }

      if (res?.error) {
        showToast(res.error, 'error')
      } else {
        showToast(isEditing ? 'Produit mis à jour' : 'Produit créé avec succès', 'success')
        router.push('/admin/inventory')
        router.refresh()
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/inventory"
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Modifiez les informations et le stock de votre produit.' : 'Créez un nouveau produit et ses variantes de stock.'}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  {...form.register('name')} 
                  placeholder="Ex: T-shirt Essential"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Prix unitaire (CFA) <span className="text-red-500">*</span></Label>
                <Input 
                  id="price" 
                  type="number"
                  {...form.register('price')} 
                  placeholder="0"
                />
                 {form.formState.errors.price && (
                  <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Markdown supporté)</Label>
              <Textarea 
                id="description" 
                {...form.register('description')} 
                rows={4}
                placeholder="Décrivez votre produit en détail..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Catégorie & Média */}
        <Card>
          <CardHeader>
            <CardTitle>Catégorie & Médias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Catégorie <span className="text-red-500">*</span></Label>
                <Select
                  onValueChange={(val) => form.setValue('category_id', val)}
                  value={form.watch('category_id')}
                >
                  <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                        <SelectItem value="none" disabled>Aucune catégorie disponible</SelectItem>
                    ) : (
                        categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                 {form.formState.errors.category_id && (
                  <p className="text-sm text-red-500">{form.formState.errors.category_id.message}</p>
                )}
            </div>

            <div className="space-y-2">
              <Label>Image principale <span className="text-xs text-muted-foreground font-normal">(optionnel)</span></Label>
              <ImageInput
                value={form.watch('main_image') ?? ''}
                onChange={(url) => form.setValue('main_image', url)}
                onFileSelect={(file) => { selectedFileRef.current = file }}
              />
              {form.formState.errors.main_image && (
                <p className="text-sm text-red-500">{form.formState.errors.main_image.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <Label>Mettre en avant (Featured)</Label>
                <p className="text-sm text-muted-foreground">
                  Affiche ce produit sur la page d&apos;accueil avec un badge &quot;Nouveau&quot;.
                </p>
              </div>
              <Switch
                checked={form.watch('is_featured')}
                onCheckedChange={(checked) => form.setValue('is_featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Variantes & Stock (Champs dynamiques) */}
        <Card>
          <CardHeader>
            <CardTitle>Variantes et Stocks <span className="text-red-500">*</span></CardTitle>
            <CardDescription>
                Définissez les différentes tailles/couleurs existantes pour ce produit ainsi que la quantité disponible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row items-end gap-4 p-4 border rounded-lg bg-muted/10 relative">
                <div className="w-full space-y-2">
                  <Label>Taille</Label>
                  <Input 
                    placeholder="S, M, L, ou Unique"
                    {...form.register(`variants.${index}.size`)} 
                  />
                  {form.formState.errors.variants?.[index]?.size && (
                    <p className="text-xs text-red-500">{form.formState.errors.variants[index].size?.message}</p>
                  )}
                </div>
                
                <div className="w-full space-y-2">
                  <Label>Couleur / Variante</Label>
                  <Input 
                    placeholder="Rouge, Cuir Noir, etc."
                    {...form.register(`variants.${index}.color`)} 
                  />
                  {form.formState.errors.variants?.[index]?.color && (
                    <p className="text-xs text-red-500">{form.formState.errors.variants[index].color?.message}</p>
                  )}
                </div>

                <div className="w-full sm:w-32 space-y-2">
                  <Label>Quantité</Label>
                  <Input 
                    type="number"
                    min="0"
                    {...form.register(`variants.${index}.stock_quantity`)} 
                  />
                  {form.formState.errors.variants?.[index]?.stock_quantity && (
                    <p className="text-xs text-red-500">{form.formState.errors.variants[index].stock_quantity?.message}</p>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-red-500 absolute top-2 right-2 sm:relative sm:top-0 sm:right-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-dashed"
              onClick={() => append({ size: '', color: '', stock_quantity: 0 })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une variante
            </Button>
            {form.formState.errors.variants?.message && (
                <p className="text-sm text-red-500 font-medium">{form.formState.errors.variants.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Actions Submit */}
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/inventory')} disabled={isPending}>
                Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
                 {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sauvegarder le produit
            </Button>
        </div>

      </form>
    </div>
  )
}
