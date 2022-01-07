import { useState, useEffect } from 'react'
import Head from 'next/head'

const Home = () => {
	const [currentAccount, setCurrentAccount] = useState('')

	const checkIfWalletIsConnected = () => {
		try {
			const { solana } = window

			if (solana) {
				if (solana.isPhantom) {
					console.log('Phantom wallet found')
				} else {
					alert('Phantom wallet not found')
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const connectWallet = async () => {
		try {
			const { solana } = window

			if (solana) {
				if (solana.isPhantom) {
					const response = await solana.connect()
					console.log(response)

					setCurrentAccount(response.publicKey.toString())
				} else {
					alert('Phantom wallet not found')
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected()
		}
		window.addEventListener('load', onLoad)
		return () => window.removeEventListener('load', onLoad)
	}, [])

	return (
		<div className='flex flex-col items-center pt-32 bg-[#0B132B] text-[#d3d3d3] min-h-screen'>
			<Head>
				<title>Solana dapp</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='60'
					height='60'
					fill='currentColor'
					viewBox='0 0 16 16'
				>
					<path d='M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z' />
				</svg>
			</div>
			<div className='text-3xl font-bold mb-2 mt-12'>GIF Portal</div>
			<div className='text-3xl font-bold mb-20 mt-12'>
				View your GIF collection in the metaverse ✨
			</div>
			<div>
				{currentAccount === '' ? (
					<button
						className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
						onClick={connectWallet}
					>
						Connect Wallet
					</button>
				) : (
					<button className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'>
						Connected
					</button>
				)}
			</div>
		</div>
	)
}

export default Home
