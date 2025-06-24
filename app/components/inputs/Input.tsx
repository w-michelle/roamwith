import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: any;
}

const Input: React.FC<InputProps<any>> = ({
  id,
  label,
  type = "text",
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    <div className="w-full relative">
      <input
        {...register(id, { required })}
        type={type}
        id={id}
        disabled={disabled}
        placeholder=" "
        className={`peer w-full border-2 p-4 pt-6 font-light bg-white rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${errors[id] ? "border-rose-500" : "border-neutral-300"} 
        ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}`}
      />
      <label
        className={`absolute top-5 left-4 origin-[0] text-md duration-500 transform -translate-y-3 z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
        ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>

      {errors[id] && <p className="mt-4 text-red-400">{errors[id]?.message}</p>}
    </div>
  );
};

export default Input;
