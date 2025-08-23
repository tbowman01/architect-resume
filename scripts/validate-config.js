#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorText(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function showBanner() {
  console.log(colorText('\n🔍 TEMPLATE CONFIGURATION VALIDATOR', 'cyan'));
  console.log(colorText('=====================================\n', 'cyan'));
}

// Configuration validation schema
const validationRules = {
  personal: {
    required: ['name'],
    optional: ['title', 'bio', 'tagline'],
    types: {
      name: 'string',
      title: 'string', 
      bio: 'string',
      tagline: 'string'
    }
  },
  contact: {
    required: ['email'],
    optional: ['phone', 'location', 'officeHours'],
    types: {
      email: 'email',
      phone: 'string',
      location: 'string',
      officeHours: 'string'
    }
  },
  social: {
    required: [],
    optional: ['linkedin', 'instagram', 'behance', 'website', 'twitter', 'pinterest'],
    types: {
      linkedin: 'url',
      instagram: 'url',
      behance: 'url',
      website: 'url',
      twitter: 'url',
      pinterest: 'url'
    }
  },
  branding: {
    required: [],
    optional: ['colors', 'fonts'],
    types: {
      colors: 'object',
      fonts: 'object'
    }
  },
  features: {
    required: [],
    optional: ['blog', 'chatbot', 'portfolio', 'testimonials', 'darkMode'],
    types: {
      blog: 'boolean',
      chatbot: 'boolean',
      portfolio: 'boolean',
      testimonials: 'boolean',
      darkMode: 'boolean'
    }
  }
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateColor(color) {
  // Hex color validation
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

function validateType(value, type, key) {
  const errors = [];
  
  switch (type) {
    case 'string':
      if (typeof value !== 'string' || value.trim() === '') {
        errors.push(`${key} must be a non-empty string`);
      }
      break;
      
    case 'email':
      if (typeof value !== 'string' || !validateEmail(value)) {
        errors.push(`${key} must be a valid email address`);
      }
      break;
      
    case 'url':
      if (typeof value !== 'string' || !validateUrl(value)) {
        errors.push(`${key} must be a valid URL`);
      }
      break;
      
    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push(`${key} must be a boolean (true/false)`);
      }
      break;
      
    case 'object':
      if (typeof value !== 'object' || Array.isArray(value) || value === null) {
        errors.push(`${key} must be an object`);
      }
      break;
  }
  
  return errors;
}

function validateSection(config, sectionName, rules) {
  const errors = [];
  const warnings = [];
  const section = config[sectionName];
  
  if (!section) {
    if (rules.required.length > 0) {
      warnings.push(`Missing ${sectionName} section`);
    }
    return { errors, warnings };
  }
  
  // Check required fields
  for (const field of rules.required) {
    if (!(field in section)) {
      errors.push(`Missing required field: ${sectionName}.${field}`);
    }
  }
  
  // Validate field types and values
  for (const [field, value] of Object.entries(section)) {
    const type = rules.types[field];
    if (type) {
      const fieldErrors = validateType(value, type, `${sectionName}.${field}`);
      errors.push(...fieldErrors);
      
      // Special validations
      if (field === 'colors' && typeof value === 'object') {
        for (const [colorKey, colorValue] of Object.entries(value)) {
          if (typeof colorValue === 'string' && !validateColor(colorValue)) {
            errors.push(`${sectionName}.colors.${colorKey} must be a valid hex color (e.g., #ff0000)`);
          }
        }
      }
    } else if (!rules.optional.includes(field)) {
      warnings.push(`Unknown field: ${sectionName}.${field}`);
    }
  }
  
  return { errors, warnings };
}

function validateConfiguration(config) {
  const allErrors = [];
  const allWarnings = [];
  
  // Validate each section
  for (const [sectionName, rules] of Object.entries(validationRules)) {
    const { errors, warnings } = validateSection(config, sectionName, rules);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
  }
  
  // Cross-validation checks
  if (config.features?.blog === true && !config.personal?.name) {
    allWarnings.push('Blog is enabled but no author name is specified');
  }
  
  if (config.contact?.email && !validateEmail(config.contact.email)) {
    allErrors.push('Contact email is invalid');
  }
  
  return { errors: allErrors, warnings: allWarnings };
}

function validateEnvironmentVariables() {
  const envFile = path.join(process.cwd(), '.env.local');
  const errors = [];
  const warnings = [];
  
  if (!fs.existsSync(envFile)) {
    warnings.push('.env.local file not found - using default values');
    return { errors, warnings };
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = {};
  
  // Parse environment variables
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').replace(/"/g, '').trim();
    }
  });
  
  // Check critical environment variables
  const criticalVars = ['USER_NAME', 'CONTACT_EMAIL'];
  for (const varName of criticalVars) {
    if (!envVars[varName]) {
      warnings.push(`Environment variable ${varName} is not set`);
    }
  }
  
  // Validate email format
  if (envVars.CONTACT_EMAIL && !validateEmail(envVars.CONTACT_EMAIL)) {
    errors.push('CONTACT_EMAIL environment variable has invalid format');
  }
  
  // Validate URLs
  const urlVars = ['LINKEDIN_URL', 'INSTAGRAM_URL', 'BEHANCE_URL', 'WEBSITE_URL'];
  for (const urlVar of urlVars) {
    if (envVars[urlVar] && !validateUrl(envVars[urlVar])) {
      errors.push(`${urlVar} environment variable is not a valid URL`);
    }
  }
  
  return { errors, warnings };
}

function validateFiles() {
  const errors = [];
  const warnings = [];
  
  // Check for required files
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.ts'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Required file missing: ${file}`);
    }
  }
  
  // Check for template files
  const templateFiles = [
    'template.config.json',
    '.env.example'
  ];
  
  for (const file of templateFiles) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      warnings.push(`Template file missing: ${file}`);
    }
  }
  
  return { errors, warnings };
}

function main() {
  showBanner();
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  console.log(colorText('📋 Validating configuration...', 'blue'));
  
  // 1. Validate template.config.json
  const configFile = path.join(process.cwd(), 'template.config.json');
  if (fs.existsSync(configFile)) {
    try {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      const { errors, warnings } = validateConfiguration(config);
      
      console.log(colorText('\\n📝 Template Configuration:', 'yellow'));
      if (errors.length === 0 && warnings.length === 0) {
        console.log(colorText('   ✅ Configuration is valid', 'green'));
      } else {
        errors.forEach(error => {
          console.log(colorText(`   ❌ Error: ${error}`, 'red'));
          totalErrors++;
        });
        warnings.forEach(warning => {
          console.log(colorText(`   ⚠️  Warning: ${warning}`, 'yellow'));
          totalWarnings++;
        });
      }
    } catch (error) {
      console.log(colorText(`   ❌ Error: Invalid JSON in template.config.json - ${error.message}`, 'red'));
      totalErrors++;
    }
  } else {
    console.log(colorText('   ⚠️  Warning: template.config.json not found', 'yellow'));
    totalWarnings++;
  }
  
  // 2. Validate environment variables
  const { errors: envErrors, warnings: envWarnings } = validateEnvironmentVariables();
  
  console.log(colorText('\\n🔧 Environment Variables:', 'yellow'));
  if (envErrors.length === 0 && envWarnings.length === 0) {
    console.log(colorText('   ✅ Environment variables are valid', 'green'));
  } else {
    envErrors.forEach(error => {
      console.log(colorText(`   ❌ Error: ${error}`, 'red'));
      totalErrors++;
    });
    envWarnings.forEach(warning => {
      console.log(colorText(`   ⚠️  Warning: ${warning}`, 'yellow'));
      totalWarnings++;
    });
  }
  
  // 3. Validate files
  const { errors: fileErrors, warnings: fileWarnings } = validateFiles();
  
  console.log(colorText('\\n📁 Required Files:', 'yellow'));
  if (fileErrors.length === 0 && fileWarnings.length === 0) {
    console.log(colorText('   ✅ All required files present', 'green'));
  } else {
    fileErrors.forEach(error => {
      console.log(colorText(`   ❌ Error: ${error}`, 'red'));
      totalErrors++;
    });
    fileWarnings.forEach(warning => {
      console.log(colorText(`   ⚠️  Warning: ${warning}`, 'yellow'));
      totalWarnings++;
    });
  }
  
  // Summary
  console.log(colorText('\\n📊 VALIDATION SUMMARY', 'cyan'));
  console.log(colorText('=====================', 'cyan'));
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log(colorText('🎉 Perfect! Your template configuration is ready to go.', 'green'));
  } else {
    if (totalErrors > 0) {
      console.log(colorText(`❌ Found ${totalErrors} error(s) that need to be fixed`, 'red'));
    }
    if (totalWarnings > 0) {
      console.log(colorText(`⚠️  Found ${totalWarnings} warning(s) to consider`, 'yellow'));
    }
    
    console.log('\\n💡 Next steps:');
    if (totalErrors > 0) {
      console.log('   1. Fix the errors listed above');
      console.log('   2. Run the validator again');
    }
    if (totalWarnings > 0) {
      console.log('   3. Review warnings and update if needed');
    }
    console.log('   4. Test your template with: npm run dev');
  }
  
  console.log();
  process.exit(totalErrors > 0 ? 1 : 0);
}

main();