"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export type CalendarProps = React.ComponentProps<typeof DatePicker>

export function Calendar(props: CalendarProps) {
  return <DatePicker {...props} />
}
