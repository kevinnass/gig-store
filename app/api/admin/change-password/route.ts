import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Le nouveau mot de passe doit faire au moins 6 caractères.' }, { status: 400 })
    }

    if (newPassword === currentPassword) {
      return NextResponse.json({ error: 'Le nouveau mot de passe doit être différent de l\'ancien.' }, { status: 400 })
    }

    // 1. Get current user from session
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user?.email) {
      return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 })
    }

    // 2. Verify current password by attempting sign-in with a separate admin client
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify old password by trying to sign in
    const { error: verifyError } = await adminClient.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (verifyError) {
      return NextResponse.json({ error: 'Le mot de passe actuel est incorrect.' }, { status: 400 })
    }

    // 3. Update password using admin client (with service role if available)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
        password: newPassword,
      })
      if (updateError) {
        return NextResponse.json({ error: 'Erreur lors de la mise à jour : ' + updateError.message }, { status: 500 })
      }
    } else {
      // Fallback: update via user session
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) {
        return NextResponse.json({ error: 'Erreur lors de la mise à jour : ' + updateError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: 'Mot de passe modifié avec succès.' })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Erreur serveur inattendue.' }, { status: 500 })
  }
}
