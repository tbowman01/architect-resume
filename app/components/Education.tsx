'use client'

import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Calendar,
  MapPin,
  Star,
  Trophy,
  FileCheck,
  Users,
  Building
} from 'lucide-react'

interface EducationItem {
  degree: string
  institution: string
  location: string
  period: string
  gpa?: string
  honors?: string[]
  description: string
  icon: React.ComponentType<any>
}

interface CertificationItem {
  name: string
  issuer: string
  date: string
  credentialId?: string
  description: string
  icon: React.ComponentType<any>
}

interface AwardItem {
  name: string
  issuer: string
  year: string
  description: string
  category: string
  icon: React.ComponentType<any>
}

interface WorkshopItem {
  name: string
  provider: string
  date: string
  duration: string
  focus: string
  icon: React.ComponentType<any>
}

export default function Education() {
  const education: EducationItem[] = [
    {
      degree: 'Master of Architecture (M.Arch)',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      period: '2016 - 2018',
      gpa: '3.8/4.0',
      honors: ['Magna Cum Laude', 'AIA Design Excellence Award'],
      description: 'Specialized in sustainable design and urban planning with focus on climate-responsive architecture. Thesis on "Adaptive Building Systems for Climate Resilience".',
      icon: GraduationCap
    },
    {
      degree: 'Bachelor of Architectural Studies (B.A.S.)',
      institution: 'University of Texas at Austin',
      location: 'Austin, TX',
      period: '2012 - 2016',
      gpa: '3.7/4.0',
      honors: ['Dean\'s List', 'Outstanding Senior Project'],
      description: 'Comprehensive foundation in architectural design principles, building technology, and construction methods. Senior project focused on affordable housing solutions.',
      icon: Building
    }
  ]

  const certifications: CertificationItem[] = [
    {
      name: 'LEED Accredited Professional BD+C',
      issuer: 'U.S. Green Building Council',
      date: 'March 2022',
      credentialId: 'LEED-AP-11234567',
      description: 'Advanced certification in green building design and construction practices.',
      icon: FileCheck
    },
    {
      name: 'Registered Architect',
      issuer: 'California Architects Board',
      date: 'June 2020',
      credentialId: 'CA-AR-45678',
      description: 'Licensed to practice architecture in the state of California.',
      icon: Award
    },
    {
      name: 'Project Management Professional (PMP)',
      issuer: 'Project Management Institute',
      date: 'September 2021',
      credentialId: 'PMP-2345678',
      description: 'Comprehensive project management certification for complex architectural projects.',
      icon: Users
    }
  ]

  const awards: AwardItem[] = [
    {
      name: 'Excellence in Sustainable Design',
      issuer: 'American Institute of Architects',
      year: '2023',
      category: 'Professional Achievement',
      description: 'Recognition for innovative approach to carbon-neutral building design.',
      icon: Trophy
    },
    {
      name: 'Young Architect Award',
      issuer: 'Architectural Review Board',
      year: '2022',
      category: 'Emerging Talent',
      description: 'Awarded for outstanding contribution to contemporary architectural practice.',
      icon: Star
    },
    {
      name: 'Best Residential Project',
      issuer: 'International Design Awards',
      year: '2021',
      category: 'Design Excellence',
      description: 'First place for eco-friendly residential complex design.',
      icon: Building
    },
    {
      name: 'Academic Excellence Scholarship',
      issuer: 'University of California, Berkeley',
      year: '2017',
      category: 'Academic Achievement',
      description: 'Merit-based scholarship for outstanding academic performance in graduate studies.',
      icon: GraduationCap
    }
  ]

  const continuingEducation: WorkshopItem[] = [
    {
      name: 'Advanced BIM and Digital Design',
      provider: 'Autodesk University',
      date: 'November 2023',
      duration: '3 days',
      focus: 'Digital Workflow Optimization',
      icon: BookOpen
    },
    {
      name: 'Passive House Design Workshop',
      provider: 'Passive House Institute',
      date: 'August 2023',
      duration: '5 days',
      focus: 'Energy Efficient Design',
      icon: Building
    },
    {
      name: 'Leadership in Sustainable Construction',
      provider: 'Harvard Graduate School of Design',
      date: 'May 2023',
      duration: '2 weeks',
      focus: 'Sustainable Leadership',
      icon: Users
    },
    {
      name: 'Computational Design Methods',
      provider: 'MIT Architecture',
      date: 'February 2023',
      duration: '1 week',
      focus: 'Parametric Design',
      icon: BookOpen
    }
  ]

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const timelineVariants = {
    hidden: { height: 0 },
    visible: {
      height: "100%",
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-architect-900 mb-4">
            Education & Qualifications
          </h2>
          <p className="text-xl text-architect-600 max-w-3xl mx-auto">
            A strong academic foundation complemented by continuous professional development 
            and industry recognition for excellence in architectural practice.
          </p>
        </motion.div>

        {/* Academic Education */}
        <div className="mb-20">
          <h3 className="text-3xl font-serif font-bold text-architect-900 mb-12 text-center">
            Academic Background
          </h3>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-architect-200 hidden md:block">
              <motion.div
                variants={timelineVariants}
                className="w-full bg-gradient-to-b from-accent-gold to-architect-600"
              />
            </div>

            <div className="space-y-12">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative flex items-start"
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-6 w-4 h-4 bg-accent-gold rounded-full border-4 border-white shadow-lg z-10" />
                  
                  {/* Content */}
                  <div className="md:ml-16 w-full">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-white to-architect-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-3 bg-gradient-to-br from-accent-gold to-architect-600 rounded-xl mr-4">
                            <edu.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-architect-900">
                              {edu.degree}
                            </h4>
                            <p className="text-lg text-architect-700 font-medium">
                              {edu.institution}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-architect-500 mb-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{edu.period}</span>
                          </div>
                          <div className="flex items-center text-architect-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{edu.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-architect-600 mb-4">
                        {edu.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        {edu.gpa && (
                          <div className="bg-architect-100 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium text-architect-700">
                              GPA: {edu.gpa}
                            </span>
                          </div>
                        )}
                        {edu.honors?.map((honor, honorIndex) => (
                          <div key={honorIndex} className="bg-accent-gold/20 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium text-architect-800">
                              {honor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Professional Certifications */}
        <div className="mb-20">
          <h3 className="text-3xl font-serif font-bold text-architect-900 mb-12 text-center">
            Professional Certifications
          </h3>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-architect-100"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-architect-600 to-architect-800 rounded-xl mr-4">
                    <cert.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-architect-900">
                      {cert.name}
                    </h4>
                    <p className="text-architect-600">
                      {cert.issuer}
                    </p>
                  </div>
                </div>
                
                <p className="text-architect-600 mb-4 text-sm">
                  {cert.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-architect-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{cert.date}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="text-architect-400 text-xs">
                      ID: {cert.credentialId}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Awards and Honors */}
        <div className="mb-20">
          <h3 className="text-3xl font-serif font-bold text-architect-900 mb-12 text-center">
            Awards & Recognition
          </h3>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {awards.map((award, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="bg-gradient-to-br from-white to-architect-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-accent-gold to-accent-copper rounded-xl mr-4">
                      <award.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-architect-900">
                        {award.name}
                      </h4>
                      <p className="text-architect-600">
                        {award.issuer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-architect-500 font-medium">
                      {award.year}
                    </span>
                    <div className="text-sm text-architect-400">
                      {award.category}
                    </div>
                  </div>
                </div>
                
                <p className="text-architect-600">
                  {award.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Continuing Education */}
        <div>
          <h3 className="text-3xl font-serif font-bold text-architect-900 mb-12 text-center">
            Continuing Education & Workshops
          </h3>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {continuingEducation.map((workshop, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-architect-100"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-gradient-to-br from-architect-500 to-architect-700 rounded-lg mr-3">
                    <workshop.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-architect-900">
                      {workshop.name}
                    </h4>
                    <p className="text-architect-600 text-sm">
                      {workshop.provider}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-architect-500 mb-2">
                  <span>{workshop.date}</span>
                  <span>{workshop.duration}</span>
                </div>
                
                <div className="bg-architect-100 px-3 py-1 rounded-full inline-block">
                  <span className="text-sm font-medium text-architect-700">
                    {workshop.focus}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}