import React, { useState, useEffect } from 'react';
import { Market } from './Market';
import { EnergyFormatter, moment, useTranslation } from '../../utils';
import { Orders } from './Orders';
import { Grid } from '@material-ui/core';
import { getUserOffchain } from '../../features/users/selectors';
import { getExchangeClient, getCountry } from '../../features/general/selectors';
import { useSelector } from 'react-redux';

import { TOrderBook } from '../../utils/exchange';

interface IProps {
    currency: string;
}

export function Exchange(props: IProps) {
    const { currency } = props;

    const userOffchain = useSelector(getUserOffchain);
    const exchangeClient = useSelector(getExchangeClient);
    const country = useSelector(getCountry);
    const { t } = useTranslation();

    const [data, setData] = useState<TOrderBook>({
        asks: [],
        bids: []
    });
    const [deviceType, setDeviceType] = useState<string[]>([]);
    const [location, setLocation] = useState<string[]>([]);

    const fetchData = async () => {
        setData(await exchangeClient.search(deviceType, location));
    };

    useEffect(() => {
        fetchData();
    }, [deviceType, location]);

    return (
        <div>
            <Market
                onBid={async values => {
                    await exchangeClient.createBid({
                        price: parseFloat(values.price) * 100,
                        product: {
                            deviceType:
                                values.deviceType?.length > 0 ? values.deviceType : undefined,
                            location: values.location?.length > 0 ? values.location : undefined
                        },
                        validFrom: moment().toISOString(),
                        volume: EnergyFormatter.getBaseValueFromValueInDisplayUnit(
                            parseFloat(values.energy)
                        ).toString()
                    });

                    await fetchData();
                }}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onNotify={() => {}}
                onChange={values => {
                    setDeviceType(values.deviceType);
                    setLocation(values.location.map(l => `${country};${l}`));
                }}
                energyUnit={EnergyFormatter.displayUnit}
                currency={currency}
            />
            <br />
            <br />
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Orders
                        data={data.asks}
                        currency={currency}
                        title={t('exchange.info.asks')}
                        highlightOrdersUserId={userOffchain?.id?.toString()}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Orders
                        data={data.bids}
                        currency={currency}
                        title={t('exchange.info.bids')}
                        highlightOrdersUserId={userOffchain?.id?.toString()}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
