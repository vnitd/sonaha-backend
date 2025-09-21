Sonaha Backend

A scalable backend for a land sales system, built with NestJS, Prisma, and MySQL. It provides APIs for managing land listings, purchases, and user roles (Admin and Customer).

🚀 Features





🏞️ Land Management – Admins can add, edit, and delete land listings.



💸 Purchase Processing – Customers can view and buy land.



🔐 Authentication – Secure login for Admins (full access) and Customers (view/purchase) using asymmetric cryptography.

🛠️ Tech Stack





Backend: NestJS, TypeScript



ORM: Prisma



Database: MySQL (via Docker)



Authentication: JWT with asymmetric keys (RSA/ECDSA)



Tools: Docker, Git, Postman

📂 Project Structure

sonaha-backend/
├── prisma/          # Prisma schema and migrations
├── src/            # Source code
│   ├── modules/    # API modules (auth, land, purchases)
│   ├── services/   # Business logic
│   └── main.ts     # App entry point
├── docker-compose.yml  # Docker config for MySQL
└── README.md

⚡ Installation & Setup

1️⃣ Clone repository

git clone https://github.com/username/sonaha-backend.git
cd sonaha-backend
npm install

2️⃣ Setup database (Docker)

Use docker-compose.yml:

version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: sonaha_db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - '3306:3306'
    volumes:
      - db-data:/var/lib/mysql
volumes:
  db-data:

Run:

docker-compose up -d

Set .env:

DATABASE_URL=mysql://user:password@localhost:3306/sonaha_db

3️⃣ Setup Prisma

npx prisma migrate dev

4️⃣ Configure authentication

Set asymmetric keys in .env:

JWT_PRIVATE_KEY=your_private_key
JWT_PUBLIC_KEY=your_public_key

5️⃣ Run backend

npm run start:dev

App runs at: http://localhost:3000

🧪 Tests

# Unit tests
npm run test
# E2E tests
npm run test:e2e

🚀 Deployment

Follow NestJS deployment docs or use Mau:

npm install -g mau
mau deploy

🤝 Contributing





Fork repo.



Create branch (git checkout -b feature/your-feature).



Commit (git commit -m 'Add feature').



Push (git push origin feature/your-feature).



Create Pull Request.

📚 Resources





NestJS Docs



Prisma Docs



Docker Docs

📜 License

MIT