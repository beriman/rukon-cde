# Coding Standards - Rukon CDE Platform

## TypeScript Standards

### Type Safety Rules

1. **Strict Mode Always**
   ```typescript
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "strictNullChecks": true,
       "noImplicitAny": true,
       "noImplicitReturns": true
     }
   }
   ```

2. **No `any` Type**
   - Use proper types atau `unknown` jika type tidak diketahui
   - Use type guards untuk narrow down `unknown`
   ```typescript
   // ❌ Bad
   const data: any = fetchData();
   
   // ✅ Good
   const data: UserData = fetchData();
   // OR
   const data: unknown = fetchData();
   if (isUserData(data)) {
     // type is narrowed to UserData
   }
   ```

3. **Prefer Interfaces for Objects**
   ```typescript
   // ✅ Preferred
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   // Use type for unions, intersections
   type Status = 'WIP' | 'SHARED' | 'PUBLISHED' | 'ARCHIVED';
   ```

### Naming Conventions

- **Files**: `kebab-case.ts` or `kebab-case.tsx`
- **Components**: `PascalCase.tsx` (React components)
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` (No `I` prefix)
- **Types**: `PascalCase`
- **Enums**: `PascalCase` for enum name, `UPPER_SNAKE_CASE` for values

```typescript
// ✅ Good
export const API_BASE_URL = 'https://api.rukon.id';

interface Project {
  id: string;
  name: string;
}

type ProjectStatus = 'ACTIVE' | 'ARCHIVED';

function fetchProjects(): Promise<Project[]> {
  // ...
}
```

## React/Next.js Standards

### Component Structure

1. **Server Components by Default**
   ```typescript
   // app/projects/page.tsx
   // This is a Server Component by default
   export default async function ProjectsPage() {
     const projects = await getProjects();
     return <ProjectList projects={projects} />;
   }
   ```

2. **Client Components Only When Needed**
   ```typescript
   'use client';
   
   import { useState } from 'react';
   
   export function InteractiveButton() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }
   ```

3. **Component Organization**
   ```typescript
   // ✅ Good structure
   import { type FC } from 'react';
   
   interface ProjectCardProps {
     project: Project;
     onSelect?: (id: string) => void;
   }
   
   export const ProjectCard: FC<ProjectCardProps> = ({ project, onSelect }) => {
     // Component logic
     
     return (
       // JSX
     );
   };
   ```

### Custom Hooks

- Prefix dengan `use`
- Single responsibility
- Return object untuk multiple values

```typescript
// ✅ Good
export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProject(projectId).then(setProject).finally(() => setLoading(false));
  }, [projectId]);
  
  return { project, loading };
}
```

### Error Handling

- Use Error Boundaries untuk component errors
- Use try-catch untuk async operations
- Display user-friendly error messages

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends Component {
  // Implementation
}

// In async functions
try {
  await uploadFile(file);
  toast.success('File uploaded successfully');
} catch (error) {
  toast.error(getErrorMessage(error));
  logError(error);
}
```

## Backend (NestJS) Standards

### Module Structure

```typescript
// projects/projects.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
```

### Controller Best Practices

```typescript
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  @Get()
  async findAll(@Query() query: FindProjectsDto): Promise<Project[]> {
    return this.projectsService.findAll(query);
  }
  
  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async create(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(dto);
  }
}
```

### Service Layer

- Business logic harus di service, bukan controller
- Use dependency injection
- Return domain entities, bukan database models

```typescript
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}
  
  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(dto);
    return this.projectsRepository.save(project);
  }
}
```

### DTO Validation

```typescript
// create-project.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
  
  @IsString()
  @MaxLength(1000)
  description?: string;
}
```

## Database Standards

### Naming Conventions

- **Tables**: `snake_case`, plural (`projects`, `file_versions`)
- **Columns**: `snake_case` (`created_at`, `updated_at`, `file_name`)
- **Foreign Keys**: `{referenced_table}_id` (`project_id`, `user_id`)
- **Indexes**: `idx_{table}_{column(s)}` (`idx_projects_organization_id`)
- **Constraints**: `{table}_{column}_unique` (`projects_name_unique`)

### Migrations

```sql
-- ✅ Good migration (reversible)
-- Up
ALTER TABLE projects ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';

-- Down
ALTER TABLE projects DROP COLUMN status;
```

**Rules**:
- Never modify existing migrations
- Always create new migration for changes
- Test rollback sebelum deploy
- Include both UP and DOWN migrations

### Query Optimization

- Index foreign keys
- Index frequently queried columns
- Use `SELECT` dengan specific columns, bukan `SELECT *`
- Use pagination untuk large datasets

```typescript
// ✅ Good
const projects = await this.projectsRepository.find({
  select: ['id', 'name', 'status'],
  where: { organizationId },
  take: 20,
  skip: offset,
});

// ❌ Bad
const projects = await this.projectsRepository.find();
```

## API Design Standards

### RESTful Endpoints

```
GET    /api/projects              - List all projects
POST   /api/projects              - Create new project
GET    /api/projects/:id          - Get single project
PUT    /api/projects/:id          - Update entire project
PATCH  /api/projects/:id          - Partial update
DELETE /api/projects/:id          - Delete project

GET    /api/projects/:id/files    - List files in project
POST   /api/projects/:id/files    - Upload file to project
```

### Response Format

```typescript
// Success Response
{
  "data": { /* resource or array */ },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error Response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Testing Standards

### Unit Tests

```typescript
describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();
    
    service = module.get(ProjectsService);
    repository = module.get(getRepositoryToken(Project));
  });
  
  it('should create a project', async () => {
    const dto = { name: 'Test Project' };
    jest.spyOn(repository, 'create').mockReturnValue(dto as any);
    jest.spyn(repository, 'save').mockResolvedValue({ id: '1', ...dto } as any);
    
    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
  });
});
```

### Integration Tests

```typescript
describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('/projects (POST)', () => {
    return request(app.getHttpServer())
      .post('/projects')
      .send({ name: 'Test Project' })
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('id');
      });
  });
});
```

## Code Quality

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## Git Commit Standards

### Conventional Commits

```
feat: add file upload functionality
fix: resolve versioning bug in CDE workflow
docs: update API documentation
refactor: simplify project service logic
test: add unit tests for file validation
chore: update dependencies
```

### Branch Naming

- `feature/epic-1-user-authentication`
- `bugfix/file-upload-timeout`
- `hotfix/security-vulnerability`
- `refactor/database-optimization`

## Performance Guidelines

1. **Avoid N+1 Queries**: Use eager loading atau joins
2. **Lazy Loading**: Load data only when needed
3. **Memoization**: Use `useMemo` dan `useCallback` untuk expensive computations
4. **Code Splitting**: Dynamic imports untuk large components
5. **Image Optimization**: Use Next.js `Image` component

```typescript
// ✅ Good - Memoization
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// ✅ Good - Code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

---

**Last Updated**: 2025-12-01  
**Applies to**: All Rukon CDE development
