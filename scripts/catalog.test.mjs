import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { PNG } from 'pngjs';
import { assetRoot, json, sha256, validateCatalog, contrast } from './catalog.mjs';
const spec=json(`${assetRoot}icon-spec.v1.json`), manifest=json(`${assetRoot}brands.json`), schema=json(`${assetRoot}icon-spec.schema.json`);
const microsoft=json(`${assetRoot}microsoft/manifest.json`);
const png=path=>PNG.sync.read(readFileSync(`${assetRoot}${path}`));

test('schema and cross-manifest validation reject duplicate ids, missing artifacts and mismatched paths/colors',()=>{
  validateCatalog(spec,manifest,schema);
  for(const mutate of [
    s=>s.icons[1]=structuredClone(s.icons[0]),
    s=>delete s.icons[0].artifacts.png32.sha256,
    s=>s.icons[0].artifacts.png32.width=192,
    s=>s.icons[0].artifacts.svg.path='svg/b8.svg',
    s=>s.icons[0].primaryColor='#000000',
    s=>s.icons[0].letterLayoutRule='ascender'
  ]) {const copy=structuredClone(spec);mutate(copy);assert.throws(()=>validateCatalog(copy,manifest,schema));}
  const copy=structuredClone(manifest);copy.brands[1]=structuredClone(copy.brands[0]);assert.throws(()=>validateCatalog(spec,copy,schema));
});

test('all catalog and Microsoft artifacts have correct checksums and PNG dimensions',()=>{
  for(const icon of [...spec.icons,...microsoft.icons]) for(const a of Object.values(icon.artifacts)) {
    const bytes=readFileSync(`${assetRoot}${a.path}`);
    assert.equal(bytes.length,a.bytes,a.path);assert.equal(sha256(bytes),a.sha256,a.path);
    if(a.path.endsWith('.png')) {const image=PNG.sync.read(bytes);assert.equal(image.width,a.width,a.path);assert.equal(image.height,a.height,a.path);}
  }
});

test('Teams exports use opaque square backgrounds, safe-area marks and sufficient contrast',()=>{
  for(const icon of microsoft.icons) {
    const image=png(icon.artifacts.teamsColor.path);
    const bg=icon.primaryColor.slice(1).match(/../g).map(c=>parseInt(c,16));
    let marked=0;
    assert.ok(contrast(icon.teamsForeground,icon.primaryColor)>=4.5,icon.id);
    for(let y=0;y<192;y++)for(let x=0;x<192;x++) {
      const p=(y*192+x)*4;assert.equal(image.data[p+3],255,`${icon.id} alpha`);
      if(bg.some((c,i)=>c!==image.data[p+i])) {marked++;assert.ok(x>=36&&x<156&&y>=36&&y<156,`${icon.id} safe area: ${x},${y}`);}
    }
    assert.ok(marked>500,`${icon.id} empty mark`);
    const fragment=json(`${assetRoot}${icon.artifacts.manifestFragment.path}`);
    assert.deepEqual(fragment.icons,{color:'color.png',outline:'outline.png'});
    assert.equal(fragment.accentColor,icon.primaryColor);
  }
});

test('Teams outlines contain only white ink and transparency, with tight bounds',()=>{
  for(const icon of microsoft.icons) {
    const image=png(icon.artifacts.teamsOutline.path);let visible=0,transparent=0,minX=32,maxX=-1,minY=32,maxY=-1;
    for(let y=0;y<32;y++)for(let x=0;x<32;x++) {
      const p=(y*32+x)*4;
      if(image.data[p+3]) {visible++;assert.deepEqual([...image.data.subarray(p,p+3)],[255,255,255],icon.id);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}else transparent++;
    }
    assert.ok(visible>50&&transparent>50,icon.id);
    assert.ok((minX===0&&maxX===31)||(minY===0&&maxY===31),`${icon.id} padding`);
  }
});

test('SVGs embed the exact licensed font, preserve text and need no external resources',()=>{
  const lock=json(`${assetRoot}fonts/source.json`);
  for(const icon of spec.icons) {
    const source=readFileSync(`${assetRoot}${icon.artifacts.svg.path}`,'utf8');
    const encoded=source.match(/data:font\/ttf;base64,([A-Za-z0-9+/=]+)/)?.[1];assert.ok(encoded,icon.id);
    const font=Buffer.from(encoded,'base64');assert.equal(sha256(font),lock.sha256);
    assert.ok(source.includes('SIL OPEN FONT LICENSE'),icon.id);
    assert.equal((source.match(/<text /g)||[]).length,4);
    assert.ok(!/(?:href|src)=["']https?:/.test(source));
    // Node's renderer uses pinned fontFiles; ensure glyphs survive usvg text conversion.
    const converted=new Resvg(source,{font:{loadSystemFonts:false,fontFiles:[`${assetRoot}fonts/HankenGrotesk-Black.ttf`]}}).toString();
    assert.ok(!converted.includes('<text'),icon.id);
    assert.ok((converted.match(/<path/g)||[]).length>3,icon.id);
  }
});
