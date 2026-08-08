import { expect, test } from "@playwright/test";

test("abre el portal demo y navega a órdenes", async ({ page }) => {
  await page.goto("/t/demo/inicio");
  await expect(page.getByRole("heading", { name: /Bienvenido/i })).toBeVisible();
  const mobile = (page.viewportSize()?.width ?? 1024) < 820;
  if (mobile) await page.getByRole("button", { name: "Abrir menú" }).click();
  const links = page.getByRole("link", { name: "Órdenes" });
  await (mobile ? links.last() : links.first()).click();
  await expect(page.getByRole("heading", { name: "Órdenes" })).toBeVisible();
});

test("el seguimiento público no expone pagos ni proveedores", async ({ page }) => {
  await page.goto("/seguimiento/demo");
  await expect(page.getByRole("heading", { name: "En reparación" })).toBeVisible();
  await expect(page.getByText(/método de pago|proveedor|costo unitario/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /comprobante PDF/i })).toHaveCount(0);
});
