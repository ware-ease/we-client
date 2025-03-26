import { useState } from 'react';

function useFormData<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, value, checked, type } = target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => setFormData(initialState);

  return { formData, handleChange, resetForm, setFormData };
}

export default useFormData;
