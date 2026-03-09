const fs = require('fs');
const path = require('path');

// Pastas que NÃO vamos tocar de jeito nenhum (segurança máxima para não quebrar dependências)
const ignoreDirs = ['node_modules', '.git', '.next', 'out'];
// Tipos de arquivos que vamos corrigir
const allowedExtensions = ['.mdx', '.tsx', '.ts', '.html', '.json'];

// Nosso dicionário de correções exatas (O Node respeita maiúsculas e minúsculas!)
const quizFixes = [
    ["diferenía", "diferença"],
    ["temporírios", "temporários"],
    ["temporírio", "temporário"],
    ["tím", "têm"],
    ["tím ", "têm "],
    ["alteraíío", "alteração"],
    ["não h?", "não há"],
    [" h? ", " há "],
    ["sinínimos", "sinônimos"],
    [" São ", " são "],
    ["projetos São", "projetos são"],
    ["Processos São", "Processos são"],
    ["Projetos São", "Projetos são"],
    ["termos São", "termos são"],
    ["aíío", "ação"],
    ["açíes", "ações"],
    ["situaíío", "situação"],
    ["avaliaíío", "avaliação"],
    ["definiíío", "definição"],
    ["execuíío", "execução"],
    ["criaíío", "criação"],
    ["soluíío", "solução"],
    ["direíío", "direção"],
    ["condiíío", "condição"],
    ["condiííes", "condições"],
    ["decisíes", "decisões"],
    ["questíes", "questões"],
    ["missíes", "missões"],
    ["reuniíes", "reuniões"],
    ["opíío", "opção"],
    ["opííes", "opções"],
    ["gestío", "gestão"],
    ["padrío", "padrão"],
    ["prítica", "prática"],
    ["tícnica", "técnica"],
    ["consequíncia", "consequência"],
    ["frequíncia", "frequência"],
    ["referíncia", "referência"],
    ["competíncia", "competência"],
    ["excelíncia", "excelência"],
    ["alím", "além"],
    ["porím", "porém"],
    ["atí", "até"],
    ["vocí", "você"],
    ["príprio", "próprio"],
    ["príximo", "próximo"],
    ["míximo", "máximo"],
    ["necessírio", "necessário"],
    ["obrigatírio", "obrigatório"],
    ["diírio", "diário"],
    ["funcionírio", "funcionário"],
    ["funcionírios", "funcionários"],
    ["estagiírio", "estagiário"],
    ["estagiírios", "estagiários"],
    ["negício", "negócio"],
    ["início", "início"],
    ["propísito", "propósito"],
    ["princípio", "princípio"],
    ["Princípio", "Princípio"] // No JS não dá erro ter repetição ou ignorar o case!
];

// Função que entra nas pastas procurando os arquivos
function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        
        if (isDirectory) {
            if (!ignoreDirs.includes(f)) {
                walkDir(dirPath, callback);
            }
        } else {
            if (allowedExtensions.includes(path.extname(dirPath))) {
                callback(dirPath);
            }
        }
    });
}

// Função que abre, conserta e salva o arquivo
function processFile(filePath) {
    // Trava de segurança extra: NUNCA mexer nos arquivos do NPM
    if (filePath.endsWith('package.json') || filePath.endsWith('package-lock.json')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Regex Aprimorada para as interrogações corrompidas após aspas e parênteses (ex: 'Projeto'í)
    content = content.replace(/([a-zA-ZÀ-ÿ0-9'"”\)]+)í([\s\r\n])/g, '$1?$2');

    // 2. Substituição exata do nosso dicionário
    quizFixes.forEach(([oldText, newText]) => {
        // No Node, usar split.join é o jeito mais blindado de dar "Replace All" sem dar erro de regex
        content = content.split(oldText).join(newText);
    });

    // Se algo mudou, salva o arquivo forçando UTF-8
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Corrigido: ${filePath}`);
    }
}

console.log("🚀 Iniciando varredura limpa com Node.js...");
walkDir(__dirname, processFile);
console.log("🎉 Varredura concluída com sucesso!");