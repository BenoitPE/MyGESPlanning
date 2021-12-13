<h1 align="center">Une alternative légère à MyGES</h1>

Ce repo est une application web semblable à celle de MyGES mais en plus légère  
L'application web permet d'éviter d’aller sur MyGES (qui est hors service régulièrement) et de récupérer directement les informations importantes.  

Les fonctionnalités disponibles sur cette application :
-	L’application permet de se connecter via l'API MyGES, les informations sont stockées en tant que variables de session.
-	L'application permet de voir son emploi du temps rapidement
-	L'application permet de voir ses notes
-	L'application permet ses absences

### Environnement
Ce projet utilise Node.js.

### Installation & lancement

Pour pouvoir utiliser ce projet:
- Installer [Node.js et NPM](https://nodejs.org/en/download/)
- Cloner le projet
- Ouvrir une invite de commande à la racine du projet et exécuter:  
```bash=
npm install
```

Lancement du projet:
- Pour lancer le projet, ouvrez une invite de commande à la racine du projet et exécuter:  
```bash=
node app
```
ou
```bash=
nodemon app
```
