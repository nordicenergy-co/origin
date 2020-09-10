import { PreciseProofs } from 'precise-proofs-js';
import { IOwnershipCommitmentProof, IOwnershipCommitment } from '@energyweb/origin-backend-core';

export class PreciseProofUtils {
    static generateProofs(
        commitment: IOwnershipCommitment,
        salts?: string[]
    ): IOwnershipCommitmentProof {
        let leafs = salts
            ? PreciseProofs.createLeafs(commitment, salts)
            : PreciseProofs.createLeafs(commitment);

        leafs = PreciseProofs.sortLeafsByKey(leafs);

        const merkleTree = PreciseProofs.createMerkleTree(
            leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash)
        );

        return {
            commitment,
            rootHash: PreciseProofs.getRootHash(merkleTree),
            salts: leafs.map((leaf: PreciseProofs.Leaf) => leaf.salt),
            leafs
        };
    }
}
