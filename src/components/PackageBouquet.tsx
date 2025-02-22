import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import { fetchBouquetPackageById, fetchPackageById, selectBouquetsByType } from '../redux/slices/packageSlice';
import { RootState } from '../redux/store';
import { useEffect } from 'react';

const PackageBouquet = () => {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(fetchPackageById(1)).then(() => {
            dispatch(fetchBouquetPackageById({ id: 1, type: 'live' }));
        });
    }, [dispatch]);
    
    const liveBouquets = useSelector((state: RootState) => selectBouquetsByType(state, 'live'));
    
    return (
        <div>
            {liveBouquets.length > 0 ? liveBouquets.map(bouquet => (
                <div key={bouquet.id}>
                    <h3>{bouquet.bouquet_name}</h3>
                </div>
            )) : <h1>Loading...</h1>}
        </div>
    )
}

export default PackageBouquet