# Individual Project Phase 2

## 🍳 Recipely - Recipe Discovery & AI Generator

A modern recipe discovery platform with AI-powered recipe generation using Google's Gemini AI.

### ✨ Key Features

- 🔍 Search thousands of recipes from MealDB and user-contributed recipes
- 🤖 **AI Recipe Generation** - Create custom recipes with Gemini AI when no results found
- 👨‍🍳 **Role-Based Access** - Chef and User roles with different permissions
- 🔐 **Authentication** - JWT & Google OAuth integration
- 📝 **CRUD Operations** - Create, edit, and manage your recipes (Chef only)
- 🏷️ **Category Filtering** - Browse by cuisine categories
- 📱 **Responsive Design** - Beautiful UI with glassmorphism effects

### 🚀 Quick Start

#### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 2. Configure Environment Variables

**Server (.env):**

- Database credentials (PostgreSQL)
- JWT secret
- Google OAuth credentials
- **Gemini API Key** (for AI features)

See [GEMINI_AI_SETUP.md](./GEMINI_AI_SETUP.md) for Gemini API key setup.

#### 3. Setup Database

```bash
cd server
npm run db:init
# or manually:
# npx sequelize db:create
# npx sequelize db:migrate
# npx sequelize db:seed:all
```

#### 4. Run the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 🤖 AI Features (NEW!)

When you search for a recipe that doesn't exist in the database:

1. Click "Create Recipe with AI" button
2. Gemini AI generates a custom recipe with:
   - Detailed ingredients list
   - Step-by-step instructions
   - Cooking time estimates
   - Regional/cuisine information

**Setup Required:** Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

See full setup guide: [GEMINI_AI_SETUP.md](./GEMINI_AI_SETUP.md)

### 👥 User Roles

**Regular User (Food Lover 🍽️)**

- Browse and search recipes
- View recipe details
- Use AI recipe generator

**Chef (👨‍🍳)**

- All User permissions +
- Create new recipes
- Edit own recipes
- Delete own recipes
- Access "My Recipes" page

### 📚 Additional Documentation

- [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md)
- [Gemini AI Setup Guide](./GEMINI_AI_SETUP.md)
- [Connection Check](./CONNECTION_CHECK.md)

### 🛠️ Tech Stack

**Frontend:**

- React 19 + Vite
- Bootstrap 5
- Axios
- SweetAlert2
- React Router

**Backend:**

- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- Google Auth Library
- **@google/generative-ai** (Gemini)

**AI Integration:**

- Google Gemini 1.5 Flash model
- Custom recipe generation prompts
- JSON-structured responses

### 📝 API Endpoints

#### Authentication

- `POST /apis/auth/register` - Register new user
- `POST /apis/auth/login` - Login with email/password
- `POST /apis/auth/google` - Google OAuth login

#### Recipes

- `GET /apis/recipes` - Get all recipes
- `GET /apis/recipes/my` - Get user's recipes (Chef only)
- `GET /apis/recipes/:id` - Get recipe by ID
- `POST /apis/recipes` - Create recipe (Chef only)
- `PUT /apis/recipes/:id` - Update recipe (Chef only)
- `DELETE /apis/recipes/:id` - Delete recipe (Chef only)

#### AI Features

- `POST /apis/gemini/generate` - Generate recipe with AI

#### Categories

- `GET /apis/categories` - Get all categories

### 🎨 UI Highlights

- Modern gradient backgrounds
- Glassmorphism card effects
- Animated loading states
- Responsive grid layouts
- Interactive hover effects
- Beautiful recipe modals
- AI-generated recipe display

### 📸 Screenshots

(Add your screenshots here)

### 🤝 Contributing

This is an individual project for educational purposes.

### 📄 License

This project is for educational purposes only.

---

**Made with ❤️ and powered by AI ✨**
