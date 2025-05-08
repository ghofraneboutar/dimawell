// Commandes à exécuter dans votre terminal
// Ne pas exécuter ce script directement

console.log("1. Suppression des modules node_modules");
console.log("rm -rf node_modules");

console.log("\n2. Suppression du fichier package-lock.json ou yarn.lock");
console.log("rm -f package-lock.json yarn.lock pnpm-lock.yaml");

console.log("\n3. Nettoyage du cache npm");
console.log("npm cache clean --force");

console.log("\n4. Réinstallation des dépendances");
console.log("npm install");

console.log("\n5. Installation explicite de next/server");
console.log("npm install next@latest");
