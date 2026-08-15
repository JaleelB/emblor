import { expect, test } from '@playwright/test';

test('submits repeated values and routes native required invalid focus to Input', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('repeated-input')).toHaveValue('');
  const repeatedValues = await page.getByTestId('repeated-form').evaluate((form) => {
    return Array.from(new FormData(form as HTMLFormElement).getAll('skills[]'));
  });
  expect(repeatedValues).toEqual(['one', 'two']);

  await page.getByTestId('required-submit').click();
  await expect(page.getByTestId('required-input')).toBeFocused();
  await expect(page.getByTestId('required-input')).toHaveAttribute('aria-invalid', 'true');
});

test('keeps disabled/read-only form participation and restores uncontrolled reset state', async ({ page }) => {
  await page.goto('/');

  const participationValues = await page.getByTestId('participation-form').evaluate((form) => ({
    disabled: new FormData(form as HTMLFormElement).getAll('disabled'),
    readonly: new FormData(form as HTMLFormElement).getAll('readonly'),
  }));
  expect(participationValues).toEqual({ disabled: [], readonly: ['readonly'] });

  await page.getByTestId('reset-input').fill('changed draft');
  await page.getByTestId('reset-root').getByTestId('remove-0').click();
  await page.getByTestId('reset-button').click();
  await expect(page.getByTestId('reset-input')).toHaveValue('initial draft');
  await expect(page.getByTestId('reset-root').getByTestId('tag-0')).toContainText('initial');
});

test('preserves untouched rejected-paste selection and cancels a stale restoration', async ({ page }) => {
  await page.goto('/');
  const input = page.getByTestId('paste-input');
  await input.focus();
  await input.evaluate((node) => {
    const inputNode = node as HTMLInputElement;
    inputNode.setSelectionRange(0, 5);
    const data = new DataTransfer();
    data.setData('text/plain', 'duplicate');
    node.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data }));
  });
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
  await expect
    .poll(() =>
      input.evaluate((node) => [(node as HTMLInputElement).selectionStart, (node as HTMLInputElement).selectionEnd]),
    )
    .toEqual([0, 5]);

  await input.evaluate((node) => {
    const inputNode = node as HTMLInputElement;
    inputNode.setSelectionRange(0, 5);
    const data = new DataTransfer();
    data.setData('text/plain', 'duplicate');
    node.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data }));
    node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    inputNode.setSelectionRange(2, 2);
  });
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
  await expect
    .poll(() =>
      input.evaluate((node) => [(node as HTMLInputElement).selectionStart, (node as HTMLInputElement).selectionEnd]),
    )
    .toEqual([2, 2]);
});

test('keeps portal focus inside the Root and commits only after whole-Root exit', async ({ page }) => {
  await page.goto('/');

  const portalInput = page.getByTestId('portal-input');
  await portalInput.fill('portal draft');
  await page.getByRole('button', { name: 'Portal label' }).click();
  await expect(portalInput).toHaveValue('portal draft');
  await page.getByTestId('portal-outside').click();
  await expect(portalInput).toHaveValue('');
  await expect(page.getByTestId('portal-root').getByTestId('tag-0')).toContainText('portal draft');
});

test('navigates physical arrows in both LTR and RTL', async ({ page }) => {
  await page.goto('/');

  const ltrInput = page.getByTestId('ltr-direction-input');
  await ltrInput.focus();
  await ltrInput.press('Home');
  await ltrInput.press('ArrowLeft');
  await expect(page.getByTestId('ltr-direction-root').getByTestId('tag-1')).toBeFocused();
  await ltrInput.focus();
  await ltrInput.press('End');
  await ltrInput.press('ArrowRight');
  await expect(page.getByTestId('ltr-direction-root').getByTestId('tag-0')).toBeFocused();

  const rtlInput = page.getByTestId('rtl-direction-input');
  await rtlInput.focus();
  await rtlInput.press('Home');
  await rtlInput.press('ArrowRight');
  await expect(page.getByTestId('rtl-direction-root').getByTestId('tag-1')).toBeFocused();
  await rtlInput.focus();
  await rtlInput.press('End');
  await rtlInput.press('ArrowLeft');
  await expect(page.getByTestId('rtl-direction-root').getByTestId('tag-0')).toBeFocused();
});

test('restores focus after pointer and keyboard removal', async ({ page }) => {
  await page.goto('/');
  const focusRoot = page.getByTestId('focus-root');
  await focusRoot.getByTestId('remove-1').click();
  await expect(focusRoot.getByTestId('tag-1')).toBeFocused();

  await page.reload();
  const keyboardRoot = page.getByTestId('focus-root');
  await keyboardRoot.getByTestId('remove-1').focus();
  await keyboardRoot.getByTestId('remove-1').press('Enter');
  await expect(keyboardRoot.getByTestId('tag-1')).toBeFocused();
});

test('restores focus after accepted Clear and controlled removal acknowledgement', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('clear-focus-action').click();
  await expect(page.getByTestId('clear-focus-input')).toBeFocused();

  const controlledRoot = page.getByTestId('controlled-root');
  await controlledRoot.getByTestId('remove-0').click();
  await expect(page.getByTestId('controlled-input')).toBeFocused();
});

test('keeps focus on the origin when a controlled removal is refused', async ({ page }) => {
  await page.goto('/');
  const refusedRemove = page.getByTestId('refused-root').getByTestId('remove-0');
  await refusedRemove.focus();
  await refusedRemove.press('Enter');
  await expect(refusedRemove).toBeFocused();
});
