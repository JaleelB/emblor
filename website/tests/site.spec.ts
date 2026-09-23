import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage exposes a live field and primary paths', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /a small input/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/docs/introduction');
  const input = page.locator('input[placeholder="Add a concept"]');
  await input.click();
  await input.fill('');
  await input.fill('consumer');
  await input.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.marketing-specimen .tag-chip').filter({ hasText: 'consumer' })).toBeVisible();
});

test('docs shell exposes the exact guide hierarchy', async ({ page }, testInfo) => {
  await page.goto('/docs/introduction');
  await expect(page.getByRole('heading', { name: 'Introduction' })).toBeVisible();
  if (testInfo.project.name !== 'mobile') {
    await expect(page.getByRole('link', { name: 'Validation' })).toHaveAttribute('href', '/docs/guides/validation');
    const header = page.locator('.site-header');
    await expect(header.getByRole('link', { name: 'Guides' })).toHaveCount(0);
    await expect(header.getByRole('link', { name: 'Emblor on npm' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Jaleel Bennett on X' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Emblor on GitHub' })).toBeVisible();
  }
  if (testInfo.project.name !== 'mobile') {
    await expect(page.getByRole('link', { name: 'Playground' }).first()).toBeVisible();
  }
  await page.locator('figure.shiki button[aria-label="Copy Text"]').first().click();
  await expect(page.getByRole('status')).toHaveText('Copied to clipboard');
  await page
    .getByRole('button', { name: /Search/ })
    .first()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const searchOverlay = page.locator('.fumadocs-search-overlay');
  await expect(searchOverlay).toBeVisible();
  await expect(searchOverlay).toHaveCSS('backdrop-filter', /blur/);
  const searchInput = page.getByRole('textbox', { name: 'Search documentation' });
  await expect(searchInput).toHaveCSS('outline-style', 'none');
  await searchInput.fill('styling');
  await expect(
    page
      .getByRole('dialog')
      .getByRole('button', { name: /Styling/ })
      .first(),
  ).toBeVisible();
  await searchInput.fill('qxzvplmokn');
  await expect(page.getByText(/No results for/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('playground filters, shows source, and opens the install sheet', async ({ page }) => {
  await page.goto('/playground');
  await expect(page.getByRole('heading', { name: /find your next tag input/i })).toBeVisible();
  await page.getByRole('radio', { name: 'Integrations', exact: true }).click();
  const card = page.locator('#tag-input-popover');
  await expect(card).toBeVisible();
  await card.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(card.locator('.code-block')).toContainText("from 'emblor'");
  await expect(card.locator('figure.shiki')).toBeVisible();
  await card.locator('.code-copy-button').click();
  await expect(page.locator('.toast-card[role="status"]')).toHaveText('Copied to clipboard');
  const installButton = card.getByRole('button', { name: 'Install', exact: true });
  await installButton.click({ force: true });
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/shadcn@latest add @emblor/i)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(installButton).toBeFocused();
});

test('playground mounts distant previews only when they approach the viewport', async ({ page }) => {
  await page.goto('/playground');
  await expect(page.locator('.playground-catalog')).toHaveAttribute('data-hydrated', 'true');
  const previews = page.locator('.lazy-preview');
  const reorder = page.locator('#tag-input-reorder .lazy-preview');

  await expect(previews).toHaveCount(10);
  expect(await page.locator('.lazy-preview[data-rendered="true"]').count()).toBeLessThan(10);
  await expect(reorder).not.toHaveAttribute('data-rendered', 'true');

  await reorder.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await expect(reorder).toHaveAttribute('data-rendered', 'true');
  await expect(page.locator('#tag-input-reorder').getByRole('button', { name: 'Move react right' })).toBeVisible();
});

test('focused preview exposes real direction, width, and component states', async ({ page }) => {
  await page.goto('/playground/tag-input-basic');
  const focusButton = page.getByRole('button', { name: 'Focus Basic compound field preview' });
  await expect(focusButton).toBeEnabled();
  await focusButton.click();

  const dialog = page.getByRole('dialog');
  const stage = dialog.locator('.focused-preview-stage');
  const canvas = dialog.locator('.focused-preview-canvas');
  const input = dialog.getByPlaceholder(/Add a skill|Maximum reached/);

  await expect(dialog).toBeVisible();
  await dialog.getByRole('radio', { name: 'RTL' }).click();
  await expect(canvas).toHaveAttribute('dir', 'rtl');

  await dialog.getByRole('radio', { name: 'Phone' }).click();
  await expect(stage).toHaveAttribute('data-preview-width', 'phone');

  await dialog.getByRole('radio', { name: 'Disabled' }).click();
  await expect(input).toBeDisabled();

  await dialog.getByRole('radio', { name: 'Read-only' }).click();
  await expect(input).toHaveAttribute('readonly', '');

  await dialog.getByRole('radio', { name: 'Invalid' }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');

  await dialog.getByRole('radio', { name: 'At limit' }).click();
  await expect(input).toHaveAttribute('placeholder', 'Maximum reached');
});

test('long documentation code keeps its copy action available while scrolled', async ({ page }) => {
  await page.goto('/docs/introduction');
  const figure = page.locator('figure.shiki').first();
  const copy = figure.getByRole('button', { name: 'Copy Text' });
  const region = figure.locator('[role="region"]');
  const before = await copy.boundingBox();

  await region.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });

  const after = await copy.boundingBox();
  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(Math.abs((before?.x ?? 0) - (after?.x ?? 0))).toBeLessThanOrEqual(1);
  await expect(copy).toBeInViewport();
});

test('the table of contents follows the active heading on long pages', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile');
  await page.goto('/docs/introduction');
  const heading = page.getByRole('heading', { name: 'What you own' });
  await heading.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -80));
  await expect(page.locator('#nd-toc a[href="#what-you-own"]')).toHaveAttribute('data-active', 'true');
});

test('all playground examples expose their intended behavior', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/playground');
  await expect(page.locator('.playground-catalog')).toHaveAttribute('data-hydrated', 'true');

  async function activate(selector: string) {
    const example = page.locator(selector);
    const lazyPreview = example.locator('.lazy-preview');
    await lazyPreview.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await expect(lazyPreview).toHaveAttribute('data-rendered', 'true');
    return example;
  }

  const basic = await activate('#tag-input-basic');
  await basic.getByPlaceholder('Add a skill').fill('design');
  await basic.getByPlaceholder('Add a skill').press('Enter');
  await expect(basic.getByText('design', { exact: true })).toBeVisible();

  const controlled = await activate('#tag-input-controlled');
  await controlled.getByPlaceholder('Add a technology').fill('typescript');
  await controlled.getByPlaceholder('Add a technology').press('Enter');
  await expect(controlled.locator('output')).toContainText('["react","typescript"]');

  const validation = await activate('#tag-input-validation');
  await validation.getByPlaceholder('Add #hashtag').fill('invalid');
  await validation.getByPlaceholder('Add #hashtag').press('Enter');
  await expect(validation.getByText(/must begin with #/)).toBeVisible();
  await validation.getByPlaceholder('Add #hashtag').fill('');
  await validation.getByPlaceholder('Add #hashtag').fill('#valid');
  await validation.getByPlaceholder('Add #hashtag').press('Enter');
  await expect(validation.getByText('#valid', { exact: true })).toBeVisible();

  const form = await activate('#tag-input-native-form');
  await form.getByPlaceholder('Add a skill').fill('typescript');
  await form.getByPlaceholder('Add a skill').press('Enter');
  await form.getByRole('button', { name: 'Read FormData' }).click();
  await expect(form.locator('output')).toContainText('["react","typescript"]');
  await form.getByRole('button', { name: 'Reset' }).click();
  await expect(form.locator('output')).toHaveText('Submit to inspect FormData');

  const reactHookForm = await activate('#tag-input-react-hook-form');
  await reactHookForm.getByRole('button', { name: 'Save skills' }).click();
  await expect(reactHookForm.getByRole('alert')).toHaveText('Add at least two skills.');
  await reactHookForm.getByPlaceholder('Add a skill').fill('typescript');
  await reactHookForm.getByPlaceholder('Add a skill').press('Enter');
  await reactHookForm.getByRole('button', { name: 'Save skills' }).click();
  await expect(reactHookForm.locator('output')).toContainText('["react","typescript"]');

  const accessible = await activate('#tag-input-accessibility');
  await accessible.getByPlaceholder('Add a topic').fill('x');
  await accessible.getByPlaceholder('Add a topic').press('Enter');
  await expect(accessible.getByRole('alert')).toHaveText('Enter at least three characters.');
  await accessible.getByPlaceholder('Add a topic').fill('');
  await accessible.getByPlaceholder('Add a topic').fill('testing');
  await accessible.getByPlaceholder('Add a topic').press('Enter');
  await expect(accessible.getByRole('alert')).toHaveCount(0);

  const constraints = await activate('#tag-input-constraints');
  const constraintsInput = constraints.getByPlaceholder('Paste comma-separated tags');
  await constraintsInput.fill('react');
  await constraintsInput.press('Enter');
  await expect(constraints.locator('output')).toHaveText('That tag already exists.');
  await constraintsInput.fill('');
  await constraintsInput.evaluate((input) => {
    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: () => 'typescript;accessibility' },
    });
    input.dispatchEvent(event);
  });
  await expect(constraints.getByText('typescript', { exact: true })).toBeVisible();
  await expect(constraints.getByText('accessibility', { exact: true })).toBeVisible();
  await expect(constraints.locator('output')).toHaveText('2 tags added from paste.');

  const suggestions = await activate('#tag-input-popover');
  await suggestions.getByPlaceholder('Search suggestions').click();
  await page.getByRole('option', { name: 'typescript' }).click();
  await expect(suggestions.getByText('typescript', { exact: true })).toBeVisible();

  const dialogExample = await activate('#tag-input-dialog');
  const dialogTrigger = dialogExample.getByRole('button', { name: 'Edit topics' });
  await dialogTrigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Edit topics' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Done' }).click();
  await expect(dialog).toBeHidden();
  await expect(dialogTrigger).toBeFocused();

  const reorder = await activate('#tag-input-reorder');
  await reorder.getByRole('button', { name: 'Move react right' }).click();
  await expect(reorder.getByRole('listitem').first()).toContainText('typescript');
});

test('key pages have no automatically detectable accessibility violations', async ({ page }) => {
  for (const path of [
    '/',
    '/docs/introduction',
    '/playground',
    '/playground/tag-input-popover',
    '/playground/tag-input-react-hook-form',
    '/playground/tag-input-constraints',
  ]) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${path}: ${results.violations.map((violation) => violation.id).join(', ')}`).toEqual(
      [],
    );
  }
});

test('internal navigation does not expose broken destinations', async ({ page, request }) => {
  await page.goto('/docs/introduction');
  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) =>
      Array.from(new Set(links.map((link) => (link as HTMLAnchorElement).getAttribute('href')).filter(Boolean))),
    );

  for (const href of hrefs) {
    const response = await request.get(href!);
    expect(response.status(), `${href} returned ${response.status()}`).toBeLessThan(400);
  }
});

test('docs overview routes lead directly to useful pages', async ({ page }) => {
  await page.goto('/docs');
  await expect(page).toHaveURL(/\/docs\/introduction$/);
  await page.goto('/docs/guides');
  await expect(page).toHaveURL(/\/docs\/guides\/styling$/);
  await page.goto('/docs/reference');
  await expect(page).toHaveURL(/\/docs\/reference\/api$/);
});

test('every docs page reflows at the supported layout widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  test.setTimeout(120_000);

  const routes = [
    '/docs/introduction',
    '/docs/installation',
    '/docs/anatomy',
    '/docs/guides/styling',
    '/docs/guides/state-management',
    '/docs/guides/validation',
    '/docs/guides/constraints-and-interactions',
    '/docs/guides/forms',
    '/docs/guides/accessibility',
    '/docs/guides/keyboard-and-focus',
    '/docs/guides/composition-and-polymorphism',
    '/docs/guides/integrations',
    '/docs/guides/migration',
    '/docs/reference/api',
    '/docs/reference/troubleshooting',
    '/docs/reference/examples',
    '/playground',
  ];

  for (const width of [390, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(1);

      if (route.startsWith('/docs/')) {
        const metrics = await page.evaluate(() => {
          const layoutRoot = document.querySelector('#nd-docs-layout');
          const configuredWidth = layoutRoot
            ? Number.parseFloat(getComputedStyle(layoutRoot).getPropertyValue('--fd-layout-width'))
            : Number.NaN;
          const title = document.querySelector('#nd-page > h1')?.getBoundingClientRect();
          const subtitle = document.querySelector('#nd-page > p')?.getBoundingClientRect();
          const prose = document.querySelector('#nd-page > .prose')?.getBoundingClientRect();
          const firstNav = Array.from(document.querySelectorAll('#nd-sidebar a'))
            .find((link) => link.textContent?.trim() === 'Introduction')
            ?.getBoundingClientRect();
          const tocTitle = document.querySelector('#nd-toc > h3')?.getBoundingClientRect();

          return {
            viewportWidth: document.documentElement.clientWidth,
            configuredWidth: Number.isFinite(configuredWidth) ? configuredWidth : null,
            firstNavLeft: firstNav?.left ?? null,
            title: title && { left: title.left, right: title.right, top: title.top, bottom: title.bottom },
            titleSubtitleGap: title && subtitle ? subtitle.top - title.bottom : null,
            subtitleContentGap: subtitle && prose ? prose.top - subtitle.bottom : null,
            desktopTopSpread:
              title && firstNav && tocTitle
                ? Math.max(title.top, firstNav.top, tocTitle.top) - Math.min(title.top, firstNav.top, tocTitle.top)
                : null,
          };
        });

        expect(metrics.titleSubtitleGap, `${route} title/subtitle gap at ${width}px`).toBeGreaterThanOrEqual(4);
        expect(metrics.titleSubtitleGap, `${route} title/subtitle gap at ${width}px`).toBeLessThanOrEqual(24);
        expect(metrics.subtitleContentGap, `${route} subtitle/content gap at ${width}px`).toBeGreaterThanOrEqual(20);
        expect(metrics.subtitleContentGap, `${route} subtitle/content gap at ${width}px`).toBeLessThanOrEqual(48);

        if (width < 768 && metrics.title) {
          expect(metrics.title.left, `${route} left mobile gutter`).toBeGreaterThanOrEqual(16);
          expect(metrics.title.right, `${route} right mobile gutter`).toBeLessThanOrEqual(width - 16);
        }

        if (width >= 1280 && metrics.configuredWidth && metrics.firstNavLeft !== null) {
          expect(metrics.configuredWidth, `${route} docs shell width`).toBe(1280);
          const expectedShellLeft =
            (metrics.viewportWidth - Math.min(metrics.configuredWidth, metrics.viewportWidth)) / 2;
          expect(
            Math.abs(metrics.firstNavLeft - expectedShellLeft),
            `${route} centered docs shell`,
          ).toBeLessThanOrEqual(20);
          if (width >= 1920 && metrics.desktopTopSpread !== null) {
            expect(metrics.desktopTopSpread, `${route} sidebar/content/TOC top alignment`).toBeLessThanOrEqual(12);
          }
        }
      }
    }
  }
});

test('docs reflow at a 200 percent equivalent and preserve forced-colors controls', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.setViewportSize({ width: 640, height: 700 });
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/docs/reference/api');
  await expect(page.getByRole('heading', { name: 'API reference' })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await page
    .getByRole('button', { name: /Search/ })
    .first()
    .focus();
  await expect(page.getByRole('button', { name: /Search/ }).first()).toBeFocused();
});

test('composition input does not commit until IME composition ends', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/playground/tag-input-basic');
  const field = page.getByPlaceholder('Add a skill');
  await field.focus();
  await field.evaluate((input) => {
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: 'に' }));
  });
  await field.fill('に');
  await field.evaluate((input) => {
    input.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, isComposing: true, key: 'Enter' }),
    );
  });
  await expect(page.getByText('に', { exact: true })).toHaveCount(0);
  await field.evaluate((input) => {
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'に' }));
  });
  await field.press('Enter');
  await expect(page.getByText('に', { exact: true })).toBeVisible();
});

test('touch interaction can add and remove a tag', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/playground/tag-input-basic');
  const field = page.getByPlaceholder('Add a skill');
  await field.tap();
  await field.fill('touch');
  await field.press('Enter');
  await expect(page.getByText('touch', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove touch' }).tap();
  await expect(page.getByText('touch', { exact: true })).toHaveCount(0);
});
