import React from 'react';

export function Card({children, className=""}:{children:React.ReactNode; className?:string}){
  return <div className={`rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg ${className}`}>{children}</div>
}
export function Button({children,onClick,variant="primary",className="",type="button"}:
  {children:React.ReactNode; onClick?:()=>void; variant?:"primary"|"secondary"|"ghost"|"outline"; className?:string; type?:"button"|"submit"})
{
  const base="px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-[0.98]";
  const map={
    primary:"bg-sky-700/70 hover:bg-sky-600 text-white border border-white/10",
    secondary:"bg-white/10 hover:bg-white/20 text-white border border-white/10",
    ghost:"bg-transparent hover:bg-white/10 text-white",
    outline:"bg-transparent border border-white/20 hover:bg-white/10 text-white"
  } as const;
  return <button type={type} onClick={onClick} className={`${base} ${map[variant]} ${className}`}>{children}</button>
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={`w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-sky-500 ${props.className||""}`} />
}

export function Select({children, ...rest}: React.SelectHTMLAttributes<HTMLSelectElement>){
  return <select {...rest} className={`w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500 ${rest.className||""}`}>{children}</select>
}
