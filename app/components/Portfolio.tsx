'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Calendar, MapPin, Award } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

interface Project {
  id: string
  title: string
  category: string
  year: string
  location: string
  description: string
  detailedDescription: string
  imageUrl: string
  awards?: string[]
  area?: string
  status: string
  client?: string
  tags: string[]
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Skyline Residential Complex',
    category: 'Residential',
    year: '2023',
    location: 'Downtown Seattle',
    description: 'Modern luxury apartments with sustainable design and panoramic city views.',
    detailedDescription: 'A 42-story residential tower featuring 180 luxury units with floor-to-ceiling windows, green terraces, and advanced smart home technology. The design incorporates sustainable materials and energy-efficient systems, achieving LEED Platinum certification.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    awards: ['AIA Design Excellence Award 2023', 'Green Building Award'],
    area: '450,000 sq ft',
    status: 'Completed',
    client: 'Urban Development Corp',
    tags: ['Sustainable', 'High-rise', 'Luxury', 'LEED Platinum']
  },
  {
    id: '2',
    title: 'Innovation Hub Office Complex',
    category: 'Commercial',
    year: '2022',
    location: 'Silicon Valley',
    description: 'State-of-the-art office complex designed for tech companies with flexible workspaces.',
    detailedDescription: 'A revolutionary office complex spanning 3 buildings connected by glass bridges. Features include flexible modular offices, collaborative spaces, rooftop gardens, and advanced technology infrastructure. The design promotes innovation and employee well-being.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    awards: ['Best Commercial Design 2022'],
    area: '650,000 sq ft',
    status: 'Completed',
    client: 'TechCorp Industries',
    tags: ['Modern', 'Flexible', 'Tech-ready', 'Collaborative']
  },
  {
    id: '3',
    title: 'Greenfield Urban Masterplan',
    category: 'Urban Planning',
    year: '2024',
    location: 'Portland, Oregon',
    description: 'Comprehensive urban development plan integrating residential, commercial, and green spaces.',
    detailedDescription: 'A 500-acre mixed-use development masterplan featuring sustainable communities, transit-oriented design, and extensive green infrastructure. The plan includes affordable housing, commercial districts, parks, and sustainable transportation networks.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    area: '500 acres',
    status: 'In Progress',
    client: 'City of Portland',
    tags: ['Masterplan', 'Sustainable', 'Mixed-use', 'Transit-oriented']
  },
  {
    id: '4',
    title: 'Eco-Villa Residence',
    category: 'Residential',
    year: '2023',
    location: 'Marin County',
    description: 'Luxury eco-friendly villa showcasing sustainable architecture and natural materials.',
    detailedDescription: 'A stunning 8,500 sq ft villa that seamlessly blends with its natural surroundings. Features include solar panels, rainwater harvesting, natural ventilation systems, and locally sourced materials. The design maximizes natural light and views while minimizing environmental impact.',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    awards: ['Sustainable Home of the Year 2023'],
    area: '8,500 sq ft',
    status: 'Completed',
    client: 'Private Client',
    tags: ['Eco-friendly', 'Luxury', 'Natural materials', 'Solar']
  },
  {
    id: '5',
    title: 'Cultural Arts Center',
    category: 'Public',
    year: '2022',
    location: 'Chicago, Illinois',
    description: 'Modern cultural center featuring galleries, performance spaces, and community areas.',
    detailedDescription: 'A 120,000 sq ft cultural center serving as a hub for the arts community. The building features flexible gallery spaces, a 500-seat auditorium, artist studios, and public gathering areas. The design celebrates local culture while providing world-class facilities.',
    imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&h=600&fit=crop',
    awards: ['Public Architecture Award 2022', 'Community Impact Award'],
    area: '120,000 sq ft',
    status: 'Completed',
    client: 'City of Chicago',
    tags: ['Cultural', 'Community', 'Flexible spaces', 'Performance']
  },
  {
    id: '6',
    title: 'Retail Flagship Store',
    category: 'Commercial',
    year: '2023',
    location: 'New York City',
    description: 'Flagship retail store with innovative display systems and immersive customer experience.',
    detailedDescription: 'A revolutionary 3-story flagship store redesigning the retail experience through interactive displays, digital integration, and flexible layouts. The space can be reconfigured for different product launches and seasonal campaigns while maintaining brand identity.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    area: '25,000 sq ft',
    status: 'Completed',
    client: 'Global Fashion Brand',
    tags: ['Retail', 'Interactive', 'Flexible', 'Brand experience']
  }
]

const categories = ['All', 'Residential', 'Commercial', 'Urban Planning', 'Public']

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-architect-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-architect-900 mb-4">
            Portfolio
          </h2>
          <p className="text-xl text-architect-600 max-w-3xl mx-auto">
            Explore our diverse collection of architectural projects, each crafted with precision, 
            innovation, and a commitment to sustainable design excellence.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              variants={filterVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-architect-800 text-white shadow-lg'
                  : 'bg-white text-architect-700 hover:bg-architect-100 border border-architect-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="text-white text-center"
                      >
                        <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">View Details</span>
                      </motion.div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent-gold text-white text-xs font-medium rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-architect-900 mb-2 group-hover:text-accent-gold transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-sm text-architect-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="mr-4">{project.location}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{project.year}</span>
                    </div>
                    <p className="text-architect-700 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-architect-100 text-architect-700 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Awards */}
                    {project.awards && project.awards.length > 0 && (
                      <div className="flex items-center text-sm text-accent-gold">
                        <Award className="w-4 h-4 mr-1" />
                        <span className="font-medium">{project.awards.length} Award{project.awards.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Modal */}
        <Dialog.Root open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl z-50 overflow-y-auto">
              {selectedProject && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Modal Header */}
                  <div className="relative">
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Close Button */}
                    <Dialog.Close className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <X className="w-6 h-6" />
                    </Dialog.Close>

                    {/* Title Overlay */}
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-3xl font-serif font-bold mb-2">
                        {selectedProject.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedProject.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {selectedProject.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Content */}
                      <div className="lg:col-span-2">
                        <h4 className="text-xl font-serif font-bold text-architect-900 mb-4">
                          Project Overview
                        </h4>
                        <p className="text-architect-700 mb-6 leading-relaxed">
                          {selectedProject.detailedDescription}
                        </p>

                        {/* Tags */}
                        <div className="mb-6">
                          <h5 className="font-semibold text-architect-900 mb-3">Design Features</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-architect-100 text-architect-700 text-sm rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Awards */}
                        {selectedProject.awards && selectedProject.awards.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-architect-900 mb-3 flex items-center">
                              <Award className="w-5 h-5 mr-2 text-accent-gold" />
                              Awards & Recognition
                            </h5>
                            <ul className="space-y-2">
                              {selectedProject.awards.map((award, index) => (
                                <li key={index} className="text-architect-700 flex items-center">
                                  <div className="w-2 h-2 bg-accent-gold rounded-full mr-3" />
                                  {award}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Project Details Sidebar */}
                      <div className="bg-architect-50 rounded-lg p-6">
                        <h5 className="font-semibold text-architect-900 mb-4">Project Details</h5>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm text-architect-600 block">Category</span>
                            <span className="font-medium text-architect-900">{selectedProject.category}</span>
                          </div>
                          <div>
                            <span className="text-sm text-architect-600 block">Status</span>
                            <span className={`font-medium ${
                              selectedProject.status === 'Completed' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {selectedProject.status}
                            </span>
                          </div>
                          {selectedProject.area && (
                            <div>
                              <span className="text-sm text-architect-600 block">Area</span>
                              <span className="font-medium text-architect-900">{selectedProject.area}</span>
                            </div>
                          )}
                          {selectedProject.client && (
                            <div>
                              <span className="text-sm text-architect-600 block">Client</span>
                              <span className="font-medium text-architect-900">{selectedProject.client}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-sm text-architect-600 block">Year</span>
                            <span className="font-medium text-architect-900">{selectedProject.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </section>
  )
}