# 0043 — Use Nextra and Shadcn for the v2 Documentation Experience

## Status

Superseded by DR-0044. Retained as the original approved proposal and its non-framework product requirements.

## Context

The Phase 6 website must replace a stale v1 documentation application built on Next.js 14, React 18, Tailwind CSS 3, and Contentlayer. It must explain the frozen v2 compound API while also serving as a real external consumer of the published prerelease.

The website needs three distinct jobs: concise product introduction, structured technical documentation, and an installable example catalog. These jobs require durable MDX navigation and search, polished consumer-owned interface components, and shadcn registry artifacts without adding a styling layer or registry implementation to Emblor core.

## Decision

Rebuild `website/` on the latest stable mutually compatible releases of Next.js, React, TypeScript, Tailwind CSS, Nextra, Nextra's docs theme, and shadcn available when Phase 6 implementation begins. Record and lock the selected versions in the implementation review. Node 24 remains the primary website and CI runtime, with Node 22 retained as the compatibility lane required by DR-0014.

Use Nextra as the documentation content, navigation, search, table-of-contents, and MDX foundation. Customize its presentation so the site has an Emblor-specific identity rather than shipping the stock theme unchanged. Use shadcn components as website-owned building blocks for the shell, examples, code presentation, and installation Sheet.

Use this top-level route structure:

- `/` — an original Emblor homepage inspired by Input OTP's direct product thesis, immediate live demo, visible install command, and short path to code;
- `/docs/**` — all documentation, organized into Getting Started, Guides, and Reference groups;
- `/playground` — a browsable catalog of live, code-visible, installable Emblor compositions, with optional `/playground/[slug]` deep links.

The required documentation routes are:

- Getting Started: introduction, installation, and anatomy;
- Guides: styling, controlled and uncontrolled state, validation, constraints and interactions, forms, accessibility, keyboard and focus, composition and polymorphism, external integrations, and v1-to-v2 migration;
- Reference: API reference, troubleshooting, and examples.

Provide a hosted shadcn registry under the `@emblor` namespace. Registry items are styled consumer compositions that depend on the public `emblor` package. They must not copy, fork, or replace the Emblor core implementation. The installation page documents both package installation and shadcn registry installation. Playground items expose commands such as:

```bash
pnpm dlx shadcn@latest add @emblor/tag-input-basic
```

The `/playground` interaction model may take inspiration from Coss UI's particle catalog: a discoverable example collection, live previews, visible code, and direct installation. Each example has an Install action that opens a Sheet containing package-manager-aware commands and manual guidance. Visual treatment and code remain original to Emblor.

## Alternatives Considered

- Keep Next.js 14, Tailwind CSS 3, React 18, and replace only Contentlayer.
- Use plain `@next/mdx` and build navigation, search, and reference chrome from scratch.
- Use Nextra without shadcn or ship the unmodified Nextra docs theme.
- Put the example catalog under `/docs/examples` only.
- Treat shadcn registry items as another distribution format for Emblor core.

## Consequences

- Phase 6 begins with a bounded website-platform migration before content production.
- The exact dependency versions are resolved just in time rather than becoming stale in this decision.
- Nextra owns documentation mechanics; Emblor-specific React and shadcn code owns the homepage, playground, demos, and visual identity.
- Registry fixtures and validation become part of website CI and external-consumer evidence.
- Tailwind and shadcn remain website-only dependencies and do not alter the headless package contract.
- Any package API change discovered while implementing examples remains subject to DR-0041 and requires a separate finding or superseding decision.

## Related Files

- `website/`
- `.project-planning/plans/emblor-v2-docs-site/plan.md`
- `.project-planning/plans/emblor-v2-docs-site/coverage.md`
- `.project-planning/roadmaps/emblor-v2-to-stable.md`

## Related Plan

`.project-planning/plans/emblor-v2-docs-site/plan.md`

## Supersedes

The provisional Phase 6 plan choice to preserve the existing website stack and use only `@next/mdx`.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-18. This decision governs the documentation application and registry examples only; it does not modify the frozen Emblor v2 package architecture.
