import { CreateProductDialog } from "./create-product-dialog";

// TODO: proper type definition for icon component
export const PlusIcon = (props: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`h-6 w-6 ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export function EmptyProductState() {
  return (
    <div className="my-4 rounded-md bg-white p-2 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new product.
      </p>
      <div className="mt-6">
        {/* <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          New Customer
        </button> */}
        <CreateProductDialog />
      </div>
    </div>
  );
}
