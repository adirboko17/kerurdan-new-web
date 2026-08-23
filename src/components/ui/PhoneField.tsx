"use client";

import { useState, type InputHTMLAttributes } from "react";
import { formatIsraeliPhone, normalizeIsraeliPhone, phoneValidityMessage } from "@/lib/phone";

type PhoneFieldProps = {
  className?: string;
  label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "className">;

export function PhoneField({ className = "field", label = "טלפון", onBlur, onChange, ...props }: PhoneFieldProps) {
  const [message, setMessage] = useState("");

  return (
    <label className={`${className}${message ? " is-invalid" : ""}`}>
      <span>{label}</span>
      <input
        {...props}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        placeholder="050-0000000"
        aria-invalid={message ? true : undefined}
        style={{ direction: "ltr", textAlign: "right", ...props.style }}
        onChange={(event) => {
          const error = phoneValidityMessage(event.currentTarget.value);
          event.currentTarget.setCustomValidity(error);
          if (!error) setMessage("");
          onChange?.(event);
        }}
        onBlur={(event) => {
          const value = event.currentTarget.value;
          const error = phoneValidityMessage(value);
          const digits = normalizeIsraeliPhone(value);
          if (digits && !error) event.currentTarget.value = formatIsraeliPhone(digits);
          event.currentTarget.setCustomValidity(error);
          setMessage(value.trim() ? error : "");
          onBlur?.(event);
        }}
        onInvalid={(event) => {
          event.preventDefault();
          const error = phoneValidityMessage(event.currentTarget.value);
          event.currentTarget.setCustomValidity(error);
          setMessage(error);
        }}
      />
      {message ? <em className="field-error">{message}</em> : null}
    </label>
  );
}
