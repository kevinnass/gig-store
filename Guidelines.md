Guidelines Projet : Gig-store (Sprint 7 Jours)
1. Vision & Objectif
Projet : Gig-store (E-commerce Maroquinerie & Mode Premium).

Cible : Mobile-first, design épuré, expérience utilisateur fluide.

Objectif MVP (7 jours) : Un site fonctionnel où l'on peut parcourir le catalogue, ajouter au panier, payer via Stripe/Kkiapay, et un dashboard admin pour gérer le stock.

2. Stack Technique (Fixe)
Framework : Next.js 15 (App Router).

Base de données & Auth : Supabase (PostgreSQL).

Styling : Tailwind CSS + Shadcn/UI (Composants : Button, Card, Dialog, Table, Input, Badge).

State Management : Zustand (Panier avec persistance locale).

Paiements : Stripe Checkout (Dynamique) + SDK Kkiapay/FedaPay.

Emails : Resend (Emails transactionnels).

3. Architecture des Routes (Next.js)
Utiliser les Route Groups pour séparer les layouts :

Plaintext
app/
├── (shop)/               # Layout Boutique (Header/Footer/Banner)
│   ├── page.tsx          # Accueil (Hero, Catégories, Best Sellers, Avis)
│   ├── shop/             # Catalogue (Grille, Filtres, Recherche)
│   ├── category/[slug]/  # Pages Sacs, Chaussures, Habits, Accessoires
│   ├── product/[id]/     # Fiche produit (Galerie, Variantes, Zoom)
│   ├── cart/             # Page Panier
│   └── checkout/         # Formulaire livraison & choix paiement
└── (admin)/              # Layout Admin (Sidebar, Protection Middleware)
    └── admin/
        ├── page.tsx      # Dashboard (Résumé ventes)
        ├── inventory/    # Gestion CRUD Produits & Stocks
        └── orders/       # Liste et suivi des commandes
4. Schéma de Données Supabase (Priorité Haute)
L'IA doit se référer à cette structure pour toutes les requêtes :

categories : id, name, slug, image_url.

products : id, name, description, price, category_id, main_image, is_featured (boolean).

product_variants : id, product_id, size, color, stock_quantity, sku.

orders : id, customer_email, total_amount, status (pending, paid, shipped), shipping_address (JSONB).

order_items : id, order_id, variant_id, quantity, price_at_purchase.

5. Roadmap "Sprint" (7 Jours pour le test)
Jour 1 : Setup complet (Next, Supabase, Tailwind) + Création des tables SQL.

Jour 2 : Page d'accueil (Hero, Sections visuelles) + Layout Boutique.

Jour 3 : Catalogue dynamique, Filtres (Prix/Taille/Couleur) et Recherche.

Jour 4 : Fiche Produit (Variantes) + Logique du Panier (Zustand).

Jour 5 : Tunnel de commande + Intégration Stripe/Kkiapay (Webhooks).

Jour 6 : Dashboard Admin (Affichage commandes + Gestion Inventaire simple).

Jour 7 : Emails (Resend), Responsive mobile & Déploiement Vercel.

6. Instructions de Code pour l'IA
Style : Design "Premium" (Espaces aérés, typographie propre, animations légères avec Framer Motion si besoin).

Performance : Utiliser next/image pour toutes les photos produits.

Data : Utiliser les Server Components pour le fetching de données.

Paiement : Ne pas créer de produits dans l'interface Stripe. Envoyer les line_items dynamiquement lors de la création de la session.

Sécurité : Les routes /admin doivent être protégées par un middleware.ts vérifiant l'auth Supabase.

7. Pages Spécifiques (Cahier des charges)
Accueil : Doit inclure : Bandeau réassurance, Section Avis, Galerie type Instagram.

Fiche Produit : Doit inclure : Section livraison/retours, Produits recommandés.

Checkout : Doit permettre l'achat en mode "invité" (sans compte obligatoire).