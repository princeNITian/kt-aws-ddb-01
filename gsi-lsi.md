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

### Internal View

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

### Internal View

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

## GSI 3 - Seller Inventory Index

### Requirement

A seller wants to view all of their products ordered by available stock.

Instead of introducing a new attribute, we'll use the existing `stock` field.

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
new QueryCommand({

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
MacBook
iPhone
Redmi Note
```

Since the sort key is `stock`, the seller immediately sees products with the lowest inventory first.

## GSI 4 - Brand Rating Index

### Requirement

Customers want to see the highest-rated products for a particular brand.

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
new QueryCommand({

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