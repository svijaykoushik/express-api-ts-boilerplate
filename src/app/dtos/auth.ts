import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    ValidateIf
} from 'class-validator';
import { Trim } from '../helpers/trimmer';
import { GrantTypes } from '../enums';

export class RegisterDTO {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Trim()
    email: string;

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    @Trim()
    password: string;
}

export class TokenDTO {
    @IsEnum(GrantTypes)
    @IsString()
    @IsNotEmpty()
    @Trim()
    grant_type: GrantTypes;

    @ValidateIf((o: TokenDTO) => o.grant_type === GrantTypes.Password)
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Trim()
    email: string;

    @ValidateIf((o: TokenDTO) => o.grant_type === GrantTypes.Password)
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Trim()
    password: string;

    @ValidateIf((o: TokenDTO) => o.grant_type === GrantTypes.RefreshToken)
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Trim()
    refresh_token: string;
}
