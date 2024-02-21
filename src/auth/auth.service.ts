import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto,RegisterUserDto, LoginDto, UpdateAuthDto} from './dto';
import { JwtPayLoad } from './interfaces/jwt-payload';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor( @InjectModel(User.name)
  private userModel: Model<User>,
  private jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {

    try {

      const { password, ...userData } = createUserDto;
      // 1-Encriptar la contraseña
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });


      // 2-Guardar el usuario en la BD
      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();

      return user;


      // 3-Generar el Json Web Tokens (llave de acceso)

    } catch (error) {
      //1100 error de argumentos: ya existe
      if ( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already axists!`)
      }
      throw new InternalServerErrorException('Something terrible happen!!!');
    }
  }


  async register( registertDto: RegisterUserDto ): Promise<LoginResponse>{

    //Creamos el usuario
    const user = await this.create( registertDto );
    console.log({user});

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }


  async login( loginDto: LoginDto ): Promise<LoginResponse> {

    const { email, password } = loginDto;

    //se asigna el email al usuario y se pregunta si existe
    const user = await this.userModel.findOne({ email });
    if( !user ){
      throw new UnauthorizedException('Not valid credentials - email');
    }

    //Desencripto la contraseña y verifico que sea la misma que tiene almacenada en BD
    if( !bcryptjs.compareSync( password, user.password ) ){
      throw new UnauthorizedException('Not valid credentials - password ');
    }

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }

  }


  findAll(): Promise<User[]> {
    //Retorna todos los usuarios
    return this.userModel.find();
  }

  async findUserById( id: string ){
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayLoad ){
    //generamos el token
    const token = this.jwtService.sign( payload );
    return token;
  }




}
