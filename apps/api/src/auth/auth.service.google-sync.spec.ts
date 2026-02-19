import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/services/audit.service";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService - googleSync", () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let prismaService: Partial<PrismaService>;
  let auditService: Partial<AuditService>;
  let fetchSpy: jest.SpyInstance;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockResolvedValue({
          id: "new-user",
          email: "test@example.com",
          role: "USER",
          name: "Test",
        }),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue("mock-token"),
    };

    prismaService = {
      refreshToken: {
        create: jest.fn(),
      } as any,
    };

    auditService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prismaService },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Spy on global.fetch to prevent pollution
    fetchSpy = jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.GOOGLE_CLIENT_ID;
  });

  it("should throw UnauthorizedException if Google token is invalid", async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
    } as Response);

    await expect(
      service.googleSync({
        email: "test@example.com",
        name: "Test",
        accessToken: "invalid-token",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if email mismatches", async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ email: "other@example.com", email_verified: true }),
    } as Response);

    await expect(
      service.googleSync({
        email: "test@example.com",
        name: "Test",
        accessToken: "valid-token-wrong-email",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if email is not verified", async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ email: "test@example.com", email_verified: false }),
    } as Response);

    await expect(
      service.googleSync({
        email: "test@example.com",
        name: "Test",
        accessToken: "valid-token-not-verified",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if audience mismatch (when configured)", async () => {
    process.env.GOOGLE_CLIENT_ID = "my-client-id";

    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({
        email: "test@example.com",
        email_verified: true,
        aud: "wrong-client-id",
      }),
    } as Response);

    await expect(
      service.googleSync({
        email: "test@example.com",
        name: "Test",
        accessToken: "valid-token-wrong-aud",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should succeed if token is valid, email matches, and verified", async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ email: "test@example.com", email_verified: "true" }),
    } as Response);

    const result = await service.googleSync({
      email: "test@example.com",
      name: "Test",
      accessToken: "valid-token",
    });

    expect(result).toHaveProperty("access_token");
    expect(usersService.create).toHaveBeenCalled();
  });
});
