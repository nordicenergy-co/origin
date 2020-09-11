import { RequestClient } from '@energyweb/origin-backend-client';
import {
    IOffChainDataSource,
    IConfigurationClient,
    IUserClient,
    IDeviceClient,
    IOrganizationClient,
    IRequestClient,
    IFilesClient,
    IAdminClient
} from '@energyweb/origin-backend-core';

import { ConfigurationClientMock } from './ConfigurationClientMock';
import { UserClientMock } from './UserClientMock';
import { DeviceClientMock } from './DeviceClientMock';
import { OrganizationClientMock } from './OrganizationClientMock';

export class OffChainDataSourceMock implements IOffChainDataSource {
    dataApiUrl: string;

    configurationClient: IConfigurationClient = new ConfigurationClientMock();

    userClient: IUserClient = new UserClientMock();

    deviceClient: IDeviceClient = new DeviceClientMock();

    organizationClient: IOrganizationClient = new OrganizationClientMock();

    requestClient: IRequestClient = new RequestClient();

    filesClient: IFilesClient;

    adminClient: IAdminClient;
}
