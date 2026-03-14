'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateOrderStatus } from '@/app/actions/orders'
import { useToastStore } from '@/store/toast'
import { Loader2 } from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'text-orange-600' },
  { value: 'paid', label: 'Payé / En préparation', color: 'text-blue-600' },
  { value: 'shipped', label: 'Expédié', color: 'text-indigo-600' },
  { value: 'delivered', label: 'Livré', color: 'text-green-600' },
  { value: 'cancelled', label: 'Annulé', color: 'text-red-600' },
]

export function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { showToast } = useToastStore()

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    const res = await updateOrderStatus(orderId, newStatus)
    setIsUpdating(false)
    
    if (res.success) {
      showToast('Statut mis à jour !', 'success')
    } else {
      showToast('Erreur lors de la mise à jour', 'error')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className="w-[180px] h-8 text-[11px] font-bold uppercase tracking-widest border-slate-200 bg-white">
          <SelectValue placeholder="Changer le statut" />
          {isUpdating && <Loader2 className="w-3 h-3 animate-spin ml-2" />}
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-[11px] font-bold uppercase tracking-widest">
              <span className={opt.color}>{opt.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
