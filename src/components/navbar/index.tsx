import { logo } from '../../../public';
import { Link } from 'react-router-dom';
import WalletConnect from '../walletConnect';

function index() {
    return (
        <nav className="flex justify-between rounded-lg left-10   mx-auto absolute top-10 z-50 w-[95%]  border-[.5px] border-[#4DA2FF]  items-center p-4 md:px-10 bg-[#04101D]">
            <Link to="/" className="flex items-center space-x-4">
                <img src={logo} className="w-10 h-10 object-cover" alt="logo" />

                <h1 className="text-xl font-bold">SuiZa</h1>
            </Link>

            <ul className="hidden md:flex space-x-6">
                <li>
                    <a href="#home" className="  hover:text-blue-400">
                        Home
                    </a>
                </li>
                <li>
                    <Link to="/your-agent" className="hover:text-blue-400">
                        Agents
                    </Link>
                </li>
                <li>
                    <Link to={'/move-to-earn'} className="hover:text-blue-400">
                        Move to Earn
                    </Link>
                </li>
            </ul>
            <WalletConnect />
        </nav>
    );
}

export default index;
