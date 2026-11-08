---
name: security-audit
description: Token hygiene, safe path traversal prevention, memory bounding on image decoders, and dependency vulnerability scanning with cargo-audit.
---

# Security Audit Skill

## Checklist
- Strip tokens from CLI arguments, error messages, and logs.
- Limit image decoding dimensions to prevent allocation bombs.
- Prevent path traversal when loading user-defined masks or palette files.
- Run `cargo audit` and `cargo deny` to detect known vulnerabilities.
