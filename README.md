# 📁 File Upload API – Node.js + Express + MongoDB

A secure and authenticated REST API that allows users to upload, download, manage, and delete files with access control and metadata tracking.

---

## 🚀 Features

- ✅ User authentication via JWT
- 📤 File uploads using Multer (images, PDFs)
- 📄 File metadata stored in MongoDB
- 🔒 Access control: private or public
- 📥 File downloads by owner or public access
- ❌ File deletion by owner only
- 🔄 Toggle file visibility (public/private)
- ⚙️ RESTful route structure

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Multer** (for file handling)
- **JWT** (for authentication)

---

## 🔐 Authentication

All API routes (except `/api/user/signup` and `/api/user/signin`) require a **Bearer JWT Token**.

**Header Format:**

```
Authorization: Bearer <your-jwt-token>
```

---

## 📦 API Endpoints

### 🔸 POST `/api/files/upload`

Upload a file

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `multipart/form-data` with key `file`
- **Response**: Upload success message + file metadata

---

### 🔸 GET `/api/files/`

List all files uploaded by the logged-in user

---

### 🔸 GET `/api/files/public`

List all public files

---

### 🔸 GET `/api/files/:id`

Download file by ID

- Accessible by **owner** or if the file is **public**

---

### 🔸 DELETE `/api/files/:id`

Delete a file by ID

- Only the **uploader** can delete their own file

---

### 🔸 PUT `/api/files/:id/public`

Mark a file as public (owner only)

---

### 🔸 PUT `/api/files/:id/private`

Mark a file as private (owner only)

---

## 🧾 File Metadata Fields

Each uploaded file stores the following metadata in MongoDB:

- `originalName`: Original file name
- `storedName`: Unique stored name on server
- `mimeType`: File type (e.g., image/jpeg, application/pdf)
- `size`: File size in bytes
- `path`: Server path where file is stored
- `isPublic`: Boolean (default false)
- `uploadDate`: Timestamp
- `uploader`: ObjectId of the user who uploaded the file

---

## 📂 Project Structure

```
📁 /config          ← Database connection files
📁 /controllers     ← All routes handler files
📁 /middleware      ← JWT auth & multer config
📁 /models          ← Mongoose schemas
📁 /routes          ← Express routers
📁 /uploads         ← Stored files
📁 /utils           ← Helper functions
.env                ← Environment variables
.env.example        ← Example structure Environment variables
index.js           ← App entry point
```

---

## ✅ Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repo-url>
cd file-upload-api
npm install
```

### 2. Create a `.env` File

```env
PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Start the Server

```bash
npm run dev
```

---

## 🧪 API Testing with Postman

Use Postman to:

- Register a new user
- Login and receive JWT token
- Use token to test upload, download, delete, and visibility routes

You can import the OpenAPI Swagger spec or use a provided Postman collection.

---

## 👨‍💻 Author

**Pradeep Kumar Maurya**\
[GitHub](https://github.com/pradeepmaurya2023)

---

## 📄 License

Licensed under the MIT License.

