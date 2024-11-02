import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

  constructor(){}

  public async registerUser( registerUerDto: RegisterUserDto) {

    const existUser = await UserModel.findOne({ email: registerUerDto.email });
    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      
      const user = new UserModel(registerUerDto);
      await user.save();

      //todo 1 Encriptar la contraseña

      //todo jwt <-- para mantener la autenticacion del usuario

      //todo Email de confirmación

      const {password, ...userEntity} = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: 'ABC'
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

    return 'todo ok!'
  }
}