# CodeGurex Path

**Learn how systems work. Then learn how to secure them.**

An offline-first interactive terminal learning path by **CodeGurex Security**.
Security for the AI Era.

V0.1 teaches systems before security tools: 40 short, substantive lessons, knowledge
checks, module quizzes, safe exercises and local progress. No account, remote backend,
telemetry, browser UI or automatic execution of practice commands.

```text
+----------------------+
|  C G  /  P A T H      |
+----------------------+

CODEGUREX PATH
------------------------------------------------------------
Learn how systems work. Then learn how to secure them.

Overall progress: 15% | XP: 60
Current path: foundations
Last lesson: logic

> Continue learning
  Explore roadmap
  Start another module
  Practice
  Take a quiz
  View progress
  Settings
  About CodeGurex Path
  Exit
```

Illustrative terminal demo. Modern terminals use restrained blue accents; limited
terminals use a numbered ASCII menu. No artificial loading delays.

## Requirements and local development

- Node.js **22.13+ in the 22.x line, or 24+** and npm.
- Windows CMD, PowerShell or Windows Terminal; macOS or Linux terminals.
- Some optional exercises require an existing Bash/Linux environment or Python.
  Missing tools do not prevent reading lessons or completing quizzes.

From this project's directory:

```sh
npm install
npm run build
npm test
npm start
```

On subsequent clean installations use `npm ci` with the committed lockfile.

```sh
npm run dev
npm run dev -- lesson networking dns --read-only
npm start -- roadmap
node dist/index.js progress
npm run check
```

The tests include built executable smoke checks, so run build before `npm test`.
`npm run check` does both. `npm run test:watch` starts Vitest in watch mode.

## Installation and npm/npx readiness

The package exposes `codegurex-path` through the npm `bin` field. Build output has a
Node shebang, and `prepack` rebuilds the executable. Registry publication is a
deliberate maintainer action performed only after the release checks pass.

Test the local package without a global installation:

```sh
npm pack
npm exec --package=./codegurex-path-0.1.0.tgz -- codegurex-path --help
```

After publication, the intended usage is:

```sh
npx codegurex-path
```

The first npm download needs Internet. Once installed, the curriculum, quizzes and
progress work offline. CodeGurex Path makes no runtime network requests.

## Commands

| Command | Purpose |
| --- | --- |
| `codegurex-path` | First-run onboarding or the main menu; help outside a TTY |
| `codegurex-path start` | Open the interactive experience |
| `codegurex-path roadmap` | Show all 13 stages and completion status |
| `codegurex-path learn networking` | Choose a lesson; list lessons outside a TTY |
| `codegurex-path lesson networking dns` | Read and answer a lesson |
| `codegurex-path lesson networking dns --read-only` | Read without saving or prompting |
| `codegurex-path quiz networking` | Take the complete module quiz in a TTY |
| `codegurex-path practice networking ip-addresses` | Show one safe exercise |
| `codegurex-path practice linux` | Show all exercises in a module |
| `codegurex-path progress` | Completion bars, XP and latest quiz results |
| `codegurex-path progress --json` | Machine-readable saved state |
| `codegurex-path settings` | Color and Unicode preferences |
| `codegurex-path reset` | Confirm by typing `RESET`; archive and reset |
| `codegurex-path reset --confirm RESET` | Explicit confirmation for scripts |
| `codegurex-path about` | Brand and engineering philosophy |
| `codegurex-path --help` / `--version` | Help and version |

Global `--plain` forces ASCII output and numbered prompts. `--no-color` and the
`NO_COLOR` environment variable disable color. `CODEGUREX_ASCII=1` forces ASCII.
When encoding support is uncertain, the display conservatively uses ASCII.
No-color and ASCII-only terminals use numbered prompts as well.

Redirected output contains no application ANSI formatting and never waits for input.
Quiz, start and unconfirmed reset fail with an actionable message outside a TTY.
Read-only commands do not create progress files. Exit status is 0 on success,
1 for normal errors and 130 when an interactive prompt is interrupted with Ctrl+C.

Prose adapts to terminal width. Command examples retain exact text for copying and
can visually wrap in narrow windows. Modern menus support arrow keys and Enter;
numbered menus accept a number, or `q` to exit. Back returns to the caller or parent
menu. The main menu offers Exit; Ctrl+C is available throughout interactive prompts.

## Available curriculum

| Module | Lessons | Coverage |
| --- | ---: | --- |
| Foundations | 6 | Computers, operating systems, files/processes, CLI, Internet, logic |
| Networking | 14 | LAN/WAN, IP, IPv4/IPv6, CIDR, MAC/ARP, TCP/UDP, ports, DNS, DHCP, HTTP/HTTPS, TLS, routing/NAT, firewalls/VPN, models |
| Linux | 11 | Distributions, filesystem, shell, users/groups, permissions, processes/services, packages, environment, pipes/text tools, SSH/logs, Bash |
| Programming | 9 | Types, conditions/loops, functions, modules, files, JSON, errors, HTTP/APIs, automation with Python/JavaScript/Bash |

Each lesson has an explanation, why it matters, an example, key concepts, a safe
practice with expected observations and a multiple-choice question with feedback.
All modules are open; choosing an advanced starting point never marks earlier work
complete. A correct lesson answer earns **10 XP once**. Module completion is derived
from its completed lessons. Continue resumes unfinished work and eventually fills
earlier gaps. Quizzes reuse module knowledge checks, save the latest finished score
and list strong/review topics. Quizzes award no XP and do not complete lessons.
Cancelled quizzes leave the previous score intact. There are no streaks or accounts.

## Full roadmap

1. Foundations — available
2. Networking — available
3. Linux — available
4. Programming — available
5. Software & Web — planned
6. Security Fundamentals — planned
7. Web Security — planned
8. API Security — planned
9. Infrastructure — planned
10. Cloud — planned
11. DevSecOps — planned
12. AI Security — planned
13. Practice — future lab catalog; local V0.1 exercises are already available

Future stages are visible and explicitly unavailable. Security topics will emphasize
secure construction, access boundaries, architecture review and authorized labs.

## Philosophy

1. Learn how systems work before trying to break them.
2. Build before attacking.
3. Understand the protocol, not only the tool.
4. Automate what you understand.
5. Practice only in authorized environments.
6. Document everything.
7. Security is engineering.

## Architecture

```text
src/
  index.ts             executable and friendly error boundary
  cli.ts               Commander routing and context creation
  commands/            learning, quizzes, settings, navigation and views
  ui/                  terminal capabilities, theme and prompt adapters
  core/                curriculum, progress, navigation, quiz scoring,
                       state validation and filesystem persistence
  content/             four English lesson catalogs and the future roadmap
  i18n/                typed English UI message catalog and lookup
  types/               lesson, module and progress contracts
tests/                 unit, storage, workflow and executable smoke tests
.github/workflows/     Windows, macOS and Linux CI matrix
```

ES modules and strict TypeScript; three runtime dependencies: Commander for routing,
Inquirer for interactive prompts and Chalk for restrained color. Node's filesystem,
path and readline APIs handle persistence and limited terminal input. Content has no
dependency on terminal rendering. UI messages are being centralized for future i18n;
content and stable identifiers are separate. V0.1 ships English only. A full Spanish
release still requires translation of the catalogs and remaining command/help copy.

## Local data and recovery

| Platform | Default directory |
| --- | --- |
| Windows | `%APPDATA%/codegurex-path/` (user AppData/Roaming fallback) |
| Linux/macOS | `$XDG_CONFIG_HOME/codegurex-path/` or `~/.config/codegurex-path/` |

`CODEGUREX_PATH_HOME` overrides the directory and must be an absolute path. This is
useful for tests or a separate learning profile. Do not point it at a shared writable
or untrusted directory. No progress files are written into the current directory by
default.

`state.json` stores schema version, timestamps, current module/lesson, completed
lessons/modules, latest quiz scores, XP and preferences. No credentials are requested
or stored. State is plaintext, validated on read and before write. Invalid JSON,
unsupported versions and inconsistent progress are preserved and reported.

Saves use an exclusive temporary file, file synchronization and atomic replacement.
A short exclusive `state.lock` prevents overlapping mutations; every mutation reloads
the latest state under that lock. A conflicting save fails explicitly instead of
silently dropping another session's progress. Created files request mode 0600 and the
directory 0700 on POSIX. Windows protection relies on the user's inherited directory
ACLs; Unix modes do not provide equivalent Windows access control.

Reset archives the previous `state.json` under a unique `state-backup-*.json` name and
creates fresh progress and preferences. It does not remove other files. Backups remain
local until you manage them yourself. For corrupted data, run `reset` and confirm.
To restore a backup, close other sessions, preserve the current file, and manually
copy the chosen valid backup to `state.json` in the configured data directory.

If a session is terminated during a save, a stale lock or temporary file may remain.
Close all sessions and verify none is still saving before manually removing only
`state.lock`. Preserve `state.json` and backups. Retry the original command.

## Security, contribution and licensing

See [SECURITY.md](SECURITY.md) for boundaries and reporting guidance and
[CONTRIBUTING.md](CONTRIBUTING.md) for content and code contributions.
Code and bundled original learning content use the [MIT License](LICENSE).

Only practice in environments you own or are explicitly authorized to use. The CLI
never runs exercises, installs tools, changes firewall rules, scans targets, asks for
credentials, executes remote code or downloads arbitrary scripts. Linux examples are
identified as such; do not paste Bash syntax into CMD or PowerShell.

## Validation and V0.1 limits

Build, Vitest, executable smoke tests and packaging checks are available locally.
The supplied CI matrix targets Node 22 and 24 on Windows, macOS and Linux; remote CI
must run before claiming those platforms are fully verified. Current local validation
was performed on Windows with Node 24.

This is a learning foundation, not a full cybersecurity course or certification.
Quizzes reuse lesson questions, there is no randomized question bank, and exercises
are self-guided. No Spanish catalog, state migration beyond schema v1, cloud sync,
streaks or future-stage lessons are implemented. Terminal Unicode detection is
heuristic; explicit ASCII mode is always available. State protection assumes a trusted
user directory and does not defend against malicious software running as your user.

Next milestone: validate the CI matrix and accessibility in more real terminals,
then add Software & Web with independent quiz questions and a complete Spanish catalog.
