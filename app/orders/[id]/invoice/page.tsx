"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Printer, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

type OrderItem = {
  id: number;
  productId: number;
  productName?: string;
  product?: {
    id: number;
    title: string;
  };
  quantity: number;
  price: number;
  gstRate: number;
  gstAmount: number;
  flavour?: string | null;
  weightLabel?: string | null;
};

type Order = {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  totalAmount: number;
  totalGst: number;
  shippingCharge: number;
  couponDiscount: number;
  finalAmount: number;
  items: OrderItem[];
  address: {
    name: string;
    phone: string;
    street?: string;
    addressLine1?: string;
    city: string;
    state: string;
    pincode: string;
  };
};

type StorefrontSettings = {
  supportEmail: string;
  supportPhone: string;
  address: string;
};

function money(value?: number | null) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(orderId)) {
      setError("Invalid order ID");
      setLoading(false);
      return;
    }
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [orderRes, settingsRes] = await Promise.all([
          api.get(`/admin/orders/${orderId}`),
          api.get("/settings")
        ]);
        setOrder(orderRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoice details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  // Auto-trigger print when loading is done and data is present
  useEffect(() => {
    if (!loading && order && settings) {
      const timer = setTimeout(() => {
        window.print();
      }, 800); // Small delay to ensure styles and content render fully
      return () => clearTimeout(timer);
    }
  }, [loading, order, settings]);

  if (loading) {
    return (
      <div className="invoice-loading">
        <Loader2 size={32} className="spinner" />
        <p>Generating Invoice PDF...</p>
        <style jsx>{`
          .invoice-loading {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #000;
            color: #fff;
            font-family: sans-serif;
          }
          .spinner {
            animation: spin 1s linear infinite;
            color: #ef2d4f;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="invoice-error">
        <p>Error: {error || "Order not found"}</p>
        <button onClick={() => router.back()}>Go Back</button>
        <style jsx>{`
          .invoice-error {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #000;
            color: #fff;
            font-family: sans-serif;
            gap: 16px;
          }
          button {
            padding: 8px 16px;
            background: #ef2d4f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  const pricing = {
    itemsSubtotal: Number(order.totalAmount || 0),
    gst: Number(order.totalGst || 0),
    shipping: Number(order.shippingCharge || 0),
    couponDiscount: Number(order.couponDiscount || 0),
    payable: Number(order.finalAmount || order.totalAmount + order.totalGst + order.shippingCharge - order.couponDiscount),
  };

  const supportEmail = settings?.supportEmail || "info@insanegenix.com";
  const supportPhone = settings?.supportPhone || "020 370 1425";
  const address = settings?.address || "New Delhi, Delhi";

  const customerAddress = order.address || {};

  return (
    <div className="invoice-outer-wrapper">
      {/* Top action bar visible ONLY on screen, hidden during printing */}
      <div className="invoice-action-bar no-print">
        <button className="btn-back" onClick={() => router.back()}>
          <ArrowLeft size={16} /> Back
        </button>
        <button className="btn-print" onClick={() => window.print()}>
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      <div className="invoice-container">
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="company-details">
            <h1 className="logo-text">INSANEGENIX</h1>
            <p className="subtitle">Premium Sports Nutrition & Fitness Supplements (Admin view)</p>
            <p className="address-text">{address}</p>
            <p className="contact-text">Email: {supportEmail} | Phone: {supportPhone}</p>
          </div>
          <div className="invoice-meta">
            <h2>TAX INVOICE</h2>
            <table className="meta-table">
              <tbody>
                <tr>
                  <td>Invoice No:</td>
                  <td><strong>INV-{order.id}</strong></td>
                </tr>
                <tr>
                  <td>Order Date:</td>
                  <td>{new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</td>
                </tr>
                <tr>
                  <td>Payment Mode:</td>
                  <td><span className="payment-badge">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Paid)"}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="divider" />

        {/* Addresses Grid */}
        <div className="addresses-grid">
          <div className="address-box">
            <h3>Billed To (Customer):</h3>
            <p className="name">{customerAddress.name || "Customer"}</p>
            <p>{customerAddress.street || customerAddress.addressLine1}</p>
            <p>{customerAddress.city}, {customerAddress.state} - {customerAddress.pincode}</p>
            <p className="phone">Phone: {customerAddress.phone}</p>
          </div>
          <div className="address-box">
            <h3>Shipped To / Delivery Address:</h3>
            <p className="name">{customerAddress.name || "Customer"}</p>
            <p>{customerAddress.street || customerAddress.addressLine1}</p>
            <p>{customerAddress.city}, {customerAddress.state} - {customerAddress.pincode}</p>
            <p className="phone">Phone: {customerAddress.phone}</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="items-section">
          <table className="items-table">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>S.No</th>
                <th style={{ width: "45%" }}>Product Description</th>
                <th style={{ width: "12%", textAlign: "right" }}>Base Price</th>
                <th style={{ width: "8%", textAlign: "center" }}>Qty</th>
                <th style={{ width: "10%", textAlign: "right" }}>GST Rate</th>
                <th style={{ width: "10%", textAlign: "right" }}>GST Amt</th>
                <th style={{ width: "10%", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => {
                const totalItemGst = Number(item.gstAmount || 0) * item.quantity;
                const totalItemAmount = (Number(item.price || 0) + Number(item.gstAmount || 0)) * item.quantity;
                
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td>
                      <span className="product-title">{item.product?.title || item.productName || `Product #${item.productId}`}</span>
                      {item.flavour || item.weightLabel ? (
                        <span className="product-specs">
                          {item.flavour ? `Flavor: ${item.flavour}` : ""}
                          {item.flavour && item.weightLabel ? " | " : ""}
                          {item.weightLabel ? `Weight: ${item.weightLabel}` : ""}
                        </span>
                      ) : null}
                    </td>
                    <td style={{ textAlign: "right" }}>{money(item.price)}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>{Number(item.gstRate || 0)}%</td>
                    <td style={{ textAlign: "right" }}>{money(totalItemGst)}</td>
                    <td style={{ textAlign: "right" }}>{money(totalItemAmount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="summary-section">
          <div className="terms-conditions">
            <h4>Terms & Conditions:</h4>
            <p>1. Goods once sold will not be taken back or exchanged.</p>
            <p>2. This is a computer-generated tax invoice and requires no physical signature.</p>
            <p className="thank-you">Thank you for shopping with InsaneGenix!</p>
          </div>
          <div className="totals-box">
            <table className="totals-table">
              <tbody>
                <tr>
                  <td>Items Subtotal (Excl. GST):</td>
                  <td>{money(pricing.itemsSubtotal)}</td>
                </tr>
                <tr>
                  <td>Total CGST + SGST:</td>
                  <td>{money(pricing.gst)}</td>
                </tr>
                <tr>
                  <td>Shipping Charges:</td>
                  <td>{pricing.shipping === 0 ? "FREE" : money(pricing.shipping)}</td>
                </tr>
                {pricing.couponDiscount > 0 && (
                  <tr className="discount-row">
                    <td>Coupon Discount:</td>
                    <td>-{money(pricing.couponDiscount)}</td>
                  </tr>
                )}
                <tr className="grand-total-row">
                  <td>Grand Total (Incl. Taxes):</td>
                  <td>{money(pricing.payable)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Global CSS reset for print layouts */
        @media print {
          /* Hide all general UI components */
          header, footer, nav, 
          .eg-header-2, .footer-area, #preloader,
          .invoice-action-bar, .no-print,
          .header__area, .footer__area,
          .preloader, .back-to-top,
          .admin-sidebar, .admin-header {
            display: none !important;
          }
          
          body, html {
            background: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            font-size: 12px !important;
          }

          .invoice-outer-wrapper {
            padding: 0 !important;
            background: #fff !important;
            min-height: auto !important;
          }

          .invoice-container {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 10mm !important;
            width: 100% !important;
            background: #fff !important;
            color: #000 !important;
          }

          .payment-badge {
            border: 1px solid #000 !important;
            color: #000 !important;
            background: transparent !important;
          }
          
          hr.divider {
            border-top: 1px solid #333 !important;
          }

          .items-table th {
            background-color: #f0f0f0 !important;
            color: #000 !important;
            border-bottom: 2px solid #000 !important;
          }

          .items-table td, .items-table th {
            border: 1px solid #ccc !important;
          }

          .totals-table tr.grand-total-row td {
            background-color: #f0f0f0 !important;
            color: #000 !important;
            border-top: 2px solid #000 !important;
          }
        }
      `}</style>

      <style jsx>{`
        .invoice-outer-wrapper {
          background: #0d0d0d;
          min-height: 100vh;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #fff;
        }

        .invoice-action-bar {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 800px;
          margin-bottom: 20px;
        }

        .invoice-action-bar button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn-back {
          background: transparent;
          color: #fff;
        }

        .btn-back:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .btn-print {
          background: #ef2d4f;
          color: #fff;
          border-color: #ef2d4f !important;
        }

        .btn-print:hover {
          background: #d62040;
          transform: translateY(-1px);
        }

        .invoice-container {
          background: #fff;
          color: #1a1a1a;
          width: 100%;
          max-width: 800px;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          padding: 40px;
          box-sizing: border-box;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .logo-text {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #ef2d4f;
          margin: 0 0 4px;
        }

        .company-details .subtitle {
          font-size: 11px;
          color: #666;
          margin: 0 0 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .company-details .address-text {
          font-size: 13px;
          color: #333;
          margin: 0 0 4px;
        }

        .company-details .contact-text {
          font-size: 12px;
          color: #555;
          margin: 0;
        }

        .invoice-meta {
          text-align: right;
        }

        .invoice-meta h2 {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 12px;
          letter-spacing: 0.02em;
        }

        .meta-table {
          width: 100%;
          border-collapse: collapse;
        }

        .meta-table td {
          padding: 4px 8px;
          font-size: 13px;
          color: #444;
        }

        .meta-table td:first-child {
          text-align: right;
          color: #777;
        }

        .meta-table td:last-child {
          text-align: left;
        }

        .payment-badge {
          background: #e6f7ed;
          color: #1f8d4e;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .divider {
          border: 0;
          border-top: 1px solid #eee;
          margin: 30px 0;
        }

        .addresses-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .address-box h3 {
          font-size: 12px;
          font-weight: 800;
          color: #888;
          text-transform: uppercase;
          margin: 0 0 10px;
          letter-spacing: 0.05em;
        }

        .address-box p {
          font-size: 13px;
          color: #444;
          margin: 0 0 4px;
          line-height: 1.4;
        }

        .address-box .name {
          font-weight: 700;
          color: #1a1a1a;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .address-box .phone {
          margin-top: 6px;
          color: #555;
        }

        .items-section {
          margin-bottom: 40px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
        }

        .items-table th {
          background: #f8f8f8;
          border-bottom: 2px solid #ddd;
          padding: 12px 10px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #555;
          letter-spacing: 0.03em;
        }

        .items-table td {
          border-bottom: 1px solid #eee;
          padding: 14px 10px;
          font-size: 13px;
          color: #333;
          vertical-align: middle;
        }

        .product-title {
          display: block;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .product-specs {
          display: block;
          font-size: 10px;
          color: #888;
          font-weight: 600;
          text-transform: uppercase;
        }

        .summary-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
        }

        .terms-conditions {
          width: 45%;
        }

        .terms-conditions h4 {
          font-size: 11px;
          font-weight: 800;
          color: #666;
          text-transform: uppercase;
          margin: 0 0 8px;
          letter-spacing: 0.02em;
        }

        .terms-conditions p {
          font-size: 10px;
          color: #888;
          margin: 0 0 4px;
          line-height: 1.4;
        }

        .terms-conditions .thank-you {
          margin-top: 16px;
          font-size: 11px;
          font-weight: 700;
          color: #ef2d4f;
        }

        .totals-box {
          width: 50%;
        }

        .totals-table {
          width: 100%;
          border-collapse: collapse;
        }

        .totals-table td {
          padding: 8px 10px;
          font-size: 13px;
          color: #555;
        }

        .totals-table td:first-child {
          text-align: right;
          color: #777;
        }

        .totals-table td:last-child {
          text-align: right;
          font-weight: 700;
          color: #1a1a1a;
        }

        .discount-row td {
          color: #ef2d4f !important;
        }

        .grand-total-row td {
          border-top: 2px solid #ddd;
          padding-top: 12px;
          font-size: 16px !important;
        }

        .grand-total-row td:first-child {
          font-weight: 800;
          color: #1a1a1a !important;
        }

        .grand-total-row td:last-child {
          font-weight: 900;
          color: #ef2d4f !important;
        }

        @media (max-width: 600px) {
          .invoice-header {
            flex-direction: column;
            gap: 20px;
          }
          .invoice-meta {
            text-align: left;
          }
          .meta-table td {
            padding-left: 0;
          }
          .meta-table td:first-child {
            text-align: left;
          }
          .addresses-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .summary-section {
            flex-direction: column-reverse;
            gap: 20px;
          }
          .totals-box, .terms-conditions {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
