# MySQL 锁在 Sequelize 中的完整指南

## 1. 锁的基本概念

### 1.1 表级锁 (Table Lock)

**概念**：锁定整张表的读写权限

**MySQL 语法**：

```sql
-- 锁定单个表
LOCK TABLES table_name READ;    -- 读锁
LOCK TABLES table_name WRITE;   -- 写锁

-- 锁定多个表
LOCK TABLES
    users READ,              -- users 表加读锁
    orders WRITE,           -- orders 表加写锁
    products READ;          -- products 表加读锁

-- 解锁所有表
UNLOCK TABLES;
```

**解锁说明**：

-   `UNLOCK TABLES` 会解锁当前会话中所有已锁定的表
-   不需要指定具体表名
-   表锁是基于会话（Session）的
-   会话结束时，所有表锁会自动释放

**注意事项**：

-   一个会话在同一时间只能持有一组表锁
-   执行 `LOCK TABLES` 时会隐式地解除之前的所有表锁
-   如果要锁定多个表，必须在一个 `LOCK TABLES` 语句中完成

```sql
-- 错误的做法
LOCK TABLES users READ;
LOCK TABLES orders WRITE;  -- 这会解除 users 表的锁

-- 正确的做法
LOCK TABLES users READ, orders WRITE;
```

**Sequelize 实现**：

-   Sequelize 不直接提供表锁操作
-   可通过事务隔离级别实现类似效果

**解决问题**：

-   确保整表数据一致性
-   适用于全表更新、备份等场景

**弊端**：

-   并发性能差
-   容易造成其他操作阻塞

### 1.2 行级锁 (Row Lock)

#### 1.2.1 共享锁（S Lock）

**概念**：允许多个事务同时读取同一行，但阻止其他事务修改此行

**MySQL 语法**：

```sql
SELECT * FROM table_name WHERE id = 1 LOCK IN SHARE MODE;
```

**Sequelize 实现**：

```javascript
await Model.findOne({
    where: { id: 1 },
    lock: true,
    transaction,
});
```

**解决问题**：

-   保证读取数据的一致性
-   防止读取过程中数据被修改

**弊端**：

-   影响写入性能
-   可能造成写入等待

#### 1.2.2 排他锁（X Lock）

**概念**：阻止其他事务读取或修改锁定的行

**MySQL 语法**：

```sql
SELECT * FROM table_name WHERE id = 1 FOR UPDATE;
```

**Sequelize 实现**：

```javascript
await Model.findOne({
    where: { id: 1 },
    lock: Transaction.LOCK.UPDATE,
    transaction,
});
```

**解决问题**：

-   防止并发更新冲突
-   确保数据更新的原子性

**弊端**：

-   锁定粒度大
-   容易造成死锁

### 1.3 乐观锁 (Optimistic Lock)

**概念**：通过版本号或时间戳检测并发冲突

**MySQL 实现**：

```sql
-- 使用版本号
UPDATE table_name
SET data = 'new_value', version = version + 1
WHERE id = 1 AND version = 1;
```

**Sequelize 实现**：

```javascript
const Model = sequelize.define(
    'Model',
    {
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        version: true,
    },
);
```

**解决问题**：

-   适合读多写少的场景
-   不需要数据库级别的锁定

**弊端**：

-   可能需要重试机制
-   无法完全避免并发问题

## 2. 实际应用场景

### 2.1 库存扣减场景

```javascript
// 使用悲观锁
async function deductStock(productId, quantity) {
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.findOne({
            where: { id: productId },
            lock: Transaction.LOCK.UPDATE,
            transaction,
        });

        if (product.stock < quantity) {
            throw new Error('库存不足');
        }

        await product.update(
            {
                stock: product.stock - quantity,
            },
            { transaction },
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
```

### 2.2 账户转账场景

```javascript
// 使用固定顺序加锁防止死锁
async function transfer(fromId, toId, amount) {
    const transaction = await sequelize.transaction();
    try {
        const [smallId, bigId] = [fromId, toId].sort((a, b) => a - b);

        const account1 = await Account.findByPk(smallId, {
            lock: Transaction.LOCK.UPDATE,
            transaction,
        });
        const account2 = await Account.findByPk(bigId, {
            lock: Transaction.LOCK.UPDATE,
            transaction,
        });

        // 转账逻辑
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
```

## 3. 性能优化策略

### 3.1 锁范围最小化

```javascript
// 好的实践
await Model.findOne({
    where: { id: targetId },
    lock: true,
    transaction,
});

// 避免的实践
await Model.findAll({
    lock: true,
    transaction,
});
```

### 3.2 锁持有时间最小化

```javascript
// 好的实践
const data = await heavyOperation(); // 先完成耗时操作
const transaction = await sequelize.transaction();
await doUpdate(data, transaction);
await transaction.commit();
```

### 3.3 合理使用索引

```javascript
{
    indexes: [
        {
            fields: ['frequently_locked_field'],
            unique: false,
        },
    ];
}
```

## 4. 注意事项

1. 选择合适的锁类型

    - 读多写少：优先考虑乐观锁
    - 写多读少：考虑悲观锁
    - 全表操作：考虑表锁

2. 防止死锁

    - 固定加锁顺序
    - 设置合理的超时时间
    - 避免大事务

3. 性能考虑
    - 适当的锁粒度
    - 必要的索引支持
    - 合理的事务隔离级别

## 5. 锁的常见问题

### 5.1 死锁 (Deadlock)

**概念**：两个或多个事务互相持有对方需要的锁，形成循环等待。

**示例**：

```sql
-- 事务1:
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- 锁定账户1
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- 等待账户2的锁

-- 事务2:
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 2;  -- 锁定账户2
UPDATE accounts SET balance = balance + 100 WHERE id = 1;  -- 等待账户1的锁
```

**解决方案**：

1. 固定加锁顺序

```javascript
async function transfer(fromId, toId, amount) {
    const [smallId, bigId] = [fromId, toId].sort((a, b) => a - b);
    // 总是先锁定ID小的账户
    const account1 = await Account.findByPk(smallId, { lock: true });
    const account2 = await Account.findByPk(bigId, { lock: true });
}
```

2. 设置锁超时

```javascript
const sequelize = new Sequelize({
    dialectOptions: {
        innodb_lock_wait_timeout: 50, // 50秒后超时
    },
});
```

3. 使用事务重试机制

```javascript
async function executeWithRetry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.name === 'SequelizeDeadlockError' && i < maxRetries - 1) {
                await new Promise(resolve =>
                    setTimeout(resolve, 1000 * Math.random()),
                );
                continue;
            }
            throw error;
        }
    }
}
```

### 5.2 锁等待超时 (Lock Wait Timeout)

**概念**：事务在等待获取锁时超过了设定的时间限制。

**原因**：

-   长事务占用锁时间过长
-   并发请求过多
-   索引使用不当导致锁范围过大

**解决方案**：

1. 优化事务大小

```javascript
// 不好的实践
const transaction = await sequelize.transaction();
await processLargeDataSet(); // 耗时操作
await transaction.commit();

// 好的实践
for (const chunk of dataChunks) {
    const transaction = await sequelize.transaction();
    await processChunk(chunk);
    await transaction.commit();
}
```

2. 添加合适的索引

```javascript
{
    indexes: [
        {
            fields: ['frequently_locked_field'],
            unique: false,
        },
    ];
}
```

### 5.3 锁升级 (Lock Escalation)

**概念**：当单个事务锁定了大量行时，数据库可能会将行锁升级为表锁。

**问题**：

-   降低并发性
-   可能导致其他事务被阻塞

**预防措施**：

1. 控制锁定记录数量

```javascript
// 不好的实践
await Model.update(data, {
    where: { status: 'pending' }, // 可能锁定大量记录
    lock: true,
});

// 好的实践
await Model.update(data, {
    where: {
        status: 'pending',
        id: { [Op.in]: specificIds }, // 限制更新范围
    },
    lock: true,
});
```

2. 分批处理大量数据

```javascript
async function updateInBatches(condition, data, batchSize = 1000) {
    let offset = 0;
    while (true) {
        const records = await Model.findAll({
            where: condition,
            limit: batchSize,
            offset,
            lock: true,
        });

        if (records.length === 0) break;

        await Model.update(data, {
            where: { id: records.map(r => r.id) },
        });

        offset += batchSize;
    }
}
```

### 5.4 最佳实践

1. **监控锁问题**

```sql
-- 查看当前锁等待情况
SELECT * FROM information_schema.innodb_lock_waits;

-- 查看当前事务
SELECT * FROM information_schema.innodb_trx;
```

2. **设置合理的超时时间**

```javascript
// 在 Sequelize 配置中设置
const sequelize = new Sequelize({
    dialectOptions: {
        innodb_lock_wait_timeout: 50, // 锁等待超时
        lock_wait_timeout: 50, // 元数据锁等待超时
        innodb_rollback_on_timeout: 1, // 超时时回滚整个事务
    },
});
```

3. **使用合适的隔离级别**

```javascript
const transaction = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 降低锁的竞争
});
```

4. **定期清理长时间运行的事务**

-   设置事务超时监控
-   自动回滚超时事务
-   记录并分析长时间运行的事务
