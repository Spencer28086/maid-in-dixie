"use client";

import { format, addDays, startOfToday } from "date-fns";

type CalendarProps = {
    availability: Record<string, any>;
    onSelect: (date: Date) => void;
};

export default function Calendar({ availability, onSelect }: CalendarProps) {
    const today = startOfToday();

    const days = Array.from({ length: 30 }).map((_, i) =>
        addDays(today, i)
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {days.map((date) => {
                const key = format(date, "yyyy-MM-dd");
                const dayData = availability?.[key];

                const isDisabled = dayData?.status === "FULL";

                return (
                    <button
                        key={key}
                        onClick={() => !isDisabled && onSelect(date)}
                        disabled={isDisabled}
                        className={`p-4 rounded-xl border text-sm font-medium
              ${isDisabled
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-white hover:bg-[#fdf2f5] border-[#f3d1d8]"
                            }
            `}
                    >
                        <div>{format(date, "MMM d")}</div>
                    </button>
                );
            })}
        </div>
    );
}