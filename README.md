# Reddit Clone - Microservices Architecture

A comprehensive Reddit clone built with microservices architecture, featuring 11 specialized services for different functionalities.

## 🏗️ Architecture Overview

This project consists of the following microservices:

- **Auth Service** - Authentication and authorization
- **Content Service** - Posts, comments, and content management
- **Community Service** - Subreddit management
- **Media Service** - File uploads and media handling
- **Notification Service** - Push notifications and alerts
- **Moderation Service** - Content moderation and admin tools
- **Observability Service** - Logging, monitoring, and metrics
- **Abuse Service** - Abuse detection and reporting
- **AdminOps Service** - Administrative operations
- **BFF Service** - Backend for Frontend
- **Localization Service** - Multi-language support

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- PostgreSQL
- MongoDB
- Redis
- Kafka
- Elasticsearch

### ⚠️ Security Configuration Required

**IMPORTANT**: Before running this application, you must configure the following sensitive files:

#### 1. Environment Variables
All `.env` files have been masked for security. Copy `env-template.txt` to create your environment files:

```bash
# For each service, copy the template and configure
cp env-template.txt redditclone-auth-service-main/.dev.env
cp env-template.txt redditclone-auth-service-main/.prod.env
# ... repeat for all services
```

Update each `.env` file with your actual values:
- Database credentials
- API keys
- SMTP settings
- Redis/Kafka/Elasticsearch URLs
- JWT secrets

#### 2. RSA Keys (Auth Service)
The following files in `redditclone-auth-service-main/` need to be replaced with your actual keys:

- `keysdev/rsa.key.dev` - Development private key
- `keysdev/pp.pwd` - RSA passphrase
- `keysprod/rsa.key.b3bd6434aa264eb0adfead347a9a81db` - Production private key
- `keysprod/pp.pwd` - Production RSA passphrase
- `keysprod/currentKeyId` - Current key identifier

Generate your RSA key pair:
```bash
# Generate private key
openssl genrsa -aes256 -out rsa.key.dev 2048

# Generate public key
openssl rsa -in rsa.key.dev -pubout -out rsa.key.pub.dev
```

#### 3. Search Configuration
If you have a `mindbricks.config.cjs` file with search object configuration, ensure it's properly configured with your search service credentials.

### Installation

1. Clone the repository
```bash
git clone https://github.com/Mindbricks-Community/Reddit-Clone.git
cd Reddit-Clone
```

2. Configure environment variables (see Security Configuration above)

3. Install dependencies for each service
```bash
# Example for auth service
cd redditclone-auth-service-main
npm install
cd ..

# Repeat for all services
```

4. Start the services
```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or start each service individually
cd redditclone-auth-service-main
npm start
```

## 📁 Project Structure

```
Reddit-Clone/
├── redditclone-auth-service-main/          # Authentication service
├── redditclone-content-service-main/       # Content management
├── redditclone-community-service-main/     # Community features
├── redditclone-media-service-main/         # Media handling
├── redditclone-notification-service-main/  # Notifications
├── redditclone-moderation-service-main/    # Moderation tools
├── redditclone-observability-service-main/ # Monitoring
├── redditclone-abuse-service-main/         # Abuse detection
├── redditclone-adminops-service-main/      # Admin operations
├── redditclone-bff-service-main/           # Backend for Frontend
├── redditclone-localization-service-main/  # Localization
└── env-template.txt                        # Environment template
```

## 🔧 Configuration

Each service has its own configuration files:
- `.env` files for environment variables
- `package.json` for dependencies
- `Dockerfile` for containerization
- Service-specific configuration files

## 🧪 Testing

Each service includes unit tests:
```bash
cd redditclone-[service-name]-main
npm test
```

## 📚 API Documentation

Each service includes:
- Swagger/OpenAPI documentation
- Postman collections
- API design documents in the `docs/` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Configure your environment properly
4. Make your changes
5. Add tests
6. Submit a pull request

## ⚠️ Security Notes

- Never commit real credentials to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys and passwords
- Keep dependencies updated
- Use HTTPS in production
- Implement proper authentication and authorization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with MindBricks framework
- Inspired by Reddit's architecture
- Community contributions welcome

---

**Note**: This is a template project. Ensure all security configurations are properly set up before deploying to production.