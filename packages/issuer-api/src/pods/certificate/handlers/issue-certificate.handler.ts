import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Certificate as CertificateFacade,
    IOwnershipCommitmentProofWithTx
} from '@energyweb/issuer';
import { BigNumber } from 'ethers';
import { IssueCertificateCommand } from '../commands/issue-certificate.command';
import { Certificate } from '../certificate.entity';
import { BlockchainPropertiesService } from '../../blockchain/blockchain-properties.service';

@CommandHandler(IssueCertificateCommand)
export class IssueCertificateHandler implements ICommandHandler<IssueCertificateCommand> {
    constructor(
        @InjectRepository(Certificate)
        private readonly repository: Repository<Certificate>,
        private readonly blockchainPropertiesService: BlockchainPropertiesService
    ) {}

    async execute(command: IssueCertificateCommand): Promise<Certificate> {
        const { to, energy, fromTime, toTime, deviceId, isPrivate } = command;

        const blockchainProperties = await this.blockchainPropertiesService.get();

        let cert: CertificateFacade;
        let commitment: IOwnershipCommitmentProofWithTx;

        if (!isPrivate) {
            cert = await CertificateFacade.create(
                to,
                BigNumber.from(energy),
                fromTime,
                toTime,
                deviceId,
                blockchainProperties.wrap()
            );
        } else {
            ({ certificate: cert, proof: commitment } = await CertificateFacade.createPrivate(
                to,
                BigNumber.from(energy),
                fromTime,
                toTime,
                deviceId,
                blockchainProperties.wrap()
            ));
        }

        const certificate = this.repository.create({
            blockchain: blockchainProperties,
            tokenId: cert.id,
            deviceId: cert.deviceId,
            generationStartTime: cert.generationStartTime,
            generationEndTime: cert.generationEndTime,
            creationTime: cert.creationTime,
            creationBlockHash: cert.creationBlockHash,
            owners: cert.owners,
            issuedPrivately: isPrivate ?? false,
            latestCommitment: isPrivate ? commitment : null
        });

        return this.repository.save(certificate);
    }
}
