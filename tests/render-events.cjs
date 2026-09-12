const fs=require('fs'), vm=require('vm'), assert=require('assert');
const root=require('path').resolve(__dirname,'..')+'/';
const names=['2026-09-13','2026-09-19','2026-09-25','2026-10-11','2026-10-23'];
function render(date,audience='',limit='') {
 const list={closest:()=>({id:audience?'adults':'schedule'}),getAttribute:k=>({'data-audience':audience,'data-limit':limit}[k]||null),hasAttribute:k=>k==='data-compact',innerHTML:''};
 const link={removeAttribute(){}};const fixed={querySelector:()=>true,classList:{add(){}}};
 const RealDate=Date;class FakeDate extends RealDate {constructor(...args){super(...(args.length?args:[date]))}}
 const c={window:{},document:{getElementById:k=>({'event-list':list,'fixed-cta-link':link,'fixed-cta':fixed}[k]||null),body:{classList:{add(){}}}},Date:FakeDate,Intl};
 vm.createContext(c);for(const n of names)vm.runInContext(fs.readFileSync(root+'events/'+n+'.js','utf8'),c);
 vm.runInContext(fs.readFileSync(root+'js/render-events.js','utf8'),c);
 return {html:list.innerHTML,link};
}
let x=render('2026-09-12T03:00:00Z');
assert(x.html.includes('11:00-12:00 ／ 14:30-15:30'));
assert(x.html.includes('15:40-16:10'));
assert(!x.html.includes('198774'));assert(x.link.href.endsWith('198773'));
assert(x.html.includes('<details class="visit-more">'));assert(!x.html.includes('<details class="visit-more" open'));
x=render('2026-09-12T03:00:00Z','adult');
assert(x.html.includes('カレンダーとメールをAIで整理する'));assert(x.html.includes('手元の資料からスライドを作る'));
assert(x.link.href.endsWith('198774'));assert(!x.html.includes('1,900円'));
assert(x.html.includes('3,500円'));
x=render('2026-09-13T15:01:00Z');assert(!x.html.includes('event-2026-09-13'));assert(x.link.href.endsWith('198775'));
x=render('2026-10-01T00:00:00Z');assert(!x.html.includes('1,900円'));assert(x.html.includes('3,000円'));assert(!x.html.includes('お試し価格'));assert(!x.html.includes('href="https://gameschool.doorkeeper.jp/events/'));
x=render('2026-11-01T00:00:00Z');assert(x.html.includes('次回の開催'));assert(!x.link.href);
x=render('2026-09-12T00:00:00Z','','1');assert(!x.html.includes('event-2026-09-19'));
for(const name of ['index','adults','schedule']){
 const h=fs.readFileSync(root+name+'.html','utf8');assert.equal((h.match(/<h1[ >]/g)||[]).length,1);
 const preload=[...h.matchAll(/rel="preload" as="script" href="(events\/[^"]+)"/g)].map(m=>m[1]).sort();
 const scripts=[...h.matchAll(/<script src="(events\/[^"]+)"/g)].map(m=>m[1]).sort();assert.deepEqual(preload,scripts);
 for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
}
console.log('PASS: recipient separation, grouping, collapsed advanced slots, Japan date rollover, October pricing/unavailable booking, all-expired fallback, homepage limit, preload parity, JSON-LD');
