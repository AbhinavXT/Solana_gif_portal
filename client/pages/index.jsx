import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

import idl from '../utils/idl.json'
import kp from '../utils/keypair.json'

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { Program, Provider, web3 } from '@project-serum/anchor'

const Home = () => {
	const [currentAccount, setCurrentAccount] = useState('')
	const [inputValue, setInputValue] = useState('')
	const [gifList, setGifList] = useState([])

	const { SystemProgram, Keypair } = web3

	console.log(idl.metadata)
	const programID = new PublicKey(idl.metadata.address)

	const network = clusterApiUrl('devnet')

	const opts = {
		preflightCommitment: 'processed',
	}

	const arr = Object.values(kp._keypair.secretKey)
	const secret = new Uint8Array(arr)
	const baseAccount = web3.Keypair.fromSecretKey(secret)

	const handleChange = useCallback(
		(e) => {
			setInputValue(e.target.value)
		},
		[setInputValue]
	)

	const sendGif = async () => {
		if (inputValue.length === 0) {
			console.log('No gif link given!')
			return
		}
		setInputValue('')
		console.log('Gif link:', inputValue)
		try {
			const provider = getProvider()
			const program = new Program(idl, programID, provider)

			await program.rpc.addGif(inputValue, {
				accounts: {
					baseAccount: baseAccount.publicKey,
					user: provider.wallet.publicKey,
				},
			})
			console.log('GIF successfully sent to program', inputValue)

			await getGifList()
		} catch (error) {
			console.log('Error sending GIF:', error)
		}
	}

	const getProvider = () => {
		const connection = new Connection(network, opts.preflightCommitment)
		const provider = new Provider(
			connection,
			window.solana,
			opts.preflightCommitment
		)
		return provider
	}

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

	const getGifList = async () => {
		try {
			const provider = getProvider()
			const program = new Program(idl, programID, provider)
			const account = await program.account.baseAccount.fetch(
				baseAccount.publicKey
			)

			console.log('Got the account', account)
			console.log(account.gifList)
			setGifList(account.gifList)
		} catch (error) {
			console.log('Error in getGifList: ', error)
			setGifList(null)
		}
	}

	const createGifAccount = async () => {
		try {
			const provider = getProvider()
			const program = new Program(idl, programID, provider)
			console.log('ping')
			await program.rpc.startStuffOff({
				accounts: {
					baseAccount: baseAccount.publicKey,
					user: provider.wallet.publicKey,
					systemProgram: SystemProgram.programId,
				},
				signers: [baseAccount],
			})
			console.log(
				'Created a new BaseAccount w/ address:',
				baseAccount.publicKey.toString()
			)
			await getGifList()
		} catch (error) {
			console.log('Error creating BaseAccount account:', error)
		}
	}

	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected()
		}
		window.addEventListener('load', onLoad)
		return () => window.removeEventListener('load', onLoad)
	}, [])

	useEffect(() => {
		if (currentAccount) {
			console.log('Fetching GIF list...')
			getGifList()
		}
	}, [currentAccount])

	return (
		<div className='flex flex-col items-center pt-20 bg-[#0B132B] text-[#d3d3d3] min-h-screen'>
			<Head>
				<title>Cat GIFS</title>
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

			<div className='text-3xl font-bold mt-8'>Cat Portal</div>

			<div className='text-3xl font-bold mb-12 mt-12'>
				View your Cat GIF collection in the metaverse ✨
			</div>

			<div>
				{currentAccount === '' ? (
					<button
						className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
						onClick={connectWallet}
					>
						Connect Wallet
					</button>
				) : gifList === null ? (
					<button
						onClick={createGifAccount}
						className='text-2xl mt-4 text-center font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					>
						Do One-Time Initialization For GIF Program Account
					</button>
				) : (
					<div>
						<div className='flex flex-col justify-center items-center'>
							<div className='flex justify-center'>
								<div className='px-4'>
									<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
										{gifList.map((gif, i) => (
											<div key={i}>
												<img
													src={gif.gifLink}
													alt={gif}
													className='h-60 w-60'
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className='mt-12 flex flex-col gap-y-4 w-96 mx-auto'>
							<input
								type='text'
								onChange={handleChange}
								name='name'
								placeholder='GIF link'
								className='mt-12 h-12 rounded-lg px-4 shadow-md text-black shadow-[#6FFFE9] font-bold bg-[#d3d3d3] focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent'
							/>

							<button
								onClick={sendGif}
								className='text-2xl mt-4 text-center font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
							>
								Submit
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Home
