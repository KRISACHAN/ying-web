# Complete Guide to MySQL Locks in Sequelize

## 1. Basic Lock Concepts

### 1.1 Table Lock

**Concept**: Locks read/write permissions for an entire table

**MySQL Syntax**:

```sql
-- Lock single table
LOCK TABLES table_name READ;    -- Read lock
LOCK TABLES table_name WRITE;   -- Write lock

-- Lock multiple tables
LOCK TABLES
    users READ,              -- Read lock for users table
    orders WRITE,           -- Write lock for orders table
    products READ;          -- Read lock for products table

-- Unlock all tables
UNLOCK TABLES;
```

**Unlock Notes**:

-   `UNLOCK TABLES` releases all locked tables in the current session
-   No need to specify table names
-   Table locks are session-based
-   All table locks are automatically released when the session ends

**Important Notes**:

-   A session can only hold one set of table locks at a time
-   Executing `LOCK TABLES` implicitly releases all previous table locks
-   When locking multiple tables, it must be done in a single `LOCK TABLES` statement

```sql
-- Incorrect approach
LOCK TABLES users READ;
LOCK TABLES orders WRITE;  -- This will release the lock on users table

-- Correct approach
LOCK TABLES users READ, orders WRITE;
```

**Sequelize Implementation**:

-   Sequelize doesn't directly provide table lock operations
-   Similar effects can be achieved through transaction isolation levels

**Problems Solved**:

-   Ensures whole table data consistency
-   Suitable for full table updates, backups, etc.

**Drawbacks**:

-   Poor concurrent performance
-   Can easily block other operations

### 1.2 Row Lock

#### 1.2.1 Shared Lock (S Lock)

**Concept**: Allows multiple transactions to read the same row simultaneously while preventing modifications

**MySQL Syntax**:

```sql
SELECT * FROM table_name WHERE id = 1 LOCK IN SHARE MODE;
```

**Sequelize Implementation**:

```javascript
await Model.findOne({
    where: { id: 1 },
    lock: true,
    transaction,
});
```

**Problems Solved**:

-   Ensures data read consistency
-   Prevents data modification during reading

**Drawbacks**:

-   Impacts write performance
-   May cause write waiting

#### 1.2.2 Exclusive Lock (X Lock)

**Concept**: Prevents other transactions from reading or modifying the locked row

**MySQL Syntax**:

```sql
SELECT * FROM table_name WHERE id = 1 FOR UPDATE;
```

**Sequelize Implementation**:

```javascript
await Model.findOne({
    where: { id: 1 },
    lock: Transaction.LOCK.UPDATE,
    transaction,
});
```

**Problems Solved**:

-   Prevents concurrent update conflicts
-   Ensures data update atomicity

**Drawbacks**:

-   Large lock granularity
-   Can easily cause deadlocks

### 1.3 Optimistic Lock

**Concept**: Detects concurrent conflicts using version numbers or timestamps

**MySQL Implementation**:

```sql
-- Using version number
UPDATE table_name
SET data = 'new_value', version = version + 1
WHERE id = 1 AND version = 1;
```

**Sequelize Implementation**:

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

**Problems Solved**:

-   Suitable for read-heavy scenarios
-   No database-level locking required

**Drawbacks**:

-   May require retry mechanism
-   Cannot completely avoid concurrent issues

## 2. Practical Application Scenarios

### 2.1 Inventory Deduction Scenario

```javascript
// Using pessimistic locking
async function deductStock(productId, quantity) {
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.findOne({
            where: { id: productId },
            lock: Transaction.LOCK.UPDATE,
            transaction,
        });

        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
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

### 2.2 Account Transfer Scenario

```javascript
// Using ordered locking to prevent deadlocks
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

        // Transfer logic
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
```

## 3. Performance Optimization Strategies

### 3.1 Minimize Lock Scope

```javascript
// Good practice
await Model.findOne({
    where: { id: targetId },
    lock: true,
    transaction,
});

// Practice to avoid
await Model.findAll({
    lock: true,
    transaction,
});
```

### 3.2 Minimize Lock Duration

```javascript
// Good practice
const data = await heavyOperation(); // Complete time-consuming operation first
const transaction = await sequelize.transaction();
await doUpdate(data, transaction);
await transaction.commit();
```

### 3.3 Use Appropriate Indexes

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

## 4. Important Considerations

1. Choose appropriate lock types

    - Read-heavy: Prefer optimistic locking
    - Write-heavy: Consider pessimistic locking
    - Full table operations: Consider table locks

2. Prevent deadlocks

    - Fixed locking order
    - Set reasonable timeout values
    - Avoid large transactions

3. Performance considerations
    - Appropriate lock granularity
    - Necessary index support
    - Reasonable transaction isolation levels

## 5. Common Lock Issues

### 5.1 Deadlock

**Concept**: Two or more transactions mutually holding locks needed by each other, forming a circular wait.

**Example**:

```sql
-- Transaction 1:
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Lock account 1
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Wait for account 2's lock

-- Transaction 2:
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 2;  -- Lock account 2
UPDATE accounts SET balance = balance + 100 WHERE id = 1;  -- Wait for account 1's lock
```

**Solutions**:

1. Fixed Lock Order

```javascript
async function transfer(fromId, toId, amount) {
    const [smallId, bigId] = [fromId, toId].sort((a, b) => a - b);
    // Always lock account with smaller ID first
    const account1 = await Account.findByPk(smallId, { lock: true });
    const account2 = await Account.findByPk(bigId, { lock: true });
}
```

2. Set Lock Timeout

```javascript
const sequelize = new Sequelize({
    dialectOptions: {
        innodb_lock_wait_timeout: 50, // Timeout after 50 seconds
    },
});
```

3. Use Transaction Retry Mechanism

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

### 5.2 Lock Wait Timeout

**Concept**: Transaction exceeds the time limit while waiting to acquire a lock.

**Causes**:

-   Long transactions holding locks
-   Too many concurrent requests
-   Improper index usage leading to large lock ranges

**Solutions**:

1. Optimize Transaction Size

```javascript
// Bad practice
const transaction = await sequelize.transaction();
await processLargeDataSet(); // Time-consuming operation
await transaction.commit();

// Good practice
for (const chunk of dataChunks) {
    const transaction = await sequelize.transaction();
    await processChunk(chunk);
    await transaction.commit();
}
```

2. Add Appropriate Indexes

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

### 5.3 Lock Escalation

**Concept**: Database might escalate row locks to table locks when a single transaction locks too many rows.

**Problems**:

-   Reduces concurrency
-   May block other transactions

**Prevention Measures**:

1. Control Number of Locked Records

```javascript
// Bad practice
await Model.update(data, {
    where: { status: 'pending' }, // Might lock many records
    lock: true,
});

// Good practice
await Model.update(data, {
    where: {
        status: 'pending',
        id: { [Op.in]: specificIds }, // Limit update range
    },
    lock: true,
});
```

2. Process Large Data in Batches

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

### 5.4 Best Practices

1. **Monitor Lock Issues**

```sql
-- Check current lock waits
SELECT * FROM information_schema.innodb_lock_waits;

-- Check current transactions
SELECT * FROM information_schema.innodb_trx;
```

2. **Set Reasonable Timeouts**

```javascript
// In Sequelize configuration
const sequelize = new Sequelize({
    dialectOptions: {
        innodb_lock_wait_timeout: 50, // Lock wait timeout
        lock_wait_timeout: 50, // Metadata lock wait timeout
        innodb_rollback_on_timeout: 1, // Rollback entire transaction on timeout
    },
});
```

3. **Use Appropriate Isolation Levels**

```javascript
const transaction = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // Reduce lock contention
});
```

4. **Regular Cleanup of Long-Running Transactions**

-   Set transaction timeout monitoring
-   Automatically rollback timeout transactions
-   Log and analyze long-running transactions
