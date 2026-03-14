'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { SlidersHorizontal, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const ORDER_STATUSES = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
]

export function OrderFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') || ''

  const activeFiltersCount = [currentStatus].filter(Boolean).length

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status')
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

      <Select
        value={currentStatus || 'all'}
        onValueChange={(val) => updateParam('status', val)}
      >
        <SelectTrigger className="h-9 w-[220px] text-sm">
          <CreditCard className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="Statut paiement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
