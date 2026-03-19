'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToastStore } from '@/store/toast'
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react'

export default function SettingsPage() {
  const { showToast } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (form.newPassword.length < 6) {
      showToast('Le nouveau mot de passe doit faire au moins 6 caractères.', 'error')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'error')
      return
    }

    if (form.newPassword === form.currentPassword) {
      showToast('Le nouveau mot de passe doit être différent de l\'ancien.', 'error')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        showToast('Mot de passe modifié avec succès !', 'success')
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        showToast(data.error || 'Une erreur est survenue.', 'error')
      }
    } catch {
      showToast('Une erreur inattendue est survenue.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Paramètres</h1>
        <p className="text-muted-foreground mt-2">Gérez la configuration de votre espace d&apos;administration.</p>
      </div>

      {/* Password Change */}
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Modifier le mot de passe</CardTitle>
              <CardDescription>Changez votre mot de passe d&apos;accès à l&apos;administration.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? 'text' : 'password'}
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
              {form.newPassword && form.currentPassword && form.newPassword === form.currentPassword && (
                <p className="text-xs text-red-500">Le nouveau mot de passe doit être différent de l&apos;ancien.</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <p className="text-xs text-red-500">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enregistrer le nouveau mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
