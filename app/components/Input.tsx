function generateRandomId() {
  return Math.random().toString(32).slice(2);
}

type Props = {
  type: "text" | "email";
  id?: string;
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
};

export default function Input({
  type,
  id = generateRandomId(),
  name,
  label,
  placeholder,
  defaultValue = "",
  disabled = false,
  required = false,
  error = false,
  errorMessage = "Error. Please check this field again.",
}: Props) {
  return (
    <>
      <div>
        <label
          htmlFor={id}
          className="block text-left text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={type === "email" ? "email" : ""}
          required={required}
          disabled={disabled}
          defaultValue={defaultValue}
          aria-invalid={error}
          aria-describedby={`error-message-${id}`}
          placeholder={placeholder}
          className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
        />
        {error ? (
          <p
            className="form-validation-error"
            role="alert"
            id={`error-message-${id}`}
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    </>
  );
}
