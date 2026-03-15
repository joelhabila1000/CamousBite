export default function ToastStack({ toasts }) {
  return (
    <div className="toast-wrap" id="toastWrap">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type} ${toast.leaving ? "out" : ""}`}
        >
          <span style={{ fontSize: "1.1rem" }}>
            {toast.type === "ok" ? "✅" : toast.type === "err" ? "❌" : "ℹ️"}
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
