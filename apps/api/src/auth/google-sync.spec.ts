import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/services/audit.service";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService - Google Sync", () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let prismaService: Partial<PrismaService>;
  let auditService: Partial<AuditService>;

  beforeEach(async () => {
    // Mock dependencies
    usersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw UnauthorizedException if accessToken is missing", async () => {
    const dto = { email: "test@example.com", name: "Test User" };
    // Currently this test fails because the code doesn't check for accessToken yet
    await expect(service.googleSync(dto as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should throw UnauthorizedException if Google token verification fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "invalid_token" }),
    } as Response);

    const dto = {
      email: "test@example.com",
      name: "Test User",
      accessToken: "invalid-token",
    };
    await expect(service.googleSync(dto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should throw UnauthorizedException if email verified is false", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        email: "test@example.com",
        email_verified: "false",
      }),
    } as Response);

    const dto = {
      email: "test@example.com",
      name: "Test User",
      accessToken: "valid-token-unverified-email",
    };
    await expect(service.googleSync(dto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should succeed if Google token is valid and verified", async () => {
    const email = "verified@example.com";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email, email_verified: "true" }),
    } as Response);

    (usersService.findOneByEmail as jest.Mock).mockResolvedValue({
      id: "user-id",
      email,
      name: "Verified User",
      role: "USER",
    });

    const dto = { email, name: "Verified User", accessToken: "valid-token" };
    const result = await service.googleSync(dto);

    expect(result).toBeDefined();
    expect(result.user.email).toBe(email);
    expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
  });
});
