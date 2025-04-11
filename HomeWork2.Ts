
//1_Topshiriq

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();

//     const token = request.cookies?.auth_token;

//     if (!token) {
//       throw new UnauthorizedException('Token mavjud emas');
//     }

//     try {
     
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: process.env.JWT_SECRET || 'super-secret',
//       });

//       request['user'] = payload;
//       return true;
//     } catch (err) {
     
//       throw new UnauthorizedException('Yaroqsiz yoki muddati o‘tgan token');
//     }
//   }
// }

// //Qo‘shimcha: Guard'dan foydalanish

// Копировать
// Редактировать
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


//2_Topshiriq

// ✅ 1. roles.decorator.ts
// Bu dekorator orqali kerakli rollarni belgilaymiz:

// ts
// Копировать
// Редактировать

// import { SetMetadata } from '@nestjs/common';

// export const ROLES_KEY = 'roles';
// export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
// ✅ 2. roles.guard.ts
// ts
// Копировать
// Редактировать

// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorators/roles.decorator';
// import { Request } from 'express';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
   
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles || requiredRoles.length === 0) {
//       return true; 
//     }

//     const request = context.switchToHttp().getRequest<Request>();
//     const user = request['user'];

//     if (!user) {
//       throw new ForbiddenException('Foydalanuvchi aniqlanmadi');
//     }

//     const hasRole = requiredRoles.includes(user.role);
//     if (!hasRole) {
     
//       throw new ForbiddenException('Ushbu amal uchun ruxsat yo‘q');
//     }

//     return true;
//   }
// }
// ✅ 3. Foydalanish misoli
// ts
// Копировать
// Редактировать

// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '../auth/guards/auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

// @Controller('admin')
// @UseGuards(AuthGuard, RolesGuard)
// export class AdminController {
//   @Get('users')
//   @Roles('admin') 
//   findAllUsers() {
//     return 'Barcha foydalanuvchilar ro‘yxati';
//   }
// }



//3_Topshiriq

// ✅ 1. OwnerGuard yozamiz
// ts
// Копировать
// Редактировать

// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Request } from 'express';
// import { PostsService } from '../../posts/posts.service'; 

// @Injectable()
// export class OwnerGuard implements CanActivate {
//   constructor(private readonly postsService: PostsService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request: Request = context.switchToHttp().getRequest();
//     const user = request['user'];

   
//     const postId = parseInt(request.params['id'], 10);
//     if (isNaN(postId)) {
//       throw new ForbiddenException('Noto‘g‘ri post ID');
//     }

    
//     const post = await this.postsService.findOne(postId);
//     if (!post) {
//       throw new ForbiddenException('Post topilmadi');
//     }

    
//     if (post.authorId !== user.id) {
     
//       throw new ForbiddenException('Bu amalni bajarish uchun ruxsat yo‘q');
//     }

//     return true;
//   }
// }
// ✅ 2. PostsServiceda findOne() metodi
// ts
// Копировать
// Редактировать

// async findOne(id: number) {
//   return this.prisma.post.findUnique({
//     where: { id },
//     select: {
//       id: true,
//       title: true,
//       content: true,
//       authorId: true, 
//     },
//   });
// }
// ✅ 3. Guard'dan foydalanish
// ts
// Копировать
// Редактировать

// @UseGuards(AuthGuard)
// @Put(':id')
// @UseGuards(OwnerGuard)
// updatePost(@Param('id') id: string, @Body() body, @Req() req) {

// }

// @Delete(':id')
// @UseGuards(OwnerGuard)
// deletePost(@Param('id') id: string, @Req() req) {

// }
// 📝 Eslatma: Agar adminlar ham boshqa odamning postini o‘chira olishi kerak bo‘lsa, bu OwnerGuardni RolesGuard bilan kombinatsiyada ishlatish mumkin.