# AutoCall AI — V8 technique Vercel + Twilio

## Objectif
Cette version permet de tester un vrai appel entrant Twilio vers Vercel.

Quand quelqu'un appelle le numéro Twilio, AutoCall répond vocalement :
1. demande la raison de l'appel ;
2. demande la plaque ;
3. demande les disponibilités ;
4. termine l'appel proprement.

Les réponses sont visibles dans les logs Vercel pour ce premier test.

## Déploiement Vercel
1. Dézipper le dossier.
2. Envoyer le projet sur GitHub, ou importer le dossier dans Vercel.
3. Déployer.
4. Vérifier que cette URL fonctionne :
   `https://TON-PROJET.vercel.app/api/status`

## Configuration Twilio
Dans Twilio > Phone Numbers > Active Numbers > ton numéro :

Voice Configuration :
- Configure with : Webhook
- A call comes in : Webhook
- URL : `https://TON-PROJET.vercel.app/api/voice`
- Method : POST

Sauvegarder, puis appeler le numéro Twilio.

## Important
Cette V8 ne contient pas encore de vraie IA OpenAI ni de base de données.
C'est le premier branchement réel Twilio -> Vercel -> réponse vocale AutoCall.
