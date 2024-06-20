# Contributing to Angular Renamer

First off, thank you for considering contributing to Angular Renamer! 🎉 It's people like you that make Angular Renamer such a great tool.

## 📜 Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please take a moment to read it before proceeding.

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

This section guides you through submitting a bug report for Angular Renamer. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps.
- Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
- Explain which behavior you expected to see instead and why.
- Include screenshots and animated GIFs which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements 💡

This section guides you through submitting an enhancement suggestion for Angular Renamer, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Provide specific examples to demonstrate the steps or point out the part of Angular Renamer which the suggestion is related to.
- Describe the current behavior and explain which behavior you expected to see instead and why.
- Explain why this enhancement would be useful to most Angular Renamer users.
- List some other text editors or applications where this enhancement exists.

### Your First Code Contribution 🚀

Unsure where to begin contributing to Angular Renamer? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues](https://github.com/salah-alhajj/angular-renamer/labels/beginner) - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues](https://github.com/salah-alhajj/angular-renamer/labels/help%20wanted) - issues which should be a bit more involved than `beginner` issues.

### Pull Requests 🔧

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible.
- Follow the [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) styleguide.
- Include thoughtfully-worded, well-structured [Jasmine](https://jasmine.github.io/) specs in the `./spec` folder. Run them using `npm test`.
- Document new code based on the [Documentation Styleguide](#documentation-styleguide)
- End all files with a newline

## Styleguides

### Git Commit Messages 📝

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
    - 🎨 `:art:` when improving the format/structure of the code
    - 🐎 `:racehorse:` when improving performance
    - 🚱 `:non-potable_water:` when plugging memory leaks
    - 📝 `:memo:` when writing docs
    - 🐛 `:bug:` when fixing a bug
    - 🔥 `:fire:` when removing code or files
    - 💚 `:green_heart:` when fixing the CI build
    - ✅ `:white_check_mark:` when adding tests
    - 🔒 `:lock:` when dealing with security
    - ⬆️ `:arrow_up:` when upgrading dependencies
    - ⬇️ `:arrow_down:` when downgrading dependencies
    - 👕 `:shirt:` when removing linter warnings

### TypeScript Styleguide 📐

All TypeScript code is linted with [TSLint](https://palantir.github.io/tslint/).

- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Inline `export`s with expressions whenever possible
  ```ts
  // Use this:
  export const someVar = 123;

  // Instead of:
  const someVar = 123;
  export { someVar };