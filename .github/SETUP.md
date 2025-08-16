# GitHub Actions Setup Guide

This document provides step-by-step instructions for setting up the GitHub Actions workflows for the architect resume portfolio.

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings under **Settings > Secrets and variables > Actions**:

### Deployment Secrets
- `VERCEL_TOKEN` - Your Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `NETLIFY_AUTH_TOKEN` - Netlify personal access token (fallback deployment)
- `NETLIFY_SITE_ID` - Netlify site ID (fallback deployment)

### Security Scanning Secrets
- `SNYK_TOKEN` - Snyk authentication token for vulnerability scanning
- `CODECOV_TOKEN` - Codecov token for coverage reporting
- `GITLEAKS_LICENSE` - GitLeaks license key (optional, for enhanced features)

### Lighthouse CI Secrets
- `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI GitHub App token
- `LHCI_TOKEN` - Lighthouse CI server token

## Environment Setup

### 1. Vercel Setup
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Note down the Project ID from project settings
4. Generate a token from [Vercel Tokens](https://vercel.com/account/tokens)
5. Find your Team/Organization ID in account settings

### 2. Netlify Setup (Fallback)
1. Visit [Netlify Dashboard](https://app.netlify.com/)
2. Create a new site from Git
3. Note the Site ID from site settings
4. Generate a personal access token from [Netlify Tokens](https://app.netlify.com/user/applications#personal-access-tokens)

### 3. Snyk Security Setup
1. Sign up at [Snyk.io](https://snyk.io/)
2. Generate an API token from [Account Settings](https://app.snyk.io/account)
3. Add the token to GitHub secrets

### 4. Codecov Setup
1. Visit [Codecov.io](https://codecov.io/)
2. Connect your GitHub repository
3. Copy the repository upload token
4. Add to GitHub secrets

### 5. Lighthouse CI Setup
1. Visit [Lighthouse CI Server](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)
2. Set up your LHCI server or use temporary public storage
3. Generate tokens as needed

## Branch Protection Rules

Set up branch protection rules for the `main` branch:

1. Go to **Settings > Branches**
2. Add rule for `main` branch
3. Configure the following:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Required status checks:
     - `Test Suite (20.x)`
     - `CodeQL Analysis (javascript)`
     - `Lighthouse Audit (mobile)`
     - `Dependency Vulnerability Scan`
   - ✅ Restrict pushes that create files
   - ✅ Require review from code owners

## Workflow Triggers

### Continuous Integration (ci.yml)
- **Triggers**: Push to main/develop, Pull requests to main
- **Purpose**: Testing, linting, type checking, building
- **Duration**: ~5-15 minutes

### Deployment (deploy.yml)
- **Triggers**: Push to main, Manual dispatch
- **Purpose**: Deploy to production/staging
- **Duration**: ~10-20 minutes

### Performance Testing (performance.yml)
- **Triggers**: Push to main, PR to main, Weekly schedule, Manual dispatch
- **Purpose**: Lighthouse audits, Web Vitals, Bundle analysis
- **Duration**: ~10-15 minutes

### Security Scans (security.yml)
- **Triggers**: Push to main/develop, PR to main, Weekly schedule
- **Purpose**: Vulnerability scanning, secret detection, license compliance
- **Duration**: ~10-15 minutes

### Release Management (release.yml)
- **Triggers**: Push to main, Manual dispatch
- **Purpose**: Automated releases with semantic versioning
- **Duration**: ~15-25 minutes

## Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check Vercel/Netlify tokens are valid
   - Verify project IDs are correct
   - Ensure build completes successfully

2. **Security Scans Fail**
   - Update vulnerable dependencies
   - Check Snyk token permissions
   - Review audit results in artifacts

3. **Performance Tests Fail**
   - Check if application starts correctly
   - Verify Lighthouse CI configuration
   - Review performance budget thresholds

4. **Release Creation Fails**
   - Ensure semantic commit messages
   - Check package.json version format
   - Verify GitHub token permissions

### Getting Help

1. Check workflow run logs in GitHub Actions tab
2. Review artifact downloads for detailed reports
3. Check GitHub Security tab for vulnerability reports
4. Consult individual tool documentation for specific issues

## Monitoring and Maintenance

### Regular Tasks
- Monitor dependency updates from Dependabot
- Review security scan results weekly
- Update workflow dependencies monthly
- Optimize performance budgets based on results

### Performance Monitoring
- Set up alerts for performance regressions
- Monitor bundle size increases
- Track Core Web Vitals metrics

### Security Monitoring
- Enable GitHub security advisories
- Review Dependabot PRs promptly
- Monitor secret scanning alerts
- Keep security tools updated

## Best Practices

1. **Commit Messages**: Use conventional commits for automatic release notes
2. **Branch Strategy**: Use feature branches with PR reviews
3. **Secret Management**: Rotate tokens regularly, use least privilege
4. **Performance**: Set realistic budgets, monitor trends
5. **Security**: Address vulnerabilities promptly, keep dependencies updated

This setup provides a robust CI/CD pipeline with comprehensive testing, security scanning, and automated deployments while maintaining high code quality standards.