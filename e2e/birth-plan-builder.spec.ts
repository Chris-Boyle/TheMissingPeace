import { expect, test } from "@playwright/test";

test("birth plan builder completes the live flow and reaches the summary", async ({
  page,
}) => {
  await page.goto("/birth-plan-builder");

  await expect(
    page.getByRole("heading", { name: /build your birth plan/i })
  ).toBeVisible();

  await page.getByRole("button", { name: /get started/i }).click();

  await expect(page.getByText("Step 1 of 4")).toBeVisible();
  await page.getByLabel("Full Name").fill("Jamie Rivera");
  await page.getByLabel("Email").fill("jamie@example.com");
  await page.getByLabel(/due date/i).fill("2026-09-10");
  await page.getByLabel(/planned birth location/i).selectOption("Birth Center");
  await page
    .getByLabel(/partner \/ support person name/i)
    .fill("Alex Rivera");
  await page.getByRole("button", { name: /^continue$/i }).click();

  await expect(
    page.getByRole("heading", { name: /birth preferences/i })
  ).toBeVisible();
  await page.getByLabel(/quiet room/i).check();
  await page
    .getByLabel(/who would you like present or nearby/i)
    .fill("Alex Rivera and doula support");
  await page.getByLabel(/massage or counterpressure/i).check();
  await page.getByRole("button", { name: /^continue$/i }).click();

  await expect(
    page.getByRole("heading", {
      name: /interventions & medical preferences/i,
    })
  ).toBeVisible();
  await page
    .getByLabel(/i want to learn about all available pain relief options/i)
    .check();
  await page
    .getByLabel(/please explain options and give me time to decide if possible/i)
    .check();
  await page
    .getByLabel(/additional notes/i)
    .fill("Please slow down the conversation if plans shift.");
  await page.getByRole("button", { name: /review my summary/i }).click();

  await expect(
    page.getByRole("heading", { name: /review your birth plan/i })
  ).toBeVisible();
  await expect(page.getByText("Jamie Rivera")).toBeVisible();
  await expect(page.getByText("Birth Center")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /book a consultation/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /ask a question/i })
  ).toBeVisible();
});
