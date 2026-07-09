# DynamoDB GSI & LSI - Interview Approach

If I were in an **Amazon/Microsoft/Uber SDE-2 interview**, I wouldn't jump directly into definitions. I'd answer in a structured way that shows I understand **why indexes exist**, not just what they are.

Here's how I'd approach it.

---

# Step 1: Start with the Problem

> DynamoDB is designed around access patterns. Every table has one primary key, which means you can efficiently query only using that key. As applications grow, new query requirements emerge. Secondary indexes allow us to support those additional access patterns without duplicating data into another table.

This tells the interviewer you understand the motivation.

---

# Step 2: Explain the Main Table

Suppose we have a simple system for managing employee records.

Main table:

| employeeId (PK) | name | department | managerId | joiningDate | salary |
|-----------------|------|------------|-----------|-------------|--------|
| E101 | Alice | Engineering | M1 | 2024-01-10 | 120000 |
| E102 | Bob | Engineering | M1 | 2024-02-15 | 100000 |
| E103 | Charlie | HR | M2 | 2023-11-05 | 90000 |

Primary Key

```text
PK = employeeId
```

This table is excellent for:

```text
Get employee by ID
```

Example

```text
employeeId = E102
```

Very fast.

---

# Step 3: Introduce the Problem

Now imagine the business asks:

> Show all employees in the Engineering department.

Can we query this efficiently?

No.

Because the partition key is

```text
employeeId
```

Not

```text
department
```

Without an index,

the only option is

```text
Scan
```

which reads the entire table.

This is inefficient.

---

# Step 4: Introduce GSI

Now I'd say:

> This is exactly where a Global Secondary Index helps.

Create

```text
DepartmentIndex

PK = department

SK = joiningDate
```

Now the index looks conceptually like:

| department | joiningDate | employeeId |
|------------|-------------|------------|
| Engineering | 2024-01-10 | E101 |
| Engineering | 2024-02-15 | E102 |
| HR | 2023-11-05 | E103 |

Now I can efficiently answer

```text
Show all Engineering employees
```

or

```text
Newest employees in Engineering
```

using a `Query` instead of a `Scan`.

---

# Step 5: Explain LSI

Suppose instead the table is designed as

```text
PK = department

SK = employeeId
```

Now all Engineering employees are already grouped together.

But HR asks:

> Show Engineering employees ordered by salary.

The table is sorted by

```text
employeeId
```

not

```text
salary
```

So we create an LSI.

```text
SalaryLSI

PK = department

SK = salary
```

Notice

Partition key

doesn't change.

Only the sort key changes.

That's the defining characteristic of an LSI.

---

# Step 6: Explain the Difference

Now I'd summarize:

> The biggest conceptual difference is that an LSI provides another way to sort data within the same partition, whereas a GSI provides an entirely new way to partition and query the data.

---

# Step 7: Mention Limitations

Then I'd naturally mention the important trade-offs.

### LSI

- Same partition key as table
- Must be created with the table
- Cannot be added later
- Supports strongly consistent reads
- Maximum 5 per table
- 10 GB limit per partition key

### GSI

- Different partition key allowed
- Can be created later
- Can be deleted later
- Eventually consistent only
- Maximum 20 per table (default quota)
- Separate storage and additional write cost

---

# Step 8: Talk About Cost

Another important point:

> Every write to the table must also update the affected indexes. So indexes improve read performance but increase write cost and storage. It's always a trade-off between read efficiency and write overhead.

That shows you understand the operational implications.

---

# Step 9: Finish with a Rule of Thumb

I usually end with:

> If I need another sort order within the same partition, I think about an LSI. If I need a completely different lookup pattern, I use a GSI. In practice, GSIs are used much more frequently because business requirements evolve, and GSIs can be added after the table has been created.

---

# A Concise 2-Minute Interview Answer

> DynamoDB tables are optimized for queries on their primary key. When new access patterns appear, secondary indexes let us query efficiently without scanning the table.
>
> A **Global Secondary Index (GSI)** lets us define a different partition key and optional sort key, enabling completely new query patterns. For example, if the table is keyed by `employeeId` but we need to query employees by `department`, we can create a GSI with `department` as the partition key.
>
> A **Local Secondary Index (LSI)** keeps the same partition key as the base table but allows a different sort key. For example, if the table is keyed by `(department, employeeId)`, an LSI with `salary` as the sort key lets us retrieve employees in a department ordered by salary.
>
> LSIs must be defined when the table is created, support strongly consistent reads, and have a 10 GB limit per partition key. GSIs can be added or removed later, support only eventually consistent reads, and provide much more flexibility. Both consume additional storage and increase write overhead because DynamoDB maintains the indexes whenever the base table is updated.

This flow demonstrates not just definitions, but also **data modeling, access patterns, trade-offs, and practical reasoning**, which is what interviewers are usually looking for.
