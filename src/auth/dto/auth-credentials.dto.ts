import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4, { message: 'UsernameTooShort' })
  @MaxLength(20, { message: 'UsernameTooLong' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'PasswordTooShort' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])^[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
    { message: 'PasswordValidationError' },
  )
  password: string;
}
