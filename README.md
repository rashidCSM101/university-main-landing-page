* [ ] 

# GDC Larkana LMS Website

A modern, responsive university/education website built with React, TypeScript, Express.js, Tailwind CSS, GSAP animations, and Lenis smooth scrolling.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Express.js, Vite
- **Smooth Scrolling**: Lenis for butter-smooth scrolling experience
- **GSAP Animations**: Professional scroll-triggered animations and parallax effects
- **Responsive Design**: Fully responsive across all devices
- **Tailwind CSS**: Utility-first CSS with custom components
- **Custom CSS**: Additional styling for unique elements

## 📦 Project Structure

```
gdc-larkana-lms/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Introduction.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── Reasons.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Departments.tsx
│   │   │   ├── VideoTour.tsx
│   │   │   ├── Instructors.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Admission.tsx
│   │   │   ├── Blog.tsx
│   │   │   └── Footer.tsx
│   │   ├── styles/
│   │   │   └── index.css  # Global styles + Tailwind
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   └── index.ts       # API endpoints
│   ├── tsconfig.json
│   └── package.json
└── package.json           # Root package.json
```

## 🛠️ Installation

1. [ ] **Clone and navigate to the project:**


    ```bash
    cd "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS"
    ```
2. [ ] **Install all dependencies:**


    ```bash
    npm run install-all
    ```

    Or install separately:

    ```bash
    npm install
    cd client && npm install
    cd ../server && npm install
    ```

## 🚀 Running the Project

### Development Mode (Both frontend & backend)

```bash
npm run dev
```

### Frontend Only

```bash
cd client
npm run dev
```

### Backend Only

```bash
cd server
npm run dev
```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📡 API Endpoints

| Endpoint              | Method | Description         |
| --------------------- | ------ | ------------------- |
| `/api/health`       | GET    | Health check        |
| `/api/courses`      | GET    | Get all courses     |
| `/api/events`       | GET    | Get all events      |
| `/api/instructors`  | GET    | Get all instructors |
| `/api/testimonials` | GET    | Get testimonials    |
| `/api/blogs`        | GET    | Get blog posts      |

## 🎨 Customization

### Colors (tailwind.config.js)

- Primary: `#A91D3A` (Maroon/Red)
- Primary Light: `#C73659`
- Primary Dark: `#8B1830`
- Accent Gold: `#D4AF37`

### Fonts

- Headings: Playfair Display
- Body: Inter

## ✨ Key Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Express.js** - Backend API
- **Tailwind CSS** - Utility-first CSS
- **GSAP** - Professional animations
- **Lenis** - Smooth scrolling
- **Lucide React** - Icon library

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Build for Production

```bash
npm run build
```

## 📄 License

MIT License - Feel free to use this for your projects!

cd client && yarn dev    # Frontend: localhost:3001
cd server && npm run dev # Backend: localhost:5000
