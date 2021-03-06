/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import dotenv from 'dotenv';
import fs from 'fs';
import moment from 'moment-timezone';

import { IRECAPIClient } from '../src/IRECAPIClient';
import { ApproveIssue, Issue } from '../src/Issue';
import { Product } from '../src/Product';
import { Redemption, ReservationItem } from '../src/Transfer';

dotenv.config();

describe('IRECAPIClient tests', () => {
    let client: IRECAPIClient;

    const tradeAccount = 'ACCOUNTTRADE001';
    const issueAccount = 'ACCOUNTISSUE001';
    const redemptionAccount = 'ACCOUNTREDEMPTION001';

    before(async () => {
        client = new IRECAPIClient(process.env.IREC_API_URL);
        await client.login(
            process.env.IREC_API_LOGIN,
            process.env.IREC_API_PASSWORD,
            process.env.IREC_API_CLIENT_ID,
            process.env.IREC_API_CLIENT_SECRET
        );
    });

    it(`should fetch all accounts`, async () => {
        const [firstAccount] = await client.account.getAll();

        expect(firstAccount.details).to.exist;
        expect(firstAccount.type).to.exist;
    });

    it('should fetch account by code', async () => {
        const [firstAccount] = await client.account.getAll();
        const account = await client.account.get(firstAccount.code);

        expect(account.code).to.equal(firstAccount.code);
        expect(account.details).to.exist;
        expect(account.details.name).to.exist;
        expect(account.details.active).to.be.equal(true);
        expect(account.type).to.exist;
    });

    it('should fetch balance by code', async () => {
        const [firstAccount] = await client.account.getAll();
        const [accountBalance] = await client.account.getBalance(firstAccount.code);

        expect(accountBalance.code).to.equal(firstAccount.code);
        expect(accountBalance.product).to.be.instanceOf(Product);
    });

    it('should fetch items by code', async () => {
        const [accountItem] = await client.account.getItems(tradeAccount);

        expect(accountItem).to.exist;
        expect(accountItem.items).to.exist;
        expect(accountItem.code).to.be.equal(tradeAccount);

        const [item] = accountItem.items;

        expect(item.code).to.exist;
        expect(item.asset).to.exist;

        expect(item.asset.start).to.be.an.instanceOf(Date);
        expect(item.asset.end).to.be.an.instanceOf(Date);
    });

    it('should fetch transactions', async () => {
        const transactions = await client.account.getTransactions(tradeAccount);

        expect(transactions).to.exist;
    });

    it('should be able to request certificate', async () => {
        const [accountItem] = await client.account.getItems(tradeAccount);

        const [lastItem] = accountItem.items.sort(
            (a, b) => b.asset.end.getTime() - a.asset.end.getTime()
        );

        const request = new Issue();
        request.device = 'DEVICE001';
        request.recipient = tradeAccount;
        request.start = moment(lastItem.asset.end).add(1, 'day').toDate();
        request.end = moment(lastItem.asset.end).add(2, 'day').toDate();
        request.production = 100;
        request.fuel = 'ES200';

        const beforeTransactions = await client.account.getTransactions(tradeAccount);

        const code = await client.issue.create(request);

        await client.issue.submit(code, 'Note');
        await client.issue.verify(code, 'Note');

        const approval = new ApproveIssue();
        approval.issuer = issueAccount;

        await client.issue.approve(code, approval);

        const afterTransactions = await client.account.getTransactions(tradeAccount);

        expect(afterTransactions).to.has.lengthOf(beforeTransactions.length + 1);
    });

    it('should be able to redeem the certificate', async () => {
        const [account] = await client.account.getItems(tradeAccount);
        const [newestItem] = account.items;

        const reservationItem = new ReservationItem();
        reservationItem.code = newestItem.code;
        reservationItem.amount = 1;

        const redemption = new Redemption();
        redemption.items = [reservationItem];
        redemption.beneficiary = 1;
        redemption.start = new Date('2020-01-01');
        redemption.end = new Date('2020-02-01');
        redemption.purpose = 'Purpose';
        redemption.sender = tradeAccount;
        redemption.recipient = redemptionAccount;
        redemption.approver = process.env.IREC_API_LOGIN;

        await client.redeem(redemption);
    });

    it('should be able to upload pdf evidence file', async () => {
        const file = fs.createReadStream(`${__dirname}/file-sample_150kB.pdf`);

        const [fileId] = await client.file.upload([file]);

        expect(fileId).to.exist;

        const url = await client.file.download(fileId);

        expect(url).to.exist;
    });
});
