import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      updateRole: jest.fn().mockResolvedValue({ id: '1', role: 'SUPER_ADMIN' }),
      deactivate: jest.fn().mockResolvedValue({ id: '1', isActive: false }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('updateRole', () => {
    it('should throw ForbiddenException if user is not SUPER_ADMIN', async () => {
        const nonAdminUser = { id: 'user-1', role: 'USER' };

        // We cast to any because we are going to modify the controller signature
        // In the current state, this test might fail to compile or run if we try to pass 3 arguments
        // but the current implementation only takes 2.
        // However, we want to prove the vulnerability OR prove the fix.

        // Vulnerability check:
        // Current signature: updateRole(id, body)
        // It succeeds.

        // If we want to test the fix, we need to anticipate the new signature: updateRole(id, body, user)

        try {
             // @ts-ignore
            await controller.updateRole('target-id', { role: 'SUPER_ADMIN' }, nonAdminUser);
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenException);
            return;
        }

        // If we reach here, it means no error was thrown, or the wrong error.
        // In the current code (vulnerability), no error is thrown (it mocks success), so this fails.
        throw new Error('Should have thrown ForbiddenException');
    });
  });

  describe('deactivate', () => {
      it('should throw ForbiddenException if user is not SUPER_ADMIN', async () => {
          const nonAdminUser = { id: 'user-1', role: 'USER' };

          try {
              // @ts-ignore
              await controller.deactivate('target-id', nonAdminUser);
          } catch (error) {
              expect(error).toBeInstanceOf(ForbiddenException);
              return;
          }

          throw new Error('Should have thrown ForbiddenException');
      });
  });
});
