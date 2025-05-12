import { useState } from 'react';

function useFormData<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    console.log('handleChange:', { name, value, type, checked }); // Debug log
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      };
      return updatedData;
    });
  };

  const resetForm = () => {
    console.log('Resetting form to:', initialState); // Debug log
    setFormData(initialState);
  };

  return { formData, handleChange, resetForm, setFormData };
}

export default useFormData;
