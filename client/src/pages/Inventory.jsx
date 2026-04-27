import React, { useState, useEffect, useMemo } from "react";
import { CSVLink } from "react-csv";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import ImportProducts from "../components/ImportProducts";
import { useDaisyTheme, agGridThemeClassName } from "../hooks/useDaisyTheme";

const DEFAULT_PAGE_SIZE = 20;

function Inventory() {
  const theme = useDaisyTheme();
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);

  useEffect(() => {
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data || []))
      .catch((err) => console.log(err));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => setAllStores(data || []));
  };

  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const importProductModalSetting = () => {
    setShowImportModal(!showImportModal);
  };

  const deleteItem = (id) => {
    fetch(`http://localhost:4000/api/product/delete/${id}`)
      .then((response) => response.json())
      .then(() => setUpdatePage(!updatePage));
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    const q = searchTerm.toLowerCase();
    return products.filter((product) => (product.name || "").toLowerCase().includes(q));
  }, [products, searchTerm]);

  const inventoryMetrics = useMemo(() => {
    const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 50).length;
    const outOfStockCount = products.filter((product) => Number(product.stock || 0) === 0).length;
    const totalCategories = new Set(products.map((product) => product.category).filter(Boolean)).size;

    return {
      totalProducts: products.length,
      activeStores: stores.length,
      totalCategories,
      lowStockCount,
      outOfStockCount,
    };
  }, [products, stores.length]);

  const csvData = filteredProducts.map((product) => ({
    name: product.name || "N/A",
    category: product.category || "N/A",
    stock: product.stock || 0,
    description: product.description || "",
  }));

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 140,
  };

  const columns = [
    { headerName: "Category", field: "category" },
    { headerName: "Product Name", field: "name" },
    {
      headerName: "Stock",
      field: "stock",
      type: "rightAligned",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => Number(params.value || 0).toLocaleString(),
    },
    { headerName: "Description", field: "description", minWidth: 220 },
    {
      headerName: "Availability",
      field: "stock",
      minWidth: 170,
      cellRenderer: (params) => {
        const stock = Number(params.value || 0);
        const badgeClass = stock === 0 ? "badge-error" : stock <= 50 ? "badge-warning" : "badge-success";
        const label = stock === 0 ? "Out of Stock" : stock <= 50 ? "Low Stock" : "In Stock";
        return <span className={`badge ${badgeClass} badge-outline`}>{label}</span>;
      },
    },
    {
      headerName: "Actions",
      minWidth: 180,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <div className="flex h-full items-center gap-2">
          <button
            className="btn btn-xs btn-success text-white transition-colors duration-200 hover:bg-opacity-80"
            onClick={() => updateProductModalSetting(params.data)}
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-error text-white transition-colors duration-200 hover:bg-opacity-80"
            onClick={() => deleteItem(params.data._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="flex w-full flex-col gap-4">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Inventory Intelligence</h1>
              <p className="text-sm text-base-content/60">
                Track stock levels, product mix, and category coverage in a single operational view.
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Total Products</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{inventoryMetrics.totalProducts.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Active Stores</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{inventoryMetrics.activeStores.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Categories</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{inventoryMetrics.totalCategories.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Low Stock</p>
              <p className="mt-2 text-2xl font-bold text-warning">{inventoryMetrics.lowStockCount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Out of Stock</p>
              <p className="mt-2 text-2xl font-bold text-error">{inventoryMetrics.outOfStockCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-base-200 bg-base-100 p-3">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <input
                className="input input-bordered input-sm w-full max-w-xs border-base-300"
                type="text"
                placeholder="Search by product name"
                value={searchTerm}
                onChange={handleSearchTerm}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-sm btn-outline border-base-300 transition-colors duration-200 hover:bg-base-200"
                onClick={fetchProductsData}
              >
                Refresh
              </button>
              <button
                className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-80"
                onClick={addProductModalSetting}
              >
                Add Product
              </button>
              <button
                className="btn btn-sm btn-success text-white transition-colors duration-200 hover:bg-opacity-80"
                onClick={importProductModalSetting}
              >
                Import Products
              </button>
              <CSVLink
                data={csvData}
                filename={"products_inventory.csv"}
                className="btn btn-sm btn-warning text-white transition-colors duration-200 hover:bg-opacity-80"
                target="_blank"
              >
                Export CSV
              </CSVLink>
            </div>
          </div>

          <div
            className={`${agGridThemeClassName(theme)} rounded-lg border border-base-200`}
            style={{ width: "100%" }}
          >
            <AgGridReact
              rowData={filteredProducts}
              columnDefs={columns}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={DEFAULT_PAGE_SIZE}
              rowSelection="multiple"
              enableRangeSelection={true}
              enableCharts={true}
              domLayout="autoHeight"
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
                params.api.paginationSetPageSize(DEFAULT_PAGE_SIZE);
              }}
            />
          </div>
        </div>

        {showProductModal && (
          <AddProduct addProductModalSetting={addProductModalSetting} handlePageUpdate={handlePageUpdate} />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showImportModal && (
          <ImportProducts importProductModalSetting={importProductModalSetting} handlePageUpdate={handlePageUpdate} />
        )}
      </div>
    </div>
  );
}

export default Inventory;
