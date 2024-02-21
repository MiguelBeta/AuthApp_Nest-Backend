import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    ) { }



  async canActivate(context: ExecutionContext): Promise<boolean> {

    //Toma la info. de la solicitud de donde viene, el url
    const request = context.switchToHttp().getRequest();
    //Extraemos el token
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayLoad>(
        token,
        { //Ruta y semilla donde tenemos el token
          secret: process.env.JWT_SEED
        }
      );

      const user = await this.authService.findUserById( payload.id );
      if( !user ) throw new UnauthorizedException('User dos not exists');
      if( !user.isActive ) throw new UnauthorizedException('User dos not exists');


      request['user'] = user;


    } catch (error) {
      throw new UnauthorizedException();
    }


    console.log({ token });

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
