# Backend & AWS Interview Roadmap (SDE-2 Level)

Given what we've covered so far (AWS SDK v3, Lambda, API Gateway, DynamoDB CRUD, GSI/LSI), you're already moving beyond beginner level. For an **SDE-2 backend interview (Amazon, Microsoft, Uber, Atlassian, Walmart, etc.)**, I'd expect you to be comfortable explaining not just **how** to use a service, but also **why** it is designed that way.

Here's the roadmap I'd recommend.

---

# 1. DynamoDB (Deep Dive) ⭐⭐⭐⭐⭐

Don't stop at CRUD. Master the "why" behind DynamoDB.

## Data Modeling

- Partition Key selection
- Sort Key design
- Composite keys
- Single-table vs Multi-table design
- Access pattern driven design
- Hot partitions
- High cardinality vs Low cardinality
- Item collections

Interview style:

> "Design a messaging application in DynamoDB."

---

## Query APIs

- GetItem
- PutItem
- UpdateItem
- DeleteItem
- Query
- Scan

Know exactly:

- When to use Query
- Why Scan is expensive
- Query vs Scan complexity

---

## Expressions

- KeyConditionExpression
- FilterExpression
- ProjectionExpression
- ConditionExpression
- UpdateExpression

Examples

```javascript
SET
REMOVE
ADD
DELETE
```

---

## Update Expressions

Explain things like

```javascript
SET balance = balance + 100
```

```javascript
list_append()
```

```javascript
if_not_exists()
```

Atomic counters

---

## Pagination

Very common interview topic

```text
Limit

LastEvaluatedKey

ExclusiveStartKey
```

Implement pagination in Lambda.

---

## Conditional Writes

```text
attribute_exists()

attribute_not_exists()

begins_with()

BETWEEN()

IN
```

Interview question

> Prevent duplicate usernames.

---

## Batch Operations

```text
BatchGetItem

BatchWriteItem
```

Know limitations.

---

## Transactions

```text
TransactWriteItems

TransactGetItems
```

Example

Transfer money

Debit

↓

Credit

↓

Atomicity

---

## Streams

Explain

```text
INSERT

MODIFY

REMOVE
```

Lambda Trigger

Use cases

- Notifications
- Audit logs
- Analytics

---

## TTL

Automatic expiration

Example

- OTP
- Sessions
- Cache

---

## Capacity Modes

- Provisioned
- On-Demand

Interview favorite.

---

## Consistency

- Eventually Consistent
- Strongly Consistent

Know why GSI doesn't support strong consistency.

---

# 2. Lambda ⭐⭐⭐⭐⭐

Everyone can write Lambda.

Few can explain production Lambda.

Topics

- Cold Start
- Warm Start
- Reuse SDK clients
- Environment Variables
- Layers
- Memory vs CPU
- Timeout
- Retry
- DLQ
- Idempotency
- Reserved Concurrency
- Provisioned Concurrency

Interview

> Lambda processing SQS twice.

How do you prevent duplicate processing?

---

# 3. API Gateway ⭐⭐⭐⭐

Know

- REST API
- HTTP API
- Authentication
- Authorizers
- CORS
- Stages
- Deployments
- Throttling
- Usage Plans
- API Keys
- Lambda Proxy Integration
- Request Validation

---

# 4. S3 ⭐⭐⭐⭐

Topics

- Lifecycle
- Versioning
- Multipart Upload
- Pre-signed URLs
- Storage Classes
- Replication
- Encryption
- Event Notifications

Interview

Upload

↓

Virus Scan

↓

Thumbnail

↓

Store Metadata

---

# 5. SQS ⭐⭐⭐⭐⭐

Very common.

Know

- Standard Queue
- FIFO Queue
- Visibility Timeout
- DLQ
- Long Polling
- Batch Processing
- Exactly Once?
- At Least Once?
- Idempotency

---

# 6. SNS ⭐⭐⭐⭐

Fan-out

Multiple Subscribers

- Email
- Lambda
- SQS
- HTTP

Interview

Order Placed

↓

Email

↓

SMS

↓

Analytics

↓

Warehouse

---

# 7. EventBridge ⭐⭐⭐⭐

When SNS isn't enough.

Topics

- Routing
- Filtering
- Scheduling
- Event Bus
- Cross-account

---

# 8. IAM ⭐⭐⭐⭐⭐

Huge interview topic.

Know

- Policies
- Roles
- Users
- Groups
- Resource Policies
- Trust Policies
- Least Privilege
- Lambda Execution Role
- Cross-account Role

---

# 9. Cognito ⭐⭐⭐⭐

Topics

- Authentication
- JWT
- Access Token
- Refresh Token
- Identity Pool
- User Pool
- PKCE
- OAuth

---

# 10. CloudWatch ⭐⭐⭐⭐

Topics

- Logs
- Metrics
- Alarms
- Dashboards
- Insights
- Structured Logging
- Tracing

---

# 11. X-Ray / OpenTelemetry ⭐⭐⭐⭐

Topics

- Distributed Tracing
- Trace IDs
- Spans
- Service Maps

Since you've already worked with OpenTelemetry, this is a strong area to leverage.

---

# 12. Step Functions ⭐⭐⭐⭐

Topics

- Workflow
- Retry
- Choice
- Parallel
- Map
- Saga Pattern

Interview

Order Processing

↓

Payment

↓

Inventory

↓

Shipping

---

# 13. AWS SDK v3 ⭐⭐⭐⭐⭐

Know

- DocumentClient
- Low-level Client
- Middleware
- Retry Strategy
- Paginator
- Marshall
- Unmarshall
- Error Handling

---

# 14. Backend Design ⭐⭐⭐⭐⭐

These are asked constantly.

Design

- Chat Application
- URL Shortener
- Notification System
- Rate Limiter
- Job Queue
- Inventory System
- Order Processing
- File Upload
- Audit Logging
- Search System

---

# 15. System Design ⭐⭐⭐⭐⭐

SDE-2 level

- Caching
- Redis
- Partitioning
- Sharding
- Replication
- Load Balancer
- CDN
- Database Indexes
- CAP Theorem
- Consistency
- Availability
- Scaling

---

# 16. Node.js Backend ⭐⭐⭐⭐⭐

Topics

- Event Loop
- Streams
- Buffers
- Worker Threads
- Cluster
- Async Hooks
- Memory Leak
- Garbage Collection
- EventEmitter

---

# 17. JavaScript / TypeScript ⭐⭐⭐⭐⭐

Topics

- Closures
- this
- Prototype
- Promise
- Event Loop
- Microtasks
- Macrotasks
- Generators
- Iterators
- Decorators
- Generics
- Utility Types
- Mapped Types
- Conditional Types

---

# 18. Database Fundamentals ⭐⭐⭐⭐⭐

Topics

- Normalization
- Indexes
- Transactions
- Isolation Levels
- Locks
- MVCC
- Optimistic Locking
- Pessimistic Locking
- ACID
- BASE

---

# 19. Design Patterns ⭐⭐⭐⭐

Topics

- Repository
- Factory
- Strategy
- Adapter
- Observer
- Decorator
- Builder
- Dependency Injection

---

# 20. Production Engineering ⭐⭐⭐⭐⭐

Topics

- Retries
- Circuit Breaker
- Exponential Backoff
- Rate Limiting
- Feature Flags
- Blue-Green Deployment
- Canary Deployment
- Rolling Deployment
- Health Checks
- Monitoring
- Alerting
- Logging
- Metrics
- Tracing

---

# Topics I'd Master for an SDE-2 Backend Role

If I had to prioritize the highest-impact topics, I'd focus on these:

| Priority | Topic | Why It Matters |
|----------|-------|----------------|
| ⭐⭐⭐⭐⭐ | DynamoDB Deep Dive | Core AWS backend interviews |
| ⭐⭐⭐⭐⭐ | Lambda | Almost every serverless backend uses it |
| ⭐⭐⭐⭐⭐ | SQS + SNS | Event-driven architecture is extremely common |
| ⭐⭐⭐⭐⭐ | IAM | Security questions appear frequently |
| ⭐⭐⭐⭐⭐ | System Design | Essential for SDE-2 |
| ⭐⭐⭐⭐⭐ | Node.js Internals | Demonstrates backend expertise |
| ⭐⭐⭐⭐⭐ | Database Fundamentals | Applies across SQL and NoSQL |
| ⭐⭐⭐⭐ | API Gateway | Core API architecture |
| ⭐⭐⭐⭐ | S3 | File processing and storage |
| ⭐⭐⭐⭐ | CloudWatch & Observability | Production readiness |
| ⭐⭐⭐⭐ | Step Functions | Workflow orchestration |
| ⭐⭐⭐⭐ | Cognito | Authentication and authorization |

---

# My Suggestion for Our Sessions

The way we explored **GSI/LSI**—starting with the problem, building intuition, discussing trade-offs, then moving to implementation—is ideal for interview preparation.

We can build the rest of the topics in the same style.

For example:

### Lambda

- Why serverless?
- Cold starts
- Execution model
- Retries
- Idempotency
- Production pitfalls
- Implementation

---

### SQS

- Why queues?
- At-least-once delivery
- Visibility timeout
- Dead-letter queues
- Ordering
- Implementation

---

### SNS

- Why pub/sub?
- Fan-out architecture
- Delivery guarantees
- Real-world event flows

---

### System Design

- Start from requirements
- Identify bottlenecks
- Compare alternatives
- Justify trade-offs

---

This approach helps you answer interview questions naturally instead of reciting definitions, which is what experienced interviewers are usually evaluating.