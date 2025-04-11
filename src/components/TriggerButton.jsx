export default function TriggerButton({ children }) {
    return (
        // button to trigger dropdown menu
        <button className="flex gap-2 px-2 py-2 font-medium">
            {children}
        </button>
    )
}