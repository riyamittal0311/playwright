//@ts-check
// Adding this tell the playwright that test are written in js if we remove the above tag , then it states that test are written in typrescript

// by default Tests are written in typescript and can lang can be changed to javaScript

// for debugging use an vscode extension Playwright Test for VSCode

// npx playwright test => this cmd runs the test cases in headless mode which is by default
// npx playwright test --headed => this cmd runs the test cases in a browser

// ALL Test run in parallel -> can be modified in playwright config

// page is equivalent to a new instance of the browser, so every test has its own browser instance as a 
// result test are isolated from each other



import { test, expect } from "@playwright/test";

const fillFirstForm = async (page) => {
    await page.locator("#fname").type("Hello");
    await page.locator("#des").type("this is a test description by playwright");
    await page.locator("#mobile").type("1234567891");
    await page.locator("#email").type("test@gmail.com");
  };
  
  const fillSecondForm = async (page) => {
    // how to select a value from an option
    await page.locator("#se").selectOption("Service 3");
    await page.locator("#ed").selectOption("higher");
  
    // fill the value of an input
    //It focuses the element and triggers an input event with the entered text
    await page.locator("#time").fill("12:12");
    await page.locator("#time1").fill("22:12");
  };

test.describe("login page", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://pawansattawan.github.io/profrea/");
  });

  test("check that page url contains pawansattawan", async ({ page }) => {
    // url contains pawansattawan
    await expect(page).toHaveURL(/.*pawansattawan/);
  });

  test("Check form have typed value", async ({ page }) => {
    // select one img
    await page.locator(".pp>input[type=file]").setInputFiles("asserts/flower.jpg");

    await fillFirstForm(page);

    // page.locator takes  a selector , the way one can find the  element in the dom
    const fName = page.locator("#fname");
    // gets the input value
    const fValue = await fName.inputValue();
    //checks that fname has hello
    expect(fValue).toBe("Hello");

    expect(await page.locator("#des").inputValue()).toBe(
      "this is a test description by playwright"
    );
    expect(await page.locator("#mobile").inputValue()).toBe("1234567891");
    expect(await page.locator("#email").inputValue()).toBe("test@gmail.com");
  });

  test("next btn is visible and fill 2nd form", async ({ page }) => {
    await fillFirstForm(page);

    const nextBtn = page.locator("fieldset>.next.sx.action-button");

    //check next button is visible in the dom
    await expect(nextBtn).toBeVisible();

    //click on next btn
    await nextBtn.click();

    // getting the heading tag whose innerHtml value is Other Details
    await expect(
      page.getByRole("heading", { name: "Other Details" })
    ).toBeVisible();

    // 2nd form

    const serviceVale = await page.locator("#se").inputValue();
    expect(serviceVale).toBe("");
    await fillSecondForm(page);

    expect(await page.locator("#se").inputValue()).toBe("Service 3");
    expect(await page.locator("#ed").inputValue()).toBe("higher");
    expect(await page.locator("#time").inputValue()).toBe("12:12");
    expect(await page.locator("#time1").inputValue()).toBe("22:12");
  });

  test("click on next btn after filling 1st and 2nd form", async ({ page }) => {
    await fillFirstForm(page);
    await page.locator("fieldset>.next.sx.action-button").click();
    await fillSecondForm(page);

    // check next btn is visible and click in that
    await expect(page.locator(".next.q.action-button")).toBeVisible();
    await page.locator(".next.q.action-button").click();
    await expect(page.locator("#time")).not.toBeVisible();
  });
});
