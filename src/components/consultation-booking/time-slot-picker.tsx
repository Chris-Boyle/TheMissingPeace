import type { ConsultationSlot } from "@/lib/consultation-booking/types";

type TimeSlotPickerProps = {
  slots: ConsultationSlot[];
  selectedSlot: string | null;
  onSelect: (slotStart: string) => void;
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
};

export function TimeSlotPicker(props: TimeSlotPickerProps) {
  if (props.isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-[#d8c9b8] bg-[#fffaf5] px-5 py-8 text-sm text-[#7c6655]">
        Loading available consultation times...
      </div>
    );
  }

  if (props.error) {
    return (
      <div className="rounded-[1.75rem] border border-[#e6c9c0] bg-[#fff7f4] px-5 py-8 text-sm text-[#8a4e3f]">
        {props.error}
      </div>
    );
  }

  if (props.slots.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-[#d8c9b8] bg-[#fffaf5] px-5 py-8 text-sm text-[#7c6655]">
        {props.emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {props.slots.map((slot) => {
        const isSelected = props.selectedSlot === slot.startTime;

        return (
          <button
            key={slot.startTime}
            type="button"
            onClick={() => props.onSelect(slot.startTime)}
            className={`rounded-2xl border px-4 py-3 text-left text-base font-medium transition ${
              isSelected
                ? "border-[#7d5c3c] bg-[#7d5c3c] text-[#fffaf5]"
                : "border-[#dccfc1] bg-[#fffaf5] text-[#5d3e27] hover:border-[#c5ab94] hover:bg-[#f6eadc]"
            }`}
            aria-pressed={isSelected}
          >
            {slot.label}
          </button>
        );
      })}
    </div>
  );
}
