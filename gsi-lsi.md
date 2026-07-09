# DynamoDB Products Table Design (Learning GSI & LSI)

This design is intended for learning DynamoDB concepts such as:

- Primary Key
- Sort Key
- Local Secondary Index (LSI)
- Global Secondary Index (GSI)
- QueryCommand
- ScanIndexForward
- BETWEEN
- begins_with
- FilterExpression

---

# Products Table

Instead of using:

```
PK = productId
```

We'll use:

```
Partition Key (PK) : category
Sort Key (SK)      : productId
```

## Sample Data

| category (PK) | productId (SK) | name | brand | sellerId | price | stock | rating | createdAt |
|---------------|----------------|------|---------|-----------|--------|-------|---------|------------|
| Mobile | P1001 | iPhone 16 | Apple | S101 | 89999 | 20 | 4.9 | 2026-07-01 |
| Mobile | P1002 | Galaxy S25 | Samsung | S102 | 79999 | 15 | 4.8 | 2026-07-02 |
| Mobile | P1003 | Vivo P45 | Vivo | S103 | 30000 | 18 | 4.5 | 2026-07-04 |
| Mobile | P1004 | Redmi Note | Xiaomi | S101 | 18000 | 30 | 4.2 | 2026-07-06 |
| Laptop | P2001 | MacBook | Apple | S101 | 150000 | 5 | 4.9 | 2026-07-01 |
| Laptop | P2002 | Dell XPS | Dell | S104 | 120000 | 6 | 4.8 | 2026-07-03 |
| Monitor | P3001 | Dell 27 | Dell | S104 | 35000 | 12 | 4.6 | 2026-07-02 |

---

# Main Table Queries

## 1. Get all Mobile products

```javascript
new QueryCommand({
    TableName: "Products",
    KeyConditionExpression: "category = :category",
    ExpressionAttributeValues: {
        ":category": "Mobile"
    }
});
```

---

## 2. Get a specific product

```javascript
new QueryCommand({
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

## 3. Get all Laptop products

```javascript
category = Laptop
```

---

# Local Secondary Index (LSI)

## Requirement

> Show the most expensive mobiles.

The table is sorted by:

```
productId
```

but we want to sort by:

```
price
```

### Create LSI

```
Index Name : PriceLSI

Partition Key : category
Sort Key      : price
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
new QueryCommand({

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

# Another LSI

## Requirement

> Show newest Mobile products

### Create

```
Index Name : CreatedAtLSI

Partition Key : category

Sort Key : createdAt
```

Query

```javascript
new QueryCommand({

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

---

# Global Secondary Index (GSI)

## GSI 1 - Seller Index

### Requirement

Seller wants to see all of their products.

### Create

```
Index Name : SellerIndex

Partition Key : sellerId

Sort Key : createdAt
```

Internal View

| sellerId | createdAt | productId |
|-----------|-----------|-----------|
| S101 | Jul1 | P1001 |
| S101 | Jul1 | P2001 |
| S101 | Jul6 | P1004 |

### Query

```javascript
new QueryCommand({

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

# GSI 2 - Brand Index

## Requirement

Show all Apple products.

### Create

```
Index Name : BrandIndex

Partition Key : brand

Sort Key : price
```

Internal View

| brand | price | productId |
|-------|-------|-----------|
| Apple | 89999 | P1001 |
| Apple |150000 | P2001 |

### Query

```javascript
new QueryCommand({

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

# GSI 3 - Stock Index

## Requirement

Warehouse team wants to find products running low on stock.

Add an attribute:

```
stockStatus
```

Possible values:

```
LOW
MEDIUM
HIGH
```

Example

| product | stock | stockStatus |
|----------|-------|-------------|
| P1001 | 20 | MEDIUM |
| P2001 | 5 | LOW |
| P1004 | 30 | HIGH |

### Create

```
Index Name : StockIndex

Partition Key : stockStatus

Sort Key : stock
```

### Query

```javascript
new QueryCommand({

    TableName: "Products",

    IndexName: "StockIndex",

    KeyConditionExpression:
        "stockStatus = :status",

    ExpressionAttributeValues: {
        ":status": "LOW"
    }
});
```

---

# GSI 4 - Rating Index

## Requirement

Find top-rated products.

Create

```
Index Name : RatingIndex

Partition Key : ratingBucket

Sort Key : rating
```

Example buckets

```
5_STAR
4_STAR
3_STAR
```

---

# API Examples

## Get all mobiles

```
GET /products?category=Mobile
```

Uses:

>Main Table

---

## Most expensive mobiles

```
GET /products?category=Mobile&sort=price
```

Uses:

>PriceLSI

---

## Latest mobiles

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

>SellerIndex (GSI)

---

## Products by Brand

```
GET /products?brand=Apple
```

Uses:

>BrandIndex (GSI)

---

## Low Stock Products

```
GET /products?stockStatus=LOW
```

Uses:

>StockIndex (GSI)

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
| Low stock products | StockIndex (GSI) |

---

# Production Recommendation

The above design is excellent for learning DynamoDB indexes, but in a real production e-commerce application, product IDs are globally unique.

A common production schema is:

## Main Table

```
PK = productId
```

### GSIs

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

This design allows:

- Direct lookup using `GetCommand`
- Flexible filtering using GSIs
- Better alignment with REST APIs (`GET /products/{productId}`)

---

# Learning Recommendation

To understand DynamoDB thoroughly, create two separate tables:

### ProductsSimple

```
PK = productId
```

Practice:

- CRUD APIs
- GetCommand
- Basic GSI usage

---

### ProductsAdvanced

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
- ScanIndexForward
- FilterExpression
- Pagination
- Limit
- LastEvaluatedKey

This combination gives you both production knowledge and strong interview preparation.
