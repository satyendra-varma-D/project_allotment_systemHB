const fs = require('fs');
const glob = require('glob'); // Note: glob might not be installed globally, better to use recursive readdir if not available.
// wait, I can just use basic fs.readdirSync recursively
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const dir = 'C:/Users/hb/project_allotment_systemHB/src/app/components';
const files = walk(dir).filter(f => f.endsWith('Panel.tsx'));

const standardClass = 'fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300';
// Added animate-in slide-in-from-right duration-300 for uniformity

let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Match <div className="fixed right-0 ... "
  const regex = /<div\s+className="fixed\s+right-0[^"]*"/g;
  let newContent = content.replace(regex, `<div className="${standardClass}"`);

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    count++;
  }
}

console.log('Replaced ' + count + ' files.');
