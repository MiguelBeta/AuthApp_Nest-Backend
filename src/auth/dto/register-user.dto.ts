
import { IsEmail, IsString, MinLength } from "class-validator";



export class RegisterUserDto {

  //Informacion que se necesita para crear la BD
  //Hace referencia a que la propiedad luzca como un correo electronico para que lo acepte la BD
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  password: string;


}
