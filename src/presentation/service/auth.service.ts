import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

  constructor(){}

  public async registerUser( registerUserDto: RegisterUserDto) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      
      const user = new UserModel(registerUserDto);
      
      //todo 1 Encriptar la contraseña
      user.password = bcryptAdapter.hash( registerUserDto.password );

      await user.save();

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
  }

  public async loginUser( loginUserDto: LoginUserDto) {

    // findone para verificar si existe
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest(`No user with email: ${loginUserDto.email}`);
    
    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if(!isMatching)  throw CustomError.badRequest('Password is not valid');
    
    const {password, ...userEntity} = UserEntity.fromObject(user);
    

    return {
      user: { ...userEntity },
      token: 'ABC'
    }
  }
}