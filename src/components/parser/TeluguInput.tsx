type TeluguInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TeluguInput({ value, onChange }: TeluguInputProps) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type Telugu here..."
      />
    </div>
  );
}
