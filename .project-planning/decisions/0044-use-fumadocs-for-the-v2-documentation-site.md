# 0044 — Use Fumadocs for the v2 Documentation Site

## Status

Accepted

## Context

DR-0043 selected Nextra as the documentation foundation. During implementation, the site requirements were refined around interactive component previews, Storybook-backed examples, a searchable docs shell, and a playground that presents installable UI compositions. Fumadocs provides the documentation foundation now used by the website and fits those requirements.

## Decision

Supersede the Nextra choice in DR-0043 with Fumadocs. The site uses Fumadocs for MDX content, `/docs/**` routing, navigation, search, and documentation layout. Website-owned React and shadcn components continue to provide the homepage, interactive examples, playground, and visual identity.

Keep the route contract from DR-0043: `/` is the Emblor homepage, `/docs/**` contains documentation, and `/playground` presents live, code-visible, installable compositions. Keep the hosted `@emblor` shadcn registry and consumer-owned integrations outside `packages/emblor`.

This decision changes the website implementation foundation only. It does not change the frozen Emblor package API, Node 22/24 support policy, or v1 preservation boundary.

## Alternatives Considered

- Continue with Nextra and implement the required interactive preview and playground integrations around it.
- Use a generic application framework without a documentation-focused MDX foundation.

## Consequences

- Website documentation routes, MDX processing, navigation, and search are implemented with Fumadocs.
- The original Nextra plan remains historical context; its product requirements continue where they do not depend on Nextra-specific implementation.
- Website package and lockfile versions are the source of truth for the selected implementation stack.

## Related Files

- `.project-planning/decisions/0043-use-nextra-and-shadcn-for-the-v2-documentation-experience.md`
- `.project-planning/plans/emblor-v2-docs-site/`
- `website/`

## Supersedes

The Nextra foundation selected by DR-0043.

## Superseded By

None.

## Notes

Accepted by Jaleel through the direction to move the documentation site to Fumadocs and subsequent implementation authorization.
