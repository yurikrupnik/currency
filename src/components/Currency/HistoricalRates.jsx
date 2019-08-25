import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';

const months = {
    0: 1,
    1: 3,
    2: 6,
    3: 12,
};

const HistoricalRates = (props) => {
    const [data, setData] = React.useState({});
    const { base, to } = props;
    const [tabValue, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);

        const mont = months[newValue];

        const d = new Date();
        d.setMonth(d.getMonth() - mont);

        const from = new Date().toLocaleDateString('en-GB');
        const da = d.toLocaleDateString('en-GB');

        props.getHistory(base, to, da, from)
            .then((res) => {
                setData(res.rates);
            });
    }

    React.useEffect(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        props.getHistory(base, to,
            d.toLocaleDateString('en-GB'),
            new Date().toLocaleDateString('en-GB'))
            .then((res) => {
                setData(res.rates);
            });
    }, [base, to]);

    const options = {
        title: {
            text: `${base} vs ${to}`
        },
        xAxis: {
            categories: Object.keys(data),
        },
        series: [{
            type: 'area',
            data: Object.values(data).map((value) => value[to])
        }]
    };
    return (
        <div>
            <Tabs value={tabValue} onChange={handleChange}>
                <Tab label="Last month" />
                <Tab label="Last 3 months" />
                <Tab label="Last 6 months" />
                <Tab label="Last 12 months" />
            </Tabs>
            <HighchartsReact
                options={options}
            />
        </div>
    );
};

HistoricalRates.propTypes = {
    getHistory: PropTypes.func.isRequired,
    base: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default React.memo(HistoricalRates);
