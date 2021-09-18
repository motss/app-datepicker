const re = /%s|%j/g;

function replacer(_: string, v: unknown): unknown {
  return v instanceof Set || v instanceof Map ?
    Array.from(v) :
    v;
}

export function messageFormatter<T>(message: string, group: T): string {
  let i = 0;

  return message.replace(
    re,
    (s) => {
      const value = Array.isArray(group) ? group[i++] : group;

      try {
        return value?.toJSON();
      } catch {
        return s === '%j' ? JSON.stringify(value, replacer): String(value);
      }
    }
  );
}
