import React from "react";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  MdArrowCircleUp,
  MdArrowCircleDown,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdSearch,
} from "react-icons/md";

import { Link } from "react-router-dom";

import { useState } from "react";

function SimpleTable({
  data,
  columns,
  name,
  filters,
  id,
  createForm,
  updateForm,
  getForm,
  notAllowDelete,
  notAllowUpdate,
  notAllowCreate,
  noActions,
}) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const [columnFilters, setColumnFilters] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter: filtering,
      pagination,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  let actionsDisabled = false;
  if (filters) {
    filters.forEach((element) => {
      if (element.restrictBy) {
        actionsDisabled = true;
      }
    });
  }

  return (
    <div className="w-full">
      <div className="p-5">
        <h1 className="text-xl-mb-2 text-xl my-3">{name}</h1>
        <hr />

        <div className="w-full flex flex-row justify-start align-middle h-full">
          <div className="flex flex-row my-3">
            <div className="flex items-center ml-2">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-96 max-w-96 text-black py-2 my-2 bg-transparent border-b px-5 border-gray-400 outline-none focus:outline-none"
              value={filtering}
              placeholder="Búsqueda de coincidencias..."
              onChange={(e) => setFiltering(e.target.value)}
            />
          </div>
          {filters && filters.map((filter) => filter.component)}

          {notAllowCreate ? null : (
            <Link
              className="hover:bg-pink-800 h-10 w-[300px] mx-5 text-center self-center justify-center bg-pink-700 text-white px-4 py-3 rounded-lg transition"
              to={createForm}
            >
              Crear
            </Link>
          )}
        </div>

        <div className="overflow-auto rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="whitespace-nowrap" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="p-3 w-20 min-w-[130px] text-sm text-gray-700 font-semibold tracking-wide text-left"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          <div
                            className="flex flex-row justify-between"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {
                              {
                                asc: (
                                  <MdArrowCircleDown className="text-xl ml-3 text-gray-400"></MdArrowCircleDown>
                                ),
                                desc: (
                                  <MdArrowCircleUp className="text-xl ml-3 text-gray-400"></MdArrowCircleUp>
                                ),
                              }[header.column.getIsSorted() ?? null]
                            }
                          </div>
                          {header.column.getCanFilter() ? (
                            <div className="mt-3 w-full">
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}

                  {noActions ? null : (
                    <th className="p-3 w-20 text-sm text-gray-700 font-semibold tracking-wide text-center">
                      Acciones
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  className={index % 2 == 0 ? "bg-white" : "bg-pink-50"}
                  key={row[id]}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}

                  {!noActions && (
                    <div>
                      {actionsDisabled ? (
                        <td className="p-3 text-sm text-gray-700 flex justify-evenly gap-x-3 whitespace-nowrap">
                          <Link
                            className="border text-2xl rounded p-1"
                            to={getForm + row.original[id]}
                          >
                            <MdVisibility className="text-blue-600" />
                          </Link>
                        </td>
                      ) : (
                        <td className="p-3 text-sm text-gray-700 flex justify-evenly gap-x-3 whitespace-nowrap">
                          <Link
                            to={getForm + row.original[id]}
                            className="border text-2xl rounded p-1"
                          >
                            <MdVisibility className="text-blue-600" />
                          </Link>
                          {notAllowUpdate ? null : (
                            <Link
                              to={updateForm + row.original[id]}
                              className="border text-2xl rounded p-1"
                            >
                              <MdEdit className="text-orange-600" />
                            </Link>
                          )}
                          {notAllowDelete ? null : (
                            <button className="border text-2xl rounded p-1">
                              <MdDelete className="text-red-800" />
                            </button>
                          )}
                        </td>
                      )}
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr />
      <div className="h-4" />

      <div className="flex justify-center items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Página</div>
          <p className="text-pink-600">
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </p>
        </span>
        <span className="flex items-center gap-1">
          Go
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center items-center py-3 gap-2">
        Mostrando {table.getRowModel().rows.length.toLocaleString()} de{" "}
        {table.getRowCount().toLocaleString()} regístros
      </div>
    </div>
  );
}

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, customSize } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div className="w-full">
      <div className="flex space-x-2 font-normal">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={columnFilterValue?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className={
            "border block text-sm font-normal shadow pl-2 rounded " +
            (customSize ? `max-w-20` : "max-w-12") +
            " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          }
        />
        <DebouncedInput
          type="number"
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max`}
          className={
            "border block text-sm font-normal shadow pl-2 rounded " +
            (customSize ? `max-w-20` : "max-w-12") +
            " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          }
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <DebouncedInput
      className="border block font-normal shadow pl-2 rounded w-full"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Búsqueda...`}
      type="text"
      value={columnFilterValue ?? ""}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default SimpleTable;
