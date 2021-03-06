import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    OriginFeature,
    Countries,
    IRECBusinessLegalStatusLabelsMap
} from '@energyweb/utils-general';
import { OriginConfigurationContext } from '..';
import { makeStyles, createStyles, useTheme, Paper, Grid, TextField, Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { getIRecClient } from '../../features/general/selectors';
import { getUserOffchain } from '../../features/users/selectors';
import { getOffChainDataSource, useTranslation } from '../..';
import { IRECOrganizationView } from './IRECOrganizationView';

interface IFormValues {
    name: string;
    address: string;
    businessType: string;
    city: string;
    zipCode: string;
    country: number;
    tradeRegistryCompanyNumber: string;
    vatNumber: string;
    signatoryAddress: string;
    signatoryCity: string;
    signatoryCountry: number;
    signatoryEmail: string;
    signatoryFullName: string;
    signatoryPhoneNumber: string;
    signatoryZipCode: string;
}

export function OrganizationView() {
    const userOffchain = useSelector(getUserOffchain);
    const organizationClient = useSelector(getOffChainDataSource)?.organizationClient;
    const params: { id?: string } = useParams();
    const { enabledFeatures } = useContext(OriginConfigurationContext);
    const [formValues, setFormValues] = useState<IFormValues>(null);
    const [iRecData, setIRecData] = useState(null);
    const iRecClient = useSelector(getIRecClient);
    const useStyles = makeStyles(() =>
        createStyles({
            container: {
                padding: '20px',
                marginBottom: '20px'
            }
        })
    );
    const { t } = useTranslation();
    const classes = useStyles(useTheme());

    const setBusinessType = (type) => {
        if (parseInt(type, 10)) {
            return IRECBusinessLegalStatusLabelsMap[type];
        } else {
            return type;
        }
    };

    const setValues = (organization) => {
        setFormValues({
            ...organization,
            businessType: setBusinessType(organization.businessType),
            country: Countries.find((c) => c.id === organization.country).name,
            signatoryCountry: Countries.find((c) => c.id === organization.signatoryCountry).name
        });
    };

    useEffect(() => {
        const getOrganization = async () => {
            const iRecOrg = await iRecClient.getRegistrations();
            const organization = params.id
                ? await organizationClient.getById(parseInt(params.id, 10))
                : userOffchain?.organization;
            if (organization) {
                setValues(organization);

                if (params.id) {
                    setIRecData(
                        iRecOrg?.filter(
                            (org) => parseInt(org.owner, 10) === parseInt(params.id, 10)
                        )[0]
                    );
                } else {
                    setIRecData(
                        iRecOrg?.filter((org) => parseInt(org.owner, 10) === organization.id)[0]
                    );
                }
            }
        };
        getOrganization();
    }, [params]);

    if (!formValues) {
        return <Skeleton variant="rect" height={200} />;
    }

    return (
        <>
            <Paper className={classes.container}>
                <Grid item>
                    <Box style={{ textTransform: 'uppercase' }}>{'Organization Information'}</Box>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField
                            label={t('organization.registration.organizationName')}
                            className="mt-3"
                            value={formValues.name}
                            fullWidth
                            disabled
                        />

                        <TextField
                            label={t('organization.registration.organizationAddress')}
                            className="mt-3"
                            value={formValues.address}
                            fullWidth
                            disabled
                        />

                        <TextField
                            label={t('organization.registration.businessType')}
                            className="mt-3"
                            value={formValues.businessType}
                            fullWidth
                            disabled
                        />

                        <TextField
                            label={t('organization.registration.tradeRegistryNumber')}
                            className="mt-3"
                            value={formValues.tradeRegistryCompanyNumber}
                            fullWidth
                            disabled
                        />

                        <TextField
                            label={t('organization.registration.vatNumber')}
                            value={formValues.vatNumber}
                            disabled
                            className="mt-3"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label={t('organization.registration.signatoryName')}
                            value={formValues.signatoryFullName}
                            disabled
                            className="mt-3"
                            fullWidth
                        />

                        <TextField
                            label={t('organization.registration.signatoryAddress')}
                            value={formValues.signatoryAddress}
                            disabled
                            className="mt-3"
                            fullWidth
                        />

                        <TextField
                            label={t('organization.registration.signatoryEmail')}
                            value={formValues.signatoryEmail}
                            disabled
                            className="mt-3"
                            fullWidth
                        />

                        <TextField
                            label={t('organization.registration.signatoryTelephone')}
                            value={formValues.signatoryPhoneNumber}
                            disabled
                            className="mt-3"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Paper>
            {enabledFeatures.includes(OriginFeature.IRec) && (
                <IRECOrganizationView iRecOrg={iRecData} />
            )}
        </>
    );
}
