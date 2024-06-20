
# 🚀 Angular Renamer Extension for Visual Studio Code

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/salah-aldain.angular-renamer)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/salah-aldain.angular-renamer)
![Rating](https://img.shields.io/visual-studio-marketplace/r/salah-aldain.angular-renamer)

## 📖 Overview

Welcome to the **Angular Renamer** extension for Visual Studio Code – your ultimate companion for effortless refactoring in Angular projects! 🎉

Are you tired of the tedious process of manually renaming components, services, and other Angular entities? Say goodbye to the hassle! Angular Renamer is here to revolutionize your development workflow, providing lightning-fast, error-free renaming with just a few clicks.

## ✨ Features That Will Make You Smile

### 🔄 Intelligent Automatic Renaming
- Rename components, pipes, directives, and services with ease
- All associated files are updated instantly (.ts, .html, .css, .spec.ts, etc.)

### 🧠 Smart Class Name Updates
- Class names are automatically adjusted to follow Angular best practices
- Keeps your codebase clean and consistent

### 🔍 Project-Wide Import Path Correction
- Never worry about broken imports again!
- All references across your project are updated seamlessly

### ⚡ Lightning-Fast Performance
- Optimized algorithms ensure speedy renaming, even in large projects
- Minimal impact on your VS Code performance

### 🛡️ Error Prevention
- Built-in safeguards to prevent common renaming mistakes
- Clear, actionable error messages if something goes wrong

## 🏗️ Architectural Marvel: Our Project Structure

Dive into the well-organized structure that powers Angular Renamer:

```
src/
├── components/
│   ├── components_handlers.ts  // Component-specific logic
│   ├── handlers.ts             // Main component renaming orchestrator
│   ├── index.ts                // Convenient exports
│   └── renamers.ts             // File and folder renaming utilities
├── general/
│   ├── checker.ts              // Entity type identification
│   ├── handlers.ts             // Generic renaming logic
│   ├── index.ts                // Unified exports
│   └── utilities.ts            // Shared helper functions
└── extension.ts                // Entry point of the extension
```

## 🛠️ The Magic Behind the Scenes

### 🧩 Components Module
- `components_handlers.ts`: Houses the brilliant minds behind component class name generation and replacement.
- `handlers.ts`: The maestro orchestrating the entire renaming symphony for components.
- `renamers.ts`: The skilled artist meticulously renaming files and folders.

### 🔧 General Module
- `checker.ts`: Our detective, identifying Angular entities with Sherlock-like precision.
- `handlers.ts`: The swiss army knife for renaming services, guards, pipes, and directives.
- `utilities.ts`: A treasure trove of helper functions, making our extension smarter by the day.

## 🚀 Blasting Off: Getting Started

### 🔧 Installation in 3... 2... 1...

1. Launch your trusty Visual Studio Code
2. Navigate to the Extensions view (it's the block-looking icon in the sidebar)
3. Search for "Angular Renamer" in the marketplace
4. Click that shiny "Install" button and watch the magic happen!

### 🎮 Usage: As Easy as 1-2-3!

1. Spot the Angular entity you want to rename in the Explorer view
2. Right-click and select "Rename" (or use the F2 shortcut for the keyboard ninjas)
3. Type the new name and hit Enter – then sit back and watch Angular Renamer work its magic!

## ⚙️ Customization: Make It Yours!

While Angular Renamer works wonders out of the box, we know you love to tinker. Here are some ways to customize your experience:

- **Rename Patterns**: Define custom patterns for generated class names
- **Excluded Folders**: Specify folders that should be off-limits for renaming
- **File Extensions**: Add or remove file extensions to be included in the renaming process

To access these settings:
1. Open VS Code settings (File > Preferences > Settings)
2. Search for "Angular Renamer"
3. Tweak to your heart's content!

## 🔍 Troubleshooting: We've Got Your Back!

Running into a hiccup? No worries! Try these steps:

1. **Check the Output Panel**: Look for the "Angular Renamer" output channel for detailed logs
2. **Verify File Permissions**: Ensure VS Code has write access to your project files
3. **Restart VS Code**: Sometimes, the old "turn it off and on again" works wonders!
4. **Update the Extension**: Make sure you're running the latest version for all the newest fixes

Still stuck? Don't hesitate to reach out to our support team!

## 🤝 Join the Angular Renamer Community!

### 🐛 Found a Bug? Have a Brilliant Idea?
We love hearing from you! Head over to our [GitHub Issues](https://github.com/salah-alhajj/angular-renamer/issues) page to:
- Report bugs (the more details, the better!)
- Suggest new features (dream big!)
- Engage with other developers

### 🌟 Want to Contribute?
Awesome! We're always looking for fellow developers to make Angular Renamer even better:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Check out our [Contribution Guidelines](CONTRIBUTING.md) for more details.

## 📜 License

Angular Renamer is proudly open source, licensed under the MIT License. See the [LICENSE](LICENSE) file for the full legal text.

## 📞 Get in Touch

Questions? Suggestions? Just want to say hi? We'd love to hear from you!

- 📧 Email: [Developer](mailto:contact@salahaldain.com)
- 🐦 Twitter: [Developer](https://x.com/salah_aldain_sw/)

---

<p align="center">
  <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1HXCJCOpzKdmQI33ZrEIlg.png" alt="Angular Renamer Logo" width="200"/>
</p>

****😜🤩 May your Angular coding time be happy and crazy 🤩😜****

<p align="center">
  Empowering developers to focus on what matters most – building amazing Angular applications! 🚀
</p>

<p align="center">
  Made with ❤️ by developers, for developers.
</p>

---
