import { logo } from '../../../public'
import { Link } from 'react-router-dom'

function index() {
    return (
        <nav className="flex justify-between rounded-lg left-10   mx-auto absolute top-10 z-50 w-[95%]  border-[.5px] border-[#4DA2FF]  items-center p-4 md:px-10 bg-[#04101D]">

            <Link to="/" className="flex items-center space-x-4">
                <img src={logo} className="w-10 h-10 object-cover" alt="logo" />

                <h1 className="text-xl font-bold">SuiZa</h1>
            </Link>


            <ul className="hidden md:flex space-x-6">
                <li><a href="#home" className="  hover:text-blue-400">Home</a></li>
                <li><a href="#features" className="hover:text-blue-400">Features</a></li>
                <li><a href="#contact" className="hover:text-blue-400">Contact us</a></li>
            </ul>
            <button className="border border-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600">Get Started</button>
        </nav>
    )
}

export default index
