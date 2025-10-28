# 💚 LynkPOS

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses the [new `<script setup>` syntax](https://github.com/vuejs/rfcs/pull/227). Check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## 🧩 Features

- Core:

  - ⚡️ Vue 3: [vue-3](https://github.com/vuejs/vue-next)
  - 🦾 Typescript: [typescript](https://github.com/microsoft/TypeScript)
  - ⚡️ Vite: [vite](https://github.com/vitejs/vite)
  - 🗺️ Vue Router: [vue-router](https://github.com/vuejs/vue-router)
  - 🌍 Vue-i18n: [vue-i18n](https://github.com/intlify/vue-i18n-next)
  - 🔤 Webfont self-hosting: [vite-plugin-webfont-dl](https://github.com/feat-agency/vite-plugin-webfont-dl)

- State Management:
  - 🍍 Pinia: [pinia](https://github.com/vuejs/pinia)
- UI Framework:
  - 🦄 Tailwind CSS: [tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- API Client:
  - 📡 Axios: [axios](https://github.com/axios/axios)
- Pre commit hooks and Linters and Formatters:
  - 💬 Husky: [husky](https://github.com/typicode/husky)
  - 💬 Lint-staged: [lint-staged](https://github.com/okonet/lint-staged)
  - 💅 ESLint: [eslint](https://github.com/eslint/eslint)
  - 💅 Prettier: [prettier](https://github.com/prettier/prettier)
- Opinionated Testing:
  - 🎭 Playwright: [playwright](https://github.com/microsoft/playwright)
  - 🧪 Vitest: [vitest](https://github.com/vitest-dev/vitest)

## 🧰 Recommended Setup

- [VS Code](https://code.visualstudio.com/)

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and `disable Vetur.`

  - Use [vue-tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc) for performing the same type checking from the command line, or for generating d.ts files for SFCs.
  - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [ESLint for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 📦 🧰 Additional Setup

- VSCode Extension [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- VSCode Extension [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)
- VSCode Extension [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- VSCode Extension [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- VSCode Extension [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory)
- VSCode Extension [Git Graph](https://marketplace.visualstudio.com/items?itemName=GitGraph.vscode-gitgraph)
- VSCode Extension [Git Blame](https://marketplace.visualstudio.com/items?itemName=waderyan.gitblame)

## ⚙️ Environment Setup

- `Node:` v20.19.5 (LTS/iron May 2024)
- `pnpm:` v10.x (Package Manager)
- `NVM:` v0.38.0

## 💅 Code Styling

- ESLint rules are defined in `.eslintrc.json`
- Prettier rules are defined in `.prettierrc`.
- Pre-commit hooks are defined in `.husky/pre-commit`.

## 💅 CSS Architecture

We use Tailwind CSS for styling. It is a utility-first CSS framework that provides a set of pre-built components and utilities that can be used to quickly build responsive and visually appealing web pages.

## ⚗️ Husky pre-commit hooks

Husky is a package that allows you to run a script before every commit. It can be used to check code formatting, run tests, or perform other tasks.
We use 3 pre-commit hooks:

- `pre-commit`: Runs ESLint on the staged files.
- `commit-msg`: Runs commitlint on the commit message.
- `pre-push`: Runs unit tests on the staged files.

<!-- ## 🏗 Project Structure -->

## 📦 Package Manager

This project uses **pnpm** as the package manager for faster, more efficient dependency management. pnpm uses a content-addressable filesystem to store packages and creates hard links to avoid duplication.

### Why pnpm?

- **Faster installs**: Up to 2x faster than npm
- **Disk space efficient**: Uses hard links to avoid duplicate packages
- **Strict dependency resolution**: Prevents phantom dependencies
- **Better monorepo support**: Built-in workspace support

## 🛠 pnpm scripts for Development

### 🪄 Init

```bash
# install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

```bash
nvm use # If you have nvm installed with node version 20.19.5
nvm install # Install node version 20.19.5 using nvm
```

### 📦 Installation

```bash
pnpm install # Install all dependencies
```

### 🔨 Compile and hot-reload for development

```bash
pnpm dev # Compile and hot-reload for development
```

### 📝 Lint and fix files

```bash
pnpm lint # run lint
pnpm lint:fix # run lint --fix
```

### 🚀 Build

```bash
pnpm build # Build the project for production
```

### 👁 Preview

```bash
pnpm preview # Preview of the locally packaged project
```

### 🔬 Test Setup

```bash
pnpm test-setup # Install playwright
```

### 🧪 Run tests

```bash
# Unit tests
pnpm test # Run vitest unit tests

# E2E tests
pnpm test:e2e # Run playwright e2e tests
pnpm test:e2e:ui # Run playwright with UI

# Test coverage
pnpm test:coverage # Run tests with coverage report
```

## Commit Message Conventions

We use [commitlint](https://github.com/conventional-changelog/commitlint) to enforce a conventional commit message format. This ensures that the commit message follows a standard format that is easy to read and understand.

The commitlint configuration file is located at `.commitlintrc.json`. It specifies the rules for validating commit messages.

```bash
<type>(<scope>): <subject>
```

#### `<type>`

- Descibes the category of your change.
- Commonly used: `build`, `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, etc.

#### `<scope>`

- Optional argument.
- Describes the module affected by your change.
- Highly project specific.
- Commonly used: `core`, `ui`, `api`, `state`, `utils`, `types`, `config`, `tests`, etc.

#### `<subject>`

- Terse description.
- Avoid repeating information from type and scope.
- Describe what the software does after your change.

#### Help

```bash
'init:     initial commit'
'feat:     add new feature'
'fix:      fix bug'
'ui:       update UI'
'refactor: refactor code'
'perf:     performance code or flows'
'release:  release application'
'deploy:   deploy on server'
'docs:     change docs'
'test:     add testing'
'chore:    change settings (ex. deps)'
'style:    update style without logic change'
'revert:   revert commit'
```

#### Examples

```bash
feat(core): add new feature

fix(core): fix bug in component

perf(cache): optimize cache retrieval speed

chore(deps): update dependency versions

refactor(user): simplify user creation logic

docs(ui): update documentation

docs(readme): update installation instructions

chore: update .gitignore
```

## Browser support

The `Chrome 80+` browser is recommended for local development

Support modern browsers, doesn't include IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                             not support                                                                                              |                                                                                            last 2 versions                                                                                             |                                                                                                  last 2 versions                                                                                                  |                                                                                                last 2 versions                                                                                                |                                                                                                last 2 versions                                                                                                |
