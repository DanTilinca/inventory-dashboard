import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import ViewCart from "../components/ViewCart";
import { useDaisyTheme, agGridThemeClassName } from "../hooks/useDaisyTheme";

const categories = ["All", "Electronics", "Groceries", "Healthcare", "Clothing", "Beauty", "Toys", "Sports", "Home", "Books", "Automotive"];
const itemsPerPageOptions = [10, 20, 50, 100];

function ProductsClient() {
  const theme = useDaisyTheme();
  const [showCartModal, setShowCartModal] = useState(false);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [updatePage, setUpdatePage] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProductsData();
    syncCartCount();
  }, [updatePage]);

  const syncCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    setCartCount(totalItems);
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data || []))
      .catch((err) => console.log(err));
  };

  const cartModalSetting = () => {
    setShowCartModal(!showCartModal);
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddToCart = (product, quantity) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex((item) => item._id === product._id);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    syncCartCount();
  };

  const getMaxQuantity = (product) => {
    return Array.from({ length: Number(product.stock || 0) }, (_, i) => i + 1);
  };

  const handleQuantityChange = (productId, quantity) => {
    const safeQuantity = Number.isNaN(Number(quantity)) ? 1 : Number(quantity);
    setSelectedQuantities((prevState) => ({
      ...prevState,
      [productId]: safeQuantity < 1 ? 1 : safeQuantity,
    }));
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
    syncCartCount();
  };

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (selectedCategory !== "All") {
      data = data.filter((product) => product.category === selectedCategory);
    }

    if (searchTerm) {
      data = data.filter((product) => (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return data;
  }, [products, selectedCategory, searchTerm]);

  const clientMetrics = useMemo(() => {
    const availableProducts = filteredProducts.filter((product) => Number(product.stock || 0) > 0).length;
    const lowStock = filteredProducts.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 50).length;
    const categoriesCount = new Set(filteredProducts.map((product) => product.category).filter(Boolean)).size;

    return {
      total: filteredProducts.length,
      available: availableProducts,
      lowStock,
      categoriesCount,
    };
  }, [filteredProducts]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 130,
  };

  const columns = [
    { headerName: "Category", field: "category" },
    { headerName: "Product Name", field: "name", minWidth: 170 },
    {
      headerName: "Stock",
      field: "stock",
      type: "rightAligned",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => Number(params.value || 0).toLocaleString(),
    },
    { headerName: "Description", field: "description", minWidth: 240 },
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
      headerName: "Add to Cart",
      minWidth: 190,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const stock = Number(params.data?.stock || 0);
        return (
          <div className="flex h-full items-center gap-2">
            <input
              type="number"
              min={1}
              max={stock}
              step={1}
              className="input input-bordered input-xs w-20 border-base-300 text-center"
              value={selectedQuantities[params.data._id] || 1}
              disabled={stock === 0}
              onChange={(e) =>
                handleQuantityChange(params.data._id, Math.min(stock, Number(e.target.value || 1)))
              }
            />
            <button
              className="btn btn-xs btn-primary text-white transition-colors duration-200 hover:bg-opacity-90 disabled:btn-disabled"
              onClick={() => handleAddToCart(params.data, selectedQuantities[params.data._id] || 1)}
              disabled={stock === 0}
            >
              Add
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="flex w-full flex-col gap-4">
        {showCartModal && (
          <ViewCart
            isOpen={showCartModal}
            cartModalSetting={cartModalSetting}
            handlePageUpdate={handlePageUpdate}
            onCartUpdated={syncCartCount}
          />
        )}

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Products Catalog</h1>
              <p className="text-sm text-base-content/60">
                Browse inventory and place product orders directly to your cart.
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Total Products</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{clientMetrics.total.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Available Products</p>
              <p className="mt-2 text-2xl font-bold text-success">{clientMetrics.available.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Low Stock</p>
              <p className="mt-2 text-2xl font-bold text-warning">{clientMetrics.lowStock.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Categories</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{clientMetrics.categoriesCount.toLocaleString()}</p>
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
              <select
                className="select select-bordered select-sm border-base-300"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered select-sm border-base-300"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {itemsPerPageOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option} items per page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-sm btn-outline border-base-300 transition-colors duration-200 hover:bg-base-200"
                onClick={fetchProductsData}
              >
                Refresh
              </button>
              <button
                className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-90"
                onClick={cartModalSetting}
              >
                View Cart
                {cartCount > 0 && <span className="badge badge-sm badge-neutral ml-1">{cartCount}</span>}
              </button>
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
              paginationPageSize={pageSize}
              rowSelection="multiple"
              enableRangeSelection={true}
              enableCharts={true}
              domLayout="autoHeight"
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
                params.api.paginationSetPageSize(pageSize);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsClient;
