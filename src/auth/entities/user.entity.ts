import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

//El @Schema se usa para decirle a mongo como debe "lucir"
@Schema()
export class User {

  _id?: string;

  //Se define como quiere que se ven los usuarios
  //Propiedad unica y es requerido
  @Prop({ unique: true, require: true })
  email: string;

  @Prop({ require: true })
  name: string;

  @Prop({ require: true  })
  password?: string;

  @Prop({ default: true })
  isActive: boolean;

  //Se define de tipo String y se pone uno por defecto
  @Prop({ type: [String], default: ['user'] })
  roles: string[];

}

//Se proporciona el esquema para que la BD pueda recibirlo y crear la definicion en la BD
//Para poder ser utilizada

export const UserSchema = SchemaFactory.createForClass( User );
