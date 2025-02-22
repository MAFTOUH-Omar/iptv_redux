import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPackages, selectPackages } from '../redux/slices/packageSlice';

export const PackageList = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.packages);
    const packages = useAppSelector(selectPackages);

    // Memoized derived data
    // const trialPackages = useAppSelector(selectTrialPackages);
    const sortedPackages = useMemo(() => {
        return [...packages].sort((a, b) => b.credit - a.credit);
    }, [packages]);

    useEffect(() => {
        dispatch(fetchPackages());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>All Packages</h2>
            <table border={2}>
                <tr>
                    <th>Package Name</th>
                    <th>Credit</th>
                    <th>Period</th>
                </tr>
                {sortedPackages.map(pkg => (
                    <tr key={pkg.id}>
                        <td>{pkg.name}</td>
                        <td>{pkg.credit}</td>
                        <td>{pkg.period} {pkg.period_type}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};