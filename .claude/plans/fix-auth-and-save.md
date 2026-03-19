# Task: Corriger l'auth OAuth en production et le doublon de personnages à chaque sauvegarde

## Context

L'implémentation auth-persistence est en place mais deux problèmes distincts :

**Problème 1 — OAuth redirige vers localhost en production** :
Dans [login.tsx:23](app/routes/login.tsx#L23), le `redirectTo` utilise `new URL(request.url).origin`. Derrière le reverse proxy Render, ça résout en `http://localhost:PORT`. L'OAuth Google se termine mais redirige l'utilisateur vers localhost. Conséquence secondaire : le compte a été partiellement créé en base Supabase, bloquant ensuite la création via email+mdp avec le même email.

**Problème 2 — Chaque clic "Sauvegarder" crée un nouveau personnage** :
Dans [character-repository.server.ts:73-77](app/services/character-repository.server.ts#L73-L77), `saveCharacter()` utilise toujours `.insert()`. Aucun ID n'est tracké côté client après la première sauvegarde. Chaque clic crée une nouvelle entrée.

**Code existant réutilisable** :
- Le type `SavedCharacter` dans [character.ts](app/domain/character.ts) a déjà un champ `id: string`
- La table `characters` a des RLS policies pour INSERT et UPDATE → l'upsert est déjà supporté côté DB
- Le trigger `handle_updated_at()` met à jour `updated_at` automatiquement
- `validateCharacter()` dans [character-validation.ts](app/domain/character-validation.ts) accepte `CharacterData`, compatible avec un type étendu

## Phases
- [x] Phase 1: Fix OAuth redirect
- [x] Phase 2: Upsert au lieu d'insert pour la sauvegarde
- [x] Phase 3: Configuration externe (dashboards)

## Phase Details

### Phase 1: Fix OAuth redirect

- Step 1.1: Dans [login.tsx](app/routes/login.tsx) ligne 23, remplacer `new URL(request.url).origin` par `process.env.SITE_URL || new URL(request.url).origin`
- Step 1.2: Dans [.env.example](.env.example), ajouter `SITE_URL=` avec un commentaire explicatif (pas de trailing slash)
- **Verify**: `npm run typecheck` passe. En local sans `SITE_URL`, le fallback fonctionne toujours.

### Phase 2: Upsert au lieu d'insert pour la sauvegarde

- Step 2.1: Dans [character-repository.server.ts](app/services/character-repository.server.ts), modifier `saveCharacter()` :
  - Ajouter paramètre `id?: string` à la signature : `saveCharacter(supabase, userId, data, id?)`
  - Construire le payload conditionnellement : `id ? { ...row, id } : row`
  - Remplacer `.insert()` par `.upsert(payload, { onConflict: 'id' })`
- Step 2.2: Dans [character-creation.tsx](app/routes/character-creation.tsx) action (lignes 41-53) :
  - Parser le body comme `CharacterData & { id?: string }`
  - Extraire `id` du body : `const { id, ...characterData } = body`
  - Passer `id` à `saveCharacter(supabase, user.id, characterData, id)`
  - Retourner `{ success: true, id: saved.id }` au lieu de `{ success: true }`
- Step 2.3: Dans [character-creation.tsx](app/routes/character-creation.tsx) composant :
  - Mettre à jour le type cast du fetcher (ligne 65) : `{ success?: boolean; error?: string; id?: string }`
  - Dériver l'id sauvegardé : `const savedCharacterId = saveResult?.id ?? null`
  - Modifier `handleSave` : soumettre `{ ...characterData, ...(savedCharacterId && { id: savedCharacterId }) }`
  - Dans le `onConfirm` du reset (ligne 283-286) : appeler `saveFetcher.load("")` ou reset le fetcher pour remettre `savedCharacterId` à null
- Step 2.4: Dans [MobileSummaryBar.tsx](app/components/MobileSummaryBar.tsx), ajouter le bouton save :
  - Ajouter props : `onSaveClick?: () => void`, `isSaving?: boolean`, `isLoggedIn?: boolean`
  - Ajouter le bouton save dans le `div.flex.gap-2` (même style que export), conditionné par `isLoggedIn`
  - Dans [character-creation.tsx](app/routes/character-creation.tsx), passer ces props au composant `MobileSummaryBar`
- **Verify**: `npm run typecheck` + `npm run test`. Test manuel : sauvegarder 2x → vérifier en DB qu'il n'y a qu'une seule entrée. Reset → sauvegarder → vérifier que c'est une nouvelle entrée.

### Phase 3: Configuration externe (dashboards — hors code)

> **Note** : ces étapes doivent être faites **après** le déploiement du code des Phases 1-2.

Ces étapes sont à faire manuellement dans les dashboards, pas dans le code :

- Step 3.1: **Render Dashboard** — ajouter env var `SITE_URL` = `https://<domaine-production>` (sans trailing slash)
- Step 3.2: **Supabase Dashboard** (Authentication > URL Configuration) :
  - Site URL = `https://<domaine-production>`
  - Redirect URLs : ajouter `https://<domaine-production>/auth/callback`
- Step 3.3: **Supabase Dashboard** — supprimer le compte fantôme créé par l'OAuth échoué (pour débloquer l'email)
- Step 3.4: **Google Cloud Console** — ajouter `https://<ref-projet>.supabase.co/auth/v1/callback` comme Authorized redirect URI
- **Verify**: Test en production : OAuth Google redirige vers le bon domaine. Signup email+mdp puis signin fonctionne.

## File Inventory

**New files:** aucun

**Modified files:**
| File | Changes |
|------|---------|
| `app/routes/login.tsx` | Utiliser `SITE_URL` env var pour le redirect OAuth |
| `app/services/character-repository.server.ts` | `saveCharacter()` → upsert avec id optionnel, `onConflict: 'id'` |
| `app/routes/character-creation.tsx` | Action parse+passe l'id, retourne l'id; composant dérive l'id du fetcher |
| `app/components/MobileSummaryBar.tsx` | Ajouter bouton save |
| `.env.example` | Ajouter `SITE_URL` |

## Decisions
| Decision | Rationale |
|----------|-----------|
| `SITE_URL` env var plutôt que lecture des headers `X-Forwarded-*` | Plus simple, plus fiable, pas de dépendance au comportement du proxy |
| `.upsert()` plutôt que insert/update séparés | Un seul code path, Supabase gère la logique via la PK. Les RLS couvrent déjà les deux cas |
| `savedCharacterId` dérivé du fetcher, pas de `useState` | Plus simple : `saveResult?.id ?? null`. Le reset du fetcher suffit pour remettre à null |
| Pas de nouveau type domain (`SaveCharacterPayload`) | L'id est un paramètre de transport, pas une donnée métier. Le passer séparément à `saveCharacter()` garde `CharacterData` propre |
| Reset remet l'ID à null | Après un reset, sauvegarder doit créer un nouveau personnage, pas écraser l'ancien |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (none yet) | | |

## Final Verification
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. Test local : sauvegarder un personnage 2 fois → 1 seule entrée en DB
5. Test local : reset → sauvegarder → nouvelle entrée en DB
6. Test production (après phase 3) : OAuth + email signup fonctionnent
