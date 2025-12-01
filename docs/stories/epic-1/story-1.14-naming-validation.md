# Story 1.14: File Naming Convention Validation

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.14`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 3 (Weeks 5-6)

## User Story

**As a** user uploading files, **I want** system to validate file naming convention sesuai ISO 19650, **so that** semua files memiliki naming yang consistent dan standardized.

## Acceptance Criteria

- [ ] System validate file name format: `Project-Originator-Volume-Level-Type-Role-Number`
- [ ] Clear error message jika format salah, dengan contoh yang benar
- [ ] **UI Requirement**: Error message harus visual (misal: highlight bagian nama yang salah)
- [ ] **UI Requirement**: Show "Expected Format" vs "Your Filename" comparison
- [ ] Auto-suggest naming based on project context (optional di frontend)
- [ ] validation dapat di-configure per project (strict vs lenient mode)
- [ ] Naming pattern documented dan accessible ke users

### Naming Format Example
```
MRT3-ARC-A-01-DR-A-001.pdf

MRT3      = Project code
ARC       = Originator (Architecture)
A         = Volume/Zone (Zone A)
01        = Level (Ground Floor)
DR        = Type (Drawing)
A         = Role/Discipline (Architecture)
001       = Sequential number
```

## Technical Tasks

- [ ] Create `NamingConventionService`
- [ ] Implement regex validator untuk naming pattern
- [ ] Extract `uniqueId` dari filename (tanpa extension & version suffix)
- [ ] Add validation pipe di file upload endpoint
- [ ] Create frontend helper untuk naming suggestion
- [ ] Document naming convention di user guide
- [ ] Write comprehensive unit tests untuk edge cases

## Implementation

```typescript
// naming-convention.service.ts
export class NamingConventionService {
  private readonly pattern = /^([A-Z0-9]+)-([A-Z]+)-([A-Z0-9]+)-([A-Z0-9]+)-([A-Z]+)-([A-Z])-(\d+)$/;
  
  validate(fileName: string): ValidationResult {
    // Remove extension and version suffix (e.g., _V2.pdf)
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const baseName = nameWithoutExt.replace(/_V\d+$/, '');
    
    const match = baseName.match(this.pattern);
    
    if (!match) {
      return {
        isValid: false,
        error: 'Invalid naming format',
        expected: 'PROJECT-ORIGINATOR-VOLUME-LEVEL-TYPE-ROLE-NUMBER',
        example: 'MRT3-ARC-A-01-DR-A-001.pdf',
      };
    }
    
    const [, project, originator, volume, level, type, role, number] = match;
    
    return {
      isValid: true,
      uniqueId: baseName,
      components: {
        project,
        originator,
        volume,
        level,
        type,
        role,
        number,
      },
    };
  }
  
  suggest(context: ProjectContext): string {
    return `${context.projectCode}-${context.discipline}-${context.zone}-${context.level}-DR-A-001`;
  }
}
```

## API Integration

```typescript
// In files.controller.ts
@Post('files')
async uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: UploadFileDto
) {
  // Validate naming
  const validation = this.namingService.validate(file.originalname);
  
  if (!validation.isValid) {
    throw new BadRequestException({
      message: 'Invalid file naming convention',
      details: validation.error,
      expected: validation.expected,
      example: validation.example,
    });
  }
  
  return this.filesService.upload(file, validation.uniqueId);
}
```

## Testing

```typescript
describe('NamingConventionService', () => {
  it('should validate correct naming format', () => {
    const result = service.validate('MRT3-ARC-A-01-DR-A-001.pdf');
    expect(result.isValid).toBe(true);
    expect(result.uniqueId).toBe('MRT3-ARC-A-01-DR-A-001');
  });
  
  it('should handle versioned files', () => {
    const result = service.validate('MRT3-ARC-A-01-DR-A-001_V2.pdf');
    expect(result.isValid).toBe(true);
    expect(result.uniqueId).toBe('MRT3-ARC-A-01-DR-A-001');
  });
  
  it('should reject invalid format', () => {
    const result = service.validate('random-file-name.pdf');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## Dependencies
- **Depends on**: Story 1.13 (File Upload)

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
