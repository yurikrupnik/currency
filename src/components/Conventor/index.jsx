import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import reduce from 'lodash.reduce';
import { Context as CurrencyContext } from '../../api/currency';
import styles from './conventor.scss';

function compare(a, b) {
    if (a.value < b.value) {
        return -1;
    }
    if (a.value > b.value) {
        return 1;
    }
    return 0;
}

const Conventor = (props) => {
    const {
        fromInput, fromDropdown, toDropdown, setFromDropdown, setToDropdown
    } = props;
    const currency = React.useContext(CurrencyContext);
    const [result, setResult] = React.useState(0);
    const {
        getCurrency, todayRates, setTodayRates
    } = currency;

    React.useEffect(() => {
        getCurrency(fromDropdown.value, toDropdown.value)
            .then((res) => setResult(res.rates[toDropdown.value].toFixed(4)));
    }, [fromDropdown.value, toDropdown.value]);

    const options = React.useMemo(() => reduce(todayRates.rates, (acc, v, key) => acc.concat({
        value: key,
        label: key,
    }), []), [todayRates.rates]);

    React.useEffect(() => {
        setFromDropdown({ ...fromDropdown, options: options.sort(compare) });
        setToDropdown({
            ...toDropdown, options: options.filter((v) => v.value !== todayRates.base)
        });
    }, [options, todayRates.base, fromDropdown.value, toDropdown.value]);

    const handleChangeBaseCurrency = (event) => {
        const { value } = event.target;
        setFromDropdown({ ...fromDropdown, value });
        const index = todayRates.selected.defaultFilters.indexOf(value);
        if (index > -1) {
            todayRates.selected.filter = todayRates.selected.defaultFilters.map((v, i) => (i === index ? 'USD' : v));
        } else {
            todayRates.selected.filter = todayRates.selected.defaultFilters;
        }

        setTodayRates({
            ...todayRates,
            base: value,
            selected: {
                ...todayRates.selected,
                filter: todayRates.selected.filter
            }
        });
    };

    const handleChangeToCurrency = (event) => {
        const { value } = event.target;
        setToDropdown({ ...fromDropdown, value });
        if (value !== 'ILS') {
            todayRates.selected.filter = ['ILS', ...todayRates.selected.defaultFilters.slice(0, -1)];
        } else {
            todayRates.selected.filter = todayRates.selected.defaultFilters;
        }
        const data = reduce(todayRates.rates, (acc, v, key) => {
            const index = todayRates.selected.filter.indexOf(key);
            if (index > -1) {
                acc[index] = {
                    key,
                    value: Number(v.toFixed(4))
                };
            }
            return acc;
        }, []);


        setTodayRates({
            ...todayRates,
            selected: {
                ...todayRates.selected,
                filter: todayRates.selected.filter,
                data,
            }
        });
    };
    return (
        <div>
            <div className={`row ${styles.margin}`}>
                <div className="col-lg-4">
                    <TextField
                        type={fromInput.type}
                        name={fromInput.name}
                        defaultValue={fromInput.value}
                        onChange={fromInput.onChange}
                    />
                </div>
                <div className="col-lg-8">
                    <FormControl fullWidth>
                        <Select
                            onChange={handleChangeBaseCurrency}
                            name={fromDropdown.name}
                            value={fromDropdown.value}
                        >
                            {
                                fromDropdown.options.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={`row ${styles.margin}`}>
                <div className="col-lg-4">
                    <span className={styles.to}>To</span>
                    <div className={styles.padding}>
                        {
                            (result * fromInput.value).toFixed(4)
                        }
                    </div>
                </div>
                <div className="col-lg-8">
                    <FormControl fullWidth>
                        <Select
                            value={toDropdown.value}
                            onChange={handleChangeToCurrency}
                            name={toDropdown.name}
                        >
                            {
                                toDropdown.options.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className={styles.rates}>
                Your rate:
                <div className={styles.title}>
                    {todayRates.base} 1 = {toDropdown.value} {result} {/*eslint-disable-line*/}
                </div>
                <div>
                    Last updated {todayRates.date} {/*eslint-disable-line*/}
                </div>
            </div>
        </div>
    );
};

Conventor.propTypes = {
    fromInput: PropTypes.shape({
        value: PropTypes.number,
        type: PropTypes.string,
        name: PropTypes.string,
        onChange: PropTypes.func
    }).isRequired,
    toDropdown: PropTypes.shape({
        value: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        }))
    }).isRequired,
    fromDropdown: PropTypes.shape({
        value: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        }))
    }).isRequired,
    setFromDropdown: PropTypes.func.isRequired,
    setToDropdown: PropTypes.func.isRequired
};

export default React.memo(Conventor);
