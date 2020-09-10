import * as Winston from 'winston';

import { IOffChainDataSource } from '@energyweb/origin-backend-core';
import { IDeviceTypeService } from './DeviceTypeService';

export interface Entity<TRegistry = any, TIssuer = any> {
    logger: Winston.Logger;
    deviceTypeService?: IDeviceTypeService;
    offChainDataSource?: IOffChainDataSource;
}
