
function SmallButtonDanger({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled: boolean }) {
  return (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`${disabled ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded-md transition`}>
        {children}
    </button>
  )
}

export default SmallButtonDanger;