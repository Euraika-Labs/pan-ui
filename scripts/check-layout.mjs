import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage());
  
  // Login
  await page.goto('http://localhost:3199/login', { waitUntil: 'networkidle' });
  await page.locator('input[name="username"]').first().fill('admin');
  await page.locator('input[type="password"]').first().fill('changeme');
  await page.locator('button:has-text("Continue")').click();
  await page.waitForURL('**/chat**', { timeout: 10000 });
  await page.waitForTimeout(3000);
  
  // Viewport-only screenshot (NOT fullPage)
  await page.screenshot({ path: '/tmp/viewport_chat.png', fullPage: false });
  console.log('Viewport screenshot saved to /tmp/viewport_chat.png');

  // Check if page scrolls
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const scrollable = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
  console.log(`Body height: ${bodyHeight}, Viewport: ${viewportHeight}, Scrollable: ${scrollable}`);
  
  // Check specific element heights
  const sidebarHeight = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    return aside ? aside.scrollHeight : 'not found';
  });
  const gridHeight = await page.evaluate(() => {
    const grids = document.querySelectorAll('.grid');
    return Array.from(grids).map(g => ({ class: g.className.slice(0,60), scrollH: g.scrollHeight, clientH: g.clientHeight, offsetH: g.offsetHeight }));
  });
  console.log(`Sidebar scrollHeight: ${sidebarHeight}`);
  console.log('Grid elements:', JSON.stringify(gridHeight, null, 2));
  
  // Check computed styles
  const shellStyles = await page.evaluate(() => {
    const shell = document.querySelector('.relative.flex.h-screen');
    if (!shell) return 'shell not found';
    const s = window.getComputedStyle(shell);
    return { height: s.height, overflow: s.overflow, maxHeight: s.maxHeight };
  });
  console.log('Shell styles:', JSON.stringify(shellStyles));

  const mainStyles = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return 'main not found';
    const s = window.getComputedStyle(main);
    return { height: s.height, overflow: s.overflow, minHeight: s.minHeight, maxHeight: s.maxHeight };
  });
  console.log('Main styles:', JSON.stringify(mainStyles));

  await browser.close();
})();
