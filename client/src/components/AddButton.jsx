import "./AddButton.css"

const AddButton = ({ }) => {
    return (
        <a href="/add_item" className="floating-button">
            {/* DONT ADD PLUS HERE, THE BUTTON TEXT (+ IN GENERAL AND 'REPORT ITEM' ON HOVERING) IS ADDED IN RESPECTIVE CSS FIELDS. CHECK CSS FILE. */}
        </a>
    );
};

export default AddButton

