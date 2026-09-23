import { expect, test, type Page } from '@playwright/test';
import { resolve } from 'node:path';

const visualStyles = resolve(process.cwd(), 'tests', 'visual.css');

async function prepareScreenshot(page: Page) {
  await page.evaluate(() => {
    const removeDevtools = () => document.querySelectorAll('nextjs-portal').forEach((portal) => portal.remove());
    removeDevtools();
    new MutationObserver(removeDevtools).observe(document.documentElement, { childList: true, subtree: true });
  });
}

const examples = [
  'tag-input-basic',
  'tag-input-controlled',
  'tag-input-validation',
  'tag-input-constraints',
  'tag-input-accessibility',
  'tag-input-native-form',
  'tag-input-react-hook-form',
  'tag-input-popover',
  'tag-input-dialog',
  'tag-input-reorder',
];

for (const theme of ['dark', 'light'] as const) {
  for (const slug of examples) {
    test(`@visual ${slug} ${theme}`, async ({ page }) => {
      await page.goto(`/playground/${slug}`);
      await page.evaluate((nextTheme) => {
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        document.documentElement.style.colorScheme = nextTheme;
      }, theme);
      await prepareScreenshot(page);
      const example = page.locator(`#${slug}`);
      await expect(example).toBeVisible();
      await expect(example).toHaveScreenshot(`${slug}-${theme}.png`, {
        animations: 'disabled',
        caret: 'hide',
        maxDiffPixelRatio: 0.02,
        stylePath: visualStyles,
      });
    });
  }
}

test('@visual documentation shell', async ({ page }) => {
  await page.goto('/docs/introduction');
  await prepareScreenshot(page);
  await expect(page.locator('.docs-site')).toHaveScreenshot('documentation-shell.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    stylePath: visualStyles,
  });
});

test('@visual search dialog', async ({ page }) => {
  await page.goto('/docs/introduction');
  await page
    .getByRole('button', { name: /Search/ })
    .first()
    .click();
  await prepareScreenshot(page);
  await expect(page.getByRole('dialog')).toHaveScreenshot('search-dialog.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    stylePath: visualStyles,
  });
});

test('@visual documentation table', async ({ page }) => {
  await page.goto('/docs/reference/api');
  await prepareScreenshot(page);
  await page.evaluate(() => {
    const table = document.querySelector('.responsive-table');
    if (!table) return;
    document.querySelectorAll<HTMLElement>('body *').forEach((element) => {
      const position = getComputedStyle(element).position;
      if ((position === 'fixed' || position === 'sticky') && !element.contains(table)) {
        element.style.visibility = 'hidden';
      }
    });
  });
  await expect(page.locator('table').first()).toHaveScreenshot('documentation-table.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    stylePath: visualStyles,
  });
});

test('@visual documentation code block', async ({ page }) => {
  await page.goto('/docs/introduction');
  await prepareScreenshot(page);
  const codeBlock = page.locator('figure.shiki').first();
  await expect(codeBlock).toBeVisible();
  await expect(codeBlock).toHaveScreenshot('documentation-code-block.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    stylePath: visualStyles,
  });
});

test('@visual documentation callout', async ({ page }) => {
  await page.goto('/docs/anatomy');
  await prepareScreenshot(page);
  const callout = page.locator('.docs-callout');
  await callout.scrollIntoViewIfNeeded();
  await expect(callout).toBeVisible();
  await expect(callout).toHaveScreenshot('documentation-callout.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    stylePath: visualStyles,
  });
});

test('@visual focused preview', async ({ page }) => {
  await page.goto('/playground/tag-input-basic');
  await expect(page.getByPlaceholder('Add a skill')).toBeVisible();
  const focusButton = page.getByRole('button', { name: 'Focus Basic compound field preview' });
  const dialog = page.getByRole('dialog');
  await expect(async () => {
    await focusButton.click();
    await expect(dialog).toBeVisible({ timeout: 1_500 });
    const defaultState = dialog.getByRole('radio', { name: 'Default' });
    await expect(defaultState).toBeVisible({ timeout: 1_500 });
    await expect(defaultState).toBeInViewport();
  }).toPass({ timeout: 10_000 });
  await prepareScreenshot(page);
  await expect(dialog).toHaveScreenshot('focused-preview.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    stylePath: visualStyles,
  });
});

test('@visual installation sheet', async ({ page }) => {
  await page.goto('/playground/tag-input-basic');
  await expect(page.getByPlaceholder('Add a skill')).toBeVisible();
  const install = page.getByRole('button', { name: 'Install', exact: true });
  await install.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await prepareScreenshot(page);
  await expect(page.getByRole('dialog')).toHaveScreenshot('installation-sheet.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    stylePath: visualStyles,
    timeout: 15_000,
  });
});
