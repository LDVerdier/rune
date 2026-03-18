# Task : Authentification & Persistance des personnages

## Objectif

Ajouter Supabase (auth email/password + Google OAuth) et la persistance des personnages. L'app reste utilisable sans compte — seule la sauvegarde nécessite une connexion.

Le projet Supabase n'est pas encore créé. On écrit tout le code d'abord.

## Phases

- [ ] Phase 1 : Setup & Client Supabase
- [ ] Phase 2 : Routes d'auth
- [ ] Phase 3 : Navbar globale
- [ ] Phase 4 : Types domaine, validation & réhydratation
- [ ] Phase 5 : Repository serveur
- [ ] Phase 6 : Pages & intégration
- [ ] Phase 7 : i18n

## Détail des phases

### Phase 1 : Setup & Client Supabase
- Installer `@supabase/supabase-js`, `@supabase/ssr`
- Créer `.env.example` — template `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Créer `app/services/supabase.server.ts` — `createServerClient(request)` → `{ supabase, headers }`
  - Utilise `@supabase/ssr` pour les cookies de session
  - Server-only (suffixe `.server.ts`)

### Phase 2 : Routes d'auth
- `app/routes/login.tsx` (`/login`) — Formulaire email/password + bouton Google. Toggle inscription/connexion. Loader redirige si déjà connecté.
- `app/routes/logout.tsx` (`/logout`) — Action : `signOut()` + redirect `/`
- `app/routes/auth.callback.tsx` (`/auth/callback`) — Loader : échange code OAuth → session, redirect `/my-characters`
- Modifier `app/routes.ts` — ajouter les 4 nouvelles routes

### Phase 3 : Navbar globale
- Créer `app/components/AuthNavBar.tsx` — Navbar HeroUI persistante sur toutes les pages
  - Contient : lien "RUNE" vers `/`, `LanguageSwitcher`, boutons auth
  - Non connecté : lien "Se connecter"
  - Connecté : email + lien "Mes personnages" + bouton "Déconnexion"
- Modifier `app/root.tsx` :
  - Ajouter un `loader` : `createServerClient(request)` → `supabase.auth.getUser()` → `{ user }`
  - Remplacer le `LanguageSwitcher` standalone par `AuthNavBar`
  - Passer le `user` via `useLoaderData()`
- Modifier `app/routes/character-creation.tsx` — supprimer le `LanguageSwitcher` du header

### Phase 4 : Types domaine, validation & réhydratation
- Créer `app/domain/character.ts` — types `CharacterData`, `SavedCharacter`
- Créer `app/domain/character-validation.ts` + tests
  - Ranks dans les bornes (-3 à +3)
  - Budget total respecté (60 points, incluant chars + abilities + extraHP)
  - IDs d'équipement valides
  - Weapons <= 3
  - Réutilise : `pointsSpent()` (`character-stats.ts`), `ABILITIES` (`abilities.ts`), constantes d'`equipment.ts`
- Créer `app/domain/character-rehydration.ts` + tests
  - Prend `CharacterData` → retourne `CharacterSheetData` (type du PDF)
  - Réutilise : `computeTotalHP`, `computeWoundThreshold`, `computeTotalLoad`, `computeEncumbranceDegree`, `computeEncumbranceDecrease`, `computeAllInitiatives`, `computeAllAttacks`, `computeAllDefenses`, `computeAllDamages`, `computeSoak`, `computeMove`, `computeEngagement`, `computeResponse`

### Phase 5 : Repository serveur
- Créer `app/services/character-repository.server.ts`
  - Mapping camelCase ↔ snake_case
  - `saveCharacter(supabase, userId, data)` → `SavedCharacter`
  - `listCharacters(supabase, userId)` → `SavedCharacter[]`
  - `getCharacter(supabase, userId, characterId)` → `SavedCharacter | null`
  - `deleteCharacter(supabase, userId, characterId)` → `void`

### Phase 6 : Pages & intégration
- Créer `app/routes/my-characters.tsx` (`/my-characters`)
  - Loader : auth check (redirect `/login`), `listCharacters()`
  - Action : `deleteCharacter()` avec modale de confirmation
  - UI : grille de cartes + boutons supprimer/export PDF
- Créer `app/components/CharacterCard.tsx` — Card HeroUI
- Modifier `app/routes/character-creation.tsx` :
  - Ajouter `action` pour sauvegarder (JSON via `useFetcher.submit()`)
  - Valide via `character-validation.ts`, appelle `saveCharacter()`
  - Bouton "Sauvegarder" à côté de "Export PDF" (si connecté)
  - Si non connecté : message discret "Connectez-vous pour sauvegarder"
  - Le `user` vient du root loader (`useRouteLoaderData`)
- Modifier `app/routes/home.tsx` — lien "Mes personnages" si connecté

### Phase 7 : i18n
- Modifier `app/i18n/locales/en.json` et `fr.json`
  - Clés auth : login, signup, logout, email, password, signInWithGoogle
  - Clés personnages : myCharacters, save, savedSuccessfully, confirmDelete, noCharacters
  - Clés navbar : login, myCharacters, logout

## Setup Supabase

### Création du projet en ligne (production)

1. Aller sur **supabase.com** → "Start your project" → se connecter avec GitHub
2. Cliquer **"New Project"** dans son organisation personnelle
   - Name : `rune`
   - Database Password : générer un mot de passe fort
   - Region : `eu-west-1` (France)
3. Récupérer les clés dans **Settings → API → Legacy API Keys** :
   - **Project URL** → `SUPABASE_URL`
   - **anon / public key** → `SUPABASE_ANON_KEY`

### Configurer Google OAuth

1. Dans Supabase : **Authentication → Providers → Google** → activer
2. Dans **console.cloud.google.com** :
   - Créer un projet (ou utiliser un existant)
   - **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
   - Type : Web application
   - Redirect URI : `https://<projet>.supabase.co/auth/v1/callback`
   - Copier Client ID + Client Secret dans Supabase
3. Dans Supabase : **Authentication → URL Configuration** :
   - Site URL : URL de prod (ou `http://localhost:5173` pour le dev)
   - Redirect URLs : ajouter `http://localhost:5173/auth/callback`

### Développement local avec Supabase CLI

Prérequis : **Docker Desktop** installé et lancé.

```bash
# Installer le CLI
brew install supabase/tap/supabase

# Initialiser (crée le dossier supabase/)
supabase init

# Démarrer les services locaux (PostgreSQL, Auth, Studio, etc.)
supabase start
```

`supabase start` affiche les credentials locales :
```
API URL:    http://localhost:54321
Studio URL: http://localhost:54323   ← interface admin locale
anon key:   eyJ...
service_role key: eyJ...
```

### Fichiers d'environnement

- **`.env.local`** (dev) :
  ```
  SUPABASE_URL=http://localhost:54321
  SUPABASE_ANON_KEY=<anon key de supabase start>
  ```
- **`.env.production`** (déploiement) :
  ```
  SUPABASE_URL=https://ton-projet.supabase.co
  SUPABASE_ANON_KEY=<clé du dashboard>
  ```

### Migrations

Plutôt que d'exécuter le SQL manuellement, utiliser les migrations versionnées :

```bash
supabase migration new create_characters
```

Coller le schéma SQL dans le fichier généré (`supabase/migrations/<timestamp>_create_characters.sql`). La migration s'applique automatiquement au prochain `supabase start` ou via :

```bash
supabase db reset   # recrée la DB locale et rejoue toutes les migrations
```

### Commandes utiles

| Commande | Description |
|----------|-------------|
| `supabase start` | Démarre les services locaux |
| `supabase stop` | Arrête les services |
| `supabase db reset` | Recrée la DB + rejoue les migrations |
| `supabase migration new <nom>` | Crée une nouvelle migration |
| `supabase status` | Affiche les URLs et clés locales |
| Studio local : `http://localhost:54323` | Interface admin (tables, SQL, users) |

## Schema SQL (à exécuter dans Supabase après création du projet)

```sql
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hero_name TEXT NOT NULL DEFAULT '',
  cognomen TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')) DEFAULT 'male',
  characteristic_ranks JSONB NOT NULL DEFAULT '{}',
  ability_ranks JSONB NOT NULL DEFAULT '{}',
  extra_hp_points INTEGER NOT NULL DEFAULT 0,
  selected_weapons JSONB NOT NULL DEFAULT '[]',
  selected_shield TEXT,
  selected_armor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_characters_user_id ON public.characters(user_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_character_updated
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON public.characters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON public.characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON public.characters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own" ON public.characters FOR DELETE USING (auth.uid() = user_id);
```

## Inventaire des fichiers

**Nouveaux (14) :**

| Fichier | Couche |
|---------|--------|
| `.env.example` | Config |
| `app/services/supabase.server.ts` | Service |
| `app/services/character-repository.server.ts` | Service |
| `app/domain/character.ts` | Domaine |
| `app/domain/character-validation.ts` | Domaine |
| `app/domain/character-validation.test.ts` | Test |
| `app/domain/character-rehydration.ts` | Domaine |
| `app/domain/character-rehydration.test.ts` | Test |
| `app/routes/login.tsx` | Route |
| `app/routes/logout.tsx` | Route |
| `app/routes/auth.callback.tsx` | Route |
| `app/routes/my-characters.tsx` | Route |
| `app/components/AuthNavBar.tsx` | Composant |
| `app/components/CharacterCard.tsx` | Composant |

**Modifiés (6) :**

| Fichier | Changements |
|---------|-------------|
| `package.json` | +`@supabase/supabase-js`, `@supabase/ssr` |
| `app/routes.ts` | +4 routes |
| `app/root.tsx` | Loader auth, AuthNavBar remplace LanguageSwitcher |
| `app/routes/character-creation.tsx` | Action save, bouton sauvegarder, retrait LanguageSwitcher |
| `app/routes/home.tsx` | Lien "Mes personnages" si connecté |
| `app/i18n/locales/{en,fr}.json` | Clés auth + personnages |

## Décisions

| Décision | Raison | Date |
|----------|--------|------|
| Supabase comme BaaS | Free tier, auth + PostgreSQL + RLS intégrés | 2026-03-18 |
| Auth server-side avec cookies | Approche correcte pour React Router v7 (loaders/actions) | 2026-03-18 |
| JSONB pour les ranks | Pragmatique, évite 52+ colonnes, flexible pour évolutions | 2026-03-18 |
| Navbar persistante sur toutes les pages | Intègre LanguageSwitcher + auth, cohérent | 2026-03-18 |
| Google OAuth dès le MVP | Demande explicite de l'utilisateur | 2026-03-18 |
| Email/password + signup toggle | Page unique login/signup pour simplifier | 2026-03-18 |
| `useFetcher.submit()` pour la sauvegarde | State dans useState, pas dans des champs de formulaire | 2026-03-18 |

## Erreurs rencontrées

| Erreur | Tentative | Résolution |
|--------|-----------|------------|
| (aucune pour l'instant) | | |

## Vérification

1. `npm run test` — validation et réhydratation
2. `npm run typecheck`
3. `npm run lint`
4. Test manuel :
   - Créer un compte → redirect `/my-characters`
   - Google OAuth → callback + redirect
   - Créer un personnage → sauvegarder → vérifier dans `/my-characters`
   - Export PDF depuis `/my-characters`
   - Supprimer un personnage
   - Déconnexion → `/my-characters` redirige vers `/login`
   - Création sans compte fonctionne toujours (pas de régression)
