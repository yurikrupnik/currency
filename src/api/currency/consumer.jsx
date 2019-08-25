// import React from 'react';
import PropTypes from 'prop-types';
// import Context from './context';
// import styles from './styles.scss';

const DefaultConsumer = (props) => { // not using it, using useContext
    const {
        render
    } = props;
    return render();
};

DefaultConsumer.defaultProps = {
    render: () => {},
    staticContext: undefined
};

DefaultConsumer.propTypes = {
    render: PropTypes.func
};

export default DefaultConsumer;
