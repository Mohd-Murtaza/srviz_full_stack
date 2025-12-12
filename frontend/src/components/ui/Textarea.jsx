const Textarea = ({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder,
    error,
    required = false,
    rows = 4,
    className = '',
    ...props 
  }) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  };
  
  export default Textarea;
  