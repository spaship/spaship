export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract get(id: string): Promise<T>;

  abstract getByAny(obj: any): Promise<T[]>;

  abstract create(item: T): Promise<T>;

  abstract update(id: string, item: T);
}
