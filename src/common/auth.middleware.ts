/* eslint-disable prettier/prettier */
import { PrismaService } from './prisma.service';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers['authorization'] as string;
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });
      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
