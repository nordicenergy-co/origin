import { PreciseProofs } from 'precise-proofs-js';

export interface IOwnershipCommitment {
    [address: string]: string;
}

export interface IOwnershipCommitmentProof {
    commitment: IOwnershipCommitment;
    rootHash: string;
    leafs: PreciseProofs.Leaf[];
    salts: string[];
}

export interface IOwnershipCommitmentProofWithTx extends IOwnershipCommitmentProof {
    txHash: string;
}
