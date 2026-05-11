import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { Fragment } from "react";

export default function Select({ label, options, value, onChange, placeholder = "Tanlang...", icon: Icon }) {
  const selectedOption = options.find(o => o.value === value) || null;

  return (
    <div className="space-y-2 w-full group">
      {label && <label className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] ml-1 opacity-60">{label}</label>}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] h-12 pl-4 pr-10 text-left transition-all hover:border-indigo-600/30 focus:outline-none focus:border-indigo-600 sm:text-sm shadow-sm group">
            <span className="flex items-center gap-3 truncate font-black text-[var(--color-text-primary)]">
              {Icon && <span className="text-[var(--color-text-secondary)] opacity-40 group-focus-within:text-indigo-600 group-focus-within:opacity-100 transition-all">{Icon}</span>}
              {selectedOption ? selectedOption.label : <span className="text-[var(--color-text-secondary)] opacity-40">{placeholder}</span>}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-5 w-5 text-[var(--color-text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-[150] mt-3 max-h-80 w-full overflow-auto rounded-3xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-2 text-base shadow-2xl focus:outline-none sm:text-sm custom-scrollbar">
              {options.length === 0 ? (
                <div className="py-8 text-center text-[var(--color-text-secondary)] opacity-40 italic font-black">
                  Ma'lumot mavjud emas
                </div>
              ) : options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3.5 pl-12 pr-4 rounded-2xl transition-all ${
                      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--color-text-primary)]'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-black' : 'font-bold'}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span className={`absolute inset-y-0 left-0 flex items-center pl-4 ${active ? 'text-white' : 'text-indigo-600'}`}>
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
