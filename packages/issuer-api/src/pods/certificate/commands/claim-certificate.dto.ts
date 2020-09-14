import { IClaimData } from '@energyweb/issuer';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimCertificateDTO {
    @ApiProperty()
    certificateIds: number[];

    @ApiProperty()
    claimData: IClaimData;

    @ApiProperty()
    amount?: string;
}
