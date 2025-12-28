import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Academix API is running' });
});

// Courses API
app.get('/api/courses', (req: Request, res: Response) => {
  const courses = [
    {
      id: 1,
      title: 'Science, Education, Physical & Math',
      category: 'Science',
      price: 59.99,
      image: '/images/course-1.jpg',
      duration: '3 Years',
      students: 150
    },
    {
      id: 2,
      title: 'Pre-Medical, Learn English, Math',
      category: 'Medical',
      price: 79.99,
      image: '/images/course-2.jpg',
      duration: '4 Years',
      students: 200
    },
    {
      id: 3,
      title: 'Learn Psychology in just 3 Years',
      category: 'Psychology',
      price: 49.99,
      image: '/images/course-3.jpg',
      duration: '3 Years',
      students: 120
    },
    {
      id: 4,
      title: 'Sport Coaching, National Gym Skills',
      category: 'Sports',
      price: 39.99,
      image: '/images/course-4.jpg',
      duration: '2 Years',
      students: 80
    }
  ];
  res.json(courses);
});

// Events API
app.get('/api/events', (req: Request, res: Response) => {
  const events = [
    {
      id: 1,
      title: 'Building Future Through Technology',
      date: '2025-01-15',
      location: 'Main Auditorium',
      image: '/images/event-1.jpg'
    },
    {
      id: 2,
      title: 'The World Trip Our Dream Come True',
      date: '2025-02-20',
      location: 'Campus Ground',
      image: '/images/event-2.jpg'
    },
    {
      id: 3,
      title: 'Annual Sports Championship',
      date: '2025-03-10',
      location: 'Sports Complex',
      image: '/images/event-3.jpg'
    }
  ];
  res.json(events);
});

// Instructors API
app.get('/api/instructors', (req: Request, res: Response) => {
  const instructors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Professor of Computer Science',
      image: '/images/instructor-1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Dean of Engineering',
      image: '/images/instructor-2.jpg'
    },
    {
      id: 3,
      name: 'Prof. Emily Davis',
      role: 'Head of Mathematics',
      image: '/images/instructor-3.jpg'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      role: 'Psychology Department',
      image: '/images/instructor-4.jpg'
    }
  ];
  res.json(instructors);
});

// Testimonials API
app.get('/api/testimonials', (req: Request, res: Response) => {
  const testimonials = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Computer Science Graduate',
      content: 'Academix provided me with the perfect environment to grow and learn. The faculty is exceptional!',
      image: '/images/student-1.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'Emma Williams',
      role: 'Business Administration',
      content: 'The courses here are world-class. I learned so much and made lifelong connections.',
      image: '/images/student-2.jpg',
      rating: 5
    }
  ];
  res.json(testimonials);
});

// Blog API
app.get('/api/blogs', (req: Request, res: Response) => {
  const blogs = [
    {
      id: 1,
      title: 'The Future of Education Technology',
      excerpt: 'Discover how technology is reshaping the educational landscape...',
      date: '2025-12-20',
      author: 'Admin',
      image: '/images/blog-1.jpg',
      category: 'Technology'
    },
    {
      id: 2,
      title: 'Tips for Academic Success',
      excerpt: 'Essential strategies for excelling in your academic journey...',
      date: '2025-12-18',
      author: 'Admin',
      image: '/images/blog-2.jpg',
      category: 'Education'
    },
    {
      id: 3,
      title: 'Career Opportunities After Graduation',
      excerpt: 'Explore the vast career opportunities available to our graduates...',
      date: '2025-12-15',
      author: 'Admin',
      image: '/images/blog-3.jpg',
      category: 'Career'
    }
  ];
  res.json(blogs);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
