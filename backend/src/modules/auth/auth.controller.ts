import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SuccessLoginDto } from './dto/success-login.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() data: AuthDto, @Res() res): Promise<SuccessLoginDto> {
    const tokens = await this.authService.login(data);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Successfully logged in' });
  }

  @Delete('logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('access_token', { httpOnly: true });
    res.clearCookie('refresh_token', { httpOnly: true });
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refresh(@Req() req, @Res() res): Promise<SuccessLoginDto> {
    const token = await this.authService.refresh(req.cookies.refresh_token);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000,
    });

    return res.json({ message: 'Successfully refreshed' });
  }
}
