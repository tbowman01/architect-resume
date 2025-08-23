import { BlogPost } from '../types/blog'

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Sustainable Architecture: Building for the Future',
    excerpt: 'Exploring innovative approaches to sustainable design that harmonize with nature while creating beautiful, functional spaces.',
    content: `
# Sustainable Architecture: Building for the Future

Sustainable architecture represents a fundamental shift in how we approach building design. As architects, we have a responsibility to create structures that not only serve human needs but also respect and preserve our environment.

## The Principles of Sustainable Design

1. **Energy Efficiency**: Incorporating passive solar design, high-performance insulation, and renewable energy systems
2. **Water Conservation**: Implementing rainwater harvesting, greywater systems, and drought-resistant landscaping
3. **Material Selection**: Choosing locally sourced, renewable, and low-impact materials
4. **Site Integration**: Designing buildings that work with natural topography and climate

## Case Study: The Green Office Complex

Our recent project in downtown exemplifies these principles. By integrating a living wall system, solar panels, and natural ventilation, we achieved a 40% reduction in energy consumption compared to conventional buildings.

## The Future of Architecture

As we move forward, the integration of smart building technologies and biophilic design will continue to evolve. The goal is not just to minimize negative impact, but to create buildings that actively contribute to environmental healing.
    `,
    author: process.env.NEXT_PUBLIC_USER_NAME || 'Author Name',
    publishDate: '2024-12-15',
    readTime: 5,
    tags: ['Sustainability', 'Green Building', 'Innovation'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Modern Minimalism in Residential Design',
    excerpt: 'How clean lines and thoughtful space planning create serene living environments that enhance daily life.',
    content: `
# Modern Minimalism in Residential Design

Minimalist design is more than just an aesthetic choice—it's a philosophy that prioritizes function, reduces clutter, and creates spaces for mindful living.

## Core Elements of Minimalist Architecture

- **Clean Lines**: Geometric forms with unadorned surfaces
- **Open Spaces**: Flowing layouts that connect indoor and outdoor areas
- **Natural Light**: Large windows and skylights as design features
- **Material Honesty**: Exposing the natural beauty of concrete, wood, and steel

## The Psychology of Space

Research shows that minimalist environments can reduce stress and improve focus. By eliminating visual clutter, we create mental clarity for inhabitants.

## Balancing Function and Beauty

The challenge lies in creating warmth within simplicity. Through careful material selection and proportional relationships, minimalist homes can feel both sophisticated and welcoming.
    `,
    author: process.env.NEXT_PUBLIC_USER_NAME || 'Author Name',
    publishDate: '2024-12-01',
    readTime: 4,
    tags: ['Minimalism', 'Residential', 'Design Philosophy'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Urban Planning for Smart Cities',
    excerpt: 'Integrating technology and human-centered design to create more livable, efficient urban environments.',
    content: `
# Urban Planning for Smart Cities

The cities of tomorrow will be shaped by our ability to integrate technology with human needs, creating environments that are both efficient and livable.

## Smart Infrastructure

- **Connected Transportation**: Autonomous vehicles and integrated transit systems
- **Energy Grids**: Renewable energy distribution and storage
- **Data Networks**: IoT sensors for traffic, air quality, and resource management

## Human-Centered Approach

Technology must serve people, not the other way around. This means:
- Preserving green spaces and community gathering areas
- Ensuring equitable access to smart city benefits
- Maintaining cultural identity within technological advancement

## Case Studies

Cities like Singapore and Copenhagen are leading the way in smart urban planning, demonstrating how technology can enhance rather than replace human connection.
    `,
    author: process.env.NEXT_PUBLIC_USER_NAME || 'Author Name',
    publishDate: '2024-11-20',
    readTime: 6,
    tags: ['Urban Planning', 'Smart Cities', 'Technology'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop'
  }
]