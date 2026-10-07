const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-sm text-gray-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} Airport Gap Dashboard
        </p>

        <p>
          Frontend Learning Project
        </p>
      </div>
    </footer>
  )
}

export default Footer