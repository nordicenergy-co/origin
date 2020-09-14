import { ApiProperty } from '@nestjs/swagger';

export class TransferCertificateDTO {
    @ApiProperty()
    to: string;

    @ApiProperty()
    amount?: string;
}
