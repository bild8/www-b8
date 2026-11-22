import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const assetRoot = `${root}assets/8/`;
export const json = path => JSON.parse(readFileSync(path, 'utf8'));
export const sha256 = data => createHash('sha256').update(data).digest('hex');
export const xml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

export function validateCatalog(spec, manifest, schema) {
  const validate = new Ajv2020({ allErrors: true }).compile(schema);
  if (!validate(spec)) throw new Error(`Invalid icon specification: ${JSON.stringify(validate.errors)}`);
  const ids = Array.from('abcdefghijklmnopqrstuvwxyz', c => `${c}8`);
  for (const [label, entries] of [['icons', spec.icons], ['brands', manifest.brands]]) {
    if (entries.length !== 26 || new Set(entries.map(x => x.id)).size !== 26 || ids.some(id => !entries.some(x => x.id === id))) {
      throw new Error(`${label} must contain each id a8-z8 exactly once`);
    }
  }
  for (const icon of spec.icons) {
    const brand = manifest.brands.find(b => b.id === icon.id);
    if (icon.letter !== icon.id[0] || brand.letter !== icon.letter || icon.primaryColor !== brand.primaryColor || icon.name !== brand.displayName || icon.domain !== brand.domain) {
      throw new Error(`Manifest mismatch for ${icon.id}`);
    }
    const rule = spec.geometry.letterLayoutRules.find(r => r.id === icon.letterLayoutRule);
    if (!rule?.letters.includes(icon.letter)) throw new Error(`Invalid layout for ${icon.id}`);
    for (const [kind, a] of Object.entries(icon.artifacts)) {
      const size = { svg:192, png32:32, png192:192, png526:526 }[kind];
      const path = kind === 'svg' ? `svg/${icon.id}.svg` : `png_${size}/${icon.id}_${size}.png`;
      if (a.path !== path || a.cdnUrl !== `https://bild8.de/assets/8/${path}` || brand.assets[kind] !== `/assets/8/${path}` || a.width !== size || a.height !== size) {
        throw new Error(`Invalid artifact path or size: ${icon.id}/${kind}`);
      }
    }
  }
}

export function contrast(a, b) {
  const luminance = hex => {
    const rgb = hex.slice(1).match(/../g).map(c => parseInt(c,16)/255).map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4);
    return rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722;
  };
  const x=luminance(a), y=luminance(b);
  return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
