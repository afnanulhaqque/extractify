const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'solutions');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Extract hero gradient
    let gradientMatch = content.match(/--hero-gradient:\s*var\(--gradient-([a-z]+)\)/);
    let gradient = gradientMatch ? gradientMatch[1] : 'primary';
    
    // Map invalid gradients to valid ones (e.g. dark -> primary)
    if (gradient === 'dark') gradient = 'primary';
    
    // Remove the entire inline <style> block
    content = content.replace(/<style>[\s\S]*?<\/style>/, `<style>\n        :root {\n            --hero-gradient: var(--gradient-${gradient});\n        }\n    </style>`);
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file} with --hero-gradient: var(--gradient-${gradient})`);
});
