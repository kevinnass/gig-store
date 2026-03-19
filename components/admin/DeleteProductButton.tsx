'use client'

import { useState, useTransition } from 'react'
import { Trash, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProduct } from '@/app/actions/products'
import { useToastStore } from '@/store/toast'

export function DeleteProductButton({ id, name }: { id: string, name: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToastStore()

  async function handleDelete() {
    startTransition(async () => {
      const res = await deleteProduct(id)
      if (res?.error) {
        showToast(res.error, 'error')
      } else {
        showToast('Produit supprimé', 'success')
      }
      setIsOpen(false)
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-red-500"
        onClick={() => setIsOpen(true)}
      >
        <Trash className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => !isPending && setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative z-10 bg-background border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 whitespace-normal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title + Icon */}
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0 text-left">
                <h2 className="text-base font-semibold">Supprimer le produit</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Vous êtes sur le point de supprimer{' '}
                  <span className="font-medium text-foreground">&quot;{name}&quot;</span>.
                  Cette action est irréversible.
                </p>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? 'Suppression...' : 'Oui, supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
