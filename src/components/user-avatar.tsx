import React from 'react';
import PropTypes from 'prop-types';

import StylesAvatar from '../styles/avatar.module.css';

type PropType = {
    token: number
}

const UserAvatar: React.FC<PropType> = ({ token }) => {
    return (
        <div className={StylesAvatar["user-wrapper"]}>
            <img className="avatar" alt={token.toString()} src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" />
        </div>);
};
UserAvatar.propTypes = {
    token: PropTypes.number.isRequired
};

export default UserAvatar;