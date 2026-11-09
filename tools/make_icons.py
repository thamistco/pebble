import asyncio, os
from playwright.async_api import async_playwright
base=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def svg(size, maskable=False, bg=True):
    # maskable: content within central 80% safe zone
    s = 0.62 if maskable else 0.78
    off = (1-s)/2*100
    rx = 0 if maskable else 22
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 100 100">
<rect width="100" height="100" rx="{rx}" fill="#FBF7F2"/>
<g transform="translate({off} {off}) scale({s})">
<path d="M4 56C4 30 24 10 50 10s46 17 46 41c0 25-20 41-47 41S4 82 4 56Z" fill="#B04A2F"/>
<path d="M54 64c0-11 8-18 19-18s17 7 17 15-8 16-19 16-17-4-17-13Z" fill="#F2C46D"/>
</g></svg>'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        pg = await b.new_page()
        for name,size,mask in [('icon-192.png',192,False),('icon-512.png',512,False),('maskable-512.png',512,True),('apple-touch-icon.png',180,True)]:
            await pg.set_viewport_size({'width':size,'height':size})
            await pg.set_content(f'<html><body style="margin:0;background:transparent">{svg(size,mask)}</body></html>')
            await pg.screenshot(path=f'{base}/icons/{name}', omit_background=not mask)
        await b.close()
asyncio.run(main())
