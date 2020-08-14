import React from 'react';
import UsersList from "../components/UsersList";

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'Max',
            image: 'https://images.pexels.com/photos/1949698/pexels-photo-1949698.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
            places: 3
        }
    ];

    return <UsersList users={USERS}/>
};

export default Users;