import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchUserData } from './redux/slices/authSlice';

export const Demo = () => {
    const dispatch = useAppDispatch();
    const { user, permissions } = useAppSelector(state => state.auth);
    
    dispatch(fetchUserData());

    const username = user?.username;
    const hasPermission = permissions.includes('users_show');
    
    return (
        <div>
            <h1>Bienvenue {username}</h1>
            {hasPermission && (
                <div>Dashboard Content</div>
            )}
            <p>Crédit disponible: {user?.credit}</p>
        </div>
    );
};