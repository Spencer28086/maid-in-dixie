type InputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
};

export default function Input({
    label,
    value,
    onChange,
    required = false,
}: InputProps) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-[#4b2e35]">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d95f91]"
            />
        </div>
    );
}