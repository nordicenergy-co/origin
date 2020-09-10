import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { AdminModule } from './pods/admin/admin.module';
import { Configuration } from './pods/configuration/configuration.entity';
import { ConfigurationModule } from './pods/configuration/configuration.module';
import { Device } from './pods/device/device.entity';
import { DeviceModule } from './pods/device/device.module';
import { EmailConfirmation } from './pods/email-confirmation/email-confirmation.entity';
import { EmailConfirmationModule } from './pods/email-confirmation/email-confirmation.module';
import { File } from './pods/file/file.entity';
import { FileModule } from './pods/file/file.module';
import { OrganizationInvitation } from './pods/organization/organization-invitation.entity';
import { Organization } from './pods/organization/organization.entity';
import { OrganizationModule } from './pods/organization/organization.module';
import { User } from './pods/user/user.entity';
import { UserModule } from './pods/user/user.module';

export { AppModule } from './app.module';
export { ExtendedBaseEntity } from './pods/ExtendedBaseEntity';
export { ConfigurationService } from './pods/configuration/configuration.service';
export { DeviceService } from './pods/device/device.service';

export const entities = [
    Device,
    Configuration,
    Organization,
    User,
    OrganizationInvitation,
    EmailConfirmation,
    File
];

export const modules = [
    AuthModule,
    AdminModule,
    ConfigurationModule,
    DeviceModule,
    FileModule,
    OrganizationModule,
    UserModule,
    EmailConfirmationModule
];

export const providers = [{ provide: APP_PIPE, useClass: ValidationPipe }];
