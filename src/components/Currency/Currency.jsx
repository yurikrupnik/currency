import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Context as CurrencyContext } from '../../api/currency';
import HistoricalRates from './HistoricalRates';
import TodaysRates from './TodaysRates';
import Conventor from '../Conventor';

function TabPanel(props) {
    const {
        children, value, index
    } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.string,
        PropTypes.element
    ]).isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
};

const Currency = () => {
    const [tabValue, setValue] = React.useState(0);
    function handleChange(event, newValue) {
        setValue(newValue);
    }

    const currency = React.useContext(CurrencyContext);
    const {
        todayRates, getHistory
    } = currency;

    const [fromInput, setFormInput] = React.useState({
        value: 1000,
        type: 'number',
        name: 'amount',
        placeholder: 'placeholder...',
        onChange(event) {
            setFormInput({ ...fromInput, value: Number(event.target.value) });
        }
    });
    const [fromDropdown, setFromDropdown] = React.useState({
        name: 'from',
        type: 'select',
        value: todayRates.base,
        options: []
    });
    const [toDropdown, setToDropdown] = React.useState({
        name: 'to',
        type: 'select',
        value: 'ILS',
        options: []
    });

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8">
                    <Tabs value={tabValue} onChange={handleChange}>
                        <Tab label="Currency converter" />
                        <Tab label="Historical rates" />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <Conventor
                            fromInput={fromInput}
                            setToDropdown={setToDropdown}
                            setFromDropdown={setFromDropdown}
                            toDropdown={toDropdown}
                            fromDropdown={fromDropdown}
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <HistoricalRates
                            base={fromDropdown.value}
                            to={toDropdown.value}
                            getHistory={getHistory}
                        />
                    </TabPanel>
                </div>
                <TodaysRates
                    data={todayRates.selected.data}
                    base={todayRates.base}
                />
            </div>
        </div>
    );
};

export default Currency;
