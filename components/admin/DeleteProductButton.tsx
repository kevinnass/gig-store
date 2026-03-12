'use client'

import { useTransition } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProduct } from '@/app/actions/products'
import { useToastStore } from '@/store/toast'

export function DeleteProductButton({ id, name }: { id: string, name: string }) {
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToastStore()

  async function handleDelete() {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) return

    startTransition(async () => {
      const res = await deleteProduct(id)
      if (res?.error) {
        showToast(res.error, 'error')
      } else {
        showToast('Produit supprimé', 'success')
      }
    })
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-muted-foreground hover:text-red-500"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash className="w-4 h-4" />
    </Button>
  )
}
