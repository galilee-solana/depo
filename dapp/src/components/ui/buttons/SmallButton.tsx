
function SmallButton({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled: boolean }) {
  return (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`${disabled ? 'bg-gray-500 text-white border-none' : 'hover:bg-gray-100 bg-white text-black border border-black'} px-4 py-2 rounded-md transition`}>
        {children}
    </button>
  )
}

export default SmallButton;