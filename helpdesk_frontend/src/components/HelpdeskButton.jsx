import "../styles/HelpdeskButton.css";

const HelpdeskButton = ({ onClick }) => {
  return (
    <button className="helpdesk-btn" onClick={onClick}>
      SmartRide Helpdesk
    </button>
  );
};

export default HelpdeskButton;
