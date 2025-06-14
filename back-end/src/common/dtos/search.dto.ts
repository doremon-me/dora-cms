import { IsOptional, IsString, IsNumberString, IsArray, ValidateIf, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsNumberString()
    @IsOptional()
    page?: string;

    @IsNumberString()
    @IsOptional()
    limit?: string;

    @IsString()
    @IsOptional()
    sort?: 'asc' | 'desc';

    @IsString()
    @IsOptional()
    sortBy?: string;
}


export class SearchResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}