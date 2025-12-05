import { useState } from 'react';

const CustomNumberInput = ({ value, onChange, min = 1, ...props }) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (parseInt(newValue) >= min)) {
      setInternalValue(newValue);
      onChange(newValue === '' ? '' : parseInt(newValue));
    }
  };

  return (
    <input
      type="tel"
      value={internalValue}
      onChange={handleChange}
      {...props}
    />
  );
};

export default CustomNumberInput; 