import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, className, ...rest }: InputProps) {
  return (
    <label className="block text-sm mb-3">
      <span className="block mb-1.5 text-slate-700">{label}</span>
      <input
        className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-primary/70 focus:border-gov-primary transition ${
          error ? 'border-red-400' : 'border-slate-300 hover:border-gov-primary/60'
        } ${className ?? ''}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, className, ...rest }: TextAreaProps) {
  return (
    <label className="block text-sm mb-3">
      <span className="block mb-1.5 text-slate-700">{label}</span>
      <textarea
        className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-primary/70 focus:border-gov-primary min-h-[120px] resize-y transition ${
          error ? 'border-red-400' : 'border-slate-300 hover:border-gov-primary/60'
        } ${className ?? ''}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-gov-primary text-white hover:bg-gov-primaryLight hover:shadow-md'
      : variant === 'secondary'
      ? 'bg-white text-gov-primary border border-gov-primary hover:bg-gov-accentSoft'
      : 'bg-transparent text-slate-700 hover:bg-slate-100';

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-[1px] active:translate-y-0 ${styles} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}

