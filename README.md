# Newsletter Popup API

A powerful and customizable newsletter popup management system built with Node.js, Express, and React. This platform allows you to create, manage, and track newsletter subscription popups across different websites.

## Features

- Create and manage multiple popup designs
- Secure authentication using Clerk
- Track subscription analytics
- Customizable popup designs
- Easy integration with any website
- Built-in security features
- Responsive design

## Tech Stack

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Clerk Authentication
  
- **Frontend:**
  - React
  - Modern UI/UX
  - Responsive Design

- **Security Features:**
  - Helmet.js
  - CORS
  - Rate Limiting
  - MongoDB Sanitization
  - XSS Protection

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/api-newsletter-popup.git
   cd api-newsletter-popup
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   MONGODB_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_clerk_secret_key
   NODE_ENV=development
   PORT=3003
   ```

4. Start the development server:
   ```bash
   # Run both frontend and backend
   npm run dev-full

   # Or run separately
   npm run dev      # Backend only
   npm run client   # Frontend only
   ```

## Usage

1. Create an account and log in
2. Design your popup using the intuitive interface
3. Configure popup settings and triggers
4. Get the integration code
5. Add the code to your website
6. Track subscriptions and analytics

## API Documentation

### Base URL
```
http://localhost:3003/api
```

### Endpoints

- `POST /popups` - Create a new popup
- `GET /popups` - Get all popups
- `GET /popups/:id` - Get specific popup
- `PUT /popups/:id` - Update popup
- `DELETE /popups/:id` - Delete popup

## Security

This project implements various security measures:
- Request rate limiting
- Input sanitization
- XSS protection
- Secure headers
- CORS configuration
- Authentication & Authorization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/api-newsletter-popup
