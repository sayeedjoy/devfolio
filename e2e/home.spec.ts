import { expect, test } from "@playwright/test"

test("home page renders and exposes the primary navigation", async ({
  page,
}) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Sayeed Joy/)
  await expect(
    page.getByRole("heading", { level: 1, name: /Sayeed Joy/ })
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "/BLOG" })).toBeVisible()
})
