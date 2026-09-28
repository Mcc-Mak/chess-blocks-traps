export default function Modal({ title, onClose, children, closeLabel = 'Close' }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        <button className="modal-btn" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
