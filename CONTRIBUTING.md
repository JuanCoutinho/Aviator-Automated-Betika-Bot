# Contributing to Aviator Betting Bot

First off, thank you for considering contributing to the Aviator Betting Bot! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and respectful environment. By participating, you are expected to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Types of Contributions We're Looking For

- **Bug fixes**: Help us identify and fix bugs
- **New features**: Implement new betting strategies or monitoring features
- **Documentation**: Improve README, code comments, or create tutorials
- **Code optimization**: Enhance performance and reliability
- **Testing**: Add unit tests or integration tests
- **UI/UX improvements**: Enhance the web interface (when available)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Aviator-Automated-Betika-Bot.git
   cd Aviator-Automated-Betika-Bot
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Setting Up Your Development Environment

1. Ensure you have Node.js >= 14.0.0 installed
2. Install all dependencies with `npm install`
3. Configure your `util/config.js` for testing
4. Test your changes with `npm run start`

### Project Structure

```
aviator-bot/
├── database/          # Database integration (currently deprecated)
├── game/             # Core game logic
│   ├── betManager.js    # Bet execution logic
│   ├── gameMonitor.js   # Game state monitoring
│   ├── statsTracker.js  # Statistics tracking
│   └── strategies.js    # Betting strategies
├── util/             # Utility functions
│   ├── config.js       # Configuration settings
│   ├── frameHelper.js  # Browser frame helpers
│   └── logger.js       # Logging utilities
└── index.js          # Main entry point
```

## Coding Standards

### JavaScript Style Guide

- Use **ES6+** syntax where appropriate
- Use **2 spaces** for indentation
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**
- Follow **DRY principles** (Don't Repeat Yourself)

### Example:

```javascript
// Good
async function placeBet(frame, amount) {
  const betInput = await frame.$('#bet-amount');
  await betInput.type(amount.toString());
  await clickBetButton(frame);
}

// Bad
async function pb(f, a) {
  const b = await f.$('#bet-amount');
  await b.type(a.toString());
  await clickBetButton(f);
}
```

### Error Handling

Always implement proper error handling:

```javascript
try {
  await placeBet(frame, betAmount);
} catch (error) {
  logger.error('Failed to place bet:', error);
  // Handle error appropriately
}
```

## Commit Guidelines

We follow conventional commit messages for clarity and automated changelog generation.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(strategies): add fibonacci betting strategy

Implemented a new Fibonacci progression betting strategy that
adjusts bet amounts based on the Fibonacci sequence.

Closes #123
```

```bash
fix(gameMonitor): resolve multiplier detection issue

Fixed a bug where the game multiplier wasn't being correctly
parsed when it exceeded 10x.
```

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Add tests** for new features when applicable
3. **Ensure all tests pass** before submitting
4. **Update the README.md** if needed
5. **Follow the PR template** (if provided)
6. **Link related issues** in your PR description

### PR Title Format

Use the same format as commit messages:

```
feat(betManager): implement auto-cashout functionality
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots to demonstrate changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes
```

## Reporting Bugs

### Before Submitting a Bug Report

- **Check existing issues** to avoid duplicates
- **Test with the latest version** of the code
- **Collect relevant information** (error logs, screenshots, etc.)

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10, Ubuntu 20.04]
- Node.js version: [e.g., 14.17.0]
- Browser: [e.g., Chrome 95]

**Additional context**
Any other context about the problem.
```

## Suggesting Enhancements

### Enhancement Suggestion Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, screenshots, or examples.
```

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Check existing documentation in the repository

## Recognition

Contributors will be recognized in our project documentation. Thank you for helping make this project better!

---

**Note**: This is an open-source project for educational purposes. Please ensure your contributions align with ethical use and legal compliance.
