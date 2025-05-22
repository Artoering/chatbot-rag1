"use client";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronUpDown } from "@fortawesome/free-solid-svg-icons";

type Tenant = {
  id: string;
  name: string;
  description: string;
};

type Props = {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  onTenantSelect: (tenant: Tenant) => void;
};

export function TenantSelector({
  tenants,
  selectedTenant,
  onTenantSelect,
}: Props) {
  return (
    <Listbox value={selectedTenant} onChange={onTenantSelect}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-base-100 py-2 pl-3 pr-10 text-left border border-base-300 focus:outline-none focus-visible:border-accent-focus focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-accent-focus sm:text-sm">
          <span className="block truncate">
            {selectedTenant ? selectedTenant.name : "Select a tenant..."}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {/* <FontAwesomeIcon
              icon={faChevronUpDown}
              className="h-5 w-5 text-base-content"
              aria-hidden="true"
            /> */}
            <FontAwesomeIcon
              icon={faCheck}
              className="h-5 w-5"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {tenants.map((tenant) => (
              <Listbox.Option
                key={tenant.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? "bg-primary/10 text-primary-content"
                      : "text-base-content"
                  }`
                }
                style={{
                  color: "#000",
                  backgroundColor: "#FFF",
                }}
                value={tenant}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {tenant.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
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
  );
}
