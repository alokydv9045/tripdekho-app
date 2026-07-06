import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { AuditLogEntity } from '../../entities/audit-log.entity';

@EventSubscriber()
export class DatabaseAuditSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  // Ensure we don't infinitely log inserts into the AuditLogEntity table itself!
  private shouldLog(entityMetadata: any): boolean {
    return entityMetadata && entityMetadata.tableName !== 'audit_logs';
  }

  async afterInsert(event: InsertEvent<any>) {
    if (!this.shouldLog(event.metadata)) return;

    try {
      const auditRepo = event.manager.getRepository(AuditLogEntity);
      const log = auditRepo.create({
        event: `DATABASE_INSERT: ${event.metadata.tableName}`,
        type: 'database',
        details: JSON.stringify(event.entity),
        moduleName: 'DatabaseSubscriber',
      });
      await auditRepo.save(log);
    } catch (err) {
      console.error('Failed to save DB audit log (insert)', err);
    }
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (!this.shouldLog(event.metadata)) return;

    try {
      const auditRepo = event.manager.getRepository(AuditLogEntity);
      const changes: any = {};
      
      // Capture what actually changed
      event.updatedColumns.forEach((col) => {
        changes[col.propertyName] = {
          from: event.databaseEntity ? event.databaseEntity[col.propertyName] : null,
          to: event.entity ? event.entity[col.propertyName] : null,
        };
      });

      const log = auditRepo.create({
        event: `DATABASE_UPDATE: ${event.metadata.tableName}`,
        type: 'database',
        details: JSON.stringify({ entityId: event.entity?.id || event.databaseEntity?.id, changes }),
        moduleName: 'DatabaseSubscriber',
      });
      await auditRepo.save(log);
    } catch (err) {
      console.error('Failed to save DB audit log (update)', err);
    }
  }

  async afterRemove(event: RemoveEvent<any>) {
    if (!this.shouldLog(event.metadata)) return;

    try {
      const auditRepo = event.manager.getRepository(AuditLogEntity);
      const log = auditRepo.create({
        event: `DATABASE_DELETE: ${event.metadata.tableName}`,
        type: 'database',
        details: JSON.stringify(event.databaseEntity || event.entity),
        moduleName: 'DatabaseSubscriber',
      });
      await auditRepo.save(log);
    } catch (err) {
      console.error('Failed to save DB audit log (delete)', err);
    }
  }
}
