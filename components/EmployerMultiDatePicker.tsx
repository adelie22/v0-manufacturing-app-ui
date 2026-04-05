"use client"

import { useState, useMemo } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns"
import { ko } from "date-fns/locale"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface EmployerMultiDatePickerProps {
  selectedDates: string[] // ["2025-04-01", "2025-04-03"] ISO format
  onChange: (dates: string[]) => void
  onConfirm?: () => void
  inline?: boolean
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]
const MAX_DATES = 31

export default function EmployerMultiDatePicker({
  selectedDates,
  onChange,
  onConfirm,
  inline = false,
}: EmployerMultiDatePickerProps) {
  const today = useMemo(() => new Date(), [])
  const tomorrow = useMemo(() => addDays(today, 1), [today])
  const [baseMonth, setBaseMonth] = useState(() => startOfMonth(today))

  const months = useMemo(
    () => [baseMonth, addMonths(baseMonth, 1)],
    [baseMonth]
  )

  const isDisabled = (date: Date) => isBefore(date, tomorrow) && !isSameDay(date, tomorrow)

  const toggleDate = (date: Date) => {
    if (isDisabled(date)) return
    const iso = format(date, "yyyy-MM-dd")
    if (selectedDates.includes(iso)) {
      onChange(selectedDates.filter((d) => d !== iso))
    } else {
      if (selectedDates.length >= MAX_DATES) {
        window.alert(`최대 ${MAX_DATES}일까지 선택할 수 있습니다.`)
        return
      }
      onChange([...selectedDates, iso].sort())
    }
  }

  const handleReset = () => onChange([])

  const handlePrev = () => {
    const prev = addMonths(baseMonth, -1)
    if (!isBefore(prev, startOfMonth(today))) {
      setBaseMonth(prev)
    }
  }

  const handleNext = () => {
    setBaseMonth(addMonths(baseMonth, 1))
  }

  const canGoPrev = isAfter(baseMonth, startOfMonth(today)) || isSameDay(baseMonth, startOfMonth(today)) === false

  const buildCalendarDays = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
    const days: Date[] = []
    let cursor = start
    while (!isAfter(cursor, end)) {
      days.push(cursor)
      cursor = addDays(cursor, 1)
    }
    return days
  }

  // Format selected dates for preview chips
  const sortedDates = useMemo(
    () => [...selectedDates].sort(),
    [selectedDates]
  )

  const previewChips = sortedDates.slice(0, 5)
  const extraCount = sortedDates.length - 5

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">
          {selectedDates.length > 0
            ? `${selectedDates.length}일 선택됨`
            : "날짜를 선택하세요"}
        </p>
        {selectedDates.length > 0 && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            초기화
          </button>
        )}
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isSameDay(baseMonth, startOfMonth(today))}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <p className="text-base font-semibold text-gray-900">
            {format(months[0], "yyyy년 M월", { locale: ko })} –{" "}
            {format(months[1], "yyyy년 M월", { locale: ko })}
          </p>
          <button
            onClick={handleNext}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Two-month grid */}
        {months.map((month) => (
          <div key={month.toISOString()}>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {format(month, "M월", { locale: ko })}
            </p>
            {/* Weekday labels */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((wd, i) => (
                <div
                  key={wd + i}
                  className={`text-center text-sm font-medium py-1 ${
                    i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  {wd}
                </div>
              ))}
            </div>
            {/* Date cells */}
            <div className="grid grid-cols-7">
              {buildCalendarDays(month).map((date, idx) => {
                const inMonth = isSameMonth(date, month)
                const disabled = isDisabled(date)
                const iso = format(date, "yyyy-MM-dd")
                const selected = selectedDates.includes(iso)
                const isToday = isSameDay(date, today)

                return (
                  <button
                    key={idx}
                    onClick={() => inMonth && toggleDate(date)}
                    disabled={!inMonth || disabled}
                    className={`
                      min-h-[44px] min-w-[44px] flex items-center justify-center text-base transition-all
                      ${!inMonth ? "invisible" : ""}
                      ${disabled && inMonth ? "text-gray-300 cursor-not-allowed" : ""}
                      ${selected ? "bg-blue-600 rounded-full text-white font-semibold" : ""}
                      ${!selected && !disabled && inMonth ? "hover:bg-gray-100 rounded-full text-gray-800" : ""}
                      ${isToday && !selected && inMonth ? "ring-1 ring-blue-400 rounded-full" : ""}
                    `}
                  >
                    {inMonth ? format(date, "d") : ""}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer - only when not inline */}
      {!inline && selectedDates.length > 0 && (
        <div className="space-y-3">
          {/* Preview chips */}
          <div className="flex flex-wrap gap-2">
            {previewChips.map((iso) => {
              const d = parseISO(iso)
              return (
                <span
                  key={iso}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-3 py-1.5 text-sm font-medium"
                >
                  {format(d, "M/d (EEE)", { locale: ko })}
                  <button
                    onClick={() =>
                      onChange(selectedDates.filter((dd) => dd !== iso))
                    }
                    className="ml-0.5 hover:text-blue-900"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )
            })}
            {extraCount > 0 && (
              <span className="inline-flex items-center bg-gray-100 text-gray-600 rounded-full px-3 py-1.5 text-sm font-medium">
                외 {extraCount}일
              </span>
            )}
          </div>

          {/* Confirm button */}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold rounded-2xl transition-colors"
            >
              확인
            </button>
          )}
        </div>
      )}
    </div>
  )
}
