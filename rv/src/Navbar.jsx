import { Link, useRouter } from "@tanstack/react-router";

function NavBar() {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800 py-4">Quran App</div>

          <ul className="flex">
            <li className="mr-1">
              <Link
                to="/"
                className={`inline-block py-2 px-4 font-semibold ${
                  router.state.location.pathname === "/"
                    ? "border-l border-t border-r rounded-t text-blue-700 bg-white"
                    : "text-blue-500 hover:text-blue-800"
                }`}
              >
                Settings
              </Link>
            </li>
            <li className="mr-1">
              <Link
                to="/search"
                className={`inline-block py-2 px-4 font-semibold ${
                  router.state.location.pathname === "/search"
                    ? "border-l border-t border-r rounded-t text-blue-700 bg-white"
                    : "text-blue-500 hover:text-blue-800"
                }`}
              >
                Search
              </Link>
            </li>
            <li className="mr-1">
              <Link
                to="/search2"
                className={`inline-block py-2 px-4 font-semibold ${
                  router.state.location.pathname === "/search2"
                    ? "border-l border-t border-r rounded-t text-blue-700 bg-white"
                    : "text-blue-500 hover:text-blue-800"
                }`}
              >
                Search2
              </Link>
            </li>{" "}
            <li className="mr-1">
              <Link
                to="/search3"
                className={`inline-block py-2 px-4 font-semibold ${
                  router.state.location.pathname === "/search3"
                    ? "border-l border-t border-r rounded-t text-blue-700 bg-white"
                    : "text-blue-500 hover:text-blue-800"
                }`}
              >
                Search3
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
