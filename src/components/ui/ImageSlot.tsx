type ImageSlotProps = {
  placeholder: string;
  className?: string;
};

export function ImageSlot({ placeholder, className = "" }: ImageSlotProps) {
  return (
    <div className={`slot ${className}`.trim()}>
      <span className="slot-label">{placeholder}</span>
    </div>
  );
}
