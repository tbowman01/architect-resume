'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { blogPosts } from '../data/blog'
import { BlogPost } from '../types/blog'

interface BlogProps {
  featured?: boolean
  limit?: number
}

export default function Blog({ featured = false, limit }: BlogProps) {
  const posts = featured 
    ? blogPosts.filter(post => post.featured)
    : blogPosts

  const displayPosts = limit ? posts.slice(0, limit) : posts

  return (
    <section id="blog" className="py-20 bg-architect-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-architect-900 mb-4">
            {featured ? 'Featured Insights' : 'Blog & Insights'}
          </h2>
          <p className="text-xl text-architect-600 max-w-3xl mx-auto">
            Exploring the intersection of architecture, technology, and human experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {!featured && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="px-8 py-3 bg-architect-800 text-white rounded-full hover:bg-architect-700 transition-colors">
              View All Articles
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
    >
      {post.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.featured && (
            <div className="absolute top-4 left-4 bg-accent-gold text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-architect-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-architect-900 mb-3 group-hover:text-accent-gold transition-colors">
          {post.title}
        </h3>
        
        <p className="text-architect-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs bg-architect-100 text-architect-700 px-2 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          
          <ArrowRight className="w-5 h-5 text-architect-400 group-hover:text-accent-gold group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.article>
  )
}