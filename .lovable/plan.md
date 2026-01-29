

# Correction : Permettre le Setup Initial Sans Authentification

## Problème Identifié

Les edge functions `save-resend-key` et `save-lovable-key` exigent maintenant une authentification JWT, mais pendant le setup initial, aucun compte utilisateur n'existe encore. C'est un blocage complet du flux de configuration.

## Solution Proposée

Modifier les edge functions pour permettre l'accès **uniquement pendant le setup initial** :

1. Vérifier si `setup_complete` est `true` dans `site_config`
2. Si **non configuré** (setup en cours) → autoriser sans authentification  
3. Si **déjà configuré** (setup terminé) → exiger une authentification JWT

Cette approche maintient la sécurité après le setup tout en permettant la configuration initiale.

---

## Modifications Prévues

### 1. Edge Function `save-resend-key`

Ajouter une vérification au début :
- Requête à `site_config` pour vérifier si `setup_complete = true`
- Si oui → exiger JWT comme actuellement
- Si non → permettre l'appel (première configuration)

### 2. Edge Function `save-lovable-key`

Même logique que `save-resend-key`.

---

## Détails Techniques

```text
┌─────────────────────────────────────────────────────────┐
│                    Requête API                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Vérifier setup_complete dans site_config               │
└─────────────────────────────────────────────────────────┘
                          │
           ┌──────────────┴──────────────┐
           │                             │
    setup_complete                setup_complete
      = false                        = true
    (ou absent)                   (déjà configuré)
           │                             │
           ▼                             ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│ Autoriser sans JWT   │    │ Exiger authentification JWT  │
│ (première config)    │    │ (refuser si non authentifié) │
└──────────────────────┘    └──────────────────────────────┘
           │                             │
           ▼                             ▼
┌─────────────────────────────────────────────────────────┐
│           Vérifier si clé déjà existante                │
│           (bloquer si déjà configurée)                  │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│              Sauvegarder la clé encryptée               │
└─────────────────────────────────────────────────────────┘
```

### Code à modifier dans les deux edge functions

```typescript
// Vérifier si setup est déjà terminé
const { data: setupData } = await supabase
  .from("site_config")
  .select("value")
  .eq("key", "setup_complete")
  .single();

const isSetupComplete = setupData?.value === "true";

// Si setup terminé, exiger authentification
if (isSetupComplete) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: corsHeaders }
    );
  }
  // ... valider le JWT
}

// Sinon, autoriser (première configuration)
```

---

## Sécurité Maintenue

| Situation | Comportement |
|-----------|--------------|
| Setup initial (première fois) | Autorisé sans auth |
| Setup terminé, sans auth | Refusé (401) |
| Setup terminé, avec auth | Autorisé mais vérifie si clé déjà existe |
| Clé déjà configurée | Refusé (403) - aucune modification possible |

La protection contre la modification des clés existantes (`encrypted_secret_exists`) reste en place, garantissant qu'une fois configurée, une clé ne peut pas être remplacée.

---

## Fichiers à Modifier

- `supabase/functions/save-resend-key/index.ts`
- `supabase/functions/save-lovable-key/index.ts`

