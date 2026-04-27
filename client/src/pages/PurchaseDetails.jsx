import React, { useState, useEffect, useContext, useMemo } from "react";
import { CSVLink } from "react-csv";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import ImportPurchases from "../components/ImportPurchases";
import AuthContext from "../AuthContext";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [showImportModal, setImportModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [updatePage]);

  const fetchPurchaseData = () => {
    fetch(`http://localhost:4000/api/purchase/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllPurchaseData(data || []);
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

  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };

  const importPurchaseModalSetting = () => {
    setImportModal(!showImportModal);
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
    {
      headerName: "Quantity Purchased",
      field: "QuantityPurchased",
      sortable: true,
      filter: "agNumberColumnFilter",
      type: "rightAligned",
      valueFormatter: (params) => Number(params.value || 0).toLocaleString(),
    },
    {
      headerName: "Purchase Date",
      field: "PurchaseDate",
      sortable: true,
      filter: "agDateColumnFilter",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Total Purchase Amount",
      field: "TotalPurchaseAmount",
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
        if (params.data.TotalPurchaseAmount && params.data.QuantityPurchased) {
          return (params.data.TotalPurchaseAmount / params.data.QuantityPurchased).toFixed(2);
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

  const filteredData = purchase.filter((item) =>
    item.ProductID?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const csvData = purchase.map((p) => ({
    productName: p.ProductID?.name || "N/A",
    category: p.ProductID?.category || "N/A",
    quantityPurchased: p.QuantityPurchased || 0,
    purchaseDate: p.PurchaseDate ? new Date(p.PurchaseDate).toLocaleDateString() : "N/A",
    totalPurchaseAmount: p.TotalPurchaseAmount || 0,
    pricePerUnit: p.QuantityPurchased ? (p.TotalPurchaseAmount / p.QuantityPurchased).toFixed(2) : 0,
  }));

  const metrics = useMemo(() => {
    const totalSpend = purchase.reduce((acc, item) => acc + Number(item.TotalPurchaseAmount || 0), 0);
    const totalUnits = purchase.reduce((acc, item) => acc + Number(item.QuantityPurchased || 0), 0);
    const avgPrice = purchase.length ? totalSpend / purchase.length : 0;

    return {
      totalSpend,
      totalUnits,
      avgPrice,
      records: purchase.length,
    };
  }, [purchase]);

  const formatCurrency = (value, maxFractionDigits = 0) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: maxFractionDigits,
    }).format(value || 0);

  return (
    <div className="col-span-12 lg:col-span-10 min-h-screen bg-base-200/40 p-4 md:p-6 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="flex w-full flex-col gap-4">
        {showPurchaseModal && (
          <AddPurchaseDetails
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {showImportModal && (
          <ImportPurchases
            importPurchaseModalSetting={importPurchaseModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Purchase Operations</h1>
              <p className="text-sm text-base-content/60">
                Analyze purchase records, inbound quantities, and supplier intake values.
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Total Purchase Spend</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{formatCurrency(metrics.totalSpend)}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Total Units Purchased</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{metrics.totalUnits.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-200 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Average Price</p>
              <p className="mt-2 text-2xl font-bold text-base-content">{formatCurrency(metrics.avgPrice, 2)}</p>
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
                onClick={fetchPurchaseData}
              >
                Refresh
              </button>
              <button
                className="btn btn-sm btn-primary transition-colors duration-200 hover:bg-opacity-80"
                onClick={addSaleModalSetting}
              >
                Add Purchase
              </button>
              <button
                className="btn btn-sm btn-success text-white transition-colors duration-200 hover:bg-opacity-80"
                onClick={importPurchaseModalSetting}
              >
                Import Purchases
              </button>
              <CSVLink
                data={csvData}
                filename={"purchases.csv"}
                className="btn btn-sm btn-warning text-white transition-colors duration-200 hover:bg-opacity-80"
                target="_blank"
              >
                Export CSV
              </CSVLink>
            </div>
          </div>

          <div className="ag-theme-alpine rounded-lg border border-base-200" style={{ width: "100%" }}>
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

export default PurchaseDetails;
