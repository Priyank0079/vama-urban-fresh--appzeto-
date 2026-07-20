const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync(directory);
let totalReplacements = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace font weights
  newContent = newContent.replace(/font-black/g, 'font-semibold');
  newContent = newContent.replace(/font-extrabold/g, 'font-semibold');
  
  // Replace border sizes
  newContent = newContent.replace(/border-4/g, 'border-2');
  newContent = newContent.replace(/border-b-4/g, 'border-b-2');

  // Specific color replacement for thick borders if needed (optional)
  newContent = newContent.replace(/border-slate-800/g, 'border-slate-200');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    totalReplacements++;
  }
});

console.log(`Updated ${totalReplacements} files.`);
