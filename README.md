# CognIAlysis

Application de matching entre utilisateurs et profils IA basée sur la personnalité.

## Concept
- Profil utilisateur via horoscope (signe astrologique, élément, modalité)
- Scoring Big Five (OCEAN) pondéré par signe
- Matching avec des profils IA (modèle, MBTI, Big Five)

## Stack
- Next.js 16 + TypeScript + Tailwind CSS
- Neon PostgreSQL
- Vercel

## Structure BDD
Voir `data/schema.sql` :
- `ia_profiles` — profils des IA (Big Five, MBTI, horoscope)
- `user_horoscopes` — profil astrologique utilisateur
- `matches` — scores de compatibilité utilisateur ↔ IA
- `big_five_weights` — pondération Big Five par signe astrologique

## Démarrage local
```bash
cp .env.example .env.local
npm install
npm run dev
```
