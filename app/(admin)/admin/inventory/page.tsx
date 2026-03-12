import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InventorySearch } from '@/components/admin/InventorySearch'
import { CategoryManager } from '@/components/admin/CategoryManager'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { InventoryFilters } from '@/components/admin/InventoryFilters'
import { Suspense } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SafeImage } from '@/components/shop/SafeImage'

export const metadata = {
  title: 'Inventaire - Administration',
}

export default async function InventoryPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const search = searchParams?.search as string | undefined
  const categoryFilter = searchParams?.category as string | undefined
  const stockFilter = searchParams?.stock as string | undefined

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner (id, name),
      product_variants (stock_quantity)
    `)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (categoryFilter) {
    query = query.eq('category_id', categoryFilter)
  }

  const { data: products } = await query

  // Calcul du stock total par produit + filtre stock côté app
  let productsWithStock = products?.map(product => {
    const totalStock = (product.product_variants as { stock_quantity: number }[]).reduce(
      (acc: number, variant) => acc + variant.stock_quantity,
      0
    )
    return { ...product, totalStock }
  })

  // Filtre par stock
  if (stockFilter === 'out') {
    productsWithStock = productsWithStock?.filter(p => p.totalStock === 0)
  } else if (stockFilter === 'low') {
    productsWithStock = productsWithStock?.filter(p => p.totalStock > 0 && p.totalStock <= 5)
  } else if (stockFilter === 'ok') {
    productsWithStock = productsWithStock?.filter(p => p.totalStock > 5)
  }

  // Récupération de toutes les catégories
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="p-8 space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventaire</h1>
          <p className="text-muted-foreground mt-1">
            {productsWithStock?.length ?? 0} produit{(productsWithStock?.length ?? 0) > 1 ? 's' : ''} affiché{(productsWithStock?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <CategoryManager initialCategories={allCategories || []} />
          <Link href="/admin/inventory/new" className="w-full sm:w-auto">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Produit
            </Button>
          </Link>
        </div>
      </div>

      {/* Barre de recherche + Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border shadow-sm">
        <Suspense fallback={<div className="h-9 w-full max-w-sm bg-muted animate-pulse rounded-md" />}>
          <InventorySearch />
        </Suspense>
        <div className="flex-1 flex justify-start sm:justify-end">
          <Suspense fallback={<div className="h-9 w-56 bg-muted animate-pulse rounded-md" />}>
            <InventoryFilters categories={allCategories || []} />
          </Suspense>
        </div>
      </div>

      {/* Tableau de l'inventaire */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsWithStock?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="text-4xl">📦</span>
                    <p className="font-medium">Aucun produit trouvé</p>
                    <p className="text-sm">Essayez de modifier vos filtres ou d&apos;ajouter un produit.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              productsWithStock?.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell>
                    <div className="relative w-12 h-16 bg-muted rounded overflow-hidden">
                      <SafeImage
                        src={product.main_image || '/placeholder-shoes.jpg'}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {(product.categories as { name: string })?.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {product.price.toLocaleString('fr-FR')} CFA
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Badge
                        variant={product.totalStock === 0 ? 'destructive' : product.totalStock <= 5 ? 'outline' : 'secondary'}
                        className={product.totalStock > 0 && product.totalStock <= 5 ? 'text-orange-500 border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20' : ''}
                      >
                        {product.totalStock === 0 ? 'Rupture' : `${product.totalStock} unités`}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/inventory/${product.id}/edit`}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
