import { expect, test } from "@playwright/test";

test("consultation booking completes with mocked availability and booking APIs", async ({
  page,
}) => {
  await page.route("**/api/consultation/availability?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: "2026-04-06",
        timeZone: "America/Chicago",
        slots: [
          {
            startTime: "2026-04-06T15:00:00.000Z",
            endTime: "2026-04-06T15:30:00.000Z",
            label: "10:00 AM",
          },
          {
            startTime: "2026-04-06T16:00:00.000Z",
            endTime: "2026-04-06T16:30:00.000Z",
            label: "11:00 AM",
          },
        ],
      }),
    });
  });

  await page.route("**/api/consultation/book", async (route) => {
    const request = route.request();
    const body = request.postDataJSON();

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        displayTime: "Monday, April 6 at 10:00 AM",
        booking: {
          fullName: body.fullName,
          email: body.email,
        },
      }),
    });
  });

  await page.goto("/consultation");

  await expect(
    page.getByRole("heading", {
      name: /reserve a thoughtful conversation without leaving the site/i,
    })
  ).toBeVisible();

  await expect(page.getByRole("button", { name: "10:00 AM" })).toBeVisible();
  await page.getByRole("button", { name: "10:00 AM" }).click();
  await page.getByLabel(/full name/i).fill("Jamie Rivera");
  await page.getByLabel(/^email$/i).fill("jamie@example.com");
  await page.getByLabel(/phone \(optional\)/i).fill("555-111-2222");
  await page
    .getByLabel(/short note \(optional\)/i)
    .fill("Looking for support and next steps.");
  await page.getByRole("button", { name: /confirm consultation/i }).click();

  await expect(
    page.getByRole("heading", { name: /you're on the calendar/i })
  ).toBeVisible();
  await expect(
    page.getByText(/monday, april 6 at 10:00 am/i)
  ).toBeVisible();
  await expect(
    page.getByText(/confirmation contact: jamie@example.com/i)
  ).toBeVisible();
});
