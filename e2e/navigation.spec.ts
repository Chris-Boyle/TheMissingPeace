import { expect, test } from "@playwright/test";

test("desktop navigation moves through primary pages", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /calm care, clear guidance, and a peaceful presence/i,
    })
  ).toBeVisible();

  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();

  await page.getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(
    page.getByRole("heading", { name: "Peaceful Offerings" })
  ).toBeVisible();

  await page.getByRole("link", { name: "Birth Plan Builder" }).click();
  await expect(page).toHaveURL(/\/birth-plan-builder$/);
  await expect(
    page.getByRole("heading", { name: "Build Your Birth Plan" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Get Started" }).click();
  await expect(
    page.getByRole("heading", { name: "About You" })
  ).toBeVisible();
  await expect(page.getByText("Step 1 of 4")).toBeVisible();

  await page.getByRole("link", { name: "Blog" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();

  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("heading", { name: "Reach out with a question." })
  ).toBeVisible();
});

test("mobile navigation opens from the menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: /toggle navigation menu/i }).click();
  const navigation = page.getByRole("navigation", {
    name: /primary navigation/i,
  });
  await expect(navigation).toBeVisible();

  await navigation
    .getByRole("link", { name: "Birth Plan Builder", exact: true })
    .click();
  await expect(page).toHaveURL(/\/birth-plan-builder$/);
  await expect(
    page.getByRole("heading", { name: "Build Your Birth Plan" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Get Started" }).click();
  await expect(
    page.getByRole("heading", { name: "About You" })
  ).toBeVisible();
});
