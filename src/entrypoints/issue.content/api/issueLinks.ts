import type { IssueListItem, IssueLink } from '../lib/types';

const isUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const parseFigmaVersions = (text: string): Array<{ type: string; url: string }> => {
  const versions: Array<{ type: string; url: string }> = [];
  // viva chat gpt for this beautiful regex
  const regex = /\b(OLD|NEW|FINAL)\b(?:\s*[-:]?\s*(\d+))?[\s:\-]*((?:https?:\/\/|www\.)\S+)/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const baseType = match[1].toUpperCase();
    const versionNumber = match[2];
    const type = versionNumber ? `${baseType} ${versionNumber}` : baseType;
    const rawUrl = match[3];
    const url = rawUrl.startsWith('www.') ? `https://${rawUrl}` : rawUrl;
    versions.push({ type, url });
  }

  return versions;
};

export const extractIssueLinks = (item: IssueListItem): IssueLink[] => {
  const links: IssueLink[] = [];
  const allFields = item.additional_fields;
  if (!allFields) return links;

  for (const fields of Object.values(allFields)) {
    if (!Array.isArray(fields)) continue;

    for (const field of fields) {
      if (!field.value) continue;

      const versions = parseFigmaVersions(field.value);
      if (versions.length > 0) {
        versions.forEach(version => {
          if (isUrl(version.url)) {
            links.push({ name: `(${version.type}) ${field.name}`, url: version.url });
          }
        });
        continue;
      }

      if (isUrl(field.value)) {
        links.push({ name: field.name, url: field.value });
      }
    }
  }

  return links;
};
