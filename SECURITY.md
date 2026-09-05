# Security policy

CodeGurex Path 0.1.x is the initial supported development line. No public release or
guaranteed response-time commitment is implied by this repository.

## Report a vulnerability

Do not post exploitable details, credentials or private progress files in public issues.
If the eventual hosting repository enables private vulnerability reporting, use its
Security tab. Otherwise contact the repository maintainer through a verified private
channel shown on their profile and request a secure reporting route. A dedicated
security email has not yet been configured; do not assume an address exists.

Include the affected version, OS and Node version, a minimal reproduction using
synthetic data, expected behavior, actual behavior and impact. Preserve original data
and avoid testing other people's systems. Maintainers should acknowledge and triage
reports privately, prepare a fix and coordinate disclosure with the reporter.

## Boundaries

- No telemetry, network requests, remote backend, credential prompts or remote code.
- No automatic shell commands, package installs, scans or firewall changes at runtime.
- Practices are printed instructions for owned or expressly authorized environments.
- Normal errors use concise messages without stack traces.
- Saved state is bounded and validated, and unknown versions are rejected.
- Data files and the immediate data directory cannot be symbolic links; hard-linked
  state files are also rejected. This is defense in depth, not isolation from a hostile
  local account. Ancestor paths and concurrent malicious filesystem replacement are
  outside the threat model. Use the default private user directory.
- Saves use exclusive temporary files, a short lock and atomic replacement. POSIX
  permissions are requested; Windows relies on inherited user-directory ACLs.
- Reset requires the literal `RESET` and archives the old state. No unrelated files
  are removed. Corruption is never silently treated as an empty profile.

Progress is plaintext educational data, not an encrypted vault. Do not place secrets
in it or point the data directory at an untrusted shared location. File synchronization
does not promise survival of every power-loss or filesystem failure scenario. A crash
can leave a lock or temporary file; see the README recovery instructions.

npm installation requires fetching reviewed dependencies and may execute their normal
package installation steps. That development/install process is distinct from the
offline CLI runtime. Review lockfile changes and dependency audits before release.
