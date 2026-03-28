import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";

const rootDir = process.cwd();
const baseUrl = "http://127.0.0.1:3002";
const envFiles = [".env.local", ".env"];
const pageExpectations = [
  {
    path: "/",
    heading: /calm care, clear guidance, and a peaceful presence/i,
    title: /Kansas City Birth Doula Support/i,
  },
  {
    path: "/about",
    heading: /^about$/i,
    level: 1,
    title: /About Your Doula/i,
  },
  {
    path: "/services",
    heading: /peaceful offerings/i,
    level: 1,
    title: /Doula Services in Kansas City/i,
  },
  {
    path: "/consultation",
    heading: /reserve a thoughtful conversation without leaving the site/i,
    level: 1,
    title: /Book a Doula Consultation/i,
  },
  {
    path: "/birth-plan-builder",
    heading: /build your birth plan/i,
    level: 1,
    title: /Birth Plan Builder/i,
  },
  {
    path: "/pregnancy-timeline",
    heading: /pregnancy timeline/i,
    level: 1,
    title: /Pregnancy Timeline/i,
  },
  {
    path: "/quiz",
    heading: /a gentle way to figure out what kind of support would help most/i,
    level: 1,
    title: /Doula Support Quiz/i,
  },
  {
    path: "/blog",
    heading: /^blog$/i,
    level: 1,
    title: /Birth Resources and Community/i,
  },
  {
    path: "/contact",
    heading: /reach out with a question/i,
    level: 1,
    title: /Contact The Missing Peace/i,
  },
];

const checks = [];

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const entries = {};

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key) {
      entries[key] = value;
    }
  }

  return entries;
}

function buildAuditEnv() {
  const fileEnv = {};

  for (const relativePath of envFiles) {
    const absolutePath = path.join(rootDir, relativePath);

    if (fs.existsSync(absolutePath)) {
      Object.assign(fileEnv, parseEnvFile(absolutePath));
    }
  }

  return {
    ...fileEnv,
    ...process.env,
  };
}

const auditEnv = buildAuditEnv();

function parseEnvExample(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=")[0]?.trim())
    .filter(Boolean);
}

function runCommand(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env: auditEnv,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      resolve({
        ok: code === 0,
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    });
  });
}

function addCheck(name, ok, details, scored = true) {
  checks.push({ name, ok, details, scored });
}

function summarizeCommand(result) {
  return result.ok
    ? result.stdout || "Completed successfully."
    : result.stderr || result.stdout || `Exited with code ${result.code}`;
}

async function waitForServer(url, timeoutMs = 120000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return true;
      }
    } catch {
      // keep polling
    }

    await delay(1000);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function withServer(runAudit) {
  const server = spawn(
    "npm",
    ["run", "start", "--", "--hostname", "127.0.0.1", "--port", "3002"],
    {
      cwd: rootDir,
      env: auditEnv,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let serverOutput = "";

  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer(baseUrl);
    return await runAudit();
  } finally {
    server.kill("SIGTERM");
    await delay(500);

    if (!server.killed) {
      server.kill("SIGKILL");
    }

    if (serverOutput.trim()) {
      addCheck("Server startup log", true, serverOutput.trim(), false);
    }
  }
}

async function auditHttpResponses() {
  const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
  const robotsText = await robotsResponse.text();
  addCheck(
    "robots.txt is present",
    robotsResponse.ok && /Sitemap:/i.test(robotsText),
    robotsResponse.ok
      ? robotsText
      : `robots.txt request failed with status ${robotsResponse.status}`
  );

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  const sitemapText = await sitemapResponse.text();
  addCheck(
    "sitemap.xml is present",
    sitemapResponse.ok && /<urlset/i.test(sitemapText),
    sitemapResponse.ok
      ? sitemapText
      : `sitemap.xml request failed with status ${sitemapResponse.status}`
  );
}

async function auditBrowser() {
  const browser = await chromium.launch();
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleIssues = [];
  const pageErrors = [];

  for (const page of [desktopPage, mobilePage]) {
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleIssues.push(`[${page.url() || "unknown"}] ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => {
      pageErrors.push(`[${page.url() || "unknown"}] ${error.message}`);
    });
  }

  let pageRenderingOk = true;
  const pageRenderingNotes = [];

  for (const page of [desktopPage, mobilePage]) {
    await page.route("**/api/consultation/availability?**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          date: "2026-04-06",
          timeZone: "America/Chicago",
          slots: [],
        }),
      });
    });
  }

  for (const expectation of pageExpectations) {
    await desktopPage.goto(`${baseUrl}${expectation.path}`, {
      waitUntil: "networkidle",
    });

    const headingVisible = await desktopPage
      .getByRole("heading", {
        name: expectation.heading,
        level: expectation.level,
      })
      .isVisible()
      .catch(() => false);
    const pageTitle = await desktopPage.title();

    if (!headingVisible) {
      pageRenderingOk = false;
      pageRenderingNotes.push(`Missing expected heading on ${expectation.path}`);
    }

    if (!expectation.title.test(pageTitle)) {
      pageRenderingOk = false;
      pageRenderingNotes.push(
        `Unexpected title on ${expectation.path}: "${pageTitle}"`
      );
    }
  }

  addCheck(
    "Key routes render with expected headings and titles",
    pageRenderingOk,
    pageRenderingOk
      ? "Verified homepage, about, services, consultation, birth plan builder, pregnancy timeline, quiz, blog, and contact."
      : pageRenderingNotes.join("\n")
  );

  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.getByRole("button", { name: /toggle navigation menu/i }).click();
  const mobileNavVisible = await mobilePage
    .getByRole("navigation", { name: /primary navigation/i })
    .isVisible()
    .catch(() => false);
  const heroVisible = await mobilePage
    .getByRole("heading", {
      name: /calm care, clear guidance, and a peaceful presence/i,
    })
    .isVisible()
    .catch(() => false);

  addCheck(
    "Responsive design basics",
    mobileNavVisible && heroVisible,
    mobileNavVisible && heroVisible
      ? "Verified desktop/mobile headline visibility and mobile navigation."
      : "Desktop or mobile responsive checks failed."
  );

  await desktopPage.route("**/api/contact", async (route) => {
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

  await desktopPage.goto(`${baseUrl}/contact`, { waitUntil: "networkidle" });
  await desktopPage.getByRole("button", { name: /send message/i }).click();
  const validationMessage = desktopPage.getByText(
    "Please provide an email address."
  );
  const validationVisible = await validationMessage
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  await desktopPage.getByLabel("Full Name").fill("Jane Doe");
  await desktopPage.getByLabel("Email").fill("jane@example.com");
  await desktopPage
    .getByLabel("Personal Message")
    .fill("Checking production readiness.");
  await desktopPage.getByRole("button", { name: /send message/i }).click();
  const successMessage = desktopPage.getByText(
    /thanks for reaching out\. we received your message and sent a confirmation to your email\./i
  );
  const successVisible = await successMessage
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  addCheck(
    "Contact form validation and submission",
    validationVisible && successVisible,
    validationVisible && successVisible
      ? "Validation messages and real success state copy were both verified."
      : "Contact form validation or submission workflow failed."
  );

  const consoleOk = consoleIssues.length === 0 && pageErrors.length === 0;
  addCheck(
    "No browser console errors",
    consoleOk,
    consoleOk
      ? "No console errors or page errors were captured during the audit."
      : [...consoleIssues, ...pageErrors].join("\n")
  );

  await browser.close();
}

async function main() {
  const envExamplePath = path.join(rootDir, ".env.example");
  const envKeys = fs.existsSync(envExamplePath) ? parseEnvExample(envExamplePath) : [];
  const requiredEnvChecks = [
    ["NEXT_PUBLIC_SITE_URL", "SITE_URL"],
    ["SENDGRID_API_KEY"],
    ["CONTACT_FROM_EMAIL"],
    ["CONTACT_TO_EMAIL"],
    ["GOOGLE_CLIENT_ID"],
    ["GOOGLE_CLIENT_SECRET"],
    ["GOOGLE_REFRESH_TOKEN"],
    ["GOOGLE_CALENDAR_ID"],
    ["CONSULTATION_TIMEZONE"],
    ["UPSTASH_REDIS_REST_URL"],
    ["UPSTASH_REDIS_REST_TOKEN"],
  ];
  const missingEnvKeys = requiredEnvChecks
    .filter((group) => !group.some((key) => auditEnv[key]))
    .map((group) => group.join(" or "));

  addCheck(
    "Environment variables",
    missingEnvKeys.length === 0,
    envKeys.length === 0
      ? "No required environment variables are currently defined in .env.example."
      : missingEnvKeys.length === 0
        ? `All required environment variables are set. Example file keys available: ${envKeys.join(", ")}`
        : `Missing environment variables: ${missingEnvKeys.join(", ")}`
  );

  const lintResult = await runCommand("npm", ["run", "lint"]);
  addCheck("Lint passes", lintResult.ok, summarizeCommand(lintResult));

  const typecheckResult = await runCommand("npm", ["run", "typecheck"]);
  addCheck("Typecheck passes", typecheckResult.ok, summarizeCommand(typecheckResult));

  const testResult = await runCommand("npm", ["test"]);
  addCheck("Unit and component tests pass", testResult.ok, summarizeCommand(testResult));

  const buildResult = await runCommand("npm", ["run", "build"]);
  addCheck("Production build passes", buildResult.ok, summarizeCommand(buildResult));

  const e2eResult = buildResult.ok
    ? await runCommand("npm", ["run", "test:e2e"])
    : {
        ok: false,
        code: 1,
        stdout: "",
        stderr: "Skipped because the production build did not succeed.",
      };
  addCheck("End-to-end tests pass", e2eResult.ok, summarizeCommand(e2eResult));

  if (buildResult.ok) {
    await withServer(async () => {
      await auditHttpResponses();
      await auditBrowser();
    });
  } else {
    addCheck(
      "robots.txt is present",
      false,
      "Skipped because the production build did not succeed."
    );
    addCheck(
      "sitemap.xml is present",
      false,
      "Skipped because the production build did not succeed."
    );
    addCheck(
      "Key routes render with expected headings and titles",
      false,
      "Skipped because the production build did not succeed."
    );
    addCheck(
      "Responsive design basics",
      false,
      "Skipped because the production build did not succeed."
    );
    addCheck(
      "Contact form validation and submission",
      false,
      "Skipped because the production build did not succeed."
    );
    addCheck(
      "No browser console errors",
      false,
      "Skipped because the production build did not succeed."
    );
  }

  const scoredChecks = checks.filter((check) => check.scored);
  const passedChecks = scoredChecks.filter((check) => check.ok);
  const score = Math.round((passedChecks.length / scoredChecks.length) * 100);

  console.log("\nProduction Readiness Audit");
  console.log("==========================\n");

  for (const check of checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"}  ${check.name}`);
    if (check.details) {
      console.log(`${check.details}\n`);
    }
  }

  console.log(`Readiness score: ${score}/100`);

  if (score < 100) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Production readiness audit failed to run.");
  console.error(error);
  process.exit(1);
});
