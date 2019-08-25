import React from 'react';
import PropTypes from 'prop-types';
import styles from './todayRates.scss';

const TodaysRates = (props) => {
    const { base, data } = props;
    return (
        <div className={`col-lg-4 ${styles.root}`}>
            <div className={`row ${styles.header}`}>
                <div className="col-lg-9">
                    Todays rates
                </div>
                <div className="col-lg-3">
                    {1} {base} = {/*eslint-disable-line*/}
                </div>
            </div>
            <div className={styles.section}>
                {
                    data.map((rate) => (
                        <div className={`row ${styles.border}`} key={rate.value}>
                            <div className="col-lg-6">{rate.key}</div>
                            <div className={`col-lg-6 ${styles.right}`}>{rate.value}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

TodaysRates.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
    })).isRequired,
    base: PropTypes.string.isRequired
};

export default React.memo(TodaysRates);
