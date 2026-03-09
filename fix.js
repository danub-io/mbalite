const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ignoreDirs = ['node_modules', '.git', '.next', 'out'];
const allowedExtensions = ['.mdx', '.tsx', '.ts', '.html', '.json'];

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

    // --- LIMPEZA DE ELITE ---

    // 1. LIMPA O RODAPÉ (Padrão: Remove qualquer lixo antes do © e garante espaço antes de "Todos")
    // Procura por: [caractere estranho]© ou ©© ou apenas © e limpa
    content = content.replace(/[^a-zA-Z0-9\s]©/g, '©'); 
    content = content.replace(/©+/g, '©');
    content = content.replace(/MBA Lite\s*©\s*/g, 'MBA Lite © ');

    // 2. CORREÇÃO DE ACENTUAÇÃO RESTANTE (Regex para pegar os 'í' fantasmas)
    content = content.replace(/diferenía/g, 'diferença');
    content = content.replace(/alteraíío/g, 'alteração');
    content = content.replace(/preJuízo/g, 'prejuízo');
    content = content.replace(/s\? age/g, 'só age');
    content = content.replace(/J\? ocorreu/g, 'já ocorreu');

    // 3. SE PREVENIR CONTRA O 'São' MAIÚSCULO NO MEIO DA FRASE
    content = content.replace(/([a-z]) São /g, '$1 são ');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Limpeza profunda realizada: ${filePath}`);
        return true;
    }
    return false;
}

console.log("🚀 Iniciando Limpeza Biônica (Regex) com Node...");
let changedAny = false;

walkDir(__dirname, (p) => {
    if (processFile(p)) changedAny = true;
});

if (changedAny) {
    try {
        console.log("\n📦 Sincronizando com GitHub...");
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "fix: limpeza profunda de caracteres invisiveis no rodape"', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log("\n🎉 Agora sim! Rodapé e textos devidamente higienizados.");
    } catch (e) {
        console.log("\n⚠️ Git: Sem alterações para subir.");
    }
} else {
    console.log("\n✨ O script não detectou nenhum dos padrões de erro conhecidos.");
}