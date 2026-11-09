import asyncio, os, threading, functools, http.server, socketserver, json, sys
from playwright.async_api import async_playwright
base=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
shots=os.path.join(os.path.dirname(base),'work','shots')
PORT=8765
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
httpd=socketserver.TCPServer(('127.0.0.1',PORT), functools.partial(Q, directory=base))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
URL=f'http://127.0.0.1:{PORT}/'
problems=[]
async def overflow(pg, label):
    r = await pg.evaluate('''()=>{const w=innerWidth; const bad=[]; document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect(); if(r.width && (r.right>w+1) && !el.closest('.chips,.collections') && getComputedStyle(el).position!=='fixed') bad.push((el.className.baseVal!==undefined?'svg:'+el.className.baseVal:el.className)||el.tagName)}); return {sw:document.documentElement.scrollWidth,w,bad:bad.slice(0,8)}}''')
    if r['sw']>r['w'] or r['bad']: problems.append((label,r))
async def run(w,h,tag):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        ctx=await b.new_context(viewport={'width':w,'height':h}, device_scale_factor=2, is_mobile=True, has_touch=True, accept_downloads=True)
        pg=await ctx.new_page(); errs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{shots}/{tag}-00-welcome.png')
        await pg.fill('input[name=child]','Sam'); await pg.fill('input[name=birth]','2024-06-15'); await pg.fill('input[name=p1]','Alex')
        await pg.click('text=Let\'s begin'); await pg.wait_for_timeout(500)
        await overflow(pg, tag+' today'); await pg.screenshot(path=f'{shots}/{tag}-01-today.png', full_page=True)
        t1 = await pg.inner_text('#hero-t'); await pg.click('[data-act=another]'); await pg.wait_for_timeout(200); t2=await pg.inner_text('#hero-t')
        if t1==t2: problems.append((tag,'another did not change pick'))
        await pg.click('[data-quick=tired]'); await pg.wait_for_timeout(200)
        n = await pg.locator('.quick-results .card').count()
        if n<1: problems.append((tag,'quick picker empty'))
        await pg.screenshot(path=f'{shots}/{tag}-02-quick.png', full_page=True)
        await pg.click('[data-act=next-prompt]')
        # detail
        await pg.click('.hero [data-open]'); await pg.wait_for_timeout(450)
        await overflow(pg, tag+' detail'); await pg.screenshot(path=f'{shots}/{tag}-03-detail.png')
        await pg.click('.sheet [data-fav]'); await pg.wait_for_timeout(150)
        await pg.click('.sheet [data-done]'); await pg.wait_for_timeout(450)
        await pg.click('.sheet.open:last-of-type [data-min="10"]')
        await pg.fill('input[name=note]','He laughed every time the tower fell'); 
        await pg.screenshot(path=f'{shots}/{tag}-04-done.png')
        await pg.click('text=Save moment'); await pg.wait_for_timeout(700)
        st = await pg.evaluate('JSON.parse(localStorage.getItem("pebble.v1"))')
        if len(st['log'])!=1 or len(st['favs'])!=1: problems.append((tag,'log/fav not saved',st['log'],st['favs']))
        if await pg.locator('.sheet').count(): problems.append((tag,'sheets left open'))
        await pg.screenshot(path=f'{shots}/{tag}-05-today-after.png', full_page=True)
        # back button closes sheet
        await pg.click('.hero [data-open]'); await pg.wait_for_timeout(400); await pg.go_back(); await pg.wait_for_timeout(450)
        if await pg.locator('.sheet').count(): problems.append((tag,'back did not close sheet'))
        # ideas
        await pg.click('.tab[data-tab=ideas]'); await pg.wait_for_timeout(300)
        await overflow(pg, tag+' ideas'); await pg.screenshot(path=f'{shots}/{tag}-06-ideas.png')
        total = await pg.locator('.card').count()
        await pg.click('[data-f=time][data-v="5"]'); await pg.wait_for_timeout(150); n5=await pg.locator('.card').count()
        await pg.click('[data-f=energy][data-v=low]'); await pg.wait_for_timeout(150); n5l=await pg.locator('.card').count()
        if not (total>n5>=n5l>0): problems.append((tag,'chip filters',total,n5,n5l))
        await pg.click('[data-act=filters]'); await pg.wait_for_timeout(400)
        await pg.click('.sheet [data-f=place][data-v=bedtime]'); await pg.wait_for_timeout(100)
        await pg.screenshot(path=f'{shots}/{tag}-07-filters.png')
        await pg.click('#apply-f'); await pg.wait_for_timeout(450)
        nb = await pg.locator('.card').count()
        await pg.click('[data-act=clear-all]'); await pg.wait_for_timeout(150)
        await pg.fill('#q','pebble'); await pg.wait_for_timeout(150); ns=await pg.locator('.card').count()
        if ns<1: problems.append((tag,'search empty'))
        await pg.fill('#q',''); 
        await pg.click('[data-coll=seaside]'); await pg.wait_for_timeout(150); nsea=await pg.locator('.card').count()
        await pg.screenshot(path=f'{shots}/{tag}-08-collection.png', full_page=True)
        await pg.click('[data-coll=prompts]'); await pg.wait_for_timeout(150); npr=await pg.locator('.prompt').count(); await pg.screenshot(path=f'{shots}/{tag}-08b-prompts.png'); await pg.click('[data-coll=prompts]'); await pg.wait_for_timeout(150)
        print(tag,'counts total',total,'5min',n5,'5low',n5l,'bed',nb,'search',ns,'seaside',nsea,'prompts',npr)
        # saved
        await pg.click('.tab[data-tab=saved]'); await pg.wait_for_timeout(200)
        if await pg.locator('.card').count()!=1: problems.append((tag,'saved count'))
        await pg.screenshot(path=f'{shots}/{tag}-09-saved.png')
        await pg.click('.tab[data-tab=moments]'); await pg.wait_for_timeout(200)
        await overflow(pg, tag+' moments'); await pg.screenshot(path=f'{shots}/{tag}-10-moments.png', full_page=True)
        # settings
        await pg.click('[data-act=settings]'); await pg.wait_for_timeout(400)
        await pg.click('[data-toggle=polish]'); await pg.click('[data-theme=dark]'); await pg.fill('input[name=p2]','Jordan')
        await pg.screenshot(path=f'{shots}/{tag}-11-settings.png')
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(450)
        await pg.click('.tab[data-tab=today]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{shots}/{tag}-12-today-dark.png', full_page=True)
        await pg.click('.tab[data-tab=ideas]'); await pg.wait_for_timeout(200)
        if not await pg.locator('[data-coll=polish]').count(): problems.append((tag,'polish collection missing'))
        await pg.click('.card >> nth=0'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{shots}/{tag}-13-detail-dark.png'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
        # who chips appear in done
        await pg.click('.card >> nth=1'); await pg.wait_for_timeout(400); await pg.click('.sheet [data-done]'); await pg.wait_for_timeout(400)
        if await pg.locator('[data-who]').count()!=3: problems.append((tag,'who chips',await pg.locator('[data-who]').count()))
        await pg.screenshot(path=f'{shots}/{tag}-14-done-dark.png')
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(350); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(350)
        # export
        await pg.click('[data-act=settings]'); await pg.wait_for_timeout(400)
        async with pg.expect_download() as dl: await pg.click('[data-act=export]')
        d=await dl.value; path=f'{shots}/{tag}-backup.json'; await d.save_as(path)
        bk=json.load(open(path)); assert bk['app']=='pebble'
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
        # reload persistence
        await pg.reload(); await pg.wait_for_timeout(500)
        st2 = await pg.evaluate('JSON.parse(localStorage.getItem("pebble.v1"))')
        if st2['settings']['child']!='Sam' or st2['settings']['theme']!='dark' or len(st2['log'])!=1: problems.append((tag,'persistence'))
        # import into fresh state
        await pg.evaluate('localStorage.clear()'); await pg.reload(); await pg.wait_for_timeout(400)
        await pg.click('[data-act=skip-welcome]'); await pg.wait_for_timeout(200)
        await pg.click('[data-act=settings]'); await pg.wait_for_timeout(400)
        await pg.set_input_files('#import-file', path); await pg.wait_for_timeout(800)
        st3 = await pg.evaluate('JSON.parse(localStorage.getItem("pebble.v1"))')
        if st3['settings']['child']!='Sam' or len(st3['log'])!=1: problems.append((tag,'import failed'))
        # offline
        await pg.evaluate('navigator.serviceWorker.ready.then(()=>1)'); await pg.reload(); await pg.wait_for_timeout(800)
        await ctx.set_offline(True); await pg.reload(); await pg.wait_for_timeout(800)
        ok = await pg.locator('#hero-t').count()
        if not ok: problems.append((tag,'offline reload failed'))
        await pg.screenshot(path=f'{shots}/{tag}-15-offline.png')
        await ctx.set_offline(False)
        if errs: problems.append((tag,'console errors',errs[:5]))
        await b.close()
async def main():
    await run(360,800,'m360')
    await run(320,640,'m320')
asyncio.run(main())
print('PROBLEMS:', json.dumps(problems, indent=1) if problems else 'none')
httpd.shutdown()
