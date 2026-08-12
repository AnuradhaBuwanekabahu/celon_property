import { FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function ToggleSwitch({ checked, onChange }) {
    return checked ? (
        <FaToggleOn
            className="text-4xl text-green-600 cursor-pointer"
            onClick={() => onChange(false)}
        />
    ) : (
        <FaToggleOff
            className="text-4xl text-gray-400 cursor-pointer"
            onClick={() => onChange(true)}
        />
    );
}
