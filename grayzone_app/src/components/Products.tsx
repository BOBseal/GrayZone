import Link from 'next/link'
import React from 'react'

const Products = () => {
  return (
    <div className='absolute w-[18rem] top-[3rem] z-50 bg-gradient-to-br to-[#b67ef5] from-[#1D023C] from-10% to-85% rounded-lg'>
        <div className='flex flex-col justify-center items-center gap-2 p-4'>
            <Link href={'/dashboard'}><p>DASHBOARD</p></Link>
            <Link href={'/zonecloud'}><p>D-CLOUD</p></Link>
            <Link href={'/erc20tools'}><p>ERC20 TOOLS</p></Link>
            <Link href={'/zonecloud'}><p>ERC721 TOOLS</p></Link>
            <Link href={'/zonecloud'}><p>ERC1155 TOOLS</p></Link>
            <Link href={'/zonepay'}><p>AUTOPAY</p></Link>
            <Link href={'/lending'}><p>LENDING/BORROWING</p></Link>
            <Link href={'/dex'}><p>DEX</p></Link>
            <Link href={'/marketplace'}><p>NFT MARKETPLACE</p></Link>
        </div>
    </div>
  )
}

export default Products