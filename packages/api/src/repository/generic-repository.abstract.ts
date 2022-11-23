export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract get(id: string): Promise<T>;

  abstract getByAny(obj: Object): Promise<T[]>;

  abstract getByOptions(obj: Object, sort: Object, skip: number, limit: number): Promise<T[]>;

  abstract create(item: T): Promise<T>;

  abstract update(id: string, item: T);

  abstract updateOne(obj: Object, item: T);

  abstract delete(obj: Object);

  abstract aggregate(query: Object);
}
