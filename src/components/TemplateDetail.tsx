import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchTemplateById, selectSelectedTemplate } from '../redux/slices/templateSlice';

export const TemplateDetail = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.packages);
    const selectedTemplate = useAppSelector(selectSelectedTemplate);

    useEffect(() => {
        dispatch(fetchTemplateById(1));
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!selectedTemplate) return <div>No template found</div>;

    return (
        <div>
            <h2>{selectedTemplate.name}</h2>
        </div>
    );
};