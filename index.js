#!/usr/bin/env node

import { Glob } from "glob";
import fs from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";

// Helper function to flatten nested translation keys
function flattenKeys(obj, parent = "", res = {}) {
  for (const key in obj) {
    const propName = parent ? `${parent}.${key}` : key; // Create the dot-separated key
    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenKeys(obj[key], propName, res); // Recursively flatten the object
    } else {
      res[propName] = obj[key]; // Assign the value to the flattened key
    }
  }
  return res;
}

// Helper function to get all translation keys from the JSON
function getTranslationKeys(jsonFilePath) {
  const translations = fs.readJsonSync(jsonFilePath); // Use fs.readJsonSync from fs-extra
  const flattenedTranslations = flattenKeys(translations);
  return Object.keys(flattenedTranslations);
}

// Helper function to scan source code for translation keys
async function scanForUsedKeys(pattern, translationKeys) {
  console.log(
    chalk.green(
      "-- Scanning source code for translation keys...",
      "pattern:",
      pattern
    )
  );

  const g = new Glob(pattern, { ignore: "node_modules/**" });

  if (g.length === 0) {
    console.log(chalk.yellow(" !! No files found matching the pattern."));
  } else {
    console.log(chalk.green(`-- Checking files: `));
  }

  let usedKeys = new Set();
  for await (const file of g) {
    console.log(` - ${file}`);
    const fileContent = fs.readFileSync(file, "utf-8"); // Use fs.readFileSync from fs-extra
    translationKeys.forEach((key) => {
      const regex = new RegExp(`\\b${key}\\b`, "g");
      if (fileContent.match(regex)) {
        usedKeys.add(key);
      }
    });
  }

  return [...usedKeys];
}

// Helper function to remove unused keys from the translation object
function removeUnusedKeys(translations, unusedKeys) {
  unusedKeys.forEach((key) => {
    const keys = key.split("."); // Split the key into parts
    let currentLevel = translations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (currentLevel[keys[i]] != null) {
        currentLevel = currentLevel[keys[i]]; // Traverse down the hierarchy
      } else {
        return; // If the key doesn't exist, exit
      }
    }
    delete currentLevel[keys[keys.length - 1]]; // Delete the final key
  });
}

// Helper function to recursively remove empty objects
function removeEmptyObjects(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      removeEmptyObjects(obj[key]); // Recursively check for empty objects
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]; // Remove the empty object
      }
    }
  }
}

// Main function
async function run() {
  console.log("");
  console.log(chalk.bgGreen("Translation Cleaner - CLI"));
  console.log("");

  // Ask the user for the translation file path and project details
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "translationFilePath",
      message: "Please enter the path to your translation file:",
      default: "./path/to/translations.json", // Provide a default value or leave it blank
    },
    {
      type: "input",
      name: "projectPath",
      message:
        "Please enter the project root path where you want to check the keys:",
      default: "./", // Provide a default project path (root)
    },
    {
      type: "input",
      name: "fileExtensions",
      message:
        "Please enter the file extensions to check (comma-separated, e.g., js,ts,jsx), or leave blank for all files:",
      default: "js,ts,jsx,tsx", // Provide a default value
    },
  ]);

  const translationFilePath = answers.translationFilePath;
  const projectPath = answers.projectPath;
  const fileExtensions = answers.fileExtensions
    .split(",")
    .map((ext) => ext.trim()); // Split and trim extensions

  // Check if the translation file exists
  if (!fs.existsSync(translationFilePath)) {
    console.log(
      chalk.red(`Translation file not found: ${translationFilePath}`)
    );
    return;
  }

  // Check if the project path exists
  if (!fs.existsSync(projectPath)) {
    console.log(chalk.red(`Project path not found: ${projectPath}`));
    return;
  }

  // Get all translation keys
  const translationKeys = getTranslationKeys(translationFilePath);

  if (translationKeys.length === 0) {
    console.log(chalk.yellow(" !! No keys found in the translation file."));
    return;
  } else {
    console.log(
      chalk.green(
        `-- Found ${translationKeys.length} keys in the translations file.`
      )
    );
  }

  // Construct the glob pattern for the specified file extensions or for all files if left blank
  const pattern =
    fileExtensions.length > 0
      ? `${projectPath}**/*.{${fileExtensions.join(",")}}`
      : `${projectPath}**/*`; // This will match all files

  // Scan for used keys
  const usedKeys = await scanForUsedKeys(pattern, translationKeys);

  const unusedKeys = translationKeys.filter((key) => !usedKeys.includes(key));

  if (unusedKeys.length === 0) {
    console.log(chalk.green("-- All translation keys are in use!"));
    return;
  }

  console.log(chalk.yellow(` !! Found ${unusedKeys.length} unused keys:`));
  unusedKeys.forEach((key) => console.log(`- ${key}`));

  // Ask the user if they want to remove the unused keys
  const { shouldRemove } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldRemove",
      message:
        "Do you want to remove the unused keys from the translation file?",
      default: false,
    },
  ]);

  if (shouldRemove) {
    const translations = fs.readJsonSync(translationFilePath); // Use fs.readJsonSync
    removeUnusedKeys(translations, unusedKeys);
    removeEmptyObjects(translations); // Remove empty objects from translations

    fs.writeJsonSync(translationFilePath, translations, { spaces: 2 }); // Use fs.writeJsonSync
    console.log(chalk.green("-- Unused keys removed successfully!"));
  } else {
    console.log(chalk.green("-- No keys were removed."));
  }

  console.log("");
  console.log(chalk.bgGreen("Thanks for using Translation Cleaner - CLI!"));
  console.log("");
}

run();
