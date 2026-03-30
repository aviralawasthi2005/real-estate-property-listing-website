

import fs from 'fs';
const key = "AIzaSyDjeWPvHwMNfmw2fs2UE2SZBH4AjA-h7jw";

async function listTools() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  const data = await res.json();
  fs.writeFileSync('models.txt', data.models.map(m => m.name).join('\n'));
}
listTools();
