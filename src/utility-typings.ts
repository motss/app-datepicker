// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AllowedAny = any;

type Cloned<T> = DeepExecWith<T, {
  [K in keyof T]: Cloned<T[K]>;
}>;

export type Constructor<T> = new (...args: AllowedAny[]) => T;

type DeepExecWith<T, Condition> = T extends Record<infer _Key, unknown>
    ? Condition
    : T extends (...args: AllowedAny) => unknown
        ? T
        : Condition;

type DeepNonNullable<T> = Cloned<DeepExecWith<T, NonNullable<{
  [K in keyof T]: DeepNonNullable<T[K]>;
}>>>;

export type DeepNonNullableAndRequired<T> = DeepNonNullable<DeepRequired<T>>;

type DeepRequired<T> = Cloned<DeepExecWith<T, {
  [K in keyof T]-?: DeepRequired<T[K]>;
}>>;

export type OmitKey<T, K extends keyof T> = Omit<T, K>;
