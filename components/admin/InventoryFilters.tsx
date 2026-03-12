'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Filter, SlidersHorizontal, PackageX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: string
  name: string
}

interface InventoryFiltersProps {
  categories: Category[]
}

export function InventoryFilters({ categories }: InventoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || ''
  const currentStock = searchParams.get('stock') || ''

  const activeFiltersCount = [currentCategory, currentStock].filter(Boolean).length

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset page quand filtre change
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('stock')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="font-medium">Filtres</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </div>

      {/* Filtre par catégorie */}
      <Select
        value={currentCategory || 'all'}
        onValueChange={(val) => updateParam('category', val)}
      >
        <SelectTrigger className="h-9 w-[160px] text-sm">
          <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les catégories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filtre par stock */}
      <Select
        value={currentStock || 'all'}
        onValueChange={(val) => updateParam('stock', val)}
      >
        <SelectTrigger className="h-9 w-[140px] text-sm">
          <PackageX className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tout le stock</SelectItem>
          <SelectItem value="out">Rupture de stock</SelectItem>
          <SelectItem value="low">Stock faible (≤5)</SelectItem>
          <SelectItem value="ok">En stock</SelectItem>
        </SelectContent>
      </Select>

      {/* Bouton reset */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-muted-foreground hover:text-foreground"
          onClick={clearFilters}
        >
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
