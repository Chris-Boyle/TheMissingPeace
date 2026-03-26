type BookingConfirmationProps = {
  fullName: string;
  email: string;
  displayTime: string;
};

export function BookingConfirmation(props: BookingConfirmationProps) {
  return (
    <section className="rounded-[2rem] border border-[#dccfc1] bg-[#fffaf5] p-8 shadow-[0_18px_45px_rgba(109,75,54,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
        Consultation Confirmed
      </p>
      <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
        You&apos;re on the calendar.
      </h2>
      <p className="mt-4 text-base leading-7 text-[#57453a]">
        {props.fullName}, your consultation is reserved for{" "}
        <span className="font-semibold text-[#5d3e27]">{props.displayTime}</span>.
      </p>
      <p className="mt-3 text-base leading-7 text-[#57453a]">
        A confirmation email can be added next. For now, the consultation has been
        created on the business calendar and tied to your booking record.
      </p>
      <p className="mt-6 rounded-2xl bg-[#f7efe4] px-4 py-3 text-sm text-[#6d4b36]">
        Confirmation contact: {props.email}
      </p>
    </section>
  );
}
