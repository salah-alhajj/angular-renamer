Sure, here's the markdown code for the Angular Renamer Extension documentation:


# Angular Renamer Extension for Visual Studio Code

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/your-extension-id)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/your-extension-id)
![Rating](https://img.shields.io/visual-studio-marketplace/r/your-extension-id)

## 📖 Overview

The **Angular Renamer** extension for Visual Studio Code is designed to simplify the process of renaming Angular components, pipes, directives, and services. This extension automatically renames all associated files and classes, ensuring consistency across your project and saving you valuable time and effort.

## ✨ Features

- **Automatic Renaming**: Seamlessly rename Angular components, pipes, directives, and services along with all associated files and classes.
- **Consistency**: Ensures that all references and import statements are updated throughout your project.
- **Error Handling**: Provides clear error messages in case of any issues during the renaming process.

## 🏗️ Project Structure

The extension is structured to manage different types of Angular entities, ensuring each type is handled appropriately. Here's an overview of the project structure:

```
src
├── components
│   ├── components_handlers.ts
│   ├── handlers.ts
│   ├── index.ts
│   └── renamers.ts
├── general
│   ├── checker.ts
│   ├── handlers.ts
│   ├── index.ts
│   └── utilities.ts
└── extension.ts
```

## 📂 Detailed Breakdown

### Components Module

- **components_handlers.ts**: Contains functions to generate and replace class names for Angular components.
- **handlers.ts**: Manages the renaming process, including updating import paths and class names across the project.
- **index.ts**: Exports handlers for easy import.
- **renamers.ts**: Handles the renaming of component files and folders.

### General Module

- **checker.ts**: Contains utility functions to check if a given path is a directory and identify Angular components, services, guards, pipes, and directives.
- **handlers.ts**: Manages the renaming process for services, guards, pipes, and directives, ensuring that all references and imports are updated.
- **index.ts**: Exports handlers and utilities for easy import.
- **utilities.ts**: Provides utility functions to extract classes from TypeScript files and handle import statements.

## 🚀 Getting Started

### Installation

To install the Angular Renamer extension, follow these steps:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for "Angular Renamer".
4. Click Install.

### Usage

1. Rename an Angular component, pipe, directive, or service by changing the folder or file name in the Explorer view.
2. The extension will automatically detect the change and update all associated files and references.

## ⚙️ Configuration

No configuration is required. The extension works out of the box with default settings. However, you can customize certain aspects by modifying your workspace settings.

## 🔧 Troubleshooting

If you encounter any issues while using the Angular Renamer extension, try the following steps:

1. Ensure that your workspace is open in Visual Studio Code.
2. Check the Output panel for any error messages.
3. Verify that the renamed entity is a valid Angular component, pipe, directive, or service.

## 🌐 Contributions

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please create an issue or submit a pull request on the [GitHub repository](https://github.com/your-repo/angular-renamer).

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 📞 Contact

For any questions or support, please contact [your-email@example.com](mailto:your-email@example.com).

---

Enjoy seamless renaming with the Angular Renamer extension and keep your Angular projects clean and consistent! 🌟


<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zhULfxu31gL3D_vlhS1rjA.png" alt="Angular Icon" width="300" height="300">

****😜🤩 May your Angular coding time be happy and crazy 🤩😜****
