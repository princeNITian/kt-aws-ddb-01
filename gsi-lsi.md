# DynamoDB Products Table Design (Learning Main Table, GSI & LSI)

This project is designed to learn DynamoDB concepts in a practical way using an e-commerce application.

By the end of this example, you'll understand:

- Primary Key
- Sort Key
- QueryCommand
- Local Secondary Index (LSI)
- Global Secondary Index (GSI)
- ScanIndexForward
- FilterExpression
- BETWEEN
- begins_with
- API Design using Query Parameters

---

# Products Table

Instead of using:

```
PK = productId
```

We'll intentionally design the table to practice both GSI and LSI.

```
Partition Key (PK) : category
Sort Key (SK)      : productId
```

---

# Sample Data

| category (PK) | productId (SK) | name | brand | sellerId | price | stock | rating | createdAt |
|---------------|----------------|------|---------|-----------|--------|-------|---------|------------|
| Mobile | P1001 | iPhone 16 | Apple | S101 | 89999 | 20 | 4.9 | 2026-07-01 |
| Mobile | P1002 | Galaxy S25 | Samsung | S102 | 79999 | 15 | 4.8 | 2026-07-02 |
| Mobile | P1003 | Vivo P45 | Vivo | S103 | 30000 | 18 | 4.5 | 2026-07-04 |
| Mobile | P1004 | Redmi Note | Xiaomi | S101 | 18000 | 30 | 4.2 | 2026-07-06 |
| Laptop | P2001 | MacBook Pro | Apple | S101 | 150000 | 5 | 4.9 | 2026-07-01 |
| Laptop | P2002 | Dell XPS | Dell | S104 | 120000 | 6 | 4.8 | 2026-07-03 |
| Monitor | P3001 | Dell 27 Monitor | Dell | S104 | 35000 | 12 | 4.6 | 2026-07-02 |

---

# Main Table Queries

## Requirement 1

> Show all Mobile products

```javascript
const command = new QueryCommand({
    TableName: "Products",

    KeyConditionExpression:
        "category = :category",

    ExpressionAttributeValues: {
        ":category": "Mobile"
    }
});
```

---

## Requirement 2

> Get a specific product

```javascript
const command = new QueryCommand({
    TableName: "Products",

    KeyConditionExpression:
        "category = :category AND productId = :productId",

    ExpressionAttributeValues: {
        ":category": "Mobile",
        ":productId": "P1001"
    }
});
```

---

## Requirement 3

> Show all Laptop products

```javascript
category = Laptop
```

---

# Local Secondary Index (LSI)

LSI allows us to use the **same partition key** but sort the data differently.

---

# LSI 1 - PriceLSI

## Requirement

> Show the most expensive mobiles.

The table is sorted by:

```
productId
```

But we want it sorted by:

```
price
```

### Create

```
Index Name : PriceLSI

Partition Key : category

Sort Key : price
```

### Internal View

| category | price | productId |
|----------|-------|-----------|
| Mobile | 18000 | P1004 |
| Mobile | 30000 | P1003 |
| Mobile | 79999 | P1002 |
| Mobile | 89999 | P1001 |

### Query

```javascript
const command = new QueryCommand({

    TableName: "Products",

    IndexName: "PriceLSI",

    KeyConditionExpression:
        "category = :category",

    ExpressionAttributeValues: {
        ":category": "Mobile"
    },

    ScanIndexForward: false,

    Limit: 1
});
```

Result

```
iPhone 16
89999
```

---

# LSI 2 - CreatedAtLSI

## Requirement

> Show the latest Mobile products.

### Create

```
Index Name : CreatedAtLSI

Partition Key : category

Sort Key : createdAt
```

### Query

```javascript
const command = new QueryCommand({

    TableName: "Products",

    IndexName: "CreatedAtLSI",

    KeyConditionExpression:
        "category = :category",

    ExpressionAttributeValues: {
        ":category": "Mobile"
    },

    ScanIndexForward: false,

    Limit: 5
});
```

Result

```
Latest Mobile products
```

---

# Global Secondary Index (GSI)

Unlike an LSI, a GSI can have a completely different partition key.

---

# GSI 1 - SellerIndex

## Requirement

> Seller wants to see all of their products.

### Create

```
Index Name : SellerIndex

Partition Key : sellerId

Sort Key : createdAt
```

### Internal View

| sellerId | createdAt | productId |
|-----------|-----------|-----------|
| S101 | 2026-07-01 | P1001 |
| S101 | 2026-07-01 | P2001 |
| S101 | 2026-07-06 | P1004 |

### Query

```javascript
const command = new QueryCommand({

    TableName: "Products",

    IndexName: "SellerIndex",

    KeyConditionExpression:
        "sellerId = :seller",

    ExpressionAttributeValues: {
        ":seller": "S101"
    }
});
```

---

# GSI 2 - BrandIndex

## Requirement

> Show all Apple products.

### Create

```
Index Name : BrandIndex

Partition Key : brand

Sort Key : price
```

### Internal View

| brand | price | productId |
|--------|-------|-----------|
| Apple | 89999 | P1001 |
| Apple |150000 | P2001 |

### Query

```javascript
const command = new QueryCommand({

    TableName: "Products",

    IndexName: "BrandIndex",

    KeyConditionExpression:
        "brand = :brand",

    ExpressionAttributeValues: {
        ":brand": "Apple"
    }
});
```

---

# GSI 3 - SellerStockIndex

## Requirement

> Seller wants to see inventory ordered by available stock.

We'll use the existing `stock` attribute.

### Create

```
Index Name : SellerStockIndex

Partition Key : sellerId

Sort Key : stock
```

### Internal View

| sellerId | stock | productId |
|-----------|-------|-----------|
| S101 | 5 | P2001 |
| S101 | 20 | P1001 |
| S101 | 30 | P1004 |

### Query

```javascript
const command = new QueryCommand({

    TableName: "Products",

    IndexName: "SellerStockIndex",

    KeyConditionExpression:
        "sellerId = :seller",

    ExpressionAttributeValues: {
        ":seller": "S101"
    }
});
```

Result

```
MacBook Pro
iPhone 16
Redmi Note
```

The seller immediately sees products with the lowest stock first.

---

# GSI 4 - BrandRatingIndex

## Requirement

> Customer wants to see the highest-rated products for a brand.

### Create

```
Index Name : BrandRatingIndex

Partition Key : brand

Sort Key : rating
```

### Internal View

| brand | rating | productId |
|--------|--------|-----------|
| Apple | 4.9 | P1001 |
| Apple | 4.9 | P2001 |
| Samsung | 4.8 | P1002 |
| Vivo | 4.5 | P1003 |

### Query

```javascript
const command = new QueryCommand({

    TableName: "Products",

    IndexName: "BrandRatingIndex",

    KeyConditionExpression:
        "brand = :brand",

    ExpressionAttributeValues: {
        ":brand": "Apple"
    },

    ScanIndexForward: false
});
```

Result

```
Highest-rated Apple products
```

---

# API Examples

## Get all Mobile products

```
GET /products?category=Mobile
```

Uses:

>Main Table

---

## Most expensive Mobile

```
GET /products?category=Mobile&sort=price
```

Uses:

>PriceLSI

---

## Latest Mobile

```
GET /products?category=Mobile&sort=latest
```

Uses:

>CreatedAtLSI

---

## Products by Seller

```
GET /products?sellerId=S101
```

Uses:

>SellerIndex

---

## Seller Inventory

```
GET /products?sellerId=S101&sort=stock
```

Uses:

>SellerStockIndex

---

## Products by Brand

```
GET /products?brand=Apple
```

Uses:

>BrandIndex

---

## Highest Rated Apple Products

```
GET /products?brand=Apple&sort=rating
```

Uses:

>BrandRatingIndex

---

# Summary

| Requirement | Uses |
|--------------|------|
| Products by category | Main Table |
| Product by category + productId | Main Table |
| Most expensive product in category | PriceLSI |
| Latest products in category | CreatedAtLSI |
| Products by seller | SellerIndex (GSI) |
| Products by brand | BrandIndex (GSI) |
| Seller inventory sorted by stock | SellerStockIndex (GSI) |
| Highest-rated products of a brand | BrandRatingIndex (GSI) |

---

# Important Learning Note

Every GSI and LSI in this document uses **attributes that already exist** in the table.

Current attributes are:

- category
- productId
- brand
- sellerId
- price
- stock
- rating
- createdAt

In real-world DynamoDB applications, developers often add **derived attributes** to support additional access patterns.

Examples:

```
stockStatus = LOW | MEDIUM | HIGH

ratingBucket = 5_STAR | 4_STAR
```

These attributes are **not automatically created by DynamoDB**.

Your application computes and stores them while writing the item.

This guide intentionally avoids derived attributes so that every example can be implemented directly using the current table schema.

---

# Production Recommendation

The above design is excellent for learning DynamoDB indexes.

However, most production e-commerce applications use:

```
PK = productId
```

because product IDs are globally unique.

Typical GSIs are:

```
CategoryPriceIndex

PK = category

SK = price
```

```
CategoryCreatedAtIndex

PK = category

SK = createdAt
```

```
SellerIndex

PK = sellerId

SK = createdAt
```

```
BrandIndex

PK = brand

SK = price
```

This allows:

- Direct lookup using `GetCommand`
- Flexible filtering using `QueryCommand`
- REST API compatibility (`GET /products/{productId}`)

---

# Learning Recommendation

For learning DynamoDB thoroughly, create two tables.

## ProductsSimple

```
PK = productId
```

Practice:

- CRUD APIs
- GetCommand
- Basic GSI

---

## ProductsAdvanced

```
PK = category

SK = productId
```

Practice:

- QueryCommand
- GSIs
- LSIs
- BETWEEN
- begins_with
- FilterExpression
- ScanIndexForward
- Pagination
- Limit
- LastEvaluatedKey

This combination gives you both production knowledge and strong interview preparation.