import { getPublishedNotes } from "@/lib/content";
import {
  areasServed,
  audience,
  contactEmail,
  languages,
  organizationDescription,
  scope,
  services,
  SITE_URL,
  siteDescription,
  siteName,
} from "@/lib/site";

export function buildLlmsProfile(includeBodies: boolean): string {
  const notes = getPublishedNotes();
  const steps = services
    .map((service) => `### ${service.name}\n\n${service.description}`)
    .join("\n\n");

  const noteList =
    notes.length === 0
      ? ""
      : `\n\n## Notes\n\n${notes
          .map(
            (note) =>
              `- [${note.title}](${SITE_URL}/notes/${note.slug}): ${note.description}`,
          )
          .join("\n")}`;

  const bodies = includeBodies
    ? notes
        .map(
          (note) =>
            `\n\n# ${note.title}\n\n${note.body}`,
        )
        .join("")
    : "";

  return `# ${siteName}

> ${siteDescription}

## What Kordran does

${organizationDescription}

## How it works

${steps}

## Scope

${scope}

## Who it serves

${audience}

## Geography and languages

${areasServed.join(", ")}. Languages: ${languages.join(" and ")}.

## Contact

${contactEmail}
${SITE_URL}${noteList}${bodies}
`;
}
