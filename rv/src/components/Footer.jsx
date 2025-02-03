// components/Footer.jsx
function Footer() {
  return (
    <footer className="bg-gray-500 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Quran App</h3>
            <p className="text-sm text-gray-200">
              Explore the Holy Quran with translations and recitations
            </p>
          </div>

          <div className="text-sm text-gray-200">
            <p>© 2024 Quran App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
