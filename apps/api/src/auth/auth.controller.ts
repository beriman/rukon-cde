import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, GoogleSyncDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 per hour
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 per 15 mins
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() body: { userId: string; refreshToken: string }) {
        return this.authService.refresh(body.userId, body.refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Body() body: { userId: string }) {
        await this.authService.logout(body.userId);
        return { message: 'Logged out successfully' };
    }

    @Post('google-sync')
    @HttpCode(HttpStatus.OK)
    async googleSync(@Body() dto: GoogleSyncDto) {
        return this.authService.googleSync(dto);
    }
}
