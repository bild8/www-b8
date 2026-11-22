import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { PNG } from 'pngjs';
import { assetRoot, json, sha256, xml, validateCatalog, contrast } from './catalog.mjs';

const check = process.argv.includes('--check');
const spec = json(`${assetRoot}icon-spec.v1.json`);
const brands = json(`${assetRoot}brands.json`);
validateCatalog(spec, brands, json(`${assetRoot}icon-spec.schema.json`));
const lock = json(`${assetRoot}fonts/source.json`);
const fontPath = `${assetRoot}fonts/HankenGrotesk-Black.ttf`;
const font = readFileSync(fontPath);
if (sha256(font) !== lock.sha256 || sha256(readFileSync(`${assetRoot}fonts/OFL.txt`)) !== lock.licenseSha256) throw new Error('Vendored font/license differs from fonts/source.json');
const license = readFileSync(`${assetRoot}fonts/OFL.txt`, 'utf8').replace(/[ \t]+$/gm, '');
const embed = `<metadata>${xml(license)}</metadata>\n<defs><style>@font-face{font-family:'Hanken Grotesk';font-style:normal;font-weight:900;src:url(data:font/ttf;base64,${font.toString('base64')}) format('truetype');}</style></defs>`;
const generated = new Map();
const failures = [];
const put = (path, data) => generated.set(path, Buffer.isBuffer(data) ? data : Buffer.from(data));
const describe = (path, data, width, height, extra={}) => ({ path, bytes:data.length, sha256:sha256(data), width, height, ...extra });
function render(svg, size) {
  return new Resvg(svg, { fitTo: {mode:'width', value:size}, font:{loadSystemFonts:false, fontFiles:[fontPath], defaultFontFamily:'Hanken Grotesk'} }).render().asPng();
}
const text = (value, g, color, shadow=false) => `<text x="${g.x}" y="${g.y}" text-anchor="middle" font-family="${spec.font.svgFontStack}" font-size="${g.fontSize}" font-weight="900" fill="${color}"${shadow ? ' opacity="0.70"' : ''}${g.transform ? ` transform="${g.transform}"` : ''}>${value}</text>`;
function mark(icon, color='#ffffff', shadow=true) {
  const geo = spec.geometry;
  const rule = geo.letterLayoutRules.find(r => r.id === icon.letterLayoutRule);
  return [
    ...Object.values(geo.divider.paths).map(d => `<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`),
    ...(shadow ? [text('8',geo.eight.shadow,'#233039',true)] : []),
    text('8',geo.eight.foreground,color),
    ...(shadow ? [text(icon.letter,rule.shadow,'#233039',true)] : []),
    text(icon.letter,rule.foreground,color)
  ].join('\n');
}
function svg(icon, body, viewBox='0 0 192 192', label=icon.id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="192" height="192">\n<title>${xml(label)}</title>\n${embed}\n${body}\n</svg>\n`;
}
const preview = new PNG({width:1540,height:880}); preview.data.fill(255);
const microsoftPreview = new PNG({width:1200,height:1120}); microsoftPreview.data.fill(255);
const integration = {schemaVersion:'1.0.0',kind:'bild8.microsoftAssetCatalog',generatedAt:spec.generatedAt,sourceManifest:'brands.json',fontSource:'fonts/source.json',rules:'MICROSOFT-INTEGRATION.md',icons:[]};

for (const [index, icon] of spec.icons.entries()) {
  const bg=spec.geometry.background;
  const source=svg(icon, `<rect x="${bg.x}" y="${bg.y}" width="${bg.width}" height="${bg.height}" rx="${bg.rx}" ry="${bg.ry}" fill="${icon.primaryColor}"/>\n${mark(icon)}`);
  put(`svg/${icon.id}.svg`, source);
  icon.artifacts.svg = describe(`svg/${icon.id}.svg`, Buffer.from(source),192,192,{viewBox:[0,0,192,192],cdnUrl:`https://bild8.de/assets/8/svg/${icon.id}.svg`});
  for (const size of [32,192,526]) {
    const path=`png_${size}/${icon.id}_${size}.png`, png=render(source,size);
    put(path,png);
    icon.artifacts[`png${size}`]=describe(path,png,size,size,{cdnUrl:`https://bild8.de/assets/8/${path}`});
    if(size===192) {
      const tile=PNG.sync.read(png), left=15+(index%7)*222, top=15+Math.floor(index/7)*222;
      for(let y=0;y<192;y++) for(let x=0;x<192;x++) {const p=(y*192+x)*4,q=((top+y)*preview.width+left+x)*4,a=tile.data[p+3]/255;for(let c=0;c<3;c++)preview.data[q+c]=Math.round(tile.data[p+c]*a+255*(1-a));}
    }
  }
  // Flat brand mark; full-bleed background is masked by Microsoft at runtime.
  const foreground = contrast('#ffffff',icon.primaryColor)>=4.5 ? '#ffffff' : '#000000';
  const colorSvg=svg(icon,`<rect width="192" height="192" fill="${icon.primaryColor}"/>\n<g transform="translate(38 38) scale(0.6041666666666666)">${mark(icon,foreground,false)}</g>`);
  const color=render(colorSvg,192);
  const item={id:icon.id,primaryColor:icon.primaryColor,teamsForeground:foreground,teamsContrast:Number(contrast(foreground,icon.primaryColor).toFixed(3)),artifacts:{}};
  for(const [kind,path,data,w,h] of [
    ['teamsColor',`microsoft/teams/${icon.id}/color.png`,color,192,192],
    ['teamsColorSvg',`microsoft/teams/${icon.id}/color.svg`,Buffer.from(colorSvg),192,192]
  ]) {put(path,data);item.artifacts[kind]=describe(path,data,w,h);}
  // Tight transparent canvas: no decorative tile, shadow, or extra outline padding.
  const plain=mark(icon,'#ffffff',false);
  const bounds=new Resvg(svg(icon,plain),{font:{loadSystemFonts:false,fontFiles:[fontPath]}}).getBBox();
  if(!bounds) throw new Error(`Empty mark ${icon.id}`);
  const side=Math.max(bounds.width,bounds.height);
  const squareViewBox=`${bounds.x-(side-bounds.width)/2} ${bounds.y-(side-bounds.height)/2} ${side} ${side}`;
  const outlineSvg=svg(icon,plain,squareViewBox);
  const outline=render(outlineSvg,32);
  const outlinePath=`microsoft/teams/${icon.id}/outline.png`;
  put(outlinePath,outline); item.artifacts.teamsOutline=describe(outlinePath,outline,32,32);
  const monoPath=`microsoft/mono/${icon.id}.svg`;
  const mono=svg(icon,mark(icon,'currentColor',false),squareViewBox);
  put(monoPath,mono);item.artifacts.monoSvg=describe(monoPath,Buffer.from(mono),192,192);
  const fragmentPath=`microsoft/teams/${icon.id}/manifest-fragment.json`;
  put(fragmentPath,JSON.stringify({icons:{color:'color.png',outline:'outline.png'},accentColor:icon.primaryColor},null,2)+'\n');
  item.artifacts.manifestFragment={path:fragmentPath,sha256:sha256(generated.get(fragmentPath)),bytes:generated.get(fragmentPath).length};
  for(const [theme,ink] of [['dark','#ffffff'],['light','#242424']]) {
    for(const size of [16,20,24,32,40,48,64,80,96]) {
      const path=`microsoft/mono/${theme}/${icon.id}_${size}.png`;
      const png=render(svg(icon,mark(icon,ink,false),squareViewBox),size);
      put(path,png);item.artifacts[`mono${theme}${size}`]=describe(path,png,size,size);
    }
  }
  integration.icons.push(item);
  const cellX=(index%6)*200,cellY=Math.floor(index/6)*224;
  PNG.bitblt(PNG.sync.read(color),microsoftPreview,0,0,192,192,cellX+4,cellY);
  for(const [offset,theme,background] of [[0,'light',255],[100,'dark',32]]) {
    for(let y=cellY+192;y<cellY+224;y++) for(let x=cellX+offset;x<cellX+offset+100;x++) {
      const p=(y*microsoftPreview.width+x)*4;microsoftPreview.data[p]=background;microsoftPreview.data[p+1]=background;microsoftPreview.data[p+2]=background;
    }
    const png=PNG.sync.read(generated.get(`microsoft/mono/${theme}/${icon.id}_32.png`));
    // Alpha composite the mono mark on the theme background for visual review.
    for(let y=0;y<32;y++) for(let x=0;x<32;x++) {const p=(y*32+x)*4,q=((cellY+192+y)*microsoftPreview.width+cellX+offset+34+x)*4,a=png.data[p+3]/255;for(let c=0;c<3;c++)microsoftPreview.data[q+c]=Math.round(png.data[p+c]*a+background*(1-a));}
  }
}
const previewBytes=PNG.sync.write(preview);
put('preview_a-z8_colored.png',previewBytes);
spec.canvas.preview.bytes=previewBytes.length;spec.canvas.preview.sha256=sha256(previewBytes);
put('microsoft/preview.png',PNG.sync.write(microsoftPreview));
put('microsoft/manifest.json',JSON.stringify(integration,null,2)+'\n');
// Original references are immutable inputs, never regenerated.
for(const a of spec.references) {
  const data=readFileSync(`${assetRoot}${a.path}`);
  if(data.length!==a.bytes || sha256(data)!==a.sha256) throw new Error(`Original reference changed: ${a.path}`);
}
put('icon-spec.v1.json',JSON.stringify(spec,null,2)+'\n');
// A check compares a fresh build; it cannot repair stale output or rewrite checksums.
for(const [path,data] of generated) {
  const destination=`${assetRoot}${path}`;
  if(check) {
    let existing;try{existing=readFileSync(destination);}catch{}
    if(!existing?.equals(data))failures.push(path);
  } else {mkdirSync(dirname(destination),{recursive:true});writeFileSync(destination,data);}
}
if(check) {
  const managed=['svg','png_32','png_192','png_526','microsoft'];
  const walk=dir=>readdirSync(`${assetRoot}${dir}`,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);
  for(const dir of managed) for(const path of walk(dir)) if(!generated.has(path))failures.push(`unexpected output: ${path}`);
  if(failures.length)throw new Error(`Generated assets differ; run npm run build:\n${failures.join('\n')}`);
}
console.log(`${check?'Verified':'Generated'} ${generated.size} deterministic outputs for ${spec.icons.length} brands; original references intact.`);
