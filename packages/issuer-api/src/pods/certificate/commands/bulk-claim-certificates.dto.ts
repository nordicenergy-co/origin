import { IClaimData } from '@energyweb/issuer';
import { ApiProperty } from '@nestjs/swagger';

export class BulkClaimCertificatesDTO {
    @ApiProperty()
    claimData: IClaimData;
}
