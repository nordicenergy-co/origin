import { ExtendedBaseEntity } from '@energyweb/origin-backend';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { IsBoolean, IsInt } from 'class-validator';
import { CertificateUtils, IClaim } from '@energyweb/issuer';
import { IOwnershipCommitmentProof } from '@energyweb/origin-backend-core';
import { BlockchainProperties } from '../blockchain/blockchain-properties.entity';

export interface ICertificate {
    blockchain: BlockchainProperties;
    tokenId: number;
    deviceId: string;
    generationStartTime: number;
    generationEndTime: number;
    creationTime: number;
    creationBlockHash: string;
}

@Entity()
@Unique(['tokenId'])
export class Certificate extends ExtendedBaseEntity implements ICertificate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => BlockchainProperties)
    blockchain: BlockchainProperties;

    @Column()
    tokenId: number;

    @Column()
    deviceId: string;

    @Column()
    @IsInt()
    generationStartTime: number;

    @Column()
    @IsInt()
    generationEndTime: number;

    @Column()
    @IsInt()
    creationTime: number;

    @Column()
    creationBlockHash: string;

    @Column('simple-json')
    owners: CertificateUtils.IShareInCertificate;

    @Column('simple-json', { nullable: true })
    claimers: CertificateUtils.IShareInCertificate;

    @Column('simple-json', { nullable: true })
    claims: IClaim[];

    /* PRIVATE CERTIFICATES ONLY */

    @Column('simple-json', { nullable: true })
    latestCommitment: IOwnershipCommitmentProof;

    @Column()
    @IsBoolean()
    issuedPrivately: boolean;
}
