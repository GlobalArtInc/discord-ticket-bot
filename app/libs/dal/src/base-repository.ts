import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends { id?: unknown }> {
  private repo: Repository<T>;

  constructor(
    private target: EntityTarget<T>,
    private manager: EntityManager,
  ) {
    this.repo = manager.getRepository(target);
  }

  async getAll(options?: FindManyOptions<T>) {
    return this.repo.find(options);
  }

  async getOneById(id: number | string, options?: FindOneOptions<T>) {
    const entry = await this.repo.findOne({ where: { id } as FindOptionsWhere<T>, ...options });
    if (!entry) {
      return null;
    }

    return entry;
  }

  async getManyBy(filter: FindOptionsWhere<T>, options?: FindManyOptions<T>) {
    return this.repo.find({ where: filter, ...options });
  }

  async getOneBy(filter: FindOptionsWhere<T>, options?: FindOneOptions<T>) {
    return this.repo.findOne({ where: filter, ...options });
  }

  async updateOneById(id: number, data: QueryDeepPartialEntity<T>) {
    const entry = await this.getOneById(id);
    if (!entry) {
      throw new NotFoundException('Not found');
    }
    const updatedEntity = Object.assign(entry, data as DeepPartial<T>);
    await this.repo.save(updatedEntity);
  }

  async upsert(data: DeepPartial<T> & { id: number | string }) {
    let entity = await this.repo.findOneBy({ id: data.id } as FindOptionsWhere<T>);
    if (!entity) {
      entity = this.repo.create(data);
    } else {
      delete data.id;
      entity = Object.assign(entity, data);
    }
    await this.repo.save(entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const newEntity = this.repo.create(data);
    await this.repo.save(newEntity);

    return newEntity;
  }

  createEntity(data: DeepPartial<T>): T {
    return this.repo.create(data);
  }

  async save(data: DeepPartial<T>) {
    return this.repo.save(data);
  }

  async createBulk(data: DeepPartial<T>[]): Promise<void> {
    const newEntities = this.repo.create(data);
    await this.repo.save(newEntities);
  }

  async delete(id: number) {
    await this.repo.delete({ id } as FindOptionsWhere<T>);
  }

  async replace(id: number, data: DeepPartial<T>) {
    const newEntity = this.repo.create(data);
    await this.manager.transaction(async (transactionEntityManager) => {
      transactionEntityManager.delete(this.target, { id } as FindOptionsWhere<T>);
      transactionEntityManager.save(newEntity);
    });
  }
}
