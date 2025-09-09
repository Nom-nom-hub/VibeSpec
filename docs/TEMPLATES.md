# 🎨 VibeSpec Template Development Guide

Complete guide for creating, customizing, and sharing specification templates for VibeSpec.

## 📋 Table of Contents

- [Overview](#overview)
- [Template Structure](#template-structure)
- [Creating Your First Template](#creating-your-first-template)
- [Advanced Template Features](#advanced-template-features)
- [Template Sharing](#template-sharing)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Overview

VibeSpec templates are YAML files that define reusable specification patterns. Templates contain:

- **Metadata**: Information about the template (author, category, etc.)
- **Configuration**: How the template should be processed
- **Content**: The actual specification structure to create

Templates enable:
- ⚡ **Fast project setup** with best practices
- 📚 **Knowledge capture** of successful patterns
- 🔄 **Consistency** across similar projects
- 🎯 **Domain expertise** sharing among teams

## Template Structure

### Basic Template Format

```yaml
# Template metadata (required)
metadata:
  name: "Web API Service"
  description: "RESTful API service with authentication and documentation"
  category: "Backend"
  type: "service"
  version: "1.0.0"
  author: "DevOps Team"
  tags: ["api", "rest", "authentication", "documentation"]
  dependencies: ["node.js", "express", "swagger"]
  lastUpdated: "2025-01-01"
  compatibleWith: ["backend", "microservices", "cloud"]

# Template configuration
templateConfig:
  generateFrom: "content"
  variables: []  # Future: dynamic variable substitution

# The actual specification template
content: |
  project: "Web API Service"
  version: "1.0.0"
  description: >
    A robust RESTful API service built with modern web technologies.
    Provides secure endpoints with comprehensive documentation and monitoring.

  goals:
    - Deliver reliable and scalable API endpoints
    - Ensure comprehensive API documentation
    - Provide secure authentication and authorization
    - Enable monitoring and logging capabilities
    - Support high-performance data operations

  constraints:
    - Must use RESTful conventions
    - Must implement OAuth 2.0 authentication
    - Must provide OpenAPI/Swagger documentation
    - Must support horizontal scaling
    - Must meet 99.9% uptime requirements
    - Must comply with GDPR data protection

  features:
    - name: "Authentication & Authorization"
      description: "Secure user authentication and access control"
      requirements:
        - Implement OAuth 2.0 flow support
        - Provide JWT token-based authentication
        - Include role-based access control (RBAC)
        - Support token refresh mechanisms
        - Enable single sign-on (SSO) integration
        - Implement rate limiting and abuse protection

    - name: "API Endpoints"
      description: "RESTful CRUD operations for resources"
      requirements:
        - Implement RESTful resource endpoints
        - Provide proper HTTP status codes
        - Support content negotiation (JSON, XML)
        - Include request/response validation
        - Enable CORS for frontend integration
        - Support pagination for list endpoints

    - name: "Documentation"
      description: "Comprehensive API documentation and testing"
      requirements:
        - Generate OpenAPI 3.0 specification
        - Provide Swagger UI documentation interface
        - Include interactive API testing tools
        - Document authentication requirements
        - Provide usage examples and code samples
        - Support multiple programming languages examples
```

### Metadata Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Short, descriptive display name |
| `description` | string | ✅ | Detailed description (max 100 chars) |
| `category` | string | ✅ | Primary category (AI, Web, Mobile, Backend) |
| `type` | string | ✅ | Technical type (application, library, service) |
| `version` | string | ✅ | Semantic version (1.0.0 format) |
| `author` | string | ✅ | Creator/maintainer name or team |
| `tags` | string[] | ✅ | Relevant keywords for discovery |
| `dependencies` | string[] | ❌ | Required technologies or frameworks |
| `lastUpdated` | string | ✅ | ISO date (YYYY-MM-DD) |
| `compatibleWith` | string[] | ❌ | Compatible environments/platforms |

## Creating Your First Template

### Step 1: Analyze Your Domain

Before creating a template, identify the pattern:

```yaml
# ✅ What makes this a "Payment Gateway API"?
metadata:
  name: "Payment Gateway API"
  description: "Secure payment processing with multiple providers"
  category: "Finance"
  type: "service"
  tags: ["payments", "security", "transactions", "api"]
```

### Step 2: Define Goals and Constraints

Goals should be specific, measurable outcomes:

```yaml
goals:
  - "Achieve PCI DSS Level 1 compliance for payment security"
  - "Support transaction volumes of 10,000 TPS with <50ms latency"
  - "Reduce payment processing errors by 99.9% through comprehensive validation"
  - "Enable seamless integration with 5+ payment providers"
  - "Provide real-time transaction monitoring and alerts"
```

### Step 3: Structure Features Logically

Group related requirements into coherent features:

```yaml
features:
  - name: "Payment Processing"
    description: "Core payment transaction handling"
    requirements:
      - "Process credit/debit card transactions securely"
      - "Support multiple payment methods (achievements cards)"
      - "Implement fraud detection and prevention"
      - "Handle partial/full refunds and chargebacks"
      - "Support international currency conversion"

  - name: "Provider Integration"
    description: "Integration with external payment providers"
    requirements:
      - "Connect to multiple payment gateways simultaneously"
      - "Implement failover and redundancy mechanisms"
      - "Handle provider-specific error scenarios"
      - "Provide unified API across all providers"
      - "Support real-time status polling and webhooks"
```

### Step 4: Create the Template File

```bash
# 1. Create template directory if it doesn't exist
mkdir -p templates

# 2. Create your template file
touch templates/payment-gateway-api.yaml

# 3. Add your template definition using the format above
```

### Step 5: Test Your Template

```bash
# Test initialization
node bin/vibe.js init --template payment-gateway-api --force

# Validate the generated spec
node bin/vibe.js validate

# Check the generated structure
cat spec.yaml
```

## Advanced Template Features

### Dynamic Variables (Future Enhancement)

Templates support variable substitution (planned feature):

```yaml
templateConfig:
  variables:
    - name: "database_type"
      type: "select"
      default: "postgresql"
      options:
        - "postgresql"
        - "mongodb"
        - "mysql"
      description: "Choose your database technology"

    - name: "cache_size"
      type: "number"
      default: 1024
      min: 256
      max: 65536
      description: "Cache size in MB"

# The template can then reference variables:
content: |
  project: "${project_name}"
  constraints:
    - "Database: ${database_type}"
    - "Cache size: ${cache_size} MB"
```

### Conditional Logic (Future Enhancement)

```yaml
templateConfig:
  variables:
    - name: "include_monitoring"
      type: "boolean"
      default: true
      description: "Include monitoring and alerting"

features:
  # Conditional feature based on variables
  - {name: "Monitoring", includeIf: "include_monitoring"}
```

### Template Extensions

Create template families by using composition:

```yaml
# Base template
templateConfig:
  extends: "base-web-app"
  variables:
    - name: "auth_method"
      type: "select"
      default: "jwt"
      options: ["jwt", "oauth2", "session"]

# Extended features are added to base template
content: |
  # Inherits all goals, constraints from base-web-app
  # Adds authentication-specific features
  features:
    - name: "Authentication"
      requirements:
        - "Implement ${auth_method} authentication"
```

## Template Sharing

### Community Template Directory

Share valuable templates with the community:

```bash
# 1. Create a comprehensive template
# 2. Test thoroughly
# 3. Document usage examples
# 4. Share via:
#    - GitHub Gist
#    - Community forum posts
#    - Pull requests to main repo
#    - Company internal sharing
```

### Template Repository Structure

```
📦 my-company-templates/
├── 📄 README.md                    # Template catalog
├── 💳 templates/
│   ├── payment-gateway.yaml       # Payment processing
│   ├── microservice.yaml          # Company standard
│   ├── data-analytics.yaml        # Analytics service
│   └── frontend-app.yaml          # Frontend baseline
└── 📊 examples/
    ├── payment-gateway-spec.yaml  # Usage example
    └── microservice-example.yaml # Complete spec
```

### Version Control Best Practices

```bash
# Template versioning
git tag -a v1.0.0 -m "Payment Gateway API template v1.0.0"
git tag -a v1.1.0 -m "Added 3DS support and improved error handling"

# Semantic versioning for templates
# 1.0.0 - Breaking specification changes
# 1.1.0 - New features, backward compatible
# 1.1.1 - Bug fixes, documentation improvements
```

### Documentation Standards

Every shared template should include:

```markdown
# Template Name

## Description
Brief description of what this template creates

## Use Cases
- Scenario 1: When to use this template
- Scenario 2: Best practices examples

## Example Output
Show a sample spec generated from this template

## Customization
How to customize for specific use cases

## Dependencies
Required technologies or frameworks

## Author & Version
Created by: Your Name
Version: 1.0.0
Last Updated: 2025-01-01
```

## Best Practices

### Template Design Principles

#### 🎯 Specific and Focused
```yaml
# ✅ Good: Specific template with clear boundaries
metadata:
  name: "E-commerce API"
  description: "Complete e-commerce platform API with cart, orders, payments"

# ❌ Bad: Too broad, unclear scope
metadata:
  name: "API Template"
  description: "General purpose API for anything"
```

#### 📊 Measurable Goals
```yaml
goals:
  # ✅ Good: Specific, measurable outcomes
  - "Process 1000 orders per minute with <200ms response time"
  - "Achieve 99.99% uptime with automatic failover"
  - "Reduce order errors by 95% through validation"

  # ❌ Bad: Vague, unmeasurable goals
  - "Be fast and reliable"
  - "Handle lots of traffic"
  - "Be user-friendly"
```

#### 🔧 Actionable Requirements
```yaml
requirements:
  # ✅ Good: Clear, verifiable requirements
  - "Implement input validation with regex patterns"
  - "Provide rate limiting at 100 requests per minute"
  - "Generate Swagger documentation automatically"

  # ❌ Bad: Vague, ambiguous requirements
  - "Make it secure"
  - "Add error handling"
  - "Make it work well"
```

### Template Organization

#### Feature Grouping
```yaml
features:
  # ✅ Good: Logical grouping, clear relationships
  - name: "Order Management"
    description: "Complete order lifecycle from creation to fulfillment"

  - name: "Inventory System"
    description: "Real-time inventory tracking and management"

  # ❌ Bad: Poor organization, mixed concerns
  - name: "Core Functionality"
    description: "Main features"

  - name: "Other Stuff"
    description: "Additional features"
```

#### Progressive Enhancement

Design templates with layered complexity:

```yaml
# Basic e-commerce template
features:
  - name: "Basic Cart Operations"
  - name: "Simple Checkout"

# Advanced template (extends basic)
features:
  - name: "Basic Cart Operations"  # Included from basic
  - name: "Simple Checkout"        # Included from basic
  - name: "Advanced Inventory"     # New capability
  - name: "Multi-channel Orders"  # New capability
```

### Maintainability

#### Regular Updates
- Check templates every 3-6 months
- Update dependencies and best practices
- Incorporate user feedback and pain points
- Add new requirements from lessons learned

#### Version Management
```yaml
# Template versioning strategy
metadata:
  version: "2.1.3"  # Major.Minor.Patch
  lastUpdated: "2025-01-01"

# Changelog comments
# v2.1.3: Added webhook support
# v2.1.2: Fixed authentication edge case
# v2.1.1: Updated dependency requirements
```

## Common Patterns

### Microservice API Template

```yaml
metadata:
  name: "REST API Microservice"
  category: "Backend"
  type: "service"

goals:
  - "Provide RESTful API with 99.9% availability"
  - "Handle 1000 concurrent requests"
  - "Complete 95% of operations under 100ms"

features:
  - name: "API Endpoints"
    requirements:
      - "Implement RESTful resource endpoints"
      - "Provide OpenAPI 3.0 documentation"
      - "Include request/response validation"

  - name: "Observability"
    requirements:
      - "Implement structured logging"
      - "Add metrics collection"
      - "Enable health check endpoints"
```

### Frontend Application Template

```yaml
metadata:
  name: "React Application"
  category: "Frontend"
  type: "application"

goals:
  - "Deliver responsive interface across all devices"
  - "Achieve 90+ Lighthouse performance score"
  - "Support 10k+ concurrent users"

features:
  - name: "User Interface"
    requirements:
      - "Implement responsive design patterns"
      - "Support dark/light theme switching"
      - "Optimize for 60fps animations"

  - name: "State Management"
    requirements:
      - "Implement global state solution"
      - "Enable offline data persistence"
      - "Support real-time data synchronization"
```

### Data Processing Pipeline Template

```yaml
metadata:
  name: "ETL Data Pipeline"
  category: "Data"
  type: "pipeline"

goals:
  - "Process 1TB of data per day reliably"
  - "Maintain 99.95% data accuracy"
  - "Complete pipeline in under 2 hours"

features:
  - name: "Data Ingestion"
    requirements:
      - "Support streaming and batch data intake"
      - "Handle structured/unstructured data formats"
      - "Implement data quality validation"

  - name: "Data Transformation"
    requirements:
      - "Enable complex data cleansing operations"
      - "Support schema evolution and migration"
      - "Provide data lineage tracking"
```

## Troubleshooting

### Template Loading Issues

```bash
# Check if template exists and is valid
node bin/vibe.js template list

# Validate YAML syntax
yamllint templates/your-template.yaml

# Check file permissions
ls -la templates/your-template.yaml
```

### Specification Generation Issues

```bash
# Validate generated spec
node bin/vibe.js validate

# Check template content structure
node bin/vibe.js template show your-template

# Test with minimal template first
node bin/vibe.js init --template empty --force
```

### Common Template Mistakes

#### Invalid YAML Structure
```yaml
# ❌ Invalid: Missing required fields
content: |
  project: "My Project"
  version: "1.0.0"
  # Missing 'features' array

# ✅ Valid: Complete structure
content: |
  project: "My Project"
  version: "1.0.0"
  goals: ["Goal 1"]
  features: []
```

#### Incorrect Goal/Objective Definitions
```yaml
goals:
  # ❌ Too vague
  - "Make it good"
  - "Be fast"

# ✅ Specific and measurable
goals:
  - "Respond to API requests in under 100ms"
  - "Handle 1000 concurrent users with 99.9% availability"
```

#### Poorly Structured Features
```yaml
features:
  # ❌ Too broad, mixed concerns
  - name: "Everything"
    requirements:
      - "Do authentication"
      - "Handle data"
      - "Make it work"

# ✅ Well-structured, focused
features:
  - name: "User Authentication"
    requirements:
      - "Implement OAuth 2.0 flow"
      - "Provide JWT tokens"
      - "Support role-based access"

  - name: "Data Management"
    requirements:
      - "Implement CRUD operations"
      - "Add data validation"
      - "Enable caching layer"
```

### Performance Issues

```yaml
# Large templates can be slow to load
# Break them into smaller, focused templates:

# 🏗️ monolithic-template.yaml (SLOW)
# Contains 500+ requirements
# Takes 2+ seconds to load

# 🎯 specialized-templates/
# ├── api-core.yaml         (120 reqs)
# ├── authentication.yaml   (80 reqs)
# ├── monitoring.yaml       (60 reqs)
# └── security.yaml         (40 reqs)
# Total: Still 500+ requirements, but faster loading
```

## Template Validation Checklist

- [ ] Template YAML is valid syntax
- [ ] All required metadata fields present
- [ ] Description is under 100 characters
- [ ] Goals are specific and measurable
- [ ] Features have logical grouping
- [ ] Requirements are actionable
- [ ] Template generates valid specs
- [ ] Documentation is included
- [ ] Version follows semantic versioning
- [ ] Dependencies are specified if required

---

## 🎉 Resources

### Similar Projects
- [OWASP API Security Project](https://owasp.org/API-Security/) - Security templates
- [AWS Architecture Patterns](https://aws.amazon.com/architecture/) - Cloud templates
- [Google Developer Templates](https://developers.google.com/) - Platform templates

### Learning Resources
- **Specification Writing**: [IEEE Standards](https://www.ieee.org/)
- **Domain-Driven Design**: [DDD Community](https://dddcommunity.org/)
- **API Design**: [API Guidelines](https://apiguide.readthedocs.io/)

### Community
- **Share Templates**: Contribute to the main repository
- **Get Help**: GitHub issues and discussions
- **Find Templates**: Check the community template directory

---

*Happy template development! Your contributions help make development more efficient for everyone! 🚀*