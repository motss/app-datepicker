const re = /%s|%j/g;

export function messageFormatter<T>(message: string, group: T): string {
  let i = 0;

  return message.replace(
    re,
    (s) => {
      const value = Array.isArray(group) ? group[i++] : group;

      try {
        return value?.toJSON();
      } catch {
        return s === '%j' ? JSON.stringify(value): String(value);
      }
    }
  );
}
