import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { Fragment } from "react";

export default function Select({ label, options, value, onChange, placeholder = "Select option", icon: Icon }) {
  const selectedOption = options.find(o => o.value === value) || null;

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>}
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-slate-50 border border-slate-200 h-12 pl-4 pr-10 text-left transition-all hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm">
            <span className="flex items-center gap-3 truncate font-medium text-slate-800">
              {Icon && <span className="text-slate-400">{Icon}</span>}
              {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-2 max-height-60 w-full overflow-auto rounded-2xl bg-white p-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2.5 pl-10 pr-4 rounded-xl transition-colors ${
                      active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-bold text-indigo-600' : 'font-medium'}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <Check className="h-4 w-4" aria-hidden="true" />
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
