# DynamoDB GSI vs LSI - Complete Guide

This document explains the differences, limitations, costs, and best use cases for **Global Secondary Indexes (GSI)** and **Local Secondary Indexes (LSI)** in DynamoDB.

---

# Quick Comparison

| Feature | LSI | GSI |
|---------|-----|-----|
| Partition Key | Same as Table PK | Different from Table PK |
| Sort Key | Different from Table SK | Different (optional) |
| Create after table creation | ❌ No | ✅ Yes |
| Delete after creation | ❌ No | ✅ Yes |
| Change key schema | ❌ No | ❌ No (Delete & Recreate) |
| Strongly Consistent Reads | ✅ Supported | ❌ Not Supported |
| Eventually Consistent Reads | ✅ Supported | ✅ Always |
| Separate Storage | ✅ Yes | ✅ Yes |
| Separate Throughput | ❌ Shares Table | ✅ Independent (Provisioned) / Auto Scales (On-Demand) |
| Maximum per Table | 5 | 20 (Default AWS Quota) |
| 10 GB Partition Limit | ✅ Yes | ❌ No |
| Most Commonly Used | Rare | Very Common |

---

# Understanding LSI

## Definition

A Local Secondary Index (LSI) allows you to query the **same partition** using a different sort key.

Example Table

```
PK = category
SK = productId
```

LSI

```
PK = category
SK = price
```

Now you can query:

```
Mobile Products

sorted by Price
```

instead of

```
Mobile Products

sorted by Product ID
```

---

# Understanding GSI

A Global Secondary Index (GSI) allows you to query using an **entirely different partition key**.

Example Table

```
PK = category
SK = productId
```

GSI

```
PK = sellerId
SK = createdAt
```

Now you can query:

```
Products uploaded by Seller S101
```

without knowing the category.

---

# Creating Indexes

## LSI

Must be created **during table creation**.

Example

```text
Create Table

PK = category
SK = productId

LSI

PK = category
SK = price
```

Once the table is created,

❌ You cannot add another LSI.

If tomorrow you need:

```
category + rating
```

You must:

1. Create a new table
2. Copy all data
3. Update your application

---

## GSI

Can be added **any time**.

Example

Today

```
Table

PK = productId
```

Tomorrow

Need

```
Products by Category
```

Simply create

```
CategoryIndex

PK = category

SK = price
```

No table recreation required.

---

# Deleting Indexes

## LSI

❌ Cannot be deleted.

Once created,

It exists until the table is deleted.

---

## GSI

✅ Can be deleted anytime.

AWS Console

↓

Delete Index

Done.

---

# Modifying Indexes

Suppose today you have

```
BrandIndex

PK = brand

SK = price
```

Tomorrow

Need

```
PK = sellerId

SK = stock
```

## LSI

Impossible.

Cannot modify.

---

## GSI

Cannot modify the key schema either.

Instead,

1. Delete the old GSI
2. Create a new GSI

---

# Read Consistency

## LSI

Supports

```javascript
ConsistentRead: true
```

Meaning,

Immediately after writing,

You can read the latest value.

Useful for:

- Banking
- Orders
- Payments
- Inventory

---

## GSI

Only supports

```
Eventually Consistent Reads
```

Example

Current Stock

```
10
```

Application updates stock

```
5
```

Immediately querying the GSI may still return

```
10
```

After a short propagation delay,

It becomes

```
5
```

---

# Storage Cost

Indexes store additional data.

Example Item

```json
{
    "productId": "P1001",
    "category": "Mobile",
    "price": 90000
}
```

Main Table stores

```
productId
category
price
```

BrandIndex stores

```
brand
price
productId
```

SellerIndex stores

```
sellerId
createdAt
productId
```

Every index consumes additional storage.

More indexes

↓

Higher storage cost.

---

# Write Cost

Suppose

You insert

```
1 Product
```

Without indexes

```
1 Write
```

With

```
Main Table

+

SellerIndex

+

BrandIndex

+

CategoryIndex
```

DynamoDB updates

- Table
- GSI 1
- GSI 2
- GSI 3

More indexes

↓

More write operations

↓

Higher write cost

↓

Slightly higher write latency

---

# Read Cost

## LSI

Uses the same throughput as the base table.

Heavy LSI reads also consume table capacity.

---

## GSI

Uses independent throughput (Provisioned mode).

In On-Demand mode,

AWS automatically scales the GSI separately.

Heavy reads on the GSI do not consume the table's read capacity.

---

# Partition Size Limit

## LSI

Maximum

```
10 GB
```

per partition key.

Example

```
category = Mobile
```

If all Mobile products exceed

```
10 GB
```

The partition cannot grow further.

This is one of the biggest limitations of LSIs.

---

## GSI

No 10 GB partition-key limit.

Suitable for very large datasets.

---

# Number of Indexes

## LSI

Maximum

```
5
```

per table.

---

## GSI

Maximum

```
20
```

per table (default AWS service quota).

---

# Performance

## Main Table

Fastest

↓

Direct lookup.

---

## LSI

Very fast.

Shares the same partition as the table.

---

## GSI

Also fast,

but requires maintaining another index,

so writes have slightly more overhead.

---

# Typical Use Cases

## LSI

When the partition key remains the same,

but sorting changes.

Examples

```
Orders of Customer

sorted by Date

sorted by Amount

sorted by Status
```

Same customer,

different sorting.

---

## GSI

When querying by a completely different attribute.

Examples

```
Products by Seller

Products by Brand

Products by Category

Products by Warehouse

Orders by Status

Orders by Payment

Orders by Date
```

---

# Example (Products Table)

Main Table

```
PK = category

SK = productId
```

Queries

```
Show all Mobile products

Show Product P1001 in Mobile
```

---

PriceLSI

```
PK = category

SK = price
```

Queries

```
Most expensive mobiles

Cheapest mobiles
```

---

CreatedAtLSI

```
PK = category

SK = createdAt
```

Queries

```
Latest mobiles
```

---

SellerIndex

```
PK = sellerId

SK = createdAt
```

Queries

```
Seller dashboard

Recently added products
```

---

BrandIndex

```
PK = brand

SK = rating
```

Queries

```
Highest-rated Apple products
```

---

# When Should You Use LSI?

Use an LSI when:

- The partition key never changes.
- You need multiple ways to sort data within the same partition.
- You know the requirement before creating the table.
- Strongly consistent reads are required.

Example

```
Customer Orders

Sort by Date

Sort by Amount

Sort by Status
```

---

# When Should You Use GSI?

Use a GSI when:

- You need a different partition key.
- New query patterns may appear later.
- You want the flexibility to add/remove indexes.
- Eventual consistency is acceptable.

Example

```
Products by Seller

Products by Brand

Orders by Status

Orders by Payment Method
```

---

# Interview Tips

Interviewers often ask:

### Why is GSI more commonly used?

Because:

- Can be added later.
- Can be deleted later.
- Supports completely different access patterns.
- More flexible for changing business requirements.

---

### Why is LSI rarely used?

Because:

- Must be created with the table.
- Cannot be modified.
- Cannot be deleted.
- Has a 10 GB partition-key limit.

---

# Final Summary

| Feature | Main Table | LSI | GSI |
|---------|------------|-----|-----|
| Query by Primary Key | ✅ | ✅ | ❌ |
| Alternate Sort Order | ❌ | ✅ | ✅ |
| Different Partition Key | ❌ | ❌ | ✅ |
| Create Later | N/A | ❌ | ✅ |
| Delete Later | N/A | ❌ | ✅ |
| Modify Key Schema | N/A | ❌ | Delete & Recreate |
| Strongly Consistent Reads | ✅ | ✅ | ❌ |
| Eventually Consistent Reads | ✅ | ✅ | ✅ |
| Separate Storage | Base Table | ✅ | ✅ |
| Separate Throughput | Base Table | ❌ | ✅ |
| Extra Write Cost | — | ✅ | ✅ |
| 10 GB Partition-Key Limit | N/A | ✅ | ❌ |
| Maximum Indexes | N/A | 5 | 20 |

---

# Rule of Thumb

- **Main Table** → Primary access pattern.
- **LSI** → Same partition key, different sorting, known at design time.
- **GSI** → Different access patterns, different partition keys, and future flexibility.

> **In production systems, GSIs are used far more frequently than LSIs because they are easier to evolve as application requirements change.**

