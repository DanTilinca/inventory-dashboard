import React, { useState, useEffect, useContext, useMemo } from "react";
import { CSVLink } from "react-csv";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import AddSale from "../components/AddSale";
import ImportSales from "../components/ImportSales";
import AuthContext from "../AuthContext";
import { useDaisyTheme, agGridThemeClassName } from "../hooks/useDaisyTheme";

function Sales() {
  const theme = useDaisyTheme();
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data || []);
      })
      .catch((err) => console.log(err));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data || []);
      })
      .catch((err) => console.log(err));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data || []);
      });
  };

  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  const importSalesModalSetting = () => {
    setShowImportModal(!showImportModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const columns = [
    { headerName: "Product Name", field: "ProductID.name", sortable: true, filter: true },
    { headerName: "Category", field: "ProductID.category", sortable: true, filter: true },
    { headerName: "Store Name", field: "StoreID.name", sortable: true, filter: true },
    {
      headerName: "Stock Sold",
      field: "StockSold",
      sortable: true,
      filter: "agNumberColumnFilter",
      type: "rightAligned",
      valueFormatter: (params) => Number(params.value || 0).toLocaleString(),
    },
    {
      headerName: "Sales Date",
      field: "SaleDate",
      sortable: true,
      filter: "agDateColumnFilter",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Total Sale Amount",
      field: "TotalSaleAmount",
      sortable: true,
      filter: "agNumberColumnFilter",
      type: "rightAligned",
      valueFormatter: (params) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
          params.value || 0
        ),
    },
    {
      headerName: "Price per Unit",
      field: "pricePerUnit",
      valueGetter: (params) => {
        if (params.data.TotalSaleAmount && params.data.StockSold) {
          return (params.data.TotalSaleAmount / params.data.StockSold).toFixed(2);
        }
        return null;
      },
      sortable: true,
      filter: "agNumberColumnFilter",
      type: "rightAligned",
      valueFormatter: (params) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
          params.value || 0
        ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  const filteredData = sales.filter((item) =>
    item.ProductID?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const csvData = sales.map((s) => ({
    productName: s.ProductID?.name || "N/A",
    category: s.ProductID?.category || "N/A",
    storeName: s.StoreID?.name || "N/A",
    stockSold: s.StockSold || 0,
    saleDate: s.SaleDate ? new Date(s.SaleDate).toLocaleDateString() : "N/A",
    totalSaleAmount: Math.round(s.TotalSaleAmount || 0),
    pricePerUnit: s.StockSold ? (s.TotalSaleAmount / s.StockSold).toFixed(2) : 0,
  }));

  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((acc, item) => acc + Number(item.TotalSaleAmount || 0), 0);
    const unitsSold = sales.reduce((acc, item) => acc + Number(item.StockSold || 0), 0);
    const avgOrderValue = sales.length ? totalRevenue / sales.length : 0;
    const activeStores = new Set(sales.map((item) => item.StoreID?._id).filter(Boolean)).size;

    return {
      totalRevenue,
      unitsSold,
      avgOrderValue,
      activeStores,
      records: sales.length,
    };
  }, [sales]);

  const formatCurrency = (value, maxFractionDigits = 0) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: maxFractionDigits,
    }).format(value || 0);

  return (
    <div className="col-span-12 lg:col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="flex w-full flex-col gap-4">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {showImportModal && (
          <ImportSales
            importSalesModalSetting={importSalesModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Sales Operations</h1>
              <p className="text-sm text-base-content/60">
                Monitor sell-through trends, store performance, and transactional volume.
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Units Sold</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{metrics.unitsSold.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Avg Order Value</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{formatCurrency(metrics.avgOrderValue, 2)}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Active Stores</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{metrics.activeStores.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Records</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{metrics.records.toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-base-200 bg-base-100 p-3">
            <div className="w-full max-w-xs">
              <input
                type="text"
                placeholder="Search by Product Name"
                value={searchText}
                onChange={handleSearch}
                className="input input-bordered input-sm w-full border-base-300"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-sm btn-outline border-base-300 transition-colors duration-200 hover:bg-base-200"
                onClick={fetchSalesData}
              >
                Refresh
              </button>
              <button
                className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-80"
                onClick={addSaleModalSetting}
              >
                Add Sale
              </button>
              <button
                className="btn btn-sm btn-success text-white transition-colors duration-200 hover:bg-opacity-80"
                onClick={importSalesModalSetting}
              >
                Import Sales
              </button>
              <CSVLink
                data={csvData}
                filename={"sales.csv"}
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
              rowData={filteredData}
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

export default Sales;
