import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import './App.css';
import viteLogo from '/suiza-meta.png';

function App() {
    const wallet = useWallet();
    return (
        <>
            <div>
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </div>
            <h1>Suiza</h1>
            <ConnectButton
                style={
                    wallet.account
                        ? {
                              color: 'white',
                              width: '100%',
                          }
                        : {
                              backgroundColor: 'transparent',
                              width: '100%',
                          }
                }
                children={
                    <button className="w-full border-zinc-800  bg-transparent hover:bg-zinc-800 hover:text-white text-zinc-300">
                        Connect wallet
                    </button>
                }
            />
        </>
    );
}

export default App;
