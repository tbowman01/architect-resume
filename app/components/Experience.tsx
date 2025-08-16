'use client'

import { motion, useInView } from 'framer-motion'
import { Building2, MapPin, Calendar, ChevronDown, ChevronUp, Award, Users, Briefcase } from 'lucide-react'
import { useRef, useState } from 'react'

interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string
  duration: string
  period: string
  achievements: string[]
  description: string
  icon: any
  type: 'senior' | 'lead' | 'principal' | 'director'
}

const experiences: ExperienceItem[] = [
  {
    id: '1',
    company: 'Pinnacle Architecture Group',
    role: 'Senior Principal Architect',
    location: 'New York, NY',
    duration: '2021 - Present',
    period: '3+ years',
    achievements: [
      'Led design team of 25+ architects on $500M+ mixed-use development',
      'Implemented sustainable design practices reducing carbon footprint by 40%',
      'Won 3 prestigious industry awards for innovative green building solutions',
      'Established firm\'s digital design workflow increasing efficiency by 60%'
    ],
    description: 'Leading large-scale urban development projects with focus on sustainable design and innovative construction methodologies. Overseeing multidisciplinary teams and client relationships for high-profile commercial and residential developments.',
    icon: Building2,
    type: 'director'
  },
  {
    id: '2',
    company: 'Metropolitan Design Studio',
    role: 'Lead Architect',
    location: 'New York, NY',
    duration: '2018 - 2021',
    period: '3 years',
    achievements: [
      'Managed portfolio of 15+ concurrent residential and commercial projects',
      'Developed signature design language for luxury residential developments',
      'Mentored junior architects and established training programs',
      'Achieved LEED Platinum certification on 8 major projects'
    ],
    description: 'Responsible for design development, client presentations, and project management for high-end residential and boutique commercial projects. Focused on creating distinctive architectural solutions that balance aesthetics with functionality.',
    icon: Users,
    type: 'principal'
  },
  {
    id: '3',
    company: 'Urban Innovation Labs',
    role: 'Project Architect',
    location: 'Brooklyn, NY',
    duration: '2015 - 2018',
    period: '3 years',
    achievements: [
      'Designed award-winning affordable housing complex serving 200+ families',
      'Pioneered use of prefabricated modular construction techniques',
      'Collaborated with city planning on zoning optimization strategies',
      'Reduced construction costs by 25% through innovative design solutions'
    ],
    description: 'Specialized in affordable housing and urban revitalization projects. Worked closely with community stakeholders to create socially conscious architecture that addresses urban housing challenges while maintaining design excellence.',
    icon: Award,
    type: 'lead'
  },
  {
    id: '4',
    company: 'Heritage & Modern Associates',
    role: 'Architect II',
    location: 'Boston, MA',
    duration: '2012 - 2015',
    period: '3 years',
    achievements: [
      'Specialized in historic preservation and adaptive reuse projects',
      'Completed restoration of 5 landmark buildings listed on National Register',
      'Developed expertise in traditional construction methods and materials',
      'Collaborated with preservation societies and municipal planning departments'
    ],
    description: 'Focused on preserving architectural heritage while adapting historic structures for modern use. Gained deep understanding of traditional building techniques and materials, working on culturally significant restoration projects.',
    icon: Briefcase,
    type: 'senior'
  },
  {
    id: '5',
    company: 'Emerging Architects Collective',
    role: 'Junior Architect',
    location: 'Boston, MA',
    duration: '2010 - 2012',
    period: '2 years',
    achievements: [
      'Contributed to design and documentation of 10+ residential projects',
      'Developed proficiency in BIM and 3D modeling software',
      'Assisted in obtaining building permits and coordinating with contractors',
      'Participated in design competitions, winning 2 emerging architect awards'
    ],
    description: 'Started career working on diverse residential and small commercial projects. Built foundation in architectural practice, learning design development, technical documentation, and project coordination skills.',
    icon: Building2,
    type: 'senior'
  }
]

const typeColors = {
  director: 'bg-accent-gold text-white',
  principal: 'bg-architect-700 text-white',
  lead: 'bg-architect-600 text-white',
  senior: 'bg-architect-500 text-white'
}

function ExperienceCard({ experience, index }: { experience: ExperienceItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const Icon = experience.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} mb-12`}
    >
      {/* Timeline line and dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
        <div className="w-px h-full bg-architect-300 absolute top-0"></div>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
          className={`w-12 h-12 rounded-full ${typeColors[experience.type]} flex items-center justify-center shadow-lg relative z-10`}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Content card */}
      <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-accent-gold hover:shadow-xl transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-accent-gold md:hidden" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[experience.type]}`}>
                  {experience.type.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-architect-900 mb-1">
                {experience.role}
              </h3>
              <h4 className="text-lg font-semibold text-architect-700 mb-2">
                {experience.company}
              </h4>
              <div className="flex flex-wrap items-center gap-4 text-sm text-architect-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{experience.duration}</span>
                </div>
                <div className="bg-architect-100 px-2 py-1 rounded text-xs font-medium">
                  {experience.period}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-architect-600 mb-4 leading-relaxed">
            {experience.description}
          </p>

          {/* Key Achievements */}
          <div className="mb-4">
            <h5 className="font-semibold text-architect-800 mb-2">Key Achievements</h5>
            <div className="space-y-1">
              {experience.achievements.slice(0, isExpanded ? undefined : 2).map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-1.5 h-1.5 bg-accent-gold rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-architect-700">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Expand/Collapse button */}
          {experience.achievements.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-accent-gold hover:text-architect-700 transition-colors text-sm font-medium"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>

      {/* Mobile timeline dot */}
      <div className="md:hidden absolute left-0 top-6">
        <div className={`w-8 h-8 rounded-full ${typeColors[experience.type]} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px h-full bg-architect-300 absolute top-8 left-1/2 transform -translate-x-1/2"></div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-white to-architect-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-architect-900 mb-4">
            Professional Experience
          </h2>
          <p className="text-lg text-architect-600 max-w-3xl mx-auto">
            Over a decade of progressive growth in architectural practice, from junior architect 
            to senior leadership roles, with a focus on sustainable design and urban innovation.
          </p>
        </motion.div>

        <div className="relative">
          {/* Main timeline line for desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-architect-300"></div>
          
          {/* Mobile timeline line */}
          <div className="md:hidden absolute left-4 w-px h-full bg-architect-300"></div>

          {/* Experience items */}
          <div className="relative md:pl-0 pl-12">
            {experiences.map((experience, index) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                index={index} 
              />
            ))}
          </div>
        </div>

        {/* Career progression summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-white rounded-lg shadow-lg p-8 border border-architect-200"
        >
          <h3 className="text-2xl font-serif font-bold text-architect-900 mb-4 text-center">
            Career Progression Summary
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">13+</div>
              <div className="text-sm text-architect-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">100+</div>
              <div className="text-sm text-architect-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">15+</div>
              <div className="text-sm text-architect-600">Awards & Recognition</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">$2B+</div>
              <div className="text-sm text-architect-600">Total Project Value</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}