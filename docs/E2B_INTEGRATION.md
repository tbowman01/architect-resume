# E2B Sandbox Integration for Architect Resume Project

## Overview

E2B (Execute to Build) provides secure cloud-based code execution sandboxes that can be integrated with the Architect Resume project through the Model Context Protocol (MCP). This enables safe code execution, testing, and development workflows in isolated environments.

## Available E2B Tools and Capabilities

### Core Features

1. **Secure Code Execution**
   - Run JavaScript, Python, and other languages in isolated sandboxes
   - Protection against malicious code execution
   - Resource isolation and management
   - Automatic cleanup after execution

2. **Virtual Desktop Management**
   - Create Ubuntu 22.04 desktop sandboxes
   - Full computer control (click, type, drag, scroll)
   - Live VNC streaming for real-time desktop viewing
   - Perfect for UI testing and visual automation

3. **MCP Server Integration**
   - Native support for Model Context Protocol
   - Available for both JavaScript and Python implementations
   - Easy integration with Claude Desktop and Claude Code
   - Standardized API for agent communication

## Integration Options for Architect Resume Project

### Option 1: Direct MCP Server Integration

Install the E2B MCP server globally to make it available for all development tasks:

```bash
# Add E2B server to Claude Code
npx claude-flow mcp add-json "e2b-server" \
  '{"command":"npx","args":["-y","@e2b/mcp-server"],"env":{"E2B_API_KEY":"your-api-key"}}'
```

### Option 2: Project-Specific Integration

Add E2B as a development dependency for the architect resume project:

```bash
# Install E2B SDK
npm install @e2b/sdk

# Configure in package.json
{
  "scripts": {
    "sandbox:test": "e2b sandbox run --file ./tests",
    "sandbox:build": "e2b sandbox run --file ./build.js"
  }
}
```

### Option 3: Custom MCP Server Extension

Create a custom MCP server that wraps E2B functionality specific to the architect resume project:

```javascript
// .mcp/e2b-resume-server.js
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { E2BSDk } = require('@e2b/sdk');

const server = new Server({
  name: 'architect-resume-e2b',
  version: '1.0.0',
});

// Add custom tools for resume-specific tasks
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'test_resume_component',
      description: 'Test React components in E2B sandbox',
      inputSchema: {
        type: 'object',
        properties: {
          component: { type: 'string' },
          props: { type: 'object' }
        }
      }
    },
    {
      name: 'generate_pdf_preview',
      description: 'Generate PDF preview of resume in sandbox',
      inputSchema: {
        type: 'object',
        properties: {
          data: { type: 'object' }
        }
      }
    }
  ]
}));
```

## Use Cases for Architect Resume Project

### 1. Component Testing
- Test React components in isolated environments
- Validate styling across different browsers
- Performance testing without affecting local environment

### 2. PDF Generation
- Generate resume PDFs in sandboxed environment
- Test different PDF libraries and configurations
- Preview results without local dependencies

### 3. Data Processing
- Process resume data transformations safely
- Test JSON/YAML parsing and validation
- Run data migration scripts in isolation

### 4. Build Verification
- Test build processes in clean environments
- Verify deployment configurations
- Check for missing dependencies

### 5. Security Testing
- Scan for vulnerabilities in sandboxed environment
- Test input validation and sanitization
- Verify authentication flows safely

## Configuration Requirements

### API Key Setup

1. Sign up at https://e2b.dev
2. Generate an API key from the dashboard
3. Add to environment variables:

```bash
# .env.local
E2B_API_KEY=your-api-key-here
```

### Claude Code Configuration

Update Claude Code configuration to include E2B server:

```json
{
  "mcpServers": {
    "e2b-server": {
      "command": "npx",
      "args": ["-y", "@e2b/mcp-server"],
      "env": {
        "E2B_API_KEY": "${E2B_API_KEY}"
      }
    }
  }
}
```

## Implementation Example

### Testing Resume Components

```javascript
// tests/e2b-component-test.js
const { Sandbox } = require('@e2b/sdk');

async function testResumeComponent() {
  const sandbox = await Sandbox.create({
    template: 'node-react',
    timeout: 60000
  });

  try {
    // Install dependencies
    await sandbox.filesystem.write('/package.json', JSON.stringify({
      dependencies: {
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        '@testing-library/react': '^14.0.0'
      }
    }));
    
    await sandbox.process.start('npm install');
    
    // Copy component to sandbox
    const componentCode = await fs.readFile('./app/components/Resume.tsx', 'utf-8');
    await sandbox.filesystem.write('/Resume.tsx', componentCode);
    
    // Run tests
    const result = await sandbox.process.start('npm test Resume.tsx');
    console.log('Test results:', result.stdout);
    
  } finally {
    await sandbox.close();
  }
}
```

### Generating PDF Preview

```javascript
// scripts/generate-pdf-preview.js
const { Sandbox } = require('@e2b/sdk');

async function generatePDFPreview(resumeData) {
  const sandbox = await Sandbox.create({
    template: 'node-puppeteer',
    timeout: 120000
  });

  try {
    // Setup PDF generation environment
    await sandbox.filesystem.write('/generate.js', `
      const puppeteer = require('puppeteer');
      const data = ${JSON.stringify(resumeData)};
      
      (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Load resume HTML with data
        await page.setContent(generateResumeHTML(data));
        
        // Generate PDF
        await page.pdf({
          path: 'resume.pdf',
          format: 'A4',
          printBackground: true
        });
        
        await browser.close();
      })();
    `);
    
    // Execute PDF generation
    await sandbox.process.start('node generate.js');
    
    // Retrieve generated PDF
    const pdf = await sandbox.filesystem.read('/resume.pdf');
    return pdf;
    
  } finally {
    await sandbox.close();
  }
}
```

## Benefits for Architect Resume Project

1. **Isolation**: Test and run code without affecting local environment
2. **Security**: Execute untrusted code safely
3. **Reproducibility**: Consistent testing environments
4. **Scalability**: Run multiple sandboxes in parallel
5. **CI/CD Integration**: Seamless integration with GitHub Actions
6. **Resource Management**: Automatic cleanup and resource limits

## Getting Started

1. Install E2B MCP server:
   ```bash
   npx claude-flow mcp add-json "e2b-server" '{"command":"npx","args":["-y","@e2b/mcp-server"],"env":{"E2B_API_KEY":"${E2B_API_KEY}"}}'
   ```

2. Verify installation:
   ```bash
   npx claude-flow mcp tools --category=system | grep e2b
   ```

3. Test basic sandbox creation:
   ```bash
   npx claude-flow sparc run code "Create a simple E2B sandbox test"
   ```

## Next Steps

- [ ] Obtain E2B API key from https://e2b.dev
- [ ] Configure E2B MCP server in Claude Code
- [ ] Create custom tools for resume-specific tasks
- [ ] Implement automated testing workflows
- [ ] Set up CI/CD integration with E2B sandboxes

## Resources

- [E2B Documentation](https://docs.e2b.dev)
- [E2B MCP Server GitHub](https://github.com/e2b-dev/mcp-server)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Claude Code MCP Integration](https://docs.anthropic.com/claude-code/mcp)