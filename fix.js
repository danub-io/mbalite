const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const portalPages = path.join(__dirname, 'portal', 'pages');

// 1. LISTA DE ITENS PARA SUMIR DO MENU
const itemsToRemove = ['about', 'advanced', 'another', 'satori'];

function cleanupMenus(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        
        if (fs.statSync(filePath).isDirectory()) {
            // Se for uma das pastas que queremos remover, deletamos a pasta inteira
            if (itemsToRemove.includes(file.toLowerCase())) {
                console.log(`🗑️ Deletando pasta de exemplo: ${filePath}`);
                fs.rmSync(filePath, { recursive: true, force: true });
            } else {
                cleanupMenus(filePath);
            }
        } else if (file === '_meta.json') {
            // Se for o arquivo de configuração do menu, removemos as linhas
            let meta = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let originalKeys = Object.keys(meta);
            
            itemsToRemove.forEach(item => {
                delete meta[item];
                // Caso o item esteja com letra maiúscula no JSON
                delete meta[item.charAt(0).toUpperCase() + item.slice(1)];
            });

            if (Object.keys(meta).length !== originalKeys.length) {
                fs.writeFileSync(filePath, JSON.stringify(meta, null, 2), 'utf8');
                console.log(`✂️ Menu limpo em: ${filePath}`);
            }
        } else if (itemsToRemove.some(item => file.toLowerCase().startsWith(item))) {
            // Se for um arquivo solto (ex: about.mdx), deletamos
            console.log(`🗑️ Deletando arquivo de exemplo: ${filePath}`);
            fs.unlinkSync(filePath);
        }
    });
}

console.log("🚀 Iniciando faxina no menu lateral...");

try {
    cleanupMenus(portalPages);
    
    console.log("\n📦 Sincronizando limpeza com GitHub...");
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "fix: remove itens de exemplo (About, Advanced, Satori) do menu"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log("\n🎉 Faxina concluída! O menu lateral agora deve mostrar apenas o seu conteúdo real.");
} catch (error) {
    console.log("\n❌ Erro durante a limpeza:", error.message);
}