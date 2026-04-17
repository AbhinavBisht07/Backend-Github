const fs = require('fs');
const path = require('path');
const r1 = `font-sans antialiased tracking-tight`;
const r2 = `tracking-tight font-semibold`;
const r3 = `font-sans antialiased tracking-tight`;

function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            if (content.includes(`font-['Manrope',sans-serif]`)) {
                content = content.replaceAll(`font-['Manrope',sans-serif]`, r1);
                updated = true;
            }
            if (content.includes(`font-['Epilogue']`)) {
                content = content.replaceAll(`font-['Epilogue']`, r2);
                updated = true;
            }
            if (content.includes(`font-['Manrope']`)) {
                content = content.replaceAll(`font-['Manrope']`, r3);
                updated = true;
            }
            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated', fullPath);
            }
        }
    }
}
traverse(path.resolve('.'));
