const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ignoreDirs = ['node_modules', '.git', '.next', 'out'];
const allowedExtensions = ['.mdx', '.tsx', '.ts', '.html', '.json'];

// DICIONÁRIO DE CORREÇÕES CIRÚRGICAS
const fixes = [
    // Correções de Layout e Casing (o terror do preJuízo)
    ["preJuízo", "prejuízo"],
    ["PreJuízo", "Prejuízo"],
    ["J? ocorreu", "já ocorreu"],
    ["Já ocorreu", "Já ocorreu"],
    ["s? age", "só age"],
    ["S? age", "Só age"],
    ["preJuizo", "prejuízo"],
    
    // Glossário Técnico e Quiz
    ["diferenía", "diferença"],
    ["temporírios", "temporários"],
    ["alteraíío", "alteração"],
    ["não h?", "não há"],
    ["sinínimos", "sinônimos"],
    [" São ", " são "],
    ["projetos São", "projetos são"],
    ["Processos São", "Processos são"],
    ["Projetos São", "Projetos são"],
    ["aíío", "ação"],
    ["açíes", "ações"],
    ["situaíío", "situação"],
    ["decisíes", "decisões"],
    ["missíes", "missões"],
    ["opíío", "opção"],
    ["gestío", "gestão"],
    ["padrío", "padrão"],
    ["prítica", "prática"],
    ["tícnica", "técnica"],
    ["vocí", "você"],
    ["atí", "até"],
    ["alím", "além"],
    ["trís", "três"],
    ["ínico", "único"],
    ["estratígia", "estratégia"],
    ["competíncia", "competência"],
    ["lideranía", "liderança"],
    ["liííes", "lições"],
    ["evoluíío", "evolução"],
    ["MBA Lite ©", "MBA Lite ©"]
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

    // 1. Regex para interrogações coladas (Projeto'í -> Projeto'?)
    content = content.replace(/([a-zA-ZÀ-ÿ0-9'"”\)]+)í([\s\r\n])/g, '$1?$2');

    // 2. Aplicar o dicionário de correções
    fixes.forEach(([oldText, newText]) => {
        content = content.split(oldText).join(newText);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Corrigido: ${filePath}`);
        return true;
    }
    return false;
}

console.log("🚀 Iniciando Super Fix Node...");
let changedAny = false;

walkDir(__dirname, (p) => {
    if (processFile(p)) changedAny = true;
});

if (changedAny) {
    try {
        console.log("\n📦 Sincronizando com Git...");
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "fix: corrige preJuizo e so age via Node"', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log("\n🎉 Sucesso! Verifique o deploy em instantes.");
    } catch (e) {
        console.log("\n⚠️ Git: Nada novo para subir.");
    }
} else {
    console.log("\n✨ Tudo limpo! Nenhum erro encontrado.");
}