import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Router from '../Router/index';

const Layout = ({ routes }) => (
    <Fragment> {/* eslint-disable-line */}
        <Router routes={routes} />
    </Fragment>
);

Layout.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Layout;
