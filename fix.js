const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ignoreDirs = ['node_modules', '.git', '.next', 'out'];
const allowedExtensions = ['.mdx', '.tsx', '.ts', '.html', '.json'];

// --- DICIONÁRIO DE REESCRITA: MÓDULO QUALIDADE ---
const qualityFixes = [
    // Termos de Qualidade e Processos
    ["diferenía", "diferença"],
    ["padrío", "padrão"],
    ["padríes", "padrões"],
    ["gestío", "gestão"],
    ["aíío", "ação"],
    ["açíes", "ações"],
    ["situaíío", "situação"],
    ["inspeíío", "inspeção"],
    ["preveníío", "prevenção"],
    ["correíío", "correção"],
    ["melhoria contínua", "melhoria contínua"],
    ["eficiíncia", "eficiência"],
    ["eficícia", "eficácia"],
    ["ferramenta de qualidade", "ferramenta de qualidade"],
    ["contínuos", "contínuos"],
    ["repetitivos", "repetitivos"],
    ["estatístico", "estatístico"],

    // Erros de codificação (fantasmas)
    ["misses", "missões"],
    ["concludas", "concluídas"],
    ["tím", "têm"],
    ["alím", "além"],
    ["atí", "até"],
    ["vocí", "você"],
    ["ínico", "único"],

    // Ajustes de Casing e Gramática
    [" São ", " são "],
    ["preJuízo", "prejuízo"],
    ["s? age", "só age"],
    ["J? ocorreu", "já ocorreu"],
    ["MBA Lite © Todos", "MBA Lite © Todos"]
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

    // 1. CORREÇÃO DE INTERROGAÇÃO (A lógica mais importante para as perguntas)
    // Procura por qualquer palavra terminada em 'í' seguida de espaço ou quebra de linha
    // Ex: Projeto'í -> Projeto'? | Projeto í -> Projeto?
    content = content.replace(/([a-zA-ZÀ-ÿ0-9'"]+)í([\s\r\n])/g, '$1?$2');
    content = content.replace(/í\?/g, '?'); // Remove se ficou 'í?'

    // 2. APLICAÇÃO DO DICIONÁRIO DE QUALIDADE
    qualityFixes.forEach(([oldText, newText]) => {
        content = content.split(oldText).join(newText);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Qualidade Restaurada: ${filePath}`);
        return true;
    }
    return false;
}

console.log("🚀 Iniciando Reescrita do Módulo de Qualidade...");
let changedAny = false;

walkDir(__dirname, (p) => {
    if (processFile(p)) changedAny = true;
});

if (changedAny) {
    try {
        console.log("\n📦 Sincronizando com GitHub...");
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "fix: reescrita completa perguntas qualidade e acentuacao"', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log("\n🎉 Sucesso! Suas perguntas de Qualidade estão limpas.");
    } catch (e) {
        console.log("\n⚠️ Git: Nada novo para subir.");
    }
} else {
    console.log("\n✨ Nenhum erro ortográfico de Qualidade encontrado.");
}