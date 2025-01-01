import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuid() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString();
}
