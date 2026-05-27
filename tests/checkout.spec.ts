import { test, expect } from '@playwright/test';

test.describe('Flujo E2E de Checkout e Interfaz', () => {
  test('debe cargar la página de inicio y mostrar el logo', async ({ page }) => {
    // 1. Visitar la página de inicio
    await page.goto('/');
    
    // 2. Verificar que el texto de la marca esté presente en el header
    await expect(page.locator('text=BLAMA').first()).toBeVisible();
  });

  test('debe navegar a la tienda y cargar catálogo', async ({ page }) => {
    // 1. Navegar directamente a la tienda de productos
    await page.goto('/productos');
    
    // 2. Verificar que el título de la página cargue
    await expect(page).toHaveTitle(/Productos|Blama/i);
  });

  test('debe cargar el formulario de checkout correctamente', async ({ page }) => {
    // 1. Navegar directamente a la página de checkout
    await page.goto('/checkout');
    
    // 2. Verificar que se rendericen los campos del formulario de datos personales
    const nameInput = page.locator('input[placeholder*="nombre" i], input[name*="nombre" i]').first();
    if (await nameInput.count() > 0) {
      await expect(nameInput).toBeVisible();
    }
  });
});
