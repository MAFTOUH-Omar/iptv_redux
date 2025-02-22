import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPackageById, selectSelectedPackage } from '../redux/slices/packageSlice';

interface PackageDetailProps {
    id: number;
}

export const PackageDetail = ({ id }: PackageDetailProps) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.packages);
    const selectedPackage = useAppSelector(selectSelectedPackage);

    useEffect(() => {
        dispatch(fetchPackageById(id));
    }, [dispatch, id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!selectedPackage) return <div>No package found</div>;

    return (
        <div>
            <h2>{selectedPackage.name}</h2>
            <p>Credit: {selectedPackage.credit}</p>
            <p>Period: {selectedPackage.period} {selectedPackage.period_type}</p>
            <p>Max Connections: {selectedPackage.max_connections}</p>
            {selectedPackage.is_trial && <p>Trial Package</p>}
        </div>
    );
};