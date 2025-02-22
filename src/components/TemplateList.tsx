import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchTemplates, selectTemplates } from '../redux/slices/templateSlice';

const TemplatesList = () => {
    const dispatch = useAppDispatch();
    const templates = useAppSelector(selectTemplates);

    useEffect(() => {
        dispatch(fetchTemplates());
    }, [dispatch]);

    return (
        <div>
            {templates.map((template) => (
                <div key={template.id}>
                    <h3>{template.name}</h3>
                    <p>Global: {template.is_global ? 'Yes' : 'No'}</p>
                </div>
            ))}
        </div>
    );
};

export default TemplatesList