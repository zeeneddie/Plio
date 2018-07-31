describe('e2e test', () => {
  it('works', async () => {
    await page.goto('http://localhost:1337');
    await page.screenshot({ path: 'screenshot.png' });
  }, 600000);
});
