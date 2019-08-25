import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import reduce from 'lodash.reduce';
import context from './context';

const handleDate = (date) => date.split('/').reverse().join('-');

const api = {
    provider: 'currency',
    url: 'https://api.exchangeratesapi.io',
    getRatesByBase(base = 'USD') {
        return axios.get(`${this.url}/latest?base=${base}`)
            .then((res) => res.data)
            .catch((err) => {
                console.log('err', err); // eslint-disable-line
            });
    },
    getCurrency(from = 'USD', to = 'ILS') {
        return axios.get(`${this.url}/latest?symbols=${from},${to}&base=${from}`)
            .then((res) => res.data)
            .catch((err) => {
                console.log('err', err); // eslint-disable-line
            });
    },
    getHistory(from = 'USD', to = 'ILS', startAt, endAt) {
        return axios.get(`${this.url}/history?symbols=${from},${to}&base=${from}&start_at=${handleDate(startAt)}&end_at=${handleDate(endAt)}`)
            .then((res) => res.data)
            .catch((err) => {
                console.log('err', err); // eslint-disable-line
            });
    },
};

const defaultFilters = [
    'EUR',
    'GBP',
    'CAD',
    'MXN',
    'JPY'
];

const CurrencyProvider = (props) => {
    const { children } = props;

    const [todayRates, setTodayRates] = React.useState({
        base: 'USD',
        rates: [],
        date: '',
        selected: {
            filter: defaultFilters,
            defaultFilters,
            data: []
        }
    });

    React.useEffect(() => {
        api.getRatesByBase(todayRates.base)
            .then((res) => {
                const data = reduce(res.rates, (acc, value, key) => {
                    // if in the filter array list
                    const index = todayRates.selected.filter.indexOf(key);
                    if (index > -1) {
                        acc[index] = {
                            key,
                            value: Number(value.toFixed(4))
                            // value
                        };
                    }
                    return acc;
                }, []);

                setTodayRates({
                    base: res.base,
                    date: res.date,
                    rates: res.rates,
                    selected: {
                        ...todayRates.selected,
                        filter: todayRates.selected.filter,
                        data
                    }
                });
            });
    }, [todayRates.base]);

    const getCurrency = React.useCallback((from, to) => api
        .getCurrency(from, to), []);
    const getHistory = React.useCallback((from, to, start, end) => api
        .getHistory(from, to, start, end), []);

    return (
        <context.Provider value={{
            getCurrency,
            todayRates,
            setTodayRates,
            getHistory
        }}
        >
            {children}
        </context.Provider>
    );
};

CurrencyProvider.propTypes = {
    children: PropTypes.element.isRequired
};

export default CurrencyProvider;
