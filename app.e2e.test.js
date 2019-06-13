describe('e2e test', () => {
  it('works', async () => {
    page.setDefaultNavigationTimeout(600000);
    await page.goto('http://localhost:1337');
    await page.screenshot({ path: 'screenshot.png' });
  }, 600000);
});
