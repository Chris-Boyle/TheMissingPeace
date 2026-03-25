import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";

const rootDir = process.cwd();
const baseUrl = "http://127.0.0.1:3002";
const pageExpectations = [
  { path: "/", heading: /calm care, clear guidance, and a peaceful presence/i },
  { path: "/about", heading: /^about$/i },
  { path: "/services", heading: /peaceful offerings/i },
  { path: "/birth-plan-builder", heading: /build your birth plan/i },
  { path: "/blog", heading: /^blog$/i },
  { path: "/contact", heading: /^contact$/i },
];

const checks = [];

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
      env: process.env,
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

async function waitForServer(url, timeoutMs = 120000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return true;
      }
    } catch {
      // Keep polling until timeout.
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
      env: process.env,
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
      checks.push({
        name: "Server startup log",
        ok: true,
        details: serverOutput.trim(),
        scored: false,
      });
    }
  }
}

function addCheck(name, ok, details, scored = true) {
  checks.push({ name, ok, details, scored });
}

function summarizeCommand(result) {
  return result.ok
    ? result.stdout || "Completed successfully."
    : result.stderr || result.stdout || `Exited with code ${result.code}`;
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

  for (const expectation of pageExpectations) {
    await desktopPage.goto(`${baseUrl}${expectation.path}`, { waitUntil: "networkidle" });
    const heading = desktopPage.getByRole("heading", { name: expectation.heading });
    const headingVisible = await heading.isVisible().catch(() => false);

    if (!headingVisible) {
      pageRenderingOk = false;
      pageRenderingNotes.push(`Missing expected heading on ${expectation.path}`);
    }
  }

  addCheck(
    "All pages render without errors",
    pageRenderingOk,
    pageRenderingOk
      ? "Verified /, /about, /services, /birth-plan-builder, /blog, and /contact."
      : pageRenderingNotes.join("\n")
  );

  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.getByRole("button", { name: /toggle navigation menu/i }).click();
  const mobileNavVisible = await mobilePage
    .getByRole("navigation", { name: /primary navigation/i })
    .isVisible()
    .catch(() => false);

  await desktopPage.goto(baseUrl, { waitUntil: "networkidle" });
  const heroVisible = await desktopPage
    .getByRole("heading", {
      name: /calm care, clear guidance, and a peaceful presence/i,
    })
    .isVisible()
    .catch(() => false);

  addCheck(
    "Responsive design basics",
    mobileNavVisible && heroVisible,
    mobileNavVisible && heroVisible
      ? "Verified desktop hero visibility and mobile menu navigation."
      : "Desktop or mobile responsive checks failed."
  );

  await desktopPage.goto(`${baseUrl}/contact`, { waitUntil: "networkidle" });
  await desktopPage.getByRole("button", { name: /send message/i }).click();
  const validationVisible = await desktopPage
    .getByText("Please provide an email address.")
    .isVisible()
    .catch(() => false);

  await desktopPage.getByLabel("Full Name").fill("Jane Doe");
  await desktopPage.getByLabel("Email").fill("jane@example.com");
  await desktopPage.getByLabel("Personal Message").fill("Checking production readiness.");
  await desktopPage.getByRole("button", { name: /send message/i }).click();
  const successVisible = await desktopPage
    .getByText(/thank you! your message has been received/i)
    .isVisible()
    .catch(() => false);

  addCheck(
    "Form validation and submission",
    validationVisible && successVisible,
    validationVisible && successVisible
      ? "Validation messages and success state both verified."
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
  const missingEnvKeys = envKeys.filter((key) => !process.env[key]);

  addCheck(
    "Environment variables",
    missingEnvKeys.length === 0,
    envKeys.length === 0
      ? "No required environment variables are currently defined in .env.example."
      : missingEnvKeys.length === 0
        ? `All required environment variables are set: ${envKeys.join(", ")}`
        : `Missing environment variables: ${missingEnvKeys.join(", ")}`
  );

  const lintResult = await runCommand("npm", ["run", "lint"]);
  addCheck("Lint passes", lintResult.ok, summarizeCommand(lintResult));

  const testResult = await runCommand("npm", ["test"]);
  addCheck("Unit and component tests pass", testResult.ok, summarizeCommand(testResult));

  const buildResult = await runCommand("npm", ["run", "build"]);
  addCheck("Production build passes", buildResult.ok, summarizeCommand(buildResult));

  if (buildResult.ok) {
    await withServer(auditBrowser);
  } else {
    addCheck(
      "All pages render without errors",
      false,
      "Skipped because the production build did not succeed."
    );
    addCheck(
      "Responsive design basics",
      false,
      "Skipped because the production build did not succeed."
    );
    addCheck(
      "Form validation and submission",
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
    const symbol = check.ok ? "PASS" : "FAIL";
    console.log(`${symbol}  ${check.name}`);
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
