# Todo Management Application - Interview Task

This project is an implementation of a todo management application built as part of a technical interview assignment. The task demonstrates proficiency in modern web development technologies and practices.

## Tech Stack

- Next.js 15.3.3 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand (State Management)
- JSONPlaceholder API
- Jest + React Testing Library (Testing)

## Implementation Details

### Core Requirements Implemented

- Display list of todos with pagination
- Create, read, update, and delete todos
- Filter todos by status (completed/pending)
- Search todos by title
- View detailed todo information
- Assign todos to users
- Responsive design for mobile and desktop
- Comprehensive test coverage

### Testing Implementation

1. **Test Environment Setup**

   - Jest and React Testing Library configuration
   - Custom test utilities and mocks
   - Proper TypeScript support in tests
   - Mock implementations for UI components
   - IntersectionObserver polyfill

2. **Server Actions Tests**

   - Complete CRUD operations testing
   - Error handling scenarios
   - API response validation
   - Edge cases coverage
   - Mock data handling
   - Network error handling
   - Slug-based routing tests

3. **Hook Tests**

   - useIsMobile hook testing
     - Viewport size changes
     - Event listener cleanup
   - useInfiniteScroll hook testing
     - Intersection observer functionality
     - Callback triggering
     - Cleanup handling

4. **Test Best Practices**
   - Proper mocking of external dependencies
   - Comprehensive error handling
   - Clear test organization
   - Meaningful test descriptions
   - Proper cleanup between tests
   - Type safety in test data
   - Reusable test utilities
   - Mock implementations for UI components

### Design Patterns & Architecture Decisions

1. **Repository Pattern**

   - Implemented in `app/actions` directory
   - Centralizes data fetching logic
   - Provides consistent error handling
   - Makes API integration easily swappable
   - Example: `getTodos`, `getTodoById` actions encapsulate all API interaction logic

2. **Container/Presenter Pattern**

   - Separates data management from presentation
   - Container components handle state and logic
   - Presenter components focus on UI rendering
   - Example: `TaskTable` (container) manages state while delegating rendering to child components

3. **Observer Pattern**

   - Implemented via Zustand store
   - Components subscribe to state changes
   - Decoupled state updates from UI
   - Example: Todo updates automatically reflect across all subscribed components

4. **Optimistic Updates Pattern**

   - Immediate UI feedback before API confirmation
   - Temporary state updates with rollback capability
   - Enhances perceived performance
   - Example: Todo completion status updates instantly with fallback mechanism

5. **Factory Pattern**
   - Used in UI components creation
   - Standardizes component instantiation
   - Example: shadcn/ui components with consistent props and styling

### Technical Implementation

1. **Data Management**

   - Server-side data fetching using Next.js server actions
   - Client-side state management with Zustand
   - Optimistic updates for better user experience
   - Error handling with rollback capability

2. **UI/UX**

   - Responsive design using Tailwind CSS
   - Accessible components from shadcn/ui
   - Loading states and error boundaries
   - Real-time updates

3. **Architecture**
   - Next.js App Router for routing and SSR
   - TypeScript for type safety
   - Modular component structure
   - Centralized state management

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── actions/           # Server actions
│   │   ├── __tests__/    # Server action tests
│   ├── components/        # Shared components
│   ├── todos/            # Todo-related pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── __tests__/        # Component tests
│   │   ├── setup.ts     # Test setup and mocks
│   │   └── uiMocks.tsx  # UI component mocks
│   └── ...               # Feature components
├── config/               # Configuration files
├── hooks/                # Custom React hooks
│   ├── __tests__/       # Hook tests
│   └── ...              # Hook implementations
├── lib/                  # Utility functions
├── store/                # State management (Zustand)
└── types/                # TypeScript type definitions
```

## Getting Started

### Local Development

1. Clone the repository:

```bash
git clone <repository-url>
cd todo-management
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

The application can be run using Docker for a consistent environment across different platforms.

1. Build the Docker image:

```bash
docker build -t todo-management .
```

2. Run the container:

```bash
docker run -p 3000:3000 todo-management
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

#### Docker Compose (Development)

For development with hot-reload, you can use Docker Compose:

1. Create a docker-compose.yml file:

```yaml
version: "3.8"
services:
  app:
    build:
      context: .
      target: deps
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev
```

2. Start the development environment:

```bash
docker-compose up
```

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Docker Configuration

The project includes a production-ready Dockerfile with the following features:

1. **Multi-stage Build**

   - Optimized for smaller production image size
   - Separate stages for dependencies, build, and runtime
   - Only necessary files are included in the final image

2. **Security Features**

   - Non-root user for running the application
   - Minimal base image (node:20-alpine)
   - Proper file permissions

3. **Production Optimizations**

   - Next.js standalone output
   - Telemetry disabled
   - Environment variables configured
   - Proper caching of layers

4. **Development Support**
   - Docker Compose configuration for development
   - Volume mounts for hot-reload
   - Preserved node_modules in container

### Verifying Docker Setup

To ensure your Docker setup is working correctly, you can use the provided test script:

```bash
# On Windows
.\docker-test.bat

# On Unix/Linux/Mac
# chmod +x docker-test.sh
# ./docker-test.sh
```

The test script will verify:

1. Docker installation
2. Docker Compose availability
3. Image building process
4. Production container functionality
5. Development environment setup
6. Application accessibility
7. Cleanup processes

#### Manual Verification Steps

If you prefer to verify manually:

1. **Check Docker Installation**:

```bash
docker --version
docker compose version
```

2. **Build the Image**:

```bash
docker build -t todo-management .
# Verify no errors in build output
docker images | grep todo-management
```

3. **Test Production Container**:

```bash
# Start container
docker run -d -p 3000:3000 --name todo-test todo-management

# Check container status
docker ps
docker logs todo-test

# Test application
curl http://localhost:3000

# Clean up
docker stop todo-test
docker rm todo-test
```

4. **Test Development Environment**:

```bash
# Start development environment
docker compose up -d

# Check logs
docker compose logs

# Test hot reload by making a change to a file

# Clean up
docker compose down
```

#### Common Issues and Solutions

1. **Port Conflicts**

   - Error: "port 3000 already in use"
   - Solution: Stop other services using port 3000 or change the port in docker-compose.yml

2. **Build Failures**

   - Check for sufficient disk space
   - Verify Docker has enough memory allocated
   - Check network connectivity for package downloads

3. **Container Not Starting**

   - Check logs: `docker logs todo-test`
   - Verify environment variables
   - Check for permission issues

4. **Hot Reload Not Working**
   - Verify volume mounts in docker-compose.yml
   - Check file watching limits on your system
   - Ensure development dependencies are installed

For any issues, check the container logs:

```bash
# Production container
docker logs todo-test

# Development environment
docker compose logs -f
```

## API Integration

The application uses JSONPlaceholder API for todo data:

- Base URL: `https://jsonplaceholder.typicode.com`
- Endpoints used:
  - GET `/todos`: Fetch todos list
  - GET `/todos/:id`: Fetch single todo
  - POST `/todos`: Create todo
  - PUT `/todos/:id`: Update todo
  - DELETE `/todos/:id`: Delete todo

## Additional Features

1. **Optimistic Updates**

   - Immediate UI feedback
   - Rollback on failure
   - Consistent error handling

2. **State Management**

   - Centralized store with Zustand
   - Predictable state updates
   - Type-safe actions

3. **Performance**
   - Server-side rendering
   - Client-side caching
   - Code splitting

## Future Improvements

Areas that could be enhanced with more time:

1. **Testing**
   Current test coverage includes:

   - Unit tests for server actions (CRUD operations)
   - Hook tests (useIsMobile, useInfiniteScroll)
   - Mock implementations for UI components

   Could be enhanced with:

   - E2E tests (Cypress)
   - Component integration tests
   - Performance testing
   - Visual regression testing
   - More UI component tests

2. **Features**

   - Todo categories/tags
   - Due dates
   - Priority levels
   - File attachments

3. **Authentication**
   - User authentication
   - Protected routes
   - User-specific todos
