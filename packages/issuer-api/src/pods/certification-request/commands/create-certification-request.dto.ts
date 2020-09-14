import { ApiProperty } from '@nestjs/swagger';

export class ICreateCertificationRequestDTO {
    @ApiProperty()
    to: string;

    @ApiProperty()
    energy: string;

    @ApiProperty()
    fromTime: number;

    @ApiProperty()
    toTime: number;

    @ApiProperty()
    deviceId: string;

    @ApiProperty()
    files?: string[];

    @ApiProperty()
    isPrivate: boolean;
}
