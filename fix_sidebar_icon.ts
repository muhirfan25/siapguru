import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

if (!content.includes(', Trash2')) {
    content = content.replace('Building2}', 'Building2, Trash2}');
    fs.writeFileSync('src/components/Sidebar.tsx', content);
    console.log("Trash2 added to imports in Sidebar");
} else {
    console.log("Trash2 already in imports");
}
