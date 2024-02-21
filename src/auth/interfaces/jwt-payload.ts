

export interface JwtPayLoad{

  id: string;

  //Fecha creacion
  iat?: number;

  //fecha expiracion del token
  exp?: number;

}
