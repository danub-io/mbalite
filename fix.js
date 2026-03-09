const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ignoreDirs = ['node_modules', '.git', '.next', 'out'];
const allowedExtensions = ['.mdx', '.tsx', '.ts', '.html', '.json'];

// NOVAS REGRAS DE LIMPEZA
const fixes = [
    // Erros de codificação direta
    ["misses", "missões"],
    ["concludas", "concluídas"],
    ["Misses", "Missões"],
    ["Concludas", "Concluídas"],
    ["diferenía", "diferença"],
    
    // Regras de layout e interrogações
    ["'Projeto'í", "'Projeto'?"],
    ["'Processo'í", "'Processo'?"],
    ["preJuízo", "prejuízo"],
    ["s? age", "só age"],
    ["J? ocorreu", "já ocorreu"]
];

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            if (!ignoreDirs.includes(f)) walkDir(dirPath, callback);
        } else if (allowedExtensions.includes(path.extname(dirPath))) {
            callback(dirPath);
        }
    });
}

function processFile(filePath) {
    if (filePath.includes('package.json') || filePath.includes('package-lock.json')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Regex para interrogações (Ex: Projeto'í ou Projeto í)
    content = content.replace(/í([\s\r\n])/g, '?$1');

    // 2. Aplicar dicionário
    fixes.forEach(([oldText, newText]) => {
        content = content.split(oldText).join(newText);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Higienizado: ${filePath}`);
        return true;
    }
    return false;
}

console.log("🚀 Iniciando faxina nas missões e interrogações...");
let changedAny = false;

walkDir(__dirname, (p) => {
    if (processFile(p)) changedAny = true;
});

if (changedAny) {
    try {
        execSync('git add .');
        execSync('git commit -m "fix: limpa missoes e interrogacoes corrompidas"');
        execSync('git push origin main');
        console.log("\n🎉 Tudo limpo e enviado para o GitHub!");
    } catch (e) { console.log("\n⚠️ Git: Sem alterações."); }
} else {
    console.log("\n✨ Nada encontrado para limpar.");
}