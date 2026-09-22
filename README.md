# Adi Anadi Restaurant — Ordering & Guest Booking System

> Full README will be completed in Phase 17. See `.kiro/specs/restaurant-ordering/` for full design documents.

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.x
- Maven 3.9+

### Backend
```bash
cd backend
mvn clean package
java -jar target/restaurant-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
```sql
-- Run schema first, then seed data
source backend/src/main/resources/db/schema.sql
source backend/src/main/resources/db/data.sql
```
