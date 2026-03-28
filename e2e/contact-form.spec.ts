import { expect, test } from "@playwright/test";

test("contact form validates required fields and submits successfully", async ({
  page,
}) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message:
          "Thanks for reaching out. We received your message and sent a confirmation to your email.",
      }),
    });
  });

  await page.goto("/contact");

  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText("Please share your name.")).toBeVisible();
  await expect(
    page.getByText("Please provide an email address.")
  ).toBeVisible();
  await expect(
    page.getByText("Please add a short message so I know how to support you.")
  ).toBeVisible();

  await page.getByLabel("Full Name").fill("Jane Doe");
  await page.getByLabel("Email").fill("jane@example.com");
  await page.getByLabel("Phone Number").fill("555-111-2222");
  await page.getByLabel("Preferred Contact Method").selectOption("phone");
  await page.getByLabel("Expected Due Date").fill("2026-07-01");
  await page
    .getByLabel("Personal Message")
    .fill("I would love to book a consultation and learn more about support.");

  await page.getByRole("button", { name: /send message/i }).click();

  await expect(
    page.getByText(
      /thanks for reaching out\. we received your message and sent a confirmation to your email\./i
    )
  ).toBeVisible();
});
