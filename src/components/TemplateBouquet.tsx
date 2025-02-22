import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBouquetsByTemplateId, selectBouquetsByTemplateType } from '../redux/slices/templateSlice';

const TemplateBouquets = ({ id, type }: { id: number; type: string }) => {
    const dispatch = useAppDispatch();
    const bouquets = useAppSelector((state) => selectBouquetsByTemplateType(state, type));

    useEffect(() => {
        dispatch(fetchBouquetsByTemplateId({ id, type }));
    }, [dispatch, id, type]);

    return (
        <div>
            {bouquets.map((bouquet) => (
                <div key={bouquet.id}>
                    <h3>{bouquet.bouquet_name}</h3>
                    <p>Type: {bouquet.type}</p>
                </div>
            ))}
        </div>
    );
};

export default TemplateBouquets