// import * as cookieParser from 'cookie-parser';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.use(cookieParser());
//   await app.listen(3000);
// }
// bootstrap();

// 2
// //module.ts
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'super-secret',
//       signOptions: { expiresIn: '1d' },
//     }),
//     ...
//   ],
//   ...
// })
// export class AuthModule {}

// 3

// //guard.ts
// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const token = request.cookies['auth_token'];

//     if (!token) {
//       throw new UnauthorizedException('Token topilmadi');
//     }

//     try {
//       const payload = await this.jwtService.verifyAsync(token);
//       request['user'] = payload; // foydalanuvchini request obyektiga biriktirish
//       return true;
//     } catch (err) {
//       throw new UnauthorizedException('Yaroqsiz yoki muddati o‘tgan token');
//     }
//   }
// }

// 4
// //controller.ts
// import { Controller, Get, UseGuards, Req } from '@nestjs/common';
// import { AuthGuard } from './guards/auth.guard';
// import { Request } from 'express';

// @Controller('auth')
// export class AuthController {
//   @UseGuards(AuthGuard)
//   @Get('profile')
//   getProfile(@Req() req: Request) {
//     return req['user'];
//   }
// }


