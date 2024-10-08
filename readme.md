# Translation JSON Cleaner

A command-line tool for cleaning up translation JSON files by removing unused keys and empty objects. This tool helps to keep your translation files organized and efficient by ensuring that only the necessary keys are present.

## Usage Example

After installing the package, you can run the tool from the command line. Below is a step-by-step example of how to use the translation JSON cleaner.

### Step 1: Install the Package

If you haven't already installed the package, you can do so using npm:

```bash
npm install -D translation-json-cleaner
```

### Step 2: Prepare Your Files
Assume you have the following project structure:

```
my-project/
├── src/
│   ├── index.js
│   └── components/
│       ├── Button.js
│       └── Header.js
├── translations/
│   └── en.json
└── package.json
```
Your translations/en.json file might look like this:
```json
{
  "greeting": "Hello",
  "farewell": "Goodbye",
  "nested": {
    "welcome": "Welcome to our application!",
    "thankYou": "Thank you for using our app!"
  }
}
```
### Step 3: Run the Cleaner
Navigate to your project directory and run the translation JSON cleaner:

```bash
translation-json-cleaner
```

### Step 4: Provide the Required Inputs
The tool will prompt you for the following information:
1. Translation File Path: Enter the path to your JSON translation file. For example:
```
./translations/en.json
```
2. Project Path: Enter the root path of your project where the keys will be checked. For example:
```
./
```
3. File Extensions: Enter a comma-separated list of file extensions to scan for translation keys. For example:
```
js,ts,jsx
```

### Step 5: Review the Results
The tool will scan your project files for keys used in your source code and compare them to the keys in your translation JSON file. It will list any unused keys found and ask whether you want to remove them.

### Step 6: Confirm Removal
If there are unused keys, you will see a prompt like this:
```
Unused keys found:
- farewell

Do you want to remove the unused keys and any empty objects? (yes/no)
```
Type yes to confirm removal. The unused keys will be deleted, and any empty objects will also be removed from your translation file.
After running the tool, your translations/en.json file might look like this:
```json
{
  "greeting": "Hello",
  "nested": {
    "welcome": "Welcome to our application!",
    "thankYou": "Thank you for using our app!"
  }
}
```

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Installation
You can install the package globally or as a dependency in your project.

### Globally
To install the CLI tool globally, run:
```bash
npm install -g translation-json-cleaner
```

### As a Dependency
To add it to your project, use:
```bash
npm install translation-json-cleaner -D
```
### Usage
After installation, you can run the tool from the command line:
```bash
translation-json-cleaner
```
It's recommended run this code from the root of your project to ensure that all translation files are cleaned up.

## Prompts

When you run the tool, you will be prompted to provide the following information:

1. **Translation File Path**: The path to your JSON translation file (e.g., `./path/to/translations.json`).
2. **Project Path**: The root path of your project where the keys will be checked (e.g., `./`).
3. **File Extensions**: A comma-separated list of file extensions to scan for translation keys (e.g., `js,ts,jsx`). You can leave this blank to check all file types.

## Key Removal

The tool will:

- Scan your project for keys used in your source files.
- List any unused keys found in the translation file.
- Ask if you want to remove the unused keys and any empty objects left behind.

## Features

- **Removes unused translation keys**: Cleans up your translation JSON files by removing keys that are not referenced in your project.
- **Removes empty objects**: Cleans up any empty objects left after unused keys are removed.
- **Supports nested translation keys**: Handles complex translation structures with nested keys.
- **Configurable**: Allows you to specify the file extensions to scan for translation keys.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## Acknowledgments

- Thanks to [chalk](https://github.com/chalk/chalk) for colorizing console output.
- Thanks to [glob](https://github.com/isaacs/node-glob) for file pattern matching.
- Thanks to [inquirer](https://github.com/SBoudrias/Inquirer.js) for prompting user input.
