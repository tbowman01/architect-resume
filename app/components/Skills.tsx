'use client'

import { motion } from 'framer-motion'
import { 
  Compass, 
  PenTool, 
  Building, 
  Palette, 
  Computer, 
  Settings, 
  Users, 
  Award,
  Layers,
  BarChart3,
  FileText,
  Camera
} from 'lucide-react'

interface Skill {
  name: string
  level: number
  icon?: React.ComponentType<any>
}

interface SkillCategory {
  title: string
  icon: React.ComponentType<any>
  skills: Skill[]
  color: string
}

interface Certification {
  name: string
  issuer: string
  year: string
  icon: React.ComponentType<any>
}

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Design & Visualization',
      icon: PenTool,
      color: 'from-accent-gold to-architect-600',
      skills: [
        { name: 'Architectural Design', level: 95, icon: Building },
        { name: '3D Modeling & Rendering', level: 90, icon: Layers },
        { name: 'Technical Drawing', level: 88, icon: FileText },
        { name: 'Conceptual Sketching', level: 85, icon: PenTool },
        { name: 'Photography', level: 75, icon: Camera }
      ]
    },
    {
      title: 'Technical Skills',
      icon: Settings,
      color: 'from-architect-600 to-architect-800',
      skills: [
        { name: 'Structural Analysis', level: 85, icon: BarChart3 },
        { name: 'Building Codes & Regulations', level: 92, icon: Building },
        { name: 'Sustainable Design', level: 88, icon: Compass },
        { name: 'Construction Management', level: 80, icon: Settings },
        { name: 'Material Science', level: 78, icon: Layers }
      ]
    },
    {
      title: 'Software Proficiency',
      icon: Computer,
      color: 'from-architect-500 to-accent-copper',
      skills: [
        { name: 'AutoCAD', level: 95 },
        { name: 'Revit', level: 90 },
        { name: 'SketchUp', level: 88 },
        { name: '3ds Max', level: 85 },
        { name: 'Adobe Creative Suite', level: 82 },
        { name: 'Rhino', level: 80 },
        { name: 'Lumion', level: 75 }
      ]
    },
    {
      title: 'Management & Leadership',
      icon: Users,
      color: 'from-accent-copper to-architect-700',
      skills: [
        { name: 'Project Management', level: 90, icon: BarChart3 },
        { name: 'Team Leadership', level: 88, icon: Users },
        { name: 'Client Relations', level: 92, icon: Users },
        { name: 'Budget Management', level: 85, icon: BarChart3 },
        { name: 'Quality Control', level: 87, icon: Award }
      ]
    }
  ]

  const certifications: Certification[] = [
    {
      name: 'LEED AP BD+C',
      issuer: 'USGBC',
      year: '2022',
      icon: Award
    },
    {
      name: 'Registered Architect',
      issuer: 'State Board',
      year: '2020',
      icon: Building
    },
    {
      name: 'PMP Certification',
      issuer: 'PMI',
      year: '2021',
      icon: BarChart3
    },
    {
      name: 'Autodesk Certified Professional',
      issuer: 'Autodesk',
      year: '2023',
      icon: Computer
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const skillBarVariants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    })
  }

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-white to-architect-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-architect-900 mb-4">
            Skills & Expertise
          </h2>
          <p className="text-xl text-architect-600 max-w-3xl mx-auto">
            A comprehensive skill set developed through years of experience in architectural design, 
            project management, and sustainable building practices.
          </p>
        </motion.div>

        {/* Skills Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} mr-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-architect-900">
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {skill.icon && (
                          <skill.icon className="w-4 h-4 text-architect-600 mr-2" />
                        )}
                        <span className="text-architect-800 font-medium">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-architect-500 text-sm">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-architect-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        variants={skillBarVariants}
                        custom={skill.level}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full group-hover:scale-y-110 transition-transform duration-300`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-serif font-bold text-architect-900 mb-4">
            Professional Certifications
          </h3>
          <p className="text-lg text-architect-600">
            Industry-recognized credentials that validate expertise and commitment to excellence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-architect-100"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-gold to-architect-600 rounded-full flex items-center justify-center">
                <cert.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-architect-900 mb-2">
                {cert.name}
              </h4>
              <p className="text-architect-600 mb-1">
                {cert.issuer}
              </p>
              <p className="text-architect-500 text-sm">
                {cert.year}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 bg-gradient-to-r from-architect-800 to-architect-700 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-serif font-bold text-white mb-4">
            Continuous Learning & Development
          </h3>
          <p className="text-architect-100 text-lg max-w-3xl mx-auto">
            Committed to staying at the forefront of architectural innovation through ongoing education, 
            industry conferences, and hands-on exploration of emerging technologies and sustainable design practices.
          </p>
        </motion.div>
      </div>
    </section>
  )
}