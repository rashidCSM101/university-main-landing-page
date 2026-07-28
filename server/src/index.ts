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
// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'WCS Weather & Climate API is running' });
});

// Weather Services & Forecasts API
app.get('/api/courses', (req: Request, res: Response) => {
  const services = [
    {
      id: 1,
      title: 'High-Resolution Doppler Live Radar',
      category: 'Meteorology',
      price: 0.00,
      image: '/images/course-1.jpg',
      duration: '24/7 Live Stream',
      students: 45000
    },
    {
      id: 2,
      title: 'Agricultural Weather & Soil Analytics',
      category: 'Agri-Climate',
      price: 29.99,
      image: '/images/course-2.jpg',
      duration: 'Seasonal Advisory',
      students: 18200
    },
    {
      id: 3,
      title: 'Marine Weather & Offshore Wave Tracking',
      category: 'Oceanography',
      price: 49.99,
      image: '/images/course-3.jpg',
      duration: 'Real-time Feed',
      students: 9500
    },
    {
      id: 4,
      title: 'Aviation Meteorology & Turbulence Alert',
      category: 'Aviation',
      price: 89.99,
      image: '/images/course-4.jpg',
      duration: 'Continuous Telemetry',
      students: 6200
    }
  ];
  res.json(services);
});

// Climate Events & Bulletins API
app.get('/api/events', (req: Request, res: Response) => {
  const events = [
    {
      id: 1,
      title: 'Global Climate Resilience Summit 2026',
      date: '2026-08-15',
      location: 'Atmospheric Research Center',
      image: '/images/event-1.jpg'
    },
    {
      id: 2,
      title: 'Monsoon Patterns & Flood Preparedness Workshop',
      date: '2026-09-02',
      location: 'National Weather Station',
      image: '/images/event-2.jpg'
    },
    {
      id: 3,
      title: 'Renewable Energy Weather Intelligence Seminar',
      date: '2026-09-25',
      location: 'Innovation Climate Lab',
      image: '/images/event-3.jpg'
    }
  ];
  res.json(events);
});

// Our Team / Specialists API
app.get('/api/instructors', (req: Request, res: Response) => {
  const team = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Chief Meteorologist & Doppler Lead',
      image: '/images/instructor-1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Director of Atmospheric Modeling',
      image: '/images/instructor-2.jpg'
    },
    {
      id: 3,
      name: 'Prof. Emily Davis',
      role: 'Head of Satellite Remote Sensing',
      image: '/images/instructor-3.jpg'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      role: 'Climate Impact & Hydrology Analyst',
      image: '/images/instructor-4.jpg'
    }
  ];
  res.json(team);
});

// Testimonials & Partner Feedback API
app.get('/api/testimonials', (req: Request, res: Response) => {
  const testimonials = [
    {
      id: 1,
      name: 'Capt. Robert Vance',
      role: 'Aviation Safety Officer',
      content: 'WCS Doppler telemetry provides ultra-precise severe turbulence alerts. Crucial for our flight navigation safety.',
      image: '/images/student-1.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'Tariq Mahmood',
      role: 'Agri-Business Alliance Director',
      content: 'The localized rain prediction and soil moisture advisories helped our farmers optimize harvest yields by 30%.',
      image: '/images/student-2.jpg',
      rating: 5
    }
  ];
  res.json(testimonials);
});

// Climate Articles & Weather Bulletins API
app.get('/api/blogs', (req: Request, res: Response) => {
  const blogs = [
    {
      id: 1,
      title: 'Understanding El Niño & La Niña Dynamics in 2026',
      excerpt: 'An in-depth analysis of sea surface temperature anomalies and global climate patterns...',
      date: '2026-07-20',
      author: 'WCS Climate Cell',
      image: '/images/blog-1.jpg',
      category: 'Climatology'
    },
    {
      id: 2,
      title: 'How High-Resolution Doppler Radar Saves Lives',
      excerpt: 'Exploring early microburst detection and convective storm warnings in urban centers...',
      date: '2026-07-15',
      author: 'Meteorology Department',
      image: '/images/blog-2.jpg',
      category: 'Technology'
    },
    {
      id: 3,
      title: 'Solar & Wind Energy Forecasting for Smart Grids',
      excerpt: 'Precision weather analytics enabling seamless integration of clean renewable power...',
      date: '2026-07-10',
      author: 'Green Energy Analytics',
      image: '/images/blog-3.jpg',
      category: 'Energy'
    }
  ];
  res.json(blogs);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
