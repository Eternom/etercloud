# Etercloud

> Plateforme moderne d'hébergement de serveurs de jeux et services avec gestion automatisée via Pterodactyl et paiements Stripe

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-in%20development-orange.svg)]()

## 📋 À propos

Etercloud est une solution open-source d'hébergement permettant de déployer et gérer facilement des serveurs de jeux, bots Discord, instances Redis et autres services. Le système utilise Pterodactyl pour l'orchestration des conteneurs et propose un système de "boxes" prédéfinies avec des ressources allouées.

### Caractéristiques principales

- 🎮 **Hébergement multi-services** - Serveurs de jeux, bots Discord, Redis, et plus
- 📦 **Système de Boxes** - Plans prédéfinis avec ressources allouées (CPU, RAM, stockage)
- 🔄 **Intégration Pterodactyl** - Gestion automatisée des serveurs via l'API Pterodactyl
- 💳 **Paiements Stripe** - Gestion complète des abonnements et paiements
- 🔐 **Authentification moderne** - Powered by BetterAuth
- 📊 **Dashboard intuitif** - Interface utilisateur moderne et responsive

## 🚀 Stack Technique

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Base de données**: Prisma ORM
- **Authentification**: [BetterAuth](https://www.better-auth.com/)
- **Paiements**: [Stripe](https://stripe.com/)
- **Panel**: [Pterodactyl](https://pterodactyl.io/) API
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Traitement d'images**: [Sharp](https://sharp.pixelplumbing.com/)
- **Styling**: Tailwind CSS (assumé)
- **TypeScript**: Support complet

## 📦 Installation

### Prérequis

- Bun 1.0+
- PostgreSQL ou MySQL
- Instance Pterodactyl configurée
- Compte Stripe (mode test ou production)

### Setup

1. **Cloner le repository**
```bash
git clone https://github.com/Eternom/etercloud.git
cd etercloud
```

2. **Installer les dépendances**
```bash
bun install
```

3. **Configuration de l'environnement**

Copier le fichier `.env.example` vers `.env` et configurer les variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/etercloud"

# BetterAuth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Pterodactyl
PTERODACTYL_URL="https://panel.example.com"
PTERODACTYL_API_KEY="your-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Setup de la base de données**
```bash
bunx prisma generate
bunx prisma db push
# ou pour les migrations
bunx prisma migrate dev
```

5. **Lancer le serveur de développement**
```bash
bun dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🌐 Déploiement

### Déploiement recommandé avec Dokploy

[Dokploy](https://dokploy.com/) est la solution recommandée pour héberger Etercloud en production. Elle offre :

- ✅ **Gestion de cluster** simplifiée
- ✅ **CI/CD intégré** pour des déploiements automatiques
- ✅ **Interface intuitive** pour gérer vos applications
- ✅ **Support Docker** natif
- ✅ **Scaling horizontal** facile

**Setup rapide :**

1. Installer Dokploy sur votre serveur
2. Connecter votre repository GitHub (Eternom/etercloud)
3. Configurer les variables d'environnement
4. Déployer automatiquement à chaque push

Pour plus d'informations : [Documentation Dokploy](https://docs.dokploy.com/)

## 🔧 Configuration

### Pterodactyl

1. Créer une clé API depuis votre panel Pterodactyl
2. Configurer les nodes et locations disponibles
3. Ajouter les eggs (templates) pour vos services

### Stripe

1. Configurer les produits et prix dans votre dashboard Stripe
2. Créer les webhooks pour les événements de paiement
3. Mapper les produits Stripe aux boxes dans votre base de données

### Boxes

Les boxes définissent les ressources allouées pour chaque plan:

```typescript
{
  name: "Starter",
  cpu: 100,        // % CPU
  memory: 2048,    // MB
  disk: 10240,     // MB
  databases: 2,
  backups: 1
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add: Amazing Feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines

- Suivre les conventions de code existantes
- Écrire des messages de commit clairs
- Tester vos modifications
- Mettre à jour la documentation si nécessaire

## 📝 Roadmap

- [x] Setup Prisma et BetterAuth
- [ ] Interface utilisateur du dashboard
- [ ] Intégration complète Pterodactyl
- [ ] Système de boxes et allocation de ressources
- [ ] Intégration Stripe et gestion des abonnements
- [ ] Support multi-serveurs
- [ ] Panel d'administration
- [ ] Système de tickets support
- [ ] Documentation complète

## 📄 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🔗 Liens Utiles

- [Documentation Pterodactyl](https://pterodactyl.io/project/introduction.html)
- [Documentation Stripe](https://stripe.com/docs)
- [Documentation BetterAuth](https://www.better-auth.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

## 💬 Support

Pour toute question ou problème:
- Ouvrir une [issue](https://github.com/Eternom/etercloud/issues)
- Rejoindre notre [Discord](https://discord.gg/TguQCw63N3)

---

**Note**: Ce projet est en développement actif. Les fonctionnalités et l'API peuvent changer.
