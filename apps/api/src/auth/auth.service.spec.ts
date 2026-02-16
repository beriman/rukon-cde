import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/services/audit.service";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let prismaService: any;
  let auditService: Partial<AuditService>;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue("token"),
    };
    prismaService = {
      refreshToken: {
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      user: {
        update: jest.fn(),
      },
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

    // Mock global fetch
    global.fetch = jest.fn();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("googleSync", () => {
    const dto = {
      email: "test@example.com",
      name: "Test User",
      accessToken: "valid-token",
    };

    it("should verify google token and login existing user", async () => {
      // Mock Google Response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ email: dto.email }),
      });

      // Mock User Exists
      const user = { id: "1", email: dto.email, role: "USER", isActive: true };
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);

      const result = await service.googleSync(dto);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(dto.accessToken),
      );
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(dto.email);
      expect(result.access_token).toBe("token");
    });

    it("should throw UnauthorizedException if google token is invalid", async () => {
      // Mock Google Response Error
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        text: async () => "Invalid Token",
      });

      await expect(service.googleSync(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException if email mismatches", async () => {
      // Mock Google Response with Different Email
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ email: "other@example.com" }),
      });

      await expect(service.googleSync(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
